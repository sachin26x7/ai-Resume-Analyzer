import { ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

export default function HeroSection({ onScrollToUpload, onExploreFeatures }) {
  return (
    <section className="hero-section">
      <div className="site-container hero-layout">
        <div className="hero-copy">
          <div className="hero-proof">
            <ShieldCheck aria-hidden="true" />
            <span>Resume feedback, built around your next move</span>
          </div>
          <h1>Your next opportunity starts with a <span>stronger resume.</span></h1>
          <p>
            Analyze your resume, identify skill gaps, and get actionable feedback
            to make your next application count.
          </p>
          <div className="hero-actions">
            <button type="button" className="primary-action" onClick={onScrollToUpload}>
              Analyze my resume <ArrowRight aria-hidden="true" />
            </button>
            <button type="button" className="secondary-action" onClick={onExploreFeatures}>
              Explore features
            </button>
          </div>
          <div className="hero-footnote">
            <Sparkles aria-hidden="true" />
            <span>Clear scoring. Practical feedback. Your next step, made clearer.</span>
          </div>
        </div>
        <div className="hero-visual" aria-label="Illustration of resume analysis">
          <div className="preview-topline">
            <span className="preview-mark"><span /></span>
            <div><strong>Resume review</strong><small>Role-specific insights</small></div>
            <span className="preview-status"><span /> Ready to analyze</span>
          </div>
          <div className="preview-document">
            <div className="document-header">
              <span className="document-avatar">JD</span>
              <div><i className="document-line wide" /><i className="document-line medium" /></div>
            </div>
            <div className="document-section">
              <i className="document-label" />
              <i className="document-line full" /><i className="document-line long" />
              <i className="document-line medium" />
            </div>
            <div className="document-section">
              <i className="document-label" />
              <i className="document-line full" /><i className="document-line long" />
              <i className="document-line short" />
            </div>
            <div className="document-section">
              <i className="document-label" />
              <div className="document-tags"><i /><i /><i /><i /></div>
            </div>
          </div>
          <div className="preview-insight">
            <span className="insight-icon"><Sparkles aria-hidden="true" /></span>
            <div><strong>Actionable insights</strong><small>Skills, structure & role alignment</small></div>
            <ArrowRight aria-hidden="true" />
          </div>
        </div>
      </div>
    </section>
  );
}
