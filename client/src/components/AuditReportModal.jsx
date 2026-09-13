import React, { useRef, useState } from 'react';
import { 
  Award, 
  Printer, 
  Download,
  X, 
  CheckCircle2, 
  XCircle, 
  FileText, 
  Brain, 
  Layers, 
  FileCheck2, 
  Cpu, 
  Loader2,
  Sparkles,
  Zap,
  TrendingUp,
  Compass
} from 'lucide-react';
import { downloadElementAsPdf } from '../services/pdfGenerator';
import { useTheme } from '../context/ThemeContext';

export default function AuditReportModal({ analysisResult, onClose }) {
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const reportRef = useRef(null);
  const { isDark } = useTheme();

  if (!analysisResult || !analysisResult.atsScore) return null;

  const { 
    atsScore, 
    candidate, 
    targetJob, 
    skillGap, 
    geminiInsights, 
    extractedSkills = [], 
    resumeFeatures,
    careerRecommendations 
  } = analysisResult;

  const breakdown = atsScore.breakdown;

  // Accurate candidate profile information
  const candidateName = candidate?.name && candidate.name.trim().length > 1 ? candidate.name.trim() : 'Candidate Profile';
  const candidateEmail = candidate?.email || null;
  const candidatePhone = candidate?.phone || null;
  const targetRole = targetJob?.title || 'Full Stack MERN Developer';

  // Check if insights came from real Gemini API or the fallback synthesizer
  const isGeminiVerified = geminiInsights?.source && geminiInsights.source.toLowerCase().includes('gemini') && !geminiInsights.source.toLowerCase().includes('synthesized');

  // Career match top 3
  const topRecs = careerRecommendations?.top3 || careerRecommendations?.top5 || [];

  // Direct 1-Click High-DPI Full-Detail PDF Download
  const handleDownloadPdf = async () => {
    if (isGeneratingPdf) return;
    setIsGeneratingPdf(true);
    try {
      const safeName = candidateName.replace(/\s+/g, '_');
      const fileName = `ATS_Audit_Report_${safeName}.pdf`;
      // Pass analysisResult so the programmatic PDF renderer can access all data
      await downloadElementAsPdf(reportRef.current, fileName, analysisResult);
    } catch (err) {
      console.error('Download PDF error:', err);
      alert('PDF generation failed. Try the Print button instead.');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  // Safe Isolated Print Preview
  const handlePrint = () => {
    if (!reportRef.current) {
      window.print();
      return;
    }

    const printWindow = window.open('', '_blank', 'width=950,height=1200');
    if (!printWindow) {
      window.print();
      return;
    }

    const reportHtml = reportRef.current.outerHTML;
    const styles = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
      .map(el => el.outerHTML)
      .join('\n');

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>ATS Audit Report - ${candidateName}</title>
          ${styles}
          <style>
            body {
              margin: 0;
              padding: 12mm;
              background: #ffffff !important;
              color: #1a1a1a !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            #audit-print-root {
              width: 100% !important;
              max-width: 100% !important;
              border: none !important;
              padding: 0 !important;
              background: #ffffff !important;
              color: #1a1a1a !important;
              box-sizing: border-box !important;
            }
          </style>
        </head>
        <body>
          ${reportHtml}
          <script>
            window.onload = function() {
              window.focus();
              window.print();
              setTimeout(() => { window.close(); }, 1000);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 dark:bg-[#083d1c]/85 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-4xl max-h-[96vh] flex flex-col bg-white dark:bg-[#115e30] border border-[#E4E7EB] dark:border-[#1e8247] rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Modal Top Bar (Hidden on Print) */}
        <div className="no-print flex items-center justify-between px-5 py-3.5 bg-[#F5F7FA] dark:bg-[#083d1c] border-b border-[#E4E7EB] dark:border-[#1e8247] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#4CAF4F] dark:bg-[#FAB818] text-white dark:text-[#083d1c] flex items-center justify-center font-black">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-sm text-[#263238] dark:text-white block">Official ATS Audit Report</span>
              <span className="text-[11px] text-[#717171] dark:text-[#E8F5E9]">Comprehensive Full-Detail Analysis & Export</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Direct 1-Click PDF Download Button */}
            <button
              onClick={handleDownloadPdf}
              disabled={isGeneratingPdf}
              className="px-4 py-2 rounded-lg bg-[#4CAF4F] hover:bg-[#388E3C] dark:bg-[#FAB818] dark:hover:bg-[#FFC72C] text-white dark:text-[#083d1c] text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs active:scale-95 disabled:opacity-60"
              title="Download direct high-resolution PDF document"
            >
              {isGeneratingPdf ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Generating PDF...</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF</span>
                </>
              )}
            </button>

            {/* Print Button */}
            <button
              onClick={handlePrint}
              className="px-3.5 py-2 rounded-lg bg-white dark:bg-[#115e30] hover:bg-gray-100 dark:hover:bg-[#16703b] text-[#263238] dark:text-white text-xs font-semibold flex items-center gap-1.5 transition-all border border-[#E4E7EB] dark:border-[#1e8247]"
              title="Print document"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Print</span>
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#717171] dark:text-white hover:bg-gray-200 dark:hover:bg-[#115e30] transition-colors"
              title="Close Audit Report"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* FULL DETAIL AUDIT PRINT & CAPTURE ROOT */}
        <div 
          ref={reportRef}
          id="audit-print-root" 
          className="flex-1 overflow-y-auto p-6 sm:p-8 bg-white dark:bg-[#0b4d26] text-[#263238] dark:text-white space-y-6 print:p-0 print:space-y-4"
        >
          
          {/* 1. Header Banner & Aggregate ATS Score */}
          <div className="border-b border-[#E4E7EB] dark:border-[#1e8247] pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#E8F5E9] dark:bg-[#083d1c] border border-[#C8E6C9] dark:border-[#1e8247] text-[#2E7D32] dark:text-[#FFC72C] text-xs font-mono font-bold">
                <FileText className="w-3.5 h-3.5 text-[#4CAF4F] dark:text-[#FFC72C]" />
                OFFICIAL ATS COMPLIANCE AUDIT REPORT
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#263238] dark:text-white leading-tight">
                {candidateName}
              </h1>
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-xs sm:text-sm text-[#717171] dark:text-[#E8F5E9]">
                  Target Industry Role: <strong className="text-[#4CAF4F] dark:text-[#FFC72C]">{targetRole}</strong> • Evaluation Date: {new Date().toLocaleDateString()}
                </p>
                {isGeminiVerified ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700">
                    <Sparkles className="w-3 h-3" /> Gemini AI Verified
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-700">
                    <Brain className="w-3 h-3" /> NLP Synthesized
                  </span>
                )}
              </div>
            </div>

            <div className="text-left sm:text-right bg-[#F5F7FA] dark:bg-[#083d1c] p-4 rounded-xl border border-[#E4E7EB] dark:border-[#1e8247] shrink-0 shadow-xs">
              <div className="text-4xl font-black font-mono text-[#4CAF4F] dark:text-[#FFC72C] leading-none">
                {atsScore.percentage}%
              </div>
              <div className="text-xs text-[#717171] dark:text-[#E8F5E9] font-medium mt-1">Aggregate ATS Score</div>
              <div className="text-xs font-bold text-[#263238] dark:text-white mt-0.5">{atsScore.tier}</div>
            </div>
          </div>

          {/* 2. Candidate & Document Specs */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            {candidateEmail && (
              <div className="p-3 rounded-xl bg-[#F5F7FA] dark:bg-[#115e30] border border-[#E4E7EB] dark:border-[#1e8247]">
                <span className="text-[#89939E] dark:text-[#C8E6C9] block text-[10px] font-medium">Candidate Email</span>
                <span className="font-bold text-[#263238] dark:text-white text-xs truncate block mt-0.5">{candidateEmail}</span>
              </div>
            )}
            {candidatePhone && (
              <div className="p-3 rounded-xl bg-[#F5F7FA] dark:bg-[#115e30] border border-[#E4E7EB] dark:border-[#1e8247]">
                <span className="text-[#89939E] dark:text-[#C8E6C9] block text-[10px] font-medium">Contact Phone</span>
                <span className="font-bold text-[#263238] dark:text-white text-xs truncate block mt-0.5">{candidatePhone}</span>
              </div>
            )}
            <div className="p-3 rounded-xl bg-[#F5F7FA] dark:bg-[#115e30] border border-[#E4E7EB] dark:border-[#1e8247]">
              <span className="text-[#89939E] dark:text-[#C8E6C9] block text-[10px] font-medium">Target Role</span>
              <span className="font-bold text-[#4CAF4F] dark:text-[#FFC72C] text-xs truncate block mt-0.5">{targetRole}</span>
            </div>
            <div className="p-3 rounded-xl bg-[#F5F7FA] dark:bg-[#115e30] border border-[#E4E7EB] dark:border-[#1e8247]">
              <span className="text-[#89939E] dark:text-[#C8E6C9] block text-[10px] font-medium">Verification Status</span>
              <span className="font-bold text-[#4CAF4F] dark:text-[#FFC72C] flex items-center gap-1 text-xs mt-0.5">
                <CheckCircle2 className="w-3.5 h-3.5" /> NLP Verified
              </span>
            </div>
          </div>

          {/* 3. 4-Factor Explainable Scoring Breakdown */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-[#4D4D4D] dark:text-[#FFC72C] uppercase tracking-wider flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-[#4CAF4F] dark:text-[#FFC72C]" />
                <span>Multi-Factor ATS Compatibility Scoring</span>
              </h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-xl bg-[#F5F7FA] dark:bg-[#115e30] border border-[#E4E7EB] dark:border-[#1e8247] text-center space-y-1">
                <div className="flex items-center justify-center gap-1 text-[11px] text-[#717171] dark:text-[#C8E6C9] font-medium">
                  <span>Keyword Matching (30%)</span>
                </div>
                <span className="text-2xl font-black text-[#263238] dark:text-[#FFC72C] font-mono block leading-tight">{breakdown?.keywordMatch?.percentage || 0}%</span>
                <span className="text-[11px] text-[#717171] dark:text-white block">{breakdown?.keywordMatch?.matched?.length || 0} skills aligned</span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#F5F7FA] dark:bg-[#115e30] border border-[#E4E7EB] dark:border-[#1e8247] text-center space-y-1">
                <div className="flex items-center justify-center gap-1 text-[11px] text-[#717171] dark:text-[#C8E6C9] font-medium">
                  <span>Semantic Vector (35%)</span>
                </div>
                <span className="text-2xl font-black text-[#263238] dark:text-[#FFC72C] font-mono block leading-tight">{breakdown?.semanticSimilarity?.percentage || 0}%</span>
                <span className="text-[11px] text-[#717171] dark:text-white block">Cosine Relevance</span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#F5F7FA] dark:bg-[#115e30] border border-[#E4E7EB] dark:border-[#1e8247] text-center space-y-1">
                <div className="flex items-center justify-center gap-1 text-[11px] text-[#717171] dark:text-[#C8E6C9] font-medium">
                  <span>Section Structure (20%)</span>
                </div>
                <span className="text-2xl font-black text-[#263238] dark:text-[#FFC72C] font-mono block leading-tight">{breakdown?.sectionCompleteness?.percentage || 0}%</span>
                <span className="text-[11px] text-[#717171] dark:text-white block">Headers Validated</span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#F5F7FA] dark:bg-[#115e30] border border-[#E4E7EB] dark:border-[#1e8247] text-center space-y-1">
                <div className="flex items-center justify-center gap-1 text-[11px] text-[#717171] dark:text-[#C8E6C9] font-medium">
                  <span>Formatting Fidelity (15%)</span>
                </div>
                <span className="text-2xl font-black text-[#263238] dark:text-[#FFC72C] font-mono block leading-tight">{breakdown?.formattingReadability?.percentage || 0}%</span>
                <span className="text-[11px] text-[#717171] dark:text-white block">Quantifiable Impact</span>
              </div>
            </div>
          </div>

          {/* 4. Complete Skill Matrix & Gap Analysis */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            
            {/* Matched Skills */}
            <div className="p-4 rounded-xl bg-[#F5F7FA] dark:bg-[#115e30] border border-[#E4E7EB] dark:border-[#1e8247] space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#2E7D32] dark:text-white text-xs flex items-center gap-1.5 uppercase">
                  <CheckCircle2 className="w-4 h-4 text-[#4CAF4F] dark:text-[#FFC72C]" /> Verified Matched Skills ({skillGap?.matchedSkills?.length || 0}):
                </span>
                <span className="text-[11px] text-[#4CAF4F] dark:text-[#FFC72C] font-semibold">Matched</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {(skillGap?.matchedSkills || []).map((s, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded bg-[#E8F5E9] dark:bg-[#083d1c] text-[#2E7D32] dark:text-white font-mono text-[11px] border border-[#C8E6C9] dark:border-[#1e8247]">
                    ✓ {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Missing Gaps */}
            <div className="p-4 rounded-xl bg-[#F5F7FA] dark:bg-[#115e30] border border-[#E4E7EB] dark:border-[#1e8247] space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-red-600 dark:text-[#E63946] text-xs flex items-center gap-1.5 uppercase">
                  <XCircle className="w-4 h-4 text-red-500" /> Critical Target Skill Gaps ({skillGap?.missingSkills?.length || 0}):
                </span>
                <span className="text-[11px] text-red-600 dark:text-[#E63946] font-semibold">Missing</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {(skillGap?.missingSkills || []).length > 0 ? (
                  skillGap.missingSkills.map((s, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded bg-red-50 dark:bg-[#083d1c] text-red-700 dark:text-[#FFC72C] font-mono text-[11px] border border-red-200 dark:border-[#1e8247]">
                      + {s}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-[#2E7D32] dark:text-white italic">Zero missing skills. 100% target role keyword alignment!</span>
                )}
              </div>
            </div>

          </div>

          {/* 5. Executive AI Recruiter Verdict & Critique */}
          {geminiInsights && (
            <div className="p-4 sm:p-5 rounded-xl bg-[#F5F7FA] dark:bg-[#083d1c] border border-[#E4E7EB] dark:border-[#1e8247] space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="text-xs font-bold text-[#4D4D4D] dark:text-[#FFC72C] uppercase tracking-wide flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#4CAF4F] dark:text-[#FFC72C]" />
                  <span>Executive Recruiter Assessment & Hiring Verdict</span>
                </span>
                <div className="flex items-center gap-2">
                  {isGeminiVerified ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700">
                      <Sparkles className="w-3 h-3" /> {geminiInsights.source}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-700">
                      <Brain className="w-3 h-3" /> NLP Synthesized
                    </span>
                  )}
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#E8F5E9] dark:bg-[#FAB818] text-[#2E7D32] dark:text-[#083d1c]">
                    ★ {geminiInsights.recruiterHiringVerdict || 'Strong Contender'}
                  </span>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-[#263238] dark:text-white leading-relaxed">
                {geminiInsights.executiveCritique || 'Candidate profile demonstrates strong technical foundation with clear potential for the target engineering role.'}
              </p>

              {/* Strengths & Weaknesses */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {geminiInsights.keyStrengths && (
                  <div className="space-y-1 text-xs">
                    <span className="font-bold text-[#2E7D32] dark:text-[#FFC72C] block">Key Strengths:</span>
                    <ul className="space-y-1 text-[#4D4D4D] dark:text-white">
                      {geminiInsights.keyStrengths.slice(0, 2).map((st, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-[#4CAF4F] font-bold">✓</span>
                          <span>{st}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {geminiInsights.criticalWeaknesses && (
                  <div className="space-y-1 text-xs">
                    <span className="font-bold text-red-600 dark:text-[#E63946] block">Actionable Enhancements:</span>
                    <ul className="space-y-1 text-[#4D4D4D] dark:text-white">
                      {geminiInsights.criticalWeaknesses.slice(0, 2).map((cw, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-red-500 font-bold">!</span>
                          <span>{cw}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 6. AI Rewritten High-Impact Bullets (Google XYZ Formula) */}
          {geminiInsights?.rewrittenBulletPoints?.length > 0 && (
            <div className="space-y-2.5">
              <h3 className="text-xs font-bold text-[#4D4D4D] dark:text-white uppercase tracking-wide flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-[#4CAF4F] dark:text-[#FFC72C]" />
                <span>AI Rewritten High-Impact Bullet Points (Google XYZ Formula)</span>
              </h3>

              <div className="space-y-2 text-xs">
                {geminiInsights.rewrittenBulletPoints.slice(0, 2).map((item, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-[#F5F7FA] dark:bg-[#115e30] border border-[#E4E7EB] dark:border-[#1e8247] space-y-1.5">
                    <div className="text-[11px] text-red-600 dark:text-[#E63946]">
                      <span className="font-bold">Original:</span> "{item.original}"
                    </div>
                    <div className="text-[11px] font-bold text-[#2E7D32] dark:text-[#FFC72C]">
                      <span>Optimized:</span> "{item.optimized || item.improved}"
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}


          {/* 8. Top Recommended Career Trajectories */}
          {topRecs.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-[#4D4D4D] dark:text-white uppercase tracking-wide flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-[#4CAF4F] dark:text-[#FFC72C]" />
                <span>Top Matched Career Trajectories</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                {topRecs.slice(0, 3).map((rec, rIdx) => (
                  <div key={rIdx} className="p-2.5 rounded-xl bg-[#F5F7FA] dark:bg-[#115e30] border border-[#E4E7EB] dark:border-[#1e8247]">
                    <span className="font-bold text-[#263238] dark:text-white block truncate">{rec.title}</span>
                    <span className="text-[11px] text-[#4CAF4F] dark:text-[#FFC72C] font-semibold">{rec.matchPercentage || 80}% Trajectory Fit</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 9. Official Sign-off Footer */}
          <div className="pt-4 border-t border-[#E4E7EB] dark:border-[#1e8247] flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-[#89939E] dark:text-[#C8E6C9]">
            <span>Generated on {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
            <span className="font-mono text-[#4CAF4F] dark:text-[#FFC72C] font-semibold">Official ATS Audit Report • ATSInsight.ai</span>
          </div>

        </div>

        {/* Modal Bottom Action (Hidden on Print) */}
        <div className="no-print p-3 bg-[#F5F7FA] dark:bg-[#083d1c] border-t border-[#E4E7EB] dark:border-[#1e8247] flex justify-end gap-2 shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-white dark:bg-[#115e30] hover:bg-gray-100 dark:hover:bg-[#16703b] text-[#263238] dark:text-white text-xs font-semibold transition-colors border border-[#E4E7EB] dark:border-[#1e8247]"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
