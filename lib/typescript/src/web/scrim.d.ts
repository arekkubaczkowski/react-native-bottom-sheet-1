import type { SheetSnapping } from './snapping.js';
import type { BottomSheetWebConfig, BottomSheetWebElements, ResolvedDetent } from './types.js';
/** The controller's state that the scrim's opacity derives from. */
export type ScrimHost = {
    readonly elements: BottomSheetWebElements | null;
    readonly config: BottomSheetWebConfig | null;
    readonly hasLaidOut: boolean;
    readonly isPanning: boolean;
    readonly scrimPinnedFull: boolean;
    readonly detents: ResolvedDetent[];
    readonly hostHeight: number;
    /** Whether a scrim press would ask the sheet to close. */
    readonly canRequestCloseFromScrim: boolean;
    readonly snapping: Pick<SheetSnapping, 'isSpringActive' | 'isTargetClosed'>;
};
export declare const applyScrim: (host: ScrimHost, position: number) => void;
/** Fractional detent index, interpolated by position between detents. */
export declare const detentIndex: (position: number, detents: ResolvedDetent[]) => number;
//# sourceMappingURL=scrim.d.ts.map