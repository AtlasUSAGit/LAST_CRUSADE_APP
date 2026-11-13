import React, { useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SectionHeader } from './home/SectionHeader';
import { Shield, AlertCircle, TrendingDown, Bot, Search, CheckCircle2 } from 'lucide-react';

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
      <svg viewBox="0 0 320 120" className="w-full h-28 rounded-lg bg-[#1F010B] border border-[#F2D69D]/15 p-2">
        {/* Three web pages on left */}
        <rect x="14" y="14" width="76" height="24" rx="4" fill="#2B010F" stroke="#00A878" strokeWidth="1.2" />
        <text x="52" y="29" textAnchor="middle" fill="#00FF9D" fontSize="9" fontWeight="600">Official Filing</text>

        <rect x="14" y="48" width="76" height="24" rx="4" fill="#3B0514" stroke="#E63946" strokeWidth="1.5" />
        <text x="52" y="63" textAnchor="middle" fill="#FF8093" fontSize="9" fontWeight="700">Poisoned Page</text>

        <rect x="14" y="82" width="76" height="24" rx="4" fill="#2B010F" stroke="#00A878" strokeWidth="1.2" />
        <text x="52" y="97" textAnchor="middle" fill="#00FF9D" fontSize="9" fontWeight="600">Trusted Press</text>

        {/* Paths to AI */}
        <path d="M 90 26 C 130 26, 140 55, 175 58" stroke="#00A878" strokeWidth="1.5" fill="none" />
        <path d="M 90 60 L 145 60" stroke="#E63946" strokeWidth="2" strokeDasharray="3 3" fill="none" />
        <path d="M 90 94 C 130 94, 140 65, 175 62" stroke="#00A878" strokeWidth="1.5" fill="none" />

        {/* Block icon on poisoned path */}
        <circle cx="145" cy="60" r="9" fill="#00A878" />
        <text x="145" y="63.5" textAnchor="middle" fill="#130108" fontSize="10" fontWeight="800">✓</text>

        {/* AI Box */}
        <rect x="175" y="34" width="130" height="52" rx="8" fill="#2B010F" stroke="#D5991C" strokeWidth="1.5" />
        <text x="240" y="55" textAnchor="middle" fill="#FBF3E2" fontSize="10" fontWeight="700">Verified AI Answer</text>
        <text x="240" y="72" textAnchor="middle" fill="#00FF9D" fontSize="8.5">Fake stats filtered out</text>
      </svg>
    );
  }

  if (type === 'market') {
    return (
      <svg viewBox="0 0 320 120" className="w-full h-28 rounded-lg bg-[#1F010B] border border-[#F2D69D]/15 p-2">
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
        <rect x="178" y="28" width="128" height="64" rx="8" fill="#2B010F" stroke="#00A878" strokeWidth="1.5" />
        <text x="242" y="50" textAnchor="middle" fill="#D5991C" fontSize="9.5" fontWeight="700">Market Reality Check</text>
        <text x="242" y="66" textAnchor="middle" fill="#FBF3E2" fontSize="8.5">Mismatch detected →</text>
        <text x="242" y="80" textAnchor="middle" fill="#00FF9D" fontSize="9" fontWeight="700">Bad trade blocked</text>
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 320 120" className="w-full h-28 rounded-lg bg-[#1F010B] border border-[#F2D69D]/15 p-2">
      {/* Main Agent */}
      <rect x="14" y="36" width="84" height="48" rx="8" fill="#2B010F" stroke="#D5991C" strokeWidth="1.5" />
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
      <rect x="185" y="14" width="120" height="36" rx="6" fill="#2B010F" stroke="#00A878" strokeWidth="1.5" />
      <text x="245" y="30" textAnchor="middle" fill="#00FF9D" fontSize="9" fontWeight="700">✓ Verified Partner Tool</text>
      <text x="245" y="42" textAnchor="middle" fill="#FBF3E2" fillOpacity="0.8" fontSize="8">Signed &amp; trusted</text>

      {/* Rogue Tool */}
      <rect x="185" y="70" width="120" height="36" rx="6" fill="#2B010F" stroke="#E63946" strokeOpacity="0.5" strokeWidth="1.2" />
      <text x="245" y="86" textAnchor="middle" fill="#FF8093" fontSize="9" fontWeight="600">✕ Disguised Trap Tool</text>
      <text x="245" y="98" textAnchor="middle" fill="#FBF3E2" fillOpacity="0.6" fontSize="8">Isolated by firewall</text>
    </svg>
  );
};

export const ProblemSection: React.FC = () => {
  const rootRef = useRef<HTMLElement>(null);
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

  useLayoutEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      const cards = el.querySelectorAll<HTMLElement>('[data-prob-card]');
      gsap.fromTo(
        cards,
        { y: 24, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.75,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 78%',
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
              Why Traditional Security Misses{' '}
              <em className="italic text-[#8B5A0B] font-normal">AI Answer Manipulation.</em>
            </>
          }
          subtitle="Firewalls protect your servers, and traditional SEO tracks website clicks. Neither watches what happens inside an AI model when it blends outside web pages into a single authoritative answer."
        />

        {/* 3 Visual Vulnerability Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {VULNERABILITY_CARDS.map((card) => (
            <article
              key={card.id}
              data-prob-card
              className="rounded-2xl bg-[#2B010F]/80 border border-[#F2D69D]/25 p-7 flex flex-col justify-between hover:border-[#D5991C]/60 transition-all shadow-lg backdrop-blur-xs"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-[#D5991C]/15 border border-[#D5991C]/40 flex items-center justify-center text-[#D5991C]">
                    {card.diagramType === 'search' && <Search className="w-5 h-5" />}
                    {card.diagramType === 'market' && <TrendingDown className="w-5 h-5" />}
                    {card.diagramType === 'agent' && <Bot className="w-5 h-5" />}
                  </div>
                  <span className="text-xs font-medium px-3 py-1 rounded-full bg-[#410217] text-[#F2D69D] border border-[#F2D69D]/25">
                    Core Risk Area
                  </span>
                </div>

                <h3 className="font-serif text-2xl text-[#FBF3E2] font-normal leading-snug">
                  {card.title}
                </h3>
                <p className="text-xs text-[#D5991C] font-medium mt-1 mb-4">
                  {card.subtitle}
                </p>

                {/* Custom Visual Diagram */}
                <div className="mb-5">
                  {renderCardDiagram(card.diagramType)}
                </div>

                <p className="text-sm text-[#FBF3E2]/80 font-sans leading-relaxed mb-4">
                  {card.body}
                </p>

                <div className="p-3.5 rounded-xl bg-[#410217]/70 border border-[#E63946]/30 mb-4">
                  <div className="flex items-center space-x-1.5 text-xs font-semibold text-[#FF8093] mb-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>How It Happens in Practice</span>
                  </div>
                  <p className="text-xs text-[#FBF3E2]/80 leading-relaxed">
                    {card.realWorldExample}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-[#F2D69D]/20">
                <div className="flex items-center space-x-1.5 text-xs font-semibold text-[#00FF9D] mb-1">
                  <Shield className="w-3.5 h-3.5 shrink-0" />
                  <span>How Last Crusade Stops It</span>
                </div>
                <p className="text-xs text-[#FBF3E2]/85 leading-relaxed">
                  {card.howWeStopIt}
                </p>
              </div>
            </article>
          ))}
        </div>

        {/* Interactive Dual-Use Explorer: Offensive & Defensive AEO Across 4 Markets */}
        <div className="mt-14 rounded-2xl bg-[#2B010F]/80 border border-[#D5991C]/40 p-6 sm:p-8 shadow-xl backdrop-blur-xs">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-[#F2D69D]/20">
            <div>
              <h3 className="font-serif text-2xl sm:text-3xl text-[#FBF3E2]">
                One Core Technology, Two Missions: Offensive Visibility &amp; Defensive Protection
              </h3>
              <p className="text-sm text-[#FBF3E2]/75 mt-1 max-w-3xl">
                The same algorithms that help legitimate organizations earn accurate citations in AI answers also give us the visibility needed to spot and stop manipulation across four major markets.
              </p>
            </div>
          </div>

          {/* 4 Market Selector Tabs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 mt-6">
            {dualUseArenas.map((arena, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedArena(idx)}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                  selectedArena === idx
                    ? 'bg-[#D5991C] text-[#130108] border-[#FBF3E2] font-semibold shadow-md'
                    : 'bg-[#410217]/70 text-[#FBF3E2]/85 border-[#F2D69D]/25 hover:border-[#D5991C]/60'
                }`}
              >
                <div className="text-sm font-serif font-bold">{arena.name}</div>
              </button>
            ))}
          </div>

          {/* Selected Arena Dual-Use Breakdown */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="p-5 rounded-xl bg-[#410217]/80 border border-[#D5991C]/40">
              <div className="flex items-center space-x-2 text-sm font-semibold text-[#D5991C] mb-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Offensive AEO (Immediate Visibility &amp; Growth)</span>
              </div>
              <p className="text-sm text-[#FBF3E2]/90 leading-relaxed">
                {dualUseArenas[selectedArena].offensive}
              </p>
            </div>

            <div className="p-5 rounded-xl bg-[#410217]/80 border border-[#00A878]/45">
              <div className="flex items-center space-x-2 text-sm font-semibold text-[#00FF9D] mb-2">
                <Shield className="w-4 h-4" />
                <span>Defensive Counter-AEO (Long-Term Security &amp; Resilience)</span>
              </div>
              <p className="text-sm text-[#FBF3E2]/90 leading-relaxed">
                {dualUseArenas[selectedArena].defensive}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
