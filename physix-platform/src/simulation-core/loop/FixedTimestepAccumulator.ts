/**
 * Decouples physics stepping from the render frame rate.
 *
 * Each frame passes the real elapsed time to `consume`; the accumulator returns
 * how many fixed steps of `stepS` to run. Because the solver always advances in
 * identical steps, the same sequence of steps gives the same result on a fast or
 * a slow computer.
 *
 * To avoid a "spiral of death" after a long pause (tab hidden, breakpoint), at
 * most `maxStepsPerConsume` steps are returned; the excess real time is dropped.
 * Simulation time then falls slightly behind wall-clock time, which is safe
 * because PhysiX measures every interval (including the stopwatch) in
 * simulation time.
 */
export class FixedTimestepAccumulator {
    readonly stepS: number;
    readonly maxStepsPerConsume: number;
    private accumulatedS = 0;

    constructor(stepS: number, maxStepsPerConsume: number) {
        if (!(stepS > 0) || !Number.isFinite(stepS)) {
            throw new RangeError(`stepS must be a positive finite number, got ${stepS}`);
        }
        if (!Number.isInteger(maxStepsPerConsume) || maxStepsPerConsume < 1) {
            throw new RangeError(
                `maxStepsPerConsume must be a positive integer, got ${maxStepsPerConsume}`,
            );
        }
        this.stepS = stepS;
        this.maxStepsPerConsume = maxStepsPerConsume;
    }

    /** Adds real elapsed time and returns the number of fixed steps to run now. */
    consume(realDeltaS: number): number {
        if (!Number.isFinite(realDeltaS) || realDeltaS <= 0) {
            return 0;
        }
        this.accumulatedS += realDeltaS;
        let steps = Math.floor(this.accumulatedS / this.stepS);
        if (steps > this.maxStepsPerConsume) {
            steps = this.maxStepsPerConsume;
            this.accumulatedS = 0;
        } else {
            this.accumulatedS -= steps * this.stepS;
        }
        return steps;
    }

    /**
     * Fraction (0–1) of a step left over after `consume`. The renderer uses it to
     * interpolate between the previous and the current physics state.
     */
    get alpha(): number {
        return Math.min(1, Math.max(0, this.accumulatedS / this.stepS));
    }

    reset(): void {
        this.accumulatedS = 0;
    }
}
