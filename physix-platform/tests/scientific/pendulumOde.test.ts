/**
 * Simple Pendulum solver — acceptance checks for SCRUM-19.
 *
 * The full reference suite (boundary/invalid matrices, hand-calculated
 * reference tables, UI cross-checks) is SCRUM-20. Reference equations:
 *  - exact period: T = 4√(l/g)·K(sin(θ₀/2))   (independent oracle, ≤ 0.01 %)
 *  - small angle:  T = 2π√(l/g)               (Vision criterion, ≤ 1 % for 1°–10°)
 * Assumptions: undamped point-mass pendulum, inextensible string, g = 9.8 m/s².
 */

import {
    assessGuidedMeasurements,
    completeEllipticK,
    degToRad,
    exactPeriod,
    GUIDED_OSCILLATION_COUNT,
    GUIDED_TRIAL_PLAN,
    initialState,
    PENDULUM_STEP_S,
    PendulumSimulation,
    type PendulumTrialRecord,
    smallAnglePeriod,
    specificEnergy,
    stepPendulum,
    validatePendulumParameters,
    validateReleaseAngle,
} from '@experiments/simple-pendulum';
import { describe, expect, it } from 'vitest';

/** Feeds real time to the simulation in 60 fps frames, as the render loop would. */
function advanceFor(sim: PendulumSimulation, seconds: number): void {
    const frame = 1 / 60;
    for (let t = 0; t < seconds - 1e-12; t += frame) sim.advance(Math.min(frame, seconds - t));
}

/** Runs a released pendulum and returns its simulated period (s). */
function simulatedPeriod(lengthM: number, releaseAngleDeg: number): number {
    const sim = new PendulumSimulation({ lengthM, massKg: 0.1 });
    sim.arm();
    sim.setDragAngle(degToRad(releaseAngleDeg));
    expect(sim.release().accepted).toBe(true);
    const twoPeriods = 2.2 * exactPeriod(lengthM, degToRad(releaseAngleDeg));
    advanceFor(sim, twoPeriods);
    const period = sim.getSnapshot().simulatedPeriodS;
    expect(period).not.toBeNull();
    return period as number;
}

describe('reference formulas', () => {
    it('K(0) = π/2 and T(θ₀→0) equals the small-angle period', () => {
        expect(completeEllipticK(0)).toBeCloseTo(Math.PI / 2, 14);
        expect(exactPeriod(1, 1e-8)).toBeCloseTo(smallAnglePeriod(1), 12);
    });

    it('small-angle period for l = 1.00 m, g = 9.8 m/s² is 2.0071 s (hand value)', () => {
        expect(smallAnglePeriod(1)).toBeCloseTo(2.00709, 5);
    });
});

describe('simulated period', () => {
    const lengths = [0.2, 0.5, 0.8, 1.0, 1.5];
    const angles = [1, 5, 10];

    for (const l of lengths) {
        for (const a of angles) {
            it(`l = ${l} m, θ₀ = ${a}°: matches exact period within 0.01 % and 2π√(l/g) within 1 %`, () => {
                const t = simulatedPeriod(l, a);
                const exact = exactPeriod(l, degToRad(a));
                expect(Math.abs(t - exact) / exact).toBeLessThan(1e-4);
                expect(Math.abs(t - smallAnglePeriod(l)) / smallAnglePeriod(l)).toBeLessThan(0.01);
            });
        }
    }

    it('the period is slightly longer at 10° than at 5° (non-linear model)', () => {
        expect(simulatedPeriod(0.8, 10)).toBeGreaterThan(simulatedPeriod(0.8, 5));
    });
});

describe('frame loop', () => {
    it('caps catch-up after a long pause at 0.25 s of simulation time', () => {
        const sim = new PendulumSimulation({ lengthM: 0.5, massKg: 0.1 });
        sim.arm();
        sim.setDragAngle(degToRad(5));
        sim.release();
        expect(sim.advance(5)).toBe(250);
        expect(sim.getSnapshot().timeS).toBeCloseTo(0.25, 9);
    });
});

describe('integrator quality', () => {
    it('conserves energy to 1e-8 relative over 60 s at θ₀ = 10°', () => {
        const l = 0.2;
        let s = initialState(degToRad(10));
        const e0 = specificEnergy(s, l);
        for (let i = 0; i < 60 / PENDULUM_STEP_S; i++) s = stepPendulum(s, l, PENDULUM_STEP_S);
        expect(Math.abs(specificEnergy(s, l) - e0) / e0).toBeLessThan(1e-8);
    });

    it('gives bit-identical states for the same step count, whatever the frame rate', () => {
        const runWithFrames = (frameS: number) => {
            const sim = new PendulumSimulation({ lengthM: 0.8, massKg: 0.1 });
            sim.arm();
            sim.setDragAngle(degToRad(7));
            sim.release();
            let steps = 0;
            while (steps < 3000)
                steps += sim.advance(Math.min(frameS, (3000 - steps) * PENDULUM_STEP_S));
            return sim.getSnapshot();
        };
        let direct = initialState(degToRad(7));
        for (let i = 0; i < 3000; i++) direct = stepPendulum(direct, 0.8, PENDULUM_STEP_S);

        for (const frame of [1 / 30, 1 / 60, 1 / 144]) {
            const snap = runWithFrames(frame);
            expect(snap.angleRad).toBe(direct.angleRad);
            expect(snap.angularVelocityRadPerS).toBe(direct.angularVelocityRadPerS);
        }
    });
});

describe('input validation', () => {
    it('accepts the bounds and rejects values outside or non-numeric', () => {
        expect(validatePendulumParameters({ lengthM: 0.2, massKg: 0.05 }).ok).toBe(true);
        expect(validatePendulumParameters({ lengthM: 1.5, massKg: 0.2 }).ok).toBe(true);
        const bad = validatePendulumParameters({ lengthM: 0.19, massKg: Number.NaN });
        expect(bad.ok).toBe(false);
        if (!bad.ok) expect(bad.issues.map((i) => i.code)).toEqual(['BELOW_MIN', 'NOT_A_NUMBER']);
        expect(validateReleaseAngle(degToRad(10)).ok).toBe(true);
        expect(validateReleaseAngle(degToRad(-1)).ok).toBe(true);
        expect(validateReleaseAngle(degToRad(0.5)).ok).toBe(false);
    });
});

describe('run lifecycle (UC03.1.2)', () => {
    it('clamps drag to 10°, refuses release below 1°, and ignores timer input before release', () => {
        const sim = new PendulumSimulation({ lengthM: 0.5, massKg: 0.1 });
        expect(sim.startTimer().accepted).toBe(false);
        sim.arm();
        expect(sim.setDragAngle(degToRad(15))).toBeCloseTo(degToRad(10), 12);
        sim.setDragAngle(degToRad(0.5));
        expect(sim.release()).toEqual({ accepted: false, error: 'RELEASE_ANGLE_OUT_OF_RANGE' });
        expect(sim.toggleTimer().accepted).toBe(false);
    });

    it('locks parameters during a run and freezes motion and stopwatch on Stop', () => {
        const sim = new PendulumSimulation({ lengthM: 0.5, massKg: 0.1 });
        sim.arm();
        expect(sim.setParameters({ lengthM: 1, massKg: 0.1 }).accepted).toBe(false);
        sim.setDragAngle(degToRad(10));
        sim.release();
        advanceFor(sim, 0.5);
        expect(sim.getSnapshot().stopwatch.readingS).toBe(0);
        sim.toggleTimer();
        advanceFor(sim, 2);
        sim.toggleTimer();
        const frozen = sim.getSnapshot();
        expect(frozen.status).toBe('frozen');
        expect(sim.getMeasurement()?.elapsedS).toBeCloseTo(2, 2);
        expect(sim.advance(1)).toBe(0);
        expect(sim.getSnapshot().angleRad).toBe(frozen.angleRad);
        expect(sim.toggleTimer().accepted).toBe(false);
        sim.resetTrial();
        expect(sim.getSnapshot().status).toBe('setup');
        expect(sim.getSnapshot().stopwatch.state).toBe('idle');
        expect(sim.getSnapshot().parameters.lengthM).toBe(0.5);
    });
});

describe('Guided measurement assessment (UC03.1.4)', () => {
    const recordsWithScale = (scale: (trial: number) => number): PendulumTrialRecord[] =>
        GUIDED_TRIAL_PLAN.map((s) => ({
            trial: s.trial,
            lengthM: s.lengthM,
            massKg: s.massKg,
            releaseAngleRad: degToRad(s.releaseAngleDeg),
            oscillationCount: GUIDED_OSCILLATION_COUNT,
            elapsedS: GUIDED_OSCILLATION_COUNT * smallAnglePeriod(s.lengthM) * scale(s.trial),
        }));

    it('passes ideal timings and uses √2 as the required ratio for trials 1–2', () => {
        const result = assessGuidedMeasurements(recordsWithScale(() => 1));
        expect(result.measurementsPassed).toBe(true);
        expect(result.pairs[0].requiredRatio).toBeCloseTo(Math.SQRT2, 12);
        expect(result.pairs[1].requiredRatio).toBe(1);
    });

    it('fails a pair check even when each trial is individually within 5 %', () => {
        const result = assessGuidedMeasurements(
            recordsWithScale((t) => (t === 3 ? 0.96 : t === 4 ? 1.04 : 1)),
        );
        expect(result.trials.every((t) => t.passed)).toBe(true);
        expect(result.pairs[1].passed).toBe(false);
        expect(result.measurementsPassed).toBe(false);
    });
});
