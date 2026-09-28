import React from 'react';
import { Bot, Sparkles, BookOpen, Shield, Code, Cpu } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-200/80 bg-slate-900 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand info */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold">
                <Bot className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-white text-base tracking-tight">InterviewAI</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed mb-4">
              AI-Powered Interview Coach built specifically for college students, freshers, and job seekers preparing for high-stakes technical & HR interviews.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-slate-500">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Powered by Google Gemini 2.5 Flash & Node.js</span>
            </div>
          </div>

          {/* Supported Tracks */}
          <div>
            <h4 className="text-white font-semibold mb-3 flex items-center gap-1.5 text-xs">
              <Code className="w-3.5 h-3.5 text-indigo-400" />
              Interview Tracks
            </h4>
            <ul className="space-y-2 text-slate-400 text-[11px]">
              <li>Software Developer & SDE-1</li>
              <li>Java & Spring Boot Developer</li>
              <li>Python & Backend Systems</li>
              <li>Web & Full-Stack Developer</li>
              <li>Data Analyst & Business Intelligence</li>
              <li>AI / Machine Learning Engineer</li>
            </ul>
          </div>

          {/* Core Focus Areas */}
          <div>
            <h4 className="text-white font-semibold mb-3 flex items-center gap-1.5 text-xs">
              <Cpu className="w-3.5 h-3.5 text-indigo-400" />
              Core Competencies
            </h4>
            <ul className="space-y-2 text-slate-400 text-[11px]">
              <li>Data Structures & Algorithms (DSA)</li>
              <li>OOP & System Design Fundamentals</li>
              <li>DBMS, SQL & Indexing Internals</li>
              <li>Operating Systems & Concurrency</li>
              <li>Behavioral & STAR Method HR Questions</li>
              <li>Real-Time Multi-Metric Evaluation</li>
            </ul>
          </div>

          {/* Student Prep Tips */}
          <div>
            <h4 className="text-white font-semibold mb-3 flex items-center gap-1.5 text-xs">
              <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
              Prep Recommendation
            </h4>
            <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700/60 text-[11px] space-y-2">
              <p className="text-slate-300 font-medium">Use the STAR Framework:</p>
              <p className="text-slate-400">
                Structure answers into <strong>Situation</strong>, <strong>Task</strong>, <strong>Action</strong>, and measurable <strong>Result</strong> to score 9+ on communication.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
          <p>© {new Date().getFullYear()} InterviewAI. All rights reserved. Built for student career readiness.</p>
          <div className="flex items-center gap-4 text-slate-500">
            <span className="flex items-center gap-1">
              <Shield className="w-3 h-3 text-emerald-500" /> 100% Private Client Sessions
            </span>
            <span>•</span>
            <span>REST API + Express + MongoDB Atlas</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
