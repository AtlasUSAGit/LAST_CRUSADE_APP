import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface SectionHeaderProps {
  index?: string;
  label?: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  rightSlot?: React.ReactNode;
  className?: string;
  variant?: 'split' | 'stacked';
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  rightSlot,
  className = '',
  variant = 'split',
}) => {
  const rootRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      const rule = el.querySelector<HTMLElement>('[data-sh-rule]');
      const accent = el.querySelector<HTMLElement>('[data-sh-accent]');
      const targets = el.querySelectorAll<HTMLElement>('[data-sh-reveal]');

      if (rule) {
        gsap.fromTo(
          rule,
          { scaleX: 0, transformOrigin: 'left center' },
          {
            scaleX: 1,
            duration: 1.0,
            ease: 'expo.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 88%',
              once: true,
            },
          }
        );
      }

      if (accent) {
        gsap.fromTo(
          accent,
          { scaleX: 0, transformOrigin: 'left center' },
          {
            scaleX: 1,
            duration: 0.8,
            delay: 0.15,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 88%',
              once: true,
            },
          }
        );
      }

      if (targets.length) {
        gsap.fromTo(
          targets,
          { y: 18, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.75,
            stagger: 0.08,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 86%',
              once: true,
            },
          }
        );
      }
    }, el);

    return () => ctx.revert();
  }, []);

  if (variant === 'stacked') {
    return (
      <div ref={rootRef} className={`mb-12 md:mb-16 ${className}`}>
        <div
          data-sh-rule
          className="h-px w-full bg-gradient-to-r from-[#D5991C]/60 via-[#F2D69D]/30 to-transparent mb-8"
        />
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="max-w-3xl">
            <div
              data-sh-accent
              className="w-12 h-1 bg-gradient-to-r from-[#D5991C] to-[#F2D69D] rounded-full mb-5"
            />
            <h2
              data-sh-reveal
              className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#FBF3E2] font-normal tracking-tight leading-[1.1]"
            >
              {title}
            </h2>
            {subtitle && (
              <p
                data-sh-reveal
                className="text-base sm:text-lg text-[#FBF3E2]/80 font-sans leading-relaxed mt-4"
              >
                {subtitle}
              </p>
            )}
          </div>
          {rightSlot && (
            <div data-sh-reveal className="shrink-0">
              {rightSlot}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div ref={rootRef} className={`mb-12 md:mb-16 ${className}`}>
      <div
        data-sh-rule
        className="h-px w-full bg-gradient-to-r from-[#D5991C]/60 via-[#F2D69D]/30 to-transparent mb-8 md:mb-10"
      />
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="max-w-3xl">
          <div
            data-sh-accent
            className="w-12 h-1 bg-gradient-to-r from-[#D5991C] to-[#F2D69D] rounded-full mb-5"
          />
          <h2
            data-sh-reveal
            className="font-serif text-3xl sm:text-4xl lg:text-[2.75rem] text-[#FBF3E2] font-normal tracking-tight leading-[1.08]"
          >
            {title}
          </h2>
          {subtitle && (
            <p
              data-sh-reveal
              className="text-base sm:text-lg text-[#FBF3E2]/80 font-sans leading-relaxed mt-4 max-w-2xl"
            >
              {subtitle}
            </p>
          )}
        </div>
        {rightSlot && (
          <div data-sh-reveal className="shrink-0">
            {rightSlot}
          </div>
        )}
      </div>
    </div>
  );
};
