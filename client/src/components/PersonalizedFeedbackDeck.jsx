import { useState } from 'react';
import { 
  Lightbulb, 
  TrendingUp, 
  CheckCheck, 
  Copy
} from 'lucide-react';

export default function PersonalizedFeedbackDeck({ analysisResult }) {
  if (!analysisResult || !analysisResult.feedback) return null;

  const feedbackList = analysisResult.feedback;
  const [copiedId, setCopiedId] = useState(null);

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-4">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E4E7EB] dark:border-[#374151] pb-3">
        <div>
          <h3 className="text-base font-bold text-[#4D4D4D] dark:text-white flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-[#4CAF4F]" />
            <span>Personalized Feedback & Optimization Roadmap</span>
          </h3>
          <p className="text-xs text-[#717171] dark:text-[#9CA3AF] mt-0.5 font-normal">
            Ranked by potential ATS score impact based on mathematical feature optimization.
          </p>
        </div>
        <div className="text-xs font-mono font-semibold text-[#4CAF4F]">
          {feedbackList.length} Actionable Recommendations
        </div>
      </div>

      {/* Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {feedbackList.map((item, index) => {
          
          let priorityBadge = 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800';
          if (item.priority === 'MEDIUM') {
            priorityBadge = 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800';
          } else if (item.priority === 'LOW') {
            priorityBadge = 'bg-[#F5F7FA] dark:bg-[#111827] text-[#717171] dark:text-[#9CA3AF] border border-[#E4E7EB] dark:border-[#374151]';
          }

          return (
            <div
              key={item.id || index}
              className="bg-white dark:bg-[#0b3d20] p-5 rounded-xl space-y-3 flex flex-col justify-between border border-[#E4E7EB] dark:border-[#2d7a49] hover:border-[#81C784] hover:shadow-md transition-all shadow-xs"
            >
              <div className="space-y-2">
                
                {/* Category Tag & Priority */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-[10px] font-mono font-semibold px-2.5 py-0.5 rounded-md bg-[#F5F7FA] dark:bg-[#111827] border border-[#E4E7EB] dark:border-[#374151] text-[#4D4D4D] dark:text-[#E5E7EB]">
                    {(item.rule || item.category || 'ATS Optimization').replace(/^Rule\s*\d+\s*:\s*/i, '').replace(/Rule\s*\d+/gi, '').trim()}
                  </span>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${priorityBadge}`}>
                      {item.priority} PRIORITY
                    </span>
                    {item.impact && (
                      <span className="text-[10px] font-semibold text-[#2E7D32] dark:text-[#81C784] bg-[#E8F5E9] dark:bg-[#4CAF4F]/20 px-2 py-0.5 rounded flex items-center gap-0.5">
                        <TrendingUp className="w-3 h-3 text-[#4CAF4F]" /> {item.impact}
                      </span>
                    )}
                  </div>
                </div>

                {/* Title */}
                <h4 className="text-sm font-bold text-[#263238] dark:text-white leading-snug pt-1">
                  {item.title}
                </h4>

                {/* Description */}
                <p className="text-xs text-[#717171] dark:text-[#9CA3AF] leading-relaxed">
                  {item.description}
                </p>

                {/* Action Items */}
                {item.actionItems && item.actionItems.length > 0 && (
                  <ul className="space-y-1.5 pt-1">
                    {item.actionItems.map((act, aIdx) => (
                      <li key={aIdx} className="text-xs text-[#4D4D4D] dark:text-[#E5E7EB] flex items-start gap-2">
                        <span className="text-[#4CAF4F] font-bold shrink-0">→</span>
                        <span>{act}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {/* Chips */}
                {item.chips && item.chips.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {item.chips.map((chip, cIdx) => (
                      <span
                        key={cIdx}
                        className="px-2 py-0.5 text-[11px] font-mono font-semibold rounded bg-[#E8F5E9] dark:bg-[#4CAF4F]/20 text-[#2E7D32] dark:text-[#81C784] border border-[#C8E6C9] dark:border-[#4CAF4F]/30"
                      >
                        + {chip}
                      </span>
                    ))}
                  </div>
                )}

              </div>

              {/* Copy template snippet if applicable */}
              {item.category === 'Semantic Relevance' && (
                <div className="pt-2 border-t border-[#E4E7EB] dark:border-[#374151]">
                  <div className="p-2.5 rounded-lg bg-[#F5F7FA] dark:bg-[#111827] border border-[#E4E7EB] dark:border-[#374151] flex items-center justify-between text-xs font-mono text-[#4D4D4D] dark:text-[#E5E7EB]">
                    <span className="truncate pr-2 font-normal">
                      "Engineered [System/Feature], reducing [Metric] by 35% through [Technology]."
                    </span>
                    <button
                      onClick={() => handleCopy("Engineered [System/Feature], reducing [Metric] by 35% through [Technology].", `tmpl-${index}`)}
                      className="p-1 rounded bg-[#E8F5E9] dark:bg-[#4CAF4F]/20 text-[#2E7D32] dark:text-[#81C784] shrink-0 font-bold"
                      title="Copy improvement template"
                    >
                      {copiedId === `tmpl-${index}` ? <CheckCheck className="w-3.5 h-3.5 text-[#4CAF4F]" /> : <Copy className="w-3.5 h-3.5 text-[#4CAF4F]" />}
                    </button>
                  </div>
                </div>
              )}

            </div>
          );
        })}
      </div>

    </div>
  );
}
