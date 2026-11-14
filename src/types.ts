export interface ThreatAlert {
  id: string;
  timestamp: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'INFO';
  engine: string;
  attackVector: string;
  target: string;
  status: 'ACTIVE' | 'NEUTRALIZED' | 'INVESTIGATING' | 'CONTAINED';
  details: string;
  vectorDistance?: number;
}

export interface EngineStatus {
  name: string;
  code: string;
  type: 'LLM Chat' | 'AI Search' | 'RAG Pipeline' | 'Agent';
  citationHealthScore: number; // 0-100
  threatCount: number;
  sentiment: 'POSITIVE' | 'NEUTRAL' | 'DISTORTED' | 'HOSTILE';
  lastScanned: string;
  iconName: string;
}

export interface ServiceItem {
  id: string;
  number: string;
  title: string;
  tagline: string;
  subtitle?: string;
  icon?: string;
  badge: string;
  description: string;
  deliverables: string[];
  capabilities?: string[];
  metricHighlight: string;
  sampleLog?: string;
}

export interface CapabilityCard {
  id: string;
  code: string;
  title: string;
  category: string;
  description: string;
  impactMetric: string;
  status: string;
}

export type CapabilityItem = CapabilityCard;

export interface ProcessStep {
  step: string;
  phase?: string;
  name: string;
  title: string;
  description: string;
  technicalDetail: string;
  sampleLog: string;
}

export interface CaseStudy {
  id: string;
  sector: string;
  clientType: string;
  clientCategory: string;
  headline: string;
  challenge: string;
  intervention: string;
  solution: string;
  outcomeMetrics: { label: string; value: string }[];
  metrics: { label: string; value: string; detail: string }[];
  timeframe: string;
  verifiedBy: string;
  quote: string;
  quoteAuthor: string;
}

export interface ResearchAdvisory {
  id: string;
  title: string;
  date: string;
  type?: 'Vulnerability Notice' | 'Threat Vector Analysis' | 'Countermeasure Protocol' | 'Experimental Appendix' | string;
  summary: string;
  severity: 'HIGH' | 'CRITICAL' | 'MEDIUM';
  readTime?: string;
}

export type NavigationPage = 'overview' | 'services' | 'rea' | 'research' | 'counter-geo' | 'counter-geo-vol2' | 'counter-geo-vol3' | 'counter-geo-vol4' | 'counter-geo-vol5' | 'counter-geo-vol6' | 'counter-geo-ops' | 'pitch-deck';

export interface ReaSampleTarget {
  id: string;
  name: string;
  target: string;
  type: 'electron' | 'native' | 'web';
  badge: string;
  summary: string;
  evidenceCount: number;
  confidence: string;
  architectures?: string[];
  decompiledLogic?: string;
  ipcChannels?: Array<{
    channel: string;
    direction: string;
    handler: string;
    method: string;
    description: string;
  }>;
  boundaries?: {
    nodeIntegration: boolean;
    contextIsolation: boolean;
    sandbox: boolean;
    preloadPath?: string;
    contextBridgeExposed?: string[];
  };
  modules?: Array<{
    name: string;
    role: string;
    imports: string[];
  }>;
  linkedLibraries?: Array<{
    name: string;
    status: string;
    symbols: string[];
  }>;
  entitlements?: string[];
  entryPoint?: string;
  symbols?: Array<{
    address: string;
    name: string;
    type: string;
    size: string;
  }>;
  apiEndpoints?: Array<{
    method: string;
    endpoint: string;
    protocol?: string;
    headers?: string[];
    batching?: string;
  }>;
  originalSourcesRecovered?: string[];
}
