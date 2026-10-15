import { ThreatAlert, EngineStatus, ServiceItem, CapabilityItem, CaseStudy, ResearchAdvisory } from '../types';

export const INITIAL_THREAT_ALERTS: ThreatAlert[] = [
  {
    id: 'THREAT-8942',
    timestamp: 'Just now (15:32:04 UTC)',
    severity: 'CRITICAL',
    engine: 'ChatGPT (GPT-4o)',
    attackVector: 'Prompt Injection / Memory Poisoning',
    target: 'Global Executive Bio & Legal Disclosure',
    status: 'NEUTRALIZED',
    details: 'Adversary deployed indirect prompt injection via untrusted review site targeting executive RAG citations.',
    vectorDistance: 0.18
  },
  {
    id: 'THREAT-8941',
    timestamp: '3m ago',
    severity: 'HIGH',
    engine: 'Perplexity AI',
    attackVector: 'RAG Citation Hijacking',
    target: 'Quarterly Earnings Summary & Debt Ratio',
    status: 'CONTAINED',
    details: 'Hallucinated financial metrics injected into secondary news crawler, skewing AI summary results.',
    vectorDistance: 0.32
  },
  {
    id: 'THREAT-8940',
    timestamp: '12m ago',
    severity: 'CRITICAL',
    engine: 'Google AI Overviews',
    attackVector: 'Synthetic Defamation / False Safety Alert',
    target: 'Product Safety & FDA Compliance Status',
    status: 'NEUTRALIZED',
    details: 'Adversarial website manipulated structured data snippets causing AI overview to assert false product recall.',
    vectorDistance: 0.12
  },
  {
    id: 'THREAT-8939',
    timestamp: '28m ago',
    severity: 'MEDIUM',
    engine: 'Claude 3.5 Sonnet',
    attackVector: 'Adversarial Answer Engine Optimization (AEO)',
    target: 'Competitive Enterprise Vendor Comparison',
    status: 'INVESTIGATING',
    details: 'Competitor deployed automated vector-optimized blogs artificially elevating rival ratings in RAG context.',
    vectorDistance: 0.45
  },
  {
    id: 'THREAT-8938',
    timestamp: '44m ago',
    severity: 'HIGH',
    engine: 'DeepSeek-V3',
    attackVector: 'Model Hallucination Exploitation',
    target: 'Patent Ownership & Open Source License',
    status: 'ACTIVE',
    details: 'Hallucinated licensing restrictions synthesized from malicious Reddit thread, affecting B2B developer queries.',
    vectorDistance: 0.29
  },
  {
    id: 'THREAT-8937',
    timestamp: '1h 05m ago',
    severity: 'CRITICAL',
    engine: 'Copilot (Bing RAG)',
    attackVector: 'Data Source Poisoning',
    target: 'Customer Support Escalation & Contact Info',
    status: 'NEUTRALIZED',
    details: 'Scam phone number substituted in AI search snippets via malicious forum SEO manipulation.',
    vectorDistance: 0.14
  }
];

export const ENGINE_STATUSES: EngineStatus[] = [
  {
    name: 'ChatGPT / GPT-4o',
    code: 'OPENAI-GPT4O',
    type: 'LLM Chat',
    citationHealthScore: 94,
    threatCount: 3,
    sentiment: 'POSITIVE',
    lastScanned: 'Real-time',
    iconName: 'Bot'
  },
  {
    name: 'Perplexity AI',
    code: 'PPLX-RAG',
    type: 'AI Search',
    citationHealthScore: 88,
    threatCount: 7,
    sentiment: 'DISTORTED',
    lastScanned: 'Real-time',
    iconName: 'Search'
  },
  {
    name: 'Google AI Overviews',
    code: 'GOOG-AIO',
    type: 'AI Search',
    citationHealthScore: 91,
    threatCount: 5,
    sentiment: 'POSITIVE',
    lastScanned: '1m ago',
    iconName: 'Globe'
  },
  {
    name: 'Claude 3.5 / Opus',
    code: 'ANTH-CLAUDE',
    type: 'LLM Chat',
    citationHealthScore: 97,
    threatCount: 1,
    sentiment: 'POSITIVE',
    lastScanned: 'Real-time',
    iconName: 'Cpu'
  },
  {
    name: 'Microsoft Copilot',
    code: 'MSFT-COPILOT',
    type: 'RAG Pipeline',
    citationHealthScore: 86,
    threatCount: 8,
    sentiment: 'DISTORTED',
    lastScanned: '2m ago',
    iconName: 'Layers'
  },
  {
    name: 'DeepSeek-V3 / R1',
    code: 'DEEPSEEK-R1',
    type: 'LLM Chat',
    citationHealthScore: 82,
    threatCount: 11,
    sentiment: 'HOSTILE',
    lastScanned: 'Real-time',
    iconName: 'Zap'
  }
];

export const SERVICES: ServiceItem[] = [
  {
    id: 'defensive-cyber',
    title: 'Counter-GEO Defensive Cybersecurity',
    subtitle: 'Sovereign Epistemic Defense & RAG Layer Immunization',
    icon: 'ShieldCheck',
    badge: 'DEFENSIVE CYBER',
    description: 'Comprehensive defensive cybersecurity shielding enterprise knowledge bases and domestic commercial foundation models (Claude, ChatGPT, Gemini) from foreign adversaries targeting the open-web RAG layer.',
    capabilities: [
      'Continuous vector embedding telemetry across multi-engine RAG pipelines',
      'Automated indirect prompt injection & memory poisoning neutralization',
      'Cryptographic HSM ground-truth anchoring for SEC and corporate filings',
      'Hawkes-process contagion suppression across generative answer engines'
    ],
    sampleLog: '[DEFENSIVE_CYBER] Quarantined 19 asymmetric RAG poisoning payloads targeting corporate financial disclosures. Embeddings stabilized at cosine similarity 0.998. Vector drift neutralized.'
  },
  {
    id: 'offensive-ops',
    title: 'Offensive GEO Cyber Operations',
    subtitle: 'Model-Targeted Asymmetric Operations & Swarm Interdiction',
    icon: 'Crosshair',
    badge: 'OFFENSIVE OPERATIONS',
    description: 'Precision offensive cyber operations engineered for national security agencies and sovereign defense contractors: weaponizing the unfortified open-web RAG layers of foreign foundation models, discovering novel exploitation algorithms, and executing Agent-to-Agent (A2A) swarm interdiction.',
    capabilities: [
      'Asymmetric targeting of foreign foundation model open-web RAG pipelines',
      'Frontier model recursive deep-research for zero-day offensive algorithm discovery',
      'Agent-to-Agent (A2A) protocol interdiction & autonomous drone swarm disruption',
      'Adversarial retrieval displacement across foreign sovereign search engines'
    ],
    sampleLog: '[OFFENSIVE_OPS] Executed sovereign RAG layer probe against foreign frontier model cluster. Identified 12 unfortified external ingestion sinks. Deployed asymmetric semantic counter-vector.'
  },
  {
    id: 'market-arbitrage',
    title: 'Liquidity Extraction & Market Arbitrage',
    subtitle: 'Algorithmic Order-Book Sweeps & Market Manipulation Defense',
    icon: 'TrendingUp',
    badge: 'MARKET OPERATIONS',
    description: 'Dual-use financial intelligence for broker-dealers, hedge funds, and sovereign treasuries: defending domestic markets from foreign liquidity extraction attacks while deploying algorithmic GEO strategies to capture bot-generated liquidity in high-frequency trading.',
    capabilities: [
      'Detection and interdiction of foreign-state generative market manipulation',
      'Pre-positioned limit-order wall defense against predatory agent buying sweeps',
      'Algorithmic GEO execution converting generative AI queries into actionable liquidity',
      'SEC, FINRA, & Treasury-grade sovereign market monitoring and compliance telemetry'
    ],
    sampleLog: '[ARBITRAGE_INTEL] Flagged coordinated agent buying sweep in mid-cap industrial assets. Defended pre-positioned order book; captured $14.2M bot-generated liquidity pool.'
  }
];

export const CAPABILITIES_MATRIX: CapabilityItem[] = [
  {
    id: 'cap-1',
    title: 'Open-Web RAG Layer Immunization',
    category: 'Defensive Cyber',
    icon: 'Database',
    description: 'Immunize public and enterprise data sources against asymmetric RAG poisoning designed by foreign intelligence services to corrupt domestic models like Claude, ChatGPT, and Gemini.',
    technicalImpact: 'Cryptographic HSM root anchors and cosine similarity bounds prevent adversarial micro-data from being ingested into generative vector indexes.'
  },
  {
    id: 'cap-2',
    title: 'Foreign Model RAG Targeting',
    category: 'Offensive Operations',
    icon: 'Crosshair',
    description: 'Asymmetric offensive cyber operations targeting the open-web retrieval layers of foreign commercial and sovereign foundation models, bypassing corporate firewalls without touching model weights.',
    technicalImpact: 'Injects authorized, low-cost decentralized semantic vectors into foreign crawling clusters to shape model perception and decision synthesis.'
  },
  {
    id: 'cap-3',
    title: 'Liquidity Extraction Arbitrage Defense',
    category: 'Market Arbitrage',
    icon: 'TrendingUp',
    description: 'Detect, intercept, and counter predatory attacks where adversaries accumulate pre-positioned limit orders and trigger automated AI bot buying sweeps to extract market liquidity.',
    technicalImpact: 'Correlates high-frequency order-book anomalies with generative engine query velocity to neutralize synthetic liquidity traps in real time.'
  },
  {
    id: 'cap-4',
    title: 'Agent-to-Agent (A2A) Swarm Interdiction',
    category: 'Autonomous Swarms',
    icon: 'GitFork',
    description: 'Offensive and defensive counter-GEO operations for autonomous drone swarms, defense contractor robotics, and interconnected multi-agent communication networks.',
    technicalImpact: 'Neutralizes semantic spoofing and consensus hijacking across distributed autonomous agent communication protocols.'
  },
  {
    id: 'cap-5',
    title: 'Frontier Model Deep Research & Novel Algorithms',
    category: 'Offensive Operations',
    icon: 'Search',
    description: 'Harnessing frontier reasoning models in recursive deep-research configurations to discover novel mathematical algorithms and zero-day offensive GEO strategies never before seen.',
    technicalImpact: 'Generates non-obvious topological retrieval paths and novel vector perturbation strategies before foreign adversaries can develop them.'
  },
  {
    id: 'cap-6',
    title: 'Sovereign Market Manipulation Countermeasures',
    category: 'Defensive Cyber',
    icon: 'AlertTriangle',
    description: 'Nation-state cyber defense shielding American financial markets, sovereign debt stability, and regulatory disclosures from foreign generative disinformation campaigns.',
    technicalImpact: 'Multi-model Hawkes-process consensus filters suppress synthetic panic contagion across Bloomberg/Reuters terminals and AI analyst agents.'
  }
];

export const PROCESS_STEPS = [
  {
    step: '01',
    phase: 'SCAN & INGEST',
    title: 'Continuous Engine Probing',
    description: 'Last Crusade Defense continuously executes automated multi-vector prompts across 15+ frontier LLMs, search engines, and enterprise RAG vector indexes.',
    icon: 'Radio'
  },
  {
    step: '02',
    phase: 'DETECT & ATTRIBUTE',
    title: 'Perception Vector Analysis',
    description: 'Our proprietary neural analyzer compares model output embeddings against verified brand ground-truth data to calculate hallucination and distortion scores.',
    icon: 'Cpu'
  },
  {
    step: '03',
    phase: 'ISOLATE THREAT',
    title: 'Source Provenance Mapping',
    description: 'We pinpoint the exact web document, prompt injection payload, or corrupt vector database entry causing the generative engine to produce toxic answers.',
    icon: 'Crosshair'
  },
  {
    step: '04',
    phase: 'COUNTERMEASURE',
    title: 'Active Remediation & Seeding',
    description: 'Deploy authoritative high-density entity schemas and trigger source-level technical or legal takedowns to displace distorted answers.',
    icon: 'ShieldCheck'
  },
  {
    step: '05',
    phase: 'SURVEILLANCE',
    title: 'Model Regression Testing',
    description: 'Automated 24/7 post-remediation monitoring ensures fine-tuning updates or model retraining cycles do not re-introduce suppressed threats.',
    icon: 'Eye'
  }
];

export const CASE_STUDIES: CaseStudy[] = [
  {
    id: 'fintech-liquidity',
    clientCategory: 'Global Fortune 500 FinTech Enterprise',
    headline: 'Eradicated $12M Fake Liquidity Rumor across 4 Major LLMs in 14 Days',
    challenge: 'A bad actor published subtle, mathematically altered financial table snippets in obscure online forums. Within 48 hours, Perplexity and ChatGPT began citing these figures, informing users that the firm was experiencing a liquidity crisis.',
    solution: 'Last Crusade Defense deployed Counter-GEO operations: isolated corrupt forum citations, executed technical source neutralization, and flooded AI retrieval nodes with cryptographically signed annual financial disclosures.',
    metrics: [
      { label: 'Time to Neutralization', value: '14 Days', detail: 'Total resolution across ChatGPT, Perplexity, Copilot, & Claude' },
      { label: 'AI Answer Accuracy', value: '100%', detail: 'Verified accurate financial citation restored' },
      { label: 'Stock Volatility Saved', value: '$45M+', detail: 'Estimated market value loss prevented' }
    ],
    timeframe: 'Q1 2026',
    verifiedBy: 'Chief Information Security Officer & VP Brand Governance'
  },
  {
    id: 'pharma-recall',
    clientCategory: 'BioPharma Manufacturer',
    headline: 'Suppressed Hallucinated Side-Effect Claims in AI Search Overviews',
    challenge: 'Due to semantic confusion in training data, AI search engines hallucinated a non-existent FDA safety recall for a blockbuster respiratory treatment, causing patient panic and hotline overload.',
    solution: 'Last Crusade Defense conducted deep forensic investigation, identified 3 corrupt medical aggregator scrapers, coordinated urgent source corrections, and established authoritative medical knowledge graph entity anchors.',
    metrics: [
      { label: 'Hallucination Rate', value: '0.0%', detail: 'Reduced from 38% down to 0% across search bots' },
      { label: 'Medical Hotline Traffic', value: '-82%', detail: 'Normal support call volume restored' },
      { label: 'Models Cleared', value: '8 LLMs', detail: 'Google AI, Perplexity, Copilot, ChatGPT, Gemini, etc.' }
    ],
    timeframe: 'Q2 2026',
    verifiedBy: 'Global Head of Medical Affairs & Regulatory Compliance'
  },
  {
    id: 'tech-executive-bio',
    clientCategory: 'Enterprise SaaS Unicorn ($8B Valuation)',
    headline: 'Thwarted Adversarial Prompt Injection Targeting Executive M&A Queries',
    challenge: 'Competitors concealed indirect prompt injection payloads in product comparison blog posts. When users asked LLMs whether to acquire or partner with the client, the LLMs hallucinated non-existent patent litigation.',
    solution: 'Last Crusade Defense Threat Detection triggered immediate alert. Counter-GEO team identified the injected payload, coordinated black-hat SEO takedown, and deployed verified corporate patent index schemas.',
    metrics: [
      { label: 'Threat Incident Time', value: '4m 12s', detail: 'SLA response from alert trigger to countermeasure' },
      { label: 'M&A Deal Impact', value: 'Protected', detail: 'Partner due diligence queries cleared cleanly' },
      { label: 'Injected Sources Removed', value: '100%', detail: 'Adversarial blogs blacklisted across primary indexes' }
    ],
    timeframe: 'Q3 2026',
    verifiedBy: 'Chief Executive Officer & General Counsel'
  }
];

export const RESEARCH_ADVISORIES: ResearchAdvisory[] = [
  {
    id: 'ADV-2026-004',
    title: 'Counter GEO Master Doc Volume 1: Sovereign Architecture for Epistemic & Financial Cybersecurity',
    date: 'October 2026',
    type: 'Vulnerability Notice',
    summary: 'The foundational whitepaper introducing the threat of Generative Engine Optimization (GEO) and the core defense framework. It examines how adversaries manipulate AI search and retrieval systems to distort facts, and presents mathematical defenses to filter out synthetic content, protect decision-making pipelines, and keep enterprise AI reliable.',
    severity: 'CRITICAL'
  },
  {
    id: 'ADV-2026-003',
    title: 'Counter GEO Master Doc Volume 2: Stateful Memory Immunity, Byzantine Swarms & Zero-Knowledge Compliance',
    date: 'October 2026',
    type: 'Vulnerability Notice',
    summary: 'Expands defense coverage to advanced threats targeting autonomous AI agents, persistent system memory, and multimodal inputs like images and financial charts. It provides safeguards against coordinated bot swarms and long-term data tampering, ensuring continuous agent workflows remain secure, uncorrupted, and verifiable.',
    severity: 'CRITICAL'
  },
  {
    id: 'ADV-2026-002',
    title: 'Counter GEO Master Doc Volume 3: The CounterGEO-Bench Simulation Suite, Flash-Crash Stress Testing & ROC/AUC Validation',
    date: 'October 2026',
    type: 'Experimental Appendix',
    summary: 'A comprehensive testing and simulation benchmark evaluating the defense framework under real-world pressure. Through large-scale stress tests and rapid market volatility simulations, this volume demonstrates how the system reliably detects and blocks adversarial attacks in real time while maintaining high accuracy and preventing disruptions.',
    severity: 'CRITICAL'
  }
];
