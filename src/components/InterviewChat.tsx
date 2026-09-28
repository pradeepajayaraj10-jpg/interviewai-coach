import React, { useState, useEffect, useRef } from 'react';
import {
  Bot,
  User,
  Sparkles,
  Send,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Lightbulb,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  Clock,
  ChevronDown,
  ChevronUp,
  Award,
  BookOpen,
  CornerDownRight,
  LogOut,
  RefreshCw,
} from 'lucide-react';
import {
  IInterviewSession,
  IQuestionItem,
  IAnswerFeedback,
} from '../types/interview.ts';

interface InterviewChatProps {
  session: IInterviewSession;
  onSubmitAnswer: (params: { answer: string; questionId: string }) => Promise<{
    feedback: IAnswerFeedback;
    question: IQuestionItem;
    isFollowUpTriggered: boolean;
    followUpReason?: string;
    isCompleted: boolean;
  }>;
  onNextQuestion: (triggerFollowUp?: boolean) => Promise<{
    question?: IQuestionItem;
    isFollowUp?: boolean;
    isFinished?: boolean;
  }>;
  onRequestHint: (questionId: string) => Promise<string>;
  onFinishInterview: () => Promise<void>;
  onExitSession: () => void;
}

export const InterviewChat: React.FC<InterviewChatProps> = ({
  session,
  onSubmitAnswer,
  onNextQuestion,
  onRequestHint,
  onFinishInterview,
  onExitSession,
}) => {
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGeneratingNext, setIsGeneratingNext] = useState(false);
  const [activeHint, setActiveHint] = useState<string | null>(null);
  const [isLoadingHint, setIsLoadingHint] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [isFinishing, setIsFinishing] = useState(false);
  const [isVoiceRecording, setIsVoiceRecording] = useState(false);
  const [speechSynthesisActive, setSpeechSynthesisActive] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);
  const [expandedFeedbackId, setExpandedFeedbackId] = useState<string | null>(null);
  const [secondsElapsed, setSecondsElapsed] = useState(0);

  const recognitionRef = useRef<any>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Identify current active question (the first unanswered question)
  const answeredQuestions = session.questions.filter((q) => q.userAnswer && q.feedback);
  const currentQuestion = session.questions.find((q) => !q.userAnswer) || session.questions[session.questions.length - 1];
  const isCurrentQuestionAnswered = !!currentQuestion?.userAnswer;

  // Question counter calculations
  const totalTarget = session.totalQuestions;
  const answeredCount = answeredQuestions.length;
  const progressPercent = Math.min(100, Math.round((answeredCount / totalTarget) * 100));

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Format seconds to mm:ss
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Setup Web Speech recognition
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      setVoiceSupported(true);
      const recognizer = new SpeechRecognition();
      recognizer.continuous = true;
      recognizer.interimResults = true;
      recognizer.lang = 'en-US';

      recognizer.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setCurrentAnswer((prev) => {
          const base = prev.trim();
          return base ? `${base} ${transcript.trim()}` : transcript.trim();
        });
      };

      recognizer.onerror = (e: any) => {
        console.warn('Speech recognition error:', e);
        setIsVoiceRecording(false);
      };

      recognizer.onend = () => {
        setIsVoiceRecording(false);
      };

      recognitionRef.current = recognizer;
    }
  }, []);

  // Scroll to bottom on question change or answers
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [session.questions.length, currentQuestion?.userAnswer, isSubmitting]);

  // Read question text aloud using browser SpeechSynthesis
  const speakQuestion = (text: string) => {
    if (!('speechSynthesis' in window)) return;

    if (speechSynthesisActive) {
      window.speechSynthesis.cancel();
      setSpeechSynthesisActive(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.onend = () => setSpeechSynthesisActive(false);
    utterance.onerror = () => setSpeechSynthesisActive(false);
    setSpeechSynthesisActive(true);
    window.speechSynthesis.speak(utterance);
  };

  // Toggle voice recognition
  const toggleVoiceInput = () => {
    if (!recognitionRef.current) return;
    if (isVoiceRecording) {
      recognitionRef.current.stop();
      setIsVoiceRecording(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsVoiceRecording(true);
      } catch (e) {
        console.warn('Voice recognition start failed:', e);
      }
    }
  };

  // Submit current answer
  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!currentAnswer.trim() || isSubmitting || !currentQuestion) return;

    if (isVoiceRecording && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsVoiceRecording(false);
    }

    try {
      setIsSubmitting(true);
      setActiveHint(null);
      const res = await onSubmitAnswer({
        answer: currentAnswer.trim(),
        questionId: currentQuestion.id,
      });

      setCurrentAnswer('');
      setExpandedFeedbackId(currentQuestion.id);

      // If finished all questions and no follow-up
      if (res.isCompleted) {
        // Ready to finalize
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Proceed to next question or follow up
  const handleProceedNext = async (triggerFollowUp = false) => {
    try {
      setIsGeneratingNext(true);
      setActiveHint(null);
      const res = await onNextQuestion(triggerFollowUp);
      if (res.isFinished) {
        await handleFinish();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingNext(false);
    }
  };

  // Request hint
  const handleFetchHint = async () => {
    if (!currentQuestion || isLoadingHint) return;
    try {
      setIsLoadingHint(true);
      const hint = await onRequestHint(currentQuestion.id);
      setActiveHint(hint);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingHint(false);
    }
  };

  // Complete interview
  const handleFinish = async () => {
    try {
      setIsFinishing(true);
      await onFinishInterview();
    } catch (err) {
      console.error(err);
    } finally {
      setIsFinishing(false);
    }
  };

  // Helper score color
  const getScoreColor = (score: number) => {
    if (score >= 8.5) return 'bg-emerald-600 text-white';
    if (score >= 7.0) return 'bg-indigo-600 text-white';
    if (score >= 5.5) return 'bg-amber-600 text-white';
    return 'bg-rose-600 text-white';
  };

  const wordCount = currentAnswer.trim().split(/\s+/).filter(Boolean).length;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-100 flex flex-col text-slate-800">
      {/* Top Session Progress Bar */}
      <div className="bg-white border-b border-slate-200/90 px-4 sm:px-6 py-3 sticky top-16 z-30 shadow-xs">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          {/* Metadata badges */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-extrabold text-slate-900 text-sm tracking-tight">
              {session.jobRole}
            </span>
            <span className="px-2 py-0.5 rounded-md bg-indigo-50 border border-indigo-200 text-indigo-700 font-bold uppercase text-[10px]">
              {session.interviewType}
            </span>
            <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] uppercase ${
              session.difficulty === 'hard'
                ? 'bg-rose-50 text-rose-700 border border-rose-200'
                : session.difficulty === 'medium'
                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
            }`}>
              {session.difficulty}
            </span>

            <div className="flex items-center gap-1 text-slate-500 font-medium ml-2">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>{formatTime(secondsElapsed)}</span>
            </div>
          </div>

          {/* Progress Indicator & End Session CTA */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-600">
                Question <strong className="text-slate-900">{Math.min(session.questions.length, totalTarget)}</strong> of{' '}
                <strong className="text-slate-900">{totalTarget}</strong>
              </span>
              <div className="w-24 sm:w-32 h-2 rounded-full bg-slate-200 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <span className="font-bold text-slate-700 text-[11px]">{progressPercent}%</span>
            </div>

            <button
              onClick={() => setShowExitConfirm(true)}
              className="px-2.5 py-1 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg border border-slate-200 text-xs font-semibold flex items-center gap-1 transition-colors"
            >
              <LogOut className="w-3 h-3" />
              <span>End</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Chat Stream Area */}
      <div className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 space-y-6">
        {/* Render question & answer cards */}
        {session.questions.map((q, index) => {
          const isAnswered = !!q.userAnswer && !!q.feedback;
          const isExpanded = expandedFeedbackId === q.id || (isAnswered && index === session.questions.length - 1);

          return (
            <div key={q.id} className="space-y-4 animate-in fade-in duration-300">
              {/* Question Card (Interviewer) */}
              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center font-bold shrink-0 shadow-md shadow-indigo-500/20">
                  <Bot className="w-5 h-5" />
                </div>

                <div className="flex-1 bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-xs">
                  {/* Question header pills */}
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2 pb-2 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-indigo-700 text-xs">
                        Question {q.questionNumber}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-700">
                        {q.category}
                      </span>
                      <span className="text-[11px] font-medium text-slate-500">
                        • {q.topic}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => speakQuestion(q.questionText)}
                        title="Read question aloud"
                        className="p-1 rounded-md text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                      >
                        {speechSynthesisActive ? (
                          <VolumeX className="w-4 h-4 text-indigo-600 animate-pulse" />
                        ) : (
                          <Volume2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Follow up badge if applicable */}
                  {q.isFollowUp && (
                    <div className="mb-2.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-50 border border-purple-200 text-purple-800 text-[11px] font-bold">
                      <CornerDownRight className="w-3.5 h-3.5" />
                      <span>Follow-Up Probe: Exploring your previous answer deeper</span>
                    </div>
                  )}

                  {/* Question text */}
                  <p className="text-slate-900 font-semibold text-sm sm:text-base leading-relaxed">
                    {q.questionText}
                  </p>

                  {/* Expected points (hints/guidance preview if still unanswered) */}
                  {!isAnswered && (
                    <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
                      <span className="text-slate-400 italic">
                        Tip: Structure your points clearly. Real-world examples boost scores.
                      </span>

                      <button
                        onClick={handleFetchHint}
                        disabled={isLoadingHint}
                        className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800 font-bold"
                      >
                        <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                        <span>{isLoadingHint ? 'Consulting AI...' : 'Need a Hint?'}</span>
                      </button>
                    </div>
                  )}

                  {/* Hint disclosure */}
                  {!isAnswered && activeHint && q.id === currentQuestion?.id && (
                    <div className="mt-3 p-3 bg-amber-50/80 border border-amber-200 rounded-xl text-amber-900 text-xs flex items-start gap-2 animate-in fade-in">
                      <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <strong className="block font-bold mb-0.5">Interviewer Nudge:</strong>
                        <p className="leading-relaxed">{activeHint}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* User Answer Card (if already answered) */}
              {isAnswered && (
                <div className="flex items-start gap-3.5 flex-row-reverse">
                  <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold shrink-0">
                    <User className="w-5 h-5" />
                  </div>

                  <div className="flex-1 bg-indigo-50/40 rounded-2xl border border-indigo-100 p-4 sm:p-5 shadow-xs">
                    <div className="flex items-center justify-between mb-1 text-[11px] text-slate-500">
                      <span className="font-bold text-slate-700">Your Answer</span>
                      <span>{q.answeredAt ? new Date(q.answeredAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}</span>
                    </div>
                    <p className="text-slate-800 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-normal">
                      {q.userAnswer}
                    </p>
                  </div>
                </div>
              )}

              {/* Instant Score & Evaluation Card (if answered) */}
              {isAnswered && q.feedback && (
                <div className="ml-12 bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs">
                  {/* Score headline */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center font-black ${getScoreColor(q.feedback.score)}`}>
                        <span className="text-base leading-none">{q.feedback.score}</span>
                        <span className="text-[9px] uppercase tracking-wider opacity-90">/ 10</span>
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 text-sm">
                          {q.feedback.score >= 8.5
                            ? 'Excellent Answer'
                            : q.feedback.score >= 7.0
                            ? 'Solid Performance'
                            : q.feedback.score >= 5.0
                            ? 'Partially Adequate'
                            : 'Needs Significant Work'}
                        </div>
                        <p className="text-slate-500 text-[11px]">Instant 7-Factor AI Evaluation</p>
                      </div>
                    </div>

                    <button
                      onClick={() => setExpandedFeedbackId(isExpanded ? null : q.id)}
                      className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 self-start sm:self-center"
                    >
                      <span>{isExpanded ? 'Hide Details' : 'View Full Feedback & Breakdown'}</span>
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  {/* 7-Factor Score Breakdown Badges */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3 text-center">
                    <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                      <div className="text-[10px] text-slate-500 font-medium">Relevance</div>
                      <div className="text-xs font-bold text-slate-900">{q.feedback.scoreBreakdown.relevance}/10</div>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                      <div className="text-[10px] text-slate-500 font-medium">Correctness</div>
                      <div className="text-xs font-bold text-slate-900">{q.feedback.scoreBreakdown.correctness}/10</div>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                      <div className="text-[10px] text-slate-500 font-medium">Completeness</div>
                      <div className="text-xs font-bold text-slate-900">{q.feedback.scoreBreakdown.completeness}/10</div>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                      <div className="text-[10px] text-slate-500 font-medium">Tech Accuracy</div>
                      <div className="text-xs font-bold text-slate-900">{q.feedback.scoreBreakdown.technicalAccuracy}/10</div>
                    </div>
                  </div>

                  {/* Expanded Detailed Feedback */}
                  {isExpanded && (
                    <div className="mt-4 pt-3 border-t border-slate-100 space-y-3 text-xs animate-in fade-in">
                      {/* What was good */}
                      <div className="p-3 bg-emerald-50/70 border border-emerald-200/80 rounded-xl">
                        <strong className="text-emerald-900 font-bold block mb-1 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          What Was Good:
                        </strong>
                        <p className="text-emerald-800 leading-relaxed">{q.feedback.whatWasGood}</p>
                      </div>

                      {/* What is missing */}
                      <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl">
                        <strong className="text-amber-900 font-bold block mb-1 flex items-center gap-1.5">
                          <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                          What Is Missing:
                        </strong>
                        <p className="text-amber-800 leading-relaxed">{q.feedback.whatIsMissing}</p>
                      </div>

                      {/* What should be improved */}
                      <div className="p-3 bg-indigo-50/70 border border-indigo-200/80 rounded-xl">
                        <strong className="text-indigo-900 font-bold block mb-1 flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                          Actionable Improvement:
                        </strong>
                        <p className="text-indigo-800 leading-relaxed">{q.feedback.whatShouldBeImproved}</p>
                      </div>

                      {/* Example of stronger answer */}
                      <div className="p-3.5 bg-slate-900 text-slate-200 rounded-xl">
                        <strong className="text-white font-bold block mb-1.5 flex items-center gap-1.5 text-xs">
                          <Award className="w-3.5 h-3.5 text-amber-400" />
                          Example of a Stronger Model Answer:
                        </strong>
                        <p className="text-slate-300 text-xs leading-relaxed italic">
                          "{q.feedback.strongerAnswerExample}"
                        </p>
                      </div>

                      {/* Recommended topics */}
                      {q.feedback.recommendedTopics && q.feedback.recommendedTopics.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1.5 pt-1">
                          <span className="font-semibold text-slate-500 text-[11px]">Recommended Topics:</span>
                          {q.feedback.recommendedTopics.map((topic, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium text-[11px]"
                            >
                              {topic}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Next Step Controls (If this is the most recently answered question) */}
                  {index === session.questions.length - 1 && (
                    <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                      {q.feedback.isFollowUpTriggered && session.questions.length < session.totalQuestions ? (
                        <div className="flex items-center gap-2 text-purple-700 text-xs font-semibold">
                          <CornerDownRight className="w-4 h-4 text-purple-600" />
                          <span>AI Follow-Up recommended ({q.feedback.followUpReason})</span>
                        </div>
                      ) : (
                        <span className="text-slate-500 text-xs">
                          {session.questions.length >= session.totalQuestions
                            ? 'All required questions answered!'
                            : 'Ready to proceed to next question.'}
                        </span>
                      )}

                      <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                        {/* Follow up button if triggered */}
                        {q.feedback.isFollowUpTriggered && session.questions.length < session.totalQuestions && (
                          <button
                            onClick={() => handleProceedNext(true)}
                            disabled={isGeneratingNext}
                            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                          >
                            <CornerDownRight className="w-3.5 h-3.5" />
                            <span>Take Follow-Up Probe</span>
                          </button>
                        )}

                        {/* Standard Next Question OR Complete */}
                        {session.questions.length < session.totalQuestions ? (
                          <button
                            onClick={() => handleProceedNext(false)}
                            disabled={isGeneratingNext}
                            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                          >
                            {isGeneratingNext ? (
                              <>
                                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                <span>Generating Next Question...</span>
                              </>
                            ) : (
                              <>
                                <span>Next Question</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                              </>
                            )}
                          </button>
                        ) : (
                          <button
                            onClick={handleFinish}
                            disabled={isFinishing}
                            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs flex items-center gap-2 shadow-md shadow-emerald-600/30 transition-all cursor-pointer"
                          >
                            {isFinishing ? (
                              <>
                                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                <span>Generating Final Report...</span>
                              </>
                            ) : (
                              <>
                                <CheckCircle2 className="w-4 h-4" />
                                <span>Complete & View Final Report</span>
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}

        <div ref={chatBottomRef} />
      </div>

      {/* Answer Input Panel (Shown only when current question is NOT answered yet) */}
      {!isCurrentQuestionAnswered && currentQuestion && (
        <div className="sticky bottom-0 bg-white border-t border-slate-200 px-4 sm:px-6 py-4 shadow-xl z-20">
          <div className="max-w-4xl mx-auto">
            {/* Input helpers & status */}
            <div className="flex items-center justify-between mb-2 text-xs">
              <div className="flex items-center gap-2 text-slate-500">
                <span className="font-semibold text-slate-700">Answer Question {currentQuestion.questionNumber}:</span>
                <span className="hidden sm:inline">•</span>
                <span className="hidden sm:inline">Use technical terms, complexity, or STAR examples</span>
              </div>

              <div className="flex items-center gap-3 text-[11px] text-slate-500">
                <span>
                  Words: <strong className="text-slate-800">{wordCount}</strong>
                </span>
                {isVoiceRecording && (
                  <span className="flex items-center gap-1 text-rose-600 font-bold animate-pulse">
                    <span className="w-2 h-2 rounded-full bg-rose-600"></span>
                    Listening...
                  </span>
                )}
              </div>
            </div>

            {/* Answer Textarea */}
            <div className="relative rounded-2xl border border-slate-300 focus-within:border-indigo-600 focus-within:ring-2 focus-within:ring-indigo-500/20 bg-white transition-all overflow-hidden">
              <textarea
                rows={4}
                value={currentAnswer}
                onChange={(e) => setCurrentAnswer(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                    e.preventDefault();
                    handleSubmit();
                  }
                }}
                placeholder="Type your structured answer here, or click the microphone to speak..."
                className="w-full p-3.5 outline-none resize-none text-xs sm:text-sm text-slate-900 font-medium leading-relaxed"
              />

              {/* Bottom control bar inside textarea */}
              <div className="p-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  {voiceSupported && (
                    <button
                      type="button"
                      onClick={toggleVoiceInput}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                        isVoiceRecording
                          ? 'bg-rose-600 text-white shadow-xs'
                          : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {isVoiceRecording ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                      <span>{isVoiceRecording ? 'Stop Recording' : 'Voice Input'}</span>
                    </button>
                  )}

                  <span className="text-[11px] text-slate-600 hidden sm:inline ml-2">
                    Press Ctrl+Enter to submit
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={!currentAnswer.trim() || isSubmitting}
                    className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-indigo-600/30 transition-all disabled:opacity-40 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Evaluating Answer...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Submit Answer</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal to End Interview Early */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl border border-slate-200 text-xs">
            <h3 className="font-extrabold text-base text-slate-900 mb-2">End Interview Session?</h3>
            <p className="text-slate-600 leading-relaxed mb-5">
              You have answered {answeredCount} of {totalTarget} questions. Would you like to generate the final scorecard based on answered questions, or exit to the main dashboard?
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-end gap-2">
              <button
                onClick={() => setShowExitConfirm(false)}
                className="w-full sm:w-auto px-4 py-2 rounded-lg border border-slate-200 text-slate-700 font-semibold hover:bg-slate-100"
              >
                Continue Interview
              </button>
              {answeredCount > 0 && (
                <button
                  onClick={() => {
                    setShowExitConfirm(false);
                    handleFinish();
                  }}
                  className="w-full sm:w-auto px-4 py-2 rounded-lg bg-indigo-600 text-white font-bold hover:bg-indigo-700"
                >
                  Generate Report ({answeredCount} Qs)
                </button>
              )}
              <button
                onClick={() => {
                  setShowExitConfirm(false);
                  onExitSession();
                }}
                className="w-full sm:w-auto px-4 py-2 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 font-semibold hover:bg-rose-100"
              >
                Exit Session
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
