import React, { useState, useRef, useEffect } from 'react';
import { ShieldCheck, Crosshair, TrendingUp, Check, Terminal, ChevronRight, Play, RefreshCw, CornerDownRight } from 'lucide-react';
import { SERVICES } from '../data/geoData';
import { SectionHeader } from './home/SectionHeader';
import { gsap, ScrollTrigger, EASE_OUT } from '../utils/motion';

export const ServicesSection: React.FC = () => {
  const [activeLogTab, setActiveLogTab] = useState<string>('defensive-cyber');
  const [simulating, setSimulating] = useState<boolean>(false);
  const [extraLogs, setExtraLogs] = useState<string[]>([]);

  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const consoleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      if (cardsRef.current) {
        gsap.fromTo(
          cardsRef.current.children,
          { opacity: 0, y: 35 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: EASE_OUT,
            scrollTrigger: {
              trigger: cardsRef.current,
              start: 'top 82%',
              toggleActions: 'play none none reverse'
            }
          }
        );
      }

      if (consoleRef.current) {
        gsap.fromTo(
          consoleRef.current,
          { opacity: 0, y: 25 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: EASE_OUT,
            scrollTrigger: {
              trigger: consoleRef.current,
              start: 'top 85%',
              toggleActions: 'play none none reverse'
            }
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const getIcon = (iconName: string, isActive: boolean) => {
    switch (iconName) {
      case 'ShieldCheck':
        return <ShieldCheck className={`w-5 h-5 ${isActive ? 'text-[#D5991C]' : 'text-[#00A878]'}`} />;
      case 'Crosshair':
        return <Crosshair className={`w-5 h-5 ${isActive ? 'text-[#D5991C]' : 'text-[#8B1E1E]'}`} />;
      case 'TrendingUp':
        return <TrendingUp className={`w-5 h-5 ${isActive ? 'text-[#D5991C]' : 'text-[#004566]'}`} />;
      default:
        return <ShieldCheck className={`w-5 h-5 ${isActive ? 'text-[#D5991C]' : 'text-[#410217]'}`} />;
    }
  };

  const handleSimulateProbe = () => {
    setSimulating(true);
    const selectedService = SERVICES.find((s) => s.id === activeLogTab);
    const timestamp = new Date().toISOString().split('T')[1].slice(0, 8);

    setTimeout(() => {
      let probeMessage = '';
      if (selectedService?.id === 'defensive-cyber') {
        probeMessage = `[${timestamp} UTC] LIVE_PROBE // HSM root anchor validated. 0.00% drift across 15+ domestic models. RAG retrieval integrity: 99.8%.`;
      } else if (selectedService?.id === 'offensive-ops') {
        probeMessage = `[${timestamp} UTC] LIVE_PROBE // Model RAG probe deployed. Bypassed external firewall via open-web ingestion layer. Synthesized asymmetric vector.`;
      } else {
        probeMessage = `[${timestamp} UTC] LIVE_PROBE // Order-book telemetry synced. Automated bot sweep detected & neutralized. Captured pre-positioned liquidity block.`;
      }
      setExtraLogs((prev) => [probeMessage, ...prev.slice(0, 3)]);
      setSimulating(false);
    }, 450);
  };

  const currentService = SERVICES.find((s) => s.id === activeLogTab) || SERVICES[0];

  return (
    <section
      ref={sectionRef}
      id="services"
      className="py-24 md:py-32 relative bg-transparent border-t border-[#F2D69D] scroll-mt-20 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <SectionHeader
          sectionIndex="§ 03"
          kicker="// Dual-Use Sovereign Architecture"
          title="Counter-GEO Defensive Cybersecurity & Offensive Operations"
          italicWord="Offensive Operations"
          description="From sovereign epistemic defense and RAG layer immunization for domestic foundation models to authorized offensive cyber operations targeting foreign RAG layers and institutional liquidity extraction arbitrage."
        />

        {/* 3 Core Services Cards */}
        <div ref={cardsRef} className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          {SERVICES.map((service, index) => {
            const isActive = activeLogTab === service.id;
            const numeral = `0${index + 1}`;

            return (
              <div
                key={service.id}
                onClick={() => {
                  setActiveLogTab(service.id);
                  setExtraLogs([]);
                }}
                className={`cursor-pointer p-8 transition-all duration-300 flex flex-col justify-between border relative group ${
                  isActive
                    ? 'bg-[#410217] text-[#FBF3E2] border-[#D5991C] shadow-2xl transform -translate-y-1'
                    : 'bg-[#FAF2E1] text-[#410217] border-[#F2D69D] hover:border-[#410217]/60 hover:bg-[#F3E9D2]'
                }`}
              >
                {/* Top Status & Numeral */}
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 border flex items-center justify-center transition-colors ${
                        isActive ? 'bg-[#2A010F] border-[#D5991C]' : 'bg-[#FFFDF8] border-[#410217]/25'
                      }`}>
                        {getIcon(service.icon, isActive)}
                      </div>
                      <span className={`font-mono text-xs font-bold tracking-widest ${isActive ? 'text-[#D5991C]' : 'text-[#410217]/40'}`}>
                        {numeral} //
                      </span>
                    </div>

                    <span className={`font-mono text-[9px] tracking-widest px-2.5 py-1 border uppercase font-bold ${
                      isActive ? 'bg-[#2A010F] border-[#D5991C] text-[#D5991C]' : 'bg-[#FFFDF8] border-[#410217]/25 text-[#410217]'
                    }`}>
                      {service.badge}
                    </span>
                  </div>

                  <h3 className={`font-serif text-2xl mb-1 tracking-tight ${isActive ? 'text-[#FBF3E2]' : 'text-[#410217]'}`}>
                    {service.title}
                  </h3>
                  <p className={`font-mono text-[11px] mb-4 uppercase font-bold tracking-wider ${isActive ? 'text-[#D5991C]' : 'text-[#8B5A0B]'}`}>
                    {service.subtitle}
                  </p>

                  <p className={`text-xs leading-relaxed mb-6 font-sans ${isActive ? 'text-[#FBF3E2]/85' : 'text-[#410217]/75'}`}>
                    {service.description}
                  </p>

                  {/* Tactical Capabilities List */}
                  <div className={`space-y-2.5 pt-4 border-t mb-6 ${isActive ? 'border-white/15' : 'border-[#F2D69D]'}`}>
                    <span className={`font-mono text-[9px] uppercase tracking-widest block font-bold ${isActive ? 'text-[#D5991C]' : 'text-[#410217]/60'}`}>
                      OPERATIONAL CAPABILITIES:
                    </span>
                    {service.capabilities.map((cap, i) => (
                      <div key={i} className={`flex items-start space-x-2.5 text-xs font-sans ${isActive ? 'text-[#FBF3E2]/90' : 'text-[#410217]/85'}`}>
                        <Check className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${isActive ? 'text-[#D5991C]' : 'text-[#00A878]'}`} />
                        <span>{cap}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card Footer */}
                <div className={`pt-4 border-t flex items-center justify-between text-xs font-mono font-bold uppercase tracking-wider ${
                  isActive ? 'border-white/15 text-[#D5991C]' : 'border-[#F2D69D] text-[#410217]/70 group-hover:text-[#410217]'
                }`}>
                  <span className="flex items-center gap-1.5 text-[11px]">
                    <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-[#D5991C] animate-pulse' : 'bg-[#410217]/30'}`} />
                    {isActive ? 'CONSOLE STREAM ACTIVE' : 'SELECT FOR TELEMETRY'}
                  </span>
                  <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Live Tactical Forensic Console */}
        <div ref={consoleRef} className="bg-[#FAF2E1] border border-[#F2D69D] p-6 md:p-8 shadow-md">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 mb-4 border-b border-[#F2D69D] font-mono text-xs">
            <div className="flex items-center space-x-3">
              <Terminal className="w-4 h-4 text-[#D5991C]" />
              <span className="text-[#410217] font-bold uppercase tracking-wider text-[11px] sm:text-xs">
                LAST CRUSADE FORENSIC TELEMETRY // {currentService.title.toUpperCase()}
              </span>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={handleSimulateProbe}
                disabled={simulating}
                className="px-3 py-1 bg-[#410217] hover:bg-[#5C0A24] text-[#FBF3E2] font-mono text-[10px] uppercase font-bold tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
              >
                {simulating ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Play className="w-3 h-3 text-[#D5991C]" />}
                <span>{simulating ? 'Simulating...' : 'Inject Test Probe'}</span>
              </button>

              <div className="flex items-center space-x-2 pl-2 border-l border-[#F2D69D]">
                <span className="w-2 h-2 rounded-full bg-[#00A878] animate-pulse" />
                <span className="text-[#00A878] font-bold text-[10px] tracking-wider">LIVE TELEMETRY</span>
              </div>
            </div>
          </div>

          <div className="bg-[#000D13] p-5 sm:p-6 border border-[#410217]/40 font-mono text-xs text-[#FBF3E2] space-y-2.5 overflow-x-auto shadow-inner rounded-none">
            <div className="text-[#F2D69D]/50 text-[11px]">
              # Initializing Last Crusade Cyber Operations kernel probe for [{currentService.badge}]...
            </div>
            
            {extraLogs.map((log, idx) => (
              <div key={idx} className="text-[#00A878] flex items-start gap-2 text-[11px] bg-[#00A878]/10 p-2 border-l-2 border-[#00A878]">
                <CornerDownRight className="w-3.5 h-3.5 shrink-0 mt-0.5 text-[#00A878]" />
                <span>{log}</span>
              </div>
            ))}

            <div className="text-[#D5991C] text-[11px] leading-relaxed">
              {currentService.sampleLog}
            </div>

            <div className="pt-2 border-t border-white/10 flex flex-wrap items-center justify-between text-[10px] text-[#FBF3E2]/60 gap-2">
              <div>
                [OPERATIONAL_METRICS] Probed 15 Frontier Models & Swarm Nodes | Cosine Distance Delta: <span className="text-[#00A878] font-bold">0.018</span>
              </div>
              <div className="text-[#D5991C]">
                DUAL-USE STATUS // AUTHORIZED & ENGAGED
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
