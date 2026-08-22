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
  Target,
  CloudUpload
} from 'lucide-react';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import PageHeader from '../../components/common/PageHeader';
import { ROUTES } from '../../constants/routes';
import { assessmentService } from '../../services/assessmentService';
import { getUserData, setUserData, addActiveUserNotification } from '../../utils/userStorage';

// Comprehensive Question Bank mapping skills to Basic and Advanced tiers
const SKILL_QUESTION_DATABASE = {
  'React.js': {
    basic: {
      title: 'React.js - Core Fundamentals & Component Basics',
      category: 'Frontend Engineering',
      description: 'Foundational assessment evaluating core JSX syntax, functional components, state vs props, and basic event handling.',
      questions: [
        {
          id: 1,
          question: "What is the primary purpose of the 'useState' hook in React?",
          options: [
            "To declare and manage state variables within functional components.",
            "To directly query database tables in SQL.",
            "To convert React components into native mobile code.",
            "To reload the entire browser page on button clicks."
          ],
          correctAnswer: 0,
          explanation: "useState is the core React hook used to track and update reactive component state."
        },
        {
          id: 2,
          question: "How are props passed from a parent to a child component in JSX?",
          options: [
            "As attributes on the component element, e.g. <Child title='Hello' />",
            "By writing to a global window._props object.",
            "By importing props inside the child file using require().",
            "Through CSS class selectors."
          ],
          correctAnswer: 0,
          explanation: "Props are passed as attributes on JSX elements and received as arguments in the child component."
        },
        {
          id: 3,
          question: "What must every item in a dynamically rendered list have in React?",
          options: [
            "A unique 'key' prop to help React identify which items have changed.",
            "An inline CSS background color.",
            "A mandatory onClick handler.",
            "A timestamp property."
          ],
          correctAnswer: 0,
          explanation: "Unique keys allow React's reconciler to track element identity efficiently across re-renders."
        },
        {
          id: 4,
          question: "When does the callback inside useEffect(() => {}, []) execute?",
          options: [
            "Once after the initial component mount.",
            "On every single millisecond.",
            "Only when the user closes the browser.",
            "Before any HTML is parsed."
          ],
          correctAnswer: 0,
          explanation: "An empty dependency array `[]` ensures the effect runs only once after the component mounts."
        },
        {
          id: 5,
          question: "What is JSX in React development?",
          options: [
            "A syntax extension for JavaScript that looks similar to HTML.",
            "A replacement database language for PostgreSQL.",
            "A CSS preprocessor similar to SASS.",
            "A server-side routing protocol."
          ],
          correctAnswer: 0,
          explanation: "JSX is a syntax extension allowing developers to write HTML-like markup inside JavaScript files."
        }
      ]
    },
    advanced: {
      title: 'React.js - Advanced Architecture & System Mastery',
      category: 'Frontend Engineering',
      description: 'Advanced benchmark evaluating fiber architecture, concurrent rendering, memory leak prevention, and custom hook optimization.',
      questions: [
        {
          id: 1,
          question: "What is the primary benefit of React's Concurrent Mode & useTransition hook?",
          options: [
            "It allows marking non-urgent state updates as transitions, keeping the main thread responsive for user input.",
            "It completely replaces WebSockets for real-time networking.",
            "It compiles JSX directly to C++ binaries.",
            "It disables React reconciliation."
          ],
          correctAnswer: 0,
          explanation: "useTransition allows developers to prioritize immediate input responses over heavy background re-renders."
        },
        {
          id: 2,
          question: "How does React's Reconciliation heuristic algorithm handle diffing of different component types?",
          options: [
            "When component types change, React tears down the entire subtree and mounts a fresh component tree.",
            "It mutates existing DOM attributes without unmounting.",
            "It ignores component type changes.",
            "It throws an unhandled fatal syntax error."
          ],
          correctAnswer: 0,
          explanation: "React assumes two elements of different types will produce different trees, tearing down the old tree completely."
        },
        {
          id: 3,
          question: "Which pattern is optimal for avoiding unnecessary recalculations when passing callbacks to memoized children?",
          options: [
            "Wrapping the handler in useCallback with precise dependencies.",
            "Re-instantiating the function inline inside JSX.",
            "Attaching the function directly to document.body.",
            "Converting the functional component into an async function."
          ],
          correctAnswer: 0,
          explanation: "useCallback caches function instances between renders so child memo components do not unnecessarily re-render."
        },
        {
          id: 4,
          question: "What is the primary function of React 19's Server Actions?",
          options: [
            "Asynchronous functions executed on the server, invokable directly from client forms without manual API wiring.",
            "Client-side CSS animations.",
            "Database table migration scripts.",
            "Static asset compression."
          ],
          correctAnswer: 0,
          explanation: "Server Actions allow defining server-side logic directly executable from client form submissions with automatic validation."
        },
        {
          id: 5,
          question: "Why should mutable references (useRef) be used instead of state for timer intervals?",
          options: [
            "Mutating a ref does not trigger a component re-render, avoiding unwanted render loops.",
            "Refs automatically pause execution when the user scrolls.",
            "Refs cannot be garbage collected.",
            "Refs encrypt the timer ID."
          ],
          correctAnswer: 0,
          explanation: "useRef persists values across renders without causing the component to re-execute."
        }
      ]
    }
  },
  'TypeScript': {
    basic: {
      title: 'TypeScript - Core Types & Type Safety Fundamentals',
      category: 'Programming',
      description: 'Basics assessment covering primitive types, interface definitions, function signatures, and union types.',
      questions: [
        {
          id: 1,
          question: "Which keyword is used to define an object contract with properties in TypeScript?",
          options: ["interface or type", "struct", "contract", "recordset"],
          correctAnswer: 0,
          explanation: "'interface' and 'type' are standard TypeScript declarations for specifying object shapes."
        },
        {
          id: 2,
          question: "What is the return type of a TypeScript function that does not return any value?",
          options: ["void", "null", "undefined", "never"],
          correctAnswer: 0,
          explanation: "'void' signifies that a function completes execution without returning a value."
        },
        {
          id: 3,
          question: "What does the union type 'string | number' signify?",
          options: ["A variable that can hold either a string or a number.", "A variable that must be both at once.", "A list of strings and numbers.", "A floating point integer."],
          correctAnswer: 0,
          explanation: "Union types represent values that can be one of several permitted types."
        },
        {
          id: 4,
          question: "How do you mark a property as optional inside an interface?",
          options: ["By adding a question mark '?' after the property name (e.g. age?: number).", "By prefixing with 'optional'.", "By assigning value null.", "By wrapping in square brackets."],
          correctAnswer: 0,
          explanation: "The '?' operator marks interface properties as optional."
        },
        {
          id: 5,
          question: "What tool compiles TypeScript (.ts) files into standard JavaScript (.js)?",
          options: ["tsc (TypeScript Compiler)", "npm install", "Webpack dev server only", "Docker runtime"],
          correctAnswer: 0,
          explanation: "tsc is the official TypeScript compiler that type-checks and strips types into standard JavaScript."
        }
      ]
    },
    advanced: {
      title: 'TypeScript - Advanced Generics & Type Narrowing Architecture',
      category: 'Programming',
      description: 'Advanced benchmark covering conditional types, mapped types, distributive unions, and template literal types.',
      questions: [
        {
          id: 1,
          question: "What is the primary difference between 'any' and 'unknown' in TypeScript?",
          options: [
            "'unknown' forces type checking/narrowing before any property access, while 'any' disables all type checking.",
            "'any' is type safe while 'unknown' is unsafe.",
            "'unknown' can only hold boolean values.",
            "There is no difference in compiler behavior."
          ],
          correctAnswer: 0,
          explanation: "'unknown' is the type-safe top type that requires explicit narrowing before usage."
        },
        {
          id: 2,
          question: "What does the 'keyof' operator do in TypeScript?",
          options: [
            "Produces a string or numeric union of all keys of a given object type.",
            "Encrypts object values with a secret key.",
            "Generates a unique database primary key.",
            "Deletes private keys from classes."
          ],
          correctAnswer: 0,
          explanation: "keyof T produces a union of literal string or numeric keys of type T."
        },
        {
          id: 3,
          question: "What is a 'discriminated union' in TypeScript?",
          options: [
            "A union of object types that share a common literal discriminant property used for exact type narrowing.",
            "A prohibited type syntax that throws compiler errors.",
            "A method to convert objects into CSV strings.",
            "An array with duplicate types removed."
          ],
          correctAnswer: 0,
          explanation: "Discriminated unions use a common literal tag (e.g. { type: 'success' } | { type: 'error' }) to enable exhaustive pattern matching."
        },
        {
          id: 4,
          question: "How does the 'infer' keyword function inside conditional types?",
          options: [
            "It introduces a type variable to be deduced within the true branch of a conditional type.",
            "It converts asynchronous code to synchronous.",
            "It prints debug logs to the terminal during compilation.",
            "It disables strict null checks."
          ],
          correctAnswer: 0,
          explanation: "infer allows extracting and deducing internal types (e.g. ReturnType<T> or Promise inner types) dynamically."
        },
        {
          id: 5,
          question: "What does the Utility Type 'Record<K, T>' construct?",
          options: [
            "An object type whose property keys are K and whose property values are T.",
            "An immutable tuple of length K.",
            "A database SQL row cursor.",
            "An audio recording stream."
          ],
          correctAnswer: 0,
          explanation: "Record<K, T> maps a set of keys K to values of type T."
        }
      ]
    }
  },
  'Docker': {
    basic: {
      title: 'Docker - Containerization Fundamentals & CLI Basics',
      category: 'DevOps & Cloud',
      description: 'Foundational assessment evaluating container lifecycle, images, Dockerfiles, and port forwarding.',
      questions: [
        {
          id: 1,
          question: "What is the primary difference between a Docker Image and a Docker Container?",
          options: [
            "An image is a static read-only template, while a container is a running instance of an image.",
            "An image runs on Windows, a container runs on Linux.",
            "Images cannot contain code, while containers only contain code.",
            "There is no difference."
          ],
          correctAnswer: 0,
          explanation: "Docker images are immutable snapshots from which running container instances are spawned."
        },
        {
          id: 2,
          question: "Which command runs a Docker container in detached background mode?",
          options: ["docker run -d <image_name>", "docker start --silent", "docker detach <image>", "docker bg <image>"],
          correctAnswer: 0,
          explanation: "The `-d` flag runs containers in the background as detached daemon processes."
        },
        {
          id: 3,
          question: "What does the 'EXPOSE' instruction in a Dockerfile do?",
          options: [
            "Documents the network port on which the container listens at runtime.",
            "Deletes firewall rules on the host computer.",
            "Publishes container secrets to the public internet.",
            "Forces CPU overheating shutdown."
          ],
          correctAnswer: 0,
          explanation: "EXPOSE acts as documentation and hints which network ports the container service utilizes."
        },
        {
          id: 4,
          question: "Which file is used to define multi-container applications and networks declaratively?",
          options: ["docker-compose.yml", "Dockerfile.all", "package.json", "requirements.txt"],
          correctAnswer: 0,
          explanation: "docker-compose.yml defines multi-container environments, volumes, and service links."
        },
        {
          id: 5,
          question: "What is a Docker Volume primarily used for?",
          options: [
            "Persisting data generated by and used by Docker containers across restarts.",
            "Increasing computer audio volume during builds.",
            "Compressing video files.",
            "Increasing RAM capacity."
          ],
          correctAnswer: 0,
          explanation: "Docker Volumes store persistent data outside the writable container layer."
        }
      ]
    },
    advanced: {
      title: 'Docker - Advanced Container Hardening & Multi-Stage Builds',
      category: 'DevOps & Cloud',
      description: 'Advanced benchmark evaluating multi-stage optimization, cgroups resource limits, non-root security, and distroless runtime.',
      questions: [
        {
          id: 1,
          question: "What is the main benefit of Multi-Stage Docker builds in enterprise pipelines?",
          options: [
            "Separates build tools from runtime assets, drastically reducing image size and attack surface.",
            "Allows running multiple operating systems simultaneously in one container.",
            "Disables all container authentication checks.",
            "Overclocks container CPU cycles."
          ],
          correctAnswer: 0,
          explanation: "Multi-stage builds leave build compilers behind and copy only necessary artifacts into slim production images."
        },
        {
          id: 2,
          question: "What is the crucial difference between CMD and ENTRYPOINT instructions in a Dockerfile?",
          options: [
            "ENTRYPOINT defines the fixed executable, while CMD provides default parameters easily overridden at runtime.",
            "CMD executes on the host OS while ENTRYPOINT runs in the container.",
            "ENTRYPOINT cannot accept arguments.",
            "They are strictly identical."
          ],
          correctAnswer: 0,
          explanation: "ENTRYPOINT configures the primary command, and CMD sets default arguments that can be replaced in `docker run`."
        },
        {
          id: 3,
          question: "Why should containers avoid running as the default root user in production?",
          options: [
            "To prevent container escape attacks from acquiring root privileges on the host kernel.",
            "Root users make Docker images 50% larger.",
            "Root users disable network connections.",
            "Docker cannot start root containers on Linux."
          ],
          correctAnswer: 0,
          explanation: "Least-privilege execution restricts the blast radius if an attacker compromises a running container process."
        },
        {
          id: 4,
          question: "What is a 'Distroless' container image?",
          options: [
            "An image containing only the application and runtime dependencies, omitting package managers, shells, and system utilities.",
            "An image without an IP address.",
            "An image with zero lines of code.",
            "A container stored on an external USB."
          ],
          correctAnswer: 0,
          explanation: "Distroless images strip everything except application binaries, maximizing security and minimizing vulnerabilities."
        },
        {
          id: 5,
          question: "How do Linux cgroups assist Docker container management?",
          options: [
            "They enforce hardware resource quotas (CPU, memory, I/O limits) for container processes.",
            "They encrypt files on disk.",
            "They translate English to French in log outputs.",
            "They manage git version control branches."
          ],
          correctAnswer: 0,
          explanation: "Control Groups (cgroups) constrain and isolate physical resource consumption for containers."
        }
      ]
    }
  },
  'Python': {
    basic: {
      title: 'Python - Core Syntax & Object-Oriented Fundamentals',
      category: 'Programming',
      description: 'Foundational assessment evaluating Python data types, list comprehensions, dictionary operations, and exception handling.',
      questions: [
        {
          id: 1,
          question: "What is the difference between a List and a Tuple in Python?",
          options: [
            "Lists are mutable (can be changed), whereas Tuples are immutable.",
            "Tuples can only store numbers, lists only store strings.",
            "Lists cannot be iterated over in a for loop.",
            "Tuples are automatically saved to disk."
          ],
          correctAnswer: 0,
          explanation: "Lists are dynamic and mutable, whereas tuples cannot be modified once created."
        },
        {
          id: 2,
          question: "Which keyword is used to handle exceptions gracefully in Python?",
          options: ["try / except", "catch / throw", "guard / recover", "rescue / ensure"],
          correctAnswer: 0,
          explanation: "Python uses `try` blocks paired with `except` clauses to catch runtime exceptions."
        },
        {
          id: 3,
          question: "What is the output of `[x * 2 for x in [1, 2, 3]]` in Python?",
          options: ["[2, 4, 6]", "[1, 2, 3, 1, 2, 3]", "[2, 2, 2]", "SyntaxError"],
          correctAnswer: 0,
          explanation: "List comprehension evaluates `x * 2` for each element in the input list."
        },
        {
          id: 4,
          question: "What is the purpose of `__init__` in a Python class?",
          options: [
            "It is the constructor method called automatically when creating a new class instance.",
            "It deletes old class instances from memory.",
            "It imports external third-party libraries.",
            "It formats output strings as uppercase."
          ],
          correctAnswer: 0,
          explanation: "__init__ initializes instance attributes upon object instantiation."
        },
        {
          id: 5,
          question: "Which built-in Python module is standard for serialization into JSON strings?",
          options: ["json", "serialize", "pickle_only", "xml"],
          correctAnswer: 0,
          explanation: "The built-in `json` module provides `json.dumps()` and `json.loads()`."
        }
      ]
    },
    advanced: {
      title: 'Python - Advanced Concurrency & Metaprogramming Architecture',
      category: 'Programming',
      description: 'Advanced benchmark covering GIL mechanics, asyncio event loops, generators, decorators, and memory profiling.',
      questions: [
        {
          id: 1,
          question: "What is the Global Interpreter Lock (GIL) in CPython and its primary consequence?",
          options: [
            "A mutex that allows only one native thread to execute Python bytecode at a time, impacting CPU-bound multithreading.",
            "A security lock preventing unauthorized logins.",
            "A mechanism that forbids asynchronous web servers.",
            "A tool that encrypts bytecode files."
          ],
          correctAnswer: 0,
          explanation: "The GIL prevents multi-core parallelism for CPU-heavy Python threads in CPython (resolved via multiprocessing or async I/O)."
        },
        {
          id: 2,
          question: "What is the key difference between `asyncio` cooperative multitasking and threading?",
          options: [
            "Asyncio uses a single-threaded event loop where tasks yield control voluntarily using `await`, avoiding thread context switching overhead.",
            "Asyncio requires 10x more RAM per connection.",
            "Threading does not require an operating system.",
            "Asyncio is only compatible with Python 2.7."
          ],
          correctAnswer: 0,
          explanation: "Asyncio schedules coroutines non-preemptively on an event loop, ideal for high-concurrency I/O operations."
        },
        {
          id: 3,
          question: "What is a Python Generator function and why is it memory efficient?",
          options: [
            "A function containing `yield` that produces values lazily on demand without keeping entire sequences in memory.",
            "A script that writes Python code automatically.",
            "A function that runs only during computer boot.",
            "A compiler optimization flag."
          ],
          correctAnswer: 0,
          explanation: "Generators compute values on-the-fly, allowing processing of massive or infinite data streams with O(1) memory."
        },
        {
          id: 4,
          question: "How do Python Decorators function under the hood?",
          options: [
            "They are higher-order functions that take a function as an argument and return a wrapped or modified function.",
            "They are CSS styling rules for terminal output.",
            "They convert Python code to HTML.",
            "They delete function docstrings."
          ],
          correctAnswer: 0,
          explanation: "Decorators wrap callable objects to extend or modify behavior transparently."
        },
        {
          id: 5,
          question: "What do `*args` and `**kwargs` represent in Python function signatures?",
          options: [
            "`*args` accepts arbitrary positional arguments as a tuple, and `**kwargs` accepts arbitrary keyword arguments as a dict.",
            "Pointers to C memory addresses.",
            "Required database schema columns.",
            "Mathematical multiplication and exponentiation operators only."
          ],
          correctAnswer: 0,
          explanation: "`*args` and `**kwargs` allow functions to accept variable numbers of positional and keyword arguments."
        }
      ]
    }
  }
};

const DEFAULT_FALLBACK_ASSESSMENTS = [
  {
    id: 'fullstack_diag',
    title: 'Full-Stack Web Engineering Diagnostic',
    category: 'Diagnostic Assessment',
    targetSkill: 'Web Engineering',
    currentLevel: 0,
    requiredLevel: 80,
    gap: 80,
    severity: 'Diagnostic Assessment',
    description: 'General diagnostic assessment evaluating fundamental frontend, backend, state management, and modern API communication.',
    questions: SKILL_QUESTION_DATABASE['React.js'].basic.questions
  },
  {
    id: 'python_diag',
    title: 'Python & Backend Programming Diagnostic',
    category: 'Diagnostic Assessment',
    targetSkill: 'Python Programming',
    currentLevel: 0,
    requiredLevel: 80,
    gap: 80,
    severity: 'Diagnostic Assessment',
    description: 'Introductory diagnostic evaluating Python syntax, data structures, error handling, and server logic.',
    questions: SKILL_QUESTION_DATABASE['Python'].basic.questions
  }
];

const SkillAssessment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const hasResume = !!getUserData('resume_info', null);

  // Dynamically derive assessments based on user's actual skills ONLY
  const [assessmentsList, setAssessmentsList] = useState([]);
  const [selectedDomain, setSelectedDomain] = useState(null);
  const [isStarted, setIsStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(900);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [scoreResult, setScoreResult] = useState(null);

  // Active questions for selected domain
  const questions = selectedDomain?.questions || [];

  // Generate dynamic assessments from active user's skills
  useEffect(() => {
    try {
      const savedSkills = getUserData('skills', []) || [];
      const DUMMY_SKILL_NAMES = new Set([
        'react.js & frontend',
        'python & django',
        'postgresql & sql',
        'aws cloud infrastructure',
        'docker & ci/cd pipelines',
        'docker & ci/cd automation',
        'ui/ux design systems',
        'machine learning fundamentals',
        'technical team leadership',
        'python & django framework',
        'postgresql & database optimization',
        'rest & graphql apis',
        'tailwind css & ui design systems',
        'typescript & static analysis',
        'react.js & frontend architecture',
        'javascript (es6+)',
        'typescript & type safety',
        'html5 & css3 responsive design',
        'tailwind css & component systems',
        'restful api integration'
      ]);

      const seen = new Set();
      const skills = savedSkills.filter(s => {
        if (!s || !s.name) return false;
        const nameLower = s.name.toLowerCase().trim();
        if (DUMMY_SKILL_NAMES.has(nameLower)) return false;
        if (seen.has(nameLower)) return false;
        seen.add(nameLower);
        return true;
      });

      if (skills && skills.length > 0) {
        const dynamicList = [];

        skills.forEach((skill, index) => {
          const sName = skill.name || 'Skill';
          const prof = skill.proficiencyPercentage || 70;
          const isWeak = prof < 70;

          // Check if we have specialized questions for this skill
          const matchedKey = Object.keys(SKILL_QUESTION_DATABASE).find(k => sName.toLowerCase().includes(k.toLowerCase()));
          const bank = matchedKey ? SKILL_QUESTION_DATABASE[matchedKey] : null;

          let qSet = [];
          let aTitle = '';
          let aDesc = '';

          if (bank) {
            const tierData = isWeak ? bank.basic : bank.advanced;
            qSet = tierData.questions;
            aTitle = tierData.title;
            aDesc = tierData.description;
          } else {
            // General tailored questions for any custom skill
            aTitle = isWeak
              ? `${sName} - Foundational & Core Concepts Assessment`
              : `${sName} - Advanced Mastery & Architecture Benchmark`;
            aDesc = isWeak
              ? `Diagnosed foundational gap in ${sName}. Focuses on syntax, principles, core usage, and basic workflow implementation.`
              : `High-proficiency benchmark in ${sName}. Focuses on optimization, scalability, system architecture, and deep patterns.`;

            qSet = [
              {
                id: 1,
                question: isWeak
                  ? `What is the primary industry use case of ${sName}?`
                  : `How do you optimize system performance and latency when utilizing ${sName} in production?`,
                options: isWeak ? [
                  `Building reliable, scalable components and enterprise solutions with ${sName}.`,
                  `Replacing all database storage with plaintext files.`,
                  `Running hardware firmware updates.`,
                  `Disabling user authentication.`
                ] : [
                  `Implementing intelligent caching, profiling bottlenecks, and optimizing resource pipelines in ${sName}.`,
                  `Disabling all error logging.`,
                  `Increasing server CPU without code changes.`,
                  `Bypassing data validation layers.`
                ],
                correctAnswer: 0,
                explanation: `Understanding key concepts and architecture of ${sName} is critical for engineering excellence.`
              },
              {
                id: 2,
                question: isWeak
                  ? `Which core practice is essential when writing code or configurations for ${sName}?`
                  : `What is the most common architectural vulnerability or bottleneck associated with ${sName}?`,
                options: isWeak ? [
                  `Maintaining clean modular structure, clear documentation, and unit tests.`,
                  `Storing unencrypted passwords in source code.`,
                  `Writing all logic inside a single monolithic file.`,
                  `Ignoring compiler or linter warnings.`
                ] : [
                  `Resource contention, unindexed lookups, or unhandled concurrency race conditions.`,
                  `Having too many unit tests.`,
                  `Using modern semantic variable naming.`,
                  `Utilizing Git version control.`
                ],
                correctAnswer: 0,
                explanation: `Adhering to standard best practices in ${sName} ensures stability and prevents production regressions.`
              },
              {
                id: 3,
                question: isWeak
                  ? `How are errors and exceptions properly handled in ${sName}?`
                  : `How do you ensure zero-downtime scalability when deploying ${sName} microservices?`,
                options: isWeak ? [
                  `Using structured try/catch or result types with meaningful diagnostic logging.`,
                  `Suppressing all error messages completely.`,
                  `Re-booting the computer automatically.`,
                  `Deleting the log directory.`
                ] : [
                  `Implementing health checks, horizontal autoscaling, and graceful connection draining.`,
                  `Stopping all traffic during updates.`,
                  `Deploying code without staging verification.`,
                  `Hardcoding database IP addresses.`
                ],
                correctAnswer: 0,
                explanation: `Proper architecture and error boundaries ensure resilient deployments.`
              },
              {
                id: 4,
                question: `What is a recommended security best practice when deploying ${sName}?`,
                options: [
                  `Enforcing least-privilege permissions, secret management, and input sanitization.`,
                  `Sharing administrative root credentials publicly.`,
                  `Disabling HTTPS encryption.`,
                  `Accepting unvalidated user input directly.`
                ],
                correctAnswer: 0,
                explanation: `Security hardening is fundamental across all software components.`
              },
              {
                id: 5,
                question: `What is the most effective approach for testing ${sName} implementations?`,
                options: [
                  `Automated CI/CD test suites combining unit, integration, and end-to-end assertions.`,
                  `Testing only in production after release.`,
                  `Skipping automated tests to write code faster.`,
                  `Relying solely on manual clicking.`
                ],
                correctAnswer: 0,
                explanation: `Automated test coverage validates behavior and prevents regressions in enterprise applications.`
              }
            ];
          }

          const gapAmount = isWeak ? Math.max(20, 85 - prof) : Math.max(5, 95 - prof);
          dynamicList.push({
            id: `dyn_${index}_${sName.toLowerCase().replace(/[^a-z0-9]/g, '_')}`,
            title: aTitle,
            category: skill.category || 'Engineering',
            targetSkill: sName,
            currentLevel: prof,
            requiredLevel: isWeak ? 85 : 95,
            gap: gapAmount,
            severity: isWeak ? 'Foundational Deficit' : 'Advanced Benchmark',
            description: aDesc,
            questions: qSet
          });
        });

        // Sort weak assessments first
        dynamicList.sort((a, b) => b.gap - a.gap);
        setAssessmentsList(dynamicList);
        setSelectedDomain(dynamicList[0]);
      } else {
        setAssessmentsList([]);
        setSelectedDomain(null);
      }
    } catch (e) {
      console.log('Error initializing dynamic assessments:', e);
    }
  }, []);

  // Helper to get active username
  const getActiveUsername = () => {
    try {
      const u = JSON.parse(localStorage.getItem('user') || '{}');
      return u.username || 'user';
    } catch (e) {
      return 'user';
    }
  };

  // Restore active assessment session if employee returns/re-enters
  useEffect(() => {
    if (!selectedDomain?.id) return;
    try {
      const username = getActiveUsername();
      const sessionKey = `assessment_active_session_${username}_${selectedDomain.id}`;
      const savedSession = localStorage.getItem(sessionKey);
      if (savedSession) {
        const { endTime, userAnswers: savedAnswers, currentIndex: savedIdx } = JSON.parse(savedSession);
        const remaining = Math.max(0, Math.floor((endTime - Date.now()) / 1000));
        if (remaining > 0) {
          setTimeLeft(remaining);
          if (savedAnswers) setUserAnswers(savedAnswers);
          if (savedIdx !== undefined) setCurrentIndex(savedIdx);
          setIsStarted(true);
        } else {
          localStorage.removeItem(sessionKey);
        }
      }
    } catch (e) {
      console.log('Error restoring assessment session:', e);
    }
  }, [selectedDomain]);

  // Timer Countdown Effect
  useEffect(() => {
    let timer;
    if (isStarted && !isSubmitted) {
      timer = setInterval(() => {
        if (!selectedDomain?.id) return;
        const username = getActiveUsername();
        const sessionKey = `assessment_active_session_${username}_${selectedDomain.id}`;
        const savedSession = localStorage.getItem(sessionKey);

        if (savedSession) {
          const { endTime } = JSON.parse(savedSession);
          const remaining = Math.max(0, Math.floor((endTime - Date.now()) / 1000));
          if (remaining <= 0) {
            setTimeLeft(0);
            localStorage.removeItem(sessionKey);
            handleFinalSubmit();
          } else {
            setTimeLeft(remaining);
          }
        } else if (timeLeft > 0) {
          setTimeLeft((prev) => {
            if (prev <= 1) {
              handleFinalSubmit();
              return 0;
            }
            return prev - 1;
          });
        }
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isStarted, isSubmitted, selectedDomain, timeLeft]);

  // Format Time (MM:SS)
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSelectOption = (qId, optionIdx) => {
    setUserAnswers((prev) => {
      const nextAnswers = { ...prev, [qId]: optionIdx };
      try {
        if (selectedDomain?.id) {
          const username = getActiveUsername();
          const sessionKey = `assessment_active_session_${username}_${selectedDomain.id}`;
          const savedSession = localStorage.getItem(sessionKey);
          if (savedSession) {
            const parsed = JSON.parse(savedSession);
            localStorage.setItem(sessionKey, JSON.stringify({
              ...parsed,
              userAnswers: nextAnswers,
              currentIndex
            }));
          }
        }
      } catch (e) {}
      return nextAnswers;
    });
  };

  const handleStartAssessment = (domain) => {
    setSelectedDomain(domain);
    setCurrentIndex(0);
    setUserAnswers({});
    setIsSubmitted(false);
    setScoreResult(null);

    const username = getActiveUsername();
    const sessionKey = `assessment_active_session_${username}_${domain.id}`;
    const savedSession = localStorage.getItem(sessionKey);

    if (savedSession) {
      const { endTime, userAnswers: savedAnswers, currentIndex: savedIdx } = JSON.parse(savedSession);
      const remaining = Math.max(0, Math.floor((endTime - Date.now()) / 1000));
      if (remaining > 0) {
        setTimeLeft(remaining);
        if (savedAnswers) setUserAnswers(savedAnswers);
        if (savedIdx !== undefined) setCurrentIndex(savedIdx);
        setIsStarted(true);
        return;
      }
    }

    const endTime = Date.now() + 900 * 1000;
    localStorage.setItem(sessionKey, JSON.stringify({
      endTime,
      duration: 900,
      userAnswers: {},
      currentIndex: 0
    }));
    setTimeLeft(900);
    setIsStarted(true);
  };

  const handleFinalSubmit = async () => {
    try {
      const username = getActiveUsername();
      if (selectedDomain?.id) {
        localStorage.removeItem(`assessment_active_session_${username}_${selectedDomain.id}`);
      }
    } catch (e) {}

    let correctCount = 0;
    questions.forEach((q) => {
      if (userAnswers[q.id] === q.correctAnswer) {
        correctCount += 1;
      }
    });

    const totalQ = Math.max(1, questions.length);
    const percentage = Math.round((correctCount / totalQ) * 100);
    const passed = percentage >= 80;

    // Calculate updated skill rating
    const currentBase = selectedDomain.currentLevel || 50;
    const updatedProficiency = passed ? Math.max(currentBase + 25, percentage) : currentBase + 5;

    // Update skill in user's isolated storage
    try {
      const skillsList = getUserData('skills', []) || [];
      let found = false;
      const updatedSkills = skillsList.map(sk => {
        if (sk.name.toLowerCase().includes(selectedDomain.targetSkill.toLowerCase()) ||
          selectedDomain.targetSkill.toLowerCase().includes(sk.name.toLowerCase())) {
          found = true;
          return {
            ...sk,
            proficiencyPercentage: updatedProficiency,
            level: updatedProficiency >= 80 ? 'Advanced' : 'Intermediate',
            verified: true,
          };
        }
        return sk;
      });

      if (!found) {
        updatedSkills.push({
          id: `sk_${Date.now()}`,
          name: selectedDomain.targetSkill,
          category: selectedDomain.category || 'Engineering',
          proficiencyPercentage: updatedProficiency,
          level: updatedProficiency >= 80 ? 'Advanced' : 'Intermediate',
          verified: true
        });
      }

      setUserData('skills', updatedSkills);
      window.dispatchEvent(new Event('skillsUpdated'));
    } catch (e) {
      console.error('Error updating skill score:', e);
    }

    // Save to user's isolated assessment results history
    try {
      const existingResults = getUserData('assessment_results', []) || [];
      const newRecord = {
        id: `eval_${Date.now()}`,
        domain: selectedDomain.id,
        title: selectedDomain.title,
        targetSkill: selectedDomain.targetSkill,
        score: percentage,
        passed,
        date: new Date().toISOString().split('T')[0]
      };
      const updatedResults = [newRecord, ...existingResults];
      setUserData('assessment_results', updatedResults);
      window.dispatchEvent(new Event('assessmentsUpdated'));

      // Real-time notification for user
      addActiveUserNotification({
        title: passed ? `🎉 Skill Assessment Passed (${percentage}%)` : `📚 Assessment Completed (${percentage}%)`,
        message: `You completed the "${selectedDomain.targetSkill}" assessment with a score of ${percentage}%. Your proficiency level is now ${updatedProficiency}%.`,
        category: 'Skill Assessment',
        type: 'assessment',
        severity: passed ? 'success' : 'info',
        actionLabel: 'View Results',
        link: ROUTES.SKILL_ASSESSMENT
      });
    } catch (err) {
      console.log('Local assessment scoring history save note:', err);
    }

    // Try backend assessment submission if available
    try {
      await assessmentService.submitAssessment({
        domain: selectedDomain.id,
        skill: selectedDomain.targetSkill,
        answers: userAnswers,
        score: percentage,
      });
    } catch (err) {
      console.log('Backend assessment sync fallback:', err);
    }

    setScoreResult({
      score: percentage,
      correctCount,
      total: questions.length,
      passed,
      targetSkill: selectedDomain.targetSkill,
      oldScore: currentBase,
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
          <div className="w-20 h-20 rounded-full mx-auto flex items-center justify-center bg-gradient-to-tr from-teal-600 to-emerald-500 p-1 shadow-lg shadow-teal-500/20">
            <div className="w-full h-full rounded-full bg-slate-100 dark:bg-[#0f1524] flex items-center justify-center">
              {scoreResult.passed ? (
                <CheckCircle2 className="w-10 h-10 text-teal-500 dark:text-teal-400" />
              ) : (
                <AlertCircle className="w-10 h-10 text-amber-500 dark:text-amber-400" />
              )}
            </div>
          </div>

          <div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${scoreResult.passed
                ? 'bg-teal-500/10 text-teal-700 dark:text-teal-300 border border-teal-500/30'
                : 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/30'
                }`}
            >
              {scoreResult.passed ? 'TARGETED DEFICIT RESOLVED (PASSED)' : 'FURTHER STUDY RECOMMENDED'}
            </span>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white mt-3">
              Assessment Score: <span className="text-teal-600 dark:text-teal-400">{scoreResult.score}%</span>
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
                <span className="text-xs font-bold text-teal-600 dark:text-teal-400">
                  {scoreResult.oldScore}% → <span className="text-base font-black">{scoreResult.newScore}%</span>
                </span>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold">Proficiency Updated</p>
              </div>
            </div>

            <div className="w-full bg-slate-200 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-teal-600 to-emerald-500 rounded-full transition-all duration-700"
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
              <p className="text-base font-black text-teal-600 dark:text-teal-400">
                {scoreResult.passed ? `-${selectedDomain.gap}% Gap` : '-5% Partial'}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase">New Competency Tier</p>
              <p className="text-base font-black text-teal-600 dark:text-teal-400">
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
              className="gap-2 bg-teal-600 hover:bg-teal-700 shadow-md shadow-teal-500/20"
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
            <span className="text-[10px] font-black tracking-wider uppercase text-teal-600 dark:text-teal-400 flex items-center gap-1.5">
              <Target className="w-3 h-3 text-teal-500" />
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
            className="bg-gradient-to-r from-teal-600 to-emerald-400 h-full rounded-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          ></div>
        </div>

        {/* Question Box */}
        <div className="p-6 md:p-8 bg-white dark:bg-[#1a2336] text-slate-900 dark:text-white border border-slate-200 dark:border-[#2b3854] rounded-3xl shadow-xl space-y-6">
          <div className="flex items-start gap-3">
            <span className="p-2 rounded-xl bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 font-black text-xs shrink-0">
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
                  className={`flex items-start gap-3.5 p-4 rounded-2xl border transition-all duration-200 cursor-pointer ${isSelected
                    ? 'border-teal-500 bg-teal-50 dark:bg-teal-600/20 ring-2 ring-teal-500/40 dark:ring-teal-500/50'
                    : 'border-slate-200 dark:border-[#2b3854] bg-slate-50/50 dark:bg-[#0f1524]/60 hover:bg-slate-100 dark:hover:bg-[#0f1524]'
                    }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${isSelected
                      ? 'border-teal-500 bg-teal-600 text-white'
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
                className="bg-teal-600 hover:bg-teal-700 shadow-md shadow-teal-500/20"
              >
                Submit Assessment
              </Button>
            ) : (
              <Button
                variant="primary"
                onClick={() => setCurrentIndex((prev) => prev + 1)}
                className="bg-teal-600 hover:bg-teal-700"
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
              <CheckSquare className="w-7 h-7 text-teal-600 dark:text-teal-400 stroke-[2.2]" />
              AI Adaptive Skill Assessments
            </span>
          }
          subtitle="Targeted benchmark assessments automatically generated based on your diagnosed skill gaps and resume competency areas."
        />
      </div>

      {!hasResume ? (
        <Card className="p-12 text-center flex flex-col items-center justify-center space-y-4 max-w-xl mx-auto border border-dashed border-teal-500/40 bg-teal-500/5 shadow-md my-8">
          <div className="w-16 h-16 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center">
            <Sparkles className="w-8 h-8 animate-bounce" />
          </div>
          <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">No Resume Uploaded Yet</h3>
          <p className="text-sm text-slate-600 dark:text-slate-300 max-w-md leading-relaxed">
            Please upload your resume first to unlock AI-powered skill assessments and diagnostic tests tailored to your parsed profile.
          </p>
          <Button onClick={() => navigate(ROUTES.RESUME_UPLOAD)} className="gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold px-6 py-3 shadow-lg shadow-teal-500/25">
            <CloudUpload className="w-4 h-4" />
            Upload Resume to Unlock Assessments
          </Button>
        </Card>
      ) : (
        <>
          {/* Mandatory Assessment Policy Alert */}
      <Card className="p-5 border-l-4 border-teal-500 bg-teal-50/70 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-900/60 shadow-sm">
        <div className="flex items-start gap-3.5">
          <div className="p-2 rounded-xl bg-teal-500/20 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5">
            <Zap className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div className="space-y-1">
            <h4 className="font-extrabold text-sm text-teal-950 dark:text-teal-200">
              AI Dynamic Adaptive Benchmark
            </h4>
            <p className="text-xs text-teal-900 dark:text-teal-300/90 leading-relaxed">
              Assessments are dynamically adapted to your skill inventory: <strong>Basics / Foundational tests</strong> are generated for emerging skills (&lt;70%), and <strong>Advanced Architecture tests</strong> are generated for high-proficiency skills (≥70%).
            </p>
          </div>
        </div>
      </Card>

      {/* Weak Areas Assessment Selector Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
            <Target className="w-5 h-5 text-teal-500" />
            {assessmentsList[0]?.category === 'Diagnostic Assessment' ? 'Diagnostic Technical Assessments' : 'Resume Competency Assessments'} ({assessmentsList.length})
          </h3>
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            {assessmentsList[0]?.category === 'Diagnostic Assessment' ? 'Introductory Diagnostic Benchmarks' : 'Sorted by Skill Gap Priority'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {assessmentsList.map((domain) => {
            const severityColor =
              domain.gap >= 20 ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20' :
                'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20';

            return (
              <Card
                key={domain.id}
                className="p-6 border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f172a] hover:border-teal-500/60 dark:hover:border-teal-500/60 transition-all flex flex-col justify-between space-y-4 shadow-sm hover:shadow-md group"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                        {domain.category}
                      </span>
                      <h4 className="font-extrabold text-base text-slate-900 dark:text-white mt-1.5 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                        {domain.title}
                      </h4>
                    </div>

                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black border uppercase tracking-wider shrink-0 ${severityColor}`}>
                      {domain.severity}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-2">
                    {domain.description}
                  </p>

                  {/* Competency Gap Bar */}
                  <div className="space-y-1.5 pt-2">
                    <div className="flex justify-between items-center text-xs font-bold">
                      <span className="text-slate-500 dark:text-slate-400">
                        Current: <strong className="text-teal-600 dark:text-teal-400">{domain.currentLevel}%</strong>
                      </span>
                      <span className="text-teal-600 dark:text-teal-400">
                        Target: <strong className="text-slate-900 dark:text-white">{domain.requiredLevel}%</strong>
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden p-0.5 border border-slate-200/50 dark:border-slate-700/50">
                      <div
                        className="h-full bg-gradient-to-r from-teal-600 to-emerald-400 rounded-full"
                        style={{ width: `${domain.currentLevel}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Card Footer with Start Action */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800/80">
                  <div className="flex items-center gap-3 text-xs font-medium text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-teal-500" /> 15 Mins
                    </span>
                    <span>•</span>
                    <span>5 Questions</span>
                  </div>

                  <button
                    onClick={() => handleStartAssessment(domain)}
                    className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-teal-500/20 transition-all cursor-pointer group-hover:scale-105"
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
    </>
  )}
</div>
);
};

export default SkillAssessment;