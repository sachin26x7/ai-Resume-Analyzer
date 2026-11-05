import { 
  Award, 
  Cpu, 
  Brain, 
  Layers, 
  FileCheck2, 
  Printer 
} from 'lucide-react';

export default function ScorecardOverview({ analysisResult, onOpenAuditModal }) {
  if (!analysisResult || !analysisResult.atsScore) return null;

  const { atsScore, candidate, targetJob, resumeFeatures } = analysisResult;
  const percentage = atsScore.percentage;
  const breakdown = atsScore.breakdown;

  // Ring & Bar color dynamically responsive to theme & score
  let ringColor = '#2563EB';
  let strokeDashoffset = 440 - (440 * percentage) / 100;

  if (percentage < 50) {
    ringColor = '#EF4444';
  } else if (percentage < 70) {
    ringColor = '#F59E0B';
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-4">
      
      {/* Top Bar with Candidate & Audit Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-[#111C2E] p-4 rounded-xl border border-[#E2E8F0] dark:border-[#253247] shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#DBEAFE] dark:bg-[#0B1220] border border-[#BFDBFE] dark:border-[#253247] flex items-center justify-center text-[#1D4ED8] dark:text-[#2563EB] font-black text-lg">
            {candidate?.name?.charAt(0) || 'C'}
          </div>
          <div>
            <h2 className="text-base font-bold text-[#1E293B] dark:text-white flex items-center gap-2">
              <span>{candidate?.name || 'Candidate Evaluation'}</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#DBEAFE] dark:bg-[#0B1220] text-[#1D4ED8] dark:text-[#2563EB] font-semibold border border-[#BFDBFE] dark:border-[#253247]">
                Target: {targetJob?.title}
              </span>
            </h2>
            <div className="flex flex-wrap items-center gap-3 text-xs text-[#64748B] dark:text-[#DBEAFE] mt-0.5">
              {candidate?.email && <span>{candidate.email}</span>}
              {candidate?.phone && <span>{candidate.phone}</span>}
              {Number.isFinite(resumeFeatures?.totalWords) && (
                <span>{resumeFeatures.totalWords} words analyzed</span>
              )}
            </div>
          </div>
        </div>

        <button
          onClick={onOpenAuditModal}
          className="px-4 py-2 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] dark:bg-[#2563EB] dark:hover:bg-[#2563EB] text-white dark:text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs active:scale-95"
        >
          <Printer className="w-3.5 h-3.5 text-white dark:text-white" />
          <span>Export ATS Audit Report</span>
        </button>
      </div>

      {/* Main Scorecard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* MASTER ATS SCORE GAUGE (Col-span 4) */}
        <div className="lg:col-span-4 bg-white dark:bg-[#111C2E] p-6 rounded-xl border border-[#E2E8F0] dark:border-[#253247] flex flex-col items-center justify-center text-center relative shadow-xs">
          <div className="text-xs font-bold text-[#1E293B] dark:text-[#2563EB] uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Award className="w-4 h-4 text-[#2563EB] dark:text-[#2563EB]" />
            <span>Aggregate ATS Score</span>
          </div>

          {/* SVG Circular Radial Progress */}
          <div className="relative w-44 h-44 my-2 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
              <circle
                cx="80"
                cy="80"
                r="70"
                stroke="currentColor"
                strokeWidth="12"
                className="text-gray-100 dark:text-white"
                fill="transparent"
              />
              <circle
                cx="80"
                cy="80"
                r="70"
                stroke={ringColor}
                strokeWidth="12"
                strokeDasharray="440"
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                style={{ transition: 'stroke-dashoffset 1s ease-in-out, stroke 0.5s ease' }}
              />
            </svg>

            {/* Inner Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-extrabold text-[#1E293B] dark:text-white tracking-tight">
                {percentage}<span className="text-xl text-[#2563EB] dark:text-[#2563EB]">%</span>
              </span>
              <span className="text-[11px] font-mono text-[#64748B] dark:text-[#DBEAFE] mt-0.5">
                {(atsScore.overallScore * 10).toFixed(1)} / 10.0 Index
              </span>
            </div>
          </div>

          {/* Tier Pill */}
          <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#DBEAFE] dark:bg-[#0B1220] border border-[#BFDBFE] dark:border-[#253247] text-[#1D4ED8] dark:text-white">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: ringColor }}
            />
            <span>{atsScore.tier} Candidate</span>
          </div>

          <p className="text-[11px] text-[#64748B] dark:text-[#DBEAFE] mt-2 max-w-xs font-normal">
            Based on <span className="font-semibold text-[#1E293B] dark:text-[#2563EB]">30% Keyword, 35% Semantic, 20% Structure, 15% Formatting</span>.
          </p>
        </div>

        {/* 4 FACTOR BREAKDOWN CARDS (Col-span 8) */}
        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
          
          {/* 1. Keyword Matching Sk (Weight 30%) */}
          <div className="bg-white dark:bg-[#111C2E] p-4 rounded-xl space-y-2 border border-[#E2E8F0] dark:border-[#253247] shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#DBEAFE] dark:bg-[#0B1220] text-[#2563EB] dark:text-[#2563EB] flex items-center justify-center font-bold text-xs">
                  <Cpu className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#1E293B] dark:text-white">Keyword Matching (Sk)</h4>
                  <span className="text-[10px] text-[#64748B] dark:text-[#DBEAFE]">Weight: 30%</span>
                </div>
              </div>
              <span className="text-sm font-extrabold font-mono text-[#1E293B] dark:text-[#2563EB]">
                {breakdown?.keywordMatch?.percentage || 0}%
              </span>
            </div>

            <div className="w-full bg-[#F8FAFC] dark:bg-[#0B1220] rounded-full h-2 overflow-hidden">
              <div
                className="bg-[#2563EB] dark:bg-[#2563EB] h-2 rounded-full"
                style={{ width: `${breakdown?.keywordMatch?.percentage || 0}%` }}
              />
            </div>

            <div className="pt-1 flex items-center justify-between text-[11px] text-[#64748B] dark:text-white">
              <span>Matched: {breakdown?.keywordMatch?.matched?.length || 0} skills</span>
              <span className="font-mono font-bold text-[#2563EB] dark:text-[#2563EB]">
                +{Number((breakdown?.keywordMatch?.weightedContribution || 0) * 100).toFixed(1)} pts
              </span>
            </div>
          </div>

          {/* 2. Semantic Similarity Ss (Weight 35%) */}
          <div className="bg-white dark:bg-[#111C2E] p-4 rounded-xl space-y-2 border border-[#E2E8F0] dark:border-[#253247] shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#DBEAFE] dark:bg-[#0B1220] text-[#2563EB] dark:text-[#2563EB] flex items-center justify-center font-bold text-xs">
                  <Brain className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#1E293B] dark:text-white">Semantic Similarity (Ss)</h4>
                  <span className="text-[10px] text-[#64748B] dark:text-[#DBEAFE]">Weight: 35%</span>
                </div>
              </div>
              <span className="text-sm font-extrabold font-mono text-[#1E293B] dark:text-[#2563EB]">
                {breakdown?.semanticSimilarity?.percentage || 0}%
              </span>
            </div>

            <div className="w-full bg-[#F8FAFC] dark:bg-[#0B1220] rounded-full h-2 overflow-hidden">
              <div
                className="bg-[#2563EB] dark:bg-[#2563EB] h-2 rounded-full"
                style={{ width: `${breakdown?.semanticSimilarity?.percentage || 0}%` }}
              />
            </div>

            <div className="pt-1 flex items-center justify-between text-[11px] text-[#64748B] dark:text-white">
              <span>Vector Cosine Match</span>
              <span className="font-mono font-bold text-[#2563EB] dark:text-[#2563EB]">
                +{Number((breakdown?.semanticSimilarity?.weightedContribution || 0) * 100).toFixed(1)} pts
              </span>
            </div>
          </div>

          {/* 3. Section Completeness Sc (Weight 20%) */}
          <div className="bg-white dark:bg-[#111C2E] p-4 rounded-xl space-y-2 border border-[#E2E8F0] dark:border-[#253247] shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#DBEAFE] dark:bg-[#0B1220] text-[#2563EB] dark:text-[#2563EB] flex items-center justify-center font-bold text-xs">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#1E293B] dark:text-white">Section Completeness (Sc)</h4>
                  <span className="text-[10px] text-[#64748B] dark:text-[#DBEAFE]">Weight: 20%</span>
                </div>
              </div>
              <span className="text-sm font-extrabold font-mono text-[#1E293B] dark:text-[#2563EB]">
                {breakdown?.sectionCompleteness?.percentage || 0}%
              </span>
            </div>

            <div className="w-full bg-[#F8FAFC] dark:bg-[#0B1220] rounded-full h-2 overflow-hidden">
              <div
                className="bg-[#2563EB] dark:bg-[#2563EB] h-2 rounded-full"
                style={{ width: `${breakdown?.sectionCompleteness?.percentage || 0}%` }}
              />
            </div>

            <div className="pt-1 flex items-center justify-between text-[11px] text-[#64748B] dark:text-white">
              <span>Standard Headers</span>
              <span className="font-mono font-bold text-[#2563EB] dark:text-[#2563EB]">
                +{Number((breakdown?.sectionCompleteness?.weightedContribution || 0) * 100).toFixed(1)} pts
              </span>
            </div>
          </div>

          {/* 4. Formatting Readability Sf (Weight 15%) */}
          <div className="bg-white dark:bg-[#111C2E] p-4 rounded-xl space-y-2 border border-[#E2E8F0] dark:border-[#253247] shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#DBEAFE] dark:bg-[#0B1220] text-[#2563EB] dark:text-[#2563EB] flex items-center justify-center font-bold text-xs">
                  <FileCheck2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#1E293B] dark:text-white">Formatting & Readability (Sf)</h4>
                  <span className="text-[10px] text-[#64748B] dark:text-[#DBEAFE]">Weight: 15%</span>
                </div>
              </div>
              <span className="text-sm font-extrabold font-mono text-[#1E293B] dark:text-[#2563EB]">
                {breakdown?.formattingReadability?.percentage || 0}%
              </span>
            </div>

            <div className="w-full bg-[#F8FAFC] dark:bg-[#0B1220] rounded-full h-2 overflow-hidden">
              <div
                className="bg-[#2563EB] dark:bg-[#2563EB] h-2 rounded-full"
                style={{ width: `${breakdown?.formattingReadability?.percentage || 0}%` }}
              />
            </div>

            <div className="pt-1 flex items-center justify-between text-[11px] text-[#64748B] dark:text-white">
              <span>Bullets & Metrics Impact</span>
              <span className="font-mono font-bold text-[#2563EB] dark:text-[#2563EB]">
                +{Number((breakdown?.formattingReadability?.weightedContribution || 0) * 100).toFixed(1)} pts
              </span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
