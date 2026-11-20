import { ScrollMomentum } from './scrollCoordination.js';
import { SheetSnapping } from './snapping.js';
import type { BottomSheetWebCallbacks, BottomSheetWebConfig, BottomSheetWebElements, RawDetent, ResolvedDetent } from './types.js';
export declare class BottomSheetWebController {
    elements: BottomSheetWebElements | null;
    private callbacks;
    private deferredEvents;
    config: BottomSheetWebConfig | null;
    private appliedIndex;
    rawDetents: ReadonlyArray<RawDetent>;
    /** The widest card's side gaps, which the content is laid out against. */
    widestCardInsets: {
        insetLeft: number;
        insetRight: number;
    };
    /**
     * Where the browser laid out the content: at the widest card's inset on the
     * start edge, or, under `maxWidth`, wherever that put the capped box. Read
     * from the DOM, so it follows the layout direction.
     */
    widestCardLeft: number;
    statusBarOverlap: number;
    detents: ResolvedDetent[];
    targetIndex: number;
    pendingIndex: number | null;
    hasLaidOut: boolean;
    hostHeight: number;
    private lastAppliedHostHeight;
    private appliedSurfaceOverflow;
    translateY: number;
    lastReportedError: string | null;
    scrimPinnedFull: boolean;
    isPanning: boolean;
    private frameRequest;
    private lastFrameTime;
    private needsLayout;
    private resizeObserver;
    private mutationObserver;
    readonly snapping: SheetSnapping;
    readonly momentum: ScrollMomentum;
    private readonly card;
    private readonly gestures;
    attach(elements: BottomSheetWebElements): void;
    detach(): void;
    setCallbacks(callbacks: BottomSheetWebCallbacks): void;
    /** Applies the latest props, in the order the native hosts receive them. */
    update(config: BottomSheetWebConfig): void;
    private applyConfig;
    emit(event: (callbacks: BottomSheetWebCallbacks) => void): void;
    /** Whether React Native for Web should hand the responder to the sheet. */
    readonly shouldCaptureResponder: () => boolean;
    private get hasCloseRequestHandler();
    private get isScrimVisible();
    /**
     * Whether Escape belongs to the sheet: it has an `onCloseRequest` handler
     * or a closed detent to snap to, while its scrim shows or it is still
     * closing, so a close keeps Escape until it settles either way.
     */
    get handlesCloseRequests(): boolean;
    /** An Escape press routed to this sheet. */
    handleCloseRequest(): void;
    /**
     * The one path every close request takes: a scrim press, the scrim's
     * dismiss button and Escape. With an `onCloseRequest` handler the request is
     * only reported; without one the sheet snaps to its closed detent, which
     * reports through `onIndexChange`.
     */
    private performCloseRequest;
    private readonly observeContent;
    private readonly scheduleLayout;
    get settleDuration(): number;
    requireConfig(): BottomSheetWebConfig;
    private layout;
    private resolveDetentsFromLayout;
    /** Keeps a moving sheet's overflow: its card can be above the current detents. */
    private updateSurfaceOverflow;
    private shouldAnimateContentHeight;
    private currentSheetHeight;
    setTranslateY(ty: number): void;
    private setDetentIndex;
    private replayPendingIndexIfResolved;
    requestFrame(): void;
    private readonly handleFrame;
    emitPosition(): void;
    private updateSheetVisibility;
    private updateScrim;
    /**
     * Whether a scrim press, including the scrim's dismiss button, would ask
     * the sheet to close. Requiring an open target also ignores presses once a
     * close is running, including one to another zero-height detent.
     */
    get canRequestCloseFromScrim(): boolean;
    private readonly handleScrimPress;
    updateCloseRequestRegistration(): void;
}
//# sourceMappingURL=controller.d.ts.map