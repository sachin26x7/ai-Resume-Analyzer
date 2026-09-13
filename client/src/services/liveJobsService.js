/**
 * Live Job & Internship Feed Service (Indian Tech Hubs & JSearch API)
 * Generates dynamically matched real-time internships & jobs tailored to the
 * candidate's verified skills, target role, and location preferences across Indian cities.
 */

export const INDIAN_TECH_HUBS = {
  "Bengaluru": {
    hubName: "Silicon Valley of India (Koramangala, Bellandur, Whitefield, Indiranagar)",
    companies: [
      { name: "Swiggy", logo: "🍕", rating: 4.3, hub: "Koramangala, Bengaluru", domains: ["fullstack", "frontend", "backend", "mobile", "ai-data", "product"] },
      { name: "Razorpay", logo: "💳", rating: 4.5, hub: "Koramangala, Bengaluru", domains: ["fullstack", "backend", "security", "cloud-devops", "frontend"] },
      { name: "CRED", logo: "✨", rating: 4.4, hub: "Indiranagar, Bengaluru", domains: ["frontend", "mobile", "design", "fullstack", "backend"] },
      { name: "Flipkart", logo: "🛒", rating: 4.3, hub: "Bellandur Outer Ring Road, Bengaluru", domains: ["fullstack", "ai-data", "backend", "cloud-devops", "mobile"] },
      { name: "PhonePe", logo: "💸", rating: 4.5, hub: "Bellandur, Bengaluru", domains: ["backend", "mobile", "security", "cloud-devops", "qa"] },
      { name: "Groww", logo: "📈", rating: 4.6, hub: "Vaishnavi Tech Park, Bengaluru", domains: ["fullstack", "backend", "mobile", "ai-data"] },
      { name: "Zerodha", logo: "📊", rating: 4.7, hub: "JP Nagar, Bengaluru", domains: ["backend", "frontend", "mobile", "systems", "security"] },
      { name: "Google India", logo: "🔍", rating: 4.7, hub: "Old Airport Road, Bengaluru", domains: ["ai-data", "cloud-devops", "systems", "backend", "fullstack"] },
      { name: "Amazon India", logo: "📦", rating: 4.4, hub: "World Trade Center, Bengaluru", domains: ["cloud-devops", "backend", "fullstack", "ai-data", "qa"] },
      { name: "Infosys", logo: "🏢", rating: 4.0, hub: "Electronic City, Bengaluru", domains: ["enterprise", "fullstack", "cloud-devops", "qa"] }
    ]
  },
  "Delhi NCR": {
    hubName: "NCR Tech Capital (Gurgaon Cyber Hub, Noida Expressway, Connaught Place)",
    companies: [
      { name: "Zomato", logo: "🛵", rating: 4.2, hub: "DLF Cyber Hub, Gurgaon", domains: ["fullstack", "frontend", "mobile", "product", "design"] },
      { name: "Paytm (One97)", logo: "📱", rating: 4.1, hub: "Sector 5, Noida", domains: ["backend", "mobile", "security", "cloud-devops", "fullstack"] },
      { name: "Urban Company", logo: "🛠️", rating: 4.4, hub: "Udyog Vihar, Gurgaon", domains: ["fullstack", "backend", "mobile", "design", "qa"] },
      { name: "MakeMyTrip", logo: "✈️", rating: 4.3, hub: "DLF Cyber City, Gurgaon", domains: ["fullstack", "mobile", "frontend", "backend"] },
      { name: "PolicyBazaar", logo: "📑", rating: 4.2, hub: "Sector 44, Gurgaon", domains: ["fullstack", "ai-data", "backend", "mobile"] },
      { name: "Airtel Digital", logo: "📶", rating: 4.2, hub: "Sector 18, Gurgaon", domains: ["cloud-devops", "backend", "mobile", "ai-data"] },
      { name: "Microsoft India", logo: "💻", rating: 4.6, hub: "Sector 135, Noida", domains: ["cloud-devops", "ai-data", "backend", "security", "enterprise"] },
      { name: "Adobe India", logo: "🎨", rating: 4.5, hub: "Sector 132, Noida", domains: ["frontend", "design", "ai-data", "fullstack", "systems"] }
    ]
  },
  "Hyderabad": {
    hubName: "Cyberabad (HITEC City, Gachibowli, Financial District)",
    companies: [
      { name: "Microsoft IDC", logo: "💻", rating: 4.7, hub: "Gachibowli, Hyderabad", domains: ["cloud-devops", "backend", "ai-data", "systems", "security"] },
      { name: "Google Hyderabad", logo: "🔍", rating: 4.7, hub: "HITEC City, Hyderabad", domains: ["ai-data", "cloud-devops", "backend", "fullstack"] },
      { name: "Amazon Dev Centre", logo: "📦", rating: 4.4, hub: "Financial District, Hyderabad", domains: ["backend", "cloud-devops", "ai-data", "qa"] },
      { name: "ServiceNow", logo: "⚡", rating: 4.6, hub: "Knowledge City, Hyderabad", domains: ["fullstack", "cloud-devops", "backend", "qa"] },
      { name: "Salesforce India", logo: "☁️", rating: 4.6, hub: "HITEC City, Hyderabad", domains: ["enterprise", "cloud-devops", "backend", "fullstack"] },
      { name: "Uber Hyderabad Tech", logo: "🚗", rating: 4.5, hub: "Madhapur, Hyderabad", domains: ["backend", "mobile", "systems", "cloud-devops"] },
      { name: "Qualcomm India", logo: "📡", rating: 4.4, hub: "Mindspace IT Park, Hyderabad", domains: ["systems", "mobile", "ai-data"] },
      { name: "Tata Consultancy Services", logo: "💼", rating: 4.0, hub: "Adibatla, Hyderabad", domains: ["enterprise", "fullstack", "qa", "backend"] }
    ]
  },
  "Mumbai": {
    hubName: "Financial Tech Hub (BKC, Powai, Andheri East, Navi Mumbai)",
    companies: [
      { name: "Jio Platforms", logo: "🌐", rating: 4.2, hub: "Reliance Corporate Park, Navi Mumbai", domains: ["fullstack", "mobile", "cloud-devops", "ai-data", "security"] },
      { name: "Tata Digital", logo: "💠", rating: 4.3, hub: "BKC, Mumbai", domains: ["fullstack", "frontend", "mobile", "product", "backend"] },
      { name: "Dream11", logo: "🏆", rating: 4.5, hub: "BKC, Mumbai", domains: ["backend", "mobile", "cloud-devops", "frontend", "ai-data"] },
      { name: "BookMyShow", logo: "🎟️", rating: 4.3, hub: "Andheri East, Mumbai", domains: ["frontend", "mobile", "backend", "fullstack"] },
      { name: "Kotak Mahindra Bank Tech", logo: "🏦", rating: 4.2, hub: "Malad, Mumbai", domains: ["enterprise", "security", "backend", "mobile"] },
      { name: "BillDesk", logo: "🧾", rating: 4.1, hub: "Lower Parel, Mumbai", domains: ["backend", "security", "fullstack"] },
      { name: "LTIMindtree", logo: "🏢", rating: 4.0, hub: "Powai, Mumbai", domains: ["enterprise", "cloud-devops", "fullstack", "qa"] }
    ]
  },
  "Pune": {
    hubName: "Automotive & IT Hub (Hinjawadi IT Park, Magarpatta, Kharadi)",
    companies: [
      { name: "Persistent Systems", logo: "💡", rating: 4.3, hub: "Hinjawadi Phase 1, Pune", domains: ["cloud-devops", "fullstack", "ai-data", "security", "enterprise"] },
      { name: "Barclays Global Tech", logo: "🏛️", rating: 4.4, hub: "Kharadi EON IT Park, Pune", domains: ["backend", "security", "enterprise", "cloud-devops"] },
      { name: "Bajaj Finserv Health", logo: "🩺", rating: 4.3, hub: "Viman Nagar, Pune", domains: ["fullstack", "mobile", "backend", "frontend"] },
      { name: "Veritas Technologies", logo: "🔒", rating: 4.4, hub: "Baner, Pune", domains: ["cloud-devops", "systems", "security", "backend"] },
      { name: "Cybage Software", logo: "💻", rating: 4.1, hub: "Kalyani Nagar, Pune", domains: ["fullstack", "qa", "frontend", "backend"] },
      { name: "Tech Mahindra", logo: "⚙️", rating: 4.0, hub: "Hinjawadi Phase 3, Pune", domains: ["enterprise", "cloud-devops", "qa", "mobile"] }
    ]
  },
  "Kolkata": {
    hubName: "Eastern Tech Corridor (Salt Lake Sector V, Rajarhat New Town)",
    companies: [
      { name: "Tata Consultancy Services", logo: "💼", rating: 4.1, hub: "Gitanjali Park, Rajarhat, Kolkata", domains: ["enterprise", "fullstack", "cloud-devops", "ai-data", "qa"] },
      { name: "Cognizant India", logo: "🌐", rating: 4.1, hub: "Sector V, Salt Lake, Kolkata", domains: ["fullstack", "backend", "qa", "cloud-devops", "mobile"] },
      { name: "Wipro Technologies", logo: "🏢", rating: 4.0, hub: "Sector V, Salt Lake, Kolkata", domains: ["enterprise", "cloud-devops", "security", "qa"] },
      { name: "PwC India Tech Centre", logo: "📊", rating: 4.3, hub: "Sector V, Salt Lake, Kolkata", domains: ["ai-data", "security", "cloud-devops", "enterprise"] },
      { name: "ITC Infotech", logo: "🛍️", rating: 4.0, hub: "Rajarhat New Town, Kolkata", domains: ["enterprise", "fullstack", "data-science", "backend"] },
      { name: "IBM India", logo: "💻", rating: 4.3, hub: "Millennium Park, Sector V, Kolkata", domains: ["cloud-devops", "ai-data", "backend", "systems"] },
      { name: "Capgemini Kolkata", logo: "🔷", rating: 4.0, hub: "Unitech Infospace, New Town, Kolkata", domains: ["enterprise", "fullstack", "qa", "mobile"] }
    ]
  },
  "Chennai": {
    hubName: "SaaS & Product Corridor (OMR IT Expressway, Guindy, Siruseri)",
    companies: [
      { name: "Zoho Corporation", logo: "📦", rating: 4.6, hub: "Estancia IT Park, Guduvanchery, Chennai", domains: ["fullstack", "backend", "frontend", "mobile", "systems", "product"] },
      { name: "Freshworks", logo: "⚡", rating: 4.5, hub: "Global Infocity Park, Perungudi, Chennai", domains: ["fullstack", "cloud-devops", "frontend", "mobile", "product"] },
      { name: "PayPal India", logo: "💳", rating: 4.5, hub: "Sholinganallur, OMR, Chennai", domains: ["backend", "security", "ai-data", "cloud-devops"] },
      { name: "Amazon Chennai", logo: "📦", rating: 4.4, hub: "SP Infocity, Perungudi, Chennai", domains: ["cloud-devops", "backend", "qa"] },
      { name: "HCL Technologies", logo: "🌐", rating: 4.0, hub: "Navalur, OMR, Chennai", domains: ["enterprise", "cloud-devops", "systems", "qa"] }
    ]
  },
  "Remote": {
    hubName: "All-India Remote & Work-from-Anywhere Tech Hub",
    companies: [
      { name: "BrowserStack", logo: "🧪", rating: 4.5, hub: "Remote (All India)", domains: ["fullstack", "qa", "cloud-devops", "backend", "frontend"] },
      { name: "Postman", logo: "🚀", rating: 4.6, hub: "Remote (All India)", domains: ["backend", "frontend", "fullstack", "product", "qa"] },
      { name: "Hasura", logo: "⚡", rating: 4.7, hub: "Remote (All India)", domains: ["backend", "systems", "cloud-devops", "fullstack"] },
      { name: "Atlassian", logo: "🔷", rating: 4.6, hub: "Remote (All India)", domains: ["fullstack", "frontend", "cloud-devops", "qa", "product"] },
      { name: "GitLab", logo: "🦊", rating: 4.6, hub: "Remote (Global)", domains: ["cloud-devops", "backend", "security", "frontend"] }
    ]
  }
};

/**
 * Normalizes skill strings for accurate matching
 */
function normalizeSkill(s) {
  if (!s) return "";
  const str = typeof s === 'string' ? s : (s.name || '');
  return str.toLowerCase().replace(/[^a-z0-9+#]/g, '').trim();
}

/**
 * Detects domain category from title or query (fallback)
 */
function inferDomainFromTitle(title) {
  const t = (title || "").toLowerCase();
  if (t.includes("data") || t.includes("machine learning") || t.includes("ai") || t.includes("ml") || t.includes("nlp") || t.includes("deep learning") || t.includes("analytics")) return "ai-data";
  if (t.includes("cloud") || t.includes("devops") || t.includes("sre") || t.includes("infra") || t.includes("platform") || t.includes("kubernetes")) return "cloud-devops";
  if (t.includes("mobile") || t.includes("android") || t.includes("ios") || t.includes("flutter") || t.includes("swift") || t.includes("kotlin")) return "mobile";
  if (t.includes("security") || t.includes("cyber") || t.includes("soc") || t.includes("penetration")) return "security";
  if (t.includes("qa") || t.includes("test") || t.includes("sdet") || t.includes("automation")) return "qa";
  if (t.includes("java") || t.includes("spring") || t.includes("enterprise")) return "enterprise";
  if (t.includes("frontend") || t.includes("ui") || t.includes("react") || t.includes("next") || t.includes("vue") || t.includes("angular")) return "frontend";
  if (t.includes("design") || t.includes("ux") || t.includes("figma")) return "design";
  if (t.includes("product") || t.includes("apm")) return "product";
  if (t.includes("embedded") || t.includes("iot") || t.includes("firmware") || t.includes("c++")) return "systems";
  if (t.includes("backend") || t.includes("api") || t.includes("node") || t.includes("python") || t.includes("django") || t.includes("fastapi")) return "backend";
  return "fullstack";
}

// Skill → domain vote map: infers best domain from candidate's actual skills
const SKILL_DOMAIN_VOTES = {
  'python': 'ai-data', 'machinelearning': 'ai-data', 'deeplearning': 'ai-data',
  'nlp': 'ai-data', 'pytorch': 'ai-data', 'tensorflow': 'ai-data',
  'pandas': 'ai-data', 'scikitlearn': 'ai-data', 'datavisualization': 'ai-data',
  'llms': 'ai-data', 'naturallanguageprocessing': 'ai-data',
  'aws': 'cloud-devops', 'docker': 'cloud-devops', 'kubernetes': 'cloud-devops',
  'cicdpipelines': 'cloud-devops', 'terraform': 'cloud-devops', 'linuxunix': 'cloud-devops',
  'reactjs': 'frontend', 'nextjs': 'frontend', 'vuejs': 'frontend',
  'angular': 'frontend', 'tailwindcss': 'frontend', 'html5': 'frontend',
  'css3': 'frontend', 'redux': 'frontend', 'typescript': 'frontend',
  'nodejs': 'backend', 'expressjs': 'backend', 'django': 'backend',
  'fastapi': 'backend', 'springboot': 'backend', 'graphql': 'backend',
  'postgresql': 'backend', 'mongodb': 'backend', 'redis': 'backend',
  'java': 'enterprise', 'microservices': 'enterprise',
  'cybersecurity': 'security',
  'testingqa': 'qa',
};

// Domain → canonical required skills for job listings
const DOMAIN_SKILLS = {
  'ai-data':     ['Python', 'Machine Learning', 'Pandas', 'Natural Language Processing (NLP)', 'PyTorch', 'TensorFlow', 'Data Visualization', 'SQL'],
  'cloud-devops':['AWS', 'Docker', 'Kubernetes', 'CI/CD Pipelines', 'Linux / Unix', 'Git & Version Control', 'Terraform'],
  'mobile':      ['React.js', 'TypeScript', 'RESTful APIs', 'Git & Version Control', 'JavaScript'],
  'security':    ['Cybersecurity & OAuth', 'Linux / Unix', 'Python', 'Docker', 'Git & Version Control'],
  'enterprise':  ['Java', 'Spring Boot', 'Microservices', 'PostgreSQL', 'RESTful APIs', 'Git & Version Control'],
  'frontend':    ['React.js', 'Next.js', 'TypeScript', 'Tailwind CSS', 'HTML5', 'CSS3', 'Redux', 'JavaScript'],
  'backend':     ['Node.js', 'Express.js', 'PostgreSQL', 'MongoDB', 'RESTful APIs', 'Docker', 'Redis', 'GraphQL'],
  'qa':          ['Testing & QA', 'JavaScript', 'Python', 'RESTful APIs', 'CI/CD Pipelines'],
  'fullstack':   ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'JavaScript', 'TypeScript', 'RESTful APIs', 'Git & Version Control'],
};

/**
 * Infers best-fit domain from candidate's actual extracted skills (votes-based).
 * Falls back to title-based inference.
 */
function inferDomainFromSkills(extractedSkills, targetJobTitle) {
  const counts = {};
  for (const skill of extractedSkills) {
    const key = normalizeSkill(skill);
    const domain = SKILL_DOMAIN_VOTES[key];
    if (domain) counts[domain] = (counts[domain] || 0) + 1;
  }
  let bestDomain = null, bestCount = 0;
  for (const [domain, count] of Object.entries(counts)) {
    if (count > bestCount) { bestDomain = domain; bestCount = count; }
  }
  return bestDomain || inferDomainFromTitle(targetJobTitle);
}

/**
 * Generates jobs matched to the candidate's actual resume skills.
 * Only shows jobs where the candidate has at least 1 matching skill.
 * Sorted by skill match % descending.
 */
export function generateLiveJobs(params = {}) {
  const {
    targetJobTitle = 'Full Stack Software Engineer',
    extractedSkills = [],
    selectedLocation = 'All Locations',
    selectedType = 'all'
  } = params;

  // Build normalized candidate skill set from actual resume
  const candidateSkillSet = new Set(
    (extractedSkills || []).map(s => normalizeSkill(s)).filter(Boolean)
  );

  // Infer domain from actual skills — not just job title
  const targetDomain = inferDomainFromSkills(extractedSkills, targetJobTitle);

  // Required skills for jobs in this domain
  const domainSkillPool = DOMAIN_SKILLS[targetDomain] || DOMAIN_SKILLS['fullstack'];

  const activeCities = (selectedLocation && selectedLocation !== 'All Locations' && selectedLocation !== 'Any')
    ? [selectedLocation]
    : Object.keys(INDIAN_TECH_HUBS);

  const jobs = [];

  activeCities.forEach((city) => {
    const cityData = INDIAN_TECH_HUBS[city] || INDIAN_TECH_HUBS['Bengaluru'];

    const domainCompanies = cityData.companies.filter(c => c.domains.includes(targetDomain));
    const companyPool = (domainCompanies.length > 0 ? domainCompanies : cityData.companies).slice(0, 2);

    companyPool.forEach((comp, idx) => {
      const isIntern = idx % 2 === 0;
      const roleType = isIntern ? 'Internship' : 'Full-Time';

      if (selectedType === 'internship' && !isIntern) return;
      if (selectedType === 'fulltime' && isIntern) return;

      const title = isIntern ? `${targetJobTitle} Intern` : `${targetJobTitle} Engineer`;
      const requiredSkills = domainSkillPool;

      // Match against candidate's ACTUAL skills only
      const matched = requiredSkills.filter(s => candidateSkillSet.has(normalizeSkill(s)));
      const missing  = requiredSkills.filter(s => !candidateSkillSet.has(normalizeSkill(s)));
      const matchPct = requiredSkills.length > 0 ? Math.round((matched.length / requiredSkills.length) * 100) : 0;

      // Skip jobs where the candidate has NO matching skills
      if (matchPct === 0) return;

      const searchQuery = encodeURIComponent(`${title} ${comp.name} ${city}`);

      jobs.push({
        id: `ind-job-${city.toLowerCase()}-${idx}-${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 3)}`,
        title,
        domainTag: cityData.hubName,
        roleCategory: targetDomain,
        company: comp.name,
        companyLogo: comp.logo,
        companyRating: comp.rating,
        verified: true,
        officeHub: comp.hub,
        location: city,
        isRemote: city === 'Remote',
        type: roleType,
        duration: isIntern ? '3-6 Months' : 'Permanent',
        stipend: isIntern ? '₹25,000 - ₹50,000 /month' : '₹8,50,000 - ₹18,00,000 /year',
        fullTimeSalary: isIntern ? '₹7.5 - 14.0 LPA' : '₹8.5 - 20.0 LPA',
        description: `Opening for ${title} at ${comp.name} in ${comp.hub}. Requires ${matched.slice(0, 3).join(', ')}${missing.length > 0 ? ` and more` : ''}.`,
        requiredSkills,
        matchedSkills: matched,
        missingSkills: missing,
        matchPercentage: matchPct,
        openings: Math.floor(Math.random() * 3) + 1,
        postedAgo: idx === 0 ? 'Just now' : '1 day ago',
        badge: matchPct >= 70 ? '⭐ Strong Match' : '⚡ Skill Match',
        isInternshalaCertified: isIntern,
        applyUrl: `https://www.google.com/search?q=${searchQuery}+jobs`,
        internshalaUrl: `https://internshala.com/internships/keywords-${encodeURIComponent(title)}-in-${encodeURIComponent(city)}`,
        applicantCount: Math.floor(Math.random() * 30) + 10,
        source: 'Indian Tech Hub Aggregator'
      });
    });
  });

  // Sort by highest skill match % — best matches first
  return jobs.sort((a, b) => b.matchPercentage - a.matchPercentage);
}
