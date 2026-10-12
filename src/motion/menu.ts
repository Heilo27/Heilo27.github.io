// Full-screen menu sheet for phones. Accessible dialog: aria-expanded on the trigger, focus moves
// in and is trapped, Escape closes, focus returns to the trigger. Closes when a navigation starts.
import { gsap } from 'gsap';
import { ease, onPage, prefersReducedMotion, startScroll, stopScroll } from '../engine';

export function setupMenu() {
  onPage(() => {
    const menu = document.querySelector<HTMLElement>('[data-menu]');
    const opener = document.querySelector<HTMLButtonElement>('[data-menu-open]');
    const closer = menu?.querySelector<HTMLButtonElement>('[data-menu-close]');
    if (!menu || !opener || !closer) return;
    let open = false;
    let tl: gsap.core.Timeline | null = null;

    const focusables = () =>
      [...menu.querySelectorAll<HTMLElement>('a[href], button:not([disabled])')].filter((el) => el.offsetParent !== null);

    const show = () => {
      if (open) return;
      open = true;
      menu.hidden = false;
      opener.setAttribute('aria-expanded', 'true');
      document.documentElement.classList.add('menu-open');
      stopScroll();
      tl?.kill();
      if (!prefersReducedMotion()) {
        tl = gsap.timeline()
          .fromTo(menu, { clipPath: 'inset(0% 0% 100% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.7, ease: ease.inOut })
          .fromTo(menu.querySelectorAll('.menu__link span'), { yPercent: 110 }, { yPercent: 0, duration: 0.9, ease: ease.out, stagger: 0.05 }, 0.3)
          .fromTo(menu.querySelectorAll('.menu__dock li'), { scale: 0.6, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.7, ease: ease.out, stagger: 0.025 }, 0.4);
      }
      closer.focus();
    };

    const hide = (restore = true) => {
      if (!open) return;
      open = false;
      opener.setAttribute('aria-expanded', 'false');
      document.documentElement.classList.remove('menu-open');
      tl?.kill();
      const done = () => {
        menu.hidden = true;
        gsap.set(menu, { clearProps: 'clipPath' });
        startScroll();
        if (restore) opener.focus();
      };
      if (prefersReducedMotion() || !restore) return done();
      tl = gsap.timeline({ onComplete: done })
        .to(menu, { clipPath: 'inset(0% 0% 100% 0%)', duration: 0.55, ease: ease.inOut });
    };

    const onKey = (e: KeyboardEvent) => {
      if (!open) return;
      if (e.key === 'Escape') { e.preventDefault(); hide(); return; }
      if (e.key !== 'Tab') return;
      const f = focusables();
      if (!f.length) return;
      const first = f[0];
      const last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    // In-page links (Apps, Services, Contact on the home page) close the sheet without a navigation.
    const onLink = (e: Event) => {
      const a = (e.target as HTMLElement).closest('a');
      if (a && a.hash && a.pathname === location.pathname) hide(false);
    };
    const onNav = () => hide(false);

    opener.addEventListener('click', show);
    closer.addEventListener('click', () => hide());
    menu.addEventListener('click', onLink);
    document.addEventListener('keydown', onKey);
    document.addEventListener('menu:close', onNav);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('menu:close', onNav);
      document.documentElement.classList.remove('menu-open');
    };
  });
}
