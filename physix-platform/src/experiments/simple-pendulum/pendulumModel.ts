/**
 * Simple Pendulum — physical model, constants, units and parameter bounds.
 *
 * Sources: Vision 2.1 Feature 3; Use-Case Specification 2.3, UC03.1.1–UC03.1.4.
 * Full description: physix-platform/docs/physics/simple-pendulum-model.md
 *
 * Model assumptions (shown on the experiment introduction page):
 *  - the string is inextensible and massless, so l is constant;
 *  - the bob is a point mass at distance l from the suspension point;
 *  - no air resistance or friction at the pivot (no damping);
 *  - uniform gravity g = 9.8 m/s².
 * Equation of motion (full, non-linear): θ'' = −(g/l)·sin θ.
 * The bob mass does not appear in the equation; it is validated and displayed only.
 */

import type { ParameterBound } from '@simulation-core/contracts/Solver';

/** Gravitational acceleration fixed by the use case (m/s²). */
export const GRAVITY_M_PER_S2 = 9.8;

/** Fixed physics step: 1 ms. Gives a period error far below 0.01% (see tests). */
export const PENDULUM_STEP_S = 0.001;

/** Upper bound on physics steps per frame (0.25 s of simulation time). */
export const PENDULUM_MAX_STEPS_PER_FRAME = 250;

// ---------------------------------------------------------------------------
// Explicit unit conversions (Vision NFR: every unit conversion is explicit)
// ---------------------------------------------------------------------------

export function degToRad(angleDeg: number): number {
    return (angleDeg * Math.PI) / 180;
}

export function radToDeg(angleRad: number): number {
    return (angleRad * 180) / Math.PI;
}

export function gramsToKilograms(massG: number): number {
    return massG / 1000;
}

export function kilogramsToGrams(massKg: number): number {
    return massKg * 1000;
}

export function centimetresToMetres(lengthCm: number): number {
    return lengthCm / 100;
}

// ---------------------------------------------------------------------------
// Parameters and bounds
// ---------------------------------------------------------------------------

/** Settings chosen before a run, in SI units. */
export interface PendulumParameters {
    /** Suspension point to the centre of the bob (m). */
    readonly lengthM: number;
    /** Bob mass (kg). Does not affect the motion in this model. */
    readonly massKg: number;
}

export const LENGTH_BOUND: ParameterBound = { key: 'lengthM', min: 0.2, max: 1.5, unit: 'm' };
export const MASS_BOUND: ParameterBound = { key: 'massKg', min: 0.05, max: 0.2, unit: 'kg' };

/**
 * Bound on the magnitude |θ₀| of the release angle. The bob may be released on
 * either side of the vertical. 1°–10° is the small-angle domain (UC03.1.2 A9).
 */
export const RELEASE_ANGLE_BOUND: ParameterBound = {
    key: 'releaseAngleRad',
    min: degToRad(1),
    max: degToRad(10),
    unit: 'rad',
};

// ---------------------------------------------------------------------------
// Reference formulas
// ---------------------------------------------------------------------------

/** Small-angle reference period T = 2π√(l/g) (s). Used for all user-facing comparisons. */
export function smallAnglePeriod(lengthM: number, gravity = GRAVITY_M_PER_S2): number {
    return 2 * Math.PI * Math.sqrt(lengthM / gravity);
}

/** Arithmetic–geometric mean, converges quadratically. */
function arithmeticGeometricMean(a: number, b: number): number {
    let x = a;
    let y = b;
    for (let i = 0; i < 30 && Math.abs(x - y) > 1e-15 * x; i++) {
        const nextX = (x + y) / 2;
        y = Math.sqrt(x * y);
        x = nextX;
    }
    return x;
}

/** Complete elliptic integral of the first kind K(k), modulus k ∈ [0, 1). */
export function completeEllipticK(k: number): number {
    if (!(k >= 0 && k < 1)) {
        throw new RangeError(`Elliptic modulus must be in [0, 1), got ${k}`);
    }
    return Math.PI / (2 * arithmeticGeometricMean(1, Math.sqrt(1 - k * k)));
}

/**
 * Exact period of the undamped non-linear pendulum released from rest at θ₀:
 * T = 4√(l/g)·K(sin(θ₀/2)) (s). Used as an independent oracle in tests.
 */
export function exactPeriod(
    lengthM: number,
    releaseAngleRad: number,
    gravity = GRAVITY_M_PER_S2,
): number {
    const k = Math.sin(Math.abs(releaseAngleRad) / 2);
    return 4 * Math.sqrt(lengthM / gravity) * completeEllipticK(k);
}

// ---------------------------------------------------------------------------
// Guided plan (UC03.1.2 basic flow step 3, Use-Case Specification 2.3)
// ---------------------------------------------------------------------------

export interface GuidedTrialSetting {
    readonly trial: number;
    readonly lengthM: number;
    readonly massKg: number;
    readonly releaseAngleDeg: number;
}

/** Six trials in three controlled pairs: length (1–2), mass (3–4), release angle (5–6). */
export const GUIDED_TRIAL_PLAN: readonly GuidedTrialSetting[] = [
    { trial: 1, lengthM: 0.5, massKg: 0.1, releaseAngleDeg: 10 },
    { trial: 2, lengthM: 1.0, massKg: 0.1, releaseAngleDeg: 10 },
    { trial: 3, lengthM: 0.8, massKg: 0.05, releaseAngleDeg: 10 },
    { trial: 4, lengthM: 0.8, massKg: 0.2, releaseAngleDeg: 10 },
    { trial: 5, lengthM: 0.8, massKg: 0.1, releaseAngleDeg: 10 },
    { trial: 6, lengthM: 0.8, massKg: 0.1, releaseAngleDeg: 5 },
];

/** Required number of complete oscillations timed in each Guided trial. */
export const GUIDED_OSCILLATION_COUNT = 10;

/** Tolerance for "exactly matches after unit conversion" (0.5 m equals 0.50 m equals 50 cm). */
const SETTING_MATCH_TOLERANCE = 1e-9;

/**
 * Whether the prepared length and mass match a Guided trial (UC03.1.2 step 2).
 * Run stays disabled until this returns `true`.
 */
export function matchesGuidedSetting(
    params: PendulumParameters,
    setting: GuidedTrialSetting,
): { readonly lengthOk: boolean; readonly massOk: boolean } {
    return {
        lengthOk: Math.abs(params.lengthM - setting.lengthM) <= SETTING_MATCH_TOLERANCE,
        massOk: Math.abs(params.massKg - setting.massKg) <= SETTING_MATCH_TOLERANCE,
    };
}
