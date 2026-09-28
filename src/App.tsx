import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar.tsx';
import { Footer } from './components/Footer.tsx';
import { LandingPage } from './components/LandingPage.tsx';
import { UserProfileModal } from './components/UserProfileModal.tsx';
import { InterviewSetupModal } from './components/InterviewSetupModal.tsx';
import { InterviewChat } from './components/InterviewChat.tsx';
import { FinalReportView } from './components/FinalReportView.tsx';
import { Dashboard } from './components/Dashboard.tsx';
import { InterviewHistory } from './components/InterviewHistory.tsx';
import { api } from './services/api.ts';
import {
  IUserProfile,
  IInterviewSession,
  IDashboardStats,
  InterviewType,
  JobRole,
  DifficultyLevel,
} from './types/interview.ts';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'home' | 'interview' | 'dashboard' | 'history' | 'report'>('home');
  const [profile, setProfile] = useState<IUserProfile | null>(null);
  const [serverStatus, setServerStatus] = useState<{ aiConfigured: boolean; database: string } | null>(null);
  const [currentSession, setCurrentSession] = useState<IInterviewSession | null>(null);
  const [selectedReportSession, setSelectedReportSession] = useState<IInterviewSession | null>(null);
  const [dashboardStats, setDashboardStats] = useState<IDashboardStats | null>(null);
  const [interviewsHistory, setInterviewsHistory] = useState<IInterviewSession[]>([]);

  // Modals
  const [isSetupOpen, setIsSetupOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Helper notification toast
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification((curr) => (curr?.message === message ? null : curr));
    }, 4000);
  };

  // Initial load
  useEffect(() => {
    async function initData() {
      try {
        const [profileData, healthData, statsData, historyData] = await Promise.all([
          api.getProfile().catch(() => null),
          api.getHealth().catch(() => null),
          api.getStats().catch(() => null),
          api.listInterviews().catch(() => []),
        ]);

        if (profileData) setProfile(profileData);
        if (healthData) setServerStatus(healthData);
        if (statsData) setDashboardStats(statsData);
        if (historyData) setInterviewsHistory(historyData);
      } catch (e) {
        console.warn('Initial data load error:', e);
      }
    }
    initData();
  }, []);

  // Refresh stats & history
  const refreshStatsAndHistory = async () => {
    try {
      const [stats, history] = await Promise.all([api.getStats(), api.listInterviews()]);
      setDashboardStats(stats);
      setInterviewsHistory(history);
    } catch (err) {
      console.warn('Failed to refresh data:', err);
    }
  };

  // Start new interview
  const handleStartInterview = async (config: {
    interviewType: InterviewType;
    jobRole: JobRole;
    difficulty: DifficultyLevel;
    totalQuestions: number;
    customSkills?: string[];
  }) => {
    try {
      const res = await api.startInterview(config);
      setCurrentSession(res.session);
      setCurrentTab('interview');
      showToast(
        `Interview started! Round: ${config.jobRole} (${config.interviewType.toUpperCase()})`,
        'success'
      );
      await refreshStatsAndHistory();
    } catch (err: any) {
      showToast(err.message || 'Failed to start interview', 'error');
      throw err;
    }
  };

  // Submit candidate answer
  const handleSubmitAnswer = async (params: { answer: string; questionId: string }) => {
    if (!currentSession) throw new Error('No active session');

    try {
      const res = await api.submitAnswer({
        interviewId: currentSession.id,
        questionId: params.questionId,
        answer: params.answer,
      });

      // Update local session state
      const updatedQuestions = currentSession.questions.map((q) =>
        q.id === params.questionId ? res.question : q
      );

      const updatedSession: IInterviewSession = {
        ...currentSession,
        questions: updatedQuestions,
      };

      setCurrentSession(updatedSession);

      if (res.feedback.score >= 8.0) {
        showToast(`Strong answer! Scored ${res.feedback.score}/10`, 'success');
      } else {
        showToast(`Answer evaluated! Score: ${res.feedback.score}/10`, 'info');
      }

      return res;
    } catch (err: any) {
      showToast(err.message || 'Evaluation failed. Please try again.', 'error');
      throw err;
    }
  };

  // Request next question
  const handleNextQuestion = async (triggerFollowUp = false) => {
    if (!currentSession) throw new Error('No active session');

    try {
      const res = await api.nextQuestion({
        interviewId: currentSession.id,
        triggerFollowUp,
      });

      if (res.isFinished) {
        return { isFinished: true };
      }

      if (res.question) {
        const updatedSession: IInterviewSession = {
          ...currentSession,
          questions: [...currentSession.questions, res.question],
          currentQuestionIndex: currentSession.questions.length,
        };
        setCurrentSession(updatedSession);
        return { question: res.question, isFollowUp: res.isFollowUp };
      }

      return {};
    } catch (err: any) {
      showToast(err.message || 'Failed to generate next question', 'error');
      throw err;
    }
  };

  // Request hint
  const handleRequestHint = async (questionId: string) => {
    if (!currentSession) throw new Error('No active session');
    try {
      const res = await api.requestHint({
        interviewId: currentSession.id,
        questionId,
      });
      return res.hint;
    } catch (err: any) {
      showToast('Could not generate hint at this moment', 'error');
      return 'Consider the foundational algorithmic steps, time complexity, and data structures involved.';
    }
  };

  // Finish interview & generate report
  const handleFinishInterview = async () => {
    if (!currentSession) return;

    try {
      const res = await api.finishInterview(currentSession.id);
      setCurrentSession(res.session);
      setSelectedReportSession(res.session);
      setCurrentTab('report');
      showToast('Interview completed! Official performance report generated.', 'success');
      await refreshStatsAndHistory();
    } catch (err: any) {
      showToast(err.message || 'Failed to generate report', 'error');
    }
  };

  // Save profile updates
  const handleSaveProfile = async (updated: Partial<IUserProfile>) => {
    try {
      const saved = await api.updateProfile(updated);
      setProfile(saved);
      showToast('Profile updated successfully!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to update profile', 'error');
      throw err;
    }
  };

  // Open past interview report from history or dashboard
  const handleOpenPastInterview = async (id: string) => {
    try {
      const session = await api.getInterview(id);
      setSelectedReportSession(session);
      if (session.status === 'completed' && session.finalReport) {
        setCurrentTab('report');
      } else {
        setCurrentSession(session);
        setCurrentTab('interview');
      }
    } catch (err: any) {
      showToast(err.message || 'Could not load interview session', 'error');
    }
  };

  // Delete interview from history
  const handleDeleteInterview = async (id: string) => {
    try {
      await api.deleteInterview(id);
      showToast('Interview removed from history.', 'info');
      await refreshStatsAndHistory();
    } catch (err: any) {
      showToast(err.message || 'Failed to delete interview', 'error');
    }
  };

  // View sample demo report
  const handleViewDemoReport = () => {
    const demo = interviewsHistory.find((i) => i.id === 'interview_demo_sde_1') || interviewsHistory[0];
    if (demo) {
      setSelectedReportSession(demo);
      setCurrentTab('report');
    } else {
      setIsSetupOpen(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-slate-50 text-slate-800 antialiased selection:bg-indigo-500 selection:text-white">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-5 right-5 z-50 animate-in slide-in-from-bottom-5 duration-300">
          <div
            className={`px-4 py-3 rounded-2xl shadow-xl border text-xs font-semibold flex items-center gap-2.5 ${
              notification.type === 'success'
                ? 'bg-emerald-900 text-emerald-100 border-emerald-700'
                : notification.type === 'error'
                ? 'bg-rose-900 text-rose-100 border-rose-700'
                : 'bg-slate-900 text-slate-100 border-slate-700'
            }`}
          >
            <span>{notification.message}</span>
            <button
              onClick={() => setNotification(null)}
              className="text-slate-400 hover:text-white ml-2 text-xs"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onOpenSetup={() => setIsSetupOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
        profile={profile}
        serverStatus={serverStatus}
        hasActiveSession={!!currentSession && currentSession.status === 'in_progress'}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {currentTab === 'home' && (
          <LandingPage
            onStartInterview={() => setIsSetupOpen(true)}
            onOpenProfile={() => setIsProfileOpen(true)}
            onViewDemo={handleViewDemoReport}
          />
        )}

        {currentTab === 'interview' && currentSession && (
          <InterviewChat
            session={currentSession}
            onSubmitAnswer={handleSubmitAnswer}
            onNextQuestion={handleNextQuestion}
            onRequestHint={handleRequestHint}
            onFinishInterview={handleFinishInterview}
            onExitSession={() => setCurrentTab('home')}
          />
        )}

        {currentTab === 'report' && selectedReportSession && (
          <FinalReportView
            session={selectedReportSession}
            onRetake={() => {
              setIsSetupOpen(true);
            }}
            onGoToDashboard={() => setCurrentTab('dashboard')}
          />
        )}

        {currentTab === 'dashboard' && (
          <Dashboard
            stats={dashboardStats}
            onOpenSetup={() => setIsSetupOpen(true)}
            onSelectInterview={handleOpenPastInterview}
          />
        )}

        {currentTab === 'history' && (
          <InterviewHistory
            interviews={interviewsHistory}
            onSelectInterview={handleOpenPastInterview}
            onDeleteInterview={handleDeleteInterview}
            onStartNew={() => setIsSetupOpen(true)}
          />
        )}
      </main>

      {/* Modals */}
      <UserProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        profile={profile}
        onSave={handleSaveProfile}
      />

      <InterviewSetupModal
        isOpen={isSetupOpen}
        onClose={() => setIsSetupOpen(false)}
        onStartInterview={handleStartInterview}
        profile={profile}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}
