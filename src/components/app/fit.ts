/** A display name's width in rough ems, for sizing it to its column with `--len` (app.css).
 *  Capitals run about a third wider than lower case in Mona Sans at display width ("CAP Wingman"). */
export const ems = (t: string) => [...t].reduce((n, c) => n + (c === ' ' ? 0.5 : /[A-Z]/.test(c) ? 1.35 : 1), 0);
