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
    id: 'investigations',
    title: 'GEO Investigations',
    subtitle: 'Forensic AI Answer Analysis & Citation Auditing',
    icon: 'SearchCheck',
    badge: 'FORENSIC AUDITING',
    description: 'Deep-tissue forensic analysis of how your brand, key executives, products, and legal disclaimers are synthesized, cited, or distorted inside generative LLMs and RAG pipelines.',
    capabilities: [
      'Multi-engine prompt matrix probing across 15+ frontier models',
      'Vector space similarity analysis & embedding cluster drift tracking',
      'Citation source provenance mapping & hallucination attribution',
      'Executive perception & synthetic defamation audit reports'
    ],
    sampleLog: '[FORENSIC_LOG] Probed 1,200 prompt variations across GPT-4o, Claude 3.5, and Perplexity. Identified 14 corrupt vector paths originating from unverified 3rd-party blogs.'
  },
  {
    id: 'detection',
    title: 'GEO Threat Detection',
    subtitle: 'Continuous Adversarial Monitoring & Attack Early Warning',
    icon: 'ShieldAlert',
    badge: 'CONTINUOUS MONITORING',
    description: '24/7 automated monitoring against adversarial manipulation of generative answers: prompt injection attacks, poisoned training/RAG data, malicious answer engine optimization, and hallucination exploits.',
    capabilities: [
      'Real-time prompt injection & memory poisoning detection',
      'Automated RAG knowledge base corruption alerting',
      'Synthetic rumor & hallucinated financial claim early warning',
      'Dark-web & adversary forum GEO exploit chatter monitoring'
    ],
    sampleLog: '[DETECTION_ALERT] High-confidence indirect prompt injection payload detected in external HTML element targeting Perplexity vector indexing engine. Status: Flagged.'
  },
  {
    id: 'countermeasures',
    title: 'Counter-GEO Operations',
    subtitle: 'Active Remediation, Source Correction & Takedown Coordination',
    icon: 'ZapOff',
    badge: 'ACTIVE REMEDIATION',
    description: 'Tactical countermeasures to reclaim AI answer real estate: correcting poisoned RAG sources, deploying authoritative vector-seeded content, legal/technical takedown coordination, and model perception alignment.',
    capabilities: [
      'Authoritative vector seeding to displace malicious/hallucinated answers',
      'Poisoned web source technical & legal takedown enforcement',
      'RAG pipeline citation override & Knowledge Graph alignment',
      'Emergency response containment within < 15 minutes'
    ],
    sampleLog: '[COUNTERMEASURE_EXEC] Deployed high-density authoritative entity schemas to 4 primary crawling clusters. Vector distance normalized to 0.04. Hallucinated claim suppressed.'
  }
];

export const CAPABILITIES_MATRIX: CapabilityItem[] = [
  {
    id: 'cap-1',
    title: 'Prompt Injection Defense',
    category: 'LLM Security',
    icon: 'ShieldZap',
    description: 'Detect and neutralize direct and indirect prompt injection attacks hidden inside web content designed to hijack model answers about your brand.',
    technicalImpact: 'Prevents untrusted third-party inputs from manipulating model system instructions or injecting malicious output instructions.'
  },
  {
    id: 'cap-2',
    title: 'RAG Data Poisoning Scans',
    category: 'RAG Integrity',
    icon: 'Database',
    description: 'Continuous monitoring of public data sources, Wikipedia, forums, and tech review databases crawled by AI search vector stores.',
    technicalImpact: 'Identifies malicious edits, hidden text, and adversarial micro-data created to pollute retrieval-augmented generation.'
  },
  {
    id: 'cap-3',
    title: 'Hallucination & Defamation Tracking',
    category: 'Brand Protection',
    icon: 'AlertTriangle',
    description: 'Track false claims, synthetic lawsuits, fake product recalls, or executive misconduct generated erroneously by probabilistic model sampling.',
    technicalImpact: 'Automated temperature probing measures model hallucination frequency across enterprise decision query workflows.'
  },
  {
    id: 'cap-4',
    title: 'Cross-Model Citation Graphing',
    category: 'Threat Intel',
    icon: 'GitFork',
    description: 'Map interconnected citation dependencies showing how one poisoned source cascades across ChatGPT, Perplexity, Copilot, and Gemini.',
    technicalImpact: 'Graph neural analysis isolates root node corruptions responsible for multi-engine answer degradation.'
  },
  {
    id: 'cap-5',
    title: 'Malicious AEO Detection',
    category: 'Threat Intel',
    icon: 'Search',
    description: 'Identify aggressive competitor or black-hat "Answer Engine Optimization" tactics designed to demote or slander your offerings.',
    technicalImpact: 'Exposes automated synthetic content farms engineered specifically to rank at top positions in AI RAG retrieval.'
  },
  {
    id: 'cap-6',
    title: 'Executive Perception Safeguards',
    category: 'Brand Protection',
    icon: 'UserCheck',
    description: 'Specialized intelligence layer defending C-suite executives, board members, and founders from AI-generated biographical distortions.',
    technicalImpact: 'Ensures authoritative biography and verified public statements override hallucinated internet chatter.'
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
    summary: 'Foundational research whitepaper establishing the Six-Layer Sovereign Counter-GEO Defense Stack, neutralizing vector retrieval hubs, Hawkes Sybil botnets, split-payload enthymemes, and RAG market manipulation under SEC Rule 15c3-8.',
    severity: 'CRITICAL'
  },
  {
    id: 'ADV-2026-003',
    title: 'Counter GEO Master Doc Volume 2: Stateful Memory Immunity, Byzantine Swarms & Zero-Knowledge Compliance',
    date: 'October 2026',
    type: 'Vulnerability Notice',
    summary: 'Expands the sovereign defense architecture to Generation-3 threats: solving persistent memory poisoning via Doob-Meyer Martingales (DMEM-WMQ), autophagous swarm echo chambers (SGL-CMI), multimodal steganographic chart GEO (CM-JSAS), and zero-knowledge SEC Rule 15c3-8 compliance (ZK-CGEO).',
    severity: 'CRITICAL'
  },
  {
    id: 'ADV-2026-002',
    title: 'Counter GEO Master Doc Volume 3: The CounterGEO-Bench Simulation Suite, Flash-Crash Stress Testing & ROC/AUC Validation',
    date: 'October 2026',
    type: 'Experimental Appendix',
    summary: 'Standardized empirical benchmark (CounterGEO-Bench, N=250k, Q=50k) validating the complete 8-Layer Sovereign Counter-GEO Defense Stack against AT-1 through AT-7 attacks, achieving 99.1% overall recall, reducing SEC 10-K false alarms to 0.38% (AUROC 0.996), and proving 0.00% drawdown in high-frequency flash-crash stress replay.',
    severity: 'CRITICAL'
  }
];
