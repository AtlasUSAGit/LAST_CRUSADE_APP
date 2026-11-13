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

  const rootRef = useRef<HTMLElement>(null);
  const pipelineStageRef = useRef<HTMLDivElement>(null);
  const scenariosStackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      // 1. Pinned 5-Stage Pipeline — 1/3 + 1/3 + 1/3 Sequential Sticky Cascade
      const stage = pipelineStageRef.current;
      if (stage && window.innerWidth >= 1024) {
        const leftThirds = gsap.utils.toArray<HTMLElement>('.proc-left-third', stage);
        const centerThirds = gsap.utils.toArray<HTMLElement>('.proc-center-third', stage);
        const rightThirds = gsap.utils.toArray<HTMLElement>('.proc-right-third', stage);

        leftThirds.forEach((el, i) => {
          if (i > 0) gsap.set(el, { yPercent: 106 });
        });
        centerThirds.forEach((el, i) => {
          if (i > 0) gsap.set(el, { yPercent: 106 });
        });
        rightThirds.forEach((el, i) => {
          if (i > 0) gsap.set(el, { yPercent: 106 });
        });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: stage,
            start: 'top top',
            end: () => `+=${PROCESS_STEPS.length * 95}%`,
            pin: true,
            scrub: 0.85,
            anticipatePin: 1,
            onUpdate: (self) => {
              const idx = Math.min(
                PROCESS_STEPS.length - 1,
                Math.max(0, Math.round(self.progress * (PROCESS_STEPS.length - 1)))
              );
              setActiveStepIndex(idx);
            },
          },
        });

        for (let i = 1; i < PROCESS_STEPS.length; i++) {
          // 1st Third (Left 1/3) locks in
          tl.to(leftThirds[i], {
            yPercent: 0,
            duration: 1,
            ease: 'power2.inOut',
          });
          tl.to(
            leftThirds[i - 1],
            { scale: 0.96, opacity: 0.3, duration: 1, ease: 'power2.inOut' },
            '<'
          );

          // 2nd Third (Center 1/3) locks in ("<30%" stagger)
          tl.to(
            centerThirds[i],
            {
              yPercent: 0,
              duration: 1,
              ease: 'power2.inOut',
            },
            '<30%'
          );
          tl.to(
            centerThirds[i - 1],
            { scale: 0.96, opacity: 0.3, duration: 1, ease: 'power2.inOut' },
            '<'
          );

          // 3rd Third (Right 1/3) locks in ("<30%" stagger)
          tl.to(
            rightThirds[i],
            {
              yPercent: 0,
              duration: 1,
              ease: 'power2.inOut',
            },
            '<30%'
          );
          tl.to(
            rightThirds[i - 1],
            { scale: 0.96, opacity: 0.3, duration: 1, ease: 'power2.inOut' },
            '<'
          );
        }
      }

      // 2. Sticky 3-Thirds Scenario Rows — Staggered 1/3 Entry
      const scenContainer = scenariosStackRef.current;
      if (scenContainer) {
        const rows = gsap.utils.toArray<HTMLElement>('.scenario-thirds-row', scenContainer);
        rows.forEach((row, idx) => {
          const mid = row.querySelector<HTMLElement>('.scen-mid-third');
          const right = row.querySelector<HTMLElement>('.scen-right-third');

          ScrollTrigger.create({
            trigger: row,
            start: 'top 55%',
            end: 'bottom 55%',
            onEnter: () => setActiveScenarioIndex(idx),
            onEnterBack: () => setActiveScenarioIndex(idx),
          });

          if (idx > 0 && mid && right) {
            gsap.fromTo(
              [mid, right],
              { y: (i) => (i + 1) * 36 },
              {
                y: 0,
                ease: 'none',
                scrollTrigger: {
                  trigger: row,
                  start: 'top 85%',
                  end: 'top 25%',
                  scrub: true,
                },
              }
            );
          }
        });
      }
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      className="bg-transparent border-b border-[#410217]/20 relative z-10"
    >
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 md:pt-28 pb-6">
        <SectionHeader
          eyebrow="5-STAGE HEXAGONAL PIPELINE"
          title={
            <>
              How Our 5-Stage{' '}
              <em className="italic text-[#8B5A0B] font-normal">
                Protection Pipeline Works.
              </em>
            </>
          }
          subtitle="From mapping what AI chatbots currently say about you to stopping coordinated rumor campaigns in milliseconds, every step is designed to be transparent and verifiable."
        />
      </div>

      {/* PART 1: PINNED 5-STAGE HEXAGONAL PIPELINE + 3-THIRDS (1/3 + 1/3 + 1/3) PROGRESSIVE SHARD STACK */}
      <div
        ref={pipelineStageRef}
        className="relative w-full lg:h-screen overflow-hidden flex flex-col justify-between py-6 sm:py-8 border-y border-[#410217]/25"
      >
        {/* Isometric Triangular & Hexagonal Tessellation Background */}
        <svg
          className="pointer-events-none absolute inset-0 w-full h-full opacity-[0.13]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="proc-tri-hex-tess"
              width="120"
              height="104"
              patternUnits="userSpaceOnUse"
            >
              <polygon
                points="60,0 120,104 0,104"
                fill="none"
                stroke="#410217"
                strokeWidth="1"
              />
              <polygon
                points="30,18 90,18 110,52 90,86 30,86 10,52"
                fill="none"
                stroke="#8B5A0B"
                strokeWidth="0.9"
                strokeDasharray="3 3"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#proc-tri-hex-tess)" />
        </svg>

        <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col h-full justify-between">
          {/* Top Docked Interactive Animated SVG 5-Stage Hexagonal Pipeline */}
          <div
            className="bg-[#2B010F]/95 border-2 border-[#D5991C] p-4 sm:p-5 mb-5 shadow-xl"
            style={{
              clipPath:
                'polygon(20px 0%, 100% 0%, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0% 100%, 0% 20px)',
            }}
          >
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
                const hexPts = `${x + 16},15 ${x + 152},15 ${x + 168},55 ${x + 152},95 ${
                  x + 16
                },95 ${x},55`;

                return (
                  <g
                    key={step.step}
                    onClick={() => setActiveStepIndex(idx)}
                    className="cursor-pointer"
                  >
                    {idx < PROCESS_STEPS.length - 1 && (
                      <>
                        {/* Triangular Tessellation Connector */}
                        <polygon
                          points={`${x + 168},44 ${x + 192},55 ${x + 168},66`}
                          fill={isPassed ? '#D5991C' : '#F2D69D'}
                          fillOpacity={isPassed ? '0.45' : '0.15'}
                        />
                        <circle r="3.5" fill={isPassed ? '#00FF9D' : '#D5991C'}>
                          <animate
                            attributeName="cx"
                            from={x + 168}
                            to={x + 192}
                            dur="1.3s"
                            repeatCount="indefinite"
                          />
                          <animate
                            attributeName="cy"
                            values="55;55"
                            dur="1.3s"
                            repeatCount="indefinite"
                          />
                        </circle>
                      </>
                    )}
                    <polygon
                      points={hexPts}
                      fill={isSelected ? '#D5991C' : '#350213'}
                      fillOpacity={isSelected ? '1' : '0.92'}
                      stroke={isSelected ? '#FBF3E2' : '#D5991C'}
                      strokeOpacity={isSelected ? '1' : '0.55'}
                      strokeWidth={isSelected ? '2.2' : '1.5'}
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
                      <tspan x={x + 84} dy="0">
                        {line1}
                      </tspan>
                      {line2 && (
                        <tspan x={x + 84} dy="13">
                          {line2}
                        </tspan>
                      )}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* DESKTOP 3-THIRDS (1/3 + 1/3 + 1/3) PROGRESSIVE STACKING STAGE */}
          <div className="hidden lg:grid lg:grid-cols-12 gap-5 flex-1 items-stretch relative min-h-[380px]">
            {/* LEFT 1/3 COLUMN (4 COLS): Stage Overview & Thesis Shards */}
            <div className="lg:col-span-4 relative h-full">
              {PROCESS_STEPS.map((step, idx) => (
                <div
                  key={step.step}
                  style={{ zIndex: idx + 10, top: `${idx * 6}px` }}
                  className="proc-left-third absolute inset-x-0 bottom-0 bg-[#2B010F]/98 border-2 border-[#D5991C] p-6 sm:p-7 flex flex-col justify-between shadow-[0_-16px_45px_rgba(19,1,8,0.8)]"
                >
                  <svg
                    className="pointer-events-none absolute top-0 left-0 w-7 h-7"
                    viewBox="0 0 28 28"
                  >
                    <polygon points="0,0 28,0 0,28" fill="#D5991C" />
                  </svg>

                  <div>
                    <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#F2D69D]/20">
                      <div
                        className="inline-flex items-center space-x-2 px-3.5 py-1 bg-[#D5991C] text-[#130108] text-xs font-mono font-bold"
                        style={{
                          clipPath:
                            'polygon(8px 0%, calc(100% - 8px) 0%, 100% 50%, calc(100% - 8px) 100%, 8px 100%, 0% 50%)',
                        }}
                      >
                        <span>Step {idx + 1} of 5</span>
                        <span>·</span>
                        <span>{step.name}</span>
                      </div>
                      <span className="text-[10px] font-mono text-[#D5991C]">
                        1/3 LEFT SHARD
                      </span>
                    </div>

                    <h3 className="font-serif text-2xl sm:text-3xl text-[#FBF3E2] leading-snug mb-3">
                      {step.title}
                    </h3>
                    <p className="text-sm text-[#FBF3E2]/85 leading-relaxed">
                      {step.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#F2D69D]/15 flex items-center justify-between text-[10px] font-mono uppercase tracking-widest text-[#D5991C]/80">
                    <span>STAGE 0{idx + 1} OVERVIEW</span>
                    <span>TESSELLATION NODE</span>
                  </div>
                </div>
              ))}
            </div>

            {/* CENTER 1/3 COLUMN (4 COLS): Behind the Scenes Architecture Shards */}
            <div className="lg:col-span-4 relative h-full">
              {PROCESS_STEPS.map((step, idx) => (
                <div
                  key={step.step}
                  style={{ zIndex: idx + 10, top: `${idx * 6}px` }}
                  className="proc-center-third absolute inset-x-0 bottom-0 bg-[#1E000A]/98 border-2 border-[#D5991C]/80 p-6 sm:p-7 flex flex-col justify-between shadow-[0_-16px_45px_rgba(19,1,8,0.8)]"
                >
                  <div>
                    <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#F2D69D]/20">
                      <span className="text-xs font-mono uppercase tracking-wider font-bold text-[#D5991C]">
                        What Happens Behind the Scenes
                      </span>
                      <span className="text-[10px] font-mono text-[#F2D69D]/70">
                        1/3 CENTER SHARD
                      </span>
                    </div>

                    {/* Isometric Hex-Triangle Schematic Ornament */}
                    <svg viewBox="0 0 280 68" className="w-full h-14 mb-4">
                      <polygon
                        points="20,34 45,10 95,10 120,34 95,58 45,58"
                        fill="#2B010F"
                        stroke="#D5991C"
                        strokeWidth="1.4"
                      />
                      <text
                        x="70"
                        y="38"
                        textAnchor="middle"
                        fill="#D5991C"
                        fontSize="10"
                        fontFamily="monospace"
                        fontWeight="700"
                      >
                        0{idx + 1} // {step.name.toUpperCase()}
                      </text>
                      <polygon
                        points="135,54 160,14 185,54"
                        fill="#D5991C"
                        fillOpacity="0.25"
                        stroke="#D5991C"
                        strokeWidth="1.2"
                      />
                      <polygon
                        points="175,14 200,54 225,14"
                        fill="none"
                        stroke="#00FF9D"
                        strokeWidth="1.2"
                      />
                      <polygon
                        points="245,14 270,28 270,48 245,60 225,48 225,28"
                        fill="#2B010F"
                        stroke="#00A878"
                        strokeWidth="1.4"
                      />
                    </svg>

                    <p className="text-sm text-[#FBF3E2]/90 leading-relaxed">
                      {step.technicalDetail}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#F2D69D]/15 flex items-center justify-between text-[10px] font-mono uppercase tracking-widest text-[#D5991C]/80">
                    <span>ENGINE MECHANICS</span>
                    <span>VERIFIED PIPELINE</span>
                  </div>
                </div>
              ))}
            </div>

            {/* RIGHT 1/3 COLUMN (4 COLS): Example Outcome Telemetry Shards */}
            <div className="lg:col-span-4 relative h-full">
              {PROCESS_STEPS.map((step, idx) => (
                <div
                  key={step.step}
                  style={{ zIndex: idx + 10, top: `${idx * 6}px` }}
                  className="proc-right-third absolute inset-x-0 bottom-0 bg-[#140007]/98 border-2 border-[#00A878] p-6 sm:p-7 flex flex-col justify-between shadow-[0_-16px_45px_rgba(19,1,8,0.8)]"
                >
                  <svg
                    className="pointer-events-none absolute bottom-0 right-0 w-7 h-7"
                    viewBox="0 0 28 28"
                  >
                    <polygon points="28,28 0,28 28,0" fill="#00A878" />
                  </svg>

                  <div>
                    <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#00A878]/35">
                      <div className="flex items-center space-x-1.5 text-xs font-mono uppercase tracking-wider font-bold text-[#00FF9D]">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Example Outcome</span>
                      </div>
                      <span className="text-[10px] font-mono text-[#00FF9D]/80">
                        1/3 RIGHT SHARD
                      </span>
                    </div>

                    <p className="text-sm text-[#FBF3E2]/90 font-mono leading-relaxed bg-[#2B010F]/90 p-4 border border-[#00A878]/40">
                      {step.sampleLog}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#00A878]/30 flex items-center justify-between text-[10px] font-mono uppercase tracking-widest text-[#00FF9D]">
                    <span>TELEMETRY VERIFIED</span>
                    <span>STAGE 0{idx + 1} COMPLETE</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* MOBILE / TABLET FALLBACK */}
          <div className="lg:hidden grid grid-cols-1 gap-4">
            <div className="bg-[#2B010F]/95 border-2 border-[#D5991C] p-5">
              <div className="text-xs font-mono text-[#D5991C]">
                Step {activeStepIndex + 1} of 5 · {currentStep.name}
              </div>
              <h3 className="font-serif text-2xl text-[#FBF3E2] mt-1">{currentStep.title}</h3>
              <p className="text-sm text-[#FBF3E2]/85 mt-2">{currentStep.description}</p>
              <p className="text-xs text-[#D5991C] mt-3">{currentStep.technicalDetail}</p>
              <p className="text-xs text-[#00FF9D] mt-2 font-mono">{currentStep.sampleLog}</p>
            </div>
          </div>
        </div>
      </div>

      {/* PART 2: THREAT & DEFENSE SCENARIOS IN ACTION — STICKY 3-THIRDS (1/3 + 1/3 + 1/3) SHARDS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pb-8 border-b border-[#410217]/25 mb-12">
          <div>
            <div className="text-xs font-mono uppercase tracking-[0.2em] text-[#8B5A0B] font-bold mb-2">
              3-THIRDS SCENARIO TESSELLATION
            </div>
            <h3 className="font-serif text-3xl sm:text-4xl text-[#410217]">
              Threat &amp; Defense Scenarios in Action
            </h3>
            <p className="text-sm sm:text-base text-[#410217]/80 mt-1">
              Select a scenario below or scroll to see each attack, shield response, and benchmark outcome stack in geometric thirds.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {CASE_STUDIES.map((cs, idx) => (
              <button
                key={cs.id}
                onClick={() => setActiveScenarioIndex(idx)}
                className={`px-4 py-2 text-xs font-mono uppercase tracking-wider font-bold border transition-all cursor-pointer ${
                  activeScenarioIndex === idx
                    ? 'bg-[#D5991C] text-[#130108] border-[#410217]'
                    : 'bg-[#2B010F] text-[#FBF3E2]/85 border-[#D5991C]/40 hover:border-[#D5991C]'
                }`}
                style={{
                  clipPath:
                    'polygon(10px 0%, calc(100% - 10px) 0%, 100% 50%, calc(100% - 10px) 100%, 10px 100%, 0% 50%)',
                }}
              >
                {cs.sector}
              </button>
            ))}
          </div>
        </div>

        {/* Sticky 3-Thirds Rows for All Scenarios */}
        <div ref={scenariosStackRef} className="space-y-14 pb-8">
          {CASE_STUDIES.map((scenario, idx) => {
            const stickyTop = 96 + idx * 20;
            return (
              <div
                key={scenario.id}
                style={{ top: `${stickyTop}px`, zIndex: idx + 10 }}
                className="scenario-thirds-row sticky grid grid-cols-1 lg:grid-cols-3 gap-5 items-stretch"
              >
                {/* LEFT 1/3 SHARD: Client Type, Headline & The Attack Scenario */}
                <div
                  className="bg-[#2B010F]/98 border-2 border-[#E63946]/80 p-6 flex flex-col justify-between shadow-2xl"
                  style={{
                    clipPath:
                      'polygon(20px 0%, 100% 0%, 100% 100%, 0% 100%, 0% 20px)',
                  }}
                >
                  <div>
                    <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#F2D69D]/20">
                      <span className="text-xs font-mono font-bold text-[#D5991C]">
                        {scenario.clientType}
                      </span>
                      <span className="text-[10px] font-mono text-[#FF8093]">
                        1/3 ATTACK SHARD
                      </span>
                    </div>
                    <h4 className="font-serif text-xl sm:text-2xl text-[#FBF3E2] leading-snug mb-4">
                      {scenario.headline}
                    </h4>

                    <div className="pt-3 border-t border-[#E63946]/30">
                      <div className="flex items-center space-x-1.5 text-xs font-semibold text-[#FF8093] mb-1.5">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>The Attack Scenario</span>
                      </div>
                      <p className="text-xs sm:text-sm text-[#FBF3E2]/85 leading-relaxed">
                        {scenario.challenge}
                      </p>
                    </div>
                  </div>
                </div>

                {/* CENTER 1/3 SHARD: How the Shield Responds */}
                <div
                  className="scen-mid-third bg-[#1F010B]/98 border-2 border-[#00A878] p-6 flex flex-col justify-between shadow-2xl"
                  style={{
                    clipPath:
                      'polygon(14px 0%, calc(100% - 14px) 0%, 100% 14px, 100% calc(100% - 14px), calc(100% - 14px) 100%, 14px 100%, 0% calc(100% - 14px), 0% 14px)',
                  }}
                >
                  <div>
                    <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#00A878]/30">
                      <div className="flex items-center space-x-1.5 text-xs font-mono uppercase tracking-wider font-bold text-[#00FF9D]">
                        <Shield className="w-4 h-4" />
                        <span>How the Shield Responds</span>
                      </div>
                      <span className="text-[10px] font-mono text-[#00FF9D]/80">
                        1/3 DEFENSE SHARD
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-[#FBF3E2]/90 leading-relaxed">
                      {scenario.intervention}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-[#00A878]/25 flex items-center justify-between text-[10px] font-mono uppercase tracking-widest text-[#00FF9D]">
                    <span>SECTOR: {scenario.sector.toUpperCase()}</span>
                    <span>SHIELD VERIFIED</span>
                  </div>
                </div>

                {/* RIGHT 1/3 SHARD: Simulation Benchmark Outcomes in Hexagonal Cells + Quote */}
                <div
                  className="scen-right-third bg-[#2B010F]/98 border-2 border-[#D5991C] p-6 flex flex-col justify-between shadow-2xl"
                  style={{
                    clipPath:
                      'polygon(0% 0%, calc(100% - 20px) 0%, 100% 20px, 100% 100%, 0% 100%)',
                  }}
                >
                  <div>
                    <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#F2D69D]/20">
                      <span className="text-xs font-mono uppercase tracking-wider font-semibold text-[#F2D69D]">
                        Simulation Benchmark Outcomes
                      </span>
                      <span className="text-[10px] font-mono text-[#D5991C]">
                        1/3 METRICS SHARD
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 mb-4">
                      {scenario.outcomeMetrics.map((m, mIdx) => (
                        <div
                          key={mIdx}
                          className="p-2.5 bg-[#190008] border border-[#D5991C]/45 text-center"
                          style={{
                            clipPath:
                              'polygon(8px 0%, 100% 0%, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0% 100%, 0% 8px)',
                          }}
                        >
                          <div className="font-serif text-lg sm:text-xl text-[#D5991C] font-bold">
                            {m.value}
                          </div>
                          <div className="text-[10px] text-[#FBF3E2]/75 mt-0.5 leading-tight">
                            {m.label}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#F2D69D]/15">
                    <p className="font-serif italic text-xs sm:text-sm text-[#FBF3E2]/90 leading-relaxed">
                      &ldquo;{scenario.quote}&rdquo;
                    </p>
                    <div className="mt-1.5 text-xs text-[#D5991C] font-medium flex items-center space-x-1">
                      <ArrowRight className="w-3 h-3" />
                      <span>{scenario.quoteAuthor}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
