import React, { useLayoutEffect, useRef } from 'react';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import Globe from './Globe';
import { NavigationPage } from '../types';
import { gsap, SplitText, MOTION_OK, EASE_OUT, EASE_IN_OUT } from '../utils/motion';

interface HeroProps {
  onOpenAudit: () => void;
  onOpenIncident: () => void;
  onNavigate?: (page: NavigationPage) => void;
}

const PETRA_GLOBE_DOTS_CONFIG = { color: '#F2D69D', size: 4, density: 8, allDots: false };

const FIGURES = [
  { value: 42.8, decimals: 1, prefix: '', suffix: 'M+', label: 'AI citations monitored', note: '¹' },
  { value: 14289, decimals: 0, prefix: '', suffix: '', label: 'Poisoned RAG sources neutralized', note: '²' },
  { value: 98.4, decimals: 1, prefix: '', suffix: '%', label: 'Hallucinated claim suppression', note: '³' },
  { value: 4.2, decimals: 1, prefix: '< ', suffix: 'm', label: 'Mean time to countermeasure', note: '⁴' }
];

const formatFigure = (n: number, decimals: number) =>
  decimals > 0 ? n.toFixed(decimals) : Math.round(n).toLocaleString('en-US');

export const Hero: React.FC<HeroProps> = ({ onOpenAudit, onNavigate }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const globeRef = useRef<HTMLDivElement>(null);
  const figuresRef = useRef<HTMLDivElement>(null);

  const directAccess: { page: NavigationPage; title: string; detail: string }[] = [
    { page: 'rea', title: 'REA Studio', detail: 'Reverse-engineering workbench' },
    { page: 'research', title: 'Research Corpus', detail: 'Volumes I, II, III · Whitepapers & Labs' },
    { page: 'counter-geo-ops', title: 'Strategy Library', detail: 'Offensive GEO & countermeasures' },
    { page: 'pitch-deck', title: 'Pitch Deck', detail: 'Last Crusade & Petra Labs proposal' }
  ];

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const mm = gsap.matchMedia();

    mm.add(MOTION_OK, () => {
      // Intro sequence on load
      const intro = gsap.timeline({ defaults: { ease: EASE_OUT } });

      const split = SplitText.create(titleRef.current, {
        type: 'lines',
        linesClass: 'split-line',
        autoSplit: true,
        onSplit: (self) => gsap.from(self.lines, { y: 24, autoAlpha: 0, duration: 1.2, ease: EASE_OUT, stagger: 0.1, delay: 0.1 })
      });

      intro.from('[data-hero-fade]', { autoAlpha: 0, y: 24, duration: 1.1, stagger: 0.1 }, 0.4);
      intro.from(globeRef.current, { autoAlpha: 0, scale: 0.86, duration: 2, ease: 'power3.out' }, 0.2);

      // Globe drifts upward as the hero scrolls away
      gsap.to(globeRef.current, {
        yPercent: -18,
        ease: 'none',
        scrollTrigger: { trigger: section, start: 'top top', end: 'bottom top', scrub: true }
      });

      // Index rows and figures
      gsap.from('[data-hero-index]', {
        autoAlpha: 0,
        y: 30,
        duration: 1,
        stagger: 0.1,
        ease: EASE_OUT,
        scrollTrigger: { trigger: '[data-hero-index-wrap]', start: 'top 90%', once: true }
      });

      const figureEls = figuresRef.current?.querySelectorAll<HTMLElement>('[data-count]') ?? [];
      figureEls.forEach((el) => {
        const target = Number(el.dataset.count);
        const decimals = Number(el.dataset.decimals);
        const counter = { val: 0 };
        el.textContent = formatFigure(0, decimals);
        gsap.to(counter, {
          val: target,
          duration: 2.2,
          ease: 'power3.out',
          scrollTrigger: { trigger: figuresRef.current, start: 'top 88%', once: true },
          onUpdate: () => {
            el.textContent = formatFigure(counter.val, decimals);
          }
        });
      });

      return () => split.revert();
    });

    return () => mm.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative overflow-visible bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Headline + globe */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center pt-8 md:pt-12">
          <div className="lg:col-span-6">
            <h1
              ref={titleRef}
              className="font-display text-[clamp(2.75rem,6.2vw,5.6rem)] leading-[1.14] text-[#410217]"
            >
              Defending America in the era of the <em className="text-[#8B5A0B]">generative engine.</em>
            </h1>

            <p
              data-hero-fade
              className="mt-10 max-w-xl border-l border-[#410217]/25 pl-5 text-base sm:text-[17px] leading-relaxed text-[#410217]/75"
            >
              Our mission is to detect and counter GEO abuse by foreign adversaries looking to politically, culturally, and financially influence the United States, as well counter the threat of domestic and international financial interests looking to manipulate markets through the use of GEO within agentic trading.
            </p>

            <div data-hero-fade className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
              <button
                onClick={onOpenAudit}
                className="group inline-flex items-center gap-4 bg-[#410217] hover:bg-[#2B0110] text-[#FBF3E2] pl-7 pr-5 py-4 text-[13px] font-semibold tracking-wide transition-colors cursor-pointer"
              >
                <span>Request a GEO audit</span>
                <span className="w-8 h-8 border border-[#FBF3E2]/25 flex items-center justify-center overflow-hidden">
                  <ArrowRight className="w-4 h-4 text-[#D5991C] transition-transform duration-500 group-hover:translate-x-1" />
                </span>
              </button>

              <a href="#problem" className="link-underline text-[13px] font-semibold text-[#410217]">
                See how GEO attacks work
              </a>
            </div>
          </div>

          <div className="lg:col-span-6 flex items-center justify-center relative">
            <div ref={globeRef} className="w-full max-w-[560px] aspect-square relative flex items-center justify-center">
              <Globe
                speed={1.2}
                smoothing={8}
                dots={PETRA_GLOBE_DOTS_CONFIG}
                fill="dots"
                fillColor="#F2D69D"
                scale={9.5}
                stopOnHover={false}
                direction="left"
                oceanColor="#340112"
                outlineColor="#D5991C"
                showOutline={true}
                graticuleColor="rgba(242, 214, 157, 0.15)"
                showGrid={true}
                outlineWidth={1}
                arcColor="#D5991C"
                pulseColor="#FBF3E2"
              />
            </div>
          </div>
        </div>

        {/* Index of tools */}
        {onNavigate && (
          <div data-hero-index-wrap className="mt-16 md:mt-20">
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#410217]/50 mb-3">Index</div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border-t border-[#410217]/20">
              {directAccess.map((item, i) => (
                <button
                  key={item.page}
                  data-hero-index
                  onClick={() => onNavigate(item.page)}
                  className={`group text-left py-6 px-4 first:pl-0 border-b lg:border-b-0 border-[#410217]/15 ${
                    i > 0 ? 'lg:border-l' : ''
                  } ${i % 2 === 1 ? 'md:border-l lg:border-l' : ''} cursor-pointer`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className="font-mono text-[11px] text-[#8B5A0B]">0{i + 1}</span>
                      <div className="font-serif text-2xl text-[#410217] mt-1 group-hover:italic transition-all">
                        {item.title}
                      </div>
                      <div className="text-[13px] text-[#410217]/55 mt-1">{item.detail}</div>
                    </div>
                    <ArrowUpRight className="w-5 h-5 text-[#410217]/40 transition-all duration-500 group-hover:text-[#410217] group-hover:-translate-y-1 group-hover:translate-x-1" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Figures */}
        <div ref={figuresRef} className="mt-6 md:mt-10 pb-16 md:pb-24">
          <div className="grid grid-cols-2 lg:grid-cols-4 border-t border-[#410217]/20">
            {FIGURES.map((f, i) => (
              <div
                key={f.label}
                className={`pt-6 pb-2 pr-4 ${i % 2 === 1 ? 'pl-4 border-l' : ''} ${i >= 2 ? 'lg:pl-4 lg:border-l' : ''} ${
                  i === 2 ? 'border-t lg:border-t-0 mt-6 lg:mt-0' : ''
                } ${i === 3 ? 'border-t lg:border-t-0 mt-6 lg:mt-0' : ''} border-[#410217]/15`}
              >
                <div className="font-display text-[clamp(2.6rem,4.6vw,4.25rem)] text-[#410217] tabular-nums">
                  {f.prefix}
                  <span data-count={f.value} data-decimals={f.decimals}>
                    {formatFigure(f.value, f.decimals)}
                  </span>
                  {f.suffix}
                </div>
                <div className="mt-3 text-[13px] text-[#410217]/60 leading-snug">
                  {f.label}
                  <sup className="ml-0.5 text-[#8B5A0B]">{f.note}</sup>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-6 font-mono text-[10px] text-[#410217]/40 leading-relaxed max-w-3xl">
            ¹–⁴ Trailing 12-month figures across monitored engines, CounterGEO-Bench (N = 250k) and client engagements. See Research Vol. III for methodology.
          </p>
        </div>
      </div>
    </section>
  );
};
