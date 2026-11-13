import React, { useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PROCESS_STEPS, CASE_STUDIES } from '../data/geoData';
import { SectionHeader } from './home/SectionHeader';
import { Shield, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export const ProcessSection: React.FC = () => {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [activeScenarioIndex, setActiveScenarioIndex] = useState(0);
  const currentStep = PROCESS_STEPS[activeStepIndex];
  const activeScenario = CASE_STUDIES[activeScenarioIndex] || CASE_STUDIES[0];

  const rootRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = panelRef.current;
    if (!el) return;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    gsap.fromTo(
      el,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' }
    );
  }, [activeStepIndex]);

  return (
    <section
      ref={rootRef}
      className="py-20 md:py-28 bg-transparent border-b border-[#410217]/15 relative z-10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title={
            <>
              How Our 5-Stage{' '}
              <em className="italic text-[#8B5A0B] font-normal">Protection Pipeline Works.</em>
            </>
          }
          subtitle="From mapping what AI chatbots currently say about you to stopping coordinated rumor campaigns in milliseconds, every step is designed to be transparent and verifiable."
        />

        {/* Interactive Animated SVG 5-Stage Pipeline Diagram */}
        <div className="mb-8 rounded-2xl bg-[#2B010F]/90 border border-[#F2D69D]/25 p-5 sm:p-7 backdrop-blur-xs">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
            <span className="text-sm font-semibold text-[#FBF3E2]">
              Interactive Pipeline (Click Any Stage to Inspect)
            </span>
            <span className="text-xs text-[#D5991C]">
              Active Stage: {currentStep.title}
            </span>
          </div>

          <svg viewBox="0 0 960 110" className="w-full h-auto overflow-visible mb-4 hidden md:block">
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
                    rx="12"
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
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 md:hidden mb-4">
            {PROCESS_STEPS.map((step, idx) => {
              const isSelected = idx === activeStepIndex;
              return (
                <button
                  key={step.step}
                  onClick={() => setActiveStepIndex(idx)}
                  className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
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

          {/* Active Stage Explanation Card */}
          <div
            ref={panelRef}
            key={currentStep.step}
            className="rounded-xl bg-[#410217]/90 border border-[#D5991C]/40 p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center backdrop-blur-xs"
          >
            <div className="lg:col-span-7 space-y-3">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#D5991C]/15 text-[#D5991C] text-xs font-semibold">
                <span>Step {activeStepIndex + 1} of 5</span>
                <span>·</span>
                <span>{currentStep.name}</span>
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl text-[#FBF3E2]">
                {currentStep.title}
              </h3>
              <p className="text-sm sm:text-base text-[#FBF3E2]/85 leading-relaxed">
                {currentStep.description}
              </p>
            </div>

            <div className="lg:col-span-5 space-y-3">
              <div className="p-4 rounded-xl bg-[#2B010F] border border-[#F2D69D]/20">
                <div className="text-xs font-semibold text-[#D5991C] mb-1">
                  What Happens Behind the Scenes
                </div>
                <p className="text-xs text-[#FBF3E2]/85 leading-relaxed">
                  {currentStep.technicalDetail}
                </p>
              </div>
              <div className="p-4 rounded-xl bg-[#1F010B] border border-[#00A878]/35">
                <div className="flex items-center space-x-1.5 text-xs font-semibold text-[#00FF9D] mb-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Example Outcome</span>
                </div>
                <p className="text-xs text-[#FBF3E2]/85 leading-relaxed">
                  {currentStep.sampleLog}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Real-World Threat & Defense Scenarios */}
        <div className="mt-14 rounded-2xl bg-[#2B010F]/90 border border-[#F2D69D]/30 p-6 sm:p-8 shadow-xl backdrop-blur-xs">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-[#F2D69D]/20">
            <div>
              <h3 className="font-serif text-2xl sm:text-3xl text-[#FBF3E2]">
                Threat &amp; Defense Scenarios in Action
              </h3>
              <p className="text-sm text-[#FBF3E2]/75 mt-1">
                Select a scenario below to see how an attack unfolds and how our defense architecture neutralizes it in benchmark simulations.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {CASE_STUDIES.map((cs, idx) => (
                <button
                  key={cs.id}
                  onClick={() => setActiveScenarioIndex(idx)}
                  className={`px-3.5 py-2 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                    activeScenarioIndex === idx
                      ? 'bg-[#D5991C] text-[#130108] border-[#FBF3E2] shadow-xs'
                      : 'bg-[#410217] text-[#FBF3E2]/80 border-[#F2D69D]/25 hover:border-[#D5991C]/50'
                  }`}
                >
                  {cs.sector}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            <div className="lg:col-span-7 space-y-4">
              <div className="text-xs font-semibold text-[#D5991C]">
                {activeScenario.clientType}
              </div>
              <h4 className="font-serif text-2xl text-[#FBF3E2] leading-snug">
                {activeScenario.headline}
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-[#410217]/80 border border-[#E63946]/30">
                  <div className="flex items-center space-x-1.5 text-xs font-semibold text-[#FF8093] mb-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>The Attack Scenario</span>
                  </div>
                  <p className="text-xs text-[#FBF3E2]/85 leading-relaxed">
                    {activeScenario.challenge}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#410217]/80 border border-[#00A878]/35">
                  <div className="flex items-center space-x-1.5 text-xs font-semibold text-[#00FF9D] mb-1.5">
                    <Shield className="w-3.5 h-3.5" />
                    <span>How the Shield Responds</span>
                  </div>
                  <p className="text-xs text-[#FBF3E2]/85 leading-relaxed">
                    {activeScenario.intervention}
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 flex flex-col justify-between p-5 rounded-xl bg-[#410217]/85 border border-[#F2D69D]/20">
              <div>
                <div className="text-xs font-semibold text-[#F2D69D] mb-3">
                  Simulation Benchmark Outcomes
                </div>
                <div className="grid grid-cols-3 gap-3 mb-5">
                  {activeScenario.outcomeMetrics.map((m, idx) => (
                    <div key={idx} className="p-3 rounded-lg bg-[#2B010F] border border-[#F2D69D]/15 text-center">
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

              <div className="pt-4 border-t border-[#F2D69D]/15">
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
      </div>
    </section>
  );
};
