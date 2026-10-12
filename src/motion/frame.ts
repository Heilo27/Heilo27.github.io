// The four-corner frame: steps aside on scroll down, returns on scroll up (with a ground-coloured
// bar so it stays legible over any section), and the bottom corners only rest at the top.
// On the home page, the studio nav marks the section in view.
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { onPage, onScroll } from '../engine';

function apply(y: number, last: number) {
  const h = document.documentElement.classList;
  if (Math.abs(y - last) >= 4) h.toggle('frame-away', y > 160 && y > last);
  h.toggle('frame-scrolled', y > 24);
  h.toggle('frame-rest', y < 80);
}

export function setupFrame() {
  let last = 0;
  onScroll(({ y }) => {
    if (Math.abs(y - last) < 4) return;
    apply(y, last);
    last = y;
  });
  document.addEventListener('astro:after-swap', () => { last = 0; apply(0, 0); });
  apply(scrollY, 0);
  // Keyboard users must always reach the frame: focus inside it brings it back.
  document.addEventListener('focusin', (e) => {
    if ((e.target as HTMLElement).closest?.('[data-frame]')) document.documentElement.classList.remove('frame-away');
  });

  onPage(() => {
    const links = [...document.querySelectorAll<HTMLAnchorElement>('[data-spy]')];
    if (!links.length) return;
    const triggers = links.map((a) => {
      const section = document.getElementById(a.dataset.spy!);
      if (!section) return null;
      return ScrollTrigger.create({
        trigger: section,
        start: 'top 45%',
        end: 'bottom 45%',
        onToggle: (self) => {
          if (self.isActive) a.setAttribute('aria-current', 'location');
          else a.removeAttribute('aria-current');
        },
      });
    });
    return () => triggers.forEach((t) => t?.kill());
  });
}
