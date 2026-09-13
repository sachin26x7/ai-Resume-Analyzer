const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const resumeRoutes = require('./routes/resumeRoutes');

dotenv.config();
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

if (![process.env.GEMINI_API_KEY, process.env.GOOGLE_GENAI_API_KEY, process.env.GOOGLE_API_KEY]
  .some(value => typeof value === 'string' && value.trim())) {
  console.warn('Gemini AI is disabled: set GEMINI_API_KEY in server/.env to enable live insights.');
}

const app = express();
const PORT = process.env.PORT || 5000;
const allowedOrigins = [
  process.env.CLIENT_URL,
  'https://elegant-lokum-cf3449.netlify.app'
]
  .filter(Boolean)
  .map(origin => origin.trim().replace(/\/$/, ''));

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests without origin
    // (Postman, server-to-server, etc.)
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    console.log('❌ CORS blocked origin:', origin);
    return callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Health check endpoint (Render Deployment Health Checks)
app.get('/api/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'NLP Resume Analyzer API',
    version: '1.0.0',
    database: dbStatus,
    framework: 'MERN Stack + NLP Research Framework'
  });
});

// API Routes
app.use('/api/resume', resumeRoutes);

// Root route welcome
app.get('/', (req, res) => {
  res.json({
    message: 'NLP-Based Resume Analysis & Career Recommendation API is Running',
    documentation: '/api/health',
    endpoints: [
      'POST /api/resume/analyze',
      'GET /api/resume/roles',
      'GET /api/resume/samples',
      'GET /api/resume/history',
      'GET /api/health'
    ]
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server Unhandled Error:', err);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal Server Error'
  });
});

// Connect to MongoDB if URI is configured
const MONGODB_URI = process.env.MONGODB_URI;
const JobRole = require('./models/JobRole');
const { JOB_ROLE_TEMPLATES } = require('./nlp/jobRoleTemplates');

if (MONGODB_URI && !MONGODB_URI.includes('<username>')) {
  mongoose.connect(MONGODB_URI)
    .then(async () => {
      console.log('✅ Connected to MongoDB Atlas database successfully');
      try {
        const count = await JobRole.countDocuments();
        if (count === 0) {
          await JobRole.insertMany(JOB_ROLE_TEMPLATES.map(r => ({
            id: r.id,
            title: r.title,
            domain: r.domain,
            experienceLevel: r.experienceLevel,
            salaryRange: r.salaryRange,
            locationTypes: r.locationTypes,
            topLocations: r.topLocations,
            coreSkills: r.coreSkills,
            secondarySkills: r.secondarySkills,
            description: r.description
          })));
          console.log(`📦 Seeded ${JOB_ROLE_TEMPLATES.length} Job Roles into MongoDB`);
        }
      } catch (seedErr) {
        console.warn('MongoDB role seed info:', seedErr.message);
      }
    })
    .catch((err) => console.warn('⚠️ MongoDB connection warning:', err.message));
} else {
  console.log('ℹ️ Running in resilient mode without active MongoDB connection (In-memory analysis enabled)');
}

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 AI Resume Analyzer API running on port ${PORT}`);
  console.log(`📡 Health check available at: http://localhost:${PORT}/api/health`);
});

module.exports = app;
