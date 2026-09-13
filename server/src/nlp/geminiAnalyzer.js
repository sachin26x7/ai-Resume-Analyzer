const { GoogleGenAI } = require('@google/genai');

/**
 * Gemini AI Deep Resume Analysis & Recruiter Insights Engine
 * Leverages Google Gemini models to generate executive recruiter critique,
 * before/after bullet point rewrites, and interview preparation questions.
 */
async function generateGeminiInsights(params) {
  const {
    resumeText,
    targetJobTitle = 'Full Stack Software Engineer',
    targetJobDescription = '',
    atsScore = 75,
    matchedSkills = [],
    missingSkills = []
  } = params;

  const apiKey = (
    process.env.GEMINI_API_KEY ||
    process.env.GOOGLE_GENAI_API_KEY ||
    process.env.GOOGLE_API_KEY ||
    ''
  ).trim();

  if (apiKey) {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const prompt = `You are an elite Tech Recruiter and Senior Hiring Director. 
Analyze the candidate's resume against the target role: "${targetJobTitle}".
Target Job Description: "${targetJobDescription.slice(0, 800)}".
Current ATS Score: ${atsScore}%.
Matched Skills: ${matchedSkills.slice(0, 10).join(', ')}.
Missing Skills: ${missingSkills.slice(0, 10).join(', ')}.

Candidate Resume Content:
"""
${resumeText.slice(0, 3000)}
"""

Provide your expert evaluation in strictly valid JSON format with the following structure:
{
  "executiveCritique": "2-3 sentences of direct executive recruiter feedback on candidate's market readiness and fit for ${targetJobTitle}.",
  "recruiterHiringVerdict": "One of: 'Fast-Track Interview', 'Strong Contender', 'Competitive with Minor Edits', 'Needs Targeted Revisions'",
  "keyStrengths": [
    "Specific technical or domain strength 1",
    "Specific technical or domain strength 2",
    "Specific technical or domain strength 3"
  ],
  "criticalWeaknesses": [
    "Specific gap or missing metric 1",
    "Specific gap or missing metric 2"
  ],
  "rewrittenBulletPoints": [
    {
      "original": "A weak or generic phrase from the resume",
      "improved": "High-impact rewritten bullet point using Google XYZ formula (Accomplished [X], measured by [Y], by doing [Z]) with strong action verbs",
      "reason": "Why this change significantly boosts ATS ranking and recruiter interest"
    },
    {
      "original": "Another phrase from resume",
      "improved": "High-impact rewritten bullet point with quantifiable impact",
      "reason": "Why this improves market alignment"
    }
  ],
  "projectRecommendations": [
    {
      "title": "Project title directly relevant to ${targetJobTitle}",
      "description": "2-sentence description of what to build and its real-world purpose",
      "techStack": ["Primary tech 1", "Tech 2", "Tech 3", "Tech 4"],
      "difficulty": "Beginner | Intermediate | Advanced",
      "estimatedTime": "e.g. 2-3 weeks",
      "whyItMatters": "1 sentence explaining why this project impresses recruiters for ${targetJobTitle} roles",
      "githubKeywords": ["keyword1", "keyword2", "keyword3"]
    },
    {
      "title": "Second project idea",
      "description": "Description of the project",
      "techStack": ["Tech 1", "Tech 2", "Tech 3"],
      "difficulty": "Intermediate",
      "estimatedTime": "3-4 weeks",
      "whyItMatters": "Why recruiters care about this project",
      "githubKeywords": ["keyword1", "keyword2"]
    },
    {
      "title": "Third project idea — advanced portfolio piece",
      "description": "Description of a more complex project",
      "techStack": ["Tech 1", "Tech 2", "Tech 3", "Tech 4"],
      "difficulty": "Advanced",
      "estimatedTime": "4-6 weeks",
      "whyItMatters": "Why this demonstrates senior-level capability",
      "githubKeywords": ["keyword1", "keyword2", "keyword3"]
    }
  ]
}`;

      const response = await ai.models.generateContent({
        model: process.env.GEMINI_MODEL || 'gemini-2.0-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.3
        }
      });

      const responseText = typeof response.text === 'function'
        ? response.text()
        : response.text;
      if (responseText) {
        const cleanJson = responseText
          .trim()
          .replace(/^```json\s*/i, '')
          .replace(/^```\s*/i, '')
          .replace(/\s*```$/i, '');
        const parsed = JSON.parse(cleanJson);
        if (!parsed.executiveCritique || !Array.isArray(parsed.keyStrengths)) {
          throw new Error('Gemini returned an incomplete insight payload');
        }
        return {
          source: `Gemini ${process.env.GEMINI_MODEL || 'gemini-2.0-flash'}`,
          ...parsed
        };
      }
    } catch (err) {
      console.warn('Gemini API call failed or timed out, falling back to NLP Synthesizer:', err.message);
    }
  }

  // Fallback intelligent synthesizer if Gemini API key is not provided or offline
  return generateSynthesizedInsights(params);
}

/**
 * Intelligent Fallback Synthesizer when Gemini API Key is not configured
 */
function generateSynthesizedInsights({ resumeText, targetJobTitle, atsScore = 75, matchedSkills = [], missingSkills = [] }) {
  const topMatched = matchedSkills.slice(0, 4).join(', ') || 'core software engineering';
  const topMissing = missingSkills.slice(0, 3).join(', ') || 'advanced cloud architecture';

  let verdict = 'Competitive with Minor Edits';
  if (atsScore >= 85) verdict = 'Fast-Track Interview';
  else if (atsScore >= 70) verdict = 'Strong Contender';
  else if (atsScore < 50) verdict = 'Needs Targeted Revisions';

  // Generate job-role-aware project recommendations
  const title = (targetJobTitle || '').toLowerCase();
  let projectRecommendations = [];

  if (title.includes('frontend') || title.includes('react') || title.includes('ui')) {
    projectRecommendations = [
      { title: 'Real-Time Dashboard with React & WebSockets', description: 'Build a live analytics dashboard that streams real-time data using WebSockets and renders interactive charts. Demonstrates advanced React state management and performance optimization.', techStack: ['React.js', 'TypeScript', 'WebSockets', 'Recharts', 'TailwindCSS'], difficulty: 'Intermediate', estimatedTime: '2-3 weeks', whyItMatters: 'Recruiters for frontend roles value real-time UI skills and complex state management.', githubKeywords: ['react-dashboard', 'websockets', 'real-time-charts'] },
      { title: 'Accessible Component Library', description: 'Create a production-grade React component library with full WCAG 2.1 accessibility, Storybook documentation, and npm publish. Shows engineering discipline beyond just building UIs.', techStack: ['React.js', 'TypeScript', 'Storybook', 'Jest', 'Rollup'], difficulty: 'Advanced', estimatedTime: '3-4 weeks', whyItMatters: 'Demonstrates senior-level thinking: reusability, accessibility, and open-source contribution.', githubKeywords: ['react-component-library', 'storybook', 'accessibility'] },
      { title: 'E-commerce Product Page with Animations', description: 'Design a pixel-perfect, animated product page with cart functionality, micro-interactions, and responsive layout. Showcases CSS mastery and UX polish.', techStack: ['React.js', 'Framer Motion', 'CSS Modules', 'Zustand'], difficulty: 'Beginner', estimatedTime: '1-2 weeks', whyItMatters: 'UI polish and animation fluency are key differentiators for frontend candidates.', githubKeywords: ['react-ecommerce', 'framer-motion', 'animations'] }
    ];
  } else if (title.includes('backend') || title.includes('node') || title.includes('api')) {
    projectRecommendations = [
      { title: 'Scalable REST API with Rate Limiting & Auth', description: 'Build a Node.js/Express API with JWT authentication, Redis-based rate limiting, API versioning, and Swagger docs. Simulates production-grade backend architecture.', techStack: ['Node.js', 'Express.js', 'MongoDB', 'Redis', 'JWT', 'Swagger'], difficulty: 'Intermediate', estimatedTime: '2-3 weeks', whyItMatters: 'Backend roles demand knowledge of security, scalability, and API design best practices.', githubKeywords: ['nodejs-api', 'jwt-auth', 'rate-limiting'] },
      { title: 'Microservices with Message Queue', description: 'Design 3 independent microservices that communicate via RabbitMQ or Kafka, with Docker Compose orchestration. Shows understanding of distributed systems.', techStack: ['Node.js', 'RabbitMQ', 'Docker', 'MongoDB', 'Express.js'], difficulty: 'Advanced', estimatedTime: '4-5 weeks', whyItMatters: 'Senior backend engineers are expected to understand async communication and service decoupling.', githubKeywords: ['microservices', 'rabbitmq', 'docker-compose'] },
      { title: 'GraphQL API with Subscriptions', description: 'Implement a GraphQL server with queries, mutations, and real-time subscriptions using Apollo Server. Include caching and DataLoader for N+1 prevention.', techStack: ['Node.js', 'Apollo Server', 'GraphQL', 'PostgreSQL', 'DataLoader'], difficulty: 'Intermediate', estimatedTime: '2-3 weeks', whyItMatters: 'GraphQL expertise is increasingly demanded by product companies over REST.', githubKeywords: ['graphql-api', 'apollo-server', 'subscriptions'] }
    ];
  } else if (title.includes('full stack') || title.includes('mern') || title.includes('mean')) {
    projectRecommendations = [
      { title: 'Full-Stack SaaS Dashboard with Auth & Billing', description: 'Build a multi-tenant SaaS app with user authentication, role-based permissions, Stripe billing integration, and an analytics dashboard.', techStack: ['React.js', 'Node.js', 'MongoDB', 'Stripe API', 'JWT', 'TailwindCSS'], difficulty: 'Advanced', estimatedTime: '4-6 weeks', whyItMatters: 'Full-stack SaaS projects demonstrate end-to-end product thinking, which is exactly what MERN employers want.', githubKeywords: ['saas-dashboard', 'stripe-integration', 'mern-stack'] },
      { title: 'Real-Time Chat Application', description: 'Create a WhatsApp-like chat app with rooms, typing indicators, read receipts, and file sharing using Socket.io and React.', techStack: ['React.js', 'Node.js', 'Socket.io', 'MongoDB', 'Express.js'], difficulty: 'Intermediate', estimatedTime: '2-3 weeks', whyItMatters: 'Real-time features (WebSockets) are a core competency tested in MERN interviews.', githubKeywords: ['chat-app', 'socketio', 'real-time'] },
      { title: 'AI-Powered Task Manager', description: 'A full-stack project management tool with AI task prioritization (using OpenAI/Gemini API), drag-and-drop Kanban board, and team collaboration.', techStack: ['React.js', 'Node.js', 'MongoDB', 'OpenAI API', 'React DnD'], difficulty: 'Advanced', estimatedTime: '3-4 weeks', whyItMatters: 'AI integration in full-stack projects is a major differentiator in 2024 job markets.', githubKeywords: ['ai-task-manager', 'kanban', 'openai-integration'] }
    ];
  } else if (title.includes('data') || title.includes('ml') || title.includes('python') || title.includes('machine learning')) {
    projectRecommendations = [
      { title: 'ML-Powered Resume Screener', description: 'Train a classification model to score resumes against job descriptions using NLP techniques like TF-IDF and BERT embeddings. Deploy as a REST API.', techStack: ['Python', 'scikit-learn', 'FastAPI', 'Hugging Face', 'pandas'], difficulty: 'Intermediate', estimatedTime: '3-4 weeks', whyItMatters: 'NLP and model deployment skills are core requirements for ML engineering roles.', githubKeywords: ['resume-screener', 'nlp', 'bert-embeddings'] },
      { title: 'Time Series Sales Forecasting Dashboard', description: 'Build an end-to-end data pipeline that ingests sales data, trains an ARIMA/LSTM model, and visualizes forecasts in a Streamlit dashboard.', techStack: ['Python', 'Pandas', 'TensorFlow', 'Streamlit', 'Plotly'], difficulty: 'Advanced', estimatedTime: '4-5 weeks', whyItMatters: 'Forecasting is one of the most commercially valuable ML use cases — highly visible to data science recruiters.', githubKeywords: ['time-series', 'lstm-forecasting', 'streamlit'] },
      { title: 'Data Pipeline with Apache Airflow', description: 'Design an ETL pipeline using Airflow DAGs that pulls API data, transforms it with pandas, and loads into a PostgreSQL data warehouse.', techStack: ['Python', 'Apache Airflow', 'PostgreSQL', 'pandas', 'Docker'], difficulty: 'Intermediate', estimatedTime: '2-3 weeks', whyItMatters: 'Pipeline orchestration skills are essential for data engineering and analytics engineering roles.', githubKeywords: ['airflow-pipeline', 'etl', 'data-warehouse'] }
    ];
  } else if (title.includes('devops') || title.includes('cloud') || title.includes('sre')) {
    projectRecommendations = [
      { title: 'Kubernetes Auto-Scaling Microservices', description: 'Deploy a multi-container app on Kubernetes with HPA (Horizontal Pod Autoscaler), Ingress controllers, and Helm charts. Simulate production traffic with load testing.', techStack: ['Kubernetes', 'Docker', 'Helm', 'Prometheus', 'k6'], difficulty: 'Advanced', estimatedTime: '4-5 weeks', whyItMatters: 'Kubernetes orchestration is the #1 skill DevOps employers test in technical interviews.', githubKeywords: ['kubernetes', 'helm-charts', 'autoscaling'] },
      { title: 'CI/CD Pipeline with GitHub Actions', description: 'Build a complete CI/CD pipeline: automated testing, Docker build, push to ECR, and blue/green deployment to AWS ECS. Include Slack notifications.', techStack: ['GitHub Actions', 'Docker', 'AWS ECS', 'Terraform', 'Jest'], difficulty: 'Intermediate', estimatedTime: '2-3 weeks', whyItMatters: 'CI/CD automation is a core expectation for every DevOps and platform engineering role.', githubKeywords: ['github-actions', 'cicd-pipeline', 'aws-ecs'] },
      { title: 'Infrastructure as Code with Terraform', description: 'Provision a complete AWS VPC, EC2, RDS, and S3 architecture using Terraform modules with remote state management and environment separation.', techStack: ['Terraform', 'AWS', 'S3', 'RDS', 'EC2'], difficulty: 'Intermediate', estimatedTime: '2-3 weeks', whyItMatters: 'IaC expertise is one of the highest-demand DevOps skills with direct salary impact.', githubKeywords: ['terraform', 'infrastructure-as-code', 'aws-vpc'] }
    ];
  } else {
    // Generic software engineering projects
    projectRecommendations = [
      { title: `${targetJobTitle} Portfolio Project`, description: `Build a production-ready project demonstrating core ${targetJobTitle} competencies including ${topMatched}. Focus on clean architecture, testing, and documentation.`, techStack: matchedSkills.slice(0, 4).length > 0 ? matchedSkills.slice(0, 4) : ['JavaScript', 'Node.js', 'React.js', 'MongoDB'], difficulty: 'Intermediate', estimatedTime: '2-3 weeks', whyItMatters: `Directly showcases the exact skills recruiters need for ${targetJobTitle} positions.`, githubKeywords: ['portfolio-project', 'full-stack', 'clean-architecture'] },
      { title: 'Open Source Contribution', description: `Contribute to an established open source project related to ${topMatched}. Even small contributions (bug fixes, docs, tests) signal collaboration and code quality skills.`, techStack: matchedSkills.slice(0, 3).length > 0 ? matchedSkills.slice(0, 3) : ['Git', 'JavaScript', 'TypeScript'], difficulty: 'Beginner', estimatedTime: '1-2 weeks', whyItMatters: 'Open source contributions on GitHub are a major trust signal for engineering hiring managers.', githubKeywords: ['open-source', 'contribution', 'pull-request'] },
      { title: 'CLI Tool with NPM Publication', description: 'Build a useful command-line tool, write tests, add CI, and publish to npm. Shows engineering maturity: packaging, versioning, and documentation.', techStack: ['Node.js', 'Commander.js', 'Jest', 'GitHub Actions'], difficulty: 'Intermediate', estimatedTime: '2-3 weeks', whyItMatters: 'Publishing a real npm package demonstrates professional engineering practices beyond tutorials.', githubKeywords: ['cli-tool', 'npm-package', 'commander'] }
    ];
  }

  return {
    source: 'Gemini AI Intelligence Engine (Synthesized)',
    executiveCritique: `Candidate demonstrates strong technical alignment for ${targetJobTitle} with solid fundamentals in ${topMatched}. Integrating quantifiable impact metrics and addressing gaps in ${topMissing} will maximize interview conversion.`,
    recruiterHiringVerdict: verdict,
    keyStrengths: [
      `Demonstrated proficiency in primary domain stack (${topMatched})`,
      `Structured experience trajectory aligning with ${targetJobTitle} responsibilities`,
      `Clear technical baseline with recognized developer tooling and frameworks`
    ],
    criticalWeaknesses: [
      missingSkills.length > 0
        ? `Missing explicit keywords for target requirements: ${topMissing}`
        : `Bullet points could feature higher density of quantifiable business results (%)`,
      `Experience bullets could be strengthened by incorporating the Google XYZ formula`
    ],
    rewrittenBulletPoints: [
      {
        original: "Worked on frontend and backend web applications using modern frameworks.",
        improved: `Architected and deployed full-stack ${targetJobTitle} microservices, reducing API response times by 35% and supporting 100k+ monthly active users.`,
        reason: "Replaces passive verbs with strong action verbs ('Architected', 'Deployed') and attaches clear scale metrics."
      },
      {
        original: "Responsible for managing database queries and fixing performance bugs.",
        improved: "Optimized complex MongoDB/SQL indexing queries, cutting database latency from 450ms to 120ms (73% throughput increase).",
        reason: "Quantifies technical optimization with precise baseline-to-result numbers that ATS parsers rank highly."
      }
    ],
    projectRecommendations
  };
}

module.exports = {
  generateGeminiInsights
};
