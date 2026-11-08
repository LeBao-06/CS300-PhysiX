import type { DerivativeFunction } from '../../contracts/Solver';

/**
 * One classical fourth-order Runge–Kutta step for dy/dt = f(t, y).
 *
 * Local error is O(dt^5), global error O(dt^4). The function is pure: it never
 * mutates `y` and always returns a new array.
 */
export function rk4Step(
    f: DerivativeFunction,
    t: number,
    y: readonly number[],
    dt: number,
): number[] {
    const n = y.length;
    const k1 = f(t, y);
    const y2 = new Array<number>(n);
    for (let i = 0; i < n; i++) y2[i] = y[i] + 0.5 * dt * k1[i];
    const k2 = f(t + 0.5 * dt, y2);
    const y3 = new Array<number>(n);
    for (let i = 0; i < n; i++) y3[i] = y[i] + 0.5 * dt * k2[i];
    const k3 = f(t + 0.5 * dt, y3);
    const y4 = new Array<number>(n);
    for (let i = 0; i < n; i++) y4[i] = y[i] + dt * k3[i];
    const k4 = f(t + dt, y4);

    const next = new Array<number>(n);
    for (let i = 0; i < n; i++) {
        next[i] = y[i] + (dt / 6) * (k1[i] + 2 * k2[i] + 2 * k3[i] + k4[i]);
    }
    return next;
}
