import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { scrollToElement } from './scroll-target';

gsap.registerPlugin(ScrollTrigger);

let lenis: Lenis | null = null;
let ctx: gsap.Context | null = null;
let started = false;
let anchorBound = false;

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Elements already on screen at load are left alone (protects LCP and avoids flicker). */
const isInitiallyVisible = (el: Element) => el.getBoundingClientRect().top < window.innerHeight * 0.9;

const tick = (time: number) => lenis?.raf(time * 1000);

const variants: Record<string, gsap.TweenVars> = {
  up: { y: 40 },
  left: { x: -40 },
  right: { x: 40 },
  scale: { scale: 0.95 },
  '3d': { y: 40, rotateX: 12, transformPerspective: 900, transformOrigin: '50% 100%' },
};

function setupReveals() {
  gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
    if (isInitiallyVisible(el)) return;
    const key = el.dataset.reveal ?? 'up';
    const v = variants[key] ?? variants.up;
    gsap.from(el, {
      opacity: 0,
      ...v,
      duration: 0.8,
      ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
    });
  });
}

function setupStagger() {
  gsap.utils.toArray<HTMLElement>('[data-reveal-stagger]').forEach((group) => {
    const items = Array.from(group.children);
    if (!items.length || isInitiallyVisible(group)) return;
    gsap.from(items, {
      opacity: 0,
      y: 30,
      duration: 0.7,
      ease: 'power2.out',
      stagger: 0.12,
      scrollTrigger: { trigger: group, start: 'top 85%', once: true },
    });
  });
}

function setupParallax() {
  gsap.utils.toArray<HTMLElement>('[data-parallax]').forEach((el) => {
    const amount = parseFloat(el.dataset.parallax || '') || 8;
    gsap.fromTo(
      el,
      { yPercent: -amount },
      {
        yPercent: amount,
        ease: 'none',
        scrollTrigger: {
          trigger: el.parentElement ?? el,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      },
    );
  });
}

/** In-page hash links when Lenis is active (`data-scroll-target` uses scroll-target.ts). */
function setupAnchorNavigation() {
  if (anchorBound) return;
  anchorBound = true;
  document.addEventListener('click', (event) => {
    if (!lenis) return;
    const target = event.target;
    if (!(target instanceof Element)) return;

    const link = target.closest<HTMLAnchorElement>('a[href^="#"]');
    if (!link || link.getAttribute('href') === '#') return;
    const hash = link.getAttribute('href')!.slice(1);
    const el = document.getElementById(hash);
    if (!el) return;
    event.preventDefault();
    scrollToElement(el);
  });
}

export function initMotion() {
  if (started || prefersReducedMotion()) return;
  started = true;

  lenis = new Lenis();
  window.__lenis = lenis;
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);

  ctx = gsap.context(() => {
    setupReveals();
    setupStagger();
    setupParallax();
  });

  setupAnchorNavigation();
  window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });
}

export function destroyMotion() {
  ctx?.revert();
  ctx = null;
  gsap.ticker.remove(tick);
  lenis?.destroy();
  lenis = null;
  window.__lenis = undefined;
  started = false;
}