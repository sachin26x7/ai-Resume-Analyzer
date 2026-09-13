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
    <div className="min-h-screen flex flex-col relative transition-colors">
      
      {/* Top Navigation */}
      <Navbar onOpenHistoryModal={() => setShowHistoryModal(true)} />

      {/* Main Content Body */}
      <main className="flex-1 space-y-6 pb-16">
        
        {/* Hero Section */}
        <HeroSection onScrollToUpload={() => document.getElementById('upload-panel')?.scrollIntoView({ behavior: 'smooth' })} />

        {/* Upload & Job Input Workspace */}
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

        {/* Results Container (Rendered after analysis) */}
        {analysisResult && (
          <div id="results-section" className="space-y-6 animate-fadeIn">
            
            {/* Section Demarcation Header */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#4CAF4F] dark:text-[#FFC72C]">
                <span className="w-2 h-2 rounded-full bg-[#4CAF4F] dark:bg-[#FFC72C] animate-pulse" />
                <span>NLP Evaluation Dashboard & Explainability Matrix</span>
              </div>
            </div>

            {/* 1. Scorecard Overview */}
            <ScorecardOverview
              analysisResult={analysisResult}
              onOpenAuditModal={() => setShowAuditModal(true)}
            />

            {/* 2. Gemini AI Deep Analysis + Project Recommendations */}
            {analysisResult.geminiInsights && (
              <>
                <GeminiInsightsCard
                  geminiInsights={analysisResult.geminiInsights}
                />
                <ProjectRecommendationsCard
                  geminiInsights={analysisResult.geminiInsights}
                  targetJobTitle={targetJobTitle}
                  onAddProject={handleAddProject}
                />
              </>
            )}

            {/* 3. Skill Matrix */}
            <SkillMatrix
              analysisResult={analysisResult}
            />

            {/* 4. Feedback Deck */}
            <PersonalizedFeedbackDeck
              analysisResult={analysisResult}
            />

            {/* 5. Career Recommendations Deck */}
            <CareerRecommendationsDeck
              analysisResult={analysisResult}
              targetJobTitle={targetJobTitle}
            />



          </div>
        )}

      </main>

      {/* Modals */}
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

      {/* Footer */}
      <footer className="border-t border-[#E4E7EB] dark:border-[#1e8247] bg-white dark:bg-[#083d1c] text-[#717171] dark:text-[#E8F5E9] py-6 px-4 sm:px-6 lg:px-8 text-xs transition-colors">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <p>
            © {new Date().getFullYear()} <span className="text-[#263238] dark:text-white font-bold">ATSInsight.ai</span> — AI-Powered ATS Resume Analysis & Career Recommendation.
          </p>
          <p className="text-[#89939E] dark:text-[#C8E6C9] text-[11px]">
            Fast • Secure • Explainable AI
          </p>
        </div>
      </footer>

    </div>
  );
}
