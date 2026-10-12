// The scripted walk around the station. One input, the chapter coordinate c (0 = hero, 1..4 =
// lessons, fractional = partway through a chapter), gives one pose: where the phone is, where it
// points, and what course the OBS is set to. Everything on the stage is computed from that pose
// by vor.ts, so the picture and the receiver can never disagree.
//
// Units: meters in the station frame. The phone is held 1.30 m above the floor and the antenna
// point is 0.20 m up, so U = 1.10 m (the app's reference phone height).
import { computeVOR, rad, wrap360, wrap180, ANTENNA_HEIGHT_M, CONE_HALF_ANGLE_DEG, type VORReading } from './vor';

export const PHONE_HEIGHT_M = 1.3;
export const U = PHONE_HEIGHT_M - ANTENNA_HEIGHT_M;
/** Walking radius of the arcs, inside a 3 by 3 m floor. */
export const R_WALK = 1.45;
/** Horizontal radius of the cone footprint at the phone's height: U / tan(90 - α). */
export const CONE_FOOTPRINT_M = U / Math.tan(rad(90 - CONE_HALF_ANGLE_DEG));
export const CHAPTERS = 4;

/** The NDB lesson's fixed spot: 1.2 m north of the station, so the bearing to it is 180. */
export const ADF_E = 0;
export const ADF_N = 1.2;

export type Pose = { e: number; n: number; hdg: number; obs: number };

const clamp01 = (t: number) => Math.min(Math.max(t, 0), 1);
const smooth = (t: number) => { t = clamp01(t); return t * t * (3 - 2 * t); };
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const seg = (t: number, a: number, b: number) => clamp01((t - a) / (b - a));
const lerpAngle = (a: number, b: number, t: number) => wrap360(a + wrap180(b - a) * t);
const onArc = (radialDeg: number, r = R_WALK) => ({ e: r * Math.sin(rad(radialDeg)), n: r * Math.cos(rad(radialDeg)) });

/** Walking counter-clockwise round the station, the nose points 90° left of the radial. */
const tangentCCW = (radialDeg: number) => wrap360(radialDeg - 90);

const HERO_RADIAL = 50;
const HERO_HDG = 230; // facing the station
const CH1_END = 30;
const CH2_HDG = tangentCCW(CH1_END); // 300

export function poseAt(c: number): Pose {
  if (c <= 1) {
    // Hero: standing on the 050 radial, facing the station, OBS 225 (inbound on 045).
    return { ...onArc(HERO_RADIAL), hdg: HERO_HDG, obs: 225 };
  }
  if (c <= 2) {
    // 1. The phone is the aircraft: walk the arc 050 -> 030; the needle sweeps right to left.
    const t = c - 1;
    const radial = lerp(HERO_RADIAL, CH1_END, smooth(t));
    const hdg = lerpAngle(HERO_HDG, tangentCCW(radial), smooth(seg(t, 0, 0.3)));
    return { ...onArc(radial), hdg, obs: 225 };
  }
  if (c <= 3) {
    // 2. Turn in place: one full turn, nothing else changes.
    const t = c - 2;
    return { ...onArc(CH1_END), hdg: wrap360(CH2_HDG + 360 * smooth(seg(t, 0.1, 0.9))), obs: 225 };
  }
  if (c <= 4) {
    // 3. OBS to 180 (needle pegs right), then walk to the 360 radial (needle centres, TO).
    const t = c - 3;
    const obs = Math.round(lerp(225, 180, smooth(seg(t, 0, 0.3))));
    const radial = lerp(CH1_END, 0, smooth(seg(t, 0.3, 1)));
    return { ...onArc(radial), hdg: tangentCCW(radial), obs };
  }
  // 4. Inbound on the 360 radial, through the cone, overhead, out on the 180 radial (FROM).
  const t = Math.min(c - 4, 1);
  const n = t < 0.4 ? lerp(R_WALK, 0, smooth(seg(t, 0, 0.4))) : t < 0.6 ? 0 : lerp(0, -R_WALK, smooth(seg(t, 0.6, 1)));
  return { e: 0, n, hdg: lerpAngle(270, 180, smooth(seg(t, 0, 0.15))), obs: 180 };
}

/** The frame each chapter is remembered by: the reduced-motion state and the static caption. */
export const KEY_C = [0, 2, 2.42, 4, 4.5] as const;

export function readingAt(c: number, prev: VORReading | null = null) {
  const pose = poseAt(c);
  return { pose, reading: computeVOR(pose.e, pose.n, U, pose.obs, prev) };
}
