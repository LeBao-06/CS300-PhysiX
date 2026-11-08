/**
 * Shared contracts for PhysiX simulation solvers.
 *
 * Everything in `simulation-core` is pure TypeScript: no React, Three.js, DOM,
 * Zustand or network dependencies. All physical quantities are SI unless a
 * name says otherwise (for example `angleDeg`).
 */

/** Allowed closed interval [min, max] for one numeric parameter, in SI units. */
export interface ParameterBound {
    /** Machine name of the parameter, e.g. `lengthM`. */
    readonly key: string;
    readonly min: number;
    readonly max: number;
    /** SI unit symbol of `min`/`max`, e.g. `m`, `kg`, `rad`. */
    readonly unit: string;
}

export type ValidationIssueCode = 'NOT_A_NUMBER' | 'BELOW_MIN' | 'ABOVE_MAX';

/** One rejected parameter value. The UI turns this into a message next to the control. */
export interface ValidationIssue {
    readonly key: string;
    readonly code: ValidationIssueCode;
    /** The value that was rejected (may be NaN or Infinity). */
    readonly value: number;
    readonly min: number;
    readonly max: number;
    readonly unit: string;
}

export type ValidationResult =
    { readonly ok: true } | { readonly ok: false; readonly issues: readonly ValidationIssue[] };

/** Right-hand side of a first-order ODE system dy/dt = f(t, y). */
export type DerivativeFunction = (t: number, y: readonly number[]) => number[];
