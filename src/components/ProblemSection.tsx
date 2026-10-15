import React, { useLayoutEffect, useRef } from 'react';
import { SectionHeader } from './home/SectionHeader';
import { gsap, MOTION_OK, EASE_OUT } from '../utils/motion';

export const ProblemSection: React.FC = () => {
  const containerRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

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

      </div>
    </section>
  );
};
