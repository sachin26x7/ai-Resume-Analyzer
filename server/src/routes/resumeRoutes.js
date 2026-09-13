const express = require('express');
const multer = require('multer');
const pdfParse = require('pdf-parse');

const { parseResumeContent } = require('../nlp/preprocessor');
const { computeSemanticMatch } = require('../nlp/semanticMatcher');
const { computeATSScore } = require('../nlp/atsScorer');
const { generatePersonalizedFeedback } = require('../nlp/feedbackGenerator');
const { recommendCareers } = require('../nlp/careerRecommender');
const { generateGeminiInsights } = require('../nlp/geminiAnalyzer');
const { JOB_ROLE_TEMPLATES } = require('../nlp/jobRoleTemplates');
const CandidateProfile = require('../models/CandidateProfile');
const JobRole = require('../models/JobRole');
const mongoose = require('mongoose');

const router = express.Router();

function isLikelyResumeText(text) {
  const normalizedText = text.toLowerCase();
  const sectionMatches = [
    /\b(summary|profile|objective)\b/,
    /\b(skills|technical skills|competencies|technologies)\b/,
    /\b(experience|employment|work history|internship)\b/,
    /\b(education|academic|qualification)\b/,
    /\b(projects|certifications|achievements)\b/
  ].filter(pattern => pattern.test(normalizedText)).length;
  const hasContactDetails = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i.test(text)
    || /\b(linkedin|github)\.com\b/i.test(text)
    || /(?:\+?\d[\d\s().-]{8,}\d)/.test(text);
  const hasCareerLanguage = /\b(developed|engineered|managed|designed|deployed|worked|built|responsibilit(?:y|ies))\b/i.test(text);

  return sectionMatches >= 2 || (sectionMatches >= 1 && hasContactDetails && hasCareerLanguage);
}

// Configure Multer for in-memory PDF uploads (Render & cloud friendly)
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB max
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf' || file.originalname.toLowerCase().endsWith('.pdf') || file.mimetype === 'text/plain') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF and Plain Text files are supported!'), false);
    }
  }
});

/**
 * In-memory fallback cache if MongoDB is not connected
 */
let inMemoryHistory = [];

/**
 * POST /api/resume/analyze
 * Comprehensive Resume Analysis, ATS Scoring, Feedback & Career Recommendations
 */
router.post('/analyze', upload.single('resumeFile'), async (req, res) => {
  try {
    let resumeText = (req.body.resumeText || '').trim();
    const targetJobTitle = req.body.targetJobTitle || 'Full Stack Software Engineer';

    // If PDF file was uploaded, extract text using pdf-parse.
    if (req.file) {
      try {
        if (req.file.mimetype === 'application/pdf' || (req.file.originalname && req.file.originalname.toLowerCase().endsWith('.pdf'))) {
          const pdfData = await pdfParse(req.file.buffer);
          if (pdfData && pdfData.text && pdfData.text.trim().length > 0) {
            resumeText = pdfData.text.trim();
          }
        } else {
          const rawFileText = req.file.buffer.toString('utf-8');
          if (rawFileText && rawFileText.trim().length > 0) {
            resumeText = rawFileText.trim();
          }
        }
      } catch (pdfErr) {
        return res.status(422).json({
          success: false,
          error: 'Please upload a valid resume or CV PDF with selectable text.'
        });
      }
    }

    if (!resumeText || resumeText.length < 5 || (req.file && !isLikelyResumeText(resumeText))) {
      return res.status(422).json({
        success: false,
        error: 'Please upload a valid resume or CV PDF. The uploaded document does not look like a resume.'
      });
    }
    let targetJobDescription = req.body.targetJobDescription || '';
    let jobRequiredSkills = [];

    // Parse jobRequiredSkills if passed as JSON string
    if (req.body.jobRequiredSkills) {
      try {
        jobRequiredSkills = typeof req.body.jobRequiredSkills === 'string'
          ? JSON.parse(req.body.jobRequiredSkills)
          : req.body.jobRequiredSkills;
      } catch (e) {
        jobRequiredSkills = req.body.jobRequiredSkills.split(',').map(s => s.trim()).filter(Boolean);
      }
    }

    // Default JD description if empty
    if (!targetJobDescription) {
      const templateMatch = JOB_ROLE_TEMPLATES.find(
        r => r.title.toLowerCase().includes(targetJobTitle.toLowerCase()) ||
             targetJobTitle.toLowerCase().includes(r.title.toLowerCase())
      );
      if (templateMatch) {
        targetJobDescription = `${templateMatch.title}. ${templateMatch.description} Core requirements: ${templateMatch.coreSkills.join(', ')}. Secondary requirements: ${templateMatch.secondarySkills.join(', ')}.`;
        if (jobRequiredSkills.length === 0) {
          jobRequiredSkills = [...templateMatch.coreSkills, ...templateMatch.secondarySkills];
        }
      } else {
        targetJobDescription = `${targetJobTitle}. Requires modern software engineering practices, clean code, scalable architecture, version control, and problem solving.`;
      }
    }

    // User preferences (location, salary)
    let preferences = {};
    if (req.body.preferences) {
      try {
        preferences = typeof req.body.preferences === 'string'
          ? JSON.parse(req.body.preferences)
          : req.body.preferences;
      } catch (e) {
        preferences = {};
      }
    }

    // MODULE 1: Resume Acquisition & Preprocessing (T = P(R), Tc = {w1, ..., wn})
    const resumeParsed = parseResumeContent(resumeText);

    // MODULE 2: Semantic Analysis & Contextual Embedding (Vr = f(Tc), Vj = f(J), Sim(Vr, Vj))
    const semanticResult = computeSemanticMatch(resumeParsed, targetJobDescription);

    // If no explicit skills provided, infer target skills from JD
    if (jobRequiredSkills.length === 0) {
      jobRequiredSkills = semanticResult.jobSkillNames.length > 0
        ? semanticResult.jobSkillNames
        : ['JavaScript', 'React.js', 'Node.js', 'Git & Version Control', 'RESTful APIs'];
    }

    // MODULE 3: ATS Compatibility Scoring (ATS_score = alpha*Sk + beta*Ss + gamma*Sc + delta*Sf)
    const atsScoreResult = computeATSScore({
      extractedSkills: resumeParsed.extractedSkills,
      jobRequiredSkills: jobRequiredSkills,
      semanticSimilarity: semanticResult.semanticSimilarity,
      sectionCompletenessRatio: resumeParsed.sectionCompletenessRatio,
      formattingScore: resumeParsed.formatting.formattingScore
    });

    // MODULE 4: Personalized Feedback Generation (G = Kj - E)
    const personalizedFeedback = generatePersonalizedFeedback({
      resumeParsed,
      atsResult: atsScoreResult,
      jobRequiredSkills,
      jobTitle: targetJobTitle
    });

    // MODULE 5: Career Recommendations (Match_i = Sim(Vr, Vi), Rrec = TopK(Match_i))
    const careerRecommendations = recommendCareers(resumeParsed, preferences);

    // MODULE 6: Gemini AI Deep Analysis & Recruiter Insights
    let geminiInsights = null;
    try {
      geminiInsights = await generateGeminiInsights({
        resumeText,
        targetJobTitle,
        targetJobDescription,
        atsScore: atsScoreResult.percentage,
        matchedSkills: atsScoreResult.breakdown.keywordMatch.matched,
        missingSkills: atsScoreResult.breakdown.keywordMatch.missing
      });
    } catch (geminiErr) {
      console.warn('Gemini analysis skipped:', geminiErr.message);
    }

    const payload = {
      success: true,
      analysisId: 'res_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
      candidate: resumeParsed.metadata,
      targetJob: {
        title: targetJobTitle,
        description: targetJobDescription,
        requiredSkills: jobRequiredSkills
      },
      atsScore: atsScoreResult,
      resumeFeatures: {
        totalWords: resumeParsed.formatting.totalWords,
        detectedSections: resumeParsed.detectedSectionsList,
        sectionCompleteness: resumeParsed.sectionCompletenessRatio,
        formattingMetrics: resumeParsed.formatting
      },
      extractedSkills: resumeParsed.extractedSkills,
      extractedSkillNames: resumeParsed.extractedSkillNames,
      skillGap: {
        missingCount: atsScoreResult.breakdown.keywordMatch.missing.length,
        missingSkills: atsScoreResult.breakdown.keywordMatch.missing,
        matchedCount: atsScoreResult.breakdown.keywordMatch.matched.length,
        matchedSkills: atsScoreResult.breakdown.keywordMatch.matched
      },
      feedback: personalizedFeedback,
      careerRecommendations,
      geminiInsights,
      timestamp: new Date().toISOString()
    };

    // Save only candidate details to MongoDB
    try {
      if (mongoose.connection.readyState === 1) {
        const candidate = resumeParsed.metadata;
        // Only save if we have at least a name or email
        if (candidate && (candidate.name || candidate.email)) {
          await CandidateProfile.create({
            name: candidate.name || null,
            email: candidate.email || null,
            phone: candidate.phone || null,
            linkedin: candidate.linkedin || null,
            github: candidate.github || null,
            targetJobTitle: targetJobTitle || null,
            atsScore: atsScoreResult.percentage || null
          });
          console.log(`💾 Saved candidate profile to MongoDB: ${candidate.name || candidate.email}`);
        }
      }
    } catch (dbErr) {
      console.warn('MongoDB save note:', dbErr.message);
    }

    // Always maintain in-memory history cache as well
    inMemoryHistory.unshift(payload);
    if (inMemoryHistory.length > 50) inMemoryHistory.pop();

    return res.status(200).json(payload);
  } catch (error) {
    console.error('Error in /api/resume/analyze:', error);
    return res.status(500).json({
      success: false,
      error: 'An error occurred during resume analysis: ' + error.message
    });
  }
});

/**
 * GET /api/resume/roles
 * Returns standard predefined job role templates (from MongoDB or static catalog)
 */
router.get('/roles', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const dbRoles = await JobRole.find();
      if (dbRoles && dbRoles.length > 0) {
        return res.json({ success: true, roles: dbRoles });
      }
    }
    return res.json({
      success: true,
      roles: JOB_ROLE_TEMPLATES
    });
  } catch (err) {
    return res.json({
      success: true,
      roles: JOB_ROLE_TEMPLATES
    });
  }
});

/**
 * GET /api/resume/history
 * Returns recent analysis entries from MongoDB database or memory cache
 */
router.get('/history', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const records = await CandidateProfile.find().sort({ createdAt: -1 }).limit(30);
      return res.json({ success: true, history: records, source: 'mongodb' });
    }
    return res.json({ success: true, history: inMemoryHistory, source: 'in-memory' });
  } catch (error) {
    return res.json({ success: true, history: inMemoryHistory, source: 'in-memory' });
  }
});

/**
 * DELETE /api/resume/history/:id
 * Deletes a single analysis history entry from MongoDB
 */
router.delete('/history/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (mongoose.connection.readyState === 1) {
      await CandidateProfile.deleteOne({ _id: id });
    }
    inMemoryHistory = inMemoryHistory.filter(h => (h._id && h._id.toString() !== id) && h.analysisId !== id);
    return res.json({ success: true, message: 'History record deleted successfully from MongoDB' });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * DELETE /api/resume/history
 * Clears all analysis history entries from MongoDB
 */
router.delete('/history', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      await CandidateProfile.deleteMany({});
    }
    inMemoryHistory = [];
    return res.json({ success: true, message: 'All history records cleared from MongoDB' });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * GET /api/resume/samples
 * Provides realistic pre-built sample resumes for instant testing & evaluation
 */
router.get('/samples', (req, res) => {
  const samples = [
    {
      id: 'sample-fullstack',
      name: 'Subhadeep Sharma (Full Stack MERN Developer)',
      targetRole: 'Full Stack MERN Developer',
      text: `SUBHADEEP SHARMA
Kolkata, India | +91 98765 43210 | subhadeep.dev@gmail.com | linkedin.com/in/subhadeep-dev | github.com/subhadeep-mern

PROFESSIONAL SUMMARY
Results-driven Full Stack MERN Developer with 3+ years of experience building high-performance web applications using React.js, Node.js, Express, and MongoDB. Specialized in RESTful API engineering, state management, and modern responsive UI.

TECHNICAL SKILLS
• Programming Languages: JavaScript (ES6+), TypeScript, HTML5, CSS3, SQL
• Frontend: React.js, Redux Toolkit, Next.js, Tailwind CSS, Bootstrap
• Backend & APIs: Node.js, Express.js, RESTful APIs, GraphQL, JWT Authentication
• Databases & Cloud: MongoDB, PostgreSQL, Redis, AWS (S3, EC2), Docker
• Tools & Methodologies: Git, GitHub, Agile/Scrum, Jest, CI/CD Pipelines

WORK EXPERIENCE
Senior Full Stack Engineer | TechCorp Solutions, Bengaluru (2023 - Present)
• Architected scalable web microservices handling 250,000+ monthly active users with 99.9% uptime.
• Engineered responsive frontend dashboards with React.js and Tailwind CSS, improving load speed by 42%.
• Built secure REST APIs in Express.js with JWT authentication, rate limiting, and MongoDB aggregation pipelines.
• Integrated automated CI/CD pipelines with GitHub Actions, cutting release deployment cycles by 35%.

Full Stack Developer | NexGen Digital, Kolkata (2021 - 2023)
• Developed responsive web applications using React.js, Redux, Node.js, and MongoDB.
• Optimized slow MongoDB queries with indexing and caching via Redis, decreasing query latency by 55%.
• Mentored junior developers in writing clean, modular, and test-covered JavaScript and TypeScript code.

PROJECTS
1. AI-Powered Resume Analyzer (React, Node.js, NLP, MongoDB)
• Implemented natural language processing pipeline to extract technical skills and compute ATS compatibility score.
• Designed interactive analytics dashboard with real-time feedback and career recommendations.

2. E-Commerce Microservices Platform (React, Express, Redis, Docker)
• Engineered distributed microservices for cart, payment, and inventory management with Stripe API integration.

EDUCATION
Bachelor of Technology in Information Technology | Institute of Technology & Science, Kolkata (2017 - 2021)
• CGPA: 8.8 / 10.0 | Relevant Coursework: Data Structures, Database Systems, Cloud Computing, NLP

CERTIFICATIONS
• AWS Certified Solutions Architect – Associate
• MongoDB Certified Developer Associate`
    },
    {
      id: 'sample-ai-engineer',
      name: 'Jayanti Roy (AI / Machine Learning Engineer)',
      targetRole: 'AI / Machine Learning Engineer',
      text: `JAYANTI ROY
San Francisco, CA | jayanti.ml@ai-research.org | +1 (415) 890-1234 | github.com/jayanti-ai | linkedin.com/in/jayanti-roy

PROFESSIONAL SUMMARY
AI & Machine Learning Engineer with specialized expertise in Natural Language Processing (NLP), Large Language Models (LLMs), and deep learning architectures. Proven track record of training transformer models and deploying scalable inference pipelines in production.

TECHNICAL SKILLS
• Languages: Python, C++, SQL, Bash / Shell
• AI / Machine Learning: PyTorch, TensorFlow, Scikit-Learn, HuggingFace Transformers, LangChain, Deep Learning, Computer Vision
• NLP & Semantic Analysis: SpaCy, NLTK, BERT, Word2Vec, Contextual Vector Embeddings, LLMs / Generative AI
• Data Engineering: Pandas, NumPy, Data Visualization (Matplotlib, Seaborn), Big Data
• Cloud & MLOps: Docker, Kubernetes, AWS, FastAPI, CI/CD Pipelines, Git

WORK EXPERIENCE
Machine Learning Engineer | Apex AI Labs (2023 - Present)
• Spearheaded development of proprietary LLM embedding pipeline for document retrieval, boosting semantic search accuracy by 28%.
• Optimized transformer inference latency using ONNX Runtime and TensorRT, reducing p99 latency from 180ms to 45ms.
• Engineered automated data validation and fine-tuning pipelines using PyTorch and HuggingFace.

AI Research Fellow | AI Research Consortium (2021 - 2023)
• Published research on semantic text analysis, skill ontology mapping, and ATS applicant ranking algorithms.
• Designed contextual vector scoring framework correlating 87% with human recruiter assessments.

PROJECTS
• Neural Resume Evaluator: End-to-end NLP skill extraction framework using Named Entity Recognition and vector similarity.
• Multimodal Document QA: Generative AI retrieval system utilizing vector databases and transformer embeddings.

EDUCATION
Master of Science in Computer Science & AI | University of California, Berkeley
Bachelor of Technology in Information Technology | Institute of Technology & Science`
    }
  ];

  return res.json({ success: true, samples });
});

module.exports = router;
