/**
 * Where the sheet sits across the host when `maxWidth` makes it narrower than
 * the host, as in UIKit's `UISheetPresentationController.Placement`. `start`
 * and `end` follow the layout direction, like the detents' `start` and `end`
 * insets: `start` is the left edge in a left-to-right layout and the right edge
 * in a right-to-left one.
 */
export type SheetPlacement = 'start' | 'center' | 'end';
/** The card's horizontal span in the host, in points. */
export type CardSpan = Readonly<{
    left: number;
    width: number;
}>;
/**
 * The width of the sheet's column in a host `hostWidth` wide: the host's
 * width, capped by `maxWidth` (0 for no cap). The card and its side insets
 * share the column, so a capped sheet looks as it would on a screen that wide.
 */
export declare const columnWidth: (hostWidth: number, maxWidth: number) => number;
/**
 * Places the card across a host `hostWidth` wide, in points with `pixelRatio`
 * device pixels each. The sheet's column, at most `maxWidth` wide (0 for no
 * cap), sits where the bias puts it in the host, and the card fills the column
 * between its side insets, as it would fill a screen that wide.
 */
export declare const placeCard: (hostWidth: number, insetLeft: number, insetRight: number, maxWidth: number, bias: number, pixelRatio?: number) => CardSpan;
/**
 * Validates `maxWidth` and returns the value the native hosts take: 0 for
 * none. `Infinity` is accepted as an explicit "no cap".
 */
export declare const resolveMaxWidth: (maxWidth: number | undefined) => number;
/** Validates `placement` and resolves it to a physical bias. */
export declare const resolvePlacement: (placement: SheetPlacement | undefined, isRTL: boolean) => number;
/**
 * A warning for side insets that leave the card no width in a host
 * `hostWidth` wide under `maxWidth` (0 for no cap), or null when every
 * detent's card has room. The hosts clamp such a card to nothing rather than
 * fail, since a host can get that narrow at runtime (a resized window, a
 * container animating open). A closed detent's insets are already 0.
 */
export declare const crowdedInsetsWarning: (detents: ReadonlyArray<Readonly<{
    insetLeft: number;
    insetRight: number;
}>>, hostWidth: number, maxWidth: number) => string | null;
//# sourceMappingURL=cardPlacement.d.ts.map