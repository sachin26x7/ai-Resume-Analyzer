import React, { useState } from 'react';
import { 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Copy, 
  CheckCheck, 
  Award, 
  Zap 
} from 'lucide-react';

export default function GeminiInsightsCard({ geminiInsights }) {
  if (!geminiInsights) return null;

  const [copiedIndex, setCopiedIndex] = useState(null);

  const handleCopy = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const {
    executiveCritique,
    recruiterHiringVerdict = 'Strong Contender',
    keyStrengths = [],
    criticalWeaknesses = [],
    rewrittenBulletPoints = []
  } = geminiInsights;

  let verdictColor = 'bg-[#E8F5E9] dark:bg-[#FAB818] text-[#2E7D32] dark:text-[#083d1c] font-bold';
  if (recruiterHiringVerdict.includes('Revisions')) {
    verdictColor = 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 font-bold';
  } else if (recruiterHiringVerdict.includes('Edits') || recruiterHiringVerdict.includes('Minor')) {
    verdictColor = 'bg-amber-50 dark:bg-[#083d1c] text-amber-800 dark:text-[#FFC72C] font-bold border border-amber-200 dark:border-[#1e8247]';
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div className="bg-white dark:bg-[#115e30] p-6 sm:p-8 rounded-xl border border-[#E4E7EB] dark:border-[#1e8247] space-y-6 shadow-xs">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E4E7EB] dark:border-[#1e8247] pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#E8F5E9] dark:bg-[#083d1c] flex items-center justify-center text-[#4CAF4F] dark:text-[#FFC72C] font-bold">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#4D4D4D] dark:text-white flex items-center gap-2">
                  <span>AI Deep Resume Analysis & Recruiter Critique</span>
                </h3>
              </div>
            </div>
            <p className="text-xs text-[#717171] dark:text-[#E8F5E9]">
              Generative AI evaluation providing executive recruiter review and high-impact bullet point rewriting.
            </p>
          </div>

          {/* Recruiter Verdict Pill */}
          <div className="shrink-0 flex items-center gap-2">
            <span className="text-xs text-[#717171] dark:text-[#E8F5E9] font-medium">Recruiter Verdict:</span>
            <span className={`px-3 py-1 rounded-full text-xs font-mono shadow-xs ${verdictColor}`}>
              ★ {recruiterHiringVerdict}
            </span>
          </div>
        </div>

        {/* Executive Critique Summary */}
        {executiveCritique && (
          <div className="p-4 sm:p-5 rounded-xl bg-[#F5F7FA] dark:bg-[#083d1c] border border-[#E4E7EB] dark:border-[#1e8247] space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-[#4D4D4D] dark:text-[#FFC72C] uppercase tracking-wide">
              <Award className="w-4 h-4 text-[#4CAF4F] dark:text-[#FFC72C]" />
              <span>Executive Recruiter Evaluation</span>
            </div>
            <p className="text-xs sm:text-sm text-[#263238] dark:text-white leading-relaxed font-normal">
              {executiveCritique}
            </p>
          </div>
        )}

        {/* 2-Column: Key Strengths vs Critical Gaps */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Strengths */}
          <div className="p-4 rounded-xl bg-[#F5F7FA] dark:bg-[#083d1c] border border-[#E4E7EB] dark:border-[#1e8247] space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-[#2E7D32] dark:text-[#FFC72C] uppercase tracking-wide">
              <CheckCircle2 className="w-4 h-4 text-[#4CAF4F] dark:text-[#FFC72C]" />
              <span>Identified Key Strengths</span>
            </div>
            <ul className="space-y-2">
              {keyStrengths.map((item, idx) => (
                <li key={idx} className="text-xs text-[#4D4D4D] dark:text-white flex items-start gap-2">
                  <span className="text-[#4CAF4F] dark:text-[#FFC72C] font-bold shrink-0">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Weaknesses / Improvements */}
          <div className="p-4 rounded-xl bg-[#F5F7FA] dark:bg-[#083d1c] border border-[#E4E7EB] dark:border-[#1e8247] space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-red-700 dark:text-[#E63946] uppercase tracking-wide">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              <span>Critical Areas for Improvement</span>
            </div>
            <ul className="space-y-2">
              {criticalWeaknesses.map((item, idx) => (
                <li key={idx} className="text-xs text-[#4D4D4D] dark:text-white flex items-start gap-2">
                  <span className="text-red-500 font-bold shrink-0">!</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* AI Rewritten Bullet Points */}
        {rewrittenBulletPoints.length > 0 && (
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-[#4D4D4D] dark:text-white uppercase tracking-wide flex items-center gap-2">
                <Zap className="w-4 h-4 text-[#4CAF4F] dark:text-[#FFC72C]" />
                <span>AI Rewritten High-Impact Bullet Points (Google XYZ Formula)</span>
              </h4>
              <span className="text-[11px] text-[#4CAF4F] dark:text-[#FFC72C] font-mono font-semibold">1-Click Copy</span>
            </div>

            <div className="space-y-3">
              {rewrittenBulletPoints.map((item, idx) => (
                <div 
                  key={idx} 
                  className="p-4 rounded-xl bg-[#F5F7FA] dark:bg-[#083d1c] border border-[#E4E7EB] dark:border-[#1e8247] space-y-3"
                >
                  {(() => {
                    const optimizedBullet = item.optimized || item.improved || item.original || '';
                    const rationale = item.rationale || item.reason;
                    return (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    
                    {/* Before */}
                    <div className="p-3 rounded-lg bg-white dark:bg-[#115e30] border border-[#E4E7EB] dark:border-[#1e8247] space-y-1">
                      <span className="text-[10px] font-bold text-red-600 dark:text-[#E63946] uppercase font-mono block">
                        Original Bullet (Vague)
                      </span>
                      <p className="text-xs text-[#717171] dark:text-[#E8F5E9] italic">
                        "{item.original}"
                      </p>
                    </div>

                    {/* After */}
                    <div className="p-3 rounded-lg bg-white dark:bg-[#115e30] border border-[#E4E7EB] dark:border-[#1e8247] space-y-1.5 relative group">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-[#2E7D32] dark:text-[#FFC72C] uppercase font-mono block">
                          Optimized Impact Bullet
                        </span>
                        <button
                          onClick={() => handleCopy(optimizedBullet, idx)}
                          className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-[#E8F5E9] dark:bg-[#FAB818] text-[#2E7D32] dark:text-[#083d1c] flex items-center gap-1 transition-all shadow-xs"
                          title="Copy to clipboard"
                        >
                          {copiedIndex === idx ? (
                            <>
                              <CheckCheck className="w-3.5 h-3.5 text-[#4CAF4F]" />
                              <span>Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>
                      <p className="text-xs text-[#263238] dark:text-white font-mono font-medium">
                        "{optimizedBullet}"
                      </p>
                      {rationale && (
                        <p className="text-[11px] text-[#717171] dark:text-[#E8F5E9] pt-0.5">
                          💡 <strong className="text-[#4CAF4F] dark:text-[#FFC72C]">Enhancement:</strong> {rationale}
                        </p>
                      )}
                    </div>

                  </div>
                    );
                  })()}
                </div>
              ))}
            </div>
          </div>
        )}


      </div>
    </div>
  );
}
