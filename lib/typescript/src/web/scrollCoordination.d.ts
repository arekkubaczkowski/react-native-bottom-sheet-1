import type { BottomSheetWebConfig } from './types.js';
export declare const COORDINATION_NONE = 0;
export declare const COORDINATION_HANDOFF = 2;
export type ScrollableEntry = Readonly<{
    element: HTMLElement;
    inverted: boolean;
}>;
/** Whether a scrollable shows the visual top of its content. */
export declare const isAtStart: (entry: ScrollableEntry, requireExactOffset?: boolean) => boolean;
export declare const scrollableChain: (target: EventTarget | null, container: HTMLElement | undefined) => ScrollableEntry[];
export declare const coordinationLevel: (deltaY: number, config: BottomSheetWebConfig) => number;
/** Scrolls the chain, innermost first, as a finger moving by `delta` would. */
export declare const scrollChainBy: (chain: ScrollableEntry[], delta: number) => void;
export declare class ScrollMomentum {
    private readonly requestFrame;
    private momentum;
    constructor(requestFrame: () => void);
    get isActive(): boolean;
    cancel(): void;
    start(chain: ScrollableEntry[], velocity: number): void;
    step(elapsed: number): void;
}
//# sourceMappingURL=scrollCoordination.d.ts.map