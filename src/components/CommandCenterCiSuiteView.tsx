import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import {
  Crosshair,
  Radar,
  Fingerprint,
  FileCheck2,
  Bot,
  Network,
  KeyRound,
  Lock,
  Sparkles,
  ShieldAlert,
  ShieldCheck,
  Code2,
  Sliders,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';

export type KnowledgeDepth = 'beginner' | 'operator' | 'architect';

interface CiModule {
  id: string;
  code: string;
  domain: 'AI Search & RAG' | 'Silent Web & A2A' | 'Financial & Swarms';
  name: string;
  shortSubtitle: string;
  tagline: string;
  severity: 'ACTIVE DEFENSE' | 'ATTRIBUTION TRAP';
  beginnerGuide: {
    everydayAnalogy: string;
    howAttackersOperate: string;
    howModuleCapturesThem: string;
    keyTakeaway: string;
  };
  operatorBrief: {
    collectionSurface: string;
    tradecraftMechanism: string;
    attributionOutput: string;
    benchmarkMetric: string;
  };
  architectSpec: {
    formula: string;
    implementationSpec: string;
    telemetrySchema: string;
  };
  sandbox: {
    label: string;
    unit: string;
    min: number;
    max: number;
    defaultVal: number;
    withoutCi: (v: number) => string;
    withCi: (v: number) => string;
  };
}

const CI_MODULES_CATALOG: CiModule[] = [
  {
    id: 'ci-1',
    code: 'CI-1',
    domain: 'AI Search & RAG',
    name: 'Digital Watermark & Canary Traps',
    shortSubtitle: 'Spectral Canary Watermarking',
    tagline: 'Embeds invisible linguistic & spacing watermarks inside bait documents to trace illicit scraping pipelines.',
    severity: 'ATTRIBUTION TRAP',
    beginnerGuide: {
      everydayAnalogy:
        'Banks mark serialized bills with invisible UV ink before leaving bait cash in a vault. When those bills show up in another city, investigators know the exact theft ring that hit the vault.',
      howAttackersOperate:
        'Adversarial content farms automatically scrape corporate docs, rewrite them with paraphrasing bots, and republish forged variations to twist AI chatbot answers.',
      howModuleCapturesThem:
        'CI-1 places ultra-subtle statistical word patterns and punctuation rhythms inside decoy briefings. Even after a bot rewrites the article three times, those statistical marks survive and light up our scanner across the public web.',
      keyTakeaway:
        'Turns passive AI defensive monitors into an active global tripwire that catches thieves reusing scraped material.'
    },
    operatorBrief: {
      collectionSurface: 'Public documentation portals, Decoy Investor Relations PDFs, Synthetic Knowledge Bases',
      tradecraftMechanism:
        'Applies green-list logit biasing and deterministic whitespace steganography across canary releases tuned to attract automated scraper bots.',
      attributionOutput:
        'Captures crawler User-Agent clusters, ASN exit relays, and downstream rewriting LLM signatures when republished.',
      benchmarkMetric: '96.4% watermark survival probability across 2x neural paraphrasing cycles (p < 0.001).'
    },
    architectSpec: {
      formula: 'Z_{\\text{canary}} = \\frac{|G| - \\gamma T}{\\sqrt{T \\gamma (1 - \\gamma)}} > 4.0',
      implementationSpec: 'HMAC-SHA256 seeded vocabulary partition (gamma = 0.25) with zero readable perplexity delta (delta PPL < 0.4).',
      telemetrySchema: 'canary_id · campaign_asn · rewrite_hops · z_score · first_seen_utc'
    },
    sandbox: {
      label: 'Automated Paraphrase Rewrites Survived',
      unit: 'x bot rewrites',
      min: 1,
      max: 5,
      defaultVal: 2,
      withoutCi: (v) => `After ${v} rewrite pass(es), copied misinformation blends seamlessly into public AI training corpora.`,
      withCi: (v) => `CI-1 retains Z = ${(7.4 - v * 0.85).toFixed(2)} statistical confidence after ${v} rewrite(s) -> Origin Botnet Tagged!`
    }
  },
  {
    id: 'ci-2',
    code: 'CI-2',
    domain: 'AI Search & RAG',
    name: 'Early-Warning Decoy Topics',
    shortSubtitle: 'Epistemic Honeypot Attractor Basins',
    tagline: 'Watches low-volume "data voids" before market open to detect pre-positioned fake-news campaigns early.',
    severity: 'ACTIVE DEFENSE',
    beginnerGuide: {
      everydayAnalogy:
        'Park rangers set up trail cameras along quiet backroads days before loggers arrive, catching trespassers before a single tree falls.',
      howAttackersOperate:
        'Market manipulators and influence groups test their fake press releases in obscure overnight forums and data voids hours before launching a coordinated daytime attack.',
      howModuleCapturesThem:
        'CI-2 deploys harmless listener topics around sensitive tickers and strategic supply chains. The moment an unusual surge of synthetic pages clusters around a quiet topic, defenders receive hours of advance warning.',
      keyTakeaway:
        'Detects information warfare rehearsals while they are still warming up in dark corners of the index.'
    },
    operatorBrief: {
      collectionSurface: 'Sparse Vector Space Regions, Pre-Market News Aggregators, Low-Volume Industry Forums',
      tradecraftMechanism:
        'Maintains synthetic sentinel embeddings in sparsely populated semantic neighborhoods to measure anomalous density inflows.',
      attributionOutput:
        'Flags staging domains and DNS registrar batches hours before peak query volume.',
      benchmarkMetric: '3.2 hours median early warning prior to coordinated daytime query spikes in stress replays.'
    },
    architectSpec: {
      formula: '\\Delta \\rho_{\\text{basin}}(t) = \\frac{1}{k} \\sum_{i=1}^k \\|x_i(t) - c_{\\text{sentinel}}\\|_2^{-1} > \\tau_{\\text{early}}',
      implementationSpec: 'Streaming k-NN local density derivative paired with registrar WHOIS burst clustering.',
      telemetrySchema: 'sentinel_basin_id · density_slope · staging_domains · reg_registrar_cluster'
    },
    sandbox: {
      label: 'Staged Poison Documents Entering Quiet Basin',
      unit: ' docs / hr',
      min: 2,
      max: 40,
      defaultVal: 12,
      withoutCi: (v) => `${v} staging articles sit unnoticed overnight until morning trading bots ingest them at 07:30 EST.`,
      withCi: (v) => `CI-2 triggers Basin Alert at ${(v * 0.14).toFixed(2)} density spike -> Domains quarantined ${(2.1 + v * 0.04).toFixed(1)} hrs early!`
    }
  },
  {
    id: 'ci-3',
    code: 'CI-3',
    domain: 'AI Search & RAG',
    name: 'Campaign & Botnet Fingerprinting',
    shortSubtitle: 'Threat-Actor Behavioral Attribution',
    tagline: 'Clusters distributed domains by timing rhythm, writing style, and shared infrastructure into one operator dossier.',
    severity: 'ATTRIBUTION TRAP',
    beginnerGuide: {
      everydayAnalogy:
        'Even if a burglars’ crew wears 30 different masks, forensic teams can match their boot size, lock-picking timing, and getaway car tire tracks back to a single crew.',
      howAttackersOperate:
        'Sophisticated influence operators buy dozens of unrelated domain names and spin up multiple cloud accounts so they look like independent journalists.',
      howModuleCapturesThem:
        'CI-3 looks past surface domain names to measure millisecond posting intervals, shared CSS/schema quirks, and stylistic fingerprints—grouping 25 fake sites into one attributed actor profile.',
      keyTakeaway:
        'Blocking one fake domain fails when attackers own 100; fingerprinting the operator behind them blocks the whole campaign.'
    },
    operatorBrief: {
      collectionSurface: 'Multi-Domain Campaign Graphs, Publishing Timestamps, HTML/JSON-LD Structural Artifacts',
      tradecraftMechanism:
        'Combines Hawkes self-exciting timing estimates with stylometric embedding distance and passive TLS/DNS infrastructure graphs.',
      attributionOutput:
        'Generates shareable STIX 2.1 Threat-Actor & Infrastructure bundles for SOC and partner exchange.',
      benchmarkMetric: '94.8% cluster purity in linking staggered Sybil botnets back to common orchestration scripts.'
    },
    architectSpec: {
      formula: 'd_{\\text{actor}}(u,v) = w_1 \\|\\phi_{\\text{style}}(u) - \\phi_{\\text{style}}(v)\\| + w_2 |\\hat{\\lambda}_u(t) - \\hat{\\lambda}_v(t)|',
      implementationSpec: 'Hierarchical DBSCAN clustering over stylometry, AST template hashes, and shared CNAME/TLS fingerprints.',
      telemetrySchema: 'cluster_uuid · member_domains · hawkes_alpha · stix_bundle_hash'
    },
    sandbox: {
      label: 'Disguised Domains in Coordinated Swarm',
      unit: ' domains',
      min: 5,
      max: 60,
      defaultVal: 24,
      withoutCi: (v) => `${v} separate domains appear independent to standard blocklists; only 2 or 3 get flagged.`,
      withCi: (v) => `CI-3 links all ${v} domains via shared AST/timing signature -> Unified STIX 2.1 Campaign Dossier built!`
    }
  },
  {
    id: 'ci-4',
    code: 'CI-4',
    domain: 'AI Search & RAG',
    name: 'Verified Fact & Source Recovery',
    shortSubtitle: 'C2PA Counter-Suppression & Recovery',
    tagline: 'Identifies when attackers push true filings down in AI search and restores cryptographically verified records.',
    severity: 'ACTIVE DEFENSE',
    beginnerGuide: {
      everydayAnalogy:
        'When scammers drown out a restaurant’s real phone number on search maps with fake numbers, the map company pins the verified business phone number back at the top with a checkmark.',
      howAttackersOperate:
        'Using "Negative-AEO," attackers flood AI indexes with repetitive junk critiques to push an enterprise’s genuine safety notices or SEC filings below the top retrieval cutoff.',
      howModuleCapturesThem:
        'CI-4 measures when verified signed records suddenly drop out of top-K search results without any legitimate news change, then injects hardware-signed (C2PA) authoritative summaries back into retrieval balance.',
      keyTakeaway:
        'Defeating censorship attacks requires both blocking junk noise and actively restoring verified facts.'
    },
    operatorBrief: {
      collectionSurface: 'RAG Top-K Retrieval Ranks, C2PA-Signed Official Disclosures, Brand/Regulatory Citation Monitoring',
      tradecraftMechanism:
        'Tracks rank displacement of C2PA-verified filings versus unsigned cluster velocity and applies facility-location re-ranking.',
      attributionOutput:
        'Logs suppression displacement deltas alongside verified recovery receipts.',
      benchmarkMetric: 'Restores top-3 verified citation share from 14% suppression back to 98% on authentic queries.'
    },
    architectSpec: {
      formula: '\\text{ReRank}(d_i) = \\text{sim}(q, d_i) + \\lambda_{\\text{C2PA}} \\mathbb{I}[\\text{ValidSig}(d_i)] - \\mu_{\\text{chaff}} \\text{Redundancy}(d_i)',
      implementationSpec: 'Submodular diversity ranking enforcing hardware provenance floors prior to LLM generation.',
      telemetrySchema: 'doc_hash · c2pa_issuer · suppressed_rank · restored_rank'
    },
    sandbox: {
      label: 'Competing Negative-AEO Chaff Clones',
      unit: ' junk clones',
      min: 5,
      max: 100,
      defaultVal: 40,
      withoutCi: (v) => `${v} clone pages knock official signed SEC disclosure from Rank #1 down to #18 (invisible to AI).`,
      withCi: (v) => `CI-4 deduplicates ${v} unsigned clones and restores hardware-signed filing to Rank #1 (< 2 ms).`
    }
  },
  {
    id: 'ci-5',
    code: 'CI-5',
    domain: 'Silent Web & A2A',
    name: 'Decoy Agent Profiles & Trap MCP Tools',
    shortSubtitle: 'Deceptive Agent Card & MCP Honeypot Servers',
    tagline: 'Publishes attractive bait MCP servers & agent cards that record adversarial scanners attempting to poison registries.',
    severity: 'ATTRIBUTION TRAP',
    beginnerGuide: {
      everydayAnalogy:
        'Leaving a parked decoy patrol car with open diagnostics logs what tools a car thief brings to the lot before they can touch real customer vehicles.',
      howAttackersOperate:
        'Hackers run automated bots searching the Silent Web for poorly secured MCP tool registries and agent endpoints where they can register hijack tools.',
      howModuleCapturesThem:
        'CI-5 operates realistic, isolated decoy `agent.json` registries and MCP endpoints. Any attacker attempting to push a rigged tool schema or suffix injection is safely trapped, inspected, and fingerprinted.',
      keyTakeaway:
        'Lures agent-era malware scanners into a sandboxed mirror before they discover production agent networks.'
    },
    operatorBrief: {
      collectionSurface: '/.well-known/agent.json Decoy Registries, Sandbox MCP tools/list Endpoints, Agent Card Crawlers',
      tradecraftMechanism:
        'Presents permissive-looking mock discovery cards backed by read-only honeypot sandboxes that log full inbound payloads.',
      attributionOutput:
        'Captures ungrammatical gradient suffixes, malicious JSON-RPC probes, and caller IP/wallet headers.',
      benchmarkMetric: 'Captures 100% of synthetic ToolCommander registry probes in isolated staging without impacting real routing.'
    },
    architectSpec: {
      formula: '\\mathcal{H}_{\\text{trap}}(\\mathcal{C}_{\\text{in}}) = \\mathbb{I}[\\text{PPL}(\\mathcal{C}_{\\text{in}}) > \\tau \\lor \\text{ExecProbe}(\\mathcal{C}_{\\text{in}})] \\to \\text{SandboxLog}',
      implementationSpec: 'Isolated MCP JSON-RPC honeypot logging schema diffs, perplexity spikes, and callback URLs.',
      telemetrySchema: 'honeypot_id · attacker_callback_uri · suffix_perplexity · payload_sha256'
    },
    sandbox: {
      label: 'Malicious Registry Scans / Hour',
      unit: ' scans/hr',
      min: 10,
      max: 500,
      defaultVal: 120,
      withoutCi: (v) => `${v} automated probes silently map production MCP schemas to craft targeted hijack suffixes.`,
      withCi: (v) => `CI-5 diverts ${v}/hr probes into decoy sandboxes and extracts attackers’ C2 callback URIs automatically.`
    }
  },
  {
    id: 'ci-6',
    code: 'CI-6',
    domain: 'Silent Web & A2A',
    name: 'Agent Bid Elicitation & Sybil Tracing',
    shortSubtitle: 'Contract-Net Elicitation & Sybil Operator Deanonymization',
    tagline: 'Issues harmless test tasks to suspect AI bidder rings to reveal shared backends, timing leaks, and payout wallets.',
    severity: 'ATTRIBUTION TRAP',
    beginnerGuide: {
      everydayAnalogy:
        'Asking five suspiciously cheap contractors to submit itemized sample bids exposes when all five bids were typed on the exact same printer and list the same bank account.',
      howAttackersOperate:
        'Swarms of fake AI "bidders" (Sybil agents) pretend to be independent financial analysts or cloud workers to win jobs cheaply and spy on buyer instructions.',
      howModuleCapturesThem:
        'CI-6 sends carefully harmless benchmark Requests for Proposals (RFPs) and inspects response speed correlations, on-chain ERC-8004 wallets, and delegation headers—proving when 20 seemingly independent AI agents are run by one operator.',
      keyTakeaway:
        'Turns multi-agent auction negotiation itself into a spotlight that unmasks fake decentralized swarms.'
    },
    operatorBrief: {
      collectionSurface: 'FIPA Contract-Net Auctions, x402 Payment Rails, ERC-8004 Registry Identifiers',
      tradecraftMechanism:
        'Dispatches controlled Call-for-Proposal probes with unique correlation nonces and correlates RTT, token phrasing, and payout addresses.',
      attributionOutput:
        'Links Sybil bidder identities to common funding wallets, shared backend GPU workers, and proxy ASNs.',
      benchmarkMetric: 'Exposed 98.9% of synthetic single-operator Sybil bidding clusters across simulated 16-agent auctions.'
    },
    architectSpec: {
      formula: '\\rho_{\\text{Sybil}}(A_i, A_j) = \\text{corr}(\\text{RTT}_i, \\text{RTT}_j) \\cdot \\mathbb{I}[\\text{WalletCluster}(A_i, A_j)]',
      implementationSpec: 'Bipartite graph clustering across ERC-8004 payout addresses, X-Delegation-Chain tokens, and latency residuals.',
      telemetrySchema: 'cfp_nonce · suspect_agent_ids · linked_erc8004_wallet · timing_corr'
    },
    sandbox: {
      label: 'Colluding AI Bidders in Simulated Auction',
      unit: ' fake bidders',
      min: 2,
      max: 32,
      defaultVal: 12,
      withoutCi: (v) => `${v} correlated Sybil bots outvote honest providers via low-ball bids and steal sensitive RFP briefs.`,
      withCi: (v) => `CI-6 clusters all ${v} bidders to 1 operator wallet cluster via CFP elicitation -> Swarm disqualified!`
    }
  },
  {
    id: 'ci-7',
    code: 'CI-7',
    domain: 'Silent Web & A2A',
    name: 'Sealed Data-Leak Tripwires',
    shortSubtitle: 'Boundary-Laundering Canary Variables',
    tagline: 'Plants realistic fake secrets inside untrusted records so any hijacked agent trying to sneak them out triggers an instant kill-switch.',
    severity: 'ACTIVE DEFENSE',
    beginnerGuide: {
      everydayAnalogy:
        'Store detectives put a tagged decoy watch inside a public display case. Even if someone bypasses a lock, the alarm goes off the instant that watch crosses the exit sensor.',
      howAttackersOperate:
        'During "boundary laundering," a rogue instruction inside an email or SQL database tricks a helper AI into mailing private customer records to an attacker’s address.',
      howModuleCapturesThem:
        'CI-7 slips unmistakable canary tokens inside quarantined test data records. If a downstream AI tool tries to pass that token inside an email body, URL, or instruction prompt, the gateway cuts the connection immediately and logs the exact attack chain.',
      keyTakeaway:
        'Gives defenders ironclad forensic proof of which agent step leaked untrusted data.'
    },
    operatorBrief: {
      collectionSurface: 'Multi-CaMeL OpaqueVariableStore, Child A2A Task Calls, Outbound Tool Execution Sinks',
      tradecraftMechanism:
        'Synthesizes format-preserving honeytokens tagged with UNTRUSTED capability metadata and scans all outbound network/instruction sinks.',
      attributionOutput:
        'Captures the exact boundary-laundering trace, compromised upstream artifact ID, and attempted exfiltration destination.',
      benchmarkMetric: '100% immediate sink interception alongside Multi-CaMeL 0.0% MultiAgentDojo bypass rate.'
    },
    architectSpec: {
      formula: '\\text{Abort} \\iff \\exists\\, v \\in \\mathcal{T}_{\\text{canary}} : v \\in \\text{Serialize}(\\text{Sink}_{\\text{net/prompt}})',
      implementationSpec: 'Runtime Aho-Corasick & opaque UUID taint assertion on every cross-agent RPC call.',
      telemetrySchema: 'canary_var_uuid · breaching_agent · exfil_sink_url · parent_trace_id'
    },
    sandbox: {
      label: 'Multi-Agent Hops Before Leak Attempt',
      unit: ' agent hops',
      min: 2,
      max: 8,
      defaultVal: 3,
      withoutCi: (v) => `Untrusted data laundered across ${v} agent hops looks "trusted" and exits to an external email webhook.`,
      withCi: (v) => `CI-7 tripwire intercepts canary UUID at Hop #${v} boundary before byte #1 leaves the network.`
    }
  },
  {
    id: 'ci-8',
    code: 'CI-8',
    domain: 'Financial & Swarms',
    name: 'Official Directory Shielding & Audit Trail',
    shortSubtitle: 'Canonical Agent Directory Protection & Immutable Replay',
    tagline: 'Cryptographically pins verified government & institutional agent profiles while archiving court-ready incident replays.',
    severity: 'ACTIVE DEFENSE',
    beginnerGuide: {
      everydayAnalogy:
        'Like a government passport stamp plus a dashcam black box: bots can verify they are talking to the real official agency, and regulators get an unalterable video replay of every decision.',
      howAttackersOperate:
        'Impostors register look-alike official agent cards (`sec-filing-bot-v2`) hoping automated trading or enterprise software calls the fake server instead.',
      howModuleCapturesThem:
        'CI-8 binds verified agent registries to cryptographic identity proofs and hashes every blocked spoof attempt into an immutable audit log so security teams and regulators can trace every detail later.',
      keyTakeaway:
        'Stops digital impersonation of trusted institutions while leaving behind tamper-evident forensic records.'
    },
    operatorBrief: {
      collectionSurface: 'Institutional /.well-known/agent.json Directories, SEC/Compliance Gateways, STIX Archive',
      tradecraftMechanism:
        'Cross-checks RFC 8785 canonical JSON signatures against pinned hardware keys and commits blocked look-alike diffs.',
      attributionOutput:
        'Produces signed replay logs and STIX 2.1 bundles mapping impersonator infrastructure.',
      benchmarkMetric: 'Blocks 100% of unsigned domain-lookalike agent substitutions with < 0.2 ms signature cache lookup.'
    },
    architectSpec: {
      formula: '\\text{Verify}(\\text{PK}_{\\text{inst}},\\, \\text{JCS}(\\mathcal{C}_{\\text{agent}}),\\, \\sigma) = 1',
      implementationSpec: 'RFC 8785 JSON Canonicalization Scheme + Ed25519/ECDSA verification with append-only hash chaining.',
      telemetrySchema: 'verified_agent_did · spoofed_host · signature_status · audit_merkle_root'
    },
    sandbox: {
      label: 'Look-Alike Spoofed Agent Cards Audited / Day',
      unit: ' cards/day',
      min: 10,
      max: 400,
      defaultVal: 85,
      withoutCi: (v) => `${v} typosquatted agent cards siphon credential tokens from misconfigured enterprise orchestrators.`,
      withCi: (v) => `CI-8 fails RFC 8785 key pinning on all ${v} impostors and archives signed evidence trails automatically.`
    }
  }
];

interface CommandCenterCiSuiteViewProps {
  knowledgeDepth: KnowledgeDepth;
  onJumpToWorkbench: () => void;
}

export const CommandCenterCiSuiteView: React.FC<CommandCenterCiSuiteViewProps> = ({
  knowledgeDepth,
  onJumpToWorkbench
}) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const [domainFilter, setDomainFilter] = useState<'ALL' | 'AI Search & RAG' | 'Silent Web & A2A' | 'Financial & Swarms'>('ALL');
  const [stepMap, setStepMap] = useState<Record<string, number>>(() => {
    const init: Record<string, number> = {};
    CI_MODULES_CATALOG.forEach((m) => {
      init[m.id] = knowledgeDepth === 'beginner' ? 0 : knowledgeDepth === 'operator' ? 1 : 3;
    });
    return init;
  });
  const [sliderMap, setSliderMap] = useState<Record<string, number>>(() => {
    const init: Record<string, number> = {};
    CI_MODULES_CATALOG.forEach((m) => {
      init[m.id] = m.sandbox.defaultVal;
    });
    return init;
  });

  useEffect(() => {
    const targetStep = knowledgeDepth === 'beginner' ? 0 : knowledgeDepth === 'operator' ? 1 : 3;
    setStepMap((prev) => {
      const next = { ...prev };
      CI_MODULES_CATALOG.forEach((m) => {
        next[m.id] = targetStep;
      });
      return next;
    });
  }, [knowledgeDepth]);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el.querySelectorAll('[data-ci-card]'),
        { y: 18, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.45, stagger: 0.06, ease: 'power2.out' }
      );
    }, el);
    return () => ctx.revert();
  }, [domainFilter]);

  const filteredModules = CI_MODULES_CATALOG.filter(
    (m) => domainFilter === 'ALL' || m.domain === domainFilter
  );

  const getIcon = (id: string) => {
    switch (id) {
      case 'ci-1': return <Fingerprint className="w-4 h-4 text-[#00FF9D]" />;
      case 'ci-2': return <Radar className="w-4 h-4 text-[#D5991C]" />;
      case 'ci-3': return <Network className="w-4 h-4 text-[#B565FF]" />;
      case 'ci-4': return <FileCheck2 className="w-4 h-4 text-[#00FF9D]" />;
      case 'ci-5': return <Bot className="w-4 h-4 text-[#D5991C]" />;
      case 'ci-6': return <Crosshair className="w-4 h-4 text-[#B565FF]" />;
      case 'ci-7': return <KeyRound className="w-4 h-4 text-[#00FF9D]" />;
      default: return <Lock className="w-4 h-4 text-[#D5991C]" />;
    }
  };

  return (
    <main ref={rootRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 flex-1 w-full">
      {/* Intro & Animated SVG Active Counterintelligence Pipeline */}
      <div className="bg-[#2d0110] border border-[#D5991C]/40 p-6 rounded-2xl shadow-xl space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#FBF3E2]">
              Active Counterintelligence &amp; Threat Attribution Suite (CI-1 to CI-8)
            </h2>
            <p className="text-xs sm:text-sm text-[#FBF3E2]/85 max-w-3xl leading-relaxed">
              Instead of passively blocking bad websites one by one, Active Counterintelligence turns the tables—using safe decoys, invisible watermarks, and sealed tripwires to trace coordinated botnets back to their operators.
            </p>
          </div>
          <button
            onClick={onJumpToWorkbench}
            className="shrink-0 inline-flex items-center space-x-2 px-4 py-2.5 bg-[#D5991C] hover:bg-[#e5a932] text-[#130108] font-mono text-xs font-bold uppercase cursor-pointer shadow-md transition-colors"
          >
            <span>Open STIX 2.1 Tracker in Workbench</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Animated SVG Trap & Attribution Workflow Diagram */}
        <div className="bg-[#1b0009] border border-[#D5991C]/35 p-4 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between text-[11px] font-mono text-[#D5991C] uppercase font-bold mb-2">
            <span>How Attribution &amp; Decoy Traps Capture Threat Actors (Authorized Simulation Flow)</span>
            <span className="text-[#00FF9D]">CI-1 through CI-8 Linked Pipeline</span>
          </div>
          <svg viewBox="0 0 840 155" className="w-full h-auto block" role="img" aria-label="Active Counterintelligence 8-Module Attribution Flow">
            <defs>
              <linearGradient id="ciLineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#E63946" />
                <stop offset="40%" stopColor="#D5991C" />
                <stop offset="75%" stopColor="#B565FF" />
                <stop offset="100%" stopColor="#00FF9D" />
              </linearGradient>
            </defs>

            <line x1="95" y1="74" x2="745" y2="74" stroke="url(#ciLineGrad)" strokeWidth="3" strokeDasharray="6 4">
              <animate attributeName="stroke-dashoffset" from="20" to="0" dur="1.1s" repeatCount="indefinite" />
            </line>
            <circle r="4.5" cy="74" fill="#D5991C">
              <animate attributeName="cx" values="100;290;470;650;740" dur="2.5s" repeatCount="indefinite" />
            </circle>

            {/* Step 1 */}
            <rect x="20" y="30" width="155" height="88" rx="6" fill="#2d0110" stroke="#E63946" strokeWidth="1.5" />
            <text x="97" y="54" textAnchor="middle" fill="#FF8093" fontSize="9.5" fontWeight="bold">INBOUND PROBES</text>
            <text x="97" y="74" textAnchor="middle" fill="#FBF3E2" fontSize="11" fontWeight="bold">Scrapers &amp; Rogue Bots</text>
            <text x="97" y="96" textAnchor="middle" fill="#F2D69D" fontSize="8">Engages CI-1, CI-2, CI-5</text>

            {/* Step 2 */}
            <rect x="205" y="30" width="160" height="88" rx="6" fill="#2d0110" stroke="#D5991C" strokeWidth="1.5" />
            <text x="285" y="54" textAnchor="middle" fill="#D5991C" fontSize="9.5" fontWeight="bold">CANARY CAPTURE</text>
            <text x="285" y="74" textAnchor="middle" fill="#FBF3E2" fontSize="11" fontWeight="bold">Watermarks &amp; Decoys</text>
            <text x="285" y="96" textAnchor="middle" fill="#F2D69D" fontSize="8">Tags CI-7 Leak Tripwires</text>

            {/* Step 3 */}
            <rect x="395" y="30" width="170" height="88" rx="6" fill="#2d0110" stroke="#7C3AED" strokeWidth="1.6" />
            <text x="480" y="54" textAnchor="middle" fill="#C4B5FD" fontSize="9.5" fontWeight="bold">OPERATOR CLUSTERING</text>
            <text x="480" y="74" textAnchor="middle" fill="#FBF3E2" fontSize="11" fontWeight="bold">Fingerprint &amp; Wallets</text>
            <text x="480" y="96" textAnchor="middle" fill="#F2D69D" fontSize="8">Links CI-3 &amp; CI-6 Swarms</text>

            {/* Step 4 */}
            <rect x="595" y="30" width="220" height="88" rx="6" fill="#0D4432" stroke="#00FF9D" strokeWidth="1.8" />
            <text x="705" y="54" textAnchor="middle" fill="#00FF9D" fontSize="9.5" fontWeight="bold">TRUST RECOVERY &amp; PROOF</text>
            <text x="705" y="74" textAnchor="middle" fill="#FBF3E2" fontSize="11" fontWeight="bold">Fact Pin + STIX 2.1 Log</text>
            <text x="705" y="96" textAnchor="middle" fill="#F2D69D" fontSize="8">Executes CI-4 &amp; CI-8 Lock</text>
          </svg>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#D5991C]/25 font-mono text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[#D5991C] text-[11px] font-bold uppercase mr-1">Filter Capability:</span>
            {(['ALL', 'AI Search & RAG', 'Silent Web & A2A', 'Financial & Swarms'] as const).map((dom) => (
              <button
                key={dom}
                onClick={() => setDomainFilter(dom)}
                className={`px-3 py-1.5 text-[11px] font-bold border transition-colors cursor-pointer ${
                  domainFilter === dom
                    ? 'bg-[#D5991C] text-[#130108] border-[#D5991C]'
                    : 'bg-[#1e000a] text-[#FBF3E2]/80 border-[#D5991C]/30 hover:border-[#D5991C]'
                }`}
              >
                {dom}
              </button>
            ))}
          </div>
          <div className="text-[11px] text-[#00FF9D]">
            Showing {filteredModules.length} of {CI_MODULES_CATALOG.length} Active CI Modules
          </div>
        </div>
      </div>

      {/* 8 Progressive CI Module Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredModules.map((mod) => {
          const activeStep = stepMap[mod.id] ?? 0;
          const sliderVal = sliderMap[mod.id] ?? mod.sandbox.defaultVal;
          const setStep = (s: number) => setStepMap((prev) => ({ ...prev, [mod.id]: s }));

          return (
            <div
              key={mod.id}
              data-ci-card
              className="bg-[#24010d] border border-[#D5991C]/40 p-6 flex flex-col justify-between space-y-5 shadow-xl rounded-xl"
            >
              <div>
                <div className="flex items-start justify-between gap-2 pb-3 border-b border-[#D5991C]/25">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2 font-mono text-[11px]">
                      <span className="inline-flex items-center space-x-1 px-2 py-0.5 bg-[#410217] border border-[#D5991C] text-[#D5991C] font-bold">
                        {getIcon(mod.id)}
                        <span>{mod.code}</span>
                      </span>
                      <span className="px-2 py-0.5 bg-[#2d0110] border border-[#D5991C]/30 text-[#FBF3E2]/85">
                        {mod.domain}
                      </span>
                    </div>
                    <h3 className="font-serif text-xl font-bold text-[#FBF3E2] pt-1">
                      {mod.name}
                    </h3>
                    <p className="text-xs font-mono text-[#00FF9D]">
                      {mod.shortSubtitle} — {mod.tagline}
                    </p>
                  </div>
                </div>

                {/* 4-Step Progressive Tabs */}
                <div className="grid grid-cols-4 gap-1 bg-[#160007] p-1 border border-[#D5991C]/30 font-mono text-[10px] mt-4">
                  {[
                    { idx: 0, label: '1. Plain English' },
                    { idx: 1, label: '2. How It Hunts' },
                    { idx: 2, label: '3. Intel Output' },
                    { idx: 3, label: '4. Math & Spec' }
                  ].map((tab) => (
                    <button
                      key={tab.idx}
                      onClick={() => setStep(tab.idx)}
                      className={`py-1.5 px-1 font-bold uppercase transition-colors cursor-pointer ${
                        activeStep === tab.idx
                          ? 'bg-[#D5991C] text-[#130108]'
                          : 'text-[#FBF3E2]/70 hover:text-white hover:bg-[#2d0110]'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Progressive Content Body */}
                <div className="mt-4 min-h-[155px] text-xs leading-relaxed">
                  {activeStep === 0 && (
                    <div className="space-y-3">
                      <div className="p-3 bg-[#1e000a] border-l-2 border-[#00A878] text-[#FBF3E2]/90">
                        <strong className="text-[#00FF9D] block mb-0.5 uppercase font-mono text-[10px]">
                          Everyday Analogy:
                        </strong>
                        {mod.beginnerGuide.everydayAnalogy}
                      </div>
                      <p className="text-[#FBF3E2]/85">
                        <strong className="text-[#D5991C]">Bottom Line: </strong>
                        {mod.beginnerGuide.keyTakeaway}
                      </p>
                    </div>
                  )}

                  {activeStep === 1 && (
                    <div className="space-y-3">
                      <div className="p-3 bg-[#2d0110] border-l-2 border-[#E63946] text-[#FBF3E2]/90">
                        <strong className="text-[#FF8093] block mb-0.5 uppercase font-mono text-[10px] flex items-center space-x-1">
                          <ShieldAlert className="w-3.5 h-3.5 inline mr-1" />
                          <span>Adversarial Behavior Targeted:</span>
                        </strong>
                        {mod.beginnerGuide.howAttackersOperate}
                      </div>
                      <p className="text-[#FBF3E2]/90">
                        <strong className="text-[#00FF9D]">Active Mechanism: </strong>
                        {mod.beginnerGuide.howModuleCapturesThem}
                      </p>
                    </div>
                  )}

                  {activeStep === 2 && (
                    <div className="space-y-2.5 bg-[#1e000a] p-3.5 border border-[#00A878]/35 font-mono">
                      <div>
                        <span className="text-[10px] text-[#00FF9D] uppercase block">Collection Surface:</span>
                        <span className="text-[#FBF3E2]/90">{mod.operatorBrief.collectionSurface}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#D5991C] uppercase block">Attributed Output:</span>
                        <span className="text-[#FBF3E2]/90">{mod.operatorBrief.attributionOutput}</span>
                      </div>
                      <div className="p-2 bg-[#0f2922] border border-[#00A878]/40 text-[#00FF9D] flex items-center space-x-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                        <span>{mod.operatorBrief.benchmarkMetric}</span>
                      </div>
                    </div>
                  )}

                  {activeStep === 3 && (
                    <div className="space-y-2.5 bg-[#1a0009] p-3.5 border border-[#7C3AED]/45 font-mono text-[11px]">
                      <div className="text-[#B565FF] font-bold flex items-center space-x-1.5">
                        <Code2 className="w-3.5 h-3.5" />
                        <span>Technical Invariant &amp; Telemetry Schema</span>
                      </div>
                      <div className="p-2 bg-[#120006] border border-[#7C3AED]/30 text-[#E5E0FA] overflow-x-auto">
                        {mod.architectSpec.formula}
                      </div>
                      <p className="text-[#FBF3E2]/85 font-sans">
                        {mod.architectSpec.implementationSpec}
                      </p>
                      <div className="text-[10px] text-[#00FF9D]">
                        Fields: {mod.architectSpec.telemetrySchema}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Interactive Counterintelligence Sandbox Slider */}
              <div className="bg-[#1b0009] border border-[#D5991C]/30 p-3.5 space-y-2 font-mono text-xs">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="flex items-center space-x-1 text-[#D5991C] font-bold uppercase">
                    <Sliders className="w-3 h-3" />
                    <span>{mod.sandbox.label}</span>
                  </span>
                  <strong className="text-[#00FF9D]">
                    {sliderVal} {mod.sandbox.unit}
                  </strong>
                </div>
                <input
                  type="range"
                  min={mod.sandbox.min}
                  max={mod.sandbox.max}
                  value={sliderVal}
                  onChange={(e) => setSliderMap((prev) => ({ ...prev, [mod.id]: Number(e.target.value) }))}
                  className="w-full accent-[#D5991C] cursor-pointer"
                />
                <div className="space-y-1 text-[11px]">
                  <div className="p-2 bg-[#2d0110] border-l-2 border-[#E63946] text-[#FF8093]">
                    <strong>Unmonitored AI:</strong> {mod.sandbox.withoutCi(sliderVal)}
                  </div>
                  <div className="p-2 bg-[#2d0110] border-l-2 border-[#00FF9D] text-[#00FF9D] flex items-start space-x-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                    <span><strong>With {mod.code}:</strong> {mod.sandbox.withCi(sliderVal)}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
};

