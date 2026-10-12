// Link helpers shared by every component, so an app's URL and its short call to action have
// one home.
import type { App } from '../data/apps';

/** Where an app's tile goes: its page, or its own site for apps that have one. */
export const appHref = (a: App) => a.external ?? `/${a.slug}/`;
/** Whether following the tile plays the launch transition (same-site app pages only). */
export const launches = (a: App) => !a.external;
export const isExternal = (href: string) => /^https?:\/\//.test(href);

/** The compact call to action for fixed UI, derived from the app's full CTA. */
export function ctaShort(a: App): string | null {
  if (!a.cta) return null;
  const h = a.cta.href;
  if (h.startsWith('https://apps.apple.com')) return 'Get the app';
  if (a.status === 'testflight') return 'Join TestFlight';
  if (a.status === 'github') return 'Download';
  if (a.status === 'service') return 'Email me';
  return 'Get notified';
}

/** Doc routes are written without the .html suffix in apps.ts; the built files keep it. */
export function docHref(href: string): string {
  if (isExternal(href) || href.endsWith('/') || href.endsWith('.html')) return href;
  return `${href}.html`;
}
