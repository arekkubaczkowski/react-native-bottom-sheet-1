import type { BottomSheetWebCallbacks, BottomSheetWebConfig, BottomSheetWebElements, RawDetent, ResolvedDetent } from './types.js';
export type SideInsets = Readonly<{
    insetLeft: number;
    insetRight: number;
}>;
/** The controller's state that the card's width and scale derive from. */
type CardLayoutHost = Readonly<{
    elements: BottomSheetWebElements | null;
    rawDetents: ReadonlyArray<RawDetent>;
    /** The side insets of the widest card, which the content is laid out against. */
    widestCardInsets: SideInsets;
}>;
/** The controller's state that detents resolve from. */
export type DetentsHost = {
    readonly elements: BottomSheetWebElements | null;
    readonly rawDetents: ReadonlyArray<RawDetent>;
    readonly hostHeight: number;
    readonly statusBarOverlap: number;
    readonly widestCardInsets: SideInsets;
    lastReportedError: string | null;
    emit(event: (callbacks: BottomSheetWebCallbacks) => void): void;
};
/**
 * The height the content wrapper is laid out in: the card's height at the
 * tallest detent. In layout units, so divided by the scale at that detent: a
 * narrow card's region can outgrow the host.
 */
export declare const contentRegionHeight: (host: DetentsHost) => number;
/**
 * How far the surface extends below the host, in layout units, so that once
 * scaled it still covers the card. A card's height and width are linear in the
 * sheet's position between detents, so their ratio peaks at a detent. A detents
 * change can leave the card above all of them, so its current height counts too.
 * A `content` detent counts at its bound rather than its measured height on
 * purpose, matching the native platforms, where a surface following the
 * measurement would be a commit behind a card that grows, showing a gap. One
 * that's too tall is just clipped.
 */
export declare const surfaceOverflow: (host: DetentsHost, currentCardLayoutHeight: number) => number;
/**
 * How much the content is scaled at a detent: its card's width over the width
 * of the widest card, which the content is laid out against.
 */
export declare const contentScale: (host: CardLayoutHost, insets: SideInsets) => number;
/** The card's horizontal span at a detent's side insets. */
export declare const cardSpan: (host: Pick<CardLayoutHost, "rawDetents">, insets: SideInsets, width: number) => Readonly<{
    left: number;
    width: number;
}>;
export declare const resolveDetentSpecs: (host: DetentsHost) => ResolvedDetent[] | null;
export declare const isInvalidContentDetentTarget: (host: DetentsHost, index: number) => boolean;
export declare const firstOpenPosition: (detents: ReadonlyArray<ResolvedDetent>) => number;
export declare const areNumbersEqual: (a: ReadonlyArray<number>, b: ReadonlyArray<number>) => boolean;
export declare const areShadowsEqual: (a: BottomSheetWebConfig["shadows"], b: BottomSheetWebConfig["shadows"]) => boolean;
export declare const areRawDetentsEqual: (a: ReadonlyArray<RawDetent>, b: ReadonlyArray<RawDetent>) => boolean;
export declare const areDetentCornerStylesEqual: (a: ReadonlyArray<RawDetent>, b: ReadonlyArray<RawDetent>) => boolean;
export declare const areScrimOpacitiesEqual: (a: ReadonlyArray<RawDetent>, b: ReadonlyArray<RawDetent>) => boolean;
export declare const areResolvedDetentsEqual: (a: ResolvedDetent[], b: ResolvedDetent[]) => boolean;
export {};
//# sourceMappingURL=detents.d.ts.map