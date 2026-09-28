import { IQuestionItem, DifficultyLevel, JobRole, InterviewType } from '../models/types.ts';

export interface BankQuestion {
  id: string;
  category: 'Technical' | 'HR' | 'Behavioral' | 'System Design' | 'DSA' | 'Problem Solving';
  topic: string;
  questionText: string;
  expectedKeyPoints: string[];
  difficulty: DifficultyLevel;
  applicableRoles: string[];
  type: 'hr' | 'technical';
}

export const QUESTION_BANK: BankQuestion[] = [
  // HR Questions
  {
    id: 'hr_intro_1',
    category: 'HR',
    topic: 'Introduction & Self-Presentation',
    questionText: 'Can you introduce yourself, highlighting your academic journey, technical passions, and what inspired you to pursue this role?',
    expectedKeyPoints: ['Academic background', 'Key tech stack & projects', 'Inspiration/passion for technology', 'Current career goals'],
    difficulty: 'easy',
    applicableRoles: ['all'],
    type: 'hr',
  },
  {
    id: 'hr_strengths_weaknesses',
    category: 'HR',
    topic: 'Self-Awareness & Growth',
    questionText: 'What do you consider your greatest technical strength, and what is one area or skill you are actively working to improve?',
    expectedKeyPoints: ['Concrete technical strength with example', 'Honest non-cliché weakness', 'Actionable steps taken to improve'],
    difficulty: 'easy',
    applicableRoles: ['all'],
    type: 'hr',
  },
  {
    id: 'hr_why_hire_you',
    category: 'HR',
    topic: 'Value Proposition & Role Fit',
    questionText: 'With many capable candidates applying for this position, why should our team hire you? What unique value do you bring?',
    expectedKeyPoints: ['Intersection of skills and role needs', 'Fast learning curve & adaptability', 'Dedication and problem-solving mindset'],
    difficulty: 'medium',
    applicableRoles: ['all'],
    type: 'hr',
  },
  {
    id: 'hr_teamwork_conflict',
    category: 'Behavioral',
    topic: 'Teamwork & Collaboration',
    questionText: 'Describe a situation during a college project or internship where you had a strong disagreement with a teammate over an implementation choice. How did you resolve it?',
    expectedKeyPoints: ['STAR format (Situation, Task, Action, Result)', 'Objective evaluation of trade-offs', 'Professional communication', 'Positive outcome'],
    difficulty: 'medium',
    applicableRoles: ['all'],
    type: 'hr',
  },
  {
    id: 'hr_failure_resilience',
    category: 'Behavioral',
    topic: 'Resilience & Problem Solving',
    questionText: 'Can you tell me about a time a project or technical task didn’t go as planned or failed completely? How did you respond, and what did you learn?',
    expectedKeyPoints: ['Accountability without blaming others', 'Root-cause analysis', 'Course correction', 'Long-term learning'],
    difficulty: 'medium',
    applicableRoles: ['all'],
    type: 'hr',
  },
  {
    id: 'hr_career_goals',
    category: 'HR',
    topic: 'Career Vision & Ambition',
    questionText: 'Where do you see yourself in the next 3 to 5 years in your engineering journey, and how does this role align with that trajectory?',
    expectedKeyPoints: ['Realistic technical growth milestones', 'Mentorship or architecture interest', 'Alignment with software industry practices'],
    difficulty: 'hard',
    applicableRoles: ['all'],
    type: 'hr',
  },
  {
    id: 'hr_leadership_initiative',
    category: 'Behavioral',
    topic: 'Initiative & Ownership',
    questionText: 'Give an example of a time you took the initiative to learn a new framework or solve an unassigned issue without being told to do so.',
    expectedKeyPoints: ['Proactive mindset', 'Self-directed research', 'Tangible impact on project or peers'],
    difficulty: 'hard',
    applicableRoles: ['all'],
    type: 'hr',
  },

  // Technical - Software Developer & General CS
  {
    id: 'tech_oop_pillars',
    category: 'Technical',
    topic: 'Object-Oriented Programming',
    questionText: 'Explain the four fundamental pillars of Object-Oriented Programming (OOP) and give a practical real-world software design example for Polymorphism.',
    expectedKeyPoints: ['Encapsulation, Abstraction, Inheritance, Polymorphism', 'Compile-time (Overloading) vs Runtime (Overriding)', 'Interface-based design'],
    difficulty: 'easy',
    applicableRoles: ['Software Developer', 'Java Developer', 'Python Developer', 'Web Developer'],
    type: 'technical',
  },
  {
    id: 'tech_dsa_hash_collision',
    category: 'DSA',
    topic: 'Data Structures & Algorithms',
    questionText: 'How does a Hash Table handle key collisions? Explain Separate Chaining vs Open Addressing (Linear Probing), and what happens when the load factor exceeds its threshold.',
    expectedKeyPoints: ['Hash function & bucket indexing', 'Separate Chaining with linked lists/balanced trees', 'Open addressing & clustering', 'Dynamic rehashing / doubling table size'],
    difficulty: 'medium',
    applicableRoles: ['Software Developer', 'Java Developer', 'Python Developer', 'Web Developer', 'AI-ML Engineer'],
    type: 'technical',
  },
  {
    id: 'tech_os_process_thread',
    category: 'Technical',
    topic: 'Operating Systems & Concurrency',
    questionText: 'What is the fundamental difference between a Process and a Thread? How do context switching costs and shared memory spaces differ between them?',
    expectedKeyPoints: ['Independent virtual memory address space vs shared heap/code', 'Thread lightweight context switch', 'Inter-process communication (IPC) vs shared memory synchronization (Mutex/Semaphore)'],
    difficulty: 'easy',
    applicableRoles: ['Software Developer', 'Java Developer', 'Python Developer'],
    type: 'technical',
  },
  {
    id: 'tech_dbms_indexing',
    category: 'Technical',
    topic: 'Database Management Systems',
    questionText: 'How do database indexes (specifically B-Trees/B+ Trees) accelerate SELECT queries? What are the trade-offs on INSERT, UPDATE, and DELETE operations?',
    expectedKeyPoints: ['B+ Tree node structure and fan-out', 'Logarithmic lookup time O(log n)', 'Write amplification on index maintenance', 'Clustered vs Non-clustered indexing'],
    difficulty: 'medium',
    applicableRoles: ['Software Developer', 'Java Developer', 'Python Developer', 'Data Analyst', 'Web Developer'],
    type: 'technical',
  },
  {
    id: 'tech_network_tcp_udp',
    category: 'Technical',
    topic: 'Computer Networks',
    questionText: 'Compare TCP and UDP in terms of reliability, flow control, and header overhead. In what scenarios would you explicitly choose UDP over TCP?',
    expectedKeyPoints: ['3-way handshake & connection-oriented vs connectionless', 'Acknowledgements, retransmission, sliding window', 'Low latency vs guaranteed delivery', 'Use cases: VoIP, live video streaming, DNS, online multiplayer gaming'],
    difficulty: 'easy',
    applicableRoles: ['Software Developer', 'Java Developer', 'Python Developer', 'Web Developer'],
    type: 'technical',
  },
  {
    id: 'tech_sys_design_cache',
    category: 'System Design',
    topic: 'System Design & Scalability',
    questionText: 'Explain how you would implement a Caching strategy (e.g. Redis) in a high-traffic web application. What are cache-aside, write-through, and how do you handle cache invalidation?',
    expectedKeyPoints: ['In-memory key-value stores', 'Cache-aside (read through) pattern', 'Write-through vs Write-back', 'TTL, LRU eviction, stampede mitigation'],
    difficulty: 'hard',
    applicableRoles: ['Software Developer', 'Java Developer', 'Python Developer', 'Web Developer'],
    type: 'technical',
  },

  // Technical - Java Developer
  {
    id: 'java_jvm_memory',
    category: 'Technical',
    topic: 'Java Architecture & Memory Model',
    questionText: 'Walk me through the Java Virtual Machine (JVM) memory architecture. How do the Heap, Stack, Metaspace, and Garbage Collector (e.g. G1/ZGC) interact during object creation and lifecycle?',
    expectedKeyPoints: ['Heap (Eden, Survivor, Tenured) for object allocation', 'Stack for frame calls & local primitives', 'Generational GC hypothesis', 'Stop-the-world pauses & garbage collection phases'],
    difficulty: 'medium',
    applicableRoles: ['Java Developer', 'Software Developer'],
    type: 'technical',
  },
  {
    id: 'java_concurrency_volatiles',
    category: 'Technical',
    topic: 'Java Concurrency & Multi-threading',
    questionText: 'What is the purpose of the `volatile` keyword in Java? How does it differ from `synchronized` blocks and `AtomicInteger` regarding visibility and atomicity?',
    expectedKeyPoints: ['CPU cache coherency and memory barrier (happens-before)', 'Visibility guarantee of volatile vs non-atomic compound operations (e.g. i++)', 'Synchronized intrinsic locks', 'CAS (Compare-And-Swap) in java.util.concurrent.atomic'],
    difficulty: 'hard',
    applicableRoles: ['Java Developer', 'Software Developer'],
    type: 'technical',
  },
  {
    id: 'java_spring_ioc_di',
    category: 'Technical',
    topic: 'Spring Framework & Design Patterns',
    questionText: 'Explain the concepts of Inversion of Control (IoC) and Dependency Injection (DI) in the Spring Boot ecosystem. Why is constructor injection favored over field injection (@Autowired)?',
    expectedKeyPoints: ['ApplicationContext and Bean lifecycle', 'Decoupling object creation from business logic', 'Immutability, testability (mocking), preventing NPEs with constructor injection'],
    difficulty: 'medium',
    applicableRoles: ['Java Developer', 'Software Developer', 'Web Developer'],
    type: 'technical',
  },

  // Technical - Python Developer
  {
    id: 'py_gil_multiprocess',
    category: 'Technical',
    topic: 'Python Internals & Concurrency',
    questionText: 'What is Python’s Global Interpreter Lock (GIL)? How does it impact CPU-bound vs I/O-bound tasks, and how would you achieve true parallelism in Python?',
    expectedKeyPoints: ['Reference counting memory safety in CPython', 'Thread lock preventing simultaneous bytecode execution', 'I/O bound works well with asyncio/threading', 'CPU-bound requires multiprocessing or C extensions'],
    difficulty: 'medium',
    applicableRoles: ['Python Developer', 'AI-ML Engineer', 'Data Analyst', 'Software Developer'],
    type: 'technical',
  },
  {
    id: 'py_generators_iterators',
    category: 'Technical',
    topic: 'Python Core & Memory Optimization',
    questionText: 'Explain the difference between a normal Python list and a Generator using the `yield` keyword. When processing a 10 GB log file, why is a generator critical?',
    expectedKeyPoints: ['Lazy evaluation vs eager loading in memory', 'Iterator protocol (__iter__, __next__)', 'O(1) memory footprint for streaming data'],
    difficulty: 'easy',
    applicableRoles: ['Python Developer', 'Data Analyst', 'AI-ML Engineer', 'Software Developer'],
    type: 'technical',
  },
  {
    id: 'py_decorators',
    category: 'Technical',
    topic: 'Advanced Python Metaprogramming',
    questionText: 'How do Decorators work under the hood in Python? Write or explain the structure of a decorator that measures and logs the execution time of any function.',
    expectedKeyPoints: ['First-class functions & closures', 'Higher-order function taking and returning function', '*args, **kwargs forwarding', 'functools.wraps preserving metadata'],
    difficulty: 'medium',
    applicableRoles: ['Python Developer', 'AI-ML Engineer', 'Software Developer', 'Web Developer'],
    type: 'technical',
  },

  // Technical - Web Developer
  {
    id: 'web_event_loop',
    category: 'Technical',
    topic: 'JavaScript Runtime & Event Loop',
    questionText: 'How does the JavaScript Event Loop work? Distinguish between the Call Stack, Web APIs, Microtask Queue (Promises), and Macrotask Queue (setTimeout/setInterval).',
    expectedKeyPoints: ['Single-threaded non-blocking runtime', 'Call stack execution', 'Microtasks execute before next macrotask', 'Event loop ticks & rendering pipeline'],
    difficulty: 'medium',
    applicableRoles: ['Web Developer', 'Software Developer'],
    type: 'technical',
  },
  {
    id: 'web_react_rendering_state',
    category: 'Technical',
    topic: 'React Architecture & Optimization',
    questionText: 'Explain how React’s Virtual DOM and Reconciliation algorithm (Fiber) work. How do you prevent unnecessary re-renders using useMemo, useCallback, and React.memo?',
    expectedKeyPoints: ['Virtual DOM diffing heuristics (O(n))', 'Fiber tree incremental rendering', 'Shallow equality vs reference equality in props', 'Trade-offs of premature memoization'],
    difficulty: 'medium',
    applicableRoles: ['Web Developer', 'Software Developer'],
    type: 'technical',
  },
  {
    id: 'web_cors_security',
    category: 'Technical',
    topic: 'Web Security & HTTP',
    questionText: 'What is Cross-Origin Resource Sharing (CORS) and why does the browser enforce the Same-Origin Policy? How does a preflight OPTIONS request work?',
    expectedKeyPoints: ['Same-Origin Policy (protocol, domain, port)', 'Browser-enforced security barrier', 'Access-Control-Allow-Origin headers', 'Simple vs Preflighted HTTP requests'],
    difficulty: 'easy',
    applicableRoles: ['Web Developer', 'Software Developer'],
    type: 'technical',
  },

  // Technical - Data Analyst
  {
    id: 'data_sql_window_functions',
    category: 'Technical',
    topic: 'SQL & Data Analysis',
    questionText: 'Explain SQL Window Functions (such as ROW_NUMBER, RANK, DENSE_RANK, and SUM() OVER PARTITION BY). How do they differ from a standard GROUP BY clause?',
    expectedKeyPoints: ['Preserves individual row identity without collapsing rows', 'Partitioning and ordering frame specification', 'Difference in handling ties between RANK and DENSE_RANK', 'Running totals and moving averages'],
    difficulty: 'medium',
    applicableRoles: ['Data Analyst', 'Python Developer', 'Software Developer'],
    type: 'technical',
  },
  {
    id: 'data_pandas_cleaning',
    category: 'Technical',
    topic: 'Data Cleaning & Wrangling',
    questionText: 'In a real-world dataset with missing values, extreme outliers, and inconsistent date formats, walk through your systematic data cleaning and validation process.',
    expectedKeyPoints: ['Exploratory data analysis (info, describe)', 'Handling missingness (MCAR vs MNAR, imputation vs dropping)', 'Outlier detection (IQR, Z-score, domain bounds)', 'Vectorized transformation & validation'],
    difficulty: 'easy',
    applicableRoles: ['Data Analyst', 'AI-ML Engineer'],
    type: 'technical',
  },

  // Technical - AI-ML Engineer
  {
    id: 'aiml_bias_variance',
    category: 'Technical',
    topic: 'Machine Learning Theory',
    questionText: 'Explain the Bias-Variance Tradeoff in Machine Learning. How can you diagnose whether a model is underfitting or overfitting, and what techniques would you use to fix each?',
    expectedKeyPoints: ['High bias = underfitting (oversimplified assumptions)', 'High variance = overfitting (modeling noise)', 'Learning curves (train vs validation loss)', 'Fixes: Regularization (L1/L2, Dropout), more data, cross-validation, feature engineering'],
    difficulty: 'medium',
    applicableRoles: ['AI-ML Engineer', 'Data Analyst', 'Python Developer'],
    type: 'technical',
  },
  {
    id: 'aiml_transformer_attention',
    category: 'Technical',
    topic: 'Deep Learning & Transformers',
    questionText: 'Explain the intuition behind the Scaled Dot-Product Attention mechanism in Transformers: `Attention(Q, K, V) = softmax(QK^T / sqrt(d_k)) * V`. Why do we divide by sqrt(d_k)?',
    expectedKeyPoints: ['Query, Key, Value representations', 'Similarity matrix calculation', 'Softmax weighting across tokens', 'Scaling prevents extremely small gradients when dot products grow large in high dimensions'],
    difficulty: 'hard',
    applicableRoles: ['AI-ML Engineer'],
    type: 'technical',
  },
  {
    id: 'aiml_metrics_eval',
    category: 'Technical',
    topic: 'Model Evaluation & Imbalanced Data',
    questionText: 'Why is Accuracy often a misleading metric for highly imbalanced datasets (e.g. 99% negative cases in fraud detection)? Which metrics should you use instead?',
    expectedKeyPoints: ['Accuracy paradox in skewed classes', 'Precision, Recall, F1-Score', 'ROC-AUC and Precision-Recall AUC (PR-AUC)', 'Cost-sensitive learning / Confusion matrix interpretation'],
    difficulty: 'easy',
    applicableRoles: ['AI-ML Engineer', 'Data Analyst'],
    type: 'technical',
  },
];

export function getDynamicQuestionFromBank(
  role: JobRole,
  type: InterviewType,
  difficulty: DifficultyLevel,
  usedQuestionIds: string[] = []
): BankQuestion {
  // Filter questions matching type and role
  const candidatePool = QUESTION_BANK.filter((q) => {
    if (usedQuestionIds.includes(q.id)) return false;
    
    // Type matching
    if (type === 'hr' && q.type !== 'hr') return false;
    if (type === 'technical' && q.type !== 'technical') return false;

    // Role matching for technical questions
    if (q.type === 'technical') {
      const isRoleApplicable =
        q.applicableRoles.includes('all') ||
        q.applicableRoles.some((r) => r.toLowerCase() === role.toLowerCase() || role.toLowerCase().includes(r.toLowerCase()));
      if (!isRoleApplicable) return false;
    }

    return true;
  });

  // Prefer matching difficulty, fallback to any available
  const difficultyMatches = candidatePool.filter((q) => q.difficulty === difficulty);
  const pool = difficultyMatches.length > 0 ? difficultyMatches : candidatePool;

  if (pool.length > 0) {
    const randomIndex = Math.floor(Math.random() * pool.length);
    return pool[randomIndex];
  }

  // Fallback if all matching are used
  const anyUnused = QUESTION_BANK.filter((q) => !usedQuestionIds.includes(q.id));
  if (anyUnused.length > 0) {
    return anyUnused[Math.floor(Math.random() * anyUnused.length)];
  }

  return QUESTION_BANK[0];
}
