import React, { useState } from 'react';
import {
  Award,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
  ArrowRight,
  RotateCcw,
  BarChart2,
  Printer,
  Share2,
  ChevronDown,
  ChevronUp,
  FileText,
  Sparkles,
  Layers,
  GraduationCap,
} from 'lucide-react';
import { IInterviewSession, IFinalReport } from '../types/interview.ts';

interface FinalReportViewProps {
  session: IInterviewSession;
  onRetake: () => void;
  onGoToDashboard: () => void;
}

export const FinalReportView: React.FC<FinalReportViewProps> = ({
  session,
  onRetake,
  onGoToDashboard,
}) => {
  const [filterMode, setFilterMode] = useState<'all' | 'mastered' | 'improvement'>('all');
  const [expandedQId, setExpandedQId] = useState<string | null>(null);

  const report = session.finalReport;
  if (!report) {
    return (
      <div className="max-w-3xl mx-auto p-12 text-center text-slate-500">
        <p>No report found for this session.</p>
        <button
          onClick={onGoToDashboard}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold text-xs"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  // Verdict style
  const getVerdictBadge = (verdict: IFinalReport['readinessVerdict']) => {
    switch (verdict) {
      case 'Ready for Real Interviews':
        return {
          bg: 'bg-emerald-50 text-emerald-800 border-emerald-300',
          dot: 'bg-emerald-500',
          title: 'Ready for Real Interviews',
        };
      case 'Almost Ready (Minor Polish)':
        return {
          bg: 'bg-indigo-50 text-indigo-800 border-indigo-300',
          dot: 'bg-indigo-500',
          title: 'Almost Ready (Minor Polish)',
        };
      case 'Needs More Practice':
        return {
          bg: 'bg-amber-50 text-amber-800 border-amber-300',
          dot: 'bg-amber-500',
          title: 'Needs More Practice',
        };
      default:
        return {
          bg: 'bg-rose-50 text-rose-800 border-rose-300',
          dot: 'bg-rose-500',
          title: 'Foundational Review Needed',
        };
    }
  };

  const verdictStyle = getVerdictBadge(report.readinessVerdict);

  // Filtered questions
  const questionsToDisplay = session.questions.filter((q) => {
    if (filterMode === 'mastered') return (q.feedback?.score || 0) >= 7.5;
    if (filterMode === 'improvement') return (q.feedback?.score || 0) < 7.5;
    return true;
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 text-slate-800">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header navigation bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs uppercase font-extrabold text-indigo-600 tracking-wider">
                Official Evaluation
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-xs text-slate-500">
                {new Date(session.completedAt || session.startedAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Final Interview Performance Report
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Candidate: <strong className="text-slate-900">{session.candidateProfile.name}</strong> •{' '}
              {session.jobRole} ({session.difficulty} difficulty)
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handlePrint}
              className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>
            <button
              onClick={onRetake}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-indigo-600/30 transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retake Interview</span>
            </button>
            <button
              onClick={onGoToDashboard}
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <BarChart2 className="w-3.5 h-3.5" />
              <span>Dashboard</span>
            </button>
          </div>
        </div>

        {/* Executive Scorecard Banner */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-md p-6 sm:p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center pb-8 border-b border-slate-100">
            {/* Primary Score Ring */}
            <div className="flex items-center gap-6 md:border-r md:border-slate-100 pr-6">
              <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    className="stroke-slate-100"
                    strokeWidth="9"
                    fill="transparent"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    className="stroke-indigo-600 transition-all duration-1000 ease-out"
                    strokeWidth="9"
                    strokeDasharray={251.2}
                    strokeDashoffset={251.2 - (251.2 * report.overallScore) / 100}
                    strokeLinecap="round"
                    fill="transparent"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-3xl font-black text-slate-900 leading-none">
                    {report.overallScore}
                  </span>
                  <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mt-0.5">
                    / 100
                  </span>
                </div>
              </div>

              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block mb-1">
                  Overall Readiness
                </span>
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-extrabold ${verdictStyle.bg}`}>
                  <span className={`w-2 h-2 rounded-full ${verdictStyle.dot}`}></span>
                  <span>{verdictStyle.title}</span>
                </div>
                <p className="text-[11px] text-slate-600 mt-2 font-medium">
                  Based on {session.questions.length} simulated questions
                </p>
              </div>
            </div>

            {/* Sub-Score Breakdown Cards */}
            <div className="md:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-center">
                <span className="text-[11px] font-semibold text-slate-600 block mb-1">Technical</span>
                <span className="text-xl font-black text-indigo-600">{report.technicalScore}%</span>
                <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${report.technicalScore}%` }} />
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-center">
                <span className="text-[11px] font-semibold text-slate-600 block mb-1">Communication</span>
                <span className="text-xl font-black text-purple-600">{report.communicationScore}%</span>
                <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div className="bg-purple-600 h-full rounded-full" style={{ width: `${report.communicationScore}%` }} />
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-center">
                <span className="text-[11px] font-semibold text-slate-600 block mb-1">Relevance</span>
                <span className="text-xl font-black text-emerald-600">{report.relevanceScore}%</span>
                <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${report.relevanceScore}%` }} />
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-center">
                <span className="text-[11px] font-semibold text-slate-600 block mb-1">Completeness</span>
                <span className="text-xl font-black text-amber-600">{report.completenessScore}%</span>
                <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div className="bg-amber-600 h-full rounded-full" style={{ width: `${report.completenessScore}%` }} />
                </div>
              </div>
            </div>
          </div>

          {/* Executive Summary Paragraph */}
          <div className="pt-6">
            <h3 className="font-extrabold text-sm text-slate-900 mb-2 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              Hiring Committee Evaluation Summary:
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal bg-indigo-50/40 p-4 rounded-2xl border border-indigo-100">
              {report.summaryParagraph}
            </p>
          </div>
        </div>

        {/* Strengths & Weak Areas Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Key Strengths */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
            <div className="flex items-center gap-2 mb-4 text-emerald-800">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
              <h3 className="font-extrabold text-base text-slate-900">Key Strengths Demonstrated</h3>
            </div>
            <ul className="space-y-2.5 text-xs text-slate-700">
              {report.strengths.map((s, idx) => (
                <li key={idx} className="flex items-start gap-2.5 p-2.5 rounded-xl bg-emerald-50/50 border border-emerald-100">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center shrink-0 text-[10px]">
                    ✓
                  </span>
                  <span className="leading-relaxed font-medium">{s}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Weak Areas & Areas for Improvement */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
            <div className="flex items-center gap-2 mb-4 text-amber-800">
              <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
              </div>
              <h3 className="font-extrabold text-base text-slate-900">Priority Areas to Improve</h3>
            </div>
            <ul className="space-y-2.5 text-xs text-slate-700">
              {report.weakAreas.map((w, idx) => (
                <li key={idx} className="flex items-start gap-2.5 p-2.5 rounded-xl bg-amber-50/50 border border-amber-100">
                  <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 font-bold flex items-center justify-center shrink-0 text-[10px]">
                    !
                  </span>
                  <span className="leading-relaxed font-medium">{w}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Personalized Learning Plan */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center">
              <GraduationCap className="w-4 h-4 text-indigo-600" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900">Personalized Learning & Study Plan</h3>
              <p className="text-xs text-slate-500">Actionable steps to reach the next percentile tier</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            {report.personalizedLearningPlan.map((plan, i) => (
              <div key={i} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between text-xs space-y-3">
                <div>
                  <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 text-[10px] font-bold">
                    Action {i + 1}
                  </span>
                  <h4 className="font-bold text-slate-900 text-sm mt-2 mb-1">{plan.title}</h4>
                  <p className="text-slate-600 leading-relaxed font-normal">{plan.description}</p>
                </div>
                <div className="pt-2 border-t border-slate-200/80 text-[11px] text-indigo-900 font-medium">
                  <strong>Recommended Action:</strong> {plan.resourceOrAction}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Question-by-Question Deep Dive */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3 mb-6">
            <div>
              <h3 className="font-extrabold text-base text-slate-900">Question-by-Question Evaluation</h3>
              <p className="text-xs text-slate-500">Review your individual responses, scores, and model answers</p>
            </div>

            {/* Filter buttons */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
              <button
                onClick={() => setFilterMode('all')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  filterMode === 'all' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All ({session.questions.length})
              </button>
              <button
                onClick={() => setFilterMode('mastered')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  filterMode === 'mastered' ? 'bg-white text-emerald-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Score 7.5+
              </button>
              <button
                onClick={() => setFilterMode('improvement')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  filterMode === 'improvement' ? 'bg-white text-amber-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Needs Polish (&lt;7.5)
              </button>
            </div>
          </div>

          {/* List of questions */}
          <div className="space-y-4">
            {questionsToDisplay.map((q) => {
              const isExpanded = expandedQId === q.id;
              const score = q.feedback?.score || 0;

              return (
                <div
                  key={q.id}
                  className="border border-slate-200 rounded-2xl overflow-hidden transition-all hover:border-slate-300"
                >
                  {/* Summary Bar */}
                  <div
                    onClick={() => setExpandedQId(isExpanded ? null : q.id)}
                    className="p-4 bg-slate-50/60 hover:bg-slate-50 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-start sm:items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs shrink-0 ${
                        score >= 8.5 ? 'bg-emerald-600 text-white' : score >= 7.0 ? 'bg-indigo-600 text-white' : 'bg-amber-600 text-white'
                      }`}>
                        {score}
                      </div>

                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="font-bold text-slate-900">Question {q.questionNumber}:</span>
                          <span className="text-[11px] font-semibold text-slate-500">{q.topic}</span>
                          {q.isFollowUp && (
                            <span className="px-1.5 py-0.2 rounded text-[10px] bg-purple-100 text-purple-800 font-bold">
                              Follow-Up
                            </span>
                          )}
                        </div>
                        <p className="text-slate-700 line-clamp-1 font-medium">{q.questionText}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      <span className="text-[11px] text-slate-500">
                        {isExpanded ? 'Collapse' : 'Inspect'}
                      </span>
                      {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                    </div>
                  </div>

                  {/* Expanded Body */}
                  {isExpanded && (
                    <div className="p-5 bg-white space-y-4 text-xs border-t border-slate-100">
                      <div>
                        <strong className="text-slate-900 font-bold block mb-1">Full Question:</strong>
                        <p className="text-slate-800 bg-slate-50 p-3 rounded-xl border border-slate-100 font-medium">
                          {q.questionText}
                        </p>
                      </div>

                      <div>
                        <strong className="text-slate-900 font-bold block mb-1">Your Submitted Response:</strong>
                        <p className="text-slate-700 bg-indigo-50/30 p-3 rounded-xl border border-indigo-100 leading-relaxed font-normal whitespace-pre-wrap">
                          {q.userAnswer || 'No answer submitted.'}
                        </p>
                      </div>

                      {q.feedback && (
                        <>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100">
                              <strong className="text-emerald-900 font-bold block mb-1">What Was Good:</strong>
                              <p className="text-emerald-800 text-[11px] leading-relaxed">{q.feedback.whatWasGood}</p>
                            </div>
                            <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-100">
                              <strong className="text-amber-900 font-bold block mb-1">What Is Missing:</strong>
                              <p className="text-amber-800 text-[11px] leading-relaxed">{q.feedback.whatIsMissing}</p>
                            </div>
                            <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100">
                              <strong className="text-indigo-900 font-bold block mb-1">Actionable Advice:</strong>
                              <p className="text-indigo-800 text-[11px] leading-relaxed">{q.feedback.whatShouldBeImproved}</p>
                            </div>
                          </div>

                          <div className="p-4 bg-slate-900 text-slate-200 rounded-xl">
                            <strong className="text-white font-bold block mb-1 flex items-center gap-1.5">
                              <Award className="w-3.5 h-3.5 text-amber-400" />
                              Model Answer (Lead Interviewer Benchmark):
                            </strong>
                            <p className="text-slate-300 leading-relaxed text-xs italic">
                              "{q.feedback.strongerAnswerExample}"
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom CTA footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 bg-white rounded-3xl border border-slate-200">
          <div>
            <h4 className="font-extrabold text-slate-900 text-sm">Want to try another round?</h4>
            <p className="text-xs text-slate-500">Pick a new role or switch from Medium to Hard difficulty.</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onGoToDashboard}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 font-semibold text-xs"
            >
              View Dashboard Analytics
            </button>
            <button
              onClick={onRetake}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/30 flex items-center gap-2"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Practice Next Round</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
