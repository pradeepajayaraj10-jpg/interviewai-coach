import React from 'react';
import { Bot, Sparkles, BarChart2, History, User, Play, Database, CheckCircle2 } from 'lucide-react';
import { IUserProfile } from '../types/interview.ts';

interface NavbarProps {
  currentTab: 'home' | 'interview' | 'dashboard' | 'history' | 'report';
  setCurrentTab: (tab: 'home' | 'interview' | 'dashboard' | 'history' | 'report') => void;
  onOpenSetup: () => void;
  onOpenProfile: () => void;
  profile: IUserProfile | null;
  serverStatus: { aiConfigured: boolean; database: string } | null;
  hasActiveSession: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  onOpenSetup,
  onOpenProfile,
  profile,
  serverStatus,
  hasActiveSession,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-md transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div
          onClick={() => setCurrentTab('home')}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-slate-900 text-lg tracking-tight">InterviewAI</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/70">
                PRO
              </span>
            </div>
            <p className="text-[11px] text-slate-700 font-medium hidden sm:block">AI-Powered Interview Coach</p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200/70">
          <button
            onClick={() => setCurrentTab('home')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              currentTab === 'home'
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            Home
          </button>

          {hasActiveSession && (
            <button
              onClick={() => setCurrentTab('interview')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                currentTab === 'interview'
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-indigo-600 hover:bg-white/50 font-bold'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Session
            </button>
          )}

          <button
            onClick={() => setCurrentTab('dashboard')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              currentTab === 'dashboard'
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5" />
            Dashboard
          </button>

          <button
            onClick={() => setCurrentTab('history')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              currentTab === 'history'
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            History
          </button>
        </nav>

        {/* Status Indicators & Action CTAs */}
        <div className="flex items-center gap-2.5">
          {/* Engine Status pill */}
          <div className="hidden lg:flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-full bg-slate-50 border border-slate-200 text-slate-600">
            <Sparkles className="w-3 h-3 text-amber-500" />
            <span>{serverStatus?.aiConfigured ? 'Gemini 2.5 AI' : 'Smart Evaluator'}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          </div>

          {/* User Profile trigger */}
          <button
            onClick={onOpenProfile}
            title="Candidate Profile"
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors"
          >
            <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-[11px]">
              {profile?.name ? profile.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <span className="hidden sm:inline max-w-[100px] truncate">{profile?.name || 'Profile'}</span>
          </button>

          {/* Start Practice CTA */}
          <button
            onClick={onOpenSetup}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold text-xs shadow-sm shadow-indigo-600/30 transition-all hover:shadow-indigo-600/40"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Practice Now</span>
          </button>
        </div>
      </div>
    </header>
  );
};
