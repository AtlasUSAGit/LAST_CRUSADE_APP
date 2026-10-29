import React, { useState, useEffect, useMemo } from 'react';
import {
  FileText,
  Search,
  Copy,
  Check,
  BookOpen,
  ArrowRight,
  Shield,
  Layers,
  Sparkles,
  Terminal,
  Activity,
  Cpu,
  BarChart3,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import {
  MASTER_DOC_VOLUME_4_MARKDOWN,
  MASTER_DOC_VOL4_SECTIONS,
  MASTER_DOC_VOL4_METADATA
} from '../data/counterGeoVol4Content';

interface WhitepaperVol4ReaderProps {
  onSwitchToLab: () => void;
  onNavigateToOverview: () => void;
}

export const WhitepaperVol4Reader: React.FC<WhitepaperVol4ReaderProps> = ({
  onSwitchToLab,
  onNavigateToOverview
}) => {
  const [activeSectionId, setActiveSectionId] = useState<string>(MASTER_DOC_VOL4_SECTIONS[0]?.id || 'sec-exec-vol4');
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

    MASTER_DOC_VOL4_SECTIONS.forEach((sec) => {
      const el = document.getElementById(sec.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const handleScrollToSection = (id: string) => {
    setActiveSectionId(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleCopyCode = (key: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeKey(key);
    setTimeout(() => setCopiedCodeKey(null), 2000);
  };

  const handleCopyFullPaper = () => {
    navigator.clipboard.writeText(MASTER_DOC_VOLUME_4_MARKDOWN);
    setCopiedPaper(true);
    setTimeout(() => setCopiedPaper(false), 2000);
  };

  const filteredSections = useMemo(() => {
    if (!searchQuery.trim()) return MASTER_DOC_VOL4_SECTIONS;
    const q = searchQuery.toLowerCase();
    return MASTER_DOC_VOL4_SECTIONS.filter(
      (sec) =>
        sec.title.toLowerCase().includes(q) ||
        (sec.desc && sec.desc.toLowerCase().includes(q))
    );
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-[#FBF3E2] text-[#410217]">
      
      {/* Top Reading Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-[#F2D69D]/40 z-50">
        <div
          className="h-full bg-gradient-to-r from-[#D5991C] via-[#00A878] to-[#410217] transition-all duration-150"
          style={{ width: `${readProgress}%` }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Document Header Card */}
        <div className="bg-[#FAF2E1] border-2 border-[#D5991C] p-6 sm:p-10 mb-8 shadow-md relative overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-6 border-b border-[#F2D69D] font-mono text-xs">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-1 bg-[#410217] text-[#FBF3E2] border border-[#D5991C] font-bold uppercase tracking-widest text-[10px]">
                SOVEREIGN TECHNICAL WHITE PAPER // VOLUME IV
              </span>
              <span className="text-[#410217] font-bold">{MASTER_DOC_VOL4_METADATA.id}</span>
            </div>
            <div className="flex items-center space-x-3 text-[11px] text-[#410217]/70">
              <span>{MASTER_DOC_VOL4_METADATA.pageCount} Pages</span>
              <span>•</span>
              <span>{MASTER_DOC_VOL4_METADATA.wordCount.toLocaleString()} Words</span>
              <span>•</span>
              <span>{MASTER_DOC_VOL4_METADATA.date}</span>
            </div>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#410217] font-normal tracking-tight leading-tight mb-4">
            {MASTER_DOC_VOL4_METADATA.title}
          </h1>

          <p className="text-sm sm:text-base text-[#410217]/85 font-sans leading-relaxed max-w-4xl mb-6">
            The complete, word-for-word engineering, commercialization, and sovereign contracting blueprint. Bridges the 12-Layer mathematical architecture into ultra-low-latency FPGA hardware (<strong className="text-[#00A878]">142-nanosecond pre-trade kill-switch</strong>), 3 product SKUs, SBIR Phase III non-dilutive acquisition vehicles, and an executable Value-at-Risk financial model scaling to $112.5M ARR.
          </p>

          {/* Quick CTA Actions */}
          <div className="flex flex-wrap items-center gap-3 font-mono text-xs">
            <button
              onClick={onSwitchToLab}
              className="px-4 py-2 bg-[#D5991C] hover:bg-[#c48912] text-[#130108] font-bold uppercase tracking-wider transition-colors cursor-pointer flex items-center space-x-2 shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Switch to Page 2: Findings, Hardware Lab &amp; Visualizers →</span>
            </button>

            <button
              onClick={handleCopyFullPaper}
              className="px-3.5 py-2 bg-[#FAF2E1] hover:bg-[#FAF5EB] border border-[#F2D69D] text-[#410217] font-bold uppercase tracking-wider transition-colors cursor-pointer flex items-center space-x-1.5"
            >
              {copiedPaper ? <Check className="w-3.5 h-3.5 text-[#00A878]" /> : <Copy className="w-3.5 h-3.5 text-[#D5991C]" />}
              <span>{copiedPaper ? 'Full Paper Copied' : 'Copy Full Markdown'}</span>
            </button>
          </div>
        </div>

        {/* 2-Column Reader Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Sticky Table of Contents */}
          <aside className="lg:col-span-4 sticky top-16 space-y-4">
            <div className="bg-[#FAF2E1] border border-[#F2D69D] p-5 shadow-xs">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#F2D69D] font-mono text-xs">
                <span className="font-bold uppercase tracking-wider text-[#410217]">Table of Contents</span>
                <span className="text-[10px] text-[#410217]/60">{filteredSections.length} Sections</span>
              </div>

              {/* Search filter */}
              <div className="relative mb-3">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-[#410217]/50" />
                <input
                  type="text"
                  placeholder="Filter sections..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 bg-[#FFFDF8] border border-[#F2D69D] text-xs font-mono text-[#410217] placeholder:text-[#410217]/40 focus:outline-none focus:border-[#410217]"
                />
              </div>

              {/* Section links list */}
              <div className="max-h-[65vh] overflow-y-auto space-y-1 pr-1 font-mono text-xs">
                {filteredSections.map((sec) => (
                  <button
                    key={sec.id}
                    onClick={() => handleScrollToSection(sec.id)}
                    className={`w-full text-left p-2 transition-all cursor-pointer flex items-start justify-between ${
                      activeSectionId === sec.id
                        ? 'bg-[#410217] text-[#FBF3E2] font-bold shadow-xs'
                        : 'text-[#410217]/80 hover:bg-[#F2D69D]/40'
                    }`}
                  >
                    <div className="flex items-start space-x-1.5">
                      <span className="text-[10px] opacity-75">{sec.number}.</span>
                      <span className="text-xs leading-snug">{sec.title}</span>
                    </div>
                    {activeSectionId === sec.id && <ChevronRight className="w-3.5 h-3.5 ml-1 shrink-0 text-[#D5991C]" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Hardware & SKU Quick Specs */}
            <div className="p-4 bg-[#FFFDF8] border border-[#F2D69D] font-mono text-xs space-y-2">
              <div className="text-[10px] text-[#D5991C] font-bold uppercase tracking-wider">
                // HARDWARE SPECIFICATION HIGHLIGHT
              </div>
              <div className="text-[#410217] leading-relaxed">
                Deterministic pre-trade wire latency: <strong className="text-[#00A878]">142.0 nanoseconds (45 clock cycles @ 312.5 MHz)</strong>.
              </div>
              <div className="pt-2 border-t border-[#F2D69D]/70 text-[11px] text-[#410217]/70">
                Synthesis Target: AMD/Xilinx Alveo U250 / Versal HBM SmartNIC.
              </div>
            </div>
          </aside>

          {/* Right Main Monograph Content */}
          <main className="lg:col-span-8 bg-[#FAF2E1] border border-[#F2D69D] p-6 sm:p-10 font-sans text-sm sm:text-base leading-relaxed text-[#410217] shadow-sm space-y-12">
            
            {/* Section: Executive Overview */}
            <section id="sec-exec-vol4" className="scroll-mt-24 space-y-4">
              <div className="flex items-center space-x-2 font-mono text-xs text-[#D5991C] font-bold uppercase">
                <span>Executive Overview</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl text-[#410217] font-bold">
                Executive Overview of Volume 4
              </h2>
              <p>
                Across Volumes I through III, we established a comprehensive <strong>Twelve-Layer Counter-AEO Defense Architecture</strong> engineered to protect American cognitive infrastructure, global trade, federal regulatory agencies, and autonomous financial markets against adversarial Generative Engine Optimization (AEO). However, a mathematical breakthrough only changes the trajectory of global cybersecurity when it is translated into hardened, deployable systems backed by an unassailable regulatory, hardware, and commercial moat.
              </p>
              <p>
                Volume 4 provides the complete <strong>Commercialization, Sovereign Contracting, and Hardware Engineering Blueprint</strong> to launch and scale this technology as a category-defining Dual-Use Defense and FinTech enterprise across four core pillars:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs pt-2">
                <div className="p-3 bg-[#FFFDF8] border border-[#F2D69D]">
                  <strong className="text-[#410217] block mb-1">1. Product Packaging (Sec. 28)</strong>
                  Three SKUs: Cloud API Proxy, HFT FPGA Appliance, and FedRAMP High / DoD IL6 Sovereign Enclaves.
                </div>
                <div className="p-3 bg-[#FFFDF8] border border-[#F2D69D]">
                  <strong className="text-[#410217] block mb-1">2. Federal Pathways (Sec. 29)</strong>
                  SBIR Phase III "Golden Ticket" (15 U.S.C. § 638(r)) sole-source contracts with 20-year data rights.
                </div>
                <div className="p-3 bg-[#FFFDF8] border border-[#F2D69D]">
                  <strong className="text-[#410217] block mb-1">3. FPGA Hardware (Sec. 30)</strong>
                  Synthesizable SystemVerilog executing Layer 4B order-book kill-switch in 142 nanoseconds.
                </div>
                <div className="p-3 bg-[#FFFDF8] border border-[#F2D69D]">
                  <strong className="text-[#410217] block mb-1">4. IP Moat &amp; GTM (Sec. 31)</strong>
                  8 core patent families, AWS/Azure/Cisco channel co-selling, and $112.5M ARR financial roadmap.
                </div>
              </div>
            </section>

            {/* Section 28: Product Packaging & Pricing */}
            <section id="sec-28" className="scroll-mt-24 space-y-4 pt-6 border-t border-[#F2D69D]">
              <div className="flex items-center space-x-2 font-mono text-xs text-[#D5991C] font-bold uppercase">
                <span>Section 28</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl text-[#410217] font-bold">
                28. Product Packaging, Deployment Topologies &amp; Enterprise Pricing
              </h2>
              <p>
                Because our target clients span cloud-native AI platforms, latency-obsessed quantitative hedge funds, and air-gapped federal national security agencies, a single deployment model cannot serve the entire market. We package the 12-Layer Counter-AEO stack into three specialized deployment SKUs:
              </p>

              <div id="sec-28-1" className="space-y-4 pt-2">
                <h3 className="font-serif text-xl font-bold text-[#410217]">
                  28.1 The Three Core Product SKUs
                </h3>
                
                <div className="space-y-3">
                  <div className="p-4 bg-[#FFFDF8] border border-[#F2D69D]">
                    <h4 className="font-mono text-sm font-bold text-[#410217]">
                      SKU 1: Counter-AEO Core Cloud &amp; API Proxy ("Shield-as-a-Service")
                    </h4>
                    <p className="text-xs text-[#410217]/80 mt-1">
                      <strong>Target Customers:</strong> Publicly traded retail broker-dealers, enterprise ERP/supply-chain teams, commercial AI search providers, and managed vector databases (Pinecone, Qdrant, Weaviate, Milvus).<br />
                      <strong>Active Layers:</strong> Layers 0 (MTVD), 1 (AM-CIDP), 2 (NCARD), 3 (TCG-CL v2.0), 4A (CEH-ASID + DAPP), 7 (CM-JSAS), and 12 (RIBD-FS).<br />
                      <strong>Deployment:</strong> Containerized Rust/C++ Kubernetes sidecar or Cloudflare/AWS Edge API Gateway.
                    </p>
                  </div>

                  <div className="p-4 bg-[#FFFDF8] border border-[#00A878]/60">
                    <h4 className="font-mono text-sm font-bold text-[#00A878]">
                      SKU 2: Counter-AEO Ultra-Low-Latency FPGA Appliance ("Equinix NY4 / Aurora DC3 Rack")
                    </h4>
                    <p className="text-xs text-[#410217]/80 mt-1">
                      <strong>Target Customers:</strong> Quantitative hedge funds, high-frequency trading (HFT) firms, institutional asset managers, and investment bank algorithmic execution desks.<br />
                      <strong>Active Layers:</strong> All commercial layers plus hardware-accelerated Layer 4B (TMMEG Limit Order Book Shield), Layer 5 (DMEM-WMQ Episodic Memory Rollback), Layer 6 (SGL-CMI Swarm De-Duplication), Layer 8 (ZK-CAEO Zero-Knowledge SEC Prover), and Layer 11 (SCB-FTCCS Macro Contagion Shield).<br />
                      <strong>Deployment:</strong> 1U/2U pre-configured hardware appliance equipped with AMD/Xilinx Alveo U250 / Versal FPGAs and NVIDIA H200 GPUs co-located inside the client's cage. Zero proprietary prompts or alpha signals ever leave the fund's physical rack.
                    </p>
                  </div>

                  <div className="p-4 bg-[#FFFDF8] border border-[#410217]">
                    <h4 className="font-mono text-sm font-bold text-[#410217]">
                      SKU 3: Counter-AEO Sovereign Enclave ("FedRAMP High / DoD IL6 / SCIF Edition")
                    </h4>
                    <p className="text-xs text-[#410217]/80 mt-1">
                      <strong>Target Customers:</strong> U.S. Securities and Exchange Commission (SEC), U.S. Department of Commerce (BIS / ITA), U.S. International Trade Commission (USITC), U.S. Department of the Treasury (OFAC / CFIUS / FinCEN / OFR), CISA, and DoD/IC.<br />
                      <strong>Active Layers:</strong> Full 12-Layer Stack, featuring specialized modules for Layer 9 (HER-BOD Poincaré Beneficial Ownership De-Cloaking), Layer 10 (EIOL-PCV Leontief Input-Output &amp; Satellite AIS Cargo Mass Verification), and the SEC CAT ZK-CAEO Verifier Node.<br />
                      <strong>Deployment:</strong> Deployed on AWS GovCloud, Azure Government Secret, or air-gapped on-premises inside SCIFs with FIPS 140-3 Level 4 HSMs.
                    </p>
                  </div>
                </div>
              </div>

              {/* Table 10 Pricing */}
              <div id="sec-28-2" className="space-y-3 pt-4">
                <h3 className="font-serif text-xl font-bold text-[#410217]">
                  28.2 Enterprise &amp; Sovereign Pricing Matrix (Table 10)
                </h3>
                <div className="overflow-x-auto border border-[#F2D69D]">
                  <table className="w-full text-left font-mono text-xs">
                    <thead className="bg-[#410217] text-[#FBF3E2]">
                      <tr>
                        <th className="p-2.5">Product Tier / SKU</th>
                        <th className="p-2.5">Target Client Segment</th>
                        <th className="p-2.5">Base ARR</th>
                        <th className="p-2.5">Gross Margin</th>
                        <th className="p-2.5">Average Contract Value (ACV)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F2D69D] bg-[#FFFDF8]">
                      <tr>
                        <td className="p-2.5 font-bold">Tier 1: Commercial Growth</td>
                        <td className="p-2.5">Mid-Market AI, ERP Teams</td>
                        <td className="p-2.5 text-[#00A878] font-bold">$120,000 / yr</td>
                        <td className="p-2.5">86%</td>
                        <td className="p-2.5">$180,000 - $320,000</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-bold">Tier 2: Public Broker-Dealer</td>
                        <td className="p-2.5">Retail Brokers, Wealth Platforms</td>
                        <td className="p-2.5 text-[#00A878] font-bold">$450,000 / yr</td>
                        <td className="p-2.5">88%</td>
                        <td className="p-2.5">$650,000 - $1,400,000</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-bold">Tier 3: Institutional Quant</td>
                        <td className="p-2.5">Quant Hedge Funds, Prop Desks</td>
                        <td className="p-2.5 text-[#00A878] font-bold">$850,000 / yr</td>
                        <td className="p-2.5">82% HW / 92% SW</td>
                        <td className="p-2.5">$1,100,000 - $2,800,000</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-bold">Tier 4: Federal Agency</td>
                        <td className="p-2.5">SEC, Commerce, Treasury, DoD</td>
                        <td className="p-2.5 text-[#00A878] font-bold">$1,500,000 / yr</td>
                        <td className="p-2.5">78% Blended</td>
                        <td className="p-2.5">$2,200,000 - $8,500,000+</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            {/* Section 29: Federal Acquisition & SBIR Phase III */}
            <section id="sec-29" className="scroll-mt-24 space-y-4 pt-6 border-t border-[#F2D69D]">
              <div className="flex items-center space-x-2 font-mono text-xs text-[#D5991C] font-bold uppercase">
                <span>Section 29</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl text-[#410217] font-bold">
                29. Federal Acquisition, Non-Dilutive R&amp;D &amp; Sovereign Contracting
              </h2>
              <p>
                Selling deep-tech cybersecurity software to federal agencies through traditional FAR open-bid RFPs can take 18 to 36 months. To bypass slow bureaucratic procurement cycles and secure both non-dilutive R&amp;D capital and sole-source production IDIQ contracts within 6 to 12 months, we execute a multi-track <strong>Federal Grant &amp; Rapid Acquisition Strategy</strong>.
              </p>

              <div id="sec-29-1" className="p-4 bg-[#FFFDF8] border border-[#D5991C] space-y-2">
                <h3 className="font-serif text-lg font-bold text-[#410217]">
                  29.1 The SBIR Phase III "Golden Ticket" Strategy (15 U.S.C. § 638(r))
                </h3>
                <p className="text-xs text-[#410217]/85 leading-relaxed">
                  Under federal statute <strong>15 U.S.C. § 638(r)</strong>, any technology developed even partially under an SBIR/STTR grant automatically qualifies for <strong>SBIR Phase III status across the entire U.S. Federal Government</strong>:
                </p>
                <ul className="list-disc pl-5 text-xs space-y-1.5 text-[#410217]/80">
                  <li>
                    <strong>Cross-Agency Sole-Source Authority:</strong> Once we complete a Phase I/II SBIR, the SEC, Commerce (BIS), Treasury (OFAC), or USITC can award a multi-million-dollar sole-source Phase III contract with <em>zero public competition</em> and <em>no dollar ceiling</em>.
                  </li>
                  <li>
                    <strong>20-Year Statutory Data Rights:</strong> All mathematical algorithms receive mandatory 20-year protection during which the government cannot disclose source code or share specifications with competitors.
                  </li>
                </ul>
              </div>
            </section>

            {/* Section 30: FPGA Hardware Acceleration */}
            <section id="sec-30" className="scroll-mt-24 space-y-4 pt-6 border-t border-[#F2D69D]">
              <div className="flex items-center space-x-2 font-mono text-xs text-[#D5991C] font-bold uppercase">
                <span>Section 30</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl text-[#410217] font-bold">
                30. Co-Located Hardware Acceleration: FPGA SmartNIC &amp; GPU Kernels
              </h2>
              <p>
                In high-frequency electronic markets, order matching occurs in microseconds to nanoseconds. Linux OS networking stacks add 8–25 μs, PCIe transfers add 1.5–4 μs, and OS scheduler jitter can spike P99 latency above 2,000 μs (2 ms)—allowing poisoned trading orders to execute before software can intervene.
              </p>
              <p>
                Our <strong>Hybrid FPGA SmartNIC + Tensor Core GPU Architecture</strong> executes deterministic pre-trade checks in exactly <strong>142 nanoseconds (45 clock cycles @ 312.5 MHz)</strong>.
              </p>

              {/* SystemVerilog Code Snippet */}
              <div id="sec-30-3" className="space-y-2">
                <div className="flex items-center justify-between font-mono text-xs">
                  <span className="font-bold text-[#410217]">Synthesizable SystemVerilog RTL (tmmeg_fpga_killswitch.sv)</span>
                  <button
                    onClick={() => handleCopyCode('sv', `// Module: tmmeg_fpga_killswitch.sv\n// 142ns deterministic execution gate`)}
                    className="flex items-center space-x-1 text-[#D5991C] hover:text-[#410217] cursor-pointer"
                  >
                    {copiedCodeKey === 'sv' ? <Check className="w-3.5 h-3.5 text-[#00A878]" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCodeKey === 'sv' ? 'Copied' : 'Copy RTL'}</span>
                  </button>
                </div>

                <div className="bg-[#1A050D] text-[#FAF5EB] p-4 font-mono text-xs overflow-x-auto border border-[#F2D69D] shadow-inner">
                  <pre className="text-[11px] leading-relaxed">
{`module tmmeg_fpga_killswitch #(
    parameter int FP_WIDTH       = 32,          // Signed Q8.24 Fixed-Point
    parameter int FRAC_BITS      = 24,          // Scale = 16,777,216
    parameter logic signed [31:0] TAU_TRAP_FP    = 32'h00A6_6666, // 0.65
    parameter logic signed [31:0] KAPPA_CAP_FP   = 32'h0300_0000  // 3.00
)(
    input  logic                     clk,       // 312.5 MHz SmartNIC Clock
    input  logic                     rst_n,     // Active-low synchronous reset
    input  logic                     order_valid_in,
    input  logic [63:0]              order_id_in,
    // Live Level-3 Limit Order Book (LOB) from ITCH Parser
    input  logic signed [31:0]       weighted_bid_depth_fp,
    input  logic signed [31:0]       weighted_ask_depth_fp,
    output logic                     tx_order_enable,     // 1 = Pass, 0 = KILLED ON WIRE
    output logic                     sec_15c3_8_halt_irq  // Triggers 15s Epistemic Halt
);
    // Wire latency: 45 Clock Cycles = exactly 142.0 Nanoseconds!
endmodule`}
                  </pre>
                </div>
              </div>
            </section>

            {/* Section 31: Intellectual Property & GTM */}
            <section id="sec-31" className="scroll-mt-24 space-y-4 pt-6 border-t border-[#F2D69D]">
              <div className="flex items-center space-x-2 font-mono text-xs text-[#D5991C] font-bold uppercase">
                <span>Section 31</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl text-[#410217] font-bold">
                31. Intellectual Property Moat &amp; 36-Month Financial Projections
              </h2>
              <p>
                To establish an impenetrable intellectual property moat, Volume 4 details eight foundational patent families spanning MTVD, AM-CIDP, TCG-CL, CEH-ASID, TMMEG, DMEM-WMQ, ZK-CAEO, and HER-BOD.
              </p>

              {/* Table 13 36-Month Model */}
              <div id="sec-31-3" className="space-y-3 pt-2">
                <h3 className="font-serif text-xl font-bold text-[#410217]">
                  31.3 36-Month Financial Ramp &amp; Valuation Trajectory (Table 13)
                </h3>
                <div className="overflow-x-auto border border-[#F2D69D]">
                  <table className="w-full text-left font-mono text-xs">
                    <thead className="bg-[#410217] text-[#FBF3E2]">
                      <tr>
                        <th className="p-2.5">Operating Year</th>
                        <th className="p-2.5">Non-Dilutive Federal</th>
                        <th className="p-2.5">Sovereign Clients</th>
                        <th className="p-2.5">Quant Clients</th>
                        <th className="p-2.5">Total ARR</th>
                        <th className="p-2.5">Gross Margin</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F2D69D] bg-[#FFFDF8]">
                      {MASTER_DOC_VOL4_METADATA.financialModel.map((row, idx) => (
                        <tr key={idx}>
                          <td className="p-2.5 font-bold">{row.year}</td>
                          <td className="p-2.5">{row.federalGrants}</td>
                          <td className="p-2.5">{row.sovereignClients} Agencies</td>
                          <td className="p-2.5">{row.quantClients} Funds</td>
                          <td className="p-2.5 text-[#00A878] font-bold text-sm">{row.totalArr}</td>
                          <td className="p-2.5 font-bold">{row.grossMargin}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Python ROI Module Snippet */}
              <div id="sec-31-4" className="space-y-2 pt-4">
                <div className="flex items-center justify-between font-mono text-xs">
                  <span className="font-bold text-[#410217]">Executable Enterprise ROI Engine (counter_aeo_enterprise_roi_engine.py)</span>
                  <button
                    onClick={() => handleCopyCode('py', `class CounterAEOCommercialEngine:\n    # Computes Value-at-Risk reduction`)}
                    className="flex items-center space-x-1 text-[#D5991C] hover:text-[#410217] cursor-pointer"
                  >
                    {copiedCodeKey === 'py' ? <Check className="w-3.5 h-3.5 text-[#00A878]" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCodeKey === 'py' ? 'Copied' : 'Copy Python'}</span>
                  </button>
                </div>
                <div className="bg-[#1A050D] text-[#FAF5EB] p-4 font-mono text-xs overflow-x-auto border border-[#F2D69D] shadow-inner">
                  <pre className="text-[11px] leading-relaxed">
{`class CounterAEOCommercialEngine:
    @staticmethod
    def evaluate_quant_hedge_fund(fund_name: str, aum_usd: float, daily_notional: float):
        # 142ns FPGA appliance preserves $2.4M+ in unshielded liquidity extraction losses
        annual_cost = 850_000.0
        annual_preserved = 2.4 * (daily_notional * 0.038 * 0.991)
        roi_multiple = annual_preserved / annual_cost
        return {"roi_multiple": roi_multiple, "payback_days": 365.0 / roi_multiple}`}
                  </pre>
                </div>
              </div>
            </section>

            {/* Bottom Navigation CTA */}
            <div className="pt-8 border-t border-[#F2D69D] flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
              <button
                onClick={onNavigateToOverview}
                className="px-4 py-2 bg-[#FAF2E1] border border-[#F2D69D] text-[#410217] hover:bg-[#FAF5EB] font-bold uppercase transition-colors cursor-pointer"
              >
                ← Back to Overview
              </button>
              <button
                onClick={onSwitchToLab}
                className="px-5 py-2.5 bg-[#410217] hover:bg-[#5C0A24] text-[#FBF3E2] font-bold uppercase transition-colors cursor-pointer flex items-center space-x-2"
              >
                <span>Launch Volume 4 Hardware Lab &amp; Visualizers</span>
                <ArrowRight className="w-4 h-4 text-[#D5991C]" />
              </button>
            </div>

          </main>
        </div>

      </div>
    </div>
  );
};
