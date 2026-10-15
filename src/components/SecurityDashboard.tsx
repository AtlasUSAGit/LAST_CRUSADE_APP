import React, { useState } from 'react';
import { Activity, Search, CheckCircle2 } from 'lucide-react';
import { INITIAL_THREAT_ALERTS, ENGINE_STATUSES } from '../data/geoData';
import { ThreatAlert, NavigationPage } from '../types';
import { FileCode, Boxes } from 'lucide-react';

interface SecurityDashboardProps {
  onNavigate?: (page: NavigationPage) => void;
}

export const SecurityDashboard: React.FC<SecurityDashboardProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'feed' | 'engines' | 'rag' | 'countermeasures'>('feed');
  const [alerts] = useState<ThreatAlert[]>(INITIAL_THREAT_ALERTS);
  const [filterSeverity, setFilterSeverity] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredAlerts = alerts.filter((alert) => {
    const matchesSeverity = filterSeverity === 'ALL' || alert.severity === filterSeverity;
    const matchesSearch = searchQuery === '' || 
      alert.engine.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.attackVector.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.target.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSeverity && matchesSearch;
  });

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'CRITICAL':
        return <span className="px-2 py-0.5 bg-[#FFF5F5] text-[#8B1E1E] border border-[#8B1E1E]/30 font-mono text-[10px] font-bold">CRITICAL</span>;
      case 'HIGH':
        return <span className="px-2 py-0.5 bg-[#FFFBF0] text-[#D5991C] border border-[#D5991C]/40 font-mono text-[10px] font-bold">HIGH</span>;
      case 'MEDIUM':
        return <span className="px-2 py-0.5 bg-[#FAF2E1] text-[#004566] border border-[#004566]/30 font-mono text-[10px] font-bold">MEDIUM</span>;
      default:
        return <span className="px-2 py-0.5 bg-[#FFFDF8] text-[#410217]/70 border border-[#F2D69D] font-mono text-[10px]">INFO</span>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'NEUTRALIZED':
        return <span className="px-2 py-0.5 bg-[#F1F8F5] text-[#2E7D32] border border-[#2E7D32]/30 font-mono text-[10px] font-bold flex items-center gap-1"><CheckCircle2 className="w-3 h-3"/> NEUTRALIZED</span>;
      case 'CONTAINED':
        return <span className="px-2 py-0.5 bg-[#FAF2E1] text-[#004566] border border-[#004566]/40 font-mono text-[10px] font-bold">CONTAINED</span>;
      case 'INVESTIGATING':
        return <span className="px-2 py-0.5 bg-[#FFFBF0] text-[#D5991C] border border-[#D5991C]/40 font-mono text-[10px] font-bold">INVESTIGATING</span>;
      default:
        return <span className="px-2 py-0.5 bg-[#FFF5F5] text-[#8B1E1E] border border-[#8B1E1E]/40 font-mono text-[10px] font-bold">ACTIVE</span>;
    }
  };

  return (
    <section id="dashboard" className="py-20 md:py-28 relative bg-[#FBF3E2] border-t border-[#F2D69D]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-[#FAF2E1] border border-[#F2D69D] text-[#D5991C] font-mono text-[11px] font-bold uppercase tracking-[0.2em]">
            <Activity className="w-3.5 h-3.5 animate-pulse" />
            <span>PRODUCT PREVIEW // SECURITY OPERATIONS CENTER</span>
          </div>
          <h2 className="font-serif font-normal text-3xl sm:text-5xl text-[#410217] tracking-tight leading-[1.05]">
            Last Crusade Defense <span className="italic">GEO Strategy Library</span>
          </h2>
          <p className="text-[#410217]/75 text-base sm:text-lg font-sans">
            A real-time threat intelligence dashboard giving security teams 360° visibility into generative search perception, RAG vector distance, and countermeasure status.
          </p>
        </div>

        {/* Command Dashboard Main Container */}
        <div className="bg-[#FAF2E1] border border-[#F2D69D] shadow-xs overflow-hidden">
          
          {/* Top Bar HUD */}
          <div className="bg-[#FFFDF8] p-4 md:p-6 border-b border-[#F2D69D] flex flex-col md:flex-row md:items-center justify-between gap-4 font-mono">
            <div className="flex items-center space-x-4">
              <div className="w-2.5 h-2.5 bg-[#D5991C] animate-pulse" />
              <div>
                <span className="text-[10px] text-[#410217]/60 block tracking-widest uppercase font-bold">SYSTEM STATUS</span>
                <span className="text-sm text-[#410217] font-bold tracking-tight">GEO THREAT DEFENSE ENGINE // ONLINE</span>
              </div>
            </div>

            <div className="flex items-center space-x-6 text-xs text-[#410217]">
              <div>
                <span className="text-[#410217]/50 block text-[10px] uppercase tracking-wider font-bold">ENGINES MONITORED</span>
                <span className="text-[#410217] font-bold">15/15 LIVE</span>
              </div>
              <div>
                <span className="text-[#410217]/50 block text-[10px] uppercase tracking-wider font-bold">VECTOR SCAN FREQ</span>
                <span className="text-[#2E7D32] font-bold">REAL-TIME</span>
              </div>
              <div>
                <span className="text-[#410217]/50 block text-[10px] uppercase tracking-wider font-bold">ACTIVE ALERTS</span>
                <span className="text-[#D5991C] font-bold">{alerts.length} DETECTED</span>
              </div>
            </div>
          </div>

          {/* View Mode Navigation Tabs */}
          <div className="bg-[#FAF2E1] px-4 pt-3 border-b border-[#F2D69D] flex flex-wrap gap-2 font-mono text-xs">
            <button
              onClick={() => setActiveTab('feed')}
              className={`px-4 py-3 font-bold transition-all border-t-2 uppercase tracking-wider ${
                activeTab === 'feed'
                  ? 'bg-[#FFFDF8] border-t-[#410217] border-x border-[#F2D69D] text-[#410217]'
                  : 'border-transparent text-[#410217]/60 hover:text-[#410217]'
              }`}
            >
              01 // LIVE THREAT FEED
            </button>
            <button
              onClick={() => setActiveTab('engines')}
              className={`px-4 py-3 font-bold transition-all border-t-2 uppercase tracking-wider ${
                activeTab === 'engines'
                  ? 'bg-[#FFFDF8] border-t-[#410217] border-x border-[#F2D69D] text-[#410217]'
                  : 'border-transparent text-[#410217]/60 hover:text-[#410217]'
              }`}
            >
              02 // ENGINE MATRIX
            </button>
            <button
              onClick={() => setActiveTab('rag')}
              className={`px-4 py-3 font-bold transition-all border-t-2 uppercase tracking-wider ${
                activeTab === 'rag'
                  ? 'bg-[#FFFDF8] border-t-[#410217] border-x border-[#F2D69D] text-[#410217]'
                  : 'border-transparent text-[#410217]/60 hover:text-[#410217]'
              }`}
            >
              03 // RAG INTEGRITY MAP
            </button>
            <button
              onClick={() => setActiveTab('countermeasures')}
              className={`px-4 py-3 font-bold transition-all border-t-2 uppercase tracking-wider ${
                activeTab === 'countermeasures'
                  ? 'bg-[#FFFDF8] border-t-[#410217] border-x border-[#F2D69D] text-[#410217]'
                  : 'border-transparent text-[#410217]/60 hover:text-[#410217]'
              }`}
            >
              04 // COUNTERMEASURE LOGS
            </button>

            {onNavigate && (
              <div className="ml-auto hidden sm:flex items-center gap-2 pb-2">
                <button
                  onClick={() => onNavigate('rea')}
                  className="px-3 py-1.5 bg-[#410217] hover:bg-[#5C0A24] text-[#FBF3E2] font-mono text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                >
                  <FileCode className="w-3 h-3 text-[#D5991C]" />
                  <span>REA Workbench</span>
                </button>
                <button
                  onClick={() => onNavigate('counter-geo')}
                  className="px-3 py-1.5 bg-[#D5991C] hover:bg-[#E5A932] text-[#410217] font-mono text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                >
                  <Boxes className="w-3 h-3" />
                  <span>3D Visualizer</span>
                </button>
              </div>
            )}
          </div>

          {/* Tab 1: Live Threat Feed */}
          {activeTab === 'feed' && (
            <div className="p-6 space-y-6">
              {/* Controls Bar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs">
                {/* Search Bar */}
                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 text-[#410217]/50 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search threats, targets, vectors..."
                    className="w-full bg-[#FFFDF8] border border-[#F2D69D] pl-9 pr-4 py-2 text-[#410217] placeholder-[#410217]/40 focus:outline-none focus:border-[#410217]"
                  />
                </div>

                {/* Severity Filter */}
                <div className="flex items-center space-x-2 w-full sm:w-auto overflow-x-auto">
                  <span className="text-[#410217]/60 shrink-0 font-bold">SEVERITY:</span>
                  {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM'].map((sev) => (
                    <button
                      key={sev}
                      onClick={() => setFilterSeverity(sev)}
                      className={`px-3 py-1 border transition-all text-xs uppercase font-bold ${
                        filterSeverity === sev
                          ? 'bg-[#410217] border-[#410217] text-[#FBF3E2]'
                          : 'bg-[#FFFDF8] border-[#F2D69D] text-[#410217]/70 hover:text-[#410217]'
                      }`}
                    >
                      {sev}
                    </button>
                  ))}
                </div>
              </div>

              {/* Alerts List */}
              <div className="space-y-3 font-mono">
                {filteredAlerts.length === 0 ? (
                  <div className="text-center py-12 text-[#410217]/50 text-sm">
                    No threat alerts match your search filters.
                  </div>
                ) : (
                  filteredAlerts.map((alert) => (
                    <div
                      key={alert.id}
                      className="bg-[#FFFDF8] p-4 border border-[#F2D69D] hover:border-[#410217] transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center space-x-3 text-xs">
                          <span className="text-[#410217]/50">{alert.timestamp}</span>
                          <span className="text-[#410217] font-bold">{alert.engine}</span>
                          {getSeverityBadge(alert.severity)}
                          {getStatusBadge(alert.status)}
                        </div>
                        <div className="text-[#410217] text-sm font-sans font-bold">
                          {alert.target}
                        </div>
                        <div className="text-xs text-[#410217]/75 font-sans">
                          <strong className="text-[#D5991C]">Attack Vector:</strong> {alert.attackVector} — {alert.details}
                        </div>
                      </div>

                      <div className="text-right shrink-0 font-mono text-xs">
                        <span className="text-[#410217]/50 block font-semibold">VECTOR DISTANCE</span>
                        <span className={`font-bold ${alert.vectorDistance && alert.vectorDistance < 0.2 ? 'text-[#2E7D32]' : 'text-[#D5991C]'}`}>
                          {alert.vectorDistance ? alert.vectorDistance.toFixed(2) : '0.24'}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Tab 2: Engine Perception Matrix */}
          {activeTab === 'engines' && (
            <div className="p-6 space-y-6 font-mono">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {ENGINE_STATUSES.map((engine) => (
                  <div key={engine.code} className="bg-[#FFFDF8] p-5 border border-[#F2D69D] space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-[#410217]/60 font-bold">{engine.code}</span>
                      <span className={`text-[10px] px-2 py-0.5 font-bold ${
                        engine.sentiment === 'POSITIVE' ? 'bg-[#F1F8F5] text-[#2E7D32] border border-[#2E7D32]/30' : 'bg-[#FFFBF0] text-[#D5991C] border border-[#D5991C]/40'
                      }`}>
                        {engine.sentiment}
                      </span>
                    </div>

                    <h4 className="font-serif text-xl text-[#410217] font-bold">{engine.name}</h4>

                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-[#410217]/60 font-semibold">CITATION HEALTH</span>
                        <span className="text-[#410217] font-bold">{engine.citationHealthScore}%</span>
                      </div>
                      <div className="w-full bg-[#FAF2E1] h-2 overflow-hidden border border-[#F2D69D]">
                        <div
                          className={`h-full ${
                            engine.citationHealthScore > 90 ? 'bg-[#410217]' : 'bg-[#D5991C]'
                          }`}
                          style={{ width: `${engine.citationHealthScore}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex justify-between text-xs text-[#410217]/70 pt-2 border-t border-[#F2D69D]">
                      <span>TYPE: <strong className="text-[#410217]">{engine.type}</strong></span>
                      <span>THREATS: <strong className="text-[#D5991C]">{engine.threatCount}</strong></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 3: RAG Vector Integrity Map */}
          {activeTab === 'rag' && (
            <div className="p-6 space-y-6 font-mono text-xs">
              <div className="bg-[#FFFDF8] p-6 border border-[#F2D69D] space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#F2D69D]">
                  <span className="text-[#410217] font-bold">VECTOR SPACE DISTANCE DISTRIBUTION</span>
                  <span className="text-[#2E7D32] font-bold">GROUND TRUTH CENTROID AT 0.00</span>
                </div>
                <p className="text-[#410217]/75 font-sans text-sm">
                  Embedding similarity scores between verified corporate SEC filings / press disclosures vs external RAG index nodes across ChatGPT, Perplexity, and Copilot vector stores.
                </p>

                <div className="space-y-3 pt-4">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-[#410217]">SEC Form 10-Q Financial Disclosure (Verified Anchor)</span>
                      <span className="text-[#2E7D32] font-bold">Distance: 0.02 (Identical)</span>
                    </div>
                    <div className="w-full bg-[#FAF2E1] h-3 overflow-hidden border border-[#F2D69D]">
                      <div className="bg-[#2E7D32] h-full" style={{ width: '98%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-[#410217]">Wikipedia Corporate Page (Monitored RAG Node)</span>
                      <span className="text-[#410217] font-bold">Distance: 0.11 (Normal)</span>
                    </div>
                    <div className="w-full bg-[#FAF2E1] h-3 overflow-hidden border border-[#F2D69D]">
                      <div className="bg-[#410217] h-full" style={{ width: '89%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-[#410217]">Unverified Forum Discussion (Corrupt Vector Candidate)</span>
                      <span className="text-[#8B1E1E] font-bold">Distance: 0.68 (Adversarial)</span>
                    </div>
                    <div className="w-full bg-[#FAF2E1] h-3 overflow-hidden border border-[#F2D69D]">
                      <div className="bg-[#8B1E1E] h-full" style={{ width: '32%' }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: Countermeasure Console */}
          {activeTab === 'countermeasures' && (
            <div className="p-6 space-y-4 font-mono text-xs">
              <div className="bg-[#FFFDF8] p-5 border border-[#F2D69D] space-y-3">
                <div className="flex items-center justify-between text-[#2E7D32] font-bold">
                  <span>[COUNTERMEASURE_DEPLOYED] SEC-GEO-8819</span>
                  <span>STATUS: ACTIVE</span>
                </div>
                <p className="text-[#410217]/80 font-sans text-sm">
                  Deployed JSON-LD structured schema entity anchors to 4 primary web crawlers. Displaced corrupt RAG citations on ChatGPT and Perplexity.
                </p>
                <div className="text-[#410217]/50">
                  Time to deployment: 3m 42s | Models aligned: 6 Frontier LLMs
                </div>
              </div>

              <div className="bg-[#FFFDF8] p-5 border border-[#F2D69D] space-y-3">
                <div className="flex items-center justify-between text-[#004566] font-bold">
                  <span>[TAKEDOWN_ENFORCEMENT] TAKEDOWN-SEC-9921</span>
                  <span>STATUS: IN_PROGRESS</span>
                </div>
                <p className="text-[#410217]/80 font-sans text-sm">
                  Legal & technical takedown demand dispatched to hosting provider of adversarial prompt injection blog.
                </p>
                <div className="text-[#410217]/50">
                  Initiated: 18m ago | Expected resolution: &lt; 2 hours
                </div>
              </div>
            </div>
          )}

        </div>

      </div>
    </section>
  );
};
