// VOR/DME and ADF math, ported line for line from the Radial AR app's VORCore Swift package
// (NavCore/Angles, NavCore/Geometry, NavCore/StationBearing, VORNav/VORMath, VORNav/VORComputer,
// ADFNav/ADFComputer, NavCore/Units). Same names, same order of evaluation, same constants, so the
// page's instrument shows what the app would show at the same spot in the room.
//
// Station frame: E, N, U in meters from the antenna point (0.20 m above the floor). Virtual north,
// variation 0, as the app's default room. Pure and isomorphic: the page renders its static states
// with it at build time and the live stage calls it every frame.

// ── NavCore/Angles ─────────────────────────────────────────────────────────────────────────────
const deg = (rad: number) => (rad * 180) / Math.PI;
export const rad = (d: number) => (d * Math.PI) / 180;

/** [0, 360). */
export function wrap360(d: number) {
  let r = d % 360;
  if (r < 0) r += 360;
  if (r >= 360) r -= 360;
  return r;
}
/** [-180, 180): +180 maps to -180. */
export const wrap180 = (d: number) => wrap360(d + 180) - 180;

/** Half away from zero, with the app's sub-resolution nudge (Units.rounded). */
export function roundTo(value: number, digits: number) {
  const f = 10 ** Math.max(digits, 0);
  const s = value * f;
  const n = s + (s >= 0 ? 1e-9 : -1e-9);
  return (Math.sign(n) * Math.round(Math.abs(n))) / f;
}

/** Course for display, 001 to 360 (0 shows as 360), or '---'. */
export function formatCourse(d: number | null | undefined) {
  if (d == null || !Number.isFinite(d)) return '---';
  const c = Math.round(wrap360(d)) % 360; // wrap360 is >= 0, so round is half away from zero
  return String(c === 0 ? 360 : c).padStart(3, '0');
}
/** Relative bearing for display, 000 to 359. */
export function formatRelative(d: number) {
  return String(Math.round(wrap360(d)) % 360).padStart(3, '0');
}

// ── Constants (VORConstants, VORSettings defaults, StationFrame) ──────────────────────────────
export const FULL_SCALE_DEG = 10; // never a parameter: the app has no wide or easy CDI
export const DEG_PER_DOT = 2; // 5 dots each side
export const ANTENNA_HEIGHT_M = 0.2;
export const CONE_HALF_ANGLE_DEG = 30;
export const AMBIGUITY_BAND_DEG = 2;
export const CONE_EXIT_MARGIN_DEG = 1;
export const UNDEFINED_RADIUS_M = 0.001;
export const METERS_PER_FOOT = 0.3048;

// ── NavCore/Geometry + StationBearing ─────────────────────────────────────────────────────────
export const horizontalDistance = (e: number, n: number) => Math.hypot(e, n);
export const slantRange = (e: number, n: number, u: number) => Math.hypot(Math.hypot(e, n), u);
export const elevationDeg = (u: number, r: number) => deg(Math.atan2(u, r));
/** Bearing FROM the station, clockwise from north: atan2(E, N), not atan2(N, E). */
export const radialOf = (e: number, n: number) => wrap360(deg(Math.atan2(e, n)));
export const toStation = (fromDeg: number) => wrap360(fromDeg + 180);

/** Cone of confusion with hysteresis: enter above 90 - α, leave only below 90 - α - 1°. */
export function isInsideCone(u: number, r: number, wasInside: boolean, alpha = CONE_HALF_ANGLE_DEG) {
  if (!(alpha > 0) || !(u > 0)) return false;
  const e = elevationDeg(u, r);
  const threshold = 90 - alpha;
  return wasInside ? e >= threshold - CONE_EXIT_MARGIN_DEG : e > threshold;
}

// ── VORNav/VORMath ─────────────────────────────────────────────────────────────────────────────
export type Flag = 'TO' | 'FROM' | 'OFF';
export type OffReason = 'cone' | 'abeam' | 'undefined';

/** a = wrap180(OBS - θ). */
export const courseRadialDifference = (obs: number, radial: number) => wrap180(obs - radial);

/** FROM if |a| < 90 - band, TO if |a| > 90 + band, otherwise OFF (abeam). Strict on purpose. */
export function toFrom(a: number, band = AMBIGUITY_BAND_DEG): Flag {
  const m = Math.abs(a);
  if (m < 90 - band) return 'FROM';
  if (m > 90 + band) return 'TO';
  return 'OFF';
}

/** Positive = needle right = the course is to the right. FROM side uses a, TO side β - OBS. */
export function deviation(a: number, radial: number, obs: number) {
  if (Math.abs(a) <= 90) return a;
  return wrap180(toStation(radial) - obs);
}

/** [-1, 1], full scale ±10°. */
export const needleOf = (dev: number) => (Number.isNaN(dev) ? 0 : Math.min(Math.max(dev / FULL_SCALE_DEG, -1), 1));
export const dotsOf = (needle: number) => needle * (FULL_SCALE_DEG / DEG_PER_DOT);

// ── VORNav/VORComputer ─────────────────────────────────────────────────────────────────────────
export type VORReading = {
  radial: number | null; // null = not displayable (cone, undefined)
  deviation: number | null;
  needle: number; // parked at 0 when OFF for cone/undefined; computed (pegged) when abeam
  flag: Flag;
  off: OffReason | null;
  slantM: number; // DME stays valid in the cone (a real DME keeps reading overhead)
  elevation: number;
  r: number;
  a: number | null;
  insideCone: boolean;
};

/** One position in, what a real receiver shows out. `prev` carries the cone hysteresis (null = one-shot). */
export function computeVOR(e: number, n: number, u: number, obsIn: number, prev: VORReading | null = null): VORReading {
  const obs = normalizedDial(obsIn);
  const r = horizontalDistance(e, n);
  const slantM = slantRange(e, n, u);
  const elevation = elevationDeg(u, r);
  const insideCone = isInsideCone(u, r, prev?.insideCone ?? false);
  const parked = (off: OffReason, inCone: boolean): VORReading => ({
    radial: null, deviation: null, needle: 0, flag: 'OFF', off, slantM, elevation, r, a: null, insideCone: inCone,
  });
  if (insideCone) return parked('cone', true);
  if (r < UNDEFINED_RADIUS_M) return parked('undefined', false);
  const radial = radialOf(e, n);
  const a = courseRadialDifference(obs, radial);
  const flag = toFrom(a);
  const dev = deviation(a, radial, obs);
  return {
    radial, deviation: dev, needle: needleOf(dev), flag, off: flag === 'OFF' ? 'abeam' : null,
    slantM, elevation, r, a, insideCone: false,
  };
}

/** Dial setting into 1...360 (0 becomes 360). */
export function normalizedDial(v: number) {
  const w = ((Math.round(v) % 360) + 360) % 360;
  return w === 0 ? 360 : w;
}

/** DME text, one decimal, feet: '3.6'. */
export const dmeFeet = (m: number) => roundTo(m / METERS_PER_FOOT, 1).toFixed(1);

// ── ADFNav/ADFComputer ─────────────────────────────────────────────────────────────────────────
/** RB = wrap360(MB - MH): clockwise from the nose to the station. Moves with heading, unlike the VOR. */
export function computeADF(e: number, n: number, headingDeg: number) {
  const from = radialOf(e, n);
  const mb = toStation(from);
  return { mb, rb: wrap360(mb - headingDeg) };
}

// ── Plain-language reading, for the live region and the chapter captions ──────────────────────
export function describe(v: VORReading, obs: number) {
  const crs = formatCourse(obs);
  const dme = `DME ${dmeFeet(v.slantM)} feet`;
  if (v.flag === 'OFF' && v.off === 'cone') return `Course ${crs}. Flag OFF: overhead, in the cone of confusion. ${dme}, your height above the antenna.`;
  if (v.flag === 'OFF') return `On the ${formatCourse(v.radial)} radial. Course ${crs}. Flag OFF: abeam the station. ${dme}.`;
  const dots = roundTo(Math.abs(dotsOf(v.needle)), 1);
  const needle = dots === 0 ? 'needle centred' : `needle ${dots === 5 ? 'pegged' : `${dots} dots`} ${v.needle > 0 ? 'right' : 'left'}`;
  return `On the ${formatCourse(v.radial)} radial. Course ${crs}, ${v.flag}, ${needle}. ${dme}.`;
}
