import { useState } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import UploadAnalysisPanel from './components/UploadAnalysisPanel';
import ScorecardOverview from './components/ScorecardOverview';
import GeminiInsightsCard from './components/GeminiInsightsCard';
import SkillMatrix from './components/SkillMatrix';
import PersonalizedFeedbackDeck from './components/PersonalizedFeedbackDeck';
import CareerRecommendationsDeck from './components/CareerRecommendationsDeck';
import ProjectRecommendationsCard from './components/ProjectRecommendationsCard';
import AuditReportModal from './components/AuditReportModal';
import HistoryModal from './components/HistoryModal';
import { BarChart3, BriefcaseBusiness, FileCheck2, FileSearch, Sparkles } from 'lucide-react';
import { analyzeResumeApi, analyzeResumeFileApi } from './services/api';
import { analyzeResumeClient } from './services/clientNlpEngine';

export default function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [resumeText, setResumeText] = useState('');
  const [targetJobTitle, setTargetJobTitle] = useState('Full Stack MERN Developer');
  const [targetJobDescription, setTargetJobDescription] = useState('Builds responsive web applications using React.js and Node.js with MongoDB data pipelines and RESTful microservices.');
  const [jobRequiredSkills, setJobRequiredSkills] = useState([
    "React.js", "Node.js", "Express.js", "MongoDB", "JavaScript", "TypeScript", "RESTful APIs", "HTML5", "CSS3", "Git & Version Control"
  ]);
  const [preferences, setPreferences] = useState({
    preferredLocation: 'Any',
    preferredSalary: 'Any'
  });

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [analysisError, setAnalysisError] = useState(null);
  const [showAuditModal, setShowAuditModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  // Analyze Resume Function
  const handleAnalyze = async (resumeTextOverride = null, forceTextAnalysis = false) => {
    setIsAnalyzing(true);
    setAnalysisError(null);
    const textToAnalyze = resumeTextOverride ?? resumeText;
    try {
      let result;
      if (selectedFile && !forceTextAnalysis) {
        try {
          result = await analyzeResumeFileApi(selectedFile, targetJobTitle, targetJobDescription, jobRequiredSkills, preferences, textToAnalyze);
        } catch (err) {
          if (err.isApiError) throw err;
          console.warn('Backend server unreachable, running client NLP fallback...');
          result = analyzeResumeClient(textToAnalyze, targetJobTitle, targetJobDescription, jobRequiredSkills, preferences);
        }
      } else {
        try {
          result = await analyzeResumeApi(textToAnalyze, targetJobTitle, targetJobDescription, jobRequiredSkills, preferences);
        } catch (err) {
          if (err.isApiError) throw err;
          console.warn('Backend server unreachable, running client NLP fallback...');
          result = analyzeResumeClient(textToAnalyze, targetJobTitle, targetJobDescription, jobRequiredSkills, preferences);
        }
      }

      setAnalysisResult(result);
      if (result.resumeText) setResumeText(result.resumeText);
      setTimeout(() => {
        document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (error) {
      console.error('Analysis error:', error);
      setAnalysisError(error.message || 'Please check the backend server connection.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAddProject = async (project) => {
    const currentResumeText = analysisResult?.resumeText || resumeText;
    const projectTitle = (project.title || '').trim();
    if (!projectTitle || currentResumeText.toLowerCase().includes(projectTitle.toLowerCase())) return;

    const projectEntry = [
      '',
      'PROJECTS',
      projectTitle,
      project.description,
      `Technologies: ${(project.techStack || []).join(', ')}`,
      `Keywords: ${(project.githubKeywords || []).join(', ')}`
    ].filter(Boolean).join('\n');
    const updatedResumeText = `${currentResumeText.trim()}\n${projectEntry}`;

    setSelectedFile(null);
    setResumeText(updatedResumeText);
    await handleAnalyze(updatedResumeText, true);
  };

  const handleApplyOptimized = (newResult, newText) => {
    setAnalysisResult(newResult);
    setResumeText(newText);
    document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSelectHistoryItem = (historyItem) => {
    setAnalysisResult(historyItem);
    if (historyItem.resumeText) {
      setResumeText(historyItem.resumeText);
    }
    if (historyItem.targetJob?.title) {
      setTargetJobTitle(historyItem.targetJob.title);
    }
    if (historyItem.targetJob?.description) {
      setTargetJobDescription(historyItem.targetJob.description);
    }
    if (historyItem.targetJob?.requiredSkills && Array.isArray(historyItem.targetJob.requiredSkills)) {
      setJobRequiredSkills(historyItem.targetJob.requiredSkills);
    }
    if (historyItem.preferences) {
      setPreferences(historyItem.preferences);
    }
    setShowHistoryModal(false);
    setTimeout(() => {
      const section = document.getElementById('results-section');
      if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 150);
  };

  return (
    <div className="app-shell min-h-screen flex flex-col relative transition-colors">
      <Navbar onOpenHistoryModal={() => setShowHistoryModal(true)} />

      <main className="flex-1">
        <HeroSection
          onScrollToUpload={() => document.getElementById('upload-panel')?.scrollIntoView({ behavior: 'smooth' })}
          onExploreFeatures={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
        />

        <section id="features" className="public-section feature-section">
          <div className="site-container">
            <div className="section-heading">
              <span className="eyebrow">A clearer path forward</span>
              <h2>Make every application more intentional.</h2>
              <p>Understand how your resume reads to an ATS and what to improve before you apply.</p>
            </div>
            <div className="feature-grid">
              <article className="feature-card">
                <span className="feature-icon"><FileSearch aria-hidden="true" /></span>
                <h3>Know where you stand</h3>
                <p>See a transparent score breakdown across keywords, relevance, structure, and readability.</p>
              </article>
              <article className="feature-card">
                <span className="feature-icon"><BarChart3 aria-hidden="true" /></span>
                <h3>Find your skill gaps</h3>
                <p>Compare your experience with role requirements and surface the skills that need attention.</p>
              </article>
              <article className="feature-card">
                <span className="feature-icon"><BriefcaseBusiness aria-hidden="true" /></span>
                <h3>Turn feedback into action</h3>
                <p>Get practical recommendations and role suggestions grounded in your resume analysis.</p>
              </article>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="public-section process-section">
          <div className="site-container process-layout">
            <div className="section-heading">
              <span className="eyebrow">How it works</span>
              <h2>From upload to a more confident application.</h2>
              <p>A focused review of your resume, tailored to the role you want next.</p>
            </div>
            <ol className="process-list">
              <li><span>01</span><div><h3>Add your resume</h3><p>Upload a file or paste your resume text securely for analysis.</p></div></li>
              <li><span>02</span><div><h3>Choose a target role</h3><p>Select a role and refine the skills and preferences to match your goals.</p></div></li>
              <li><span>03</span><div><h3>Review your insights</h3><p>Explore your score, skill alignment, recruiter feedback, and next steps.</p></div></li>
            </ol>
          </div>
        </section>

        <section className="analysis-section">
          <div className="site-container">
            <div className="analysis-heading">
              <div>
                <span className="eyebrow">Resume workspace</span>
                <h2>Build a stronger application.</h2>
                <p>Share your resume and the role you’re targeting to get a tailored review.</p>
              </div>
              <span className="analysis-note"><FileCheck2 aria-hidden="true" /> Your results are based on your resume</span>
            </div>
            <UploadAnalysisPanel
              onAnalyze={handleAnalyze}
              onReset={() => setAnalysisResult(null)}
              analysisError={analysisError}
              onClearAnalysisError={() => setAnalysisError(null)}
              isAnalyzing={isAnalyzing}
              resumeText={resumeText}
              setResumeText={setResumeText}
              selectedFile={selectedFile}
              setSelectedFile={setSelectedFile}
              targetJobTitle={targetJobTitle}
              setTargetJobTitle={setTargetJobTitle}
              targetJobDescription={targetJobDescription}
              setTargetJobDescription={setTargetJobDescription}
              jobRequiredSkills={jobRequiredSkills}
              setJobRequiredSkills={setJobRequiredSkills}
              preferences={preferences}
              setPreferences={setPreferences}
            />
          </div>
        </section>

        {analysisResult && (
          <section id="results-section" className="results-section animate-fadeIn">
            <div className="site-container results-heading">
              <div>
                <span className="eyebrow"><Sparkles aria-hidden="true" /> Your analysis</span>
                <h2>Resume insights</h2>
                <p>Feedback and scores generated from your resume and selected target role.</p>
              </div>
              {targetJobTitle && <span className="target-role">{targetJobTitle}</span>}
            </div>
            <ScorecardOverview
              analysisResult={analysisResult}
              onOpenAuditModal={() => setShowAuditModal(true)}
            />
            {analysisResult.geminiInsights && (
              <>
                <GeminiInsightsCard geminiInsights={analysisResult.geminiInsights} />
                <ProjectRecommendationsCard
                  geminiInsights={analysisResult.geminiInsights}
                  targetJobTitle={targetJobTitle}
                  onAddProject={handleAddProject}
                />
              </>
            )}
            <SkillMatrix analysisResult={analysisResult} />
            <PersonalizedFeedbackDeck analysisResult={analysisResult} />
            <CareerRecommendationsDeck
              analysisResult={analysisResult}
              targetJobTitle={targetJobTitle}
            />
          </section>
        )}
      </main>

      {showAuditModal && analysisResult && (
        <AuditReportModal
          analysisResult={analysisResult}
          onClose={() => setShowAuditModal(false)}
        />
      )}
      {showHistoryModal && (
        <HistoryModal
          onClose={() => setShowHistoryModal(false)}
          onSelectHistoryItem={handleSelectHistoryItem}
        />
      )}

      <footer className="site-footer">
        <div className="site-container footer-content">
          <a className="footer-brand" href="#" aria-label="ATSInsight home">ATS<span>Insight</span></a>
          <p>Thoughtful resume feedback for your next opportunity.</p>
          <span>© {new Date().getFullYear()} ATSInsight</span>
        </div>
      </footer>
    </div>
  );
}
