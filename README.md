# InterviewAI – AI-Powered Interview Coach

**InterviewAI** is a full-stack, AI-powered interview practice platform designed specifically for college students, freshers, and job seekers preparing for high-stakes technical and HR interviews.

The platform simulates realistic interview rounds (Technical, HR, and Mixed), generates dynamic questions tailored to candidate profiles, listens to verbal or typed responses, performs multi-metric answer evaluations (scoring 0–10), probes deeper with intelligent follow-up questions, and produces an executive final interview performance scorecard.

---

## 🚀 Key Features

1. **Modern Responsive Landing Page**
   - Clean, professional design with instant "Start Interview" and "Practice Now" CTAs.
   - Interactive role preview cards for Software Developer, Java Developer, Python Developer, Web Developer, Data Analyst, and AI-ML Engineer.
   - Step-by-step interactive workflow and hiring committee standards.

2. **Candidate Profile Management**
   - Name, college, department/branch, experience level, custom skills chips, and career goals.
   - Dynamic prompt adaptation: the AI calibrates question depth and context based on candidate credentials.

3. **Configurable Interview Setup**
   - **Track Selection**: Technical Round, HR & Behavioral (STAR format), or Mixed.
   - **Target Role**: Software Developer, Java Developer, Python Developer, Web Developer, Data Analyst, AI-ML Engineer.
   - **Difficulty**: Easy (Campus Placements / Fundamentals), Medium (Industry Standard), Hard (FAANG / Senior scale).
   - **Question Depth**: 5-question sprint (15 min), 10-question standard (30 min), 15-question comprehensive (45 min).

4. **Dynamic AI Interviewer Engine**
   - Questions generated on-the-fly using Google Gemini 2.5 Flash.
   - Core CS coverage: Data Structures & Algorithms, Object-Oriented Design, DBMS & ACID, Concurrency, Operating Systems, Networking, and Scalability.
   - HR & Behavioral coverage: Self-introduction, strengths/weaknesses, teamwork conflicts, failure recovery, leadership, and role alignment.

5. **Multi-Factor Answer Scoring (0–10 Scale)**
   - Every response is objectively evaluated across 7 dimensions:
     1. **Relevance** (0–10)
     2. **Correctness** (0–10)
     3. **Completeness** (0–10)
     4. **Clarity** (0–10)
     5. **Communication** (0–10)
     6. **Confidence Indicators** (0–10)
     7. **Technical Accuracy** (0–10)

6. **Constructive Educational Feedback & Model Answers**
   - **What Was Good**: Positive reinforcement of correct assumptions and structure.
   - **What Is Missing**: Concrete gaps, omitted edge cases, or lack of scale metrics.
   - **Actionable Advice**: How to upgrade delivery and technical precision.
   - **Senior Model Answer**: Benchmark exemplary answer for study.
   - **Recommended Topics**: Targeted study concepts.

7. **Adaptive Follow-Up Probing**
   - If an answer touches upon an intriguing technical concept or leaves an edge case ambiguous, the AI interviewer naturally asks a follow-up question.

8. **Voice Recognition & Speech Synthesis**
   - **Speech-to-Text**: Dictate your answer naturally using the browser's Web Speech API.
   - **AI Voice Narration**: Click to have the interviewer speak questions aloud.

9. **Comprehensive Performance Scorecard**
   - Overall readiness score (0–100) and readiness verdict:
     - *Ready for Real Interviews*
     - *Almost Ready (Minor Polish)*
     - *Needs More Practice*
     - *Foundational Review Needed*
   - Technical, Communication, Relevance, and Completeness breakdown dials.
   - Key Strengths vs Priority Weak Areas.
   - Actionable 3-part study curriculum with concrete resources.
   - Question-by-question review with filters.
   - One-click Print/PDF export.

10. **Analytics Dashboard & History Archive**
    - Progression graph over time.
    - Topic proficiency radar bars (DSA, DBMS, Concurrency, Web, System Design, HR).
    - Session archive saved in MongoDB (or local persistent storage) with full report reload.

---

## 🛠 Tech Stack

### Frontend
- **React 19**
- **Vite 8**
- **Tailwind CSS v4**
- **Lucide Icons**
- **Web Speech API** (Speech Recognition & Speech Synthesis)

### Backend
- **Node.js**
- **Express.js 4**
- **TypeScript & tsx**
- **RESTful API Architecture**

### Database & Storage
- **MongoDB & Mongoose 8**
- **MongoDB Atlas** compatible
- **Zero-Friction Fallback**: High-performance in-memory & file persistence if `MONGODB_URI` is not provided.

### AI Engine
- **Google Gen AI SDK (`@google/genai`)**
- **Gemini 2.5 Flash** with JSON Schema structured outputs.
- Offline heuristics and dynamic question bank fallback for zero-downtime development.

---

## 📁 Project Structure

```text
/
├── server/                       # Backend Express REST API
│   ├── controllers/
│   │   ├── interviewController.ts # Session start, answer evaluation, next question, hint, report
│   │   ├── profileController.ts   # Candidate profile CRUD
│   │   └── statsController.ts     # Aggregated analytics for dashboard
│   ├── db/
│   │   ├── connection.ts          # MongoDB Atlas connection manager with fallback
│   │   └── storage.ts             # Unified storage layer (Mongoose + local memory/disk)
│   ├── middleware/
│   │   └── errorHandler.ts        # Global Express error handler
│   ├── models/
│   │   ├── types.ts               # Core TypeScript interfaces (Session, Question, Feedback)
│   │   ├── User.ts                # Mongoose User schema
│   │   └── Interview.ts           # Mongoose Interview, Question, & FinalReport schemas
│   ├── routes/
│   │   ├── interviewRoutes.ts     # /api/interviews endpoints
│   │   ├── profileRoutes.ts       # /api/profile endpoints
│   │   ├── statsRoutes.ts         # /api/stats endpoints
│   │   └── index.ts               # API router aggregation & health check
│   ├── services/
│   │   ├── gemini.ts              # Gemini 2.5 Flash client with structured JSON prompts
│   │   └── questionBank.ts        # Comprehensive CS & HR question bank with key points
│   ├── app.ts                     # Express app setup and middleware
│   └── server.ts                  # Standalone production server
│
├── src/                          # Frontend React Client
│   ├── components/
│   │   ├── Dashboard.tsx          # Analytics, progress line chart, topic proficiency
│   │   ├── FinalReportView.tsx    # Comprehensive performance scorecard & study curriculum
│   │   ├── Footer.tsx             # Clean footer with prep guidelines
│   │   ├── InterviewChat.tsx      # Interactive chat, voice STT, TTS, instant feedback
│   │   ├── InterviewHistory.tsx   # Past interview archive, search, and report viewer
│   │   ├── InterviewSetupModal.tsx# Wizard for role, difficulty, track, and question count
│   │   ├── LandingPage.tsx        # Modern hero, role explorer, workflow, features
│   │   ├── Navbar.tsx             # Sticky navigation, status pill, profile trigger
│   │   └── UserProfileModal.tsx   # Candidate credentials and skills chips
│   ├── services/
│   │   └── api.ts                 # Type-safe fetch client for REST endpoints
│   ├── types/
│   │   └── interview.ts           # Shared frontend TypeScript interfaces
│   ├── App.tsx                    # Root component with routing and state
│   ├── index.css                  # Tailwind CSS global styles
│   └── main.tsx                   # React root entrypoint
│
├── .env.example                  # Environment variables template
├── metadata.json                 # AI Studio project configuration
├── package.json                  # Dependencies and execution scripts
├── tsconfig.json                 # TypeScript compiler options
└── vite.config.ts                # Vite dev server with Express Connect middleware
```

---

## ⚙️ Installation & Setup

### 1. Prerequisites
- **Node.js** >= 18.0.0
- **npm** or **bun**

### 2. Clone and Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the root directory (refer to `.env.example`):
```env
# Google Gemini API Key (injected automatically in AI Studio)
GEMINI_API_KEY="your-gemini-api-key-here"

# Optional MongoDB Atlas connection string
# If omitted, InterviewAI will automatically use the built-in local persistence engine.
MONGODB_URI="mongodb+srv://<username>:<password>@cluster.mongodb.net/interviewai?retryWrites=true&w=majority"

# Port (defaults to 3000)
PORT="3000"
```

---

## 🏃 Running the Application

### Development Mode (Full-Stack)
Vite runs the frontend on port 3000 and mounts the Express REST API under `/api` via the custom Express plugin:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build & Deployment
Build the client and start the standalone Express server:
```bash
npm run build
npm run start
```

---

## 📡 REST API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Health check, AI status, and database engine type |
| `GET` | `/api/profile` | Get candidate profile |
| `PUT` | `/api/profile` | Update candidate profile & skills |
| `POST` | `/api/interviews/start` | Initialize interview session & generate Q1 |
| `GET` | `/api/interviews` | List all previous interview sessions |
| `GET` | `/api/interviews/:id` | Get single session transcript and report |
| `POST` | `/api/interviews/:id/answer` | Submit answer & receive instant 7-factor evaluation |
| `POST` | `/api/interviews/:id/next` | Generate next question or follow-up question |
| `POST` | `/api/interviews/:id/hint` | Request guiding hint without spoiling answer |
| `POST` | `/api/interviews/:id/finish` | Conclude session & generate final report |
| `DELETE` | `/api/interviews/:id` | Delete interview from history |
| `GET` | `/api/stats` | Aggregated dashboard metrics & charts |

---

## 💡 Future Enhancements
- Video / WebCam posture and eye-contact confidence feedback using computer vision.
- Live collaborative whiteboard for system design diagrams.
- Real-time compiler for live Python/Java/JS code execution within the chat.
- Peer mock interviews with real-time audio rooms.
