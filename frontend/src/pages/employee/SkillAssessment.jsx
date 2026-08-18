import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  CheckSquare, 
  Clock, 
  ArrowRight, 
  RotateCcw, 
  CheckCircle2, 
  AlertCircle,
  Sparkles,
  AlertTriangle,
  Zap,
  Layers,
  ChevronRight,
  HelpCircle,
  Award,
  BookOpen,
  Target
} from 'lucide-react';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import PageHeader from '../../components/common/PageHeader';
import { ROUTES } from '../../constants/routes';
import { assessmentService } from '../../services/assessmentService';

// Domain-Specific Questions Bank based on employee competency gaps
const DOMAIN_ASSESSMENTS = [
  {
    id: 'ml_ai',
    title: 'Machine Learning & GenAI Fundamentals',
    category: 'AI & Data Science',
    targetSkill: 'Machine Learning Fundamentals',
    currentLevel: 45,
    requiredLevel: 75,
    gap: 30,
    severity: 'Critical Deficit',
    description: 'Diagnosed high skill deficit. Focuses on deep learning loss functions, attention mechanisms, tokenization, embeddings, and prompt architecture.',
    questions: [
      {
        id: 1,
        question: "In Transformer architecture, what is the core purpose of the Multi-Head Self-Attention mechanism?",
        options: [
          "It allows the model to jointly attend to information from different representation subspaces at different positions.",
          "It permanently compresses text inputs into static binary integers for disk storage.",
          "It completely removes the need for backpropagation during model training.",
          "It enforces deterministic single-word lookups in the training database."
        ],
        correctAnswer: 0,
        explanation: "Multi-Head Attention gives the attention layer multiple representation subspaces, enabling the model to focus on different positions simultaneously."
      },
      {
        id: 2,
        question: "Why is Temperature used during LLM text generation sampling?",
        options: [
          "It controls randomness in probability distribution: lower values make output more deterministic, higher values increase creativity.",
          "It measures the physical CPU heat generated during inference.",
          "It determines the token limit allowed per REST API call.",
          "It forces the GPU memory cache to purge all previous conversation history."
        ],
        correctAnswer: 0,
        explanation: "Temperature scales the logits before softmax: low temperature (e.g. 0.2) concentrates probabilities on top tokens, while high temperature (e.g. 0.8) flattens distribution."
      },
      {
        id: 3,
        question: "What is the primary difference between Fine-Tuning and Retrieval-Augmented Generation (RAG)?",
        options: [
          "Fine-Tuning updates model weights with specialized data, while RAG dynamically injects external knowledge into the context window at runtime.",
          "Fine-Tuning is only used for image models, while RAG is strictly for text classification.",
          "RAG trains new weights from scratch, while Fine-Tuning never updates weights.",
          "There is no difference; they are interchangeable industry synonyms."
        ],
        correctAnswer: 0,
        explanation: "RAG retrieves external vector documents and appends them to prompt context without altering base model weights. Fine-tuning adjusts model parameters."
      },
      {
        id: 4,
        question: "Which loss function is standard for training multi-class classification neural networks?",
        options: [
          "Categorical Cross-Entropy Loss",
          "Mean Squared Error (MSE)",
          "Binary Hinge Loss",
          "Cosine Similarity Linear Loss"
        ],
        correctAnswer: 0,
        explanation: "Categorical Cross-Entropy measures performance of a classification model whose output is a probability value between 0 and 1."
      },
      {
        id: 5,
        question: "What is 'Vector Embeddings' in modern AI and NLP pipelines?",
        options: [
          "High-dimensional numerical array representations capturing semantic meaning and relationships of words or documents.",
          "HTML SVG icons rendered inside the user interface.",
          "A method of compressing JPEG images into lossless vectors.",
          "A security encryption key used for JWT user authentication."
        ],
        correctAnswer: 0,
        explanation: "Embeddings map semantic concepts into dense numerical vectors where semantically similar texts are situated close together in vector space."
      }
    ]
  },
  {
    id: 'docker_devops',
    title: 'Docker Containerization & CI/CD Pipelines',
    category: 'DevOps & Infrastructure',
    targetSkill: 'Docker & CI/CD Pipelines',
    currentLevel: 62,
    requiredLevel: 85,
    gap: 23,
    severity: 'High Deficit',
    description: 'Diagnosed moderate competency deficit. Focuses on multi-stage Docker builds, image layering, container security isolation, and GitHub Actions pipelines.',
    questions: [
      {
        id: 1,
        question: "What is the primary advantage of utilizing Multi-Stage Docker builds in production deployments?",
        options: [
          "Separating the build environment from runtime, resulting in vastly smaller and more secure production images.",
          "Allowing Docker containers to run without an underlying Linux kernel.",
          "Automatically increasing server CPU clock speeds during compilation.",
          "Bypassing all container networking security rules."
        ],
        correctAnswer: 0,
        explanation: "Multi-stage builds leave compiler tools and intermediary build artifacts behind, shipping only the final binary or distribution assets."
      },
      {
        id: 2,
        question: "In Docker, what is the key difference between the CMD and ENTRYPOINT instructions in a Dockerfile?",
        options: [
          "ENTRYPOINT sets the default executable, while CMD provides default arguments that can be easily overridden at runtime.",
          "CMD runs on the host OS, while ENTRYPOINT runs inside the container.",
          "ENTRYPOINT cannot accept arguments, whereas CMD requires at least three flags.",
          "They are strictly identical in all Docker runtime versions."
        ],
        correctAnswer: 0,
        explanation: "ENTRYPOINT defines the container entrypoint executable, while CMD defines default parameters that can be overridden via `docker run` args."
      },
      {
        id: 3,
        question: "Which practice is essential for hardening container security in production environments?",
        options: [
          "Running the container as a non-root dedicated user with least-privilege permissions.",
          "Granting privileged `--privileged=true` access to every microservice container.",
          "Disabling container TLS certificates to reduce CPU encryption overhead.",
          "Storing database passwords inside plaintext Dockerfile ENV commands."
        ],
        correctAnswer: 0,
        explanation: "Running as non-root (e.g. `USER appuser`) prevents container escape vulnerabilities from gaining root privileges on the host kernel."
      },
      {
        id: 4,
        question: "In CI/CD automation pipelines, what is 'Build Artifact Caching' used for?",
        options: [
          "Reusing unchanged dependencies (e.g., node_modules, pip wheels) across pipeline runs to drastically speed up execution.",
          "Saving runtime log files to disk indefinitely without quota limits.",
          "Replacing unit tests with static code comments.",
          "Overriding production database migrations automatically."
        ],
        correctAnswer: 0,
        explanation: "Caching dependencies against lockfile checksums prevents re-downloading packages on every build, reducing CI run times significantly."
      },
      {
        id: 5,
        question: "What is the purpose of Docker Container Healthchecks (`HEALTHCHECK`)?",
        options: [
          "To allow orchestrators like Kubernetes or Docker Compose to detect deadlocks or unhealthy states and restart containers automatically.",
          "To test the host motherboard battery level.",
          "To scan external hard drives for hardware bad sectors.",
          "To auto-generate unit tests from JavaScript source code."
        ],
        correctAnswer: 0,
        explanation: "HEALTHCHECK periodically verifies container endpoints, enabling orchestration engines to route traffic away from or restart unresponsive instances."
      }
    ]
  },
  {
    id: 'aws_cloud',
    title: 'AWS Cloud Architecture & Microservices',
    category: 'Cloud Architecture',
    targetSkill: 'AWS Cloud Infrastructure',
    currentLevel: 68,
    requiredLevel: 85,
    gap: 17,
    severity: 'Moderate Deficit',
    description: 'Diagnosed moderate competency gap. Focuses on VPC networking, IAM least-privilege security, S3 storage lifecycles, and serverless Lambda scaling.',
    questions: [
      {
        id: 1,
        question: "In AWS VPC architecture, how do EC2 instances in a Private Subnet securely communicate with the public Internet for software updates?",
        options: [
          "Through a NAT Gateway located in a Public Subnet with an Internet Gateway route.",
          "By attaching an Elastic IP directly to every private instance.",
          "By disabling the VPC Network Access Control List (NACL).",
          "By routing traffic through the IAM metadata server."
        ],
        correctAnswer: 0,
        explanation: "Instances in private subnets use a NAT (Network Address Translation) Gateway in a public subnet for outbound-only Internet access while preventing inbound connections."
      },
      {
        id: 2,
        question: "What is the AWS security best practice for granting microservice applications access to AWS resources (like S3 or DynamoDB)?",
        options: [
          "Attaching an IAM Role with least-privilege policies directly to the service or ECS task.",
          "Hardcoding root AWS Access Keys in environment variables.",
          "Setting all S3 buckets to public read/write permissions.",
          "Sharing one administrative API key across all backend services."
        ],
        correctAnswer: 0,
        explanation: "IAM Roles provide temporary, automatically rotated security credentials with strict least-privilege policies."
      },
      {
        id: 3,
        question: "What causes a 'Cold Start' in serverless AWS Lambda functions, and how can it be mitigated?",
        options: [
          "The latency of provisioning a new execution environment container; mitigated using Provisioned Concurrency.",
          "Server overheating in the AWS data center; mitigated with liquid cooling.",
          "A syntax error in python code; mitigated by deleting unit tests.",
          "Lack of disk space on the client browser; mitigated by clearing cookies."
        ],
        correctAnswer: 0,
        explanation: "Cold starts happen when a new container is instantiated to handle a request. Provisioned Concurrency keeps pre-warmed execution environments ready."
      },
      {
        id: 4,
        question: "Which AWS storage class is best suited for archiving compliance data that is accessed less than once a year and requires low-cost storage?",
        options: [
          "S3 Glacier Flexible Retrieval or S3 Glacier Deep Archive",
          "S3 Standard Multi-AZ",
          "EFS Provisioned Throughput",
          "EBS io2 Block Storage"
        ],
        correctAnswer: 0,
        explanation: "S3 Glacier Deep Archive is AWS's lowest-cost storage class, designed for long-term data archiving with retrieval times within hours."
      },
      {
        id: 5,
        question: "How does an Application Load Balancer (ALB) handle path-based routing in microservice architectures?",
        options: [
          "It routes requests to different target groups (e.g. /api/users, /api/orders) based on URL paths in HTTP headers.",
          "It requires DNS records to be updated for every single HTTP request.",
          "It randomly distributes requests without examining HTTP payload or headers.",
          "It only works with static HTML files stored in S3 buckets."
        ],
        correctAnswer: 0,
        explanation: "ALB operates at Layer 7 (Application Layer) and inspects HTTP paths, host headers, and query parameters to route requests to specific service target groups."
      }
    ]
  },
  {
    id: 'sql_database',
    title: 'PostgreSQL & Database Query Optimization',
    category: 'Database & Storage',
    targetSkill: 'PostgreSQL & SQL',
    currentLevel: 75,
    requiredLevel: 90,
    gap: 15,
    severity: 'Refresher Required',
    description: 'Diagnosed gap in query optimization. Focuses on B-Tree vs GIN indexing, EXPLAIN ANALYZE query planning, ACID transactions, and N+1 query resolution.',
    questions: [
      {
        id: 1,
        question: "When should a GIN (Generalized Inverted Index) be used in PostgreSQL instead of a standard B-Tree index?",
        options: [
          "When indexing composite values like JSONB documents, full-text search vectors, or array data types.",
          "When indexing standard single integer primary keys with sequential increments.",
          "When storing short VARCHAR usernames with exact equality checks.",
          "GIN indexes should never be used because they disable database queries."
        ],
        correctAnswer: 0,
        explanation: "GIN indexes are designed for handling composite items where multiple elements occur within a single column value (e.g. JSONB keys or arrays)."
      },
      {
        id: 2,
        question: "What is the 'N+1 Query Problem' in ORM database access and how is it resolved in Django/SQLAlchemy?",
        options: [
          "Executing 1 query for a parent list and N subsequent queries for related children; resolved using `select_related` or `prefetch_related` (Eager Loading).",
          "A mathematical rounding error in floating-point SQL calculations.",
          "A bug where PostgreSQL cannot insert more than N rows per table.",
          "A network timeout that occurs when exactly N+1 users log in at the same time."
        ],
        correctAnswer: 0,
        explanation: "The N+1 problem occurs when an ORM issues individual queries inside a loop. Eager loading combines queries using SQL JOINs or batched IN clauses."
      },
      {
        id: 3,
        question: "In PostgreSQL, what is the crucial difference between `EXPLAIN` and `EXPLAIN ANALYZE`?",
        options: [
          "`EXPLAIN` shows the query planner's estimated cost without running it, while `EXPLAIN ANALYZE` actually executes the query and returns real execution times.",
          "`EXPLAIN ANALYZE` modifies table schemas automatically.",
          "`EXPLAIN` deletes the index before running.",
          "There is no difference; both are aliases for table descriptions."
        ],
        correctAnswer: 0,
        explanation: "`EXPLAIN ANALYZE` executes the statement and displays real planning and execution times alongside the cost estimates."
      },
      {
        id: 4,
        question: "What does the 'I' (Isolation) in ACID transaction properties ensure in relational databases?",
        options: [
          "Concurrent transactions execute without interfering with one another or reading intermediate uncommitted states.",
          "The database must run on isolated physical hardware disconnected from the Internet.",
          "All SQL columns must have independent unique constraints.",
          "Only one user can connect to the database per hour."
        ],
        correctAnswer: 0,
        explanation: "Isolation ensures that concurrent transactions operate as if they executed sequentially, avoiding dirty reads and race conditions."
      },
      {
        id: 5,
        question: "Why should database connection pooling (e.g. PgBouncer) be used in high-concurrency web applications?",
        options: [
          "To reuse active database connection processes and avoid the heavy overhead of creating/destroying PostgreSQL backend processes per HTTP request.",
          "To bypass password authentication for faster logins.",
          "To automatically truncate tables that exceed 100 rows.",
          "To convert SQL queries into client-side CSS."
        ],
        correctAnswer: 0,
        explanation: "PostgreSQL forks a backend process per connection. Connection poolers keep open pools of reusable connections, handling thousands of concurrent requests."
      }
    ]
  },
  {
    id: 'react_arch',
    title: 'Advanced React.js & Modern Frontend Architecture',
    category: 'Frontend Engineering',
    targetSkill: 'React.js & Frontend',
    currentLevel: 88,
    requiredLevel: 95,
    gap: 7,
    severity: 'Senior Benchmark',
    description: 'Senior competency benchmark. Focuses on virtual DOM diffing heuristics, cache invalidation, React 19 async primitives, and Suspense concurrency.',
    questions: [
      {
        id: 1,
        question: "What is the primary benefit of TypeScript's 'unknown' type over 'any'?",
        options: [
          "It forces type narrowing/checking before performing any operations or method calls.",
          "It automatically converts string variables to numbers at runtime.",
          "It completely disables type checking for performance gains.",
          "It can only store primitive numerical values."
        ],
        correctAnswer: 0,
        explanation: "'unknown' is the type-safe counterpart of 'any'. Anything is assignable to 'unknown', but 'unknown' is not assignable to anything without a type assertion or type guard."
      },
      {
        id: 2,
        question: "In modern React, what is the primary purpose of the 'use' hook?",
        options: [
          "To read asynchronous resources like Promises or Context dynamically inside render functions.",
          "To completely replace useEffect for browser DOM updates.",
          "To initialize Redux toolkit slices inside class components.",
          "To style components dynamically using CSS-in-JS primitives."
        ],
        correctAnswer: 0,
        explanation: "The 'use' hook allows reading values from Promises or Context directly during component render without blocking."
      },
      {
        id: 3,
        question: "Which React hook should be used to cache expensive calculations between re-renders?",
        options: [
          "useMemo",
          "useCallback",
          "useRef",
          "useImperativeHandle"
        ],
        correctAnswer: 0,
        explanation: "useMemo caches the result of a calculation between renders unless dependencies change."
      },
      {
        id: 4,
        question: "How does React's Virtual DOM diffing algorithm optimize DOM updates?",
        options: [
          "By comparing fiber trees and batching minimal DOM mutations.",
          "By saving HTML snapshots directly into browser localStorage.",
          "By running WebAssembly scripts on the server.",
          "By bypassing layout calculations completely."
        ],
        correctAnswer: 0,
        explanation: "React compares Virtual DOM nodes using heuristic diffing algorithms and applies only the required patches to the real DOM."
      },
      {
        id: 5,
        question: "What happens when a component throws a Promise inside a <Suspense> boundary?",
        options: [
          "React suspends rendering and displays the fallback UI until the Promise resolves.",
          "The browser throws an unhandled error and halts JavaScript execution.",
          "The page reloads immediately.",
          "All state variables are reset to null."
        ],
        correctAnswer: 0,
        explanation: "Suspense catches thrown promises, pauses rendering of that subtree, and displays fallback UI until the promise resolves."
      }
    ]
  }
];

const SkillAssessment = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Selected deficit assessment
  const [selectedDomain, setSelectedDomain] = useState(DOMAIN_ASSESSMENTS[0]);
  const [isStarted, setIsStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutes = 900 seconds
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [scoreResult, setScoreResult] = useState(null);

  // Active question set
  const questions = selectedDomain.questions || [];

  // Check if routed with a pre-selected domain
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const domainParam = params.get('domain');
    if (domainParam) {
      const found = DOMAIN_ASSESSMENTS.find(d => d.id === domainParam);
      if (found) setSelectedDomain(found);
    }
  }, [location.search]);

  // Timer Countdown Effect
  useEffect(() => {
    let timer;
    if (isStarted && !isSubmitted && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isStarted && !isSubmitted) {
      handleFinalSubmit();
    }
    return () => clearInterval(timer);
  }, [isStarted, isSubmitted, timeLeft]);

  // Format Time (MM:SS)
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSelectOption = (qId, optionIdx) => {
    setUserAnswers((prev) => ({ ...prev, [qId]: optionIdx }));
  };

  const handleStartAssessment = (domain) => {
    setSelectedDomain(domain);
    setCurrentIndex(0);
    setUserAnswers({});
    setTimeLeft(900);
    setIsSubmitted(false);
    setScoreResult(null);
    setIsStarted(true);
  };

  const handleFinalSubmit = async () => {
    let correctCount = 0;
    questions.forEach((q) => {
      if (userAnswers[q.id] === q.correctAnswer) {
        correctCount += 1;
      }
    });

    const percentage = Math.round((correctCount / questions.length) * 100);
    const passed = percentage >= 80;

    // Calculate updated skill rating
    const updatedProficiency = passed ? Math.max(selectedDomain.currentLevel + 25, percentage) : selectedDomain.currentLevel + 5;

    // Update skill in custom_user_skills localStorage
    try {
      const savedStr = localStorage.getItem('custom_user_skills');
      if (savedStr) {
        const skillsList = JSON.parse(savedStr);
        const updatedSkills = skillsList.map(sk => {
          if (sk.name.toLowerCase().includes(selectedDomain.targetSkill.toLowerCase()) || 
              selectedDomain.targetSkill.toLowerCase().includes(sk.name.toLowerCase())) {
            return {
              ...sk,
              proficiencyPercentage: updatedProficiency,
              level: updatedProficiency >= 80 ? 'Advanced' : 'Intermediate',
              verified: true,
            };
          }
          return sk;
        });
        localStorage.setItem('custom_user_skills', JSON.stringify(updatedSkills));
        window.dispatchEvent(new Event('skillsUpdated'));
      }
    } catch (e) {
      console.error('Error updating skill score:', e);
    }

    // Try backend assessment submission
    try {
      await assessmentService.submitAssessment({
        domain: selectedDomain.id,
        skill: selectedDomain.targetSkill,
        answers: userAnswers,
        score: percentage,
      });
    } catch (err) {
      console.log('Local assessment scoring fallback:', err);
    }

    setScoreResult({
      score: percentage,
      correctCount,
      total: questions.length,
      passed,
      targetSkill: selectedDomain.targetSkill,
      oldScore: selectedDomain.currentLevel,
      newScore: updatedProficiency,
    });
    setIsSubmitted(true);
  };

  // Restart Quiz
  const handleRestart = () => {
    setIsStarted(false);
    setIsSubmitted(false);
    setCurrentIndex(0);
    setUserAnswers({});
    setTimeLeft(900);
    setScoreResult(null);
  };

  // RESULTS VIEW
  if (isSubmitted && scoreResult) {
    return (
      <div className="max-w-3xl mx-auto space-y-6 pb-12 animate-fade-in">
        <div className="text-center p-8 bg-white dark:bg-[#1a2336] text-slate-900 dark:text-white border border-slate-200 dark:border-[#2b3854] rounded-3xl shadow-xl space-y-6">
          <div className="w-20 h-20 rounded-full mx-auto flex items-center justify-center bg-gradient-to-tr from-blue-500 to-teal-400 p-1 shadow-lg shadow-teal-500/20">
            <div className="w-full h-full rounded-full bg-slate-100 dark:bg-[#0f1524] flex items-center justify-center">
              {scoreResult.passed ? (
                <CheckCircle2 className="w-10 h-10 text-emerald-500 dark:text-emerald-400" />
              ) : (
                <AlertCircle className="w-10 h-10 text-amber-500 dark:text-amber-400" />
              )}
            </div>
          </div>

          <div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                scoreResult.passed
                  ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30'
                  : 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/30'
              }`}
            >
              {scoreResult.passed ? 'TARGETED DEFICIT RESOLVED (PASSED)' : 'FURTHER STUDY REQUIRED'}
            </span>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white mt-3">
              Assessment Score: <span className="text-blue-600 dark:text-teal-400">{scoreResult.score}%</span>
            </h2>
            <p className="text-xs font-medium text-slate-600 dark:text-slate-300 mt-1">
              Correct: {scoreResult.correctCount} / {scoreResult.total} Questions in <strong className="text-slate-900 dark:text-white">{selectedDomain.title}</strong>
            </p>
          </div>

          {/* Skill Gap Progress Box */}
          <div className="p-5 bg-slate-50 dark:bg-[#0f1524] rounded-2xl border border-slate-200 dark:border-[#2b3854] text-left space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Targeted Skill Area</p>
                <h4 className="text-sm font-extrabold text-slate-900 dark:text-white mt-0.5">{scoreResult.targetSkill}</h4>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  {scoreResult.oldScore}% → <span className="text-base font-black">{scoreResult.newScore}%</span>
                </span>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold">Proficiency Updated</p>
              </div>
            </div>

            <div className="w-full bg-slate-200 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-teal-500 to-blue-600 rounded-full transition-all duration-700"
                style={{ width: `${scoreResult.newScore}%` }}
              />
            </div>
          </div>

          {/* Details Breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-slate-50 dark:bg-[#0f1524] rounded-2xl border border-slate-200 dark:border-[#2b3854] text-left">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase">Passing Threshold</p>
              <p className="text-base font-black text-slate-900 dark:text-white">80%</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase">Skill Gap Reduction</p>
              <p className="text-base font-black text-emerald-600 dark:text-emerald-400">
                {scoreResult.passed ? `-${selectedDomain.gap}% Gap` : '-5% Partial'}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase">New Competency Tier</p>
              <p className="text-base font-black text-blue-600 dark:text-teal-400">
                {scoreResult.newScore >= 80 ? 'Advanced' : 'Intermediate'}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Button variant="outline" onClick={handleRestart} className="gap-2">
              <RotateCcw className="w-4 h-4" />
              Choose Another Assessment
            </Button>
            <Button
              variant="primary"
              onClick={() => navigate(ROUTES.SKILL_GAP_RESULTS)}
              className="gap-2 bg-gradient-to-r from-blue-600 to-teal-500 shadow-md shadow-teal-500/20"
            >
              <Sparkles className="w-4 h-4" />
              View Updated Skill Gaps
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // QUIZ IN PROGRESS VIEW
  if (isStarted && questions.length > 0) {
    const currentQ = questions[currentIndex];
    const isLast = currentIndex === questions.length - 1;

    return (
      <div className="max-w-3xl mx-auto space-y-6 pb-12 animate-fade-in">
        {/* Top Assessment Navigation & Timer Bar */}
        <div className="flex items-center justify-between p-4 bg-white dark:bg-[#1a2336] text-slate-900 dark:text-white border border-slate-200 dark:border-[#2b3854] rounded-2xl shadow-sm">
          <div>
            <span className="text-[10px] font-black tracking-wider uppercase text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
              <Target className="w-3 h-3 text-rose-500" />
              {selectedDomain.category} • {selectedDomain.title}
            </span>
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white mt-0.5">
              Question {currentIndex + 1} of {questions.length}
            </h3>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-[#0f1524] rounded-xl border border-slate-200 dark:border-[#2b3854]">
            <Clock className="w-4 h-4 text-amber-500 dark:text-amber-400 animate-pulse" />
            <span className="text-xs font-black font-mono text-slate-900 dark:text-white">
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-200 dark:bg-[#0f1524] rounded-full h-2 overflow-hidden border border-slate-200 dark:border-[#2b3854]">
          <div
            className="bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-400 h-full rounded-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          ></div>
        </div>

        {/* Question Box */}
        <div className="p-6 md:p-8 bg-white dark:bg-[#1a2336] text-slate-900 dark:text-white border border-slate-200 dark:border-[#2b3854] rounded-3xl shadow-xl space-y-6">
          <div className="flex items-start gap-3">
            <span className="p-2 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-black text-xs shrink-0">
              Q{currentIndex + 1}
            </span>
            <h2 className="text-base md:text-lg font-extrabold text-slate-900 dark:text-white leading-snug">
              {currentQ.question}
            </h2>
          </div>

          <div className="space-y-3">
            {currentQ.options.map((opt, idx) => {
              const isSelected = userAnswers[currentQ.id] === idx;
              return (
                <div
                  key={idx}
                  onClick={() => handleSelectOption(currentQ.id, idx)}
                  className={`flex items-start gap-3.5 p-4 rounded-2xl border transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-600/20 ring-2 ring-blue-500/40 dark:ring-blue-500/50'
                      : 'border-slate-200 dark:border-[#2b3854] bg-slate-50/50 dark:bg-[#0f1524]/60 hover:bg-slate-100 dark:hover:bg-[#0f1524]'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                      isSelected
                        ? 'border-blue-500 bg-blue-600 text-white'
                        : 'border-slate-300 dark:border-slate-500'
                    }`}
                  >
                    {isSelected && <span className="w-2 h-2 rounded-full bg-white"></span>}
                  </div>
                  <span className="text-xs md:text-sm font-semibold text-slate-800 dark:text-slate-200 leading-relaxed">
                    {opt}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Footer Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-[#2b3854]">
            <Button
              variant="outline"
              onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentIndex === 0}
            >
              Previous
            </Button>

            {isLast ? (
              <Button
                variant="primary"
                onClick={handleFinalSubmit}
                className="bg-gradient-to-r from-blue-600 to-teal-500 shadow-md shadow-teal-500/20"
              >
                Submit Assessment
              </Button>
            ) : (
              <Button
                variant="primary"
                onClick={() => setCurrentIndex((prev) => prev + 1)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Next Question
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // WEAK AREA ASSESSMENT HUB (START SCREEN)
  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12 animate-fade-in">
      {/* Header */}
      <div>
        <PageHeader
          title={
            <span className="flex items-center gap-2.5 text-slate-900 dark:text-white font-black text-2xl">
              <CheckSquare className="w-7 h-7 text-blue-600 dark:text-blue-400 stroke-[2.2]" />
              AI Adaptive Skill Assessments
            </span>
          }
          subtitle="Targeted benchmark assessments automatically generated based on your diagnosed skill gaps and weak competency areas."
        />
      </div>

      {/* Mandatory Assessment Policy Alert */}
      <Card className="p-5 border-l-4 border-amber-500 bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 shadow-sm">
        <div className="flex items-start gap-3.5">
          <div className="p-2 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5">
            <AlertTriangle className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div className="space-y-1">
            <h4 className="font-extrabold text-sm text-amber-900 dark:text-amber-200">
              Mandatory Assessment Policy: Target Assigned Weak Areas
            </h4>
            <p className="text-xs text-amber-800 dark:text-amber-300/90 leading-relaxed">
              To improve your organization readiness score, please complete assessments <strong>specifically targeting your identified competency gaps</strong> rather than selecting arbitrary topics. Select an assigned deficit assessment below to begin.
            </p>
          </div>
        </div>
      </Card>

      {/* Weak Areas Assessment Selector Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
            <Target className="w-5 h-5 text-rose-500" />
            Assigned Competency Gap Assessments ({DOMAIN_ASSESSMENTS.length})
          </h3>
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Sorted by Skill Gap Priority
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {DOMAIN_ASSESSMENTS.map((domain) => {
            const severityColor = 
              domain.gap >= 25 ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20' :
              domain.gap >= 15 ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20' :
              'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20';

            return (
              <Card
                key={domain.id}
                className="p-6 border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f172a] hover:border-blue-500/60 dark:hover:border-blue-500/60 transition-all flex flex-col justify-between space-y-4 shadow-sm hover:shadow-md group"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                        {domain.category}
                      </span>
                      <h4 className="font-extrabold text-base text-slate-900 dark:text-white mt-1.5 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {domain.title}
                      </h4>
                    </div>

                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black border uppercase tracking-wider shrink-0 ${severityColor}`}>
                      {domain.severity} (-{domain.gap}%)
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-2">
                    {domain.description}
                  </p>

                  {/* Competency Gap Bar */}
                  <div className="space-y-1.5 pt-2">
                    <div className="flex justify-between items-center text-xs font-bold">
                      <span className="text-slate-500 dark:text-slate-400">
                        Current: <strong className="text-rose-600 dark:text-rose-400">{domain.currentLevel}%</strong>
                      </span>
                      <span className="text-emerald-600 dark:text-emerald-400">
                        Target: <strong className="text-slate-900 dark:text-white">{domain.requiredLevel}%</strong>
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden p-0.5 border border-slate-200/50 dark:border-slate-700/50">
                      <div
                        className="h-full bg-gradient-to-r from-rose-500 via-amber-500 to-teal-500 rounded-full"
                        style={{ width: `${domain.currentLevel}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Card Footer with Start Action */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800/80">
                  <div className="flex items-center gap-3 text-xs font-medium text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-amber-500" /> 15 Mins
                    </span>
                    <span>•</span>
                    <span>5 Questions</span>
                  </div>

                  <button
                    onClick={() => handleStartAssessment(domain)}
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-blue-500/20 transition-all cursor-pointer group-hover:scale-105"
                  >
                    <span>Take Assessment</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SkillAssessment;