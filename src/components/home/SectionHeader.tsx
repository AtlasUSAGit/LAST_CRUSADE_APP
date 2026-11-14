import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface SectionHeaderProps {
  index?: string;
  label?: string;
  eyebrow?: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  rightSlot?: React.ReactNode;
  className?: string;
  variant?: 'split' | 'stacked';
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  eyebrow,
  label,
  title,
  subtitle,
  rightSlot,
  className = '',
  variant = 'split',
}) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const badgeText = eyebrow || label;

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
          { opacity: 0, x: -12 },
          {
            opacity: 1,
            x: 0,
            duration: 0.7,
            delay: 0.1,
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

  const renderGeometricCrest = () =>
    badgeText ? (
      <div data-sh-accent className="flex items-center gap-3 mb-5">
        <span
          className="px-3 py-1 bg-[#2B010F] text-[#D5991C] text-[11px] font-mono uppercase tracking-[0.2em] font-bold"
          style={{
            clipPath:
              'polygon(8px 0%, calc(100% - 8px) 0%, 100% 50%, calc(100% - 8px) 100%, 8px 100%, 0% 50%)',
          }}
        >
          {badgeText}
        </span>
      </div>
    ) : null;

  if (variant === 'stacked') {
    return (
      <div ref={rootRef} className={`mb-12 md:mb-16 ${className}`}>
        <div
          data-sh-rule
          className="h-px w-full bg-gradient-to-r from-[#8B5A0B]/60 via-[#410217]/25 to-transparent mb-8"
        />
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="max-w-3xl">
            {renderGeometricCrest()}
            <h2
              data-sh-reveal
              className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#410217] font-normal tracking-tight leading-[1.1]"
            >
              {title}
            </h2>
            {subtitle && (
              <p
                data-sh-reveal
                className="text-base sm:text-lg text-[#410217]/80 font-sans leading-relaxed mt-4"
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
        className="h-px w-full bg-gradient-to-r from-[#8B5A0B]/60 via-[#410217]/25 to-transparent mb-8 md:mb-10"
      />
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="max-w-3xl">
          {renderGeometricCrest()}
          <h2
            data-sh-reveal
            className="font-serif text-3xl sm:text-4xl lg:text-[2.75rem] text-[#410217] font-normal tracking-tight leading-[1.08]"
          >
            {title}
          </h2>
          {subtitle && (
            <p
              data-sh-reveal
              className="text-base sm:text-lg text-[#410217]/80 font-sans leading-relaxed mt-4 max-w-2xl"
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

export default SectionHeader;
