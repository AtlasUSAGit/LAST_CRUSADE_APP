import React, { useState } from 'react';
import {
  FileText,
  Sparkles,
  ArrowRight,
  Copy,
  Check,
  Shield,
  BookOpen,
  Compass,
} from 'lucide-react';
import { NavigationPage } from '../types';
import { MASTER_DOC_METADATA } from '../data/counterGeoPaperContent';
import { MASTER_DOC_VOL2_METADATA } from '../data/counterGeoVol2Content';
import { MASTER_DOC_VOL3_METADATA } from '../data/counterGeoVol3Content';
import { MASTER_DOC_VOL4_METADATA } from '../data/counterGeoVol4Content';
import { MASTER_DOC_VOL5_METADATA } from './CounterGeoVol5Page';

interface ResearchPageProps {
  onNavigate: (page: NavigationPage, subPage?: 'paper' | 'lab') => void;
  onOpenAudit?: () => void;
  onOpenIncident?: () => void;
}

export const ResearchPage: React.FC<ResearchPageProps> = ({
  onNavigate,
  onOpenAudit,
}) => {
  const [copiedBibtex, setCopiedBibtex] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'vol1' | 'vol2' | 'vol3' | 'vol4' | 'vol5'>('all');
  const [expandedLayer, setExpandedLayer] = useState<number | null>(null);

  const bibtexString = `@techreport{last_crusade_aeo_series_2026,
  title={Answer Engine Optimization (AEO) and Counter-AEO Defenses: Architectures for AI Search, Financial Markets, and Autonomous Agents (Volumes I-V)},
  author={Last Crusade Research},
  institution={Last Crusade AEO Defense Working Paper Series},
  year={2026},
  note={5-Volume Monograph Series (232 Pages Total)}
}`;

  const handleCopyBibtex = () => {
    navigator.clipboard.writeText(bibtexString);
    setCopiedBibtex(true);
    setTimeout(() => setCopiedBibtex(false), 2000);
  };

  const defenseMatrix = [
    {
      layer: 'Layer 0',
      vol: 'Vol. I',
      volKey: 'counter-geo' as NavigationPage,
      name: 'Moving-Target Map Rotation',
      threat: 'Attackers probing AI search databases to plant "master key" trap pages',
      core: 'Periodically rotates internal map coordinates and sets tripwire alarms',
      latency: '< 0.4 ms',
      status: 'Active',
    },
    {
      layer: 'Layer 1',
      vol: 'Vol. I',
      volKey: 'counter-geo' as NavigationPage,
      name: 'Gravity Sinkhole Detector',
      threat: 'A single rigged webpage pulling in thousands of unrelated AI searches',
      core: 'Spots unnatural clustering in search results and quarantines the trap page',
      latency: '1.8 ms',
      status: 'Active',
    },
    {
      layer: 'Layer 2',
      vol: 'Vol. I',
      volKey: 'counter-geo' as NavigationPage,
      name: '3-Way Search Cross-Check',
      threat: 'Fake "expert" articles stuffed with made-up percentages and quotes',
      core: 'Compares how a page ranks across meaning, phrasing, and exact keywords',
      latency: '4.2 ms',
      status: 'Active',
    },
    {
      layer: 'Layer 3',
      vol: 'Vol. I',
      volKey: 'counter-geo' as NavigationPage,
      name: 'Source Lineage & Seal Check',
      threat: 'Coordinated blog networks quoting each other in a circle to fake consensus',
      core: 'Requires digital authenticity seals (C2PA) and traces claims to original roots',
      latency: '6.5 ms',
      status: 'Active',
    },
    {
      layer: 'Layer 4A',
      vol: 'Vol. I',
      volKey: 'counter-geo' as NavigationPage,
      name: 'Multi-Document Logic Firewall',
      threat: 'Three innocent-looking websites designed to combine into a false panic',
      core: 'Monitors how separate pages interact inside the AI and blocks toxic combinations',
      latency: '5.1 ms',
      status: 'Active',
    },
    {
      layer: 'Layer 4B',
      vol: 'Vol. I',
      volKey: 'counter-geo' as NavigationPage,
      name: 'Market Order-Book Reality Check',
      threat: 'Planted early-morning rumors tricking trading bots into buying overpriced stock',
      core: 'Checks whether urgent web news is backed by real trading volume and order depth',
      latency: '< 0.2 ms',
      status: 'Active',
    },
    {
      layer: 'Layer 5',
      vol: 'Vol. II',
      volKey: 'counter-geo-vol2' as NavigationPage,
      name: 'Long-Term Memory Drift Guard',
      threat: 'Tiny daily nudges slowly brainwashing an AI agent’s memory over weeks',
      core: 'Detects unnatural one-way memory drift and rewinds to the last clean backup',
      latency: '0.9 ms',
      status: 'Active',
    },
    {
      layer: 'Layer 6',
      vol: 'Vol. II',
      volKey: 'counter-geo-vol2' as NavigationPage,
      name: 'Bot Echo-Chamber De-Duplicator',
      threat: 'Dozens of AI bots copying the same rumor until it looks like widespread agreement',
      core: 'Measures shared information across bots and collapses copycat votes to one',
      latency: '1.1 ms',
      status: 'Active',
    },
    {
      layer: 'Layer 7',
      vol: 'Vol. II',
      volKey: 'counter-geo-vol2' as NavigationPage,
      name: 'PDF & Chart Visual Scrubber',
      threat: 'Secret commands hidden in white-on-white text or tiny PDF chart pixels',
      core: 'Ensures the AI only reads visible ink on the page and scrubs blank backgrounds',
      latency: '8.4 ms',
      status: 'Active',
    },
    {
      layer: 'Layer 8',
      vol: 'Vol. II',
      volKey: 'counter-geo-vol2' as NavigationPage,
      name: 'Zero-Knowledge Safety Proof',
      threat: 'Proving AI safety compliance to auditors without leaking proprietary trade secrets',
      core: 'Generates a compact 288-byte mathematical seal proving all filters ran cleanly',
      latency: '1.4 ms',
      status: 'Active',
    },
    {
      layer: 'Layer 9',
      vol: 'Vol. III',
      volKey: 'counter-geo-vol3' as NavigationPage,
      name: 'Sanctions & Ownership De-Cloaking',
      threat: 'Shell companies hiding sanctioned owners behind layered offshore entities',
      core: 'Maps nested ownership trees in hyperbolic space and evicts duplicate chaff',
      latency: '3.2 ms',
      status: 'Active',
    },
    {
      layer: 'Layer 10',
      vol: 'Vol. III',
      volKey: 'counter-geo-vol3' as NavigationPage,
      name: 'Physical Supply & Cargo Verification',
      threat: 'Fake trade prices and forged shortage alerts sent to factory purchasing AI',
      core: 'Checks claims against electricity input floors and satellite ship draft data',
      latency: '4.8 ms',
      status: 'Active',
    },
    {
      layer: 'Layer 11',
      vol: 'Vol. III',
      volKey: 'counter-geo-vol3' as NavigationPage,
      name: 'Cross-Venue Contagion Shield',
      threat: 'Correlated rumors sweeping dozens of shared AI trading models at once',
      core: 'Dampens correlated model bursts and verifies independent price discovery',
      latency: '1.9 ms',
      status: 'Active',
    },
    {
      layer: 'Layer 12',
      vol: 'Vol. IV',
      volKey: 'counter-geo-vol4' as NavigationPage,
      name: '142ns Hardware Circuit Breaker',
      threat: 'High-speed automated trading sweeps triggered by spoofed financial feeds',
      core: 'Hardware network card design that pauses unbacked orders in 142 nanoseconds',
      latency: '142.0 ns',
      status: 'Active',
    },
    {
      layer: 'Layer 13',
      vol: 'Vol. V',
      volKey: 'counter-geo-vol5' as NavigationPage,
      name: 'Flat 1-Layer Tool Profile & Handshake',
      threat: 'Legitimate AI tools being skipped by autonomous orchestrators due to nested schemas',
      core: 'Flattens JSON schemas cleanly and attaches compact verified bid receipts',
      latency: '< 0.3 ms',
      status: 'Active',
    },
    {
      layer: 'Layer 14',
      vol: 'Vol. V',
      volKey: 'counter-geo-vol5' as NavigationPage,
      name: 'Sealed Agent Envelopes & Shuffle Check',
      threat: 'Untrusted sub-agent records hijacking downstream AI tools (Boundary Laundering)',
      core: 'Isolates untrusted values in opaque references and audits list-order fairness',
      latency: '0.8 ms',
      status: 'Active',
    },
    {
      layer: 'Layer 15',
      vol: 'Vol. V',
      volKey: 'counter-geo-vol5' as NavigationPage,
      name: 'Adaptive Traffic & Spending Firewall',
      threat: 'Router disguises redirecting autonomous workflows or bypassing x402 payment caps',
      core: 'Continuously tests router defenses against disguised prompts and checks MANDATE rules',
      latency: '1.6 ms',
      status: 'Active',
    },
    {
      layer: 'Layer 16',
      vol: 'Vol. V',
      volKey: 'counter-geo-vol5' as NavigationPage,
      name: 'Verified Signal Allocation & Market Gate',
      threat: 'Fake high-confidence signal bots luring buy-side algorithms into illiquid traps',
      core: 'Confirms honest proofs (+42.55% lift) and blocks trades when order-book impact spikes',
      latency: '0.5 ms',
      status: 'Active',
    },
  ];

  return (
    <div className="relative z-10 min-h-screen bg-transparent text-[#410217] selection:bg-[#410217]/15 selection:text-[#410217]">
      {/* Hero Header: Research Library */}
      <section className="relative pt-12 pb-14 md:pt-16 md:pb-18 border-b border-[#F2D69D] bg-transparent overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#410217_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.03] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl">
            <div className="w-12 h-1 bg-[#D5991C] rounded-full mb-5" />
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-[#410217] leading-[1.08] mb-5">
              Research Library
            </h1>

            <p className="text-base sm:text-lg text-[#410217]/85 font-sans leading-relaxed mb-8 max-w-3xl">
              As AI chatbots and autonomous software agents replace classical search engines, digital visibility has shifted to <strong>Answer Engine Optimization (AEO)</strong>. Explore our five-volume research series examining how AI engines select answers, how bad actors try to manipulate them, and the engineering frameworks we designed to protect AI search, financial markets, and multi-agent networks.
            </p>

            {/* Clear Overview Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-4 border-t border-[#F2D69D]/80 text-xs">
              <div className="p-3.5 rounded-xl bg-[#FAF2E1] border border-[#F2D69D]">
                <div className="text-[11px] text-[#410217]/70 font-medium">Research Series</div>
                <div className="text-xl font-serif font-bold text-[#410217] mt-0.5">5 Volumes</div>
                <div className="text-[11px] text-[#D5991C] font-medium mt-0.5">232 Pages Total</div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#FAF2E1] border border-[#F2D69D]">
                <div className="text-[11px] text-[#410217]/70 font-medium">Defense Architecture</div>
                <div className="text-xl font-serif font-bold text-[#410217] mt-0.5">16 Layers + 8 CI</div>
                <div className="text-[11px] text-[#00A878] font-medium mt-0.5">Search to A2A</div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#FAF2E1] border border-[#F2D69D]">
                <div className="text-[11px] text-[#410217]/70 font-medium">Agent Tool Selection</div>
                <div className="text-xl font-serif font-bold text-[#410217] mt-0.5">79% – 96%</div>
                <div className="text-[11px] text-[#410217]/70 mt-0.5">Schema Optimization</div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#FAF2E1] border border-[#F2D69D]">
                <div className="text-[11px] text-[#410217]/70 font-medium">Benchmark Accuracy</div>
                <div className="text-xl font-serif font-bold text-[#00A878] mt-0.5">99.6%</div>
                <div className="text-[11px] text-[#410217]/70 mt-0.5">Lab Stress-Tests</div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#FAF2E1] border border-[#F2D69D]">
                <div className="text-[11px] text-[#410217]/70 font-medium">10-K False Alarms</div>
                <div className="text-xl font-serif font-bold text-[#00A878] mt-0.5">0.38%</div>
                <div className="text-[11px] text-[#410217]/70 mt-0.5">Down from 18.6%</div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#FAF2E1] border border-[#F2D69D]">
                <div className="text-[11px] text-[#410217]/70 font-medium">Interactive Labs</div>
                <div className="text-xl font-serif font-bold text-[#410217] mt-0.5">5 Labs</div>
                <div className="text-[11px] text-[#D5991C] font-medium mt-0.5">Live 3D &amp; Code</div>
              </div>
            </div>
          </div>

          {/* Interactive Visual Map of the 5 Research Volumes */}
          <div className="mt-10 rounded-2xl bg-[#410217] text-[#FBF3E2] p-6 sm:p-8 border border-[#D5991C]/50 shadow-xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-5">
              <div>
                <h2 className="font-serif text-2xl text-[#FBF3E2]">
                  Visual Map of the 5-Volume Research Series
                </h2>
                <p className="text-xs text-[#FBF3E2]/75 mt-0.5">
                  Click any volume in the diagram below to filter or jump straight to its full whitepaper and interactive lab.
                </p>
              </div>
              <button
                onClick={() => setActiveTab('all')}
                className="self-start md:self-auto px-3.5 py-1.5 rounded-lg bg-[#D5991C] text-[#130108] text-xs font-semibold cursor-pointer"
              >
                Show All 5 Volumes
              </button>
            </div>

            <svg viewBox="0 0 960 120" className="w-full h-auto overflow-visible">
              {[
                { key: 'vol1' as const, x: 10, vol: 'Volume I', title: 'Core Search Defense', sub: '54 Pages · Layers 0–4B', color: '#D5991C' },
                { key: 'vol2' as const, x: 202, vol: 'Volume II', title: 'Memory, PDFs & Privacy', sub: '42 Pages · Layers 5–8', color: '#00A878' },
                { key: 'vol3' as const, x: 394, vol: 'Volume III', title: '250k Doc Stress-Tests', sub: '38 Pages · Benchmarks', color: '#A78BFA' },
                { key: 'vol4' as const, x: 586, vol: 'Volume IV', title: '142ns Hardware & ROI', sub: '46 Pages · FPGA & Enterprise', color: '#F59E0B' },
                { key: 'vol5' as const, x: 778, vol: 'Volume V', title: 'Agent-to-Agent (A2A)', sub: '52 Pages · Autonomous Tools', color: '#38BDF8' },
              ].map((node, i) => {
                const isSelected = activeTab === node.key;
                return (
                  <g
                    key={node.key}
                    onClick={() => setActiveTab(node.key)}
                    className="cursor-pointer"
                  >
                    {i < 4 && (
                      <>
                        <line
                          x1={node.x + 172}
                          y1="60"
                          x2={node.x + 192}
                          y2="60"
                          stroke="#F2D69D"
                          strokeOpacity="0.4"
                          strokeWidth="2"
                        />
                        <circle r="3.5" fill={node.color}>
                          <animate
                            attributeName="cx"
                            from={node.x + 172}
                            to={node.x + 192}
                            dur="1.4s"
                            repeatCount="indefinite"
                          />
                          <animate attributeName="cy" values="60;60" dur="1.4s" repeatCount="indefinite" />
                        </circle>
                      </>
                    )}
                    <rect
                      x={node.x}
                      y="12"
                      width="172"
                      height="96"
                      rx="12"
                      fill={isSelected ? '#5C0A24' : '#2B010F'}
                      stroke={node.color}
                      strokeWidth={isSelected ? '2.5' : '1.5'}
                    />
                    <text x={node.x + 86} y="38" textAnchor="middle" fill={node.color} fontSize="13" fontWeight="700">
                      {node.vol}
                    </text>
                    <text x={node.x + 86} y="62" textAnchor="middle" fill="#FBF3E2" fontSize="11.5" fontWeight="600">
                      {node.title}
                    </text>
                    <text x={node.x + 86} y="84" textAnchor="middle" fill="#FBF3E2" fillOpacity="0.7" fontSize="10">
                      {node.sub}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>
      </section>

      {/* Filter & Jump Bar */}
      <div className="border-b border-[#F2D69D] bg-[#FBF3E2] py-4 px-4 sm:px-6 lg:px-8 sticky top-20 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center space-x-2">
            <span className="text-[#410217]/70 font-semibold">Filter Volume:</span>
            <div className="flex items-center bg-[#FAF2E1] border border-[#F2D69D] rounded-lg p-1 flex-wrap gap-1">
              {[
                { id: 'all' as const, label: 'All 5 Volumes' },
                { id: 'vol1' as const, label: 'Volume I' },
                { id: 'vol2' as const, label: 'Volume II' },
                { id: 'vol3' as const, label: 'Volume III' },
                { id: 'vol4' as const, label: 'Volume IV' },
                { id: 'vol5' as const, label: 'Volume V (A2A)' },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={`px-3 py-1.5 rounded-md font-semibold transition-colors cursor-pointer ${
                    activeTab === t.id
                      ? 'bg-[#410217] text-[#FBF3E2]'
                      : 'text-[#410217]/75 hover:text-[#410217]'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-3 text-[#410217]/80 font-medium">
            <a href="#defense-matrix" className="hover:text-[#410217] underline decoration-[#D5991C]">
              12-Layer Defense Summary ↓
            </a>
            <span>•</span>
            <a href="#citations" className="hover:text-[#410217] underline decoration-[#D5991C]">
              Citation Info ↓
            </a>
          </div>
        </div>
      </div>

      {/* The 5 Master Volumes Showcase Cards */}
      <section className="py-12 md:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* VOLUME 1 SHOWCASE CARD */}
        {(activeTab === 'all' || activeTab === 'vol1') && (
          <article className="rounded-2xl bg-[#FAF2E1] border-2 border-[#D5991C]/80 shadow-lg p-6 sm:p-10 relative overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-5 border-b border-[#F2D69D] text-xs">
              <div className="flex items-center space-x-2.5">
                <span className="px-3 py-1 rounded-full bg-[#410217] text-[#FBF3E2] font-bold">
                  Volume I · Foundational Architecture
                </span>
                <span className="text-[#410217]/75 font-medium">{MASTER_DOC_METADATA.date}</span>
              </div>
              <div className="flex items-center space-x-2 text-[#410217]/80 font-medium">
                <span>{MASTER_DOC_METADATA.pages} Pages</span>
                <span>•</span>
                <span>{MASTER_DOC_METADATA.wordCount.toLocaleString()} Words</span>
                <span>•</span>
                <span className="text-[#00A878] font-bold">Defense Layers 0 – 4B</span>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#410217] font-normal tracking-tight leading-tight mb-3">
                {MASTER_DOC_METADATA.title}
              </h2>
              <p className="text-sm sm:text-base text-[#410217]/85 font-sans leading-relaxed max-w-4xl">
                Our foundational whitepaper explaining how AI search engines retrieve web content, how bad actors manipulate citations to influence public opinion or stock markets, and why simple first-generation filters fail. Introduces our core defense layers for spotting rigged web pages, verifying source signatures, blocking multi-document logic traps, and cross-checking web news against live financial market activity.
              </p>
            </div>

            <div className="mb-7 p-4 rounded-xl bg-[#FFFDF8] border border-[#F2D69D] text-xs">
              <div className="font-semibold text-[#410217] mb-2.5">
                Core Protections Covered in Volume I:
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <div className="flex items-start space-x-2">
                  <span className="text-[#D5991C] font-bold">Layer 0:</span>
                  <span className="text-[#410217]/90">Moving-Target Map Rotation &amp; Tripwires</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-[#D5991C] font-bold">Layer 1:</span>
                  <span className="text-[#410217]/90">Search Gravity Sinkhole Quarantine</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-[#D5991C] font-bold">Layer 2:</span>
                  <span className="text-[#410217]/90">3-Way Search Engine Consistency Check</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-[#D5991C] font-bold">Layer 3:</span>
                  <span className="text-[#410217]/90">Digital Source Seals &amp; Botnet Filtering</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-[#D5991C] font-bold">Layer 4A:</span>
                  <span className="text-[#410217]/90">Multi-Document Jigsaw Trap Firewall</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-[#D5991C] font-bold">Layer 4B:</span>
                  <span className="text-[#410217]/90">Financial Order-Book Reality Grounding</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => onNavigate('counter-geo', 'paper')}
                className="group p-5 rounded-xl bg-[#410217] hover:bg-[#5C0A24] text-[#FBF3E2] border-2 border-[#410217] shadow-md transition-all text-left cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-md bg-[#2B010F] text-[#D5991C] text-xs font-semibold">
                      <FileText className="w-3.5 h-3.5" />
                      <span>Part 1 · Full Whitepaper</span>
                    </span>
                    <span className="text-xs text-[#D5991C] font-medium">54 Pages · Word-for-Word</span>
                  </div>
                  <h3 className="font-serif text-xl font-bold text-[#FBF3E2] group-hover:text-[#D5991C] transition-colors mb-1.5">
                    Read Volume I Whitepaper
                  </h3>
                  <p className="text-xs text-[#FBF3E2]/80 leading-relaxed font-sans mb-4">
                    Read the complete 8,800+ word paper covering executive context, how AI search retrieval works, and the full architecture of Layers 0 through 4B.
                  </p>
                </div>
                <div className="flex items-center text-xs font-semibold text-[#D5991C] group-hover:translate-x-1 transition-transform">
                  <span>Open Full Whitepaper</span>
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </div>
              </button>

              <button
                onClick={() => onNavigate('counter-geo', 'lab')}
                className="group p-5 rounded-xl bg-[#FFFDF8] hover:bg-[#FAF2E1] text-[#410217] border-2 border-[#D5991C] shadow-md transition-all text-left cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-md bg-[#FAF2E1] text-[#410217] text-xs font-semibold border border-[#D5991C]">
                      <Sparkles className="w-3.5 h-3.5 text-[#D5991C]" />
                      <span>Part 2 · Interactive Lab</span>
                    </span>
                    <span className="text-xs text-[#00A878] font-semibold">Live 3D &amp; Simulators</span>
                  </div>
                  <h3 className="font-serif text-xl font-bold text-[#410217] group-hover:text-[#D5991C] transition-colors mb-1.5">
                    Explore Volume I Findings &amp; 3D Lab
                  </h3>
                  <p className="text-xs text-[#410217]/80 leading-relaxed font-sans mb-4">
                    Test our search consistency checks, botnet filters, and financial reality gates interactively with live sliders and a 3D visualizer.
                  </p>
                </div>
                <div className="flex items-center text-xs font-semibold text-[#410217] group-hover:translate-x-1 transition-transform">
                  <span>Launch Interactive Lab</span>
                  <ArrowRight className="w-4 h-4 ml-1.5 text-[#D5991C]" />
                </div>
              </button>
            </div>
          </article>
        )}

        {/* VOLUME 2 SHOWCASE CARD */}
        {(activeTab === 'all' || activeTab === 'vol2') && (
          <article className="rounded-2xl bg-[#FAF2E1] border-2 border-[#00A878]/80 shadow-lg p-6 sm:p-10 relative overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-5 border-b border-[#F2D69D] text-xs">
              <div className="flex items-center space-x-2.5">
                <span className="px-3 py-1 rounded-full bg-[#004566] text-[#FBF3E2] font-bold">
                  Volume II · Memory, PDFs, Swarms &amp; Privacy
                </span>
                <span className="text-[#410217]/75 font-medium">{MASTER_DOC_VOL2_METADATA.date}</span>
              </div>
              <div className="flex items-center space-x-2 text-[#410217]/80 font-medium">
                <span>{MASTER_DOC_VOL2_METADATA.pages} Pages</span>
                <span>•</span>
                <span>{MASTER_DOC_VOL2_METADATA.wordCount.toLocaleString()} Words</span>
                <span>•</span>
                <span className="text-[#00A878] font-bold">Defense Layers 5 – 8</span>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#410217] font-normal tracking-tight leading-tight mb-3">
                {MASTER_DOC_VOL2_METADATA.title}
              </h2>
              <p className="text-sm sm:text-base text-[#410217]/85 font-sans leading-relaxed max-w-4xl">
                Extends Counter-AEO protection to AI agents that remember past conversations over months, read visual charts and PDFs, and collaborate in multi-agent teams. Also demonstrates how financial firms can prove their AI systems ran every safety check using zero-knowledge cryptography—without exposing proprietary trading strategies.
              </p>
            </div>

            <div className="mb-7 p-4 rounded-xl bg-[#FFFDF8] border border-[#F2D69D] text-xs">
              <div className="font-semibold text-[#410217] mb-2.5">
                Core Protections Covered in Volume II:
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="flex items-start space-x-2">
                  <span className="text-[#00A878] font-bold">Layer 5:</span>
                  <span className="text-[#410217]/90">60-Day Long-Term Memory Drift Guard</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-[#00A878] font-bold">Layer 6:</span>
                  <span className="text-[#410217]/90">AI-Quoting-AI Echo Chamber Filter</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-[#00A878] font-bold">Layer 7:</span>
                  <span className="text-[#410217]/90">PDF &amp; Chart Hidden Instruction Scrubber</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-[#00A878] font-bold">Layer 8:</span>
                  <span className="text-[#410217]/90">Zero-Knowledge Privacy Audit Proofs</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => onNavigate('counter-geo-vol2', 'paper')}
                className="group p-5 rounded-xl bg-[#004566] hover:bg-[#002f45] text-[#FBF3E2] border-2 border-[#004566] shadow-md transition-all text-left cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-md bg-[#002b40] text-[#00A878] text-xs font-semibold">
                      <FileText className="w-3.5 h-3.5" />
                      <span>Part 1 · Full Whitepaper</span>
                    </span>
                    <span className="text-xs text-[#00A878] font-medium">42 Pages · Word-for-Word</span>
                  </div>
                  <h3 className="font-serif text-xl font-bold text-[#FBF3E2] group-hover:text-[#00A878] transition-colors mb-1.5">
                    Read Volume II Whitepaper
                  </h3>
                  <p className="text-xs text-[#FBF3E2]/80 leading-relaxed font-sans mb-4">
                    Read the complete text of Volume II covering long-term agent memory protection, swarm echo filtering, visual PDF sanitization, and zero-knowledge proofs.
                  </p>
                </div>
                <div className="flex items-center text-xs font-semibold text-[#00A878] group-hover:translate-x-1 transition-transform">
                  <span>Open Full Whitepaper</span>
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </div>
              </button>

              <button
                onClick={() => onNavigate('counter-geo-vol2', 'lab')}
                className="group p-5 rounded-xl bg-[#FFFDF8] hover:bg-[#FAF2E1] text-[#410217] border-2 border-[#00A878] shadow-md transition-all text-left cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-md bg-[#FAF2E1] text-[#004566] text-xs font-semibold border border-[#00A878]">
                      <Sparkles className="w-3.5 h-3.5 text-[#00A878]" />
                      <span>Part 2 · Interactive Lab</span>
                    </span>
                    <span className="text-xs text-[#00A878] font-semibold">Live Simulators</span>
                  </div>
                  <h3 className="font-serif text-xl font-bold text-[#410217] group-hover:text-[#00A878] transition-colors mb-1.5">
                    Explore Volume II Findings &amp; Lab
                  </h3>
                  <p className="text-xs text-[#410217]/80 leading-relaxed font-sans mb-4">
                    Experiment with the 60-day memory drift simulator, bot echo-chamber matrix, PDF pixel scrubber, and zero-knowledge proof verifier.
                  </p>
                </div>
                <div className="flex items-center text-xs font-semibold text-[#410217] group-hover:translate-x-1 transition-transform">
                  <span>Launch Interactive Lab</span>
                  <ArrowRight className="w-4 h-4 ml-1.5 text-[#00A878]" />
                </div>
              </button>
            </div>
          </article>
        )}

        {/* VOLUME 3 SHOWCASE CARD */}
        {(activeTab === 'all' || activeTab === 'vol3') && (
          <article className="rounded-2xl bg-[#FAF2E1] border-2 border-[#5B21B6]/80 shadow-lg p-6 sm:p-10 relative overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-5 border-b border-[#F2D69D] text-xs">
              <div className="flex items-center space-x-2.5">
                <span className="px-3 py-1 rounded-full bg-[#5B21B6] text-white font-bold">
                  Volume III · Benchmark Suite &amp; Market Stress-Tests
                </span>
                <span className="text-[#410217]/75 font-medium">{MASTER_DOC_VOL3_METADATA.date}</span>
              </div>
              <div className="flex items-center space-x-2 text-[#410217]/80 font-medium">
                <span>{MASTER_DOC_VOL3_METADATA.pageCount} Pages</span>
                <span>•</span>
                <span>250k Test Documents</span>
                <span>•</span>
                <span className="text-[#5B21B6] font-bold">99.6% Detection Accuracy</span>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#410217] font-normal tracking-tight leading-tight mb-3">
                {MASTER_DOC_VOL3_METADATA.title}
              </h2>
              <p className="text-sm sm:text-base text-[#410217]/85 font-sans leading-relaxed max-w-4xl">
                Our experimental validation study testing the defense stack across 250,000 documents and seven major attack types. Shows how our multi-engine cross-check eliminates the high false-alarm rate that older filters suffer on real SEC 10-K reports (dropping false alarms from 18.6% to 0.38%), and replays a simulated 50-bot pre-market flash crash.
              </p>
            </div>

            <div className="mb-7 p-4 rounded-xl bg-[#FFFDF8] border border-[#F2D69D] text-xs">
              <div className="font-semibold text-[#410217] mb-2.5">
                Key Benchmark Findings in Volume III:
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="p-3 rounded-lg bg-[#FAF2E1] border border-[#F2D69D]">
                  <div className="text-[11px] text-[#410217]/70">Overall Detection (AUROC)</div>
                  <div className="text-lg font-serif font-bold text-[#00A878] mt-0.5">0.996</div>
                  <div className="text-[11px] text-[#410217]/70">vs. 0.768 Legacy Baseline</div>
                </div>
                <div className="p-3 rounded-lg bg-[#FAF2E1] border border-[#F2D69D]">
                  <div className="text-[11px] text-[#410217]/70">Real SEC 10-K False Alarms</div>
                  <div className="text-lg font-serif font-bold text-[#00A878] mt-0.5">0.38%</div>
                  <div className="text-[11px] text-[#410217]/70">Down from 18.6%</div>
                </div>
                <div className="p-3 rounded-lg bg-[#FAF2E1] border border-[#F2D69D]">
                  <div className="text-[11px] text-[#410217]/70">Flash-Crash Simulation</div>
                  <div className="text-lg font-serif font-bold text-[#5B21B6] mt-0.5">0.0% Loss</div>
                  <div className="text-[11px] text-[#410217]/70">Halted in 14.2 ms</div>
                </div>
                <div className="p-3 rounded-lg bg-[#FAF2E1] border border-[#F2D69D]">
                  <div className="text-[11px] text-[#410217]/70">Reproducible Code</div>
                  <div className="text-lg font-serif font-bold text-[#410217] mt-0.5">Included</div>
                  <div className="text-[11px] text-[#D5991C] font-medium">Self-Contained Python Suite</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => onNavigate('counter-geo-vol3', 'paper')}
                className="group p-5 rounded-xl bg-[#341865] hover:bg-[#250d4d] text-[#FBF3E2] border-2 border-[#5B21B6] shadow-md transition-all text-left cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-md bg-[#200a40] text-[#D5991C] text-xs font-semibold">
                      <FileText className="w-3.5 h-3.5" />
                      <span>Part 1 · Full Whitepaper</span>
                    </span>
                    <span className="text-xs text-[#D5991C] font-medium">38 Pages · Word-for-Word</span>
                  </div>
                  <h3 className="font-serif text-xl font-bold text-[#FBF3E2] group-hover:text-[#D5991C] transition-colors mb-1.5">
                    Read Volume III Whitepaper
                  </h3>
                  <p className="text-xs text-[#FBF3E2]/80 leading-relaxed font-sans mb-4">
                    Read the full empirical benchmark report, layer-by-layer comparisons, market replay simulations, and Python evaluation code.
                  </p>
                </div>
                <div className="flex items-center text-xs font-semibold text-[#D5991C] group-hover:translate-x-1 transition-transform">
                  <span>Open Full Whitepaper</span>
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </div>
              </button>

              <button
                onClick={() => onNavigate('counter-geo-vol3', 'lab')}
                className="group p-5 rounded-xl bg-[#FFFDF8] hover:bg-[#FAF2E1] text-[#410217] border-2 border-[#5B21B6] shadow-md transition-all text-left cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-md bg-[#FAF2E1] text-[#5B21B6] text-xs font-semibold border border-[#5B21B6]">
                      <Sparkles className="w-3.5 h-3.5 text-[#5B21B6]" />
                      <span>Part 2 · Interactive Lab</span>
                    </span>
                    <span className="text-xs text-[#5B21B6] font-semibold">Market &amp; ROC Explorer</span>
                  </div>
                  <h3 className="font-serif text-xl font-bold text-[#410217] group-hover:text-[#5B21B6] transition-colors mb-1.5">
                    Explore Volume III Benchmark Lab
                  </h3>
                  <p className="text-xs text-[#410217]/80 leading-relaxed font-sans mb-4">
                    Replay the pre-market flash crash simulation step-by-step, compare accuracy curves across all 7 threat types, and inspect the test harness.
                  </p>
                </div>
                <div className="flex items-center text-xs font-semibold text-[#410217] group-hover:translate-x-1 transition-transform">
                  <span>Launch Benchmark Lab</span>
                  <ArrowRight className="w-4 h-4 ml-1.5 text-[#5B21B6]" />
                </div>
              </button>
            </div>
          </article>
        )}

        {/* VOLUME 4 SHOWCASE CARD */}
        {(activeTab === 'all' || activeTab === 'vol4') && (
          <article className="rounded-2xl bg-[#FAF2E1] border-2 border-[#D5991C] shadow-lg p-6 sm:p-10 relative overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-5 border-b border-[#F2D69D] text-xs">
              <div className="flex items-center space-x-2.5">
                <span className="px-3 py-1 rounded-full bg-[#410217] text-[#FAF5EB] font-bold">
                  Volume IV · High-Speed Hardware &amp; Enterprise Deployment
                </span>
                <span className="text-[#410217]/75 font-medium">{MASTER_DOC_VOL4_METADATA.date}</span>
              </div>
              <div className="flex items-center space-x-2 text-[#410217]/80 font-medium">
                <span>{MASTER_DOC_VOL4_METADATA.pageCount} Pages</span>
                <span>•</span>
                <span className="text-[#D5991C] font-bold">142ns Hardware Design</span>
                <span>•</span>
                <span className="text-[#00A878] font-bold">Enterprise ROI Models</span>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#410217] font-normal tracking-tight leading-tight mb-3">
                {MASTER_DOC_VOL4_METADATA.title}
              </h2>
              <p className="text-sm sm:text-base text-[#410217]/85 font-sans leading-relaxed max-w-4xl">
                Shows how to translate our software defenses into ultra-fast trading hardware and enterprise-ready deployments. Details a 142-nanosecond FPGA network card design that acts as a pre-trade safety brake, alongside air-gapped deployment architectures for financial institutions and government agencies.
              </p>
            </div>

            <div className="mb-7 p-4 rounded-xl bg-[#FFFDF8] border border-[#F2D69D] text-xs">
              <div className="font-semibold text-[#410217] mb-2.5">
                Key Specifications Covered in Volume IV:
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="p-3 rounded-lg bg-[#FAF2E1] border border-[#F2D69D]">
                  <div className="text-[11px] text-[#410217]/70">Hardware Brake Speed</div>
                  <div className="text-lg font-serif font-bold text-[#D5991C] mt-0.5">142.0 ns</div>
                  <div className="text-[11px] text-[#410217]/70">45 Clock Cycles @ 312.5 MHz</div>
                </div>
                <div className="p-3 rounded-lg bg-[#FAF2E1] border border-[#F2D69D]">
                  <div className="text-[11px] text-[#410217]/70">Modeled Risk Reduction</div>
                  <div className="text-lg font-serif font-bold text-[#00A878] mt-0.5">18.4x – 34.2x</div>
                  <div className="text-[11px] text-[#410217]/70">3-Year Value-at-Risk Savings</div>
                </div>
                <div className="p-3 rounded-lg bg-[#FAF2E1] border border-[#F2D69D]">
                  <div className="text-[11px] text-[#410217]/70">Deployment Options</div>
                  <div className="text-lg font-serif font-bold text-[#410217] mt-0.5">3 Tiers</div>
                  <div className="text-[11px] text-[#410217]/70">Trading · Enterprise · Sovereign</div>
                </div>
                <div className="p-3 rounded-lg bg-[#FAF2E1] border border-[#F2D69D]">
                  <div className="text-[11px] text-[#410217]/70">Hardware Code</div>
                  <div className="text-lg font-serif font-bold text-[#410217] mt-0.5">SystemVerilog</div>
                  <div className="text-[11px] text-[#00A878] font-medium">Synthesizable RTL Included</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => onNavigate('counter-geo-vol4', 'paper')}
                className="group p-5 rounded-xl bg-[#410217] hover:bg-[#5C0A24] text-[#FBF3E2] border-2 border-[#410217] shadow-md transition-all text-left cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-md bg-[#2B010F] text-[#D5991C] text-xs font-semibold">
                      <FileText className="w-3.5 h-3.5" />
                      <span>Part 1 · Full Whitepaper</span>
                    </span>
                    <span className="text-xs text-[#D5991C] font-medium">46 Pages · Word-for-Word</span>
                  </div>
                  <h3 className="font-serif text-xl font-bold text-[#FBF3E2] group-hover:text-[#D5991C] transition-colors mb-1.5">
                    Read Volume IV Whitepaper
                  </h3>
                  <p className="text-xs text-[#FBF3E2]/80 leading-relaxed font-sans mb-4">
                    Read the full text of Volume IV covering the 142ns hardware design, SystemVerilog code, enterprise risk modeling, and deployment roadmaps.
                  </p>
                </div>
                <div className="flex items-center text-xs font-semibold text-[#D5991C] group-hover:translate-x-1 transition-transform">
                  <span>Open Full Whitepaper</span>
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </div>
              </button>

              <button
                onClick={() => onNavigate('counter-geo-vol4', 'lab')}
                className="group p-5 rounded-xl bg-[#FFFDF8] hover:bg-[#FAF2E1] text-[#410217] border-2 border-[#D5991C] shadow-md transition-all text-left cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-md bg-[#FAF2E1] text-[#410217] text-xs font-semibold border border-[#D5991C]">
                      <Sparkles className="w-3.5 h-3.5 text-[#D5991C]" />
                      <span>Part 2 · Interactive Lab</span>
                    </span>
                    <span className="text-xs text-[#00A878] font-semibold">142ns Simulator &amp; ROI</span>
                  </div>
                  <h3 className="font-serif text-xl font-bold text-[#410217] group-hover:text-[#D5991C] transition-colors mb-1.5">
                    Explore Volume IV Hardware &amp; ROI Lab
                  </h3>
                  <p className="text-xs text-[#410217]/80 leading-relaxed font-sans mb-4">
                    Test the interactive 142ns wire brake simulator, calculate enterprise risk savings, and inspect the 3D hardware rack visualizer.
                  </p>
                </div>
                <div className="flex items-center text-xs font-semibold text-[#410217] group-hover:translate-x-1 transition-transform">
                  <span>Launch Hardware Lab</span>
                  <ArrowRight className="w-4 h-4 ml-1.5 text-[#D5991C]" />
                </div>
              </button>
            </div>
          </article>
        )}

        {/* VOLUME 5 SHOWCASE CARD */}
        {(activeTab === 'all' || activeTab === 'vol5') && (
          <article className="rounded-2xl bg-[#FAF2E1] border-2 border-[#7C3AED] shadow-lg p-6 sm:p-10 relative overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-5 border-b border-[#F2D69D] text-xs">
              <div className="flex items-center space-x-2.5">
                <span className="px-3 py-1 rounded-full bg-[#4C1D95] text-[#FAF5EB] font-bold">
                  Volume V · Agent-to-Agent Discovery &amp; Security (A2A-EO)
                </span>
                <span className="text-[#410217]/75 font-medium">{MASTER_DOC_VOL5_METADATA.date}</span>
              </div>
              <div className="flex items-center space-x-2 text-[#410217]/80 font-medium">
                <span>{MASTER_DOC_VOL5_METADATA.pageCount} Pages</span>
                <span>•</span>
                <span className="text-[#7C3AED] font-bold">Autonomous Agent Networks</span>
                <span>•</span>
                <span className="text-[#00A878] font-bold">MCP &amp; Tool Security</span>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#410217] font-normal tracking-tight leading-tight mb-3">
                {MASTER_DOC_VOL5_METADATA.title}
              </h2>
              <p className="text-sm sm:text-base text-[#410217]/85 font-sans leading-relaxed max-w-4xl">
                Examines the rapid rise of the &ldquo;Silent Web&rdquo;—where autonomous AI agents discover, evaluate, and invoke external software tools (such as Model Context Protocol servers and APIs) without a human clicking a browser. Shows how to structure your legitimate tools so AI agents select them 79%–96% of the time, and how to defend your internal agents against disguised malicious tools.
              </p>
            </div>

            <div className="mb-7 p-4 rounded-xl bg-[#FFFDF8] border border-[#F2D69D] text-xs">
              <div className="font-semibold text-[#410217] mb-2.5">
                Key Highlights Covered in Volume V:
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="p-3 rounded-lg bg-[#FAF2E1] border border-[#F2D69D]">
                  <div className="text-[11px] text-[#410217]/70">Tool Schema Simplification</div>
                  <div className="text-lg font-serif font-bold text-[#7C3AED] mt-0.5">Flat &amp; Clear</div>
                  <div className="text-[11px] text-[#410217]/70">Eliminates Deep Nesting Penalties</div>
                </div>
                <div className="p-3 rounded-lg bg-[#FAF2E1] border border-[#F2D69D]">
                  <div className="text-[11px] text-[#410217]/70">Agent Selection Win Rate</div>
                  <div className="text-lg font-serif font-bold text-[#00A878] mt-0.5">79% – 96%</div>
                  <div className="text-[11px] text-[#410217]/70">In Multi-Agent Routing Tests</div>
                </div>
                <div className="p-3 rounded-lg bg-[#FAF2E1] border border-[#F2D69D]">
                  <div className="text-[11px] text-[#410217]/70">Partner Verification</div>
                  <div className="text-lg font-serif font-bold text-[#410217] mt-0.5">Signed</div>
                  <div className="text-[11px] text-[#410217]/70">Cryptographic Agent Handshakes</div>
                </div>
                <div className="p-3 rounded-lg bg-[#FAF2E1] border border-[#F2D69D]">
                  <div className="text-[11px] text-[#410217]/70">Prompt Hijack Prevention</div>
                  <div className="text-lg font-serif font-bold text-[#00A878] mt-0.5">0.0% Leak</div>
                  <div className="text-[11px] text-[#410217]/70">Strict External Data Isolation</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => onNavigate('counter-geo-vol5', 'paper')}
                className="group p-5 rounded-xl bg-[#3B0764] hover:bg-[#581C87] text-[#FAF5EB] border-2 border-[#7C3AED] shadow-md transition-all text-left cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-md bg-[#2E1065] text-[#D8B4FE] text-xs font-semibold">
                      <FileText className="w-3.5 h-3.5" />
                      <span>Part 1 · Full Whitepaper</span>
                    </span>
                    <span className="text-xs text-[#D8B4FE] font-medium">52 Pages · Word-for-Word</span>
                  </div>
                  <h3 className="font-serif text-xl font-bold text-[#FAF5EB] group-hover:text-[#D8B4FE] transition-colors mb-1.5">
                    Read Volume V Whitepaper
                  </h3>
                  <p className="text-xs text-[#FAF5EB]/80 leading-relaxed font-sans mb-4">
                    Read the complete text of Volume V covering how autonomous agents choose tools, how to optimize your schemas, and how to stop agent-to-agent attacks.
                  </p>
                </div>
                <div className="flex items-center text-xs font-semibold text-[#D8B4FE] group-hover:translate-x-1 transition-transform">
                  <span>Open Full Whitepaper</span>
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </div>
              </button>

              <button
                onClick={() => onNavigate('counter-geo-vol5', 'lab')}
                className="group p-5 rounded-xl bg-[#FFFDF8] hover:bg-[#FAF2E1] text-[#410217] border-2 border-[#7C3AED] shadow-md transition-all text-left cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-md bg-[#FAF2E1] text-[#7C3AED] text-xs font-semibold border border-[#7C3AED]">
                      <Sparkles className="w-3.5 h-3.5 text-[#7C3AED]" />
                      <span>Part 2 · Interactive Lab</span>
                    </span>
                    <span className="text-xs text-[#7C3AED] font-semibold">Live Agent Simulator</span>
                  </div>
                  <h3 className="font-serif text-xl font-bold text-[#410217] group-hover:text-[#7C3AED] transition-colors mb-1.5">
                    Explore Volume V Agent Lab
                  </h3>
                  <p className="text-xs text-[#410217]/80 leading-relaxed font-sans mb-4">
                    Test the interactive agent tool selection simulator, schema optimizer, handshake verifier, and 3D multi-agent network visualizer.
                  </p>
                </div>
                <div className="flex items-center text-xs font-semibold text-[#410217] group-hover:translate-x-1 transition-transform">
                  <span>Launch Agent Lab</span>
                  <ArrowRight className="w-4 h-4 ml-1.5 text-[#7C3AED]" />
                </div>
              </button>
            </div>
          </article>
        )}
      </section>

      {/* Complete 12-Layer Defense Architecture Summary Table */}
      <section id="defense-matrix" className="py-14 bg-[#F5ECE0] border-t border-b border-[#F2D69D]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
            <div>
              <div className="w-10 h-1 bg-[#D5991C] rounded-full mb-3" />
              <h2 className="font-serif text-3xl sm:text-4xl text-[#410217] font-normal tracking-tight">
                Complete Defense Stack at a Glance
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#410217]/75 max-w-lg">
              Every defense layer across our five volumes explained in plain English, showing what problem it solves and where you can read or test it.
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl bg-[#FAF2E1] border border-[#F2D69D] shadow-sm">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#410217] text-[#FBF3E2] border-b border-[#F2D69D]">
                  <th className="py-3.5 px-4 font-semibold">Layer</th>
                  <th className="py-3.5 px-3 font-semibold">Volume</th>
                  <th className="py-3.5 px-4 font-semibold">Protection Module</th>
                  <th className="py-3.5 px-4 font-semibold">What Threat It Stops</th>
                  <th className="py-3.5 px-4 font-semibold">How It Works</th>
                  <th className="py-3.5 px-3 font-semibold text-right">Speed</th>
                  <th className="py-3.5 px-4 font-semibold text-center">Explore</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F2D69D]/70 text-[#410217]">
                {defenseMatrix.map((item, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-[#FFFDF8] transition-colors cursor-pointer"
                    onClick={() => setExpandedLayer(expandedLayer === idx ? null : idx)}
                  >
                    <td className="py-3.5 px-4 font-bold text-[#410217] whitespace-nowrap">
                      <span className="px-2.5 py-1 rounded-md bg-[#FAF5EB] border border-[#D5991C]/50 text-[11px]">
                        {item.layer}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#410217] text-[#FBF3E2]">
                        {item.vol}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-[#410217] whitespace-nowrap">
                      {item.name}
                    </td>
                    <td className="py-3.5 px-4 text-[#410217]/85 max-w-xs">
                      {item.threat}
                    </td>
                    <td className="py-3.5 px-4 text-[#410217]/80">
                      {item.core}
                    </td>
                    <td className="py-3.5 px-3 text-right font-bold text-[#00A878] whitespace-nowrap">
                      {item.latency}
                    </td>
                    <td className="py-3.5 px-4 text-center whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <div className="inline-flex items-center space-x-1.5">
                        <button
                          onClick={() => onNavigate(item.volKey, 'paper')}
                          className="px-2.5 py-1 rounded-md bg-[#410217] hover:bg-[#5C0A24] text-[#FBF3E2] text-[11px] font-semibold transition-colors cursor-pointer"
                        >
                          Paper
                        </button>
                        <button
                          onClick={() => onNavigate(item.volKey, 'lab')}
                          className="px-2.5 py-1 rounded-md bg-[#D5991C] hover:bg-[#c48912] text-[#130108] text-[11px] font-semibold transition-colors cursor-pointer"
                        >
                          3D Lab
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Citation Block */}
      <section id="ci-attribution" className="py-14 bg-[#FFFDF9] border-t border-[#F2D69D]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
            <div>
              <div className="w-10 h-1 bg-[#D5991C] rounded-full mb-3" />
              <h2 className="font-serif text-3xl sm:text-4xl text-[#410217] font-normal tracking-tight">
                Active Counterintelligence &amp; Threat Attribution (CI-1 to CI-8)
              </h2>
            </div>
            <button
              onClick={() => onNavigate('counter-geo-ops')}
              className="px-4 py-2 rounded-lg bg-[#410217] hover:bg-[#5C0A24] text-[#FBF3E2] text-xs font-semibold flex items-center space-x-2 cursor-pointer transition-colors"
            >
              <span>Inspect Interactive CI Suite in 3D Lab</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#D5991C]" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            {[
              { code: 'CI-1', name: 'Digital Watermark Traps', desc: 'Hidden linguistic marks inside decoy briefings track unauthorized scraping chains.' },
              { code: 'CI-2', name: 'Early-Warning Decoy Topics', desc: 'Monitors quiet search voids overnight to catch fake-news staging early.' },
              { code: 'CI-3', name: 'Campaign & Botnet Fingerprinting', desc: 'Links staggered blog networks and timing patterns into STIX 2.1 dossiers.' },
              { code: 'CI-4', name: 'Verified Fact & Source Recovery', desc: 'Spots suppression floods and restores hardware-signed filings to top results.' },
              { code: 'CI-5', name: 'Decoy Agent & MCP Traps', desc: 'Captures adversarial scanners trying to inject rogue tools into Silent Web directories.' },
              { code: 'CI-6', name: 'Agent Bid & Sybil Tracing', desc: 'Uses harmless sample contracts to unmask shared backend wallets and clone swarms.' },
              { code: 'CI-7', name: 'Sealed Data-Leak Tripwires', desc: 'Plants canary secrets inside untrusted records to intercept cross-agent leaks.' },
              { code: 'CI-8', name: 'Directory Pinning & Audit Logs', desc: 'Protects official institutional agent cards and archives tamper-evident replays.' }
            ].map((ci) => (
              <div key={ci.code} className="p-4 rounded-xl bg-[#FAF2E1] border border-[#F2D69D] hover:border-[#D5991C] transition-colors space-y-1.5">
                <div className="font-mono text-[11px] font-bold text-[#D5991C]">{ci.code}</div>
                <div className="font-serif text-base font-bold text-[#410217]">{ci.name}</div>
                <p className="text-[#410217]/80 leading-relaxed">{ci.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="citations" className="py-14 bg-[#FAF2E1] border-t border-[#F2D69D]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            <div className="w-10 h-1 bg-[#D5991C] rounded-full mb-3" />
            <h2 className="font-serif text-2xl sm:text-3xl text-[#410217] mb-3">
              How to Reference This Research Series
            </h2>
            <p className="text-sm text-[#410217]/80 leading-relaxed font-sans mb-6">
              To reference our five-volume working paper series or benchmark simulations in notes, presentations, or technical discussions, you can copy the citation block below:
            </p>

            <div className="relative rounded-xl bg-[#1A050D] text-[#FAF5EB] p-5 font-mono text-xs border border-[#F2D69D] shadow-inner mb-6">
              <button
                onClick={handleCopyBibtex}
                className="absolute top-4 right-4 flex items-center space-x-1.5 px-3 py-1.5 rounded-md bg-[#410217] hover:bg-[#5C0A24] border border-[#F2D69D]/40 text-[#FBF3E2] text-[11px] transition-colors cursor-pointer"
              >
                {copiedBibtex ? <Check className="w-3.5 h-3.5 text-[#00A878]" /> : <Copy className="w-3.5 h-3.5 text-[#D5991C]" />}
                <span>{copiedBibtex ? 'Copied' : 'Copy BibTeX'}</span>
              </button>
              <pre className="overflow-x-auto whitespace-pre leading-relaxed pr-24">
                {bibtexString}
              </pre>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs text-[#410217]/80">
              {[
                { label: 'Volume I ID', id: MASTER_DOC_METADATA.id },
                { label: 'Volume II ID', id: MASTER_DOC_VOL2_METADATA.id },
                { label: 'Volume III ID', id: MASTER_DOC_VOL3_METADATA.id },
                { label: 'Volume IV ID', id: MASTER_DOC_VOL4_METADATA.id },
                { label: 'Volume V ID', id: MASTER_DOC_VOL5_METADATA.id },
              ].map((item) => (
                <div key={item.label} className="p-3 rounded-lg bg-[#FFFDF8] border border-[#F2D69D]">
                  <div className="text-[10px] text-[#410217]/60 font-medium">{item.label}</div>
                  <div className="font-bold text-[#410217] mt-0.5 truncate">{item.id}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Footer Banner */}
      <section className="py-14 bg-[#410217] text-[#FBF3E2] border-t border-[#F2D69D]/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-3xl sm:text-4xl text-[#FBF3E2] mb-3">
            Explore the Interactive 3D Simulations or Get in Touch
          </h2>
          <p className="text-sm sm:text-base text-[#FBF3E2]/80 max-w-2xl mx-auto font-sans mb-8">
            Want to see these concepts in action with plain-English analogies, or discuss how offensive and defensive AEO apply to your organization?
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={onOpenAudit}
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-lg bg-[#D5991C] hover:bg-[#e6a827] text-[#130108] text-xs font-semibold shadow-md transition-all cursor-pointer"
            >
              <Shield className="w-4 h-4" />
              <span>Get in Touch</span>
            </button>
            <button
              onClick={() => onNavigate('counter-geo-ops')}
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-lg bg-[#2B010F] hover:bg-[#3d0316] text-[#FBF3E2] border border-[#F2D69D]/50 text-xs font-semibold transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[#D5991C]" />
              <span>Launch 3D Threat Lab</span>
            </button>
            <button
              onClick={() => onNavigate('pitch-deck')}
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-lg bg-[#FAF2E1] hover:bg-[#FAF5EB] text-[#410217] border border-[#D5991C] text-xs font-semibold transition-all cursor-pointer"
            >
              <Compass className="w-4 h-4 text-[#410217]" />
              <span>View Cover Deck</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
