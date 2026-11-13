import React, { useEffect, useRef } from 'react';
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
  const portalSectionRef = useRef<HTMLDivElement>(null);
  const stickyStackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      // 1. Liquid / Geometric Clip-Path Counter-Rotation Diamond Lens Reveal
      const portalEl = portalSectionRef.current;
      if (portalEl) {
        const mask = portalEl.querySelector('.portal-mask');
        const inner = portalEl.querySelector('.portal-inner-content');

        if (mask && inner) {
          const portalTl = gsap.timeline({
            scrollTrigger: {
              trigger: portalEl,
              start: 'top top',
              end: '+=140%',
              pin: true,
              scrub: 1,
              anticipatePin: 1,
            },
          });

          portalTl
            .fromTo(
              mask,
              {
                clipPath: 'polygon(50% 42%, 58% 50%, 50% 58%, 42% 50%)',
                rotation: -90,
              },
              {
                clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
                rotation: 0,
                ease: 'power3.inOut',
              }
            )
            .fromTo(
              inner,
              {
                scale: 2.2,
                rotation: 90,
              },
              {
                scale: 1,
                rotation: 0,
                ease: 'power3.inOut',
              },
              '<'
            );
        }
      }

      // 2. Sticky Overlapping Architectural Sheets — 3D Depth Stack Recession
      const stackEl = stickyStackRef.current;
      if (stackEl) {
        const sheets = gsap.utils.toArray<HTMLElement>('.service-sheet-plate', stackEl);
        sheets.forEach((sheet, i) => {
          if (i === sheets.length - 1) return;
          const nextSheet = sheets[i + 1];
          gsap.to(sheet, {
            scale: 0.935 - (sheets.length - 1 - i) * 0.004,
            rotationX: 4,
            transformOrigin: '50% 0%',
            ease: 'none',
            scrollTrigger: {
              trigger: nextSheet,
              start: 'top bottom',
              end: 'top 140px',
              scrub: true,
            },
          });
        });
      }
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      className="bg-transparent border-b border-[#410217]/20 relative z-10"
    >
      {/* CHAPTER 2A: ISOLATED PIN-STAGE — GEOMETRIC DIAMOND LENS COUNTER-ROTATION REVEAL */}
      <div className="pin-stage relative w-full overflow-hidden border-y-2 border-[#410217]">
        <div
          ref={portalSectionRef}
          className="portal-section relative w-full h-screen overflow-hidden flex items-center justify-center"
        >
          {/* Outer Architectural Frame on Cream Canvas */}
          <div className="pointer-events-none absolute inset-4 sm:inset-8 border border-[#410217]/30 flex flex-col justify-between p-4 sm:p-6 z-0">
            <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-[0.2em] text-[#410217]">
              <span>APERTURE OPTICS // GEOMETRIC COUNTER-ROTATION LENS</span>
              <span>OFFENSIVE &amp; DEFENSIVE AEO</span>
            </div>
            <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-[0.2em] text-[#410217]">
              <span>SCROLL TO UNLOCK ARCHITECTURAL DECK</span>
              <span>0{SERVICES.length} SOLUTIONS</span>
            </div>
          </div>

          {/* Expanding Clip-Path Diamond Portal Mask */}
          <div
            className="portal-mask relative w-full h-full bg-[#2B010F] text-[#FBF3E2] flex items-center justify-center overflow-hidden z-10"
            style={{
              clipPath: 'polygon(50% 42%, 58% 50%, 50% 58%, 42% 50%)',
            }}
          >
            <div className="portal-inner-content w-full max-w-7xl mx-auto px-6 sm:px-12 py-12 flex flex-col justify-between h-full">
              <div className="flex items-center justify-between border-b border-[#D5991C]/40 pb-4">
                <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#D5991C] font-bold">
                  PRACTICAL SOLUTIONS // ARCHITECTURAL COMMAND
                </span>
                <button
                  onClick={() => onNavigate?.('services')}
                  className="inline-flex items-center space-x-2 px-4 py-2 rounded-none bg-[#410217] hover:bg-[#5C0A24] text-[#FBF3E2] border border-[#D5991C] text-xs font-mono uppercase tracking-wider transition-all cursor-pointer"
                >
                  <span>Explore Full Defense Architecture</span>
                  <ArrowUpRight className="w-4 h-4 text-[#D5991C]" />
                </button>
              </div>

              <div className="my-auto py-6">
                <h2 className="font-serif text-4xl sm:text-6xl lg:text-7xl text-[#FBF3E2] font-normal tracking-tight max-w-4xl leading-[1.06] mb-6">
                  Practical Solutions for{' '}
                  <em className="italic text-[#D5991C] font-normal">Offensive &amp; Defensive AEO.</em>
                </h2>
                <p className="text-base sm:text-xl text-[#FBF3E2]/85 max-w-3xl leading-relaxed">
                  Whether you want AI chatbots to cite your organization accurately today, or need long-term protection against search poisoning and market manipulation, here is how we help.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 border-t border-l border-[#D5991C]/40">
                {SERVICES.map((srv, idx) => (
                  <a
                    key={srv.id}
                    href={`#sheet-${srv.id}`}
                    className="p-3 sm:p-4 border-r border-b border-[#D5991C]/40 hover:bg-[#D5991C]/15 transition-colors group"
                  >
                    <div className="flex items-center justify-between text-xs font-mono text-[#D5991C] mb-1">
                      <span>0{idx + 1}</span>
                      <ArrowUpRight className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />
                    </div>
                    <div className="text-xs font-serif font-bold text-[#FBF3E2] line-clamp-1">
                      {srv.title}
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CHAPTER 2B: STICKY OVERLAPPING GEOMETRIC ARCHITECTURAL SHEETS (ALL 6 SERVICES) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        <div className="velocity-item mb-14">
          <SectionHeader
            title={
              <>
                Practical Solutions for{' '}
                <em className="italic text-[#8B5A0B] font-normal">Offensive &amp; Defensive AEO.</em>
              </>
            }
            subtitle="Whether you want AI chatbots to cite your organization accurately today, or need long-term protection against search poisoning and market manipulation, here is how we help."
            rightSlot={
              <button
                onClick={() => onNavigate?.('services')}
                className="group inline-flex items-center space-x-2 px-5 py-3 rounded-none bg-[#2B010F] hover:bg-[#5C0A24] text-[#FBF3E2] border border-[#D5991C] text-xs font-semibold transition-all cursor-pointer"
              >
                <span>Explore Full Defense Architecture</span>
                <ArrowUpRight className="w-4 h-4 text-[#D5991C] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>
            }
          />
        </div>

        <div
          ref={stickyStackRef}
          className="relative space-y-16 sm:space-y-24 pb-12"
          style={{ perspective: '1400px' }}
        >
          {SERVICES.map((activeService, index) => {
            const activeFlow =
              SERVICE_FLOW_DIAGRAMS[activeService.id] || SERVICE_FLOW_DIAGRAMS['srv-01'];
            const stickyTop = 76 + index * 18;

            return (
              <article
                id={`sheet-${activeService.id}`}
                key={activeService.id}
                style={{ top: `${stickyTop}px`, zIndex: index + 10 }}
                className="service-sheet-plate sticky rounded-none bg-[#2B010F]/95 border-2 border-[#D5991C] p-6 sm:p-10 shadow-[0_-18px_50px_rgba(43,1,15,0.5)] will-change-transform"
              >
                {/* Sharp Structural Crosshair Ticks */}
                <span className="absolute -top-2 -left-2 text-[#D5991C] font-mono text-sm leading-none select-none">+</span>
                <span className="absolute -top-2 -right-2 text-[#D5991C] font-mono text-sm leading-none select-none">+</span>
                <span className="absolute -bottom-2 -left-2 text-[#D5991C] font-mono text-sm leading-none select-none">+</span>
                <span className="absolute -bottom-2 -right-2 text-[#D5991C] font-mono text-sm leading-none select-none">+</span>

                {/* Top Spine */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-6 border-b border-[#F2D69D]/25">
                  <div className="flex items-center gap-4">
                    <span className="text-2xl font-mono font-bold text-[#D5991C]">
                      0{index + 1}
                    </span>
                    <span className="h-4 w-px bg-[#F2D69D]/30" />
                    <span className="px-3 py-1 rounded-none text-xs font-mono uppercase tracking-wider font-semibold bg-[#D5991C]/20 text-[#D5991C] border border-[#D5991C]">
                      {activeService.badge}
                    </span>
                  </div>

                  <span className="text-xs text-[#00FF9D] font-mono font-medium flex items-center space-x-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{activeService.metricHighlight}</span>
                  </span>
                </div>

                {/* Split Architectural Plane */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  {/* Left 5 Cols: Narrative */}
                  <div className="lg:col-span-5 flex flex-col justify-between space-y-5">
                    <div>
                      <h3 className="font-serif text-3xl sm:text-4xl text-[#FBF3E2] font-normal tracking-tight leading-tight">
                        {activeService.title}
                      </h3>
                      <p className="mt-2 text-base font-medium text-[#D5991C]">
                        {activeService.tagline}
                      </p>
                      <p className="mt-4 text-sm sm:text-base text-[#FBF3E2]/85 font-sans leading-relaxed">
                        {activeService.description}
                      </p>
                    </div>

                    <div className="pt-5 border-t border-[#F2D69D]/25 flex flex-wrap items-center justify-between gap-4">
                      <button
                        onClick={() => onOpenAudit?.()}
                        className="group inline-flex items-center space-x-2 px-5 py-2.5 rounded-none bg-[#D5991C] hover:bg-[#E5A932] text-[#130108] text-xs font-semibold transition-all cursor-pointer"
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

                  {/* Right 7 Cols: Animated Step-by-Step SVG & Open Hairline Deliverables */}
                  <div className="lg:col-span-7 lg:border-l lg:border-[#F2D69D]/25 lg:pl-8 space-y-6">
                    {/* Animated SVG Architecture Flow Diagram */}
                    <div className="p-4 rounded-none bg-[#1F010B] border border-[#D5991C]/40">
                      <div className="text-xs font-mono uppercase tracking-wider text-[#D5991C] mb-3">
                        How It Works Step-by-Step
                      </div>
                      <svg viewBox="0 0 640 118" className="w-full h-auto overflow-visible">
                        {[
                          {
                            x: 6,
                            fill: '#2B010F',
                            stroke: '#F2D69D',
                            strokeOpacity: 0.4,
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
                          return (
                            <g key={bIdx}>
                              <rect
                                x={box.x}
                                y="10"
                                width="180"
                                height="98"
                                rx="0"
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
                        <line x1="186" y1="59" x2="230" y2="59" stroke="#D5991C" strokeWidth="2" />
                        <circle r="4" fill="#D5991C">
                          <animate attributeName="cx" from="186" to="230" dur="1.4s" repeatCount="indefinite" />
                          <animate attributeName="cy" values="59;59" dur="1.4s" repeatCount="indefinite" />
                        </circle>

                        {/* Animated Connector 2 -> 3 */}
                        <line x1="410" y1="59" x2="454" y2="59" stroke="#00FF9D" strokeWidth="2" />
                        <circle r="4" fill="#00FF9D">
                          <animate attributeName="cx" from="410" to="454" dur="1.4s" repeatCount="indefinite" />
                          <animate attributeName="cy" values="59;59" dur="1.4s" repeatCount="indefinite" />
                        </circle>
                      </svg>
                    </div>

                    {/* What This Includes — Open Hairlines Instead of Rounded Boxes */}
                    <div>
                      <div className="text-xs font-mono uppercase tracking-wider font-semibold text-[#F2D69D] mb-2">
                        What This Includes
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 border-t border-[#F2D69D]/25">
                        {activeService.deliverables.map((item, i) => (
                          <div
                            key={i}
                            className="flex items-center space-x-2.5 py-2.5 pr-4 border-b border-[#F2D69D]/20 text-xs text-[#FBF3E2]"
                          >
                            <CheckCircle2 className="w-4 h-4 text-[#00A878] shrink-0" />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
