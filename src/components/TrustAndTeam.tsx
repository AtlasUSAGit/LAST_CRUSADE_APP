import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight, BookOpen, Sparkles } from 'lucide-react';
import { NavigationPage } from '../types';
import { SectionHeader } from './home/SectionHeader';

gsap.registerPlugin(ScrollTrigger);

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
  const leftCardRef = useRef<HTMLDivElement>(null);
  const stackContainerRef = useRef<HTMLDivElement>(null);
  const [activeVolIdx, setActiveVolIdx] = useState<number>(0);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      const container = stackContainerRef.current;
      const leftCard = leftCardRef.current;
      if (!container) return;

      // Pin the Left Hexagonal Index Card while scrolling through the volumes, unpin at bottom of section
      if (leftCard && window.innerWidth >= 1024) {
        ScrollTrigger.create({
          trigger: container,
          start: 'top 96px',
          end: () => `bottom ${96 + leftCard.offsetHeight}px`,
          pin: leftCard,
          pinSpacing: false,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        });
      }

      const rows = gsap.utils.toArray<HTMLElement>('.vol-sticky-row', container);

      rows.forEach((row, idx) => {
        const rightShard = row.querySelector<HTMLElement>('.vol-right-shard');

        // Update Left-Third Hexagonal Constellation as each row scrolls into view
        ScrollTrigger.create({
          trigger: row,
          start: 'top 52%',
          end: 'bottom 52%',
          onEnter: () => setActiveVolIdx(idx),
          onEnterBack: () => setActiveVolIdx(idx),
        });

        // Stagger the Right 1/3 Shard so Center 1/3 locks first, followed by Right 1/3
        if (rightShard && idx > 0) {
          gsap.fromTo(
            rightShard,
            { y: 48 },
            {
              y: 0,
              ease: 'none',
              scrollTrigger: {
                trigger: row,
                start: 'top 85%',
                end: 'top 25%',
                scrub: true,
              },
            }
          );
        }
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      className="py-20 md:py-28 bg-transparent border-b border-[#410217]/20 relative z-10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title={
            <>
              Five Volumes of Original{' '}
              <em className="italic text-[#8B5A0B] font-normal">
                AEO &amp; Counter-AEO Research.
              </em>
            </>
          }
          subtitle="Every product capability we build is grounded in open, inspectable research. Explore our five-volume series—complete with word-for-word whitepapers and interactive 3D simulation labs."
          rightSlot={
            <button
              onClick={() => onNavigate?.('research')}
              className="group inline-flex items-center space-x-2 px-6 py-3 bg-[#D5991C] hover:bg-[#E5A932] text-[#130108] text-xs font-mono uppercase tracking-wider font-bold transition-all shadow-md cursor-pointer"
              style={{
                clipPath:
                  'polygon(12px 0%, 100% 0%, calc(100% - 12px) 100%, 0% 100%)',
              }}
            >
              <BookOpen className="w-4 h-4" />
              <span>Open Full Research Library</span>
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          }
        />

        {/* Interlocking Hexagonal & Triangular Tessellation Diagram of How the 5 Volumes Connect */}
        <div
          className="mb-14 bg-[#2B010F]/95 border-2 border-[#D5991C] p-5 sm:p-7 shadow-xl"
          style={{
            clipPath:
              'polygon(24px 0%, 100% 0%, 100% calc(100% - 24px), calc(100% - 24px) 100%, 0% 100%, 0% 24px)',
          }}
        >
          <div className="text-sm font-medium text-[#FBF3E2] mb-4 pb-3 border-b border-[#F2D69D]/20 flex flex-wrap items-center justify-between gap-2">
            <span className="font-mono uppercase tracking-wider text-xs text-[#D5991C] font-bold">
              How Our Five Research Volumes Fit Together
            </span>
            <span className="text-xs text-[#FBF3E2]/80 font-mono">
              Click any volume card below to read the paper or launch its 3D lab
            </span>
          </div>

          <svg viewBox="0 0 960 112" className="w-full h-auto overflow-visible">
            {/* Background Triangular Tessellation Mesh Lines */}
            <g stroke="#F2D69D" strokeOpacity="0.12" strokeWidth="1" fill="none">
              <polygon points="96,6 192,106 0,106" />
              <polygon points="288,6 384,106 192,106" />
              <polygon points="480,6 576,106 384,106" />
              <polygon points="672,6 768,106 576,106" />
              <polygon points="864,6 960,106 768,106" />
            </g>

            {[
              { x: 10, label: 'Volume I', sub: 'Core AI Search Shield', color: '#D5991C' },
              { x: 202, label: 'Volume II', sub: 'Memory, PDFs & Privacy', color: '#00A878' },
              { x: 394, label: 'Volume III', sub: '250k Doc Stress-Tests', color: '#A78BFA' },
              { x: 586, label: 'Volume IV', sub: '142ns Hardware & ROI', color: '#F59E0B' },
              { x: 778, label: 'Volume V', sub: 'Agent-to-Agent Economy', color: '#38BDF8' },
            ].map((node, i) => {
              const cx = node.x + 86;
              const hexPoints = `${node.x + 18},14 ${node.x + 154},14 ${node.x + 172},56 ${
                node.x + 154
              },98 ${node.x + 18},98 ${node.x},56`;

              return (
                <g key={i}>
                  {i < 4 && (
                    <>
                      {/* Triangular Tessellation Bridge Between Hexagons */}
                      <polygon
                        points={`${node.x + 172},44 ${node.x + 202},56 ${node.x + 172},68`}
                        fill={node.color}
                        fillOpacity="0.35"
                        stroke={node.color}
                        strokeWidth="1.2"
                      />
                      <circle r="3" fill={node.color}>
                        <animate
                          attributeName="cx"
                          from={node.x + 172}
                          to={node.x + 202}
                          dur="1.5s"
                          repeatCount="indefinite"
                        />
                        <animate
                          attributeName="cy"
                          values="56;56"
                          dur="1.5s"
                          repeatCount="indefinite"
                        />
                      </circle>
                    </>
                  )}
                  <polygon
                    points={hexPoints}
                    fill="#350213"
                    stroke={node.color}
                    strokeWidth="1.8"
                  />
                  <text
                    x={cx}
                    y="48"
                    textAnchor="middle"
                    fill={node.color}
                    fontSize="13"
                    fontWeight="700"
                  >
                    {node.label}
                  </text>
                  <text x={cx} y="68" textAnchor="middle" fill="#FBF3E2" fontSize="10.5">
                    {node.sub}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* 1/3 + 1/3 + 1/3 STICKY GEOMETRIC LAYOUT: Left 1/3 Hexagonal Radar + Center 1/3 & Right 1/3 Staggered Shards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT THIRD (1/3 WIDTH — 4 COLS): Sticky Hexagonal Constellation Radar */}
          <div className="lg:col-span-4 self-start">
            <div
              ref={leftCardRef}
              className="bg-[#2B010F]/95 border-2 border-[#D5991C] p-6 shadow-2xl"
              style={{
                clipPath:
                  'polygon(22px 0%, 100% 0%, 100% calc(100% - 22px), calc(100% - 22px) 100%, 0% 100%, 0% 22px)',
              }}
            >
              <div className="flex items-center justify-end pb-3 mb-4 border-b border-[#F2D69D]/20">
                <span className="text-[11px] font-mono text-[#00FF9D]">
                  0{activeVolIdx + 1} / 06
                </span>
              </div>

              {/* 6-Cell Interlocking Hexagonal Constellation SVG */}
              <svg viewBox="0 0 300 220" className="w-full h-auto mb-4">
                {/* Isometric Triangle Lattice */}
                <g stroke="#F2D69D" strokeOpacity="0.15" strokeWidth="1" fill="none">
                  <polygon points="150,10 280,200 20,200" />
                  <polygon points="20,20 280,20 150,210" />
                </g>

                {[
                  { cx: 85, cy: 55, label: 'VOL I', color: '#D5991C', idx: 0 },
                  { cx: 215, cy: 55, label: 'VOL II', color: '#00A878', idx: 1 },
                  { cx: 52, cy: 115, label: 'VOL III', color: '#A78BFA', idx: 2 },
                  { cx: 150, cy: 115, label: 'VOL IV', color: '#F59E0B', idx: 3 },
                  { cx: 248, cy: 115, label: 'VOL V', color: '#38BDF8', idx: 4 },
                  { cx: 150, cy: 175, label: '3D LAB', color: '#00FF9D', idx: 5 },
                ].map((cell) => {
                  const isActive = activeVolIdx === cell.idx;
                  const r = 34;
                  const pts = [30, 90, 150, 210, 270, 330]
                    .map((deg) => {
                      const rad = (Math.PI / 180) * deg;
                      return `${(cell.cx + r * Math.cos(rad)).toFixed(1)},${(
                        cell.cy +
                        r * Math.sin(rad)
                      ).toFixed(1)}`;
                    })
                    .join(' ');

                  return (
                    <g
                      key={cell.label}
                      className="cursor-pointer"
                      onClick={() => {
                        if (cell.idx < FIVE_VOLUMES.length) {
                          onNavigate?.(FIVE_VOLUMES[cell.idx].targetPage);
                        } else {
                          onNavigate?.('counter-geo-ops');
                        }
                      }}
                    >
                      <polygon
                        points={pts}
                        fill={isActive ? cell.color : '#350213'}
                        stroke={isActive ? '#FBF3E2' : cell.color}
                        strokeWidth={isActive ? '2.5' : '1.4'}
                      />
                      <text
                        x={cell.cx}
                        y={cell.cy + 4}
                        textAnchor="middle"
                        fill={isActive ? '#130108' : '#FBF3E2'}
                        fontSize="10"
                        fontFamily="monospace"
                        fontWeight="700"
                      >
                        {cell.label}
                      </text>
                    </g>
                  );
                })}
              </svg>

              {/* Volume Roster List */}
              <div className="space-y-1.5">
                {FIVE_VOLUMES.map((v, idx) => (
                  <button
                    key={v.volNumber}
                    onClick={() => onNavigate?.(v.targetPage)}
                    className={`w-full px-3 py-2 text-left text-xs font-mono flex items-center justify-between transition-colors cursor-pointer ${
                      activeVolIdx === idx
                        ? 'bg-[#D5991C] text-[#130108] font-bold'
                        : 'bg-[#350213]/80 text-[#FBF3E2]/80 hover:text-[#FBF3E2]'
                    }`}
                    style={{
                      clipPath:
                        'polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)',
                    }}
                  >
                    <span className="truncate">
                      {v.volNumber}: {v.title}
                    </span>
                    <ArrowUpRight className="w-3.5 h-3.5 shrink-0 ml-2" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* CENTER THIRD (1/3) + RIGHT THIRD (1/3) STAGGERED STICKY VOLUME SHARDS (8 COLS) */}
          <div ref={stackContainerRef} className="lg:col-span-8 space-y-14 pb-10">
            {FIVE_VOLUMES.map((vol, idx) => {
              const stickyTop = 98 + idx * 16;

              return (
                <div
                  key={vol.volNumber}
                  data-vol-card
                  style={{ top: `${stickyTop}px`, zIndex: idx + 10 }}
                  onClick={() => onNavigate?.(vol.targetPage)}
                  className="vol-sticky-row sticky grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch cursor-pointer group"
                >
                  {/* CENTER THIRD SHARD (1/3 OF SCREEN): Volume Thesis & Summary */}
                  <article
                    className="vol-center-shard bg-[#2B010F]/98 border-2 border-[#D5991C] p-6 flex flex-col justify-between shadow-[0_-16px_40px_rgba(19,1,8,0.65)]"
                    style={{
                      clipPath:
                        'polygon(20px 0%, 100% 0%, 100% 100%, 0% 100%, 0% 20px)',
                    }}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 pb-3 mb-4 border-b border-[#F2D69D]/20">
                        <span
                          className="px-3.5 py-1 text-xs font-mono font-bold text-[#130108]"
                          style={{
                            backgroundColor: vol.accentColor,
                            clipPath:
                              'polygon(8px 0%, calc(100% - 8px) 0%, 100% 50%, calc(100% - 8px) 100%, 8px 100%, 0% 50%)',
                          }}
                        >
                          {vol.volNumber}
                        </span>
                        <span className="text-xs text-[#F2D69D]/80 font-mono">
                          {vol.pages}
                        </span>
                      </div>

                      <h3 className="font-serif text-2xl text-[#FBF3E2] group-hover:text-[#D5991C] transition-colors leading-snug">
                        {vol.title}
                      </h3>
                      <p className="text-xs font-medium text-[#D5991C] mt-1.5 mb-3">
                        {vol.plainSubtitle}
                      </p>
                      <p className="text-sm text-[#FBF3E2]/85 font-sans leading-relaxed">
                        {vol.summary}
                      </p>
                    </div>

                    <div className="pt-3 mt-4 border-t border-[#F2D69D]/15 flex items-center justify-end text-[10px] font-mono uppercase tracking-widest text-[#D5991C]/80">
                      <span>MONOGRAPH 0{idx + 1}</span>
                    </div>
                  </article>

                  {/* RIGHT THIRD SHARD (1/3 OF SCREEN): Staggered Highlights & Launch Action */}
                  <article
                    className="vol-right-shard bg-[#1E000A]/98 border-2 border-[#F2D69D]/35 group-hover:border-[#D5991C] p-6 flex flex-col justify-between shadow-[0_-16px_40px_rgba(19,1,8,0.65)] transition-colors"
                    style={{
                      clipPath:
                        'polygon(0% 0%, calc(100% - 20px) 0%, 100% 20px, 100% 100%, 20px 100%, 0% calc(100% - 20px))',
                    }}
                  >
                    <div>
                      <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#F2D69D]/20">
                        <span className="text-[11px] font-mono uppercase tracking-widest text-[#D5991C] font-bold">
                          KEY FINDINGS
                        </span>
                        <svg width="16" height="14" viewBox="0 0 16 14">
                          <polygon points="8,0 16,14 0,14" fill={vol.accentColor} />
                        </svg>
                      </div>

                      <ul className="space-y-3 mb-6">
                        {vol.highlights.map((item, hIdx) => (
                          <li
                            key={hIdx}
                            className="flex items-start space-x-2.5 text-xs sm:text-sm text-[#FBF3E2]/90"
                          >
                            {/* Isometric Triangle Bullet */}
                            <svg
                              width="10"
                              height="10"
                              viewBox="0 0 10 10"
                              className="mt-1 shrink-0"
                            >
                              <polygon points="0,0 10,5 0,10" fill="#D5991C" />
                            </svg>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div
                      className="pt-3.5 px-4 py-3 bg-[#350213] border border-[#D5991C]/50 flex items-center justify-between text-xs font-semibold text-[#D5991C]"
                      style={{
                        clipPath:
                          'polygon(10px 0%, 100% 0%, calc(100% - 10px) 100%, 0% 100%)',
                      }}
                    >
                      <span className="flex items-center space-x-1.5">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Read Paper &amp; Launch 3D Lab</span>
                      </span>
                      <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </div>
                  </article>
                </div>
              );
            })}

            {/* 6th Row: Interactive 3D Command Center Callout in Two Interlocking 1/3 Shards */}
            <div
              data-vol-card
              style={{ top: `${98 + FIVE_VOLUMES.length * 16}px`, zIndex: 20 }}
              onClick={() => onNavigate?.('counter-geo-ops')}
              className="vol-sticky-row sticky grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch cursor-pointer group"
            >
              <article
                className="vol-center-shard bg-gradient-to-br from-[#5C0A24]/98 via-[#3A0215]/98 to-[#24010D]/98 border-2 border-[#D5991C] p-6 flex flex-col justify-between shadow-2xl"
                style={{
                  clipPath:
                    'polygon(20px 0%, 100% 0%, 100% 100%, 0% 100%, 0% 20px)',
                }}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 pb-3 mb-4 border-b border-[#F2D69D]/20">
                    <span
                      className="px-3.5 py-1 text-xs font-mono font-bold bg-[#00A878] text-white"
                      style={{
                        clipPath:
                          'polygon(8px 0%, calc(100% - 8px) 0%, 100% 50%, calc(100% - 8px) 100%, 8px 100%, 0% 50%)',
                      }}
                    >
                      Interactive 3D Simulator
                    </span>
                    <span className="text-xs text-[#00FF9D] font-mono font-medium">
                      8 Live WebGL Scenes
                    </span>
                  </div>

                  <h3 className="font-serif text-2xl text-[#FBF3E2] group-hover:text-[#D5991C] transition-colors leading-snug">
                    See Every Attack &amp; Defense in Live 3D
                  </h3>
                  <p className="text-xs font-medium text-[#D5991C] mt-1.5 mb-3">
                    Plain-English Analogies + Interactive Sliders
                  </p>
                </div>

                <div className="pt-3 border-t border-[#F2D69D]/20 text-[10px] font-mono uppercase tracking-widest text-[#00FF9D]">
                  LIVE WEBGL SANDBOX // 08 THREAT CLASSES
                </div>
              </article>

              <article
                className="vol-right-shard bg-[#1B000A]/98 border-2 border-[#D5991C] p-6 flex flex-col justify-between shadow-2xl"
                style={{
                  clipPath:
                    'polygon(0% 0%, calc(100% - 20px) 0%, 100% 20px, 100% 100%, 20px 100%, 0% calc(100% - 20px))',
                }}
              >
                <p className="text-sm text-[#FBF3E2]/85 font-sans leading-relaxed mb-6">
                  Not a mathematician? Start in Plain-English mode to explore everyday analogies and interactive sandboxes for all 8 AI threat classes—then step up to Cyber Ops or Math &amp; Code whenever you want.
                </p>

                <div
                  className="flex items-center justify-between text-xs font-mono uppercase tracking-wider font-bold text-[#130108] bg-[#D5991C] group-hover:bg-[#E5A932] px-5 py-3.5 transition-colors"
                  style={{
                    clipPath:
                      'polygon(10px 0%, 100% 0%, calc(100% - 10px) 100%, 0% 100%)',
                  }}
                >
                  <span>Launch 3D Threat Lab</span>
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </article>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustAndTeam;
