import { useState } from 'react';
import {
  Lightbulb,
  Code2,
  Clock,
  BarChart3,
  GitBranch,
  ChevronDown,
  ChevronUp,
  Copy,
  CheckCheck,
  Sparkles,
  Rocket,
  Star
} from 'lucide-react';

const DIFFICULTY_STYLES = {
  Beginner:     { pill: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-700', bar: 'bg-emerald-500', width: 'w-1/3',     stars: 1 },
  Intermediate: { pill: 'bg-amber-100  dark:bg-amber-900/40  text-amber-700  dark:text-amber-300  border border-amber-200  dark:border-amber-700',   bar: 'bg-amber-500',  width: 'w-2/3',     stars: 2 },
  Advanced:     { pill: 'bg-red-100    dark:bg-red-900/40    text-red-700    dark:text-red-300    border border-red-200    dark:border-red-700',       bar: 'bg-red-500',    width: 'w-full',    stars: 3 },
};

function ProjectCard({ project, index, onAddProject }) {
  const [expanded, setExpanded] = useState(false);
  const [copiedKeywords, setCopiedKeywords] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const diff = DIFFICULTY_STYLES[project.difficulty] || DIFFICULTY_STYLES.Intermediate;

  const handleCopyKeywords = () => {
    const keywords = (project.githubKeywords || []).join(', ');
    navigator.clipboard.writeText(keywords);
    setCopiedKeywords(true);
    setTimeout(() => setCopiedKeywords(false), 2000);
  };

  const handleAddProject = async () => {
    if (!onAddProject || isAdding || isAdded) return;
    setIsAdding(true);
    try {
      await onAddProject(project);
      setIsAdded(true);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className={`rounded-2xl border transition-all duration-300 shadow-xs overflow-hidden
      ${expanded
        ? 'border-[#4CAF4F] dark:border-[#FFC72C] bg-white dark:bg-[#0b4d26] shadow-md'
        : 'border-[#E4E7EB] dark:border-[#1e8247] bg-[#F5F7FA] dark:bg-[#115e30] hover:border-[#4CAF4F] dark:hover:border-[#FFC72C] hover:bg-white dark:hover:bg-[#0b4d26]'
      }`}
    >
      {/* Card Header — always visible */}
      <button
        onClick={() => setExpanded(e => !e)}
        className="w-full text-left p-4 sm:p-5 flex items-start gap-4 group"
      >
        {/* Project number badge */}
        <div className="shrink-0 w-9 h-9 rounded-xl bg-gradient-to-br from-[#4CAF4F] to-[#2E7D32] dark:from-[#FAB818] dark:to-[#e6a000] text-white dark:text-[#083d1c] flex items-center justify-center text-sm font-black shadow-sm">
          {index + 1}
        </div>

        <div className="flex-1 min-w-0 space-y-2">
          {/* Title row */}
          <div className="flex items-start justify-between gap-2">
            <h4 className="font-bold text-sm text-[#263238] dark:text-white leading-snug group-hover:text-[#4CAF4F] dark:group-hover:text-[#FFC72C] transition-colors">
              {project.title}
            </h4>
            {expanded
              ? <ChevronUp className="w-4 h-4 text-[#4CAF4F] dark:text-[#FFC72C] shrink-0 mt-0.5" />
              : <ChevronDown className="w-4 h-4 text-[#89939E] dark:text-[#C8E6C9] shrink-0 mt-0.5" />
            }
          </div>

          {/* Meta pills row */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Difficulty */}
            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${diff.pill}`}>
              {Array.from({ length: diff.stars }).map((_, i) => (
                <Star key={i} className="w-2.5 h-2.5 fill-current" />
              ))}
              {project.difficulty}
            </span>

            {/* Time */}
            <span className="inline-flex items-center gap-1 text-[11px] text-[#717171] dark:text-[#C8E6C9] bg-white dark:bg-[#083d1c] border border-[#E4E7EB] dark:border-[#1e8247] rounded-full px-2.5 py-0.5">
              <Clock className="w-3 h-3" />
              {project.estimatedTime}
            </span>

            {/* Tech chips (first 3) */}
            {(project.techStack || []).slice(0, 3).map((tech, i) => (
              <span
                key={i}
                className="px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold bg-[#E8F5E9] dark:bg-[#083d1c] text-[#2E7D32] dark:text-[#FFC72C] border border-[#C8E6C9] dark:border-[#1e8247]"
              >
                {tech}
              </span>
            ))}
            {(project.techStack || []).length > 3 && (
              <span className="text-[10px] text-[#89939E] dark:text-[#C8E6C9]">
                +{project.techStack.length - 3} more
              </span>
            )}
          </div>
        </div>
      </button>

      {/* Expanded Details */}
      {expanded && (
        <div className="px-4 sm:px-5 pb-5 space-y-4 animate-fadeIn border-t border-[#E4E7EB] dark:border-[#1e8247] pt-4">

          {/* Description */}
          <p className="text-xs text-[#4D4D4D] dark:text-[#E8F5E9] leading-relaxed">
            {project.description}
          </p>

          {/* Why it matters */}
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[#E8F5E9] dark:bg-[#083d1c] border border-[#C8E6C9] dark:border-[#1e8247]">
            <Rocket className="w-4 h-4 text-[#4CAF4F] dark:text-[#FFC72C] shrink-0 mt-0.5" />
            <p className="text-xs text-[#2E7D32] dark:text-[#FFC72C] font-medium leading-relaxed">
              <strong>Why it matters:</strong> {project.whyItMatters}
            </p>
          </div>

          {/* Full tech stack */}
          <div className="space-y-1.5">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#89939E] dark:text-[#C8E6C9] flex items-center gap-1.5">
              <Code2 className="w-3 h-3" /> Full Tech Stack
            </span>
            <div className="flex flex-wrap gap-1.5">
              {(project.techStack || []).map((tech, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-lg text-[11px] font-mono font-semibold bg-white dark:bg-[#115e30] text-[#263238] dark:text-white border border-[#E4E7EB] dark:border-[#1e8247] shadow-xs"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Difficulty progress bar */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#89939E] dark:text-[#C8E6C9] flex items-center gap-1.5">
                <BarChart3 className="w-3 h-3" /> Complexity
              </span>
              <span className="text-[11px] font-bold text-[#263238] dark:text-white">{project.difficulty}</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-[#E4E7EB] dark:bg-[#083d1c]">
              <div className={`h-1.5 rounded-full ${diff.bar} ${diff.width} transition-all duration-500`} />
            </div>
          </div>

          <button
            type="button"
            onClick={handleAddProject}
            disabled={isAdding || isAdded}
            className="w-full rounded-lg px-3 py-2 text-xs font-bold bg-[#4CAF4F] dark:bg-[#FAB818] text-white dark:text-[#083d1c] hover:bg-[#388E3C] dark:hover:bg-[#e6a000] disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
          >
            {isAdding ? 'Recalculating ATS score...' : isAdded ? 'Added to Resume - ATS Recalculated' : 'Add to Resume & Recalculate ATS'}
          </button>

          {/* GitHub keywords */}
          {project.githubKeywords?.length > 0 && (
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#F5F7FA] dark:bg-[#083d1c] border border-[#E4E7EB] dark:border-[#1e8247]">
              <div className="flex items-center gap-2">
                <GitBranch className="w-4 h-4 text-[#263238] dark:text-white" />
                <div className="flex flex-wrap gap-1">
                  {project.githubKeywords.map((kw, i) => (
                    <span key={i} className="text-[10px] font-mono text-[#717171] dark:text-[#C8E6C9]">#{kw}</span>
                  ))}
                </div>
              </div>
              <button
                onClick={handleCopyKeywords}
                className="ml-3 px-2.5 py-1.5 rounded-lg text-[10px] font-bold bg-white dark:bg-[#115e30] border border-[#E4E7EB] dark:border-[#1e8247] text-[#4CAF4F] dark:text-[#FFC72C] hover:bg-[#E8F5E9] dark:hover:bg-[#1e8247] flex items-center gap-1 transition-all shrink-0"
                title="Copy GitHub topics"
              >
                {copiedKeywords
                  ? <><CheckCheck className="w-3 h-3" /> Copied!</>
                  : <><Copy className="w-3 h-3" /> Copy Topics</>
                }
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function ProjectRecommendationsCard({ geminiInsights, targetJobTitle, onAddProject }) {
  const projects = geminiInsights?.projectRecommendations;

  if (!projects || projects.length === 0) return null;

  const isGeminiVerified = geminiInsights?.source
    && geminiInsights.source.toLowerCase().includes('gemini')
    && !geminiInsights.source.toLowerCase().includes('synthesized');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div className="bg-white dark:bg-[#115e30] p-6 sm:p-8 rounded-xl border border-[#E4E7EB] dark:border-[#1e8247] space-y-6 shadow-xs">

        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E4E7EB] dark:border-[#1e8247] pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#4CAF4F] to-[#2E7D32] dark:from-[#FAB818] dark:to-[#e6a000] flex items-center justify-center text-white dark:text-[#083d1c]">
                <Lightbulb className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#4D4D4D] dark:text-white flex items-center gap-2">
                  <span>AI Project Recommendations</span>
                </h3>
              </div>
            </div>
            <p className="text-xs text-[#717171] dark:text-[#E8F5E9]">
              Portfolio projects curated by AI to boost your <strong className="text-[#4CAF4F] dark:text-[#FFC72C]">{targetJobTitle}</strong> hiring chances. Build, ship, and add to GitHub.
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold ${
              isGeminiVerified
                ? 'bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700'
                : 'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-700'
            }`}>
              <Sparkles className="w-3 h-3" />
              {isGeminiVerified ? 'Gemini AI Curated' : 'AI Synthesized'}
            </span>
            <span className="px-3 py-1.5 rounded-full text-[11px] font-bold bg-[#E8F5E9] dark:bg-[#083d1c] text-[#2E7D32] dark:text-[#FFC72C] border border-[#C8E6C9] dark:border-[#1e8247]">
              {projects.length} Projects
            </span>
          </div>
        </div>

        {/* Instruction banner */}
        <div className="flex items-start gap-3 p-3.5 rounded-xl bg-gradient-to-r from-[#E8F5E9] to-[#F5F7FA] dark:from-[#083d1c] dark:to-[#115e30] border border-[#C8E6C9] dark:border-[#1e8247]">
          <Rocket className="w-4 h-4 text-[#4CAF4F] dark:text-[#FFC72C] shrink-0 mt-0.5" />
          <p className="text-xs text-[#2E7D32] dark:text-[#E8F5E9] leading-relaxed">
            <strong>How to use:</strong> Click any project to expand full details. Build it, push to GitHub, then add it to your resume Experience section with quantifiable metrics. Click the project number to expand.
          </p>
        </div>

        {/* Project Cards */}
        <div className="space-y-3">
          {projects.map((project, i) => (
            <ProjectCard key={i} project={project} index={i} onAddProject={onAddProject} />
          ))}
        </div>

        {/* Footer tip */}
        <div className="pt-2 text-[11px] text-[#89939E] dark:text-[#C8E6C9] flex items-center gap-2">
          <GitBranch className="w-3.5 h-3.5" />
          <span>Tip: Add each completed project to your GitHub with a detailed README, screenshots, and live demo link for maximum recruiter impact.</span>
        </div>

      </div>
    </div>
  );
}
