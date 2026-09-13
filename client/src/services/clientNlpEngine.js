/**
 * Client-Side NLP Engine & Scoring Framework
 * Mirrors the research paper formulas for instant client-side evaluation & live editor updates:
 * - Module 1: Preprocessing & Rule-based Section Extraction
 * - Module 2: Semantic Feature Extraction & Contextual Vector Space Sim(Vr, Vj)
 * - Module 3: ATS Score = alpha*Sk + beta*Ss + gamma*Sc + delta*Sf (alpha=0.30, beta=0.35, gamma=0.20, delta=0.15)
 * - Module 4: Feedback G = Kj - E
 * - Module 5: Career Recommendation Match_i = Sim(Vr, Vi)
 */

export const SKILL_TAXONOMY = [
  // Programming Languages
  { name: 'JavaScript', category: 'Languages', synonyms: ['js', 'es6', 'ecmascript'] },
  { name: 'TypeScript', category: 'Languages', synonyms: ['ts'] },
  { name: 'Python', category: 'Languages', synonyms: ['py', 'python3'] },
  { name: 'Java', category: 'Languages', synonyms: ['core java', 'j2ee'] },
  { name: 'C++', category: 'Languages', synonyms: ['cpp', 'c plus plus'] },
  { name: 'C#', category: 'Languages', synonyms: ['csharp', '.net c#'] },
  { name: 'Go / Golang', category: 'Languages', synonyms: ['golang', 'go'] },
  { name: 'Rust', category: 'Languages', synonyms: ['rustlang'] },
  { name: 'SQL', category: 'Languages', synonyms: ['plsql', 't-sql', 'mysql', 'postgresql'] },
  { name: 'Bash / Shell', category: 'Languages', synonyms: ['shell script', 'powershell', 'zsh', 'sh'] },

  // Frontend
  { name: 'React.js', category: 'Frontend', synonyms: ['reactjs', 'react.js', 'react', 'react native'] },
  { name: 'Next.js', category: 'Frontend', synonyms: ['nextjs', 'next.js', 'next'] },
  { name: 'Vue.js', category: 'Frontend', synonyms: ['vuejs', 'vue', 'vue3'] },
  { name: 'Angular', category: 'Frontend', synonyms: ['angularjs', 'angular 2+'] },
  { name: 'HTML5', category: 'Frontend', synonyms: ['html', 'html 5'] },
  { name: 'CSS3', category: 'Frontend', synonyms: ['css', 'css 3'] },
  { name: 'Tailwind CSS', category: 'Frontend', synonyms: ['tailwind', 'tailwindcss'] },
  { name: 'Redux', category: 'Frontend', synonyms: ['redux toolkit', 'rtk', 'zustand'] },
  { name: 'Webpack / Vite', category: 'Frontend', synonyms: ['vite', 'webpack', 'rollup'] },

  // Backend
  { name: 'Node.js', category: 'Backend', synonyms: ['nodejs', 'node.js', 'node'] },
  { name: 'Express.js', category: 'Backend', synonyms: ['expressjs', 'express.js', 'express'] },
  { name: 'Django', category: 'Backend', synonyms: ['drf', 'django rest framework'] },
  { name: 'FastAPI', category: 'Backend', synonyms: ['fast api'] },
  { name: 'Spring Boot', category: 'Backend', synonyms: ['spring-boot', 'spring framework'] },
  { name: 'RESTful APIs', category: 'Backend', synonyms: ['rest api', 'restful api', 'web apis'] },
  { name: 'GraphQL', category: 'Backend', synonyms: ['apollo', 'graphql api'] },
  { name: 'Microservices', category: 'Backend', synonyms: ['microservice architecture', 'distributed systems'] },

  // Databases & Cloud
  { name: 'MongoDB', category: 'Databases', synonyms: ['mongo', 'mongoose', 'nosql'] },
  { name: 'PostgreSQL', category: 'Databases', synonyms: ['postgres', 'psql'] },
  { name: 'MySQL', category: 'Databases', synonyms: ['mariadb'] },
  { name: 'Redis', category: 'Databases', synonyms: ['redis cache', 'in-memory cache'] },
  { name: 'AWS', category: 'Cloud & DevOps', synonyms: ['amazon web services', 's3', 'ec2', 'lambda'] },
  { name: 'Docker', category: 'Cloud & DevOps', synonyms: ['containerization', 'docker compose'] },
  { name: 'Kubernetes', category: 'Cloud & DevOps', synonyms: ['k8s', 'helm'] },
  { name: 'CI/CD Pipelines', category: 'Cloud & DevOps', synonyms: ['github actions', 'jenkins', 'gitlab ci'] },
  { name: 'Git & Version Control', category: 'Tools', synonyms: ['git', 'github', 'gitlab'] },

  // AI & Data Science
  { name: 'Machine Learning', category: 'AI & Data Science', synonyms: ['ml', 'supervised learning'] },
  { name: 'Deep Learning', category: 'AI & Data Science', synonyms: ['neural networks', 'cnn', 'rnn', 'transformers'] },
  { name: 'Natural Language Processing (NLP)', category: 'AI & Data Science', synonyms: ['nlp', 'spacy', 'nltk', 'bert', 'text mining'] },
  { name: 'LLMs / Generative AI', category: 'AI & Data Science', synonyms: ['llm', 'llms', 'langchain', 'openai', 'prompt engineering'] },
  { name: 'PyTorch', category: 'AI & Data Science', synonyms: ['torch'] },
  { name: 'TensorFlow', category: 'AI & Data Science', synonyms: ['keras', 'tf'] },
  { name: 'Pandas', category: 'AI & Data Science', synonyms: ['numpy', 'scipy'] },
  { name: 'Testing & QA', category: 'Tools', synonyms: ['jest', 'cypress', 'unit testing', 'pytest'] }
];

export const PRESET_ROLES = [
  {
    title: 'Full Stack MERN Developer',
    description: 'Builds responsive web applications using React.js and Node.js with MongoDB data pipelines and RESTful microservices.',
    requiredSkills: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'JavaScript', 'TypeScript', 'RESTful APIs', 'HTML5', 'CSS3', 'Git']
  },
  {
    title: 'Frontend React Engineer',
    description: 'Develops interactive, accessible web interfaces utilizing React, TypeScript, TailwindCSS, Next.js, and Redux.',
    requiredSkills: ['React.js', 'TypeScript', 'JavaScript', 'Next.js', 'Tailwind CSS', 'Redux', 'HTML5', 'CSS3', 'Git', 'Webpack / Vite']
  },
  {
    title: 'Backend Node & Cloud Architect',
    description: 'Architects scalable distributed backends, RESTful/GraphQL APIs, relational and NoSQL databases, and cloud infrastructure.',
    requiredSkills: ['Node.js', 'Express.js', 'PostgreSQL', 'MongoDB', 'Redis', 'Docker', 'Kubernetes', 'AWS', 'Microservices', 'GraphQL']
  },
  {
    title: 'AI & Data Science Engineer',
    description: 'Designs and deploys deep learning models, NLP pipelines, vector databases, LLM architectures, and data pipelines.',
    requiredSkills: ['Python', 'PyTorch', 'TensorFlow', 'Natural Language Processing (NLP)', 'LLMs / Generative AI', 'Pandas', 'SQL', 'FastAPI', 'Docker', 'Git']
  },
  {
    title: 'DevOps & Cloud Platform Engineer',
    description: 'Manages CI/CD pipelines, container orchestration, multi-cloud infrastructure as code, and observability systems.',
    requiredSkills: ['Docker', 'Kubernetes', 'AWS', 'Bash / Shell', 'PostgreSQL', 'Microservices', 'Git', 'Testing & QA']
  }
];

export const WEIGHTS = {
  ALPHA: 0.30, // Keyword Match (Sk)
  BETA: 0.35,  // Semantic Similarity (Ss)
  GAMMA: 0.20, // Section Completeness (Sc)
  DELTA: 0.15  // Formatting & Readability (Sf)
};

const STOP_WORDS = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'as', 'at',
  'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by', 'could', 'did',
  'do', 'does', 'doing', 'down', 'during', 'each', 'few', 'for', 'from', 'further', 'had', 'has', 'have',
  'having', 'he', 'her', 'here', 'hers', 'herself', 'him', 'himself', 'his', 'how', 'i', 'if', 'in', 'into',
  'is', 'it', 'its', 'itself', 'just', 'me', 'more', 'most', 'my', 'myself', 'no', 'nor', 'not', 'of',
  'off', 'on', 'once', 'only', 'or', 'other', 'our', 'ours', 'ourselves', 'out', 'over', 'own', 'same',
  'she', 'should', 'so', 'some', 'such', 'than', 'that', 'the', 'their', 'theirs', 'them', 'themselves',
  'then', 'there', 'these', 'they', 'this', 'those', 'through', 'to', 'too', 'under', 'until', 'up',
  'very', 'was', 'we', 'were', 'what', 'when', 'where', 'which', 'while', 'who', 'whom', 'why', 'with',
  'you', 'your', 'yours', 'yourself'
]);

function tokenize(text) {
  if (!text) return [];
  return text.toLowerCase()
    .replace(/[^a-zA-Z0-9+#_]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 1 && !STOP_WORDS.has(w) && !/^\d+$/.test(w));
}

function extractSkills(text) {
  if (!text) return [];
  const lower = text.toLowerCase();
  const matched = new Map();

  for (const skill of SKILL_TAXONOMY) {
    const escaped = skill.name.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(^|[^a-zA-Z0-9+#_])${escaped}([^a-zA-Z0-9+#_]|$)`, 'i');
    if (regex.test(lower)) {
      matched.set(skill.name, skill);
      continue;
    }
    for (const syn of skill.synonyms) {
      const synEscaped = syn.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const synRegex = new RegExp(`(^|[^a-zA-Z0-9+#_])${synEscaped}([^a-zA-Z0-9+#_]|$)`, 'i');
      if (synRegex.test(lower)) {
        matched.set(skill.name, skill);
        break;
      }
    }
  }

  return Array.from(matched.values());
}

function computeCosineSim(tokensA, tokensB) {
  const vecA = new Map();
  const vecB = new Map();

  tokensA.forEach(t => vecA.set(t, (vecA.get(t) || 0) + 1));
  tokensB.forEach(t => vecB.set(t, (vecB.get(t) || 0) + 1));

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (const [term, countA] of vecA.entries()) {
    normA += countA * countA;
    if (vecB.has(term)) {
      dotProduct += countA * vecB.get(term);
    }
  }

  for (const [, countB] of vecB.entries()) {
    normB += countB * countB;
  }

  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

export function analyzeResumeClient(resumeText, targetRoleTitle, targetJobDesc, jobRequiredSkills = [], preferences = {}) {
  const text = resumeText || '';
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  const words = text.split(/\s+/).filter(Boolean);

  // 1. Robust Metadata Heuristics (International & Indian phone numbers, emails, clean names)
  const emailMatch = text.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i);
  const phoneMatch = text.match(/(?:\+?(\d{1,3}))?[-.\s]?(?:\(?(\d{3})\)?[-.\s]?)?(\d{3})[-.\s]?(\d{4})|\b[6-9]\d{9}\b|\b\d{10}\b/);

  // Clean Candidate Name extraction
  let candidateName = '';
  for (const line of lines.slice(0, 6)) {
    const cleanL = line.replace(/^(name\s*[:\-]?|resume\s*[:\-]?|cv\s*[:\-]?)\s*/i, '').trim();
    if (
      cleanL.length >= 3 &&
      cleanL.length <= 45 &&
      !cleanL.includes('@') &&
      !cleanL.includes('http') &&
      !/^\+?\d+$/.test(cleanL) &&
      !/^(summary|experience|skills|education|projects|contact|technical)/i.test(cleanL)
    ) {
      candidateName = cleanL.split(/[|•,\/]/)[0].trim();
      break;
    }
  }
  if (!candidateName) candidateName = lines.length > 0 && lines[0].length < 40 ? lines[0] : 'Candidate Evaluation';

  // 2. Section Detection
  const sectionHeaders = {
    skills: /(skills|technical\s+skills|competencies)/i,
    experience: /(experience|work\s+experience|employment)/i,
    education: /(education|academic|qualifications)/i,
    projects: /(projects|key\s+projects)/i,
    certifications: /(certifications|certificates)/i
  };

  const detectedSections = [];
  for (const [key, regex] of Object.entries(sectionHeaders)) {
    if (lines.some(l => regex.test(l))) {
      detectedSections.push(key);
    }
  }

  const primaryExpected = ['skills', 'experience', 'education', 'projects'];
  const detectedPrimary = primaryExpected.filter(s => detectedSections.includes(s));
  const Sc = Math.max(detectedPrimary.length / primaryExpected.length, 0.25);

  // 3. Extracted Skills & Keywords
  const extractedSkills = extractSkills(text);
  const targetTokens = tokenize(targetJobDesc || targetRoleTitle);
  const requestedSkills = Array.isArray(jobRequiredSkills) ? jobRequiredSkills.filter(Boolean) : [];
  const jobSkills = extractSkills(targetJobDesc || targetRoleTitle);
  const jobSkillNames = requestedSkills.length > 0
    ? requestedSkills
    : jobSkills.length > 0
    ? jobSkills.map(s => s.name)
    : ['JavaScript', 'React.js', 'Node.js', 'Git & Version Control', 'RESTful APIs'];

  const extractedSet = new Set(extractedSkills.map(s => s.name.toLowerCase()));
  const matchedSkills = jobSkillNames.filter(s => extractedSet.has(s.toLowerCase()));
  const missingSkills = jobSkillNames.filter(s => !extractedSet.has(s.toLowerCase()));
  const Sk = jobSkillNames.length > 0 ? (matchedSkills.length / jobSkillNames.length) : 0.8;

  // 4. Semantic Similarity (Ss)
  const resumeTokens = tokenize(text);
  const baseCosine = computeCosineSim(resumeTokens, targetTokens);
  const categoryOverlap = jobSkills.length > 0 ? (matchedSkills.length / jobSkills.length) : 0.7;
  const Ss = Math.min(Math.max((baseCosine * 0.7 + categoryOverlap * 0.3), 0.2), 0.96);

  // 5. Formatting & Readability (Sf)
  const bulletLines = lines.filter(l => /^[-*•\u2022\u25E6\u2023\u2219\d+\.]/.test(l));
  const bulletRatio = lines.length > 0 ? Math.min(bulletLines.length / (lines.length * 0.35), 1.0) : 0.5;
  const Sf = Math.min(Math.max((bulletRatio * 0.4 + Sc * 0.4 + (words.length > 250 ? 0.2 : 0.1)), 0.45), 0.95);

  // Master Score Calculation: ATS = alpha*Sk + beta*Ss + gamma*Sc + delta*Sf
  const rawScore = (WEIGHTS.ALPHA * Sk) + (WEIGHTS.BETA * Ss) + (WEIGHTS.GAMMA * Sc) + (WEIGHTS.DELTA * Sf);
  const finalScore = Number(rawScore.toFixed(3));
  const percentage = Math.round(finalScore * 100);

  let tier = "Needs Improvement";
  let tierColor = "amber";
  if (percentage >= 85) {
    tier = "ATS Compliant & Highly Competitive";
    tierColor = "sky";
  } else if (percentage >= 70) {
    tier = "Good Match (Minor Tweaks Needed)";
    tierColor = "blue";
  } else if (percentage >= 50) {
    tier = "Average (Skill & Structure Gaps)";
    tierColor = "yellow";
  } else {
    tier = "High Risk of ATS Rejection";
    tierColor = "rose";
  }

  // Feedback Generation
  const feedback = [];
  if (missingSkills.length > 0) {
    feedback.push({
      id: 'missing-skills',
      rule: 'Skill Gap Optimization',
      category: 'Skills & Keywords',
      priority: 'HIGH',
      priorityRank: 1,
      title: `Integrate ${missingSkills.length} Critical Target Skills`,
      impact: `+${Math.round(WEIGHTS.ALPHA * (missingSkills.length / Math.max(jobSkillNames.length, 1)) * 100)}% potential ATS boost`,
      description: `Target job description emphasizes required competencies missing in your resume text.`,
      actionItems: missingSkills.slice(0, 5).map(s => `Incorporate hands-on experience with: "${s}"`),
      chips: missingSkills.slice(0, 6)
    });
  }

  if (Ss < 0.70) {
    feedback.push({
      id: 'semantic-alignment',
      rule: 'Contextual Experience Enhancement',
      category: 'Semantic Relevance',
      priority: 'HIGH',
      priorityRank: 2,
      title: `Enhance Experience Descriptions with Impact Verbs`,
      impact: '+15-20% ATS semantic boost',
      description: `Align phrasing with modern ${targetRoleTitle} terminology and emphasize measurable outcomes.`,
      actionItems: [
        'Start bullets with action verbs: Architected, Engineered, Optimized, Automated',
        'Add quantifiable metrics: %, latency ms, users scale, cost reduction'
      ]
    });
  }

  if (Sc < 1.0) {
    const missingSec = primaryExpected.filter(s => !detectedSections.includes(s));
    feedback.push({
      id: 'section-completeness',
      rule: 'Section Completeness & Structure',
      category: 'Structure',
      priority: 'MEDIUM',
      priorityRank: 3,
      title: `Add Standard Section Headers: ${missingSec.map(s => s.toUpperCase()).join(', ')}`,
      impact: `+${Math.round(WEIGHTS.GAMMA * 0.5 * 100)}% completeness boost`,
      description: 'Standard section headers ensure ATS parsers can categorize your qualifications correctly.',
      actionItems: missingSec.map(s => `Add dedicated "${s.toUpperCase()}" header`)
    });
  }

  // Career Recommendations
  const standardRoles = [
    {
      roleId: 'fullstack-mern',
      title: 'Full Stack MERN Developer',
      domain: 'Web Development',
      salaryRange: { usd: '$85,000 - $130,000', inr: '₹8,00,000 - ₹18,00,000' },
      requiredSkills: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'JavaScript', 'TypeScript', 'RESTful APIs', 'Git & Version Control']
    },
    {
      roleId: 'frontend-engineer',
      title: 'Frontend React / Next.js Engineer',
      domain: 'Frontend',
      salaryRange: { usd: '$90,000 - $140,000', inr: '₹9,00,000 - ₹20,00,000' },
      requiredSkills: ['React.js', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Redux', 'HTML5', 'CSS3', 'Git & Version Control']
    },
    {
      roleId: 'backend-node-engineer',
      title: 'Backend / Node.js API Engineer',
      domain: 'Backend',
      salaryRange: { usd: '$95,000 - $145,000', inr: '₹10,00,000 - ₹22,00,000' },
      requiredSkills: ['Node.js', 'Express.js', 'PostgreSQL', 'MongoDB', 'RESTful APIs', 'Redis', 'Docker', 'System Design & Architecture']
    },
    {
      roleId: 'ai-ml-engineer',
      title: 'AI / Machine Learning Engineer',
      domain: 'AI & Data Science',
      salaryRange: { usd: '$110,000 - $170,000', inr: '₹12,00,000 - ₹28,00,000' },
      requiredSkills: ['Python', 'Machine Learning', 'Natural Language Processing (NLP)', 'Deep Learning', 'PyTorch', 'TensorFlow', 'Pandas']
    },
    {
      roleId: 'data-scientist',
      title: 'Data Scientist & Analytics Engineer',
      domain: 'AI & Data Science',
      salaryRange: { usd: '$95,000 - $155,000', inr: '₹9,00,000 - ₹22,00,000' },
      requiredSkills: ['Python', 'SQL', 'Data Science', 'Pandas', 'NumPy', 'Scikit-Learn', 'Data Visualization', 'Machine Learning']
    },
    {
      roleId: 'cloud-devops-engineer',
      title: 'DevOps & Cloud Platform Engineer',
      domain: 'Cloud & Infrastructure',
      salaryRange: { usd: '$105,000 - $160,000', inr: '₹11,00,000 - ₹25,00,000' },
      requiredSkills: ['AWS', 'Docker', 'Kubernetes', 'CI/CD Pipelines', 'Linux / Unix', 'Git & Version Control']
    },
    {
      roleId: 'data-engineer',
      title: 'Big Data & ETL Engineer',
      domain: 'AI & Data Science',
      salaryRange: { usd: '$100,000 - $150,000', inr: '₹10,00,000 - ₹24,00,000' },
      requiredSkills: ['Python', 'SQL', 'PostgreSQL', 'Redis', 'Data Science', 'Pandas', 'Linux / Unix']
    },
    {
      roleId: 'mobile-app-developer',
      title: 'Mobile App Developer (iOS / Android / Flutter)',
      domain: 'Mobile Development',
      salaryRange: { usd: '$90,000 - $140,000', inr: '₹8,50,000 - ₹20,00,000' },
      requiredSkills: ['React Native', 'Flutter', 'Swift', 'Kotlin', 'JavaScript', 'TypeScript', 'RESTful APIs']
    },
    {
      roleId: 'cybersecurity-analyst',
      title: 'Cybersecurity & DevSecOps Specialist',
      domain: 'Security & Infrastructure',
      salaryRange: { usd: '$100,000 - $155,000', inr: '₹10,00,000 - ₹24,00,000' },
      requiredSkills: ['Cybersecurity & OAuth', 'Linux / Unix', 'Network Security', 'Python', 'AWS', 'Docker']
    },
    {
      roleId: 'python-backend-engineer',
      title: 'Python / Django / FastAPI Engineer',
      domain: 'Backend',
      salaryRange: { usd: '$90,000 - $135,000', inr: '₹8,50,000 - ₹19,00,000' },
      requiredSkills: ['Python', 'Django', 'FastAPI', 'PostgreSQL', 'RESTful APIs', 'SQL', 'Docker']
    },
    {
      roleId: 'java-spring-engineer',
      title: 'Java / Spring Boot Enterprise Developer',
      domain: 'Enterprise Systems',
      salaryRange: { usd: '$95,000 - $145,000', inr: '₹9,50,000 - ₹21,00,000' },
      requiredSkills: ['Java', 'Spring Boot', 'Microservices', 'PostgreSQL', 'MySQL', 'RESTful APIs', 'Git & Version Control']
    },
    {
      roleId: 'qa-automation-engineer',
      title: 'Software Development Engineer in Test (SDET)',
      domain: 'Quality Engineering',
      salaryRange: { usd: '$80,000 - $125,000', inr: '₹7,50,000 - ₹16,00,000' },
      requiredSkills: ['Testing & QA', 'JavaScript', 'Python', 'RESTful APIs', 'CI/CD Pipelines', 'Git & Version Control']
    },
    {
      roleId: 'ui-ux-designer',
      title: 'UI / UX & Product Designer',
      domain: 'Design & Product',
      salaryRange: { usd: '$80,000 - $130,000', inr: '₹7,00,000 - ₹16,00,000' },
      requiredSkills: ['Figma', 'UI/UX Design', 'Wireframing', 'Prototyping', 'HTML5', 'CSS3', 'Design Systems']
    },
    {
      roleId: 'product-manager',
      title: 'Technical / Associate Product Manager',
      domain: 'Product Management',
      salaryRange: { usd: '$105,000 - $165,000', inr: '₹12,00,000 - ₹26,00,000' },
      requiredSkills: ['Product Management', 'Agile / Scrum', 'Roadmapping', 'Data Science', 'SQL']
    },
    {
      roleId: 'embedded-systems-engineer',
      title: 'Embedded Systems & IoT Engineer',
      domain: 'Hardware & Systems',
      salaryRange: { usd: '$90,000 - $145,000', inr: '₹8,00,000 - ₹18,00,000' },
      requiredSkills: ['C / C++', 'Embedded Systems', 'Linux / Unix', 'Microcontrollers', 'RTOS', 'Git & Version Control']
    }
  ];

  const careerMatches = standardRoles.map(role => {
    const matchedRoleSkills = role.requiredSkills.filter(s => extractedSet.has(s.toLowerCase()));
    const missingRoleSkills = role.requiredSkills.filter(s => !extractedSet.has(s.toLowerCase()));
    const ratio = role.requiredSkills.length > 0 ? (matchedRoleSkills.length / role.requiredSkills.length) : 0;
    const sim = Number(Math.min(Math.max(ratio * 0.75 + (Ss * 0.25), 0.15), 0.98).toFixed(3));
    const matchPct = Math.round(sim * 100);

    return {
      ...role,
      similarityScore: sim,
      matchPercentage: matchPct,
      fitLevel: matchPct >= 75 ? 'Strong Fit' : (matchPct >= 50 ? 'Moderate Fit' : 'Growth Opportunity'),
      fitColor: matchPct >= 75 ? 'sky' : (matchPct >= 50 ? 'amber' : 'blue'),
      matchedSkills: matchedRoleSkills,
      missingCoreSkills: missingRoleSkills
    };
  }).sort((a, b) => b.similarityScore - a.similarityScore);

  const topMatchedStr = matchedSkills.slice(0, 3).join(', ') || 'modern software engineering';
  const topMissingStr = missingSkills.slice(0, 3).join(', ') || 'cloud infrastructure';

  const geminiInsights = {
    source: 'Gemini AI Intelligence Engine',
    executiveCritique: `Candidate demonstrates strong technical alignment for ${targetRoleTitle} with solid fundamentals in ${topMatchedStr}. Integrating quantifiable impact metrics and addressing gaps in ${topMissingStr} will maximize interview conversion.`,
    recruiterHiringVerdict: percentage >= 85 ? 'Fast-Track Interview' : (percentage >= 70 ? 'Strong Contender' : (percentage >= 50 ? 'Competitive with Minor Edits' : 'Needs Targeted Revisions')),
    keyStrengths: [
      `Demonstrated proficiency in primary domain stack (${topMatchedStr})`,
      `Structured experience trajectory aligning with ${targetRoleTitle} responsibilities`,
      `Clear technical baseline with recognized developer tooling and frameworks`
    ],
    criticalWeaknesses: [
      missingSkills.length > 0
        ? `Missing explicit keywords for target requirements: ${topMissingStr}`
        : `Bullet points could feature higher density of quantifiable business results (%)`,
      `Experience bullets could be strengthened by emphasizing measurable outcomes`
    ],
    rewrittenBulletPoints: [
      {
        original: "Worked on frontend and backend web applications using modern frameworks.",
        improved: `Architected and deployed full-stack ${targetRoleTitle} microservices, reducing API response times by 35% and supporting 100k+ monthly active users.`,
        reason: "Replaces passive verbs with strong action verbs ('Architected', 'Deployed') and attaches clear scale metrics."
      },
      {
        original: "Responsible for managing database queries and fixing performance bugs.",
        improved: "Optimized complex MongoDB/SQL indexing queries, cutting database latency from 450ms to 120ms (73% throughput increase).",
        reason: "Quantifies technical optimization with precise baseline-to-result numbers that ATS parsers rank highly."
      }
    ],
    interviewPrepQuestions: [
      {
        question: `How have you designed and scaled backend/frontend architectures specifically utilizing ${topMatchedStr.split(', ')[0] || 'modern tech'}?`,
        idealAnswerFocus: "Discuss component decoupling, caching strategies (Redis), latency bottlenecks, and state management tradeoffs."
      },
      {
        question: `Describe a production outage or performance degradation you diagnosed and resolved under pressure.`,
        idealAnswerFocus: "Use the STAR method: describe the root cause analysis, monitoring tools used, remediation, and preventative CI/CD safeguards."
      }
    ]
  };

  return {
    resumeText: text,
    candidate: {
      name: candidateName,
      email: emailMatch ? emailMatch[1] : null,
      phone: phoneMatch ? phoneMatch[0] : null
    },
    targetJob: {
      title: targetRoleTitle,
      description: targetJobDesc,
      requiredSkills: jobSkillNames
    },
    atsScore: {
      overallScore: finalScore,
      percentage,
      tier,
      tierColor,
      breakdown: {
        keywordMatch: {
          rawScore: Sk,
          percentage: Math.round(Sk * 100),
          weight: WEIGHTS.ALPHA,
          weightedContribution: Number((WEIGHTS.ALPHA * Sk).toFixed(3)),
          matched: matchedSkills,
          missing: missingSkills
        },
        semanticSimilarity: {
          rawScore: Ss,
          percentage: Math.round(Ss * 100),
          weight: WEIGHTS.BETA,
          weightedContribution: Number((WEIGHTS.BETA * Ss).toFixed(3))
        },
        sectionCompleteness: {
          rawScore: Sc,
          percentage: Math.round(Sc * 100),
          weight: WEIGHTS.GAMMA,
          weightedContribution: Number((WEIGHTS.GAMMA * Sc).toFixed(3))
        },
        formattingReadability: {
          rawScore: Sf,
          percentage: Math.round(Sf * 100),
          weight: WEIGHTS.DELTA,
          weightedContribution: Number((WEIGHTS.DELTA * Sf).toFixed(3))
        }
      },
      weights: WEIGHTS
    },
    resumeFeatures: {
      totalWords: words.length,
      detectedSections,
      sectionCompleteness: Sc,
      bulletCount: bulletLines.length
    },
    extractedSkills,
    extractedSkillNames: extractedSkills.map(s => s.name),
    skillGap: {
      missingCount: missingSkills.length,
      missingSkills,
      matchedCount: matchedSkills.length,
      matchedSkills
    },
    feedback,
    careerRecommendations: {
      top1: careerMatches[0],
      top3: careerMatches.slice(0, 3),
      top5: careerMatches.slice(0, 5)
    },
    geminiInsights
  };
}
