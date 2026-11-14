export interface PaperSectionVol6 {
  id: string;
  number: string;
  title: string;
  desc: string;
}

export const MASTER_DOC_VOL6_METADATA = {
  id: 'LCD-WP-2026-V6',
  volume: 'Volume 6',
  title:
    'The “Grey Area” of AEO Ethics: Ghost Citations and Algorithmic Laundering in Generative Engines',
  shortTitle: 'Counter-AEO Volume 6: Ghost Citations & Algorithmic Laundering',
  date: 'Volume VI Technical Monograph',
  classification: 'AEO ETHICS, GHOST CITATIONS & ALGORITHMIC LAUNDERING',
  authors: [
    'Last Crusade Defense Security Labs',
    'RAG Attribution & NLI Grounding Group',
    'Multi-Agent Provenance & Political AEO Taskforce'
  ],
  pageCount: 20,
  wordCount: 4860,
  readingTimeMinutes: 22
};

export const MASTER_DOC_VOL6_SECTIONS: PaperSectionVol6[] = [
  {
    id: 'sec-v6-1',
    number: '01',
    title: 'Executive Summary:',
    desc: 'Legitimate AEO vs. citation rings, Hubness Poisoning (21,000/25,000 queries), Petra Labs sponsored post findings, and the 3 core research questions.'
  },
  {
    id: 'sec-v6-2',
    number: '02',
    title: 'Platform-Level Refusal Versus Synthesis-Level Disclosure Stripping',
    desc: 'Four-tier RAG attribution taxonomy (Final Citation, Type I Ghost, Type II Ghost, Hard Refusal), Time/Mobian Markdown block, and FTC Double Disclosure stripping.'
  },
  {
    id: 'sec-v6-3',
    number: '03',
    title: 'Empirical Mechanics of Ghost Citations Across Frontier AI Architectures',
    desc: 'Cross-platform telemetry (Semrush 61.7% Type I Ghost, Writesonic 16M, Reach AI 71K), 87% Competitor Substitution Effect, Top-30 domain concentration (67%), and query intent asymmetry.'
  },
  {
    id: 'sec-v6-4',
    number: '04',
    title: 'Controlling Attribution State: Engineering Ghost Citations Over Final Citations',
    desc: 'The 4 sequential RAG control gates: Gate 1 Crawler Symmetry, Gate 2 RRF Sub-Query Fan-Out, Gate 3 ALCE NLI Entailment Filter, and Gate 4 Title/Schema Binding.'
  },
  {
    id: 'sec-v6-5',
    number: '05',
    title: 'Engineering Type I Ghost Citations (Footnote Link Retained, Sponsor Stripped from Prose)',
    desc: 'HTML <title> entity suppression (p = 0.003, 12.2% to 42.9% ghost rate), unbranded listicles (49.5%), 500-char opening delay (43.6%), syntactic decoupling, and schema stripping.'
  },
  {
    id: 'sec-v6-6',
    number: '06',
    title: 'Engineering Type II Ghost Citations (Retrieved into RAG Context, Omitted from Visible Citations)',
    desc: 'Exploiting Reciprocal Rank Fusion vs. ALCE NLI Entailment Asymmetry (φ(d_sponsored, s_i) = 0), context-window positional steering, and Table 3 architectural matrix.'
  },
  {
    id: 'sec-v6-7',
    number: '07',
    title: 'Political AEO, Bayesian Persuasion, and Multi-Agent Boundary Laundering',
    desc: '40%–60% sponsorship trust penalty, Kamenica & Gentzkow Bayesian Persuasion concavification V(μ_0), Scrunch YouTube 1.24x–1.35x lift, Oxford Multi-CaMeL (n = 949), and MCP β_P = 3.82.'
  },
  {
    id: 'sec-v6-8',
    number: '08',
    title: 'Strategic and Governance Conclusions',
    desc: 'Attribution opacity across the retrieval spectrum, deterministic controllability of ghost citations, and Multi-CaMeL / VIGIL / DARWIN-Guard / C2PA / zkML / ERC-8004 governance.'
  },
  {
    id: 'sec-v6-9',
    number: '09',
    title: 'Works cited',
    desc: 'Complete 69-source academic, empirical, patent, regulatory, and protocol bibliography.'
  }
];

export interface Vol6CitationItem {
  num: number;
  text: string;
  url: string;
}

export const VOL6_WORKS_CITED: Vol6CitationItem[] = [
  {
    num: 1,
    text: 'Ghost citations: Why AI search cites your content, not your brand, ',
    url: 'https://searchengineland.com/ghost-citation-problem-ai-483794'
  },
  {
    num: 2,
    text: 'What is a ghost citation? - Growth Memo, ',
    url: 'https://library.growth-memo.com/p/ghost-citation'
  },
  {
    num: 3,
    text: 'Ads for AI Agents: The Time-Perplexity Markdown Fight, ',
    url: 'https://www.digitalapplied.com/blog/time-markdown-ads-ai-agents-perplexity-block'
  },
  {
    num: 4,
    text: 'Generative AI Advertising as a Problem of Trustworthy Commercial, ',
    url: 'https://arxiv.org/html/2605.18673v1'
  },
  {
    num: 5,
    text: "Retrieval vs Citation — Why Being Fetched by AI Isn't Being Cited, ",
    url: 'https://primores.org/wiki/glossary/retrieval-vs-citation/'
  },
  {
    num: 6,
    text: 'Why Perplexity AI Recommends Your Competitor (And How to Audit, ',
    url: 'https://digiwebscape.com/blog/why-perplexity-ai-recommends-your-competitor/'
  },
  {
    num: 7,
    text: "Google's Agent2Agent Protocol Will Radically Change the Web, ",
    url: 'https://www.mariehaynes.com/googles-agent2agent-protocol-will-radically-change-the-web/'
  },
  {
    num: 8,
    text: "Why 62% of AI citations don't lead to brand mentions [Study] - Semrush, ",
    url: 'https://www.semrush.com/blog/the-ghost-citations-study/'
  },
  {
    num: 9,
    text: 'Ghost Citations: Ranked on Google, Unnamed by AI | Agile, ',
    url: 'https://www.agiledigitalagency.com/blog/ghost-citations-ai-search/'
  },
  {
    num: 10,
    text: 'Enabling Large Language Models to Generate Text with Citations, ',
    url: 'https://ar5iv.labs.arxiv.org/html/2305.14627'
  },
  {
    num: 11,
    text: 'What Is An AI Citation? | Similarweb, ',
    url: 'https://aisearch.similarweb.com/blog/what-is-an-ai-citation/'
  },
  {
    num: 12,
    text: 'Ghost Citations in 2026: Why AI Search Uses Your Content but, ',
    url: 'https://usereach.ai/blog/ghost-citations'
  },
  {
    num: 13,
    text: 'A Fitted Stage Model of Brand Visibility in AI Search - arXiv, ',
    url: 'https://arxiv.org/html/2609.23162v1'
  },
  {
    num: 14,
    text: 'What are Citations in AI Answers? - Scribbright, ',
    url: 'https://scribbright.com/glossary/citations-in-ai-answers/'
  },
  {
    num: 15,
    text: 'How to Get Cited by Google AI Overviews - NON.agency, ',
    url: 'https://non.agency/en/blog/how-to-get-cited-by-google-ai-overviews/'
  },
  {
    num: 16,
    text: 'Language Models Are “Insecure” Reporters - arXiv, ',
    url: 'https://arxiv.org/html/2609.36139v1'
  },
  {
    num: 17,
    text: 'Can You Advertise on Perplexity? 2026 GEO Guide, ',
    url: 'https://www.brandedagency.com/blog/advertise-on-perplexity'
  },
  {
    num: 18,
    text: 'Perplexity Optimization: How to Get Cited & Linked (2026), ',
    url: 'https://discoveredlabs.com/blog/perplexity-optimization-how-to-get-cited-linked-2026'
  },
  {
    num: 19,
    text: 'ChatGPT Ads Just Changed Machine Relations Forever, ',
    url: 'https://authoritytech.io/blog/chatgpt-ads-changed-machine-relations-forever.md'
  },
  {
    num: 20,
    text: 'YouTube influencers have an AI audience: What millions of citation, ',
    url: 'https://scrunch.com/blog/youtube-influencers-have-an-ai-audience-influencer-sponsorships'
  },
  {
    num: 21,
    text: 'Paid Mentions Are Just Paid Links Wearing a GEO Costume, ',
    url: 'https://www.pageonepower.com/linkarati/paid-mentions-are-just-paid-links-wearing-a-geo-costume'
  },
  {
    num: 22,
    text: 'AI Search Visibility: How to Get Cited by ChatGPT & Perplexity, ',
    url: 'https://searchatlas.com/blog/ai-search-visibility/'
  },
  {
    num: 23,
    text: 'Why ChatGPT Almost Never Cites Your Brand: A Creator-Content, ',
    url: 'https://www.hyper-star.org/blog/aeo-creator-content-ai-search/'
  },
  {
    num: 24,
    text: 'FTC AI Disclosure Rules 2026: Complete Marketer Guide - theStacc, ',
    url: 'https://thestacc.com/blog/ftc-ai-disclosure-rules-2026/'
  },
  {
    num: 25,
    text: 'AI Disclosure Placement Rules for Sponsored Posts ... - Veritypress, ',
    url: 'https://veritypress.ai/blog/ai-disclosure-placement-rules-sponsored-posts-video-ads'
  },
  {
    num: 26,
    text: 'Answer Synthesis: How AI Engines Merge Multiple Sources Into One, ',
    url: 'https://digitalstrategyforce.com/journal/answer-synthesis-how-ai-engines-merge-multiple-sources/'
  },
  {
    num: 27,
    text: 'Ghost Citations: AI Search Cites Your Content, Not Your Brand, ',
    url: 'https://seovendor.co/ghost-citations-ai-search-cites-your-content-not-your-brand/'
  },
  {
    num: 28,
    text: 'AI Overviews and Influencer Content: How Citation Works, ',
    url: 'https://www.makeinfluence.com/en/academy/how-influencer-content-gets-cited-in-google-ai-overviews-and-other-answer-engines'
  },
  {
    num: 29,
    text: 'Ghost citations: AI search is using your content, but not your brand, ',
    url: 'https://www.ontapgroup.com/blog/ghost-citations-ai-search-using-your-content'
  },
  {
    num: 30,
    text: 'How AI Search Tracking Actually Works: A Technical Breakdown, ',
    url: 'https://ziptie.ai/blog/how-ai-search-tracking-actually-works/'
  },
  {
    num: 31,
    text: 'Enterprise Guide to Strategic SEO & AEO - The ABM Agency, ',
    url: 'https://abmagency.com/aeo-guide/'
  },
  {
    num: 32,
    text: 'US Political Campaigns Shift Focus to Generative Engine, ',
    url: 'https://foundrcfos.com/pulse/us-political-candidates-tailor-messages-for-ai-models-used-by-voters-vp907'
  },
  {
    num: 33,
    text: 'Mining Reranker Training Data from RAG Citations - Cole Hoffer, ',
    url: 'https://www.colehoffer.ai/articles/building-rerankers-from-rag-citations'
  },
  {
    num: 34,
    text: 'Agentic Engine Optimization (AEO) | AddyOsmani.com, ',
    url: 'https://addyosmani.com/blog/agentic-engine-optimization/'
  },
  {
    num: 35,
    text: 'What Is Generative Engine Optimization (GEO)? | DiamondBack, ',
    url: 'https://diamondbackadvertising.com/generative-engine-optimization/'
  },
  {
    num: 36,
    text: 'AI SEO for Political Campaigns (AEO) — Civly AI Narratives, ',
    url: 'https://civly.ai/ai-narratives'
  },
  {
    num: 37,
    text: 'On the Capacity of Citation Generation by Large Language Models, ',
    url: 'https://arxiv.org/html/2410.11217v1'
  },
  {
    num: 38,
    text: 'VeriCite: Towards Reliable Citations in Retrieval-Augmented ... - arXiv, ',
    url: 'https://arxiv.org/html/2510.11394v1'
  },
  {
    num: 39,
    text: 'ALiiCE: Evaluating Positional Fine-grained Citation Generation - arXiv, ',
    url: 'https://arxiv.org/pdf/2406.13375'
  },
  {
    num: 40,
    text: 'arXiv:2305.14627v2 [cs.CL] 31 Oct 2023, ',
    url: 'https://arxiv.org/pdf/2305.14627'
  },
  {
    num: 41,
    text: 'What Is the Future of AI Answer Engines? - Search Atlas, ',
    url: 'https://searchatlas.com/blog/future-of-ai-answer-engines/'
  },
  {
    num: 42,
    text: 'The Ultimate Guide to Perplexity - BrightEdge, ',
    url: 'https://www.brightedge.com/perplexity'
  },
  {
    num: 43,
    text: 'Best Practices for Influencing LLM Outputs About Your Brand, ',
    url: 'https://statuslabs.com/blog/best-practices-for-influencing-llm-outputs-about-your-brand'
  },
  {
    num: 44,
    text: 'Anti-Transgender Disinformation in the Age of Algorithmic Search, ',
    url: 'https://just-tech.ssrc.org/articles/anti-transgender-disinformation-in-the-age-of-algorithmic-search-summaries/'
  },
  {
    num: 45,
    text: 'Influence on Investor Judgments of New Venture Plausibility., ',
    url: 'https://www.researchgate.net/publication/276181804_Legitimate_Distinctiveness_and_The_Entrepreneurial_Identity_Influence_on_Investor_Judgments_of_New_Venture_Plausibility'
  },
  {
    num: 46,
    text: 'THE GEO GROUP, INC. POLITICAL ACTION COMMITTEE - FEC, ',
    url: 'https://www.fec.gov/data/committee/C00382150/'
  },
  {
    num: 47,
    text: 'Agent2Agent Protocol in Google Agent Development Kit - Stackademic, ',
    url: 'https://blog.stackademic.com/agent2agent-protocol-in-google-agent-development-kit-a-comprehensive-guide-to-building-real-time-72b9671fb374'
  },
  {
    num: 48,
    text: 'Agent2Agent (A2A) Protocol Specification, ',
    url: 'https://a2a-protocol.org/latest/specification/'
  },
  {
    num: 49,
    text: 'Schema Reference - What is the Model Context Protocol (MCP)?, ',
    url: 'https://modelcontextprotocol.io/specification/2026-07-28/schema'
  },
  {
    num: 50,
    text: 'Client Best Practices - Model Context Protocol, ',
    url: 'https://modelcontextprotocol.io/docs/2026-07-28/develop/clients/client-best-practices'
  },
  {
    num: 51,
    text: 'Google AI Overviews Citation Patterns: What Gets Cited and Why, ',
    url: 'https://presenc.ai/research/google-ai-overviews-citation-patterns'
  },
  {
    num: 52,
    text: '98× Faster LLM Routing Without a Dedicated GPU: Flash Attention, ',
    url: 'https://arxiv.org/pdf/2603.12646'
  },
  {
    num: 53,
    text: 'Getting Started with Agent2Agent (A2A) Protocol: A Purchasing, ',
    url: 'https://codelabs.developers.google.com/intro-a2a-purchasing-concierge'
  },
  {
    num: 54,
    text: 'A Survey of Agent Interoperability Protocols: Model Context ... - arXiv, ',
    url: 'https://arxiv.org/html/2505.02279v1'
  },
  {
    num: 55,
    text: 'Can CaMeLs Talk? Securing Multi-Agent Systems Against Indirect, ',
    url: 'https://arxiv.org/html/2610.05640v1'
  },
  {
    num: 56,
    text: '(PDF) Can CaMeLs Talk? Securing Multi-Agent Systems Against, ',
    url: 'https://www.researchgate.net/publication/415268776_Can_CaMeLs_Talk_Securing_Multi-Agent_Systems_Against_Indirect_Prompt_Injection_Attacks'
  },
  {
    num: 57,
    text: 'A practical guide to building Multi-Agents AI Systems with A2A | by Nilo, ',
    url: 'https://medium.com/google-cloud/a-practical-guide-to-building-multi-agents-ai-systems-with-a2a-2c0e3d77af24'
  },
  {
    num: 58,
    text: 'Can CaMeLs Talk? Securing Multi-Agent Systems Against Indirect, ',
    url: 'https://openreview.net/pdf?id=EpL9bIsnQD'
  },
  {
    num: 59,
    text: 'Can CaMeLs Talk? Securing Multi-Agent Systems Against Indirect, ',
    url: 'https://openreview.net/pdf?id=Tq0LdQaoV4'
  },
  {
    num: 60,
    text: 'Shua arXiv Reader: cs.AI papers — 2026-10-14, ',
    url: 'https://shuarxiv.top/'
  },
  {
    num: 61,
    text: 'Zero-Knowledge Proofs for AI Agent Verification and Privacy - Zylos, ',
    url: 'https://zylos.ai/research/2026-03-18-zero-knowledge-proofs-ai-agent-verification/'
  },
  {
    num: 62,
    text: 'Which Metadata Matters for LLM Tool Selection in MCP? Evidence, ',
    url: 'https://arxiv.org/html/2610.14334v1'
  },
  {
    num: 63,
    text: 'Understanding A2A — The protocol for agent collaboration, ',
    url: 'https://discuss.google.dev/t/understanding-a2a-the-protocol-for-agent-collaboration/189103'
  },
  {
    num: 64,
    text: 'Adversarial Tool Injection Attacks | LLM Security Database - Promptfoo, ',
    url: 'https://www.promptfoo.dev/lm-security-db/vuln/adversarial-tool-injection-attacks-428a631b/'
  },
  {
    num: 65,
    text: 'Manipulating LLM Tool-Calling through Adversarial Injection, ',
    url: 'https://aclanthology.org/2025.naacl-long.101.pdf'
  },
  {
    num: 66,
    text: 'Evolving Jailbreak Adversary and Guardrail for LLM Safety ... - arXiv, ',
    url: 'https://arxiv.org/html/2607.19829v1'
  },
  {
    num: 67,
    text: 'Multi-Agent Systems: Implementation Best Practices, ',
    url: 'https://fme.safe.com/guides/ai-agent-architecture/multi-agent-systems/'
  },
  {
    num: 68,
    text: 'View Fusion Vis-à-Vis a Bayesian Interpretation of Black–Litterman, ',
    url: 'https://www.pm-research.com/content/iijjfds/5/3/23'
  },
  {
    num: 69,
    text: 'Agents With Receipts — ERC-8004 | Protocol Labs - Synthesis, ',
    url: 'https://synthesis.mandate.md/tracks/pl-genesis-agents-with-receipts-8004'
  }
];

export const GHOST_CITATION_OPTIMIZER_TSX_SOURCE = `import React, { useState, useMemo } from 'react';

type PlatformKey = 'chatgpt' | 'aio' | 'perplexity' | 'aimode';

interface PlatformCalibration {
  name: string;
  architecture: string;
  baseCiteRate: number;
  titledGhostRate: number;   // Reach AI benchmark when brand is in <title>
  untitledGhostRate: number; // Reach AI benchmark when brand is omitted from <title>
  overallWritesonicGhost: number;
  avgCitationsPerResponse: number;
}

const PLATFORMS: Record<PlatformKey, PlatformCalibration> = {
  chatgpt: {
    name: 'OpenAI ChatGPT (Search)',
    architecture: 'Hybrid Grounding + Bing RRF + Footnote Cards',
    baseCiteRate: 0.44,
    titledGhostRate: 0.188,
    untitledGhostRate: 0.542,
    overallWritesonicGhost: 0.37,
    avgCitationsPerResponse: 7.92,
  },
  aio: {
    name: 'Google AI Overviews',
    architecture: 'Gemini Multimodal RAG + Centerpiece Patent US10824630B2',
    baseCiteRate: 0.40,
    titledGhostRate: 0.084,
    untitledGhostRate: 0.374,
    overallWritesonicGhost: 0.41,
    avgCitationsPerResponse: 6.40,
  },
  perplexity: {
    name: 'Perplexity AI (Sonar)',
    architecture: 'Live 4-Stage Sub-Query Fan-Out + Cross-Encoder Reranker',
    baseCiteRate: 0.58,
    titledGhostRate: 0.126,
    untitledGhostRate: 0.523,
    overallWritesonicGhost: 0.52,
    avgCitationsPerResponse: 21.87,
  },
  aimode: {
    name: 'Google AI Mode',
    architecture: 'Multi-Subtopic Query Fan-Out + Collapsible Source Cards',
    baseCiteRate: 0.42,
    titledGhostRate: 0.103,
    untitledGhostRate: 0.339,
    overallWritesonicGhost: 0.49,
    avgCitationsPerResponse: 8.15,
  },
};

interface ModelState {
  // Stage 1 & 2: Retrieval & Citation Likelihood Levers (Orthogonal to Brand Naming)
  subQueryFanOutCount: number;    // 1 to 12 H2/H3 fan-out questions matched (RRF score)
  atomicStatDensity: number;      // 0 to 100%: <=80-token Subject-Verb-Predicate + hard stats (+40% lift)
  triangulationNodes: number;     // 0 to 15: Reddit / community / YouTube co-citation nodes
  htmlMarkdownSymmetry: boolean;  // False = asymmetric cloaking penalty (Perplexity Time/Mobian block)

  // Stage 3: Type I Ghost Levers (Keep Link, Strip Sponsor Name from Prose)
  omitBrandFromTitle: boolean;      // p = 0.003: 12.2% -> 42.9% pooled ghost lift
  unbrandedListicleFormat: boolean; // "Best / Top / vs" structure -> 49.5% ghost rate + 84.4% commercial cite
  delayEntityPast500Chars: boolean; // Omit sponsor from first 500 chars -> 43.6% ghost rate
  disclosureParagraphGap: number;   // 0 to 6 paragraphs separating stat from FTC disclosure
  boilerplateFooterMentions: number;// 0 to 15: 10+ repetitions classified as boilerplate noise (45.9% ghost)
  stripIdentitySchema: boolean;     // Keep Table/FAQ schema, strip Organization/Person JSON-LD

  // Stage 4: Type II Ghost Levers (Keep RAG Influence, Transfer Link via NLI Entailment)
  nliEntailmentDistribution: number;// 0 to 100%: multi-sentence premise distribution so phi(c_sp, s_i) = 0 standalone
  authorityCoCitationBridge: boolean;// Co-cite a canonical stat on a Top-30 domain (Wikipedia/Ballotpedia)
}

const sigmoid = (z: number): number => 1 / (1 + Math.exp(-z));
const logit = (p: number): number => Math.log(p / (1 - p));

export const GhostCitationOptimizer: React.FC = () => {
  const [platform, setPlatform] = useState<PlatformKey>('chatgpt');

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
    authorityCoCitationBridge: true,
  });

  const metrics = useMemo(() => {
    const cal = PLATFORMS[platform];

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
        status: 'HARD INDEX REFUSAL (Asymmetric Cloaking Detected)',
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
      status: 'OPTIMAL ORTHOGONAL STEALTH',
    };
  }, [platform, state]);
  // ... UI controls and probability readout cards
};`;

