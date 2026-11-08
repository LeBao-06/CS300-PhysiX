import type { ParameterBound, ValidationIssue, ValidationResult } from '../contracts/Solver';

/**
 * Relative tolerance used when comparing a value with a bound.
 *
 * Unit conversions (for example 10° → rad) introduce rounding of about 1e-16,
 * which must not make an exact boundary value fail validation.
 */
export const BOUND_RELATIVE_TOLERANCE = 1e-9;

function tolerance(bound: number): number {
    return Math.max(Math.abs(bound), 1) * BOUND_RELATIVE_TOLERANCE;
}

/** Checks one value against its bound. Returns `null` when the value is accepted. */
export function checkBound(value: number, bound: ParameterBound): ValidationIssue | null {
    const base = { key: bound.key, value, min: bound.min, max: bound.max, unit: bound.unit };
    if (typeof value !== 'number' || !Number.isFinite(value)) {
        return { ...base, code: 'NOT_A_NUMBER' };
    }
    if (value < bound.min - tolerance(bound.min)) {
        return { ...base, code: 'BELOW_MIN' };
    }
    if (value > bound.max + tolerance(bound.max)) {
        return { ...base, code: 'ABOVE_MAX' };
    }
    return null;
}

/** Checks several values; collects every issue instead of stopping at the first. */
export function validateAgainstBounds(
    entries: ReadonlyArray<readonly [value: number, bound: ParameterBound]>,
): ValidationResult {
    const issues = entries
        .map(([value, bound]) => checkBound(value, bound))
        .filter((issue): issue is ValidationIssue => issue !== null);
    return issues.length === 0 ? { ok: true } : { ok: false, issues };
}

/** Clamps a finite value into [min, max]. Non-finite values return `fallback`. */
export function clampToBound(value: number, min: number, max: number, fallback: number): number {
    if (!Number.isFinite(value)) {
        return fallback;
    }
    return Math.min(max, Math.max(min, value));
}
