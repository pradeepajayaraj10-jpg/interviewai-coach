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
  relevance: number;        // 0-10
  correctness: number;      // 0-10
  completeness: number;     // 0-10
  clarity: number;          // 0-10
  communication: number;    // 0-10
  confidence: number;       // 0-10
  technicalAccuracy: number;// 0-10
  overallScore: number;     // 0-10
}

export interface IAnswerFeedback {
  score: number;            // 0-10
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
  overallScore: number;        // 0-100 scale
  technicalScore: number;      // 0-100
  communicationScore: number;  // 0-100
  relevanceScore: number;      // 0-100
  completenessScore: number;   // 0-100
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
