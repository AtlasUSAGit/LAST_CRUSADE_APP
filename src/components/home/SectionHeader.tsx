import React, { useLayoutEffect, useRef } from 'react';
import { gsap, SplitText, MOTION_OK, EASE_OUT, EASE_IN_OUT } from '../../utils/motion';

interface SectionHeaderProps {
  index?: string;
  sectionIndex?: string;
  label?: string;
  kicker?: string;
  title: React.ReactNode;
  italicWord?: string;
  lede?: React.ReactNode;
  description?: React.ReactNode;
  tone?: 'light' | 'dark';
  /** Optional element rendered in the right margin of the label column (e.g. filters). */
  aside?: React.ReactNode;
  className?: string;
}

/**
 * Left-aligned editorial section opener: section number and label sit in a
 * narrow margin column, the headline runs across the remaining nine columns.
 */
export const SectionHeader: React.FC<SectionHeaderProps> = ({
  index,
  sectionIndex,
  label,
  kicker,
  title,
  italicWord,
  lede,
  description,
  tone = 'light',
  aside,
  className = ''
}) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const ruleRef = useRef<HTMLDivElement>(null);

  const isDark = tone === 'dark';
  const rawIndex = index || sectionIndex || '01';
  const cleanIndex = rawIndex.startsWith('§') ? rawIndex : `§ ${rawIndex}`;
  const displayLabel = label || kicker || '';
  const displayLede = lede || description;

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const mm = gsap.matchMedia();

    mm.add(MOTION_OK, () => {
      const trigger = { trigger: root, start: 'top 82%', once: true };

      gsap.from(ruleRef.current, { scaleX: 0, duration: 1.4, ease: EASE_IN_OUT, scrollTrigger: trigger });
      gsap.from(root.querySelectorAll('[data-sh-fade]'), {
        y: 18,
        autoAlpha: 0,
        duration: 1,
        ease: EASE_OUT,
        stagger: 0.08,
        delay: 0.25,
        scrollTrigger: trigger
      });

      // SplitText lines reveal without overflow:hidden mask clipping
      const split = SplitText.create(titleRef.current, {
        type: 'lines',
        linesClass: 'split-line',
        autoSplit: true,
        onSplit: (self) =>
          gsap.from(self.lines, {
            y: 20,
            autoAlpha: 0,
            duration: 1.1,
            ease: EASE_OUT,
            stagger: 0.08,
            scrollTrigger: trigger
          })
      });

      return () => split.revert();
    });

    return () => mm.revert();
  }, []);

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <div
        ref={ruleRef}
        className={`rule-draw h-px w-full mb-8 md:mb-10 ${isDark ? 'bg-[#F2D69D]/30' : 'bg-[#410217]/20'}`}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10">
        <div className="lg:col-span-3 flex lg:flex-col items-baseline lg:items-start justify-between gap-4">
          <div data-sh-fade className="font-mono text-[11px] uppercase tracking-[0.22em] leading-relaxed">
            <span className={isDark ? 'text-[#D5991C]' : 'text-[#8B5A0B]'}>{cleanIndex}</span>
            {displayLabel && (
              <span className={`block mt-1 ${isDark ? 'text-[#FBF3E2]/60' : 'text-[#410217]/55'}`}>
                {displayLabel.replace(/^\/\/\s*/, '')}
              </span>
            )}
          </div>
          {aside && <div data-sh-fade>{aside}</div>}
        </div>

        <div className="lg:col-span-9">
          <h2
            ref={titleRef}
            className={`font-display text-[clamp(2.2rem,4.5vw,4.25rem)] leading-[1.16] ${isDark ? 'text-[#FBF3E2]' : 'text-[#410217]'}`}
          >
            {title}
          </h2>
          {displayLede && (
            <p
              data-sh-fade
              className={`mt-6 max-w-2xl text-base sm:text-lg leading-relaxed ${
                isDark ? 'text-[#FBF3E2]/70' : 'text-[#410217]/70'
              }`}
            >
              {displayLede}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
