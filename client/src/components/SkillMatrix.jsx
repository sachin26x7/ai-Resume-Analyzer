import { useState } from 'react';
import { CheckCircle2, XCircle, Tag, Sparkles } from 'lucide-react';

export default function SkillMatrix({ analysisResult }) {
  if (!analysisResult) return null;

  const [activeCategoryFilter, setActiveCategoryFilter] = useState('ALL');

  const { extractedSkills = [], skillGap = {} } = analysisResult;
  const matchedSkills = skillGap.matchedSkills || [];
  const missingSkills = skillGap.missingSkills || [];

  // Categorize extracted skills
  const categories = ['ALL', 'Languages', 'Frontend', 'Backend', 'Databases', 'Cloud & DevOps', 'AI & Data Science', 'Tools'];

  // Filter skills
  const filteredExtracted = extractedSkills.filter(skill => {
    if (activeCategoryFilter === 'ALL') return true;
    return skill.category?.toLowerCase().includes(activeCategoryFilter.toLowerCase());
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div className="bg-[#115e30] p-6 rounded-2xl space-y-6 border border-[#1e8247] shadow-xl">

        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1e8247] pb-4">
          <div>
            <h3 className="text-base font-black text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#FFC72C]" />
              <span>Semantic Skill Matrix & Gap Analysis</span>
            </h3>
            <p className="text-xs text-[#E8F5E9] mt-0.5 font-normal">
              Identifies technical competencies extracted via NLP Named Entity Recognition mapped against standardized ontology.
            </p>
          </div>

          {/* Quick Summary Counts */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="px-3 py-1 rounded-lg bg-[#083d1c] text-[#FFC72C] border border-[#1e8247] font-bold flex items-center gap-1">
              <span>✓</span> {matchedSkills.length} Matched
            </span>
            <span className="px-3 py-1 rounded-lg bg-[#E63946] text-white font-bold flex items-center gap-1">
              <span>✗</span> {missingSkills.length} Missing Gaps
            </span>
            <span className="px-3 py-1 rounded-lg bg-[#083d1c] text-white border border-[#1e8247] font-bold flex items-center gap-1">
              <span className="text-[#FFC72C]">★</span> {extractedSkills.length} Total Extracted
            </span>
          </div>
        </div>

        {/* 2-Column Matrix */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* COLUMN 1: MATCHED TARGET SKILLS */}
          <div className="space-y-3 bg-[#083d1c] p-4 rounded-2xl border border-[#1e8247]">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black text-[#FFC72C] flex items-center gap-1.5 uppercase tracking-wide">
                <CheckCircle2 className="w-4 h-4 text-[#FFC72C]" />
                <span>Matched Target Skills</span>
              </h4>
              <span className="text-[11px] text-[#E8F5E9]">{matchedSkills.length} found</span>
            </div>

            {matchedSkills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {matchedSkills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-lg text-xs font-bold bg-[#115e30] text-white border border-[#1e8247] flex items-center gap-1.5 shadow"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#FFC72C]" />
                    <span>{skill}</span>
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[#E8F5E9] italic">No direct keyword overlap detected with target requirements.</p>
            )}
          </div>

          {/* COLUMN 2: MISSING SKILL GAPS */}
          <div className="space-y-3 bg-[#083d1c] p-4 rounded-2xl border border-[#1e8247]">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black text-[#FFC72C] flex items-center gap-1.5 uppercase tracking-wide">
                <XCircle className="w-4 h-4 text-[#E63946]" />
                <span>Missing Skill Gaps</span>
              </h4>
              <span className="text-[11px] text-[#E63946] font-black">{missingSkills.length} missing</span>
            </div>

            {missingSkills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {missingSkills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-lg text-xs font-bold bg-[#115e30] text-white border border-[#1e8247] flex items-center gap-1.5 shadow"
                  >
                    <XCircle className="w-3.5 h-3.5 text-[#E63946]" />
                    <span>{skill}</span>
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs text-white font-bold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-[#FFC72C]" /> 100% Target Skill Alignment! Zero missing gaps.
              </p>
            )}
          </div>

        </div>

        {/* ALL DETECTED RESUME COMPETENCIES */}
        <div className="space-y-3 pt-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h4 className="text-xs font-bold text-white uppercase tracking-wide flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-[#FFC72C]" />
              <span>Full Extracted Profile Skills</span>
            </h4>

            {/* Category Filter Buttons */}
            <div className="flex flex-wrap gap-1">
              {categories.map((cat, i) => (
                <button
                  key={i}
                  onClick={() => setActiveCategoryFilter(cat)}
                  className={`px-3 py-1 rounded-lg text-[10px] font-black transition-all ${activeCategoryFilter === cat
                      ? 'bg-[#FAB818] text-[#083d1c] shadow'
                      : 'bg-[#083d1c] text-white hover:text-[#FFC72C] border border-[#1e8247]'
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5 p-3.5 rounded-2xl bg-[#083d1c] border border-[#1e8247] max-h-40 overflow-y-auto">
            {filteredExtracted.length > 0 ? (
              filteredExtracted.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg text-xs font-mono bg-[#115e30] text-white border border-[#1e8247] shadow-sm"
                >
                  {skill.name}
                  {skill.category && (
                    <span className="ml-1.5 text-[10px] text-[#FFC72C]">
                      ({skill.category})
                    </span>
                  )}
                </span>
              ))
            ) : (
              <p className="text-xs text-[#E8F5E9] italic">No skills in this category.</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
