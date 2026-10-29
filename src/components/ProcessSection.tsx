import React, { useState, useRef, useEffect } from 'react';
import { Radio, Cpu, Crosshair, ShieldCheck, Eye, Terminal, ArrowRight, ShieldAlert, CheckCircle2, Clock } from 'lucide-react';
import { PROCESS_STEPS, CASE_STUDIES } from '../data/geoData';
import { SectionHeader } from './home/SectionHeader';
import { gsap, ScrollTrigger, EASE_OUT } from '../utils/motion';

export const ProcessSection: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);

  const sectionRef = useRef<HTMLElement>(null);
  const stepsBarRef = useRef<HTMLDivElement>(null);
  const detailCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      if (stepsBarRef.current) {
        gsap.fromTo(
          stepsBarRef.current.children,
          { opacity: 0, y: 25 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.08,
            ease: EASE_OUT,
            scrollTrigger: {
              trigger: stepsBarRef.current,
              start: 'top 85%',
              toggleActions: 'play none none reverse'
            }
          }
        );
      }

      if (detailCardRef.current) {
        gsap.fromTo(
          detailCardRef.current,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: EASE_OUT,
            scrollTrigger: {
              trigger: detailCardRef.current,
              start: 'top 82%',
              toggleActions: 'play none none reverse'
            }
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const getStepIcon = (iconName: string) => {
    switch (iconName) {
      case 'Radio':
        return <Radio className="w-5 h-5 text-[#D5991C]" />;
      case 'Cpu':
        return <Cpu className="w-5 h-5 text-[#410217]" />;
      case 'Crosshair':
        return <Crosshair className="w-5 h-5 text-[#8B1E1E]" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-5 h-5 text-[#00A878]" />;
      case 'Eye':
        return <Eye className="w-5 h-5 text-[#004566]" />;
      default:
        return <Radio className="w-5 h-5 text-[#D5991C]" />;
    }
  };

  const currentStep = PROCESS_STEPS[activeStep];
  const featuredCaseStudy = CASE_STUDIES[0];

  return (
    <section
      ref={sectionRef}
      id="process"
      className="py-24 md:py-32 relative bg-transparent border-t border-[#F2D69D] scroll-mt-20 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <SectionHeader
          sectionIndex="§ 04"
          kicker="// Operational Methodology & Lifecycle"
          title="Five-Stage AEO Defense Lifecycle"
          italicWord="Defense Lifecycle"
          description="An institutional-grade 5-stage lifecycle for isolating AI answer distortions, neutralizing poisoned RAG vectors, and reclaiming generative brand sovereignty."
        />

        {/* 5-Step Architectural Navigation Strip */}
        <div ref={stepsBarRef} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-10">
          {PROCESS_STEPS.map((item, index) => {
            const isActive = activeStep === index;
            return (
              <button
                key={item.step}
                onClick={() => setActiveStep(index)}
                className={`group p-5 font-mono text-left transition-all duration-300 border relative cursor-pointer ${
                  isActive
                    ? 'bg-[#410217] text-[#FBF3E2] border-[#410217] shadow-xl -translate-y-1'
                    : 'bg-[#FAF2E1] border-[#F2D69D] text-[#410217]/75 hover:bg-[#F3E9D2] hover:text-[#410217]'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-[11px] font-bold uppercase tracking-widest ${isActive ? 'text-[#D5991C]' : 'text-[#8B5A0B]'}`}>
                    PHASE {item.step}
                  </span>
                  {isActive ? (
                    <span className="w-2 h-2 rounded-full bg-[#00A878] animate-pulse" />
                  ) : (
                    <span className="text-[10px] text-[#410217]/30 group-hover:text-[#410217]/60">0{index + 1}</span>
                  )}
                </div>

                <div className={`font-serif font-bold text-base truncate tracking-tight mb-1 ${isActive ? 'text-[#FBF3E2]' : 'text-[#410217]'}`}>
                  {item.phase}
                </div>

                <div className={`font-mono text-[10px] truncate ${isActive ? 'text-[#FBF3E2]/70' : 'text-[#410217]/50'}`}>
                  {item.title}
                </div>

                {isActive && (
                  <div className="absolute -bottom-1.5 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-[#410217] rotate-45" />
                )}
              </button>
            );
          })}
        </div>

        {/* Active Step Detailed Card */}
        <div ref={detailCardRef} className="bg-[#FAF2E1] border border-[#F2D69D] p-8 md:p-10 shadow-lg relative overflow-hidden bg-linear-to-b from-[#FFFDF8] to-[#FAF2E1]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
              <div>
                <div className="flex items-center space-x-3.5 font-mono text-xs mb-4">
                  <div className="w-10 h-10 bg-[#FFFDF8] border border-[#410217]/30 flex items-center justify-center shadow-xs">
                    {getStepIcon(currentStep.icon)}
                  </div>
                  <div>
                    <div className="text-[#8B5A0B] uppercase tracking-widest text-[10px] font-bold">
                      STAGE {currentStep.step} // OPERATIONAL PROTOCOL
                    </div>
                    <div className="font-serif font-bold text-[#410217] text-lg uppercase tracking-wide">
                      {currentStep.phase}
                    </div>
                  </div>
                </div>

                <h3 className="font-serif text-2xl sm:text-3xl text-[#410217] tracking-tight mb-3">
                  {currentStep.title}
                </h3>

                <p className="text-[#410217]/85 text-sm sm:text-base leading-relaxed font-sans">
                  {currentStep.description}
                </p>
              </div>

              {/* Guarantees & SLAs */}
              <div className="pt-6 border-t border-[#F2D69D] grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
                <div className="bg-[#FFFDF8] p-4 border border-[#F2D69D]">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="w-3.5 h-3.5 text-[#00A878]" />
                    <span className="text-[#410217]/60 uppercase tracking-wider text-[10px] font-bold">AUTOMATION SLA</span>
                  </div>
                  <span className="text-[#00A878] font-bold text-sm">&lt; 15 Seconds Latency</span>
                  <p className="text-[10px] text-[#410217]/60 mt-1 font-sans">Real-time vector pipeline trigger upon perturbance detection.</p>
                </div>

                <div className="bg-[#FFFDF8] p-4 border border-[#F2D69D]">
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#D5991C]" />
                    <span className="text-[#410217]/60 uppercase tracking-wider text-[10px] font-bold">CROSS-ENGINE SYNC</span>
                  </div>
                  <span className="text-[#410217] font-bold text-sm">15 Frontier LLMs</span>
                  <p className="text-[10px] text-[#410217]/60 mt-1 font-sans">Simultaneous verification across search & enterprise APIs.</p>
                </div>
              </div>
            </div>

            {/* Right Telemetry Terminal & Case Study Snippet */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
              {/* Telemetry Console */}
              <div className="bg-[#000D13] p-5 border border-[#410217]/40 font-mono text-xs text-[#FBF3E2] space-y-2.5 shadow-inner">
                <div className="flex items-center justify-between pb-3 border-b border-white/10 text-[#F2D69D]/60 text-[11px] font-bold">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-3.5 h-3.5 text-[#D5991C]" />
                    <span>PROCESS_EXEC // STEP_{currentStep.step}</span>
                  </div>
                  <span className="text-[#00A878] font-bold">NOMINAL</span>
                </div>
                
                <p className="text-white/40 text-[11px]"># Executing Stage {currentStep.step} subroutines...</p>
                <p className="text-[#D5991C] font-bold text-[11px]">&gt; LastCrusadeDefense.Engine.Execute("{currentStep.phase}")</p>
                <p className="text-[#FBF3E2]/85 text-[11px]">&gt; Target Node: RAG Vector Index [1536-dim]</p>
                <p className="text-[#00A878] text-[11px]">&gt; Cosine Distance Restored: 0.02 (Tolerable &lt; 0.05)</p>
                <p className="text-[#FBF3E2]/60 text-[10px] pt-1 border-t border-white/10">
                  SHA-256: 9e3a...b8c1 // Timestamp: {new Date().toISOString().split('T')[0]}
                </p>
              </div>

              {/* Case Study Callout */}
              <div className="bg-[#FAF2E1] border border-[#F2D69D] p-5 space-y-2">
                <div className="flex items-center justify-between font-mono text-[10px]">
                  <span className="text-[#8B5A0B] uppercase font-bold tracking-wider">// VERIFIED FIELD ACTION</span>
                  <span className="text-[#410217]/60">{featuredCaseStudy.timeframe}</span>
                </div>
                <div className="font-serif font-bold text-sm text-[#410217]">
                  {featuredCaseStudy.headline}
                </div>
                <div className="font-mono text-[10px] text-[#00A878] font-bold">
                  Resolved across ChatGPT, Perplexity, Copilot, & Claude
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
