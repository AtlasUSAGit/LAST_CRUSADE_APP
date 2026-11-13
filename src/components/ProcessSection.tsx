import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PROCESS_STEPS, CASE_STUDIES } from '../data/geoData';
import { SectionHeader } from './home/SectionHeader';
import { Shield, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export const ProcessSection: React.FC = () => {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [activeScenarioIndex, setActiveScenarioIndex] = useState(0);
  const currentStep = PROCESS_STEPS[activeStepIndex] || PROCESS_STEPS[0];
  const activeScenario = CASE_STUDIES[activeScenarioIndex] || CASE_STUDIES[0];

  const rootRef = useRef<HTMLElement>(null);
  const cubeViewportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      const viewport = cubeViewportRef.current;
      if (!viewport) return;

      const panels = gsap.utils.toArray<HTMLElement>('.cube-panel', viewport);
      if (panels.length === 0) return;

      const cubeTl = gsap.timeline({
        scrollTrigger: {
          trigger: viewport,
          start: 'top top',
          end: () => `+=${panels.length * 105}%`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          onUpdate: (self) => {
            const idx = Math.min(
              panels.length - 1,
              Math.max(0, Math.round(self.progress * (panels.length - 1)))
            );
            setActiveStepIndex(idx);
          },
        },
      });

      panels.forEach((panel, i) => {
        if (i === 0) {
          gsap.set(panel, {
            rotationX: 0,
            yPercent: 0,
            opacity: 1,
            scale: 1,
            transformOrigin: '50% 100%',
          });
          return;
        }

        const prevPanel = panels[i - 1];

        gsap.set(panel, {
          rotationX: -90,
          yPercent: 100,
          transformOrigin: '50% 0%',
          opacity: 0,
        });
        gsap.set(prevPanel, { transformOrigin: '50% 100%' });

        cubeTl
          .to(prevPanel, {
            rotationX: 90,
            yPercent: -100,
            scale: 0.85,
            opacity: 0,
            duration: 1,
            ease: 'power2.inOut',
          })
          .to(
            panel,
            {
              rotationX: 0,
              yPercent: 0,
              opacity: 1,
              scale: 1,
              duration: 1,
              ease: 'power2.inOut',
            },
            '<'
          );
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      className="bg-transparent border-b border-[#410217]/20 relative z-10"
    >
      {/* Chapter Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 md:pt-28 pb-8">
        <div className="velocity-item">
          <SectionHeader
            title={
              <>
                How Our 5-Stage{' '}
                <em className="italic text-[#8B5A0B] font-normal">Protection Pipeline Works.</em>
              </>
            }
            subtitle="From mapping what AI chatbots currently say about you to stopping coordinated rumor campaigns in milliseconds, every step is designed to be transparent and verifiable."
          />
        </div>
      </div>

      {/* CHAPTER 3: ISOLATED PIN-STAGE — 3D ORIGAMI CUBE / PRISM SECTION TURNOVER */}
      <div className="pin-stage relative w-full overflow-hidden border-y-2 border-[#410217]">
        <div
          ref={cubeViewportRef}
          className="cube-viewport relative w-full h-screen overflow-hidden flex flex-col justify-between py-6 sm:py-8 px-4 sm:px-8 max-w-7xl mx-auto"
          style={{ perspective: '1400px', transformStyle: 'preserve-3d' }}
        >
          {/* Top Docked Interactive Animated SVG 5-Stage Pipeline Diagram */}
          <div className="relative z-30 rounded-none bg-[#2B010F]/95 border-2 border-[#D5991C] p-4 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3 pb-2 border-b border-[#F2D69D]/20">
              <span className="text-xs sm:text-sm font-mono uppercase tracking-wider font-semibold text-[#FBF3E2]">
                Interactive Pipeline (Click Any Stage to Inspect)
              </span>
              <span className="text-xs font-mono text-[#D5991C]">
                Active Stage: {currentStep.title}
              </span>
            </div>

            <svg viewBox="0 0 960 110" className="w-full h-auto overflow-visible hidden md:block">
              {PROCESS_STEPS.map((step, idx) => {
                const x = 12 + idx * 192;
                const isSelected = idx === activeStepIndex;
                const isPassed = idx <= activeStepIndex;
                const words = step.title.split(' ');
                const mid = Math.ceil(words.length / 2);
                const line1 = words.slice(0, mid).join(' ');
                const line2 = words.slice(mid).join(' ');
                return (
                  <g
                    key={step.step}
                    onClick={() => setActiveStepIndex(idx)}
                    className="cursor-pointer"
                  >
                    {idx < PROCESS_STEPS.length - 1 && (
                      <>
                        <line
                          x1={x + 168}
                          y1="55"
                          x2={x + 192}
                          y2="55"
                          stroke={isPassed ? '#D5991C' : '#F2D69D'}
                          strokeOpacity={isPassed ? '0.9' : '0.25'}
                          strokeWidth="2.5"
                        />
                        <circle r="3.5" fill={isPassed ? '#00FF9D' : '#D5991C'}>
                          <animate
                            attributeName="cx"
                            from={x + 168}
                            to={x + 192}
                            dur="1.3s"
                            repeatCount="indefinite"
                          />
                          <animate attributeName="cy" values="55;55" dur="1.3s" repeatCount="indefinite" />
                        </circle>
                      </>
                    )}
                    <rect
                      x={x}
                      y="15"
                      width="168"
                      height="80"
                      rx="0"
                      fill={isSelected ? '#D5991C' : '#350213'}
                      fillOpacity={isSelected ? '1' : '0.9'}
                      stroke={isSelected ? '#FBF3E2' : '#D5991C'}
                      strokeOpacity={isSelected ? '1' : '0.45'}
                      strokeWidth={isSelected ? '2' : '1.5'}
                    />
                    <text
                      x={x + 84}
                      y="40"
                      textAnchor="middle"
                      fill={isSelected ? '#130108' : '#D5991C'}
                      fontSize="13"
                      fontWeight="700"
                    >
                      {idx + 1}. {step.name}
                    </text>
                    <text
                      x={x + 84}
                      y="58"
                      textAnchor="middle"
                      fill={isSelected ? '#130108' : '#FBF3E2'}
                      fontSize="10"
                      fontWeight="500"
                    >
                      <tspan x={x + 84} dy="0">{line1}</tspan>
                      {line2 && <tspan x={x + 84} dy="13">{line2}</tspan>}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Mobile / Tablet Step Buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 md:hidden">
              {PROCESS_STEPS.map((step, idx) => {
                const isSelected = idx === activeStepIndex;
                return (
                  <button
                    key={step.step}
                    onClick={() => setActiveStepIndex(idx)}
                    className={`p-2.5 rounded-none text-left border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#D5991C] text-[#130108] border-[#FBF3E2] font-bold'
                        : 'bg-[#350213] text-[#FBF3E2] border-[#F2D69D]/20'
                    }`}
                  >
                    <div className="text-xs font-bold">
                      {idx + 1}. {step.name}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3D Origami Prism Faces for the 5 Pipeline Stages */}
          <div
            className="relative flex-1 my-4 w-full"
            style={{ perspective: '1400px', transformStyle: 'preserve-3d' }}
          >
            {PROCESS_STEPS.map((step, idx) => (
              <div
                key={step.step}
                className="cube-panel absolute inset-0 w-full h-full flex items-center justify-center"
                style={{
                  backfaceVisibility: 'hidden',
                  zIndex: activeStepIndex === idx ? 20 : 10 - idx,
                }}
              >
                <div className="relative w-full h-full rounded-none bg-[#2B010F]/95 border-2 border-[#D5991C] p-6 sm:p-10 flex flex-col justify-between shadow-[0_28px_80px_rgba(43,1,15,0.55)]">
                  {/* Sharp Corner Crosshair Ticks */}
                  <span className="absolute -top-2 -left-2 text-[#D5991C] font-mono text-sm leading-none select-none">+</span>
                  <span className="absolute -top-2 -right-2 text-[#D5991C] font-mono text-sm leading-none select-none">+</span>
                  <span className="absolute -bottom-2 -left-2 text-[#D5991C] font-mono text-sm leading-none select-none">+</span>
                  <span className="absolute -bottom-2 -right-2 text-[#D5991C] font-mono text-sm leading-none select-none">+</span>

                  {/* Top Prism Face Spine */}
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#F2D69D]/25 pb-4">
                    <div className="inline-flex items-center space-x-3 px-3 py-1 rounded-none bg-[#D5991C]/15 border border-[#D5991C] text-[#D5991C] text-xs font-mono uppercase tracking-wider font-semibold">
                      <span>Step {idx + 1} of 5</span>
                      <span>·</span>
                      <span>{step.name}</span>
                    </div>
                    <span className="text-xs font-mono uppercase tracking-widest text-[#F2D69D]/70">
                      3D PRISM TURNOVER // STAGE 0{idx + 1}
                    </span>
                  </div>

                  {/* Center Split Geometry */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center my-auto py-4">
                    <div className="lg:col-span-6 space-y-4">
                      <h3 className="font-serif text-3xl sm:text-4xl text-[#FBF3E2] leading-tight">
                        {step.title}
                      </h3>
                      <p className="text-sm sm:text-base text-[#FBF3E2]/90 leading-relaxed">
                        {step.description}
                      </p>
                    </div>

                    <div className="lg:col-span-6 lg:border-l lg:border-[#F2D69D]/25 lg:pl-8 space-y-5">
                      <div className="border-l-2 border-[#D5991C] pl-4">
                        <div className="text-xs font-mono uppercase tracking-wider font-semibold text-[#D5991C] mb-1.5">
                          What Happens Behind the Scenes
                        </div>
                        <p className="text-xs sm:text-sm text-[#FBF3E2]/85 leading-relaxed">
                          {step.technicalDetail}
                        </p>
                      </div>

                      <div className="border-t border-[#F2D69D]/20 pt-4 border-l-2 border-l-[#00FF9D] pl-4">
                        <div className="flex items-center space-x-1.5 text-xs font-mono uppercase tracking-wider font-semibold text-[#00FF9D] mb-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Example Outcome</span>
                        </div>
                        <p className="text-xs sm:text-sm text-[#FBF3E2]/90 leading-relaxed font-mono">
                          {step.sampleLog}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-[#F2D69D]/20 pt-3 flex items-center justify-between text-[11px] font-mono uppercase tracking-widest text-[#F2D69D]/70">
                    <span>SCROLL TO ROTATE PRISM HINGE</span>
                    <span>PIPELINE STAGE 0{idx + 1} / 05</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* OPEN ARCHITECTURAL DOSSIER LEDGER: THREAT & DEFENSE SCENARIOS IN ACTION */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        <div className="velocity-item flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b-2 border-[#410217]">
          <div>
            <h3 className="font-serif text-3xl sm:text-4xl text-[#410217]">
              Threat &amp; Defense Scenarios in Action
            </h3>
            <p className="text-sm sm:text-base text-[#410217]/80 mt-1">
              Select a scenario below to see how an attack unfolds and how our defense architecture neutralizes it in benchmark simulations.
            </p>
          </div>

          <div className="flex flex-wrap border-t border-l border-[#410217]">
            {CASE_STUDIES.map((cs, idx) => (
              <button
                key={cs.id}
                onClick={() => setActiveScenarioIndex(idx)}
                className={`px-4 py-2.5 rounded-none text-xs font-mono uppercase tracking-wider font-semibold border-r border-b border-[#410217] transition-all cursor-pointer ${
                  activeScenarioIndex === idx
                    ? 'bg-[#2B010F] text-[#D5991C]'
                    : 'bg-transparent text-[#410217] hover:bg-[#410217]/10'
                }`}
              >
                {cs.sector}
              </button>
            ))}
          </div>
        </div>

        {/* Open Sharp Architectural Split Ledger for Active Scenario */}
        <div className="grid grid-cols-1 lg:grid-cols-12 border-b-2 border-x border-[#410217] bg-[#2B010F]/95 text-[#FBF3E2] divide-y lg:divide-y-0 lg:divide-x divide-[#D5991C]/35">
          <div className="lg:col-span-7 p-6 sm:p-10 space-y-6">
            <div>
              <div className="text-xs font-mono uppercase tracking-widest font-semibold text-[#D5991C] mb-1">
                {activeScenario.clientType}
              </div>
              <h4 className="font-serif text-2xl sm:text-3xl text-[#FBF3E2] leading-snug">
                {activeScenario.headline}
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-[#F2D69D]/20">
              <div className="border-l-2 border-[#E63946] pl-4">
                <div className="flex items-center space-x-1.5 text-xs font-mono uppercase tracking-wider font-semibold text-[#FF8093] mb-2">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>The Attack Scenario</span>
                </div>
                <p className="text-xs sm:text-sm text-[#FBF3E2]/85 leading-relaxed">
                  {activeScenario.challenge}
                </p>
              </div>

              <div className="border-l-2 border-[#00FF9D] pl-4">
                <div className="flex items-center space-x-1.5 text-xs font-mono uppercase tracking-wider font-semibold text-[#00FF9D] mb-2">
                  <Shield className="w-3.5 h-3.5" />
                  <span>How the Shield Responds</span>
                </div>
                <p className="text-xs sm:text-sm text-[#FBF3E2]/85 leading-relaxed">
                  {activeScenario.intervention}
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 p-6 sm:p-10 flex flex-col justify-between">
            <div>
              <div className="text-xs font-mono uppercase tracking-wider font-semibold text-[#F2D69D] mb-4">
                Simulation Benchmark Outcomes
              </div>
              <div className="grid grid-cols-3 border-t border-l border-[#F2D69D]/25 mb-6">
                {activeScenario.outcomeMetrics.map((m, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 border-r border-b border-[#F2D69D]/25 text-center bg-[#1F010B]"
                  >
                    <div className="font-serif text-xl sm:text-2xl text-[#D5991C] font-bold">
                      {m.value}
                    </div>
                    <div className="text-[11px] text-[#FBF3E2]/75 mt-1 leading-tight">
                      {m.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-[#F2D69D]/20">
              <p className="font-serif italic text-sm text-[#FBF3E2]/90 leading-relaxed">
                &ldquo;{activeScenario.quote}&rdquo;
              </p>
              <div className="mt-2 text-xs text-[#D5991C] font-medium flex items-center space-x-1">
                <ArrowRight className="w-3 h-3" />
                <span>{activeScenario.quoteAuthor}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
