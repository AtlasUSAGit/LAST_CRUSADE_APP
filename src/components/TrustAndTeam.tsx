import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight, BookOpen, Sparkles } from 'lucide-react';
import { NavigationPage } from '../types';
import { SectionHeader } from './home/SectionHeader';

gsap.registerPlugin(ScrollTrigger);

interface TrustAndTeamProps {
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

  useLayoutEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      const cards = el.querySelectorAll<HTMLElement>('[data-vol-card]');
      gsap.fromTo(
        cards,
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.09,
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

  return (
    <section
      ref={rootRef}
      className="py-20 md:py-28 bg-transparent border-b border-[#410217]/15 relative z-10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
              className="group inline-flex items-center space-x-2 px-5 py-3 rounded-lg bg-[#D5991C] hover:bg-[#E5A932] text-[#130108] text-xs font-semibold transition-all shadow-sm cursor-pointer"
            >
              <BookOpen className="w-4 h-4" />
              <span>Open Full Research Library</span>
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          }
        />

        {/* Visual Overview Diagram of How the 5 Volumes Connect */}
        <div className="mb-10 rounded-2xl bg-[#2B010F]/90 border border-[#F2D69D]/25 p-5 sm:p-6 backdrop-blur-xs">
          <div className="text-sm font-medium text-[#FBF3E2] mb-4 flex flex-wrap items-center justify-between gap-2">
            <span>How Our Five Research Volumes Fit Together</span>
            <span className="text-xs text-[#D5991C]">Click any volume card below to read the paper or launch its 3D lab</span>
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
                  rx="10"
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

        {/* 5 Volume Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FIVE_VOLUMES.map((vol) => (
            <article
              key={vol.volNumber}
              data-vol-card
              onClick={() => onNavigate?.(vol.targetPage)}
              className="group rounded-2xl bg-[#2B010F]/90 border border-[#F2D69D]/25 hover:border-[#D5991C] p-6 flex flex-col justify-between transition-all cursor-pointer shadow-lg hover:shadow-xl hover:-translate-y-0.5 backdrop-blur-xs"
            >
              <div>
                <div className="flex items-center justify-between gap-2 pb-4 mb-4 border-b border-[#F2D69D]/15">
                  <span
                    className="px-3 py-1 rounded-full text-xs font-bold text-[#130108]"
                    style={{ backgroundColor: vol.accentColor }}
                  >
                    {vol.volNumber}
                  </span>
                  <span className="text-xs text-[#F2D69D]/80 font-sans">
                    {vol.pages}
                  </span>
                </div>

                <h3 className="font-serif text-2xl text-[#FBF3E2] group-hover:text-[#D5991C] transition-colors leading-snug">
                  {vol.title}
                </h3>
                <p className="text-xs font-medium text-[#D5991C] mt-1 mb-3">
                  {vol.plainSubtitle}
                </p>
                <p className="text-sm text-[#FBF3E2]/80 font-sans leading-relaxed mb-5">
                  {vol.summary}
                </p>

                <ul className="space-y-2 mb-6">
                  {vol.highlights.map((item, idx) => (
                    <li key={idx} className="flex items-start space-x-2 text-xs text-[#FBF3E2]/90">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#D5991C] mt-1.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 border-t border-[#F2D69D]/15 flex items-center justify-between text-xs font-semibold text-[#D5991C]">
                <span className="flex items-center space-x-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Read Paper &amp; Launch 3D Lab</span>
                </span>
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </article>
          ))}

          {/* 6th Card: Interactive 3D Command Center Callout */}
          <article
            data-vol-card
            onClick={() => onNavigate?.('counter-geo-ops')}
            className="group rounded-2xl bg-gradient-to-br from-[#5C0A24]/90 via-[#3A0215]/90 to-[#24010D]/90 border-2 border-[#D5991C]/60 hover:border-[#D5991C] p-6 flex flex-col justify-between transition-all cursor-pointer shadow-xl hover:-translate-y-0.5 backdrop-blur-xs"
          >
            <div>
              <div className="flex items-center justify-between gap-2 pb-4 mb-4 border-b border-[#F2D69D]/20">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#00A878] text-white">
                  Interactive 3D Simulator
                </span>
                <span className="text-xs text-[#00FF9D] font-medium">
                  8 Live WebGL Scenes
                </span>
              </div>

              <h3 className="font-serif text-2xl text-[#FBF3E2] group-hover:text-[#D5991C] transition-colors leading-snug">
                See Every Attack &amp; Defense in Live 3D
              </h3>
              <p className="text-xs font-medium text-[#D5991C] mt-1 mb-3">
                Plain-English Analogies + Interactive Sliders
              </p>
              <p className="text-sm text-[#FBF3E2]/85 font-sans leading-relaxed mb-5">
                Not a mathematician? Start in Plain-English mode to explore everyday analogies and interactive sandboxes for all 8 AI threat classes—then step up to Cyber Ops or Math &amp; Code whenever you want.
              </p>
            </div>

            <div className="pt-4 border-t border-[#F2D69D]/20 flex items-center justify-between text-xs font-bold text-[#130108] bg-[#D5991C] group-hover:bg-[#E5A932] px-4 py-3 rounded-xl transition-colors">
              <span>Launch 3D Threat Lab</span>
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </article>
        </div>
      </div>
    </section>
  );
};
