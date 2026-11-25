import { type ScrollMomentum } from './scrollCoordination.js';
import type { SheetSnapping } from './snapping.js';
import type { BottomSheetWebConfig, BottomSheetWebElements, ResolvedDetent } from './types.js';
/** The controller's state and effects that a gesture reads and drives. */
export type GesturesHost = {
    readonly elements: BottomSheetWebElements | null;
    readonly detents: ResolvedDetent[];
    readonly hostHeight: number;
    readonly translateY: number;
    readonly hasLaidOut: boolean;
    readonly targetIndex: number;
    readonly snapping: Pick<SheetSnapping, 'isSpringActive' | 'bestSnapIndex' | 'cancelSpring' | 'currentTranslateY' | 'draggableRange' | 'snapCandidateIndices' | 'snapToIndex'>;
    readonly momentum: Pick<ScrollMomentum, 'cancel' | 'start'>;
    isPanning: boolean;
    pendingIndex: number | null;
    scrimPinnedFull: boolean;
    requireConfig(): BottomSheetWebConfig;
    setTranslateY(ty: number): void;
    emitPosition(): void;
};
export declare class SheetGestures {
    private readonly host;
    private gesture;
    private suppressClicksUntil;
    private restoreUserSelect;
    constructor(host: GesturesHost);
    addListeners(container: HTMLElement): void;
    removeListeners(container: HTMLElement): void;
    /** Drops any gesture in progress. */
    reset(): void;
    /** Whether React Native for Web should hand the responder to the sheet. */
    shouldCaptureResponder(): boolean;
    private readonly handlePointerDown;
    private setWindowPointerListeners;
    private readonly handlePointerMove;
    private readonly handlePointerUp;
    private readonly handleTouchStart;
    private readonly handleTouchMove;
    private readonly handleTouchEnd;
    private readonly handleContainerClick;
    private beginGesture;
    /** Port of the native `gestureRecognizerShouldBegin`. */
    private shouldBegin;
    /** Port of the native pan `.began` state. */
    private startPan;
    /** Returns whether the move belongs to the sheet and must not scroll. */
    private moveGesture;
    private endGesture;
    private releaseVelocity;
}
//# sourceMappingURL=gestures.d.ts.map