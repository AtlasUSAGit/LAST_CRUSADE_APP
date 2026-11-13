import React, { useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight, CheckCircle2, Shield, Sparkles } from 'lucide-react';
import { SERVICES } from '../data/geoData';
import { NavigationPage } from '../types';
import { SectionHeader } from './home/SectionHeader';

gsap.registerPlugin(ScrollTrigger);

interface ServicesSectionProps {
  onOpenAudit: () => void;
  onNavigate: (page: NavigationPage) => void;
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
  const [selectedIdx, setSelectedIdx] = useState(0);
  const activeService = SERVICES[selectedIdx];
  const activeFlow = SERVICE_FLOW_DIAGRAMS[activeService.id] || SERVICE_FLOW_DIAGRAMS['srv-01'];

  const rootRef = useRef<HTMLElement>(null);
  const detailRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = detailRef.current;
    if (!el) return;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    gsap.fromTo(
      el,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }
    );
  }, [selectedIdx]);

  return (
    <section
      ref={rootRef}
      className="py-20 md:py-28 bg-transparent border-b border-[#410217]/15 relative z-10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
              onClick={() => onNavigate('services')}
              className="group inline-flex items-center space-x-2 px-5 py-3 rounded-lg bg-[#2B010F] hover:bg-[#5C0A24] text-[#FBF3E2] border border-[#D5991C]/45 text-xs font-semibold transition-all cursor-pointer"
            >
              <span>Explore Full Defense Architecture</span>
              <ArrowUpRight className="w-4 h-4 text-[#D5991C] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          }
        />

        {/* Interactive Service Explorer */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left Column (5 cols): Service Selector List */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-2.5">
            {SERVICES.map((service, index) => {
              const isSelected = index === selectedIdx;
              return (
                <button
                  key={service.id}
                  onClick={() => setSelectedIdx(index)}
                  className={`w-full text-left p-4.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                    isSelected
                      ? 'bg-[#D5991C] text-[#130108] border-[#FBF3E2] shadow-lg'
                      : 'bg-[#2B010F]/90 text-[#FBF3E2] border-[#F2D69D]/20 hover:border-[#D5991C]/50 hover:bg-[#350213]/90 backdrop-blur-xs'
                  }`}
                >
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <span
                        className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
                          isSelected
                            ? 'bg-[#130108] text-[#D5991C]'
                            : 'bg-[#410217] text-[#D5991C] border border-[#D5991C]/30'
                        }`}
                      >
                        {service.badge}
                      </span>
                    </div>
                    <h3 className="font-serif text-lg sm:text-xl font-bold leading-snug">
                      {service.title}
                    </h3>
                  </div>
                  <ArrowUpRight
                    className={`w-5 h-5 shrink-0 transition-transform ${
                      isSelected ? 'text-[#130108] translate-x-0.5 -translate-y-0.5' : 'text-[#D5991C]/60'
                    }`}
                  />
                </button>
              );
            })}
          </div>

          {/* Right Column (7 cols): Selected Service Detail & Visual Diagram */}
          <div className="lg:col-span-7">
            <div
              ref={detailRef}
              key={activeService.id}
              className="h-full rounded-2xl bg-[#2B010F]/90 border border-[#D5991C]/45 p-7 sm:p-9 flex flex-col justify-between shadow-xl backdrop-blur-xs"
            >
              <div>
                <div className="flex flex-wrap items-center justify-between gap-3 pb-5 mb-6 border-b border-[#F2D69D]/20">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#D5991C]/20 text-[#D5991C] border border-[#D5991C]/40">
                    {activeService.badge}
                  </span>
                  <span className="text-xs text-[#00FF9D] font-medium flex items-center space-x-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{activeService.metricHighlight}</span>
                  </span>
                </div>

                <h3 className="font-serif text-3xl sm:text-4xl text-[#FBF3E2] font-normal tracking-tight leading-tight">
                  {activeService.title}
                </h3>
                <p className="mt-2 text-base font-medium text-[#D5991C]">
                  {activeService.tagline}
                </p>

                <p className="mt-4 text-sm sm:text-base text-[#FBF3E2]/85 font-sans leading-relaxed">
                  {activeService.description}
                </p>

                {/* Animated SVG Architecture Flow Diagram for Selected Service */}
                <div className="mt-6 p-4 rounded-xl bg-[#1F010B] border border-[#F2D69D]/20">
                  <div className="text-xs font-medium text-[#F2D69D]/80 mb-3">
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
                            rx="10"
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

                {/* What's Included */}
                <div className="mt-6">
                  <div className="text-xs font-semibold text-[#F2D69D] mb-3">
                    What This Includes
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {activeService.deliverables.map((item, i) => (
                      <div
                        key={i}
                        className="flex items-center space-x-2.5 p-3 rounded-lg bg-[#410217]/70 border border-[#F2D69D]/15 text-xs text-[#FBF3E2]"
                      >
                        <CheckCircle2 className="w-4 h-4 text-[#00A878] shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-5 border-t border-[#F2D69D]/20 flex flex-wrap items-center justify-between gap-4">
                <button
                  onClick={onOpenAudit}
                  className="group inline-flex items-center space-x-2 px-5 py-2.5 rounded-lg bg-[#D5991C] hover:bg-[#E5A932] text-[#130108] text-xs font-semibold transition-all cursor-pointer"
                >
                  <Shield className="w-4 h-4" />
                  <span>Talk With Us About This Solution</span>
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </button>

                <button
                  onClick={() => onNavigate('services')}
                  className="text-xs font-semibold text-[#F2D69D] hover:text-[#D5991C] transition-colors cursor-pointer"
                >
                  See Technical Specifications →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
