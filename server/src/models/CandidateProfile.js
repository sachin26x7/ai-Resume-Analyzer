const mongoose = require('mongoose');

/**
 * Stores the complete resume analysis payload so history can be
 * fully restored from MongoDB without any localStorage dependency.
 */
const CandidateProfileSchema = new mongoose.Schema({
  analysisId: {
    type: String,
    index: true,
    trim: true
  },

  // ── Candidate contact details ────────────────────────────────────
  name: { type: String, default: null, trim: true },
  email: { type: String, default: null, trim: true, lowercase: true },
  phone: { type: String, default: null, trim: true },
  linkedin: { type: String, default: null, trim: true },
  github: { type: String, default: null, trim: true },

  // ── Target job ───────────────────────────────────────────────────
  targetJobTitle: { type: String, default: null, trim: true },
  targetJob: { type: mongoose.Schema.Types.Mixed, default: null },

  // ── ATS score (full object with percentage, tier, breakdown) ─────
  atsScore: { type: mongoose.Schema.Types.Mixed, default: null },

  // ── Skill gap ────────────────────────────────────────────────────
  skillGap: { type: mongoose.Schema.Types.Mixed, default: null },

  // ── Extracted skills & features ──────────────────────────────────
  extractedSkills: { type: mongoose.Schema.Types.Mixed, default: null },
  extractedSkillNames: { type: mongoose.Schema.Types.Mixed, default: null },
  resumeFeatures: { type: mongoose.Schema.Types.Mixed, default: null },

  // ── Analysis outputs ─────────────────────────────────────────────
  feedback: { type: mongoose.Schema.Types.Mixed, default: null },
  careerRecommendations: { type: mongoose.Schema.Types.Mixed, default: null },
  geminiInsights: { type: mongoose.Schema.Types.Mixed, default: null },

  // ── User preferences ─────────────────────────────────────────────
  preferences: { type: mongoose.Schema.Types.Mixed, default: null },

  // ── Resume text (for re-loading into the editor) ─────────────────
  resumeText: { type: String, default: null },

  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  }
});

module.exports = mongoose.model('CandidateProfile', CandidateProfileSchema);
