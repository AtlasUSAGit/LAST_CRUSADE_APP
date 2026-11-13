import React, { useEffect, useRef, useState } from 'react';
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
    summary: 'Stops rigged webpages, fake statistics, hidden PDF commands, and botnet echo chambers before AI chatbots quote them.',
  },
  {
    id: 'pillar-2',
    title: 'Agent-to-Agent Discovery',
    layers: 'Layers 13–14',
    summary: 'Flattens tool schemas to win autonomous AI selection reliably while isolating untrusted external tool payloads.',
  },
  {
    id: 'pillar-3',
    title: 'Market Reality & Silicon Gate',
    layers: 'Layers 15–16 + FPGA',
    summary: 'Boosts verified financial signal confidence (+42.55%) while grounding automated trades in live order-book liquidity.',
  },
  {
    id: 'pillar-4',
    title: 'Active Counterintelligence',
    layers: 'Modules CI-1 to CI-8',
    summary: 'Deploys digital watermarks, decoy agent tools, and leak tripwires to trace coordinated attackers back to their source.',
  },
];

export const CapabilitiesGrid: React.FC = () => {
  const rootRef = useRef<HTMLElement>(null);
  const vortexWrapperRef = useRef<HTMLDivElement>(null);
  const vortexTrackRef = useRef<HTMLDivElement>(null);
  const [selectedPillar, setSelectedPillar] = useState<string>('pillar-1');

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      const wrapper = vortexWrapperRef.current;
      const track = vortexTrackRef.current;
      if (!wrapper || !track) return;

      const cards = gsap.utils.toArray<HTMLElement>('.vortex-card', track);
      if (cards.length === 0) return;

      const getScrollAmount = () =>
        Math.max(0, track.scrollWidth - window.innerWidth);

      const scrollTween = gsap.to(track, {
        x: () => -getScrollAmount(),
        ease: 'none',
        scrollTrigger: {
          trigger: wrapper,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          end: () => `+=${Math.max(window.innerWidth * 2, track.scrollWidth)}`,
          invalidateOnRefresh: true,
        },
      });

      cards.forEach((card) => {
        gsap.fromTo(
          card,
          {
            rotationY: 65,
            rotationZ: -25,
            scale: 0.5,
            z: -500,
            opacity: 0.25,
          },
          {
            rotationY: -65,
            rotationZ: 25,
            scale: 0.5,
            z: -500,
            opacity: 0.25,
            ease: 'none',
            scrollTrigger: {
              trigger: card,
              containerAnimation: scrollTween,
              start: 'left right',
              end: 'right left',
              scrub: true,
              onUpdate: (self) => {
                const centerCurve = 1 - Math.pow((self.progress - 0.5) * 2, 2);
                gsap.set(card, {
                  scale: 0.52 + centerCurve * 0.54,
                  z: -500 + centerCurve * 500,
                  opacity: 0.25 + centerCurve * 0.75,
                });
              },
            },
          }
        );
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  const activePillar =
    PLATFORM_PILLARS.find((p) => p.id === selectedPillar) || PLATFORM_PILLARS[0];

  return (
    <section
      ref={rootRef}
      className="bg-transparent border-b border-[#410217]/20 relative z-10"
    >
      {/* PART 1: OPEN ARCHITECTURAL BLUEPRINT — 4 PILLARS & UNIFIED FLOW SVG */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 md:pt-28 pb-16">
        <div className="velocity-item">
          <SectionHeader
            title={
              <>
                Four Pillars &amp; Core Defense Modules{' '}
                <em className="italic text-[#8B5A0B] font-normal">Built for Real-World AI.</em>
              </>
            }
            subtitle="Sixteen protection layers and eight active counterintelligence modules working together across AI search engines, autonomous software agents, and institutional financial infrastructure."
          />
        </div>

        {/* Open Sharp Architectural 4-Pillar Strip (No Rounded Container Wrapper) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-t-2 border-l border-[#410217]">
          {PLATFORM_PILLARS.map((pillar, idx) => {
            const isSelected = pillar.id === selectedPillar;
            return (
              <button
                key={pillar.id}
                onClick={() => setSelectedPillar(pillar.id)}
                className={`text-left p-5 rounded-none border-r border-b border-[#410217] transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#2B010F] text-[#FBF3E2]'
                    : 'bg-transparent text-[#410217] hover:bg-[#410217]/10'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-mono font-bold text-[#D5991C]">
                    Pillar 0{idx + 1}
                  </span>
                  <span
                    className={`font-mono text-[10px] px-2 py-0.5 rounded-none border ${
                      isSelected
                        ? 'bg-[#410217] text-[#00FF9D] border-[#00A878]'
                        : 'bg-[#2B010F] text-[#00FF9D] border-[#410217]'
                    }`}
                  >
                    {pillar.layers}
                  </span>
                </div>
                <div
                  className={`font-serif text-lg font-bold leading-snug ${
                    isSelected ? 'text-[#FBF3E2]' : 'text-[#410217]'
                  }`}
                >
                  {pillar.title}
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Pillar Detail Bar + Animated SVG End-to-End Platform Shield Pipeline */}
        <div className="border-x border-b-2 border-[#410217] bg-[#24010d]/95 p-6 sm:p-8 space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#F2D69D]/20 pb-6">
            <div className="space-y-1 max-w-xl">
              <div className="text-xs font-mono uppercase text-[#00FF9D] font-bold">
                {activePillar.title} · {activePillar.layers}
              </div>
              <p className="text-sm text-[#FBF3E2]/90 leading-relaxed">
                {activePillar.summary}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-[#F2D69D]">
              <span className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-none bg-[#2d0110] border border-[#D5991C]">
                <Network className="w-3.5 h-3.5 text-[#D5991C]" />
                <span>Human Web + Silent Web</span>
              </span>
              <span className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-none bg-[#2d0110] border border-[#00A878] text-[#00FF9D]">
                <Cpu className="w-3.5 h-3.5" />
                <span>142ns FPGA Ready</span>
              </span>
              <span className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-none bg-[#2d0110] border border-[#7C3AED] text-[#C4B5FD]">
                <Radar className="w-3.5 h-3.5" />
                <span>CI-1 to CI-8</span>
              </span>
            </div>
          </div>

          <div className="bg-[#180008] border border-[#D5991C]/40 rounded-none p-3 overflow-hidden">
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
              <rect x="20" y="20" width="175" height="70" rx="0" fill="#2d0110" stroke="#D5991C" strokeWidth="1.3" />
              <text x="107" y="47" textAnchor="middle" fill="#D5991C" fontSize="9.5" fontWeight="bold">SEARCH &amp; CORPUS</text>
              <text x="107" y="66" textAnchor="middle" fill="#FBF3E2" fontSize="11" fontWeight="bold">Layers 0–12 Shield</text>

              <rect x="235" y="20" width="175" height="70" rx="0" fill="#2d0110" stroke="#00A878" strokeWidth="1.3" />
              <text x="322" y="47" textAnchor="middle" fill="#00FF9D" fontSize="9.5" fontWeight="bold">AGENT DISCOVERY</text>
              <text x="322" y="66" textAnchor="middle" fill="#FBF3E2" fontSize="11" fontWeight="bold">A2A &amp; Sealed Envelopes</text>

              <rect x="450" y="20" width="175" height="70" rx="0" fill="#2d0110" stroke="#7C3AED" strokeWidth="1.3" />
              <text x="537" y="47" textAnchor="middle" fill="#C4B5FD" fontSize="9.5" fontWeight="bold">ACTIVE ATTRIBUTION</text>
              <text x="537" y="66" textAnchor="middle" fill="#FBF3E2" fontSize="11" fontWeight="bold">CI-1 to CI-8 Traps</text>

              <rect x="665" y="20" width="175" height="70" rx="0" fill="#0D4432" stroke="#00FF9D" strokeWidth="1.6" />
              <text x="752" y="47" textAnchor="middle" fill="#00FF9D" fontSize="9.5" fontWeight="bold">MARKET &amp; AUDIT PROOF</text>
              <text x="752" y="66" textAnchor="middle" fill="#FBF3E2" fontSize="11" fontWeight="bold">Order-Book + zk-SNARK</text>
            </svg>
          </div>
        </div>
      </div>

      {/* CHAPTER 4: ISOLATED PIN-STAGE — 3D CORKSCREW VORTEX HORIZONTAL TRACK */}
      <div className="pin-stage relative w-full overflow-hidden border-t-2 border-b border-[#410217]">
        <div
          ref={vortexWrapperRef}
          className="vortex-wrapper relative w-full h-screen overflow-hidden flex flex-col justify-between py-10"
          style={{ perspective: '1200px' }}
        >
          {/* Top Architectural HUD Bar */}
          <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-end justify-between gap-4 border-b border-[#410217]/30 pb-4 z-20">
            <div>
              <div className="text-xs font-mono uppercase tracking-[0.2em] text-[#410217] font-bold mb-1">
                3D HELIX CORKSCREW VORTEX // CORE DEFENSE MODULES
              </div>
              <h3 className="font-serif text-2xl sm:text-4xl text-[#410217]">
                Core Defense Modules &amp; Key Benchmarks
              </h3>
            </div>
            <div className="text-xs font-mono uppercase tracking-widest text-[#410217] font-bold">
              SCROLL TO UNTWIST 0{CAPABILITIES_MATRIX.length} SYSTEM MONOLITHS →
            </div>
          </div>

          {/* 3D Horizontal Corkscrew Track */}
          <div
            ref={vortexTrackRef}
            className="vortex-track flex items-center gap-12 sm:gap-20 px-[12vw] sm:px-[24vw] my-auto w-max"
            style={{ transformStyle: 'preserve-3d' }}
          >
            {CAPABILITIES_MATRIX.map((cap, idx) => (
              <div
                key={cap.id}
                data-cap-cell
                className="vortex-card relative w-[84vw] sm:w-[480px] lg:w-[540px] shrink-0 rounded-none bg-[#2B010F]/95 border-2 border-[#D5991C] p-6 sm:p-10 flex flex-col justify-between shadow-[0_30px_90px_rgba(43,1,15,0.55)] will-change-transform"
              >
                {/* Sharp Corner Crosshair Ticks */}
                <span className="absolute -top-2 -left-2 text-[#D5991C] font-mono text-sm leading-none select-none">+</span>
                <span className="absolute -top-2 -right-2 text-[#D5991C] font-mono text-sm leading-none select-none">+</span>
                <span className="absolute -bottom-2 -left-2 text-[#D5991C] font-mono text-sm leading-none select-none">+</span>
                <span className="absolute -bottom-2 -right-2 text-[#D5991C] font-mono text-sm leading-none select-none">+</span>

                <div>
                  <div className="flex items-center justify-between border-b border-[#F2D69D]/20 pb-4 mb-6">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-mono font-bold text-[#D5991C]">
                        0{idx + 1}
                      </span>
                      <span className="h-4 w-px bg-[#F2D69D]/30" />
                      <span className="px-3 py-1 rounded-none text-xs font-mono uppercase tracking-wider font-semibold bg-[#D5991C]/15 text-[#D5991C] border border-[#D5991C]">
                        {cap.category}
                      </span>
                    </div>
                    <div className="w-8 h-8 rounded-none bg-[#410217] border border-[#00A878] flex items-center justify-center text-[#00FF9D]">
                      <Shield className="w-4 h-4" />
                    </div>
                  </div>

                  <h3 className="font-serif text-2xl sm:text-3xl text-[#FBF3E2] leading-snug mb-4">
                    {cap.title}
                  </h3>

                  <p className="text-sm sm:text-base text-[#FBF3E2]/85 font-sans leading-relaxed mb-8">
                    {cap.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#F2D69D]/25 flex items-center justify-between text-xs">
                  <span className="text-[#F2D69D]/80 font-mono uppercase tracking-wider">
                    Key Benchmark
                  </span>
                  <span className="inline-flex items-center space-x-1.5 font-mono font-semibold text-[#00FF9D]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#00A878]" />
                    <span>{cap.impactMetric}</span>
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Architectural Coordinate Bar */}
          <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between border-t border-[#410217]/30 pt-3 text-[11px] font-mono uppercase tracking-widest text-[#410217]/80 z-20">
            <span>HELIX OPTICS: ROTATION-Y (±65°) // Z-DEPTH (-500PX → 0PX)</span>
            <span>0{CAPABILITIES_MATRIX.length} VERIFIED MODULES</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CapabilitiesGrid;
