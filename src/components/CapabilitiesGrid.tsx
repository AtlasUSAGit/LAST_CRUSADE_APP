import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CAPABILITIES_MATRIX } from '../data/geoData';
import { SectionHeader } from './home/SectionHeader';
import { CheckCircle2, Shield } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export const CapabilitiesGrid: React.FC = () => {
  const rootRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      const cells = el.querySelectorAll<HTMLElement>('[data-cap-cell]');
      gsap.fromTo(
        cells,
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.65,
          stagger: 0.08,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 80%',
            once: true,
          },
        }
      );
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      className="py-20 md:py-28 bg-[#410217] border-b border-[#F2D69D]/30"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title={
            <>
              Core Defense Modules{' '}
              <em className="italic text-[#D5991C] font-normal">Built for Real-World AI.</em>
            </>
          }
          subtitle="Six modular protections that work together to keep AI search answers accurate, protect financial algorithms from fake news, and secure autonomous software agents."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CAPABILITIES_MATRIX.map((cap) => (
            <div
              key={cap.id}
              data-cap-cell
              className="group rounded-2xl bg-[#2B010F]/80 hover:bg-[#350213] border border-[#F2D69D]/25 hover:border-[#D5991C]/60 p-7 flex flex-col justify-between transition-all shadow-lg"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#D5991C]/15 text-[#D5991C] border border-[#D5991C]/35">
                    {cap.category}
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-[#410217] border border-[#00A878]/40 flex items-center justify-center text-[#00FF9D]">
                    <Shield className="w-4 h-4" />
                  </div>
                </div>

                <h3 className="font-serif text-2xl text-[#FBF3E2] group-hover:text-[#D5991C] transition-colors leading-snug mb-3">
                  {cap.title}
                </h3>

                <p className="text-sm text-[#FBF3E2]/80 font-sans leading-relaxed mb-6">
                  {cap.description}
                </p>
              </div>

              <div className="pt-4 border-t border-[#F2D69D]/15 flex items-center justify-between text-xs">
                <span className="text-[#F2D69D]/75 font-medium">Key Benchmark</span>
                <span className="inline-flex items-center space-x-1.5 font-semibold text-[#00FF9D]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#00A878]" />
                  <span>{cap.impactMetric}</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
