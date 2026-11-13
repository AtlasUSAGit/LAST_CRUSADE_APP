import React, { useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight, Shield, AlertTriangle, CheckCircle2, Sparkles, BookOpen, Compass } from 'lucide-react';
import { NavigationPage } from '../types';
import Globe from './Globe';

const PETRA_GLOBE_DOTS_CONFIG = { color: '#F2D69D', size: 4, density: 8, allDots: false };

gsap.registerPlugin(ScrollTrigger);

interface HeroProps {
  onOpenAudit: () => void;
  onOpenIncident: () => void;
  onNavigate: (page: NavigationPage) => void;
}

interface RealWorldStat {
  figure: string;
  label: string;
  detail: string;
  source: string;
}

const REAL_WORLD_STATS: RealWorldStat[] = [
  {
    figure: '49%',
    label: 'U.S. adults using AI chatbots',
    detail: 'Nearly half of American adults now use generative AI engines alongside or instead of traditional search.',
    source: 'Pew Research',
  },
  {
    figure: '64%',
    label: 'Adoption among U.S. teenagers',
    detail: 'Next-generation consumers and investors treat synthesized AI answers as their primary starting point.',
    source: 'Pew Research',
  },
  {
    figure: '58.5%',
    label: 'Searches ending with zero clicks',
    detail: 'Users read the AI summary directly on the page instead of clicking out to external websites.',
    source: 'SparkToro / Datos',
  },
  {
    figure: '5 Volumes',
    label: 'Original Counter-AEO research',
    detail: '232 pages of open technical research, interactive 3D simulations, and defense architectures.',
    source: 'Last Crusade Research',
  },
];

export const Hero: React.FC<HeroProps> = ({
  onOpenAudit,
  onNavigate,
}) => {
  const rootRef = useRef<HTMLElement>(null);
  const [flowMode, setFlowMode] = useState<'protected' | 'unprotected'>('protected');

  useLayoutEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      const rule = el.querySelector<HTMLElement>('[data-hero-rule]');
      const headline = el.querySelectorAll<HTMLElement>('[data-hero-line]');
      const deck = el.querySelector<HTMLElement>('[data-hero-deck]');
      const ctas = el.querySelector<HTMLElement>('[data-hero-ctas]');
      const globe = el.querySelector<HTMLElement>('[data-hero-globe]');
      const diagram = el.querySelector<HTMLElement>('[data-hero-diagram]');
      const stats = el.querySelectorAll<HTMLElement>('[data-stat-card]');

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      if (rule) {
        tl.fromTo(
          rule,
          { scaleX: 0, transformOrigin: 'left center' },
          { scaleX: 1, duration: 1.0, ease: 'expo.out' },
          0
        );
      }

      if (headline.length) {
        tl.fromTo(
          headline,
          { yPercent: 100, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: 0.9, stagger: 0.08 },
          0.12
        );
      }

      if (deck) {
        tl.fromTo(deck, { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.75 }, 0.4);
      }

      if (ctas) {
        tl.fromTo(ctas, { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, 0.52);
      }

      if (globe) {
        tl.fromTo(
          globe,
          { opacity: 0, scale: 0.96 },
          { opacity: 1, scale: 1, duration: 1.1, ease: 'expo.out' },
          0.2
        );
      }

      if (diagram) {
        gsap.fromTo(
          diagram,
          { y: 24, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.85,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: diagram,
              start: 'top 90%',
              once: true,
            },
          }
        );
      }

      if (stats.length) {
        gsap.fromTo(
          stats,
          { y: 20, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            stagger: 0.08,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: stats[0],
              start: 'top 92%',
              once: true,
            },
          }
        );
      }
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      className="relative z-10 overflow-hidden border-b border-[#410217]/15 bg-transparent"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16 md:pt-14 md:pb-24 relative z-10">
        <div
          data-hero-rule
          className="h-px w-full bg-gradient-to-r from-[#8B5A0B]/50 via-[#410217]/20 to-transparent mb-10 md:mb-12"
        />

        {/* Main Hero Split: Copy Left + Interactive 3D Globe Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div>
              <h1 className="font-serif text-[#410217] font-normal tracking-[-0.025em] leading-[1.03] text-[2.6rem] sm:text-6xl xl:text-[4.4rem]">
                <span className="block overflow-hidden pb-1">
                  <span data-hero-line className="block">
                    Defending America
                  </span>
                </span>
                <span className="block overflow-hidden pb-1">
                  <span data-hero-line className="block">
                    In The Era Of The <em className="italic text-[#8B5A0B] font-normal">Generative Engine</em>
                  </span>
                </span>
              </h1>

              <p
                data-hero-deck
                className="mt-6 text-base sm:text-lg text-[#410217]/85 font-sans leading-relaxed max-w-2xl"
              >
                Building the next generation of AEO systems, pushing the limits of the industry to go beyond just marketing by using Answer Engine Optimization to strengthen our national security and defend America&apos;s financial markets, supply chains, and geopolitical interests.
              </p>
            </div>

            {/* Action CTAs */}
            <div data-hero-ctas className="mt-8 pt-6 border-t border-[#410217]/15">
              <div className="flex flex-wrap items-center gap-3.5">
                <button
                  onClick={() => onNavigate('pitch-deck')}
                  className="group inline-flex items-center space-x-2.5 px-6 py-3.5 rounded-lg bg-gradient-to-r from-[#D5991C] to-[#E5A932] hover:from-[#E5A932] hover:to-[#F2D69D] text-[#130108] font-sans font-semibold text-sm transition-all shadow-md cursor-pointer"
                >
                  <Compass className="w-4 h-4 text-[#130108]" />
                  <span>View Cover Deck</span>
                  <ArrowUpRight className="w-4 h-4 text-[#130108] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </button>

                <button
                  onClick={() => onNavigate('counter-geo-ops')}
                  className="group inline-flex items-center space-x-2 px-5 py-3.5 rounded-lg bg-[#410217] hover:bg-[#5C0A24] text-[#FBF3E2] border border-[#D5991C]/45 font-sans font-medium text-sm transition-all cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-[#D5991C]" />
                  <span>Explore 3D Threat Lab</span>
                </button>

                <button
                  onClick={() => onNavigate('research')}
                  className="inline-flex items-center space-x-2 px-5 py-3.5 rounded-lg bg-[#FAF5EB]/85 hover:bg-[#410217]/10 text-[#410217] border border-[#410217]/30 font-sans font-medium text-sm transition-colors cursor-pointer"
                >
                  <BookOpen className="w-4 h-4 text-[#8B5A0B]" />
                  <span>Read the 5 Whitepapers</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column (5 cols): Interactive 3D Globe (without outer box) */}
          <div data-hero-globe className="lg:col-span-5">
            <div className="w-full aspect-square max-h-[390px] mx-auto relative flex items-center justify-center">
              <Globe
                speed={1.2}
                smoothing={8}
                dots={PETRA_GLOBE_DOTS_CONFIG}
                fill="dots"
                fillColor="#F2D69D"
                scale={9.5}
                stopOnHover={false}
                direction="left"
                oceanColor="#340112"
                outlineColor="#D5991C"
                showOutline={true}
                graticuleColor="rgba(242, 214, 157, 0.15)"
                showGrid={true}
                outlineWidth={1}
                arcColor="#D5991C"
                pulseColor="#FBF3E2"
              />
            </div>
          </div>
        </div>

        {/* Interactive Visual Diagram: How AEO & Counter-AEO Work in Plain Sight */}
        <div
          data-hero-diagram
          className="mt-14 md:mt-18 rounded-2xl border border-[#F2D69D]/30 bg-[#2B010F]/[0.38] p-6 sm:p-8 shadow-xl backdrop-blur-xs"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#F2D69D]/20">
            <div>
              <h2 className="font-serif text-2xl sm:text-3xl text-[#FBF3E2]">
                How AI Engines Form Their Answers—And Why Protection Matters
              </h2>
              <p className="text-sm text-[#FBF3E2]/75 mt-1 font-sans">
                Toggle between an unprotected AI search pipeline and one protected by Last Crusade to see how bad data gets filtered out before it reaches people or automated systems.
              </p>
            </div>

            {/* Interactive Mode Toggle */}
            <div className="inline-flex rounded-lg p-1 bg-[#1A0009] border border-[#F2D69D]/25 shrink-0">
              <button
                onClick={() => setFlowMode('unprotected')}
                className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                  flowMode === 'unprotected'
                    ? 'bg-[#E63946] text-white shadow-xs'
                    : 'text-[#FBF3E2]/70 hover:text-[#FBF3E2]'
                }`}
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Unprotected AI Search</span>
              </button>
              <button
                onClick={() => setFlowMode('protected')}
                className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                  flowMode === 'protected'
                    ? 'bg-[#00A878] text-white shadow-xs'
                    : 'text-[#FBF3E2]/70 hover:text-[#FBF3E2]'
                }`}
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Protected by Last Crusade</span>
              </button>
            </div>
          </div>

          {/* Animated SVG Architecture Flow Diagram */}
          <div className="mt-6">
            <svg
              viewBox="0 0 960 280"
              className="w-full h-auto overflow-visible"
              role="img"
              aria-label="Interactive AI Answer Pipeline Diagram"
            >
              <defs>
                <linearGradient id="cleanLineGrad" gradientUnits="userSpaceOnUse" x1="220" y1="0" x2="740" y2="0">
                  <stop offset="0%" stopColor="#D5991C" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#00A878" stopOpacity="0.9" />
                </linearGradient>
                <linearGradient id="poisonLineGrad" gradientUnits="userSpaceOnUse" x1="220" y1="0" x2="740" y2="0">
                  <stop offset="0%" stopColor="#E63946" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#FF8093" stopOpacity="0.9" />
                </linearGradient>
                <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Column 1: Web Sources */}
              <g transform="translate(20, 25)">
                <rect width="200" height="95" rx="10" fill="#350213" stroke="#00A878" strokeWidth="1.5" />
                <circle cx="24" cy="26" r="5" fill="#00A878" />
                <text x="38" y="30" fill="#FBF3E2" fontSize="13" fontWeight="600">
                  Verified Web Sources
                </text>
                <text x="20" y="52" fill="#FBF3E2" fillOpacity="0.75" fontSize="11">
                  Official filings, real news,
                </text>
                <text x="20" y="68" fill="#FBF3E2" fillOpacity="0.75" fontSize="11">
                  and authentic documentation
                </text>
              </g>

              <g transform="translate(20, 155)">
                <rect
                  width="200"
                  height="95"
                  rx="10"
                  fill="#350213"
                  stroke="#E63946"
                  strokeWidth="1.5"
                  strokeDasharray={flowMode === 'protected' ? '4 3' : 'none'}
                />
                <circle cx="24" cy="26" r="5" fill="#E63946" />
                <text x="38" y="30" fill="#FF8093" fontSize="13" fontWeight="600">
                  Manipulated &amp; Fake Pages
                </text>
                <text x="20" y="52" fill="#FBF3E2" fillOpacity="0.75" fontSize="11">
                  Fake stats, hidden prompt traps,
                </text>
                <text x="20" y="68" fill="#FBF3E2" fillOpacity="0.75" fontSize="11">
                  and coordinated rumor sites
                </text>
              </g>

              {/* Connecting Paths from Sources to Center Shield / Engine */}
              <path
                d="M 220 72 C 290 72, 310 115, 370 125"
                fill="none"
                stroke="url(#cleanLineGrad)"
                strokeWidth="2.5"
              />
              <circle r="4.5" fill="#00FF9D" filter="url(#softGlow)">
                <animateMotion dur="2.6s" repeatCount="indefinite" path="M 220 72 C 290 72, 310 115, 370 125" />
              </circle>

              {flowMode === 'unprotected' ? (
                <>
                  <path
                    d="M 220 202 C 290 202, 310 160, 370 150"
                    fill="none"
                    stroke="url(#poisonLineGrad)"
                    strokeWidth="3"
                  />
                  <circle r="5" fill="#E63946" filter="url(#softGlow)">
                    <animateMotion dur="1.8s" repeatCount="indefinite" path="M 220 202 C 290 202, 310 160, 370 150" />
                  </circle>
                </>
              ) : (
                <>
                  <path
                    d="M 220 202 C 265 202, 285 185, 315 175"
                    fill="none"
                    stroke="#E63946"
                    strokeWidth="2"
                    strokeDasharray="4 4"
                    opacity="0.55"
                  />
                  {/* Quarantine Shield Icon Blocking the Poison Path */}
                  <g transform="translate(305, 158)">
                    <circle cx="14" cy="14" r="14" fill="#00A878" fillOpacity="0.2" stroke="#00FF9D" strokeWidth="1.5" />
                    <text x="14" y="18" textAnchor="middle" fill="#00FF9D" fontSize="11" fontWeight="700">
                      ✕
                    </text>
                  </g>
                  <text x="320" y="202" textAnchor="middle" fill="#00FF9D" fontSize="10" fontWeight="600">
                    Quarantined
                  </text>
                </>
              )}

              {/* Column 2: Center AI Engine & Last Crusade Shield */}
              <g transform="translate(370, 55)">
                <rect
                  width="230"
                  height="165"
                  rx="14"
                  fill="#24010D"
                  stroke={flowMode === 'protected' ? '#00FF9D' : '#E63946'}
                  strokeWidth="2"
                />
                <rect
                  x="16"
                  y="16"
                  width="198"
                  height="28"
                  rx="6"
                  fill={flowMode === 'protected' ? 'rgba(0,168,120,0.2)' : 'rgba(230,57,70,0.2)'}
                />
                <text
                  x="115"
                  y="34"
                  textAnchor="middle"
                  fill={flowMode === 'protected' ? '#00FF9D' : '#FF8093'}
                  fontSize="11"
                  fontWeight="700"
                >
                  {flowMode === 'protected' ? 'LAST CRUSADE SHIELD ACTIVE' : 'UNPROTECTED AI RETRIEVAL'}
                </text>

                <text x="115" y="72" textAnchor="middle" fill="#FBF3E2" fontSize="15" fontWeight="600">
                  AI Answer Engines
                </text>
                <text x="115" y="92" textAnchor="middle" fill="#D5991C" fontSize="11">
                  ChatGPT · Perplexity · Gemini · Claude
                </text>

                <line x1="24" y1="108" x2="206" y2="108" stroke="#F2D69D" strokeOpacity="0.2" />

                <text x="115" y="128" textAnchor="middle" fill="#FBF3E2" fillOpacity="0.85" fontSize="11">
                  {flowMode === 'protected'
                    ? '✓ Cross-checks multiple search engines'
                    : '⚠ Blindly trusts top-ranked vector match'}
                </text>
                <text x="115" y="146" textAnchor="middle" fill="#FBF3E2" fillOpacity="0.85" fontSize="11">
                  {flowMode === 'protected'
                    ? '✓ Verifies source authenticity & market data'
                    : '⚠ Repeats planted rumors as fact'}
                </text>
              </g>

              {/* Connecting Paths from Center Engine to 3 Downstream Consumers */}
              {[52, 138, 224].map((targetY, idx) => {
                const pathStr = `M 600 138 C 665 138, 685 ${targetY}, 740 ${targetY}`;
                return (
                  <g key={idx}>
                    <path
                      d={pathStr}
                      fill="none"
                      stroke={flowMode === 'protected' ? 'url(#cleanLineGrad)' : 'url(#poisonLineGrad)'}
                      strokeWidth="2.5"
                    />
                    <circle
                      r="4"
                      fill={flowMode === 'protected' ? '#00FF9D' : '#E63946'}
                      filter="url(#softGlow)"
                    >
                      <animateMotion dur={`${2.2 + idx * 0.3}s`} repeatCount="indefinite" path={pathStr} />
                    </circle>
                  </g>
                );
              })}

              {/* Column 3: Real-World Consumers (People, Markets, Agents) */}
              <g transform="translate(740, 15)">
                <rect
                  width="200"
                  height="72"
                  rx="10"
                  fill="#350213"
                  stroke={flowMode === 'protected' ? '#F2D69D' : '#E63946'}
                  strokeOpacity="0.5"
                  strokeWidth="1.5"
                />
                <text x="18" y="28" fill="#FBF3E2" fontSize="13" fontWeight="600">
                  Customers &amp; Citizens
                </text>
                <text
                  x="18"
                  y="48"
                  fill={flowMode === 'protected' ? '#00FF9D' : '#FF8093'}
                  fontSize="11"
                  fontWeight="500"
                >
                  {flowMode === 'protected' ? '✓ Receives accurate brand facts' : '✕ Misled by fabricated claims'}
                </text>
              </g>

              <g transform="translate(740, 102)">
                <rect
                  width="200"
                  height="72"
                  rx="10"
                  fill="#350213"
                  stroke={flowMode === 'protected' ? '#F2D69D' : '#E63946'}
                  strokeOpacity="0.5"
                  strokeWidth="1.5"
                />
                <text x="18" y="28" fill="#FBF3E2" fontSize="13" fontWeight="600">
                  Financial Trading Systems
                </text>
                <text
                  x="18"
                  y="48"
                  fill={flowMode === 'protected' ? '#00FF9D' : '#FF8093'}
                  fontSize="11"
                  fontWeight="500"
                >
                  {flowMode === 'protected' ? '✓ Halts fake morning market traps' : '✕ Trades on spoofed news'}
                </text>
              </g>

              <g transform="translate(740, 189)">
                <rect
                  width="200"
                  height="72"
                  rx="10"
                  fill="#350213"
                  stroke={flowMode === 'protected' ? '#F2D69D' : '#E63946'}
                  strokeOpacity="0.5"
                  strokeWidth="1.5"
                />
                <text x="18" y="28" fill="#FBF3E2" fontSize="13" fontWeight="600">
                  Autonomous AI Agents
                </text>
                <text
                  x="18"
                  y="48"
                  fill={flowMode === 'protected' ? '#00FF9D' : '#FF8093'}
                  fontSize="11"
                  fontWeight="500"
                >
                  {flowMode === 'protected' ? '✓ Connects to verified tools only' : '✕ Hijacked by rogue agent tools'}
                </text>
              </g>
            </svg>
          </div>
        </div>

        {/* Grounded Real-World Adoption Figures */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {REAL_WORLD_STATS.map((stat, idx) => (
            <div
              key={idx}
              data-stat-card
              className="rounded-xl bg-[#2B010F]/[0.33] border border-[#F2D69D]/25 p-6 flex flex-col justify-between hover:border-[#D5991C]/60 transition-all backdrop-blur-xs"
            >
              <div>
                <div className="font-serif text-4xl sm:text-5xl text-[#D5991C] font-normal tracking-tight leading-none">
                  {stat.figure}
                </div>
                <div className="mt-3 text-base font-semibold text-[#FBF3E2] font-sans">
                  {stat.label}
                </div>
                <p className="mt-2 text-xs text-[#FBF3E2]/75 font-sans leading-relaxed">
                  {stat.detail}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#F2D69D]/15 flex items-center justify-between text-[11px] text-[#F2D69D]/70 font-sans">
                <span>Source: {stat.source}</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-[#00A878]" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
