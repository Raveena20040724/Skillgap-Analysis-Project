import { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Search, 
  Filter, 
  Clock, 
  Star, 
  ExternalLink, 
  XCircle,
  Sparkles,
  CheckCircle2,
  Play,
  Award,
  Layers,
  ChevronRight,
  ShieldCheck,
  Check
} from 'lucide-react';
import Button from '../../components/common/Button';

import { showGlobalToast } from '../../components/common/ToastContainer';
import { getUserData, setUserData, addActiveUserNotification } from '../../utils/userStorage';

const CATEGORIES = [
  'All', 
  'Programming', 
  'Cloud', 
  'AI', 
  'Data Science', 
  'UI/UX', 
  'DevOps', 
  'Cybersecurity'
];

const UDEMY_URL = 'https://www.udemy.com/?gclid=CjwKCAjw7p_UBhBlEiwAhpIs77M-YDvU05Q6qNvDe8sE9jRe1s1A8bAZXggL_yJbtsb_h19A3RND3hoCrrYQAvD_BwE&im_ref=yhsyrYRaKxyZRObQFnSqXTw0Ukr09R20ZQeTWg0&sharedid=&irpid=7412479&utm_medium=affiliate&utm_source=impact&utm_audience=mx&utm_tactic=%22Content%22%2C%22India%22&utm_content=3948105&utm_campaign=7412479&irgwc=1&afsrc=1&im_rewards=';
const W3SCHOOLS_URL = 'https://www.w3schools.com/';
const FREECODECAMP_URL = 'https://www.freecodecamp.org/';
const COURSERA_URL = 'https://www.coursera.org/courseraplus?utm_medium=sem&utm_source=gg&utm_campaign=b2c_india_x_coursera_ftcof_courseraplus_cx_dr_bau_gg_sem_bd-ph_in_all_m_hyb_23-09_x&campaignid=20590309416&adgroupid=155702724644&device=c&keyword=courser&matchtype=e&network=g&devicemodel=&creativeid=675426312949&assetgroupid=&targetid=kwd-744600291&extensionid=&placement=&gad_source=1&gad_campaignid=20590309416&gbraid=0AAAAADdKX6YaikJgm_nanV2M-19O5-F_4&gclid=CjwKCAjw7p_UBhBlEiwAhpIs788kV3yBqBQOaMg_nU-6Ma08eMRghCg41Szcggxox27FiUJlJvnFTxoCk7AQAvD_BwE';

const COURSES_CATALOG = [
  {
    id: 1,
    title: 'AWS Certified Solutions Architect & Cloud Engineering',
    category: 'Cloud',
    categoryTag: 'CLOUD',
    provider: 'Udemy',
    level: 'Intermediate',
    rating: 4.9,
    duration: '24 Hours',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80',
    skills: ['AWS Cloud', 'S3', 'EC2', 'Lambda', 'System Architecture'],
    url: UDEMY_URL,
    description: 'Master enterprise cloud infrastructure deployment, serverless architectures, and high-availability setups on Udemy.'
  },
  {
    id: 2,
    title: 'W3Schools Web Development, HTML5, CSS3 & JavaScript Certification',
    category: 'Programming',
    categoryTag: 'PROGRAMMING',
    provider: 'W3Schools',
    level: 'Beginner',
    rating: 4.95,
    duration: '15 Hours',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80',
    skills: ['HTML5', 'CSS3', 'JavaScript', 'DOM Manipulation'],
    url: W3SCHOOLS_URL,
    description: 'Learn foundational web development, interactive JavaScript, and modern CSS layout techniques with interactive W3Schools tutorials.'
  },
  {
    id: 3,
    title: 'freeCodeCamp Scientific Computing & Python Algorithms',
    category: 'Programming',
    categoryTag: 'PROGRAMMING',
    provider: 'freeCodeCamp',
    level: 'Intermediate',
    rating: 4.92,
    duration: '30 Hours',
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80',
    skills: ['Python', 'Data Structures', 'Algorithms', 'OOP'],
    url: FREECODECAMP_URL,
    description: 'Earn a freeCodeCamp certification in Python programming, computational algorithms, and computer science fundamentals.'
  },
  {
    id: 4,
    title: 'Coursera Plus Google Data Analytics Professional Certificate',
    category: 'Data Science',
    categoryTag: 'DATA SCIENCE',
    provider: 'Coursera',
    level: 'Intermediate',
    rating: 4.88,
    duration: '40 Hours',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop&q=80',
    skills: ['Data Analytics', 'R Programming', 'SQL', 'Tableau', 'BigQuery'],
    url: COURSERA_URL,
    description: 'Gain job-ready data analysis skills, clean real-world datasets, and build executive data visual dashboards on Coursera.'
  },
  {
    id: 5,
    title: 'Building AI Web Apps with Gemini & React Masterclass',
    category: 'AI',
    categoryTag: 'AI',
    provider: 'Udemy',
    level: 'Advanced',
    rating: 4.95,
    duration: '12 Hours',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
    skills: ['AI', 'Gemini API', 'React', 'Vector Databases'],
    url: UDEMY_URL,
    description: 'Integrate Google Gemini models, RAG architectures, and vector search embeddings into production React web apps.'
  },
  {
    id: 6,
    title: 'W3Schools Python & SQL Relational Database Reference',
    category: 'Data Science',
    categoryTag: 'DATA SCIENCE',
    provider: 'W3Schools',
    level: 'Beginner',
    rating: 4.82,
    duration: '10 Hours',
    image: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=600&auto=format&fit=crop&q=80',
    skills: ['SQL', 'PostgreSQL', 'Python', 'Database Queries'],
    url: W3SCHOOLS_URL,
    description: 'Master relational database querying, joins, index optimization, and Python DB drivers with W3Schools interactive live exercises.'
  },
  {
    id: 7,
    title: 'freeCodeCamp Responsive Web Design & UI Architecture',
    category: 'UI/UX',
    categoryTag: 'UI/UX',
    provider: 'freeCodeCamp',
    level: 'Beginner',
    rating: 4.9,
    duration: '20 Hours',
    image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=600&auto=format&fit=crop&q=80',
    skills: ['CSS Grid', 'Flexbox', 'Accessibility (a11y)', 'Responsive Design'],
    url: FREECODECAMP_URL,
    description: 'Build responsive, accessible, mobile-first web user interfaces using CSS Flexbox, Grid, and media query design patterns.'
  },
  {
    id: 8,
    title: 'Coursera Machine Learning Specialization by Stanford & DeepLearning.AI',
    category: 'AI',
    categoryTag: 'AI',
    provider: 'Coursera',
    level: 'Advanced',
    rating: 4.97,
    duration: '35 Hours',
    image: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=600&auto=format&fit=crop&q=80',
    skills: ['Machine Learning', 'Supervised Learning', 'Neural Networks', 'TensorFlow'],
    url: COURSERA_URL,
    description: 'Break into AI with Andrew Ng’s world-renowned Coursera specialization covering linear regression, neural networks, and decision trees.'
  },
  {
    id: 9,
    title: 'Docker & Kubernetes: Enterprise DevOps Blueprint',
    category: 'DevOps',
    categoryTag: 'DEVOPS',
    provider: 'Udemy',
    level: 'Intermediate',
    rating: 4.8,
    duration: '18 Hours',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&auto=format&fit=crop&q=80',
    skills: ['Docker', 'Kubernetes', 'CI/CD', 'YAML Configuration'],
    url: UDEMY_URL,
    description: 'Learn container orchestration, microservice deployments, auto-scaling, and CI/CD automation pipelines on Udemy.'
  },
  {
    id: 10,
    title: 'freeCodeCamp Information Security & Ethical Hacking',
    category: 'Cybersecurity',
    categoryTag: 'CYBERSECURITY',
    provider: 'freeCodeCamp',
    level: 'Intermediate',
    rating: 4.89,
    duration: '25 Hours',
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600&auto=format&fit=crop&q=80',
    skills: ['Ethical Hacking', 'Penetration Testing', 'Information Security', 'Python Security'],
    url: FREECODECAMP_URL,
    description: 'Explore vulnerability analysis, penetration testing methodologies, and secure web application defense strategies with freeCodeCamp.'
  },
  {
    id: 11,
    title: 'Coursera Google Cloud Architect Professional Certificate',
    category: 'Cloud',
    categoryTag: 'CLOUD',
    provider: 'Coursera',
    level: 'Advanced',
    rating: 4.91,
    duration: '32 Hours',
    image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600&auto=format&fit=crop&q=80',
    skills: ['GCP', 'Cloud Architecture', 'IAM Security', 'Kubernetes Engine'],
    url: COURSERA_URL,
    description: 'Prepare for Google Cloud Certification, design resilient infrastructure, and configure VPC networks on Coursera.'
  },
  {
    id: 12,
    title: 'W3Schools Cybersecurity & Network Security Tutorial',
    category: 'Cybersecurity',
    categoryTag: 'CYBERSECURITY',
    provider: 'W3Schools',
    level: 'Beginner',
    rating: 4.79,
    duration: '12 Hours',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&auto=format&fit=crop&q=80',
    skills: ['Cybersecurity', 'Firewalls', 'SSL/TLS Encryption', 'Network Protocols'],
    url: W3SCHOOLS_URL,
    description: 'Understand core network security concepts, encryption standards, authentication protocols, and cyber attack mitigation via W3Schools.'
  }
];

const CourseRecommendations = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [enrolledCourses, setEnrolledCourses] = useState(() => {
    try {
      const saved = getUserData('enrolled_courses', null);
      return saved !== null ? saved : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    const syncEnrolled = () => {
      const saved = getUserData('enrolled_courses', []);
      setEnrolledCourses(saved || []);
    };
    window.addEventListener('coursesUpdated', syncEnrolled);
    window.addEventListener('userDataChanged', syncEnrolled);
    return () => {
      window.removeEventListener('coursesUpdated', syncEnrolled);
      window.removeEventListener('userDataChanged', syncEnrolled);
    };
  }, []);

  const filteredCourses = COURSES_CATALOG.filter((course) => {
    const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
    const matchesSearch = 
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleEnroll = (courseId) => {
    const courseObj = COURSES_CATALOG.find(c => c.id === courseId);
    if (!enrolledCourses.includes(courseId)) {
      const updated = [...enrolledCourses, courseId];
      setEnrolledCourses(updated);
      setUserData('enrolled_courses', updated);

      // Dispatch notification
      addActiveUserNotification({
        title: '🎓 Enrolled in New Course',
        message: `Enrolled in "${courseObj?.title || 'Course'}". Complete modules to build competencies in ${courseObj?.skills?.slice(0, 2).join(', ')}.`,
        category: 'Courses & Path',
        type: 'course',
        severity: 'info',
        actionLabel: 'View Course',
        link: '/employee/courses'
      });

      showGlobalToast(`Successfully enrolled in "${courseObj?.title || 'course'}"! Launching official training site...`, 'success');
      window.dispatchEvent(new Event('coursesUpdated'));
    } else {
      showGlobalToast(`Launching official training website for "${courseObj?.title || 'course'}"...`, 'info');
    }

    // Redirect to official external training website
    if (courseObj?.url) {
      window.open(courseObj.url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="space-y-8 pb-12 animate-fade-in">
      {/* Header Banner */}
      <div className="space-y-1">
        <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white flex items-center gap-3">
          <BookOpen className="w-8 h-8 text-teal-600 dark:text-teal-400 stroke-[2.2]" />
          Training & Course Catalog
        </h1>
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
          Curated training courses from Udemy, W3Schools, freeCodeCamp, and Coursera integrated with real-time AI skill gap telemetry.
        </p>
      </div>

      {/* Search & Filter Bar (HIDDEN SCROLLBAR FOR FILTERS) */}
      <div className="p-4 bg-white dark:bg-[#161f33] border border-slate-200/90 dark:border-slate-800 rounded-3xl shadow-lg flex flex-col md:flex-row items-stretch md:items-center gap-4">
        {/* Search Input Box */}
        <div className="relative w-full md:w-80 shrink-0">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-xs font-semibold bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700/80 rounded-2xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/40"
          />
        </div>

        {/* Filter Funnel Icon & Category Pills Container (NO SCROLLBAR) */}
        <div className="flex items-center gap-2 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 shrink-0">
            <Filter className="w-4 h-4" />
          </div>

          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold shrink-0 transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'bg-teal-600 text-white shadow-md shadow-teal-600/30'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Courses Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => {
          const isEnrolled = enrolledCourses.includes(course.id);
          return (
            <div
              key={course.id}
              onClick={() => setSelectedCourse(course)}
              className="bg-white dark:bg-[#161f33] border border-slate-200/90 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 group cursor-pointer flex flex-col justify-between"
            >
              <div>
                {/* Course Image Header with Provider & Level Badges */}
                <div className="relative h-48 w-full overflow-hidden bg-slate-900">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#161f33] via-transparent to-black/40"></div>

                  <span className="absolute top-3.5 left-3.5 px-3 py-1 bg-slate-900/90 backdrop-blur-md text-white text-[11px] font-black rounded-xl border border-white/20">
                    {course.provider}
                  </span>
                </div>

                {/* Card Content Body */}
                <div className="p-6 space-y-4">
                  {/* Category Tag & Rating */}
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-black tracking-widest uppercase text-teal-600 dark:text-teal-400">
                      {course.categoryTag}
                    </span>
                    <div className="flex items-center gap-1 text-amber-500 font-extrabold text-xs">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span>{course.rating}</span>
                    </div>
                  </div>

                  {/* Course Title */}
                  <h3 className="font-black text-base md:text-lg text-slate-900 dark:text-white leading-snug group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                    {course.title}
                  </h3>

                  {/* Duration */}
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400">
                    <Clock className="w-3.5 h-3.5 text-teal-500" />
                    <span>Duration: {course.duration}</span>
                  </div>

                  {/* Skills Covered */}
                  <div className="space-y-2 pt-1">
                    <span className="text-[10px] font-black tracking-wider uppercase text-slate-400 dark:text-slate-400">
                      SKILLS COVERED
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {course.skills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 bg-slate-100 dark:bg-[#0f1524] text-slate-700 dark:text-slate-300 text-[11px] font-bold rounded-lg border border-slate-200 dark:border-[#2b3854]"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Button Footer */}
              <div className="p-6 pt-0">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEnroll(course.id);
                  }}
                  className={`w-full py-3 rounded-2xl text-xs font-extrabold transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
                    isEnrolled
                      ? 'bg-teal-500/20 text-teal-600 dark:text-teal-400 border border-teal-500/40'
                      : 'bg-teal-600 hover:bg-teal-700 text-white shadow-md shadow-teal-600/30'
                  }`}
                >
                  {isEnrolled ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Go to Course Website</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </>
                  ) : (
                    <>
                      <span>Enroll in Course</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Course Modal */}
      {selectedCourse && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-3xl p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6 animate-scale-up">
            <div className="flex items-start justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <span className="px-3 py-1 bg-teal-500/10 text-teal-600 dark:text-teal-400 text-[10px] font-black uppercase rounded-full">
                  {selectedCourse.provider} • {selectedCourse.level}
                </span>
                <h3 className="font-extrabold text-xl text-slate-900 dark:text-white mt-2">
                  {selectedCourse.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedCourse(null)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4 text-xs font-medium text-slate-700 dark:text-slate-300">
              <p className="leading-relaxed">{selectedCourse.description}</p>

              <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700/60 grid grid-cols-2 gap-3">
                <div>
                  <span className="text-slate-400 font-bold block text-[10px] uppercase">Rating</span>
                  <span className="font-extrabold text-amber-500 text-sm">★ {selectedCourse.rating} / 5.0</span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold block text-[10px] uppercase">Duration</span>
                  <span className="font-extrabold text-slate-900 dark:text-white text-sm">{selectedCourse.duration}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <Button variant="outline" onClick={() => setSelectedCourse(null)}>
                Close
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  handleEnroll(selectedCourse.id);
                  setSelectedCourse(null);
                }}
                className="bg-teal-600 hover:bg-teal-700 shadow-md shadow-teal-600/30"
              >
                {enrolledCourses.includes(selectedCourse.id) ? 'Enrolled & Active' : 'Enroll Now'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseRecommendations;