import { Request, Response } from 'express';
import { StorageService } from '../db/storage.ts';
import { GeminiService } from '../services/gemini.ts';
import { IInterviewSession, IQuestionItem } from '../models/types.ts';

export const InterviewController = {
  /**
   * Start a new interview session
   */
  async startInterview(req: Request, res: Response): Promise<void> {
    try {
      const {
        interviewType = 'mixed',
        jobRole = 'Software Developer',
        difficulty = 'medium',
        totalQuestions = 5,
        customSkills,
      } = req.body;

      let candidateProfile = await StorageService.getProfile();
      if (customSkills && Array.isArray(customSkills) && customSkills.length > 0) {
        candidateProfile = {
          ...candidateProfile,
          skills: Array.from(new Set([...candidateProfile.skills, ...customSkills])),
        };
      }

      const sessionId = `interview_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

      // Generate the first question dynamically
      const firstQData = await GeminiService.generateQuestion({
        role: jobRole,
        type: interviewType,
        difficulty,
        questionNumber: 1,
        totalQuestions: Number(totalQuestions),
        candidateProfile,
        previousQuestions: [],
      });

      const firstQuestion: IQuestionItem = {
        id: `q_1_${Date.now()}`,
        questionNumber: 1,
        questionText: firstQData.questionText,
        category: firstQData.category,
        topic: firstQData.topic,
        expectedKeyPoints: firstQData.expectedKeyPoints,
      };

      const session: IInterviewSession = {
        id: sessionId,
        userId: candidateProfile.id,
        candidateProfile,
        interviewType,
        jobRole,
        difficulty,
        totalQuestions: Math.max(1, Number(totalQuestions)),
        currentQuestionIndex: 0,
        status: 'in_progress',
        questions: [firstQuestion],
        startedAt: new Date().toISOString(),
      };

      await StorageService.createInterview(session);

      res.status(201).json({
        success: true,
        data: {
          session,
          currentQuestion: firstQuestion,
          isAIActive: GeminiService.isAIConfigured(),
        },
      });
    } catch (err: any) {
      console.error('[InterviewController] startInterview error:', err);
      res.status(500).json({ success: false, message: err.message || 'Failed to start interview' });
    }
  },

  /**
   * Submit answer for current question and receive instant evaluation
   */
  async submitAnswer(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { answer, questionId } = req.body;

      if (!answer || typeof answer !== 'string' || !answer.trim()) {
        res.status(400).json({ success: false, message: 'Please provide an answer before submitting.' });
        return;
      }

      const session = await StorageService.getInterview(id);
      if (!session) {
        res.status(404).json({ success: false, message: 'Interview session not found.' });
        return;
      }

      const targetQIndex = session.questions.findIndex(
        (q) => q.id === questionId || (!questionId && !q.userAnswer)
      );

      if (targetQIndex === -1) {
        res.status(400).json({ success: false, message: 'Question already answered or not found.' });
        return;
      }

      const targetQuestion = session.questions[targetQIndex];

      // Evaluate answer via Gemini AI
      const feedback = await GeminiService.evaluateAnswer({
        question: targetQuestion,
        userAnswer: answer.trim(),
        candidateProfile: session.candidateProfile,
        role: session.jobRole,
        type: session.interviewType,
        difficulty: session.difficulty,
      });

      // Update question record
      targetQuestion.userAnswer = answer.trim();
      targetQuestion.answeredAt = new Date().toISOString();
      targetQuestion.feedback = feedback;

      session.questions[targetQIndex] = targetQuestion;
      session.currentQuestionIndex = targetQIndex + 1;

      await StorageService.updateInterview(id, {
        questions: session.questions,
        currentQuestionIndex: session.currentQuestionIndex,
      });

      const isCompleted = session.questions.length >= session.totalQuestions && !feedback.isFollowUpTriggered;

      res.json({
        success: true,
        data: {
          feedback,
          question: targetQuestion,
          isFollowUpTriggered: feedback.isFollowUpTriggered,
          followUpReason: feedback.followUpReason,
          isCompleted,
        },
      });
    } catch (err: any) {
      console.error('[InterviewController] submitAnswer error:', err);
      res.status(500).json({ success: false, message: err.message || 'Failed to submit answer' });
    }
  },

  /**
   * Request next question (either follow-up or regular next question)
   */
  async nextQuestion(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { triggerFollowUp = false } = req.body;

      const session = await StorageService.getInterview(id);
      if (!session) {
        res.status(404).json({ success: false, message: 'Interview session not found.' });
        return;
      }

      const answeredQuestions = session.questions.filter((q) => q.userAnswer && q.feedback);
      const lastQuestion = answeredQuestions[answeredQuestions.length - 1];

      // If user has answered all required questions and no follow-up is requested
      if (session.questions.length >= session.totalQuestions && !triggerFollowUp) {
        res.json({
          success: true,
          data: {
            isFinished: true,
            message: 'All questions have been completed. Ready to generate final report.',
          },
        });
        return;
      }

      let newQuestion: IQuestionItem;

      if (triggerFollowUp && lastQuestion && lastQuestion.feedback) {
        // Generate follow up question
        const followUpData = await GeminiService.generateFollowUpQuestion({
          parentQuestion: lastQuestion,
          userAnswer: lastQuestion.userAnswer || '',
          feedback: lastQuestion.feedback,
          role: session.jobRole,
          candidateProfile: session.candidateProfile,
        });

        newQuestion = {
          id: `q_fu_${Date.now()}`,
          questionNumber: session.questions.length + 1,
          questionText: followUpData.questionText,
          category: lastQuestion.category,
          topic: followUpData.topic,
          expectedKeyPoints: followUpData.expectedKeyPoints,
          isFollowUp: true,
          parentQuestionId: lastQuestion.id,
        };
      } else {
        // Generate standard next question
        const nextQData = await GeminiService.generateQuestion({
          role: session.jobRole,
          type: session.interviewType,
          difficulty: session.difficulty,
          questionNumber: session.questions.length + 1,
          totalQuestions: session.totalQuestions,
          candidateProfile: session.candidateProfile,
          previousQuestions: session.questions,
        });

        newQuestion = {
          id: `q_${session.questions.length + 1}_${Date.now()}`,
          questionNumber: session.questions.length + 1,
          questionText: nextQData.questionText,
          category: nextQData.category,
          topic: nextQData.topic,
          expectedKeyPoints: nextQData.expectedKeyPoints,
        };
      }

      session.questions.push(newQuestion);
      await StorageService.updateInterview(id, { questions: session.questions });

      res.json({
        success: true,
        data: {
          question: newQuestion,
          isFollowUp: !!newQuestion.isFollowUp,
          currentQuestionIndex: session.questions.length - 1,
          totalQuestions: session.totalQuestions,
        },
      });
    } catch (err: any) {
      console.error('[InterviewController] nextQuestion error:', err);
      res.status(500).json({ success: false, message: err.message || 'Failed to generate next question' });
    }
  },

  /**
   * Request a hint for the current question
   */
  async requestHint(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { questionId } = req.body;

      const session = await StorageService.getInterview(id);
      if (!session) {
        res.status(404).json({ success: false, message: 'Interview session not found.' });
        return;
      }

      const question = session.questions.find((q) => q.id === questionId) || session.questions[session.questions.length - 1];
      if (!question) {
        res.status(404).json({ success: false, message: 'Question not found.' });
        return;
      }

      const hint = await GeminiService.generateHint(question);
      res.json({ success: true, data: { hint } });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message || 'Failed to generate hint' });
    }
  },

  /**
   * Complete interview and generate final comprehensive report
   */
  async finishInterview(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const session = await StorageService.getInterview(id);
      if (!session) {
        res.status(404).json({ success: false, message: 'Interview session not found.' });
        return;
      }

      // If already finalized, return cached final report
      if (session.status === 'completed' && session.finalReport) {
        res.json({ success: true, data: { session, report: session.finalReport } });
        return;
      }

      // Generate report
      const finalReport = await GeminiService.generateFinalReport(session);

      session.status = 'completed';
      session.completedAt = new Date().toISOString();
      session.finalReport = finalReport;

      await StorageService.updateInterview(id, {
        status: 'completed',
        completedAt: session.completedAt,
        finalReport,
      });

      res.json({
        success: true,
        data: {
          session,
          report: finalReport,
        },
      });
    } catch (err: any) {
      console.error('[InterviewController] finishInterview error:', err);
      res.status(500).json({ success: false, message: err.message || 'Failed to complete interview' });
    }
  },

  /**
   * Get single interview session details
   */
  async getInterview(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const session = await StorageService.getInterview(id);
      if (!session) {
        res.status(404).json({ success: false, message: 'Interview session not found.' });
        return;
      }
      res.json({ success: true, data: session });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message || 'Failed to fetch interview' });
    }
  },

  /**
   * List interview sessions for history
   */
  async listInterviews(_req: Request, res: Response): Promise<void> {
    try {
      const interviews = await StorageService.listInterviews();
      res.json({ success: true, data: interviews });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message || 'Failed to list interviews' });
    }
  },

  /**
   * Delete an interview session
   */
  async deleteInterview(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await StorageService.deleteInterview(id);
      res.json({ success: true, message: 'Interview deleted successfully.' });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message || 'Failed to delete interview' });
    }
  },
};
