// The Radial AR stage driver. One variable, the chapter coordinate c (walk.ts), moves everything
// that carries the concept: the aircraft in the room, the course line, the TO/FROM boundary, the
// receiver's card, needle, flag, chip and DME. All of it comes from vor.ts, so the picture and the
// instrument can never disagree.
//
// One clock: a single gsap.ticker callback. No scroll listeners: it reads the engine's scrollState()
// and chapter offsets cached on ScrollTrigger refresh (and when the walk's size changes).
// DOM writes happen only when a written value changes.
// Reduced motion: no scrub, no pointer, no needle easing. The stage jumps to the key frame of the
// chapter being read. The ADF figure keeps its server-rendered state.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { isTouch, onPage, prefersReducedMotion, scrollState } from '../engine';
import { computeADF, computeVOR, describe, dmeFeet, dotsOf, formatCourse, formatRelative, wrap360, rad, type VORReading } from '../components/radial/vor';
import { ADF_E, ADF_N, KEY_C, TAG_FLIP_E, U, poseAt } from '../components/radial/walk';

const S = 100; // Room.astro: 1 m = 100 units
const DOT = 12; // Receiver.astro: units per dot
const NUDGE_M = 0.3; // pointer reach in the hero
const NEEDLE_RATE = 9; // 1/s: how fast the needle chases its target (a damped movement)

const clamp01 = (t: number) => Math.min(Math.max(t, 0), 1);

let registered = false;

export function setupRadial() {
  if (registered) return;
  registered = true;
  onPage(initStage);
}

function initStage() {
  const stage = document.querySelector<HTMLElement>('[data-rd-stage]');
  if (!stage) return;
  const q = <T extends Element = SVGElement>(sel: string) => stage.querySelector<T>(sel);
  const reduced = prefersReducedMotion();

  // ── Elements ────────────────────────────────────────────────────────────────────────────
  const el = {
    plane: q('[data-rd-plane]'), nose: q('[data-rd-nose]'), tag: q('[data-rd-tag]'), tags: q('[data-rd-tags]'), hdg: q('[data-rd-hdg]'),
    radial: q('[data-rd-radial]'), ring: q('[data-rd-dmering]'), cone: q('[data-rd-cone]'),
    abeam: q('[data-rd-abeam]'), course: q('[data-rd-course]'), from: q('[data-rd-from]'), to: q('[data-rd-to]'),
    dmeI: q<HTMLElement>('[data-rd-dme-i]'), dmeF: q<HTMLElement>('[data-rd-dme-f]'), crs: q<HTMLElement>('[data-rd-crs]'), chip: q<HTMLElement>('[data-rd-chip]'),
    card: q('[data-rd-card]'), needle: q('[data-rd-needle]'), rx: q<HTMLElement>('[data-rd-rx]'),
    live: q<HTMLElement>('[data-rd-live]'),
    flags: { TO: q('[data-rd-flag="TO"]'), FROM: q('[data-rd-flag="FROM"]'), OFF: q('[data-rd-flag="OFF"]') },
  };
  const adf = document.querySelector<HTMLElement>('[data-rd-adfsec]');
  const adfEl = adf && {
    nose: adf.querySelector('[data-rd-adf-nose]'), needle: adf.querySelector('[data-rd-adf-needle]'),
    hdg: adf.querySelector('[data-rd-adf-hdg]'), rb: adf.querySelector('[data-rd-adf-rb]'), mb: adf.querySelector('[data-rd-adf-mb]'),
  };

  // Write-on-change: one cache keyed per element + attribute.
  const last = new Map<string, string>();
  const put = (key: string, node: Element | null | undefined, name: string, value: string) => {
    if (!node || last.get(key) === value) return;
    last.set(key, value);
    if (name === 'text') node.textContent = value;
    else node.setAttribute(name, value);
  };

  // ── Chapter geometry, cached ────────────────────────────────────────────────────────────
  const chapters = [...document.querySelectorAll<HTMLElement>('[data-rd-ch]')];
  const carousels = [...document.querySelectorAll<HTMLElement>('[data-rd-carousel]')];
  let tops: number[] = [];
  let heights: number[] = [];
  let anchor = 0;
  let adfTop = 0;
  let adfH = 1;
  let vh = innerHeight;
  const measure = () => {
    const y = scrollY;
    vh = innerHeight;
    tops = chapters.map((c) => c.getBoundingClientRect().top + y);
    heights = chapters.map((c) => Math.max(c.getBoundingClientRect().height, 1));
    // The reading line: the middle of the text column on desktop, below the sticky stage on phones.
    const stageBottom = stage.getBoundingClientRect().height;
    anchor = innerWidth < 900 ? Math.min(stageBottom + (vh - stageBottom) * 0.35, vh * 0.85) : vh * 0.55;
    if (adf) { const r = adf.getBoundingClientRect(); adfTop = r.top + y; adfH = Math.max(r.height, 1); }
    // Screenshot rows scroll sideways on phones: a tab stop there (arrow keys scroll), none when they fit.
    for (const c of carousels) {
      if (c.scrollWidth > c.clientWidth + 1) c.tabIndex = 0;
      else c.removeAttribute('tabindex');
    }
  };
  measure();
  ScrollTrigger.addEventListener('refresh', measure);
  const ro = new ResizeObserver(() => measure());
  const walk = document.querySelector('[data-rd-walk]');
  if (walk) ro.observe(walk);

  /** Which chapter is being read (0 = hero) and how far into it. */
  const locate = (y: number) => {
    const a = y + anchor;
    for (let i = chapters.length - 1; i >= 0; i--) {
      if (a >= tops[i]) return { k: i + 1, c: i + 1 + clamp01((a - tops[i]) / heights[i]) };
    }
    return { k: 0, c: 0 };
  };

  // ── Pointer nudge (hero, fine pointers only) ────────────────────────────────────────────
  const nudge = { x: 0, y: 0, tx: 0, ty: 0 };
  const usePointer = !reduced && !isTouch();
  const onPointer = (e: PointerEvent) => {
    nudge.tx = (e.clientX / innerWidth - 0.5) * 2;
    nudge.ty = (e.clientY / innerHeight - 0.5) * 2;
  };
  if (usePointer) addEventListener('pointermove', onPointer, { passive: true });

  // ── The loop ────────────────────────────────────────────────────────────────────────────
  let prev: VORReading | null = null;
  let shownDots: number | null = null;
  let lastK = -1;

  const render = (dt: number) => {
    const { k, c: cont } = locate(scrollState().y);
    const c = reduced ? KEY_C[Math.min(k, KEY_C.length - 1)] : cont;
    const pose = { ...poseAt(c) };

    if (usePointer) {
      const inHero = c <= 1;
      const ease = 1 - Math.exp(-dt * 4);
      nudge.x += ((inHero ? nudge.tx : 0) - nudge.x) * ease;
      nudge.y += ((inHero ? nudge.ty : 0) - nudge.y) * ease;
      pose.e += nudge.x * NUDGE_M;
      pose.n -= nudge.y * NUDGE_M;
    }

    const v = computeVOR(pose.e, pose.n, U, pose.obs, prev);
    prev = v;

    // Room
    const x = pose.e * S;
    const y = -pose.n * S;
    put('plane', el.plane, 'transform', `translate(${x.toFixed(1)} ${y.toFixed(1)})`);
    put('nose', el.nose, 'transform', `rotate(${pose.hdg.toFixed(1)})`);
    put('tag', el.tag, 'text', v.radial == null ? 'R ---' : `R ${formatCourse(v.radial)}`);
    put('hdg', el.hdg, 'text', `HDG ${formatCourse(pose.hdg)}`);
    const west = pose.e > TAG_FLIP_E;
    put('tagAnchor', el.tags, 'text-anchor', west ? 'end' : 'start');
    put('tagX', el.tag, 'x', west ? '-22' : '22');
    put('hdgX', el.hdg, 'x', west ? '-22' : '22');
    put('rx2', el.radial, 'x2', x.toFixed(1));
    put('ry2', el.radial, 'y2', y.toFixed(1));
    put('ring', el.ring, 'r', (v.r * S).toFixed(1));
    put('cone', el.cone, 'class', v.insideCone ? 'rd-room__cone is-in' : 'rd-room__cone');
    const obsRot = `rotate(${pose.obs})`;
    put('abeam', el.abeam, 'transform', obsRot);
    put('course', el.course, 'transform', obsRot);
    const side = (b: number) => [(Math.sin(rad(b)) * 118).toFixed(1), (-Math.cos(rad(b)) * 118).toFixed(1)];
    const [fx, fy] = side(pose.obs + 24);
    const [tx, ty] = side(pose.obs + 204);
    put('fx', el.from, 'x', fx); put('fy', el.from, 'y', fy);
    put('tx', el.to, 'x', tx); put('ty', el.to, 'y', ty);

    // Receiver
    const [dmeI, dmeF] = dmeFeet(v.slantM).split('.');
    put('dmeI', el.dmeI, 'text', dmeI);
    put('dmeF', el.dmeF, 'text', dmeF);
    put('crs', el.crs, 'text', formatCourse(pose.obs));
    put('card', el.card, 'transform', `rotate(${-pose.obs})`);
    const chip = v.off === 'cone' ? 'CONE' : v.off === 'abeam' ? 'ABEAM' : '';
    if (el.chip && last.get('chip') !== chip) {
      last.set('chip', chip);
      el.chip.hidden = !chip;
      if (chip) el.chip.textContent = chip;
    }
    for (const f of ['TO', 'FROM', 'OFF'] as const) put(`flag${f}`, el.flags[f], 'visibility', v.flag === f ? 'visible' : 'hidden');
    put('stageflag', stage, 'data-flag', v.flag);

    const target = dotsOf(v.needle);
    shownDots = reduced || shownDots == null ? target : shownDots + (target - shownDots) * (1 - Math.exp(-dt * NEEDLE_RATE));
    put('needle', el.needle, 'transform', `translate(${(shownDots * DOT).toFixed(2)} 0)`);

    // Words: once per chapter, from the chapter's key frame (stable, not mid-walk).
    if (k !== lastK) {
      const kc = KEY_C[Math.min(k, KEY_C.length - 1)];
      const kp = poseAt(kc);
      const text = describe(computeVOR(kp.e, kp.n, U, kp.obs), kp.obs);
      el.rx?.setAttribute('aria-label', `VOR receiver. ${text}`);
      if (lastK !== -1 && el.live) el.live.textContent = text; // no announcement on page load
      lastK = k;
    }

    // ADF: its own section's scroll turns the phone one and a quarter times.
    if (adfEl && !reduced) {
      const p = (scrollState().y + vh - adfTop) / (adfH + vh);
      if (p > 0 && p < 1) {
        const hdg = wrap360(p * 450);
        const { mb, rb } = computeADF(ADF_E, ADF_N, hdg);
        put('anose', adfEl.nose, 'transform', `rotate(${hdg.toFixed(1)})`);
        put('aneedle', adfEl.needle, 'transform', `rotate(${rb.toFixed(1)})`);
        put('ahdg', adfEl.hdg, 'text', formatCourse(hdg));
        put('arb', adfEl.rb, 'text', formatRelative(rb));
        put('amb', adfEl.mb, 'text', formatCourse(mb));
      }
    }
  };

  const tick = (_t: number, deltaMs: number) => render(Math.min(deltaMs, 100) / 1000);
  render(1);
  gsap.ticker.add(tick);

  return () => {
    gsap.ticker.remove(tick);
    ScrollTrigger.removeEventListener('refresh', measure);
    ro.disconnect();
    if (usePointer) removeEventListener('pointermove', onPointer);
  };
}
