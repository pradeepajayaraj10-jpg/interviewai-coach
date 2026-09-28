import React, { useState } from 'react';
import {
  History,
  Calendar,
  Layers,
  Award,
  ChevronRight,
  Trash2,
  Search,
  Filter,
  ArrowRight,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import { IInterviewSession } from '../types/interview.ts';

interface InterviewHistoryProps {
  interviews: IInterviewSession[];
  onSelectInterview: (id: string) => void;
  onDeleteInterview: (id: string) => Promise<void>;
  onStartNew: () => void;
}

export const InterviewHistory: React.FC<InterviewHistoryProps> = ({
  interviews,
  onSelectInterview,
  onDeleteInterview,
  onStartNew,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filtered = interviews.filter((item) => {
    const matchesSearch =
      item.jobRole.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.candidateProfile?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || item.interviewType === filterType;
    const matchesDiff = filterDifficulty === 'all' || item.difficulty === filterDifficulty;
    return matchesSearch && matchesType && matchesDiff;
  });

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this interview record?')) {
      try {
        setDeletingId(id);
        await onDeleteInterview(id);
      } finally {
        setDeletingId(null);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 text-slate-800">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-4">
          <div>
            <span className="text-xs uppercase font-extrabold text-indigo-600 tracking-wider">
              Candidate Records
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-0.5">
              Interview History & Archives
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Revisit previous practice sessions, compare evaluations, and study model answers.
            </p>
          </div>

          <button
            onClick={onStartNew}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/30 transition-all self-start sm:self-center cursor-pointer"
          >
            Start New Interview
          </button>
        </div>

        {/* Filter Controls */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center gap-3">
          {/* Search bar */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by job role or candidate name..."
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-xs text-slate-900"
            />
          </div>

          {/* Type filter */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-700 font-semibold focus:outline-none"
          >
            <option value="all">All Tracks</option>
            <option value="technical">Technical</option>
            <option value="hr">HR & Behavioral</option>
            <option value="mixed">Mixed</option>
          </select>

          {/* Difficulty filter */}
          <select
            value={filterDifficulty}
            onChange={(e) => setFilterDifficulty(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-700 font-semibold focus:outline-none"
          >
            <option value="all">All Difficulties</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        {/* List of interviews */}
        <div className="space-y-3">
          {filtered.length > 0 ? (
            filtered.map((item) => {
              const score = item.finalReport?.overallScore;
              const isDeleting = deletingId === item.id;

              return (
                <div
                  key={item.id}
                  onClick={() => onSelectInterview(item.id)}
                  className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs hover:border-indigo-300 hover:shadow-md cursor-pointer transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start sm:items-center gap-4">
                    {/* Score badge */}
                    <div
                      className={`w-12 h-12 rounded-2xl flex flex-col items-center justify-center font-black shrink-0 ${
                        score !== undefined
                          ? score >= 85
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : score >= 70
                            ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      <span className="text-base leading-none">{score ?? '—'}</span>
                      {score !== undefined && <span className="text-[9px] uppercase opacity-75">/ 100</span>}
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h3 className="font-extrabold text-slate-900 text-sm">{item.jobRole}</h3>
                        <span className="px-2 py-0.5 rounded-full text-[10px] uppercase font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                          {item.interviewType}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-bold ${
                          item.difficulty === 'hard'
                            ? 'bg-rose-50 text-rose-700 border border-rose-100'
                            : item.difficulty === 'medium'
                            ? 'bg-amber-50 text-amber-700 border border-amber-100'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                        }`}>
                          {item.difficulty}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                          item.status === 'completed'
                            ? 'bg-emerald-50 text-emerald-800'
                            : 'bg-slate-100 text-slate-600'
                        }`}>
                          {item.status === 'completed' ? 'Completed' : 'In Progress'}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-slate-500 text-xs">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          {new Date(item.startedAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </span>
                        <span>•</span>
                        <span>
                          {item.questions.filter((q) => q.userAnswer).length} of {item.totalQuestions} Questions Answered
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      onClick={(e) => handleDelete(e, item.id)}
                      disabled={isDeleting}
                      title="Delete record"
                      className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <div className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors">
                      <span>{item.status === 'completed' ? 'Open Report' : 'Resume'}</span>
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-12 bg-white rounded-3xl border border-slate-200 text-center text-xs text-slate-500 space-y-3">
              <History className="w-8 h-8 text-slate-300 mx-auto" />
              <p>No interview history matching your filter criteria.</p>
              <button
                onClick={onStartNew}
                className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold text-xs"
              >
                Launch Interview
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
