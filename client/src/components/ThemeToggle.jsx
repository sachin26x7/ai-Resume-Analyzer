import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function ThemeToggle() {
  const { toggleTheme, isDark } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className="p-2 rounded-xl bg-emerald-50 dark:bg-[#0e4233] hover:bg-emerald-100 dark:hover:bg-[#145341] text-emerald-800 dark:text-emerald-100 border border-emerald-200 dark:border-[#237a62] shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
      title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      aria-label="Toggle dark/light theme"
    >
      <div className="relative w-4 h-4 flex items-center justify-center">
        {isDark ? (
          <Sun className="w-4 h-4 text-emerald-400 transition-transform duration-200 rotate-0 scale-100" />
        ) : (
          <Moon className="w-4 h-4 text-emerald-700 transition-transform duration-200 rotate-0 scale-100" />
        )}
      </div>
    </button>
  );
}
