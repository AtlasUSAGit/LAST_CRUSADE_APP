import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { EasePack } from 'gsap/EasePack';
import { SectionHeader } from './home/SectionHeader';
import {
  Shield,
  AlertCircle,
  TrendingDown,
  Bot,
  Search,
  CheckCircle2,
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger, EasePack);

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
      <svg viewBox="0 0 320 120" className="w-full h-36 rounded-none bg-[#1F010B] border border-[#D5991C]/40 p-2">
        {/* Three web pages on left */}
        <rect x="14" y="14" width="76" height="24" rx="0" fill="#2B010F" stroke="#00A878" strokeWidth="1.2" />
        <text x="52" y="29" textAnchor="middle" fill="#00FF9D" fontSize="9" fontWeight="600">Official Filing</text>

        <rect x="14" y="48" width="76" height="24" rx="0" fill="#3B0514" stroke="#E63946" strokeWidth="1.5" />
        <text x="52" y="63" textAnchor="middle" fill="#FF8093" fontSize="9" fontWeight="700">Poisoned Page</text>

        <rect x="14" y="82" width="76" height="24" rx="0" fill="#2B010F" stroke="#00A878" strokeWidth="1.2" />
        <text x="52" y="97" textAnchor="middle" fill="#00FF9D" fontSize="9" fontWeight="600">Trusted Press</text>

        {/* Paths to AI */}
        <path d="M 90 26 C 130 26, 140 55, 175 58" stroke="#00A878" strokeWidth="1.5" fill="none" />
        <path d="M 90 60 L 145 60" stroke="#E63946" strokeWidth="2" strokeDasharray="3 3" fill="none" />
        <path d="M 90 94 C 130 94, 140 65, 175 62" stroke="#00A878" strokeWidth="1.5" fill="none" />

        {/* Block icon on poisoned path */}
        <circle cx="145" cy="60" r="9" fill="#00A878" />
        <text x="145" y="63.5" textAnchor="middle" fill="#130108" fontSize="10" fontWeight="800">✓</text>

        {/* AI Box */}
        <rect x="175" y="34" width="130" height="52" rx="0" fill="#2B010F" stroke="#D5991C" strokeWidth="1.5" />
        <text x="240" y="55" textAnchor="middle" fill="#FBF3E2" fontSize="10" fontWeight="700">Verified AI Answer</text>
        <text x="240" y="72" textAnchor="middle" fill="#00FF9D" fontSize="8.5">Fake stats filtered out</text>
      </svg>
    );
  }

  if (type === 'market') {
    return (
      <svg viewBox="0 0 320 120" className="w-full h-36 rounded-none bg-[#1F010B] border border-[#D5991C]/40 p-2">
        {/* Fake News Spike vs Real Order Book */}
        <text x="16" y="17" fill="#FF8093" fontSize="9" fontWeight="600">Planted Web Rumor</text>
        <polyline
          points="16,48 55,48 75,18 95,45 135,45"
          fill="none"
          stroke="#E63946"
          strokeWidth="2"
        />
        <text x="16" y="78" fill="#00FF9D" fontSize="9" fontWeight="600">Real Market Volume</text>
        <polyline
          points="16,96 55,95 75,94 95,96 135,95"
          fill="none"
          stroke="#00A878"
          strokeWidth="2"
        />

        {/* Arrow to Circuit Breaker */}
        <line x1="145" y1="60" x2="178" y2="60" stroke="#D5991C" strokeWidth="1.5" />
        <rect x="178" y="28" width="128" height="64" rx="0" fill="#2B010F" stroke="#00A878" strokeWidth="1.5" />
        <text x="242" y="50" textAnchor="middle" fill="#D5991C" fontSize="9.5" fontWeight="700">Market Reality Check</text>
        <text x="242" y="66" textAnchor="middle" fill="#FBF3E2" fontSize="8.5">Mismatch detected →</text>
        <text x="242" y="80" textAnchor="middle" fill="#00FF9D" fontSize="9" fontWeight="700">Bad trade blocked</text>
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 320 120" className="w-full h-36 rounded-none bg-[#1F010B] border border-[#D5991C]/40 p-2">
      {/* Main Agent */}
      <rect x="14" y="36" width="84" height="48" rx="0" fill="#2B010F" stroke="#D5991C" strokeWidth="1.5" />
      <text x="56" y="57" textAnchor="middle" fill="#FBF3E2" fontSize="9.5" fontWeight="700">Your AI Agent</text>
      <text x="56" y="71" textAnchor="middle" fill="#D5991C" fontSize="8">Task Router</text>

      {/* Path to Verified Partner */}
      <path d="M 98 52 C 135 52, 145 32, 185 32" stroke="#00FF9D" strokeWidth="2" fill="none" />
      <circle r="3.5" fill="#00FF9D">
        <animateMotion dur="2s" repeatCount="indefinite" path="M 98 52 C 135 52, 145 32, 185 32" />
      </circle>

      {/* Path to Rogue Tool (Blocked) */}
      <path d="M 98 68 C 135 68, 145 88, 185 88" stroke="#E63946" strokeWidth="1.5" strokeDasharray="3 3" fill="none" />

      {/* Verified Tool */}
      <rect x="185" y="14" width="120" height="36" rx="0" fill="#2B010F" stroke="#00A878" strokeWidth="1.5" />
      <text x="245" y="30" textAnchor="middle" fill="#00FF9D" fontSize="9" fontWeight="700">✓ Verified Partner Tool</text>
      <text x="245" y="42" textAnchor="middle" fill="#FBF3E2" fillOpacity="0.8" fontSize="8">Signed &amp; trusted</text>

      {/* Rogue Tool */}
      <rect x="185" y="70" width="120" height="36" rx="0" fill="#2B010F" stroke="#E63946" strokeOpacity="0.5" strokeWidth="1.2" />
      <text x="245" y="86" textAnchor="middle" fill="#FF8093" fontSize="9" fontWeight="600">✕ Disguised Trap Tool</text>
      <text x="245" y="98" textAnchor="middle" fill="#FBF3E2" fillOpacity="0.6" fontSize="8">Isolated by firewall</text>
    </svg>
  );
};

export const ProblemSection: React.FC = () => {
  const rootRef = useRef<HTMLElement>(null);
  const tunnelWrapperRef = useRef<HTMLDivElement>(null);
  const [activeTunnelIndex, setActiveTunnelIndex] = useState<number>(0);
  const [selectedArena, setSelectedArena] = useState<number>(0);

  const dualUseArenas = [
    {
      name: 'Brand & Corporate Reputation',
      offensive: 'Structure your official data, research, and product facts so AI engines cite your organization first and accurately.',
      defensive: 'Spot and neutralize coordinated smear campaigns, fake reviews, and manipulated search snippets before chatbots repeat them.',
    },
    {
      name: 'Financial Markets & Investing',
      offensive: 'Ensure accurate earnings data, filings, and institutional research are cleanly indexed by financial AI assistants.',
      defensive: 'Protect automated trading systems and retail investors from fake morning news, spoofed filings, and engineered flash crashes.',
    },
    {
      name: 'National Security & Public Trust',
      offensive: 'Help verified public-interest and allied information stand out clearly across global AI answer engines.',
      defensive: 'Detect foreign influence operations, botnet citation rings, and long-term AI memory tampering.',
    },
    {
      name: 'Autonomous AI Agent Networks',
      offensive: 'Format your software tools and APIs so autonomous AI agents discover, trust, and select them effortlessly.',
      defensive: 'Stop disguised malicious tools and hidden prompt instructions from hijacking your internal AI agents.',
    },
  ];

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      const wrapper = tunnelWrapperRef.current;
      if (!wrapper) return;

      const sections = gsap.utils.toArray<HTMLElement>('.tunnel-section', wrapper);
      if (sections.length === 0) return;

      const tunnelTl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapper,
          start: 'top top',
          end: () => `+=${sections.length * 145}%`,
          pin: true,
          scrub: 1.2,
          anticipatePin: 1,
          onUpdate: (self) => {
            const idx = Math.min(
              sections.length - 1,
              Math.max(0, Math.floor(self.progress * sections.length))
            );
            setActiveTunnelIndex(idx);
          },
        },
      });

      sections.forEach((section, i) => {
        if (i !== 0) {
          gsap.set(section, {
            scale: 0.08,
            opacity: 0,
            rotationZ: i % 2 === 0 ? -12 : 12,
          });
        } else {
          gsap.set(section, {
            scale: 1,
            opacity: 1,
            rotationZ: 0,
          });
        }

        if (i > 0) {
          tunnelTl.to(
            section,
            {
              scale: 1,
              opacity: 1,
              rotationZ: 0,
              duration: 1,
              ease: 'power2.out',
            },
            '<40%'
          );
        }

        if (i < sections.length - 1) {
          tunnelTl.to(section, {
            scale: 12,
            opacity: 0,
            rotationZ: i % 2 === 0 ? 15 : -15,
            duration: 1,
            ease: 'expoScale(1, 12, power2.in)',
          });
        }
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      className="bg-transparent border-b border-[#410217]/20 relative z-10"
    >
      {/* Chapter Header on Open Plane */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 md:pt-28 pb-8">
        <div className="velocity-item">
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
      </div>

      {/* CHAPTER 1: ISOLATED PIN-STAGE — INFINITE Z-AXIS TUNNEL (PORTAL ZOOM-THROUGH) */}
      <div className="pin-stage relative w-full overflow-hidden border-y-2 border-[#410217]">
        <div
          ref={tunnelWrapperRef}
          className="tunnel-wrapper relative w-full h-screen overflow-hidden flex items-center justify-center"
          style={{ perspective: '1200px' }}
        >
          {/* Architectural Viewport Reticle & Z-Depth Coordinate HUD */}
          <div className="pointer-events-none absolute inset-4 sm:inset-8 border border-[#410217]/30 z-30 flex flex-col justify-between p-4 sm:p-6">
            <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-[0.2em] text-[#410217]">
              <span className="flex items-center gap-2 font-bold">
                <span className="inline-block w-2 h-2 bg-[#D5991C]" />
                Z-AXIS THREAT PORTAL // SCROLL TO FLY THROUGH VECTORS
              </span>
              <span className="hidden sm:inline font-bold">
                CORE RISK AREA 0{activeTunnelIndex + 1} / 0{VULNERABILITY_CARDS.length}
              </span>
            </div>

            <div className="flex items-center justify-between border-t border-[#410217]/25 pt-3">
              <div className="flex items-center gap-4 sm:gap-8">
                {VULNERABILITY_CARDS.map((card, idx) => (
                  <div
                    key={card.id}
                    className={`flex items-center gap-2 text-xs font-mono uppercase tracking-widest transition-opacity ${
                      activeTunnelIndex === idx
                        ? 'text-[#410217] font-bold opacity-100'
                        : 'text-[#410217]/50 opacity-70'
                    }`}
                  >
                    <span className="px-1.5 py-0.5 bg-[#410217] text-[#D5991C] font-bold">
                      0{idx + 1}
                    </span>
                    <span className="hidden md:inline">{card.title}</span>
                  </div>
                ))}
              </div>
              <span className="text-[11px] font-mono uppercase tracking-widest text-[#410217]/80">
                Z-OPTICS: EXPOSCALE(1, 12)
              </span>
            </div>
          </div>

          {/* 3 Stacked Z-Axis Tunnel Threat Planes */}
          {VULNERABILITY_CARDS.map((card, index) => (
            <article
              key={card.id}
              data-prob-card
              className="tunnel-section absolute inset-0 flex items-center justify-center p-6 sm:p-12 lg:p-20 will-change-transform"
              style={{ zIndex: VULNERABILITY_CARDS.length - index }}
            >
              {/* Sharp Geometric Monolith (Zero Rounded Cards, Structural Hairlines) */}
              <div className="relative w-full max-w-6xl bg-[#2B010F]/95 border-2 border-[#D5991C] rounded-none p-6 sm:p-10 lg:p-12 shadow-[0_30px_90px_rgba(43,1,15,0.55)]">
                <span className="absolute -top-2 -left-2 text-[#D5991C] font-mono text-sm leading-none select-none">+</span>
                <span className="absolute -top-2 -right-2 text-[#D5991C] font-mono text-sm leading-none select-none">+</span>
                <span className="absolute -bottom-2 -left-2 text-[#D5991C] font-mono text-sm leading-none select-none">+</span>
                <span className="absolute -bottom-2 -right-2 text-[#D5991C] font-mono text-sm leading-none select-none">+</span>

                {/* Top Structural Spine */}
                <div className="flex flex-wrap items-center justify-between gap-4 pb-5 mb-6 border-b border-[#F2D69D]/25">
                  <div className="flex items-center gap-4">
                    <span className="text-2xl sm:text-3xl font-mono font-bold text-[#D5991C]">
                      0{index + 1}
                    </span>
                    <span className="h-5 w-px bg-[#F2D69D]/30" />
                    <div className="w-9 h-9 rounded-none bg-[#D5991C]/15 border border-[#D5991C] flex items-center justify-center text-[#D5991C]">
                      {card.diagramType === 'search' && <Search className="w-4 h-4" />}
                      {card.diagramType === 'market' && <TrendingDown className="w-4 h-4" />}
                      {card.diagramType === 'agent' && <Bot className="w-4 h-4" />}
                    </div>
                    <div>
                      <h3 className="font-serif text-2xl sm:text-3xl text-[#FBF3E2] font-normal leading-tight">
                        {card.title}
                      </h3>
                      <p className="text-xs text-[#D5991C] font-medium">
                        {card.subtitle}
                      </p>
                    </div>
                  </div>

                  <span className="text-xs font-mono uppercase tracking-widest px-3 py-1 rounded-none bg-[#410217] text-[#F2D69D] border border-[#D5991C]">
                    Core Risk Area
                  </span>
                </div>

                {/* Split Architectural Plane: Left Narrative & SVG / Right Practice vs Shield */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  <div className="lg:col-span-6 space-y-5">
                    {renderCardDiagram(card.diagramType)}
                    <p className="text-sm sm:text-base text-[#FBF3E2]/90 font-sans leading-relaxed">
                      {card.body}
                    </p>
                  </div>

                  <div className="lg:col-span-6 lg:border-l lg:border-[#F2D69D]/25 lg:pl-8 space-y-6">
                    {/* Open Hairline Block: How It Happens in Practice */}
                    <div className="border-l-2 border-[#E63946] pl-4 py-1">
                      <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-wider font-semibold text-[#FF8093] mb-2">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>How It Happens in Practice</span>
                      </div>
                      <p className="text-sm text-[#FBF3E2]/85 leading-relaxed">
                        {card.realWorldExample}
                      </p>
                    </div>

                    {/* Open Hairline Block: How Last Crusade Stops It */}
                    <div className="border-t border-[#F2D69D]/20 pt-5 border-l-2 border-l-[#00FF9D] pl-4">
                      <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-wider font-semibold text-[#00FF9D] mb-2">
                        <Shield className="w-4 h-4 shrink-0" />
                        <span>How Last Crusade Stops It</span>
                      </div>
                      <p className="text-sm text-[#FBF3E2]/90 leading-relaxed">
                        {card.howWeStopIt}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* OPEN ARCHITECTURAL SPLIT LEDGER: DUAL-USE EXPLORER (ZERO ROUNDED CONTAINER BOXES) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        <div className="velocity-item border-b-2 border-[#410217] pb-6 mb-10 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div>
            <h3 className="font-serif text-3xl sm:text-4xl text-[#410217]">
              One Core Technology, Two Missions: Offensive Visibility &amp; Defensive Protection
            </h3>
            <p className="text-sm sm:text-base text-[#410217]/80 mt-2 max-w-3xl">
              The same algorithms that help legitimate organizations earn accurate citations in AI answers also give us the visibility needed to spot and stop manipulation across four major markets.
            </p>
          </div>
        </div>

        {/* 4 Market Selector Tabs — Sharp Architectural Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-t border-l border-[#410217]">
          {dualUseArenas.map((arena, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedArena(idx)}
              className={`p-4 sm:p-5 rounded-none border-r border-b border-[#410217] text-left transition-all cursor-pointer flex items-center justify-between ${
                selectedArena === idx
                  ? 'bg-[#2B010F] text-[#D5991C] font-semibold'
                  : 'bg-transparent text-[#410217] hover:bg-[#410217]/10'
              }`}
            >
              <span className="text-sm font-serif font-bold">{arena.name}</span>
              <span className="text-xs font-mono">0{idx + 1}</span>
            </button>
          ))}
        </div>

        {/* Selected Arena Dual-Use Breakdown — Sharp Architectural Split Ledger */}
        <div className="grid grid-cols-1 md:grid-cols-2 border-b-2 border-x border-[#410217] divide-y md:divide-y-0 md:divide-x divide-[#D5991C]/35 bg-[#2B010F]/95">
          <div className="p-6 sm:p-8">
            <div className="flex items-center space-x-2 text-sm font-semibold text-[#D5991C] mb-3 pb-3 border-b border-[#F2D69D]/20">
              <CheckCircle2 className="w-4 h-4" />
              <span>Offensive AEO (Immediate Visibility &amp; Growth)</span>
            </div>
            <p className="text-sm sm:text-base text-[#FBF3E2]/90 leading-relaxed">
              {dualUseArenas[selectedArena].offensive}
            </p>
          </div>

          <div className="p-6 sm:p-8">
            <div className="flex items-center space-x-2 text-sm font-semibold text-[#00FF9D] mb-3 pb-3 border-b border-[#F2D69D]/20">
              <Shield className="w-4 h-4" />
              <span>Defensive Counter-AEO (Long-Term Security &amp; Resilience)</span>
            </div>
            <p className="text-sm sm:text-base text-[#FBF3E2]/90 leading-relaxed">
              {dualUseArenas[selectedArena].defensive}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;
