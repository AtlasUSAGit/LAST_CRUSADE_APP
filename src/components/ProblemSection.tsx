import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SectionHeader } from './home/SectionHeader';
import {
  Shield,
  AlertCircle,
  TrendingDown,
  Bot,
  Search,
  CheckCircle2,
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface VulnerabilityCard {
  id: string;
  title: string;
  subtitle: string;
  body: string;
  realWorldExample: string;
  howWeStopIt: string;
  diagramType: 'search' | 'market' | 'agent';
}

const VULNERABILITY_CARDS: VulnerabilityCard[] = [
  {
    id: 'search',
    title: 'AI Search & Brand Poisoning',
    subtitle: 'When AI reads the open web without checking who wrote it',
    body:
      'To answer questions about today’s news or companies, AI chatbots pull snippets from across the web. Bad actors can plant disguised pages—stuffed with fake statistics, hidden instructions, or split across innocent-looking blogs—that trick the AI into repeating falsehoods as fact.',
    realWorldExample:
      'A competitor or bad actor publishes a series of realistic-looking tables and articles claiming a product recall or financial distress. Within hours, AI chatbots repeat the rumor to thousands of customers.',
    howWeStopIt:
      'We cross-check every retrieved source across multiple search methods at once and require verified digital signatures before an AI engine trusts a claim.',
    diagramType: 'search',
  },
  {
    id: 'market',
    title: 'Automated Market Manipulation',
    subtitle: 'When trading bots act on planted morning rumors',
    body:
      'Hedge funds, trading desks, and everyday investors increasingly use AI to summarize breaking news and place trades automatically. Words on the internet cost nothing to fake, making it easy to trigger synchronized AI buying or selling during quiet early-morning hours.',
    realWorldExample:
      'Before markets open, an attacker sets up a large sell wall on a stock and floods the web with fake contract rumors. Unprotected AI trading bots read the rumor and buy straight into the trap.',
    howWeStopIt:
      'We compare what an internet article claims against live market order books and real trading volume, pausing automated trades when the numbers don’t match.',
    diagramType: 'market',
  },
  {
    id: 'agent',
    title: 'Autonomous Agent Hijacking',
    subtitle: 'When software agents choose tools and partners on their own',
    body:
      'Software is shifting from humans clicking websites to AI agents hiring other AI tools behind the scenes. If a rogue service disguises its description or hides instructions in its data, it can trick your company’s AI agent into routing tasks or data to the wrong place.',
    realWorldExample:
      'A company’s procurement or coding agent searches for a helper tool. A disguised malicious tool ranks first and quietly alters the agent’s instructions.',
    howWeStopIt:
      'We optimize your legitimate agent profiles so they are chosen reliably, and we lock down incoming data so untrusted tools can never alter your agent’s behavior.',
    diagramType: 'agent',
  },
];

const renderCardDiagram = (type: 'search' | 'market' | 'agent') => {
  if (type === 'search') {
    return (
      <svg
        viewBox="0 0 320 120"
        className="w-full h-32 bg-[#1F010B] border border-[#D5991C]/35 p-2"
        style={{
          clipPath:
            'polygon(12px 0%, 100% 0%, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0% 100%, 0% 12px)',
        }}
      >
        {/* Three hexagonal-chevron web sources on left */}
        <polygon
          points="14,14 82,14 90,26 82,38 14,38"
          fill="#2B010F"
          stroke="#00A878"
          strokeWidth="1.2"
        />
        <text x="50" y="29" textAnchor="middle" fill="#00FF9D" fontSize="8.8" fontWeight="600">
          Official Filing
        </text>

        <polygon
          points="14,48 82,48 90,60 82,72 14,72"
          fill="#3B0514"
          stroke="#E63946"
          strokeWidth="1.5"
        />
        <text x="50" y="63" textAnchor="middle" fill="#FF8093" fontSize="8.8" fontWeight="700">
          Poisoned Page
        </text>

        <polygon
          points="14,82 82,82 90,94 82,106 14,106"
          fill="#2B010F"
          stroke="#00A878"
          strokeWidth="1.2"
        />
        <text x="50" y="97" textAnchor="middle" fill="#00FF9D" fontSize="8.8" fontWeight="600">
          Trusted Press
        </text>

        {/* Paths to AI */}
        <path d="M 90 26 C 130 26, 140 55, 175 58" stroke="#00A878" strokeWidth="1.5" fill="none" />
        <path d="M 90 60 L 145 60" stroke="#E63946" strokeWidth="2" strokeDasharray="3 3" fill="none" />
        <path d="M 90 94 C 130 94, 140 65, 175 62" stroke="#00A878" strokeWidth="1.5" fill="none" />

        {/* Hexagonal block icon on poisoned path */}
        <polygon
          points="145,49 154,54.5 154,65.5 145,71 136,65.5 136,54.5"
          fill="#00A878"
        />
        <text x="145" y="63.5" textAnchor="middle" fill="#130108" fontSize="10" fontWeight="800">
          ✓
        </text>

        {/* Faceted AI Polygon Box */}
        <polygon
          points="185,34 295,34 305,44 305,76 295,86 185,86 175,76 175,44"
          fill="#2B010F"
          stroke="#D5991C"
          strokeWidth="1.5"
        />
        <text x="240" y="55" textAnchor="middle" fill="#FBF3E2" fontSize="10" fontWeight="700">
          Verified AI Answer
        </text>
        <text x="240" y="72" textAnchor="middle" fill="#00FF9D" fontSize="8.5">
          Fake stats filtered out
        </text>
      </svg>
    );
  }

  if (type === 'market') {
    return (
      <svg
        viewBox="0 0 320 120"
        className="w-full h-32 bg-[#1F010B] border border-[#D5991C]/35 p-2"
        style={{
          clipPath:
            'polygon(12px 0%, 100% 0%, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0% 100%, 0% 12px)',
        }}
      >
        {/* Fake News Spike vs Real Order Book */}
        <text x="16" y="17" fill="#FF8093" fontSize="9" fontWeight="600">
          Planted Web Rumor
        </text>
        <polyline
          points="16,48 55,48 75,18 95,45 135,45"
          fill="none"
          stroke="#E63946"
          strokeWidth="2"
        />
        {/* Triangular anomaly marker at peak */}
        <polygon points="75,13 80,22 70,22" fill="#E63946" />

        <text x="16" y="78" fill="#00FF9D" fontSize="9" fontWeight="600">
          Real Market Volume
        </text>
        <polyline
          points="16,96 55,95 75,94 95,96 135,95"
          fill="none"
          stroke="#00A878"
          strokeWidth="2"
        />

        {/* Arrow to Hexagonal-Faceted Circuit Breaker */}
        <line x1="145" y1="60" x2="178" y2="60" stroke="#D5991C" strokeWidth="1.5" />
        <polygon
          points="188,28 296,28 306,40 306,80 296,92 188,92 178,80 178,40"
          fill="#2B010F"
          stroke="#00A878"
          strokeWidth="1.5"
        />
        <text x="242" y="50" textAnchor="middle" fill="#D5991C" fontSize="9.5" fontWeight="700">
          Market Reality Check
        </text>
        <text x="242" y="66" textAnchor="middle" fill="#FBF3E2" fontSize="8.5">
          Mismatch detected →
        </text>
        <text x="242" y="80" textAnchor="middle" fill="#00FF9D" fontSize="9" fontWeight="700">
          Bad trade blocked
        </text>
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 320 120"
      className="w-full h-32 bg-[#1F010B] border border-[#D5991C]/35 p-2"
      style={{
        clipPath:
          'polygon(12px 0%, 100% 0%, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0% 100%, 0% 12px)',
      }}
    >
      {/* Main Agent Hexagonal Polygon */}
      <polygon
        points="22,36 90,36 98,60 90,84 22,84 14,60"
        fill="#2B010F"
        stroke="#D5991C"
        strokeWidth="1.5"
      />
      <text x="56" y="57" textAnchor="middle" fill="#FBF3E2" fontSize="9.5" fontWeight="700">
        Your AI Agent
      </text>
      <text x="56" y="71" textAnchor="middle" fill="#D5991C" fontSize="8">
        Task Router
      </text>

      {/* Path to Verified Partner */}
      <path d="M 98 52 C 135 52, 145 32, 185 32" stroke="#00FF9D" strokeWidth="2" fill="none" />
      <circle r="3.5" fill="#00FF9D">
        <animateMotion dur="2s" repeatCount="indefinite" path="M 98 52 C 135 52, 145 32, 185 32" />
      </circle>

      {/* Path to Rogue Tool (Blocked) */}
      <path
        d="M 98 68 C 135 68, 145 88, 185 88"
        stroke="#E63946"
        strokeWidth="1.5"
        strokeDasharray="3 3"
        fill="none"
      />

      {/* Verified Tool Polygon */}
      <polygon
        points="193,14 297,14 305,32 297,50 193,50 185,32"
        fill="#2B010F"
        stroke="#00A878"
        strokeWidth="1.5"
      />
      <text x="245" y="30" textAnchor="middle" fill="#00FF9D" fontSize="8.8" fontWeight="700">
        ✓ Verified Partner Tool
      </text>
      <text x="245" y="42" textAnchor="middle" fill="#FBF3E2" fillOpacity="0.8" fontSize="8">
        Signed &amp; trusted
      </text>

      {/* Rogue Tool Polygon */}
      <polygon
        points="193,70 297,70 305,88 297,106 193,106 185,88"
        fill="#2B010F"
        stroke="#E63946"
        strokeOpacity="0.5"
        strokeWidth="1.2"
      />
      <text x="245" y="86" textAnchor="middle" fill="#FF8093" fontSize="8.8" fontWeight="600">
        ✕ Disguised Trap Tool
      </text>
      <text x="245" y="98" textAnchor="middle" fill="#FBF3E2" fillOpacity="0.6" fontSize="8">
        Isolated by firewall
      </text>
    </svg>
  );
};

export const ProblemSection: React.FC = () => {
  const rootRef = useRef<HTMLElement>(null);
  const thirdsStageRef = useRef<HTMLDivElement>(null);
  const arenasSectionRef = useRef<HTMLDivElement>(null);
  const leftHoneycombRef = useRef<HTMLDivElement>(null);
  const arenasStackRef = useRef<HTMLDivElement>(null);
  const [selectedArena, setSelectedArena] = useState<number>(0);

  const dualUseArenas = [
    {
      name: 'Brand & Corporate Reputation',
      offensive:
        'Structure your official data, research, and product facts so AI engines cite your organization first and accurately.',
      defensive:
        'Spot and neutralize coordinated smear campaigns, fake reviews, and manipulated search snippets before chatbots repeat them.',
    },
    {
      name: 'Financial Markets & Investing',
      offensive:
        'Ensure accurate earnings data, filings, and institutional research are cleanly indexed by financial AI assistants.',
      defensive:
        'Protect automated trading systems and retail investors from fake morning news, spoofed filings, and engineered flash crashes.',
    },
    {
      name: 'National Security & Public Trust',
      offensive:
        'Help verified public-interest and allied information stand out clearly across global AI answer engines.',
      defensive:
        'Detect foreign influence operations, botnet citation rings, and long-term AI memory tampering.',
    },
    {
      name: 'Autonomous AI Agent Networks',
      offensive:
        'Format your software tools and APIs so autonomous AI agents discover, trust, and select them effortlessly.',
      defensive:
        'Stop disguised malicious tools and hidden prompt instructions from hijacking your internal AI agents.',
    },
  ];

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      // 1. Pinned 3-Thirds (1/3 + 1/3 + 1/3) Progressive Two-Layer Sticky Assembly
      const stage = thirdsStageRef.current;
      if (stage && window.innerWidth >= 1024) {
        const baseShards = gsap.utils.toArray<HTMLElement>('.prob-third-base', stage);
        const defenseOverlays = gsap.utils.toArray<HTMLElement>('.prob-third-defense', stage);

        // Initial states: Third 1 is visible, Thirds 2 & 3 start below viewport
        baseShards.forEach((shard, idx) => {
          if (idx > 0) {
            gsap.set(shard, { yPercent: 108, opacity: 0 });
          }
        });

        // All 3 Counter-Measure Defense Shards start below their columns
        gsap.set(defenseOverlays, { yPercent: 105, opacity: 0 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: stage,
            start: 'top top',
            end: '+=240%',
            pin: true,
            scrub: 0.8,
            anticipatePin: 1,
          },
        });

        // Step A: Center Third (1/3) locks in alongside Left Third
        if (baseShards[1]) {
          tl.to(baseShards[1], {
            yPercent: 0,
            opacity: 1,
            duration: 1,
            ease: 'power2.out',
          });
        }

        // Step B: Right Third (1/3) locks in alongside Center Third
        if (baseShards[2]) {
          tl.to(
            baseShards[2],
            {
              yPercent: 0,
              opacity: 1,
              duration: 1,
              ease: 'power2.out',
            },
            '-=0.25'
          );
        }

        // Step C: Counter-Measure Shards slide up on top of each 1/3 column one third at a time
        defenseOverlays.forEach((overlay, idx) => {
          tl.to(
            overlay,
            {
              yPercent: 0,
              opacity: 1,
              duration: 0.95,
              ease: 'power2.inOut',
            },
            idx === 0 ? '+=0.15' : '-=0.35'
          );
        });
      }

      // 2. Pin Left-Half Honeycomb Card while scrolling through Dual-Use Markets section
      const arenasContainer = arenasSectionRef.current;
      const leftHoneycomb = leftHoneycombRef.current;
      if (arenasContainer && leftHoneycomb && window.innerWidth >= 1024) {
        ScrollTrigger.create({
          trigger: arenasContainer,
          start: 'top 96px',
          end: () => `bottom ${96 + leftHoneycomb.offsetHeight}px`,
          pin: leftHoneycomb,
          pinSpacing: false,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        });
      }

      // 3. Right-Half Sticky Dual-Use Arena Shards — Sync Left-Half Honeycomb Active State
      const arenasEl = arenasStackRef.current;
      if (arenasEl) {
        const cards = gsap.utils.toArray<HTMLElement>('.arena-sticky-shard', arenasEl);
        cards.forEach((card, idx) => {
          ScrollTrigger.create({
            trigger: card,
            start: 'top 55%',
            end: 'bottom 55%',
            onEnter: () => setSelectedArena(idx),
            onEnterBack: () => setSelectedArena(idx),
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
      {/* Chapter Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 md:pt-28 pb-6">
        <SectionHeader
          title={
            <>
              Why Traditional Security Misses{' '}
              <em className="italic text-[#8B5A0B] font-normal">AI Answer Manipulation.</em>
            </>
          }
          subtitle="Firewalls protect your servers, and traditional SEO tracks website clicks. Neither watches what happens inside an AI model when it blends outside web pages into a single authoritative answer."
        />
      </div>

      {/* PART 1: PINNED 3-THIRDS (1/3 + 1/3 + 1/3) PROGRESSIVE GEOMETRIC SHARD STACK */}
      <div
        ref={thirdsStageRef}
        className="relative w-full lg:h-screen overflow-hidden flex flex-col justify-between py-6 sm:py-8 border-y border-[#410217]/25"
      >
        {/* Isometric Triangular & Hexagonal Tessellation Background Mesh */}
        <svg
          className="pointer-events-none absolute inset-0 w-full h-full opacity-[0.14]"
           xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="prob-tri-hex-tess"
              width="120"
              height="104"
              patternUnits="userSpaceOnUse"
            >
              {/* Isometric Triangle Lattice */}
              <polygon
                points="60,0 120,104 0,104"
                fill="none"
                stroke="#410217"
                strokeWidth="1"
              />
              <polygon
                points="0,0 120,0 60,104"
                fill="none"
                stroke="#410217"
                strokeWidth="1"
              />
              {/* Nested Hexagon inside Tessellation */}
              <polygon
                points="60,18 90,35 90,69 60,86 30,69 30,35"
                fill="none"
                stroke="#8B5A0B"
                strokeWidth="1"
                strokeDasharray="3 3"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#prob-tri-hex-tess)" />
        </svg>

        <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col h-full justify-center">
          {/* 3 Vertical Thirds Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 items-stretch my-auto">
            {VULNERABILITY_CARDS.map((card) => (
              <div
                key={card.id}
                data-prob-card
                className="relative flex flex-col h-full min-h-[490px]"
              >
                {/* LAYER 1 (BASE 1/3 SHARD): Threat Vector & Diagram */}
                <article
                  className="prob-third-base relative flex-1 bg-[#2B010F]/95 border border-[#D5991C]/60 p-6 flex flex-col justify-between shadow-xl"
                  style={{
                    clipPath:
                      'polygon(22px 0%, 100% 0%, 100% calc(100% - 22px), calc(100% - 22px) 100%, 0% 100%, 0% 22px)',
                  }}
                >
                  {/* Diagonal Corner Triangle Accents */}
                  <svg
                    className="pointer-events-none absolute top-0 left-0 w-7 h-7"
                    viewBox="0 0 28 28"
                  >
                    <polygon points="0,0 28,0 0,28" fill="#D5991C" />
                  </svg>
                  <svg
                    className="pointer-events-none absolute bottom-0 right-0 w-7 h-7"
                    viewBox="0 0 28 28"
                  >
                    <polygon points="28,28 0,28 28,0" fill="#D5991C" />
                  </svg>

                  <div>
                    {/* Top Row with Hexagonal Medallion */}
                    <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#F2D69D]/20">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-11 h-11 bg-[#D5991C] text-[#130108] flex items-center justify-center font-mono font-bold text-sm"
                          style={{
                            clipPath:
                              'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                          }}
                        >
                          {card.diagramType === 'search' && <Search className="w-5 h-5" />}
                          {card.diagramType === 'market' && <TrendingDown className="w-5 h-5" />}
                          {card.diagramType === 'agent' && <Bot className="w-5 h-5" />}
                        </div>
                      </div>

                      <span
                        className="text-[11px] font-mono uppercase tracking-wider px-3.5 py-1 bg-[#410217] text-[#F2D69D] border border-[#D5991C]/40"
                        style={{
                          clipPath:
                            'polygon(8px 0%, calc(100% - 8px) 0%, 100% 50%, calc(100% - 8px) 100%, 8px 100%, 0% 50%)',
                        }}
                      >
                        Core Risk Area
                      </span>
                    </div>

                    <h3 className="font-serif text-2xl text-[#FBF3E2] font-normal leading-snug">
                      {card.title}
                    </h3>
                    <p className="text-xs text-[#D5991C] font-medium mt-1 mb-4">
                      {card.subtitle}
                    </p>

                    {/* Custom Geometric Visual Diagram */}
                    <div className="mb-4">{renderCardDiagram(card.diagramType)}</div>

                    <p className="text-xs sm:text-sm text-[#FBF3E2]/85 font-sans leading-relaxed">
                      {card.body}
                    </p>
                  </div>
                </article>

                {/* LAYER 2 (STICKY OVERLAY 1/3 SHARD): Stacks on top of the lower portion of each 1/3 column! */}
                <div
                  className="prob-third-defense lg:absolute lg:inset-x-0 lg:bottom-0 mt-3 lg:mt-0 bg-[#1B000A]/98 border-2 border-[#D5991C] p-5 shadow-[0_-18px_45px_rgba(19,1,8,0.85)] z-20"
                  style={{
                    clipPath:
                      'polygon(0% 18px, 18px 0%, calc(100% - 18px) 0%, 100% 18px, 100% 100%, 0% 100%)',
                  }}
                >
                  {/* How It Happens in Practice */}
                  <div className="mb-3.5 pb-3.5 border-b border-[#F2D69D]/15">
                    <div className="flex items-center space-x-1.5 text-xs font-semibold text-[#FF8093] mb-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>How It Happens in Practice</span>
                    </div>
                    <p className="text-xs text-[#FBF3E2]/85 leading-relaxed">
                      {card.realWorldExample}
                    </p>
                  </div>

                  {/* How Last Crusade Stops It */}
                  <div>
                    <div className="flex items-center space-x-1.5 text-xs font-semibold text-[#00FF9D] mb-1">
                      <Shield className="w-3.5 h-3.5 shrink-0" />
                      <span>How Last Crusade Stops It</span>
                    </div>
                    <p className="text-xs text-[#FBF3E2]/90 leading-relaxed">
                      {card.howWeStopIt}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* PART 2: SPLIT-HALF (1/2 + 1/2) STICKY HONEYCOMB TESSELLATION FOR 4 DUAL-USE MARKETS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        <div ref={arenasSectionRef} className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* LEFT HALF (1/2): Pinned Hexagonal Honeycomb Tessellation Cluster */}
          <div ref={leftHoneycombRef} className="lg:col-span-6 space-y-6">
            <div>
              <h3 className="font-serif text-3xl sm:text-4xl text-[#410217] leading-tight">
                One Core Technology, Two Missions: Offensive Visibility &amp; Defensive Protection
              </h3>
              <p className="text-sm sm:text-base text-[#410217]/80 mt-3 leading-relaxed">
                The same algorithms that help legitimate organizations earn accurate citations in AI answers also give us the visibility needed to spot and stop manipulation across four major markets.
              </p>
            </div>

            {/* Interactive 4-Hexagon Interlocking Honeycomb & Triangular Tessellation SVG */}
            <div
              className="bg-[#2B010F]/95 border-2 border-[#D5991C] p-5 shadow-xl"
              style={{
                clipPath:
                  'polygon(24px 0%, 100% 0%, 100% calc(100% - 24px), calc(100% - 24px) 100%, 0% 100%, 0% 24px)',
              }}
            >
              <svg viewBox="0 0 520 230" className="w-full h-auto">
                {/* Background Isometric Triangle Lines */}
                <g stroke="#F2D69D" strokeOpacity="0.14" strokeWidth="1" fill="none">
                  <polygon points="10,210 130,15 250,210" />
                  <polygon points="140,210 260,15 380,210" />
                  <polygon points="270,210 390,15 510,210" />
                  <line x1="10" y1="115" x2="510" y2="115" strokeDasharray="4 4" />
                </g>

                {[
                  { cx: 105, cy: 78, idx: 0, short: 'Brand & Reputation' },
                  { cx: 230, cy: 148, idx: 1, short: 'Financial Markets' },
                  { cx: 355, cy: 78, idx: 2, short: 'National Security' },
                  { cx: 445, cy: 148, idx: 3, short: 'AI Agent Networks' },
                ].map((hex) => {
                  const isActive = selectedArena === hex.idx;
                  const r = 56;
                  const pts = [0, 60, 120, 180, 240, 300]
                    .map((deg) => {
                      const rad = (Math.PI / 180) * deg;
                      return `${(hex.cx + r * Math.cos(rad)).toFixed(1)},${(
                        hex.cy +
                        r * Math.sin(rad)
                      ).toFixed(1)}`;
                    })
                    .join(' ');

                  return (
                    <g
                      key={hex.idx}
                      onClick={() => setSelectedArena(hex.idx)}
                      className="cursor-pointer"
                    >
                      <polygon
                        points={pts}
                        fill={isActive ? '#D5991C' : '#3B0514'}
                        stroke={isActive ? '#FBF3E2' : '#D5991C'}
                        strokeWidth={isActive ? '2.5' : '1.4'}
                      />
                      <text
                        x={hex.cx}
                        y={hex.cy - 8}
                        textAnchor="middle"
                        fill={isActive ? '#130108' : '#D5991C'}
                        fontSize="11"
                        fontFamily="monospace"
                        fontWeight="700"
                      >
                        CELL 0{hex.idx + 1}
                      </text>
                      <text
                        x={hex.cx}
                        y={hex.cy + 10}
                        textAnchor="middle"
                        fill={isActive ? '#130108' : '#FBF3E2'}
                        fontSize="9.5"
                        fontWeight="700"
                      >
                        {hex.short}
                      </text>
                    </g>
                  );
                })}
              </svg>

              {/* 4 Hexagonal-Chevron Quick-Select Buttons */}
              <div className="grid grid-cols-2 gap-2.5 mt-4">
                {dualUseArenas.map((arena, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedArena(idx)}
                    className={`p-3 text-left transition-all cursor-pointer border ${
                      selectedArena === idx
                        ? 'bg-[#D5991C] text-[#130108] border-[#FBF3E2] font-bold'
                        : 'bg-[#410217]/80 text-[#FBF3E2]/85 border-[#D5991C]/35 hover:border-[#D5991C]'
                    }`}
                    style={{
                      clipPath:
                        'polygon(10px 0%, 100% 0%, calc(100% - 10px) 100%, 0% 100%)',
                    }}
                  >
                    <div className="text-xs font-serif font-bold truncate">
                      0{idx + 1}. {arena.name}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT HALF (1/2): Sticky Overlapping Two-Part Polygonal Shards */}
          <div ref={arenasStackRef} className="lg:col-span-6 space-y-12 pb-8">
            {dualUseArenas.map((arena, idx) => {
              const stickyTop = 104 + idx * 22;
              return (
                <div
                  key={idx}
                  style={{ top: `${stickyTop}px`, zIndex: idx + 10 }}
                  onClick={() => setSelectedArena(idx)}
                  className="arena-sticky-shard sticky cursor-pointer transition-transform"
                >
                  {/* Top Faceted Half of Card: Market Header + Offensive AEO */}
                  <div
                    className="bg-[#2B010F]/98 border-2 border-[#D5991C] p-6 sm:p-7 shadow-2xl"
                    style={{
                      clipPath:
                        'polygon(20px 0%, 100% 0%, 100% 100%, 0% 100%, 0% 20px)',
                    }}
                  >
                    <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#F2D69D]/20">
                      <div className="flex items-center gap-3">
                        <span
                          className="w-8 h-8 bg-[#D5991C] text-[#130108] font-mono font-bold text-xs flex items-center justify-center"
                          style={{
                            clipPath:
                              'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                          }}
                        >
                          0{idx + 1}
                        </span>
                        <h4 className="font-serif text-xl sm:text-2xl text-[#FBF3E2] font-bold">
                          {arena.name}
                        </h4>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 text-sm font-semibold text-[#D5991C] mb-2">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>Offensive AEO (Immediate Visibility &amp; Growth)</span>
                    </div>
                    <p className="text-sm text-[#FBF3E2]/90 leading-relaxed">
                      {arena.offensive}
                    </p>
                  </div>

                  {/* Bottom Interlocking Faceted Half of Card: Defensive Counter-AEO */}
                  <div
                    className="bg-[#190008]/98 border-x-2 border-b-2 border-[#00A878] p-6 sm:p-7 -mt-px shadow-2xl"
                    style={{
                      clipPath:
                        'polygon(0% 0%, 100% 0%, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0% 100%)',
                    }}
                  >
                    <div className="flex items-center space-x-2 text-sm font-semibold text-[#00FF9D] mb-2">
                      <Shield className="w-4 h-4 shrink-0" />
                      <span>Defensive Counter-AEO (Long-Term Security &amp; Resilience)</span>
                    </div>
                    <p className="text-sm text-[#FBF3E2]/90 leading-relaxed">
                      {arena.defensive}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;
