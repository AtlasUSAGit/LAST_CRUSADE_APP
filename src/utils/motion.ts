import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { TextPlugin } from 'gsap/TextPlugin';

gsap.registerPlugin(ScrollTrigger, SplitText, TextPlugin);

/** Media query used to gate all decorative motion. */
export const MOTION_OK = '(prefers-reduced-motion: no-preference)';

/** Height of the sticky site header, used to offset pinned sections. */
export const HEADER_OFFSET = 80;

export const EASE_OUT = 'expo.out';
export const EASE_IN_OUT = 'expo.inOut';

export { gsap, ScrollTrigger, SplitText };
