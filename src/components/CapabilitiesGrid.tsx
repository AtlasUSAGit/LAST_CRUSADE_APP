import React, { useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CAPABILITIES_MATRIX } from '../data/geoData';
import { SectionHeader } from './home/SectionHeader';
import { CheckCircle2, Shield, Network, Cpu, Radar } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const PLATFORM_PILLARS = [
  {
    id: 'pillar-1',
    title: 'AI Search & RAG Defense',
    layers: 'Layers 0–12',
    summary: 'Stops rigged webpages, fake statistics, hidden PDF commands, and botnet echo chambers before AI chatbots quote them.'
  },
  {
    id: 'pillar-2',
    title: 'Agent-to-Agent Discovery',
    layers: 'Layers 13–14',
    summary: 'Flattens tool schemas to win autonomous AI selection reliably while isolating untrusted external tool payloads.'
  },
  {
    id: 'pillar-3',
    title: 'Market Reality & Silicon Gate',
    layers: 'Layers 15–16 + FPGA',
    summary: 'Boosts verified financial signal confidence (+42.55%) while grounding automated trades in live order-book liquidity.'
  },
  {
    id: 'pillar-4',
    title: 'Active Counterintelligence',
    layers: 'Modules CI-1 to CI-8',
    summary: 'Deploys digital watermarks, decoy agent tools, and leak tripwires to trace coordinated attackers back to their source.'
  }
];

export const CapabilitiesGrid: React.FC = () => {
  const rootRef = useRef<HTMLElement>(null);
  const [selectedPillar, setSelectedPillar] = useState<string>('pillar-1');

  useLayoutEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      const cells = el.querySelectorAll<HTMLElement>('[data-cap-cell]');
      gsap.fromTo(
        cells,
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.65,
          stagger: 0.08,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 80%',
            once: true,
          },
        }
      );
    }, el);

    return () => ctx.revert();
  }, []);

  const activePillar = PLATFORM_PILLARS.find((p) => p.id === selectedPillar) || PLATFORM_PILLARS[0];

  return (
    <section
      ref={rootRef}
      className="py-20 md:py-28 bg-transparent border-b border-[#410217]/15 relative z-10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title={
            <>
              Four Pillars &amp; Core Defense Modules{' '}
              <em className="italic text-[#8B5A0B] font-normal">Built for Real-World AI.</em>
            </>
          }
          subtitle="Sixteen protection layers and eight active counterintelligence modules working together across AI search engines, autonomous software agents, and institutional financial infrastructure."
        />

        {/* Interactive 4-Pillar Platform Architecture & Animated SVG Flow */}
        <div className="mb-12 rounded-2xl bg-[#24010d]/50 border border-[#D5991C]/40 p-6 sm:p-8 shadow-xl space-y-6 backdrop-blur-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {PLATFORM_PILLARS.map((pillar, idx) => {
              const isSelected = pillar.id === selectedPillar;
              return (
                <button
                  key={pillar.id}
                  onClick={() => setSelectedPillar(pillar.id)}
                  className={`text-left p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#350213] border-[#D5991C] shadow-md'
                      : 'bg-[#1a0009]/80 border-[#F2D69D]/20 hover:border-[#D5991C]/50'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-mono font-bold text-[#D5991C]">Pillar 0{idx + 1}</span>
                    <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#410217] text-[#00FF9D] border border-[#00A878]/40">
                      {pillar.layers}
                    </span>
                  </div>
                  <div className="font-serif text-lg font-bold text-[#FBF3E2] leading-snug">
                    {pillar.title}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="p-4 rounded-xl bg-[#180008] border border-[#F2D69D]/20 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="space-y-1 max-w-xl">
              <div className="text-xs font-mono uppercase text-[#00FF9D] font-bold">
                {activePillar.title} · {activePillar.layers}
              </div>
              <p className="text-sm text-[#FBF3E2]/90 leading-relaxed">
                {activePillar.summary}
              </p>
            </div>
            <div className="flex items-center space-x-3 text-xs font-mono text-[#F2D69D]">
              <span className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#2d0110] border border-[#D5991C]/35">
                <Network className="w-3.5 h-3.5 text-[#D5991C]" />
                <span>Human Web + Silent Web</span>
              </span>
              <span className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#2d0110] border border-[#00A878]/35 text-[#00FF9D]">
                <Cpu className="w-3.5 h-3.5" />
                <span>142ns FPGA Ready</span>
              </span>
              <span className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#2d0110] border border-[#7C3AED]/45 text-[#C4B5FD]">
                <Radar className="w-3.5 h-3.5" />
                <span>CI-1 to CI-8</span>
              </span>
            </div>
          </div>

          {/* Animated SVG End-to-End Platform Shield Pipeline */}
          <div className="bg-[#180008] border border-[#F2D69D]/15 rounded-xl p-3 overflow-hidden">
            <svg viewBox="0 0 860 110" className="w-full h-auto block" role="img" aria-label="Sentinel Platform Unified Flow">
              <defs>
                <linearGradient id="capFlowGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#D5991C" />
                  <stop offset="50%" stopColor="#00FF9D" />
                  <stop offset="100%" stopColor="#B565FF" />
                </linearGradient>
              </defs>
              <line x1="90" y1="55" x2="770" y2="55" stroke="url(#capFlowGrad)" strokeWidth="2.5" strokeDasharray="6 4">
                <animate attributeName="stroke-dashoffset" from="20" to="0" dur="1.2s" repeatCount="indefinite" />
              </line>
              <circle r="4" cy="55" fill="#00FF9D">
                <animate attributeName="cx" values="95;310;540;760" dur="2.2s" repeatCount="indefinite" />
              </circle>
              <rect x="20" y="20" width="175" height="70" rx="8" fill="#2d0110" stroke="#D5991C" strokeWidth="1.3" />
              <text x="107" y="47" textAnchor="middle" fill="#D5991C" fontSize="9.5" fontWeight="bold">SEARCH &amp; CORPUS</text>
              <text x="107" y="66" textAnchor="middle" fill="#FBF3E2" fontSize="11" fontWeight="bold">Layers 0–12 Shield</text>

              <rect x="235" y="20" width="175" height="70" rx="8" fill="#2d0110" stroke="#00A878" strokeWidth="1.3" />
              <text x="322" y="47" textAnchor="middle" fill="#00FF9D" fontSize="9.5" fontWeight="bold">AGENT DISCOVERY</text>
              <text x="322" y="66" textAnchor="middle" fill="#FBF3E2" fontSize="11" fontWeight="bold">A2A &amp; Sealed Envelopes</text>

              <rect x="450" y="20" width="175" height="70" rx="8" fill="#2d0110" stroke="#7C3AED" strokeWidth="1.3" />
              <text x="537" y="47" textAnchor="middle" fill="#C4B5FD" fontSize="9.5" fontWeight="bold">ACTIVE ATTRIBUTION</text>
              <text x="537" y="66" textAnchor="middle" fill="#FBF3E2" fontSize="11" fontWeight="bold">CI-1 to CI-8 Traps</text>

              <rect x="665" y="20" width="175" height="70" rx="8" fill="#0D4432" stroke="#00FF9D" strokeWidth="1.6" />
              <text x="752" y="47" textAnchor="middle" fill="#00FF9D" fontSize="9.5" fontWeight="bold">MARKET &amp; AUDIT PROOF</text>
              <text x="752" y="66" textAnchor="middle" fill="#FBF3E2" fontSize="11" fontWeight="bold">Order-Book + zk-SNARK</text>
            </svg>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CAPABILITIES_MATRIX.map((cap) => (
            <div
              key={cap.id}
              data-cap-cell
              className="group rounded-2xl bg-[#2B010F]/40 hover:bg-[#350213]/50 border border-[#F2D69D]/25 hover:border-[#D5991C]/60 p-7 flex flex-col justify-between transition-all shadow-lg backdrop-blur-xs"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#D5991C]/15 text-[#D5991C] border border-[#D5991C]/35">
                    {cap.category}
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-[#410217] border border-[#00A878]/40 flex items-center justify-center text-[#00FF9D]">
                    <Shield className="w-4 h-4" />
                  </div>
                </div>

                <h3 className="font-serif text-2xl text-[#FBF3E2] group-hover:text-[#D5991C] transition-colors leading-snug mb-3">
                  {cap.title}
                </h3>

                <p className="text-sm text-[#FBF3E2]/80 font-sans leading-relaxed mb-6">
                  {cap.description}
                </p>
              </div>

              <div className="pt-4 border-t border-[#F2D69D]/15 flex items-center justify-between text-xs">
                <span className="text-[#F2D69D]/75 font-medium">Key Benchmark</span>
                <span className="inline-flex items-center space-x-1.5 font-semibold text-[#00FF9D]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#00A878]" />
                  <span>{cap.impactMetric}</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
