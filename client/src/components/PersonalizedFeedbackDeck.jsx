import { useState } from 'react';
import {
  ArrowUpRight,
  CheckCheck,
  Clipboard,
  Copy,
  Lightbulb,
  TrendingUp
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
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 border-b border-[#E2E8F0] dark:border-[#253247] pb-4">
        <div>
          <span className="text-[11px] font-semibold tracking-wider uppercase text-[#2563EB] flex items-center gap-2">
            <Lightbulb className="w-4 h-4" aria-hidden="true" />
            Improvement plan
          </span>
          <h3 className="text-lg sm:text-xl font-semibold tracking-tight text-[#1E293B] dark:text-[#F1F5F9] mt-1.5">
            Personalized Feedback &amp; Optimization Roadmap
          </h3>
          <p className="text-xs sm:text-sm text-[#64748B] dark:text-[#94A3B8] mt-1.5">
            Ranked by potential ATS score impact based on mathematical feature optimization.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 self-start sm:self-auto px-3 py-2 rounded-lg bg-[#F8FAFC] dark:bg-[#111C2E] border border-[#E2E8F0] dark:border-[#253247] text-xs font-medium text-[#64748B] dark:text-[#94A3B8]">
          <Clipboard className="w-3.5 h-3.5 text-[#2563EB]" aria-hidden="true" />
          <span><strong className="text-[#1E293B] dark:text-[#F1F5F9]">{feedbackList.length}</strong> actionable recommendations</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {feedbackList.map((item, index) => {
          const priority = (item.priority || 'LOW').toUpperCase();
          const priorityStyle = priority === 'HIGH'
            ? 'bg-[#FEF2F2] text-[#B91C1C] border-[#FECACA] dark:bg-[#EF4444]/10 dark:text-[#FCA5A5] dark:border-[#EF4444]/25'
            : priority === 'MEDIUM'
              ? 'bg-[#FFFBEB] text-[#B45309] border-[#FDE68A] dark:bg-[#F59E0B]/10 dark:text-[#FCD34D] dark:border-[#F59E0B]/25'
              : 'bg-[#F8FAFC] text-[#64748B] border-[#E2E8F0] dark:bg-[#182438] dark:text-[#94A3B8] dark:border-[#253247]';

          return (
            <article
              key={item.id || index}
              className="bg-white dark:bg-[#111C2E] p-5 sm:p-6 rounded-xl border border-[#E2E8F0] dark:border-[#253247] shadow-sm hover:border-[#BFDBFE] dark:hover:border-[#2563EB]/60 transition-colors flex flex-col justify-between gap-5"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-7 h-7 shrink-0 rounded-md bg-[#EFF6FF] dark:bg-[#2563EB]/15 text-[#2563EB] grid place-items-center text-[11px] font-semibold tabular-nums">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="text-[10px] sm:text-[11px] font-medium px-2.5 py-1 rounded-md bg-[#F8FAFC] dark:bg-[#182438] border border-[#E2E8F0] dark:border-[#253247] text-[#64748B] dark:text-[#94A3B8] truncate">
                      {(item.rule || item.category || 'ATS Optimization').replace(/^Rule\s*\d+\s*:\s*/i, '').replace(/Rule\s*\d+/gi, '').trim()}
                    </span>
                  </div>
                  <span className={`shrink-0 text-[9px] font-semibold tracking-wide px-2 py-1 rounded-full border ${priorityStyle}`}>
                    {priority} PRIORITY
                  </span>
                </div>

                <div>
                  <h4 className="text-sm sm:text-[15px] font-semibold text-[#1E293B] dark:text-[#F1F5F9] leading-snug">
                    {item.title}
                  </h4>
                  {item.description && (
                    <p className="text-xs sm:text-[13px] text-[#64748B] dark:text-[#94A3B8] leading-relaxed mt-2">
                      {item.description}
                    </p>
                  )}
                </div>

                {item.impact && (
                  <div className="inline-flex items-center gap-1.5 text-[11px] font-medium text-[#1D4ED8] dark:text-[#93C5FD] bg-[#EFF6FF] dark:bg-[#2563EB]/15 border border-[#DBEAFE] dark:border-[#2563EB]/25 px-2.5 py-1.5 rounded-md">
                    <TrendingUp className="w-3.5 h-3.5" aria-hidden="true" />
                    Potential impact: {item.impact}
                  </div>
                )}

                {item.actionItems && item.actionItems.length > 0 && (
                  <ul className="space-y-2 border-t border-[#F1F5F9] dark:border-[#253247] pt-3">
                    {item.actionItems.map((act, aIdx) => (
                      <li key={aIdx} className="text-xs text-[#334155] dark:text-[#CBD5E1] flex items-start gap-2.5 leading-relaxed">
                        <ArrowUpRight className="w-3.5 h-3.5 text-[#2563EB] shrink-0 mt-0.5" aria-hidden="true" />
                        <span>{act}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {item.chips && item.chips.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {item.chips.map((chip, cIdx) => (
                      <span
                        key={cIdx}
                        className="px-2 py-1 text-[10px] font-medium rounded-md bg-[#F8FAFC] dark:bg-[#182438] text-[#475569] dark:text-[#CBD5E1] border border-[#E2E8F0] dark:border-[#253247]"
                      >
                        {chip}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {item.category === 'Semantic Relevance' && (
                <div className="pt-4 border-t border-[#E2E8F0] dark:border-[#253247]">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-[#64748B] dark:text-[#94A3B8] mb-2">
                    Example achievement statement
                  </p>
                  <div className="p-3 rounded-lg bg-[#F8FAFC] dark:bg-[#0B1220] border border-[#E2E8F0] dark:border-[#253247] flex items-center justify-between gap-3">
                    <span className="text-[11px] leading-relaxed text-[#475569] dark:text-[#CBD5E1]">
                      "Engineered [System/Feature], reducing [Metric] by 35% through [Technology]."
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy("Engineered [System/Feature], reducing [Metric] by 35% through [Technology].", `tmpl-${index}`)}
                      className="w-8 h-8 rounded-md border border-[#E2E8F0] dark:border-[#253247] bg-white dark:bg-[#111C2E] text-[#2563EB] hover:bg-[#EFF6FF] dark:hover:bg-[#182438] grid place-items-center shrink-0 transition-colors"
                      title="Copy improvement template"
                      aria-label="Copy improvement template"
                    >
                      {copiedId === `tmpl-${index}`
                        ? <CheckCheck className="w-4 h-4" aria-hidden="true" />
                        : <Copy className="w-4 h-4" aria-hidden="true" />}
                    </button>
                  </div>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}
