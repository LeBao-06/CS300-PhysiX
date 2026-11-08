/**
 * Simple Pendulum — result calculations for UC03.1.4.
 *
 * The UI shows these values; it must not recompute them. All inputs and
 * outputs are SI except percentages. Values are never rounded here: rounding
 * is a display concern and must not change stored values (Vision NFR).
 */

import { GUIDED_TRIAL_PLAN, smallAnglePeriod } from './pendulumModel';

/** Acceptance threshold for individual and pair deviations in Guided mode (%). */
export const GUIDED_DEVIATION_LIMIT_PERCENT = 5;

/** Confirmed row of the results table (a snapshot; never mutated). */
export interface PendulumTrialRecord {
    readonly trial: number;
    readonly lengthM: number;
    readonly massKg: number;
    readonly releaseAngleRad: number;
    /** Requested number of complete oscillations (not proof the user counted correctly). */
    readonly oscillationCount: number;
    /** Stopwatch reading (s). */
    readonly elapsedS: number;
}

/** Tmeasured = t / N (s). Throws on invalid input instead of fabricating a value. */
export function measuredPeriod(elapsedS: number, oscillationCount: number): number {
    if (!Number.isFinite(elapsedS) || elapsedS <= 0) {
        throw new RangeError(`Elapsed time must be positive and finite, got ${elapsedS}`);
    }
    if (!Number.isInteger(oscillationCount) || oscillationCount <= 0) {
        throw new RangeError(
            `Oscillation count must be a positive integer, got ${oscillationCount}`,
        );
    }
    return elapsedS / oscillationCount;
}

/** |measured − reference| / reference × 100 (%). */
export function deviationPercent(measured: number, reference: number): number {
    if (!Number.isFinite(reference) || reference === 0) {
        throw new RangeError(`Reference must be finite and non-zero, got ${reference}`);
    }
    return (Math.abs(measured - reference) / Math.abs(reference)) * 100;
}

export interface TrialResult {
    readonly trial: number;
    readonly measuredPeriodS: number;
    /** Small-angle reference 2π√(l/9.8) (s). */
    readonly referencePeriodS: number;
    readonly deviationPercent: number;
    readonly passed: boolean;
}

export function evaluateTrial(record: PendulumTrialRecord): TrialResult {
    const measured = measuredPeriod(record.elapsedS, record.oscillationCount);
    const reference = smallAnglePeriod(record.lengthM);
    const deviation = deviationPercent(measured, reference);
    return {
        trial: record.trial,
        measuredPeriodS: measured,
        referencePeriodS: reference,
        deviationPercent: deviation,
        passed: deviation <= GUIDED_DEVIATION_LIMIT_PERCENT,
    };
}

export interface PairResult {
    readonly earlierTrial: number;
    readonly laterTrial: number;
    /** Rmeasured = Tlater / Tearlier. */
    readonly measuredRatio: number;
    /** Rrequired = √(l_later / l_earlier): √2 for trials 1–2, 1 for 3–4 and 5–6. */
    readonly requiredRatio: number;
    readonly deviationPercent: number;
    readonly passed: boolean;
}

export function evaluatePair(
    earlier: TrialResult,
    later: TrialResult,
    earlierLengthM: number,
    laterLengthM: number,
): PairResult {
    const measuredRatio = later.measuredPeriodS / earlier.measuredPeriodS;
    const requiredRatio = Math.sqrt(laterLengthM / earlierLengthM);
    const deviation = deviationPercent(measuredRatio, requiredRatio);
    return {
        earlierTrial: earlier.trial,
        laterTrial: later.trial,
        measuredRatio,
        requiredRatio,
        deviationPercent: deviation,
        passed: deviation <= GUIDED_DEVIATION_LIMIT_PERCENT,
    };
}

export interface GuidedMeasurementAssessment {
    readonly trials: readonly TrialResult[];
    readonly pairs: readonly PairResult[];
    /** All six individual checks and all three pair checks pass. Conclusions are assessed separately. */
    readonly measurementsPassed: boolean;
}

/**
 * Measurement part of the final Guided assessment (UC03.1.4 steps 5–6).
 * Requires exactly the six confirmed rows of the Guided plan, in trial order.
 */
export function assessGuidedMeasurements(
    records: readonly PendulumTrialRecord[],
): GuidedMeasurementAssessment {
    if (records.length !== GUIDED_TRIAL_PLAN.length) {
        throw new RangeError(
            `Guided assessment needs ${GUIDED_TRIAL_PLAN.length} confirmed trials, got ${records.length}`,
        );
    }
    const ordered = [...records].sort((a, b) => a.trial - b.trial);
    const trials = ordered.map(evaluateTrial);
    const pairs: PairResult[] = [];
    for (let i = 0; i < ordered.length; i += 2) {
        pairs.push(
            evaluatePair(trials[i], trials[i + 1], ordered[i].lengthM, ordered[i + 1].lengthM),
        );
    }
    const measurementsPassed = trials.every((t) => t.passed) && pairs.every((p) => p.passed);
    return { trials, pairs, measurementsPassed };
}
