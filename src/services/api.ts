import {
  IUserProfile,
  IInterviewSession,
  IDashboardStats,
  IAnswerFeedback,
  IQuestionItem,
  IFinalReport,
  InterviewType,
  JobRole,
  DifficultyLevel,
} from '../types/interview.ts';

const BASE_URL = '/api';

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  const json = await res.json();
  if (!res.ok || json.success === false) {
    throw new Error(json.message || `Request failed with status ${res.status}`);
  }
  return json.data !== undefined ? json.data : json;
}

export const api = {
  // Health
  async getHealth(): Promise<{ status: string; aiConfigured: boolean; database: string }> {
    return request('/health');
  },

  // User Profile
  async getProfile(): Promise<IUserProfile> {
    return request('/profile');
  },

  async updateProfile(profile: Partial<IUserProfile>): Promise<IUserProfile> {
    return request('/profile', {
      method: 'PUT',
      body: JSON.stringify(profile),
    });
  },

  // Interviews
  async startInterview(params: {
    interviewType: InterviewType;
    jobRole: JobRole;
    difficulty: DifficultyLevel;
    totalQuestions: number;
    customSkills?: string[];
  }): Promise<{
    session: IInterviewSession;
    currentQuestion: IQuestionItem;
    isAIActive: boolean;
  }> {
    return request('/interviews/start', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  },

  async submitAnswer(params: {
    interviewId: string;
    questionId: string;
    answer: string;
  }): Promise<{
    feedback: IAnswerFeedback;
    question: IQuestionItem;
    isFollowUpTriggered: boolean;
    followUpReason?: string;
    isCompleted: boolean;
  }> {
    return request(`/interviews/${params.interviewId}/answer`, {
      method: 'POST',
      body: JSON.stringify({
        questionId: params.questionId,
        answer: params.answer,
      }),
    });
  },

  async nextQuestion(params: {
    interviewId: string;
    triggerFollowUp?: boolean;
  }): Promise<{
    question?: IQuestionItem;
    isFollowUp?: boolean;
    isFinished?: boolean;
    message?: string;
    currentQuestionIndex: number;
    totalQuestions: number;
  }> {
    return request(`/interviews/${params.interviewId}/next`, {
      method: 'POST',
      body: JSON.stringify({
        triggerFollowUp: !!params.triggerFollowUp,
      }),
    });
  },

  async requestHint(params: {
    interviewId: string;
    questionId: string;
  }): Promise<{ hint: string }> {
    return request(`/interviews/${params.interviewId}/hint`, {
      method: 'POST',
      body: JSON.stringify({ questionId: params.questionId }),
    });
  },

  async finishInterview(interviewId: string): Promise<{
    session: IInterviewSession;
    report: IFinalReport;
  }> {
    return request(`/interviews/${interviewId}/finish`, {
      method: 'POST',
    });
  },

  async getInterview(interviewId: string): Promise<IInterviewSession> {
    return request(`/interviews/${interviewId}`);
  },

  async listInterviews(): Promise<IInterviewSession[]> {
    return request('/interviews');
  },

  async deleteInterview(interviewId: string): Promise<{ success: boolean }> {
    return request(`/interviews/${interviewId}`, {
      method: 'DELETE',
    });
  },

  // Stats
  async getStats(): Promise<IDashboardStats> {
    return request('/stats');
  },
};
