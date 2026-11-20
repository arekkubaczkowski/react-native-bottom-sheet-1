import { type ProcessedColorValue, type StyleProp, type ViewStyle } from 'react-native';
export declare const CONTENT_HEIGHT_MARKER_NATIVE_ID = "swm-bottom-sheet-content-height-marker";
/**
 * The shape and shadow of a sheet's surface, stated in standard style
 * vocabulary. The native host clips the surface's fill and the content to this
 * shape, so a radius set here also rounds the sheet's content.
 */
export type SurfaceStyle = Readonly<{
    borderRadius?: number;
    borderTopLeftRadius?: number;
    borderTopRightRadius?: number;
    borderBottomLeftRadius?: number;
    borderBottomRightRadius?: number;
    borderTopStartRadius?: number;
    borderTopEndRadius?: number;
    borderBottomStartRadius?: number;
    borderBottomEndRadius?: number;
    /** iOS only. Android always draws circular corners. */
    borderCurve?: 'circular' | 'continuous';
    /**
     * Shadows cast by the card, outside its clipped shape. Outset shadows only;
     * `inset` shadows are ignored. As with React Native's own `boxShadow`,
     * Android skips them before API 28: use `elevation` for those versions.
     */
    boxShadow?: ViewStyle['boxShadow'];
    /** Android only. Casts a system shadow from the card, on every API level. */
    elevation?: ViewStyle['elevation'];
    /** The color of the iOS shadow, and of `elevation` on Android API 28+. */
    shadowColor?: ViewStyle['shadowColor'];
    /** iOS only. */
    shadowOffset?: ViewStyle['shadowOffset'];
    /** iOS only. Without an opacity above zero, there is no iOS shadow. */
    shadowOpacity?: ViewStyle['shadowOpacity'];
    /** iOS only. */
    shadowRadius?: ViewStyle['shadowRadius'];
}>;
/** A card shadow in the shape the native hosts consume. */
type NativeShadow = Readonly<{
    offsetX: number;
    offsetY: number;
    blurRadius: number;
    spreadDistance: number;
    /**
     * A processed color: an ARGB integer, or a platform color object
     * (`PlatformColor`, `DynamicColorIOS`) that the native host resolves.
     */
    color: ProcessedColorValue;
    /** Multiplied into the color. A dynamic color's alpha is unknown to JS. */
    opacity: number;
    /** Whether the shadow leaves the card's interior unpainted, as `boxShadow` does. */
    excludesInterior: boolean;
}>;
type ResolvedSurfaceStyle = Readonly<{
    /** Physical corner radii: top-left, top-right, bottom-right, bottom-left. */
    cornerRadii: number[];
    cornerCurve: 'circular' | 'continuous';
    shadows: NativeShadow[];
    elevation: number;
    shadowColor: SurfaceStyle['shadowColor'];
}>;
/**
 * Resolves a surface style into physical corner radii for the native host.
 * Start/end corners take precedence over left/right ones. As in React Native's
 * own border-radius resolution, Android swaps left and right in RTL unless the
 * app opted out; iOS and web keep them physical.
 */
export declare const resolveSurfaceStyle: (style: StyleProp<SurfaceStyle>, isRTL: boolean) => ResolvedSurfaceStyle;
/**
 * A finite, non-negative height in points, an unsigned percentage from `0%`
 * through `100%`, or `'content'` for the measured content height.
 */
export type DetentValue = number | `${number}%` | 'content';
/**
 * The space kept around the card at a detent, in points. All sides default
 * to 0. The space above the card is set for the whole sheet, by `topInset`.
 */
export type DetentInsets = Readonly<{
    /** The space at the physical left, whatever the layout direction. */
    left?: number;
    /** The space at the physical right, whatever the layout direction. */
    right?: number;
    /**
     * The space at the side where a line starts: the left in a left-to-right
     * layout, the right in a right-to-left one. Takes precedence over `left` or
     * `right`, whichever it resolves to.
     */
    start?: number;
    /**
     * The space at the side where a line ends: the right in a left-to-right
     * layout, the left in a right-to-left one. Takes precedence over `left` or
     * `right`, whichever it resolves to.
     */
    end?: number;
    /** The space between the card's bottom and the host's bottom. */
    bottom?: number;
}>;
/** A detent with its options. A bare value takes the default for each. */
export type DetentConfig = Readonly<{
    value: DetentValue;
    /**
     * Reachable only through controlled `index` updates: Dragging skips it, and
     * the sheet doesn’t settle there.
     *
     * @default false
     */
    programmatic?: boolean;
    /**
     * The space around the card at this detent, so the sheet can float as a
     * card. Ignored at a closed detent.
     */
    insets?: DetentInsets;
    /**
     * Overrides all four surface corner radii at this detent. Omit to inherit
     * the individual radii from `surfaceStyle`. Ignored at a closed detent.
     */
    cornerRadius?: number;
    /**
     * A positive distance, in layout units below this detent, over which its
     * corners blend from the previous open detent. Omit to blend over the whole
     * interval. New radii follow the same curve as the sheet surface.
     */
    cornerRadiusTransitionDistance?: number;
}>;
/** A modal sheet’s detent with its options. */
export type ModalDetentConfig = DetentConfig & Readonly<{
    /**
     * In 0–1, scales the scrim color’s alpha at this detent. Interpolated
     * linearly as the sheet moves between detents. Defaults to 0 at a closed
     * detent and 1 at an open one.
     */
    scrimOpacity?: number;
}>;
/** A detent: a bare value, or an object with its options. */
export type Detent = DetentValue | DetentConfig;
/** A modal sheet’s detent: a bare value, or an object with its options. */
export type ModalDetent = DetentValue | ModalDetentConfig;
type NormalizedDetent = Readonly<{
    value: number;
    kind: 'points' | 'percentage' | 'content';
    programmatic: boolean;
    usesStatusBarTopInset: boolean;
    insetTop: number;
    insetLeft: number;
    insetRight: number;
    insetBottom: number;
    /** Whether this is the widest open card, which content is laid out against. */
    widestCard: boolean;
    /** The sheet's `maxWidth`, or 0 for none. The same on every detent. */
    maxWidth: number;
    /** The sheet's `placement` as a physical bias. The same on every detent. */
    placementBias: number;
    scrimOpacity: number;
    /** -1 inherits the surface radii; 0 is an explicit square corner. */
    cornerRadius: number;
    /** 0 blends over the entire interval. */
    cornerRadiusTransitionDistance: number;
}>;
/** The sheet-wide horizontal layout, carried on every native detent. */
type CardLayout = Readonly<{
    maxWidth: number;
    placementBias: number;
}>;
/**
 * Serializes the public detents, flagging the widest card. The native hosts
 * and the web controller read that flag rather than finding the widest card
 * themselves, so every platform lays out against the same one.
 */
export declare const normalizeDetents: (detents: ReadonlyArray<ModalDetent>, topInset: number | undefined, cardLayout: CardLayout, modal: boolean, isRTL: boolean) => NormalizedDetent[];
/** Whether a normalized detent represents a fully closed sheet. */
export declare const isNormalizedDetentClosed: (detent: Readonly<{
    kind: string;
    value: number;
}>) => boolean;
/** Validates a controlled index before props are passed to the native view. */
export declare const validateIndex: (index: number, detentCount: number) => void;
/**
 * Validates `settleDuration`. It is a duration in milliseconds, so a negative value
 * has no meaning: it would produce a spring with no solution.
 */
export declare const validateSettleDuration: (settleDuration: number | undefined) => void;
export {};
//# sourceMappingURL=bottomSheetUtils.d.ts.map