import { GoogleGenAI } from '@google/genai';
import {
  IUserProfile,
  JobRole,
  InterviewType,
  DifficultyLevel,
  IQuestionItem,
  IAnswerFeedback,
  IFinalReport,
  IInterviewSession,
} from '../models/types.ts';
import { getDynamicQuestionFromBank, QUESTION_BANK } from './questionBank.ts';

// Initialize Gemini Client
const apiKey = process.env.GEMINI_API_KEY || '';
let aiClient: GoogleGenAI | null = null;

if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
  try {
    aiClient = new GoogleGenAI({ apiKey });
  } catch (err) {
    console.warn('[Gemini AI] Failed to initialize GoogleGenAI client:', err);
  }
}

const MODEL_NAME = 'gemini-2.5-flash';

// Helper to safely parse JSON from AI response
function cleanAndParseJSON<T>(rawText: string, fallback: T): T {
  try {
    let cleaned = rawText.trim();
    // Remove markdown code fences if present
    if (cleaned.startsWith('```')) {
      cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/, '');
    }
    return JSON.parse(cleaned) as T;
  } catch (e) {
    console.warn('[Gemini AI] JSON parse error, using fallback:', e);
    return fallback;
  }
}

export const GeminiService = {
  isAIConfigured(): boolean {
    return !!aiClient && !!process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY';
  },

  /**
   * Dynamically generate next interview question
   */
  async generateQuestion(params: {
    role: JobRole;
    type: InterviewType;
    difficulty: DifficultyLevel;
    questionNumber: number;
    totalQuestions: number;
    candidateProfile: IUserProfile;
    previousQuestions: IQuestionItem[];
  }): Promise<{
    questionText: string;
    category: 'Technical' | 'HR' | 'Behavioral' | 'System Design' | 'DSA' | 'Problem Solving';
    topic: string;
    expectedKeyPoints: string[];
  }> {
    const { role, type, difficulty, questionNumber, totalQuestions, candidateProfile, previousQuestions } = params;

    if (!aiClient) {
      const usedIds = previousQuestions.map((q) => q.id);
      const bankItem = getDynamicQuestionFromBank(role, type, difficulty, usedIds);
      return {
        questionText: bankItem.questionText,
        category: bankItem.category,
        topic: bankItem.topic,
        expectedKeyPoints: bankItem.expectedKeyPoints,
      };
    }

    try {
      const isFirst = questionNumber === 1;
      const prevContext = previousQuestions
        .slice(-3)
        .map((q, i) => `Q${i + 1} (${q.topic}): ${q.questionText} -> Score: ${q.feedback?.score ?? 'N/A'}`)
        .join('\n');

      const systemInstruction = `You are a Principal Engineering and HR Interviewer at a leading global tech company.
Your goal is to conduct a realistic, encouraging, yet rigorous interview for a college student/job seeker.
Target Role: ${role}
Interview Track: ${type.toUpperCase()}
Difficulty: ${difficulty.toUpperCase()}
Question Number: ${questionNumber} of ${totalQuestions}
Candidate Name: ${candidateProfile.name}
College/Department: ${candidateProfile.college}, ${candidateProfile.department}
Skills: ${candidateProfile.skills.join(', ')}
Experience: ${candidateProfile.experienceLevel}

${prevContext ? `Recent Previous Questions:\n${prevContext}\nDo NOT repeat or closely re-ask these topics.` : ''}

Generate the NEXT interview question.
- If Question 1 and interview is HR or Mixed, start with a welcoming yet thoughtful introduction or background question.
- If Technical, select high-impact core topics (DSA, System Architecture, Databases, Concurrency, OOP, Web/AI depending on role).
- Calibrate appropriately to ${difficulty} difficulty.

Respond ONLY with valid JSON in this exact structure:
{
  "questionText": "The actual question formulated naturally and professionally",
  "category": "Technical" | "HR" | "Behavioral" | "System Design" | "DSA" | "Problem Solving",
  "topic": "Concise topic title, e.g. 'Binary Search Tree Balancing'",
  "expectedKeyPoints": ["Point 1", "Point 2", "Point 3", "Point 4"]
}`;

      const response = await aiClient.models.generateContent({
        model: MODEL_NAME,
        contents: [
          {
            role: 'user',
            parts: [{ text: `Generate question ${questionNumber} for ${candidateProfile.name} applying for ${role}.` }],
          },
        ],
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          temperature: 0.7,
        },
      });

      const parsed = cleanAndParseJSON(response.text || '', null as any);
      if (parsed && parsed.questionText && parsed.category) {
        return parsed;
      }
    } catch (error) {
      console.warn('[Gemini AI] generateQuestion call failed, falling back to bank:', error);
    }

    // Fallback to bank
    const usedIds = previousQuestions.map((q) => q.id);
    const bankItem = getDynamicQuestionFromBank(role, type, difficulty, usedIds);
    return {
      questionText: bankItem.questionText,
      category: bankItem.category,
      topic: bankItem.topic,
      expectedKeyPoints: bankItem.expectedKeyPoints,
    };
  },

  /**
   * In-depth evaluation of user answer
   */
  async evaluateAnswer(params: {
    question: IQuestionItem;
    userAnswer: string;
    candidateProfile: IUserProfile;
    role: JobRole;
    type: InterviewType;
    difficulty: DifficultyLevel;
  }): Promise<IAnswerFeedback> {
    const { question, userAnswer, candidateProfile, role, difficulty } = params;

    // Default heuristic fallback in case of AI outage
    const wordCount = userAnswer.trim().split(/\s+/).filter(Boolean).length;
    let baseScore = Math.min(9.2, Math.max(3.0, 5.0 + wordCount * 0.05));
    if (wordCount < 10) baseScore = 3.5;
    if (wordCount > 60) baseScore = Math.min(9.5, baseScore + 1.2);

    const fallbackFeedback: IAnswerFeedback = {
      score: parseFloat(baseScore.toFixed(1)),
      scoreBreakdown: {
        relevance: parseFloat((baseScore * 0.95).toFixed(1)),
        correctness: parseFloat((baseScore * 0.98).toFixed(1)),
        completeness: parseFloat((baseScore * 0.92).toFixed(1)),
        clarity: parseFloat((baseScore * 0.96).toFixed(1)),
        communication: parseFloat((baseScore * 0.94).toFixed(1)),
        confidence: parseFloat((baseScore * 0.90).toFixed(1)),
        technicalAccuracy: parseFloat((baseScore * 0.95).toFixed(1)),
        overallScore: parseFloat(baseScore.toFixed(1)),
      },
      whatWasGood: 'You addressed the core intent of the question and demonstrated logical reasoning.',
      whatIsMissing: 'Could provide deeper concrete examples or quantify technical tradeoffs.',
      whatShouldBeImproved: 'Structure your explanation using clear bullet points or the STAR method for behavioral answers.',
      strongerAnswerExample: `A senior candidate would articulate the core principles clearly, acknowledge edge cases, and reference real-world system architectural choices.`,
      recommendedTopics: [question.topic, 'System trade-offs', 'Effective interview articulation'],
      isFollowUpTriggered: wordCount > 25 && Math.random() > 0.5,
      followUpReason: 'The candidate introduced an interesting technical concept that merits a quick probe.',
    };

    if (!aiClient) {
      return fallbackFeedback;
    }

    try {
      const prompt = `You are a Senior Technical and HR Evaluator at Google.
Evaluate the candidate's answer to the interview question below with constructive, educational, and high-standard feedback.

INTERVIEW DETAILS:
Role: ${role}
Difficulty: ${difficulty}
Candidate: ${candidateProfile.name} (${candidateProfile.experienceLevel})
Category: ${question.category}
Topic: ${question.topic}

QUESTION ASKED:
"${question.questionText}"

EXPECTED KEY POINTS:
${(question.expectedKeyPoints || []).map((p) => `- ${p}`).join('\n')}

CANDIDATE ANSWER:
"${userAnswer}"

EVALUATION CRITERIA:
Score each of the following from 0.0 to 10.0 (be fair: giving a 10 requires perfection, a vague or trivial answer gets 3-5, a solid accurate answer gets 7-8.5, an exceptional answer gets 9-10):
1. relevance (0-10)
2. correctness (0-10)
3. completeness (0-10)
4. clarity (0-10)
5. communication (0-10)
6. confidence (confidence indicators from text, structure, tone 0-10)
7. technicalAccuracy (0-10)
8. overallScore (0-10 weighted average)

FOLLOW-UP TRIGGER CRITERION:
Determine if a follow-up question is warranted:
Set isFollowUpTriggered = true IF:
- The candidate gave an incomplete answer but touched on a key concept
- OR they mentioned a specific technology/term that should be probed deeper
- OR they made a bold claim that requires technical justification.
If triggered, provide a concise followUpReason.

Respond ONLY with valid JSON in this exact structure:
{
  "score": 8.5,
  "scoreBreakdown": {
    "relevance": 8.5,
    "correctness": 8.5,
    "completeness": 8.0,
    "clarity": 8.5,
    "communication": 8.5,
    "confidence": 8.0,
    "technicalAccuracy": 8.5,
    "overallScore": 8.5
  },
  "whatWasGood": "1-3 sentences highlighting exact strengths and good points in the answer",
  "whatIsMissing": "1-2 sentences on critical gaps, missed edge cases, or omitted concepts",
  "whatShouldBeImproved": "Actionable, direct advice on how to upgrade the delivery or technical depth",
  "strongerAnswerExample": "A complete, high-caliber model answer that an exemplary SDE/applicant would give",
  "recommendedTopics": ["Topic 1", "Topic 2", "Topic 3"],
  "isFollowUpTriggered": false,
  "followUpReason": "Reason for follow up if triggered"
}`;

      const response = await aiClient.models.generateContent({
        model: MODEL_NAME,
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        config: {
          responseMimeType: 'application/json',
          temperature: 0.4,
        },
      });

      const parsed = cleanAndParseJSON<IAnswerFeedback>(response.text || '', fallbackFeedback);
      if (parsed && typeof parsed.score === 'number' && parsed.scoreBreakdown) {
        return parsed;
      }
    } catch (err) {
      console.warn('[Gemini AI] evaluateAnswer failed, using fallback:', err);
    }

    return fallbackFeedback;
  },

  /**
   * Generate an intelligent follow-up question
   */
  async generateFollowUpQuestion(params: {
    parentQuestion: IQuestionItem;
    userAnswer: string;
    feedback: IAnswerFeedback;
    role: JobRole;
    candidateProfile: IUserProfile;
  }): Promise<{
    questionText: string;
    topic: string;
    expectedKeyPoints: string[];
  }> {
    const { parentQuestion, userAnswer, feedback, role, candidateProfile } = params;

    const fallback = {
      questionText: `Building on your point regarding ${parentQuestion.topic}: How would your approach change if the system needed to scale to handle 100x the load or stricter latency bounds?`,
      topic: `${parentQuestion.topic} (Follow-Up)`,
      expectedKeyPoints: ['Scalability considerations', 'Bottleneck identification', 'Trade-offs'],
    };

    if (!aiClient) return fallback;

    try {
      const prompt = `You are the interviewer conducting a technical/HR interview with ${candidateProfile.name} for ${role}.
The candidate just answered:
Original Question: "${parentQuestion.questionText}"
Candidate's Answer: "${userAnswer}"
Evaluation note: ${feedback.followUpReason || feedback.whatIsMissing}

Generate an organic, direct FOLLOW-UP QUESTION probing deeper into what they just said.
Make it sound conversational, like an interviewer asking in real-time ("You mentioned X earlier...", or "How would you handle the edge case where Y happens?").

Respond ONLY in JSON:
{
  "questionText": "The conversational follow up question",
  "topic": "Concise topic, e.g. 'Handling Concurrent State in Redis'",
  "expectedKeyPoints": ["Point 1", "Point 2"]
}`;

      const response = await aiClient.models.generateContent({
        model: MODEL_NAME,
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        config: {
          responseMimeType: 'application/json',
          temperature: 0.6,
        },
      });

      const parsed = cleanAndParseJSON(response.text || '', fallback);
      return parsed;
    } catch (err) {
      console.warn('[Gemini AI] generateFollowUpQuestion failed:', err);
      return fallback;
    }
  },

  /**
   * Generate comprehensive final interview report
   */
  async generateFinalReport(session: IInterviewSession): Promise<IFinalReport> {
    const { questions, candidateProfile, jobRole, difficulty, interviewType } = session;

    // Calculate aggregated scores
    const answeredQuestions = questions.filter((q) => q.feedback);
    const count = Math.max(1, answeredQuestions.length);

    let avgOverall = 0;
    let avgTech = 0;
    let avgComm = 0;
    let avgRelevance = 0;
    let avgCompleteness = 0;

    let techCount = 0;

    for (const q of answeredQuestions) {
      const fb = q.feedback!;
      avgOverall += fb.score;
      avgComm += fb.scoreBreakdown.communication;
      avgRelevance += fb.scoreBreakdown.relevance;
      avgCompleteness += fb.scoreBreakdown.completeness;

      if (q.category !== 'HR') {
        avgTech += fb.scoreBreakdown.technicalAccuracy;
        techCount++;
      }
    }

    const overallPct = Math.min(100, Math.round((avgOverall / count) * 10));
    const commPct = Math.min(100, Math.round((avgComm / count) * 10));
    const relPct = Math.min(100, Math.round((avgRelevance / count) * 10));
    const compPct = Math.min(100, Math.round((avgCompleteness / count) * 10));
    const techPct = techCount > 0 ? Math.min(100, Math.round((avgTech / techCount) * 10)) : commPct;

    let verdict: IFinalReport['readinessVerdict'] = 'Ready for Real Interviews';
    if (overallPct < 60) verdict = 'Foundational Review Needed';
    else if (overallPct < 75) verdict = 'Needs More Practice';
    else if (overallPct < 85) verdict = 'Almost Ready (Minor Polish)';

    const fallbackReport: IFinalReport = {
      overallScore: overallPct,
      technicalScore: techPct,
      communicationScore: commPct,
      relevanceScore: relPct,
      completenessScore: compPct,
      strengths: [
        'Demonstrated good grasp of problem structure and logical clarity',
        'Structured responses clearly with confident pacing',
        'Showcased genuine interest in software engineering best practices',
      ],
      weakAreas: [
        'Could incorporate more quantifiable project outcomes and metrics',
        'Remember to address edge cases and system boundaries proactively',
      ],
      correctlyAnsweredSummary: answeredQuestions
        .filter((q) => (q.feedback?.score || 0) >= 7.5)
        .map((q) => `${q.topic}: ${q.feedback?.whatWasGood.slice(0, 100)}...`),
      needsImprovementSummary: answeredQuestions
        .filter((q) => (q.feedback?.score || 0) < 7.5)
        .map((q) => `${q.topic}: ${q.feedback?.whatShouldBeImproved.slice(0, 100)}...`),
      recommendedTopics: [
        'Data Structures & Algorithm optimization',
        'STAR method for behavioral questions',
        'System trade-offs and performance tuning',
      ],
      personalizedLearningPlan: [
        {
          title: 'Deepen Core DSA Fundamentals',
          description: 'Focus on medium-difficulty graph and tree problems with time and space complexity explanations.',
          resourceOrAction: 'Practice 2 problems daily on LeetCode/NeetCode 150 with clean variable naming.',
        },
        {
          title: 'Refine STAR Behavioral Delivery',
          description: 'Prepare concise 90-second stories highlighting personal impact and conflict resolution.',
          resourceOrAction: 'Write down bullet-point stories for 5 common HR behavioral questions.',
        },
      ],
      readinessVerdict: verdict,
      summaryParagraph: `${candidateProfile.name} completed the ${jobRole} interview (${difficulty} level). Overall performance earned a score of ${overallPct}/100, demonstrating strong potential. With targeted polish on edge cases and metrics, the candidate is well-positioned for placement rounds.`,
    };

    if (!aiClient) return fallbackReport;

    try {
      const summaryContext = answeredQuestions
        .map(
          (q, i) =>
            `Q${i + 1} [${q.category} - ${q.topic}]: "${q.questionText}"\nCandidate: "${q.userAnswer}"\nScore: ${q.feedback?.score}/10 | Good: ${q.feedback?.whatWasGood} | Improve: ${q.feedback?.whatShouldBeImproved}`
        )
        .join('\n\n');

      const prompt = `You are the Lead Hiring Committee Chair preparing the official Final Interview Evaluation Report for:
Candidate: ${candidateProfile.name}
College: ${candidateProfile.college}
Role: ${jobRole}
Type: ${interviewType}
Difficulty: ${difficulty}

INTERVIEW TRANSCRIPT & QUESTION EVALUATIONS:
${summaryContext}

Generate a comprehensive, encouraging, and detailed final performance report.
Overall score calculated: ${overallPct}/100
Technical score: ${techPct}/100
Communication score: ${commPct}/100

Respond ONLY with valid JSON in this exact structure:
{
  "overallScore": ${overallPct},
  "technicalScore": ${techPct},
  "communicationScore": ${commPct},
  "relevanceScore": ${relPct},
  "completenessScore": ${compPct},
  "strengths": ["Strength 1", "Strength 2", "Strength 3"],
  "weakAreas": ["Weak area 1", "Weak area 2"],
  "correctlyAnsweredSummary": ["Summary of question/topic answered well 1", "Summary 2"],
  "needsImprovementSummary": ["Summary of topic needing work 1", "Summary 2"],
  "recommendedTopics": ["Topic 1", "Topic 2", "Topic 3", "Topic 4"],
  "personalizedLearningPlan": [
    {
      "title": "Actionable Goal 1",
      "description": "Why and what to study",
      "resourceOrAction": "Specific book, topic, or practice regime"
    },
    {
      "title": "Actionable Goal 2",
      "description": "Why and what to study",
      "resourceOrAction": "Specific book, topic, or practice regime"
    },
    {
      "title": "Actionable Goal 3",
      "description": "Why and what to study",
      "resourceOrAction": "Specific book, topic, or practice regime"
    }
  ],
  "readinessVerdict": "${verdict}",
  "summaryParagraph": "A 3-4 sentence professional executive summary evaluating readiness, trajectory, and key recommendation."
}`;

      const response = await aiClient.models.generateContent({
        model: MODEL_NAME,
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        config: {
          responseMimeType: 'application/json',
          temperature: 0.5,
        },
      });

      const parsed = cleanAndParseJSON<IFinalReport>(response.text || '', fallbackReport);
      return parsed;
    } catch (err) {
      console.warn('[Gemini AI] generateFinalReport failed, using calculated fallback:', err);
      return fallbackReport;
    }
  },

  /**
   * Hint / Clarification generator
   */
  async generateHint(question: IQuestionItem): Promise<string> {
    if (!aiClient) {
      return `Hint: Focus on the core definition of ${question.topic}. Think about the trade-offs between memory, time complexity, and how it behaves under load.`;
    }

    try {
      const prompt = `The candidate is in an interview and asked for a gentle hint for this question:
"${question.questionText}"
Category: ${question.category} - ${question.topic}

Provide a short (1-2 sentences) encouraging hint that guides their thought process without giving away the complete solution or answer.`;

      const response = await aiClient.models.generateContent({
        model: MODEL_NAME,
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        config: { temperature: 0.7 },
      });

      return (
        response.text?.trim() ||
        `Think about the key data structure or real-world analogy behind ${question.topic}. Break the problem into inputs, core transformation, and outputs.`
      );
    } catch (e) {
      return `Think about the foundational concepts of ${question.topic}. Outline your thoughts step-by-step.`;
    }
  },
};
