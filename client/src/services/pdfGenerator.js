import jsPDF from 'jspdf';

/**
 * Generates a clean, professional A4 PDF report from resume analysis data.
 * Uses ONLY ASCII-safe characters — jsPDF built-in Helvetica only supports Latin-1.
 * No Unicode symbols, no emoji, no circled numbers.
 */
export async function downloadElementAsPdf(_element, fileName = 'ATS_Audit_Report.pdf', analysisResult = null) {
  if (analysisResult) {
    return generateStructuredPdf(analysisResult, fileName);
  }
  window.print();
}

export async function generateStructuredPdf(analysisResult, fileName = 'ATS_Audit_Report.pdf') {
  try {
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

    // ── Constants ─────────────────────────────────────────────────────────────
    const PW   = 210;           // page width mm
    const PH   = 297;           // page height mm
    const M    = 14;            // margin mm
    const CW   = PW - M * 2;   // content width
    const BOT  = PH - M - 8;   // bottom safe zone

    // ── Colours (RGB) ────────────────────────────────────────────────────────
    const GREEN      = [46, 125, 50];
    const GREEN_LIGHT= [76, 175, 80];
    const WHITE      = [255, 255, 255];
    const BLACK      = [25, 25, 25];
    const DARK_GREY  = [60, 60, 60];
    const MID_GREY   = [120, 120, 120];
    const LIGHT_GREY = [210, 210, 210];
    const BG_GREY    = [247, 248, 250];
    const RED        = [198, 40, 40];
    const AMBER      = [230, 120, 10];
    const GREEN_BG   = [232, 245, 233];
    const RED_BG     = [255, 235, 238];
    const AMBER_BG   = [255, 248, 225];

    // ── Data ─────────────────────────────────────────────────────────────────
    const {
      atsScore           = {},
      candidate          = {},
      targetJob          = {},
      skillGap           = {},
      geminiInsights     = null,
      feedback           = [],
      careerRecommendations = null
    } = analysisResult || {};

    const breakdown     = atsScore?.breakdown  || {};
    const name          = sanitize(candidate?.name)  || 'Candidate';
    const email         = sanitize(candidate?.email) || '';
    const phone         = sanitize(candidate?.phone) || '';
    const role          = sanitize(targetJob?.title)  || 'Software Engineer';
    const score         = atsScore?.percentage  ?? 0;
    const tier          = sanitize(atsScore?.tier)    || 'N/A';
    const matched       = skillGap?.matchedSkills  || [];
    const missing       = skillGap?.missingSkills  || [];
    const topRecs       = careerRecommendations?.top3 || careerRecommendations?.top5 || [];
    const verdict       = sanitize(geminiInsights?.recruiterHiringVerdict) || 'Strong Contender';
    const critique      = sanitize(geminiInsights?.executiveCritique)      || '';
    const strengths     = (geminiInsights?.keyStrengths      || []).map(sanitize);
    const weaknesses    = (geminiInsights?.criticalWeaknesses || []).map(sanitize);
    const bullets       = geminiInsights?.rewrittenBulletPoints || [];
    const highPriority  = feedback.filter(f => f.priority === 'HIGH').slice(0, 3);

    // ── State ─────────────────────────────────────────────────────────────────
    let y        = M;
    let pageNum  = 1;

    // ── Helpers ───────────────────────────────────────────────────────────────

    /** Strip non-Latin-1 characters so jsPDF doesn't render garbage */
    function sanitize(str) {
      if (typeof str !== 'string') return str;
      // Keep only printable Latin-1 range (0x20–0xFF), replace others with space
      return str.replace(/[^\x20-\xFF]/g, ' ').replace(/\s{2,}/g, ' ').trim();
    }

    /** Draw footer on current page */
    function drawFooter() {
      pdf.setDrawColor(...LIGHT_GREY);
      pdf.setLineWidth(0.3);
      pdf.line(M, PH - 14, PW - M, PH - 14);
      pdf.setFontSize(7);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(...MID_GREY);
      pdf.text('ATSInsight.ai', M, PH - 9);
      pdf.text('Official ATS Audit Report', PW / 2, PH - 9, { align: 'center' });
      pdf.text(`Page ${pageNum}`, PW - M, PH - 9, { align: 'right' });
      pageNum++;
    }

    /** Add new page if needed, auto-draw footer on current */
    function checkPage(needed = 10) {
      if (y + needed > BOT) {
        drawFooter();
        pdf.addPage();
        y = M;
      }
    }

    /** Filled rounded rectangle helper */
    function fillRect(x, ry, w, h, r, bg) {
      pdf.setFillColor(...bg);
      pdf.roundedRect(x, ry, w, h, r, r, 'F');
    }

    /** Stroked rounded rectangle helper */
    function strokeRect(x, ry, w, h, r, strokeClr, lw = 0.3) {
      pdf.setDrawColor(...strokeClr);
      pdf.setLineWidth(lw);
      pdf.roundedRect(x, ry, w, h, r, r, 'S');
    }

    /** Draw label + value line */
    function labelVal(label, val, lx, ly, lw = 60) {
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(...MID_GREY);
      pdf.text(label, lx, ly);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(...DARK_GREY);
      const lines = pdf.splitTextToSize(val, lw - 2);
      pdf.text(lines[0] || '', lx + pdf.getTextWidth(label) + 2, ly);
    }

    /** Wrapped text block, returns new Y after last line */
    function textBlock(text, tx, ty, maxW, size = 8, color = DARK_GREY, style = 'normal', lineH = 4.5) {
      if (!text) return ty;
      pdf.setFontSize(size);
      pdf.setFont('helvetica', style);
      pdf.setTextColor(...color);
      const lines = pdf.splitTextToSize(text, maxW);
      lines.forEach((ln, i) => {
        checkPage(lineH + 1);
        pdf.text(ln, tx, ty + i * lineH);
      });
      return ty + lines.length * lineH;
    }

    /** Numbered section header bar */
    function sectionHeader(num, title) {
      checkPage(14);
      y += 5;
      pdf.setFillColor(...GREEN_LIGHT);
      pdf.roundedRect(M, y, CW, 8, 1, 1, 'F');

      // number badge
      pdf.setFillColor(...GREEN);
      pdf.circle(M + 5, y + 4, 3.5, 'F');
      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(...WHITE);
      pdf.text(String(num), M + 5, y + 4 + 2.5, { align: 'center' });

      // title
      pdf.setFontSize(8.5);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(...WHITE);
      pdf.text(title.toUpperCase(), M + 11, y + 5.5);
      y += 12;
    }

    /** Chip tag */
    function chip(text, cx, cy, bg, textClr) {
      const w = Math.min(pdf.getTextWidth(text) + 5, 40);
      fillRect(cx, cy - 3.2, w, 5, 1, bg);
      pdf.setFontSize(7);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(...textClr);
      pdf.text(text.slice(0, 16), cx + 2.5, cy);
      return w;
    }

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // PAGE 1 HEADER
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    // Green header band
    pdf.setFillColor(...GREEN_LIGHT);
    pdf.rect(0, 0, PW, 42, 'F');

    // Report label
    pdf.setFontSize(7.5);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(...WHITE);
    pdf.text('OFFICIAL ATS COMPLIANCE AUDIT REPORT', M, 11);

    // Candidate name
    pdf.setFontSize(22);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(...WHITE);
    const safeName = name.length > 35 ? name.slice(0, 35) + '...' : name;
    pdf.text(safeName, M, 25);

    // Sub-line
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(220, 240, 220);
    const dateStr = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
    const subLine = `Target Role: ${role}   |   Generated: ${dateStr}`;
    pdf.text(subLine.slice(0, 80), M, 34);

    // Score badge (right side)
    const badgeX = PW - M - 36;
    pdf.setDrawColor(...WHITE);
    pdf.setLineWidth(0.6);
    pdf.roundedRect(badgeX, 6, 36, 30, 2, 2, 'S');

    const scoreColor = score >= 70 ? [46, 160, 50] : score >= 50 ? AMBER : RED;
    pdf.setFontSize(24);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(...WHITE);
    pdf.text(`${score}%`, badgeX + 18, 22, { align: 'center' });
    pdf.setFontSize(7);
    pdf.setFont('helvetica', 'normal');
    pdf.text('ATS SCORE', badgeX + 18, 28, { align: 'center' });
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'bold');
    pdf.text(tier, badgeX + 18, 33, { align: 'center' });

    y = 48;

    // ── Contact bar ──────────────────────────────────────────────────────────
    const contactParts = [];
    if (email) contactParts.push(`Email: ${email}`);
    if (phone) contactParts.push(`Phone: ${phone}`);
    contactParts.push(`Role: ${role}`);

    fillRect(M, y, CW, 9, 1, BG_GREY);
    pdf.setFontSize(7.5);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(...DARK_GREY);
    pdf.text(contactParts.join('   |   ').slice(0, 100), M + 3, y + 6);
    y += 13;

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // SECTION 1 — SCORING BREAKDOWN
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    sectionHeader(1, 'ATS Scoring Breakdown');

    const factors = [
      { label: 'Keyword Match',     weight: '30%', val: breakdown?.keywordMatch?.percentage       ?? 0, sub: `${matched.length} skills` },
      { label: 'Semantic Vector',   weight: '35%', val: breakdown?.semanticSimilarity?.percentage  ?? 0, sub: 'Cosine match' },
      { label: 'Section Structure', weight: '20%', val: breakdown?.sectionCompleteness?.percentage ?? 0, sub: 'Headers found' },
      { label: 'Formatting',        weight: '15%', val: breakdown?.formattingReadability?.percentage ?? 0, sub: 'Impact metrics' },
    ];

    const colW  = (CW - 9) / 4;
    const cardH = 24;
    factors.forEach((f, i) => {
      const bx = M + i * (colW + 3);
      const bcolor = f.val >= 70 ? GREEN_BG : f.val >= 50 ? AMBER_BG : RED_BG;
      const tcolor = f.val >= 70 ? GREEN  : f.val >= 50 ? AMBER  : RED;

      fillRect(bx, y, colW, cardH, 1.5, bcolor);
      strokeRect(bx, y, colW, cardH, 1.5, LIGHT_GREY);

      // percentage
      pdf.setFontSize(17);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(...tcolor);
      pdf.text(`${f.val}%`, bx + colW / 2, y + 10, { align: 'center' });

      // label
      pdf.setFontSize(6.5);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(...DARK_GREY);
      pdf.text(f.label, bx + colW / 2, y + 15, { align: 'center' });

      // weight + sub
      pdf.setFontSize(6);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(...MID_GREY);
      pdf.text(`(${f.weight})`, bx + colW / 2, y + 18.5, { align: 'center' });
      pdf.text(f.sub, bx + colW / 2, y + 22, { align: 'center' });
    });
    y += cardH + 6;

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // SECTION 2 — SKILL GAP
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    sectionHeader(2, 'Skill Match & Gap Analysis');

    const halfW = (CW - 4) / 2;

    // Compute card heights
    const matchRows = Math.max(1, Math.ceil(matched.length / 3));
    const missRows  = Math.max(1, Math.ceil(missing.length / 3));
    const matchH    = matchRows * 6 + 14;
    const missH     = missRows  * 6 + 14;
    const skillCardH = Math.max(matchH, missH);
    checkPage(skillCardH + 4);

    // Matched card
    fillRect(M, y, halfW, skillCardH, 1.5, GREEN_BG);
    strokeRect(M, y, halfW, skillCardH, 1.5, [180, 220, 180]);
    pdf.setFontSize(7.5);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(...GREEN);
    pdf.text(`MATCHED SKILLS (${matched.length})`, M + 3, y + 7);

    let sx = M + 3, sy = y + 12;
    matched.forEach(s => {
      const label = sanitize(s).slice(0, 14);
      const w = chip(label, sx, sy, [200, 235, 200], GREEN) + 2;
      sx += w;
      if (sx > M + halfW - 5) { sx = M + 3; sy += 6; }
    });

    // Missing card
    const mx = M + halfW + 4;
    fillRect(mx, y, halfW, skillCardH, 1.5, RED_BG);
    strokeRect(mx, y, halfW, skillCardH, 1.5, [240, 190, 190]);
    pdf.setFontSize(7.5);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(...RED);
    pdf.text(`SKILL GAPS (${missing.length})`, mx + 3, y + 7);

    if (missing.length === 0) {
      pdf.setFontSize(7);
      pdf.setFont('helvetica', 'italic');
      pdf.setTextColor(...GREEN);
      pdf.text('Perfect alignment!', mx + 3, y + 14);
    } else {
      let gx = mx + 3, gy = y + 12;
      missing.forEach(s => {
        const label = sanitize(s).slice(0, 14);
        const w = chip(label, gx, gy, [255, 205, 205], RED) + 2;
        gx += w;
        if (gx > mx + halfW - 5) { gx = mx + 3; gy += 6; }
      });
    }
    y += skillCardH + 6;

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // SECTION 3 — RECRUITER ASSESSMENT
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    if (geminiInsights) {
      sectionHeader(3, 'Executive Recruiter Assessment');

      // Verdict pill
      checkPage(10);
      fillRect(M, y, 70, 7, 1.5, GREEN_BG);
      strokeRect(M, y, 70, 7, 1.5, [180, 220, 180]);
      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(...GREEN);
      pdf.text(`Verdict: ${verdict}`, M + 3, y + 5);

      if (geminiInsights.source) {
        pdf.setFontSize(7);
        pdf.setFont('helvetica', 'italic');
        pdf.setTextColor(...MID_GREY);
        pdf.text(`Source: ${sanitize(geminiInsights.source)}`, M + 74, y + 5);
      }
      y += 11;

      // Critique box
      if (critique) {
        const critiqueLines = pdf.splitTextToSize(critique, CW - 6);
        const critiqueH = critiqueLines.length * 4.5 + 8;
        checkPage(critiqueH + 4);
        fillRect(M, y, CW, critiqueH, 1.5, BG_GREY);
        strokeRect(M, y, CW, critiqueH, 1.5, LIGHT_GREY);
        pdf.setFontSize(7.5);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(...DARK_GREY);
        pdf.text('Recruiter Critique:', M + 3, y + 5.5);
        pdf.setFont('helvetica', 'normal');
        critiqueLines.forEach((ln, i) => {
          pdf.text(ln, M + 3, y + 10 + i * 4.5);
        });
        y += critiqueH + 5;
      }

      // Strengths & Weaknesses 2-col
      if (strengths.length > 0 || weaknesses.length > 0) {
        const maxItems = Math.max(strengths.length, weaknesses.length);
        const swH = maxItems * 6 + 14;
        checkPage(swH + 4);

        // Strengths
        fillRect(M, y, halfW, swH, 1.5, GREEN_BG);
        strokeRect(M, y, halfW, swH, 1.5, [180, 220, 180]);
        pdf.setFontSize(7.5);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(...GREEN);
        pdf.text('KEY STRENGTHS', M + 3, y + 7);
        strengths.slice(0, 4).forEach((s, i) => {
          const ls = pdf.splitTextToSize(`+ ${s}`, halfW - 6);
          pdf.setFontSize(7);
          pdf.setFont('helvetica', 'normal');
          pdf.setTextColor(...DARK_GREY);
          ls.slice(0, 2).forEach((l, li) => pdf.text(l, M + 3, y + 12 + i * 6 + li * 4));
        });

        // Weaknesses
        fillRect(mx, y, halfW, swH, 1.5, RED_BG);
        strokeRect(mx, y, halfW, swH, 1.5, [240, 190, 190]);
        pdf.setFontSize(7.5);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(...RED);
        pdf.text('AREAS TO IMPROVE', mx + 3, y + 7);
        weaknesses.slice(0, 4).forEach((w, i) => {
          const lw = pdf.splitTextToSize(`- ${w}`, halfW - 6);
          pdf.setFontSize(7);
          pdf.setFont('helvetica', 'normal');
          pdf.setTextColor(...DARK_GREY);
          lw.slice(0, 2).forEach((l, li) => pdf.text(l, mx + 3, y + 12 + i * 6 + li * 4));
        });

        y += swH + 6;
      }
    }

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // SECTION 4 — BULLET REWRITES
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    if (bullets.length > 0) {
      sectionHeader(4, 'AI-Rewritten Bullet Points (Google XYZ Formula)');

      bullets.slice(0, 2).forEach(item => {
        const orig = sanitize(item.original || '');
        const opt  = sanitize(item.optimized || item.improved || '');

        const origLines = pdf.splitTextToSize(`Original:  "${orig}"`, CW - 8);
        const optLines  = pdf.splitTextToSize(`Optimized: "${opt}"`, CW - 8);
        const bH = (origLines.length + optLines.length) * 4.2 + 12;
        checkPage(bH + 4);

        fillRect(M, y, CW, bH, 1.5, BG_GREY);
        strokeRect(M, y, CW, bH, 1.5, LIGHT_GREY);

        // Original label
        pdf.setFontSize(7);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(...RED);
        pdf.text('ORIGINAL  (before):', M + 3, y + 5.5);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(...MID_GREY);
        origLines.forEach((l, i) => pdf.text(l, M + 3, y + 9.5 + i * 4.2));

        const optY = y + 9.5 + origLines.length * 4.2 + 2;
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(...GREEN);
        pdf.text('OPTIMIZED (after):', M + 3, optY);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(...DARK_GREY);
        optLines.forEach((l, i) => pdf.text(l, M + 3, optY + 4 + i * 4.2));

        y += bH + 4;
      });
    }

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // SECTION 5 — PRIORITY FEEDBACK
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    if (highPriority.length > 0) {
      sectionHeader(5, 'Priority Optimization Recommendations');

      highPriority.forEach(item => {
        const title = sanitize(item.title || '');
        const desc  = sanitize(item.description || '');
        const impact= sanitize(item.impact || '');

        const tLines = pdf.splitTextToSize(title, CW - 42);
        const dLines = pdf.splitTextToSize(desc,  CW - 8);
        const fH = tLines.length * 4.5 + dLines.length * 4 + 14;
        checkPage(fH + 4);

        fillRect(M, y, CW, fH, 1.5, AMBER_BG);
        strokeRect(M, y, CW, fH, 1.5, [230, 180, 100]);

        // Priority badge
        fillRect(M + 3, y + 3, 30, 5.5, 1, AMBER_BG);
        pdf.setFontSize(7);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(...AMBER);
        pdf.text('[HIGH PRIORITY]', M + 3, y + 7.5);

        if (impact) {
          pdf.setFontSize(7);
          pdf.setFont('helvetica', 'bold');
          pdf.setTextColor(...GREEN);
          pdf.text(impact.slice(0, 40), PW - M - 3, y + 7.5, { align: 'right' });
        }

        pdf.setFontSize(8);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(...BLACK);
        const titleY = y + 12;
        tLines.forEach((l, i) => pdf.text(l, M + 3, titleY + i * 4.5));

        const descY = titleY + tLines.length * 4.5;
        pdf.setFontSize(7);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(...DARK_GREY);
        dLines.forEach((l, i) => pdf.text(l, M + 3, descY + i * 4));

        y += fH + 4;
      });
    }

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // SECTION 6 — CAREER TRAJECTORIES
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    if (topRecs.length > 0) {
      sectionHeader(6, 'Top Matched Career Trajectories');

      const recCount = Math.min(topRecs.length, 3);
      const recW = (CW - (recCount - 1) * 3) / recCount;
      const recH = 22;
      checkPage(recH + 4);

      topRecs.slice(0, 3).forEach((rec, i) => {
        const rx  = M + i * (recW + 3);
        const pct = rec.matchPercentage || rec.overallMatch || 75;
        const bc  = pct >= 70 ? GREEN_LIGHT : pct >= 50 ? AMBER : RED;

        fillRect(rx, y, recW, recH, 1.5, BG_GREY);
        strokeRect(rx, y, recW, recH, 1.5, LIGHT_GREY);

        const tl = pdf.splitTextToSize(sanitize(rec.title || 'Career Role'), recW - 4);
        pdf.setFontSize(7.5);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(...BLACK);
        tl.slice(0, 2).forEach((l, li) => pdf.text(l, rx + 3, y + 5.5 + li * 4));

        pdf.setFontSize(8.5);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(...bc);
        pdf.text(`${pct}% Fit`, rx + 3, y + recH - 5);

        // progress bar
        pdf.setFillColor(...LIGHT_GREY);
        pdf.roundedRect(rx + 3, y + recH - 3.5, recW - 6, 1.5, 0.5, 0.5, 'F');
        pdf.setFillColor(...bc);
        pdf.roundedRect(rx + 3, y + recH - 3.5, (recW - 6) * pct / 100, 1.5, 0.5, 0.5, 'F');
      });

      y += recH + 6;
    }

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // FOOTER on last page
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    drawFooter();

    pdf.save(fileName);
    return true;
  } catch (error) {
    console.error('PDF generation error:', error);
    throw error;
  }
}
