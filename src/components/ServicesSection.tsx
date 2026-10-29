import React, { useState, useRef, useEffect } from 'react';
import { ShieldCheck, Crosshair, TrendingUp, Check, ChevronRight } from 'lucide-react';
import { SERVICES } from '../data/geoData';
import { SectionHeader } from './home/SectionHeader';
import { gsap, EASE_OUT } from '../utils/motion';

export const ServicesSection: React.FC = () => {
  const [activeCardId, setActiveCardId] = useState<string>('defensive-cyber');

  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

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
          title="Counter-AEO Defensive Cybersecurity & Offensive Operations"
          italicWord="Offensive Operations"
          description="From sovereign epistemic defense and RAG layer immunization for domestic foundation models to authorized offensive cyber operations targeting foreign RAG layers and institutional liquidity extraction arbitrage."
        />

        {/* 3 Core Services Cards */}
        <div ref={cardsRef} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {SERVICES.map((service, index) => {
            const isActive = activeCardId === service.id;
            const numeral = `0${index + 1}`;

            return (
              <div
                key={service.id}
                onClick={() => setActiveCardId(service.id)}
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
                    <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-[#D5991C] animate-pulse' : 'bg-[#00A878]'}`} />
                    {isActive ? 'ACTIVE CAPABILITY' : 'SELECT CAPABILITY'}
                  </span>
                  <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
