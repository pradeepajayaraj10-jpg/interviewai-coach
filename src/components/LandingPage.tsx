import React, { useState } from 'react';
import {
  Bot,
  Sparkles,
  ArrowRight,
  Play,
  CheckCircle2,
  Code2,
  Users2,
  Sliders,
  TrendingUp,
  Brain,
  MessageSquare,
  ShieldCheck,
  Award,
  Zap,
  ChevronRight,
  BookOpen,
} from 'lucide-react';
import { JobRole } from '../types/interview.ts';

interface LandingPageProps {
  onStartInterview: () => void;
  onOpenProfile: () => void;
  onViewDemo: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartInterview,
  onOpenProfile,
  onViewDemo,
}) => {
  const [activeTabRole, setActiveTabRole] = useState<string>('Software Developer');

  const rolePreviews: Record<string, { desc: string; sampleQuestions: string[]; coreSkills: string[] }> = {
    'Software Developer': {
      desc: 'Comprehensive algorithmic, system design, and computer science foundations for SDE-1 roles.',
      sampleQuestions: [
        'How does a Hash Table handle key collisions, and what happens when the load factor exceeds 0.75?',
        'Explain the difference between a Process and a Thread regarding memory space and context switching.',
        'Walk through how you would design a URL shortener system handling 100M daily writes.',
      ],
      coreSkills: ['Data Structures & Algorithms', 'System Architecture', 'Operating Systems', 'OOP'],
    },
    'Java Developer': {
      desc: 'Enterprise backend, JVM performance optimization, Spring Boot, and concurrent execution.',
      sampleQuestions: [
        'How do the Java Memory Model (Heap/Stack/Metaspace) and Garbage Collection generational phases work?',
        'Explain the volatile keyword vs synchronized blocks and AtomicInteger for thread safety.',
        'Why is constructor injection preferred over field injection in Spring Boot?',
      ],
      coreSkills: ['JVM Internals', 'Spring Boot', 'Concurrency & Locks', 'Microservices'],
    },
    'Python Developer': {
      desc: 'Modern Python backend architecture, memory optimization, asynchronous programming, and clean code.',
      sampleQuestions: [
        'What is Python’s Global Interpreter Lock (GIL) and how does it impact CPU vs I/O bound tasks?',
        'Explain the memory advantage of a Generator with yield when processing large 10GB streaming datasets.',
        'How do Python decorators operate under the hood using first-class functions and closures?',
      ],
      coreSkills: ['AsyncIO & FastApi', 'Memory Profiling', 'Metaprogramming', 'Clean Architecture'],
    },
    'Web Developer': {
      desc: 'Modern full-stack JavaScript/TypeScript, DOM performance, browser security, and component state.',
      sampleQuestions: [
        'Walk me through the JavaScript Event Loop: Call stack, Microtasks (Promises), and Macrotasks.',
        'How does React Virtual DOM reconciliation (Fiber) work, and how do you prevent unnecessary re-renders?',
        'What is CORS, why do browsers enforce Same-Origin Policy, and how do preflight requests work?',
      ],
      coreSkills: ['React & Next.js', 'Event Loop', 'Web Security & CORS', 'State Optimization'],
    },
    'Data Analyst': {
      desc: 'Analytical SQL, window functions, statistical inference, data wrangling, and actionable reporting.',
      sampleQuestions: [
        'Explain SQL Window Functions (ROW_NUMBER vs RANK vs DENSE_RANK) and how they differ from GROUP BY.',
        'In a dataset with missing values, extreme outliers, and skewed dates, walk through your cleaning workflow.',
        'How do you communicate complex statistical variance to non-technical business stakeholders?',
      ],
      coreSkills: ['Advanced SQL', 'Pandas & EDA', 'Statistical Modeling', 'Executive Reporting'],
    },
    'AI-ML Engineer': {
      desc: 'Machine learning fundamentals, deep learning architectures, Transformer attention, and production inference.',
      sampleQuestions: [
        'Explain the Bias-Variance tradeoff and how to diagnose underfitting vs overfitting from loss curves.',
        'Why does Scaled Dot-Product Attention in Transformers divide by sqrt(d_k)?',
        'Why is accuracy misleading for imbalanced datasets, and which alternative metrics should you monitor?',
      ],
      coreSkills: ['Transformers & LLMs', 'PyTorch / TensorFlow', 'Loss Optimization', 'Model Evaluation'],
    },
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 selection:bg-indigo-500 selection:text-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 border-b border-slate-200/80 bg-gradient-to-b from-white via-indigo-50/20 to-slate-50">
        {/* Subtle decorative background circles */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-indigo-400/10 blur-[100px] pointer-events-none rounded-full" />
        <div className="absolute top-10 right-10 w-72 h-72 bg-purple-400/10 blur-[80px] pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-10">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200/80 text-indigo-700 text-xs font-bold tracking-wide uppercase mb-6 shadow-xs animate-in fade-in duration-500">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600 animate-spin" />
              <span>Next-Gen Placement Preparation</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15] mb-6">
              Ace Your Technical & HR Rounds with <span className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 bg-clip-text text-transparent">Adaptive AI</span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal mb-8 max-w-2xl mx-auto">
              Simulate realistic interviews for Software Engineering, Web Development, and Data Science. Get dynamic questions, instant 0–10 multi-metric answer scoring, follow-up probes, and comprehensive performance scorecards.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5">
              <button
                onClick={onStartInterview}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Start Interview</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onViewDemo}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-semibold text-sm shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>View Sample Report</span>
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 font-medium">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Zero Mock Clichés — Dynamic AI Questions</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>7-Factor Score Breakdown (0-10)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Voice STT & AI Speech Synthesis</span>
              </div>
            </div>
          </div>

          {/* Floating Feature Card Preview */}
          <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl shadow-slate-200/70 border border-slate-200 p-4 sm:p-6 transition-all">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-4 border-b border-slate-100 gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-900 text-sm">Interactive AI Interview Engine</h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Live Simulation
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">Adapts questions in real-time based on candidate replies</p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs font-semibold">
                <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700">Software Developer</span>
                <span className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 border border-amber-200">Medium</span>
                <span className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200">Question 2 of 5</span>
              </div>
            </div>

            {/* Chat Snippet Preview */}
            <div className="mt-5 space-y-4 text-xs">
              {/* Question bubble */}
              <div className="flex items-start gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold shrink-0 text-xs">
                  AI
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-slate-900 text-xs">Interviewer</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-100/70 text-indigo-800 font-semibold">
                      DSA & Memory
                    </span>
                  </div>
                  <p className="text-slate-800 leading-relaxed font-medium">
                    "Can you explain the difference between a HashMap and a TreeMap in terms of time complexity, internal tree balancing, and when to pick one over the other?"
                  </p>
                </div>
              </div>

              {/* Evaluation Pill Banner */}
              <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                    9.5
                  </div>
                  <div>
                    <span className="font-bold text-emerald-900">Exceptional Technical Precision</span>
                    <p className="text-[11px] text-emerald-700">Rightly highlighted Red-Black tree internals, O(1) vs O(log n), and range queries.</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-600 shrink-0">
                  <span className="px-2 py-0.5 bg-white rounded border border-emerald-200 text-emerald-800">Relevance: 10/10</span>
                  <span className="px-2 py-0.5 bg-white rounded border border-emerald-200 text-emerald-800">Correctness: 9.5/10</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Role Explorer Section */}
      <section className="py-16 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-3">
              Explore Practice Tracks Tailored to Your Goal
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Each domain questions your conceptual depth, problem-solving intuition, and system trade-offs.
            </p>
          </div>

          {/* Role selector tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
            {Object.keys(rolePreviews).map((role) => (
              <button
                key={role}
                onClick={() => setActiveTabRole(role)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTabRole === role
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {role}
              </button>
            ))}
          </div>

          {/* Role card preview */}
          {rolePreviews[activeTabRole] && (
            <div className="max-w-3xl mx-auto bg-slate-50 border border-slate-200 rounded-2xl p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-slate-200 gap-3 mb-4">
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">{activeTabRole} Track</h3>
                  <p className="text-xs text-slate-600 mt-0.5">{rolePreviews[activeTabRole].desc}</p>
                </div>
                <button
                  onClick={onStartInterview}
                  className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold text-xs shadow-xs transition-colors shrink-0 flex items-center gap-1.5"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  Practice {activeTabRole}
                </button>
              </div>

              {/* Sample Questions */}
              <div className="mb-4">
                <span className="font-bold text-slate-800 text-xs block mb-2">Sample Evaluated Questions:</span>
                <div className="space-y-2">
                  {rolePreviews[activeTabRole].sampleQuestions.map((q, idx) => (
                    <div key={idx} className="p-3 bg-white rounded-xl border border-slate-200/90 text-xs flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-indigo-50 text-indigo-700 font-extrabold flex items-center justify-center shrink-0 text-[10px]">
                        {idx + 1}
                      </span>
                      <p className="text-slate-800 font-medium leading-relaxed">{q}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Core Skills Chips */}
              <div className="flex flex-wrap items-center gap-1.5 pt-3 border-t border-slate-200 text-xs">
                <span className="font-semibold text-slate-600 text-[11px]">Core Evaluated Areas:</span>
                {rolePreviews[activeTabRole].coreSkills.map((skill) => (
                  <span
                    key={skill}
                    className="px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-700 font-semibold text-[11px]"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-slate-50 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-indigo-600 text-xs font-bold uppercase tracking-wider">Step-By-Step Simulation</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1 mb-3">
              How InterviewAI Transforms Your Prep
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Designed according to corporate hiring committee standards to turn nervous students into confident engineers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Step 1 */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs relative group hover:border-indigo-300 transition-all">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-sm mb-4 border border-indigo-100">
                01
              </div>
              <h3 className="font-bold text-slate-900 text-sm mb-1.5">Profile & Setup</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Enter your college, skills, target role, and select Technical, HR, or Mixed rounds from 5 to 15 questions.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs relative group hover:border-indigo-300 transition-all">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-sm mb-4 border border-indigo-100">
                02
              </div>
              <h3 className="font-bold text-slate-900 text-sm mb-1.5">Adaptive Interviewing</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                The AI interviewer delivers dynamic questions one by one. Speak with voice microphone or type your responses.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs relative group hover:border-indigo-300 transition-all">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-sm mb-4 border border-indigo-100">
                03
              </div>
              <h3 className="font-bold text-slate-900 text-sm mb-1.5">Instant Scoring & Follow-Ups</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Each answer receives 7 scores (0-10), strengths, missing nuances, a model answer, and follow-up probes.
              </p>
            </div>

            {/* Step 4 */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs relative group hover:border-indigo-300 transition-all">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-sm mb-4 border border-indigo-100">
                04
              </div>
              <h3 className="font-bold text-slate-900 text-sm mb-1.5">Final Report & Plan</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Receive an executive scorecard with readiness verdict, weak area diagnosis, and a personalized study roadmap.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features Grid */}
      <section className="py-16 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-indigo-600 text-xs font-bold uppercase tracking-wider">Unmatched Depth</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1 mb-3">
              Built for High-Stakes Career Preparation
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Everything you need to master technical syntax, architectural thinking, and behavioral leadership.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-indigo-200 hover:shadow-md transition-all">
              <div className="w-9 h-9 rounded-lg bg-indigo-600 text-white flex items-center justify-center mb-3">
                <Brain className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm mb-1.5">Multi-Factor Answer Scoring</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Evaluates Relevance, Correctness, Completeness, Clarity, Communication, Confidence, and Technical Accuracy on a 0–10 scale.
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-indigo-200 hover:shadow-md transition-all">
              <div className="w-9 h-9 rounded-lg bg-purple-600 text-white flex items-center justify-center mb-3">
                <MessageSquare className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm mb-1.5">Intelligent Follow-Ups</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                If you touch upon an interesting technical concept or skip an edge case, the AI naturally probes deeper just like a principal engineer.
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-indigo-200 hover:shadow-md transition-all">
              <div className="w-9 h-9 rounded-lg bg-emerald-600 text-white flex items-center justify-center mb-3">
                <Code2 className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm mb-1.5">Full CS Foundation Coverage</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Data Structures, Algorithms, OOP, DBMS & ACID, Operating Systems, Computer Networks, and System Design principles.
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-indigo-200 hover:shadow-md transition-all">
              <div className="w-9 h-9 rounded-lg bg-amber-600 text-white flex items-center justify-center mb-3">
                <Users2 className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm mb-1.5">STAR Behavioral HR Coaching</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Master conflict resolution, leadership, failure recovery, strengths, weaknesses, and why the company should hire you.
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-indigo-200 hover:shadow-md transition-all">
              <div className="w-9 h-9 rounded-lg bg-rose-600 text-white flex items-center justify-center mb-3">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm mb-1.5">Progress Dashboard & Analytics</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Track historical scores, average performance by domain, recent interview reviews, and competency radars over time.
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-indigo-200 hover:shadow-md transition-all">
              <div className="w-9 h-9 rounded-lg bg-sky-600 text-white flex items-center justify-center mb-3">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm mb-1.5">Actionable Model Answers</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Compare your response side-by-side with an exemplary answer written by senior engineering hiring leads.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pre-CTA Banner */}
      <section className="py-16 bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-4">
            Ready to Secure Your Dream Placement Offer?
          </h2>
          <p className="text-indigo-200 text-xs sm:text-sm max-w-xl mx-auto mb-8 leading-relaxed">
            Begin your personalized interview simulation now. Configure your difficulty, pick your job role, and get instant feedback in under 15 minutes.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={onStartInterview}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white hover:bg-indigo-50 text-indigo-900 font-extrabold text-xs shadow-lg transition-all hover:scale-105 cursor-pointer flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4 fill-current text-indigo-600" />
              <span>Practice Now (Free)</span>
            </button>
            <button
              onClick={onOpenProfile}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-xs transition-colors cursor-pointer"
            >
              Edit Candidate Profile
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
