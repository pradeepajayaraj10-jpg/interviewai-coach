import { IUserProfile, IInterviewSession, IDashboardStats } from '../models/types.ts';
import { isMongoActive } from './connection.ts';
import { UserModel } from '../models/User.ts';
import { InterviewModel } from '../models/Interview.ts';

// In-Memory Storage fallback
let memoryUser: IUserProfile = {
  id: 'user_default',
  name: 'Alex Sharma',
  college: 'National Institute of Technology',
  department: 'Computer Science and Engineering',
  skills: ['Data Structures', 'Algorithms', 'React', 'Node.js', 'Python', 'SQL'],
  targetRole: 'Software Developer',
  experienceLevel: 'Fresher',
  bio: 'Passionate CS student preparing for software engineering and SDE-1 placement rounds.',
  updatedAt: new Date().toISOString(),
};

const memoryInterviews: Map<string, IInterviewSession> = new Map();

// Seed initial sample interview for immediate demo richness
function seedDemoData() {
  if (memoryInterviews.size > 0) return;

  const demoSessionId = 'interview_demo_sde_1';
  const sampleSession: IInterviewSession = {
    id: demoSessionId,
    userId: memoryUser.id,
    candidateProfile: { ...memoryUser },
    interviewType: 'mixed',
    jobRole: 'Software Developer',
    difficulty: 'medium',
    totalQuestions: 5,
    currentQuestionIndex: 5,
    status: 'completed',
    startedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    completedAt: new Date(Date.now() - 86400000 * 2 + 1800000).toISOString(),
    questions: [
      {
        id: 'q_demo_1',
        questionNumber: 1,
        category: 'HR',
        topic: 'Introduction & Career Motivations',
        questionText: 'Tell me about yourself, your technical background, and what drives you to pursue a Software Developer role.',
        expectedKeyPoints: ['Academic background', 'Projects completed', 'Technical strengths', 'Passion for solving problems'],
        userAnswer: 'Hello! I am a final-year Computer Science student at NIT. I enjoy building web applications using React, Node.js, and working on algorithmic challenges on LeetCode. I recently built a full-stack real-time collaboration tool and an automated campus event portal. I love breaking down complex system requirements into modular, scalable code, which is why I want to work as a Software Developer.',
        answeredAt: new Date(Date.now() - 86400000 * 2 + 300000).toISOString(),
        feedback: {
          score: 8.8,
          scoreBreakdown: {
            relevance: 9.0,
            correctness: 9.0,
            completeness: 8.5,
            clarity: 9.0,
            communication: 9.0,
            confidence: 8.5,
            technicalAccuracy: 8.5,
            overallScore: 8.8,
          },
          whatWasGood: 'Strong concise structure, clear mention of your stack (React, Node.js), projects, and passion for engineering.',
          whatIsMissing: 'Could quantify impact or mention how your project handled user scale or optimization challenges.',
          whatShouldBeImproved: 'Add 1 sentence on specific achievements or metrics from your projects (e.g. 500+ active users or latency reduced).',
          strongerAnswerExample: 'I am a final-year CS undergrad specializing in full-stack distributed systems. Over the past two years, I built a real-time collaboration tool supporting 200 concurrent users using WebSockets and Redis. I practice DSA regularly (solved 300+ problems), and I am passionate about writing clean, maintainable software that delivers measurable business value.',
          recommendedTopics: ['STAR method for storytelling', 'Quantifiable project outcomes', 'Team leadership examples'],
        },
      },
      {
        id: 'q_demo_2',
        questionNumber: 2,
        category: 'Technical',
        topic: 'Data Structures & Algorithms',
        questionText: 'Can you explain the difference between a HashMap and a TreeMap? When would you choose one over the other in terms of time complexity?',
        expectedKeyPoints: ['Hash table vs balanced BST (Red-Black tree)', 'O(1) average vs O(log n) guaranteed', 'Ordering guarantees', 'Handling null keys'],
        userAnswer: 'A HashMap is implemented using an array of buckets with hashing and chaining for collisions. Its average time complexity for lookup, insert, and delete is O(1), but in the worst case with bad collisions it degrades to O(n) or O(log n) in Java 8. A TreeMap is implemented using a self-balancing Red-Black binary search tree. Operations like get, put, and remove take O(log n) time. I would use HashMap when I need fast average lookups and do not care about element ordering. I would choose TreeMap when keys need to remain sorted or when range queries (like subMap or finding floor/ceiling keys) are required.',
        answeredAt: new Date(Date.now() - 86400000 * 2 + 700000).toISOString(),
        feedback: {
          score: 9.5,
          scoreBreakdown: {
            relevance: 10.0,
            correctness: 9.5,
            completeness: 9.5,
            clarity: 9.5,
            communication: 9.0,
            confidence: 9.5,
            technicalAccuracy: 9.5,
            overallScore: 9.5,
          },
          whatWasGood: 'Exceptional clarity! You rightly identified Red-Black tree internals, Java 8 treeification, O(1) vs O(log n) tradeoffs, and specific use-cases like range queries.',
          whatIsMissing: 'Only minor: you could mention memory overhead differences or how HashMap requires consistent hashCode and equals implementations.',
          whatShouldBeImproved: 'Mention that custom objects as keys in HashMap require overriding equals() and hashCode() contract.',
          strongerAnswerExample: 'Your answer is already top-tier! Just adding: "Keep in mind HashMap requires proper hashCode() and equals() implementations to prevent collision clustering, whereas TreeMap relies on Comparable or a custom Comparator."',
          recommendedTopics: ['Hash collision resolution strategies', 'Red-Black tree properties', 'Cache locality in arrays vs tree pointers'],
        },
      },
      {
        id: 'q_demo_3',
        questionNumber: 3,
        category: 'Technical',
        topic: 'DBMS & Concurrency',
        questionText: 'What are the ACID properties in database management systems, and why is Isolation particularly challenging in distributed environments?',
        expectedKeyPoints: ['Atomicity', 'Consistency', 'Isolation', 'Durability', 'Isolation levels (Dirty read, Non-repeatable, Phantom)', 'Distributed consensus & latency'],
        userAnswer: 'ACID stands for Atomicity (all or nothing), Consistency (preserves database integrity rules), Isolation (concurrent transactions execute independently without interference), and Durability (committed changes persist even after crash). Isolation is tough in distributed systems because multiple nodes might accept concurrent writes. Ensuring serializability requires distributed locks or 2-Phase Commit (2PC) or Raft consensus, which increases network latency and risks deadlocks. Hence systems often trade isolation down to Snapshot Isolation or Read Committed to maintain high throughput.',
        answeredAt: new Date(Date.now() - 86400000 * 2 + 1100000).toISOString(),
        feedback: {
          score: 9.2,
          scoreBreakdown: {
            relevance: 9.5,
            correctness: 9.5,
            completeness: 9.0,
            clarity: 9.0,
            communication: 9.0,
            confidence: 9.0,
            technicalAccuracy: 9.2,
            overallScore: 9.2,
          },
          whatWasGood: 'Accurate breakdown of each acronym letter and great insight into distributed locking, 2PC, and CAP theorem trade-offs.',
          whatIsMissing: 'Could briefly define common anomalies like dirty reads, non-repeatable reads, or phantom reads.',
          whatShouldBeImproved: 'Provide an example like concurrent ticket booking or balance transfer.',
          strongerAnswerExample: 'ACID guarantees database reliability. Atomicity (all-or-none execution), Consistency (schema constraints preserved), Isolation (transactions isolated from concurrent reads/writes), and Durability (WAL commits written to disk). Isolation is difficult in distributed systems due to network partitions and clock drift. To prevent anomalies like write skew or dirty reads, distributed systems use algorithms like Paxos/Raft or Google Spanner TrueTime for external consistency, trading off some latency.',
          recommendedTopics: ['Isolation Levels (Read Committed, Repeatable Read, Serializable)', 'Distributed 2PC vs Sagas', 'CAP Theorem vs PACELC'],
        },
      },
    ],
    finalReport: {
      overallScore: 91,
      technicalScore: 93,
      communicationScore: 89,
      relevanceScore: 95,
      completenessScore: 88,
      strengths: [
        'Deep grasp of core Computer Science fundamentals (OOP, Red-Black Trees, ACID guarantees)',
        'Structured, articulate communication with concise technical terminology',
        'Strong awareness of trade-offs between speed and space/guarantees in system design',
      ],
      weakAreas: [
        'Occasional lack of quantifiable impact metrics when describing personal projects',
        'Could proactively supply concrete real-world code snippets or failure scenario examples',
      ],
      correctlyAnsweredSummary: [
        'Detailed comparison between HashMap & TreeMap with complexity analysis',
        'Comprehensive explanation of ACID transactions and distributed isolation tradeoffs',
      ],
      needsImprovementSummary: [
        'In corporate HR answers, consistently apply the STAR (Situation, Task, Action, Result) methodology',
      ],
      recommendedTopics: [
        'System Design Primer: Distributed Locking & Redis Redlock',
        'High-concurrency database isolation anomalies & MVCC',
        'STAR behavioral interview response crafting',
      ],
      personalizedLearningPlan: [
        {
          title: 'Review MVCC (Multi-Version Concurrency Control)',
          description: 'Study how PostgreSQL and MySQL InnoDB implement MVCC to achieve Snapshot Isolation without blocking readers.',
          resourceOrAction: 'Read Chapter 7 (Transactions) of Designing Data-Intensive Applications by Martin Kleppmann.',
        },
        {
          title: 'Master Behavioral STAR Stories',
          description: 'Draft 4 distinct 2-minute stories covering a difficult bug, a conflict with a peer, an ambiguous specification, and a tight deadline.',
          resourceOrAction: 'Prepare a 1-page cheatsheet with exact metrics (e.g. latency cut by 40%, 1500 daily requests).',
        },
      ],
      readinessVerdict: 'Ready for Real Interviews',
      summaryParagraph: 'Alex demonstrated outstanding readiness for SDE-1 software engineering roles. The candidate communicates with precision, understands underlying memory and database architectures, and readily explains engineering trade-offs.',
    },
  };

  memoryInterviews.set(sampleSession.id, sampleSession);
}

seedDemoData();

export const StorageService = {
  async getProfile(): Promise<IUserProfile> {
    if (isMongoActive()) {
      try {
        const user = await UserModel.findOne();
        if (user) return user.toJSON() as IUserProfile;
      } catch (err) {
        console.error('Mongo getProfile error:', err);
      }
    }
    return { ...memoryUser };
  },

  async updateProfile(updates: Partial<IUserProfile>): Promise<IUserProfile> {
    memoryUser = {
      ...memoryUser,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    if (isMongoActive()) {
      try {
        const user = await UserModel.findOneAndUpdate(
          {},
          { $set: memoryUser },
          { upsert: true, new: true }
        );
        if (user) return user.toJSON() as IUserProfile;
      } catch (err) {
        console.error('Mongo updateProfile error:', err);
      }
    }

    return { ...memoryUser };
  },

  async createInterview(session: IInterviewSession): Promise<IInterviewSession> {
    memoryInterviews.set(session.id, session);

    if (isMongoActive()) {
      try {
        const created = await InterviewModel.create(session);
        return created.toJSON() as IInterviewSession;
      } catch (err) {
        console.error('Mongo createInterview error:', err);
      }
    }

    return session;
  },

  async getInterview(id: string): Promise<IInterviewSession | null> {
    if (isMongoActive()) {
      try {
        const found = await InterviewModel.findOne({ id });
        if (found) return found.toJSON() as IInterviewSession;
      } catch (err) {
        console.error('Mongo getInterview error:', err);
      }
    }

    const session = memoryInterviews.get(id);
    return session ? { ...session } : null;
  },

  async updateInterview(id: string, updates: Partial<IInterviewSession>): Promise<IInterviewSession | null> {
    const existing = memoryInterviews.get(id);
    if (!existing) {
      if (!isMongoActive()) return null;
    }

    const updatedSession: IInterviewSession = {
      ...(existing || ({} as IInterviewSession)),
      ...updates,
    };
    memoryInterviews.set(id, updatedSession);

    if (isMongoActive()) {
      try {
        const updated = await InterviewModel.findOneAndUpdate(
          { id },
          { $set: updates },
          { new: true }
        );
        if (updated) return updated.toJSON() as IInterviewSession;
      } catch (err) {
        console.error('Mongo updateInterview error:', err);
      }
    }

    return updatedSession;
  },

  async listInterviews(): Promise<IInterviewSession[]> {
    if (isMongoActive()) {
      try {
        const list = await InterviewModel.find().sort({ startedAt: -1 }).limit(50);
        if (list && list.length > 0) {
          return list.map((doc) => doc.toJSON() as IInterviewSession);
        }
      } catch (err) {
        console.error('Mongo listInterviews error:', err);
      }
    }

    return Array.from(memoryInterviews.values()).sort(
      (a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()
    );
  },

  async deleteInterview(id: string): Promise<boolean> {
    memoryInterviews.delete(id);
    if (isMongoActive()) {
      try {
        await InterviewModel.deleteOne({ id });
      } catch (err) {
        console.error('Mongo deleteInterview error:', err);
      }
    }
    return true;
  },

  async getStats(): Promise<IDashboardStats> {
    const interviews = await this.listInterviews();
    const completed = interviews.filter((i) => i.status === 'completed' && i.finalReport);

    if (completed.length === 0) {
      return {
        totalInterviews: interviews.length,
        averageScore: 0,
        bestScore: 0,
        technicalAverage: 0,
        hrAverage: 0,
        completionRate: interviews.length > 0 ? 0 : 100,
        recentInterviews: [],
        topicProficiency: [],
        scoreHistory: [],
      };
    }

    const scores = completed.map((i) => i.finalReport!.overallScore);
    const avgScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
    const bestScore = Math.max(...scores);

    const techScores = completed.map((i) => i.finalReport!.technicalScore).filter((s) => s > 0);
    const hrScores = completed.map((i) => i.finalReport!.communicationScore).filter((s) => s > 0);

    const techAvg = techScores.length ? Math.round(techScores.reduce((a, b) => a + b, 0) / techScores.length) : 80;
    const hrAvg = hrScores.length ? Math.round(hrScores.reduce((a, b) => a + b, 0) / hrScores.length) : 85;

    // Collect topic scores from questions
    const topicMap: Record<string, { total: number; count: number }> = {};
    for (const interview of completed) {
      for (const q of interview.questions) {
        if (q.feedback && q.topic) {
          if (!topicMap[q.topic]) topicMap[q.topic] = { total: 0, count: 0 };
          topicMap[q.topic].total += q.feedback.score * 10;
          topicMap[q.topic].count += 1;
        }
      }
    }

    const topicProficiency = Object.entries(topicMap).map(([topic, data]) => ({
      topic,
      score: Math.round(data.total / data.count),
      count: data.count,
    })).sort((a, b) => b.count - a.count).slice(0, 6);

    const recentInterviews = interviews.slice(0, 10).map((i) => ({
      id: i.id,
      jobRole: i.jobRole,
      interviewType: i.interviewType,
      difficulty: i.difficulty,
      date: i.startedAt,
      score: i.finalReport ? i.finalReport.overallScore : 0,
      totalQuestions: i.questions.length,
    }));

    const scoreHistory = completed.slice(-10).map((i) => ({
      date: new Date(i.startedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      score: i.finalReport!.overallScore,
      role: i.jobRole,
    }));

    return {
      totalInterviews: interviews.length,
      averageScore: avgScore,
      bestScore,
      technicalAverage: techAvg,
      hrAverage: hrAvg,
      completionRate: Math.round((completed.length / interviews.length) * 100),
      recentInterviews,
      topicProficiency,
      scoreHistory,
    };
  },
};
