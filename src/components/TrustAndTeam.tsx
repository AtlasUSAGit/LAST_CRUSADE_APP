import React, { useState, useRef, useEffect } from 'react';
import { ExternalLink, Sparkles, BookOpen, Shield, ArrowUpRight, CheckCircle2, FileText, Cpu, Lock } from 'lucide-react';
import { RESEARCH_ADVISORIES } from '../data/geoData';
import { ResearchAdvisory, NavigationPage } from '../types';
import { SectionHeader } from './home/SectionHeader';
import { gsap, ScrollTrigger, EASE_OUT } from '../utils/motion';

interface TrustAndTeamProps {
  onNavigate?: (page: NavigationPage) => void;
}

export const TrustAndTeam: React.FC<TrustAndTeamProps> = ({ onNavigate }) => {
  const [selectedAdvisory, setSelectedAdvisory] = useState<ResearchAdvisory | null>(null);

  const sectionRef = useRef<HTMLElement>(null);
  const cardsGridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Stagger whitepaper dossier cards
      if (cardsGridRef.current) {
        const cards = cardsGridRef.current.children;
        gsap.fromTo(
          cards,
          { opacity: 0, y: 25 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: EASE_OUT,
            scrollTrigger: {
              trigger: cardsGridRef.current,
              start: 'top 90%',
              once: true
            }
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleCardClick = (adv: ResearchAdvisory) => {
    if (adv.id === 'ADV-2026-004' && onNavigate) {
      onNavigate('counter-geo');
    } else if (adv.id === 'ADV-2026-003' && onNavigate) {
      onNavigate('counter-geo-vol2');
    } else if (adv.id === 'ADV-2026-002' && onNavigate) {
      onNavigate('counter-geo-vol3');
    } else {
      setSelectedAdvisory(adv);
    }
  };

  return (
    <section
      ref={sectionRef}
      id="research"
      className="pt-10 pb-20 md:pt-14 md:pb-28 relative bg-transparent border-t border-[#F2D69D] scroll-mt-20 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <SectionHeader
          sectionIndex="§ 02"
          kicker="// Foundational Research & Threat Intelligence"
          title="Whitepapers and Research"
          italicWord="Whitepapers"
          description="Authored to codify the mathematics, threat vectors, and active defense protocols across modern RAG pipelines and frontier AI reasoning models."
        />

        {/* Flagship Research Dossiers Grid */}
        <div className="scroll-mt-24 mt-6">
          <div className="flex flex-wrap items-baseline justify-between gap-4 mb-6 pb-3 border-b border-[#F2D69D]/80">
            <div>
              <span className="font-mono text-[10px] text-[#D5991C] uppercase tracking-[0.25em] font-bold block mb-1">
                // PEER-REVIEWED ARCHIVAL RELEASES
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl text-[#410217] tracking-tight">
                The Counter-AEO <span className="italic">Trilogy</span>
              </h3>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <p className="text-xs font-mono text-[#410217]/60 max-w-sm">
                Each volume includes full mathematical proofs, threat taxonomy, 2-page archival briefing, and an interactive 3D WebGL laboratory.
              </p>
              {onNavigate && (
                <button
                  onClick={() => onNavigate('research')}
                  className="px-3 py-1.5 bg-[#410217] hover:bg-[#5C0A24] text-[#FBF3E2] font-mono text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer whitespace-nowrap"
                >
                  Research Hub →
                </button>
              )}
            </div>
          </div>

          <div ref={cardsGridRef} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {RESEARCH_ADVISORIES.map((adv) => {
              const isVol1 = adv.id === 'ADV-2026-004';
              const isVol2 = adv.id === 'ADV-2026-003';
              const isVol3 = adv.id === 'ADV-2026-002';

              const volumeBadge = isVol1
                ? { tag: 'VOLUME I', color: 'bg-[#410217] text-[#FBF3E2] border-[#D5991C]', accent: '#D5991C', target: 'counter-geo' as NavigationPage, subtitle: 'Vector De-Biasing & 6-Layer Architecture' }
                : isVol2
                ? { tag: 'VOLUME II', color: 'bg-[#004566] text-[#FBF3E2] border-[#00A878]', accent: '#00A878', target: 'counter-geo-vol2' as NavigationPage, subtitle: 'Stateful Memory Immunity & ZK Compliance' }
                : { tag: 'VOLUME III', color: 'bg-[#2A0845] text-[#FBF3E2] border-[#D5991C]', accent: '#E63946', target: 'counter-geo-vol3' as NavigationPage, subtitle: 'CounterAEO-Bench & High-Frequency Stress Testing' };

              return (
                <article
                  key={adv.id}
                  onClick={() => handleCardClick(adv)}
                  className="group relative bg-[#FAF2E1] border border-[#F2D69D] hover:border-[#410217] p-7 flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer bg-linear-to-b from-[#FFFDF8] to-[#FAF2E1]"
                >
                  {/* Top Archival Header Strip */}
                  <div>
                    <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#F2D69D]/80 font-mono text-xs">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 text-[9px] font-bold tracking-widest uppercase border ${volumeBadge.color}`}>
                          {volumeBadge.tag}
                        </span>
                        <span className="text-[10px] font-bold text-[#410217]">{adv.id}</span>
                      </div>
                      <span className="text-[10px] text-[#410217]/60">{adv.date}</span>
                    </div>

                    <div className="font-mono text-[10px] text-[#8B5A0B] uppercase font-bold tracking-wider mb-2">
                      {volumeBadge.subtitle}
                    </div>

                    <h4 className="font-serif font-bold text-xl text-[#410217] mb-3 leading-snug group-hover:text-[#8B1E1E] transition-colors">
                      {adv.title}
                    </h4>

                    <p className="text-[#410217]/75 text-xs sm:text-[13px] leading-relaxed mb-6 font-sans">
                      {adv.summary}
                    </p>
                  </div>

                  {/* Bottom Technical Spec & Action CTA */}
                  <div>
                    <div className="py-3 px-3 bg-[#FAF2E1] border border-[#F2D69D]/70 font-mono text-[10px] text-[#410217]/70 space-y-1 mb-4">
                      <div className="flex justify-between">
                        <span className="text-[#410217]/50">FORMAT:</span>
                        <span className="font-bold text-[#410217]">2-PAGE BRIEF + 3D LAB</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#410217]/50">STATUS:</span>
                        <span className="font-bold text-[#00A878]">OPEN ACCESS // VERIFIED</span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-[#F2D69D] flex items-center justify-between font-mono text-xs">
                      <span className="inline-flex items-center gap-1.5 font-bold text-[#410217] group-hover:text-[#8B1E1E] transition-colors uppercase tracking-wider text-[11px]">
                        <BookOpen className="w-3.5 h-3.5 text-[#D5991C]" />
                        <span>Launch Lab & Paper</span>
                        <ArrowUpRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      </span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 bg-[#8B1E1E]/10 text-[#8B1E1E] border border-[#8B1E1E]/20 font-bold">
                        {adv.severity}
                      </span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

      </div>

      {/* Advisory Modal for standard advisories */}
      {selectedAdvisory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#410217]/60 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-[#FAF2E1] border border-[#410217] p-7 max-w-xl w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#F2D69D] font-mono text-xs">
              <span className="text-[#410217] font-bold">{selectedAdvisory.id}</span>
              <button onClick={() => setSelectedAdvisory(null)} className="text-[#410217]/70 hover:text-[#410217] font-bold cursor-pointer">✕ Close</button>
            </div>
            <h3 className="font-serif text-2xl text-[#410217] font-bold">{selectedAdvisory.title}</h3>
            <p className="text-[#410217]/80 text-sm leading-relaxed">{selectedAdvisory.summary}</p>
            <div className="p-4 bg-[#FFFDF8] border border-[#F2D69D] font-mono text-xs space-y-2">
              <div className="text-[#00A878] font-bold">RECOMMENDED COUNTERMEASURE ACTION:</div>
              <div className="text-[#410217]/80">Deploy Last Crusade Defense Entity Anchor Schema v4.2 to sanitize RAG vector inputs.</div>
            </div>
            {selectedAdvisory.id === 'ADV-2026-004' && onNavigate ? (
              <button
                onClick={() => {
                  setSelectedAdvisory(null);
                  onNavigate('counter-geo');
                }}
                className="w-full py-3 bg-[#410217] hover:bg-[#5C0A24] text-[#FBF3E2] font-mono text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center space-x-2"
              >
                <Sparkles className="w-4 h-4 text-[#D5991C]" />
                <span>Open Volume 1 Paper & Interactive Lab →</span>
              </button>
            ) : selectedAdvisory.id === 'ADV-2026-003' && onNavigate ? (
              <button
                onClick={() => {
                  setSelectedAdvisory(null);
                  onNavigate('counter-geo-vol2');
                }}
                className="w-full py-3 bg-[#004566] hover:bg-[#002b40] text-[#FBF3E2] font-mono text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center space-x-2"
              >
                <Sparkles className="w-4 h-4 text-[#00A878]" />
                <span>Open Volume 2 Paper & Interactive Lab →</span>
              </button>
            ) : selectedAdvisory.id === 'ADV-2026-002' && onNavigate ? (
              <button
                onClick={() => {
                  setSelectedAdvisory(null);
                  onNavigate('counter-geo-vol3');
                }}
                className="w-full py-3 bg-[#5B21B6] hover:bg-[#3d147d] text-[#FBF3E2] font-mono text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center space-x-2"
              >
                <Sparkles className="w-4 h-4 text-[#D5991C]" />
                <span>Open Volume 3 Paper & Benchmark Lab →</span>
              </button>
            ) : (
              <button
                onClick={() => setSelectedAdvisory(null)}
                className="w-full py-3 bg-[#410217] hover:bg-[#5C0A24] text-[#FBF3E2] font-mono text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
              >
                Acknowledge & Close
              </button>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
