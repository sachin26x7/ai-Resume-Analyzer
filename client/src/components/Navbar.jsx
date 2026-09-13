import { FileText, History, ArrowRight } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

export default function Navbar({ onOpenHistoryModal }) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#E4E7EB] dark:border-[#1e8247] bg-white/95 dark:bg-[#083d1c]/95 backdrop-blur-xl transition-colors shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-lg bg-[#4CAF4F] dark:bg-[#FAB818] flex items-center justify-center text-white dark:text-[#083d1c] font-black shadow-sm shrink-0">
            <FileText className="w-5 h-5 text-white dark:text-[#083d1c]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight text-[#263238] dark:text-white">
                ATS<span className="text-[#4CAF4F] dark:text-[#FFC72C]">Insight</span>
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#E8F5E9] dark:bg-[#115e30] text-[#2E7D32] dark:text-[#E8F5E9] border border-[#C8E6C9] dark:border-[#1e8247]">
                NLP Framework
              </span>
            </div>
            <p className="text-xs text-[#717171] dark:text-[#E8F5E9] hidden md:block font-normal">
              ATS-Compatible Resume Intelligence & Career Recommendation Platform
            </p>
          </div>
        </div>

        {/* Quick Actions & Theme Switcher */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          
          {/* History Button */}
          <button
            onClick={onOpenHistoryModal}
            className="px-4 py-2 text-xs font-bold rounded-lg bg-[#4CAF4F] hover:bg-[#388E3C] dark:bg-[#FAB818] dark:hover:bg-[#FFC72C] text-white dark:text-[#083d1c] flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
            title="View saved resume analyses history"
          >
            <History className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Analysis History</span>
            <span className="sm:hidden">History</span>
            <ArrowRight className="w-3 h-3 hidden sm:inline" />
          </button>

          {/* Theme Toggle Button */}
          <ThemeToggle />

        </div>

      </div>
    </header>
  );
}
