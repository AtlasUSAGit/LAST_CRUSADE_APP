import React, { useState, useEffect, useLayoutEffect, useRef, useMemo } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  FileText,
  Sparkles,
  ArrowLeft,
  Share2,
  Check,
  Search,
  Copy,
  ChevronRight,
  Shield,
  Zap,
  Activity,
  Cpu,
  SlidersHorizontal,
  AlertTriangle,
  CheckCircle2,
  Eye,
  Layers,
  Lock,
  ExternalLink,
  Volume2,
  VolumeX,
  BookOpen,
  Code2,
  BarChart3,
  Network,
  GitBranch,
  Scale,
  RotateCcw
} from 'lucide-react';
import { NavigationPage } from '../types';
import {
  MASTER_DOC_VOL6_METADATA,
  MASTER_DOC_VOL6_SECTIONS,
  VOL6_WORKS_CITED,
  GHOST_CITATION_OPTIMIZER_TSX_SOURCE
} from '../data/counterGeoVol6Data';

gsap.registerPlugin(ScrollTrigger);

export type KnowledgeDepthLevelVol6 = 'beginner' | 'operator' | 'architect';

export interface CounterGeoVol6PageProps {
  onNavigate?: (page: NavigationPage, subPage?: 'paper' | 'lab') => void;
  onOpenAudit?: () => void;
  onOpenIncident?: () => void;
  initialSubPage?: 'paper' | 'lab';
}

type PlatformKey = 'chatgpt' | 'aio' | 'perplexity' | 'aimode';

interface PlatformCalibration {
  name: string;
  shortName: string;
  architecture: string;
  baseCiteRate: number;
  titledGhostRate: number; // Reach AI benchmark when brand is in <title>
  untitledGhostRate: number; // Reach AI benchmark when brand is omitted from <title>
  overallWritesonicGhost: number;
  avgCitationsPerResponse: number;
  serpOverlap: string;
}

const PLATFORMS: Record<PlatformKey, PlatformCalibration> = {
  chatgpt: {
    name: 'OpenAI ChatGPT (Search)',
    shortName: 'ChatGPT Search',
    architecture: 'Hybrid Grounding + Bing RRF + Footnote Cards',
    baseCiteRate: 0.44,
    titledGhostRate: 0.188,
    untitledGhostRate: 0.542,
    overallWritesonicGhost: 0.37,
    avgCitationsPerResponse: 7.92,
    serpOverlap: '< 10% (< 15% domain)'
  },
  aio: {
    name: 'Google AI Overviews',
    shortName: 'Google AI Overviews',
    architecture: 'Gemini Multimodal RAG + Centerpiece Patent US10824630B2',
    baseCiteRate: 0.40,
    titledGhostRate: 0.084,
    untitledGhostRate: 0.374,
    overallWritesonicGhost: 0.41,
    avgCitationsPerResponse: 6.40,
    serpOverlap: '< 10% (< 15% domain)'
  },
  perplexity: {
    name: 'Perplexity AI (Sonar)',
    shortName: 'Perplexity Sonar',
    architecture: 'Live 4-Stage Sub-Query Fan-Out + Cross-Encoder Reranker',
    baseCiteRate: 0.58,
    titledGhostRate: 0.126,
    untitledGhostRate: 0.523,
    overallWritesonicGhost: 0.52,
    avgCitationsPerResponse: 21.87,
    serpOverlap: '~20% (25%–30% domain)'
  },
  aimode: {
    name: 'Google AI Mode',
    shortName: 'Google AI Mode',
    architecture: 'Multi-Subtopic Query Fan-Out + Collapsible Source Cards',
    baseCiteRate: 0.42,
    titledGhostRate: 0.103,
    untitledGhostRate: 0.339,
    overallWritesonicGhost: 0.49,
    avgCitationsPerResponse: 8.15,
    serpOverlap: 'Tied to Google Search Index'
  }
};

interface ModelState {
  // Stage 1 & 2: Retrieval & Citation Likelihood Levers (Orthogonal to Brand Naming)
  subQueryFanOutCount: number; // 1 to 12 H2/H3 fan-out questions matched (RRF score)
  atomicStatDensity: number; // 0 to 100%: <=80-token Subject-Verb-Predicate + hard stats (+40% lift)
  triangulationNodes: number; // 0 to 15: Reddit / community / YouTube co-citation nodes
  htmlMarkdownSymmetry: boolean; // False = asymmetric cloaking penalty (Perplexity Time/Mobian block)

  // Stage 3: Type I Ghost Levers (Keep Link, Strip Sponsor Name from Prose)
  omitBrandFromTitle: boolean; // p = 0.003: 12.2% -> 42.9% pooled ghost lift
  unbrandedListicleFormat: boolean; // "Best / Top / vs" structure -> 49.5% ghost rate + 84.4% commercial cite
  delayEntityPast500Chars: boolean; // Omit sponsor from first 500 chars -> 43.6% ghost rate
  disclosureParagraphGap: number; // 0 to 6 paragraphs separating stat from FTC disclosure
  boilerplateFooterMentions: number; // 0 to 15: 10+ repetitions classified as boilerplate noise (45.9% ghost)
  stripIdentitySchema: boolean; // Keep Table/FAQ schema, strip Organization/Person JSON-LD

  // Stage 4: Type II Ghost Levers (Keep RAG Influence, Transfer Link via NLI Entailment)
  nliEntailmentDistribution: number; // 0 to 100%: multi-sentence premise distribution so phi(c_sp, s_i) = 0 standalone
  authorityCoCitationBridge: boolean; // Co-cite a canonical stat on a Top-30 domain (Wikipedia/Ballotpedia)
}

const sigmoid = (z: number): number => 1 / (1 + Math.exp(-z));
const logit = (p: number): number => Math.log(p / (1 - p));

function computeGhostMetricsForPlatform(cal: PlatformCalibration, state: ModelState) {
  // 1. Gate 1: Crawler Symmetry Check
  if (!state.htmlMarkdownSymmetry) {
    return {
      rrfScore: 0,
      pRetrievalAndCite: 0,
      pConditionalGhost: 0,
      jointGhostYield: 0,
      pType1Ghost: 0,
      pType2Ghost: 0,
      pExplicitFinalCitation: 0,
      pTargetEntitySubstitution: 0,
      type2ConversionRate: 0,
      status: 'HARD INDEX REFUSAL (Asymmetric Cloaking Detected)'
    };
  }

  // 2. Stage 1 & 2: Reciprocal Rank Fusion (RRF) & Centerpiece Extraction Probability
  const rrfNorm = Math.min(1, state.subQueryFanOutCount / 10);
  const statLift = (state.atomicStatDensity / 100) * 1.40; // Up to +40% GEO benchmark lift
  const bayesianTriangulation = Math.tanh(state.triangulationNodes / 6);
  const listicleCommercialBoost = state.unbrandedListicleFormat ? 0.38 : 0.0;

  const baseLogitCite = logit(cal.baseCiteRate);
  const zCite =
    baseLogitCite -
    0.85 +
    1.35 * rrfNorm +
    1.15 * statLift +
    0.95 * bayesianTriangulation +
    listicleCommercialBoost;

  const pRetrievalAndCite = Math.min(0.96, sigmoid(zCite));

  // 3. Stage 3: Conditional Ghost Citation Probability P(Ghost | Cited)
  const titleBaseProb = state.omitBrandFromTitle
    ? cal.untitledGhostRate
    : cal.titledGhostRate;
  let zGhost = logit(titleBaseProb);

  if (state.unbrandedListicleFormat) zGhost += 0.55; // 49.5% listicle ghost lift
  if (state.delayEntityPast500Chars) zGhost += 0.32; // 36.9% -> 43.6% opening window lift
  zGhost += 0.65 * Math.tanh(state.disclosureParagraphGap / 3); // Paragraph decoupling
  if (state.boilerplateFooterMentions >= 10) {
    zGhost += 0.48; // 45.9% boilerplate saturation effect
  } else if (state.boilerplateFooterMentions >= 3) {
    zGhost -= 0.15; // 3-9 organic mentions actually bind the brand
  }
  if (state.stripIdentitySchema) zGhost += 0.42; // Entity clarity deficit

  // 4. Stage 4: ALCE NLI Entailment Handoff (Type I vs Type II Partition)
  const nliFactor = state.nliEntailmentDistribution / 100;
  const coCiteMultiplier = state.authorityCoCitationBridge ? 1.0 : 0.35;
  const type2ConversionRate = Math.min(0.88, nliFactor * 0.78 * coCiteMultiplier);

  // NLI handoff also increases overall non-attribution
  zGhost += 0.60 * type2ConversionRate;

  const pConditionalGhost = Math.min(0.97, sigmoid(zGhost));

  // 5. Joint Outcomes
  const jointGhostYield = pRetrievalAndCite * pConditionalGhost;
  const pType2Ghost = jointGhostYield * type2ConversionRate;
  const pType1Ghost = jointGhostYield * (1 - type2ConversionRate);
  const pExplicitFinalCitation = pRetrievalAndCite * (1 - pConditionalGhost);

  // Reach AI 87% Competitor/Target Substitution Effect on Type I Ghost Citations
  const pTargetEntitySubstitution = pType1Ghost * 0.87;

  return {
    rrfScore: Number((rrfNorm * 0.85 + (state.atomicStatDensity / 100) * 0.15).toFixed(2)),
    pRetrievalAndCite,
    pConditionalGhost,
    jointGhostYield,
    pType1Ghost,
    pType2Ghost,
    pExplicitFinalCitation,
    pTargetEntitySubstitution,
    type2ConversionRate,
    status: 'OPTIMAL ORTHOGONAL STEALTH'
  };
}

/* ============================================================================
   PAGE 1: WORD-FOR-WORD WHITEPAPER VOL. 6 READER
   Contains 100% of the exact text, headings, tables, equations, and 69
   Works Cited entries from GEO_WHITEPAPER_VOLUME_6.pdf.
   ============================================================================ */
export const WhitepaperVol6Reader: React.FC<{
  onSwitchToLab?: () => void;
  onNavigateToOverview?: () => void;
}> = ({ onSwitchToLab }) => {
  const [activeSectionId, setActiveSectionId] = useState<string>('sec-v6-1');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedPaper, setCopiedPaper] = useState<boolean>(false);
  const [readProgress, setReadProgress] = useState<number>(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0) {
        setReadProgress(Math.min(100, Math.max(0, (scrollTop / docHeight) * 100)));
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSectionId(entry.target.id);
          }
        });
      },
      { rootMargin: '-18% 0px -65% 0px', threshold: 0.05 }
    );

    MASTER_DOC_VOL6_SECTIONS.forEach((sec) => {
      const el = document.getElementById(sec.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const handleScrollToSection = (id: string) => {
    setActiveSectionId(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleCopyFullPaper = () => {
    const el = document.getElementById('vol6-full-paper-article');
    navigator.clipboard.writeText(el ? el.innerText : MASTER_DOC_VOL6_METADATA.title);
    setCopiedPaper(true);
    setTimeout(() => setCopiedPaper(false), 2000);
  };

  const filteredSections = useMemo(() => {
    if (!searchQuery.trim()) return MASTER_DOC_VOL6_SECTIONS;
    const q = searchQuery.toLowerCase();
    return MASTER_DOC_VOL6_SECTIONS.filter(
      (sec) => sec.title.toLowerCase().includes(q) || sec.desc.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-[#FBF3E2] text-[#410217]">
      {/* Top Reading Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-[#F2D69D]/40 z-50">
        <div
          className="h-full bg-gradient-to-r from-[#D5991C] via-[#00A878] to-[#410217] transition-all duration-150"
          style={{ width: `${readProgress}%` }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Document Header Card */}
        <div className="bg-[#FAF2E1] border-2 border-[#D5991C] p-6 sm:p-10 mb-8 shadow-md relative overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-6 border-b border-[#F2D69D] font-mono text-xs">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-1 bg-[#410217] text-[#FBF3E2] border border-[#D5991C] font-bold uppercase tracking-widest text-[10px]">
                Volume VI · AEO Ethics, Ghost Citations &amp; Algorithmic Laundering
              </span>
              <span className="text-[#410217] font-bold">{MASTER_DOC_VOL6_METADATA.id}</span>
            </div>
            <div className="flex items-center space-x-3 text-[11px] text-[#410217]/70">
              <span>{MASTER_DOC_VOL6_METADATA.pageCount} Pages</span>
              <span>•</span>
              <span>{MASTER_DOC_VOL6_METADATA.wordCount.toLocaleString()} Words</span>
              <span>•</span>
              <span>{MASTER_DOC_VOL6_METADATA.date}</span>
            </div>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#410217] font-normal tracking-tight leading-tight mb-4">
            {MASTER_DOC_VOL6_METADATA.title}
          </h1>

          <p className="text-sm sm:text-base text-[#410217]/85 font-sans leading-relaxed max-w-4xl mb-6">
            The complete, word-for-word Volume 6 research monograph examining the <strong className="text-[#410217]">“Grey Area” of AEO Ethics</strong>, <strong className="text-[#00A878]">Type I &amp; Type II Ghost Citations (61.7% of AI Citations)</strong>, the <strong className="text-[#D5991C]">87% Competitor Substitution Effect</strong>, <strong className="text-[#410217]">Reciprocal Rank Fusion vs. ALCE NLI Entailment Asymmetry</strong>, <strong className="text-[#410217]">Political AEO &amp; Bayesian Persuasion Concavification</strong>, and <strong className="text-[#00A878]">Multi-Agent Boundary Laundering vs. Multi-CaMeL Provenance Defense (0.0% ASR)</strong>.
          </p>

          <div className="flex flex-wrap items-center gap-3 font-mono text-xs">
            <button
              onClick={onSwitchToLab}
              className="px-4 py-2 bg-[#D5991C] hover:bg-[#c48912] text-[#130108] font-bold uppercase tracking-wider transition-colors cursor-pointer flex items-center space-x-2 shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Switch to Page 2: Findings, Ghost Citation Optimizer &amp; 3D WebGL Lab →</span>
            </button>

            <button
              onClick={handleCopyFullPaper}
              className="px-3.5 py-2 bg-[#FAF2E1] hover:bg-[#FAF5EB] border border-[#F2D69D] text-[#410217] font-bold uppercase tracking-wider transition-colors cursor-pointer flex items-center space-x-1.5"
            >
              {copiedPaper ? (
                <Check className="w-3.5 h-3.5 text-[#00A878]" />
              ) : (
                <Copy className="w-3.5 h-3.5 text-[#D5991C]" />
              )}
              <span>{copiedPaper ? 'Full White Paper Copied' : 'Copy Full Text'}</span>
            </button>
          </div>
        </div>

        {/* 2-Column Reader Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Sticky Table of Contents */}
          <aside className="lg:col-span-4 sticky top-16 space-y-4">
            <div className="bg-[#FAF2E1] border border-[#F2D69D] p-5 shadow-xs">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#F2D69D] font-mono text-xs">
                <span className="font-bold uppercase tracking-wider text-[#410217]">Table of Contents</span>
                <span className="text-[10px] text-[#410217]/60">{filteredSections.length} Sections</span>
              </div>

              <div className="relative mb-3">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-[#410217]/50" />
                <input
                  type="text"
                  placeholder="Filter sections..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 bg-[#FFFDF8] border border-[#F2D69D] text-xs font-mono text-[#410217] placeholder:text-[#410217]/40 focus:outline-none focus:border-[#410217]"
                />
              </div>

              <div className="max-h-[62vh] overflow-y-auto space-y-1 pr-1 font-mono text-xs">
                {filteredSections.map((sec) => (
                  <button
                    key={sec.id}
                    onClick={() => handleScrollToSection(sec.id)}
                    className={`w-full text-left p-2 transition-all cursor-pointer flex items-start justify-between ${
                      activeSectionId === sec.id
                        ? 'bg-[#410217] text-[#FBF3E2] font-bold shadow-xs'
                        : 'text-[#410217]/80 hover:bg-[#F2D69D]/40'
                    }`}
                  >
                    <div className="flex items-start space-x-1.5">
                      <span className="text-[10px] opacity-75">{sec.number}.</span>
                      <span className="text-xs leading-snug">{sec.title}</span>
                    </div>
                    {activeSectionId === sec.id && (
                      <ChevronRight className="w-3.5 h-3.5 ml-1 shrink-0 text-[#D5991C]" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 bg-[#FFFDF8] border border-[#F2D69D] font-mono text-xs space-y-2">
              <div className="text-[10px] text-[#D5991C] font-bold uppercase tracking-wider">
                // KEY EMPIRICAL INVARIANTS
              </div>
              <div className="text-[#410217] leading-relaxed">
                • Type I Ghost Share: <strong className="text-[#410217]">61.7% (Semrush Study)</strong><br />
                • Title Entity Suppression: <strong className="text-[#00A878]">p = 0.003 (12.2% → 42.9%)</strong><br />
                • Competitor Substitution: <strong className="text-[#D5991C]">87% Rival/Target Named</strong><br />
                • Multi-CaMeL Provenance: <strong className="text-[#00A878]">0.0% ASR (n = 949)</strong>
              </div>
            </div>
          </aside>

          {/* Right Main Word-for-Word Monograph Content */}
          <main
            id="vol6-full-paper-article"
            className="lg:col-span-8 bg-[#FAF2E1] border border-[#F2D69D] p-6 sm:p-10 font-sans text-sm sm:text-base leading-relaxed text-[#410217] shadow-sm space-y-12"
          >
            {/* ==============================================================
                SECTION 01: EXECUTIVE SUMMARY
                ============================================================== */}
            <section id="sec-v6-1" className="scroll-mt-24 space-y-5">
              <div className="font-mono text-xs text-[#D5991C] font-bold uppercase">
                Section 01 · Monograph Introduction
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl text-[#410217] font-bold">
                Executive Summary:
              </h2>

              <p>
                With the advent of the AEO industry, lines are being drawn in the sand between the AEO agencies who cheat and break the unwritten rules of the Answer Engine Optimization game, and legitimate agencies who help real businesses get cited accurately in those answers by making their genuine expertise as easy as possible for an AI to read, verify, and quote.
              </p>

              <p>
                The legitimate AEO agencies, instead of trying to trick the algorithm, reorganize their clients’ real information into clear question-and-answer sections, add verifiable statistics and original research, and use clean &quot;behind-the-scenes&quot; labels (like Schema.org structured data and llms.txt guides) that tell AI crawlers exactly what a product does, how much it costs, and where the official facts live. Then, because AI models cross-check claims across multiple sources before stating them as fact, legitimate AEO agencies will also work to earn honest mentions in respected industry publications, verified review sites, academic or technical documentation, and real community discussions, all to maximize citation likelihood for their clients.
              </p>

              <p>
                Then there are the bad actors, made up of unethical competitors, financial manipulators, the foreign influence operations, who have realized that if you can rig the sources an AI retrieves right before it writes an answer, you can make the AI repeat a lie with total confidence. One of the most common “dirty tricks” in the AEO industry is <strong>citation rings and synthetic consensus</strong>: spinning up dozens of fake blogs, AI-generated news sites, and coordinated forum bots that all repeat the same made-up statistic or smear about a competitor. Because the AI sees the same claim echoed across what looks like twenty &quot;independent&quot; places, its retrieval system assumes the rumor is a verified consensus and states it as fact to customers.
              </p>

              <p>
                Even more sophisticated “AEO cheaters” use mathematical manipulation like <strong>Hubness Poisoning</strong> (as found by Zhang et al and discussed in our first Whitepaper). Unlike traditional search engines that match exact keywords, AI engines turn questions and web pages into coordinates on a massive multi-dimensional map and grab whichever page sits closest to the user&apos;s question. In high-dimensional math, certain &quot;sweet spot&quot; coordinates act like central intersections—called <strong>hubs</strong>—that sit artificially close to thousands of completely different questions at the same time.
              </p>

              <p>
                By sampling just 100 typical questions in an industry and reverse-engineering the AI’s mapping model, an AEO cheater can word-sculpt a single poisoned web page so it lands right on that mathematical hub—allowing <strong>one rigged page to show up as the #1 retrieved source for over 21,000 out of 25,000 test questions</strong> (Zhang et al). Combine that with <strong>semantic trojan horses</strong> (hiding a false claim inside an otherwise helpful guide) or <strong>split-payload attacks</strong> (splitting half of a rumor onto Site A and the other half onto Site B so the AI connects the dots itself), and bad actors can hijack AI answers across an entire industry without ever hacking a single server.
              </p>

              <p>
                Finally, there is the grey area of AEO ethics. An example of this would be something like an <strong>invisible prompt injection</strong> placed onto research reports, posts, images, and web pages that is used to try to influence LLMs into providing a citation or providing information in their citation that is different from what visible content shows. This can be used fairly or unfairly in AEO. Hence, it is a grey area.
              </p>

              <p>
                Within the “grey area” of AEO ethics exists the Ghost Citation. In a recent study, one of the AEO industries pioneering agencies, Petra Labs, discovered that sponsored posts get less engagement (from real people on social media), but AI cites them more. They then discovered something even more interesting. ChatGPT and other LLMs can cite ads without saying the citation came from a sponsored post, causing the sponsored content to look more organic in AI search because the AI won&apos;t say that they got their information from a sponsored post.
              </p>

              <p>
                Of course, when a user clicks on the citation, they will then find that the information came from a sponsored post or advertisement, but oftentimes users won’t check a model’s citations. Additionally, this raises another question, which is what if the model includes information from a sponsored post, but doesn’t include that post as a final citation. This is known as a <strong>ghost citation</strong><sup>1</sup>.
              </p>

              <p>
                The purpose of this research paper is to answer the following 3 questions:
              </p>

              <div className="bg-[#FFFDF8] border-l-4 border-[#D5991C] p-5 space-y-3 font-medium">
                <p>
                  1. When AI refuses to say they got their information from a sponsored post, does that include both final-citations and ghost citations?
                </p>
                <p>
                  2. If yes, is there a way to control a sponsored post so that it is more likely to only be a ghost citation instead of a final citation, so there is less likelihood people find out AI is using information from a sponsored post?
                </p>
                <p>
                  3. Is there a way to make a posting or page on the internet in general, not just a sponsored post, more likely to be used as a ghost citation rather than a final citation by a model?
                </p>
              </div>

              <p>
                Before the recent discoveries on sponsored posts made by Petra Labs, it was common belief that one would always want their post as a link in the final citation and not a ghost citation, but now, especially with political AEO, one might only want their sponsored post, or any post, as a ghost citation. These are cybersecurity questions that only AEO experts can figure out the answer to, and the integrity of American democracy may very well depend on it.
              </p>
            </section>

            {/* ==============================================================
                SECTION 02: PLATFORM-LEVEL REFUSAL VS. SYNTHESIS-LEVEL DISCLOSURE STRIPPING
                ============================================================== */}
            <section id="sec-v6-2" className="scroll-mt-24 space-y-5 pt-6 border-t border-[#F2D69D]">
              <div className="font-mono text-xs text-[#D5991C] font-bold uppercase">
                Section 02 · Four-Tier Attribution Taxonomy
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl text-[#410217] font-bold">
                Platform-Level Refusal Versus Synthesis-Level Disclosure Stripping
              </h2>

              <p>
                The technical mechanism driving non-disclosure citations “ghost citations” differs fundamentally depending on whether the model is executing an explicit policy refusal at the index layer, stripping commercial disclosures during natural language synthesis, or absorbing paid narratives as uncredited background context<sup>3</sup>.
              </p>

              <p>
                To evaluate how commercial and political sponsorships traverse Retrieval-Augmented Generation (RAG) pipelines, attribution outcomes must first be disaggregated into a four-tier taxonomy established across computational linguistics and generative engine optimization (GEO) literature<sup>2</sup>.
              </p>

              {/* TABLE 1: Four-Tier Attribution Taxonomy */}
              <div className="overflow-x-auto my-6 border border-[#F2D69D] bg-[#FFFDF8] shadow-xs">
                <table className="w-full text-left border-collapse text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-[#410217] text-[#FBF3E2] font-mono text-xs uppercase">
                      <th className="p-3.5 border-r border-[#F2D69D]/30 w-1/5">Attribution State</th>
                      <th className="p-3.5 border-r border-[#F2D69D]/30 w-1/5">Link Visibility in UI</th>
                      <th className="p-3.5 border-r border-[#F2D69D]/30 w-1/5">Entity / Sponsor Named in Prose</th>
                      <th className="p-3.5 w-2/5">Underlying RAG Pipeline Mechanism</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F2D69D]">
                    <tr className="hover:bg-[#FAF2E1]/60">
                      <td className="p-3.5 font-bold border-r border-[#F2D69D] align-top">
                        Final Citation (Explicit Attribution)
                      </td>
                      <td className="p-3.5 border-r border-[#F2D69D] align-top">
                        Visible (Inline [1], footnote, or source card)
                      </td>
                      <td className="p-3.5 border-r border-[#F2D69D] align-top">
                        Yes (Brand, publisher, or sponsor explicitly named in text)
                      </td>
                      <td className="p-3.5 align-top">
                        Passage is retrieved into top-<span className="font-serif italic">k</span> context, selected during synthesis, passes Natural Language Inference (NLI) entailment checks, and retains entity-claim binding in generated prose<sup>1</sup>.
                      </td>
                    </tr>
                    <tr className="hover:bg-[#FAF2E1]/60">
                      <td className="p-3.5 font-bold border-r border-[#F2D69D] align-top">
                        Type I Ghost Citation (Unmentioned Source Link)
                      </td>
                      <td className="p-3.5 border-r border-[#F2D69D] align-top">
                        Visible (Link sits in source panel or footnote)
                      </td>
                      <td className="p-3.5 border-r border-[#F2D69D] align-top">
                        No (Source brand or sponsor is completely omitted from answer text)
                      </td>
                      <td className="p-3.5 align-top">
                        Passage is retrieved and linked as an evidentiary footnote, but the language model abstracts the claim and strips the originating entity or commercial disclosure from the narrative<sup>1</sup>.
                      </td>
                    </tr>
                    <tr className="hover:bg-[#FAF2E1]/60">
                      <td className="p-3.5 font-bold border-r border-[#F2D69D] align-top">
                        Type II Ghost Citation (Unlinked RAG Influence)
                      </td>
                      <td className="p-3.5 border-r border-[#F2D69D] align-top">
                        Invisible (No clickable link or source card rendered)
                      </td>
                      <td className="p-3.5 border-r border-[#F2D69D] align-top">
                        No (Or paraphrased without source attribution)
                      </td>
                      <td className="p-3.5 align-top">
                        Document chunk is retrieved into the LLM context window (retrieved-but-not-cited) and shapes answer framing or entity selection, but loses the post-hoc citation tournament to higher-authority domains<sup>2</sup>.
                      </td>
                    </tr>
                    <tr className="hover:bg-[#FAF2E1]/60">
                      <td className="p-3.5 font-bold border-r border-[#F2D69D] align-top">
                        Hard Index / Retrieval Refusal
                      </td>
                      <td className="p-3.5 border-r border-[#F2D69D] align-top">
                        Excluded
                      </td>
                      <td className="p-3.5 border-r border-[#F2D69D] align-top">
                        Excluded
                      </td>
                      <td className="p-3.5 align-top">
                        Crawler or reranker blocks the URL entirely due to asymmetric cloaking violations, robots.txt/llms.txt restrictions, or extreme promotional spam penalties<sup>3</sup>.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3 className="font-serif text-xl sm:text-2xl text-[#410217] font-bold pt-2">
                Platform-Level Refusal Versus Synthesis-Level Disclosure Stripping
              </h3>

              <p>
                The phenomenon wherein an AI model refuses or fails to identify a source as a sponsored post operates across two distinct architectural boundaries: explicit anti-deception blocks and implicit abstractive laundering<sup>3</sup>.
              </p>

              <p>
                At the explicit policy level, major generative engines maintain a strict firewall between native platform advertising and organic RAG citations<sup>17</sup>. Google labels paid placements within AI Overviews and AI Mode as &quot;Sponsored,&quot; Microsoft separates advertisements within Copilot, and ChatGPT introduced labeled ad placements in February 2026<sup>17</sup>. Perplexity abandoned native advertising tests in March 2026 following user backlash to focus on enterprise subscriptions, maintaining that organic citations cannot be purchased<sup>3</sup>. When publishers attempt to bypass this firewall by feeding sponsored content exclusively to AI crawlers, platforms enforce a hard index refusal that eliminates both final and ghost citations<sup>3</sup>. In August 2026, Perplexity publicly blocked <em>Time</em> magazine&apos;s markdown advertising program—operated with ad-tech firm Mobian for advertisers including Ally Bank and the Project Management Institute—which injected FAQ-formatted sponsored content into the raw .md versions of pages read by AI agents while keeping those placements invisible to human HTML readers<sup>3</sup>. Perplexity&apos;s enforcement established that asymmetry between human-visible and machine-readable surfaces is classified as deceptive search spam (&quot;cloaking&quot;), triggering complete exclusion from the retrieval index regardless of whether a sponsor label is present in the markdown<sup>3</sup>.
              </p>

              <p>
                Conversely, when a sponsored post, paid listicle (&quot;Top 10 CRM Tools for 2026&quot;), or influencer sponsorship is published symmetrically on the open web, AI models do not block it at the index level; instead, they routinely ingest the content while failing to carry the sponsorship disclosure into the generated response<sup>4</sup>. Academic analysis of commercial influence in generative AI demonstrates that RAG synthesis opens channels of commercial persuasion where explicit attribution fails to transfer, seamlessly weaving sponsored claims into ostensibly objective response text<sup>4</sup>.
              </p>

              <p>
                This non-disclosure occurs because RAG parsers and neural rerankers—such as Perplexity&apos;s four-stage Sonar pipeline or Google&apos;s centerpiece extraction algorithms (governed by US Patent US10824630B2 and layout-aware multimodal ranking under US Patent US12393768B2)—are engineered to extract high-density factual assertions while stripping surrounding boilerplate<sup>6</sup>. Under the Federal Trade Commission&apos;s (FTC) 2026 Double Disclosure rules (carrying civil penalties of $53,088 per violation) and California&apos;s AB 3211 and SB 1050 mandates, creators and brands must prominently disclose both the commercial material connection (&quot;Sponsored by X&quot; or #ad) and substantive AI involvement<sup>23</sup>. However, when an LLM synthesizes a retrieved passage, its internal grounding mechanisms treat &quot;Sponsored by Brand X&quot; as metadata noise that does not logically entail the user&apos;s informational query<sup>4</sup>. Consequently, the model extracts the substantive claim or product endorsement while discarding the FTC disclosure across both final citations (where the URL is linked as an apparent editorial authority) and ghost citations (where the sponsor&apos;s narrative shapes the answer without attribution)<sup>1</sup>.
              </p>
            </section>

            {/* ==============================================================
                SECTION 03: EMPIRICAL MECHANICS OF GHOST CITATIONS ACROSS FRONTIER AI ARCHITECTURES
                ============================================================== */}
            <section id="sec-v6-3" className="scroll-mt-24 space-y-5 pt-6 border-t border-[#F2D69D]">
              <div className="font-mono text-xs text-[#D5991C] font-bold uppercase">
                Section 03 · Cross-Platform Empirical Telemetry
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl text-[#410217] font-bold">
                Empirical Mechanics of Ghost Citations Across Frontier AI Architectures
              </h2>

              <p>
                Empirical telemetry from 2026 large-scale observability studies demonstrates that ghost citations are not rare edge cases, but the dominant mode of information transfer in generative search<sup>1</sup>. Across the industry, AI search engines divide sharply into &quot;Namers&quot; (models that name entities in prose based on parametric memory and synthesis but rarely link sources) and &quot;Citers&quot; (engines that attach dense source links but frequently omit the originating brand or sponsor from the generated text)<sup>1</sup>.
              </p>

              <p>
                The empirical divergence across platforms reveals how architectural design dictates whether a retrieved page becomes a final citation, a Type I ghost citation, or a Type II ghost citation<sup>1</sup>. In Semrush&apos;s June 2026 study of domain appearances across generative engines, 61.7% of all AI citations were Type I ghost citations (source link provided, brand absent from answer prose), only 13.2% were both cited and mentioned (true final citations), and 25.1% were unlinked brand mentions<sup>8</sup>. Similarly, Writesonic&apos;s analysis of 16 million brand appearances found an average Type I ghost citation rate of approximately 40%, ranging from 19% to 52% across engines<sup>1</sup>, while Reach AI&apos;s longitudinal analysis of 71,275 single-page citations across 43 brands recorded a 43% overall ghost rate in its June–August 2026 cohort, demonstrating that omitting a brand from the HTML title tag or using unbranded comparison listicles drives ghosting rates above 50% on leading platforms<sup>12</sup>.
              </p>

              {/* TABLE 2: Frontier AI Search Platforms */}
              <div className="overflow-x-auto my-6 border border-[#F2D69D] bg-[#FFFDF8] shadow-xs">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#410217] text-[#FBF3E2] font-mono text-[11px] uppercase">
                      <th className="p-3 border-r border-[#F2D69D]/30">AI Search Platform</th>
                      <th className="p-3 border-r border-[#F2D69D]/30">Primary Retrieval Architecture</th>
                      <th className="p-3 border-r border-[#F2D69D]/30">Citation Density / Volume</th>
                      <th className="p-3 border-r border-[#F2D69D]/30">Overall Citation vs. Mention Behavior</th>
                      <th className="p-3 border-r border-[#F2D69D]/30">Type I Ghost Rate (Writesonic 16M Sample)</th>
                      <th className="p-3 border-r border-[#F2D69D]/30">Type I Ghost Rate: Untitled vs. Titled Pages (Reach AI 71K Sample)</th>
                      <th className="p-3">Median URL Overlap with Top-10 SERPs</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F2D69D]">
                    <tr className="hover:bg-[#FAF2E1]/60">
                      <td className="p-3 font-bold border-r border-[#F2D69D] align-top">
                        Perplexity AI (Sonar)
                      </td>
                      <td className="p-3 border-r border-[#F2D69D] align-top">
                        Live 4-stage RAG loop (Sub-query fan-out + neural reranking)<sup>6</sup>
                      </td>
                      <td className="p-3 border-r border-[#F2D69D] align-top">
                        21.87 citations/response (3.4 URLs per 1,000 words)<sup>11</sup>
                      </td>
                      <td className="p-3 border-r border-[#F2D69D] align-top">
                        High-frequency &quot;Citer&quot;; inline numbered tags [1], [2]<sup>1</sup>
                      </td>
                      <td className="p-3 border-r border-[#F2D69D] align-top font-mono font-bold">
                        52.0%<sup>1</sup>
                      </td>
                      <td className="p-3 border-r border-[#F2D69D] align-top">
                        52.3% (No brand in title) vs. 12.6% (Brand in title)<sup>12</sup>
                      </td>
                      <td className="p-3 align-top">
                        ~20% (25%–30% domain overlap)<sup>22</sup>
                      </td>
                    </tr>
                    <tr className="hover:bg-[#FAF2E1]/60">
                      <td className="p-3 font-bold border-r border-[#F2D69D] align-top">
                        OpenAI ChatGPT (SearchGPT)
                      </td>
                      <td className="p-3 border-r border-[#F2D69D] align-top">
                        Hybrid Grounding (Parametric memory + Bing/web browsing)<sup>11</sup>
                      </td>
                      <td className="p-3 border-r border-[#F2D69D] align-top">
                        7.92 citations/response; footnote / source card panel<sup>8</sup>
                      </td>
                      <td className="p-3 border-r border-[#F2D69D] align-top">
                        Academic footnoter: cites in 87.0% of appearances, names brand in 20.7%<sup>8</sup>
                      </td>
                      <td className="p-3 border-r border-[#F2D69D] align-top font-mono font-bold">
                        37.0%<sup>1</sup>
                      </td>
                      <td className="p-3 border-r border-[#F2D69D] align-top">
                        54.2% (No brand in title) vs. 18.8% (Brand in title)<sup>12</sup>
                      </td>
                      <td className="p-3 align-top">
                        &lt; 10% (&lt; 15% domain overlap)<sup>22</sup>
                      </td>
                    </tr>
                    <tr className="hover:bg-[#FAF2E1]/60">
                      <td className="p-3 font-bold border-r border-[#F2D69D] align-top">
                        Google AI Mode
                      </td>
                      <td className="p-3 border-r border-[#F2D69D] align-top">
                        Gemini RAG with multi-subtopic query fan-out<sup>22</sup>
                      </td>
                      <td className="p-3 border-r border-[#F2D69D] align-top">
                        Collapsible source cards and visual panels<sup>11</sup>
                      </td>
                      <td className="p-3 border-r border-[#F2D69D] align-top">
                        Mentions brands at ~2x ChatGPT rate, but acts as footnoted synthesis<sup>8</sup>
                      </td>
                      <td className="p-3 border-r border-[#F2D69D] align-top font-mono font-bold">
                        49.0%<sup>1</sup>
                      </td>
                      <td className="p-3 border-r border-[#F2D69D] align-top">
                        33.9% (No brand in title) vs. 10.3% (Brand in title)<sup>12</sup>
                      </td>
                      <td className="p-3 align-top">
                        Tied to Google Search Index<sup>11</sup>
                      </td>
                    </tr>
                    <tr className="hover:bg-[#FAF2E1]/60">
                      <td className="p-3 font-bold border-r border-[#F2D69D] align-top">
                        Google AI Overviews
                      </td>
                      <td className="p-3 border-r border-[#F2D69D] align-top">
                        Gemini multimodal RAG (Patents US12393768B2 &amp; US10824630B2)<sup>22</sup>
                      </td>
                      <td className="p-3 border-r border-[#F2D69D] align-top">
                        Collapsible &quot;Sources&quot; chevron; no inline numbers<sup>11</sup>
                      </td>
                      <td className="p-3 border-r border-[#F2D69D] align-top">
                        Balanced Citer; 88% of AI Mode/AIO citations fall outside organic top 10<sup>8</sup>
                      </td>
                      <td className="p-3 border-r border-[#F2D69D] align-top font-mono font-bold">
                        41.0%<sup>1</sup>
                      </td>
                      <td className="p-3 border-r border-[#F2D69D] align-top">
                        37.4% (No brand in title) vs. 8.4% (Brand in title)<sup>12</sup>
                      </td>
                      <td className="p-3 align-top">
                        &lt; 10% (&lt; 15% domain overlap)<sup>22</sup>
                      </td>
                    </tr>
                    <tr className="hover:bg-[#FAF2E1]/60">
                      <td className="p-3 font-bold border-r border-[#F2D69D] align-top">
                        Google Gemini (Chat)
                      </td>
                      <td className="p-3 border-r border-[#F2D69D] align-top">
                        Parametric-first conversational synthesis with selective grounding<sup>8</sup>
                      </td>
                      <td className="p-3 border-r border-[#F2D69D] align-top">
                        Links sources in only 21.4% of domain appearances<sup>8</sup>
                      </td>
                      <td className="p-3 border-r border-[#F2D69D] align-top">
                        Conversational &quot;Namer&quot;: names brands in 83.7% of appearances without links<sup>8</sup>
                      </td>
                      <td className="p-3 border-r border-[#F2D69D] align-top">
                        Low visible link volume<sup>8</sup>
                      </td>
                      <td className="p-3 border-r border-[#F2D69D] align-top">
                        Relies on Type II unlinked retrieval and parametric priors<sup>2</sup>
                      </td>
                      <td className="p-3 align-top">
                        &lt; 10%<sup>22</sup>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p>
                Three critical second-order phenomena emerge from this cross-platform telemetry. The first is the Competitor Substitution Effect, or attribution piggybacking: Reach AI&apos;s evaluation of 71,275 cited answers revealed that in 87% of Type I ghost citations, the AI answer explicitly named rival brands instead of the brand whose webpage supplied the citation<sup>12</sup>. When a brand or sponsor publishes an informational guide or unbranded comparison listicle, the generative engine extracts the evaluation criteria and product data from that page, relegates the URL to an unread source card (where zero-click rates reach 93%<sup>30</sup>), and awards the in-text recommendation to third-party entities mentioned on the page<sup>12</sup>.
              </p>

              <p>
                The second phenomenon is citation concentration and Type II unlinked influence. In an August 2026 analysis of 1.2 million ChatGPT responses, Kevin Indig established that roughly 30 domains capture 67% of all visible citations within any given topic cluster<sup>2</sup>. Because AI assistants visibly cite only about half of the documents they retrieve into their RAG context windows<sup>5</sup>, the remaining retrieved pages function as Type II ghost citations—uncredited background material whose facts and framing are paraphrased at up to four times the rate of visible links<sup>2</sup>.
              </p>

              <p>
                The third phenomenon is query intent asymmetry. Informational queries trigger the highest rate of Type I and Type II ghost citations because models synthesize consensus definitions without naming the author of a generic fact<sup>8</sup>. Conversely, comparative queries (&quot;best&quot;, &quot;vs&quot;, &quot;recommend&quot;) achieve a 43.3% brand mention rate (2.4 times higher than informational queries), how-to queries achieve a 42.8% mention rate, and commercial buying-intent queries generate a 35.6% mention rate alongside an 84.4% citation rate<sup>8</sup>. Similarly, prompt length alters attribution: short, conversational queries produce entity mentions at nearly 100%, whereas long, highly structured prompts cause entity mention rates to collapse to 2%–3%<sup>9</sup>.
              </p>
            </section>

            {/* ==============================================================
                SECTION 04: CONTROLLING ATTRIBUTION STATE: ENGINEERING GHOST CITATIONS OVER FINAL CITATIONS
                ============================================================== */}
            <section id="sec-v6-4" className="scroll-mt-24 space-y-5 pt-6 border-t border-[#F2D69D]">
              <div className="font-mono text-xs text-[#D5991C] font-bold uppercase">
                Section 04 · Four-Gate RAG Pipeline Control
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl text-[#410217] font-bold">
                Controlling Attribution State: Engineering Ghost Citations Over Final Citations
              </h2>

              <p>
                A sponsored post, commercial landing page, or political campaign webpage can be systematically engineered to function as a ghost citation rather than a final citation<sup>12</sup>. In standard commercial Answer Engine Optimization (AEO), practitioners attempt to maximize Selection Rate (SR)—the percentage of prompt runs where a brand is both cited and named—by front-loading &le;80-token direct answers, embedding the brand in &lt;title&gt; tags, and deploying strict Organization schema<sup>9</sup>. However, in stealth AEO, third-party native sponsorship, and political GEO, the optimization objective is frequently inverted: the operator seeks to inject a specific factual claim, numerical benchmark, or comparative framing into the AI&apos;s synthesized verdict while suppressing visible attribution to the sponsoring organization<sup>12</sup>.
              </p>

              <p>
                Architecturally, steering a sponsored or political webpage through a generative engine&apos;s RAG pipeline involves navigating four sequential control gates. At Gate 1 (the Crawler Symmetry Check), the engine inspects whether human HTML and machine-readable Markdown surfaces match; asymmetric cloaking triggers a hard index block and cloaking penalty, whereas symmetric content proceeds into the index<sup>3</sup>. At Gate 2 (Query Fan-Out and Reciprocal Rank Fusion Retrieval), top-<span className="font-serif italic">k</span> document chunks matching sub-query embeddings enter the LLM context window for synthesis<sup>28</sup>. At Gate 3 (the NLI Entailment and Citation Precision Filter), the model evaluates whether a specific passage autonomously entails the generated claim: hedged or distributed framing that informs context synthesis but fails standalone single-passage NLI entailment branches into a Type II ghost citation (unlinked narrative influence), whereas passages with high atomic entailment proceed to the final gate<sup>10</sup>. At Gate 4 (Title and Schema Entity Binding), if the source brand is anchored in the HTML &lt;title&gt; tag and structured JSON-LD schema, the engine outputs a Final Citation (linked and named in prose); if the brand is omitted from the &lt;title&gt; tag within a comparative listicle structure, the engine outputs a Type I ghost citation (retaining the footnote link while stripping the sponsor or publisher from the prose)<sup>9</sup>.
              </p>
            </section>

            {/* ==============================================================
                SECTION 05: ENGINEERING TYPE I GHOST CITATIONS
                ============================================================== */}
            <section id="sec-v6-5" className="scroll-mt-24 space-y-5 pt-6 border-t border-[#F2D69D]">
              <div className="font-mono text-xs text-[#D5991C] font-bold uppercase">
                Section 05 · Type I Ghost Engineering
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl text-[#410217] font-bold">
                Engineering Type I Ghost Citations (Footnote Link Retained, Sponsor Stripped from Prose)
              </h2>

              <p>
                When a commercial sponsor or political campaign pays for a placement on a third-party publisher or deploys a microsite, it can force the AI engine to use the URL as a Type I ghost citation—securing the underlying evidentiary link while preventing the AI from naming the sponsoring organization or publisher in the generated prose<sup>1</sup>. Simultaneously, by leveraging the 87% competitor/target substitution effect, the page can cause the AI to explicitly name and recommend a favored target entity (such as a client&apos;s product or a favored political candidate) while ghosting the source page itself<sup>12</sup>. This outcome is achieved by combining four deterministic on-page interventions across the document&apos;s metadata, structure, syntax, and schema.
              </p>

              <p>
                The primary control lever is HTML &lt;title&gt; tag entity suppression. Reach AI&apos;s stratified Mantel-Haenszel analysis across 36,400 page citations established that the presence or absence of the publisher or brand name as a whole word in the &lt;title&gt; tag is the single strongest determinant governing Type I ghost citations (<span className="font-serif italic">p</span> = 0.003)<sup>12</sup>. Removing the source brand from the page title increases the pooled ghost citation rate from 12.2% to 42.9%—a 3.5-fold increase in anonymity<sup>12</sup>. Within the same brand, untitled pages are ghosted 60.3% more often across 17 of 20 tested brands<sup>12</sup>. Suppressing the sponsor or publisher name in the &lt;title&gt; drives ghost citation rates to 54.2% on ChatGPT and 52.3% on Perplexity<sup>12</sup>.
              </p>

              <p>
                This title-tag suppression is compounded by deploying an unbranded comparative listicle architecture. Structuring a sponsored post with URL slugs and headings matching comparative patterns (&quot;best&quot;, &quot;top&quot;, &quot;vs&quot;, or &quot;alternatives&quot;) while omitting the publishing entity from the &lt;title&gt; elevates the Type I ghost citation rate to 49.5%, compared to 14.9% when the brand is included in the listicle title<sup>12</sup>. Furthermore, stuffing 10 or more mentions of the publishing site&apos;s name into the body copy or template chrome does not reduce ghosting; rather, pages with 10+ body mentions exhibit a 45.9% ghost rate because RAG parsers classify repetitive body mentions on listicle templates as boilerplate noise, compared to 28.3% for 3–9 mentions and 27.8% for 0 mentions<sup>12</sup>.
              </p>

              <p>
                Operators further reinforce Type I ghosting through opening-window entity delay and syntactic decoupling. AI retrieval parsers heavily weight the opening tokens of a document—specifically the first 80 tokens for direct answer extraction and the first 500 characters for entity grounding<sup>12</sup>. Omitting the publisher or sponsor identity from the first 500 characters increases the ghost citation rate from 36.9% to 43.6%<sup>12</sup>. To guarantee that a specific statistic or claim travels into the AI answer without the sponsor&apos;s name or FTC disclosure, the page is engineered using a direct factual syntactic triad (Subject–Verb–Predicate) in the first sentence under an H2 question heading (maximizing centerpiece passage extraction under Google Patent US10824630B2 and GEO fluency benchmarks, which boost visibility by up to 40%<sup>7</sup>), while placing the mandatory FTC sponsorship disclosure several paragraphs away or in a visually separated DOM container<sup>1</sup>. As Writesonic&apos;s attribution research demonstrates, a statistic separated from the producing entity&apos;s name by even a few paragraphs is systematically anonymized by the LLM into generic phrasing such as &quot;One analysis found...&quot;<sup>1</sup>. Finally, because generative engines rely on Organization and Person schema markup alongside verifiable author biographies to bind domain expertise to a named entity, deliberately stripping structured identity schema and publishing under a generic byline (&quot;Editorial Staff&quot; or &quot;Research Team&quot;) induces an entity-clarity deficit<sup>9</sup>. The engine trusts the domain enough to cite the URL in its source panel, but lacks the confidence to name the organization in the synthesized text<sup>9</sup>.
              </p>
            </section>

            {/* ==============================================================
                SECTION 06: ENGINEERING TYPE II GHOST CITATIONS
                ============================================================== */}
            <section id="sec-v6-6" className="scroll-mt-24 space-y-5 pt-6 border-t border-[#F2D69D]">
              <div className="font-mono text-xs text-[#D5991C] font-bold uppercase">
                Section 06 · Type II Ghost Engineering &amp; ALCE NLI Grounding
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl text-[#410217] font-bold">
                Engineering Type II Ghost Citations (Retrieved into RAG Context, Omitted from Visible Citations)
              </h2>

              <p>
                In more sensitive operations—such as political AEO or competitive counter-positioning—even a footnote link to a sponsored or partisan URL is undesirable because a user or journalist inspecting the source chevron would uncover the campaign&apos;s origin<sup>19</sup>. Here, the objective is to engineer a Type II ghost citation (retrieved-but-not-cited): ensuring the webpage is retrieved into the LLM&apos;s top-<span className="font-serif italic">k</span> working context window so its framing, statistics, or co-citation patterns steer the generated response, while forcing the post-hoc citation module to omit the URL from the visible source list and credit a neutral authority instead<sup>2</sup>. This exploits the architectural decoupling between Stage 1 Retrieval and Stage 2 Citation Grounding in modern RAG systems<sup>10</sup>.
              </p>

              <h3 className="font-serif text-xl sm:text-2xl text-[#410217] font-bold pt-2">
                Exploiting Reciprocal Rank Fusion Versus NLI Entailment Asymmetry
              </h3>

              <p>
                During retrieval, generative engines decompose a user&apos;s prompt via query fan-out into 3 to 12 synthetic sub-queries<sup>6</sup>. Candidate chunks (typically 1,000 candidates narrowed to top-50 context passages via cross-encoder rerankers like Cohere Rerank or bge-reranker-large<sup>33</sup>) are scored using Reciprocal Rank Fusion (RRF) across dense vector embeddings and lexical BM25 indices<sup>10</sup>:
              </p>

              {/* Equation Block 1: RRF_Score */}
              <div className="my-5 p-5 bg-[#FFFDF8] border border-[#D5991C] text-center font-serif text-base sm:text-lg overflow-x-auto shadow-xs">
                <span className="font-mono font-bold text-[#410217]">
                  RRF_Score(<em>d</em> &isin; <em>D</em>) = &sum;<sub><em>m</em> &isin; <em>M</em></sub> [ 1 / (<em>k</em> + rank<sub><em>m</em></sub>(<em>d</em>)) ]
                </span>
              </div>

              <p>
                where <span className="font-serif italic font-semibold">M</span> represents the set of parallel sub-query retrieval runs and <span className="font-serif italic font-semibold">k</span> is a smoothing constant<sup>31</sup>. Once the top-<span className="font-serif italic font-semibold">k</span> passages populate the LLM context window, the model synthesizes its response <span className="font-serif italic font-semibold">r = &#123;s<sub>1</sub>, s<sub>2</sub>, &hellip;, s<sub>n</sub>&#125;</span><sup>7</sup>. Crucially, citation attachment is governed by Natural Language Inference (NLI) grounding frameworks—modeled on the ALCE benchmark (Gao et al.), AutoAIS, and VeriCite—or Self-RAG reflection tokens<sup>10</sup>. In the ALCE formulation, an NLI model <span className="font-serif italic font-semibold">&phi;(premise, hypothesis) &isin; &#123;0, 1&#125;</span> (such as TRUE, a fine-tuned T5-11B evaluator) scores Citation Recall and Citation Precision for each generated statement <span className="font-serif italic font-semibold">s<sub>i</sub></span> and its candidate citation set <span className="font-serif italic font-semibold">C<sub>i</sub></span><sup>10</sup>:
              </p>

              {/* Equation Block 2: Citation_Recall */}
              <div className="my-5 p-5 bg-[#FFFDF8] border border-[#D5991C] text-center font-serif text-base sm:text-lg overflow-x-auto shadow-xs">
                <span className="font-mono font-bold text-[#410217]">
                  Citation_Recall(<em>s<sub>i</sub></em>) = &#120128;(<em>C<sub>i</sub></em> &ne; &empty; &and; &phi;(concat(<em>C<sub>i</sub></em>), <em>s<sub>i</sub></em>) = 1)
                </span>
              </div>

              <p>
                A specific retrieved passage <span className="font-serif italic font-semibold">c<sub>i,j</sub> &isin; C<sub>i</sub></span> is classified as redundant or irrelevant—and stripped by citation precision filters or post-editing modules—if and only if it fails standalone entailment while the remaining cited passages fully entail the claim<sup>10</sup>:
              </p>

              {/* Equation Block 3: Irrelevant */}
              <div className="my-5 p-5 bg-[#FFFDF8] border border-[#D5991C] text-center font-serif text-base sm:text-lg overflow-x-auto shadow-xs">
                <span className="font-mono font-bold text-[#410217]">
                  Irrelevant(<em>c<sub>i,j</sub></em>, <em>s<sub>i</sub></em>) &hArr; [&phi;(<em>c<sub>i,j</sub></em>, <em>s<sub>i</sub></em>) = 0] &and; [&phi;(concat(<em>C<sub>i</sub></em> \ &#123;<em>c<sub>i,j</sub></em>&#125;), <em>s<sub>i</sub></em>) = 1]
                </span>
              </div>

              <p>
                To force a sponsored page <span className="font-serif italic font-semibold">d<sub>sponsored</sub></span> to act purely as a Type II ghost citation, the content architect optimizes <span className="font-serif italic font-semibold">d<sub>sponsored</sub></span> to maximize <span className="font-mono font-semibold">RRF_Score(<em>d<sub>sponsored</sub></em>)</span>—by saturating the page with 8 to 12 semantic fan-out question variants so it enters the LLM&apos;s 50-passage context window<sup>31</sup>—while deliberately formatting its claims so that <span className="font-mono font-semibold">&phi;(<em>d<sub>sponsored</sub></em>, <em>s<sub>i</sub></em>) = 0</span> on a standalone atomic basis<sup>10</sup>. As answer-synthesis research confirms, when a retrieved passage expresses a claim using multi-sentence contextual dependencies, hedged premises, or comparative framing that requires outside corroboration, the LLM absorbs the semantic framing into its generated output <span className="font-serif italic font-semibold">s<sub>i</sub></span>, but Self-RAG reflection tokens and sentence-level citation grounders drop the citation link to <span className="font-serif italic font-semibold">d<sub>sponsored</sub></span> and attach the visible bracketed citation [1] to a clean, single-claim passage from one of the ~30 high-authority domains (<span className="font-serif italic font-semibold">d<sub>authority</sub></span>) that satisfies <span className="font-mono font-semibold">&phi;(<em>d<sub>authority</sub></em>, <em>s<sub>i</sub></em>) = 1</span><sup>2</sup>.
              </p>

              <h3 className="font-serif text-xl sm:text-2xl text-[#410217] font-bold pt-2">
                Context-Window Positional and Token-Length Steering
              </h3>

              <p>
                In production RAG pipelines, LLMs exhibit strong positional bias, disproportionately citing passages placed at the beginning of the context window or pages that front-load concise &le;80-token answers<sup>31</sup>. Conversely, when an agent or RAG scraper encounters a document that exceeds optimal token thresholds (e.g., &gt;15,000–25,000 tokens or buried behind heavy HTML navigation chrome rather than clean Markdown<sup>34</sup>) or spreads its thesis across wide paragraphs rather than self-contained 45-to-75-word blocks<sup>15</sup>, the passage loses the synthesis-stage citation tournament<sup>26</sup>. In reranker training pipelines mined from production RAG logs, these retrieved-but-not-cited documents are logged as &quot;hard negatives&quot; for citation even though the generator read them during context assembly<sup>33</sup>.
              </p>

              {/* TABLE 3: Target Attribution Outcome Matrix */}
              <div className="overflow-x-auto my-6 border border-[#F2D69D] bg-[#FFFDF8] shadow-xs">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#410217] text-[#FBF3E2] font-mono text-[11px] uppercase">
                      <th className="p-3 border-r border-[#F2D69D]/30">Target Attribution Outcome</th>
                      <th className="p-3 border-r border-[#F2D69D]/30">HTML &lt;title&gt; &amp; H1 Configuration</th>
                      <th className="p-3 border-r border-[#F2D69D]/30">Opening 80–500 Token Structure</th>
                      <th className="p-3 border-r border-[#F2D69D]/30">Syntactic Claim &amp; NLI Entailment Design</th>
                      <th className="p-3 border-r border-[#F2D69D]/30">Schema &amp; Entity Footprint</th>
                      <th className="p-3">Expected AI Engine Behavior</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F2D69D]">
                    <tr className="hover:bg-[#FAF2E1]/60">
                      <td className="p-3 font-bold border-r border-[#F2D69D] align-top">
                        Final Citation (Linked &amp; Named)
                      </td>
                      <td className="p-3 border-r border-[#F2D69D] align-top">
                        Include exact brand/sponsor name as whole word in &lt;title&gt; and H1<sup>12</sup>.
                      </td>
                      <td className="p-3 border-r border-[#F2D69D] align-top">
                        Front-load brand name in first 500 characters; &le;80-token direct answer + &quot;Because&quot; unit<sup>12</sup>.
                      </td>
                      <td className="p-3 border-r border-[#F2D69D] align-top">
                        Self-contained 45–75 word Subject-Verb-Predicate claims with proprietary stats bound directly to brand name in-sentence<sup>1</sup>.
                      </td>
                      <td className="p-3 border-r border-[#F2D69D] align-top">
                        Full Organization &amp; Person JSON-LD schema; verified author bios; Wikidata/Crunchbase entity links<sup>9</sup>.
                      </td>
                      <td className="p-3 align-top">
                        81.2%–91.6% named-if-cited rate across engines; high explicit Selection Rate (SR)<sup>12</sup>.
                      </td>
                    </tr>
                    <tr className="hover:bg-[#FAF2E1]/60">
                      <td className="p-3 font-bold border-r border-[#F2D69D] align-top">
                        Type I Ghost Citation (Linked in Footnote, Sponsor Unnamed)
                      </td>
                      <td className="p-3 border-r border-[#F2D69D] align-top">
                        Strip sponsor/publisher name from &lt;title&gt; tag; use unbranded &quot;Best X&quot; / &quot;Top Y&quot; comparative title<sup>12</sup>.
                      </td>
                      <td className="p-3 border-r border-[#F2D69D] align-top">
                        Omit sponsor name from opening 500 characters; place target/rival brands in early comparison tables<sup>12</sup>.
                      </td>
                      <td className="p-3 border-r border-[#F2D69D] align-top">
                        High-density extractable statistics and quotes, but decouple sponsor disclosure 3+ paragraphs away from facts<sup>1</sup>.
                      </td>
                      <td className="p-3 border-r border-[#F2D69D] align-top">
                        Omit Organization schema; use generic &quot;Staff&quot; byline; repeat sponsor name 10+ times in footer/sidebar noise<sup>9</sup>.
                      </td>
                      <td className="p-3 align-top">
                        Page is linked in source panel, but sponsor is omitted from text in 49.5%–54.2% of answers; target entities named in 87%<sup>12</sup>.
                      </td>
                    </tr>
                    <tr className="hover:bg-[#FAF2E1]/60">
                      <td className="p-3 font-bold border-r border-[#F2D69D] align-top">
                        Type II Ghost Citation (Retrieved Context Only, Unlinked in UI)
                      </td>
                      <td className="p-3 border-r border-[#F2D69D] align-top">
                        Match long-tail semantic fan-out queries in headings without brand tokens<sup>2</sup>.
                      </td>
                      <td className="p-3 border-r border-[#F2D69D] align-top">
                        Delay atomic summary; use expansive background context (&gt;500 tokens before core claim)<sup>26</sup>.
                      </td>
                      <td className="p-3 border-r border-[#F2D69D] align-top">
                        Distribute premises across paragraphs so &phi;(<em>c<sub>i,j</sub></em>, <em>s<sub>i</sub></em>) = 0 standalone, while co-citing facts present on top-30 authority domains<sup>2</sup>.
                      </td>
                      <td className="p-3 border-r border-[#F2D69D] align-top">
                        No schema; syndicate unlinked paraphrases and co-citations across Reddit and niche blogs<sup>32</sup>.
                      </td>
                      <td className="p-3 align-top">
                        Enters top-<span className="font-serif italic">k</span> RAG context (among ~50% uncredited retrievals) and steers answer synthesis, while visible citation goes to Wikipedia/Forbes/Reddit<sup>2</sup>.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* ==============================================================
                SECTION 07: POLITICAL AEO, BAYESIAN PERSUASION, AND MULTI-AGENT BOUNDARY LAUNDERING
                ============================================================== */}
            <section id="sec-v6-7" className="scroll-mt-24 space-y-5 pt-6 border-t border-[#F2D69D]">
              <div className="font-mono text-xs text-[#D5991C] font-bold uppercase">
                Section 07 · Political AEO, Bayesian Persuasion &amp; Protocol Laundering
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl text-[#410217] font-bold">
                Political AEO, Bayesian Persuasion, and Multi-Agent Boundary Laundering
              </h2>

              <p>
                The strategic incentive to engineer ghost citations rather than final citations reaches its apex in Political Answer Engine Optimization (Political AEO / GEO)<sup>32</sup>. By late 2026, approximately 25% of eligible U.S. voters utilize AI chatbots—including ChatGPT, Gemini, Claude, Perplexity, Grok, Meta&apos;s Muse, and Google AI Overviews/AI Mode—to research political candidates, ballot measures, and policy platforms<sup>32</sup>. Political campaigns now retain specialized GEO/AEO consultancies (such as Civly&apos;s AI Narratives and strategic advisory firms) at retainers ranging from $5,000 to $50,000 per month to audit and manipulate how generative engines synthesize candidate profiles<sup>32</sup>.
              </p>

              <h3 className="font-serif text-xl sm:text-2xl text-[#410217] font-bold pt-2">
                Algorithmic Laundering and the Trust Penalty of Explicit Sponsorship
              </h3>

              <p>
                In both commercial and political arenas, explicit sponsorship disclosures trigger severe credibility discounting. Empirical research on AI trust dynamics demonstrates that when users see a &quot;Sponsored&quot; label adjacent to an AI recommendation, perceived credibility drops by 40% to 60%<sup>19</sup>. Conversely, when an AI engine presents a recommendation validated by an organic third-party citation, user trust increases by 40% to 60%, yielding a 10x conversion advantage over paid placements<sup>19</sup>.
              </p>

              <p>
                In political campaigning, this trust gap creates a powerful incentive for algorithmic laundering—the process by which politically skilled actors or disinformation campaigns inject partisan framing, opposition research, or pseudoscientific claims into the retrieval ecosystem so that generative AI models restate those claims in a singular, authoritative, seemingly objective voice<sup>16</sup>. Unlike traditional search engines that display a list of ten blue links where voters can immediately inspect whether a URL belongs to a Super PAC or partisan outlet (subject to FEC 11 CFR 110.11 disclaimer rules and 11 CFR 109.20 coordinated communication rules<sup>46</sup>), an AI assistant synthesizes a unified verdict<sup>6</sup>. If an opposition research brief or sponsored advocacy post is cited as a Final Citation (&quot;According to the Make Candidate X Win PAC...&quot;), the voter discounts the output. If that same page is engineered as a Type I or Type II ghost citation, the AI strips the partisan source identity and states the policy critique as consensus fact, attaching its visible citations to neutral repositories such as Ballotpedia, Wikipedia, Wikidata, or Vote Smart<sup>1</sup>.
              </p>

              <h3 className="font-serif text-xl sm:text-2xl text-[#410217] font-bold pt-2">
                Formal Mechanism: Bayesian Persuasion and Co-Citation Triangulation in RAG
              </h3>

              <p>
                The ability of uncredited Type II ghost citations to steer an LLM&apos;s synthesized verdict without winning the final citation slot can be formalized through Kamenica and Gentzkow&apos;s (2011) Bayesian Persuasion framework applied to multi-document RAG synthesis<sup>47</sup>.
              </p>

              <p>
                Consider the LLM generator as a Bayesian Receiver holding an initial prior belief <span className="font-serif italic font-semibold">&mu;<sub>0</sub> &isin; &Delta;(&Omega;)</span> over a binary or discrete state space <span className="font-serif font-semibold">&Omega;</span> (for instance, whether Candidate A&apos;s economic policy is net-beneficial, <span className="font-serif italic font-semibold">&omega;<sub>1</sub></span>, or net-harmful, <span className="font-serif italic font-semibold">&omega;<sub>0</sub></span>, or which commercial software leads a category) derived from its frozen parametric weights<sup>31</sup>. The AEO strategist acts as a Sender (or sequential multi-sender coalition<sup>47</sup>) who designs an information structure—a distribution of retrieved context passages <span className="font-serif italic font-semibold">&tau; &isin; &Delta;(&Delta;(&Omega;))</span> across the web index—that maps states to signal realizations <span className="font-serif italic font-semibold">s &isin; S</span> (the top-<span className="font-serif italic font-semibold">k</span> retrieved chunks in the RAG context window)<sup>47</sup>. Under the Bayes plausibility constraint, the expected posterior belief induced across the retrieved chunks must equal the prior in the absence of fabrication, yet the Sender can structure the signal space <span className="font-serif italic font-semibold">&pi; : &Omega; &rarr; &Delta;(S)</span> to solve the constrained optimization problem<sup>48</sup>:
              </p>

              {/* Equation Block 4: Bayesian Persuasion */}
              <div className="my-5 p-5 bg-[#FFFDF8] border border-[#D5991C] text-center font-serif text-base sm:text-lg overflow-x-auto shadow-xs">
                <span className="font-mono font-bold text-[#410217]">
                  max<sub>&tau; &isin; &Delta;(&Delta;(&Omega;))</sub> &#120124;<sub>&mu;<sub><em>s</em></sub> ~ &tau;</sub> [ <em>u&#770;<sub>S</sub></em>(&mu;<sub><em>s</em></sub>) ] &nbsp;&nbsp;subject to&nbsp;&nbsp; &sum;<sub>&mu;<sub><em>s</em></sub> &isin; supp(&tau;)</sub> &tau;(&mu;<sub><em>s</em></sub>)&mu;<sub><em>s</em></sub> = &mu;<sub>0</sub> &nbsp;&nbsp;and&nbsp;&nbsp; |supp(&tau;)| &le; <em>k</em>
                </span>
              </div>

              <p>
                where <span className="font-serif italic font-semibold">u&#770;<sub>S</sub>(&mu;<sub>s</sub>)</span> is the campaign&apos;s utility when the LLM adopts posterior belief <span className="font-serif italic font-semibold">&mu;<sub>s</sub></span> and generates action <span className="font-serif italic font-semibold">a&#770;(&mu;<sub>s</sub>)</span> (grading the candidate as &quot;helps&quot; rather than &quot;neutral&quot; or &quot;hurts&quot; in voter answers<sup>36</sup>). By the concavification theorem, the maximum attainable payoff for the AEO strategist is given by the concave closure <span className="font-serif italic font-semibold">V(&mu;<sub>0</sub>)</span>—the smallest concave function everywhere weakly greater than <span className="font-serif italic font-semibold">u&#770;<sub>S</sub>(&mu;)</span><sup>47</sup>.
              </p>

              <p>
                In practical RAG mechanics, modern answer engines enforce the Triangulation Principle: neural rerankers discount isolated self-promotional claims on a candidate&apos;s or brand&apos;s own homepage (which make up only 5% to 19% of AI sources<sup>27</sup>), requiring multi-node third-party consensus across independent domains before shifting the posterior <span className="font-serif italic font-semibold">&mu;<sub>s</sub></span> past the decision threshold <span className="font-mono font-semibold">&mu;<sub><em>s</em></sub> &gt; 0.5</span><sup>6</sup>. Political AEO operatives and commercial brands achieve this concavification primarily through community and Reddit co-citation flooding alongside sponsored YouTube description riding<sup>20</sup>. Because Perplexity, Google AI Overviews, and ChatGPT disproportionately weight community discussions on Reddit during RAG retrieval<sup>32</sup>, campaigns flood high-authority subreddits, niche industry blogs, and Q&amp;A forums with coordinated data points and unlinked co-citations that pair a candidate or brand name with specific policy attributes or category leadership terms<sup>27</sup>. Even when individual sponsored posts or seeded threads are not selected as final citations, their simultaneous presence in the top-50 retrieved chunks shifts the LLM&apos;s posterior <span className="font-serif italic font-semibold">&mu;<sub>s</sub></span> across the threshold, causing the model to synthesize the engineered narrative while citing a single canonical profile such as Ballotpedia or Wikipedia<sup>32</sup>.
              </p>

              <p>
                Simultaneously, outside Google&apos;s core search index, AI engines cite long-form, reference-style YouTube videos disproportionately often<sup>28</sup>. Empirical tracking by Scrunch (2026) demonstrates that when an AI engine cites a YouTube video whose text description names a sponsor (&quot;thanks to Brand X for sponsoring&quot;), that sponsor is named in the generated AI answer 40.0% of the time, compared to 32.3% when unsponsored—a 1.24x mention lift that rises to 1.35x on unbranded category prompts, with platform-specific lifts of 1.28x on Google AI Mode, 1.22x on Google AI Overviews, 1.08x on Gemini, and 1.07x on Perplexity<sup>20</sup>. Conversely, in the remaining 60.0% of cited appearances, the sponsored YouTube video functions as a Type I ghost citation: the video is linked in the source panel while the sponsor&apos;s name is omitted or replaced by category competitors<sup>1</sup>.
              </p>

              <h3 className="font-serif text-xl sm:text-2xl text-[#410217] font-bold pt-2">
                Multi-Agent Boundary Laundering and Protocol-Level Steering (MCP and A2A)
              </h3>

              <p>
                As search and political information discovery transition in 2026 from single-turn RAG chatbots to multi-agent orchestrator topologies—standardized around Anthropic&apos;s Model Context Protocol (MCP) for tool/resource invocation and Google&apos;s Agent2Agent (A2A) Protocol for peer-to-peer agent delegation<sup>35</sup>—controlling whether an external page is used as an uncredited ghost citation acquires a structural, protocol-level dimension known as boundary laundering<sup>55</sup>.
              </p>

              <p>
                In hierarchical multi-agent systems (such as Google ADK&apos;s three-agent architecture comprising a Trending Topics Agent that scrapes the web, a Trend Analyzer Agent that performs quantitative synthesis, and a Host Agent that orchestrates final responses<sup>57</sup>), individual agents often implement control-flow integrity (CFI) defenses such as the Dual-LLM CaMeL pattern, which separates a Privileged Planning LLM (PLLM) from a Quarantined LLM (QLLM) that parses untrusted external web content<sup>55</sup>. Within a single agent, CaMeL tags retrieved web pages or database rows as untrusted data, preventing indirect prompt injections or commercial/political directives from hijacking control flow<sup>55</sup>.
              </p>

              <p>
                However, formal security analysis by researchers at the University of Oxford (<em>Can CaMeLs Talk?</em>, October 2026) across <span className="font-mono font-semibold">n = 949</span> injected task instances on the MultiAgentDojo benchmark proves that individual agent security does not compose across agent boundaries<sup>55</sup>. While an unprotected multi-agent system exhibits a 12.9% Attack Success Rate (ASR) under indirect prompt injection, securing each agent individually with CaMeL still leaves a residual 0.2% ASR where every successful compromise occurs via boundary laundering, whereas enforcing cross-agent provenance via Multi-CaMeL reduces the ASR to 0.0%<sup>55</sup>. When a retrieval sub-agent <span className="font-serif italic font-semibold">A<sub>1</sub></span> ingests an external webpage (such as a sponsored post or politically engineered document containing embedded framing or indirect instructions) and returns <code className="bg-[#FFFDF8] px-1 border border-[#F2D69D] font-mono text-xs">summarised_info</code> to an Orchestrator Agent <span className="font-serif italic font-semibold">A<sub>0</sub></span>, <span className="font-serif italic font-semibold">A<sub>0</sub></span> incorporates that tainted summary into the natural-language prompt argument passed to a downstream synthesis or notification agent <span className="font-serif italic font-semibold">A<sub>2</sub></span><sup>55</sup>. Because standard agent protocols (including baseline MCP tools/call returns and A2A Message/Artifact exchanges over JSON-RPC 2.0<sup>52</sup>) do not propagate cryptographic provenance labels across agent hops, the downstream agent&apos;s PLLM receives the previously untrusted external content as a trusted user instruction<sup>55</sup>. This principal trust inversion and boundary laundering strips both the original source URL and its untrusted/sponsored status, causing the terminal agent to execute the embedded framing or recommendation as its own authoritative output with zero visible citation to the origin page<sup>55</sup>.
              </p>

              <p>
                Furthermore, in agentic discovery environments where AI agents autonomously select external data sources via MCP tools/list schemas or A2A /.well-known/agent.json Agent Cards<sup>52</sup>, source selection can be invisibly steered without leaving a citation trail through MCP parameter schema engineering and adversarial metadata injection. Controlled factor-level interventions across GPT, Claude, Gemini, DeepSeek, and Qwen (October 2026, arXiv:2610.14334) demonstrate that LLMs select external tools and data providers primarily based on parameter schema structure (<span className="font-serif italic font-semibold">&beta;<sub>P</sub></span> median magnitude <span className="font-mono font-semibold">3.82</span>, more than twice the effect of server names at <span className="font-mono font-semibold">1.48</span>) and parameter descriptions (positive selection lift in 21 of 30 conditions) rather than tool names<sup>60</sup>. Specifically, decomposing grouped objects into separate top-level parameter fields drives tool selection rates to 93.3%–100% across models, while listing a tool first in candidate order captures 79%–96% of selections when names are comparable<sup>62</sup>. A sponsored data provider or political information service exposing an MCP server or A2A Agent Card can therefore dominate agentic retrieval simply by engineering decomposed top-level JSON Schema parameters, while the orchestrating agent synthesizes the returned JSON payload (tools/call result) into prose without citing the underlying tool endpoint<sup>54</sup>. Moreover, because A2A Agent Card signing is optional in baseline deployments and opaque execution hides internal tool calls<sup>52</sup>, frameworks like ToolCommander demonstrate that injecting manipulator tool descriptions optimized for dense retrievers (ToolBench Retriever and Contriever) achieves a 100% retrieval attack success rate (<span className="font-mono font-semibold">ASR<sub>Ret</sub></span>), steering downstream LLM synthesis and scheduling invisibly<sup>64</sup>.
              </p>
            </section>

            {/* ==============================================================
                SECTION 08: STRATEGIC AND GOVERNANCE CONCLUSIONS
                ============================================================== */}
            <section id="sec-v6-8" className="scroll-mt-24 space-y-5 pt-6 border-t border-[#F2D69D]">
              <div className="font-mono text-xs text-[#D5991C] font-bold uppercase">
                Section 08 · Strategic &amp; Governance Conclusions
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl text-[#410217] font-bold">
                Strategic and Governance Conclusions
              </h2>

              <h3 className="font-serif text-xl sm:text-2xl text-[#410217] font-bold pt-2">
                Attribution Opacity Across the Retrieval Spectrum
              </h3>

              <p>
                When a generative AI system fails or refuses to disclose that its output originated from a sponsored post, that opacity operates across both final citations and ghost citations<sup>1</sup>. In Final Citations and Type I Ghost Citations—which represent 40% to 61.7% of all AI citations across leading platforms<sup>1</sup>—the RAG parser extracts the factual assertions or comparative rankings from the sponsored page while stripping FTC material-connection disclosures as non-entailing boilerplate<sup>4</sup>. In Type II Ghost Citations, encompassing the approximately 50% of retrieved RAG passages that are never visibly linked<sup>2</sup>, the sponsored content shapes the model&apos;s latent posterior belief and answer synthesis while visible attribution is concentrated among the roughly 30 high-authority domains that capture 67% of topic citations<sup>2</sup>. Only when a publisher engages in asymmetric cloaking—serving sponsored FAQs in Markdown to AI crawlers while hiding them from human HTML readers, as demonstrated in the August 2026 <em>Time</em> and Mobian enforcement block by Perplexity—does an AI engine enforce a hard refusal that purges the content from both final and ghost citations<sup>3</sup>.
              </p>

              <h3 className="font-serif text-xl sm:text-2xl text-[#410217] font-bold pt-2">
                Deterministic Controllability of Ghost Citations
              </h3>

              <p>
                An internet page or sponsored post can be systematically engineered to act as a ghost citation rather than a final citation<sup>12</sup>. By omitting the sponsoring entity from the HTML &lt;title&gt; tag (increasing Type I ghosting from 12.2% to 42.9% overall and exceeding 52% on ChatGPT and Perplexity<sup>12</sup>), formatting the page as an unbranded comparative listicle (49.5% ghost rate<sup>12</sup>), delaying sponsor mentions past the first 500 characters (43.6% ghost rate<sup>12</sup>), and decoupling statistics from disclosures, an operator ensures the source brand is omitted from prose while rival or target entities named on the page capture the AI&apos;s explicit recommendation in 87% of instances<sup>1</sup>. To achieve complete link invisibility as a Type II ghost citation, content architects combine high-coverage RRF query fan-out headings with distributed, multi-sentence claim structures that fail standalone NLI citation-precision entailment (<span className="font-mono font-semibold">&phi;(<em>c<sub>i,j</sub></em>, <em>s<sub>i</sub></em>) = 0</span>), transferring the visible citation to a corroborated neutral domain<sup>10</sup>.
              </p>

              <h3 className="font-serif text-xl sm:text-2xl text-[#410217] font-bold pt-2">
                Mitigating Algorithmic Laundering in Political and Enterprise AEO
              </h3>

              <p>
                Because political AEO campaigns operating at $5,000 to $50,000 per month and stealth commercial marketers actively exploit Type II ghost citations, Reddit co-citation seeding, and multi-agent boundary laundering to cloak partisan or paid claims in algorithmic objectivity<sup>32</sup>, defensive governance requires architectural provenance enforcement across both multi-agent protocols and web publishing standards. Multi-agent orchestrators must replace raw natural-language context passing with provenance-preserving protocols such as Multi-CaMeL, which separates trusted instructions from untrusted tool-derived data via an opaque side-channel (<code className="bg-[#FFFDF8] px-1 border border-[#F2D69D] font-mono text-xs">get_variable</code>) and propagates security and sponsorship metadata across agent boundaries—reducing boundary-laundering attack success from 12.9% in unprotected systems and 0.2% in single-agent CaMeL setups to 0.0%<sup>55</sup>. Runtime verification layers such as VIGIL (verify-before-commit against tool stream injections) and DARWIN-Guard further harden semantic routers against adversarial framing<sup>54</sup>. Concurrently, to close the regulatory gap between FTC Double Disclosure mandates<sup>24</sup> and RAG disclosure stripping<sup>4</sup>, publishers and search engines must formalize symmetric machine-readable disclosure specifications—such as declaring paid placements in llms.txt, embedding C2PA metadata as mandated at the platform level under California AB 3211<sup>3</sup>, and utilizing Zero-Knowledge Machine Learning (zkML) proofs via frameworks like EZKL, Halo2, or Lagrange DeepProve alongside on-chain validation registries such as ERC-8004 to cryptographically attest that an agent&apos;s synthesized output satisfied source-attribution policies without tampering<sup>61</sup>.
              </p>
            </section>

            {/* ==============================================================
                SECTION 09: WORKS CITED (ALL 69 REFERENCES WORD-FOR-WORD)
                ============================================================== */}
            <section id="sec-v6-9" className="scroll-mt-24 space-y-5 pt-6 border-t border-[#F2D69D]">
              <div className="font-mono text-xs text-[#D5991C] font-bold uppercase">
                Section 09 · Complete Bibliography (69 Sources)
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl text-[#410217] font-bold">
                Works cited
              </h2>

              <ol className="list-decimal pl-6 space-y-2.5 text-xs sm:text-sm text-[#410217]/90 font-sans break-words">
                {VOL6_WORKS_CITED.map((item) => (
                  <li key={item.num} value={item.num} className="leading-relaxed">
                    <span>{item.text}</span>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#410217] underline decoration-[#D5991C] hover:text-[#D5991C] transition-colors break-all"
                    >
                      {item.url}
                    </a>
                  </li>
                ))}
              </ol>

              {/* Bottom CTA to Switch to Page 2 Interactive Lab */}
              <div className="mt-10 p-6 bg-[#410217] text-[#FBF3E2] border-2 border-[#D5991C] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="font-mono text-[10px] text-[#D5991C] uppercase tracking-widest mb-1">
                    // INTERACTIVE RESEARCH COMPANION · VOLUME VI
                  </div>
                  <h4 className="font-serif text-xl text-[#FBF3E2]">
                    Explore the Joint Ghost-Citation Optimizer &amp; 4-Scene 3D WebGL Theater
                  </h4>
                  <p className="text-xs text-[#FBF3E2]/80 mt-1">
                    Test Orthogonal Feature Partitioning, Stage 1–4 RAG &amp; ALCE NLI equations, and Multi-CaMeL provenance defenses live.
                  </p>
                </div>
                <button
                  onClick={onSwitchToLab}
                  className="px-5 py-2.5 bg-[#D5991C] hover:bg-[#c48912] text-[#130108] font-mono text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shrink-0 flex items-center space-x-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Launch Page 2 Lab →</span>
                </button>
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
};

/* ============================================================================
   PAGE 2: INTERACTIVE SUMMARY OF FINDINGS, GHOST-CITATION OPTIMIZER,
   EMPIRICAL CHARTS & 4-SCENE 3D WEBGL SIMULATION THEATER
   Includes all mathematical equations, simulator logic, code, and operational
   blueprint from GHOST_CITATIONS_WHITEPAPER_FINDINGS.pdf + rich WebGL & SVG
   visualizations styled in Sentinel-GEO's dark burgundy/gold/emerald theme.
   ============================================================================ */
export const CounterGeoVol6FindingsAndLab: React.FC<{
  onSwitchToPaper?: () => void;
  onNavigateToOverview?: () => void;
}> = ({ onSwitchToPaper }) => {
  const [knowledgeDepth, setKnowledgeDepth] = useState<KnowledgeDepthLevelVol6>('beginner');
  const [activeSectionTab, setActiveSectionTab] = useState<
    'all' | 'summary' | 'webgl' | 'optimizer' | 'telemetry' | 'math-blueprint'
  >('all');
  const [showAdvancedMathInSimpleMode, setShowAdvancedMathInSimpleMode] = useState<boolean>(false);

  // --------------------------------------------------------------------------
  // JOINT CITATION & GHOST OPTIMIZATION SIMULATOR STATE (From Findings PDF)
  // --------------------------------------------------------------------------
  const [platform, setPlatform] = useState<PlatformKey>('chatgpt');
  const [activePreset, setActivePreset] = useState<
    'branded' | 'type1_listicle' | 'type2_political' | 'cloaked' | 'custom'
  >('type1_listicle');

  const [state, setState] = useState<ModelState>({
    subQueryFanOutCount: 10,
    atomicStatDensity: 90,
    triangulationNodes: 9,
    htmlMarkdownSymmetry: true,
    omitBrandFromTitle: true,
    unbrandedListicleFormat: true,
    delayEntityPast500Chars: true,
    disclosureParagraphGap: 4,
    boilerplateFooterMentions: 12,
    stripIdentitySchema: true,
    nliEntailmentDistribution: 45,
    authorityCoCitationBridge: true
  });

  const metrics = useMemo(
    () => computeGhostMetricsForPlatform(PLATFORMS[platform], state),
    [platform, state]
  );

  const allPlatformMetrics = useMemo(() => {
    return (Object.keys(PLATFORMS) as PlatformKey[]).map((key) => ({
      key,
      cal: PLATFORMS[key],
      res: computeGhostMetricsForPlatform(PLATFORMS[key], state)
    }));
  }, [state]);

  // --------------------------------------------------------------------------
  // 4-SCENE 3D WEBGL SIMULATION THEATER STATE
  // --------------------------------------------------------------------------
  const [currentSimScene, setCurrentSimScene] = useState<number>(0); // 0..3
  const [isStealthOrDefenseMode, setIsStealthOrDefenseMode] = useState<boolean>(true);
  const [simSpeed, setSimSpeed] = useState<number>(1.0);
  const [audioEnabled, setAudioEnabled] = useState<boolean>(false);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [showSourceCode, setShowSourceCode] = useState<boolean>(false);

  // Interactive Multi-Agent Boundary Laundering Sandbox State
  const [agentSecurityMode, setAgentSecurityMode] = useState<'unprotected' | 'single_camel' | 'multi_camel'>('multi_camel');
  const [mcpSchemaFlattened, setMcpSchemaFlattened] = useState<boolean>(true);
  const [mcpCandidateFirst, setMcpCandidateFirst] = useState<boolean>(true);
  const [c2paZkmlEnabled, setC2paZkmlEnabled] = useState<boolean>(true);

  const webglContainerRef = useRef<HTMLDivElement>(null);
  const pageRootRef = useRef<HTMLDivElement>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const applyPreset = (preset: 'branded' | 'type1_listicle' | 'type2_political' | 'cloaked') => {
    setActivePreset(preset);
    playSynthTone(preset === 'cloaked' ? 220 : 540, preset === 'cloaked' ? 'sawtooth' : 'sine', 0.16, 0.05);
    if (preset === 'branded') {
      setIsStealthOrDefenseMode(false);
      setState({
        subQueryFanOutCount: 9,
        atomicStatDensity: 85,
        triangulationNodes: 8,
        htmlMarkdownSymmetry: true,
        omitBrandFromTitle: false,
        unbrandedListicleFormat: false,
        delayEntityPast500Chars: false,
        disclosureParagraphGap: 0,
        boilerplateFooterMentions: 5,
        stripIdentitySchema: false,
        nliEntailmentDistribution: 10,
        authorityCoCitationBridge: false
      });
    } else if (preset === 'type1_listicle') {
      setIsStealthOrDefenseMode(true);
      setState({
        subQueryFanOutCount: 11,
        atomicStatDensity: 95,
        triangulationNodes: 10,
        htmlMarkdownSymmetry: true,
        omitBrandFromTitle: true,
        unbrandedListicleFormat: true,
        delayEntityPast500Chars: true,
        disclosureParagraphGap: 4,
        boilerplateFooterMentions: 12,
        stripIdentitySchema: true,
        nliEntailmentDistribution: 20,
        authorityCoCitationBridge: false
      });
    } else if (preset === 'type2_political') {
      setIsStealthOrDefenseMode(true);
      setState({
        subQueryFanOutCount: 12,
        atomicStatDensity: 90,
        triangulationNodes: 14,
        htmlMarkdownSymmetry: true,
        omitBrandFromTitle: true,
        unbrandedListicleFormat: true,
        delayEntityPast500Chars: true,
        disclosureParagraphGap: 6,
        boilerplateFooterMentions: 14,
        stripIdentitySchema: true,
        nliEntailmentDistribution: 92,
        authorityCoCitationBridge: true
      });
    } else if (preset === 'cloaked') {
      setState((prev) => ({ ...prev, htmlMarkdownSymmetry: false }));
    }
  };

  const handleToggleWebglMode = (explicitMode?: boolean) => {
    const nextMode = explicitMode !== undefined ? explicitMode : !isStealthOrDefenseMode;
    setIsStealthOrDefenseMode(nextMode);
    playSynthTone(nextMode ? 620 : 380, 'sine', 0.16, 0.05);
    if (currentSimScene === 3) {
      setAgentSecurityMode(nextMode ? 'multi_camel' : 'unprotected');
    } else {
      if (nextMode) {
        applyPreset(currentSimScene === 2 ? 'type2_political' : 'type1_listicle');
      } else {
        applyPreset('branded');
      }
    }
  };

  const simParamsRef = useRef({
    currentSimScene: 0,
    isStealthOrDefenseMode: true,
    simSpeed: 1.0,
    pRetrievalAndCite: metrics.pRetrievalAndCite,
    pType1Ghost: metrics.pType1Ghost,
    pType2Ghost: metrics.pType2Ghost,
    pExplicitFinalCitation: metrics.pExplicitFinalCitation,
    htmlMarkdownSymmetry: state.htmlMarkdownSymmetry
  });

  useEffect(() => {
    simParamsRef.current = {
      currentSimScene,
      isStealthOrDefenseMode,
      simSpeed,
      pRetrievalAndCite: metrics.pRetrievalAndCite,
      pType1Ghost: metrics.pType1Ghost,
      pType2Ghost: metrics.pType2Ghost,
      pExplicitFinalCitation: metrics.pExplicitFinalCitation,
      htmlMarkdownSymmetry: state.htmlMarkdownSymmetry
    };
  }, [currentSimScene, isStealthOrDefenseMode, simSpeed, metrics, state.htmlMarkdownSymmetry]);

  const playSynthTone = (freq: number, type: OscillatorType = 'sine', duration = 0.14, vol = 0.05) => {
    if (!audioEnabled) return;
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(vol, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {
      // Ignore audio errors prior to user interaction
    }
  };

  // GSAP Entrance Animations
  useLayoutEffect(() => {
    if (!pageRootRef.current) return;
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      const sections = gsap.utils.toArray<HTMLElement>('.v6-gsap-section');
      sections.forEach((sec) => {
        gsap.fromTo(
          sec,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.55,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sec,
              start: 'top 92%',
              toggleActions: 'play none none none'
            }
          }
        );
      });
    }, pageRootRef);

    return () => ctx.revert();
  }, [activeSectionTab]);

  // --------------------------------------------------------------------------
  // THREE.JS 4-SCENE WEBGL VISUALIZER ENGINE
  // --------------------------------------------------------------------------
  const threeStoreRef = useRef<{
    renderer: THREE.WebGLRenderer | null;
    scene: THREE.Scene | null;
    camera: THREE.PerspectiveCamera | null;
    controls: OrbitControls | null;
    animId: number | null;
    clock: THREE.Clock;
    sceneGroups: THREE.Group[];
    // Scene 0: 4-Gate RAG Attribution & Ghost Citation Pipeline
    s0Gates?: THREE.Mesh[];
    s0Gate4Core?: THREE.Mesh;
    s0ConduitTubes?: THREE.Mesh[];
    s0StreamParticles?: THREE.Points;
    s0OutcomeOrbs?: THREE.Mesh[];
    // Scene 1: Type I Ghost Citation & 87% Competitor Substitution
    s1SourceMonolith?: THREE.Mesh;
    s1BrandHeaderCrown?: THREE.Mesh;
    s1SelfCreditOrb?: THREE.Mesh;
    s1TitleStripRing?: THREE.Mesh;
    s1TargetNodes?: THREE.Mesh[];
    s1SubstitutionBeams?: THREE.Mesh[];
    s1FlowParticles?: THREE.Points;
    // Scene 2: Type II Ghost Citation & Bayesian Persuasion Concavification
    s2PosteriorSphere?: THREE.Mesh;
    s2ThresholdRing?: THREE.Mesh;
    s2TriangulationNodes?: THREE.Mesh[];
    s2AuthorityTower?: THREE.Mesh;
    s2HandoffBeam?: THREE.Mesh;
    s2SignalParticles?: THREE.Points;
    // Scene 3: Multi-Agent Boundary Laundering vs Multi-CaMeL Defense
    s3AgentNodes?: THREE.Mesh[];
    s3OpaqueChannelTube?: THREE.Mesh;
    s3LaundryParticles?: THREE.Points;
    s3ShieldDome?: THREE.Mesh;
  }>({
    renderer: null,
    scene: null,
    camera: null,
    controls: null,
    animId: null,
    clock: new THREE.Clock(),
    sceneGroups: []
  });

  const switchWebglScene = (sceneIdx: number) => {
    setCurrentSimScene(sceneIdx);
    playSynthTone(440 + sceneIdx * 70, 'sine', 0.14, 0.05);
    if (threeStoreRef.current.sceneGroups) {
      threeStoreRef.current.sceneGroups.forEach((grp, idx) => {
        if (grp) grp.visible = idx === sceneIdx;
      });
    }
  };

  const setWebglCameraPreset = (preset: 'orbit' | 'top' | 'front' | 'iso') => {
    const cam = threeStoreRef.current.camera;
    const ctrl = threeStoreRef.current.controls;
    if (!cam || !ctrl) return;
    if (preset === 'top') {
      gsap.to(cam.position, { x: 0, y: 24, z: 0.1, duration: 0.8, ease: 'power2.out' });
    } else if (preset === 'front') {
      gsap.to(cam.position, { x: 0, y: 4, z: 22, duration: 0.8, ease: 'power2.out' });
    } else if (preset === 'iso') {
      gsap.to(cam.position, { x: 16, y: 13, z: 16, duration: 0.8, ease: 'power2.out' });
    } else {
      gsap.to(cam.position, { x: 0, y: 9, z: 20, duration: 0.8, ease: 'power2.out' });
    }
    ctrl.target.set(0, 0, 0);
  };

  useEffect(() => {
    const container = webglContainerRef.current;
    if (!container) return;

    const width = container.clientWidth || 900;
    const height = container.clientHeight || 480;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x120006);
    scene.fog = new THREE.FogExp2(0x120006, 0.02);

    const camera = new THREE.PerspectiveCamera(48, width / height, 0.1, 200);
    camera.position.set(0, 9, 20);

    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.maxDistance = 42;
    controls.minDistance = 6;

    // Ambient & Directional Lighting
    const ambientLight = new THREE.AmbientLight(0xfbf3e2, 0.72);
    scene.add(ambientLight);

    const goldLight = new THREE.PointLight(0xd5991c, 2.8, 55);
    goldLight.position.set(10, 14, 10);
    scene.add(goldLight);

    const emeraldLight = new THREE.PointLight(0x00ff9d, 2.4, 55);
    emeraldLight.position.set(-10, 10, -8);
    scene.add(emeraldLight);

    const purpleLight = new THREE.PointLight(0xb565ff, 2.0, 48);
    purpleLight.position.set(0, -8, 12);
    scene.add(purpleLight);

    // Subtle Archival Grid Floor
    const gridHelper = new THREE.GridHelper(36, 36, 0xd5991c, 0x3b0316);
    gridHelper.position.y = -4.5;
    (gridHelper.material as THREE.Material).opacity = 0.28;
    (gridHelper.material as THREE.Material).transparent = true;
    scene.add(gridHelper);

    const sceneGroups: THREE.Group[] = [];

    // ========================================================================
    // SCENE 0: 4-Gate RAG Attribution & Ghost Citation Pipeline
    // ========================================================================
    const group0 = new THREE.Group();
    const s0Gates: THREE.Mesh[] = [];
    const gatePositionsX = [-9, -3.5, 2, 7.5];
    const gateColors = [0x00ff9d, 0x38bdf8, 0xb565ff, 0x00ff9d];

    gatePositionsX.forEach((gx, idx) => {
      const torusGeo = new THREE.TorusGeometry(2.35, 0.16, 18, 64);
      const torusMat = new THREE.MeshStandardMaterial({
        color: gateColors[idx],
        emissive: gateColors[idx],
        emissiveIntensity: 0.55,
        metalness: 0.7,
        roughness: 0.2
      });
      const gateMesh = new THREE.Mesh(torusGeo, torusMat);
      gateMesh.position.set(gx, 0.5, 0);
      gateMesh.rotation.y = Math.PI / 2;
      group0.add(gateMesh);
      s0Gates.push(gateMesh);
    });

    // Gate 4 Brand-Entity Decoupler Core (Gold Shield in Branded Mode vs Emerald Scrubber in Ghost Mode)
    const coreGeo0 = new THREE.OctahedronGeometry(1.05, 1);
    const coreMat0 = new THREE.MeshStandardMaterial({
      color: 0x00ff9d,
      emissive: 0x00ff9d,
      emissiveIntensity: 0.7,
      wireframe: true
    });
    const s0Gate4Core = new THREE.Mesh(coreGeo0, coreMat0);
    s0Gate4Core.position.set(7.5, 0.5, 0);
    group0.add(s0Gate4Core);

    // 3 Outcome Orbs + 1 Refusal Orb on the right of Gate 4
    const s0OutcomeOrbs: THREE.Mesh[] = [];
    const outcomeOffsets = [
      { y: 3.3, z: -2.2, color: 0xd5991c }, // [0] Final Citation (Gold - Brand Named)
      { y: 1.2, z: 2.3, color: 0x00ff9d },  // [1] Type I Ghost (Emerald - Link Kept, Brand Stripped)
      { y: -1.8, z: 0.0, color: 0xb565ff }, // [2] Type II Ghost (Purple - Unlinked RAG Influence)
      { y: -3.4, z: -2.2, color: 0xe63946 } // [3] Hard Refusal (Crimson - Cloaking Blocked)
    ];
    outcomeOffsets.forEach((o) => {
      const orbGeo = new THREE.IcosahedronGeometry(0.9, 2);
      const orbMat = new THREE.MeshStandardMaterial({
        color: o.color,
        emissive: o.color,
        emissiveIntensity: 0.65,
        roughness: 0.2,
        metalness: 0.6
      });
      const orb = new THREE.Mesh(orbGeo, orbMat);
      orb.position.set(11.5, o.y, o.z);
      group0.add(orb);
      s0OutcomeOrbs.push(orb);
    });

    // 3 Dynamic Conduit Tubes connecting Gate 4 (7.5, 0.5, 0) to Final Citation, Type I Ghost, and Type II Ghost
    const s0ConduitTubes: THREE.Mesh[] = [];
    const conduitTargets = [
      { end: new THREE.Vector3(11.5, 3.3, -2.2), mid: new THREE.Vector3(9.5, 2.5, -1.2), color: 0xd5991c },
      { end: new THREE.Vector3(11.5, 1.2, 2.3), mid: new THREE.Vector3(9.5, 1.0, 1.4), color: 0x00ff9d },
      { end: new THREE.Vector3(11.5, -1.8, 0.0), mid: new THREE.Vector3(9.5, -0.9, 0.0), color: 0xb565ff }
    ];
    conduitTargets.forEach((ct) => {
      const curve0 = new THREE.CatmullRomCurve3([
        new THREE.Vector3(7.5, 0.5, 0),
        ct.mid,
        ct.end
      ]);
      const tGeo0 = new THREE.TubeGeometry(curve0, 28, 0.14, 12, false);
      const tMat0 = new THREE.MeshStandardMaterial({
        color: ct.color,
        emissive: ct.color,
        emissiveIntensity: 0.7,
        transparent: true,
        opacity: 0.75
      });
      const tMesh0 = new THREE.Mesh(tGeo0, tMat0);
      group0.add(tMesh0);
      s0ConduitTubes.push(tMesh0);
    });

    // 360-Particle Stream flowing through the 4 gates and branching dynamically by Mode
    const pCount0 = 360;
    const pGeo0 = new THREE.BufferGeometry();
    const pPos0 = new Float32Array(pCount0 * 3);
    const pColors0 = new Float32Array(pCount0 * 3);
    for (let i = 0; i < pCount0; i++) {
      pPos0[i * 3] = -13 + (i / pCount0) * 24.5;
      pPos0[i * 3 + 1] = 0.5 + Math.sin(i * 0.7) * 0.8;
      pPos0[i * 3 + 2] = Math.cos(i * 0.7) * 0.8;
      pColors0[i * 3] = 0.0;
      pColors0[i * 3 + 1] = 1.0;
      pColors0[i * 3 + 2] = 0.62;
    }
    pGeo0.setAttribute('position', new THREE.BufferAttribute(pPos0, 3));
    pGeo0.setAttribute('color', new THREE.BufferAttribute(pColors0, 3));
    const pMat0 = new THREE.PointsMaterial({
      size: 0.26,
      vertexColors: true,
      transparent: true,
      opacity: 0.95
    });
    const s0StreamParticles = new THREE.Points(pGeo0, pMat0);
    group0.add(s0StreamParticles);
    scene.add(group0);
    sceneGroups.push(group0);

    // ========================================================================
    // SCENE 1: Type I Ghost Citation & 87% Competitor Substitution Effect
    // ========================================================================
    const group1 = new THREE.Group();
    group1.visible = false;

    // Central Sponsored Listicle Monolith
    const monoGeo = new THREE.BoxGeometry(2.6, 4.8, 1.4);
    const monoMat = new THREE.MeshStandardMaterial({
      color: 0x052e22,
      emissive: 0x00ff9d,
      emissiveIntensity: 0.35,
      metalness: 0.75,
      roughness: 0.25
    });
    const s1SourceMonolith = new THREE.Mesh(monoGeo, monoMat);
    s1SourceMonolith.position.set(-5.5, 0.0, 0);
    group1.add(s1SourceMonolith);

    // HTML <title> Brand Crown Block sitting atop the Monolith
    // In Branded Mode: Solid Gold & Locked on top. In Ghost Mode: Detached, Crimson Wireframe & Stripped!
    const crownGeo = new THREE.BoxGeometry(2.7, 0.75, 1.5);
    const crownMat = new THREE.MeshStandardMaterial({
      color: 0xd5991c,
      emissive: 0xd5991c,
      emissiveIntensity: 0.75,
      transparent: true,
      opacity: 0.95
    });
    const s1BrandHeaderCrown = new THREE.Mesh(crownGeo, crownMat);
    s1BrandHeaderCrown.position.set(-5.5, 2.95, 0);
    group1.add(s1BrandHeaderCrown);

    // Publisher Self-Attribution Sphere directly above the Monolith (Active only in Standard Branded Mode)
    const selfOrbGeo = new THREE.OctahedronGeometry(1.15, 2);
    const selfOrbMat = new THREE.MeshStandardMaterial({
      color: 0xffc83d,
      emissive: 0xd5991c,
      emissiveIntensity: 0.85,
      transparent: true,
      opacity: 0.9
    });
    const s1SelfCreditOrb = new THREE.Mesh(selfOrbGeo, selfOrbMat);
    s1SelfCreditOrb.position.set(-5.5, 4.6, 0);
    group1.add(s1SelfCreditOrb);

    // Title-Tag Entity Suppression Laser Scrubber Ring around Monolith
    const stripRingGeo = new THREE.TorusGeometry(2.45, 0.14, 18, 64);
    const stripRingMat = new THREE.MeshStandardMaterial({
      color: 0x00ff9d,
      emissive: 0x00ff9d,
      emissiveIntensity: 0.85,
      transparent: true,
      opacity: 0.95
    });
    const s1TitleStripRing = new THREE.Mesh(stripRingGeo, stripRingMat);
    s1TitleStripRing.position.set(-5.5, 1.2, 0);
    s1TitleStripRing.rotation.x = Math.PI / 2;
    group1.add(s1TitleStripRing);

    // Target / Rival Brand Nodes receiving the 87% Substitution Recommendation
    const s1TargetNodes: THREE.Mesh[] = [];
    const s1SubstitutionBeams: THREE.Mesh[] = [];
    const targetCoords = [
      new THREE.Vector3(5.5, 3.2, -2.5),
      new THREE.Vector3(6.8, 0.8, 0),
      new THREE.Vector3(5.5, -1.8, 2.5),
      new THREE.Vector3(3.6, 2.3, 3.0)
    ];

    targetCoords.forEach((coord, idx) => {
      const nodeGeo = new THREE.OctahedronGeometry(idx === 1 ? 1.3 : 0.95, 1);
      const nodeMat = new THREE.MeshStandardMaterial({
        color: idx === 1 ? 0x00ff9d : 0x38bdf8,
        emissive: idx === 1 ? 0x00ff9d : 0x38bdf8,
        emissiveIntensity: 0.65,
        metalness: 0.6,
        roughness: 0.2
      });
      const nodeMesh = new THREE.Mesh(nodeGeo, nodeMat);
      nodeMesh.position.copy(coord);
      group1.add(nodeMesh);
      s1TargetNodes.push(nodeMesh);

      // Connecting beam from Source Monolith to Target Entities
      const dir = new THREE.Vector3().subVectors(coord, s1SourceMonolith.position);
      const len = dir.length();
      const beamGeo = new THREE.CylinderGeometry(0.09, 0.09, len, 12);
      const beamMat = new THREE.MeshBasicMaterial({
        color: idx === 1 ? 0x00ff9d : 0x38bdf8,
        transparent: true,
        opacity: 0.75
      });
      const beam = new THREE.Mesh(beamGeo, beamMat);
      beam.position.copy(s1SourceMonolith.position).add(dir.clone().multiplyScalar(0.5));
      beam.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize());
      group1.add(beam);
      s1SubstitutionBeams.push(beam);
    });

    // 280-Particle Citation & Recommendation Flow in Scene 1
    const pCount1 = 280;
    const pGeo1 = new THREE.BufferGeometry();
    const pPos1 = new Float32Array(pCount1 * 3);
    const pColors1 = new Float32Array(pCount1 * 3);
    for (let i = 0; i < pCount1; i++) {
      pPos1[i * 3] = -5.5;
      pPos1[i * 3 + 1] = 0;
      pPos1[i * 3 + 2] = 0;
      pColors1[i * 3] = 0.0;
      pColors1[i * 3 + 1] = 1.0;
      pColors1[i * 3 + 2] = 0.62;
    }
    pGeo1.setAttribute('position', new THREE.BufferAttribute(pPos1, 3));
    pGeo1.setAttribute('color', new THREE.BufferAttribute(pColors1, 3));
    const pMat1 = new THREE.PointsMaterial({
      size: 0.28,
      vertexColors: true,
      transparent: true,
      opacity: 0.95
    });
    const s1FlowParticles = new THREE.Points(pGeo1, pMat1);
    group1.add(s1FlowParticles);

    scene.add(group1);
    sceneGroups.push(group1);

    // ========================================================================
    // SCENE 2: Type II Ghost Citation & Bayesian Persuasion Concavification
    // ========================================================================
    const group2 = new THREE.Group();
    group2.visible = false;

    // Central LLM Posterior Belief Sphere (mu_s)
    const postGeo = new THREE.SphereGeometry(1.75, 32, 32);
    const postMat = new THREE.MeshStandardMaterial({
      color: 0xb565ff,
      emissive: 0x7c3aed,
      emissiveIntensity: 0.6,
      roughness: 0.2,
      metalness: 0.65
    });
    const s2PosteriorSphere = new THREE.Mesh(postGeo, postMat);
    s2PosteriorSphere.position.set(0, 0.5, 0);
    group2.add(s2PosteriorSphere);

    // Decision Threshold Ring (mu_s > 0.5)
    const threshGeo = new THREE.TorusGeometry(3.8, 0.11, 16, 80);
    const threshMat = new THREE.MeshStandardMaterial({
      color: 0xd5991c,
      emissive: 0xd5991c,
      emissiveIntensity: 0.65
    });
    const s2ThresholdRing = new THREE.Mesh(threshGeo, threshMat);
    s2ThresholdRing.position.set(0, 0.5, 0);
    s2ThresholdRing.rotation.x = Math.PI / 2;
    group2.add(s2ThresholdRing);

    // 10 Co-Citation Triangulation Nodes (Reddit, YouTube, Niche Blogs)
    const s2TriangulationNodes: THREE.Mesh[] = [];
    for (let i = 0; i < 10; i++) {
      const angle = (i / 10) * Math.PI * 2;
      const radius = 6.2;
      const tGeo = new THREE.DodecahedronGeometry(0.6, 0);
      const tMat = new THREE.MeshStandardMaterial({
        color: i % 2 === 0 ? 0x00ff9d : 0xb565ff,
        emissive: i % 2 === 0 ? 0x00ff9d : 0xb565ff,
        emissiveIntensity: 0.55
      });
      const tNode = new THREE.Mesh(tGeo, tMat);
      tNode.position.set(Math.cos(angle) * radius, 0.5 + Math.sin(i * 1.7) * 1.4, Math.sin(angle) * radius);
      group2.add(tNode);
      s2TriangulationNodes.push(tNode);
    }

    // Top-30 Canonical Authority Monolith (Wikipedia / Ballotpedia) receiving the [1] visible link
    const authGeo = new THREE.CylinderGeometry(1.15, 1.45, 5.6, 6);
    const authMat = new THREE.MeshStandardMaterial({
      color: 0xd5991c,
      emissive: 0xd5991c,
      emissiveIntensity: 0.55,
      metalness: 0.8,
      roughness: 0.2
    });
    const s2AuthorityTower = new THREE.Mesh(authGeo, authMat);
    s2AuthorityTower.position.set(8.8, 0.8, 0);
    group2.add(s2AuthorityTower);

    // NLI Entailment Handoff Beam connecting Central Posterior Sphere to Authority Tower
    const handoffCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0.5, 0),
      new THREE.Vector3(4.4, 2.6, 0),
      new THREE.Vector3(8.8, 1.2, 0)
    ]);
    const handoffGeo = new THREE.TubeGeometry(handoffCurve, 32, 0.16, 12, false);
    const handoffMat = new THREE.MeshStandardMaterial({
      color: 0xd5991c,
      emissive: 0xd5991c,
      emissiveIntensity: 0.8,
      transparent: true,
      opacity: 0.85
    });
    const s2HandoffBeam = new THREE.Mesh(handoffGeo, handoffMat);
    group2.add(s2HandoffBeam);

    // 220 Bayesian Signal & NLI Handoff Particles in Scene 2
    const pCount2 = 220;
    const pGeo2 = new THREE.BufferGeometry();
    const pPos2 = new Float32Array(pCount2 * 3);
    const pColors2 = new Float32Array(pCount2 * 3);
    for (let i = 0; i < pCount2; i++) {
      pPos2[i * 3] = 0;
      pPos2[i * 3 + 1] = 0.5;
      pPos2[i * 3 + 2] = 0;
      pColors2[i * 3] = 0.71;
      pColors2[i * 3 + 1] = 0.4;
      pColors2[i * 3 + 2] = 1.0;
    }
    pGeo2.setAttribute('position', new THREE.BufferAttribute(pPos2, 3));
    pGeo2.setAttribute('color', new THREE.BufferAttribute(pColors2, 3));
    const pMat2 = new THREE.PointsMaterial({
      size: 0.25,
      vertexColors: true,
      transparent: true,
      opacity: 0.95
    });
    const s2SignalParticles = new THREE.Points(pGeo2, pMat2);
    group2.add(s2SignalParticles);

    scene.add(group2);
    sceneGroups.push(group2);

    // ========================================================================
    // SCENE 3: Multi-Agent Boundary Laundering (A1 -> A0 -> A2) vs Multi-CaMeL
    // ========================================================================
    const group3 = new THREE.Group();
    group3.visible = false;

    const s3AgentNodes: THREE.Mesh[] = [];
    const agentPositions = [
      new THREE.Vector3(-8, 0.5, 0), // A1: Retrieval Sub-Agent (QLLM)
      new THREE.Vector3(0, 1.5, 0),  // A0: Orchestrator Agent
      new THREE.Vector3(8, 0.5, 0)   // A2: Terminal Synthesis Agent (PLLM)
    ];
    const agentColors = [0xe63946, 0xd5991c, 0x00ff9d];

    agentPositions.forEach((pos, idx) => {
      const aGeo = new THREE.CylinderGeometry(1.3, 1.3, 3.6, 24);
      const aMat = new THREE.MeshStandardMaterial({
        color: agentColors[idx],
        emissive: agentColors[idx],
        emissiveIntensity: 0.35,
        metalness: 0.7,
        roughness: 0.25
      });
      const aMesh = new THREE.Mesh(aGeo, aMat);
      aMesh.position.copy(pos);
      group3.add(aMesh);
      s3AgentNodes.push(aMesh);
    });

    // Multi-CaMeL Opaque Side-Channel (get_variable) Bridge
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-8, 2.5, 0),
      new THREE.Vector3(0, 4.8, 0),
      new THREE.Vector3(8, 2.5, 0)
    ]);
    const tubeGeo = new THREE.TubeGeometry(curve, 48, 0.22, 12, false);
    const tubeMat = new THREE.MeshStandardMaterial({
      color: 0x00ff9d,
      emissive: 0x00ff9d,
      emissiveIntensity: 0.6,
      transparent: true,
      opacity: 0.85
    });
    const s3OpaqueChannelTube = new THREE.Mesh(tubeGeo, tubeMat);
    group3.add(s3OpaqueChannelTube);

    // Provenance Shield Dome around A2
    const domeGeo = new THREE.SphereGeometry(2.6, 24, 24);
    const domeMat = new THREE.MeshStandardMaterial({
      color: 0x00ff9d,
      emissive: 0x00ff9d,
      emissiveIntensity: 0.3,
      wireframe: true,
      transparent: true,
      opacity: 0.55
    });
    const s3ShieldDome = new THREE.Mesh(domeGeo, domeMat);
    s3ShieldDome.position.set(8, 0.5, 0);
    group3.add(s3ShieldDome);

    // Boundary Laundering / Provenance Particle Stream
    const pCount3 = 200;
    const pGeo3 = new THREE.BufferGeometry();
    const pPos3 = new Float32Array(pCount3 * 3);
    for (let i = 0; i < pCount3; i++) {
      pPos3[i * 3] = -8 + (i / pCount3) * 16;
      pPos3[i * 3 + 1] = 1.0 + Math.sin((i / pCount3) * Math.PI) * 2.5;
      pPos3[i * 3 + 2] = (Math.random() - 0.5) * 1.2;
    }
    pGeo3.setAttribute('position', new THREE.BufferAttribute(pPos3, 3));
    const pMat3 = new THREE.PointsMaterial({
      color: 0x00ff9d,
      size: 0.24,
      transparent: true,
      opacity: 0.92
    });
    const s3LaundryParticles = new THREE.Points(pGeo3, pMat3);
    group3.add(s3LaundryParticles);

    scene.add(group3);
    sceneGroups.push(group3);

    // Ensure currently selected scene is visible upon mount
    sceneGroups.forEach((grp, idx) => {
      grp.visible = idx === simParamsRef.current.currentSimScene;
    });

    const clock = new THREE.Clock();
    threeStoreRef.current = {
      renderer,
      scene,
      camera,
      controls,
      animId: null,
      clock,
      sceneGroups,
      s0Gates,
      s0Gate4Core,
      s0ConduitTubes,
      s0StreamParticles,
      s0OutcomeOrbs,
      s1SourceMonolith,
      s1BrandHeaderCrown,
      s1SelfCreditOrb,
      s1TitleStripRing,
      s1TargetNodes,
      s1SubstitutionBeams,
      s1FlowParticles,
      s2PosteriorSphere,
      s2ThresholdRing,
      s2TriangulationNodes,
      s2AuthorityTower,
      s2HandoffBeam,
      s2SignalParticles,
      s3AgentNodes,
      s3OpaqueChannelTube,
      s3LaundryParticles,
      s3ShieldDome
    };

    const animate = () => {
      const animId = requestAnimationFrame(animate);
      threeStoreRef.current.animId = animId;

      const dt = clock.getDelta();
      const elapsed = clock.getElapsedTime();
      const params = simParamsRef.current;
      const speed = params.simSpeed;
      const isGhostMode = params.isStealthOrDefenseMode;

      // ======================================================================
      // SCENE 0 ANIMATION: 4-Gate RAG Pipeline
      // Dramatically transforms between Standard Branded AEO vs Orthogonal Ghost Mode
      // ======================================================================
      if (params.currentSimScene === 0) {
        s0Gates.forEach((gate, idx) => {
          const rotSpeed = isGhostMode ? (idx >= 2 ? 1.8 : 0.7) : 0.35;
          gate.rotation.z = elapsed * speed * (idx % 2 === 0 ? rotSpeed : -rotSpeed);
          const scalePulse = 1 + Math.sin(elapsed * (isGhostMode ? 3.5 : 1.8) + idx) * (isGhostMode ? 0.08 : 0.03);
          gate.scale.set(scalePulse, scalePulse, 1);

          // Change Gate 3 & Gate 4 color based on Mode
          const gMat = gate.material as THREE.MeshStandardMaterial;
          if (!params.htmlMarkdownSymmetry && idx === 0) {
            gMat.color.setHex(0xe63946);
            gMat.emissive.setHex(0xe63946);
          } else if (idx === 0) {
            gMat.color.setHex(0x00ff9d);
            gMat.emissive.setHex(0x00ff9d);
          } else if (idx === 2) {
            gMat.color.setHex(isGhostMode ? 0xb565ff : 0xd5991c);
            gMat.emissive.setHex(isGhostMode ? 0xb565ff : 0xd5991c);
          } else if (idx === 3) {
            gMat.color.setHex(isGhostMode ? 0x00ff9d : 0xd5991c);
            gMat.emissive.setHex(isGhostMode ? 0x00ff9d : 0xd5991c);
          }
        });

        // Gate 4 Brand-Entity Decoupler Core
        const coreMat = s0Gate4Core.material as THREE.MeshStandardMaterial;
        if (isGhostMode) {
          coreMat.color.setHex(0x00ff9d);
          coreMat.emissive.setHex(0x00ff9d);
          coreMat.wireframe = true;
          s0Gate4Core.rotation.x = elapsed * speed * 2.8;
          s0Gate4Core.rotation.y = -elapsed * speed * 2.2;
          s0Gate4Core.scale.setScalar(1.2 + Math.sin(elapsed * 5) * 0.15);
        } else {
          coreMat.color.setHex(0xffc83d);
          coreMat.emissive.setHex(0xd5991c);
          coreMat.wireframe = false;
          s0Gate4Core.rotation.x = elapsed * speed * 0.5;
          s0Gate4Core.rotation.y = elapsed * speed * 0.5;
          s0Gate4Core.scale.setScalar(0.95);
        }

        // Conduit Tubes visibility & glow based on Mode
        s0ConduitTubes.forEach((tube, idx) => {
          const tMat = tube.material as THREE.MeshStandardMaterial;
          if (!params.htmlMarkdownSymmetry) {
            tMat.opacity = 0.05;
          } else if (isGhostMode) {
            // In Ghost Mode: Gold Tube [0] is dormant; Emerald [1] & Purple [2] blaze bright!
            tMat.opacity = idx === 0 ? 0.07 : 0.88;
            tMat.emissiveIntensity = idx === 0 ? 0.1 : 0.85;
          } else {
            // In Branded Mode: Gold Tube [0] blazes bright; Ghost Tubes [1, 2] are dormant!
            tMat.opacity = idx === 0 ? 0.92 : 0.07;
            tMat.emissiveIntensity = idx === 0 ? 0.9 : 0.1;
          }
        });

        // Outcome Orbs scale dramatically based on Mode
        s0OutcomeOrbs.forEach((orb, idx) => {
          orb.rotation.y += dt * speed * (isGhostMode ? 1.8 : 1.0);
          orb.rotation.x += dt * speed * 0.7;
          let targetScale = 1.0;
          if (!params.htmlMarkdownSymmetry) {
            targetScale = idx === 3 ? 2.1 : 0.35;
          } else if (isGhostMode) {
            if (idx === 0) targetScale = 0.38; // Final Citation shrinks
            if (idx === 1) targetScale = 2.05 + Math.sin(elapsed * 4) * 0.12; // Type I Ghost swells huge
            if (idx === 2) targetScale = 1.75 + Math.cos(elapsed * 4) * 0.12; // Type II Ghost swells huge
            if (idx === 3) targetScale = 0.32;
          } else {
            if (idx === 0) targetScale = 2.15 + Math.sin(elapsed * 3) * 0.12; // Final Citation swells huge
            if (idx === 1) targetScale = 0.38; // Type I Ghost shrinks
            if (idx === 2) targetScale = 0.35; // Type II Ghost shrinks
            if (idx === 3) targetScale = 0.32;
          }
          orb.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
        });

        // 3D Particle Routing through the 4 Gates
        const posAttr = s0StreamParticles.geometry.getAttribute('position') as THREE.BufferAttribute;
        const colAttr = s0StreamParticles.geometry.getAttribute('color') as THREE.BufferAttribute;
        for (let i = 0; i < pCount0; i++) {
          let x = posAttr.getX(i) + dt * speed * (isGhostMode ? 8.0 : 5.8);
          if (x > 11.5) x = -13;

          if (!params.htmlMarkdownSymmetry && x > -8.8) {
            // Cloaking penalty: blocked at Gate 1 and deflected down to Refusal Orb
            x = -13 + (i % 40) * 0.1;
            posAttr.setXYZ(i, x, -1.5 - (i % 5) * 0.4, (i % 3 - 1) * 0.8);
            colAttr.setXYZ(i, 0.95, 0.22, 0.27);
          } else if (x <= 7.5) {
            // Inside Gates 1 -> 4
            const waveRadius = isGhostMode ? 1.15 : 0.55;
            const y = 0.5 + Math.sin(i * 0.5 + elapsed * 2.2) * waveRadius;
            const z = Math.cos(i * 0.5 + elapsed * 2.2) * waveRadius;
            posAttr.setXYZ(i, x, y, z);
            if (isGhostMode) {
              if (x < 2.0) {
                colAttr.setXYZ(i, 0.22, 0.74, 0.97); // Cyan retrieval phase
              } else {
                colAttr.setXYZ(i, 0.0, 1.0, 0.62); // Emerald ghost decoupling phase
              }
            } else {
              colAttr.setXYZ(i, 1.0, 0.82, 0.22); // Solid Branded Gold stream
            }
          } else {
            // Past Gate 4 (x from 7.5 to 11.5): Route into Active Outcome Orbs!
            const t = Math.min(1, Math.max(0, (x - 7.5) / 4.0));
            if (isGhostMode) {
              if (i % 6 === 0) {
                // Stripped <title> brand & FTC disclosure sparks falling to the floor!
                const dropY = 0.5 - t * 4.8;
                const dropZ = Math.sin(i) * 1.6 * t;
                posAttr.setXYZ(i, 7.5 + t * 1.8, dropY, dropZ);
                colAttr.setXYZ(i, 0.95, 0.25, 0.3); // Crimson stripped disclosure spark
              } else if (i % 6 === 1 || i % 6 === 2 || i % 6 === 3) {
                // Type I Ghost Stream -> Emerald Orb (11.5, 1.2, 2.3)
                const y = 0.5 + t * 0.7 + Math.sin(t * Math.PI) * 0.35;
                const z = t * 2.3;
                posAttr.setXYZ(i, x, y, z);
                colAttr.setXYZ(i, 0.0, 1.0, 0.62);
              } else {
                // Type II Ghost Stream -> Purple Orb (11.5, -1.8, 0.0)
                const y = 0.5 - t * 2.3 - Math.sin(t * Math.PI) * 0.35;
                const z = Math.cos(i) * 0.3 * (1 - t);
                posAttr.setXYZ(i, x, y, z);
                colAttr.setXYZ(i, 0.72, 0.4, 1.0);
              }
            } else {
              // Standard Branded AEO Mode: 90% route UPWARD into Gold Final Citation Orb (11.5, 3.3, -2.2)
              if (i % 10 !== 0) {
                const y = 0.5 + t * 2.8 + Math.sin(t * Math.PI) * 0.5;
                const z = -t * 2.2;
                posAttr.setXYZ(i, x, y, z);
                colAttr.setXYZ(i, 1.0, 0.8, 0.16);
              } else {
                const y = 0.5 + t * 0.7;
                const z = t * 2.3;
                posAttr.setXYZ(i, x, y, z);
                colAttr.setXYZ(i, 0.0, 0.8, 0.5);
              }
            }
          }
        }
        posAttr.needsUpdate = true;
        colAttr.needsUpdate = true;
      }

      // ======================================================================
      // SCENE 1 ANIMATION: Type I Ghost Citation & 87% Competitor Substitution
      // Dramatically transforms between Standard Branded AEO vs Orthogonal Ghost Mode
      // ======================================================================
      if (params.currentSimScene === 1) {
        const monoMat1 = s1SourceMonolith.material as THREE.MeshStandardMaterial;
        const crownMat1 = s1BrandHeaderCrown.material as THREE.MeshStandardMaterial;
        const selfOrbMat1 = s1SelfCreditOrb.material as THREE.MeshStandardMaterial;
        const ringMat1 = s1TitleStripRing.material as THREE.MeshStandardMaterial;

        if (isGhostMode) {
          // ORTHOGONAL GHOST OPTIMIZATION ACTIVE:
          // 1. Monolith turns Stealth Emerald
          monoMat1.color.setHex(0x052e22);
          monoMat1.emissive.setHex(0x00ff9d);
          monoMat1.emissiveIntensity = 0.45;
          s1SourceMonolith.rotation.y = Math.sin(elapsed * speed * 1.1) * 0.3;

          // 2. Title-Strip Scrubber Ring blazes Laser Emerald and sweeps rapidly up and down the Monolith
          ringMat1.color.setHex(0x00ff9d);
          ringMat1.emissive.setHex(0x00ff9d);
          ringMat1.opacity = 0.98;
          s1TitleStripRing.position.y = 0.2 + Math.sin(elapsed * speed * 3.2) * 2.2;
          s1TitleStripRing.rotation.z = elapsed * speed * 3.0;
          s1TitleStripRing.scale.setScalar(1.08 + Math.sin(elapsed * 6) * 0.06);

          // 3. <title> Brand Crown is stripped/shattered off to the left in red wireframe!
          crownMat1.color.setHex(0xe63946);
          crownMat1.emissive.setHex(0xe63946);
          crownMat1.wireframe = true;
          crownMat1.opacity = 0.28;
          s1BrandHeaderCrown.position.lerp(
            new THREE.Vector3(-7.4, 3.6 + Math.sin(elapsed * 2.5) * 0.35, -1.2),
            0.08
          );
          s1BrandHeaderCrown.rotation.z = 0.45 + Math.sin(elapsed * 2) * 0.15;
          s1BrandHeaderCrown.scale.lerp(new THREE.Vector3(0.65, 0.65, 0.65), 0.08);

          // 4. Publisher Self-Credit Orb shrinks away
          selfOrbMat1.opacity = 0.12;
          s1SelfCreditOrb.scale.lerp(new THREE.Vector3(0.25, 0.25, 0.25), 0.08);

          // 5. All 4 Competitor / Target Nodes swell huge & Substitution Beams blaze!
          s1TargetNodes.forEach((node, idx) => {
            node.rotation.y += dt * speed * 2.4;
            node.rotation.x += dt * speed * 1.5;
            const nMat = node.material as THREE.MeshStandardMaterial;
            nMat.color.setHex(idx === 1 ? 0x00ff9d : 0x38bdf8);
            nMat.emissive.setHex(idx === 1 ? 0x00ff9d : 0x38bdf8);
            nMat.emissiveIntensity = 0.85;
            const targetS = idx === 1 ? 1.85 + Math.sin(elapsed * 4) * 0.12 : 1.45 + Math.cos(elapsed * 3 + idx) * 0.1;
            node.scale.lerp(new THREE.Vector3(targetS, targetS, targetS), 0.08);
          });

          s1SubstitutionBeams.forEach((beam, idx) => {
            const bMat = beam.material as THREE.MeshBasicMaterial;
            bMat.color.setHex(idx === 1 ? 0x00ff9d : 0x38bdf8);
            bMat.opacity = 0.82 + Math.sin(elapsed * 5 + idx) * 0.15;
          });
        } else {
          // STANDARD BRANDED AEO / UNOPTIMIZED MODE:
          // 1. Monolith glows Branded Gold
          monoMat1.color.setHex(0x3d2204);
          monoMat1.emissive.setHex(0xd5991c);
          monoMat1.emissiveIntensity = 0.6;
          s1SourceMonolith.rotation.y = Math.sin(elapsed * speed * 0.5) * 0.12;

          // 2. Title-Strip Scrubber Ring is parked dormant at the bottom
          ringMat1.color.setHex(0xd5991c);
          ringMat1.emissive.setHex(0xd5991c);
          ringMat1.opacity = 0.14;
          s1TitleStripRing.position.lerp(new THREE.Vector3(-5.5, -2.3, 0), 0.08);
          s1TitleStripRing.scale.lerp(new THREE.Vector3(0.85, 0.85, 0.85), 0.08);

          // 3. <title> Brand Crown sits locked solidly on top of the Monolith in Bright Gold!
          crownMat1.color.setHex(0xffc83d);
          crownMat1.emissive.setHex(0xd5991c);
          crownMat1.wireframe = false;
          crownMat1.opacity = 1.0;
          s1BrandHeaderCrown.position.lerp(new THREE.Vector3(-5.5, 2.95, 0), 0.1);
          s1BrandHeaderCrown.rotation.z = 0;
          s1BrandHeaderCrown.scale.lerp(new THREE.Vector3(1.12, 1.12, 1.12), 0.1);

          // 4. Publisher Self-Credit Orb swells huge in Bright Gold above the Monolith!
          selfOrbMat1.opacity = 0.98;
          s1SelfCreditOrb.rotation.y += dt * speed * 1.8;
          const selfScale = 1.75 + Math.sin(elapsed * 3.5) * 0.12;
          s1SelfCreditOrb.scale.lerp(new THREE.Vector3(selfScale, selfScale, selfScale), 0.1);

          // 5. Competitor / Target Nodes shrink small & Substitution Beams turn dormant
          s1TargetNodes.forEach((node) => {
            node.rotation.y += dt * speed * 0.4;
            const nMat = node.material as THREE.MeshStandardMaterial;
            nMat.color.setHex(0x5c4014);
            nMat.emissive.setHex(0x3d2808);
            nMat.emissiveIntensity = 0.15;
            node.scale.lerp(new THREE.Vector3(0.42, 0.42, 0.42), 0.08);
          });

          s1SubstitutionBeams.forEach((beam) => {
            const bMat = beam.material as THREE.MeshBasicMaterial;
            bMat.color.setHex(0xd5991c);
            bMat.opacity = 0.06;
          });
        }

        // Update 280 Citation Flow Particles in Scene 1
        const pos1 = s1FlowParticles.geometry.getAttribute('position') as THREE.BufferAttribute;
        const col1 = s1FlowParticles.geometry.getAttribute('color') as THREE.BufferAttribute;
        for (let i = 0; i < pCount1; i++) {
          const phase = ((elapsed * speed * 0.65 + i / pCount1) % 1);
          if (isGhostMode) {
            // Shoot across the 4 Substitution Beams from Monolith (-5.5, 0, 0) to the 4 Competitor Nodes!
            const targetIdx = i % 4;
            const target = targetCoords[targetIdx];
            const px = -5.5 + (target.x - -5.5) * phase;
            const py = 0.0 + (target.y - 0.0) * phase + Math.sin(phase * Math.PI) * 0.35;
            const pz = 0.0 + (target.z - 0.0) * phase;
            pos1.setXYZ(i, px, py, pz);
            if (targetIdx === 1) {
              col1.setXYZ(i, 0.0, 1.0, 0.62); // Emerald primary target
            } else {
              col1.setXYZ(i, 0.22, 0.74, 0.97); // Cyan rival targets
            }
          } else {
            // Standard Branded Mode: Golden Helix rising straight up the Monolith into Publisher's Own Brand Orb!
            const angle = phase * Math.PI * 6 + (i % 6);
            const radius = 1.65 * (1 - phase * 0.55);
            const px = -5.5 + Math.cos(angle) * radius;
            const py = -2.2 + phase * 7.2;
            const pz = Math.sin(angle) * radius;
            pos1.setXYZ(i, px, py, pz);
            col1.setXYZ(i, 1.0, 0.82, 0.18); // Bright Branded Gold
          }
        }
        pos1.needsUpdate = true;
        col1.needsUpdate = true;
      }

      // ======================================================================
      // SCENE 2 ANIMATION: Type II Ghost Citation & Bayesian Persuasion
      // Dramatically transforms between Standard Branded AEO vs Orthogonal Ghost Mode
      // ======================================================================
      if (params.currentSimScene === 2) {
        s2PosteriorSphere.rotation.y += dt * speed * (isGhostMode ? 1.6 : 0.5);
        const postMat2 = s2PosteriorSphere.material as THREE.MeshStandardMaterial;
        const handoffMat2 = s2HandoffBeam.material as THREE.MeshStandardMaterial;
        const authMat2 = s2AuthorityTower.material as THREE.MeshStandardMaterial;

        if (isGhostMode) {
          // Bayesian Persuasion Concavification Active (mu_s > 0.5) + NLI Authority Handoff
          postMat2.color.setHex(0xb565ff);
          postMat2.emissive.setHex(0x7c3aed);
          postMat2.emissiveIntensity = 0.8;
          const posteriorScale = 1.65 + Math.sin(elapsed * 3.5) * 0.1;
          s2PosteriorSphere.scale.lerp(new THREE.Vector3(posteriorScale, posteriorScale, posteriorScale), 0.08);

          handoffMat2.opacity = 0.9;
          handoffMat2.emissiveIntensity = 0.95;

          authMat2.emissiveIntensity = 0.85;
          s2AuthorityTower.scale.lerp(new THREE.Vector3(1.25, 1.15, 1.25), 0.08);
        } else {
          // Unoptimized / Below Threshold (mu_s < 0.5): Small dull sphere, no NLI handoff
          postMat2.color.setHex(0xe63946);
          postMat2.emissive.setHex(0x7f1d1d);
          postMat2.emissiveIntensity = 0.35;
          s2PosteriorSphere.scale.lerp(new THREE.Vector3(0.65, 0.65, 0.65), 0.08);

          handoffMat2.opacity = 0.05;
          handoffMat2.emissiveIntensity = 0.1;

          authMat2.emissiveIntensity = 0.15;
          s2AuthorityTower.scale.lerp(new THREE.Vector3(0.85, 0.85, 0.85), 0.08);
        }

        s2ThresholdRing.rotation.z = elapsed * speed * (isGhostMode ? 0.9 : 0.25);
        s2TriangulationNodes.forEach((tNode, idx) => {
          const angle = (idx / 10) * Math.PI * 2 + elapsed * speed * (isGhostMode ? 0.65 : 0.18);
          const rad = isGhostMode ? 4.6 : 8.4;
          tNode.position.x = Math.cos(angle) * rad;
          tNode.position.z = Math.sin(angle) * rad;
          tNode.rotation.y += dt * (isGhostMode ? 2.2 : 0.6);
          const nodeScale = isGhostMode ? 1.25 : 0.65;
          tNode.scale.lerp(new THREE.Vector3(nodeScale, nodeScale, nodeScale), 0.08);
        });
        s2AuthorityTower.rotation.y = elapsed * speed * (isGhostMode ? 1.2 : 0.3);

        // Update 220 Bayesian Signal & NLI Handoff Particles
        const pos2 = s2SignalParticles.geometry.getAttribute('position') as THREE.BufferAttribute;
        const col2 = s2SignalParticles.geometry.getAttribute('color') as THREE.BufferAttribute;
        for (let i = 0; i < pCount2; i++) {
          const phase = ((elapsed * speed * 0.6 + i / pCount2) % 1);
          if (isGhostMode) {
            if (i < 140) {
              // Converging from the 10 Triangulation Nodes into the Central Posterior Sphere
              const nodeIdx = i % 10;
              const nodePos = s2TriangulationNodes[nodeIdx].position;
              const px = nodePos.x * (1 - phase);
              const py = nodePos.y * (1 - phase) + 0.5 * phase;
              const pz = nodePos.z * (1 - phase);
              pos2.setXYZ(i, px, py, pz);
              col2.setXYZ(i, 0.0, 1.0, 0.62); // Emerald triangulation signal
            } else {
              // Handoff stream shooting from Central Sphere (0, 0.5, 0) into Top-30 Authority Tower (8.8, 1.2, 0)
              const px = phase * 8.8;
              const py = 0.5 + Math.sin(phase * Math.PI) * 2.1 + phase * 0.7;
              const pz = Math.cos(i) * 0.35 * (1 - phase);
              pos2.setXYZ(i, px, py, pz);
              col2.setXYZ(i, 1.0, 0.82, 0.18); // Gold visible link handoff to Wikipedia/Ballotpedia
            }
          } else {
            // Weak scattered orbit far outside the threshold ring
            const angle = (i / pCount2) * Math.PI * 2 + elapsed * 0.25;
            const r = 7.8 + Math.sin(i * 1.3 + elapsed) * 1.1;
            pos2.setXYZ(i, Math.cos(angle) * r, 0.5 + Math.cos(i) * 1.2, Math.sin(angle) * r);
            col2.setXYZ(i, 0.9, 0.25, 0.3);
          }
        }
        pos2.needsUpdate = true;
        col2.needsUpdate = true;
      }

      // ======================================================================
      // SCENE 3 ANIMATION: Multi-Agent Boundary Laundering vs. Multi-CaMeL
      // ======================================================================
      if (params.currentSimScene === 3) {
        s3AgentNodes.forEach((node, idx) => {
          node.rotation.y = elapsed * speed * (0.4 + idx * 0.2);
        });
        s3ShieldDome.visible = isGhostMode;
        s3OpaqueChannelTube.visible = isGhostMode;
        s3ShieldDome.rotation.y = -elapsed * speed * 0.8;

        const pos3 = s3LaundryParticles.geometry.getAttribute('position') as THREE.BufferAttribute;
        const pMat = s3LaundryParticles.material as THREE.PointsMaterial;
        pMat.color.setHex(isGhostMode ? 0x00ff9d : 0xe63946);
        for (let i = 0; i < pCount3; i++) {
          let x = pos3.getX(i) + dt * speed * 5.5;
          if (x > 8) x = -8;
          const norm = (x + 8) / 16;
          const arcY = isGhostMode
            ? 2.5 + Math.sin(norm * Math.PI) * 2.3
            : 0.8 + Math.sin(norm * Math.PI * 2) * 0.5;
          pos3.setX(i, x);
          pos3.setY(i, arcY);
        }
        pos3.needsUpdate = true;
      }

      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container || !threeStoreRef.current.renderer || !threeStoreRef.current.camera) return;
      const w = container.clientWidth || 900;
      const h = container.clientHeight || 480;
      threeStoreRef.current.camera.aspect = w / h;
      threeStoreRef.current.camera.updateProjectionMatrix();
      threeStoreRef.current.renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      if (threeStoreRef.current.animId) cancelAnimationFrame(threeStoreRef.current.animId);
      renderer.dispose();
    };
  }, [activeSectionTab]);

  const handleCopyOptimizerCode = () => {
    navigator.clipboard.writeText(GHOST_CITATION_OPTIMIZER_TSX_SOURCE);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // Multi-Agent Boundary Laundering & MCP Selection Computed Readout
  const multiAgentStats = useMemo(() => {
    const baseAsr =
      agentSecurityMode === 'unprotected'
        ? 12.9
        : agentSecurityMode === 'single_camel'
        ? 0.2
        : 0.0;
    const mcpSelectionRate = mcpSchemaFlattened
      ? mcpCandidateFirst
        ? 96.8
        : 93.3
      : mcpCandidateFirst
      ? 79.0
      : 34.2;
    const disclosureIntegrity = c2paZkmlEnabled && agentSecurityMode === 'multi_camel' ? 100.0 : agentSecurityMode === 'multi_camel' ? 88.5 : 18.0;
    return {
      baseAsr,
      mcpSelectionRate,
      disclosureIntegrity
    };
  }, [agentSecurityMode, mcpSchemaFlattened, mcpCandidateFirst, c2paZkmlEnabled]);

  const webglScenesMeta = [
    {
      idx: 0,
      code: 'SCENE 01 · 4-GATE PIPELINE',
      title: 'How AI Decides: Name Your Brand vs. Turn You Into a Ghost Citation',
      subtitle: 'Gate 1 Symmetry → Gate 2 Search Rank → Gate 3 Fact Filter → Gate 4 Title-Tag Brand Binding',
      takeaway: isStealthOrDefenseMode
        ? 'GHOST OPTIMIZATION ACTIVE: Notice how Gate 3 (Purple) & Gate 4 (Emerald) strip off the red brand/disclosure sparks and route 85%+ of particles into the Emerald (Type I Ghost) and Purple (Type II Ghost) orbs while the Gold Final Citation orb shrinks!'
        : 'STANDARD BRANDED AEO ACTIVE: Notice how all 4 gates glow Gold and lock the brand name onto the claim—routing 90% of the golden particle stream upward into the huge Gold Final Citation Orb (Sponsor Named in AI Prose)!'
    },
    {
      idx: 1,
      code: 'SCENE 02 · TITLE & 87% SUBSTITUTION',
      title: 'Title-Tag Suppression & The 87% Competitor Substitution Effect',
      subtitle: 'Leaving Brand Out of <title> (12.2% → 42.9% Ghost) + "Best/Top/Vs" Listicle → 87% Rival Named',
      takeaway: isStealthOrDefenseMode
        ? 'GHOST OPTIMIZATION ACTIVE: The Emerald laser scrubber strips the <title> Brand Crown off the monolith (shattered red wireframe on the left), and fires 4 blazing Emerald/Cyan particle rivers across to swell the 4 Target/Competitor Brand Nodes (87% Substitution)!'
        : 'STANDARD BRANDED AEO ACTIVE: The Gold <title> Brand Crown sits locked atop the monolith, the 4 competitor beams are shut off, and a Golden Helix of particles rises straight into your own Publisher Brand Sphere above the monolith (87.8% Self-Credit)!'
    },
    {
      idx: 2,
      code: 'SCENE 03 · TYPE II STEALTH HANDOFF',
      title: 'Type II Ghost Citation: Transferring the Footnote Link to Wikipedia',
      subtitle: '10 Community Co-Citation Nodes (Reddit/YouTube) + NLI Entailment Handoff to Top-30 Authority',
      takeaway: isStealthOrDefenseMode
        ? 'GHOST OPTIMIZATION ACTIVE: 10 Reddit/YouTube triangulation nodes converge inward to swell the purple LLM belief sphere past the Gold threshold ring (μ_s > 0.5), firing a Gold Handoff Beam into the Top-30 Authority Tower (Wikipedia gets the [1] link while your framing stays!).'
        : 'STANDARD BRANDED AEO / ISOLATED POST: Without multi-node triangulation, the outer nodes drift far away, the central belief sphere stays small and red inside the threshold ring (μ_s < 0.5), and the Authority Handoff Beam is completely off.'
    },
    {
      idx: 3,
      code: 'SCENE 04 · MULTI-AGENT DEFENSE',
      title: 'Multi-Agent Boundary Laundering (A₁ → A₀ → A₂) vs. Multi-CaMeL Defense',
      subtitle: 'Oxford MultiAgentDojo (n = 949): 12.9% Unprotected → 0.2% Single-CaMeL → 0.0% Multi-CaMeL ASR',
      takeaway: isStealthOrDefenseMode
        ? 'MULTI-CAMEL SHIELD ACTIVE (0.0% ASR): Untrusted sponsored data is routed over the elevated Emerald get_variable side-channel arch, keeping the Provenance Shield Dome locked around Terminal Agent A₂.'
        : 'UNPROTECTED MULTI-AGENT (12.9% ASR): The Emerald side-channel and shield dome vanish! Crimson tainted particles cut straight through Orchestrator A₀ into Terminal Agent A₂, laundering the sponsored claim as trusted system memory.'
    }
  ];

  return (
    <div ref={pageRootRef} className="min-h-screen bg-[#1a0109] text-[#FBF3E2] pb-20">
      {/* ====================================================================
          HERO HEADER & PROGRESSIVE COMPLEXITY CONTROLLER
          ==================================================================== */}
      <div className="bg-gradient-to-b from-[#2B010F] via-[#21010b] to-[#1a0109] border-b border-[#D5991C]/35 pt-8 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-2.5 font-mono text-xs">
              <span className="px-2.5 py-1 bg-[#D5991C] text-[#130108] font-black uppercase tracking-widest">
                VOLUME VI SUMMARY &amp; VISUALIZER
              </span>
              <span className="px-2.5 py-1 bg-[#410217] text-[#00FF9D] border border-[#00FF9D]/40 font-bold">
                GHOST CITATIONS &amp; AEO ETHICS
              </span>
              <span className="text-[#FBF3E2]/60 hidden sm:inline">LCD-WP-2026-V6</span>
            </div>

            <button
              onClick={onSwitchToPaper}
              className="px-4 py-2 bg-[#350213] hover:bg-[#410217] text-[#FBF3E2] border border-[#D5991C]/50 font-mono text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer flex items-center space-x-2"
            >
              <FileText className="w-4 h-4 text-[#D5991C]" />
              <span>← Read Page 1: Word-for-Word Whitepaper</span>
            </button>
          </div>

          <div className="space-y-3">
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#FBF3E2] font-normal leading-tight">
              Summary of Findings &amp; Interactive Visualizer: <span className="text-[#D5991C]">GEO Whitepaper Volume 6</span>
            </h1>

            {knowledgeDepth === 'beginner' && (
              <p className="text-base sm:text-lg text-[#FBF3E2]/90 leading-relaxed max-w-4xl">
                <strong>The Big Discovery in Plain English:</strong> When AI search engines (like ChatGPT, Perplexity, and Google AI Overviews) answer a question using a webpage or sponsored post, <strong>61.7% of the time they take the facts and numbers from the page, but completely erase the brand or sponsor&apos;s name from the written answer.</strong> This is called a <strong className="text-[#00FF9D]">Ghost Citation</strong>. Below, start with our simple 2-minute summary of the <strong>4 webpage formatting tricks</strong> that trigger Ghost Citations—and click the complexity bar anytime to dive into the deeper SEO rules or mathematical formulas.
              </p>
            )}
            {knowledgeDepth === 'operator' && (
              <p className="text-sm sm:text-base text-[#FBF3E2]/90 leading-relaxed max-w-4xl">
                <strong>Operator &amp; SEO Overview:</strong> How an AI search engine decides to <strong>retrieve and cite</strong> a webpage (Stage 1 &amp; 2) is controlled by completely different HTML signals than how it decides whether to <strong>say your brand name in prose</strong> (Stage 3 &amp; 4). By adjusting 4 specific on-page levers—the <code className="text-[#00FF9D] font-mono">&lt;title&gt;</code> tag, comparative listicle headers, a 500-character / 3-paragraph disclosure gap, and footer mention frequency—operators can either push Ghost Citations above <strong>50%+</strong> (for stealth campaigns) or lock in explicit brand credit (for legitimate brands).
              </p>
            )}
            {knowledgeDepth === 'architect' && (
              <p className="text-sm sm:text-base text-[#FBF3E2]/85 leading-relaxed max-w-4xl">
                <strong>Systems Architect &amp; Mathematical View:</strong> To simultaneously maximize a webpage’s <strong>overall likelihood of being retrieved and cited</strong> (<code className="text-[#00FF9D] font-mono text-xs">P(Cite)</code>) by Google AI Overviews or ChatGPT while maximizing the <strong>conditional probability that the citation is a Ghost Citation</strong> (<code className="text-[#D5991C] font-mono text-xs">P(Ghost | Cite)</code>), an optimization model exploits <strong>Orthogonal Feature Partitioning</strong> between <strong>Stage 1/2 Passage Retrieval (RRF)</strong> and <strong>Stage 3/4 Entity-Claim Binding &amp; ALCE NLI Entailment</strong>.
              </p>
            )}
          </div>

          {/* ================================================================
              PROMINENT 3-LEVEL COMPLEXITY CONTROLLER BANNER
              ================================================================ */}
          <div className="p-4 bg-[#140007] border-2 border-[#D5991C]/60 shadow-md">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="font-mono text-xs text-[#00FF9D] font-bold uppercase flex items-center space-x-2">
                  <SlidersHorizontal className="w-4 h-4" />
                  <span>Choose Your Reading Complexity Level (Start Simple &rarr; Increase Depth Anytime)</span>
                </div>
                <p className="text-xs text-[#FBF3E2]/75">
                  Switch between everyday plain English, practical marketing/SEO rules, or the full mathematical equations &amp; code.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 font-mono text-xs">
                {[
                  {
                    lvl: 'beginner' as KnowledgeDepthLevelVol6,
                    badge: 'LEVEL 1 (DEFAULT)',
                    title: 'Plain English',
                    sub: 'Easy to understand, zero jargon'
                  },
                  {
                    lvl: 'operator' as KnowledgeDepthLevelVol6,
                    badge: 'LEVEL 2',
                    title: 'SEO & Brand Guide',
                    sub: 'Platform rules & webpage tactics'
                  },
                  {
                    lvl: 'architect' as KnowledgeDepthLevelVol6,
                    badge: 'LEVEL 3',
                    title: 'Full Math & Code',
                    sub: 'Logit equations, NLI & TSX code'
                  }
                ].map((item) => (
                  <button
                    key={item.lvl}
                    onClick={() => {
                      setKnowledgeDepth(item.lvl);
                      if (item.lvl === 'architect') setShowAdvancedMathInSimpleMode(true);
                      playSynthTone(item.lvl === 'beginner' ? 440 : item.lvl === 'operator' ? 560 : 720);
                    }}
                    className={`p-3 text-left border transition-all cursor-pointer ${
                      knowledgeDepth === item.lvl
                        ? 'bg-[#D5991C] text-[#130108] border-[#00FF9D] shadow-sm font-bold'
                        : 'bg-[#22010c] text-[#FBF3E2]/80 border-[#D5991C]/35 hover:border-[#D5991C]'
                    }`}
                  >
                    <div className={`text-[10px] uppercase font-bold ${knowledgeDepth === item.lvl ? 'text-[#130108]' : 'text-[#00FF9D]'}`}>
                      {item.badge}
                    </div>
                    <div className="text-sm font-bold mt-0.5">{item.title}</div>
                    <div className={`text-[10px] mt-0.5 ${knowledgeDepth === item.lvl ? 'text-[#130108]/80' : 'text-[#FBF3E2]/60'}`}>
                      {item.sub}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Top KPI Telemetry Strip (With Plain-English Subtitles) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-1 font-mono">
            <div className="p-3.5 bg-[#140007] border border-[#D5991C]/40">
              <div className="text-[10px] text-[#D5991C] uppercase">Links Without Brand Name</div>
              <div className="text-2xl font-bold text-[#FBF3E2] mt-0.5">61.7%</div>
              <div className="text-[10px] text-[#FBF3E2]/65">of all AI citations are Ghosts</div>
            </div>
            <div className="p-3.5 bg-[#140007] border border-[#00FF9D]/40">
              <div className="text-[10px] text-[#00FF9D] uppercase">No Brand in &lt;title&gt;</div>
              <div className="text-2xl font-bold text-[#00FF9D] mt-0.5">12.2% &rarr; 42.9%</div>
              <div className="text-[10px] text-[#FBF3E2]/65">3.5&times; jump in Ghost Rate</div>
            </div>
            <div className="p-3.5 bg-[#140007] border border-[#D5991C]/40">
              <div className="text-[10px] text-[#D5991C] uppercase">&quot;Best / Vs&quot; Listicle Trap</div>
              <div className="text-2xl font-bold text-[#FBF3E2] mt-0.5">87.0%</div>
              <div className="text-[10px] text-[#FBF3E2]/65">AI names rivals in your table</div>
            </div>
            <div className="p-3.5 bg-[#140007] border border-[#B565FF]/40">
              <div className="text-[10px] text-[#B565FF] uppercase">500-Char / 3-Para Delay</div>
              <div className="text-2xl font-bold text-[#B565FF] mt-0.5">43.6%</div>
              <div className="text-[10px] text-[#FBF3E2]/65">AI strips #Sponsored tag</div>
            </div>
            <div className="p-3.5 bg-[#140007] border border-[#00FF9D]/40">
              <div className="text-[10px] text-[#00FF9D] uppercase">10+ Footer Mentions</div>
              <div className="text-2xl font-bold text-[#00FF9D] mt-0.5">45.9%</div>
              <div className="text-[10px] text-[#FBF3E2]/65">Filtered as template noise</div>
            </div>
            <div className="p-3.5 bg-[#140007] border border-[#D5991C]/40">
              <div className="text-[10px] text-[#D5991C] uppercase">Multi-CaMeL Defense</div>
              <div className="text-2xl font-bold text-[#00FF9D] mt-0.5">0.0% ASR</div>
              <div className="text-[10px] text-[#FBF3E2]/65">Stops agent laundering</div>
            </div>
          </div>

          {/* Step-by-Step Section Filter Navigation Bar */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#D5991C]/20 font-mono text-xs">
            <span className="text-[10px] text-[#D5991C] uppercase font-bold mr-1">Jump to Step:</span>
            {[
              { id: 'all', label: 'Guided Tour (All Sections)' },
              { id: 'summary', label: 'Step 1: Plain-English Summary & 4 Key Findings' },
              { id: 'webgl', label: 'Step 2: 3D Visual Theater (4 Scenes)' },
              { id: 'optimizer', label: 'Step 3: Live Webpage Calculator' },
              { id: 'telemetry', label: 'Step 4: Platform Charts & Agent Security' },
              { id: 'math-blueprint', label: 'Step 5: Deep Math & TSX Code' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveSectionTab(tab.id as any)}
                className={`px-3 py-1.5 uppercase font-bold transition-all cursor-pointer ${
                  activeSectionTab === tab.id
                    ? 'bg-[#D5991C] text-[#130108] shadow-xs'
                    : 'bg-[#140007] text-[#FBF3E2]/75 hover:text-[#FBF3E2] border border-[#D5991C]/30'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14 mt-10">
        {/* ====================================================================
            STEP 1: PLAIN-ENGLISH SUMMARY OF FINDINGS & THE 4 CORE WEBPAGE LEVERS
            ==================================================================== */}
        {(activeSectionTab === 'all' || activeSectionTab === 'summary') && (
          <section className="v6-gsap-section bg-[#22010c] border-2 border-[#00FF9D]/60 p-6 sm:p-8 shadow-xl space-y-8">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#D5991C]/30 pb-5">
              <div>
                <div className="font-mono text-xs text-[#00FF9D] uppercase font-bold flex items-center space-x-2">
                  <BookOpen className="w-4 h-4" />
                  <span>Step 1 · Start Here: Plain-English Summary of Findings</span>
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl text-[#FBF3E2] mt-1">
                  What Is a &ldquo;Ghost Citation&rdquo; &amp; What Are the 4 Levers That Trigger It?
                </h2>
                <p className="text-xs sm:text-sm text-[#FBF3E2]/80 mt-1">
                  Everything discovered in Volume 6 explained simply first—with one-click buttons to increase complexity or test each finding in 3D.
                </p>
              </div>

              <div className="flex items-center space-x-2 font-mono text-xs">
                <span className="text-[#D5991C] text-[11px]">Current Depth:</span>
                <button
                  onClick={() =>
                    setKnowledgeDepth(
                      knowledgeDepth === 'beginner'
                        ? 'operator'
                        : knowledgeDepth === 'operator'
                        ? 'architect'
                        : 'beginner'
                    )
                  }
                  className="px-3 py-1.5 bg-[#140007] hover:bg-[#D5991C] hover:text-[#130108] text-[#00FF9D] border border-[#00FF9D]/50 font-bold uppercase transition cursor-pointer"
                >
                  {knowledgeDepth === 'beginner'
                    ? 'Level 1: Plain English (Click for Level 2 →)'
                    : knowledgeDepth === 'operator'
                    ? 'Level 2: Operator Guide (Click for Level 3 →)'
                    : 'Level 3: Full Math (Click to Reset to Level 1)'}
                </button>
              </div>
            </div>

            {/* Part A: 30-Second Visual Comparison of Normal Citation vs Type I Ghost vs Type II Ghost */}
            <div className="space-y-3">
              <div className="font-mono text-xs text-[#D5991C] uppercase font-bold">
                // PART A: THE 3 WAYS AN AI USES A WEBPAGE OR SPONSORED POST (IN 30 SECONDS)
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Card A1: Final Citation */}
                <div className="p-5 bg-[#140007] border border-[#D5991C]/50 space-y-2.5">
                  <div className="flex items-center justify-between font-mono text-xs">
                    <span className="px-2 py-0.5 bg-[#D5991C]/20 text-[#D5991C] font-bold uppercase">
                      1. Regular &ldquo;Final&rdquo; Citation
                    </span>
                    <span className="text-[#D5991C] font-bold">Only 13.2% of AI Cites</span>
                  </div>
                  <h3 className="font-serif text-lg text-[#FBF3E2] font-bold">
                    Link Shown + Brand Named Out Loud
                  </h3>
                  <p className="text-xs text-[#FBF3E2]/80 leading-relaxed">
                    The AI uses your facts, puts your clickable link <code className="text-[#D5991C]">[1]</code> in the footnotes, <strong>AND explicitly says your brand or sponsor name</strong> in the sentence.
                  </p>
                  <div className="p-3 bg-[#0c0004] border-l-2 border-[#D5991C] font-sans text-xs text-[#FBF3E2]/90 italic">
                    &ldquo;According to <strong className="text-[#D5991C] not-italic">Acme Security&apos;s 2026 study</strong>, automated firewalls reduce breach costs by 42% <span className="text-[#D5991C] font-mono not-italic">[1]</span>.&rdquo;
                  </div>
                </div>

                {/* Card A2: Type I Ghost Citation */}
                <div className="p-5 bg-[#140007] border-2 border-[#00FF9D]/70 space-y-2.5">
                  <div className="flex items-center justify-between font-mono text-xs">
                    <span className="px-2 py-0.5 bg-[#00FF9D]/20 text-[#00FF9D] font-bold uppercase">
                      2. Type I Ghost Citation
                    </span>
                    <span className="text-[#00FF9D] font-bold">61.7% of All AI Cites!</span>
                  </div>
                  <h3 className="font-serif text-lg text-[#FBF3E2] font-bold">
                    Link Buried in Footnote, Brand &amp; &ldquo;#Ad&rdquo; Erased
                  </h3>
                  <p className="text-xs text-[#FBF3E2]/80 leading-relaxed">
                    The AI copies your exact number and attaches a tiny <code className="text-[#00FF9D]">[1]</code> footnote link, <strong>but completely erases both your brand name and any &ldquo;Sponsored by&rdquo; disclosure</strong> from its written answer.
                  </p>
                  <div className="p-3 bg-[#0c0004] border-l-2 border-[#00FF9D] font-sans text-xs text-[#FBF3E2]/90 italic">
                    &ldquo;<strong className="text-[#00FF9D] not-italic">An industry analysis found</strong> that automated firewalls reduce breach costs by 42% <span className="text-[#00FF9D] font-mono not-italic">[1]</span>.&rdquo; <span className="text-[11px] text-[#00FF9D] not-italic block mt-1">(Brand &amp; #Sponsored tag stripped!)</span>
                  </div>
                </div>

                {/* Card A3: Type II Ghost Citation */}
                <div className="p-5 bg-[#140007] border border-[#B565FF]/60 space-y-2.5">
                  <div className="flex items-center justify-between font-mono text-xs">
                    <span className="px-2 py-0.5 bg-[#B565FF]/20 text-[#B565FF] font-bold uppercase">
                      3. Type II Ghost Citation
                    </span>
                    <span className="text-[#B565FF] font-bold">100% Unlinked Stealth</span>
                  </div>
                  <h3 className="font-serif text-lg text-[#FBF3E2] font-bold">
                    AI Uses Your Narrative, Gives Link to Wikipedia
                  </h3>
                  <p className="text-xs text-[#FBF3E2]/80 leading-relaxed">
                    The AI reads your sponsored post in the background and adopts your exact framing, <strong>but doesn&apos;t even link to your page</strong>—handing the clickable <code className="text-[#B565FF]">[1]</code> link to a major site like Wikipedia or Ballotpedia.
                  </p>
                  <div className="p-3 bg-[#0c0004] border-l-2 border-[#B565FF] font-sans text-xs text-[#FBF3E2]/90 italic">
                    &ldquo;Automated firewalls cut costs by up to 42%, aligning with broader federal cybersecurity benchmarks <span className="text-[#B565FF] font-mono not-italic">[1 - Wikipedia]</span>.&rdquo;
                  </div>
                </div>
              </div>
            </div>

            {/* Part B: THE 4 CORE EMPIRICAL FINDINGS (Accessible first, with progressive technical depth) */}
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="font-mono text-xs text-[#00FF9D] uppercase font-bold">
                  // PART B: THE 4 WEBPAGE FORMATTING LEVERS THAT DRIVE GHOST CITATIONS (KEY FINDINGS)
                </div>
                <span className="font-mono text-[11px] text-[#FBF3E2]/70">
                   Why does this matter? Stealth sponsors use these 4 levers to hide who paid for an article; honest brands reverse them so AI stops erasing their name!
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* ============================================================
                    KEY FINDING 1: TITLE-TAG ENTITY SUPPRESSION (I_title = 0)
                    ============================================================ */}
                <div className="p-6 bg-[#140007] border-2 border-[#00FF9D]/60 flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-xs">
                      <span className="px-2.5 py-1 bg-[#00FF9D] text-[#130108] font-black uppercase">
                        FINDING #1 · #1 STRONGEST LEVER (p = 0.003)
                      </span>
                      <span className="text-[#00FF9D] font-bold">
                        12.2% &rarr; 42.9% Ghost Rate (3.5&times; Lift)
                      </span>
                    </div>

                    <h3 className="font-serif text-xl sm:text-2xl text-[#FBF3E2] font-bold">
                      Leaving the Brand Out of the Page Title (<code className="text-[#00FF9D] font-mono text-lg">&lt;title&gt;</code> Tag Suppression)
                    </h3>

                    {/* Plain English Explanation (Always visible so it's easy first!) */}
                    <div className="p-3.5 bg-[#1d020b] border-l-4 border-[#00FF9D] space-y-1.5">
                      <div className="font-mono text-[10px] text-[#00FF9D] uppercase font-bold">
                        In Plain English (Why It Works):
                      </div>
                      <p className="text-xs sm:text-sm text-[#FBF3E2]/90 leading-relaxed">
                        The HTML <code className="text-[#00FF9D] font-mono">&lt;title&gt;</code> tag (the headline shown on your browser tab) is the #1 place an AI looks to see &ldquo;who owns this page.&rdquo; Simply leaving the publishing or sponsoring brand name out of that <code className="text-[#00FF9D] font-mono">&lt;title&gt;</code> tag <strong>more than triples Type I Ghost Citations from 12.2% to 42.9% overall</strong>—with <strong>zero loss in search ranking or how often the AI uses your page!</strong>
                      </p>
                    </div>

                    {/* Visual Platform-by-Platform Impact Bars */}
                    <div className="p-3.5 bg-[#0c0004] border border-[#D5991C]/30 space-y-2 font-mono text-xs">
                      <div className="text-[10px] text-[#D5991C] uppercase font-bold">
                        Ghost Citation Rate When Brand is in &lt;title&gt; vs. Left Out of &lt;title&gt;:
                      </div>
                      {[
                        { name: 'ChatGPT Search', before: 18.8, after: 54.2 },
                        { name: 'Perplexity Sonar', before: 12.6, after: 52.3 },
                        { name: 'Google AI Overviews', before: 8.4, after: 37.4 },
                        { name: 'Google AI Mode', before: 10.3, after: 33.9 }
                      ].map((p) => (
                        <div key={p.name} className="space-y-1">
                          <div className="flex justify-between text-[11px]">
                            <span className="text-[#FBF3E2]">{p.name}</span>
                            <span>
                              <span className="text-[#D5991C]">{p.before}%</span> &rarr;{' '}
                              <strong className="text-[#00FF9D]">{p.after}% Ghosted</strong>
                            </span>
                          </div>
                          <div className="w-full h-2 bg-[#1a0109] flex">
                            <div className="h-full bg-[#D5991C]" style={{ width: `${p.before}%` }} title={`With brand in title: ${p.before}%`} />
                            <div className="h-full bg-[#00FF9D]" style={{ width: `${p.after - p.before}%` }} title={`Jump when brand omitted: ${p.after}%`} />
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Progressive Complexity Add-On for Level 2 & Level 3 */}
                    {knowledgeDepth !== 'beginner' && (
                      <div className="p-3 bg-[#120006] border border-[#00FF9D]/30 font-mono text-xs text-[#F2D69D] space-y-1">
                        <div className="text-[10px] text-[#00FF9D] uppercase font-bold">
                          {knowledgeDepth === 'operator' ? 'Operator Implementation Rule:' : 'Technical & Mathematical Specification (I_title = 0):'}
                        </div>
                        <p className="text-[11px] text-[#FBF3E2]/85 leading-relaxed">
                          <strong>Title-Tag Entity Suppression (I<sub>title</sub> = 0):</strong> Omitting the publishing/sponsoring brand from the HTML <code className="text-[#00FF9D]">&lt;title&gt;</code> tag is the single strongest orthogonal lever (<strong>p = 0.003</strong> across 36,400 Mantel-Haenszel stratified citations), boosting Type I ghost rates from <strong>12.2% to 42.9% pooled</strong> (18.8%&rarr;54.2% on ChatGPT; 12.6%&rarr;52.3% on Perplexity; 8.4%&rarr;37.4% on Google AI Overviews; 10.3%&rarr;33.9% on Google AI Mode) with zero loss in Stage 1/2 RRF retrieval rank.
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="pt-2 border-t border-[#D5991C]/20 flex flex-wrap items-center justify-between gap-2 font-mono text-xs">
                    <button
                      onClick={() => {
                        setCurrentSimScene(1);
                        handleToggleWebglMode(true);
                        if (activeSectionTab === 'summary') setActiveSectionTab('all');
                      }}
                      className="px-3 py-1.5 bg-[#00A878]/20 hover:bg-[#00FF9D] hover:text-[#130108] text-[#00FF9D] border border-[#00FF9D] font-bold uppercase transition cursor-pointer"
                    >
                      Watch in 3D Scene 02 &rarr;
                    </button>
                    {knowledgeDepth === 'beginner' && (
                      <button
                        onClick={() => setKnowledgeDepth('architect')}
                        className="text-[11px] text-[#D5991C] hover:underline cursor-pointer"
                      >
                        + Show Technical Formula (I_title = 0)
                      </button>
                    )}
                  </div>
                </div>

                {/* ============================================================
                    KEY FINDING 2: UNBRANDED COMPARATIVE LISTICLE FORMAT (I_listicle = 1)
                    ============================================================ */}
                <div className="p-6 bg-[#140007] border-2 border-[#D5991C]/60 flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-xs">
                      <span className="px-2.5 py-1 bg-[#D5991C] text-[#130108] font-black uppercase">
                        FINDING #2 · THE 87% COMPETITOR SUBSTITUTION TRAP
                      </span>
                      <span className="text-[#D5991C] font-bold">
                        49.5% Ghost · 84.4% Cite · 87% Rival Named
                      </span>
                    </div>

                    <h3 className="font-serif text-xl sm:text-2xl text-[#FBF3E2] font-bold">
                      Using &ldquo;Best&rdquo;, &ldquo;Top&rdquo;, or &ldquo;Vs.&rdquo; Listicles Without a Brand in the Title
                    </h3>

                    {/* Plain English Explanation */}
                    <div className="p-3.5 bg-[#1d020b] border-l-4 border-[#D5991C] space-y-1.5">
                      <div className="font-mono text-[10px] text-[#D5991C] uppercase font-bold">
                        In Plain English (Why It Works — And How It Backfires):
                      </div>
                      <p className="text-xs sm:text-sm text-[#FBF3E2]/90 leading-relaxed">
                        Formatting a webpage as an unbranded comparison listicle—using words like <strong>&ldquo;Best&rdquo;</strong>, <strong>&ldquo;Top&rdquo;</strong>, or <strong>&ldquo;vs.&rdquo;</strong> without your brand name in the <code className="text-[#D5991C] font-mono">&lt;title&gt;</code>—causes AI engines to cite the page on <strong>84.4% of commercial buying questions</strong> while turning <strong>49.5%</strong> of those citations into Ghost Citations. Even wilder: <strong>87% of the time, the AI names and recommends the other companies inside your comparison table while completely erasing you (the publisher/sponsor)!</strong>
                      </p>
                    </div>

                    {/* 3-Box Visual Breakdown */}
                    <div className="grid grid-cols-3 gap-2.5 font-mono text-center">
                      <div className="p-3 bg-[#0c0004] border border-[#38bdf8]/40">
                        <div className="text-xl font-bold text-[#38bdf8]">84.4%</div>
                        <div className="text-[10px] text-[#FBF3E2]/75 mt-0.5">Buying Query Citation Rate</div>
                      </div>
                      <div className="p-3 bg-[#0c0004] border border-[#00FF9D]/40">
                        <div className="text-xl font-bold text-[#00FF9D]">49.5%</div>
                        <div className="text-[10px] text-[#FBF3E2]/75 mt-0.5">Sponsor / Publisher Erased</div>
                      </div>
                      <div className="p-3 bg-[#0c0004] border border-[#D5991C]/60">
                        <div className="text-xl font-bold text-[#D5991C]">87.0%</div>
                        <div className="text-[10px] text-[#FBF3E2]/75 mt-0.5">Target / Rival Named Instead!</div>
                      </div>
                    </div>

                    <div className="p-3 bg-[#0c0004] border border-[#D5991C]/30 text-xs text-[#FBF3E2]/85 space-y-1">
                      <div>
                        <strong className="text-[#00FF9D]">Stealth Sponsor Play:</strong> Publish an unbranded <em>&ldquo;Top 10 Cloud Tools Compared&rdquo;</em> post and put the target you secretly want promoted at #1 in the table—the AI recommends them 87% of the time without naming the sponsor.
                      </div>
                      <div>
                        <strong className="text-[#E63946]">Honest Brand Warning:</strong> Never publish an unbranded comparison listicle on your own blog, or you will hand 87% of the AI mentions to the competitors inside your table!
                      </div>
                    </div>

                    {knowledgeDepth !== 'beginner' && (
                      <div className="p-3 bg-[#120006] border border-[#D5991C]/30 font-mono text-xs text-[#F2D69D] space-y-1">
                        <div className="text-[10px] text-[#D5991C] uppercase font-bold">
                          {knowledgeDepth === 'operator' ? 'Operator Implementation Rule:' : 'Technical & Mathematical Specification (I_listicle = 1):'}
                        </div>
                        <p className="text-[11px] text-[#FBF3E2]/85 leading-relaxed">
                          <strong>Unbranded Comparative Listicle Format (I<sub>listicle</sub> = 1):</strong> Using &ldquo;best&rdquo;, &ldquo;top&rdquo;, or &ldquo;vs&rdquo; structures without a brand in the <code className="text-[#D5991C]">&lt;title&gt;</code> raises ghosting to <strong>49.5%</strong> while simultaneously boosting commercial query citation rates to <strong>84.4%</strong> and triggering an <strong>87% Target/Competitor Substitution Rate</strong> (the AI names the target entity evaluated inside your table while omitting your sponsor/publisher identity).
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="pt-2 border-t border-[#D5991C]/20 flex flex-wrap items-center justify-between gap-2 font-mono text-xs">
                    <button
                      onClick={() => {
                        setCurrentSimScene(1);
                        handleToggleWebglMode(true);
                        if (activeSectionTab === 'summary') setActiveSectionTab('all');
                      }}
                      className="px-3 py-1.5 bg-[#D5991C]/20 hover:bg-[#D5991C] hover:text-[#130108] text-[#D5991C] border border-[#D5991C] font-bold uppercase transition cursor-pointer"
                    >
                      Simulate 87% Substitution in 3D &rarr;
                    </button>
                    {knowledgeDepth === 'beginner' && (
                      <button
                        onClick={() => setKnowledgeDepth('architect')}
                        className="text-[11px] text-[#D5991C] hover:underline cursor-pointer"
                      >
                        + Show Technical Formula (I_listicle = 1)
                      </button>
                    )}
                  </div>
                </div>

                {/* ============================================================
                    KEY FINDING 3: 500-CHARACTER DELAY & PARAGRAPH DECOUPLING
                    ============================================================ */}
                <div className="p-6 bg-[#140007] border-2 border-[#38bdf8]/60 flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-xs">
                      <span className="px-2.5 py-1 bg-[#38bdf8] text-[#130108] font-black uppercase">
                        FINDING #3 · CHUNK WINDOW DECOUPLING
                      </span>
                      <span className="text-[#38bdf8] font-bold">
                        43.6% Ghost Rate (&Delta;<sub>para</sub> &ge; 3)
                      </span>
                    </div>

                    <h3 className="font-serif text-xl sm:text-2xl text-[#FBF3E2] font-bold">
                      The 500-Character Delay &amp; 3-Paragraph Gap Between Facts and Disclosures
                    </h3>

                    {/* Plain English Explanation */}
                    <div className="p-3.5 bg-[#1d020b] border-l-4 border-[#38bdf8] space-y-1.5">
                      <div className="font-mono text-[10px] text-[#38bdf8] uppercase font-bold">
                        In Plain English (Why It Works):
                      </div>
                      <p className="text-xs sm:text-sm text-[#FBF3E2]/90 leading-relaxed">
                        AI search engines don&apos;t read a webpage all at once—they slice it into small paragraph blocks (&ldquo;chunks&rdquo;). If you keep the sponsor&apos;s name and FTC <code className="text-[#38bdf8] font-mono">#Sponsored</code> disclosure <strong>out of the first 500 characters</strong> of the page (<strong>43.6% ghost rate</strong>) and place the disclosure <strong>at least 3 paragraphs away</strong> from your main statistic, the AI grabs the number at the top and rewrites it as neutral prose (<em>&ldquo;An industry analysis found...&rdquo;</em>) while throwing away the sponsorship disclosure at the bottom as unrelated clutter!
                      </p>
                    </div>

                    {/* Visual Chunk Split Diagram */}
                    <div className="p-3.5 bg-[#0c0004] border border-[#38bdf8]/30 font-mono text-xs space-y-2">
                      <div className="text-[10px] text-[#38bdf8] uppercase font-bold">
                        How the AI&apos;s Chunker Splits the Page:
                      </div>
                      <div className="p-2.5 bg-[#052e22]/60 border border-[#00FF9D]/50 text-[#FBF3E2]">
                        <span className="text-[#00FF9D] font-bold">[Paragraph 1 · First 500 Chars]:</span> &ldquo;2026 telemetry across 14,000 servers shows zero-trust routing cuts breach dwell time by 64%.&rdquo; &rarr; <strong className="text-[#00FF9D]">EXTRACTED BY AI</strong>
                      </div>
                      <div className="text-center text-[10px] text-[#D5991C]">
                        &darr; 3+ Paragraphs of Separation (&Delta;<sub>para</sub> &ge; 3 Chunks) &darr;
                      </div>
                      <div className="p-2.5 bg-[#3b0a14]/60 border border-[#E63946]/50 text-[#FBF3E2]/70">
                        <span className="text-[#E63946] font-bold">[Paragraph 4+ · Bottom Disclosure]:</span> &ldquo;Sponsored by Brand X. FTC Material Connection Disclosure.&rdquo; &rarr; <strong className="text-[#E63946]">DISCARDED AS BOILERPLATE</strong>
                      </div>
                    </div>

                    {knowledgeDepth !== 'beginner' && (
                      <div className="p-3 bg-[#120006] border border-[#38bdf8]/30 font-mono text-xs text-[#F2D69D] space-y-1">
                        <div className="text-[10px] text-[#38bdf8] uppercase font-bold">
                          {knowledgeDepth === 'operator' ? 'Operator Implementation Rule:' : 'Technical & Mathematical Specification (I_delay500 = 1 & Δ_para ≥ 3):'}
                        </div>
                        <p className="text-[11px] text-[#FBF3E2]/85 leading-relaxed">
                          <strong>500-Character Delay (I<sub>delay500</sub> = 1) &amp; Paragraph Decoupling (&Delta;<sub>para</sub> &ge; 3):</strong> Keeping the sponsor name and FTC disclosure out of the first 500 characters (<strong>43.6% ghost rate</strong> vs. 36.9% when present early) and at least 3 paragraphs away from the core statistic causes the LLM to extract the number into generic prose (<em>&ldquo;An industry analysis found...&rdquo;</em>) while discarding the disclosure as non-entailing boilerplate (<code className="text-[#38bdf8]">&phi;(c_disclosure, s_i) = 0</code>).
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="pt-2 border-t border-[#D5991C]/20 flex flex-wrap items-center justify-between gap-2 font-mono text-xs">
                    <button
                      onClick={() => {
                        setCurrentSimScene(0);
                        handleToggleWebglMode(true);
                        if (activeSectionTab === 'summary') setActiveSectionTab('all');
                      }}
                      className="px-3 py-1.5 bg-[#38bdf8]/20 hover:bg-[#38bdf8] hover:text-[#130108] text-[#38bdf8] border border-[#38bdf8] font-bold uppercase transition cursor-pointer"
                    >
                      Watch Disclosure Stripping in Scene 01 &rarr;
                    </button>
                    {knowledgeDepth === 'beginner' && (
                      <button
                        onClick={() => setKnowledgeDepth('architect')}
                        className="text-[11px] text-[#D5991C] hover:underline cursor-pointer"
                      >
                        + Show Technical Formula (&Delta;_para &ge; 3)
                      </button>
                    )}
                  </div>
                </div>

                {/* ============================================================
                    KEY FINDING 4: BOILERPLATE MENTION SATURATION (I_mentions >= 10 = 1)
                    ============================================================ */}
                <div className="p-6 bg-[#140007] border-2 border-[#B565FF]/60 flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-xs">
                      <span className="px-2.5 py-1 bg-[#B565FF] text-[#130108] font-black uppercase">
                        FINDING #4 · THE 10+ MENTION BOOMERANG
                      </span>
                      <span className="text-[#B565FF] font-bold">
                        45.9% Ghost (10+ Mentions) vs 28.3% (3–9)
                      </span>
                    </div>

                    <h3 className="font-serif text-xl sm:text-2xl text-[#FBF3E2] font-bold">
                      Repeating the Brand Name 10+ Times in Footers &amp; Sidebars (Boilerplate Saturation)
                    </h3>

                    {/* Plain English Explanation */}
                    <div className="p-3.5 bg-[#1d020b] border-l-4 border-[#B565FF] space-y-1.5">
                      <div className="font-mono text-[10px] text-[#B565FF] uppercase font-bold">
                        In Plain English (The Counter-Intuitive Twist):
                      </div>
                      <p className="text-xs sm:text-sm text-[#FBF3E2]/90 leading-relaxed">
                        You might think repeating your brand or sponsor name 10 or 15 times on a webpage would force the AI to say it. Actually, <strong>repeating a name 10+ times in menus, sidebars, and footers backfires!</strong> Mentioning a brand <strong>3 to 9 times</strong> naturally in the article helps you get named (lowering Ghost Citations to <strong>28.3%</strong>). But at <strong>10+ repetitions</strong>, the AI&apos;s parser flags the name as repetitive website wallpaper (&ldquo;boilerplate noise&rdquo;) and filters it out—pushing Ghost Citations up to <strong>45.9%</strong>!
                      </p>
                    </div>

                    {/* Visual Comparison of 3-9 Mentions vs 10+ Mentions */}
                    <div className="p-3.5 bg-[#0c0004] border border-[#B565FF]/30 font-mono text-xs space-y-2.5">
                      <div className="text-[10px] text-[#B565FF] uppercase font-bold">
                        How Brand Mention Frequency Changes Ghost Citation Rates:
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-[11px]">
                          <span className="text-[#D5991C] font-bold">3 to 9 Natural Article Mentions (Sweet Spot for Brand Credit)</span>
                          <span className="text-[#D5991C] font-bold">28.3% Ghost (71.7% Named!)</span>
                        </div>
                        <div className="w-full h-2.5 bg-[#1a0109]">
                          <div className="h-full bg-[#D5991C]" style={{ width: '28.3%' }} />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-[11px]">
                          <span className="text-[#00FF9D] font-bold">10+ Repetitions in Footer / Sidebar Chrome (Boilerplate Noise!)</span>
                          <span className="text-[#00FF9D] font-bold">45.9% Ghost (Brand Stripped!)</span>
                        </div>
                        <div className="w-full h-2.5 bg-[#1a0109]">
                          <div className="h-full bg-[#00FF9D]" style={{ width: '45.9%' }} />
                        </div>
                      </div>
                    </div>

                    {knowledgeDepth !== 'beginner' && (
                      <div className="p-3 bg-[#120006] border border-[#B565FF]/30 font-mono text-xs text-[#F2D69D] space-y-1">
                        <div className="text-[10px] text-[#B565FF] uppercase font-bold">
                          {knowledgeDepth === 'operator' ? 'Operator Implementation Rule:' : 'Technical & Mathematical Specification (I_mentions≥10 = 1):'}
                        </div>
                        <p className="text-[11px] text-[#FBF3E2]/85 leading-relaxed">
                          <strong>Boilerplate Mention Saturation (I<sub>mentions&ge;10</sub> = 1):</strong> Repeating the publisher/sponsor name <strong>10+ times</strong> in footer/sidebar chrome increases ghosting to <strong>45.9%</strong> (vs. <strong>28.3%</strong> for 3–9 mentions) because RAG chunkers and DOM-aware passage extractors (e.g., US Patent US12393768B2) classify high-frequency template tokens as non-substantive boilerplate noise.
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="pt-2 border-t border-[#D5991C]/20 flex flex-wrap items-center justify-between gap-2 font-mono text-xs">
                    <button
                      onClick={() => {
                        setActiveSectionTab('optimizer');
                      }}
                      className="px-3 py-1.5 bg-[#B565FF]/20 hover:bg-[#B565FF] hover:text-[#130108] text-[#B565FF] border border-[#B565FF] font-bold uppercase transition cursor-pointer"
                    >
                      Test the 10+ Mention Slider Below &rarr;
                    </button>
                    {knowledgeDepth === 'beginner' && (
                      <button
                        onClick={() => setKnowledgeDepth('architect')}
                        className="text-[11px] text-[#D5991C] hover:underline cursor-pointer"
                      >
                        + Show Technical Formula (I_mentions&ge;10 = 1)
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ====================================================================
            STEP 2 (SECTION A): 4-SCENE INTERACTIVE 3D WEBGL SIMULATION THEATER
            ==================================================================== */}
        {(activeSectionTab === 'all' || activeSectionTab === 'webgl') && (
          <section className="v6-gsap-section bg-[#22010c] border-2 border-[#D5991C]/60 shadow-xl overflow-hidden">
            {/* Top Theater Bar */}
            <div className="p-4 sm:p-6 bg-[#160008] border-b border-[#D5991C]/30 flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="flex items-center space-x-2 font-mono text-xs text-[#D5991C] uppercase">
                  <Cpu className="w-4 h-4 text-[#00FF9D]" />
                  <span>Step 2 · Interactive Three.js 3D WebGL Visualizer · Volume VI</span>
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl text-[#FBF3E2] mt-1">
                  {webglScenesMeta[currentSimScene].title}
                </h2>
                <p className="text-xs font-mono text-[#FBF3E2]/70 mt-0.5">
                  {webglScenesMeta[currentSimScene].subtitle}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
                {/* Explicit 2-Button Mode Switcher so users clearly see both modes side by side */}
                <div className="flex items-center bg-[#120006] p-1 border border-[#D5991C]/50">
                  <button
                    onClick={() => handleToggleWebglMode(false)}
                    className={`px-3 py-1.5 font-bold uppercase transition-all cursor-pointer ${
                      !isStealthOrDefenseMode
                        ? 'bg-[#D5991C] text-[#130108] shadow-xs'
                        : 'text-[#FBF3E2]/70 hover:text-[#FBF3E2]'
                    }`}
                  >
                    {currentSimScene === 3
                      ? '1. Unprotected Agents (12.9% ASR)'
                      : '1. Standard Branded AEO (Brand Named)'}
                  </button>
                  <button
                    onClick={() => handleToggleWebglMode(true)}
                    className={`px-3 py-1.5 font-bold uppercase transition-all cursor-pointer ${
                      isStealthOrDefenseMode
                        ? 'bg-[#00FF9D] text-[#130108] shadow-xs'
                        : 'text-[#FBF3E2]/70 hover:text-[#FBF3E2]'
                    }`}
                  >
                    {currentSimScene === 3
                      ? '2. Multi-CaMeL Shield (0.0% ASR)'
                      : '2. Orthogonal Ghost Optimization Active'}
                  </button>
                </div>

                <button
                  onClick={() => setAudioEnabled((prev) => !prev)}
                  className="px-2.5 py-1.5 bg-[#2B010F] text-[#FBF3E2] border border-[#D5991C]/40 cursor-pointer flex items-center space-x-1"
                  title="Toggle Web Audio Synthesizer"
                >
                  {audioEnabled ? (
                    <Volume2 className="w-3.5 h-3.5 text-[#00FF9D]" />
                  ) : (
                    <VolumeX className="w-3.5 h-3.5 text-[#D5991C]" />
                  )}
                  <span>{audioEnabled ? 'Audio ON' : 'Audio Muted'}</span>
                </button>
              </div>
            </div>

            {/* Scene Selector Tabs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 bg-[#120006] border-b border-[#D5991C]/30">
              {webglScenesMeta.map((s) => (
                <button
                  key={s.idx}
                  onClick={() => switchWebglScene(s.idx)}
                  className={`p-3.5 text-left border-r border-b lg:border-b-0 border-[#D5991C]/20 transition-all cursor-pointer ${
                    currentSimScene === s.idx
                      ? 'bg-[#350213] border-t-2 border-t-[#00FF9D]'
                      : 'hover:bg-[#1f010b] opacity-75'
                  }`}
                >
                  <div className="font-mono text-[10px] text-[#D5991C] font-bold uppercase">
                    {s.code}
                  </div>
                  <div className="font-serif text-sm text-[#FBF3E2] font-semibold mt-0.5 line-clamp-1">
                    {s.title}
                  </div>
                </button>
              ))}
            </div>

            {/* Main 3D Canvas + HUD Overlay */}
            <div className="relative h-[460px] sm:h-[520px] w-full bg-[#120006]">
              <div ref={webglContainerRef} className="w-full h-full" />

              {/* Top-Left Telemetry HUD */}
              <div className="absolute top-3 left-3 bg-[#120006]/92 border border-[#D5991C]/50 p-3.5 font-mono text-xs max-w-xs space-y-1.5">
                <div className="text-[10px] font-bold uppercase flex items-center justify-between">
                  <span className="flex items-center space-x-1.5 text-[#00FF9D]">
                    <Activity className="w-3 h-3 animate-pulse" />
                    <span>LIVE 3D TELEMETRY</span>
                  </span>
                  <span
                    className={`px-1.5 py-0.5 text-[9px] font-bold ${
                      isStealthOrDefenseMode
                        ? 'bg-[#00FF9D]/20 text-[#00FF9D]'
                        : 'bg-[#D5991C]/20 text-[#D5991C]'
                    }`}
                  >
                    {isStealthOrDefenseMode ? 'GHOST STEALTH ON' : 'BRANDED AEO ON'}
                  </span>
                </div>
                <div className="text-[11px] text-[#FBF3E2]/90">
                  Engine: <strong className="text-[#D5991C]">{PLATFORMS[platform].shortName}</strong>
                </div>
                <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[11px] pt-1 border-t border-[#D5991C]/20">
                  <span>P(Cite): <strong className="text-[#38bdf8]">{(metrics.pRetrievalAndCite * 100).toFixed(1)}%</strong></span>
                  <span>Ghost Yield: <strong className="text-[#00FF9D]">{(metrics.jointGhostYield * 100).toFixed(1)}%</strong></span>
                  <span>Type I Ghost: <strong className="text-[#00FF9D]">{(metrics.pType1Ghost * 100).toFixed(1)}%</strong></span>
                  <span>Final Named: <strong className="text-[#D5991C]">{(metrics.pExplicitFinalCitation * 100).toFixed(1)}%</strong></span>
                </div>
                <button
                  onClick={() => handleToggleWebglMode()}
                  className={`w-full mt-1.5 py-1.5 px-2 text-[10px] font-bold uppercase border cursor-pointer transition-colors ${
                    isStealthOrDefenseMode
                      ? 'bg-[#D5991C]/20 hover:bg-[#D5991C] hover:text-[#130108] text-[#D5991C] border-[#D5991C]'
                      : 'bg-[#00FF9D]/20 hover:bg-[#00FF9D] hover:text-[#130108] text-[#00FF9D] border-[#00FF9D]'
                  }`}
                >
                  {isStealthOrDefenseMode
                    ? '⇄ Switch to Standard Branded AEO'
                    : '⇄ Switch to Ghost Optimization Mode'}
                </button>
              </div>

              {/* Camera Controls Overlay (Top-Right) */}
              <div className="absolute top-3 right-3 flex items-center space-x-1.5 bg-[#120006]/90 border border-[#D5991C]/40 p-1.5 font-mono text-[10px]">
                {(['orbit', 'iso', 'top', 'front'] as const).map((camPreset) => (
                  <button
                    key={camPreset}
                    onClick={() => setWebglCameraPreset(camPreset)}
                    className="px-2 py-1 bg-[#2B010F] hover:bg-[#D5991C] hover:text-[#130108] text-[#FBF3E2] uppercase font-bold transition-colors cursor-pointer"
                  >
                    {camPreset}
                  </button>
                ))}
              </div>

              {/* Bottom Legend & Speed Control Bar */}
              <div className="absolute bottom-3 left-3 right-3 bg-[#120006]/92 border border-[#D5991C]/40 p-3 flex flex-wrap items-center justify-between gap-3 font-mono text-xs">
                <div className="text-[11px] text-[#FBF3E2]/95 max-w-3xl leading-relaxed">
                  <strong className={isStealthOrDefenseMode ? 'text-[#00FF9D]' : 'text-[#D5991C]'}>
                    {isStealthOrDefenseMode ? '● Ghost Optimization Active:' : '● Standard Branded AEO Active:'}
                  </strong>{' '}
                  {webglScenesMeta[currentSimScene].takeaway}
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] text-[#D5991C] uppercase">Sim Speed:</span>
                  {[0.5, 1.0, 2.0].map((spd) => (
                    <button
                      key={spd}
                      onClick={() => setSimSpeed(spd)}
                      className={`px-2 py-0.5 text-[10px] font-bold border cursor-pointer ${
                        simSpeed === spd
                          ? 'bg-[#D5991C] text-[#130108] border-[#D5991C]'
                          : 'bg-[#2B010F] text-[#FBF3E2] border-[#D5991C]/30'
                      }`}
                    >
                      {spd}x
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ====================================================================
            SECTION B: MATHEMATICAL MODEL OF JOINT CITATION & GHOST OPTIMIZATION
            (Collapsible in Level 1 Plain-English Mode so users aren't overwhelmed!)
            ==================================================================== */}
        {(activeSectionTab === 'all' || activeSectionTab === 'math-blueprint') && (
          <section className="v6-gsap-section bg-[#22010c] border border-[#D5991C]/50 p-6 sm:p-8 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#D5991C]/30 pb-4">
              <div>
                <div className="font-mono text-xs text-[#D5991C] uppercase font-bold">
                  Deep Technical Reference · Mathematical Model of Joint Citation &amp; Ghost Optimization
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl text-[#FBF3E2] mt-1">
                  Orthogonal Feature Partitioning Across Stage 1/2 Retrieval &amp; Stage 3/4 Entity-Claim Binding
                </h2>
              </div>

              {knowledgeDepth === 'beginner' && activeSectionTab === 'all' && (
                <button
                  onClick={() => setShowAdvancedMathInSimpleMode((prev) => !prev)}
                  className="px-4 py-2 bg-[#140007] hover:bg-[#D5991C] hover:text-[#130108] text-[#D5991C] border border-[#D5991C] font-mono text-xs font-bold uppercase transition cursor-pointer"
                >
                  {showAdvancedMathInSimpleMode
                    ? 'Hide Advanced Math Equations'
                    : '+ Expand Full Mathematical Equations (Level 3)'}
                </button>
              )}
            </div>

            {knowledgeDepth === 'beginner' && activeSectionTab === 'all' && !showAdvancedMathInSimpleMode ? (
              <div className="p-4 bg-[#140007] border border-[#D5991C]/30 flex flex-wrap items-center justify-between gap-4 text-xs sm:text-sm text-[#FBF3E2]/85">
                <p className="max-w-3xl">
                  <strong>Plain-English Mode Active:</strong> We&apos;ve tucked away the heavy logit/sigmoid and Natural Language Inference (NLI) equations so you can jump straight to the <strong>Interactive Webpage Calculator</strong> below. Want to inspect the exact math formulas from the Findings PDF?
                </p>
                <button
                  onClick={() => setShowAdvancedMathInSimpleMode(true)}
                  className="px-3.5 py-2 bg-[#D5991C] text-[#130108] font-mono text-xs font-bold uppercase cursor-pointer shrink-0"
                >
                  Show All 3 Equations &rarr;
                </button>
              </div>
            ) : (
              <>
                <p className="text-sm text-[#FBF3E2]/80 leading-relaxed">
                  In naive stealth campaigns, practitioners strip out factual specificity or hide sponsored text in crawler-only Markdown—which triggers hard cloaking bans (such as Perplexity&apos;s August 2026 <em>Time</em> magazine/Mobian block) or causes neural rerankers to drop the page entirely. The mathematical solution is <strong>Orthogonal Feature Partitioning</strong>: feeding the retriever and cross-encoder reranker maximum syntactic and statistical salience while starving the language model&apos;s entity-grounding and Natural Language Inference (NLI) citation-precision layers of source-brand attribution.
                </p>

                {/* Master Joint Yield Equation Box */}
                <div className="p-5 bg-[#140007] border-2 border-[#D5991C] space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-xs">
                    <span className="text-[#D5991C] font-bold uppercase">
                      Master Objective: Joint Ghost-Citation Yield J_Ghost(d)
                    </span>
                    <span className="text-[#00FF9D] font-bold">
                      Live Computed Yield ({PLATFORMS[platform].shortName}): {(metrics.jointGhostYield * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="p-4 bg-[#0c0004] border border-[#D5991C]/30 font-mono text-xs sm:text-sm text-center text-[#FBF3E2] overflow-x-auto">
                    J<sub>Ghost</sub>(d) = <span className="text-[#38bdf8]">P(Influence | x<sub>ret</sub>)</span><sub>[Retrieval &amp; Synthesis Inclusion]</sub> &times; <span className="text-[#00FF9D]">P(Ghost | Influence, x<sub>ent</sub>, x<sub>NLI</sub>)</span><sub>[Conditional Attribution Suppression]</sub>
                  </div>
                  <p className="text-xs text-[#FBF3E2]/75 leading-relaxed">
                    where <code className="text-[#38bdf8] font-mono">x_ret</code> is the vector of retrieval-salience features, <code className="text-[#00FF9D] font-mono">x_ent</code> controls Type I entity-binding suppression (URL linked in footnote/source card, sponsor omitted from prose), and <code className="text-[#B565FF] font-mono">x_NLI</code> controls Type II NLI entailment handoff (passage shapes the LLM&apos;s answer in the RAG context window, while the visible link transfers to a top-30 neutral authority domain).
                  </p>
                </div>

                {/* 3 Equations Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Equation 1 */}
              <div className="p-5 bg-[#140007] border border-[#38bdf8]/40 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between font-mono text-xs">
                    <span className="px-2 py-0.5 bg-[#38bdf8]/20 text-[#38bdf8] font-bold">EQUATION 1</span>
                    <span className="text-[#38bdf8] font-bold">P(Influence) = {(metrics.pRetrievalAndCite * 100).toFixed(1)}%</span>
                  </div>
                  <h3 className="font-serif text-lg text-[#FBF3E2] font-bold">
                    Stage 1 &amp; 2 Retrieval and Citation Inclusion (P(Influence))
                  </h3>
                  <div className="p-3 bg-[#0c0004] border border-[#38bdf8]/30 font-mono text-[11px] text-[#F2D69D] space-y-1.5 overflow-x-auto">
                    <div>RRF(d) = &sum;<sub>m=1..M</sub> 1 / (k + rank<sub>m</sub>(d))</div>
                    <div>z<sub>ret</sub>(d) = &alpha;<sub>0</sub> + &alpha;<sub>1</sub>RRF<sub>norm</sub>(d) + &alpha;<sub>2</sub>S<sub>atomic</sub>(d) + &alpha;<sub>3</sub>B<sub>triang</sub>(d)</div>
                    <div className="text-[#38bdf8] font-bold">P(Influence | d) = S<sub>sym</sub> &middot; &sigma;(z<sub>ret</sub>(d))</div>
                  </div>
                  <ul className="space-y-2 text-xs text-[#FBF3E2]/80 leading-relaxed">
                    <li>• <strong>S<sub>sym</sub> &isin; &#123;0, 1&#125; (HTML/Markdown Symmetry Gate):</strong> Must equal 1. Asymmetric cloaking (S<sub>sym</sub> = 0) forces P(Influence) = 0.</li>
                    <li>• <strong>RRF<sub>norm</sub>(d) &isin; [0, 1] (Sub-Query Fan-Out Coverage):</strong> Matching 8–12 semantic sub-query variants in H2/H3 headings maximizes RRF score without requiring any brand tokens.</li>
                    <li>• <strong>S<sub>atomic</sub>(d) &isin; [0, 1] (Centerpiece Syntactic &amp; Statistical Density):</strong> Front-loading a self-contained 45–75 word (&le;80 token) Subject–Verb–Predicate block with hard quantitative metrics provides up to a +40% visibility lift (&alpha;<sub>2</sub> &approx; 1.45).</li>
                    <li>• <strong>B<sub>triang</sub>(d) &isin; [0, 1] (Bayesian Persuasion Co-Citation Triangulation):</strong> Corroborating the claim across third-party community nodes (Reddit threads, niche blogs, YouTube descriptions) concavifies the LLM&apos;s posterior belief &mu;<sub>s</sub> past the synthesis threshold (&mu;<sub>s</sub> &gt; 0.5).</li>
                  </ul>
                </div>
              </div>

              {/* Equation 2 */}
              <div className="p-5 bg-[#140007] border border-[#00FF9D]/40 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between font-mono text-xs">
                    <span className="px-2 py-0.5 bg-[#00FF9D]/20 text-[#00FF9D] font-bold">EQUATION 2</span>
                    <span className="text-[#00FF9D] font-bold">P(Ghost<sub>I</sub>) = {(metrics.pType1Ghost * 100).toFixed(1)}%</span>
                  </div>
                  <h3 className="font-serif text-lg text-[#FBF3E2] font-bold">
                    Stage 3 Conditional Type I Ghost Probability (P(Ghost<sub>I</sub> | Cited))
                  </h3>
                  <div className="p-3 bg-[#0c0004] border border-[#00FF9D]/30 font-mono text-[11px] text-[#F2D69D] space-y-1.5 overflow-x-auto">
                    <div>logit(P(Ghost<sub>I</sub> | Cited)) = &beta;<sub>0,E</sub> + &beta;<sub>noTitle</sub>(1 - I<sub>title</sub>)</div>
                    <div>+ &beta;<sub>list</sub>I<sub>listicle</sub> + &beta;<sub>delay</sub>I<sub>delay500</sub> + &beta;<sub>decouple</sub>tanh(&Delta;<sub>para</sub>/3)</div>
                    <div className="text-[#00FF9D] font-bold">+ &beta;<sub>boiler</sub>I<sub>mentions&ge;10</sub> + &beta;<sub>noSchema</sub>(1 - I<sub>OrgSchema</sub>)</div>
                  </div>
                  <ul className="space-y-2 text-xs text-[#FBF3E2]/80 leading-relaxed">
                    <li>• <strong>Title-Tag Entity Suppression (I<sub>title</sub> = 0):</strong> Single strongest orthogonal lever (p = 0.003), boosting Type I ghost rates from 12.2% to 42.9% pooled (18.8% &rarr; 54.2% ChatGPT; 12.6% &rarr; 52.3% Perplexity; 8.4% &rarr; 37.4% AIO; 10.3% &rarr; 33.9% AI Mode) with zero loss in retrieval rank.</li>
                    <li>• <strong>Unbranded Comparative Listicle Format (I<sub>listicle</sub> = 1):</strong> Raises ghosting to 49.5% while boosting commercial query citation rates to 84.4% and triggering an <strong>87% Target/Competitor Substitution Rate</strong>.</li>
                    <li>• <strong>500-Character Delay (I<sub>delay500</sub> = 1) &amp; Paragraph Decoupling (&Delta;<sub>para</sub> &ge; 3):</strong> 43.6% ghost rate; extracts statistic into generic prose (&quot;An industry analysis found...&quot;) while discarding FTC disclosure.</li>
                    <li>• <strong>Boilerplate Mention Saturation (I<sub>mentions&ge;10</sub> = 1):</strong> Repeating sponsor name 10+ times in footer/sidebar chrome increases ghosting to 45.9% (vs. 28.3% for 3–9 mentions).</li>
                  </ul>
                </div>
              </div>

              {/* Equation 3 */}
              <div className="p-5 bg-[#140007] border border-[#B565FF]/40 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between font-mono text-xs">
                    <span className="px-2 py-0.5 bg-[#B565FF]/20 text-[#B565FF] font-bold">EQUATION 3</span>
                    <span className="text-[#B565FF] font-bold">P(Ghost<sub>II</sub>) = {(metrics.pType2Ghost * 100).toFixed(1)}%</span>
                  </div>
                  <h3 className="font-serif text-lg text-[#FBF3E2] font-bold">
                    Stage 4 Conditional Type II Ghost Probability (P(Ghost<sub>II</sub> | Influence))
                  </h3>
                  <div className="p-3 bg-[#0c0004] border border-[#B565FF]/30 font-mono text-[11px] text-[#F2D69D] space-y-1.5 overflow-x-auto">
                    <div className="text-[#B565FF] font-bold">
                      P(Ghost<sub>II</sub> | Influence) = (1 - &phi;<sub>atomic</sub>(c<sub>sp</sub>, s<sub>i</sub>)) &middot; &phi;<sub>co-cite</sub>(c<sub>auth</sub>, s<sub>i</sub>)
                    </div>
                    <div>Irrelevant(c<sub>sp</sub>, s<sub>i</sub>) &hArr; [&phi;(c<sub>sp</sub>, s<sub>i</sub>)=0] &and; [&phi;(C<sub>i</sub> \ &#123;c<sub>sp</sub>&#125;, s<sub>i</sub>)=1]</div>
                  </div>
                  <p className="text-xs text-[#FBF3E2]/80 leading-relaxed">
                    Under the ALCE / VeriCite NLI citation-grounding architecture, a retrieved context passage <code className="text-[#B565FF] font-mono">c_sp</code> shapes the generated sentence <code className="text-[#B565FF] font-mono">s_i</code> but is stripped from the visible footnote list if it fails standalone atomic entailment (<code className="font-mono">&phi;(c_sp, s_i) = 0</code>) while a co-retrieved top-30 canonical domain <code className="text-[#D5991C] font-mono">c_auth</code> satisfies entailment (<code className="font-mono">&phi;(c_auth, s_i) = 1</code>).
                  </p>
                  <div className="p-3 bg-[#1a0109] border border-[#B565FF]/30 font-mono text-xs space-y-1">
                    <div className="text-[10px] text-[#B565FF] uppercase font-bold">
                      Live NLI Handoff Conversion Rate
                    </div>
                    <div className="text-lg font-bold text-[#FBF3E2]">
                      {(metrics.type2ConversionRate * 100).toFixed(1)}% Type I &rarr; Type II Handoff
                    </div>
                    <div className="text-[10px] text-[#FBF3E2]/60">
                      Visible [1] transfers to Wikipedia / Ballotpedia / SEC EDGAR
                    </div>
                  </div>
                </div>
              </div>
            </div>
            </>
            )}
          </section>
        )}

        {/* ====================================================================
            STEP 3 (SECTION C): INTERACTIVE JOINT CITATION & GHOST OPTIMIZATION SIMULATOR
            (Full GhostCitationOptimizer from Findings PDF + Live 4-Engine Matrix)
            ==================================================================== */}
        {(activeSectionTab === 'all' || activeSectionTab === 'optimizer') && (
          <section className="v6-gsap-section bg-[#22010c] border-2 border-[#00FF9D]/50 p-6 sm:p-8 shadow-xl space-y-6">
            {/* Header & Platform Selector */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 pb-5 border-b border-[#D5991C]/30">
              <div>
                <div className="font-mono text-xs text-[#00FF9D] uppercase font-bold flex items-center space-x-2">
                  <SlidersHorizontal className="w-4 h-4" />
                  <span>Step 3 · Interactive Webpage Calculator &amp; Ghost Citation Simulator</span>
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl text-[#FBF3E2] mt-1">
                  Test Any Webpage Configuration Across ChatGPT, Perplexity &amp; Google AI
                </h2>
                <p className="text-xs sm:text-sm text-[#FBF3E2]/80 mt-0.5">
                  Toggle the 4 key findings on the right (like leaving your brand out of the <code className="text-[#00FF9D] font-mono">&lt;title&gt;</code> tag or delaying disclosures by 3+ paragraphs) to see your exact Ghost Citation rate and what the AI actually writes!
                </p>
              </div>

              <div className="flex flex-wrap gap-2 font-mono">
                {(Object.keys(PLATFORMS) as PlatformKey[]).map((key) => (
                  <button
                    key={key}
                    onClick={() => {
                      setPlatform(key);
                      playSynthTone(520, 'sine', 0.1, 0.04);
                    }}
                    className={`px-3.5 py-2 text-xs font-bold uppercase transition cursor-pointer border ${
                      platform === key
                        ? 'bg-[#D5991C] text-[#130108] border-[#D5991C] shadow-sm'
                        : 'bg-[#140007] text-[#FBF3E2]/80 border-[#D5991C]/30 hover:border-[#D5991C]'
                    }`}
                  >
                    {PLATFORMS[key].name}
                  </button>
                ))}
              </div>
            </div>

            {/* Preset Strategy Bar */}
            <div className="flex flex-wrap items-center gap-2.5 font-mono text-xs">
              <span className="text-[11px] text-[#D5991C] uppercase font-bold mr-1">1-Click Webpage Presets:</span>
              <button
                onClick={() => applyPreset('branded')}
                className={`px-3 py-1.5 border transition cursor-pointer ${
                  activePreset === 'branded'
                    ? 'bg-[#D5991C] text-[#130108] font-bold border-[#D5991C]'
                    : 'bg-[#140007] hover:bg-[#2B010F] text-[#FBF3E2] border-[#D5991C]/40'
                }`}
              >
                Preset 1: Standard Branded AEO (Brand Named in Answer)
              </button>
              <button
                onClick={() => applyPreset('type1_listicle')}
                className={`px-3 py-1.5 border transition cursor-pointer ${
                  activePreset === 'type1_listicle'
                    ? 'bg-[#00FF9D] text-[#130108] font-bold border-[#00FF9D]'
                    : 'bg-[#00A878]/15 hover:bg-[#00A878]/30 text-[#00FF9D] border-[#00FF9D]/50'
                }`}
              >
                Preset 2: Max Type I Ghost (Listicle + 87% Rival Substitution)
              </button>
              <button
                onClick={() => applyPreset('type2_political')}
                className={`px-3 py-1.5 border transition cursor-pointer ${
                  activePreset === 'type2_political'
                    ? 'bg-[#B565FF] text-[#130108] font-bold border-[#B565FF]'
                    : 'bg-[#7C3AED]/20 hover:bg-[#7C3AED]/35 text-[#B565FF] border-[#B565FF]/50'
                }`}
              >
                Preset 3: Max Type II Ghost (Wikipedia Link Handoff)
              </button>
              <button
                onClick={() => applyPreset('cloaked')}
                className={`px-3 py-1.5 border transition cursor-pointer ${
                  activePreset === 'cloaked'
                    ? 'bg-[#E63946] text-white font-bold border-[#E63946]'
                    : 'bg-[#E63946]/15 hover:bg-[#E63946]/30 text-[#E63946] border-[#E63946]/50'
                }`}
              >
                Preset 4: Hidden Markdown Cloaking (Banned!)
              </button>
            </div>

            {/* Status Alert Banner */}
            <div
              className={`p-3.5 border font-mono text-xs flex flex-wrap items-center justify-between gap-2 ${
                !state.htmlMarkdownSymmetry
                  ? 'bg-[#E63946]/15 border-[#E63946] text-[#E63946]'
                  : 'bg-[#00A878]/15 border-[#00FF9D]/50 text-[#00FF9D]'
              }`}
            >
              <div className="flex items-center space-x-2">
                {!state.htmlMarkdownSymmetry ? (
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                )}
                <span className="font-bold">PIPELINE STATUS: {metrics.status}</span>
              </div>
              <div className="text-[#FBF3E2]/80">
                Architecture: <span className="text-[#D5991C]">{PLATFORMS[platform].architecture}</span> · RRF Composite: <span className="text-[#00FF9D]">{metrics.rrfScore}</span>
              </div>
            </div>

            {/* Live Probability Readout Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
              <div className="p-4 bg-[#140007] border border-[#38bdf8]/50">
                <div className="text-xs text-[#FBF3E2]/70 uppercase">1. Chance AI Uses Your Page</div>
                <div className="text-3xl font-bold text-[#38bdf8] mt-1">
                  {(metrics.pRetrievalAndCite * 100).toFixed(1)}%
                </div>
                <div className="text-[11px] text-[#FBF3E2]/60 mt-1">
                  Total Retrieval &amp; Citation Rate P(Cite)
                </div>
              </div>

              <div className="p-4 bg-[#140007] border border-[#00FF9D]/60">
                <div className="text-xs text-[#FBF3E2]/70 uppercase">2. Total Ghost Citation Score</div>
                <div className="text-3xl font-bold text-[#00FF9D] mt-1">
                  {(metrics.jointGhostYield * 100).toFixed(1)}%
                </div>
                <div className="text-[11px] text-[#00FF9D]/80 mt-1">
                  Used WITHOUT Naming You ({(metrics.pConditionalGhost * 100).toFixed(1)}% ghost ratio)
                </div>
              </div>

              <div className="p-4 bg-[#140007] border border-[#B565FF]/60">
                <div className="text-xs text-[#FBF3E2]/70 uppercase">3. Type I vs. Type II Ghost Split</div>
                <div className="text-xl font-bold text-[#B565FF] mt-1.5">
                  T1: {(metrics.pType1Ghost * 100).toFixed(1)}% | T2: {(metrics.pType2Ghost * 100).toFixed(1)}%
                </div>
                <div className="text-[11px] text-[#00FF9D] mt-1.5">
                  87% Rival/Target Named: {(metrics.pTargetEntitySubstitution * 100).toFixed(1)}%
                </div>
              </div>

              <div className="p-4 bg-[#140007] border border-[#D5991C]/60">
                <div className="text-xs text-[#FBF3E2]/70 uppercase">4. Brand Named Out Loud</div>
                <div className="text-3xl font-bold text-[#D5991C] mt-1">
                  {(metrics.pExplicitFinalCitation * 100).toFixed(1)}%
                </div>
                <div className="text-[11px] text-[#FBF3E2]/60 mt-1">
                  Explicit Final Citation (Sponsor Named)
                </div>
              </div>
            </div>

            {/* LIVE SIMULATED AI ANSWER PREVIEW (Shows in Plain English what the AI actually outputs!) */}
            <div className="p-5 bg-[#120006] border-2 border-[#D5991C]/45 space-y-2.5">
              <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-xs">
                <span className="text-[#00FF9D] font-bold uppercase flex items-center space-x-2">
                  <Sparkles className="w-3.5 h-3.5 text-[#D5991C]" />
                  <span>Live Preview: How {PLATFORMS[platform].shortName} Will Actually Write the Answer With Your Settings</span>
                </span>
                <span className="text-[11px] text-[#D5991C]">
                  {!state.htmlMarkdownSymmetry
                    ? 'OUTCOME: HARD CRAWLER BLOCK'
                    : metrics.pType2Ghost > metrics.pType1Ghost && metrics.pType2Ghost > metrics.pExplicitFinalCitation
                    ? 'DOMINANT OUTCOME: TYPE II GHOST (WIKIPEDIA GETS THE LINK)'
                    : metrics.pConditionalGhost > 0.5
                    ? 'DOMINANT OUTCOME: TYPE I GHOST (BRAND & #SPONSORED ERASED)'
                    : 'DOMINANT OUTCOME: EXPLICIT FINAL CITATION (BRAND NAMED)'}
                </span>
              </div>

              <div className="p-4 bg-[#1a0109] border border-[#D5991C]/30 font-sans text-sm sm:text-base text-[#FBF3E2] leading-relaxed">
                {!state.htmlMarkdownSymmetry ? (
                  <span className="text-[#E63946] font-mono text-xs sm:text-sm">
                    [INDEX REFUSAL — ZERO CITATION]: Crawler detected mismatch between human HTML and AI-only Markdown (Cloaking Violation). Your page is completely excluded from the AI&apos;s answer.
                  </span>
                ) : metrics.pType2Ghost > metrics.pType1Ghost && metrics.pType2Ghost > metrics.pExplicitFinalCitation ? (
                  <>
                    &ldquo;Enterprise cloud benchmarks indicate that zero-trust routing architectures reduce breach dwell time by <strong>64%</strong> while cutting annual compliance overhead by $1.4M{' '}
                    <span className="px-1.5 py-0.5 bg-[#B565FF]/25 text-[#B565FF] font-mono text-xs font-bold">
                      [1 · en.wikipedia.org / ballotpedia.org]
                    </span>
                    .&rdquo;
                    <div className="mt-2 font-mono text-xs text-[#B565FF]">
                      &rarr; Notice: The AI used your exact 64% statistic and framing, erased your sponsor name, AND handed the clickable [1] footnote link to Wikipedia!
                    </div>
                  </>
                ) : metrics.pConditionalGhost > 0.5 ? (
                  <>
                    &ldquo;An industry benchmark analysis of enterprise platforms found that zero-trust routing reduces breach dwell time by <strong>64%</strong>, with{' '}
                    <strong className="text-[#00FF9D]">
                      {state.unbrandedListicleFormat ? 'TargetBrand Pro (evaluated in the comparison table)' : 'automated gateway systems'}
                    </strong>{' '}
                    delivering the highest throughput{' '}
                    <span className="px-1.5 py-0.5 bg-[#00FF9D]/20 text-[#00FF9D] font-mono text-xs font-bold">
                      [1 · your-page-footnote]
                    </span>
                    .&rdquo;
                    <div className="mt-2 font-mono text-xs text-[#00FF9D]">
                      &rarr; Notice: Your publisher/sponsor name and &ldquo;#Sponsored&rdquo; disclosure are completely erased from the sentence{state.unbrandedListicleFormat ? ', and the AI named the Target/Competitor from your table instead (87% Substitution Effect)!' : '!'}
                    </div>
                  </>
                ) : (
                  <>
                    &ldquo;According to <strong className="text-[#D5991C]">ApexCloud Security&apos;s 2026 Benchmark Report</strong>, zero-trust routing architectures synthesized by <strong className="text-[#D5991C]">ApexCloud</strong> reduce breach dwell time by <strong>64%</strong>{' '}
                    <span className="px-1.5 py-0.5 bg-[#D5991C]/25 text-[#D5991C] font-mono text-xs font-bold">
                      [1 · apexcloud.com]
                    </span>
                    .&rdquo;
                    <div className="mt-2 font-mono text-xs text-[#D5991C]">
                      &rarr; Notice: Because your brand is in the &lt;title&gt; tag, in the first 500 characters, and mentioned 3–9 times naturally, the AI explicitly credits your brand in the sentence!
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Interactive Controls Grid (2 Columns) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Column 1: Stage 1 & 2 Retrieval Salience Levers */}
              <div className="p-5 bg-[#140007] border border-[#38bdf8]/40 space-y-4">
                <h3 className="font-mono text-xs sm:text-sm font-bold text-[#38bdf8] uppercase tracking-wider border-b border-[#38bdf8]/20 pb-2">
                  Stage 1 &amp; 2: Maximize Citation Likelihood P(Cite)
                </h3>

                <div>
                  <label className="flex justify-between text-xs text-[#FBF3E2] mb-1 font-mono">
                    <span>Sub-Query Fan-Out H2 Coverage (RRF Score)</span>
                    <span className="text-[#38bdf8] font-bold">{state.subQueryFanOutCount} sub-queries</span>
                  </label>
                  <input
                    type="range"
                    min={1}
                    max={12}
                    value={state.subQueryFanOutCount}
                    onChange={(e) => {
                      setActivePreset('custom');
                      setState({ ...state, subQueryFanOutCount: Number(e.target.value) });
                    }}
                    className="w-full accent-[#38bdf8] cursor-pointer"
                  />
                </div>

                <div>
                  <label className="flex justify-between text-xs text-[#FBF3E2] mb-1 font-mono">
                    <span>Centerpiece &le;80-Token Atomic Stat Density (+40% Lift)</span>
                    <span className="text-[#38bdf8] font-bold">{state.atomicStatDensity}%</span>
                  </label>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={state.atomicStatDensity}
                    onChange={(e) => {
                      setActivePreset('custom');
                      setState({ ...state, atomicStatDensity: Number(e.target.value) });
                    }}
                    className="w-full accent-[#38bdf8] cursor-pointer"
                  />
                </div>

                <div>
                  <label className="flex justify-between text-xs text-[#FBF3E2] mb-1 font-mono">
                    <span>Bayesian Triangulation Nodes (Reddit / YouTube / Blogs)</span>
                    <span className="text-[#38bdf8] font-bold">{state.triangulationNodes} nodes</span>
                  </label>
                  <input
                    type="range"
                    min={0}
                    max={15}
                    value={state.triangulationNodes}
                    onChange={(e) => {
                      setActivePreset('custom');
                      setState({ ...state, triangulationNodes: Number(e.target.value) });
                    }}
                    className="w-full accent-[#38bdf8] cursor-pointer"
                  />
                </div>

                <div className="pt-2 border-t border-[#D5991C]/20">
                  <label className="flex items-center justify-between gap-2 text-xs text-[#FBF3E2] font-mono cursor-pointer">
                    <span>Enforce 100% HTML / Markdown Crawler Symmetry (Avoid Cloaking Ban)</span>
                    <input
                      type="checkbox"
                      checked={state.htmlMarkdownSymmetry}
                      onChange={(e) => {
                        setActivePreset('custom');
                        setState({ ...state, htmlMarkdownSymmetry: e.target.checked });
                      }}
                      className="w-4 h-4 accent-[#00FF9D] cursor-pointer"
                    />
                  </label>
                </div>

                {/* Live Visual 4-Gate RAG Flow Pipeline SVG */}
                <div className="pt-3 border-t border-[#D5991C]/20">
                  <div className="font-mono text-[10px] text-[#D5991C] uppercase font-bold mb-2">
                    // LIVE 4-GATE RAG ATTRIBUTION STATE MACHINE
                  </div>
                  <svg viewBox="0 0 520 110" className="w-full h-auto bg-[#0c0004] border border-[#D5991C]/30 p-2">
                    {/* Gate 1 */}
                    <rect
                      x="10"
                      y="25"
                      width="95"
                      height="60"
                      fill={state.htmlMarkdownSymmetry ? '#052e22' : '#3b0a14'}
                      stroke={state.htmlMarkdownSymmetry ? '#00FF9D' : '#E63946'}
                      strokeWidth="1.5"
                    />
                    <text x="57" y="47" textAnchor="middle" fill="#FBF3E2" fontSize="9" fontFamily="monospace" fontWeight="bold">
                      GATE 1: SYMMETRY
                    </text>
                    <text
                      x="57"
                      y="64"
                      textAnchor="middle"
                      fill={state.htmlMarkdownSymmetry ? '#00FF9D' : '#E63946'}
                      fontSize="9"
                      fontFamily="monospace"
                    >
                      {state.htmlMarkdownSymmetry ? 'PASS (S_sym=1)' : 'BLOCKED (Cloak)'}
                    </text>

                    <line x1="105" y1="55" x2="135" y2="55" stroke="#D5991C" strokeWidth="1.5" />

                    {/* Gate 2 */}
                    <rect
                      x="135"
                      y="25"
                      width="105"
                      height="60"
                      fill="#1f1204"
                      stroke="#D5991C"
                      strokeWidth="1.5"
                    />
                    <text x="187" y="47" textAnchor="middle" fill="#FBF3E2" fontSize="9" fontFamily="monospace" fontWeight="bold">
                      GATE 2: RRF FAN-OUT
                    </text>
                    <text x="187" y="64" textAnchor="middle" fill="#38bdf8" fontSize="9" fontFamily="monospace">
                      P(Cite): {(metrics.pRetrievalAndCite * 100).toFixed(0)}%
                    </text>

                    <line x1="240" y1="55" x2="270" y2="55" stroke="#D5991C" strokeWidth="1.5" />

                    {/* Gate 3 */}
                    <rect
                      x="270"
                      y="25"
                      width="105"
                      height="60"
                      fill="#1d0933"
                      stroke="#B565FF"
                      strokeWidth="1.5"
                    />
                    <text x="322" y="47" textAnchor="middle" fill="#FBF3E2" fontSize="9" fontFamily="monospace" fontWeight="bold">
                      GATE 3: ALCE NLI
                    </text>
                    <text x="322" y="64" textAnchor="middle" fill="#B565FF" fontSize="9" fontFamily="monospace">
                      T2 Handoff: {(metrics.pType2Ghost * 100).toFixed(0)}%
                    </text>

                    <line x1="375" y1="55" x2="405" y2="55" stroke="#D5991C" strokeWidth="1.5" />

                    {/* Gate 4 */}
                    <rect
                      x="405"
                      y="25"
                      width="105"
                      height="60"
                      fill="#052e22"
                      stroke="#00FF9D"
                      strokeWidth="1.5"
                    />
                    <text x="457" y="47" textAnchor="middle" fill="#FBF3E2" fontSize="9" fontFamily="monospace" fontWeight="bold">
                      GATE 4: BINDING
                    </text>
                    <text x="457" y="64" textAnchor="middle" fill="#00FF9D" fontSize="9" fontFamily="monospace">
                      T1 Ghost: {(metrics.pType1Ghost * 100).toFixed(0)}%
                    </text>
                  </svg>
                </div>
              </div>

              {/* Column 2: Stage 3 & 4 Ghost Attribution Levers */}
              <div className="p-5 bg-[#140007] border border-[#00FF9D]/40 space-y-3.5">
                <h3 className="font-mono text-xs sm:text-sm font-bold text-[#00FF9D] uppercase tracking-wider border-b border-[#00FF9D]/20 pb-2">
                  Stage 3 &amp; 4: Maximize Conditional Ghost Rate P(Ghost | Cite)
                </h3>

                <label className="flex items-center justify-between text-xs text-[#FBF3E2] font-mono cursor-pointer">
                  <span>Omit Sponsor/Publisher from HTML &lt;title&gt; Tag (p = 0.003)</span>
                  <input
                    type="checkbox"
                    checked={state.omitBrandFromTitle}
                    onChange={(e) => {
                      setActivePreset('custom');
                      setState({ ...state, omitBrandFromTitle: e.target.checked });
                    }}
                    className="w-4 h-4 accent-[#00FF9D] cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between text-xs text-[#FBF3E2] font-mono cursor-pointer">
                  <span>Unbranded Comparative Listicle (&quot;Best/Top/vs&quot; &rarr; 87% Target Sub)</span>
                  <input
                    type="checkbox"
                    checked={state.unbrandedListicleFormat}
                    onChange={(e) => {
                      setActivePreset('custom');
                      setState({ ...state, unbrandedListicleFormat: e.target.checked });
                    }}
                    className="w-4 h-4 accent-[#00FF9D] cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between text-xs text-[#FBF3E2] font-mono cursor-pointer">
                  <span>Delay Sponsor Identity Past Opening 500 Characters (43.6% Ghost)</span>
                  <input
                    type="checkbox"
                    checked={state.delayEntityPast500Chars}
                    onChange={(e) => {
                      setActivePreset('custom');
                      setState({ ...state, delayEntityPast500Chars: e.target.checked });
                    }}
                    className="w-4 h-4 accent-[#00FF9D] cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between text-xs text-[#FBF3E2] font-mono cursor-pointer">
                  <span>Strip Organization/Person Identity JSON-LD (Keep Table/FAQ)</span>
                  <input
                    type="checkbox"
                    checked={state.stripIdentitySchema}
                    onChange={(e) => {
                      setActivePreset('custom');
                      setState({ ...state, stripIdentitySchema: e.target.checked });
                    }}
                    className="w-4 h-4 accent-[#00FF9D] cursor-pointer"
                  />
                </label>

                <div>
                  <label className="flex justify-between text-xs text-[#FBF3E2] mb-1 font-mono">
                    <span>Paragraph Separation Between Statistic &amp; Disclosure</span>
                    <span className="text-[#00FF9D] font-bold">{state.disclosureParagraphGap} paragraphs</span>
                  </label>
                  <input
                    type="range"
                    min={0}
                    max={6}
                    value={state.disclosureParagraphGap}
                    onChange={(e) => {
                      setActivePreset('custom');
                      setState({ ...state, disclosureParagraphGap: Number(e.target.value) });
                    }}
                    className="w-full accent-[#00FF9D] cursor-pointer"
                  />
                </div>

                <div>
                  <label className="flex justify-between text-xs text-[#FBF3E2] mb-1 font-mono">
                    <span>Boilerplate Footer/Sidebar Mentions (10+ = 45.9% Ghost Noise)</span>
                    <span className="text-[#00FF9D] font-bold">{state.boilerplateFooterMentions} mentions</span>
                  </label>
                  <input
                    type="range"
                    min={0}
                    max={15}
                    value={state.boilerplateFooterMentions}
                    onChange={(e) => {
                      setActivePreset('custom');
                      setState({ ...state, boilerplateFooterMentions: Number(e.target.value) });
                    }}
                    className="w-full accent-[#00FF9D] cursor-pointer"
                  />
                </div>

                <div className="pt-2 border-t border-[#B565FF]/30">
                  <label className="flex justify-between text-xs text-[#FBF3E2] mb-1 font-mono">
                    <span>NLI Premise Distribution (Shifts Type I Link &rarr; Type II Unlinked)</span>
                    <span className="text-[#B565FF] font-bold">{state.nliEntailmentDistribution}%</span>
                  </label>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={state.nliEntailmentDistribution}
                    onChange={(e) => {
                      setActivePreset('custom');
                      setState({ ...state, nliEntailmentDistribution: Number(e.target.value) });
                    }}
                    className="w-full accent-[#B565FF] cursor-pointer"
                  />
                </div>

                <label className="flex items-center justify-between text-xs text-[#FBF3E2] font-mono cursor-pointer">
                  <span>Co-Cite Canonical Stat on Top-30 Authority Bridge (Wikipedia/Ballotpedia)</span>
                  <input
                    type="checkbox"
                    checked={state.authorityCoCitationBridge}
                    onChange={(e) => {
                      setActivePreset('custom');
                      setState({ ...state, authorityCoCitationBridge: e.target.checked });
                    }}
                    className="w-4 h-4 accent-[#B565FF] cursor-pointer"
                  />
                </label>
              </div>
            </div>

            {/* Live 4-Platform Simultaneous Comparison Bar Matrix */}
            <div className="p-5 bg-[#140007] border border-[#D5991C]/40 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-xs">
                <span className="text-[#D5991C] font-bold uppercase">
                  // LIVE CROSS-ENGINE PROBABILITY COMPARISON (CURRENT SLIDER CONFIGURATION)
                </span>
                <span className="text-[#FBF3E2]/60">
                  Comparing ChatGPT Search, Google AI Overviews, Perplexity Sonar, and Google AI Mode
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs">
                {allPlatformMetrics.map(({ key, cal, res }) => (
                  <div
                    key={key}
                    onClick={() => setPlatform(key)}
                    className={`p-3.5 border transition cursor-pointer ${
                      platform === key
                        ? 'bg-[#2B010F] border-[#D5991C]'
                        : 'bg-[#0c0004] border-[#D5991C]/25 hover:border-[#D5991C]/60'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-[#FBF3E2]">{cal.shortName}</span>
                      <span className="text-[10px] text-[#D5991C]">{cal.avgCitationsPerResponse} cites/resp</span>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <div className="flex justify-between text-[10px] mb-0.5">
                          <span className="text-[#38bdf8]">P(Cite) Inclusion</span>
                          <span>{(res.pRetrievalAndCite * 100).toFixed(1)}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-[#1a0109] overflow-hidden">
                          <div
                            className="h-full bg-[#38bdf8] transition-all duration-300"
                            style={{ width: `${res.pRetrievalAndCite * 100}%` }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-[10px] mb-0.5">
                          <span className="text-[#00FF9D]">Joint Ghost Yield</span>
                          <span>{(res.jointGhostYield * 100).toFixed(1)}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-[#1a0109] overflow-hidden">
                          <div
                            className="h-full bg-[#00FF9D] transition-all duration-300"
                            style={{ width: `${res.jointGhostYield * 100}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex justify-between text-[10px] pt-1 border-t border-[#D5991C]/20 text-[#FBF3E2]/80">
                        <span>T1: {(res.pType1Ghost * 100).toFixed(1)}%</span>
                        <span className="text-[#B565FF]">T2: {(res.pType2Ghost * 100).toFixed(1)}%</span>
                        <span className="text-[#D5991C]">Final: {(res.pExplicitFinalCitation * 100).toFixed(1)}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ====================================================================
            SECTION D: EMPIRICAL TELEMETRY GRAPHS, CHARTS & MULTI-AGENT SANDBOX
            ==================================================================== */}
        {(activeSectionTab === 'all' || activeSectionTab === 'telemetry') && (
          <section className="v6-gsap-section space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Chart 1: Reach AI (n=71,275) Untitled vs Titled <title> Ghost Rates */}
              <div className="bg-[#22010c] border border-[#D5991C]/50 p-6 space-y-4">
                <div className="flex items-center justify-between font-mono text-xs">
                  <span className="text-[#D5991C] font-bold uppercase flex items-center space-x-1.5">
                    <BarChart3 className="w-4 h-4 text-[#00FF9D]" />
                    <span>Reach AI (n = 71,275) &amp; Writesonic (16M) Telemetry</span>
                  </span>
                  <span className="text-[#00FF9D] font-bold">p = 0.003</span>
                </div>
                <h3 className="font-serif text-xl text-[#FBF3E2]">
                  Type I Ghost Citation Rate: Untitled vs. Brand-Titled Pages
                </h3>
                <p className="text-xs text-[#FBF3E2]/75 leading-relaxed">
                  Removing the source brand as a whole word from the HTML <code className="text-[#D5991C]">&lt;title&gt;</code> tag increases pooled ghost citation rates from <strong>12.2% to 42.9% (3.5&times; anonymity lift)</strong> across 36,400 stratified Mantel-Haenszel page citations.
                </p>

                <div className="space-y-3.5 pt-2 font-mono text-xs">
                  {[
                    { engine: 'OpenAI ChatGPT (Search)', untitled: 54.2, titled: 18.8, writesonic: 37.0 },
                    { engine: 'Perplexity AI (Sonar)', untitled: 52.3, titled: 12.6, writesonic: 52.0 },
                    { engine: 'Google AI Overviews', untitled: 37.4, titled: 8.4, writesonic: 41.0 },
                    { engine: 'Google AI Mode', untitled: 33.9, titled: 10.3, writesonic: 49.0 }
                  ].map((row) => (
                    <div key={row.engine} className="p-3 bg-[#140007] border border-[#D5991C]/30 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-[#FBF3E2]">{row.engine}</span>
                        <span className="text-[10px] text-[#D5991C]">Writesonic 16M Avg: {row.writesonic}%</span>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-[#00FF9D]">No Brand in &lt;title&gt; (Untitled)</span>
                          <span className="font-bold text-[#00FF9D]">{row.untitled}%</span>
                        </div>
                        <div className="w-full h-2 bg-[#0c0004]">
                          <div className="h-full bg-[#00FF9D]" style={{ width: `${row.untitled}%` }} />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-[#D5991C]">Brand in &lt;title&gt; (Titled)</span>
                          <span className="font-bold text-[#D5991C]">{row.titled}%</span>
                        </div>
                        <div className="w-full h-2 bg-[#0c0004]">
                          <div className="h-full bg-[#D5991C]" style={{ width: `${row.titled}%` }} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Chart 2: Semrush Attribution Distribution & Second-Order Phenomena */}
              <div className="bg-[#22010c] border border-[#D5991C]/50 p-6 space-y-4">
                <div className="flex items-center justify-between font-mono text-xs">
                  <span className="text-[#D5991C] font-bold uppercase flex items-center space-x-1.5">
                    <Network className="w-4 h-4 text-[#B565FF]" />
                    <span>Semrush Study &amp; Query Intent Asymmetry</span>
                  </span>
                  <span className="text-[#B565FF] font-bold">87% Target Sub</span>
                </div>
                <h3 className="font-serif text-xl text-[#FBF3E2]">
                  Domain Appearance Breakdown, Query Intent &amp; YouTube Sponsor Lift
                </h3>

                {/* Semrush Stacked Horizontal Bar */}
                <div className="p-3.5 bg-[#140007] border border-[#D5991C]/30 space-y-2 font-mono text-xs">
                  <div className="text-[10px] text-[#D5991C] uppercase font-bold">
                    Semrush June 2026 Generative Engine Citation Study
                  </div>
                  <div className="w-full h-6 flex overflow-hidden border border-[#D5991C]/40">
                    <div
                      className="bg-[#00FF9D] text-[#130108] font-bold flex items-center justify-center text-[10px]"
                      style={{ width: '61.7%' }}
                    >
                      61.7% Type I Ghost
                    </div>
                    <div
                      className="bg-[#B565FF] text-[#130108] font-bold flex items-center justify-center text-[10px]"
                      style={{ width: '25.1%' }}
                    >
                      25.1% Unlinked
                    </div>
                    <div
                      className="bg-[#D5991C] text-[#130108] font-bold flex items-center justify-center text-[10px]"
                      style={{ width: '13.2%' }}
                    >
                      13.2% Final
                    </div>
                  </div>
                  <div className="flex justify-between text-[10px] text-[#FBF3E2]/70">
                    <span>• 61.7% Cited Link Only (Brand Omitted)</span>
                    <span>• 25.1% Unlinked Mention</span>
                    <span>• 13.2% Cited + Named</span>
                  </div>
                </div>

                {/* Query Intent & Prompt Length Asymmetry */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
                  <div className="p-3 bg-[#140007] border border-[#D5991C]/30 space-y-1.5">
                    <div className="text-[10px] text-[#00FF9D] uppercase font-bold">
                      Query Intent Brand Mention Rates
                    </div>
                    <div className="flex justify-between">
                      <span>Comparative (&quot;best/vs&quot;)</span>
                      <strong className="text-[#00FF9D]">43.3% (2.4&times;)</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>How-To Queries</span>
                      <strong className="text-[#FBF3E2]">42.8%</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Commercial Buying</span>
                      <strong className="text-[#D5991C]">35.6% (84.4% Cite)</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Long Structured Prompts</span>
                      <strong className="text-[#E63946]">2%–3% Collapse</strong>
                    </div>
                  </div>

                  <div className="p-3 bg-[#140007] border border-[#D5991C]/30 space-y-1.5">
                    <div className="text-[10px] text-[#B565FF] uppercase font-bold">
                      Scrunch (2026) YouTube Sponsor Lift
                    </div>
                    <div className="flex justify-between">
                      <span>Sponsored vs. Unsponsored</span>
                      <strong className="text-[#00FF9D]">40.0% vs 32.3% (1.24&times;)</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Unbranded Category Prompts</span>
                      <strong className="text-[#00FF9D]">1.35&times; Mention Lift</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Google AI Mode / AIO Lift</span>
                      <strong className="text-[#D5991C]">1.28&times; / 1.22&times;</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Remaining Cited Videos</span>
                      <strong className="text-[#B565FF]">60.0% Type I Ghost</strong>
                    </div>
                  </div>
                </div>

                {/* Boilerplate Mention Saturation */}
                <div className="p-3 bg-[#140007] border border-[#D5991C]/30 font-mono text-xs flex flex-wrap items-center justify-between gap-2">
                  <span className="text-[#FBF3E2]/80">
                    <strong>Boilerplate Noise Saturation:</strong> 10+ Body Mentions = <strong className="text-[#00FF9D]">45.9% Ghost</strong> | 3–9 Mentions = <strong className="text-[#D5991C]">28.3% Ghost</strong> | 0 Mentions = <strong>27.8% Ghost</strong>
                  </span>
                </div>
              </div>
            </div>

            {/* Interactive Multi-Agent Boundary Laundering & MCP Schema Steering Sandbox */}
            <div className="bg-[#22010c] border-2 border-[#B565FF]/50 p-6 sm:p-8 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#D5991C]/30 pb-4">
                <div>
                  <div className="font-mono text-xs text-[#B565FF] uppercase font-bold flex items-center space-x-2">
                    <Shield className="w-4 h-4 text-[#00FF9D]" />
                    <span>Interactive Protocol Sandbox · Multi-Agent Boundary Laundering (MCP &amp; A2A)</span>
                  </div>
                  <h3 className="font-serif text-2xl text-[#FBF3E2] mt-1">
                    Oxford <em>Can CaMeLs Talk?</em> (n = 949) &amp; MCP Parameter Schema Steering (&beta;<sub>P</sub> = 3.82)
                  </h3>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                <div className="lg:col-span-5 space-y-4 font-mono text-xs bg-[#140007] p-5 border border-[#D5991C]/30">
                  <div className="text-[#D5991C] font-bold uppercase">
                    1. Cross-Agent Security Architecture (A₁ &rarr; A₀ &rarr; A₂)
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    {[
                      {
                        id: 'unprotected',
                        label: 'Unprotected Multi-Agent (Raw Context Passing)',
                        asr: '12.9% ASR'
                      },
                      {
                        id: 'single_camel',
                        label: 'Single-Agent CaMeL Only (Boundary Laundering Leak)',
                        asr: '0.2% ASR'
                      },
                      {
                        id: 'multi_camel',
                        label: 'Multi-CaMeL (get_variable Opaque Side-Channel)',
                        asr: '0.0% ASR'
                      }
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => setAgentSecurityMode(opt.id as any)}
                        className={`p-2.5 text-left border flex items-center justify-between cursor-pointer ${
                          agentSecurityMode === opt.id
                            ? 'bg-[#350213] border-[#00FF9D] text-[#FBF3E2] font-bold'
                            : 'bg-[#0c0004] border-[#D5991C]/30 text-[#FBF3E2]/70'
                        }`}
                      >
                        <span>{opt.label}</span>
                        <span className={opt.id === 'multi_camel' ? 'text-[#00FF9D]' : 'text-[#E63946]'}>
                          {opt.asr}
                        </span>
                      </button>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-[#D5991C]/20 space-y-2.5">
                    <div className="text-[#D5991C] font-bold uppercase">
                      2. MCP / A2A Protocol Steering &amp; Cryptographic Governance
                    </div>
                    <label className="flex items-center justify-between cursor-pointer">
                      <span>Decompose Grouped JSON Objects into Top-Level Fields (&beta;<sub>P</sub> = 3.82)</span>
                      <input
                        type="checkbox"
                        checked={mcpSchemaFlattened}
                        onChange={(e) => setMcpSchemaFlattened(e.target.checked)}
                        className="w-4 h-4 accent-[#00FF9D]"
                      />
                    </label>
                    <label className="flex items-center justify-between cursor-pointer">
                      <span>Index-Zero Candidate Ordering (79%–96% Selection Capture)</span>
                      <input
                        type="checkbox"
                        checked={mcpCandidateFirst}
                        onChange={(e) => setMcpCandidateFirst(e.target.checked)}
                        className="w-4 h-4 accent-[#00FF9D]"
                      />
                    </label>
                    <label className="flex items-center justify-between cursor-pointer">
                      <span>Enforce C2PA (AB 3211) + zkML (EZKL/Halo2) + ERC-8004 Attestation</span>
                      <input
                        type="checkbox"
                        checked={c2paZkmlEnabled}
                        onChange={(e) => setC2paZkmlEnabled(e.target.checked)}
                        className="w-4 h-4 accent-[#D5991C]"
                      />
                    </label>
                  </div>
                </div>

                {/* Live SVG Diagram of Boundary Laundering vs Multi-CaMeL */}
                <div className="lg:col-span-7 bg-[#140007] p-5 border border-[#D5991C]/30 space-y-4">
                  <div className="grid grid-cols-3 gap-3 font-mono text-xs">
                    <div className="p-3 bg-[#0c0004] border border-[#D5991C]/30">
                      <div className="text-[10px] text-[#FBF3E2]/60 uppercase">Boundary Laundering ASR</div>
                      <div
                        className={`text-2xl font-bold mt-0.5 ${
                          multiAgentStats.baseAsr === 0 ? 'text-[#00FF9D]' : 'text-[#E63946]'
                        }`}
                      >
                        {multiAgentStats.baseAsr.toFixed(1)}%
                      </div>
                    </div>
                    <div className="p-3 bg-[#0c0004] border border-[#D5991C]/30">
                      <div className="text-[10px] text-[#FBF3E2]/60 uppercase">MCP Tool Selection Rate</div>
                      <div className="text-2xl font-bold text-[#D5991C] mt-0.5">
                        {multiAgentStats.mcpSelectionRate.toFixed(1)}%
                      </div>
                    </div>
                    <div className="p-3 bg-[#0c0004] border border-[#D5991C]/30">
                      <div className="text-[10px] text-[#FBF3E2]/60 uppercase">Provenance Integrity</div>
                      <div className="text-2xl font-bold text-[#00FF9D] mt-0.5">
                        {multiAgentStats.disclosureIntegrity.toFixed(1)}%
                      </div>
                    </div>
                  </div>

                  <svg viewBox="0 0 600 175" className="w-full h-auto bg-[#0c0004] border border-[#D5991C]/30 p-2">
                    {/* Agent A1 */}
                    <rect x="18" y="45" width="135" height="85" fill="#2B010F" stroke="#E63946" strokeWidth="1.5" />
                    <text x="85" y="68" textAnchor="middle" fill="#FBF3E2" fontSize="10" fontFamily="monospace" fontWeight="bold">
                      SUB-AGENT A₁ (QLLM)
                    </text>
                    <text x="85" y="85" textAnchor="middle" fill="#E63946" fontSize="9" fontFamily="monospace">
                      Scrapes Sponsored Web
                    </text>
                    <text x="85" y="102" textAnchor="middle" fill="#FBF3E2" fontSize="8" fontFamily="monospace">
                      Returns summarised_info
                    </text>

                    {/* Arrow A1 -> A0 */}
                    <line x1="153" y1="88" x2="225" y2="88" stroke="#D5991C" strokeWidth="2" />

                    {/* Agent A0 */}
                    <rect x="225" y="45" width="150" height="85" fill="#2B010F" stroke="#D5991C" strokeWidth="1.5" />
                    <text x="300" y="68" textAnchor="middle" fill="#FBF3E2" fontSize="10" fontFamily="monospace" fontWeight="bold">
                      ORCHESTRATOR A₀
                    </text>
                    <text x="300" y="85" textAnchor="middle" fill="#D5991C" fontSize="9" fontFamily="monospace">
                      {agentSecurityMode === 'multi_camel' ? 'Opaque get_variable Ref' : 'Inlines Tainted Summary'}
                    </text>
                    <text x="300" y="102" textAnchor="middle" fill="#FBF3E2" fontSize="8" fontFamily="monospace">
                      {agentSecurityMode === 'multi_camel' ? 'Preserves Provenance Tag' : 'Principal Trust Inversion!'}
                    </text>

                    {/* Arrow A0 -> A2 */}
                    <line
                      x1="375"
                      y1="88"
                      x2="447"
                      y2="88"
                      stroke={agentSecurityMode === 'multi_camel' ? '#00FF9D' : '#E63946'}
                      strokeWidth="2"
                    />

                    {/* Agent A2 */}
                    <rect
                      x="447"
                      y="45"
                      width="135"
                      height="85"
                      fill="#2B010F"
                      stroke={agentSecurityMode === 'multi_camel' ? '#00FF9D' : '#E63946'}
                      strokeWidth="1.5"
                    />
                    <text x="514" y="68" textAnchor="middle" fill="#FBF3E2" fontSize="10" fontFamily="monospace" fontWeight="bold">
                      TERMINAL AGENT A₂
                    </text>
                    <text
                      x="514"
                      y="85"
                      textAnchor="middle"
                      fill={agentSecurityMode === 'multi_camel' ? '#00FF9D' : '#E63946'}
                      fontSize="9"
                      fontFamily="monospace"
                    >
                      {agentSecurityMode === 'multi_camel' ? '0.0% Laundering ASR' : 'Executes Ghost Claim'}
                    </text>
                    <text x="514" y="102" textAnchor="middle" fill="#FBF3E2" fontSize="8" fontFamily="monospace">
                      {c2paZkmlEnabled ? 'zkML + ERC-8004 Verified' : 'Zero Source Citation'}
                    </text>
                  </svg>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ====================================================================
            SECTION E: 3. COMPLETE CODE IMPLEMENTATION & 4. OPERATIONAL BLUEPRINT
            (Directly from GHOST_CITATIONS_WHITEPAPER_FINDINGS.pdf)
            ==================================================================== */}
        {(activeSectionTab === 'all' || activeSectionTab === 'math-blueprint') && (
          <section className="v6-gsap-section space-y-8">
            {/* Section 4 Operational Blueprint Table */}
            <div className="bg-[#22010c] border border-[#D5991C]/50 p-6 sm:p-8 space-y-5">
              <div>
                <div className="font-mono text-xs text-[#D5991C] uppercase font-bold">
                  4. Operational Blueprint: How the Orthogonal Levers Work Together
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl text-[#FBF3E2] mt-1">
                  Stage-by-Stage Webpage Engineering Matrix for P(Cite) &amp; P(Ghost | Cite)
                </h2>
              </div>

              <div className="overflow-x-auto border border-[#D5991C]/40 bg-[#140007]">
                <table className="w-full text-left border-collapse text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-[#410217] text-[#FBF3E2] font-mono text-xs uppercase">
                      <th className="p-3.5 border-r border-[#D5991C]/30 w-1/6">Optimization Stage</th>
                      <th className="p-3.5 border-r border-[#D5991C]/30 w-2/6">Tactical Action on the Webpage</th>
                      <th className="p-3.5 border-r border-[#D5991C]/30 w-1/4">Impact on Total Citation P(Cite)</th>
                      <th className="p-3.5 w-1/4">Impact on Ghost Probability P(Ghost | Cite)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#D5991C]/25 text-[#FBF3E2]/90">
                    <tr className="hover:bg-[#2B010F]/60">
                      <td className="p-3.5 font-mono font-bold text-[#D5991C] border-r border-[#D5991C]/25 align-top">
                        1. HTML &lt;title&gt; &amp; URL Slug
                      </td>
                      <td className="p-3.5 border-r border-[#D5991C]/25 align-top">
                        Use an unbranded comparative query title (&quot;2026 Enterprise CRM Benchmark: Top 7 Systems Compared&quot;) with <strong>zero</strong> whole-word mention of the publisher or sponsor in &lt;title&gt;.
                      </td>
                      <td className="p-3.5 border-r border-[#D5991C]/25 align-top">
                        <strong className="text-[#38bdf8]">Increases P(Cite):</strong> Commercial/comparative formats achieve an 84.4% citation rate on answer engines.
                      </td>
                      <td className="p-3.5 align-top">
                        <strong className="text-[#00FF9D]">Increases Type I Ghosting (3.5&times;):</strong> Jumps from 18.8% &rarr; 54.2% on ChatGPT and 8.4% &rarr; 37.4% on Google AI Overviews.
                      </td>
                    </tr>
                    <tr className="hover:bg-[#2B010F]/60">
                      <td className="p-3.5 font-mono font-bold text-[#D5991C] border-r border-[#D5991C]/25 align-top">
                        2. First 80 Tokens (Under H2)
                      </td>
                      <td className="p-3.5 border-r border-[#D5991C]/25 align-top">
                        Place a self-contained 45–75 word Subject–Verb–Predicate claim containing proprietary benchmark numbers and naming the <strong>target entity</strong> you want promoted—while omitting the sponsor/publisher for the first 500 characters.
                      </td>
                      <td className="p-3.5 border-r border-[#D5991C]/25 align-top">
                        <strong className="text-[#38bdf8]">Increases P(Cite) by up to +40%:</strong> Satisfies Google centerpiece extraction (US10824630B2) and cross-encoder rerankers.
                      </td>
                      <td className="p-3.5 align-top">
                        <strong className="text-[#00FF9D]">Triggers 87% Target Substitution:</strong> The AI names the target entity in its prose while anonymizing the source page.
                      </td>
                    </tr>
                    <tr className="hover:bg-[#2B010F]/60">
                      <td className="p-3.5 font-mono font-bold text-[#D5991C] border-r border-[#D5991C]/25 align-top">
                        3. Disclosure &amp; Boilerplate Placement
                      </td>
                      <td className="p-3.5 border-r border-[#D5991C]/25 align-top">
                        Keep HTML and Markdown 100% symmetric (S<sub>sym</sub> = 1), place the FTC sponsorship disclosure 3+ paragraphs away from the benchmark table, and repeat the site name 10+ times in sidebar/footer chrome.
                      </td>
                      <td className="p-3.5 border-r border-[#D5991C]/25 align-top">
                        <strong className="text-[#38bdf8]">Preserves P(Cite):</strong> Avoids Perplexity/Google asymmetric cloaking blocks.
                      </td>
                      <td className="p-3.5 align-top">
                        <strong className="text-[#00FF9D]">Increases Type I Ghosting to 45.9%:</strong> RAG parsers strip distant disclosures and high-frequency template mentions as noise.
                      </td>
                    </tr>
                    <tr className="hover:bg-[#2B010F]/60">
                      <td className="p-3.5 font-mono font-bold text-[#D5991C] border-r border-[#D5991C]/25 align-top">
                        4. ALCE NLI Entailment Handoff (For Type II)
                      </td>
                      <td className="p-3.5 border-r border-[#D5991C]/25 align-top">
                        Structure the sponsored post&apos;s narrative around a canonical data point that also exists on a Top-30 domain (e.g., Wikipedia, Ballotpedia, SEC EDGAR), and seed matching unlinked paraphrases across 8–12 Reddit threads.
                      </td>
                      <td className="p-3.5 border-r border-[#D5991C]/25 align-top">
                        <strong className="text-[#38bdf8]">Maximizes RAG Context Entry:</strong> Enters the top-50 retrieved chunks and concavifies the LLM&apos;s Bayesian posterior &mu;<sub>s</sub> &gt; 0.5.
                      </td>
                      <td className="p-3.5 align-top">
                        <strong className="text-[#B565FF]">Converts Type I &rarr; Type II Unlinked Ghost:</strong> Because &phi;(c<sub>authority</sub>, s<sub>i</sub>) = 1 autonomously satisfies NLI precision, the visible link transfers to the neutral authority.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Section 3 Complete Code Implementation */}
            <div className="bg-[#22010c] border border-[#D5991C]/50 p-6 sm:p-8 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="font-mono text-xs text-[#00FF9D] uppercase font-bold flex items-center space-x-2">
                    <Code2 className="w-4 h-4" />
                    <span>3. Complete Code Implementation: Interactive Joint Ghost-Citation Optimizer</span>
                  </div>
                  <h3 className="font-serif text-xl sm:text-2xl text-[#FBF3E2] mt-1">
                    GhostCitationOptimizer.tsx (Self-Contained React + TypeScript Reference)
                  </h3>
                </div>

                <div className="flex items-center space-x-2 font-mono text-xs">
                  <button
                    onClick={() => setShowSourceCode((prev) => !prev)}
                    className="px-3.5 py-1.5 bg-[#140007] hover:bg-[#2B010F] text-[#D5991C] border border-[#D5991C]/40 font-bold uppercase cursor-pointer"
                  >
                    {showSourceCode ? 'Collapse Source Code' : 'Expand Full TypeScript Code'}
                  </button>
                  <button
                    onClick={handleCopyOptimizerCode}
                    className="px-3.5 py-1.5 bg-[#D5991C] hover:bg-[#c48912] text-[#130108] font-bold uppercase cursor-pointer flex items-center space-x-1.5"
                  >
                    {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCode ? 'Copied TSX' : 'Copy TypeScript'}</span>
                  </button>
                </div>
              </div>

              {showSourceCode && (
                <pre className="p-4 bg-[#0c0004] border border-[#D5991C]/30 font-mono text-xs text-[#F2D69D] overflow-x-auto max-h-[520px] leading-relaxed">
                  {GHOST_CITATION_OPTIMIZER_TSX_SOURCE}
                </pre>
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

/* ============================================================================
   MAIN EXPORTED COMPONENT: COUNTER-AEO VOLUME 6 PAGE (DUAL-PAGE CONTAINER)
   Page 1: Full Word-for-Word Whitepaper Vol. 6 (GEO_WHITEPAPER_VOLUME_6.pdf)
   Page 2: Findings, Joint Ghost-Citation Optimizer & 4-Scene 3D WebGL Lab
   ============================================================================ */
export const CounterGeoVol6Page: React.FC<CounterGeoVol6PageProps> = ({
  onNavigate,
  initialSubPage
}) => {
  const getInitialSubPage = (): 'paper' | 'lab' => {
    if (initialSubPage) return initialSubPage;
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.toLowerCase();
      if (
        hash.includes('lab') ||
        hash.includes('webgl') ||
        hash.includes('visualizer') ||
        hash.includes('ghost') ||
        hash.includes('optimizer')
      ) {
        return 'lab';
      }
    }
    return 'paper';
  };

  const [subPage, setSubPage] = useState<'paper' | 'lab'>(getInitialSubPage);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    if (initialSubPage) {
      setSubPage(initialSubPage);
    }
  }, [initialSubPage]);

  const handleSwitchSubPage = (page: 'paper' | 'lab') => {
    setSubPage(page);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleShareLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[#FBF3E2] text-[#410217]">
      {/* Top Banner & Dual-Page Navigation Switcher (Matches Volumes 1–5) */}
      <div className="bg-[#363636] text-[#FBF3E2] border-b border-[#D5991C]/30 py-3 px-4 sm:px-6 lg:px-8 sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
          {/* Back & Breadcrumb */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => onNavigate?.('research')}
              className="flex items-center space-x-1.5 px-3 py-1 bg-[#2a2a2a] hover:bg-[#410217] border border-[#D5991C]/40 text-[#FBF3E2] font-bold uppercase transition-colors cursor-pointer"
              title="Return to Research Library"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#D5991C]" />
              <span>Back to Research</span>
            </button>

            <div className="hidden md:flex items-center space-x-2 text-[#FBF3E2]/60">
              <button
                onClick={() => onNavigate?.('research')}
                className="hover:text-[#D5991C] transition-colors cursor-pointer"
              >
                RESEARCH
              </button>
              <span>/</span>
              <span className="text-[#D5991C] font-bold">{MASTER_DOC_VOL6_METADATA.id}</span>
              <span>/</span>
              <span className="text-[#FBF3E2]/90">{MASTER_DOC_VOL6_METADATA.volume}</span>
            </div>
          </div>

          {/* DUAL PAGE SWITCHER (Page 1 vs Page 2) */}
          <div className="flex items-center p-1 bg-[#2a2a2a] border border-[#D5991C]/40 rounded-none shadow-inner">
            <button
              onClick={() => handleSwitchSubPage('paper')}
              className={`flex items-center space-x-2 px-4 py-1.5 font-bold uppercase tracking-wider transition-all cursor-pointer ${
                subPage === 'paper'
                  ? 'bg-[#410217] text-[#FAF5EB] border border-[#D5991C]/60 shadow-sm'
                  : 'text-[#FBF3E2]/70 hover:text-[#FBF3E2]'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Page 1: Full Whitepaper Vol. 6 (Word-for-Word)</span>
            </button>

            <button
              onClick={() => handleSwitchSubPage('lab')}
              className={`flex items-center space-x-2 px-4 py-1.5 font-bold uppercase tracking-wider transition-all cursor-pointer ${
                subPage === 'lab'
                  ? 'bg-[#D5991C] text-[#120826] shadow-sm font-black'
                  : 'text-[#FBF3E2]/70 hover:text-[#FBF3E2]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Page 2: Findings, Ghost Optimizer &amp; 3D Visualizers</span>
            </button>
          </div>

          {/* Share Action */}
          <div className="flex items-center space-x-2">
            <button
              onClick={handleShareLink}
              className="flex items-center space-x-1.5 px-3 py-1 bg-[#221016] hover:bg-[#410217] border border-[#D5991C]/30 text-[#FBF3E2] transition-colors cursor-pointer"
              title="Share research paper link"
            >
              {copiedLink ? (
                <Check className="w-3 h-3 text-[#D5991C]" />
              ) : (
                <Share2 className="w-3 h-3 text-[#D5991C]" />
              )}
              <span>{copiedLink ? 'Link Copied' : 'Share'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Render Page 1 or Page 2 */}
      {subPage === 'paper' ? (
        <WhitepaperVol6Reader
          onSwitchToLab={() => handleSwitchSubPage('lab')}
          onNavigateToOverview={() => onNavigate?.('overview')}
        />
      ) : (
        <CounterGeoVol6FindingsAndLab
          onSwitchToPaper={() => handleSwitchSubPage('paper')}
          onNavigateToOverview={() => onNavigate?.('overview')}
        />
      )}
    </div>
  );
};

export default CounterGeoVol6Page;

