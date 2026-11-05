import { useState, useRef } from 'react';
import { 
  UploadCloud, 
  FileText, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  Plus, 
  X, 
  MapPin, 
  DollarSign, 
  Sparkles, 
  Briefcase, 
  Layers, 
  HelpCircle,
  Loader2
} from 'lucide-react';
import { PRESET_ROLES } from '../services/clientNlpEngine';

const POPULAR_SUGGESTIONS = [
  'React.js', 'Node.js', 'Express.js', 'TypeScript', 'JavaScript', 'Python', 
  'Java', 'Spring Boot', 'SQL', 'PostgreSQL', 'MongoDB', 'Docker', 
  'Kubernetes', 'AWS', 'Azure', 'GCP', 'GraphQL', 'RESTful APIs', 
  'Microservices', 'Redux', 'TailwindCSS', 'Git', 'CI/CD Pipelines'
];

export default function UploadAnalysisPanel({
  onAnalyze,
  onReset,
  analysisError,
  onClearAnalysisError,
  isAnalyzing,
  resumeText,
  setResumeText,
  selectedFile,
  setSelectedFile,
  targetJobTitle,
  setTargetJobTitle,
  targetJobDescription,
  setTargetJobDescription,
  jobRequiredSkills,
  setJobRequiredSkills,
  preferences,
  setPreferences
}) {
  const [activeTab, setActiveTab] = useState('upload'); // 'upload' | 'text'
  const [newSkillInput, setNewSkillInput] = useState('');
  const [selectedPresetIndex, setSelectedPresetIndex] = useState(0);
  const [fileError, setFileError] = useState(null);
  const [textError, setTextError] = useState(null);
  const fileInputRef = useRef(null);

  // ── Document-type signal detector ────────────────────────────────────────────
  // Returns a human-readable error string if the text looks like a non-resume document,
  // or null if it appears to be a valid resume/CV.
  const detectNonResumeDocument = (text) => {
    const lower = text.toLowerCase();

    // Strong rejection signals — clearly non-resume content
    const hardRejectPatterns = [
      { pattern: /\b(invoice|bill\s*no\.?|billing\s+address|amount\s+due|payment\s+due|total\s+amount|gst\s+number|tax\s+invoice|receipt\s+no)\b/i, label: 'invoice or bill' },
      { pattern: /\b(question\s+paper|exam\s+paper|answer\s+key|roll\s+no\.?|exam\s+instructions|time\s+allowed|maximum\s+marks|section\s+[a-z]:\s*(attempt|answer))\b/i, label: 'exam question paper' },
      { pattern: /\b(chapter\s+\d+|table\s+of\s+contents|textbook|syllabus|lesson\s+plan|lecture\s+notes|assignment\s+no\.?|course\s+material|study\s+guide)\b/i, label: 'study material or textbook' },
      { pattern: /\b(marksheet|mark\s+sheet|grade\s+card|result\s+card|semester\s+result|cgpa\s+details\s+by\s+subject|subject\s+code\s+.{0,20}marks\s+obtained)\b/i, label: 'marksheet or grade card' },
      { pattern: /\b(newspaper|article\s+by|editorial|published\s+in|volume\s+\d+,?\s+issue\s+\d+|copyright\s+\d{4}\s+all\s+rights\s+reserved)\b/i, label: 'newspaper or article' },
      { pattern: /\b(utility\s+bill|electricity\s+bill|water\s+bill|mobile\s+bill|meter\s+reading|units\s+consumed|customer\s+id\s*:)\b/i, label: 'utility bill' },
      { pattern: /\b(bank\s+statement|account\s+summary|transaction\s+date|debit|credit|opening\s+balance|closing\s+balance|ifsc\s+code)\b/i, label: 'bank statement' },
    ];

    for (const { pattern, label } of hardRejectPatterns) {
      if (pattern.test(text)) {
        return `This document appears to be a ${label}, not a resume. Please upload your Resume or CV.`;
      }
    }

    // Check for minimum resume-like signals in long enough text (>100 words)
    const wordCount = text.match(/\S+/g)?.length || 0;
    if (wordCount > 100) {
      const hasResumeSection = /\b(experience|education|skills|projects|summary|objective|work\s+history|employment|qualifications)\b/i.test(text);
      const hasContactOrIdentity = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i.test(text)
        || /\b(linkedin|github)\.com\b/i.test(text)
        || /(?:\+?\d[\d\s().-]{8,}\d)/.test(text)
        || /\b(resume|curriculum\s+vitae|cv)\b/i.test(text);
      const hasCareerLanguage = /\b(developed|engineered|managed|designed|deployed|worked|built|led|implemented|responsible)\b/i.test(text);

      if (!hasResumeSection && !hasContactOrIdentity && !hasCareerLanguage) {
        return 'This document does not appear to be a Resume or CV. Please upload a document with sections like Experience, Skills, and Education.';
      }
    }

    return null; // passes validation
  };

  // File Dropzone Handler
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    validateAndSetFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    validateAndSetFile(file);
  };

  const validateAndSetFile = (file) => {
    setFileError(null);
    onClearAnalysisError?.();
    if (!file) return;

    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
    const validExts = ['.pdf', '.docx', '.txt'];
    const fileExt = '.' + file.name.split('.').pop().toLowerCase();

    if (!validTypes.includes(file.type) && !validExts.includes(fileExt)) {
      setFileError('Please upload a valid PDF, DOCX, or TXT resume file.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setFileError('File size exceeds the 10MB limit.');
      return;
    }

    // For text files: read content and validate immediately
    if (file.type === 'text/plain' || fileExt === '.txt') {
      const reader = new FileReader();
      reader.onload = (evt) => {
        const text = evt.target.result;
        const docError = detectNonResumeDocument(text);
        if (docError) {
          setFileError(docError);
          return;
        }
        setSelectedFile(file);
        setResumeText(text);
      };
      reader.readAsText(file);
    } else {
      // PDF/DOCX: server will validate content via isLikelyResumeText
      setSelectedFile(file);
      if (!resumeText) {
        setResumeText(`[Parsed from ${file.name}] Technical Profile and Experience`);
      }
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setFileError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Preset Role Selection
  const handleSelectPreset = (idx) => {
    setSelectedPresetIndex(idx);
    if (idx >= 0 && idx < PRESET_ROLES.length) {
      const preset = PRESET_ROLES[idx];
      setTargetJobTitle(preset.title);
      setTargetJobDescription(preset.description);
      setJobRequiredSkills([...preset.requiredSkills]);
    }
  };

  // Custom Skill Tag Management
  const handleAddSkill = (skillToAdd) => {
    const s = (skillToAdd || newSkillInput).trim();
    if (!s) return;
    if (!jobRequiredSkills.some(existing => existing.toLowerCase() === s.toLowerCase())) {
      setJobRequiredSkills([...jobRequiredSkills, s]);
    }
    setNewSkillInput('');
  };

  const handleRemoveSkill = (skillToRemove) => {
    setJobRequiredSkills(jobRequiredSkills.filter(s => s !== skillToRemove));
  };

  const handleKeyDownSkill = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSkill();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setTextError(null);
    if (!selectedFile && !resumeText.trim()) {
      const message = 'Upload a resume file or paste your resume text to begin analysis.';
      if (activeTab === 'text') setTextError(message);
      else setFileError(message);
      return;
    }
    // Validate pasted text for non-resume content
    if (!selectedFile && resumeText.trim()) {
      const docError = detectNonResumeDocument(resumeText);
      if (docError) {
        setTextError(docError);
        return;
      }
    }
    onAnalyze();
  };

  const handleResumeTextChange = (e) => {
    setTextError(null);
    setResumeText(e.target.value);
  };

  const handleReset = () => {
    handleRemoveFile();
    setResumeText('');
    handleSelectPreset(0);
    setPreferences({ preferredLocation: 'Any', preferredSalary: 'Any' });
    onReset();
  };

  return (
    <div id="upload-panel" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
      <div className="bg-white dark:bg-[#111C2E] p-6 sm:p-8 rounded-xl border border-[#E2E8F0] dark:border-[#253247] shadow-sm relative">
        
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* 2-COLUMN MAIN WORKSPACE GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* LEFT COLUMN: Resume Ingestion Source (Col-span 7) */}
            <div className="lg:col-span-7 space-y-4">
              
              {/* Tab Selector */}
              <div className="flex items-center justify-between border-b border-[#E2E8F0] dark:border-[#253247] pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-[#1E293B] dark:text-white flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#2563EB] dark:text-[#2563EB]" />
                    <span>Candidate Resume Ingestion</span>
                  </span>
                </div>

                <div className="flex p-1 rounded-lg bg-[#F8FAFC] dark:bg-[#0B1220] border border-[#E2E8F0] dark:border-[#253247] text-xs">
                  <button
                    type="button"
                    onClick={() => setActiveTab('upload')}
                    className={`px-3.5 py-1.5 rounded-md font-bold transition-all ${
                      activeTab === 'upload'
                        ? 'bg-[#2563EB] dark:bg-[#2563EB] text-white dark:text-white shadow-xs'
                        : 'text-[#64748B] dark:text-white hover:text-[#1E293B] dark:hover:text-[#2563EB]'
                    }`}
                  >
                    Upload File (PDF)
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('text')}
                    className={`px-3.5 py-1.5 rounded-md font-bold transition-all ${
                      activeTab === 'text'
                        ? 'bg-[#2563EB] dark:bg-[#2563EB] text-white dark:text-white shadow-xs'
                        : 'text-[#64748B] dark:text-white hover:text-[#1E293B] dark:hover:text-[#2563EB]'
                    }`}
                  >
                    Paste Text
                  </button>
                </div>
              </div>

              {/* TAB 1: FILE UPLOAD DROPZONE */}
              {activeTab === 'upload' && (
                <div className="space-y-3">
                  {!selectedFile ? (
                    <div
                      role="button"
                      tabIndex={0}
                      aria-label="Choose a resume file, or drag and drop it here"
                      onDragOver={handleDragOver}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          fileInputRef.current?.click();
                        }
                      }}
                      className="border-2 border-dashed border-[#E2E8F0] dark:border-[#253247] hover:border-[#2563EB] dark:hover:border-[#2563EB] rounded-xl p-8 text-center cursor-pointer transition-all bg-[#F8FAFC]/70 dark:bg-[#0B1220]/70 hover:bg-[#F8FAFC] dark:hover:bg-[#0B1220] flex flex-col items-center justify-center gap-3 group min-h-[175px]"
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        onChange={handleFileChange}
                        accept=".pdf,.docx,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
                        className="hidden"
                      />
                      <div className="w-12 h-12 rounded-full bg-[#DBEAFE] dark:bg-[#111C2E] text-[#2563EB] dark:text-[#2563EB] group-hover:scale-105 flex items-center justify-center transition-all shadow-xs">
                        <UploadCloud className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#1E293B] dark:text-white">
                          Click to upload <span className="font-normal text-[#64748B] dark:text-[#DBEAFE]">or drag and drop</span>
                        </p>
                        <p className="text-xs text-[#94A3B8] dark:text-[#BFDBFE] mt-0.5">
                          PDF, DOCX, or TXT (Max 10MB)
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 rounded-xl bg-[#F8FAFC] dark:bg-[#0B1220] border border-[#E2E8F0] dark:border-[#253247] flex items-center justify-between gap-3 shadow-xs">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-lg bg-[#DBEAFE] dark:bg-[#2563EB]/20 text-[#2563EB] dark:text-[#2563EB] flex items-center justify-center shrink-0">
                          <CheckCircle2 className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-[#1E293B] dark:text-white truncate">
                            {selectedFile.name}
                          </p>
                          <p className="text-xs text-[#64748B] dark:text-[#DBEAFE]">
                            {(selectedFile.size / 1024).toFixed(1)} KB • Ready for NLP Analysis
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={handleRemoveFile}
                        className="p-2 rounded-lg text-[#94A3B8] dark:text-white hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        title="Remove uploaded resume"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  {(fileError || analysisError) && (
                    <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 dark:bg-red-900/20 p-2.5 rounded-lg border border-red-200 dark:border-red-800">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{fileError || analysisError}</span>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: DIRECT RESUME TEXT AREA */}
              {activeTab === 'text' && (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs text-[#64748B] dark:text-[#DBEAFE]">
                    <span>Paste plain resume text or profile content:</span>
                    <span className="font-mono text-[#2563EB] dark:text-[#2563EB] font-semibold">{resumeText.split(/\s+/).filter(Boolean).length} words</span>
                  </div>
                  <textarea
                    rows={7}
                    value={resumeText}
                    onChange={handleResumeTextChange}
                    placeholder="Paste resume text including Education, Work Experience, Technical Skills, and Projects..."
                    className={`w-full rounded-xl p-3.5 text-xs font-mono resize-y border focus:outline-none ${
                      textError
                        ? 'border-red-400 dark:border-red-500 bg-red-50 dark:bg-red-900/10'
                        : 'border-[#E2E8F0] dark:border-[#253247] focus:border-[#2563EB] dark:focus:border-[#2563EB]'
                    } bg-white dark:bg-[#0B1220] text-[#1E293B] dark:text-white`}
                  />
                  {textError && (
                    <div className="flex items-start gap-2 text-xs text-red-600 bg-red-50 dark:bg-red-900/20 p-2.5 rounded-lg border border-red-200 dark:border-red-800">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{textError}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Helper Guidelines */}
              <div className="p-3 rounded-lg bg-[#DBEAFE]/50 dark:bg-[#0B1220] border border-[#BFDBFE] dark:border-[#253247] flex items-start gap-2.5 text-xs text-[#1D4ED8] dark:text-[#DBEAFE]">
                <HelpCircle className="w-4 h-4 text-[#2563EB] dark:text-[#2563EB] shrink-0 mt-0.5" />
                <p>
                  <strong>Tip:</strong> Ensure resume includes clear section headers (<em>Experience, Skills, Education</em>) and quantified metric bullet points for high ATS readability.
                </p>
              </div>

            </div>

            {/* RIGHT COLUMN: Target Job Role, Custom Skills & Preferences (Col-span 5) */}
            <div className="lg:col-span-5 space-y-4">
              
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold text-[#1E293B] dark:text-white flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-[#2563EB] dark:text-[#2563EB]" />
                  <span>Target Role & Required Skills</span>
                </label>
                <span className="text-[11px] text-[#2563EB] dark:text-[#2563EB] font-semibold">Customizable Stack</span>
              </div>

              {/* Standard Role Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#1E293B] dark:text-[#DBEAFE]">Target Industry Role</label>
                <select
                  value={selectedPresetIndex}
                  onChange={(e) => handleSelectPreset(Number(e.target.value))}
                  className="w-full rounded-lg p-2.5 text-xs font-bold bg-[#F8FAFC] dark:bg-[#0B1220] text-[#1E293B] dark:text-white border border-[#E2E8F0] dark:border-[#253247]"
                >
                  {PRESET_ROLES.map((role, idx) => (
                    <option key={idx} value={idx}>
                      {role.title}
                    </option>
                  ))}
                  <option value={-1}>
                    + Custom Target Role...
                  </option>
                </select>
              </div>

              {/* Custom Job Title & Description if selected */}
              {selectedPresetIndex === -1 && (
                <div className="space-y-2 pt-1 animate-fadeIn">
                  <input
                    type="text"
                    value={targetJobTitle}
                    onChange={(e) => setTargetJobTitle(e.target.value)}
                    placeholder="e.g. AI Research Engineer / DevOps Lead"
                    className="w-full rounded-lg p-2.5 text-xs bg-[#F8FAFC] dark:bg-[#0B1220] text-[#1E293B] dark:text-white border border-[#E2E8F0] dark:border-[#253247]"
                  />
                  <textarea
                    rows={2}
                    value={targetJobDescription}
                    onChange={(e) => setTargetJobDescription(e.target.value)}
                    placeholder="Paste job description keywords & requirements..."
                    className="w-full rounded-lg p-2 text-xs bg-[#F8FAFC] dark:bg-[#0B1220] text-[#1E293B] dark:text-white border border-[#E2E8F0] dark:border-[#253247]"
                  />
                </div>
              )}

              {/* Required Target Skills Tag Input */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-[#1E293B] dark:text-[#DBEAFE] flex items-center gap-1">
                    <Layers className="w-3.5 h-3.5 text-[#2563EB] dark:text-[#2563EB]" />
                    <span>Target Requirements Checklist ({jobRequiredSkills.length})</span>
                  </label>
                </div>

                {/* Add Custom Skill Input Box */}
                <div className="flex gap-1.5">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={newSkillInput}
                      onChange={(e) => setNewSkillInput(e.target.value)}
                      onKeyDown={handleKeyDownSkill}
                      placeholder="Add custom skill (e.g. Docker, GraphQL)..."
                      className="w-full rounded-lg px-3 py-1.5 text-xs bg-[#F8FAFC] dark:bg-[#0B1220] text-[#1E293B] dark:text-white border border-[#E2E8F0] dark:border-[#253247]"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleAddSkill()}
                    disabled={!newSkillInput.trim()}
                    className="min-w-[70px] justify-center px-3.5 py-1.5 rounded-lg text-xs font-bold bg-[#2563EB] hover:bg-[#1D4ED8] dark:bg-[#2563EB] dark:hover:bg-[#2563EB] text-white dark:text-white flex items-center gap-1 transition-all shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                </div>

                {/* Active Skill Chips with Remove Buttons */}
                <div className="p-2.5 rounded-lg bg-[#F8FAFC] dark:bg-[#0B1220] border border-[#E2E8F0] dark:border-[#253247] min-h-[70px] max-h-36 overflow-y-auto space-y-1.5">
                  {jobRequiredSkills.length === 0 ? (
                    <p className="text-[11px] text-[#94A3B8] dark:text-[#BFDBFE] italic text-center py-3">
                      No target skills added yet. Type a skill above or click suggestions below.
                    </p>
                  ) : (
                    <div className="flex flex-wrap gap-1.5">
                      {jobRequiredSkills.map((skill, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center gap-1 pl-2.5 pr-1.5 py-1 rounded-md text-[11px] font-mono bg-[#DBEAFE] dark:bg-[#111C2E] text-[#1D4ED8] dark:text-white border border-[#BFDBFE] dark:border-[#253247] font-semibold group"
                        >
                          <span>{skill}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveSkill(skill)}
                            className="p-0.5 rounded hover:bg-red-500 hover:text-white text-[#2563EB] dark:text-[#2563EB] transition-colors"
                            title={`Remove ${skill}`}
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Quick Add Suggestions */}
                <div className="space-y-1 pt-0.5">
                  <div className="text-[10px] uppercase font-bold tracking-wider text-[#94A3B8] dark:text-[#2563EB] flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-[#2563EB] dark:text-[#2563EB]" />
                    <span>Click to Quick-Add Skills:</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {POPULAR_SUGGESTIONS.filter(s => !jobRequiredSkills.some(existing => existing.toLowerCase() === s.toLowerCase())).slice(0, 8).map((sug, sIdx) => (
                      <button
                        key={sIdx}
                        type="button"
                        onClick={() => handleAddSkill(sug)}
                        className="px-2.5 py-1 rounded-md text-[11px] font-mono bg-white dark:bg-[#0B1220] text-[#1E293B] dark:text-white hover:border-[#2563EB] hover:text-[#2563EB] dark:hover:text-[#2563EB] border border-[#E2E8F0] dark:border-[#253247] transition-all shadow-xs"
                      >
                        + {sug}
                      </button>
                    ))}
                  </div>
                </div>

              </div>

              {/* Candidate Preferences (Location & Salary Filter) */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                
                <div className="space-y-1">
                  <label className="text-xs text-[#1E293B] dark:text-[#DBEAFE] flex items-center gap-1 font-semibold">
                    <MapPin className="w-3.5 h-3.5 text-[#2563EB] dark:text-[#2563EB]" />
                    <span>Target Location</span>
                  </label>
                  <select
                    value={preferences.preferredLocation}
                    onChange={(e) => setPreferences({ ...preferences, preferredLocation: e.target.value })}
                    className="w-full rounded-lg p-2 text-xs bg-[#F8FAFC] dark:bg-[#0B1220] text-[#1E293B] dark:text-white border border-[#E2E8F0] dark:border-[#253247]"
                  >
                    <option value="Any">Any / Global</option>
                    <option value="Remote">Remote Only</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="Bengaluru">Bengaluru, India</option>
                    <option value="Kolkata">Kolkata, India</option>
                    <option value="San Francisco">San Francisco, USA</option>
                    <option value="New York">New York, USA</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-[#1E293B] dark:text-[#DBEAFE] flex items-center gap-1 font-semibold">
                    <DollarSign className="w-3.5 h-3.5 text-[#2563EB] dark:text-[#2563EB]" />
                    <span>Salary Bracket</span>
                  </label>
                  <select
                    value={preferences.preferredSalary}
                    onChange={(e) => setPreferences({ ...preferences, preferredSalary: e.target.value })}
                    className="w-full rounded-lg p-2 text-xs bg-[#F8FAFC] dark:bg-[#0B1220] text-[#1E293B] dark:text-white border border-[#E2E8F0] dark:border-[#253247]"
                  >
                    <option value="Any">Market Standard</option>
                    <option value="High">Top Tier ($120k+ / ₹18LPA+)</option>
                    <option value="Senior">Executive Tier ($160k+ / ₹25LPA+)</option>
                  </select>
                </div>

              </div>

            </div>

          </div>

          {/* ACTION BUTTON: RUN ANALYSIS */}
          <div className="pt-4 border-t border-[#E2E8F0] dark:border-[#253247] flex flex-col sm:flex-row items-center justify-end gap-3">
            
            <button
              type="button"
              onClick={handleReset}
              disabled={isAnalyzing}
              className="w-full sm:w-auto px-5 py-2.5 rounded-lg font-semibold text-xs text-[#64748B] dark:text-white hover:text-red-600 bg-[#F8FAFC] dark:bg-[#0B1220] hover:bg-red-50 dark:hover:bg-red-900/20 border border-[#E2E8F0] dark:border-[#253247] flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              <Trash2 className="w-4 h-4" />
              <span>Reset</span>
            </button>

            <button
              type="submit"
              disabled={isAnalyzing}
              className={`w-full sm:w-auto px-7 py-2.5 rounded-lg font-bold text-xs text-white dark:text-white flex items-center justify-center gap-2 shadow-sm transition-all ${
              isAnalyzing
                ? 'bg-[#2563EB]/60 dark:bg-[#2563EB]/60 cursor-not-allowed'
                : 'bg-[#2563EB] hover:bg-[#1D4ED8] dark:bg-[#2563EB] dark:hover:bg-[#2563EB] hover:shadow-md hover:scale-[1.01] active:scale-98'
              }`}
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white dark:text-white" />
                  <span>Processing Analysis...</span>
                </>
              ) : (
                <>
                  <span>Analyze Resume & Recommend Careers</span>
                  <ArrowRight className="w-4 h-4 text-white dark:text-white" />
                </>
              )}
            </button>

          </div>

        </form>

      </div>
    </div>
  );
}
