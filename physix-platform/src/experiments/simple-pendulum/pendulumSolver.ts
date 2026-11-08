/**
 * Simple Pendulum — pure solver functions (no state, no rendering).
 *
 * State vector: [θ (rad), ω (rad/s)]. θ = 0 is straight down; positive θ swings
 * the bob towards +x.
 */

import type { ValidationResult } from '@simulation-core/contracts/Solver';
import { rk4Step } from '@simulation-core/solvers/ode/rk4Solver';
import { validateAgainstBounds } from '@simulation-core/validation/parameterBounds';

import {
    GRAVITY_M_PER_S2,
    LENGTH_BOUND,
    MASS_BOUND,
    type PendulumParameters,
    RELEASE_ANGLE_BOUND,
} from './pendulumModel';

export interface PendulumState {
    /** Simulation time since release (s). */
    readonly timeS: number;
    /** Angular displacement from the vertical (rad). */
    readonly angleRad: number;
    /** Angular velocity (rad/s). */
    readonly angularVelocityRadPerS: number;
}

/** Bob centre relative to the suspension point (m); +x right, +y up. */
export interface BobPosition {
    readonly x: number;
    readonly y: number;
}

/** Validates length and mass (every issue is reported, not only the first). */
export function validatePendulumParameters(params: PendulumParameters): ValidationResult {
    return validateAgainstBounds([
        [params.lengthM, LENGTH_BOUND],
        [params.massKg, MASS_BOUND],
    ]);
}

/** Validates the magnitude of a release angle (rad); either side of the vertical is allowed. */
export function validateReleaseAngle(releaseAngleRad: number): ValidationResult {
    return validateAgainstBounds([[Math.abs(releaseAngleRad), RELEASE_ANGLE_BOUND]]);
}

/** State at the moment of release: displaced by θ₀ and at rest. */
export function initialState(releaseAngleRad: number): PendulumState {
    return { timeS: 0, angleRad: releaseAngleRad, angularVelocityRadPerS: 0 };
}

/** Advances the state by one fixed step `dt` with RK4 on θ'' = −(g/l)·sin θ. */
export function stepPendulum(
    state: PendulumState,
    lengthM: number,
    dt: number,
    gravity = GRAVITY_M_PER_S2,
): PendulumState {
    const omegaSquared = gravity / lengthM;
    const [angleRad, angularVelocityRadPerS] = rk4Step(
        (_t, y) => [y[1], -omegaSquared * Math.sin(y[0])],
        state.timeS,
        [state.angleRad, state.angularVelocityRadPerS],
        dt,
    );
    return { timeS: state.timeS + dt, angleRad, angularVelocityRadPerS };
}

export function bobPosition(angleRad: number, lengthM: number): BobPosition {
    return { x: lengthM * Math.sin(angleRad), y: -lengthM * Math.cos(angleRad) };
}

/** Linear speed of the bob (m/s). */
export function bobSpeed(state: PendulumState, lengthM: number): number {
    return Math.abs(state.angularVelocityRadPerS) * lengthM;
}

/**
 * Mechanical energy per unit mass (J/kg), zero at the lowest point.
 * Conserved by the ideal model; tests use its drift to check the integrator.
 */
export function specificEnergy(
    state: PendulumState,
    lengthM: number,
    gravity = GRAVITY_M_PER_S2,
): number {
    const kinetic = 0.5 * (state.angularVelocityRadPerS * lengthM) ** 2;
    const potential = gravity * lengthM * (1 - Math.cos(state.angleRad));
    return kinetic + potential;
}
