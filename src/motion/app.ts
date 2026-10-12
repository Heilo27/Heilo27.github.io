// App sales pages. One driver per page: the chapter being read. It picks the screen in the sticky
// device (the new screen launches up and settles, the old one sinks away), lights the tick and the
// chapter title. Plus the hero device's slight lean toward the pointer and the filmstrip arrows.
// Everything runs on GSAP's ticker and is reverted by the engine's page context. Display names are
// fitted to their column first (fitNames), so SplitText cuts the lines at the size they will show.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ease, isTouch, onPage, prefersReducedMotion } from '../engine';

gsap.registerPlugin(ScrollTrigger);

const mark = (els: Iterable<Element>, on: (el: Element) => boolean) => {
  for (const el of els) el.toggleAttribute('data-active', on(el));
};

// [data-fit] names fill their column: the text is measured at 100px in its own font and --fit is
// the size at which it (or, when the name may wrap, its longest word) spans the column. app.css caps it
// and keeps the estimate from fit.ts as the size without JS. SplitText re-splits when the size
// changes the name's width (autoSplit), so a refit after fonts load or a resize stays clean.
const PROBE = 100;
function fitNames(root: ParentNode = document) {
  for (const el of root.querySelectorAll<HTMLElement>('[data-fit]')) {
    const host = el.parentElement;
    if (!host) continue;
    const text = (el.textContent ?? '').trim();
    const parts = getComputedStyle(el).whiteSpace === 'nowrap' ? [text] : text.split(/\s+/);
    const probe = document.createElement('span');
    probe.className = el.className;
    probe.setAttribute('aria-hidden', 'true');
    probe.style.cssText = `position:absolute;left:0;top:0;visibility:hidden;white-space:nowrap;font-size:${PROBE}px;margin:0;translate:none`;
    host.append(probe);
    let widest = 0;
    for (const part of parts) {
      probe.textContent = part;
      widest = Math.max(widest, probe.getBoundingClientRect().width);
    }
    probe.remove();
    // 4% spare: the cap's negative side bearing and the next-app name's hover nudge stay inside.
    const room = el.getBoundingClientRect().width * 0.96;
    if (widest > 0 && room > 0) el.style.setProperty('--fit', `${((PROBE * room) / widest).toFixed(1)}px`);
  }
}

function refit(root: HTMLElement) {
  const els = [...root.querySelectorAll<HTMLElement>('[data-fit]')];
  if (!els.length) return;
  let width = innerWidth;
  const ro = new ResizeObserver(() => {
    if (innerWidth === width) return; // phone toolbars change the height only
    width = innerWidth;
    fitNames(root);
  });
  ro.observe(document.documentElement);
  let live = true;
  document.fonts?.ready.then(() => { if (live) fitNames(root); });
  return () => { live = false; ro.disconnect(); };
}

function chapters(root: HTMLElement) {
  const list = [...root.querySelectorAll<HTMLElement>('[data-chapter]')];
  if (!list.length) return;
  const layers = [...root.querySelectorAll<HTMLElement>('[data-layer]')];
  const ticks = [...root.querySelectorAll<HTMLElement>('[data-tick]')];
  const still = prefersReducedMotion();
  let shown = layers[0]?.dataset.layer ?? '';
  layers.forEach((l) => gsap.set(l, { autoAlpha: l.dataset.layer === shown ? 1 : 0 }));

  const show = (shot: string, down: boolean) => {
    if (shot === shown) return;
    const from = layers.find((l) => l.dataset.layer === shown);
    const to = layers.find((l) => l.dataset.layer === shot);
    shown = shot;
    mark(layers, (l) => l === to);
    if (!to) return;
    if (still) {
      if (from) gsap.set(from, { autoAlpha: 0 });
      gsap.set(to, { autoAlpha: 1, yPercent: 0, scale: 1 });
      return;
    }
    const d = down ? 1 : -1;
    if (from) gsap.to(from, { yPercent: -6 * d, scale: 0.94, autoAlpha: 0, duration: 0.6, ease: ease.soft, overwrite: true });
    gsap.fromTo(to, { yPercent: 9 * d, scale: 0.97, autoAlpha: 0 }, { yPercent: 0, scale: 1, autoAlpha: 1, duration: 1, ease: ease.out, overwrite: true });
  };

  const activate = (i: number, down: boolean) => {
    const ch = list[i];
    mark(list, (c) => c === ch);
    mark(ticks, (t) => t.getAttribute('data-tick') === String(i));
    if (ch.dataset.show !== undefined) show(ch.dataset.show, down);
  };

  const triggers = list.map((ch, i) =>
    ScrollTrigger.create({
      trigger: ch,
      start: 'top 55%',
      end: 'bottom 55%',
      onToggle: (self) => { if (self.isActive) activate(i, self.direction > 0); },
    }));
  return () => triggers.forEach((t) => t.kill());
}

function tilt(root: HTMLElement) {
  const el = root.querySelector<HTMLElement>('[data-tilt]');
  const hero = root.querySelector<HTMLElement>('[data-hero]');
  if (!el || !hero || isTouch() || prefersReducedMotion()) return;
  gsap.set(el, { transformPerspective: 1400 });
  const rx = gsap.quickTo(el, 'rotationX', { duration: 0.9, ease: ease.soft });
  const ry = gsap.quickTo(el, 'rotationY', { duration: 0.9, ease: ease.soft });
  const move = (e: PointerEvent) => {
    const r = hero.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    ry(x * 9);
    rx(-y * 6);
  };
  const reset = () => { rx(0); ry(0); };
  hero.addEventListener('pointermove', move);
  hero.addEventListener('pointerleave', reset);
  return () => {
    hero.removeEventListener('pointermove', move);
    hero.removeEventListener('pointerleave', reset);
  };
}

function filmstrip(root: HTMLElement) {
  const section = root.querySelector<HTMLElement>('[data-gallery]');
  const track = section?.querySelector<HTMLElement>('[data-track]');
  const nav = section?.querySelector<HTMLElement>('[data-gallery-nav]');
  if (!section || !track || !nav) return;
  const items = [...track.children] as HTMLElement[];
  const [prev, next] = [...nav.querySelectorAll<HTMLButtonElement>('button')];
  nav.hidden = false;
  // The ends are known by watching the first and last frames, not by listening to scroll.
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (e.target === items[0]) prev.disabled = e.intersectionRatio > 0.9;
      if (e.target === items.at(-1)) next.disabled = e.intersectionRatio > 0.9;
    }
  }, { root: track, threshold: [0, 0.9, 1] });
  io.observe(items[0]);
  io.observe(items.at(-1)!);
  const step = (e: Event) => {
    const dir = Number((e.currentTarget as HTMLElement).dataset.dir);
    const w = items[0].getBoundingClientRect().width + parseFloat(getComputedStyle(track).columnGap || '0');
    track.scrollBy({ left: dir * w, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
  };
  prev.addEventListener('click', step);
  next.addEventListener('click', step);
  return () => {
    io.disconnect();
    prev.removeEventListener('click', step);
    next.removeEventListener('click', step);
  };
}

export function setupApp() {
  // Before the engine's reveals: setup runs ahead of the first page, after-swap ahead of each next one.
  fitNames();
  document.addEventListener('astro:after-swap', () => fitNames());
  onPage(() => {
    const root = document.querySelector<HTMLElement>('[data-app-page]');
    if (!root) return;
    const offs = [refit(root), chapters(root), tilt(root), filmstrip(root)];
    return () => offs.forEach((off) => off?.());
  });
}
