import type { BottomSheetWebCallbacks, ResolvedDetent } from './types.js';
/** The controller's state and effects that snapping drives. */
export type SnappingHost = {
    readonly detents: ResolvedDetent[];
    readonly hostHeight: number;
    readonly translateY: number;
    /** Seconds the settle spring takes. 0 uses the default. */
    readonly settleDuration: number;
    targetIndex: number;
    pendingIndex: number | null;
    scrimPinnedFull: boolean;
    setTranslateY(ty: number): void;
    requestFrame(): void;
    emitPosition(): void;
    updateCloseRequestRegistration(): void;
    emit(event: (callbacks: BottomSheetWebCallbacks) => void): void;
};
export declare class SheetSnapping {
    private readonly host;
    private spring;
    private springTargetIndex;
    springEmitsSettle: boolean;
    constructor(host: SnappingHost);
    get isSpringActive(): boolean;
    private detentAt;
    /** The resting position of the detent at an index. */
    detentPosition(index: number): number;
    translationY(index: number): number;
    snapCandidateIndices(including: number | null, detents?: ResolvedDetent[]): number[];
    draggableRange(including: number | null, detents?: ResolvedDetent[]): {
        minTy: number;
        maxTy: number;
    };
    bestSnapIndex(position: number, velocity: number, including: number | null, detents: ResolvedDetent[]): number;
    private get closedIndex();
    get scrimDismissIndex(): number | null;
    isTargetClosed(): boolean;
    currentTranslateY(time?: number): number;
    snapToIndex(index: number, velocity: number, emitIndexChange?: boolean, emitSettle?: boolean, preserveScrimPin?: boolean): void;
    cancelSpring(time?: number): number;
    private finishSpring;
    /** Advances the spring, if any, to a frame's time. */
    stepSpring(time: number): void;
}
//# sourceMappingURL=snapping.d.ts.map