import { type SideInsets } from './detents.js';
import type { BottomSheetWebConfig, BottomSheetWebElements, RawDetent, ResolvedDetent } from './types.js';
/** The controller's state that the card's shape derives from. */
export type CardHost = {
    readonly elements: BottomSheetWebElements | null;
    readonly config: BottomSheetWebConfig | null;
    readonly hostHeight: number;
    readonly translateY: number;
    readonly detents: ResolvedDetent[];
    readonly rawDetents: ReadonlyArray<RawDetent>;
    readonly widestCardLeft: number;
    readonly widestCardInsets: SideInsets;
};
export declare class SheetCard {
    private readonly host;
    /** The card's CSS corner radii, even while none is rounded. */
    private cardCorners;
    private hasDetentCornerRadii;
    private cornerRadiiDirty;
    private appliedCornerRadii;
    private appliedContentTransform;
    private appliedCardHeight;
    private appliedCardLeft;
    private appliedCardRight;
    private appliedClipInset;
    constructor(host: CardHost);
    resetContentTransform(): void;
    /**
     * Applies the card's shadow style and invalidates its cached geometry.
     */
    updateCardShape(): void;
    /**
     * Clips the surface and content to the card. At or above the first open
     * detent the card's bottom stays above the bottom gap and its side gaps blend
     * between detents; below it, it keeps that detent's shape and slides down
     * rigidly, so a closing sheet leaves through the gap with its shape intact.
     * Cards with square corners and no gaps stay unclipped.
     */
    updateCardClip(): void;
    private updateCornerRadii;
    private cornerStyleAt;
    private currentPosition;
    /** The height the card has right now, in layout units. */
    currentLayoutHeight(): number;
    /**
     * The card's gaps at a sheet position, blended between the detents around it.
     * Resolved detents ascend by position.
     */
    private cardInsets;
    /** Whether the card is cut out of the surface: rounded, or keeping gaps. */
    private clipsToCard;
    /**
     * Whether `maxWidth` leaves a gap beside the sheet in this host: whether its
     * column is narrower than the host.
     */
    private isNarrowedByMaxWidth;
}
//# sourceMappingURL=card.d.ts.map