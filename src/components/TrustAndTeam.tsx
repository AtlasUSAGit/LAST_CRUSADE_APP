import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Flip } from 'gsap/Flip';
import { ArrowUpRight, BookOpen, Sparkles, Layers } from 'lucide-react';
import { NavigationPage } from '../types';
import { SectionHeader } from './home/SectionHeader';

gsap.registerPlugin(ScrollTrigger, Flip);

export interface TrustAndTeamProps {
  onNavigate?: (page: NavigationPage) => void;
}

interface VolumeSummaryCard {
  volNumber: string;
  title: string;
  plainSubtitle: string;
  summary: string;
  pages: string;
  highlights: string[];
  targetPage: NavigationPage;
  accentColor: string;
}

const FIVE_VOLUMES: VolumeSummaryCard[] = [
  {
    volNumber: 'Volume I',
    title: 'Foundations of AEO & Counter-AEO',
    plainSubtitle: 'How AI Answer Engines Get Tricked—and How to Shield Them',
    summary:
      'Explores how modern AI chatbots retrieve web pages, why simple keyword or anomaly filters fail, and how our core defense layers stop poisoned pages, fake citations, split-document logic traps, and pre-market trading ambushes.',
    pages: '54 Pages + 3D Lab',
    highlights: [
      'Stops single web pages from hijacking thousands of AI searches',
      'Cross-checks 3 different search engines at once',
      'Blocks fake morning market rumors before bots trade',
    ],
    targetPage: 'counter-geo',
    accentColor: '#D5991C',
  },
  {
    volNumber: 'Volume II',
    title: 'Long-Term Memory, PDFs, Swarms & Privacy',
    plainSubtitle: 'Protecting AI Agents Over Months of Use',
    summary:
      'Addresses what happens when AI agents save daily memories, read visual charts, and talk to other bots. Shows how to rewind slow memory tampering, scrub hidden pixel traps from PDFs, and prove safety compliance with zero-knowledge privacy.',
    pages: '42 Pages + 3D Lab',
    highlights: [
      'Catches slow day-by-day tampering of an AI’s memory',
      'Scrubs invisible instructions hidden in PDF charts',
      'Proves safety compliance without revealing trade secrets',
    ],
    targetPage: 'counter-geo-vol2',
    accentColor: '#00A878',
  },
  {
    volNumber: 'Volume III',
    title: 'Stress-Testing 250,000 Documents & Market Sims',
    plainSubtitle: 'Putting the Defense Stack to the Test',
    summary:
      'Our complete benchmark study testing all defense layers against 250,000 documents and simulated Wall Street flash crashes. Demonstrates how we eliminate false alarms on real financial filings while stopping coordinated attacks.',
    pages: '38 Pages + Benchmark Lab',
    highlights: [
      '99.6% accuracy across 7 major attack styles',
      'Cuts false alarms on real SEC 10-K filings to 0.38%',
      'Replays a 50-bot pre-market flash-crash simulation',
    ],
    targetPage: 'counter-geo-vol3',
    accentColor: '#A78BFA',
  },
  {
    volNumber: 'Volume IV',
    title: 'High-Speed Hardware & Enterprise Deployment',
    plainSubtitle: 'Bringing AI Search Defense to Trading Desks & Institutions',
    summary:
      'Translates our software filters into an ultra-fast 142-nanosecond hardware circuit breaker for trading desks, alongside an air-gapped enterprise appliance and a clear return-on-investment model.',
    pages: '46 Pages + Hardware Lab',
    highlights: [
      '142-nanosecond hardware brake for automated trading',
      'Air-gapped deployment for banks & defense agencies',
      'Clear risk-reduction & ROI modeling',
    ],
    targetPage: 'counter-geo-vol4',
    accentColor: '#F59E0B',
  },
  {
    volNumber: 'Volume V',
    title: 'Agent-to-Agent Discovery & Security',
    plainSubtitle: 'Winning & Securing the Emerging AI Agent Economy',
    summary:
      'Examines how autonomous AI agents discover, evaluate, and hire other software tools behind the scenes. Shows how to format your tools so agents pick them first—and how to block rogue tools from hijacking your agents.',
    pages: '52 Pages + Agent Lab',
    highlights: [
      'Boosts legitimate tool selection by AI agents to 79%–96%',
      'Cryptographic handshakes verify trusted agent partners',
      'Data isolation stops external tools from hijacking prompts',
    ],
    targetPage: 'counter-geo-vol5',
    accentColor: '#38BDF8',
  },
];

export const TrustAndTeam: React.FC<TrustAndTeamProps> = ({ onNavigate }) => {
  const rootRef = useRef<HTMLElement>(null);
  const originSlotRef = useRef<HTMLDivElement>(null);
  const destSlotRef = useRef<HTMLDivElement>(null);
  const flipBadgeRef = useRef<HTMLDivElement>(null);
  const foliosStackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      // 1. Scroll-Driven GSAP Flip Layout Teleportation
      const badge = flipBadgeRef.current;
      const originSlot = originSlotRef.current;
      const destSlot = destSlotRef.current;

      if (badge && originSlot && destSlot) {
        ScrollTrigger.create({
          trigger: destSlot,
          start: 'top 78%',
          onEnter: () => {
            if (badge.parentElement === destSlot) return;
            const state = Flip.getState(badge);
            destSlot.appendChild(badge);
            Flip.from(state, {
              duration: 0.85,
              ease: 'expo.inOut',
              absolute: true,
            });
          },
          onLeaveBack: () => {
            if (badge.parentElement === originSlot) return;
            const state = Flip.getState(badge);
            originSlot.appendChild(badge);
            Flip.from(state, {
              duration: 0.85,
              ease: 'expo.inOut',
              absolute: true,
            });
          },
        });
      }

      // 2. Sticky Overlapping Architectural Folios — 3D Depth Stack Recession
      const stackEl = foliosStackRef.current;
      if (stackEl) {
        const folios = gsap.utils.toArray<HTMLElement>('.research-folio-plate', stackEl);
        folios.forEach((folio, i) => {
          if (i === folios.length - 1) return;
          const nextFolio = folios[i + 1];
          gsap.to(folio, {
            scale: 0.935 - (folios.length - 1 - i) * 0.004,
            rotationX: 4,
            transformOrigin: '50% 0%',
            ease: 'none',
            scrollTrigger: {
              trigger: nextFolio,
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
      className="py-20 md:py-28 bg-transparent border-b border-[#410217]/20 relative z-10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
          <div className="velocity-item flex-1">
            <SectionHeader
              title={
                <>
                  Five Volumes of Original{' '}
                  <em className="italic text-[#8B5A0B] font-normal">AEO &amp; Counter-AEO Research.</em>
                </>
              }
              subtitle="Every product capability we build is grounded in open, inspectable research. Explore our five-volume series—complete with word-for-word whitepapers and interactive 3D simulation labs."
              rightSlot={
                <button
                  onClick={() => onNavigate?.('research')}
                  className="group inline-flex items-center space-x-2 px-5 py-3 rounded-none bg-[#D5991C] hover:bg-[#E5A932] text-[#130108] text-xs font-semibold transition-all shadow-sm cursor-pointer"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Open Full Research Library</span>
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </button>
              }
            />
          </div>

          {/* Origin Slot for Shared GSAP Flip Teleporting Monolith Badge */}
          <div
            ref={originSlotRef}
            className="origin-slot min-h-[60px] min-w-[270px] flex items-center justify-start lg:justify-end"
          >
            <div
              ref={flipBadgeRef}
              className="shared-flip-badge inline-flex items-center gap-3 px-4 py-2.5 bg-[#2B010F] text-[#FBF3E2] border-2 border-[#D5991C] rounded-none shadow-lg"
            >
              <Layers className="w-4 h-4 text-[#D5991C] shrink-0" />
              <div>
                <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#D5991C] font-bold">
                  INSPECTABLE RESEARCH CORPUS
                </div>
                <div className="text-xs font-mono text-[#FBF3E2]">
                  05 VOLUMES + 8 LIVE WEBGL SCENES
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Visual Overview Diagram of How the 5 Volumes Connect — Sharp Architectural Frame */}
        <div className="mb-12 rounded-none bg-[#2B010F]/95 border-2 border-[#D5991C] p-5 sm:p-6">
          <div className="text-sm font-medium text-[#FBF3E2] mb-4 pb-3 border-b border-[#F2D69D]/20 flex flex-wrap items-center justify-between gap-2">
            <span className="font-mono uppercase tracking-wider text-xs text-[#D5991C] font-bold">
              How Our Five Research Volumes Fit Together
            </span>
            <span className="text-xs text-[#FBF3E2]/80 font-mono">
              Click any volume folio below to read the paper or launch its 3D lab
            </span>
          </div>
          <svg viewBox="0 0 960 95" className="w-full h-auto overflow-visible">
            {[
              { x: 10, label: 'Volume I', sub: 'Core AI Search Shield', color: '#D5991C' },
              { x: 202, label: 'Volume II', sub: 'Memory, PDFs & Privacy', color: '#00A878' },
              { x: 394, label: 'Volume III', sub: '250k Doc Stress-Tests', color: '#A78BFA' },
              { x: 586, label: 'Volume IV', sub: '142ns Hardware & ROI', color: '#F59E0B' },
              { x: 778, label: 'Volume V', sub: 'Agent-to-Agent Economy', color: '#38BDF8' },
            ].map((node, i) => (
              <g key={i}>
                {i < 4 && (
                  <>
                    <line
                      x1={node.x + 172}
                      y1="46"
                      x2={node.x + 192}
                      y2="46"
                      stroke="#F2D69D"
                      strokeOpacity="0.4"
                      strokeWidth="2"
                    />
                    <circle r="3" fill={node.color}>
                      <animate
                        attributeName="cx"
                        from={node.x + 172}
                        to={node.x + 192}
                        dur="1.5s"
                        repeatCount="indefinite"
                      />
                      <animate attributeName="cy" values="46;46" dur="1.5s" repeatCount="indefinite" />
                    </circle>
                  </>
                )}
                <rect
                  x={node.x}
                  y="10"
                  width="172"
                  height="72"
                  rx="0"
                  fill="#350213"
                  stroke={node.color}
                  strokeWidth="1.5"
                />
                <text x={node.x + 86} y="38" textAnchor="middle" fill={node.color} fontSize="13" fontWeight="700">
                  {node.label}
                </text>
                <text x={node.x + 86} y="58" textAnchor="middle" fill="#FBF3E2" fontSize="11">
                  {node.sub}
                </text>
              </g>
            ))}
          </svg>
        </div>

        {/* Destination Slot Bar for GSAP Flip Teleportation */}
        <div className="border-t-2 border-b border-[#410217] py-3 mb-10 flex flex-wrap items-center justify-between gap-4">
          <div className="text-xs font-mono uppercase tracking-[0.2em] text-[#410217] font-bold">
            STICKY ARCHITECTURAL FOLIO STACK // VOLUMES I – V &amp; 3D LAB
          </div>
          <div
            ref={destSlotRef}
            className="destination-slot min-h-[56px] flex items-center"
          />
        </div>

        {/* Sticky Overlapping Architectural Folios (5 Volumes + 6th 3D Simulator Monolith) */}
        <div
          ref={foliosStackRef}
          className="relative space-y-14 sm:space-y-20 pb-12"
          style={{ perspective: '1400px' }}
        >
          {FIVE_VOLUMES.map((vol, idx) => {
            const stickyTop = 78 + idx * 18;
            return (
              <article
                key={vol.volNumber}
                data-vol-card
                style={{ top: `${stickyTop}px`, zIndex: idx + 10 }}
                onClick={() => onNavigate?.(vol.targetPage)}
                className="research-folio-plate group sticky rounded-none bg-[#2B010F]/95 border-2 border-[#D5991C] p-6 sm:p-10 transition-all cursor-pointer shadow-[0_-18px_50px_rgba(43,1,15,0.5)] will-change-transform"
              >
                {/* Sharp Corner Crosshair Ticks */}
                <span className="absolute -top-2 -left-2 text-[#D5991C] font-mono text-sm leading-none select-none">+</span>
                <span className="absolute -top-2 -right-2 text-[#D5991C] font-mono text-sm leading-none select-none">+</span>
                <span className="absolute -bottom-2 -left-2 text-[#D5991C] font-mono text-sm leading-none select-none">+</span>
                <span className="absolute -bottom-2 -right-2 text-[#D5991C] font-mono text-sm leading-none select-none">+</span>

                {/* Top Folio Spine */}
                <div className="flex flex-wrap items-center justify-between gap-4 pb-4 mb-6 border-b border-[#F2D69D]/20">
                  <div className="flex items-center gap-4">
                    <span className="text-2xl font-mono font-bold text-[#D5991C]">
                      0{idx + 1}
                    </span>
                    <span className="h-4 w-px bg-[#F2D69D]/30" />
                    <span
                      className="px-3 py-1 rounded-none text-xs font-mono uppercase tracking-wider font-bold text-[#130108]"
                      style={{ backgroundColor: vol.accentColor }}
                    >
                      {vol.volNumber}
                    </span>
                    <span className="text-xs text-[#F2D69D]/80 font-mono">
                      {vol.pages}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-wider font-semibold text-[#D5991C]">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Read Paper &amp; Launch 3D Lab</span>
                    <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                </div>

                {/* Split Architectural Columns */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  <div className="lg:col-span-7">
                    <h3 className="font-serif text-2xl sm:text-4xl text-[#FBF3E2] group-hover:text-[#D5991C] transition-colors leading-snug">
                      {vol.title}
                    </h3>
                    <p className="text-xs sm:text-sm font-medium text-[#D5991C] mt-1.5 mb-4">
                      {vol.plainSubtitle}
                    </p>
                    <p className="text-sm sm:text-base text-[#FBF3E2]/85 font-sans leading-relaxed">
                      {vol.summary}
                    </p>
                  </div>

                  <div className="lg:col-span-5 lg:border-l lg:border-[#F2D69D]/25 lg:pl-8">
                    <div className="text-xs font-mono uppercase tracking-wider text-[#D5991C] font-bold mb-3">
                      Key Research Highlights
                    </div>
                    <ul className="border-t border-[#F2D69D]/20 divide-y divide-[#F2D69D]/15">
                      {vol.highlights.map((item, hIdx) => (
                        <li
                          key={hIdx}
                          className="py-3 flex items-start space-x-2.5 text-xs sm:text-sm text-[#FBF3E2]/90"
                        >
                          <span className="w-1.5 h-1.5 rounded-none bg-[#D5991C] mt-1.5 shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </article>
            );
          })}

          {/* 6th Sticky Architectural Folio: Interactive 3D Command Center Callout */}
          <article
            data-vol-card
            style={{ top: `${78 + FIVE_VOLUMES.length * 18}px`, zIndex: 20 }}
            onClick={() => onNavigate?.('counter-geo-ops')}
            className="research-folio-plate group sticky rounded-none bg-gradient-to-br from-[#5C0A24]/95 via-[#3A0215]/95 to-[#24010D]/95 border-2 border-[#D5991C] p-6 sm:p-10 transition-all cursor-pointer shadow-[0_-20px_60px_rgba(43,1,15,0.6)] will-change-transform"
          >
            <span className="absolute -top-2 -left-2 text-[#D5991C] font-mono text-sm leading-none select-none">+</span>
            <span className="absolute -top-2 -right-2 text-[#D5991C] font-mono text-sm leading-none select-none">+</span>
            <span className="absolute -bottom-2 -left-2 text-[#D5991C] font-mono text-sm leading-none select-none">+</span>
            <span className="absolute -bottom-2 -right-2 text-[#D5991C] font-mono text-sm leading-none select-none">+</span>

            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 mb-6 border-b border-[#F2D69D]/20">
              <div className="flex items-center gap-4">
                <span className="text-2xl font-mono font-bold text-[#D5991C]">
                  06
                </span>
                <span className="h-4 w-px bg-[#F2D69D]/30" />
                <span className="px-3 py-1 rounded-none text-xs font-mono uppercase tracking-wider font-bold bg-[#00A878] text-white">
                  Interactive 3D Simulator
                </span>
              </div>
              <span className="text-xs text-[#00FF9D] font-mono font-medium">
                8 Live WebGL Scenes
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8">
                <h3 className="font-serif text-2xl sm:text-4xl text-[#FBF3E2] group-hover:text-[#D5991C] transition-colors leading-snug">
                  See Every Attack &amp; Defense in Live 3D
                </h3>
                <p className="text-xs sm:text-sm font-medium text-[#D5991C] mt-1.5 mb-3">
                  Plain-English Analogies + Interactive Sliders
                </p>
                <p className="text-sm sm:text-base text-[#FBF3E2]/85 font-sans leading-relaxed">
                  Not a mathematician? Start in Plain-English mode to explore everyday analogies and interactive sandboxes for all 8 AI threat classes—then step up to Cyber Ops or Math &amp; Code whenever you want.
                </p>
              </div>

              <div className="lg:col-span-4 lg:border-l lg:border-[#F2D69D]/25 lg:pl-8">
                <div className="flex items-center justify-between text-xs font-mono uppercase tracking-wider font-bold text-[#130108] bg-[#D5991C] group-hover:bg-[#E5A932] px-5 py-4 rounded-none transition-colors">
                  <span>Launch 3D Threat Lab</span>
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
};

export default TrustAndTeam;
