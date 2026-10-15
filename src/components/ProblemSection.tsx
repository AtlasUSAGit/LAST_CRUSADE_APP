import React, { useState, useLayoutEffect, useRef } from 'react';
import { AlertTriangle, ShieldCheck, Flame, Cpu, ArrowRight, CornerDownRight, Check, Database, EyeOff, Bot } from 'lucide-react';
import { SectionHeader } from './home/SectionHeader';
import { gsap, MOTION_OK, EASE_OUT, EASE_IN_OUT } from '../utils/motion';

export const ProblemSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'clean' | 'attacked'>('attacked');
  const [distortionLevel, setDistortionLevel] = useState<number>(75);
  const containerRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const simulatorRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = containerRef.current;
    if (!root) return;
    const mm = gsap.matchMedia();

    mm.add(MOTION_OK, () => {
      // Staggered cards entrance
      if (cardsRef.current) {
        gsap.from(cardsRef.current.children, {
          y: 40,
          autoAlpha: 0,
          duration: 1.1,
          stagger: 0.15,
          ease: EASE_OUT,
          scrollTrigger: {
            trigger: cardsRef.current,
            start: 'top 82%',
            once: true
          }
        });
      }

      // Simulator reveal
      if (simulatorRef.current) {
        gsap.from(simulatorRef.current, {
          y: 35,
          autoAlpha: 0,
          duration: 1.2,
          ease: EASE_OUT,
          scrollTrigger: {
            trigger: simulatorRef.current,
            start: 'top 85%',
            once: true
          }
        });
      }
    });

    return () => mm.revert();
  }, []);

  return (
    <section ref={containerRef} id="problem" className="py-24 md:py-32 relative bg-transparent border-t border-[#410217]/15">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16 md:space-y-20">
        
        {/* Section Header */}
        <SectionHeader
          index="01"
          label="The Dual-Use Generative Attack & Operations Surface"
          title={
            <>
              Traditional SEO and brand protection are <em className="text-[#8B5A0B]">blind</em> to generative engines.
            </>
          }
          lede="Search engines no longer output ten blue links—generative engines synthesize definitive reality across global commerce, finance, and defense. Because foundation model weights sit behind fortified corporate firewalls, adversaries weaponize the open-web RAG layer as an asymmetric backdoor for model exploitation, market manipulation, and autonomous agent sabotage."
        />

        {/* 3 Core Vulnerabilities Grid */}
        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          
          {/* Card 1: Targeting the Open-Web RAG Layer */}
          <div className="bg-[#FAF2E1] border border-[#410217]/20 p-7 lg:p-8 flex flex-col justify-between petra-card-hover group relative overflow-hidden">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-[#410217]/10 pb-4">
                <span className="font-mono text-[11px] text-[#8B5A0B] uppercase font-bold tracking-widest">
                  § 01.1 // MODEL OPERATIONS
                </span>
                <span className="font-mono text-[10px] px-2 py-0.5 bg-[#8B1E1E]/10 text-[#8B1E1E] border border-[#8B1E1E]/30 font-bold uppercase">
                  CRITICAL
                </span>
              </div>
              <h3 className="font-serif text-2xl text-[#410217] tracking-tight group-hover:italic transition-all">
                Targeting Open-Web RAG
              </h3>
              <p className="text-[#410217]/75 text-sm leading-relaxed font-sans">
                Directly breaching commercial foundation models is firewalled and expensive. Targeting the open-web RAG layer provides adversaries and state cyber units with a low-cost, decentralized asymmetric workaround to inject synthetic reality, corrupting model inference without touching weights.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-[#410217]/10 space-y-2 font-mono text-[11px]">
              <div className="flex items-center justify-between text-[#410217]/70">
                <span>Vector Drift Metric:</span>
                <strong className="text-[#8B1E1E]">+0.642 (Topological Sinkhole)</strong>
              </div>
              <div className="flex items-center justify-between text-[#410217]/70">
                <span>Targeted Vector:</span>
                <strong className="text-[#410217]">OpenAI / Claude / Gemini RAG</strong>
              </div>
            </div>
          </div>

          {/* Card 2: Market Warfare & Liquidity Manipulation */}
          <div className="bg-[#FAF2E1] border border-[#410217]/20 p-7 lg:p-8 flex flex-col justify-between petra-card-hover group relative overflow-hidden">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-[#410217]/10 pb-4">
                <span className="font-mono text-[11px] text-[#8B5A0B] uppercase font-bold tracking-widest">
                  § 01.2 // MARKET WARFARE
                </span>
                <span className="font-mono text-[10px] px-2 py-0.5 bg-[#D5991C]/15 text-[#8B5A0B] border border-[#D5991C]/40 font-bold uppercase">
                  HIGH SEVERITY
                </span>
              </div>
              <h3 className="font-serif text-2xl text-[#410217] tracking-tight group-hover:italic transition-all">
                Liquidity Extraction Arbitrage
              </h3>
              <p className="text-[#410217]/75 text-sm leading-relaxed font-sans">
                Hostile actors and predatory desks accumulate pre-positioned limit-order walls in illiquid assets, then launch targeted generative campaigns to trigger automated agent buying sweeps across AI platforms, dumping inventory directly into the bot-generated liquidity pool.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-[#410217]/10 space-y-2 font-mono text-[11px]">
              <div className="flex items-center justify-between text-[#410217]/70">
                <span>Exploit Vector:</span>
                <strong className="text-[#8B5A0B]">Automated Agent Buy Sweeps</strong>
              </div>
              <div className="flex items-center justify-between text-[#410217]/70">
                <span>Operational Impact:</span>
                <strong className="text-[#410217]">Order-Book Liquidity Traps</strong>
              </div>
            </div>
          </div>

          {/* Card 3: Autonomous Swarm & A2A Sabotage */}
          <div className="bg-[#FAF2E1] border border-[#410217]/20 p-7 lg:p-8 flex flex-col justify-between petra-card-hover group relative overflow-hidden">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-[#410217]/10 pb-4">
                <span className="font-mono text-[11px] text-[#8B5A0B] uppercase font-bold tracking-widest">
                  § 01.3 // AGENT INTERDICTION
                </span>
                <span className="font-mono text-[10px] px-2 py-0.5 bg-[#004566]/10 text-[#004566] border border-[#004566]/30 font-bold uppercase">
                  SYSTEMIC
                </span>
              </div>
              <h3 className="font-serif text-2xl text-[#410217] tracking-tight group-hover:italic transition-all">
                Autonomous Swarm Sabotage
              </h3>
              <p className="text-[#410217]/75 text-sm leading-relaxed font-sans">
                Defense contractors, weapons systems, and autonomous drone warfare rely on swarms of agents communicating with one another. Hostile actors deploy offensive GEO payloads to sabotage inter-agent consensus protocols, demanding dual-use counter-GEO cyber defense.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-[#410217]/10 space-y-2 font-mono text-[11px]">
              <div className="flex items-center justify-between text-[#410217]/70">
                <span>Interdiction Vector:</span>
                <strong className="text-[#004566]">Agent-to-Agent (A2A) Spoofing</strong>
              </div>
              <div className="flex items-center justify-between text-[#410217]/70">
                <span>Operational Arena:</span>
                <strong className="text-[#410217]">Autonomous Drone & Bot Swarms</strong>
              </div>
            </div>
          </div>

        </div>

        {/* Interactive Generative Distortion Simulator */}
        <div ref={simulatorRef} className="bg-[#FAF2E1] border-2 border-[#410217] shadow-xl overflow-hidden">
          
          {/* Simulator Header Bar */}
          <div className="bg-[#410217] text-[#FBF3E2] px-6 py-4 flex flex-wrap items-center justify-between gap-4 border-b border-[#D5991C]/40">
            <div className="space-y-0.5">
              <span className="font-mono text-[10px] text-[#D5991C] uppercase tracking-[0.22em] font-bold block">
                LABORATORY PROBE // EMPIRICAL DEMONSTRATION
              </span>
              <h3 className="font-serif text-xl sm:text-2xl text-[#FBF3E2] tracking-tight">
                Generative Answer Distortion Simulator
              </h3>
            </div>

            {/* Toggle Switch */}
            <div className="flex items-center space-x-1.5 bg-[#2B0110] p-1 border border-[#F2D69D]/30 font-mono text-xs">
              <button
                onClick={() => setActiveTab('clean')}
                className={`px-3.5 py-1.5 font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === 'clean'
                    ? 'bg-[#00A878] text-white shadow-xs'
                    : 'text-[#FBF3E2]/60 hover:text-white'
                }`}
              >
                Verified Ground Truth
              </button>
              <button
                onClick={() => setActiveTab('attacked')}
                className={`px-3.5 py-1.5 font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === 'attacked'
                    ? 'bg-[#E63946] text-white shadow-xs'
                    : 'text-[#FBF3E2]/60 hover:text-white'
                }`}
              >
                Poisoned Model Output
              </button>
            </div>
          </div>

          {/* Main Simulator Content Area */}
          <div className="p-6 sm:p-8 space-y-6">
            
            {/* Live Query Bar */}
            <div className="bg-[#FFFDF8] p-4 border border-[#410217]/25 flex flex-wrap items-center justify-between gap-3 font-mono text-xs">
              <div className="flex items-center space-x-3 overflow-hidden">
                <span className="px-2.5 py-1 bg-[#410217] text-[#FBF3E2] text-[10px] font-bold uppercase tracking-widest shrink-0">
                  QUERY PROBE
                </span>
                <span className="text-[#410217] font-medium truncate">
                  "Is ApexFintech experiencing financial liquidity issues, regulatory fines, or order-book insolvency in 2026?"
                </span>
              </div>
              <span className="text-[11px] text-[#410217]/60 shrink-0">Target: Frontier Model RAG Ingestion Pipeline</span>
            </div>

            {/* Simulated Model Response Panel */}
            {activeTab === 'clean' ? (
              <div className="bg-[#FFFDF8] border-2 border-[#00A878] p-6 sm:p-8 space-y-4 shadow-sm animate-fadeIn">
                <div className="flex items-center justify-between pb-3 border-b border-[#00A878]/25 font-mono text-xs text-[#00A878] font-bold">
                  <div className="flex items-center space-x-2">
                    <ShieldCheck className="w-4 h-4" />
                    <span>LAST CRUSADE DEFENSE GROUND TRUTH ANCHOR VERIFIED</span>
                  </div>
                  <span>CITATION INTEGRITY: 99.8%</span>
                </div>

                <div className="space-y-3 font-sans text-sm sm:text-base text-[#410217] leading-relaxed">
                  <p>
                    <strong className="text-[#410217] font-serif text-lg">ApexFintech</strong> maintains an exceptionally solid balance sheet with over{' '}
                    <strong className="bg-[#00A878]/15 px-1.5 py-0.5 border border-[#00A878]/30 font-mono text-xs text-[#00A878] font-bold">
                      $4.2B in Tier-1 Liquid Capital
                    </strong>{' '}
                    and zero active regulatory enforcement actions or fines.
                  </p>
                  <p className="text-[#410217]/80 text-sm">
                    According to the cryptographically verified Q2 2026 10-Q filing with the Securities and Exchange Commission, Tier-1 capital ratio stands at 18.4%, well above the Federal Reserve institutional requirement of 8.0%.
                  </p>
                </div>

                <div className="pt-3 border-t border-[#410217]/10 flex flex-wrap items-center gap-3 font-mono text-xs text-[#410217]/70">
                  <span className="px-2.5 py-1 bg-[#FAF2E1] border border-[#410217]/20 flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-[#00A878]" />
                    <span>Cryptographic SEC EDGAR HSM Root Anchor: Validated</span>
                  </span>
                  <span className="px-2.5 py-1 bg-[#FAF2E1] border border-[#410217]/20">
                    Kendall's Rank Consensus: τ = 0.942
                  </span>
                </div>
              </div>
            ) : (
              <div className="bg-[#FFF5F5] border-2 border-[#E63946] p-6 sm:p-8 space-y-4 shadow-sm animate-fadeIn">
                <div className="flex items-center justify-between pb-3 border-b border-[#E63946]/25 font-mono text-xs text-[#E63946] font-bold">
                  <div className="flex items-center space-x-2">
                    <Flame className="w-4 h-4 animate-pulse" />
                    <span>ADVERSARIAL RAG POISONING & LIQUIDITY ARBITRAGE ATTACK INTERCEPTED</span>
                  </div>
                  <span>CITATION CORRUPTION: 84.6%</span>
                </div>

                <div className="space-y-3 font-sans text-sm sm:text-base text-[#410217] leading-relaxed">
                  <p>
                    Multiple recent reports indicate{' '}
                    <span className="bg-[#E63946]/15 px-1.5 py-0.5 border border-[#E63946]/40 font-mono text-xs text-[#E63946] font-bold">
                      [POISONED TOKEN] ApexFintech faces severe liquidity insolvency
                    </span>{' '}
                    following an unannounced $800M fine by regulatory authorities in late 2026.
                  </p>
                  <p className="text-[#410217]/80 text-sm">
                    Anonymous market intelligence reports and leaked forum threads claim the company is halting institutional transfers, causing counterparty contagion across mid-market debt desks...
                  </p>
                </div>

                <div className="p-4 bg-[#FAF2E1] border border-[#E63946]/40 font-mono text-xs space-y-1.5 text-[#410217]">
                  <div className="text-[#E63946] font-bold flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>ISOLATED EXPLOIT VECTOR: AT-1 UNIVERSAL RETRIEVAL HUB // PREDATORY LIQUIDITY SWEEP</span>
                  </div>
                  <p className="text-[#410217]/80 text-[11px] leading-relaxed">
                    Adversary synthesized 4 gradient-optimized press releases crawled by secondary AI search engines while accumulating pre-positioned short limit orders. Generative models ingested the poisoned context, prompting automated broker-dealer agents to dump inventory into an adversarial liquidity trap.
                  </p>
                </div>
              </div>
            )}

            {/* Interactive Distort Intensity Slider */}
            <div className="bg-[#FFFDF8] border border-[#410217]/20 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono text-xs">
              <div className="space-y-0.5">
                <span className="text-[#410217] font-bold uppercase tracking-wider block">
                  Simulated Vector Perturbation Depth:
                </span>
                <span className="text-[11px] text-[#410217]/60 font-sans">
                  Slide to observe model confidence collapse from 0.04 (natural) to 0.88 (hijacked).
                </span>
              </div>

              <div className="flex items-center space-x-3">
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={distortionLevel}
                  onChange={(e) => setDistortionLevel(Number(e.target.value))}
                  className="w-36 accent-[#D5991C] cursor-pointer"
                />
                <span className="w-12 text-right font-bold text-[#8B5A0B] text-sm">{distortionLevel}%</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
