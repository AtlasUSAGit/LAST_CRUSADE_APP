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
    summary:
      'Stops rigged webpages, fake statistics, hidden PDF commands, and botnet echo chambers before AI chatbots quote them.',
  },
  {
    id: 'pillar-2',
    title: 'Agent-to-Agent Discovery',
    layers: 'Layers 13–14',
    summary:
      'Flattens tool schemas to win autonomous AI selection reliably while isolating untrusted external tool payloads.',
  },
  {
    id: 'pillar-3',
    title: 'Market Reality & Silicon Gate',
    layers: 'Layers 15–16 + FPGA',
    summary:
      'Boosts verified financial signal confidence (+42.55%) while grounding automated trades in live order-book liquidity.',
  },
  {
    id: 'pillar-4',
    title: 'Active Counterintelligence',
    layers: 'Modules CI-1 to CI-8',
    summary:
      'Deploys digital watermarks, decoy agent tools, and leak tripwires to trace coordinated attackers back to their source.',
  },
];

export const CapabilitiesGrid: React.FC = () => {
  const rootRef = useRef<HTMLElement>(null);
  const matrixStageRef = useRef<HTMLDivElement>(null);
  const [selectedPillar, setSelectedPillar] = useState<string>('pillar-1');

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      const stage = matrixStageRef.current;
      if (!stage || window.innerWidth < 1024) return;

      const wave1Cards = gsap.utils.toArray<HTMLElement>('.cap-wave-1', stage);
      const wave2Cards = gsap.utils.toArray<HTMLElement>('.cap-wave-2', stage);

      // Wave 1: Card 01 is anchored; Cards 02 and 03 start below viewport
      wave1Cards.forEach((el, idx) => {
        if (idx > 0) {
          gsap.set(el, { yPercent: 108, opacity: 0 });
        }
      });

      // Wave 2: Cards 04, 05, 06 start below viewport ready to stack over Wave 1 one third at a time
      gsap.set(wave2Cards, { yPercent: 108, opacity: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: stage,
          start: 'top top',
          end: '+=240%',
          pin: true,
          scrub: 0.85,
          anticipatePin: 1,
        },
      });

      // Wave 1 Center 1/3 (Module 02)
      if (wave1Cards[1]) {
        tl.to(wave1Cards[1], {
          yPercent: 0,
          opacity: 1,
          duration: 1,
          ease: 'power2.out',
        });
      }

      // Wave 1 Right 1/3 (Module 03)
      if (wave1Cards[2]) {
        tl.to(
          wave1Cards[2],
          {
            yPercent: 0,
            opacity: 1,
            duration: 1,
            ease: 'power2.out',
          },
          '-=0.3'
        );
      }

      // Wave 2: Modules 04, 05, 06 slide up and stack over Modules 01, 02, 03 one third at a time
      wave2Cards.forEach((card, idx) => {
        tl.to(
          card,
          {
            yPercent: 0,
            opacity: 1,
            duration: 1,
            ease: 'power2.inOut',
          },
          idx === 0 ? '+=0.15' : '-=0.35'
        );
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  const activePillar =
    PLATFORM_PILLARS.find((p) => p.id === selectedPillar) || PLATFORM_PILLARS[0];

  const firstRowCaps = CAPABILITIES_MATRIX.slice(0, 3);
  const secondRowCaps = CAPABILITIES_MATRIX.slice(3, 6);

  return (
    <section
      ref={rootRef}
      className="bg-transparent border-b border-[#410217]/20 relative z-10"
    >
      {/* PART 1: 4-PILLAR HEXAGONAL & TRIANGULAR TESSELLATION ARCHITECTURE */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 md:pt-28 pb-14">
        <SectionHeader
          title={
            <>
              Four Pillars &amp; Core Defense Modules{' '}
              <em className="italic text-[#8B5A0B] font-normal">
                Built for Real-World AI.
              </em>
            </>
          }
          subtitle="Sixteen protection layers and eight active counterintelligence modules working together across AI search engines, autonomous software agents, and institutional financial infrastructure."
        />

        {/* 4-Pillar Hexagonal-Faceted Prism Container */}
        <div
          className="bg-[#24010d]/95 border-2 border-[#D5991C] p-6 sm:p-8 shadow-2xl space-y-6"
          style={{
            clipPath:
              'polygon(24px 0%, 100% 0%, 100% calc(100% - 24px), calc(100% - 24px) 100%, 0% 100%, 0% 24px)',
          }}
        >
          {/* 4 Interlocking Hexagonal-Chevron Pillar Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {PLATFORM_PILLARS.map((pillar, idx) => {
              const isSelected = pillar.id === selectedPillar;
              return (
                <button
                  key={pillar.id}
                  onClick={() => setSelectedPillar(pillar.id)}
                  className={`text-left p-4 border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#D5991C] text-[#130108] border-[#FBF3E2] shadow-lg'
                      : 'bg-[#1a0009]/90 text-[#FBF3E2] border-[#D5991C]/40 hover:border-[#D5991C]'
                  }`}
                  style={{
                    clipPath:
                      'polygon(14px 0%, 100% 0%, calc(100% - 14px) 100%, 0% 100%)',
                  }}
                >
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span
                      className={`font-mono font-bold ${
                        isSelected ? 'text-[#130108]' : 'text-[#D5991C]'
                      }`}
                    >
                      Pillar 0{idx + 1}
                    </span>
                    <span
                      className={`font-mono text-[10px] px-2.5 py-0.5 border ${
                        isSelected
                          ? 'bg-[#130108] text-[#00FF9D] border-[#130108]'
                          : 'bg-[#410217] text-[#00FF9D] border-[#00A878]/50'
                      }`}
                    >
                      {pillar.layers}
                    </span>
                  </div>
                  <div
                    className={`font-serif text-lg font-bold leading-snug ${
                      isSelected ? 'text-[#130108]' : 'text-[#FBF3E2]'
                    }`}
                  >
                    {pillar.title}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Pillar Readout Bar */}
          <div
            className="p-4 sm:p-5 bg-[#180008] border border-[#D5991C]/45 flex flex-col lg:flex-row lg:items-center justify-between gap-4"
            style={{
              clipPath:
                'polygon(12px 0%, 100% 0%, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0% 100%, 0% 12px)',
            }}
          >
            <div className="space-y-1 max-w-xl">
              <div className="text-xs font-mono uppercase text-[#00FF9D] font-bold">
                {activePillar.title} · {activePillar.layers}
              </div>
              <p className="text-sm text-[#FBF3E2]/90 leading-relaxed">
                {activePillar.summary}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-[#F2D69D]">
              <span
                className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 bg-[#2d0110] border border-[#D5991C]/50"
                style={{
                  clipPath:
                    'polygon(8px 0%, calc(100% - 8px) 0%, 100% 50%, calc(100% - 8px) 100%, 8px 100%, 0% 50%)',
                }}
              >
                <Network className="w-3.5 h-3.5 text-[#D5991C]" />
                <span>Human Web + Silent Web</span>
              </span>
              <span
                className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 bg-[#2d0110] border border-[#00A878]/50 text-[#00FF9D]"
                style={{
                  clipPath:
                    'polygon(8px 0%, calc(100% - 8px) 0%, 100% 50%, calc(100% - 8px) 100%, 8px 100%, 0% 50%)',
                }}
              >
                <Cpu className="w-3.5 h-3.5" />
                <span>142ns FPGA Ready</span>
              </span>
              <span
                className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 bg-[#2d0110] border border-[#7C3AED]/55 text-[#C4B5FD]"
                style={{
                  clipPath:
                    'polygon(8px 0%, calc(100% - 8px) 0%, 100% 50%, calc(100% - 8px) 100%, 8px 100%, 0% 50%)',
                }}
              >
                <Radar className="w-3.5 h-3.5" />
                <span>CI-1 to CI-8</span>
              </span>
            </div>
          </div>

          {/* Animated SVG End-to-End Platform Shield Pipeline with Hexagonal & Triangular Tessellation */}
          <div className="bg-[#180008] border border-[#D5991C]/35 p-3 overflow-hidden">
            <svg
              viewBox="0 0 860 110"
              className="w-full h-auto block"
              role="img"
              aria-label="Sentinel Platform Unified Flow"
            >
              <defs>
                <linearGradient id="capFlowGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#D5991C" />
                  <stop offset="50%" stopColor="#00FF9D" />
                  <stop offset="100%" stopColor="#B565FF" />
                </linearGradient>
              </defs>

              {/* Background Triangular Tessellation Lines */}
              <g stroke="#F2D69D" strokeOpacity="0.1" strokeWidth="1" fill="none">
                <polygon points="107,6 214,104 0,104" />
                <polygon points="322,6 429,104 215,104" />
                <polygon points="537,6 644,104 430,104" />
                <polygon points="752,6 859,104 645,104" />
              </g>

              <line
                x1="90"
                y1="55"
                x2="770"
                y2="55"
                stroke="url(#capFlowGrad)"
                strokeWidth="2.5"
                strokeDasharray="6 4"
              >
                <animate
                  attributeName="stroke-dashoffset"
                  from="20"
                  to="0"
                  dur="1.2s"
                  repeatCount="indefinite"
                />
              </line>
              <circle r="4" cy="55" fill="#00FF9D">
                <animate
                  attributeName="cx"
                  values="95;310;540;760"
                  dur="2.2s"
                  repeatCount="indefinite"
                />
              </circle>

              {/* Hexagonal Node 1 */}
              <polygon
                points="36,20 179,20 195,55 179,90 36,90 20,55"
                fill="#2d0110"
                stroke="#D5991C"
                strokeWidth="1.5"
              />
              <text x="107" y="47" textAnchor="middle" fill="#D5991C" fontSize="9.5" fontWeight="bold">
                SEARCH &amp; CORPUS
              </text>
              <text x="107" y="66" textAnchor="middle" fill="#FBF3E2" fontSize="11" fontWeight="bold">
                Layers 0–12 Shield
              </text>

              {/* Hexagonal Node 2 */}
              <polygon
                points="251,20 394,20 410,55 394,90 251,90 235,55"
                fill="#2d0110"
                stroke="#00A878"
                strokeWidth="1.5"
              />
              <text x="322" y="47" textAnchor="middle" fill="#00FF9D" fontSize="9.5" fontWeight="bold">
                AGENT DISCOVERY
              </text>
              <text x="322" y="66" textAnchor="middle" fill="#FBF3E2" fontSize="11" fontWeight="bold">
                A2A &amp; Sealed Envelopes
              </text>

              {/* Hexagonal Node 3 */}
              <polygon
                points="466,20 609,20 625,55 609,90 466,90 450,55"
                fill="#2d0110"
                stroke="#7C3AED"
                strokeWidth="1.5"
              />
              <text x="537" y="47" textAnchor="middle" fill="#C4B5FD" fontSize="9.5" fontWeight="bold">
                ACTIVE ATTRIBUTION
              </text>
              <text x="537" y="66" textAnchor="middle" fill="#FBF3E2" fontSize="11" fontWeight="bold">
                CI-1 to CI-8 Traps
              </text>

              {/* Hexagonal Node 4 */}
              <polygon
                points="681,20 824,20 840,55 824,90 681,90 665,55"
                fill="#0D4432"
                stroke="#00FF9D"
                strokeWidth="1.8"
              />
              <text x="752" y="47" textAnchor="middle" fill="#00FF9D" fontSize="9.5" fontWeight="bold">
                MARKET &amp; AUDIT PROOF
              </text>
              <text x="752" y="66" textAnchor="middle" fill="#FBF3E2" fontSize="11" fontWeight="bold">
                Order-Book + zk-SNARK
              </text>
            </svg>
          </div>
        </div>
      </div>

      {/* PART 2: PINNED 3-THIRDS (1/3 + 1/3 + 1/3) TWO-WAVE STICKY MATRIX STACK */}
      <div
        ref={matrixStageRef}
        className="relative w-full lg:h-screen overflow-hidden flex flex-col justify-between py-8 border-t border-[#410217]/25"
      >
        {/* Background Isometric Triangular & Hexagonal Tessellation */}
        <svg
          className="pointer-events-none absolute inset-0 w-full h-full opacity-[0.13]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="cap-tri-hex-tess"
              width="116"
              height="100"
              patternUnits="userSpaceOnUse"
            >
              <polygon
                points="58,0 116,100 0,100"
                fill="none"
                stroke="#410217"
                strokeWidth="1"
              />
              <polygon
                points="29,16 87,16 108,50 87,84 29,84 8,50"
                fill="none"
                stroke="#8B5A0B"
                strokeWidth="0.9"
                strokeDasharray="3 3"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#cap-tri-hex-tess)" />
        </svg>

        <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col h-full justify-between">
          {/* 3-Column (1/3 + 1/3 + 1/3) Sticky Stacking Stage */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 items-stretch my-auto">
            {[0, 1, 2].map((colIdx) => {
              const cap1 = firstRowCaps[colIdx];
              const cap2 = secondRowCaps[colIdx];

              return (
                <div
                  key={colIdx}
                  className="relative flex flex-col h-full min-h-[430px]"
                >
                  {/* WAVE 1 CARD (Modules 01, 02, 03) */}
                  {cap1 && (
                    <div
                      data-cap-cell
                      className="cap-wave-1 relative flex-1 bg-[#2B010F]/96 border-2 border-[#D5991C]/75 p-6 sm:p-7 flex flex-col justify-between shadow-xl"
                      style={{
                        clipPath:
                          'polygon(22px 0%, 100% 0%, 100% calc(100% - 22px), calc(100% - 22px) 100%, 0% 100%, 0% 22px)',
                      }}
                    >
                      <svg
                        className="pointer-events-none absolute top-0 left-0 w-7 h-7"
                        viewBox="0 0 28 28"
                      >
                        <polygon points="0,0 28,0 0,28" fill="#D5991C" />
                      </svg>

                      <div>
                        {/* Header Spine (Stays Visible Above Wave 2 When Stacked!) */}
                        <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#F2D69D]/20">
                          <div className="flex items-center gap-2.5">
                            <span
                              className="w-8 h-8 bg-[#D5991C] text-[#130108] font-mono font-bold text-xs flex items-center justify-center"
                              style={{
                                clipPath:
                                  'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                              }}
                            >
                              0{colIdx + 1}
                            </span>
                            <span
                              className="px-3 py-1 text-xs font-mono font-semibold bg-[#D5991C]/15 text-[#D5991C] border border-[#D5991C]/40"
                              style={{
                                clipPath:
                                  'polygon(8px 0%, calc(100% - 8px) 0%, 100% 50%, calc(100% - 8px) 100%, 8px 100%, 0% 50%)',
                              }}
                            >
                              {cap1.category}
                            </span>
                          </div>

                          <div
                            className="w-9 h-9 bg-[#410217] border border-[#00A878]/50 flex items-center justify-center text-[#00FF9D]"
                            style={{
                              clipPath:
                                'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                            }}
                          >
                            <Shield className="w-4 h-4" />
                          </div>
                        </div>

                        <h3 className="font-serif text-2xl text-[#FBF3E2] leading-snug mb-3">
                          {cap1.title}
                        </h3>

                        <p className="text-sm text-[#FBF3E2]/85 font-sans leading-relaxed mb-6">
                          {cap1.description}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-[#F2D69D]/20 flex items-center justify-between text-xs">
                        <span className="text-[#F2D69D]/75 font-mono uppercase tracking-wider">
                          Key Benchmark
                        </span>
                        <span className="inline-flex items-center space-x-1.5 font-semibold text-[#00FF9D]">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#00A878]" />
                          <span>{cap1.impactMetric}</span>
                        </span>
                      </div>
                    </div>
                  )}

                  {/* WAVE 2 CARD (Modules 04, 05, 06 — Stacks Over Wave 1 in Each 1/3 Column!) */}
                  {cap2 && (
                    <div
                      data-cap-cell
                      className="cap-wave-2 lg:absolute lg:inset-x-0 lg:bottom-0 lg:top-[64px] mt-4 lg:mt-0 bg-[#1B000A]/98 border-2 border-[#D5991C] p-6 sm:p-7 flex flex-col justify-between shadow-[0_-20px_50px_rgba(19,1,8,0.9)] z-20"
                      style={{
                        clipPath:
                          'polygon(0% 18px, 18px 0%, calc(100% - 18px) 0%, 100% 18px, 100% 100%, 0% 100%)',
                      }}
                    >
                      <svg
                        className="pointer-events-none absolute bottom-0 right-0 w-7 h-7"
                        viewBox="0 0 28 28"
                      >
                        <polygon points="28,28 0,28 28,0" fill="#00A878" />
                      </svg>

                      <div>
                        <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#D5991C]/35">
                          <div className="flex items-center gap-2.5">
                            <span
                              className="w-8 h-8 bg-[#00A878] text-[#130108] font-mono font-bold text-xs flex items-center justify-center"
                              style={{
                                clipPath:
                                  'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                              }}
                            >
                              0{colIdx + 4}
                            </span>
                            <span
                              className="px-3 py-1 text-xs font-mono font-semibold bg-[#D5991C]/20 text-[#D5991C] border border-[#D5991C]/50"
                              style={{
                                clipPath:
                                  'polygon(8px 0%, calc(100% - 8px) 0%, 100% 50%, calc(100% - 8px) 100%, 8px 100%, 0% 50%)',
                              }}
                            >
                              {cap2.category}
                            </span>
                          </div>

                          <div
                            className="w-9 h-9 bg-[#410217] border border-[#D5991C]/60 flex items-center justify-center text-[#D5991C]"
                            style={{
                              clipPath:
                                'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                            }}
                          >
                            <Shield className="w-4 h-4" />
                          </div>
                        </div>

                        <h3 className="font-serif text-2xl text-[#FBF3E2] leading-snug mb-3">
                          {cap2.title}
                        </h3>

                        <p className="text-sm text-[#FBF3E2]/85 font-sans leading-relaxed mb-6">
                          {cap2.description}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-[#F2D69D]/20 flex items-center justify-between text-xs">
                        <span className="text-[#F2D69D]/75 font-mono uppercase tracking-wider">
                          Key Benchmark
                        </span>
                        <span className="inline-flex items-center space-x-1.5 font-semibold text-[#00FF9D]">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#00A878]" />
                          <span>{cap2.impactMetric}</span>
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CapabilitiesGrid;
