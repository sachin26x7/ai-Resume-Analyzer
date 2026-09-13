/**
 * Personalized Feedback Generation Algorithm (Research Paper Section IV-E)
 * Implements: G = Kj - E, Priority-ranked recommendations based on ATS Score Impact
 */

function generatePersonalizedFeedback(params) {
  const {
    resumeParsed,
    atsResult,
    jobRequiredSkills = [],
    jobTitle = "Target Role"
  } = params;

  const recommendations = [];
  const missingSkills = atsResult.breakdown.keywordMatch.missing || [];
  const formatting = resumeParsed.formatting;
  const sections = resumeParsed.detectedSectionsList;

  // Missing Skill Gaps (G = Kj - E)
  if (missingSkills.length > 0) {
    const topMissing = missingSkills.slice(0, 6);
    const scoreImpact = Math.round(
      (atsResult.weights.ALPHA * (missingSkills.length / Math.max(jobRequiredSkills.length, 1))) * 100
    );

    recommendations.push({
      id: 'missing-skills',
      rule: 'Skill Gap Optimization',
      category: 'Skills & Keywords',
      priority: 'HIGH',
      priorityRank: 1,
      title: `Integrate ${missingSkills.length} Critical Target Skills`,
      impact: `+${scoreImpact}% potential ATS boost`,
      description: `Your resume is missing ${missingSkills.length} key skills that recruiters and ATS systems are actively scanning for in ${jobTitle} roles. ATS platforms often auto-filter candidates whose resumes lack these exact keywords — even if you have the experience. Each missing skill can cost you a shortlist opportunity.`,
      actionItems: [
        ...topMissing.map(skill => `Add "${skill}" — include it in your Skills section and reinforce it with a bullet point showing where you applied it`),
        `Scan the job description for exact phrasing (e.g., "REST APIs" vs "RESTful APIs") and mirror it precisely in your resume`,
        `Prioritize skills that appear more than once in the JD — those are the non-negotiables for the role`
      ],
      chips: topMissing
    });
  }

  // Semantic Similarity Threshold Check
  const theta = 0.70;
  if (atsResult.breakdown.semanticSimilarity.rawScore < theta) {
    recommendations.push({
      id: 'semantic-alignment',
      rule: 'Contextual Experience Enhancement',
      category: 'Semantic Relevance',
      priority: 'HIGH',
      priorityRank: 2,
      title: `Align Experience Language with ${jobTitle} Requirements`,
      impact: `+15-25% ATS semantic boost`,
      description: `Your contextual similarity score is ${atsResult.breakdown.semanticSimilarity.percentage}%, which means your resume's language doesn't closely mirror how modern ${jobTitle} job descriptions are written. Modern ATS systems use NLP to measure how well your experience narratives align — not just keyword counts. Generic descriptions like "worked on projects" score significantly lower than results-driven language.`,
      actionItems: [
        `Apply the Google XYZ Formula to every bullet: "Accomplished [X] as measured by [Y] by doing [Z]" — e.g., "Reduced API latency by 40% by implementing Redis caching across 3 microservices"`,
        `Replace weak openers (Responsible for, Helped, Worked on) with high-impact action verbs: Engineered, Architected, Automated, Optimized, Spearheaded, Deployed`,
        `Quantify scale and impact in every bullet — include user counts, latency figures, team size, revenue impact, or deployment frequency`,
        `Mirror the exact phrasing from the job description in your Experience section, especially in the first 2 bullets of each role`
      ]
    });
  }

  // Section Completeness Check
  if (atsResult.breakdown.sectionCompleteness.rawScore < 1.0) {
    const expectedSections = ['Skills', 'Experience', 'Education', 'Projects'];
    const missingSections = expectedSections.filter(
      s => !sections.some(sec => sec.toLowerCase().includes(s.toLowerCase()))
    );

    if (missingSections.length > 0) {
      recommendations.push({
        id: 'section-completeness',
        rule: 'Section Completeness & Structure',
        category: 'Resume Structure',
        priority: 'MEDIUM',
        priorityRank: 3,
        title: `Add Standard Section Headers: ${missingSections.join(', ')}`,
        impact: `+${Math.round(atsResult.weights.GAMMA * (missingSections.length / 4) * 100)}% completeness boost`,
        description: `ATS parsers categorize your background by scanning for standard section headings. Missing sections like "${missingSections.join('", "')}" can cause your resume to be parsed incorrectly — burying valuable experience or making it invisible to filters. Many ATS systems will outright reject resumes that fail section detection thresholds.`,
        actionItems: [
          ...missingSections.map(sec => `Add a clearly labelled "${sec}" section — use a standard heading in plain text (not inside a table, text box, or image)`),
          `Ensure each section heading stands alone on its line and is not buried in a multi-column layout`,
          `Order sections as: Summary → Skills → Experience → Projects → Education — this is the sequence most ATS and recruiters expect`
        ]
      });
    }
  }

  // Formatting & Readability Optimizations
  if (!formatting.isBulletStructured || formatting.bulletPointsCount < 5) {
    recommendations.push({
      id: 'bullet-structure',
      rule: 'Formatting & Readability',
      category: 'Formatting',
      priority: 'MEDIUM',
      priorityRank: 4,
      title: 'Convert Paragraph Text to Structured Bullet Points',
      impact: '+5-10% readability boost',
      description: `Your resume contains dense paragraphs or fewer than 5 bullet points, which significantly reduces ATS parsing accuracy and recruiter engagement. Recruiters spend an average of 6–7 seconds scanning a resume — structured bullets allow them to immediately identify your impact. Dense paragraphs cause important skills and achievements to get buried and missed.`,
      actionItems: [
        `Convert each paragraph in your Experience section into 3–5 focused bullet points — one achievement or responsibility per bullet`,
        `Start every bullet with a strong past-tense action verb (e.g., Built, Implemented, Reduced, Launched, Scaled)`,
        `Keep each bullet to 1–2 lines — if it exceeds 2 lines, split it into two separate bullets`,
        `Use standard bullet characters (• or -) that every ATS can parse — avoid checkmarks, arrows, or emoji`
      ]
    });
  }

  if (formatting.quantifiableMetricsFound === 0) {
    recommendations.push({
      id: 'quantifiable-metrics',
      rule: 'Metric & Impact Enrichment',
      category: 'Impact Metrics',
      priority: 'MEDIUM',
      priorityRank: 5,
      title: 'Add Concrete Numbers & Performance Metrics to Every Role',
      impact: '+10% human evaluator score',
      description: `Your resume currently has no quantifiable metrics — no percentages, no scale figures, no time savings, no revenue numbers. Resumes with measurable results are rated 40% more positively by hiring managers. Metrics give recruiters confidence that your contributions had real business impact, not just activity. Without numbers, every bullet sounds like every other candidate's.`,
      actionItems: [
        `For every experience bullet, add at least one number: team size, latency reduction %, cost saved, users served, or throughput improvement`,
        `Example transformation: "Managed database performance" → "Optimized PostgreSQL query execution, reducing average response time from 850ms to 120ms (86% improvement)"`,
        `Use before/after comparisons wherever possible to show delta impact (e.g., "Reduced deployment time from 45 min to 8 min")`,
        `Even estimates are valuable — if exact numbers aren't available, use approximations: "~10k daily active users", "~30% faster build times"`
      ]
    });
  }

  // Contact info check
  if (!resumeParsed.metadata.email || !resumeParsed.metadata.phone) {
    recommendations.push({
      id: 'contact-completeness',
      rule: 'Header Compliance',
      category: 'Contact Info',
      priority: 'LOW',
      priorityRank: 6,
      title: 'Complete Your Contact Information Header',
      impact: 'Essential for recruiter outreach',
      description: `Your resume is missing one or more critical contact fields (Email or Phone). A recruiter who wants to move fast cannot reach you if this information is absent or hidden in a graphic header. ATS systems also extract contact details from plain text — headers embedded in images or columns are frequently skipped entirely, making your application invisible.`,
      actionItems: [
        `Place your full name, email, phone number, city/country, LinkedIn URL, and GitHub profile at the very top of your resume in plain text`,
        `Avoid placing contact details inside text boxes, images, or multi-column table headers — use a simple single-column layout for the header`,
        `Use a professional email address (firstname.lastname@gmail.com) — avoid nicknames, numbers, or old university addresses`,
        `Ensure your LinkedIn profile URL is customized (e.g., linkedin.com/in/yourname) and your profile is up to date`
      ]
    });
  }

  // Sort recommendations by priority rank
  recommendations.sort((a, b) => a.priorityRank - b.priorityRank);

  return recommendations;
}

module.exports = {
  generatePersonalizedFeedback
};
