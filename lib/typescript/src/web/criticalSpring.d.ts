/**
 * Critically damped (ζ = 1) spring; see `CriticalSpring.swift`. The stiffness is
 * picked so the sheet looks settled (within ~0.5% of target) right at the
 * duration: for a critically-damped spring that point is ω·t ≈ 8.
 */
export declare class CriticalSpring {
    readonly from: number;
    readonly target: number;
    /** Initial velocity in pixels per second. */
    readonly v0: number;
    /** `performance.now()` timestamp the curve starts at. */
    readonly startTime: number;
    /** Seconds the spring takes. */
    readonly duration: number;
    private readonly omega;
    constructor(from: number, target: number, 
    /** Initial velocity in pixels per second. */
    v0: number, 
    /** `performance.now()` timestamp the curve starts at. */
    startTime: number, 
    /** Seconds the spring takes. */
    duration: number);
    /**
     * Position at a `performance.now()` timestamp. The spring only approaches its
     * target, so the offset left at `duration` is scaled out of the whole curve:
     * it starts at `from`, keeps its shape, and lands on `target` at `duration`
     * rather than jumping the leftover when the settle finishes.
     */
    value(time: number): number;
    isFinished(time: number): boolean;
    /** Offset from the target `t` seconds in. */
    private offset;
}
//# sourceMappingURL=criticalSpring.d.ts.map