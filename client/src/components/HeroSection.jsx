import { ShieldCheck, ArrowRight } from 'lucide-react';

export default function HeroSection({ onScrollToUpload }) {
  return (
    <section className="relative pt-10 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        
        {/* Framework Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E8F5E9] dark:bg-[#083d1c] border border-[#C8E6C9] dark:border-[#1e8247] text-[#2E7D32] dark:text-[#E8F5E9] text-xs font-semibold shadow-xs">
          <ShieldCheck className="w-4 h-4 text-[#4CAF4F] dark:text-[#FFC72C]" />
          <span>AI-Powered NLP Framework • ATS Intelligence Engine</span>
        </div>

        {/* Headline */}
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#4D4D4D] dark:text-white leading-tight">
          Transparent ATS Resume Scoring <br />
          <span className="text-[#4CAF4F] dark:text-[#FFC72C]">and Career Recommendation</span>
        </h1>

        {/* Subtitle */}
        <p className="text-[#717171] dark:text-[#E8F5E9] text-sm sm:text-base leading-relaxed max-w-2xl mx-auto font-normal">
          Get transparent multi-factor scoring, actionable NLP skill gap elimination, and tailored Indian tech hub career recommendations.
        </p>

        {/* Quick Action Button */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={onScrollToUpload}
            className="px-6 py-3 rounded-lg font-bold text-sm bg-[#4CAF4F] hover:bg-[#388E3C] dark:bg-[#FAB818] dark:hover:bg-[#FFC72C] text-white dark:text-[#083d1c] flex items-center gap-2 transition-all shadow-md active:scale-98"
          >
            <span>Start Resume Analysis</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
}
