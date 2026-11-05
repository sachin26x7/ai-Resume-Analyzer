import { useState } from 'react';
import { FileText, History, Menu, X } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

export default function Navbar({ onOpenHistoryModal }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="site-header">
      <div className="site-container header-inner">
        <a className="brand-lockup" href="#" aria-label="ATSInsight home" onClick={closeMenu}>
          <span className="brand-symbol"><FileText aria-hidden="true" /></span>
          <span className="brand-name">ATS<span>Insight</span></span>
        </a>

        <nav className={`primary-nav${menuOpen ? ' is-open' : ''}`} aria-label="Main navigation">
          <a href="#features" onClick={closeMenu}>Features</a>
          <a href="#how-it-works" onClick={closeMenu}>How it works</a>
          <button type="button" className="history-nav" onClick={() => { closeMenu(); onOpenHistoryModal(); }}>
            <History aria-hidden="true" /> Analysis history
          </button>
        </nav>

        <div className="header-actions">
          <ThemeToggle />
          <a className="header-cta" href="#upload-panel">Analyze my resume</a>
          <button
            type="button"
            className="mobile-menu-toggle"
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(open => !open)}
          >
            {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>
        </div>
      </div>
    </header>
  );
}
