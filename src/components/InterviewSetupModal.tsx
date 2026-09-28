import React, { useState } from 'react';
import {
  X,
  Play,
  Briefcase,
  Layers,
  Sliders,
  HelpCircle,
  Code2,
  Users2,
  Shuffle,
  Sparkles,
  Zap,
} from 'lucide-react';
import { InterviewType, JobRole, DifficultyLevel, IUserProfile } from '../types/interview.ts';

interface InterviewSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartInterview: (config: {
    interviewType: InterviewType;
    jobRole: JobRole;
    difficulty: DifficultyLevel;
    totalQuestions: number;
    customSkills?: string[];
  }) => Promise<void>;
  profile: IUserProfile | null;
}

export const InterviewSetupModal: React.FC<InterviewSetupModalProps> = ({
  isOpen,
  onClose,
  onStartInterview,
  profile,
}) => {
  const [interviewType, setInterviewType] = useState<InterviewType>('mixed');
  const [jobRole, setJobRole] = useState<JobRole>(profile?.targetRole || 'Software Developer');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('medium');
  const [totalQuestions, setTotalQuestions] = useState<number>(5);
  const [selectedFocusSkills, setSelectedFocusSkills] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const roles = [
    { id: 'Software Developer', title: 'Software Developer', desc: 'DSA, System Design, OOP, OS, Networks' },
    { id: 'Java Developer', title: 'Java Developer', desc: 'JVM internals, Spring Boot, Concurrency, Collections' },
    { id: 'Python Developer', title: 'Python Developer', desc: 'CPython GIL, AsyncIO, Memory, Backend Frameworks' },
    { id: 'Web Developer', title: 'Web Developer', desc: 'React, DOM, Node.js, REST APIs, Web Security' },
    { id: 'Data Analyst', title: 'Data Analyst', desc: 'Advanced SQL, Pandas, Data Cleaning, Statistics' },
    { id: 'AI-ML Engineer', title: 'AI-ML Engineer', desc: 'ML Theory, Deep Learning, Transformers, Math' },
  ];

  const types = [
    {
      id: 'mixed',
      title: 'Mixed Round',
      desc: 'Balanced simulation: Technical foundations + Behavioral HR fit',
      icon: Shuffle,
      badge: 'Most Popular',
    },
    {
      id: 'technical',
      title: 'Technical Round',
      desc: 'Coding architecture, DSA, core CS topics, and problem solving',
      icon: Code2,
      badge: 'Coding Focus',
    },
    {
      id: 'hr',
      title: 'HR & Behavioral',
      desc: 'STAR behavioral, leadership, culture fit, strengths & career goals',
      icon: Users2,
      badge: 'Soft Skills',
    },
  ];

  const difficulties = [
    {
      id: 'easy',
      label: 'Easy',
      desc: 'Fundamental definitions, campus placement basics',
    },
    {
      id: 'medium',
      label: 'Medium',
      desc: 'Realistic industry standard, trade-offs, practical cases',
    },
    {
      id: 'hard',
      label: 'Hard',
      desc: 'Senior/FAANG level depth, distributed scale, edge cases',
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      await onStartInterview({
        interviewType,
        jobRole,
        difficulty,
        totalQuestions,
        customSkills: selectedFocusSkills,
      });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleFocusSkill = (skill: string) => {
    if (selectedFocusSkills.includes(skill)) {
      setSelectedFocusSkills(selectedFocusSkills.filter((s) => s !== skill));
    } else {
      setSelectedFocusSkills([...selectedFocusSkills, skill]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white border border-white/20">
              <Zap className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Configure Interview Session</h2>
              <p className="text-xs text-indigo-200">
                Tailor the role, track, difficulty, and question depth for your target company.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 text-xs">
          {/* Step 1: Interview Type */}
          <div>
            <label className="block font-bold text-slate-800 mb-2 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-indigo-600" />
              1. Choose Interview Track
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {types.map((t) => {
                const Icon = t.icon;
                const isSelected = interviewType === t.id;
                return (
                  <div
                    key={t.id}
                    onClick={() => setInterviewType(t.id as InterviewType)}
                    className={`relative p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/60 ring-2 ring-indigo-600/10'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    {t.badge && (
                      <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-indigo-100 text-indigo-700">
                        {t.badge}
                      </span>
                    )}
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2 ${
                      isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="font-bold text-slate-900 text-xs mb-1">{t.title}</div>
                    <p className="text-[11px] text-slate-500 leading-snug">{t.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step 2: Target Job Role */}
          <div>
            <label className="block font-bold text-slate-800 mb-2 flex items-center gap-1.5">
              <Briefcase className="w-4 h-4 text-indigo-600" />
              2. Target Job Role
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {roles.map((r) => {
                const isSelected = jobRole === r.id;
                return (
                  <div
                    key={r.id}
                    onClick={() => setJobRole(r.id)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start gap-2.5 ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/40 font-semibold ring-1 ring-indigo-600/20'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <input
                      type="radio"
                      name="role"
                      checked={isSelected}
                      onChange={() => setJobRole(r.id)}
                      className="mt-0.5 text-indigo-600 focus:ring-indigo-500"
                    />
                    <div className="flex-1">
                      <div className="text-slate-900 text-xs font-bold">{r.title}</div>
                      <div className="text-[11px] text-slate-500 font-normal">{r.desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step 3: Difficulty & Question Count */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-1">
            {/* Difficulty */}
            <div>
              <label className="block font-bold text-slate-800 mb-2 flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-indigo-600" />
                3. Difficulty Level
              </label>
              <div className="space-y-2">
                {difficulties.map((d) => {
                  const isSelected = difficulty === d.id;
                  return (
                    <div
                      key={d.id}
                      onClick={() => setDifficulty(d.id as DifficultyLevel)}
                      className={`p-2.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50/50'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div>
                        <span className={`font-bold text-xs ${
                          d.id === 'hard' ? 'text-rose-600' : d.id === 'medium' ? 'text-amber-600' : 'text-emerald-600'
                        }`}>
                          {d.label}
                        </span>
                        <p className="text-[11px] text-slate-500">{d.desc}</p>
                      </div>
                      <input
                        type="radio"
                        name="difficulty"
                        checked={isSelected}
                        onChange={() => setDifficulty(d.id as DifficultyLevel)}
                        className="text-indigo-600 focus:ring-indigo-500"
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Questions count */}
            <div>
              <label className="block font-bold text-slate-800 mb-2 flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-indigo-600" />
                4. Number of Questions
              </label>
              <div className="grid grid-cols-3 gap-2 mb-3">
                {[5, 10, 15].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setTotalQuestions(num)}
                    className={`py-3 rounded-xl border-2 text-center transition-all ${
                      totalQuestions === num
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-900 font-extrabold shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700 font-semibold'
                    }`}
                  >
                    <div className="text-base">{num}</div>
                    <div className="text-[10px] text-slate-500 font-medium">
                      {num === 5 ? '15 min Sprint' : num === 10 ? '30 min Round' : '45 min In-Depth'}
                    </div>
                  </button>
                ))}
              </div>

              {/* Profile skills reminder */}
              {profile?.skills && profile.skills.length > 0 && (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                  <div className="text-[11px] font-semibold text-slate-700 mb-1.5 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-indigo-600" />
                    Focus on specific skills from profile:
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {profile.skills.slice(0, 6).map((skill) => {
                      const isSel = selectedFocusSkills.includes(skill);
                      return (
                        <button
                          key={skill}
                          type="button"
                          onClick={() => toggleFocusSkill(skill)}
                          className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                            isSel
                              ? 'bg-indigo-600 text-white'
                              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          {skill}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
            <div className="text-[11px] text-slate-500">
              Candidate: <span className="font-semibold text-slate-700">{profile?.name || 'Guest'}</span> ({profile?.experienceLevel || 'Fresher'})
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold flex items-center gap-2 shadow-md shadow-indigo-600/30 transition-all disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>Starting AI Interview...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current" />
                    <span>Start Interview Session</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
