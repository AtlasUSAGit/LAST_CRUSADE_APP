import React, { useState, useRef, useEffect } from 'react';
import { Crosshair, TrendingUp, Database, AlertTriangle, GitFork, Search, ShieldCheck, Cpu, Zap, Layers } from 'lucide-react';
import { CAPABILITIES_MATRIX } from '../data/geoData';
import { SectionHeader } from './home/SectionHeader';
import { gsap, ScrollTrigger, EASE_OUT } from '../utils/motion';

export const CapabilitiesGrid: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const categories = [
    { label: 'ALL', count: CAPABILITIES_MATRIX.length },
    { label: 'Defensive Cyber', count: CAPABILITIES_MATRIX.filter((c) => c.category === 'Defensive Cyber').length },
    { label: 'Offensive Operations', count: CAPABILITIES_MATRIX.filter((c) => c.category === 'Offensive Operations').length },
    { label: 'Market Arbitrage', count: CAPABILITIES_MATRIX.filter((c) => c.category === 'Market Arbitrage').length },
    { label: 'Autonomous Swarms', count: CAPABILITIES_MATRIX.filter((c) => c.category === 'Autonomous Swarms').length }
  ];

  const filteredCapabilities = selectedCategory === 'ALL'
    ? CAPABILITIES_MATRIX
    : CAPABILITIES_MATRIX.filter((c) => c.category === selectedCategory);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || !gridRef.current) return;

    const cards = gridRef.current.children;
    gsap.fromTo(
      cards,
      { opacity: 0, y: 25 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.08,
        ease: EASE_OUT,
        scrollTrigger: {
          trigger: gridRef.current,
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        }
      }
    );
  }, [selectedCategory]);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Database':
        return <Database className="w-4 h-4 text-[#8B5A0B]" />;
      case 'Crosshair':
        return <Crosshair className="w-4 h-4 text-[#8B1E1E]" />;
      case 'TrendingUp':
        return <TrendingUp className="w-4 h-4 text-[#00A878]" />;
      case 'GitFork':
        return <GitFork className="w-4 h-4 text-[#004566]" />;
      case 'Search':
        return <Search className="w-4 h-4 text-[#8B5A0B]" />;
      case 'AlertTriangle':
        return <AlertTriangle className="w-4 h-4 text-[#8B1E1E]" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-4 h-4 text-[#00A878]" />;
      default:
        return <Cpu className="w-4 h-4 text-[#410217]" />;
    }
  };

  return (
    <section
      ref={sectionRef}
      id="capabilities"
      className="py-24 md:py-32 relative bg-transparent border-t border-[#F2D69D] scroll-mt-20 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <SectionHeader
          sectionIndex="§ 05"
          kicker="// Threat Matrix & Cyber Operations Specifications"
          title="Services"
          description="Proprietary high-dimensional vector space architecture engineered for defensive cybersecurity, offensive GEO cyber operations, algorithmic liquidity arbitrage, and autonomous agent swarms."
        />

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12 font-mono text-xs">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.label;
            return (
              <button
                key={cat.label}
                onClick={() => setSelectedCategory(cat.label)}
                className={`px-4 py-2 transition-all border uppercase tracking-wider font-bold cursor-pointer flex items-center gap-2 ${
                  isActive
                    ? 'bg-[#410217] border-[#410217] text-[#FBF3E2] shadow-md -translate-y-0.5'
                    : 'bg-[#FAF2E1] border-[#F2D69D] text-[#410217]/70 hover:bg-[#F3E9D2] hover:text-[#410217]'
                }`}
              >
                <span>{cat.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-xs ${
                  isActive ? 'bg-[#D5991C] text-[#410217]' : 'bg-[#410217]/10 text-[#410217]/60'
                }`}>
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Capabilities Grid */}
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCapabilities.map((cap, idx) => (
            <article
              key={cap.id}
              className="bg-[#FAF2E1] border border-[#F2D69D] hover:border-[#410217] p-7 flex flex-col justify-between space-y-5 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-linear-to-b from-[#FFFDF8] to-[#FAF2E1] group"
            >
              <div>
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#F2D69D]/70 font-mono text-xs">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 bg-[#FAF2E1] border border-[#410217]/30 flex items-center justify-center shadow-xs">
                      {getIcon(cap.icon)}
                    </div>
                    <span className="font-bold text-[#8B5A0B] text-[11px]">
                      OPS-0{idx + 1}
                    </span>
                  </div>
                  <span className="font-mono text-[9px] px-2 py-0.5 bg-[#FFFDF8] border border-[#F2D69D] text-[#410217] font-bold uppercase tracking-wider">
                    {cap.category}
                  </span>
                </div>

                <h3 className="font-serif font-bold text-lg text-[#410217] mb-2 group-hover:text-[#8B1E1E] transition-colors leading-snug">
                  {cap.title}
                </h3>
                <p className="text-[#410217]/75 text-xs sm:text-[13px] leading-relaxed mb-4 font-sans">
                  {cap.description}
                </p>
              </div>

              {/* Technical Impact Specification Box */}
              <div className="pt-3 border-t border-[#F2D69D] font-mono text-[11px] text-[#410217]/85 bg-[#FFFDF8] p-3.5 border border-[#F2D69D]/80 space-y-1">
                <div className="flex items-center justify-between text-[10px] text-[#8B5A0B] font-bold uppercase tracking-wider">
                  <span>TECHNICAL IMPACT SPEC:</span>
                  <span className="text-[#00A878]">ACTIVE RULE</span>
                </div>
                <div className="text-[11px] text-[#410217]/80 font-sans leading-relaxed">
                  {cap.technicalImpact}
                </div>
              </div>
            </article>
          ))}
        </div>

      </div>
    </section>
  );
};
