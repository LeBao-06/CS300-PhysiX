/**
 * Presentation-only interpolation between two consecutive physics states.
 *
 * Interpolated values are for drawing only. Measurements, tables and graphs
 * must read the authoritative (non-interpolated) solver state.
 */
export function lerp(previous: number, current: number, alpha: number): number {
    return previous + (current - previous) * alpha;
}
