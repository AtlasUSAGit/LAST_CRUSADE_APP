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

  const renderGeometricCrest = () => (
    <div data-sh-accent className="flex items-center gap-3 mb-5">
      {/* Hexagonal & Triangular Tessellation Ornament */}
      <svg width="84" height="22" viewBox="0 0 84 22" className="shrink-0">
        {/* Hexagon 1 */}
        <polygon
          points="11,1 20,6 20,16 11,21 2,16 2,6"
          fill="#2B010F"
          stroke="#D5991C"
          strokeWidth="1.5"
        />
        <polygon
          points="11,5 16,8 16,14 11,17 6,14 6,8"
          fill="#D5991C"
        />
        {/* Upward Triangle */}
        <polygon
          points="25,19 33,3 41,19"
          fill="none"
          stroke="#410217"
          strokeWidth="1.4"
        />
        {/* Inverted Interlocking Triangle */}
        <polygon
          points="37,3 45,19 53,3"
          fill="#D5991C"
          fillOpacity="0.35"
          stroke="#8B5A0B"
          strokeWidth="1.4"
        />
        {/* Hexagon 2 */}
        <polygon
          points="64,3 71,7 71,15 64,19 57,15 57,7"
          fill="none"
          stroke="#410217"
          strokeWidth="1.3"
        />
        <line x1="74" y1="11" x2="84" y2="11" stroke="#8B5A0B" strokeWidth="1.5" />
      </svg>
      {badgeText && (
        <span
          className="px-3 py-1 bg-[#2B010F] text-[#D5991C] text-[11px] font-mono uppercase tracking-[0.2em] font-bold"
          style={{
            clipPath:
              'polygon(8px 0%, calc(100% - 8px) 0%, 100% 50%, calc(100% - 8px) 100%, 8px 100%, 0% 50%)',
          }}
        >
          {badgeText}
        </span>
      )}
    </div>
  );

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
