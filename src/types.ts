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
  title: string;
  subtitle: string;
  icon: string;
  badge: string;
  description: string;
  capabilities: string[];
  sampleLog: string;
}

export interface CapabilityItem {
  id: string;
  title: string;
  category: 'Defensive Cyber' | 'Offensive Operations' | 'Market Arbitrage' | 'Autonomous Swarms' | 'LLM Security' | 'RAG Integrity' | 'Brand Protection' | 'Threat Intel' | string;
  icon: string;
  description: string;
  technicalImpact: string;
}

export interface CaseStudy {
  id: string;
  clientCategory: string;
  headline: string;
  challenge: string;
  solution: string;
  metrics: { label: string; value: string; detail: string }[];
  timeframe: string;
  verifiedBy: string;
}

export interface ResearchAdvisory {
  id: string;
  title: string;
  date: string;
  type: 'Vulnerability Notice' | 'Threat Vector Analysis' | 'Countermeasure Protocol' | 'Experimental Appendix';
  summary: string;
  severity: 'HIGH' | 'CRITICAL' | 'MEDIUM';
}

export type NavigationPage = 'overview' | 'services' | 'rea' | 'research' | 'counter-geo' | 'counter-geo-vol2' | 'counter-geo-vol3' | 'counter-geo-vol4' | 'counter-geo-vol5' | 'counter-geo-ops' | 'pitch-deck';

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
