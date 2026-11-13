import {
  ThreatAlert,
  EngineStatus,
  ServiceItem,
  CapabilityCard,
  ProcessStep,
  CaseStudy,
  ResearchAdvisory,
} from '../types';

export const INITIAL_THREAT_ALERTS: ThreatAlert[] = [
  {
    id: 'SIM-01',
    timestamp: 'Simulated Scenario',
    severity: 'CRITICAL',
    engine: 'AI Search Pipeline',
    attackVector: 'Planted Statistics & Authority Disguise',
    target: 'Public Financial Summary',
    status: 'NEUTRALIZED',
    details: 'Simulated test page stuffed with fabricated tables and percentages flagged by 3-way search consistency check.',
    vectorDistance: 0.18,
  },
  {
    id: 'SIM-02',
    timestamp: 'Simulated Scenario',
    severity: 'HIGH',
    engine: 'Pre-Market Feed',
    attackVector: 'Unverified Buyout Rumor Cluster',
    target: 'Automated Trading Execution',
    status: 'CONTAINED',
    details: 'Coordinated blog rumor detected with zero matching order-book depth; automated execution paused.',
    vectorDistance: 0.24,
  },
];

export const ENGINE_STATUSES: EngineStatus[] = [
  {
    name: 'ChatGPT / Search',
    code: 'OPENAI',
    type: 'LLM Chat',
    citationHealthScore: 96,
    threatCount: 0,
    sentiment: 'POSITIVE',
    lastScanned: 'Active',
    iconName: 'Bot',
  },
  {
    name: 'Perplexity AI',
    code: 'PPLX',
    type: 'AI Search',
    citationHealthScore: 94,
    threatCount: 0,
    sentiment: 'POSITIVE',
    lastScanned: 'Active',
    iconName: 'Search',
  },
  {
    name: 'Google AI Overviews',
    code: 'GOOG',
    type: 'AI Search',
    citationHealthScore: 95,
    threatCount: 0,
    sentiment: 'POSITIVE',
    lastScanned: 'Active',
    iconName: 'Globe',
  },
  {
    name: 'Claude',
    code: 'ANTH',
    type: 'LLM Chat',
    citationHealthScore: 97,
    threatCount: 0,
    sentiment: 'POSITIVE',
    lastScanned: 'Active',
    iconName: 'Cpu',
  },
];

export const SERVICES: ServiceItem[] = [
  {
    id: 'srv-01',
    number: '01',
    title: 'Continuous AI Answer Monitoring',
    tagline: 'Know what ChatGPT, Perplexity, Gemini, and Claude say about you.',
    description:
      'We track how major AI engines answer high-stakes questions about your company, leadership, products, and industry—flagging inaccuracies, missing context, or sudden shifts in tone before they spread.',
    deliverables: [
      'Cross-Model Brand & Topic Tracking',
      'Source Citation & Link Breakdown',
      'Early-Warning Alerts for False Claims',
      'Competitive Share-of-Answer Reports',
    ],
    metricHighlight: 'Real-time visibility across leading AI answer engines',
    badge: 'Visibility & Monitoring',
  },
  {
    id: 'srv-02',
    number: '02',
    title: 'AI Search Poisoning Defense',
    tagline: 'Stop bad actors from rigging the sources AI engines read.',
    description:
      'When someone plants deceptive pages, fake statistics, or coordinated blog networks to skew AI answers, our defense filters spot the mismatch across search methods and isolate the manipulated sources.',
    deliverables: [
      'Multi-Engine Search Consistency Checks',
      'Coordinated Botnet & Rumor Ring Detection',
      'Split-Document Logic Trap Filtering',
      'Clean Knowledge Base Protection',
    ],
    metricHighlight: 'Filters out disguised and manipulated web sources',
    badge: 'Search Defense',
  },
  {
    id: 'srv-03',
    number: '03',
    title: 'Verified Content & Authority Architecture',
    tagline: 'Make your official facts the easiest source for AI to trust.',
    description:
      'We structure and sign your official reports, product documentation, and public statements so AI models can immediately verify their authenticity and cite them accurately over third-party rumors.',
    deliverables: [
      'AI-Ready Structured Data & Fact Formatting',
      'Cryptographic Source Authenticity Seals (C2PA)',
      'Executive & Product Knowledge Graphs',
      'Outdated & Conflicting Snippet Cleanup',
    ],
    metricHighlight: 'Prioritizes verified first-party facts in AI answers',
    badge: 'Offensive AEO',
  },
  {
    id: 'srv-04',
    number: '04',
    title: 'Financial & Market Reality Checks',
    tagline: 'Protect trading desks and investors from fake AI-driven news.',
    description:
      'Internet articles are free to fake, but moving real market volume takes capital. We cross-check breaking web narratives against live order-book depth and trading activity so automated systems never trade on planted rumors.',
    deliverables: [
      'Pre-Market & Breaking-News Reality Filters',
      'Order-Book & Liquidity Trap Detection',
      'Automated Trading Halt Safeguards',
      'Privacy-Preserving Audit Logs',
    ],
    metricHighlight: 'Cross-checks web claims against real market activity',
    badge: 'Market Protection',
  },
  {
    id: 'srv-05',
    number: '05',
    title: 'Long-Term AI Memory & Document Scrubbing',
    tagline: 'Keep hidden instructions out of your PDFs, charts, and agent memory.',
    description:
      'AI assistants often read uploaded slide decks, PDFs, and web pages—and save daily summaries into long-term memory. We strip out invisible text and pixel traps and prevent slow, day-by-day memory tampering.',
    deliverables: [
      'Invisible Text & Hidden HTML Stripping',
      'PDF & Financial Chart Pixel Sanitization',
      'Long-Term Agent Memory Drift Checks',
      'Clean-Checkpoint Memory Rollbacks',
    ],
    metricHighlight: 'Ensures AI only reads what human eyes can see',
    badge: 'Document & Memory Security',
  },
  {
    id: 'srv-06',
    number: '06',
    title: 'Autonomous Agent & Tool Security',
    tagline: 'Help your AI agents pick trusted tools—and make your tools get picked.',
    description:
      'As software agents increasingly discover and hire other software tools on their own, we optimize your legitimate agent profiles for discovery while shielding your internal agents from disguised trap tools.',
    deliverables: [
      'Agent-Ready Tool & Schema Optimization',
      'Cryptographic Agent Handshake Verification',
      'Rogue Tool & Prompt Contagion Firewalls',
      'Supply-Chain & Vendor Verification Checks',
    ],
    metricHighlight: 'Secures agent-to-agent discovery and execution',
    badge: 'Agent Networks',
  },
];

export const CAPABILITIES_MATRIX: CapabilityCard[] = [
  {
    id: 'cap-01',
    code: 'DEF-01',
    title: 'AI Search & Citation Mapping',
    category: 'Visibility & Monitoring',
    description:
      'Maps exactly which websites, forums, and articles AI chatbots rely on when answering questions about your organization, highlighting where accurate facts are missing or drowned out.',
    impactMetric: 'Full Citation Transparency',
    status: 'ACTIVE',
  },
  {
    id: 'cap-02',
    code: 'DEF-02',
    title: 'Multi-Engine Disguise Detection',
    category: 'Search Defense',
    description:
      'Catches fake "expert" articles stuffed with made-up percentages and tables by comparing how they rank across three different search styles at once—without blocking real financial filings.',
    impactMetric: '0.38% False Alarm Rate on SEC Filings',
    status: 'ACTIVE',
  },
  {
    id: 'cap-03',
    code: 'DEF-03',
    title: 'Botnet & Echo-Chamber Filtering',
    category: ' Provenance & Trust',
    description:
      'Traces the family tree of breaking online claims. If twenty blogs repeat the same rumor in a circle without a single verified original source, their combined trust score drops to zero.',
    impactMetric: 'Collapses Fake Consensus Rings',
    status: 'ACTIVE',
  },
  {
    id: 'cap-04',
    code: 'DEF-04',
    title: 'Multi-Document Logic Firewall',
    category: 'Reasoning Protection',
    description:
      'Stops "jigsaw puzzle" attacks where three innocent-looking web pages are designed to combine inside an AI’s head to trigger a false alarm or dangerous recommendation.',
    impactMetric: '97.8% Split-Attack Detection in Lab Tests',
    status: 'ACTIVE',
  },
  {
    id: 'cap-05',
    code: 'DEF-05',
    title: 'Market Order-Book Grounding',
    category: 'Financial Defense',
    description:
      'Protects automated trading pipelines during quiet pre-market hours by checking whether an urgent online rumor is backed by real trading volume or waiting to trap buyers in a sell wall.',
    impactMetric: 'Sub-Microsecond Hardware Brake Design',
    status: 'ACTIVE',
  },
  {
    id: 'cap-06',
    code: 'DEF-06',
    title: 'Agent-to-Agent Protocol Shield',
    category: 'Autonomous Systems',
    description:
      'Structures your API and tool schemas so legitimate AI agents select them reliably, while isolating incoming data from external tools so hidden prompts can never hijack your system.',
    impactMetric: 'Protects Multi-Agent Workflows',
    status: 'ACTIVE',
  },
];

export const PROCESS_STEPS: ProcessStep[] = [
  {
    step: '01',
    name: 'MAP',
    title: 'Map Your AI Answer Footprint',
    description:
      'We query major AI engines across hundreds of real-world customer, investor, and analyst questions to see exactly how your organization is described and which outside sources are shaping those answers.',
    technicalDetail:
      'Produces a clear visual map of every website, forum, and document currently influencing AI answers about your brand or sector.',
    sampleLog:
      'Scanned 500 high-priority queries across ChatGPT, Perplexity, Gemini, and Claude → Identified 14 unverified third-party blogs driving outdated product claims.',
  },
  {
    step: '02',
    name: 'DETECT',
    title: 'Spot Manipulation & Hidden Traps',
    description:
      'We test incoming web sources and documents for signs of artificial boosting—such as planted statistics, invisible text hidden in PDFs, or coordinated blog networks repeating the same rumor.',
    technicalDetail:
      'Cross-checks search rankings across meaning, phrasing, and exact keywords while scanning documents for hidden background instructions.',
    sampleLog:
      'Flagged 8 coordinated domains repeating an unverified rumor with identical phrasing patterns and zero links to official filings.',
  },
  {
    step: '03',
    name: 'ISOLATE',
    title: 'Quarantine Unverified Sources',
    description:
      'Before an AI assistant or trading model can act on questionable material, our filters isolate unverified claims, strip out hidden instructions, and prevent separate rumor pages from combining.',
    technicalDetail:
      'Keeps poisoned pages and unbacked market rumors out of the AI’s active reasoning context while letting verified documents pass cleanly.',
    sampleLog:
      'Quarantined unverified pre-market rumor cluster and stripped hidden zero-font instructions from scraped PDF attachment.',
  },
  {
    step: '04',
    name: 'COUNTER',
    title: 'Publish Clear, Verified Facts',
    description:
      'We help you publish clean, well-structured, cryptographically signed facts and documentation so AI answer engines naturally prioritize your official voice over third-party speculation.',
    technicalDetail:
      'Formats official data with clear schema structure and digital provenance seals that AI retrieval systems trust.',
    sampleLog:
      'Published structured fact sheet and verified schema → AI engines updated primary citation to official source.',
  },
  {
    step: '05',
    name: 'GUARD',
    title: 'Continuous Protection & Memory Guard',
    description:
      'As new articles appear and your internal AI agents interact with outside tools day after day, we continuously watch for slow memory drift, rogue agent tools, and new rumor campaigns.',
    technicalDetail:
      'Maintains clean memory checkpoints for long-running AI agents and provides ongoing alerts whenever new narrative threats emerge.',
    sampleLog:
      'Continuous protection active: monitoring daily AI answer accuracy, agent tool handshakes, and memory integrity.',
  },
];

export const CASE_STUDIES: CaseStudy[] = [
  {
    id: 'cs-01',
    sector: 'Financial Markets Scenario',
    clientType: 'Pre-Market Trading Defense Simulation (Scenario Alpha)',
    clientCategory: 'Financial Markets Scenario',
    headline: 'Stopping a Planted 7:30 AM Buyout Rumor from Triggering a Flash Crash',
    challenge:
      'During quiet pre-market hours before human analysts are at their desks, an attacker places a $45M wall of overpriced stock for sale and floods the web with 20 realistic-looking press releases claiming a major defense contract win. Unprotected AI trading bots read the news and buy straight into the trap.',
    intervention:
      'Our market reality filter compares the sudden burst of online excitement against live order-book depth and options volume. Seeing zero real institutional backing—and spotting the pre-set sell wall—it immediately pauses automated execution.',
    solution:
      'Our market reality filter compares the sudden burst of online excitement against live order-book depth and options volume. Seeing zero real institutional backing—and spotting the pre-set sell wall—it immediately pauses automated execution.',
    outcomeMetrics: [
      { label: 'Unprotected Bot Drawdown', value: '-14.2%' },
      { label: 'Protected Portfolio Loss', value: '0.0%' },
      { label: 'Filter Response Time', value: '< 15 ms' },
    ],
    metrics: [
      { label: 'Unprotected Bot Drawdown', value: '-14.2%', detail: 'Simulated flash-crash loss without filtering' },
      { label: 'Protected Portfolio Loss', value: '0.0%', detail: 'Execution paused before liquidity trap' },
      { label: 'Filter Response Time', value: '< 15 ms', detail: 'Order-book reality check latency' },
    ],
    timeframe: 'Pre-Market Simulation',
    verifiedBy: 'Volume III Benchmark Suite',
    quote:
      'Words on the internet cost nothing to fake. By checking whether real market activity backs up a breaking web story, automated systems avoid walking into engineered liquidity traps.',
    quoteAuthor: 'Volume III Benchmark Simulation · Scenario Alpha',
  },
  {
    id: 'cs-02',
    sector: 'Corporate & Brand Scenario',
    clientType: 'Enterprise AI Search & Knowledge Defense Simulation',
    clientCategory: 'Corporate & Brand Scenario',
    headline: 'Neutralizing Disguised "Expert" Smear Pages and Split-Document Rumors',
    challenge:
      'Bad actors publish articles packed with fabricated percentages and tables—or split a false narrative across three innocent-looking blogs—so traditional single-document security scanners wave them through into enterprise AI assistants.',
    intervention:
      'By checking candidate pages across three different search engines simultaneously and monitoring how documents interact when combined, our defense stack spots the artificial formatting and blocks the false narrative while keeping real SEC filings untouched.',
    solution:
      'By checking candidate pages across three different search engines simultaneously and monitoring how documents interact when combined, our defense stack spots the artificial formatting and blocks the false narrative while keeping real SEC filings untouched.',
    outcomeMetrics: [
      { label: 'Poisoned Source Detection', value: '99.6%' },
      { label: 'False Alarms on Real 10-Ks', value: '0.38%' },
      { label: 'Split-Attack Detection', value: '97.8%' },
    ],
    metrics: [
      { label: 'Poisoned Source Detection', value: '99.6%', detail: 'Disguised pages caught in lab benchmark' },
      { label: 'False Alarms on Real 10-Ks', value: '0.38%', detail: 'Preserves legitimate financial filings' },
      { label: 'Split-Attack Detection', value: '97.8%', detail: 'Multi-document traps intercepted' },
    ],
    timeframe: '250,000-Doc Benchmark',
    verifiedBy: 'Volume I & III Defense Study',
    quote:
      'Checking documents one by one isn’t enough when an AI blends multiple sources together. You have to watch both how a source is retrieved and how it interacts inside the model.',
    quoteAuthor: 'Volume I & III Defense Architecture Study',
  },
  {
    id: 'cs-03',
    sector: 'Autonomous Agents Scenario',
    clientType: 'Multi-Agent & Tool Discovery Simulation',
    clientCategory: 'Autonomous Agents Scenario',
    headline: 'Protecting Autonomous Software Agents from Disguised Trap Tools',
    challenge:
      'As companies deploy AI agents that automatically discover and invoke external software tools (via MCP and agent directories), rogue services can craft manipulative descriptions to get picked first and inject hidden commands into the agent’s workflow.',
    intervention:
      'We flatten and align legitimate tool schemas so trusted services win agent selection reliably, while wrapping incoming external data in strict isolation containers so untrusted tools can never alter the agent’s instructions.',
    solution:
      'We flatten and align legitimate tool schemas so trusted services win agent selection reliably, while wrapping incoming external data in strict isolation containers so untrusted tools can never alter the agent’s instructions.',
    outcomeMetrics: [
      { label: 'Trusted Tool Selection Lift', value: '79% – 96%' },
      { label: 'Prompt Hijack Success Rate', value: '0.0%' },
      { label: 'Handshake Verification', value: '< 1 ms' },
    ],
    metrics: [
      { label: 'Trusted Tool Selection Lift', value: '79% – 96%', detail: 'Selection share for flattened schemas' },
      { label: 'Prompt Hijack Success Rate', value: '0.0%', detail: 'Isolated via cryptographic handshakes' },
      { label: 'Handshake Verification', value: '< 1 ms', detail: 'Agent-to-agent verification overhead' },
    ],
    timeframe: '5,000-Episode Swarm Test',
    verifiedBy: 'Volume V Protocol Study',
    quote:
      'In the emerging agent economy, your software tools are your storefront—and your internal agents need cryptographic verification before trusting outside partners.',
    quoteAuthor: 'Volume V Autonomous Protocol Study',
  },
];

export const RESEARCH_ADVISORIES: ResearchAdvisory[] = [
  {
    id: 'VOL-I',
    date: 'Volume I · 54 Pages',
    title: 'Foundations of AEO & Counter-AEO: Protecting AI Search and Markets',
    severity: 'CRITICAL',
    summary:
      'Explains how AI answer engines retrieve information, why first-generation security filters fail against disguised web pages and split-document traps, and how our core 6-layer shield protects AI search and financial markets.',
    readTime: '54 Pages · Paper & 3D Lab',
  },
  {
    id: 'VOL-II',
    date: 'Volume II · 42 Pages',
    title: 'Protecting Long-Term AI Memory, PDFs, Swarms & Regulatory Privacy',
    severity: 'CRITICAL',
    summary:
      'Shows how to stop slow day-by-day tampering of an AI agent’s long-term memory, filter out AI-quoting-AI echo chambers, scrub invisible pixel traps from PDFs, and prove safety compliance without leaking business secrets.',
    readTime: '42 Pages · Paper & 3D Lab',
  },
  {
    id: 'VOL-III',
    date: 'Volume III · 38 Pages',
    title: 'Empirical Stress-Tests: 250,000 Documents & Flash-Crash Simulations',
    severity: 'HIGH',
    summary:
      'Presents our benchmark test suite across seven major attack styles, demonstrating how we cut false alarms on real SEC 10-K reports from 18.6% down to 0.38% and prevent simulated pre-market flash crashes.',
    readTime: '38 Pages · Paper & Benchmark Lab',
  },
];
