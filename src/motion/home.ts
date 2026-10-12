// Home page motion. Each behaviour checks for its markup, so this is safe on every page.
//   settle     the hero title (and the facts numerals) settle from condensed to their resting
//              width on Mona Sans's width axis: the kinetic idea of the site's type
//   unlock     the Home Screen icons fly in to their slots, centre first, as after an unlock
//   preview    apps index: a device follows a fine pointer showing the hovered app's first screen
//   process    the sticky numeral rolls to the step in view
//   mail form  composes a mailto: link with a clean subject and body, with inline validation
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { ease, isTouch, onPage, onScroll, prefersReducedMotion, scrollToTarget } from '../engine';

gsap.registerPlugin(ScrollTrigger, SplitText);

/** The resting axes come from CSS, so the stylesheet stays the one home of the type settings. */
function axes(el: HTMLElement, wdth?: number) {
  const cs = getComputedStyle(el);
  const rest = parseFloat(cs.fontStretch) || 100;
  return `"wght" ${parseFloat(cs.fontWeight) || 700}, "wdth" ${wdth ?? rest}`;
}
const CONDENSED = 75;

// ── hero: settle + unlock ───────────────────────────────────────────────────────────────────
function hero(intro: gsap.core.Timeline) {
  const title = document.querySelector<HTMLElement>('[data-settle]');
  const board = document.querySelector<HTMLElement>('[data-springboard]');
  if (!title || !board) return;
  const fades = document.querySelectorAll<HTMLElement>('[data-hero-fade]');
  const items = [...board.querySelectorAll<HTMLElement>('.hs__item')];
  if (prefersReducedMotion()) return;

  const split = SplitText.create(title, { type: 'lines,chars', mask: 'lines', linesClass: 'split-line' });
  const tl = gsap.timeline();
  tl.set(title, { visibility: 'visible' })
    .fromTo(split.chars,
      { yPercent: 108, fontVariationSettings: axes(title, CONDENSED) },
      { yPercent: 0, fontVariationSettings: axes(title), duration: 1.5, ease: ease.out, stagger: 0.022, clearProps: 'fontVariationSettings' }, 0);

  // Unlock: every icon starts pushed out from the board's centre and a touch larger.
  const b = board.getBoundingClientRect();
  const cx = b.left + b.width / 2;
  const cy = b.top + b.height / 2;
  items.forEach((el) => {
    const r = el.getBoundingClientRect();
    const dx = r.left + r.width / 2 - cx;
    const dy = r.top + r.height / 2 - cy;
    el.dataset.d = String(Math.hypot(dx, dy));
    gsap.set(el, { x: dx * 0.42, y: dy * 0.42, scale: 1.3, autoAlpha: 0 });
  });
  const max = Math.max(1, ...items.map((el) => +el.dataset.d!));
  items.forEach((el) => {
    tl.to(el, { x: 0, y: 0, scale: 1, autoAlpha: 1, duration: 1.2, ease: ease.out, clearProps: 'transform' }, 0.18 + (+el.dataset.d! / max) * 0.28);
  });
  tl.fromTo(fades, { y: 24, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1.1, ease: ease.out, stagger: 0.08, clearProps: 'transform' }, 0.45);
  intro.add(tl, 0);
}

// ── facts: the numerals settle as they arrive ───────────────────────────────────────────────
function facts() {
  const nums = gsap.utils.toArray<HTMLElement>('[data-settle-num]');
  if (!nums.length || prefersReducedMotion()) return;
  nums.forEach((el, i) => {
    const label = el.nextElementSibling;
    gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 88%', once: true }, delay: i * 0.08 })
      .fromTo(el, { autoAlpha: 0, yPercent: 30, fontVariationSettings: axes(el, CONDENSED) },
        { autoAlpha: 1, yPercent: 0, fontVariationSettings: axes(el), duration: 1.4, ease: ease.out, clearProps: 'fontVariationSettings,transform' })
      .fromTo(label, { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 1, ease: ease.out, clearProps: 'transform' }, 0.2);
  });
}

// ── apps index: floating preview ────────────────────────────────────────────────────────────
function preview() {
  const list = document.querySelector<HTMLElement>('[data-index]');
  const box = document.querySelector<HTMLElement>('[data-preview-box]');
  if (!list || !box || isTouch()) return;
  const shots = new Map([...box.querySelectorAll<HTMLElement>('[data-shot]')].map((s) => [s.dataset.shot!, s]));
  const calm = prefersReducedMotion();
  const x = gsap.quickTo(box, 'x', { duration: calm ? 0.01 : 0.6, ease: ease.soft });
  const y = gsap.quickTo(box, 'y', { duration: calm ? 0.01 : 0.6, ease: ease.soft });
  let px = -999, py = -999, on = false, current: HTMLElement | undefined, fade: gsap.core.Tween | undefined;

  // Beside the pointer, on whichever side has room for the device.
  const beside = (cx: number) => { const w = box.offsetWidth; return cx + 24 + w < innerWidth ? cx + 24 : cx - 24 - w; };
  const move = (e: PointerEvent) => {
    px = e.clientX; py = e.clientY;
    x(beside(px)); y(py);
  };
  const show = (e: Event) => {
    const slug = (e.currentTarget as HTMLElement).dataset.preview;
    const shot = slug ? shots.get(slug) : undefined;
    if (!shot) return hide();
    current?.classList.remove('is-on');
    shot.classList.add('is-on');
    current = shot;
    box.dataset.device = shot.dataset.device;
    if (!on) {
      gsap.set(box, { x: beside(px), y: py });
      fade = gsap.fromTo(box, { autoAlpha: 0, scale: 0.8 }, { autoAlpha: 1, scale: 1, duration: calm ? 0.2 : 0.55, ease: ease.out, overwrite: 'auto' });
      on = true;
    }
  };
  function hide() {
    if (!on) return;
    on = false;
    fade = gsap.to(box, { autoAlpha: 0, scale: 0.85, duration: 0.35, ease: ease.out, overwrite: 'auto' });
  }
  const rows = [...list.querySelectorAll<HTMLAnchorElement>('.index__link')];
  rows.forEach((a) => a.addEventListener('pointerenter', show));
  list.addEventListener('pointerleave', hide);
  addEventListener('pointermove', move, { passive: true });
  // pointerleave never fires when the page scrolls under a still pointer: check on scroll.
  const off = onScroll(() => { if (on && !list.contains(document.elementFromPoint(px, py))) hide(); });
  // A launch starts: the icon is the star. Kill a fade-in still running from a quick hover-click.
  const away = () => { on = false; fade?.kill(); gsap.set(box, { autoAlpha: 0 }); };
  document.addEventListener('astro:before-preparation', away);
  return () => {
    rows.forEach((a) => a.removeEventListener('pointerenter', show));
    list.removeEventListener('pointerleave', hide);
    removeEventListener('pointermove', move);
    document.removeEventListener('astro:before-preparation', away);
    off();
  };
}

// ── process: the numeral follows the step in view ───────────────────────────────────────────
function process() {
  const stage = document.querySelector<HTMLElement>('[data-process-stage]');
  const strip = stage?.querySelector<HTMLElement>('[data-process-strip]');
  const steps = gsap.utils.toArray<HTMLElement>('[data-process-step]');
  if (!stage || !strip || !steps.length) return;
  const calm = prefersReducedMotion();
  const go = (i: number) => {
    if (stage.dataset.step === String(i)) return;
    stage.dataset.step = String(i);
    const to = { yPercent: (-100 * i) / steps.length };
    if (calm) gsap.set(strip, to);
    else gsap.to(strip, { ...to, duration: 0.9, ease: ease.out, overwrite: true });
  };
  steps.forEach((el, i) => ScrollTrigger.create({
    trigger: el,
    start: 'top 60%',
    end: 'bottom 60%',
    onToggle: (self) => { if (self.isActive) go(i); },
  }));
}

// ── contact: the form writes an email ───────────────────────────────────────────────────────
function mailForm() {
  const form = document.querySelector<HTMLFormElement>('[data-mail-form]');
  if (!form) return;
  form.noValidate = true; // our messages replace the browser's bubbles
  const fields = [...form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('[data-error]')];
  const touched = new Set<Element>();

  const check = (f: HTMLInputElement | HTMLTextAreaElement) => {
    const ok = f.value.trim().length > 0 && f.checkValidity();
    const out = form.querySelector<HTMLElement>(`[data-error-for="${f.id}"]`);
    if (ok) f.removeAttribute('aria-invalid');
    else f.setAttribute('aria-invalid', 'true');
    if (out) out.textContent = ok ? '' : f.dataset.error!;
    return ok;
  };
  const onInput = (e: Event) => { if (touched.has(e.target as Element)) check(e.target as HTMLInputElement); };
  const onBlur = (e: Event) => {
    const f = e.target as HTMLInputElement;
    if (f.value.trim()) { touched.add(f); check(f); }
  };
  const onSubmit = (e: SubmitEvent) => {
    e.preventDefault();
    fields.forEach((f) => touched.add(f));
    const bad = fields.filter((f) => !check(f));
    if (bad.length) return void bad[0].focus();
    const v = (n: string) => (form.elements.namedItem(n) as HTMLInputElement).value.trim();
    const subject = `${form.dataset.subject}: ${v('subject')}`;
    const body = `${v('body')}\n\n${v('name')}\n${v('email')}`;
    location.href = `mailto:${form.dataset.to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };
  form.addEventListener('input', onInput);
  form.addEventListener('focusout', onBlur);
  form.addEventListener('submit', onSubmit);
  return () => {
    form.removeEventListener('input', onInput);
    form.removeEventListener('focusout', onBlur);
    form.removeEventListener('submit', onSubmit);
  };
}

export function setupHome() {
  onPage(({ intro, path }) => {
    if (!document.querySelector('[data-home]')) return;
    hero(intro);
    facts();
    process();
    const cleanups = [preview(), mailForm()];
    // Arriving from another page at /#apps or /#contact: the router lands at the top, so go there.
    if (path === '/' && location.hash.length > 1) {
      const target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
      if (target) intro.call(() => scrollToTarget(target), [], 0.2);
    }
    return () => cleanups.forEach((c) => c?.());
  });
}
