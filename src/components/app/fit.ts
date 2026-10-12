/** A display name's width in rough ems, for sizing it to its column with `--len` (app.css) before
 *  any script runs. src/motion/app.ts then measures the real text and sets `--fit`.
 *  Capitals run about a third wider than lower case in Mona Sans at display width ("CAP Wingman"). */
export const ems = (t: string) => [...t].reduce((n, c) => n + (c === ' ' ? 0.5 : /[A-Z]/.test(c) ? 1.35 : 1), 0);

/** Names longer than this wrap (by word) instead of shrinking on one line: hero, and the next-app band on a phone. */
export const isLong = (name: string) => name.length > 11;
/** The `--len` for a name: its whole width on one line, or its longest word when it wraps. */
export const lenOf = (name: string) => (isLong(name) ? Math.max(...name.split(' ').map(ems)) : ems(name)).toFixed(2);
