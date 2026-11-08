/**
 * Simple Pendulum — one measurement run, from preparation to Stop timer.
 *
 * Owns the authoritative physics state and the stopwatch so that the 3D scene
 * (Phúc) and the readings/table (Huy) read the same values and never recompute
 * physics. Implements the run lifecycle of UC03.1.2 / UC03.1.3:
 *
 *   setup ──arm()──▶ armed ──release()──▶ swinging ──stopTimer()──▶ frozen
 *     ▲                │                     │                         │
 *     └────────────────┴──── resetTrial() ───┴─────────────────────────┘
 *
 *  - setup:    length and mass may be changed (`setParameters`).
 *  - armed:    "Run" was pressed; the stopwatch reads 0; only the bob can be
 *              dragged (`setDragAngle`), clamped to ±10°.
 *  - swinging: the bob moves; the stopwatch may be started once, then stopped.
 *  - frozen:   Stop timer froze both motion and stopwatch; the measurement is
 *              available. Nothing changes until `resetTrial()`.
 *  - error:    the solver produced a non-finite value; the measurement is
 *              discarded and the user must retry (UC03.1.2 A5).
 *
 * Recorded trials are NOT stored here; the store keeps confirmed rows as
 * snapshots, so `resetTrial()` can never lose recorded data.
 *
 * Time: all times are simulation time (s), advanced in fixed 1 ms steps. The
 * stopwatch starts/stops at the simulation time reached when the user's input
 * is processed; it is never backdated or aligned to the release.
 */

import { FixedTimestepAccumulator } from '@simulation-core/loop/FixedTimestepAccumulator';
import { lerp } from '@simulation-core/loop/StateInterpolator';
import { clampToBound } from '@simulation-core/validation/parameterBounds';

import {
    PENDULUM_MAX_STEPS_PER_FRAME,
    PENDULUM_STEP_S,
    type PendulumParameters,
    RELEASE_ANGLE_BOUND,
} from './pendulumModel';
import {
    type BobPosition,
    bobPosition,
    initialState,
    type PendulumState,
    stepPendulum,
    validatePendulumParameters,
    validateReleaseAngle,
} from './pendulumSolver';

export type PendulumRunStatus = 'setup' | 'armed' | 'swinging' | 'frozen' | 'error';
export type StopwatchState = 'idle' | 'running' | 'stopped';

/** Why an action was refused; the UI maps each code to a message. */
export type PendulumActionError =
    'INVALID_PARAMETERS' | 'RELEASE_ANGLE_OUT_OF_RANGE' | 'WRONG_STATUS' | 'TIMER_NOT_ALLOWED';

export type ActionResult =
    { readonly accepted: true } | { readonly accepted: false; readonly error: PendulumActionError };

/** Stopwatch interval measured in one run (simulation time, s). */
export interface StopwatchMeasurement {
    readonly startedAtS: number;
    readonly stoppedAtS: number;
    readonly elapsedS: number;
}

/** Everything the renderer and the measurement panel need, at one instant. */
export interface PendulumSnapshot {
    readonly status: PendulumRunStatus;
    readonly parameters: PendulumParameters;
    /** Simulation time since release (s); 0 before release. */
    readonly timeS: number;
    readonly angleRad: number;
    readonly angularVelocityRadPerS: number;
    /** Bob centre relative to the suspension point (m). */
    readonly bob: BobPosition;
    /** Release angle used for this run (rad), or null before release. */
    readonly releaseAngleRad: number | null;
    readonly stopwatch: {
        readonly state: StopwatchState;
        /** Live reading (s): 0 when idle, running time, or the frozen value. */
        readonly readingS: number;
    };
    /**
     * Period of the last full cycle detected by the solver (s), or null before
     * one full cycle. For verification and AI context only: the Guided UI must
     * not display it during data collection (UC03.1.2 step 8).
     */
    readonly simulatedPeriodS: number | null;
}

const ok: ActionResult = { accepted: true };
const refuse = (error: PendulumActionError): ActionResult => ({ accepted: false, error });

export class PendulumSimulation {
    private params: PendulumParameters;
    private status: PendulumRunStatus = 'setup';
    private state: PendulumState = initialState(0);
    private previousState: PendulumState = initialState(0);
    private releaseAngleRad: number | null = null;
    private readonly accumulator = new FixedTimestepAccumulator(
        PENDULUM_STEP_S,
        PENDULUM_MAX_STEPS_PER_FRAME,
    );

    private timerStartedAtS: number | null = null;
    private timerStoppedAtS: number | null = null;

    /** Times (s) of the last two zero crossings in the first-pass direction. */
    private sameDirectionCrossings: number[] = [];

    constructor(initialParameters: PendulumParameters) {
        this.params = initialParameters;
    }

    // ----------------------------------------------------------------- setup

    /** Changes length/mass. Only allowed in `setup`; invalid values are refused and kept out. */
    setParameters(next: PendulumParameters): ActionResult {
        if (this.status !== 'setup') return refuse('WRONG_STATUS');
        if (!validatePendulumParameters(next).ok) return refuse('INVALID_PARAMETERS');
        this.params = next;
        return ok;
    }

    /** "Run": arms the release. Requires valid parameters. The stopwatch reads 0. */
    arm(): ActionResult {
        if (this.status !== 'setup') return refuse('WRONG_STATUS');
        if (!validatePendulumParameters(this.params).ok) return refuse('INVALID_PARAMETERS');
        this.status = 'armed';
        this.setHeldAngle(0);
        return ok;
    }

    // ---------------------------------------------------------------- armed

    /**
     * Moves the held bob while dragging. The angle is clamped to ±10° so the bob
     * cannot be dragged beyond the allowed range (UC03.1.2 A9). Returns the
     * angle actually applied (rad).
     */
    setDragAngle(angleRad: number): number {
        if (this.status !== 'armed') return this.state.angleRad;
        const max = RELEASE_ANGLE_BOUND.max;
        const applied = clampToBound(angleRad, -max, max, this.state.angleRad);
        this.setHeldAngle(applied);
        return applied;
    }

    /**
     * Releases the bob at the current drag angle. A release below 1° is refused;
     * the bob stays held at its last valid position. The stopwatch does not start.
     */
    release(): ActionResult {
        if (this.status !== 'armed') return refuse('WRONG_STATUS');
        const angle = this.state.angleRad;
        if (!validateReleaseAngle(angle).ok) return refuse('RELEASE_ANGLE_OUT_OF_RANGE');
        this.releaseAngleRad = angle;
        this.state = initialState(angle);
        this.previousState = this.state;
        this.accumulator.reset();
        this.sameDirectionCrossings = [];
        this.status = 'swinging';
        return ok;
    }

    // ------------------------------------------------------------- swinging

    /**
     * Advances the motion by the real time elapsed since the last frame (s).
     * Returns the number of fixed physics steps run. No motion outside `swinging`.
     */
    advance(realDeltaS: number): number {
        if (this.status !== 'swinging') return 0;
        const steps = this.accumulator.consume(realDeltaS);
        for (let i = 0; i < steps; i++) {
            const next = stepPendulum(this.state, this.params.lengthM, PENDULUM_STEP_S);
            if (!Number.isFinite(next.angleRad) || !Number.isFinite(next.angularVelocityRadPerS)) {
                this.failRun();
                return i;
            }
            this.trackCrossing(this.state, next);
            this.previousState = this.state;
            this.state = next;
        }
        return steps;
    }

    /** Start timer (button or T key). Only once, only after release (UC03.1.2 A2). */
    startTimer(): ActionResult {
        if (this.status !== 'swinging' || this.timerStartedAtS !== null) {
            return refuse('TIMER_NOT_ALLOWED');
        }
        this.timerStartedAtS = this.state.timeS;
        return ok;
    }

    /** Stop timer (button or T key). Freezes both the stopwatch and the pendulum. */
    stopTimer(): ActionResult {
        if (this.status !== 'swinging' || this.timerStartedAtS === null) {
            return refuse('TIMER_NOT_ALLOWED');
        }
        this.timerStoppedAtS = this.state.timeS;
        this.previousState = this.state;
        this.status = 'frozen';
        return ok;
    }

    /** Convenience for the T key: start if idle, stop if running, otherwise ignore. */
    toggleTimer(): ActionResult {
        return this.timerStartedAtS === null ? this.startTimer() : this.stopTimer();
    }

    // --------------------------------------------------------------- frozen

    /** The measured interval, available only after Stop timer. */
    getMeasurement(): StopwatchMeasurement | null {
        if (this.status !== 'frozen' || this.timerStartedAtS === null) return null;
        const stoppedAtS = this.timerStoppedAtS ?? this.timerStartedAtS;
        return {
            startedAtS: this.timerStartedAtS,
            stoppedAtS,
            elapsedS: stoppedAtS - this.timerStartedAtS,
        };
    }

    /**
     * Retry / Reset Trial / Next trial: back to `setup` with the same parameters.
     * Clears only this run's unconfirmed reading.
     */
    resetTrial(): void {
        this.status = 'setup';
        this.releaseAngleRad = null;
        this.state = initialState(0);
        this.previousState = this.state;
        this.accumulator.reset();
        this.timerStartedAtS = null;
        this.timerStoppedAtS = null;
        this.sameDirectionCrossings = [];
    }

    // ---------------------------------------------------------------- read

    getSnapshot(): PendulumSnapshot {
        return this.buildSnapshot(this.state.angleRad);
    }

    /**
     * Snapshot whose angle and bob position are interpolated between the last two
     * physics steps, for smooth drawing. Measurements must use `getSnapshot()`.
     */
    getRenderSnapshot(): PendulumSnapshot {
        const alpha = this.status === 'swinging' ? this.accumulator.alpha : 1;
        return this.buildSnapshot(lerp(this.previousState.angleRad, this.state.angleRad, alpha));
    }

    // ------------------------------------------------------------- private

    private buildSnapshot(angleRad: number): PendulumSnapshot {
        return {
            status: this.status,
            parameters: this.params,
            timeS: this.state.timeS,
            angleRad,
            angularVelocityRadPerS: this.state.angularVelocityRadPerS,
            bob: bobPosition(angleRad, this.params.lengthM),
            releaseAngleRad: this.releaseAngleRad,
            stopwatch: { state: this.stopwatchState(), readingS: this.stopwatchReading() },
            simulatedPeriodS: this.simulatedPeriod(),
        };
    }

    private setHeldAngle(angleRad: number): void {
        this.state = { timeS: 0, angleRad, angularVelocityRadPerS: 0 };
        this.previousState = this.state;
    }

    private failRun(): void {
        this.status = 'error';
        this.timerStartedAtS = null;
        this.timerStoppedAtS = null;
    }

    private stopwatchState(): StopwatchState {
        if (this.timerStartedAtS === null) return 'idle';
        return this.timerStoppedAtS === null ? 'running' : 'stopped';
    }

    private stopwatchReading(): number {
        if (this.timerStartedAtS === null) return 0;
        const end = this.timerStoppedAtS ?? this.state.timeS;
        return end - this.timerStartedAtS;
    }

    /**
     * Records the time of each zero crossing in the direction opposite to the
     * release side (the bob's first pass through the vertical). Consecutive such
     * crossings are one full period apart. The crossing time is linearly
     * interpolated within the 1 ms step.
     */
    private trackCrossing(before: PendulumState, after: PendulumState): void {
        const side = Math.sign(this.releaseAngleRad ?? 0);
        if (side === 0) return;
        const crossed = before.angleRad * side > 0 && after.angleRad * side <= 0;
        if (!crossed) return;
        const fraction = before.angleRad / (before.angleRad - after.angleRad);
        const crossingTime = before.timeS + fraction * (after.timeS - before.timeS);
        this.sameDirectionCrossings.push(crossingTime);
        if (this.sameDirectionCrossings.length > 2) this.sameDirectionCrossings.shift();
    }

    private simulatedPeriod(): number | null {
        const [first, second] = this.sameDirectionCrossings;
        return second === undefined ? null : second - first;
    }
}
