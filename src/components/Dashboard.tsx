import React from 'react';
import {
  TrendingUp,
  Award,
  Zap,
  BarChart2,
  Calendar,
  CheckCircle2,
  ChevronRight,
  BookOpen,
  Play,
  Layers,
  ArrowUpRight,
  Clock,
} from 'lucide-react';
import { IDashboardStats, IInterviewSession } from '../types/interview.ts';

interface DashboardProps {
  stats: IDashboardStats | null;
  onOpenSetup: () => void;
  onSelectInterview: (id: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  stats,
  onOpenSetup,
  onSelectInterview,
}) => {
  if (!stats) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-xs text-slate-500">
        Loading performance statistics...
      </div>
    );
  }

  const scoreHistory = stats.scoreHistory || [];
  const maxScore = 100;
  const chartHeight = 140;
  const chartWidth = 500;

  // Generate SVG points for score history line chart
  const getLineChartPoints = () => {
    if (scoreHistory.length <= 1) return '';
    const stepX = chartWidth / (scoreHistory.length - 1);
    return scoreHistory
      .map((item, index) => {
        const x = index * stepX;
        const y = chartHeight - (item.score / maxScore) * (chartHeight - 30) - 15;
        return `${x},${y}`;
      })
      .join(' ');
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 text-slate-800">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-4">
          <div>
            <span className="text-xs uppercase font-extrabold text-indigo-600 tracking-wider">
              Student Career Analytics
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-0.5">
              Performance & Readiness Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Track your interview trajectory, technical accuracy, and domain mastery over time.
            </p>
          </div>

          <button
            onClick={onOpenSetup}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-indigo-600/30 transition-all self-start sm:self-center cursor-pointer"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Start Practice Round</span>
          </button>
        </div>

        {/* Top Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {/* Total Interviews */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-slate-500 font-semibold text-[11px] block mb-1">Total Sessions</span>
            <div className="text-2xl font-black text-slate-900">{stats.totalInterviews}</div>
            <div className="text-[10px] text-emerald-600 font-bold mt-1 flex items-center gap-0.5">
              <CheckCircle2 className="w-3 h-3" />
              <span>{stats.completionRate}% completion rate</span>
            </div>
          </div>

          {/* Average Score */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-slate-500 font-semibold text-[11px] block mb-1">Average Score</span>
            <div className="text-2xl font-black text-indigo-600">{stats.averageScore || 'N/A'}{stats.averageScore ? '/100' : ''}</div>
            <div className="text-[10px] text-slate-500 mt-1">Across all tracks</div>
          </div>

          {/* Best Score */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-slate-500 font-semibold text-[11px] block mb-1">Best Score</span>
            <div className="text-2xl font-black text-emerald-600">{stats.bestScore || 'N/A'}{stats.bestScore ? '/100' : ''}</div>
            <div className="text-[10px] text-slate-500 mt-1">Personal record</div>
          </div>

          {/* Technical Avg */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-slate-500 font-semibold text-[11px] block mb-1">Technical Avg</span>
            <div className="text-2xl font-black text-purple-600">{stats.technicalAverage || 'N/A'}%</div>
            <div className="text-[10px] text-slate-500 mt-1">DSA, OOP & DBMS</div>
          </div>

          {/* HR Avg */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-slate-500 font-semibold text-[11px] block mb-1">HR & Fit Avg</span>
            <div className="text-2xl font-black text-amber-600">{stats.hrAverage || 'N/A'}%</div>
            <div className="text-[10px] text-slate-500 mt-1">STAR Communication</div>
          </div>
        </div>

        {/* Charts & Breakdown Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Progress Over Time Chart */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-indigo-600" />
                  Score Progression Over Time
                </h3>
                <span className="text-[11px] font-bold text-slate-500">Recent Rounds</span>
              </div>
              <p className="text-xs text-slate-500 mb-6">
                Evaluates consistency and readiness growth as you practice diverse questions.
              </p>
            </div>

            {scoreHistory.length > 0 ? (
              <div className="relative w-full overflow-x-auto">
                <svg className="w-full h-44" viewBox={`0 0 ${chartWidth} ${chartHeight}`}>
                  {/* Grid Lines */}
                  <line x1="0" y1="20" x2={chartWidth} y2="20" stroke="#f1f5f9" strokeDasharray="4" />
                  <line x1="0" y1="65" x2={chartWidth} y2="65" stroke="#f1f5f9" strokeDasharray="4" />
                  <line x1="0" y1="110" x2={chartWidth} y2="110" stroke="#f1f5f9" strokeDasharray="4" />

                  {/* Gradient Area under line */}
                  <defs>
                    <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6366f1" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {scoreHistory.length > 1 && (
                    <>
                      <polygon
                        points={`0,${chartHeight} ${getLineChartPoints()} ${chartWidth},${chartHeight}`}
                        fill="url(#scoreGrad)"
                      />
                      <polyline
                        fill="none"
                        stroke="#4f46e5"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        points={getLineChartPoints()}
                      />
                    </>
                  )}

                  {/* Data Points */}
                  {scoreHistory.map((item, idx) => {
                    const stepX = scoreHistory.length > 1 ? chartWidth / (scoreHistory.length - 1) : chartWidth / 2;
                    const x = idx * stepX;
                    const y = chartHeight - (item.score / maxScore) * (chartHeight - 30) - 15;
                    return (
                      <g key={idx} className="group cursor-pointer">
                        <circle cx={x} cy={y} r="5" fill="#4f46e5" stroke="#ffffff" strokeWidth="2" />
                        <text
                          x={x}
                          y={y - 8}
                          textAnchor="middle"
                          className="text-[10px] font-bold fill-indigo-900"
                        >
                          {item.score}
                        </text>
                      </g>
                    );
                  })}
                </svg>

                {/* X-axis labels */}
                <div className="flex justify-between text-[10px] text-slate-400 font-semibold px-2 pt-1 border-t border-slate-100">
                  {scoreHistory.map((item, idx) => (
                    <span key={idx}>{item.date}</span>
                  ))}
                </div>
              </div>
            ) : (
              <div className="h-40 flex items-center justify-center text-xs text-slate-400">
                Complete at least one interview round to view progress graph.
              </div>
            )}
          </div>

          {/* Topic Proficiency Breakdown */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                  <BarChart2 className="w-4 h-4 text-purple-600" />
                  Topic Proficiency Index
                </h3>
                <span className="text-[11px] font-bold text-slate-500">Subject Breakdown</span>
              </div>
              <p className="text-xs text-slate-500 mb-6">
                Average scores calculated across specific technical concepts.
              </p>
            </div>

            <div className="space-y-3.5">
              {stats.topicProficiency && stats.topicProficiency.length > 0 ? (
                stats.topicProficiency.map((item, idx) => (
                  <div key={idx} className="text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-slate-800">{item.topic}</span>
                      <span className="font-black text-indigo-700">{item.score}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          item.score >= 85
                            ? 'bg-emerald-500'
                            : item.score >= 70
                            ? 'bg-indigo-600'
                            : 'bg-amber-500'
                        }`}
                        style={{ width: `${item.score}%` }}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <div className="h-40 flex items-center justify-center text-xs text-slate-400">
                  No topic data available yet.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Interviews List */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
            <div>
              <h3 className="font-extrabold text-base text-slate-900">Recent Interview Sessions</h3>
              <p className="text-xs text-slate-500">Click any session to inspect detailed feedback & questions</p>
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {stats.recentInterviews && stats.recentInterviews.length > 0 ? (
              stats.recentInterviews.map((item) => (
                <div
                  key={item.id}
                  onClick={() => onSelectInterview(item.id)}
                  className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/80 px-3 rounded-xl cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs shrink-0 ${
                      item.score >= 85
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : item.score >= 70
                        ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      {item.score || '—'}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <strong className="text-slate-900 font-bold text-xs">{item.jobRole}</strong>
                        <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-slate-100 text-slate-600">
                          {item.interviewType}
                        </span>
                        <span className="text-[10px] font-semibold text-slate-400">• {item.difficulty}</span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-2">
                        <span>{new Date(item.date).toLocaleDateString()}</span>
                        <span>•</span>
                        <span>{item.totalQuestions} Questions</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-indigo-600 text-xs font-bold self-end sm:self-center">
                    <span>View Report</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-xs text-slate-400">
                No past sessions recorded yet. Start your first practice round!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
