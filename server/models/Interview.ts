import mongoose, { Schema, Document } from 'mongoose';
import { IInterviewSession, IQuestionItem, IFinalReport } from './types.ts';

export interface IInterviewDocument extends Omit<IInterviewSession, 'id'>, Document {
  id: string;
}

const ScoreBreakdownSchema = new Schema(
  {
    relevance: { type: Number, default: 0, min: 0, max: 10 },
    correctness: { type: Number, default: 0, min: 0, max: 10 },
    completeness: { type: Number, default: 0, min: 0, max: 10 },
    clarity: { type: Number, default: 0, min: 0, max: 10 },
    communication: { type: Number, default: 0, min: 0, max: 10 },
    confidence: { type: Number, default: 0, min: 0, max: 10 },
    technicalAccuracy: { type: Number, default: 0, min: 0, max: 10 },
    overallScore: { type: Number, default: 0, min: 0, max: 10 },
  },
  { _id: false }
);

const AnswerFeedbackSchema = new Schema(
  {
    score: { type: Number, required: true, min: 0, max: 10 },
    scoreBreakdown: { type: ScoreBreakdownSchema, required: true },
    whatWasGood: { type: String, required: true },
    whatIsMissing: { type: String, required: true },
    whatShouldBeImproved: { type: String, required: true },
    strongerAnswerExample: { type: String, required: true },
    recommendedTopics: { type: [String], default: [] },
    isFollowUpTriggered: { type: Boolean, default: false },
    followUpReason: { type: String },
  },
  { _id: false }
);

const QuestionItemSchema = new Schema(
  {
    id: { type: String, required: true },
    questionNumber: { type: Number, required: true },
    questionText: { type: String, required: true },
    category: {
      type: String,
      enum: ['Technical', 'HR', 'Behavioral', 'System Design', 'DSA', 'Problem Solving'],
      required: true,
    },
    topic: { type: String, required: true },
    expectedKeyPoints: { type: [String], default: [] },
    isFollowUp: { type: Boolean, default: false },
    parentQuestionId: { type: String },
    userAnswer: { type: String },
    answeredAt: { type: String },
    feedback: { type: AnswerFeedbackSchema },
  },
  { _id: false }
);

const FinalReportSchema = new Schema(
  {
    overallScore: { type: Number, required: true },
    technicalScore: { type: Number, required: true },
    communicationScore: { type: Number, required: true },
    relevanceScore: { type: Number, required: true },
    completenessScore: { type: Number, required: true },
    strengths: { type: [String], default: [] },
    weakAreas: { type: [String], default: [] },
    correctlyAnsweredSummary: { type: [String], default: [] },
    needsImprovementSummary: { type: [String], default: [] },
    recommendedTopics: { type: [String], default: [] },
    personalizedLearningPlan: [
      {
        title: { type: String, required: true },
        description: { type: String, required: true },
        resourceOrAction: { type: String, required: true },
      },
    ],
    readinessVerdict: {
      type: String,
      enum: [
        'Ready for Real Interviews',
        'Almost Ready (Minor Polish)',
        'Needs More Practice',
        'Foundational Review Needed',
      ],
      required: true,
    },
    summaryParagraph: { type: String, required: true },
  },
  { _id: false }
);

const InterviewSchema = new Schema<IInterviewDocument>(
  {
    userId: { type: String, required: true, index: true },
    candidateProfile: {
      id: { type: String },
      name: { type: String, required: true },
      college: { type: String, required: true },
      department: { type: String, required: true },
      skills: { type: [String], default: [] },
      targetRole: { type: String, required: true },
      experienceLevel: { type: String, required: true },
      bio: { type: String },
      updatedAt: { type: String },
    },
    interviewType: {
      type: String,
      enum: ['hr', 'technical', 'mixed'],
      required: true,
    },
    jobRole: { type: String, required: true },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      required: true,
    },
    totalQuestions: { type: Number, required: true },
    currentQuestionIndex: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['in_progress', 'completed', 'abandoned'],
      default: 'in_progress',
      index: true,
    },
    questions: { type: [QuestionItemSchema], default: [] },
    finalReport: { type: FinalReportSchema },
    startedAt: { type: String, default: () => new Date().toISOString() },
    completedAt: { type: String },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_doc, ret: any) => {
        ret.id = ret._id ? ret._id.toString() : ret.id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

export const InterviewModel =
  mongoose.models.Interview || mongoose.model<IInterviewDocument>('Interview', InterviewSchema);
