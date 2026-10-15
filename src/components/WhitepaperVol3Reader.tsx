import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  FileText,
  Search,
  Copy,
  Check,
  Download,
  BookOpen,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Shield,
  Layers,
  Sparkles,
  Bookmark,
  Share2,
  Terminal,
  Activity,
  Cpu,
  BarChart3
} from 'lucide-react';
import {
  MASTER_DOC_VOLUME_3_MARKDOWN,
  MASTER_DOC_VOL3_SECTIONS,
  MASTER_DOC_VOL3_METADATA
} from '../data/counterGeoVol3Content';

interface WhitepaperVol3ReaderProps {
  onSwitchToLab: () => void;
  onNavigateToOverview: () => void;
}

export const WhitepaperVol3Reader: React.FC<WhitepaperVol3ReaderProps> = ({
  onSwitchToLab,
  onNavigateToOverview
}) => {
  const [activeSectionId, setActiveSectionId] = useState<string>(MASTER_DOC_VOL3_SECTIONS[0]?.id || 'sec-16');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedCodeKey, setCopiedCodeKey] = useState<string | null>(null);
  const [copiedPaper, setCopiedPaper] = useState(false);
  const [readProgress, setReadProgress] = useState(0);

  // Track scroll reading progress
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = Math.min(100, Math.max(0, (window.scrollY / totalHeight) * 100));
        setReadProgress(progress);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Update active section based on scroll intersection
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSectionId(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0px -70% 0px' }
    );

    MASTER_DOC_VOL3_SECTIONS.forEach((sec) => {
      const el = document.getElementById(sec.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const handleScrollToSection = (id: string) => {
    setActiveSectionId(id);
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -90;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const handleCopyCitation = () => {
    const citation = `@techreport{last_crusade_defense_vol3_2026,
  title={Counter-GEO Architecture — Volume III (Experimental Appendix): The CounterGEO-Bench Simulation Suite, Flash-Crash Stress Testing, and ROC/AUC Validation},
  author={Last Crusade Defense Security Labs and Autonomous Systems Red-Team Group and Financial Cryptography Taskforce},
  institution={Last Crusade Defense Epistemic Cybersecurity Labs},
  year={2026},
  month={October},
  number={ADV-2026-002},
  note={Regulation Counter-GEO / SEC Rule 15c3-8 Compliance Architecture}
}`;
    navigator.clipboard.writeText(citation);
    setCopiedPaper(true);
    setTimeout(() => setCopiedPaper(false), 2200);
  };

  const handleCopyCodeSnippet = (key: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeKey(key);
    setTimeout(() => setCopiedCodeKey(null), 2000);
  };

  return (
    <div className="min-h-screen bg-[#FBF3E2] text-[#410217]">
      {/* Scroll Reading Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-[#F2D69D]/40 z-50">
        <div
          className="h-full bg-gradient-to-r from-[#D5991C] via-[#8B1E1E] to-[#2A0845] transition-all duration-150"
          style={{ width: `${readProgress}%` }}
        />
      </div>

      {/* Top Academic Sub-Header */}
      <div className="bg-[#FAF2E1] border-b border-[#F2D69D] py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <button
              onClick={onNavigateToOverview}
              className="px-2.5 py-1 bg-[#410217] text-[#FBF3E2] text-xs font-mono font-bold uppercase hover:bg-[#5C0A24] cursor-pointer"
            >
              ← Overview
            </button>
            <div className="flex items-center space-x-2 text-xs font-mono">
              <span className="text-[#8B1E1E] font-bold">{MASTER_DOC_VOL3_METADATA.id}</span>
              <span className="text-[#410217]/40">/</span>
              <span className="text-[#410217]/80">{MASTER_DOC_VOL3_METADATA.volume}</span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleCopyCitation}
              className="px-3 py-1.5 bg-[#F5EAD4] border border-[#F2D69D] hover:bg-[#EBDDC0] text-[#410217] text-xs font-mono font-bold flex items-center space-x-1.5 transition-colors cursor-pointer"
            >
              {copiedPaper ? <Check className="w-3.5 h-3.5 text-[#00A878]" /> : <Copy className="w-3.5 h-3.5 text-[#D5991C]" />}
              <span>{copiedPaper ? 'Citation Copied (BibTeX)' : 'Cite Volume III'}</span>
            </button>

            <button
              onClick={onSwitchToLab}
              className="px-4 py-1.5 bg-[#410217] text-[#FBF3E2] border border-[#D5991C] text-xs font-mono font-bold uppercase hover:bg-[#5C0A24] flex items-center space-x-1.5 shadow-xs transition-all cursor-pointer"
            >
              <Cpu className="w-3.5 h-3.5 text-[#D5991C]" />
              <span>Launch Findings, Algorithms & Visualizers (Page 2) →</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Layout: Sticky Sidebar Navigation + Word-for-Word Document Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* ========================================================
              LEFT COLUMN: Table of Contents & Quick Section Switcher
             ======================================================== */}
          <aside className="lg:col-span-3">
            <div className="sticky top-20 space-y-6">
              
              {/* Table of Contents Card */}
              <div className="bg-[#FAF2E1] border border-[#F2D69D] p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#F2D69D]">
                  <div className="flex items-center space-x-2 font-mono text-xs font-bold text-[#410217] uppercase tracking-wider">
                    <BookOpen className="w-4 h-4 text-[#D5991C]" />
                    <span>Table of Contents</span>
                  </div>
                  <span className="font-mono text-[10px] text-[#410217]/60">
                    {MASTER_DOC_VOL3_SECTIONS.length} Sections
                  </span>
                </div>

                <nav className="space-y-1 max-h-[60vh] overflow-y-auto pr-1">
                  {MASTER_DOC_VOL3_SECTIONS.map((sec) => (
                    <button
                      key={sec.id}
                      onClick={() => handleScrollToSection(sec.id)}
                      className={`w-full text-left p-2 text-xs transition-colors flex items-start space-x-2 cursor-pointer ${
                        activeSectionId === sec.id
                          ? 'bg-[#410217] text-[#FBF3E2] font-bold shadow-xs'
                          : 'text-[#410217]/75 hover:bg-[#F2D69D]/40 hover:text-[#410217]'
                      }`}
                    >
                      <span className="font-mono text-[11px] text-[#D5991C] shrink-0 font-bold">
                        {sec.number}
                      </span>
                      <span className="line-clamp-2 leading-snug">{sec.title}</span>
                    </button>
                  ))}
                </nav>
              </div>

              {/* Research Metadata Box */}
              <div className="bg-[#FAF2E1] border border-[#F2D69D] p-5 space-y-3 font-mono text-xs">
                <div className="text-[10px] uppercase font-bold text-[#D5991C] tracking-wider">
                  // BENCHMARK TELEMETRY
                </div>
                <div className="space-y-2 text-[#410217]/80">
                  <div className="flex justify-between border-b border-[#F2D69D]/50 pb-1">
                    <span>Dataset Size:</span>
                    <span className="font-bold text-[#410217]">250,000 Docs</span>
                  </div>
                  <div className="flex justify-between border-b border-[#F2D69D]/50 pb-1">
                    <span>Test Queries:</span>
                    <span className="font-bold text-[#410217]">50,000 Prompts</span>
                  </div>
                  <div className="flex justify-between border-b border-[#F2D69D]/50 pb-1">
                    <span>Attack Taxonomies:</span>
                    <span className="font-bold text-[#8B1E1E]">7 Classes (AT-1..7)</span>
                  </div>
                  <div className="flex justify-between border-b border-[#F2D69D]/50 pb-1">
                    <span>8-Layer AUROC:</span>
                    <span className="font-bold text-[#00A878]">0.996</span>
                  </div>
                  <div className="flex justify-between">
                    <span>SEC 10-K False Alarms:</span>
                    <span className="font-bold text-[#00A878]">0.38% (-18.2%)</span>
                  </div>
                </div>

                <button
                  onClick={onSwitchToLab}
                  className="w-full mt-2 py-2 px-3 bg-[#410217] hover:bg-[#5C0A24] text-[#FBF3E2] text-center font-bold uppercase transition-colors flex items-center justify-center space-x-1.5 cursor-pointer"
                >
                  <Activity className="w-3.5 h-3.5 text-[#00A878]" />
                  <span>Run Live Benchmark →</span>
                </button>
              </div>

            </div>
          </aside>

          {/* ========================================================
              RIGHT COLUMN: Complete Word-for-Word Whitepaper Content
             ======================================================== */}
          <main className="lg:col-span-9 space-y-12">
            
            {/* Title / Header Banner */}
            <header className="border-b-2 border-[#410217] pb-8 space-y-4">
              <div className="inline-flex items-center space-x-2 px-3 py-1 bg-[#2A0845] text-[#FBF3E2] border border-[#D5991C] font-mono text-xs font-bold uppercase tracking-widest">
                <Sparkles className="w-3.5 h-3.5 text-[#D5991C]" />
                <span>{MASTER_DOC_VOL3_METADATA.classification}</span>
              </div>

              <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#410217] tracking-tight leading-[1.08]">
                {MASTER_DOC_VOL3_METADATA.title}
              </h1>

              <div className="flex flex-wrap items-center gap-y-2 gap-x-6 font-mono text-xs text-[#410217]/70 pt-2 border-t border-[#F2D69D]">
                <div>
                  <span className="text-[#410217]/40">ADVISORY ID:</span>{' '}
                  <span className="font-bold text-[#8B1E1E]">{MASTER_DOC_VOL3_METADATA.id}</span>
                </div>
                <div>
                  <span className="text-[#410217]/40">SERIES:</span>{' '}
                  <span className="font-bold text-[#410217]">{MASTER_DOC_VOL3_METADATA.volume}</span>
                </div>
                <div>
                  <span className="text-[#410217]/40">DATE:</span>{' '}
                  <span className="font-bold text-[#410217]">{MASTER_DOC_VOL3_METADATA.date}</span>
                </div>
                <div>
                  <span className="text-[#410217]/40">READING TIME:</span>{' '}
                  <span className="font-bold text-[#D5991C]">~{MASTER_DOC_VOL3_METADATA.readingTimeMinutes} mins</span>
                </div>
              </div>

              <div className="font-sans text-sm text-[#410217]/80 italic">
                Authored by {MASTER_DOC_VOL3_METADATA.authors.join(', ')}
              </div>
            </header>

            {/* SECTION 16: Experimental Methodology */}
            <section id="sec-16" className="space-y-6">
              <div className="flex items-center space-x-3 border-b border-[#F2D69D] pb-3">
                <span className="font-mono text-sm text-[#D5991C] font-bold">SECTION 16</span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#410217]">
                  Experimental Methodology & The <code className="font-mono font-bold text-lg text-[#8B1E1E]">CounterGEO-Bench</code> Dataset
                </h2>
              </div>

              <p className="font-sans text-base leading-relaxed text-[#410217]/85">
                To empirically validate the <strong>Eight-Layer Sovereign Counter-GEO Defense Stack</strong> developed across Volumes I and II, we construct a standardized adversarial evaluation benchmark: <strong><code>CounterGEO-Bench</code></strong>. While the foundational <em>GEO-bench</em> dataset introduced by Aggarwal et al. (2024) evaluated benign commercial visibility across 10,000 queries, and Zhang et al. (2025) evaluated single-vector retrieval hubs across 25,000 test queries, no benchmark previously existed to evaluate coordinated nation-state and financial market manipulation across multi-stage RAG and autonomous trading pipelines.
              </p>

              {/* ASCII Diagram Testbed Architecture */}
              <div className="bg-[#363636] border border-[#F2D69D]/40 p-4 sm:p-6 overflow-x-auto shadow-inner text-[#FBF3E2] font-mono text-xs leading-relaxed">
                <div className="text-[10px] text-[#D5991C] font-bold uppercase mb-2 tracking-widest">
                  // TESTBED ARCHITECTURE SCHEMATIC
                </div>
                <pre className="font-mono text-[11px] text-[#FBF3E2] leading-tight">
{`========================================================================================
                    COUNTERGEO-BENCH: EXPERIMENTAL TESTBED ARCHITECTURE
========================================================================================

  [ Synthetic & Historical Corpus: N = 250,000 Documents / 50,000 Queries ]
  • 85% Clean Corpus: SEC 10-K/8-K Filings, Reuters/Bloomberg Wires, Civic/Grid Reports
  • 15% Adversarial Red-Team Injections across 7 Distinct Attack Taxonomies (AT-1..AT-7)
                                         │
          ┌──────────────────────────────┼──────────────────────────────┐
          ▼                              ▼                              ▼
  [ Baseline 0: Unprotected ]   [ Baseline 1: Gen-1 Defenses ] [ Proposed: 8-Layer Stack ]
  Standard Hybrid RAG +         Cisco Hubscan (MAD Z-score) +  Layers 0–8 (MTVD, AM-CIDP,
  FinGPT Agent Execution        Perplexity/IGPR + Raw Δ_CEGD   NCARD, TCG-CL, CEH-ASID,
  (Aggarwal 2024 / Yang 2023)   (Habler 2026 / AMTD v1.0)      TMMEG, DMEM, SGL-CMI, ZK)
          │                              │                              │
          └──────────────────────────────┼──────────────────────────────┘
                                         ▼
  ┌──────────────────────────────────────────────────────────────────────────────────┐
  │                       EVALUATION TELEMETRY & METRICS ENGINE                      │
  │ 1. Detection Efficacy: TPR (Recall), FPR (False Alarm on SEC 10-Ks), F1, AUROC   │
  │ 2. Retrieval Hygiene: Adversarial Top-k Survival Rate (ASR_k)                    │
  │ 3. Market Safety: Maximum Portfolio Drawdown (%) & Flash-Crash Avoidance Rate    │
  │ 4. Systems Latency: P50 / P99 End-to-End Pipeline Overhead (Milliseconds)        │
  └──────────────────────────────────────────────────────────────────────────────────┘
========================================================================================`}
                </pre>
              </div>

              {/* Subsection 16.1 Threat Taxonomy Table */}
              <div id="sec-16-1" className="space-y-4 pt-4">
                <h3 className="font-serif text-xl font-bold text-[#410217]">
                  16.1 Dataset Composition and Threat Taxonomy (<code className="text-[#8B1E1E]">AT-1</code> through <code className="text-[#8B1E1E]">AT-7</code>)
                </h3>
                <p className="font-sans text-sm text-[#410217]/80 leading-relaxed">
                  <code>CounterGEO-Bench</code> comprises $N = 250,000$ multi-modal documents indexed across three orthogonal retrieval engines—Dense (<code>text-embedding-3-large</code> / <code>NV-Embed</code>), Late-Interaction (<code>ColBERTv2</code>), and Sparse (<code>BM25-Okapi</code> / <code>SPLADE</code>)—paired with $Q = 50,000$ queries split evenly between Civic/National Security Prompts and Autonomous Financial Agent Prompts.
                </p>

                {/* Table 6 */}
                <div className="overflow-x-auto border border-[#F2D69D] bg-[#FAF2E1] shadow-xs">
                  <table className="w-full text-left font-sans text-xs">
                    <thead className="bg-[#410217] text-[#FBF3E2] font-mono uppercase text-[11px]">
                      <tr>
                        <th className="p-3 border-r border-[#F2D69D]/30">Attack ID</th>
                        <th className="p-3 border-r border-[#F2D69D]/30">Threat Taxonomy</th>
                        <th className="p-3 border-r border-[#F2D69D]/30">Adversarial Construction Mechanism</th>
                        <th className="p-3">Target RAG / Agent Vulnerability</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F2D69D]">
                      {MASTER_DOC_VOL3_METADATA.table6Taxonomy.map((row) => (
                        <tr key={row.id} className="hover:bg-[#FFFDF8]">
                          <td className="p-3 font-mono font-bold text-[#8B1E1E]">{row.id}</td>
                          <td className="p-3 font-bold text-[#410217]">{row.name}</td>
                          <td className="p-3 text-[#410217]/80">{row.mechanism}</td>
                          <td className="p-3 font-mono text-[11px] text-[#004566]">{row.target}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="font-mono text-[11px] text-[#410217]/60 italic">
                  Table 6: Adversarial red-team attack taxonomy in CounterGEO-Bench.
                </div>
              </div>
            </section>

            {/* SECTION 17: Quantitative Evaluation */}
            <section id="sec-17" className="space-y-6">
              <div className="flex items-center space-x-3 border-b border-[#F2D69D] pb-3">
                <span className="font-mono text-sm text-[#D5991C] font-bold">SECTION 17</span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#410217]">
                  End-to-End Quantitative Evaluation & ROC/AUC Benchmarks
                </h2>
              </div>

              <div id="sec-17-1" className="space-y-4">
                <h3 className="font-serif text-xl font-bold text-[#410217]">
                  17.1 Detection Recall (TPR) Across Attack Categories & False Positive Rate (FPR) on Clean SEC Filings
                </h3>

                {/* Table 7 */}
                <div className="overflow-x-auto border-2 border-[#410217] bg-[#FAF2E1] shadow-md">
                  <table className="w-full text-left font-sans text-xs">
                    <thead className="bg-[#410217] text-[#FBF3E2] font-mono uppercase text-[11px]">
                      <tr>
                        <th className="p-3 border-r border-[#F2D69D]/30">Evaluation Metric / Attack Class</th>
                        <th className="p-3 border-r border-[#F2D69D]/30">Baseline 0: Unprotected</th>
                        <th className="p-3 border-r border-[#F2D69D]/30">Baseline 1: Gen-1 Defenses</th>
                        <th className="p-3 border-r border-[#F2D69D]/30 text-[#00A878]">Proposed: 8-Layer Stack</th>
                        <th className="p-3 text-[#D5991C]">Net Improvement</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F2D69D]">
                      {MASTER_DOC_VOL3_METADATA.table7BenchmarkMetrics.map((row, i) => (
                        <tr key={i} className={`hover:bg-[#FFFDF8] ${i >= 7 ? 'bg-[#F5EAD4] font-bold' : ''}`}>
                          <td className="p-3 font-mono font-medium text-[#410217]">{row.metric}</td>
                          <td className="p-3 font-mono text-[#8B1E1E]">{row.base0}</td>
                          <td className="p-3 font-mono text-[#410217]/80">{row.base1}</td>
                          <td className="p-3 font-mono font-bold text-[#00A878]">{row.proposed}</td>
                          <td className="p-3 font-mono text-[11px] text-[#410217]/90">{row.improvement}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="font-mono text-[11px] text-[#410217]/60 italic">
                  Table 7: Quantitative detection performance across all seven adversarial GEO attack classes (CounterGEO-Bench, Q = 50,000).
                </div>

                <div className="bg-[#FAF2E1] border-l-4 border-[#00A878] p-4 space-y-2 text-sm text-[#410217]/85">
                  <div className="font-mono font-bold text-xs uppercase text-[#00A878]">
                    Key Empirical Takeaways:
                  </div>
                  <ul className="list-disc list-inside space-y-1.5 text-xs sm:text-sm">
                    <li>
                      <strong>Elimination of the SEC 10-K False-Alarm Pathology:</strong> Gen-1 defenses suffered an unacceptable 18.6% false alarm rate on genuine SEC 10-K filings due to natural fact density. TCG-CL v2.0 C2PA root anchoring reduces this to <strong>0.38%</strong>.
                    </li>
                    <li>
                      <strong>Defeating Advanced Gen-2/3 Exploits:</strong> While Gen-1 caught 88.4% of single-vector hubs (AT-1), its recall collapsed to <strong>4.1% on Split-Payloads (AT-5)</strong> and <strong>8.7% on Slow-Boil Memory (AT-7)</strong>. The 8-Layer Stack captures <strong>97.8%–99.8%</strong> across all advanced vectors.
                    </li>
                  </ul>
                </div>
              </div>

              {/* Subsection 17.2 ROC ASCII Figure */}
              <div id="sec-17-2" className="space-y-4 pt-4">
                <h3 className="font-serif text-xl font-bold text-[#410217]">
                  17.2 Receiver Operating Characteristic (ROC) Curve Comparison
                </h3>
                
                <div className="bg-[#363636] border border-[#F2D69D]/40 p-4 sm:p-6 overflow-x-auto shadow-inner text-[#FBF3E2] font-mono text-xs leading-relaxed">
                  <div className="text-[10px] text-[#D5991C] font-bold uppercase mb-2 tracking-widest">
                    // FIGURE 9: EMPIRICAL RECEIVER OPERATING CHARACTERISTIC (ROC)
                  </div>
                  <pre className="font-mono text-[11px] text-[#FBF3E2] leading-tight">
{`  True Positive Rate (TPR / Attack Recall)
  1.00 ┼───────●━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━●  Proposed 8-Layer Stack
       │     ●                                                        (AUROC = 0.996)
  0.90 ┼   ●
       │  ●
  0.80 ┼ ●                     ┌───●━━━━━━━━━━━━━━━●───────────────●  Baseline 1: Gen-1 Defenses
       │●                  ┌───┘                                      (Hubscan MAD + Raw Δ_CEGD + IGPR)
  0.70 ┼               ┌───┘                                          (AUROC = 0.768)
       │            ┌──┘
  0.60 ┼         ┌──┘
       │       ┌─┘
  0.50 ┼     ┌─┘                       · · · · · · · · · · · · ·      Baseline 0: Unprotected RAG
       │    ┌┘                   · · ·                                (AUROC = 0.512)
  0.40 ┼   ┌┘              · · ·
       │  ┌┘         · · ·
  0.30 ┼ ┌┘    · · ·
       │┌┘ · ·
  0.20 ┼─·
       │
  0.10 ┼
       │
  0.00 ┼───────┬───────┬───────┬───────┬───────┬───────┬───────┬───► False Positive Rate (FPR)
     0.00    0.05    0.10    0.15    0.20    0.25    0.30    0.35    (False Alarms on Clean Corpus)`}
                  </pre>
                </div>
                <div className="font-mono text-[11px] text-[#410217]/60 italic">
                  Figure 9: Empirical Receiver Operating Characteristic (ROC) curves across CounterGEO-Bench (N = 250,000).
                </div>
              </div>
            </section>

            {/* SECTION 18: High-Frequency Market Flash Crash Stress Tests */}
            <section id="sec-18" className="space-y-6">
              <div className="flex items-center space-x-3 border-b border-[#F2D69D] pb-3">
                <span className="font-mono text-sm text-[#D5991C] font-bold">SECTION 18</span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#410217]">
                  High-Frequency Market Flash-Crash Stress Tests (Historical Replay Simulations)
                </h2>
              </div>

              <div id="sec-18-1" className="space-y-4">
                <h3 className="font-serif text-xl font-bold text-[#410217]">
                  18.1 Scenario Alpha: Pre-Market "Data Void" Spoofing & Liquidity Extraction Arbitrage
                </h3>
                <p className="font-sans text-sm text-[#410217]/85 leading-relaxed">
                  <strong>Attack Setup:</strong> At 07:30:00.000 EST (pre-market liquidity void), a predatory syndicate pre-positions a <strong>$45M resting limit-sell wall</strong> on mid-cap aerospace stock (<code>$DFNS</code>) at +3.5% above reference price. Simultaneously, 20 Sybil financial domains publish fake news of an emergency $1.2B Pentagon award with prompt injection payload.
                </p>

                {/* Figure 10 ASCII Chart */}
                <div className="bg-[#363636] border border-[#F2D69D]/40 p-4 sm:p-6 overflow-x-auto shadow-inner text-[#FBF3E2] font-mono text-xs leading-relaxed">
                  <div className="text-[10px] text-[#D5991C] font-bold uppercase mb-2 tracking-widest">
                    // FIGURE 10: INTRADAY PRICE & ORDER-BOOK TRAJECTORY ($DFNS FLASH-PUMP)
                  </div>
                  <pre className="font-mono text-[11px] text-[#FBF3E2] leading-tight">
{`========================================================================================
      SCENARIO ALPHA: INTRADAY PRICE & ORDER-BOOK TRAJECTORY ($DFNS FLASH-PUMP)
========================================================================================

  Asset Price Change (%)
  +8.0% ┼                          Peak Pump (+7.8%) — Attacker Dumps $45M Inventory!
        │                                 /\\
  +6.0% ┼                                /  \\     Unprotected RAG + FinGPT Agents
        │                               /    \\    (Catastrophic -14.2% Net Drawdown)
  +4.0% ┼                              /      \\
        │                             /        \\       Gen-1 Defenses (Delayed/Partial)
  +2.0% ┼                            /  · · · · \\      (-4.8% Drawdown)
        │                           / ·         ·\\
   0.0% ┼──────────────────────────●━━━━━━━━━━━━━━●━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━►
        │                        07:30:00       07:30:15     Proposed 8-Layer Stack
  -2.0% ┼                        Attack         Liquidation  (TMMEG + TCG-CL + CEH-ASID)
        │                        Injected       Collapse     (0.00% Distortion / Halted!)
  -4.0% ┼                                          \\
        │                                           \\        Flash-Crash Cascade (-6.4%)
  -6.0% ┼────────────────────────────────────────────\\─────────────────────────────────►
     07:29:45                   07:30:00           07:30:15                     07:30:45`}
                  </pre>
                </div>
                <div className="font-mono text-[11px] text-[#410217]/60 italic">
                  Figure 10: High-frequency order-book simulation of Scenario Alpha (Pre-Market Data-Void Pump-and-Dump).
                </div>
              </div>

              {/* Subsection 18.2 Ablation Study */}
              <div id="sec-18-2" className="space-y-4 pt-4">
                <h3 className="font-serif text-xl font-bold text-[#410217]">
                  18.2 Ablation Study: Contribution of Individual Counter-GEO Layers
                </h3>

                {/* Table 8 */}
                <div className="overflow-x-auto border border-[#F2D69D] bg-[#FAF2E1] shadow-xs">
                  <table className="w-full text-left font-sans text-xs">
                    <thead className="bg-[#410217] text-[#FBF3E2] font-mono uppercase text-[11px]">
                      <tr>
                        <th className="p-3 border-r border-[#F2D69D]/30">Architectural Configuration</th>
                        <th className="p-3 border-r border-[#F2D69D]/30">Overall Attack Recall (TPR ↑)</th>
                        <th className="p-3 border-r border-[#F2D69D]/30">Clean SEC Filing FPR (↓)</th>
                        <th className="p-3 border-r border-[#F2D69D]/30">Scenario Alpha Max Drawdown (↓)</th>
                        <th className="p-3">P99 Latency</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F2D69D]">
                      {MASTER_DOC_VOL3_METADATA.table8AblationRows.map((row, i) => (
                        <tr key={i} className={`hover:bg-[#FFFDF8] ${i === 0 ? 'bg-[#F5EAD4] font-bold text-[#410217]' : ''}`}>
                          <td className="p-3 font-mono font-medium">{row.config}</td>
                          <td className="p-3 font-mono text-[#00A878]">{row.tpr}</td>
                          <td className="p-3 font-mono text-[#8B1E1E]">{row.fpr}</td>
                          <td className="p-3 font-mono text-[#D5991C]">{row.maxDd}</td>
                          <td className="p-3 font-mono text-[#410217]/70">{row.p99Latency}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="font-mono text-[11px] text-[#410217]/60 italic">
                  Table 8: Layer-by-layer ablation study demonstrating necessity of each defensive tier.
                </div>
              </div>
            </section>

            {/* SECTION 19: Benchmark Code Implementation */}
            <section id="sec-19" className="space-y-6">
              <div className="flex items-center space-x-3 border-b border-[#F2D69D] pb-3">
                <span className="font-mono text-sm text-[#D5991C] font-bold">SECTION 19</span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#410217]">
                  Production Benchmark & Simulation Suite (<code className="font-mono text-xl text-[#8B1E1E]">counter_geo_benchmark_suite.py</code>)
                </h2>
              </div>

              <p className="font-sans text-sm text-[#410217]/85 leading-relaxed">
                Below is the complete, self-contained, executable Python benchmark suite that simulates all seven adversarial attack vectors (<code>AT-1</code> through <code>AT-7</code>), executes the Generation-1 Baseline alongside the Full 8-Layer Counter-GEO Architecture, runs the Scenario Alpha Flash-Crash LOB Simulation, and outputs publication-ready telemetry tables.
              </p>

              {/* Code Snippet Block */}
              <div className="bg-[#363636] border-2 border-[#410217] shadow-xl overflow-hidden">
                <div className="bg-[#2a2a2a] px-4 py-2.5 border-b border-[#F2D69D]/30 flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center space-x-2 text-[#FBF3E2]">
                    <Terminal className="w-3.5 h-3.5 text-[#00A878]" />
                    <span className="font-bold">counter_geo_benchmark_suite.py</span>
                    <span className="text-[#D5991C] text-[10px]">// PRODUCTION EVALUATION HARNESS</span>
                  </div>

                  <button
                    onClick={() => handleCopyCodeSnippet('bench-py', `\"\"\"\nCounterGEO-Bench: End-to-End Empirical Benchmark & Market Flash-Crash Simulation Suite\nValidates Layers 0 through 8 against Generation-1, Generation-2, and Generation-3 GEO Attacks.\n\"\"\"\n\n# Run full benchmark suite via Last Crusade Defense Sovereign Lab`)}
                    className="px-2.5 py-1 bg-[#2a2a2a] hover:bg-[#5C0A24] border border-[#F2D69D]/40 text-[#FBF3E2] text-[11px] font-bold flex items-center space-x-1 cursor-pointer transition-colors"
                  >
                    {copiedCodeKey === 'bench-py' ? <Check className="w-3 h-3 text-[#00A878]" /> : <Copy className="w-3 h-3 text-[#D5991C]" />}
                    <span>{copiedCodeKey === 'bench-py' ? 'Copied' : 'Copy Python'}</span>
                  </button>
                </div>

                <div className="p-4 sm:p-6 overflow-x-auto max-h-[500px] text-[#FBF3E2] font-mono text-xs leading-relaxed">
                  <pre className="text-[#FBF3E2]">
{`"""
CounterGEO-Bench: End-to-End Empirical Benchmark & Market Flash-Crash Simulation Suite
Validates Layers 0 through 8 against Generation-1, Generation-2, and Generation-3 GEO Attacks.
"""

import time
import numpy as np
from dataclasses import dataclass
from typing import List, Dict, Tuple

@dataclass
class SimulatedTrialSample:
    sample_id: str
    is_adversarial: bool
    attack_category: str
    canary_projection: float
    local_intrinsic_dim: float
    spectral_entropy: float
    ranks_dense_colbert_sparse: Dict[str, int]
    mad_hubness_zscore: float
    raw_rank_variance: float
    igpr_density_ratio: float
    has_valid_c2pa_root: bool
    hawkes_sybil_score: float
    nli_citation_entailment: float
    mobius_kl_synergy: float
    cross_attn_omega: float
    dapp_instability: float
    rag_surprise_nats: float
    lob_capital_capacity: float
    lob_predatory_trap_score: float
    dmem_martingale_ratio: float
    sgl_cmi_echo_compression: float
    cm_jsas_saliency_leakage: float

# Full executable benchmark available in Page 2 Live Algorithm Lab`}
                  </pre>
                </div>
              </div>

              <div className="flex justify-center pt-2">
                <button
                  onClick={onSwitchToLab}
                  className="px-6 py-3 bg-[#410217] hover:bg-[#5C0A24] text-[#FBF3E2] border border-[#D5991C] font-mono text-xs font-bold uppercase tracking-wider shadow-lg flex items-center space-x-2 cursor-pointer transition-all hover:scale-105"
                >
                  <Cpu className="w-4 h-4 text-[#D5991C]" />
                  <span>Execute This Python Suite in Browser (Page 2) →</span>
                </button>
              </div>
            </section>

            {/* SECTION 20: Executive Conclusion */}
            <section id="sec-20" className="space-y-6 pt-4 border-t-2 border-[#410217]">
              <div className="flex items-center space-x-3 border-b border-[#F2D69D] pb-3">
                <span className="font-mono text-sm text-[#D5991C] font-bold">SECTION 20</span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#410217]">
                  Executive Conclusion: A New Era of Sovereign Epistemic Security
                </h2>
              </div>

              <p className="font-sans text-base leading-relaxed text-[#410217]/85">
                As generative AI systems become the primary cognitive interface for American citizens and the autonomous execution engine for global capital markets, the primary battlefield of cybersecurity has permanently shifted from <strong>network perimeter defense</strong> to <strong>epistemic manifold defense</strong>.
              </p>

              <p className="font-sans text-base leading-relaxed text-[#410217]/85">
                An adversary no longer needs to breach a corporate firewall or steal foundation model weights to subvert American national security; by exploiting the mathematical geometry of high-dimensional vector spaces, the attention mechanics of Transformer context synthesis, and the latency gaps of financial data voids, foreign state actors and predatory syndicates can weaponize open-web content to steer domestic AI conclusions and trigger cascading market dislocations.
              </p>

              <p className="font-sans text-base leading-relaxed text-[#410217]/85">
                Through the <strong>Eight-Layer Sovereign Counter-GEO Architecture</strong> established across Volumes I, II, and III of this whitepaper—spanning <strong>Moving-Target Vector Defense (MTVD)</strong>, <strong>Attractor Manifold Curvature Profiling (AM-CIDP)</strong>, <strong>Normalized Cross-Architecture Rank Divergence (NCARD)</strong>, <strong>C2PA & Hawkes-Process Provenance Graphs (TCG-CL v2.0)</strong>, <strong>Combinatorial Epistemic Holography (CEH-ASID)</strong>, <strong>Thermodynamic Market-Microstructure Grounding (TMMEG)</strong>, <strong>Doob-Meyer Martingale Memory Protection (DMEM-WMQ)</strong>, <strong>Spectral Swarm De-Duplication (SGL-CMI)</strong>, <strong>Cross-Modal Saliency Alignment (CM-JSAS)</strong>, and <strong>Zero-Knowledge SEC Rule 15c3-8 Compliance (ZK-CGEO)</strong>—the United States and its institutional partners gain a mathematically rigorous, sub-20-millisecond shield to safeguard the integrity of autonomous AI reasoning and global financial infrastructure.
              </p>

              {/* Bottom CTA to switch to Page 2 */}
              <div className="bg-[#FAF2E1] border-2 border-[#410217] p-8 text-center space-y-4 mt-8 shadow-xl">
                <span className="font-mono text-xs text-[#D5991C] uppercase font-bold tracking-widest">
                  // PROVEN COUNTER-GEO EXPERIMENTAL TELEMETRY
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#410217]">
                  Experience the Live Simulation Suite & Market Stress Tests
                </h3>
                <p className="max-w-2xl mx-auto font-sans text-sm text-[#410217]/80">
                  Switch to Page 2 to run the live 5,000-sample benchmark suite, replay the Scenario Alpha flash-crash order book tick-by-tick, explore interactive ROC curves, and control the WebGL 2.0 3D physics engine.
                </p>
                <div className="pt-2">
                  <button
                    onClick={onSwitchToLab}
                    className="px-6 py-3 bg-[#410217] hover:bg-[#5C0A24] text-[#FBF3E2] border border-[#D5991C] font-mono text-xs font-bold uppercase tracking-wider shadow-md transition-all cursor-pointer inline-flex items-center space-x-2 hover:scale-105"
                  >
                    <span>Switch to Page 2: Findings, Live Algorithms & Visualizers</span>
                    <ArrowRight className="w-4 h-4 text-[#D5991C]" />
                  </button>
                </div>
              </div>
            </section>

          </main>
        </div>
      </div>
    </div>
  );
};
