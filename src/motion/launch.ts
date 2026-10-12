// The signature: an app launch between pages, and its inverse, the close-app gesture.
//
//   launch  A link carrying an app icon ([data-launch] containing [data-icon]) is followed.
//           A ghost of the icon grows from its exact rect to fill the screen, filled with the
//           destination app's ground. The icon glyph drifts to the centre. After the swap the
//           glyph flies to the new page's [data-hero-icon] rect (FLIP) while the ground fades.
//   close   Any other same-site link. The page shrinks to 0.92 with rounded corners over the
//           destination ground, the ground takes over, and on enter it lifts off the new page.
//   back    Back/forward: a short fade, no launch.
//
// Colours come from tokens.css through a probe element, so no palette is duplicated here.
import { gsap } from 'gsap';
import { ease, onPage, prefersReducedMotion, setTransition } from '../engine';

type Kind = 'launch' | 'close' | 'back';
type Nav = { kind: Kind; bg: string; icon: HTMLElement | null; rect: DOMRect | null };

let nav: Nav | null = null;
let probeHost: HTMLElement | null = null;
let probe: HTMLElement | null = null;
let glyph: HTMLElement | null = null;
let ghost: HTMLElement | null = null;

/** The ground colour of the world a URL lives in (app pages and their docs wear the app). */
export function groundFor(url: URL): string {
  if (!probe) {
    probeHost = document.createElement('div');
    probeHost.dataset.app = 'studio';
    probeHost.hidden = true;
    probe = document.createElement('i');
    probeHost.append(probe);
    document.getElementById('curtain')?.append(probeHost);
  }
  probe.dataset.app = url.pathname.split('/')[1]?.replace(/\.html$/, '') ?? '';
  return getComputedStyle(probe).getPropertyValue('--c-bg').trim() || '#f2f3f5';
}

const panel = (c: HTMLElement) => c.querySelector<HTMLElement>('.curtain__panel')!;
const page = () => document.querySelector<HTMLElement>('[data-page]');

function clearGhosts() {
  ghost?.remove();
  glyph?.remove();
  ghost = glyph = null;
}

/** Called before leave(): decide what kind of navigation this is. */
function prepare(e: Event & { sourceElement?: Element; navigationType?: string; to?: URL }) {
  clearGhosts();
  const to = e.to ?? new URL(location.href);
  const bg = groundFor(to);
  const curtain = document.getElementById('curtain');
  if (curtain) panel(curtain).style.background = bg; // also used by the engine's reduced-motion fade
  document.dispatchEvent(new CustomEvent('menu:close'));
  if (e.navigationType === 'traverse') return void (nav = { kind: 'back', bg, icon: null, rect: null });
  const link = e.sourceElement?.closest?.('a[data-launch]');
  const icon = link?.querySelector<HTMLElement>('[data-icon]') ?? null;
  const rect = icon?.getBoundingClientRect() ?? null;
  const visible = !!rect && rect.width > 0 && rect.bottom > 0 && rect.top < innerHeight;
  nav = { kind: icon && visible ? 'launch' : 'close', bg, icon: visible ? icon : null, rect: visible ? rect : null };
}

// ── launch ──────────────────────────────────────────────────────────────────────────────────
function leaveLaunch(c: HTMLElement, n: Nav) {
  const r = n.rect!;
  const W = innerWidth;
  const H = innerHeight;
  const radius = r.width * 0.2237;
  ghost = document.createElement('div');
  ghost.className = 'launch';
  ghost.style.background = n.bg;
  glyph = n.icon!.cloneNode(true) as HTMLElement;
  glyph.removeAttribute('data-hero-icon');
  glyph.classList.add('launch__icon');
  glyph.style.setProperty('--icon-size', `${r.width}px`);
  c.append(ghost, glyph);
  gsap.set(panel(c), { autoAlpha: 0 });
  gsap.set(c, { autoAlpha: 1 });
  gsap.set(glyph, { x: r.left, y: r.top, scale: 1, transformOrigin: '0 0' });
  n.icon!.style.visibility = 'hidden'; // the icon has left its slot

  const size = gsap.utils.clamp(88, 148, Math.min(W, H) * 0.2);
  return gsap.timeline()
    .fromTo(ghost,
      { clipPath: `inset(${r.top}px ${W - r.right}px ${H - r.bottom}px ${r.left}px round ${radius}px)` },
      { clipPath: `inset(0px 0px 0px 0px round 0px)`, duration: 0.9, ease: ease.inOut }, 0)
    .to(glyph, { x: W / 2 - size / 2, y: H / 2 - size / 2, scale: size / r.width, duration: 0.9, ease: ease.inOut }, 0);
}

function enterLaunch(c: HTMLElement) {
  const g = glyph;
  const target = document.querySelector<HTMLElement>('[data-hero-icon]');
  const tl = gsap.timeline({ onComplete: () => { clearGhosts(); gsap.set(c, { autoAlpha: 0 }); gsap.set(panel(c), { autoAlpha: 1 }); } });
  if (g && target) {
    const base = parseFloat(g.style.getPropertyValue('--icon-size')) || 1;
    const t = target.getBoundingClientRect();
    gsap.set(target, { autoAlpha: 0 });
    tl.to(g, { x: t.left, y: t.top, scale: t.width / base, duration: 0.8, ease: ease.out }, 0)
      .to(ghost, { autoAlpha: 0, duration: 0.55, ease: 'power2.out' }, 0.1)
      .set(target, { autoAlpha: 1 }, 0.8)
      .set(g, { autoAlpha: 0 }, 0.8);
  } else {
    tl.to(g, { scale: '+=0.3', autoAlpha: 0, duration: 0.5, ease: ease.out }, 0)
      .to(ghost, { autoAlpha: 0, duration: 0.55, ease: 'power2.out' }, 0);
  }
  // Release the page intro while the icon is still landing: copy settles under it.
  return new Promise<void>((resolve) => { tl.call(resolve, [], 0.3); });
}

// ── close ───────────────────────────────────────────────────────────────────────────────────
function leaveClose(c: HTMLElement, n: Nav) {
  const p = page();
  const H = innerHeight;
  const y = scrollY;
  document.documentElement.style.backgroundColor = n.bg;
  gsap.set(panel(c), { autoAlpha: 0, yPercent: 0 });
  gsap.set(c, { autoAlpha: 1 });
  const tl = gsap.timeline();
  // The fixed frame lives inside the page; under a transform it would jump to the document top.
  const frame = document.querySelector<HTMLElement>('[data-frame]');
  if (frame) frame.style.top = `${y}px`;
  if (p) {
    const below = Math.max(0, p.offsetHeight - y - H);
    tl.fromTo(p,
      { clipPath: `inset(${y}px 0px ${below}px 0px round 0px)` },
      { clipPath: `inset(${y}px 0px ${below}px 0px round 34px)`, scale: 0.92, transformOrigin: `50% ${y + H / 2}px`, duration: 0.6, ease: ease.out }, 0);
  }
  return tl.to(panel(c), { autoAlpha: 1, duration: 0.35, ease: 'power2.inOut' }, 0.3);
}

function enterLift(c: HTMLElement) {
  document.documentElement.style.backgroundColor = '';
  const p = page();
  const tl = gsap.timeline({ onComplete: () => { gsap.set(c, { autoAlpha: 0 }); gsap.set(panel(c), { yPercent: 0 }); } });
  tl.to(panel(c), { yPercent: -100, duration: 0.85, ease: ease.inOut }, 0);
  if (p) tl.from(p, { y: 90, duration: 1, ease: ease.out, clearProps: 'transform' }, 0.25);
  return new Promise<void>((resolve) => { tl.call(resolve, [], 0.45); });
}

// ── back / forward ──────────────────────────────────────────────────────────────────────────
const leaveBack = (c: HTMLElement) => gsap.timeline().set(panel(c), { autoAlpha: 1, yPercent: 0 }).fromTo(c, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.22, ease: 'power2.out' });
const enterBack = (c: HTMLElement) => gsap.to(c, { autoAlpha: 0, duration: 0.3, ease: 'power2.out' });

export function setupLaunch() {
  document.addEventListener('astro:before-preparation', prepare as EventListener);
  // Each new page starts with no inline state from a transition.
  document.addEventListener('astro:after-swap', () => {
    document.documentElement.style.backgroundColor = '';
  });

  setTransition({
    leave: (c) => {
      const n = nav ?? { kind: 'close', bg: groundFor(new URL(location.href)), icon: null, rect: null };
      if (n.kind === 'back') return leaveBack(c);
      if (n.kind === 'launch') return leaveLaunch(c, n);
      return leaveClose(c, n);
    },
    enter: (c) => {
      const n = nav;
      nav = null;
      if (!n || n.kind === 'back') return enterBack(c);
      if (n.kind === 'launch') return enterLaunch(c);
      return enterLift(c);
    },
  });

  // First load (and every page): the hero icon lands with the page intro when no launch delivers it.
  onPage(({ intro }) => {
    const hero = document.querySelector<HTMLElement>('[data-hero-icon]');
    if (!hero || nav?.kind === 'launch' || prefersReducedMotion()) return;
    intro.fromTo(hero, { scale: 0.7, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 1.1, ease: ease.out }, 0);
  });
}
