import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight, CheckCircle2, Shield, Sparkles } from 'lucide-react';
import { SERVICES } from '../data/geoData';
import { NavigationPage } from '../types';
import { SectionHeader } from './home/SectionHeader';

gsap.registerPlugin(ScrollTrigger);

interface ServicesSectionProps {
  onOpenAudit?: () => void;
  onNavigate?: (page: NavigationPage) => void;
}

const SERVICE_FLOW_DIAGRAMS: Record<
  string,
  {
    inputLabel: string;
    inputSub: string;
    engineLabel: string;
    engineSub: string;
    outputLabel: string;
    outputSub: string;
  }
> = {
  'srv-01': {
    inputLabel: 'Customer & Analyst Questions',
    inputSub: 'Hundreds of prompts across AI models',
    engineLabel: 'Cross-Model Citation Tracker',
    engineSub: 'Monitors ChatGPT, Perplexity, Gemini & Claude',
    outputLabel: 'Clear Visibility Dashboard',
    outputSub: 'Instant alerts on false or missing claims',
  },
  'srv-02': {
    inputLabel: 'Open-Web Search Results',
    inputSub: 'Mix of real articles & planted traps',
    engineLabel: '3-Way Search Consistency Filter',
    engineSub: 'Compares meaning, phrasing & exact words',
    outputLabel: 'Clean AI Context Window',
    outputSub: 'Disguised rumor pages quarantined',
  },
  'srv-03': {
    inputLabel: 'Your Official Reports & Facts',
    inputSub: 'Product docs, filings & announcements',
    engineLabel: 'Structured Schema & C2PA Signer',
    engineSub: 'Attaches verifiable authenticity seals',
    outputLabel: 'Top Priority AI Citations',
    outputSub: 'AI engines quote your official voice first',
  },
  'srv-04': {
    inputLabel: 'Breaking Pre-Market Web News',
    inputSub: 'Sudden unverified financial claims',
    engineLabel: 'Market Order-Book Reality Check',
    engineSub: 'Compares web hype vs. real trading volume',
    outputLabel: 'Protected Trade Execution',
    outputSub: 'Pauses bots before buying into sell traps',
  },
  'srv-05': {
    inputLabel: 'Uploaded PDFs & Daily Summaries',
    inputSub: 'Slide decks, charts & agent memory logs',
    engineLabel: 'Visual Scrubber & Memory Guard',
    engineSub: 'Strips hidden text & checks long-term drift',
    outputLabel: 'Sanitized Files & Clean Memory',
    outputSub: 'Zero hidden prompt injections or slow drift',
  },
  'srv-06': {
    inputLabel: 'Multi-Agent Task Requests',
    inputSub: 'Software agents searching for helper tools',
    engineLabel: 'Agent Schema Optimizer & Firewall',
    engineSub: 'Verifies tool handshakes & isolates data',
    outputLabel: 'Trusted Agent Collaboration',
    outputSub: 'Your tools get picked; rogue tools blocked',
  },
};

const wrapSvgText = (text: string, maxChars: number): string[] => {
  if (text.length <= maxChars) return [text];
  const words = text.split(' ');
  const lines: string[] = [];
  let current = '';
  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (next.length > maxChars && current) {
      lines.push(current);
      current = word;
    } else {
      current = next;
    }
  }
  if (current) lines.push(current);
  return lines.slice(0, 2);
};

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  onOpenAudit,
  onNavigate,
}) => {
  const rootRef = useRef<HTMLElement>(null);
  const splitStageRef = useRef<HTMLDivElement>(null);
  const [selectedIdx, setSelectedIdx] = useState(0);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      const stage = splitStageRef.current;
      if (!stage || window.innerWidth < 1024) return;

      const leftShards = gsap.utils.toArray<HTMLElement>('.srv-left-shard', stage);
      const rightShards = gsap.utils.toArray<HTMLElement>('.srv-right-shard', stage);

      if (leftShards.length === 0 || rightShards.length === 0) return;

      // Initial state: Service 01 (idx 0) is locked in place; Services 02-06 start below viewport
      leftShards.forEach((el, i) => {
        if (i > 0) gsap.set(el, { yPercent: 105 });
      });
      rightShards.forEach((el, i) => {
        if (i > 0) gsap.set(el, { yPercent: 105 });
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: stage,
          start: 'top top',
          end: () => `+=${SERVICES.length * 95}%`,
          pin: true,
          scrub: 0.85,
          anticipatePin: 1,
          onUpdate: (self) => {
            const idx = Math.min(
              SERVICES.length - 1,
              Math.max(0, Math.round(self.progress * (SERVICES.length - 1)))
            );
            setSelectedIdx(idx);
          },
        },
      });

      // Sequential Split-Half (1/2 Left then 1/2 Right) Stacking Choreography
      for (let i = 1; i < SERVICES.length; i++) {
        // 1. Left Half (1/2) slides up and stacks over previous Left Half
        tl.to(leftShards[i], {
          yPercent: 0,
          duration: 1,
          ease: 'power2.inOut',
        });

        // Subtle recession of covered Left Half
        tl.to(
          leftShards[i - 1],
          {
            scale: 0.97,
            opacity: 0.35,
            duration: 1,
            ease: 'power2.inOut',
          },
          '<'
        );

        // 2. Right Half (1/2) slides up slightly after Left Half ("<38%") to complete the pair
        tl.to(
          rightShards[i],
          {
            yPercent: 0,
            duration: 1,
            ease: 'power2.inOut',
          },
          '<38%'
        );

        tl.to(
          rightShards[i - 1],
          {
            scale: 0.97,
            opacity: 0.35,
            duration: 1,
            ease: 'power2.inOut',
          },
          '<'
        );
      }
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      className="bg-transparent border-b border-[#410217]/20 relative z-10"
    >
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 md:pt-28 pb-6">
        <SectionHeader
          title={
            <>
              Practical Solutions for{' '}
              <em className="italic text-[#8B5A0B] font-normal">
                Offensive &amp; Defensive AEO.
              </em>
            </>
          }
          subtitle="Whether you want AI chatbots to cite your organization accurately today, or need long-term protection against search poisoning and market manipulation, here is how we help."
          rightSlot={
            <button
              onClick={() => onNavigate?.('services')}
              className="group inline-flex items-center space-x-2 px-6 py-3 bg-[#2B010F] hover:bg-[#5C0A24] text-[#FBF3E2] border border-[#D5991C] text-xs font-mono uppercase tracking-wider font-semibold transition-all cursor-pointer"
              style={{
                clipPath:
                  'polygon(12px 0%, 100% 0%, calc(100% - 12px) 100%, 0% 100%)',
              }}
            >
              <span>Explore Full Defense Architecture</span>
              <ArrowUpRight className="w-4 h-4 text-[#D5991C] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          }
        />
      </div>

      {/* PINNED SPLIT-HALF (1/2 + 1/2) INTERLOCKING GEOMETRIC SHUTTER STAGE */}
      <div
        ref={splitStageRef}
        className="relative w-full lg:h-screen overflow-hidden flex flex-col justify-between py-6 sm:py-8 border-y border-[#410217]/25"
      >
        {/* Background Hexagonal Honeycomb & Triangular Tessellation SVG */}
        <svg
          className="pointer-events-none absolute inset-0 w-full h-full opacity-[0.13]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="srv-hex-tess"
              width="108"
              height="94"
              patternUnits="userSpaceOnUse"
            >
              <polygon
                points="27,0 81,0 108,47 81,94 27,94 0,47"
                fill="none"
                stroke="#410217"
                strokeWidth="1"
              />
              <polygon
                points="54,14 88,74 20,74"
                fill="none"
                stroke="#8B5A0B"
                strokeWidth="0.9"
                strokeDasharray="3 3"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#srv-hex-tess)" />
        </svg>

        <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col h-full justify-between">
          {/* Top 6-Cell Interlocking Hexagonal Selector Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 mb-5">
            {SERVICES.map((service, index) => {
              const isSelected = index === selectedIdx;
              return (
                <button
                  key={service.id}
                  onClick={() => setSelectedIdx(index)}
                  className={`p-3 text-left transition-all cursor-pointer border flex items-center justify-between ${
                    isSelected
                      ? 'bg-[#D5991C] text-[#130108] border-[#FBF3E2] font-bold shadow-md'
                      : 'bg-[#2B010F]/90 text-[#FBF3E2] border-[#D5991C]/35 hover:border-[#D5991C]'
                  }`}
                  style={{
                    clipPath:
                      'polygon(10px 0%, calc(100% - 10px) 0%, 100% 50%, calc(100% - 10px) 100%, 10px 100%, 0% 50%)',
                  }}
                >
                  <div className="truncate pr-1">
                    <div className="text-[10px] font-mono uppercase tracking-wider opacity-80">
                      0{index + 1} // {service.badge}
                    </div>
                    <div className="text-xs font-serif font-bold truncate">
                      {service.title}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* DESKTOP SPLIT-HALF (1/2 LEFT + 1/2 RIGHT) STACKING VIEWPORT */}
          <div className="hidden lg:grid lg:grid-cols-12 gap-6 flex-1 items-stretch relative min-h-[500px]">
            {/* LEFT HALF (1/2 WIDTH — 6 COLS): Service Thesis & Strategy Shards */}
            <div className="lg:col-span-6 relative h-full">
              {SERVICES.map((service, idx) => (
                <div
                  key={service.id}
                  style={{
                    zIndex: idx + 10,
                    top: `${idx * 6}px`,
                  }}
                  className="srv-left-shard absolute inset-x-0 bottom-0 bg-[#2B010F]/98 border-2 border-[#D5991C] p-7 sm:p-9 flex flex-col justify-between shadow-[0_-18px_50px_rgba(19,1,8,0.75)]"
                >
                  {/* Diagonal Corner Triangle Ornament */}
                  <svg
                    className="pointer-events-none absolute top-0 left-0 w-8 h-8"
                    viewBox="0 0 32 32"
                  >
                    <polygon points="0,0 32,0 0,32" fill="#D5991C" />
                  </svg>

                  <div>
                    <div className="flex items-center justify-between gap-3 pb-4 mb-5 border-b border-[#F2D69D]/20">
                      <div className="flex items-center gap-3">
                        {/* Hexagonal Index Seal */}
                        <div
                          className="w-10 h-10 bg-[#D5991C] text-[#130108] font-mono font-bold text-sm flex items-center justify-center"
                          style={{
                            clipPath:
                              'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                          }}
                        >
                          0{idx + 1}
                        </div>
                        <span
                          className="px-3.5 py-1 text-xs font-mono font-semibold bg-[#D5991C]/20 text-[#D5991C] border border-[#D5991C]/50"
                          style={{
                            clipPath:
                              'polygon(8px 0%, calc(100% - 8px) 0%, 100% 50%, calc(100% - 8px) 100%, 8px 100%, 0% 50%)',
                          }}
                        >
                          {service.badge}
                        </span>
                      </div>
                    </div>

                    <h3 className="font-serif text-3xl sm:text-4xl text-[#FBF3E2] font-normal tracking-tight leading-tight">
                      {service.title}
                    </h3>
                    <p className="mt-2 text-base font-medium text-[#D5991C]">
                      {service.tagline}
                    </p>
                    <p className="mt-4 text-sm sm:text-base text-[#FBF3E2]/85 font-sans leading-relaxed">
                      {service.description}
                    </p>
                  </div>

                  <div className="pt-5 border-t border-[#F2D69D]/20 flex flex-wrap items-center justify-between gap-4">
                    <button
                      onClick={() => onOpenAudit?.()}
                      className="group inline-flex items-center space-x-2 px-5 py-2.5 bg-[#D5991C] hover:bg-[#E5A932] text-[#130108] text-xs font-mono uppercase tracking-wider font-bold transition-all cursor-pointer"
                      style={{
                        clipPath:
                          'polygon(10px 0%, 100% 0%, calc(100% - 10px) 100%, 0% 100%)',
                      }}
                    >
                      <Shield className="w-4 h-4" />
                      <span>Talk With Us About This Solution</span>
                      <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </button>

                    <button
                      onClick={() => onNavigate?.('services')}
                      className="text-xs font-semibold text-[#F2D69D] hover:text-[#D5991C] transition-colors cursor-pointer"
                    >
                      See Technical Specifications →
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* RIGHT HALF (1/2 WIDTH — 6 COLS): Step-by-Step Hexagonal Flow & Deliverables Shards */}
            <div className="lg:col-span-6 relative h-full">
              {SERVICES.map((service, idx) => {
                const activeFlow =
                  SERVICE_FLOW_DIAGRAMS[service.id] || SERVICE_FLOW_DIAGRAMS['srv-01'];

                return (
                  <div
                    key={service.id}
                    style={{
                      zIndex: idx + 10,
                      top: `${idx * 6}px`,
                    }}
                    className="srv-right-shard absolute inset-x-0 bottom-0 bg-[#1B000A]/98 border-2 border-[#D5991C] p-7 sm:p-8 flex flex-col justify-between shadow-[0_-18px_50px_rgba(19,1,8,0.75)]"
                  >
                    {/* Bottom-Right Diagonal Triangle Ornament */}
                    <svg
                      className="pointer-events-none absolute bottom-0 right-0 w-8 h-8"
                      viewBox="0 0 32 32"
                    >
                      <polygon points="32,32 0,32 32,0" fill="#00A878" />
                    </svg>

                    <div>
                      <div className="flex items-center justify-between gap-2 pb-3 mb-4 border-b border-[#F2D69D]/20">
                        <span className="text-xs text-[#00FF9D] font-mono font-medium flex items-center space-x-1.5">
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>{service.metricHighlight}</span>
                        </span>
                      </div>

                      {/* Animated Hexagonal/Chevron SVG Flow Diagram */}
                      <div
                        className="p-4 bg-[#120006] border border-[#D5991C]/40 mb-5"
                        style={{
                          clipPath:
                            'polygon(14px 0%, 100% 0%, 100% calc(100% - 14px), calc(100% - 14px) 100%, 0% 100%, 0% 14px)',
                        }}
                      >
                        <div className="text-xs font-mono uppercase tracking-wider text-[#F2D69D]/85 mb-2.5">
                          How It Works Step-by-Step
                        </div>
                        <svg viewBox="0 0 640 118" className="w-full h-auto overflow-visible">
                          {[
                            {
                              x: 6,
                              fill: '#2B010F',
                              stroke: '#F2D69D',
                              strokeOpacity: 0.45,
                              strokeWidth: 1.5,
                              titleColor: '#FBF3E2',
                              subColor: '#FBF3E2',
                              subOpacity: 0.72,
                              titleLines: wrapSvgText(activeFlow.inputLabel, 22),
                              subLines: wrapSvgText(activeFlow.inputSub, 27),
                            },
                            {
                              x: 230,
                              fill: '#350213',
                              stroke: '#D5991C',
                              strokeOpacity: 1,
                              strokeWidth: 2,
                              titleColor: '#D5991C',
                              subColor: '#FBF3E2',
                              subOpacity: 0.85,
                              titleLines: wrapSvgText(activeFlow.engineLabel, 22),
                              subLines: wrapSvgText(activeFlow.engineSub, 27),
                            },
                            {
                              x: 454,
                              fill: '#2B010F',
                              stroke: '#00A878',
                              strokeOpacity: 1,
                              strokeWidth: 1.8,
                              titleColor: '#00FF9D',
                              subColor: '#FBF3E2',
                              subOpacity: 0.8,
                              titleLines: wrapSvgText(activeFlow.outputLabel, 22),
                              subLines: wrapSvgText(activeFlow.outputSub, 27),
                            },
                          ].map((box, bIdx) => {
                            const cx = box.x + 90;
                            const titleStartY = box.titleLines.length > 1 ? 33 : 40;
                            const subStartY = box.titleLines.length > 1 ? 65 : 62;
                            const polyPts = `${box.x + 14},10 ${box.x + 166},10 ${
                              box.x + 180
                            },59 ${box.x + 166},108 ${box.x + 14},108 ${box.x},59`;

                            return (
                              <g key={bIdx}>
                                <polygon
                                  points={polyPts}
                                  fill={box.fill}
                                  stroke={box.stroke}
                                  strokeOpacity={box.strokeOpacity}
                                  strokeWidth={box.strokeWidth}
                                />
                                <text
                                  x={cx}
                                  y={titleStartY}
                                  textAnchor="middle"
                                  fill={box.titleColor}
                                  fontSize="11"
                                  fontWeight="700"
                                >
                                  {box.titleLines.map((line, lIdx) => (
                                    <tspan key={lIdx} x={cx} dy={lIdx === 0 ? 0 : 13}>
                                      {line}
                                    </tspan>
                                  ))}
                                </text>
                                <text
                                  x={cx}
                                  y={subStartY}
                                  textAnchor="middle"
                                  fill={box.subColor}
                                  fillOpacity={box.subOpacity}
                                  fontSize="9.2"
                                >
                                  {box.subLines.map((line, lIdx) => (
                                    <tspan key={lIdx} x={cx} dy={lIdx === 0 ? 0 : 12}>
                                      {line}
                                    </tspan>
                                  ))}
                                </text>
                              </g>
                            );
                          })}

                          {/* Animated Connector 1 -> 2 */}
                          <line
                            x1="186"
                            y1="59"
                            x2="230"
                            y2="59"
                            stroke="#D5991C"
                            strokeWidth="2"
                          />
                          <circle r="4" fill="#D5991C">
                            <animate
                              attributeName="cx"
                              from="186"
                              to="230"
                              dur="1.4s"
                              repeatCount="indefinite"
                            />
                            <animate
                              attributeName="cy"
                              values="59;59"
                              dur="1.4s"
                              repeatCount="indefinite"
                            />
                          </circle>

                          {/* Animated Connector 2 -> 3 */}
                          <line
                            x1="410"
                            y1="59"
                            x2="454"
                            y2="59"
                            stroke="#00FF9D"
                            strokeWidth="2"
                          />
                          <circle r="4" fill="#00FF9D">
                            <animate
                              attributeName="cx"
                              from="410"
                              to="454"
                              dur="1.4s"
                              repeatCount="indefinite"
                            />
                            <animate
                              attributeName="cy"
                              values="59;59"
                              dur="1.4s"
                              repeatCount="indefinite"
                            />
                          </circle>
                        </svg>
                      </div>

                      {/* What This Includes */}
                      <div>
                        <div className="text-xs font-mono uppercase tracking-wider font-semibold text-[#F2D69D] mb-2.5">
                          What This Includes
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {service.deliverables.map((item, i) => (
                            <div
                              key={i}
                              className="flex items-center space-x-2.5 p-2.5 bg-[#350213]/85 border border-[#F2D69D]/20 text-xs text-[#FBF3E2]"
                              style={{
                                clipPath:
                                  'polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)',
                              }}
                            >
                              <CheckCircle2 className="w-4 h-4 text-[#00A878] shrink-0" />
                              <span>{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* MOBILE / TABLET FALLBACK: Interactive Selected Service Split Shards */}
          <div className="lg:hidden space-y-4">
            {(() => {
              const activeService = SERVICES[selectedIdx] || SERVICES[0];
              const activeFlow =
                SERVICE_FLOW_DIAGRAMS[activeService.id] || SERVICE_FLOW_DIAGRAMS['srv-01'];
              return (
                <div className="grid grid-cols-1 gap-4">
                  <div className="bg-[#2B010F]/95 border-2 border-[#D5991C] p-6">
                    <span className="text-xs font-mono text-[#D5991C]">{activeService.badge}</span>
                    <h3 className="font-serif text-2xl text-[#FBF3E2] mt-1">
                      {activeService.title}
                    </h3>
                    <p className="text-sm text-[#D5991C] mt-1">{activeService.tagline}</p>
                    <p className="text-sm text-[#FBF3E2]/85 mt-3">{activeService.description}</p>
                  </div>
                  <div className="bg-[#1B000A]/95 border-2 border-[#D5991C] p-6">
                    <div className="text-xs font-mono text-[#00FF9D] mb-3">
                      {activeService.metricHighlight} :: {activeFlow.engineLabel}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {activeService.deliverables.map((item, i) => (
                        <div key={i} className="text-xs text-[#FBF3E2] flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#00A878]" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
