export interface IUserProfile {
  id: string;
  name: string;
  college: string;
  department: string;
  skills: string[];
  targetRole: string;
  experienceLevel: 'Fresher' | 'Student (Pre-Final/Final Year)' | '1-2 Years' | 'Intern';
  bio?: string;
  updatedAt: string;
}

export type InterviewType = 'hr' | 'technical' | 'mixed';
export type JobRole = 
  | 'Software Developer' 
  | 'Java Developer' 
  | 'Python Developer' 
  | 'Data Analyst' 
  | 'AI-ML Engineer' 
  | 'Web Developer'
  | string;

export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export interface IScoreBreakdown {
  relevance: number;
  correctness: number;
  completeness: number;
  clarity: number;
  communication: number;
  confidence: number;
  technicalAccuracy: number;
  overallScore: number;
}

export interface IAnswerFeedback {
  score: number;
  scoreBreakdown: IScoreBreakdown;
  whatWasGood: string;
  whatIsMissing: string;
  whatShouldBeImproved: string;
  strongerAnswerExample: string;
  recommendedTopics: string[];
  isFollowUpTriggered?: boolean;
  followUpReason?: string;
}

export interface IQuestionItem {
  id: string;
  questionNumber: number;
  questionText: string;
  category: 'Technical' | 'HR' | 'Behavioral' | 'System Design' | 'DSA' | 'Problem Solving';
  topic: string;
  expectedKeyPoints?: string[];
  isFollowUp?: boolean;
  parentQuestionId?: string;
  userAnswer?: string;
  answeredAt?: string;
  feedback?: IAnswerFeedback;
}

export interface IFinalReport {
  overallScore: number;
  technicalScore: number;
  communicationScore: number;
  relevanceScore: number;
  completenessScore: number;
  strengths: string[];
  weakAreas: string[];
  correctlyAnsweredSummary: string[];
  needsImprovementSummary: string[];
  recommendedTopics: string[];
  personalizedLearningPlan: {
    title: string;
    description: string;
    resourceOrAction: string;
  }[];
  readinessVerdict: 'Ready for Real Interviews' | 'Almost Ready (Minor Polish)' | 'Needs More Practice' | 'Foundational Review Needed';
  summaryParagraph: string;
}

export interface IInterviewSession {
  id: string;
  userId: string;
  candidateProfile: IUserProfile;
  interviewType: InterviewType;
  jobRole: JobRole;
  difficulty: DifficultyLevel;
  totalQuestions: number;
  currentQuestionIndex: number;
  status: 'in_progress' | 'completed' | 'abandoned';
  questions: IQuestionItem[];
  finalReport?: IFinalReport;
  startedAt: string;
  completedAt?: string;
}

export interface IDashboardStats {
  totalInterviews: number;
  averageScore: number;
  bestScore: number;
  technicalAverage: number;
  hrAverage: number;
  completionRate: number;
  recentInterviews: {
    id: string;
    jobRole: string;
    interviewType: InterviewType;
    difficulty: DifficultyLevel;
    date: string;
    score: number;
    totalQuestions: number;
  }[];
  topicProficiency: {
    topic: string;
    score: number;
    count: number;
  }[];
  scoreHistory: {
    date: string;
    score: number;
    role: string;
  }[];
}
