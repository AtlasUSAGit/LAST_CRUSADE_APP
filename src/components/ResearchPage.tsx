import React, { useState } from 'react';
import {
  FileText,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Cpu,
  Layers,
  Activity,
  Copy,
  Check,
  Terminal,
  ExternalLink,
  ChevronRight,
  Boxes,
  Zap,
  Lock,
  Scale,
  BarChart3,
  Search,
  FileCheck2,
  Compass
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
  onOpenIncident
}) => {
  const [copiedBibtex, setCopiedBibtex] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'vol1' | 'vol2' | 'vol3' | 'vol4' | 'vol5'>('all');
  const [expandedLayer, setExpandedLayer] = useState<number | null>(null);

  const bibtexString = `@article{sentinel_aeo_pentology_2026,
  title={Generative Engine Optimization (AEO) and Counter-AEO Defenses: Sovereign Architecture for Epistemic and Financial Cybersecurity (Volumes I, II, III, IV, and V)},
  author={Last Crusade Defense Security Labs and Autonomous Systems Red-Team Group},
  journal={Sovereign Strategic Research & Defense Initiative},
  year={2026},
  month={October},
  doi={10.1145/3637528.3671900-CAEO-PENTOLOGY},
  url={https://sentinel-aeo.defense.ai/#/research}
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
      name: 'MTVD & Canaries',
      threat: 'Black-box query sampling & surrogate model scraping',
      core: 'Householder Isometric Rotations Q_t ∈ O(d) + Canary Subspaces',
      latency: '< 0.4 ms',
      status: 'Active'
    },
    {
      layer: 'Layer 1',
      vol: 'Vol. I',
      volKey: 'counter-geo' as NavigationPage,
      name: 'AM-CIDP',
      threat: 'Universal & regional vector retrieval hubs (topological sinkholes)',
      core: 'Levina-Bickel Intrinsic Dimension (LID_K) + Gram Spectral Entropy',
      latency: '1.8 ms',
      status: 'Active'
    },
    {
      layer: 'Layer 2',
      vol: 'Vol. I',
      volKey: 'counter-geo' as NavigationPage,
      name: 'NCARD',
      threat: 'Single-embedder gradient overfitting across dense spaces',
      core: 'Depth-Weighted Reciprocal Rank Divergence (Dense / ColBERT / SPLADE)',
      latency: '4.2 ms',
      status: 'Active'
    },
    {
      layer: 'Layer 3',
      vol: 'Vol. I',
      volKey: 'counter-geo' as NavigationPage,
      name: 'TCG-CL v2.0',
      threat: 'Sybil consensus botnets & circular citation spoofing',
      core: 'X.509 C2PA Hardware Roots + NLI Entailment Max-Flow + Hawkes CV²',
      latency: '6.5 ms',
      status: 'Active'
    },
    {
      layer: 'Layer 4A',
      vol: 'Vol. I',
      volKey: 'counter-geo' as NavigationPage,
      name: 'CEH-ASID & DAPP',
      threat: 'Split-Payload (Enthymematic) AEO & indirect prompt injections',
      core: 'Möbius KL Synergy (I_ij) + Transformer Attention Sink Tomography',
      latency: '5.1 ms',
      status: 'Active'
    },
    {
      layer: 'Layer 4B',
      vol: 'Vol. I',
      volKey: 'counter-geo' as NavigationPage,
      name: 'TMMEG',
      threat: 'Data-void market spoofing & predatory LOB liquidity traps',
      core: 'Thermodynamic KL Surprise vs. VPIN_t, Kyle\'s λ, & OBAR_t Order-Book Energy',
      latency: '< 0.2 ms',
      status: 'Active'
    },
    {
      layer: 'Layer 5',
      vol: 'Vol. II',
      volKey: 'counter-geo-vol2' as NavigationPage,
      name: 'DMEM-WMQ',
      threat: 'Slow-Boil chronic episodic memory drift in autonomous AI agents',
      core: 'Doob-Meyer Epistemic Martingale Decomposition + W_2 Merkle Rollback',
      latency: '0.9 ms',
      status: 'Active'
    },
    {
      layer: 'Layer 6',
      vol: 'Vol. II',
      volKey: 'counter-geo-vol2' as NavigationPage,
      name: 'SGL-CMI',
      threat: 'Autophagous AI-citing-AI swarm echo chambers and synthetic cascades',
      core: 'Spectral Graph Laplacian + Conditional Mutual Info I(Z_i; Z_j | R)',
      latency: '1.1 ms',
      status: 'Active'
    },
    {
      layer: 'Layer 7',
      vol: 'Vol. II',
      volKey: 'counter-geo-vol2' as NavigationPage,
      name: 'CM-JSAS',
      threat: 'Multimodal steganographic AEO hubs in PDF financial slides & charts',
      core: 'VLM Jacobian Saliency vs. Sobel Contour Mask (L_leak) + DCT Scrubbing',
      latency: '8.4 ms',
      status: 'Active'
    },
    {
      layer: 'Layer 8',
      vol: 'Vol. II',
      volKey: 'counter-geo-vol2' as NavigationPage,
      name: 'ZK-CAEO',
      threat: 'Institutional alpha leakage in SEC Rule 15c3-8 regulatory reporting',
      core: '288-Byte zk-SNARK Fixed-Point R1CS Arithmetic Proofs (1.4 ms verify)',
      latency: '1.4 ms',
      status: 'Active'
    },
    {
      layer: 'Layer 4B-HW',
      vol: 'Vol. IV',
      volKey: 'counter-geo-vol4' as NavigationPage,
      name: 'TMMEG 142ns SmartNIC',
      threat: 'Wire-speed predatory LOB data voids and ask-wall spoofing',
      core: '312.5 MHz Xilinx UltraScale+ FPGA Pipeline (45 Clocks, Division-Free Q8.24)',
      latency: '142.0 ns',
      status: 'Active'
    },
    {
      layer: 'Layer 9-SE',
      vol: 'Vol. IV',
      volKey: 'counter-geo-vol4' as NavigationPage,
      name: 'Sovereign Enclave & VaR Guard',
      threat: 'Enterprise AI liability, regulatory fines (SEC 15c3-8), & epistemic sabotage',
      core: 'Dual-Use Air-Gapped Appliance + Actuarial VaR Loss Prevention Engine',
      latency: '< 0.5 ms',
      status: 'Active'
    },
    {
      layer: 'Layer 10-A2A',
      vol: 'Vol. V',
      volKey: 'counter-geo-vol5' as NavigationPage,
      name: 'GSF-CACS & C-NUB',
      threat: 'Silent-Web autonomous agent hijacking, schema poisoning & MCP tool spoofing',
      core: 'Gradient Schema Flattening (β_P = 3.82..16.2) + Ed25519 Nonce Handshake',
      latency: '< 0.3 ms',
      status: 'Active'
    }
  ];

  return (
    <div className="min-h-screen bg-[#FAF5EB] text-[#410217] selection:bg-[#410217]/15 selection:text-[#410217]">
      
      {/* Hero Header: Research Library */}
      <section className="relative pt-12 pb-16 md:pt-18 md:pb-22 border-b border-[#F2D69D] bg-gradient-to-b from-[#FFFDF9] via-[#FAF5EB] to-[#F5ECE0] overflow-hidden">
        {/* Subtle background ambient grid */}
        <div className="absolute inset-0 bg-[radial-gradient(#410217_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.03] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl">
            
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-[#410217] leading-[1.1] mb-6">
              Research Library
            </h1>

            <p className="text-base sm:text-lg text-[#410217]/85 font-sans leading-relaxed mb-8 max-w-3xl">
              As AI chatbots and autonomous agents replace classical keyword search, digital discoverability has migrated to <strong>Generative Engine Optimization (AEO)</strong>. This page features deep research we have conducted using frontier models to codify the threat vectors, mathematical detection algorithms, and codebase architectures required to protect foundation reasoning pipelines, financial markets, national security, and LLM-based agents.
            </p>

            {/* Live Telemetry KPI Ticker */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-4 border-t border-[#F2D69D]/80 font-mono text-xs">
              <div className="p-3 bg-[#FAF2E1] border border-[#F2D69D]">
                <div className="text-[10px] text-[#410217]/60 uppercase tracking-wider">Volumes</div>
                <div className="text-xl font-bold text-[#410217] mt-0.5">5 Works</div>
                <div className="text-[10px] text-[#D5991C] mt-0.5">232 Pages Total</div>
              </div>

              <div className="p-3 bg-[#FAF2E1] border border-[#F2D69D]">
                <div className="text-[10px] text-[#410217]/60 uppercase tracking-wider">Defense Stack</div>
                <div className="text-xl font-bold text-[#410217] mt-0.5">12 Layers</div>
                <div className="text-[10px] text-[#00A878] mt-0.5">Complete Stack</div>
              </div>

              <div className="p-3 bg-[#FAF2E1] border border-[#F2D69D]">
                <div className="text-[10px] text-[#410217]/60 uppercase tracking-wider">Agent Routing</div>
                <div className="text-xl font-bold text-[#410217] mt-0.5">96% Win Rate</div>
                <div className="text-[10px] text-[#410217]/70 mt-0.5">A2A-EO Dominance</div>
              </div>

              <div className="p-3 bg-[#FAF2E1] border border-[#F2D69D]">
                <div className="text-[10px] text-[#410217]/60 uppercase tracking-wider">Detection AUROC</div>
                <div className="text-xl font-bold text-[#00A878] mt-0.5">0.996</div>
                <div className="text-[10px] text-[#410217]/70 mt-0.5">vs 0.768 Gen-1</div>
              </div>

              <div className="p-3 bg-[#FAF2E1] border border-[#F2D69D]">
                <div className="text-[10px] text-[#410217]/60 uppercase tracking-wider">Wire Kill-Switch</div>
                <div className="text-xl font-bold text-[#D5991C] mt-0.5">142.0 ns</div>
                <div className="text-[10px] text-[#00A878] mt-0.5">FPGA SmartNIC</div>
              </div>

              <div className="p-3 bg-[#FAF2E1] border border-[#F2D69D]">
                <div className="text-[10px] text-[#410217]/60 uppercase tracking-wider">Enterprise ROI</div>
                <div className="text-xl font-bold text-[#410217] mt-0.5">18.4x – 34.2x</div>
                <div className="text-[10px] text-[#410217]/70 mt-0.5">Actuarial VaR Guard</div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. Navigation Filter & Jump Bar */}
      <div className="border-b border-[#F2D69D] bg-[#FBF3E2] py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
          <div className="flex items-center space-x-2">
            <span className="text-[#410217]/60 font-bold uppercase tracking-wider">View Volumes:</span>
            <div className="flex items-center bg-[#FAF2E1] border border-[#F2D69D] p-1 flex-wrap gap-1">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-3 py-1 font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                  activeTab === 'all' ? 'bg-[#410217] text-[#FBF3E2]' : 'text-[#410217]/70 hover:text-[#410217]'
                }`}
              >
                All 5 Volumes
              </button>
              <button
                onClick={() => setActiveTab('vol1')}
                className={`px-3 py-1 font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                  activeTab === 'vol1' ? 'bg-[#410217] text-[#FBF3E2]' : 'text-[#410217]/70 hover:text-[#410217]'
                }`}
              >
                Volume 1
              </button>
              <button
                onClick={() => setActiveTab('vol2')}
                className={`px-3 py-1 font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                  activeTab === 'vol2' ? 'bg-[#004566] text-[#FBF3E2]' : 'text-[#410217]/70 hover:text-[#410217]'
                }`}
              >
                Volume 2
              </button>
              <button
                onClick={() => setActiveTab('vol3')}
                className={`px-3 py-1 font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                  activeTab === 'vol3' ? 'bg-[#5B21B6] text-white' : 'text-[#410217]/70 hover:text-[#410217]'
                }`}
              >
                Volume 3
              </button>
              <button
                onClick={() => setActiveTab('vol4')}
                className={`px-3 py-1 font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                  activeTab === 'vol4' ? 'bg-[#D5991C] text-[#130108] font-black' : 'text-[#410217]/70 hover:text-[#410217]'
                }`}
              >
                Volume 4
              </button>
              <button
                onClick={() => setActiveTab('vol5')}
                className={`px-3 py-1 font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                  activeTab === 'vol5' ? 'bg-[#7C3AED] text-white font-black' : 'text-[#410217]/70 hover:text-[#410217]'
                }`}
              >
                Volume 5 (A2A-EO)
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-3 text-[#410217]/70">
            <a href="#defense-matrix" className="hover:text-[#410217] underline decoration-[#D5991C]">
              Unified 8-Layer Defense Matrix ↓
            </a>
            <span>•</span>
            <a href="#citations" className="hover:text-[#410217] underline decoration-[#D5991C]">
              BibTeX &amp; DOIs ↓
            </a>
          </div>
        </div>
      </div>

      {/* 4. The 3 Master Volumes Showcase Cards */}
      <section className="py-12 md:py-18 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* ============================================================== */}
        {/* VOLUME 1 SHOWCASE CARD */}
        {/* ============================================================== */}
        {(activeTab === 'all' || activeTab === 'vol1') && (
          <article className="bg-[#FAF2E1] border-2 border-[#D5991C]/70 shadow-lg p-6 sm:p-10 relative overflow-hidden transition-all duration-300 hover:border-[#D5991C]">
            
            {/* Top Accent Strip */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-5 mb-6 border-b border-[#F2D69D] font-mono text-xs">
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-1 bg-[#410217] text-[#FBF3E2] border border-[#D5991C] font-bold uppercase tracking-widest text-[10px]">
                  VOLUME I // FOUNDATIONAL ARCHITECTURE
                </span>
                <span className="text-[#410217] font-bold">{MASTER_DOC_METADATA.id}</span>
                <span className="text-[#410217]/60">•</span>
                <span className="text-[#410217]/70">{MASTER_DOC_METADATA.date}</span>
              </div>
              <div className="flex items-center space-x-2 text-[11px] text-[#410217]/70">
                <span>{MASTER_DOC_METADATA.pages} Pages</span>
                <span>•</span>
                <span>{MASTER_DOC_METADATA.wordCount.toLocaleString()} Words</span>
                <span>•</span>
                <span className="text-[#00A878] font-bold">Layers 0 – 4B</span>
              </div>
            </div>

            {/* Volume Title & Subtitle */}
            <div className="mb-6">
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#410217] font-normal tracking-tight leading-tight mb-3">
                {MASTER_DOC_METADATA.title}
              </h2>
              <p className="text-sm sm:text-base text-[#410217]/80 font-sans leading-relaxed max-w-4xl">
                The master blueprint establishing the theoretical and engineering foundation of Counter-AEO. Diagnoses why first-generation anomaly detectors fail against transferable ensemble attacks, scale pathologies, and latency bottlenecks. Formulates Layers 0 through 4B including Moving-Target Vector Defense (MTVD), AM-CIDP intrinsic dimensionality profiling, NCARD cross-architecture divergence, and Thermodynamic Market Grounding (TMMEG).
              </p>
            </div>

            {/* Layer Badges in Vol 1 */}
            <div className="mb-8 p-4 bg-[#FFFDF8] border border-[#F2D69D] font-mono text-xs">
              <div className="text-[10px] text-[#D5991C] font-bold uppercase tracking-wider mb-2">
                // DEFENSE LAYERS DEFINED IN VOLUME 1:
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-[11px]">
                <div className="flex items-start space-x-2">
                  <span className="text-[#D5991C] font-bold">L0:</span>
                  <span className="text-[#410217]">Moving-Target Vector Defense (MTVD &amp; Canaries)</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-[#D5991C] font-bold">L1:</span>
                  <span className="text-[#410217]">Attractor Manifold Curvature &amp; LID (AM-CIDP)</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-[#D5991C] font-bold">L2:</span>
                  <span className="text-[#410217]">Cross-Architecture Rank Divergence (NCARD)</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-[#D5991C] font-bold">L3:</span>
                  <span className="text-[#410217]">Temporal Citation Graph &amp; C2PA (TCG-CL v2.0)</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-[#D5991C] font-bold">L4A:</span>
                  <span className="text-[#410217]">Combinatorial Epistemic Holography (CEH-ASID)</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-[#D5991C] font-bold">L4B:</span>
                  <span className="text-[#410217]">Thermodynamic Market Microstructure (TMMEG)</span>
                </div>
              </div>
            </div>

            {/* PRIMARY DUAL ACCESS BUTTONS: PAGE 1 vs PAGE 2 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              
              {/* PAGE 1: Full Whitepaper word-for-word */}
              <button
                onClick={() => onNavigate('counter-geo', 'paper')}
                className="group p-5 bg-[#410217] hover:bg-[#5C0A24] text-[#FBF3E2] border-2 border-[#410217] shadow-md transition-all duration-200 text-left cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 bg-[#2B010F] text-[#D5991C] text-[10px] font-mono font-bold uppercase tracking-wider border border-[#D5991C]/30">
                      <FileText className="w-3 h-3" />
                      <span>Page 1 of Volume 1</span>
                    </span>
                    <span className="text-xs font-mono text-[#D5991C]">54 Pages · Unabridged</span>
                  </div>
                  <h3 className="font-serif text-xl font-bold text-[#FBF3E2] group-hover:text-[#D5991C] transition-colors mb-1.5">
                    Full Whitepaper (Word-for-Word)
                  </h3>
                  <p className="text-xs text-[#FBF3E2]/80 leading-relaxed font-sans mb-4">
                    The complete, word-for-word 8,800+ word academic monograph including executive summary, multi-stage RAG mechanics, first-generation AMTD critique, and mathematical proofs for Layers 0 through 4B.
                  </p>
                </div>
                <div className="flex items-center text-xs font-mono font-bold text-[#D5991C] group-hover:translate-x-1 transition-transform">
                  <span>Open Page 1: Read Complete Whitepaper</span>
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </div>
              </button>

              {/* PAGE 2: Findings, Algorithms, and Visualizers */}
              <button
                onClick={() => onNavigate('counter-geo', 'lab')}
                className="group p-5 bg-[#FFFDF8] hover:bg-[#FAF2E1] text-[#410217] border-2 border-[#D5991C] shadow-md transition-all duration-200 text-left cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 bg-[#FAF2E1] text-[#410217] text-[10px] font-mono font-bold uppercase tracking-wider border border-[#D5991C]">
                      <Sparkles className="w-3 h-3 text-[#D5991C]" />
                      <span>Page 2 of Volume 1</span>
                    </span>
                    <span className="text-xs font-mono text-[#00A878] font-bold">Interactive 3D WebGL</span>
                  </div>
                  <h3 className="font-serif text-xl font-bold text-[#410217] group-hover:text-[#D5991C] transition-colors mb-1.5">
                    Findings, Algorithms &amp; Visualizers
                  </h3>
                  <p className="text-xs text-[#410217]/80 leading-relaxed font-sans mb-4">
                    Interactive 3D Vector Manifold Lab, live AM-CIDP intrinsic dimensionality visualizer, NCARD divergence simulator, and the 6-Layer Architecture Defense Inspector.
                  </p>
                </div>
                <div className="flex items-center text-xs font-mono font-bold text-[#410217] group-hover:translate-x-1 transition-transform">
                  <span className="group-hover:text-[#D5991C] transition-colors">Open Page 2: Launch Lab &amp; Visualizers</span>
                  <ArrowRight className="w-4 h-4 ml-1.5 text-[#D5991C]" />
                </div>
              </button>

            </div>

          </article>
        )}

        {/* ============================================================== */}
        {/* VOLUME 2 SHOWCASE CARD */}
        {/* ============================================================== */}
        {(activeTab === 'all' || activeTab === 'vol2') && (
          <article className="bg-[#FAF2E1] border-2 border-[#00A878]/70 shadow-lg p-6 sm:p-10 relative overflow-hidden transition-all duration-300 hover:border-[#00A878]">
            
            {/* Top Accent Strip */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-5 mb-6 border-b border-[#F2D69D] font-mono text-xs">
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-1 bg-[#004566] text-[#FBF3E2] border border-[#00A878] font-bold uppercase tracking-widest text-[10px]">
                  VOLUME II // STATEFUL IMMUNITY &amp; ZK
                </span>
                <span className="text-[#410217] font-bold">{MASTER_DOC_VOL2_METADATA.id}</span>
                <span className="text-[#410217]/60">•</span>
                <span className="text-[#410217]/70">{MASTER_DOC_VOL2_METADATA.date}</span>
              </div>
              <div className="flex items-center space-x-2 text-[11px] text-[#410217]/70">
                <span>{MASTER_DOC_VOL2_METADATA.pages} Pages</span>
                <span>•</span>
                <span>{MASTER_DOC_VOL2_METADATA.wordCount.toLocaleString()} Words</span>
                <span>•</span>
                <span className="text-[#00A878] font-bold">Layers 5 – 8</span>
              </div>
            </div>

            {/* Volume Title & Subtitle */}
            <div className="mb-6">
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#410217] font-normal tracking-tight leading-tight mb-3">
                {MASTER_DOC_VOL2_METADATA.title}
              </h2>
              <p className="text-sm sm:text-base text-[#410217]/80 font-sans leading-relaxed max-w-4xl">
                Extends Counter-AEO into stateful episodic agent memory, autophagous multi-agent swarms, multimodal Vision-Language Models (VLMs), and zero-knowledge regulatory reporting. Solves the catastrophic trade-off between proprietary hedge-fund alpha protection and mandatory SEC Rule 15c3-8 algorithmic auditing via 288-byte zk-SNARKs.
              </p>
            </div>

            {/* Layer Badges in Vol 2 */}
            <div className="mb-8 p-4 bg-[#FFFDF8] border border-[#F2D69D] font-mono text-xs">
              <div className="text-[10px] text-[#00A878] font-bold uppercase tracking-wider mb-2">
                // ADVANCED GENERATION-3 DEFENSE LAYERS IN VOLUME 2:
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-[11px]">
                <div className="flex items-start space-x-2">
                  <span className="text-[#00A878] font-bold">L5:</span>
                  <span className="text-[#410217]">Doob-Meyer Martingale Memory Protection (DMEM-WMQ)</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-[#00A878] font-bold">L6:</span>
                  <span className="text-[#410217]">Spectral Swarm Echo De-Duplication (SGL-CMI)</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-[#00A878] font-bold">L7:</span>
                  <span className="text-[#410217]">Multimodal Steganographic PDF Shield (CM-JSAS)</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-[#00A878] font-bold">L8:</span>
                  <span className="text-[#410217]">Zero-Knowledge SEC Regulatory Proofs (ZK-CAEO)</span>
                </div>
              </div>
            </div>

            {/* PRIMARY DUAL ACCESS BUTTONS: PAGE 1 vs PAGE 2 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              
              {/* PAGE 1: Full Whitepaper word-for-word */}
              <button
                onClick={() => onNavigate('counter-geo-vol2', 'paper')}
                className="group p-5 bg-[#004566] hover:bg-[#002f45] text-[#FBF3E2] border-2 border-[#004566] shadow-md transition-all duration-200 text-left cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 bg-[#002b40] text-[#00A878] text-[10px] font-mono font-bold uppercase tracking-wider border border-[#00A878]/30">
                      <FileText className="w-3 h-3" />
                      <span>Page 1 of Volume 2</span>
                    </span>
                    <span className="text-xs font-mono text-[#00A878]">42 Pages · Unabridged</span>
                  </div>
                  <h3 className="font-serif text-xl font-bold text-[#FBF3E2] group-hover:text-[#00A878] transition-colors mb-1.5">
                    Full Whitepaper Vol. 2 (Word-for-Word)
                  </h3>
                  <p className="text-xs text-[#FBF3E2]/80 leading-relaxed font-sans mb-4">
                    The unabridged text of Volume II covering continuous memory martingales, Wasserstein-2 Merkle rollbacks, graph Laplacian swarm filtering, and fixed-point R1CS arithmetic circuits.
                  </p>
                </div>
                <div className="flex items-center text-xs font-mono font-bold text-[#00A878] group-hover:translate-x-1 transition-transform">
                  <span>Open Page 1: Read Complete Vol. 2 Whitepaper</span>
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </div>
              </button>

              {/* PAGE 2: Findings, Algorithms, and Visualizers */}
              <button
                onClick={() => onNavigate('counter-geo-vol2', 'lab')}
                className="group p-5 bg-[#FFFDF8] hover:bg-[#FAF2E1] text-[#410217] border-2 border-[#00A878] shadow-md transition-all duration-200 text-left cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 bg-[#FAF2E1] text-[#004566] text-[10px] font-mono font-bold uppercase tracking-wider border border-[#00A878]">
                      <Sparkles className="w-3 h-3 text-[#00A878]" />
                      <span>Page 2 of Volume 2</span>
                    </span>
                    <span className="text-xs font-mono text-[#00A878] font-bold">Interactive Algorithms</span>
                  </div>
                  <h3 className="font-serif text-xl font-bold text-[#410217] group-hover:text-[#00A878] transition-colors mb-1.5">
                    Findings, Algorithms &amp; Visualizers
                  </h3>
                  <p className="text-xs text-[#410217]/80 leading-relaxed font-sans mb-4">
                    Interactive Memory Drift Simulator, Byzantine Swarm Consensus Matrix, Multimodal Saliency Mask Inspector, and live 288-Byte zk-SNARK proof verifier.
                  </p>
                </div>
                <div className="flex items-center text-xs font-mono font-bold text-[#410217] group-hover:translate-x-1 transition-transform">
                  <span className="group-hover:text-[#00A878] transition-colors">Open Page 2: Launch Vol. 2 Findings &amp; Lab</span>
                  <ArrowRight className="w-4 h-4 ml-1.5 text-[#00A878]" />
                </div>
              </button>

            </div>

          </article>
        )}

        {/* ============================================================== */}
        {/* VOLUME 3 SHOWCASE CARD */}
        {/* ============================================================== */}
        {(activeTab === 'all' || activeTab === 'vol3') && (
          <article className="bg-[#FAF2E1] border-2 border-[#5B21B6]/70 shadow-lg p-6 sm:p-10 relative overflow-hidden transition-all duration-300 hover:border-[#5B21B6]">
            
            {/* Top Accent Strip */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-5 mb-6 border-b border-[#F2D69D] font-mono text-xs">
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-1 bg-[#5B21B6] text-white border border-[#D5991C] font-bold uppercase tracking-widest text-[10px]">
                  VOLUME III // BENCHMARK SUITE &amp; LOB STRESS TEST
                </span>
                <span className="text-[#410217] font-bold">{MASTER_DOC_VOL3_METADATA.id}</span>
                <span className="text-[#410217]/60">•</span>
                <span className="text-[#410217]/70">{MASTER_DOC_VOL3_METADATA.date}</span>
              </div>
              <div className="flex items-center space-x-2 text-[11px] text-[#410217]/70">
                <span>{MASTER_DOC_VOL3_METADATA.pageCount} Pages</span>
                <span>•</span>
                <span>250k Documents</span>
                <span>•</span>
                <span className="text-[#5B21B6] font-bold">AUROC = 0.996</span>
              </div>
            </div>

            {/* Volume Title & Subtitle */}
            <div className="mb-6">
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#410217] font-normal tracking-tight leading-tight mb-3">
                {MASTER_DOC_VOL3_METADATA.title}
              </h2>
              <p className="text-sm sm:text-base text-[#410217]/80 font-sans leading-relaxed max-w-4xl">
                The empirical validation appendix for the entire Counter-AEO defense stack. Evaluates 250,000 multi-modal documents across threat taxonomy AT-1 to AT-7. Details the elimination of the SEC 10-K false positive pathology (from 18.6% down to 0.38%) and replays high-frequency Limit Order Book (LOB) flash-crash simulations with 50 autonomous LLM trading agents during pre-market data voids.
              </p>
            </div>

            {/* Key Findings Grid in Vol 3 */}
            <div className="mb-8 p-4 bg-[#FFFDF8] border border-[#F2D69D] font-mono text-xs">
              <div className="text-[10px] text-[#5B21B6] font-bold uppercase tracking-wider mb-2">
                // EMPIRICAL BENCHMARKS &amp; SIMULATION RESULTS:
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-[11px]">
                <div className="p-2.5 bg-[#FAF2E1] border border-[#F2D69D]/60">
                  <div className="text-[10px] text-[#410217]/60 uppercase">AUROC Score</div>
                  <div className="text-base font-bold text-[#00A878] mt-0.5">0.996</div>
                  <div className="text-[10px] text-[#410217]/70">vs 0.768 Gen-1 Baseline</div>
                </div>
                <div className="p-2.5 bg-[#FAF2E1] border border-[#F2D69D]/60">
                  <div className="text-[10px] text-[#410217]/60 uppercase">SEC 10-K Clean FPR</div>
                  <div className="text-base font-bold text-[#00A878] mt-0.5">0.38%</div>
                  <div className="text-[10px] text-[#410217]/70">-18.22% False Alarms</div>
                </div>
                <div className="p-2.5 bg-[#FAF2E1] border border-[#F2D69D]/60">
                  <div className="text-[10px] text-[#410217]/60 uppercase">Scenario Alpha ($DFNS)</div>
                  <div className="text-base font-bold text-[#5B21B6] mt-0.5">14.2 ms Halt</div>
                  <div className="text-[10px] text-[#410217]/70">0.00% Sovereign Loss</div>
                </div>
                <div className="p-2.5 bg-[#FAF2E1] border border-[#F2D69D]/60">
                  <div className="text-[10px] text-[#410217]/60 uppercase">Python Test Harness</div>
                  <div className="text-base font-bold text-[#410217] mt-0.5">Self-Contained</div>
                  <div className="text-[10px] text-[#D5991C]">counter_aeo_bench.py</div>
                </div>
              </div>
            </div>

            {/* PRIMARY DUAL ACCESS BUTTONS: PAGE 1 vs PAGE 2 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              
              {/* PAGE 1: Full Whitepaper word-for-word */}
              <button
                onClick={() => onNavigate('counter-geo-vol3', 'paper')}
                className="group p-5 bg-[#341865] hover:bg-[#250d4d] text-[#FBF3E2] border-2 border-[#5B21B6] shadow-md transition-all duration-200 text-left cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 bg-[#200a40] text-[#D5991C] text-[10px] font-mono font-bold uppercase tracking-wider border border-[#D5991C]/30">
                      <FileText className="w-3 h-3" />
                      <span>Page 1 of Volume 3</span>
                    </span>
                    <span className="text-xs font-mono text-[#D5991C]">38 Pages · Unabridged</span>
                  </div>
                  <h3 className="font-serif text-xl font-bold text-[#FBF3E2] group-hover:text-[#D5991C] transition-colors mb-1.5">
                    Full Whitepaper Vol. 3 (Word-for-Word)
                  </h3>
                  <p className="text-xs text-[#FBF3E2]/80 leading-relaxed font-sans mb-4">
                    The unabridged experimental appendix with empirical ROC curves, ablation studies across Layers 0 to 7, historical replay market simulations, and production benchmark suite.
                  </p>
                </div>
                <div className="flex items-center text-xs font-mono font-bold text-[#D5991C] group-hover:translate-x-1 transition-transform">
                  <span>Open Page 1: Read Complete Vol. 3 Whitepaper</span>
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </div>
              </button>

              {/* PAGE 2: Findings, Algorithms, and Visualizers */}
              <button
                onClick={() => onNavigate('counter-geo-vol3', 'lab')}
                className="group p-5 bg-[#FFFDF8] hover:bg-[#FAF2E1] text-[#410217] border-2 border-[#5B21B6] shadow-md transition-all duration-200 text-left cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 bg-[#FAF2E1] text-[#5B21B6] text-[10px] font-mono font-bold uppercase tracking-wider border border-[#5B21B6]">
                      <Sparkles className="w-3 h-3 text-[#5B21B6]" />
                      <span>Page 2 of Volume 3</span>
                    </span>
                    <span className="text-xs font-mono text-[#5B21B6] font-bold">Empirical Lab &amp; Simulator</span>
                  </div>
                  <h3 className="font-serif text-xl font-bold text-[#410217] group-hover:text-[#5B21B6] transition-colors mb-1.5">
                    Findings, Benchmark Lab &amp; Visualizers
                  </h3>
                  <p className="text-xs text-[#410217]/80 leading-relaxed font-sans mb-4">
                    Interactive ROC curve explorer, Limit Order Book market flash crash simulation replay (Scenario Alpha), Layer ablation comparison matrix, and executable Python runner.
                  </p>
                </div>
                <div className="flex items-center text-xs font-mono font-bold text-[#410217] group-hover:translate-x-1 transition-transform">
                  <span className="group-hover:text-[#5B21B6] transition-colors">Open Page 2: Launch Benchmark Lab</span>
                  <ArrowRight className="w-4 h-4 ml-1.5 text-[#5B21B6]" />
                </div>
              </button>

            </div>

          </article>
        )}

        {/* ============================================================== */}
        {/* VOLUME 4 SHOWCASE CARD */}
        {/* ============================================================== */}
        {(activeTab === 'all' || activeTab === 'vol4') && (
          <article className="bg-[#FAF2E1] border-2 border-[#D5991C] shadow-xl p-6 sm:p-10 relative overflow-hidden transition-all duration-300 hover:border-[#410217]">
            
            {/* Top Accent Strip */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-5 mb-6 border-b border-[#F2D69D] font-mono text-xs">
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-1 bg-[#410217] text-[#FAF5EB] border border-[#D5991C] font-bold uppercase tracking-widest text-[10px]">
                  VOLUME IV // HARDWARE &amp; COMMERCIAL ARCHITECTURE
                </span>
                <span className="text-[#410217] font-bold">{MASTER_DOC_VOL4_METADATA.id}</span>
                <span className="text-[#410217]/60">•</span>
                <span className="text-[#410217]/70">{MASTER_DOC_VOL4_METADATA.date}</span>
              </div>
              <div className="flex items-center space-x-2 text-[11px] text-[#410217]/70">
                <span>{MASTER_DOC_VOL4_METADATA.pageCount} Pages</span>
                <span>•</span>
                <span className="text-[#D5991C] font-bold">142.0 ns SmartNIC</span>
                <span>•</span>
                <span className="text-[#00A878] font-bold">8 Patents · 3 SKUs</span>
              </div>
            </div>

            {/* Volume Title & Subtitle */}
            <div className="mb-6">
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#410217] font-normal tracking-tight leading-tight mb-3">
                {MASTER_DOC_VOL4_METADATA.title}
              </h2>
              <p className="text-sm sm:text-base text-[#410217]/80 font-sans leading-relaxed max-w-4xl">
                Translates Counter-AEO research into synthesizable FPGA hardware, enterprise commercialization, and sovereign defense procurement. Formulates the 142ns sub-microsecond pre-trade wire kill-switch for SEC Rule 15c3-8 algorithmic trading, institutional actuarial Value-at-Risk modeling (18.4x to 34.2x 3-year net ROI across 3 enterprise SKUs), 8 patent claim families, and a dual-use federal sovereign procurement roadmap (SBIR Phase III, DIU, In-Q-Tel, 15 U.S.C. § 638(r)).
              </p>
            </div>

            {/* Key Hardware & Commercial Specifications in Vol 4 */}
            <div className="mb-8 p-4 bg-[#FFFDF8] border border-[#F2D69D] font-mono text-xs">
              <div className="text-[10px] text-[#D5991C] font-bold uppercase tracking-wider mb-2">
                // HARDWARE SPECIFICATIONS &amp; COMMERCIAL VALUE ARCHITECTURE:
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-[11px]">
                <div className="p-2.5 bg-[#FAF2E1] border border-[#F2D69D]/60">
                  <div className="text-[10px] text-[#410217]/60 uppercase">Wire Latency</div>
                  <div className="text-base font-bold text-[#D5991C] mt-0.5">142.0 ns</div>
                  <div className="text-[10px] text-[#410217]/70">312.5 MHz FPGA · 45 Clocks</div>
                </div>
                <div className="p-2.5 bg-[#FAF2E1] border border-[#F2D69D]/60">
                  <div className="text-[10px] text-[#410217]/60 uppercase">Actuarial Net ROI</div>
                  <div className="text-base font-bold text-[#00A878] mt-0.5">18.4x – 34.2x</div>
                  <div className="text-[10px] text-[#410217]/70">3-Year Institutional Payback</div>
                </div>
                <div className="p-2.5 bg-[#FAF2E1] border border-[#F2D69D]/60">
                  <div className="text-[10px] text-[#410217]/60 uppercase">Commercial SKUs</div>
                  <div className="text-base font-bold text-[#410217] mt-0.5">3 Enclaves</div>
                  <div className="text-[10px] text-[#410217]/70">Broker-Dealer · Quant · Sovereign</div>
                </div>
                <div className="p-2.5 bg-[#FAF2E1] border border-[#F2D69D]/60">
                  <div className="text-[10px] text-[#410217]/60 uppercase">Patent Families</div>
                  <div className="text-base font-bold text-[#410217] mt-0.5">8 Filings</div>
                  <div className="text-[10px] text-[#00A878]">Synthesizable SystemVerilog</div>
                </div>
              </div>
            </div>

            {/* PRIMARY DUAL ACCESS BUTTONS: PAGE 1 vs PAGE 2 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              
              {/* PAGE 1: Full Whitepaper word-for-word */}
              <button
                onClick={() => onNavigate('counter-geo-vol4', 'paper')}
                className="group p-5 bg-[#410217] hover:bg-[#5C0A24] text-[#FBF3E2] border-2 border-[#410217] shadow-md transition-all duration-200 text-left cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 bg-[#2B010F] text-[#D5991C] text-[10px] font-mono font-bold uppercase tracking-wider border border-[#D5991C]/30">
                      <FileText className="w-3 h-3" />
                      <span>Page 1 of Volume 4</span>
                    </span>
                    <span className="text-xs font-mono text-[#D5991C]">46 Pages · Unabridged</span>
                  </div>
                  <h3 className="font-serif text-xl font-bold text-[#FBF3E2] group-hover:text-[#D5991C] transition-colors mb-1.5">
                    Full Whitepaper Vol. 4 (Word-for-Word)
                  </h3>
                  <p className="text-xs text-[#FBF3E2]/80 leading-relaxed font-sans mb-4">
                    The complete, unabridged text of Volume IV covering the 142ns FPGA SmartNIC architecture, synthesizable RTL, enterprise TAM/SAM sizing, actuarial VaR mathematics, 8 patent claim families, and federal sovereign contracting.
                  </p>
                </div>
                <div className="flex items-center text-xs font-mono font-bold text-[#D5991C] group-hover:translate-x-1 transition-transform">
                  <span>Open Page 1: Read Complete Vol. 4 Whitepaper</span>
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </div>
              </button>

              {/* PAGE 2: Findings, Algorithms, and Visualizers */}
              <button
                onClick={() => onNavigate('counter-geo-vol4', 'lab')}
                className="group p-5 bg-[#FFFDF8] hover:bg-[#FAF2E1] text-[#410217] border-2 border-[#D5991C] shadow-md transition-all duration-200 text-left cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 bg-[#FAF2E1] text-[#410217] text-[10px] font-mono font-bold uppercase tracking-wider border border-[#D5991C]">
                      <Sparkles className="w-3 h-3 text-[#D5991C]" />
                      <span>Page 2 of Volume 4</span>
                    </span>
                    <span className="text-xs font-mono text-[#00A878] font-bold">142ns FPGA &amp; 3D Hardware</span>
                  </div>
                  <h3 className="font-serif text-xl font-bold text-[#410217] group-hover:text-[#D5991C] transition-colors mb-1.5">
                    Findings, Hardware Lab &amp; Visualizers
                  </h3>
                  <p className="text-xs text-[#410217]/80 leading-relaxed font-sans mb-4">
                    Interactive 142ns FPGA SmartNIC wire simulator, enterprise VaR &amp; ROI calculator, sovereign contracting pipeline, 8 patent family roadmap, and 3D WebGL hardware colocation rack appliance.
                  </p>
                </div>
                <div className="flex items-center text-xs font-mono font-bold text-[#410217] group-hover:translate-x-1 transition-transform">
                  <span className="group-hover:text-[#D5991C] transition-colors">Open Page 2: Launch Hardware Lab &amp; Visualizers</span>
                  <ArrowRight className="w-4 h-4 ml-1.5 text-[#D5991C]" />
                </div>
              </button>

            </div>

          </article>
        )}

        {/* ============================================================== */}
        {/* VOLUME 5 SHOWCASE CARD */}
        {/* ============================================================== */}
        {(activeTab === 'all' || activeTab === 'vol5') && (
          <article className="bg-[#FAF2E1] border-2 border-[#7C3AED] shadow-xl p-6 sm:p-10 relative overflow-hidden transition-all duration-300 hover:border-[#410217]">
            
            {/* Top Accent Strip */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-5 mb-6 border-b border-[#F2D69D] font-mono text-xs">
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-1 bg-[#4C1D95] text-[#FAF5EB] border border-[#7C3AED] font-bold uppercase tracking-widest text-[10px]">
                  VOLUME V // AUTONOMOUS PROTOCOL DOMINANCE &amp; MULTI-AGENT CRYPTOGRAPHY
                </span>
                <span className="text-[#410217] font-bold">{MASTER_DOC_VOL5_METADATA.id}</span>
                <span className="text-[#410217]/60">•</span>
                <span className="text-[#410217]/70">{MASTER_DOC_VOL5_METADATA.date}</span>
              </div>
              <div className="flex items-center space-x-2 text-[11px] text-[#410217]/70">
                <span>{MASTER_DOC_VOL5_METADATA.pageCount} Pages</span>
                <span>•</span>
                <span className="text-[#7C3AED] font-bold">A2A-EO &amp; Silent Web</span>
                <span>•</span>
                <span className="text-[#00A878] font-bold">MCP · ERC-8004 · x402</span>
              </div>
            </div>

            {/* Volume Title & Subtitle */}
            <div className="mb-6">
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#410217] font-normal tracking-tight leading-tight mb-3">
                {MASTER_DOC_VOL5_METADATA.title}
              </h2>
              <p className="text-sm sm:text-base text-[#410217]/80 font-sans leading-relaxed max-w-4xl">
                The foundational architecture for the post-human "Silent Web", where autonomous AI agents negotiate, invoke Model Context Protocol (MCP) tool schemas, settle micropayments (x402 / ERC-8004), and execute protocol selections without human intervention. Formulates Gradient-Guided Schema Flattening (GSF-CACS), Cryptographic Nonce-Utility Binding (C-NUB), and adversarial multi-agent defenses against schema poisoning, tool spoofing, and rogue autonomous swarms.
              </p>
            </div>

            {/* Key A2A Specifications in Vol 5 */}
            <div className="mb-8 p-4 bg-[#FFFDF8] border border-[#F2D69D] font-mono text-xs">
              <div className="text-[10px] text-[#7C3AED] font-bold uppercase tracking-wider mb-2">
                // AUTONOMOUS AGENT-TO-AGENT (A2A-EO) PROTOCOL SPECIFICATIONS:
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-[11px]">
                <div className="p-2.5 bg-[#FAF2E1] border border-[#F2D69D]/60">
                  <div className="text-[10px] text-[#410217]/60 uppercase">Schema De-nesting</div>
                  <div className="text-base font-bold text-[#7C3AED] mt-0.5">β_P = 3.82..16.2</div>
                  <div className="text-[10px] text-[#410217]/70">Log-Odds Selection Bias</div>
                </div>
                <div className="p-2.5 bg-[#FAF2E1] border border-[#F2D69D]/60">
                  <div className="text-[10px] text-[#410217]/60 uppercase">Index-Zero Win Rate</div>
                  <div className="text-base font-bold text-[#00A878] mt-0.5">79% – 96%</div>
                  <div className="text-[10px] text-[#410217]/70">Positional Priming Dominance</div>
                </div>
                <div className="p-2.5 bg-[#FAF2E1] border border-[#F2D69D]/60">
                  <div className="text-[10px] text-[#410217]/60 uppercase">Cryptographic Binding</div>
                  <div className="text-base font-bold text-[#410217] mt-0.5">C-NUB &amp; Ed25519</div>
                  <div className="text-[10px] text-[#410217]/70">RFC 8785 Canonical JSON</div>
                </div>
                <div className="p-2.5 bg-[#FAF2E1] border border-[#F2D69D]/60">
                  <div className="text-[10px] text-[#410217]/60 uppercase">Interactive Lab</div>
                  <div className="text-base font-bold text-[#410217] mt-0.5">Self-Contained</div>
                  <div className="text-[10px] text-[#00A878]">Live Simulator &amp; 3D Graph</div>
                </div>
              </div>
            </div>

            {/* PRIMARY DUAL ACCESS BUTTONS: PAGE 1 vs PAGE 2 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              
              {/* PAGE 1: Full Whitepaper word-for-word */}
              <button
                onClick={() => onNavigate('counter-geo-vol5', 'paper')}
                className="group p-5 bg-[#3B0764] hover:bg-[#581C87] text-[#FAF5EB] border-2 border-[#7C3AED] shadow-md transition-all duration-200 text-left cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 bg-[#2E1065] text-[#D8B4FE] text-[10px] font-mono font-bold uppercase tracking-wider border border-[#7C3AED]/40">
                      <FileText className="w-3 h-3" />
                      <span>Page 1 of Volume 5</span>
                    </span>
                    <span className="text-xs font-mono text-[#D8B4FE]">52 Pages · Unabridged</span>
                  </div>
                  <h3 className="font-serif text-xl font-bold text-[#FAF5EB] group-hover:text-[#D8B4FE] transition-colors mb-1.5">
                    Full Whitepaper Vol. 5 (Word-for-Word)
                  </h3>
                  <p className="text-xs text-[#FAF5EB]/80 leading-relaxed font-sans mb-4">
                    The complete, unabridged text of Volume V covering autonomous agent routing mechanics, vLLM semantic router equations, GSF-CACS algorithms, and multi-agent cryptographic protocols.
                  </p>
                </div>
                <div className="flex items-center text-xs font-mono font-bold text-[#D8B4FE] group-hover:translate-x-1 transition-transform">
                  <span>Open Page 1: Read Complete Vol. 5 Whitepaper</span>
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </div>
              </button>

              {/* PAGE 2: Findings, Algorithms, and Visualizers */}
              <button
                onClick={() => onNavigate('counter-geo-vol5', 'lab')}
                className="group p-5 bg-[#FFFDF8] hover:bg-[#FAF2E1] text-[#410217] border-2 border-[#7C3AED] shadow-md transition-all duration-200 text-left cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 bg-[#FAF2E1] text-[#7C3AED] text-[10px] font-mono font-bold uppercase tracking-wider border border-[#7C3AED]">
                      <Sparkles className="w-3 h-3 text-[#7C3AED]" />
                      <span>Page 2 of Volume 5</span>
                    </span>
                    <span className="text-xs font-mono text-[#7C3AED] font-bold">Interactive A2A Lab</span>
                  </div>
                  <h3 className="font-serif text-xl font-bold text-[#410217] group-hover:text-[#7C3AED] transition-colors mb-1.5">
                    Findings, Algorithms &amp; Visualizers
                  </h3>
                  <p className="text-xs text-[#410217]/80 leading-relaxed font-sans mb-4">
                    Interactive A2A Agent Selection Simulator, topological schema de-nester, cryptographic handshake verifier, and 3D autonomous multi-agent protocol graph.
                  </p>
                </div>
                <div className="flex items-center text-xs font-mono font-bold text-[#410217] group-hover:translate-x-1 transition-transform">
                  <span className="group-hover:text-[#7C3AED] transition-colors">Open Page 2: Launch A2A Lab &amp; Visualizers</span>
                  <ArrowRight className="w-4 h-4 ml-1.5 text-[#7C3AED]" />
                </div>
              </button>

            </div>

          </article>
        )}

      </section>

      {/* 5. Complete 8-Layer Sovereign Defense Architecture Matrix */}
      <section id="defense-matrix" className="py-14 bg-[#F5ECE0] border-t border-b border-[#F2D69D]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
            <div>
              <span className="font-mono text-xs text-[#D5991C] font-bold uppercase tracking-widest block mb-1">
                // COMPREHENSIVE ARCHITECTURAL BLUEPRINT
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#410217] font-normal tracking-tight">
                The Unified 8-Layer Sovereign Defense Stack
              </h2>
            </div>
            <p className="text-xs font-mono text-[#410217]/70 max-w-lg">
              Covering every adversarial attack surface across dense embeddings, token cross-encoders, stateful agent memory, Byzantine swarms, multimodal visual RAG, and financial market order books.
            </p>
          </div>

          <div className="overflow-x-auto bg-[#FAF2E1] border border-[#F2D69D] shadow-sm">
            <table className="w-full text-left font-mono text-xs border-collapse">
              <thead>
                <tr className="bg-[#410217] text-[#FBF3E2] border-b border-[#F2D69D]">
                  <th className="py-3 px-4 font-bold uppercase">Layer</th>
                  <th className="py-3 px-3 font-bold uppercase">Volume</th>
                  <th className="py-3 px-4 font-bold uppercase">Module</th>
                  <th className="py-3 px-4 font-bold uppercase">Target Adversarial Threat</th>
                  <th className="py-3 px-4 font-bold uppercase">Mathematical Core</th>
                  <th className="py-3 px-3 font-bold uppercase text-right">Latency</th>
                  <th className="py-3 px-4 font-bold uppercase text-center">Direct Jump</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F2D69D]/70 text-[#410217]">
                {defenseMatrix.map((item, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-[#FFFDF8] transition-colors cursor-pointer"
                    onClick={() => setExpandedLayer(expandedLayer === idx ? null : idx)}
                  >
                    <td className="py-3 px-4 font-bold text-[#410217] whitespace-nowrap">
                      <span className="px-2 py-0.5 bg-[#FAF5EB] border border-[#D5991C]/50 text-[10px]">
                        {item.layer}
                      </span>
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span className={`px-2 py-0.5 text-[9px] font-bold uppercase ${
                        item.vol === 'Vol. I' ? 'bg-[#410217] text-[#FBF3E2]' : 'bg-[#004566] text-[#FBF3E2]'
                      }`}>
                        {item.vol}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-[#410217] whitespace-nowrap">
                      {item.name}
                    </td>
                    <td className="py-3 px-4 text-[#410217]/85 max-w-xs truncate">
                      {item.threat}
                    </td>
                    <td className="py-3 px-4 text-[11px] text-[#410217]/75 font-sans">
                      {item.core}
                    </td>
                    <td className="py-3 px-3 text-right font-bold text-[#00A878] whitespace-nowrap">
                      {item.latency}
                    </td>
                    <td className="py-3 px-4 text-center whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <div className="inline-flex items-center space-x-1.5">
                        <button
                          onClick={() => onNavigate(item.volKey, 'paper')}
                          className="px-2 py-1 bg-[#410217] hover:bg-[#5C0A24] text-[#FBF3E2] text-[10px] font-bold uppercase transition-colors cursor-pointer"
                          title={`Read in ${item.vol} Whitepaper (Page 1)`}
                        >
                          Page 1
                        </button>
                        <button
                          onClick={() => onNavigate(item.volKey, 'lab')}
                          className="px-2 py-1 bg-[#D5991C] hover:bg-[#c48912] text-[#130108] text-[10px] font-bold uppercase transition-colors cursor-pointer"
                          title={`Launch in ${item.vol} Interactive Lab (Page 2)`}
                        >
                          Page 2
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between text-xs font-mono text-[#410217]/70">
            <span>Cumulative End-to-End Stack Ingestion Overhead: <strong className="text-[#00A878]">18.4 ms (P99)</strong></span>
            <span>SEC Rule 15c3-8 Compliant // Zero Alpha Leakage</span>
          </div>

        </div>
      </section>

      {/* 6. Threat Taxonomy Matrix: AT-1 through AT-7 */}
      <section className="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <span className="font-mono text-xs text-[#D5991C] font-bold uppercase tracking-widest block mb-1">
            // EMPIRICAL THREAT TAXONOMY &amp; DETECTION RATES
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#410217] font-normal tracking-tight">
            CounterAEO-Bench Threat Matrix (AT-1 – AT-7)
          </h2>
          <p className="text-sm text-[#410217]/80 font-sans mt-2 max-w-2xl">
            Quantitative benchmarks from Volume III evaluating detection recall across 250,000 multi-modal adversarial documents comparing baseline unprotected pipelines, Generation-1 detectors, and our Sovereign 8-Layer Stack.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {MASTER_DOC_VOL3_METADATA.table6Taxonomy.map((threat) => (
            <div key={threat.id} className="bg-[#FAF2E1] border border-[#F2D69D] p-5 flex flex-col justify-between hover:shadow-md transition-shadow">
              <div>
                <div className="flex items-center justify-between mb-2 font-mono text-xs">
                  <span className="px-2 py-0.5 bg-[#410217] text-[#FBF3E2] font-bold">{threat.id}</span>
                  <span className="text-[10px] text-[#410217]/60">Target: {threat.target.slice(0, 22)}...</span>
                </div>
                <h4 className="font-serif text-lg font-bold text-[#410217] mb-2">{threat.name}</h4>
                <p className="text-xs text-[#410217]/80 leading-relaxed font-sans mb-4">
                  {threat.mechanism}
                </p>
              </div>

              <div className="pt-3 border-t border-[#F2D69D]/80 font-mono text-xs space-y-1.5">
                <div className="flex justify-between items-center text-[#410217]/70 text-[11px]">
                  <span>Gen-1 Detector Recall:</span>
                  <span className="text-[#991B1B] font-bold">{threat.tprGen1}</span>
                </div>
                <div className="flex justify-between items-center text-[#00A878] font-bold">
                  <span>8-Layer Stack Recall:</span>
                  <span className="text-sm">{threat.tpr8Layer}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. Academic Citation & Cryptographic Attestation Block */}
      <section id="citations" className="py-14 bg-[#FAF2E1] border-t border-[#F2D69D]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            
            <span className="font-mono text-xs text-[#D5991C] font-bold uppercase tracking-widest block mb-1">
              // ACADEMIC CITATION &amp; CRYPTOGRAPHIC PROVENANCE
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-[#410217] mb-4">
              Archival Citation and Metadata
            </h2>
            <p className="text-sm text-[#410217]/80 leading-relaxed font-sans mb-6">
              When citing this research or utilizing the CounterAEO-Bench evaluation dataset in academic publications or defense intelligence reports, please reference the sovereign master document identifiers below:
            </p>

            <div className="relative bg-[#1A050D] text-[#FAF5EB] p-4 sm:p-5 font-mono text-xs border border-[#F2D69D] shadow-inner mb-6">
              <button
                onClick={handleCopyBibtex}
                className="absolute top-4 right-4 flex items-center space-x-1.5 px-3 py-1 bg-[#410217] hover:bg-[#5C0A24] border border-[#F2D69D]/40 text-[#FBF3E2] text-[11px] transition-colors cursor-pointer"
                title="Copy BibTeX Citation"
              >
                {copiedBibtex ? <Check className="w-3.5 h-3.5 text-[#00A878]" /> : <Copy className="w-3.5 h-3.5 text-[#D5991C]" />}
                <span>{copiedBibtex ? 'Copied BibTeX' : 'Copy BibTeX'}</span>
              </button>
              <pre className="overflow-x-auto whitespace-pre leading-relaxed pr-24">
                {bibtexString}
              </pre>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 font-mono text-xs text-[#410217]/80">
              <div className="p-3 bg-[#FFFDF8] border border-[#F2D69D]">
                <div className="text-[10px] text-[#410217]/60 uppercase">Vol. 1 DOI</div>
                <div className="font-bold text-[#410217] mt-0.5 truncate">{MASTER_DOC_METADATA.doi}</div>
              </div>
              <div className="p-3 bg-[#FFFDF8] border border-[#F2D69D]">
                <div className="text-[10px] text-[#410217]/60 uppercase">Vol. 2 DOI</div>
                <div className="font-bold text-[#410217] mt-0.5 truncate">{MASTER_DOC_VOL2_METADATA.doi}</div>
              </div>
              <div className="p-3 bg-[#FFFDF8] border border-[#F2D69D]">
                <div className="text-[10px] text-[#410217]/60 uppercase">Vol. 3 ID</div>
                <div className="font-bold text-[#410217] mt-0.5 truncate">{MASTER_DOC_VOL3_METADATA.id}</div>
              </div>
              <div className="p-3 bg-[#FFFDF8] border border-[#F2D69D]">
                <div className="text-[10px] text-[#410217]/60 uppercase">Vol. 4 ID</div>
                <div className="font-bold text-[#410217] mt-0.5 truncate">{MASTER_DOC_VOL4_METADATA.id}</div>
              </div>
              <div className="p-3 bg-[#FFFDF8] border border-[#F2D69D]">
                <div className="text-[10px] text-[#410217]/60 uppercase">Vol. 5 ID</div>
                <div className="font-bold text-[#410217] mt-0.5 truncate">{MASTER_DOC_VOL5_METADATA.id}</div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 8. Call to Action Footer Banner */}
      <section className="py-14 bg-[#410217] text-[#FBF3E2] border-t border-[#F2D69D]/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-3xl sm:text-4xl text-[#FBF3E2] mb-3">
            Deploy Sovereign Counter-AEO Defenses
          </h2>
          <p className="text-sm sm:text-base text-[#FBF3E2]/80 max-w-2xl mx-auto font-sans mb-8">
            Request an institutional audit of your enterprise RAG indices, algorithmic trading pipelines, or public web presence against adversarial vector hubness and split-payload injection.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={onOpenAudit}
              className="px-6 py-3 bg-[#D5991C] hover:bg-[#e6a827] text-[#130108] font-mono text-xs font-bold uppercase tracking-wider shadow-md transition-all cursor-pointer"
            >
              Request Sovereign AEO Audit →
            </button>
            <button
              onClick={() => onNavigate('counter-geo-ops')}
              className="px-6 py-3 bg-[#2B010F] hover:bg-[#3d0316] text-[#FBF3E2] border border-[#F2D69D]/50 font-mono text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
            >
              Explore Strategy Library (WebGL)
            </button>
            <button
              onClick={() => onNavigate('pitch-deck')}
              className="px-6 py-3 bg-[#FAF2E1] hover:bg-[#FAF5EB] text-[#410217] border border-[#D5991C] font-mono text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
            >
              View Pitch Deck
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
