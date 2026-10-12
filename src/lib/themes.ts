// Build-time view of the per-app worlds. tokens.css is the single source of truth for theme
// colours; this parses it so <meta name="theme-color"> and anything else rendered on the server
// can use the same values without copying hex codes. The client reads the same tokens at runtime
// through a probe element (src/motion/launch.ts), so neither side holds its own palette.
import tokens from '../styles/tokens.css?raw';

const STUDIO = 'studio';

function parse(): Record<string, Record<string, string>> {
  const out: Record<string, Record<string, string>> = {};
  const rule = /(:root[^{]*|\[data-app='([a-z0-9-]+)'\])\s*\{([^}]*)\}/g;
  let m: RegExpExecArray | null;
  while ((m = rule.exec(tokens))) {
    const name = m[2] ?? STUDIO;
    const vars: Record<string, string> = out[name] ?? {};
    for (const d of m[3].matchAll(/(--c-[a-z-]+)\s*:\s*([^;]+);/g)) vars[d[1]] = d[2].trim();
    out[name] = vars;
  }
  return out;
}

const themes = parse();

/** A theme's colour token, falling back to the studio world. */
export function themeVar(app: string | undefined | null, name: string): string {
  return (app && themes[app]?.[name]) || themes[STUDIO]?.[name] || '';
}
export const hasTheme = (app: string | undefined | null) => !!app && app in themes && app !== STUDIO;
