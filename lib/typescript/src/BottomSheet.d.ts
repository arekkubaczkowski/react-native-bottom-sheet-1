import { type ComponentType, type ReactNode } from 'react';
import type { ColorValue, NativeSyntheticEvent, StyleProp, ViewStyle } from 'react-native';
import { type SheetPlacement } from './cardPlacement.js';
import { type Detent, type ModalDetent, type SurfaceStyle } from './bottomSheetUtils.js';
export type { SheetPlacement } from './cardPlacement.js';
export type { Detent, DetentConfig, DetentInsets, DetentValue, ModalDetent, ModalDetentConfig, SurfaceStyle, } from './bottomSheetUtils.js';
/**
 * Payload of the {@link BottomSheetProps.onPositionChange} event, accessed as
 * `event.nativeEvent`.
 */
export type PositionChangeEventData = Readonly<{
    /**
     * The distance from the bottom of the sheet's host to the top of the sheet,
     * in layout units: points on iOS, dp on Android, and CSS pixels on the web.
     */
    position: number;
    /**
     * Fractional detent index in `0..(detents.length - 1)`: `0` at the shortest
     * detent, `1` at the next, and so on, interpolated as the sheet moves between
     * them. Detents are required to be in ascending order by position. The
     * continuous counterpart of `onIndexChange`, so a backdrop or per-detent
     * animation can be driven without knowing the sheet's height.
     */
    index: number;
}>;
export type ScrollCoordinationMode = 'none' | 'initial' | 'handoff';
export type ScrollCoordination = ScrollCoordinationMode | Readonly<{
    expand: ScrollCoordinationMode;
    collapse: ScrollCoordinationMode;
}>;
/**
 * Props for the inline bottom-sheet component.
 */
export interface BottomSheetProps {
    /** Sheet contents, including any scrollable content. */
    children: ReactNode;
    /**
     * iOS-only content pinned to the bottom edge of the visible card. It is laid
     * out at the largest detent's size and clipped by the card at shorter
     * detents. It sits above the surface and behind the regular children.
     * Regular children alone determine the height of a `'content'` detent.
     */
    iosBottomAnchoredContent?: ReactNode;
    /**
     * The fill of the sheet's surface: an optional element, typically a
     * background View, rendered behind the content. The library sizes and
     * positions it natively to cover the full sheet, independently of the
     * content, so a shrinking content height never exposes blank space. Put a
     * background View here instead of inside `children` when you want that
     * shrink-safe behavior. When omitted, behavior is unchanged.
     *
     * Give the element a filling style such as `StyleSheet.absoluteFill`: it is
     * mounted in a full-size host, so one sized only by its own content would
     * collapse and not show.
     */
    surface?: ReactNode;
    /**
     * The shape and shadow of the sheet's surface: corner radii, `borderCurve`,
     * and shadows (`boxShadow`, `elevation`, and the `shadow*` props). The native
     * host clips both the fill from `surface` and `children` to this shape, so
     * content near a rounded corner is cut to it, and casts the shadows outside
     * it. It is not applied to the element passed as `surface`, which only fills
     * the surface: a radius there would not round the content, and a shadow
     * there would be clipped.
     */
    surfaceStyle?: StyleProp<SurfaceStyle>;
    /** Additional style applied to the native sheet host view. */
    style?: StyleProp<ViewStyle>;
    /**
     * Snap points for the sheet, in ascending order by position. Defaults to
     * `[0, 'content']` and must contain at least one value. Numbers must be finite
     * and non-negative. Percentage strings must be unsigned values from `0%`
     * through `100%` and resolve against the native usable height. Fixed detents
     * may be taller than the measured content or available height; native layout
     * caps them to the available geometry.
     *
     * Each detent is a bare value or an object with its options:
     * `programmatic`, `insets`, `cornerRadius`, `cornerRadiusTransitionDistance`,
     * and, on `ModalBottomSheet`, `scrimOpacity`. A detent without an option
     * takes its default.
     *
     * A detent’s value is the height of the card, and percentages resolve against
     * the available space: the host’s height minus `topInset` and that detent’s
     * bottom inset. So `'100%'` fills the space between the gaps and never covers
     * them. Detents ascend by the position of the card’s top: its height plus its
     * bottom inset.
     *
     * A detent’s `insets` keep space around the card, so the sheet can float as
     * a card. They are linearly interpolated as the sheet moves between detents;
     * below the first open detent the card keeps its shape and slides down
     * through the bottom inset. A closed detent ignores its insets.
     *
     * Insets never relayout the surface or content. They are laid out against
     * the widest card, the detent with the tightest side insets, and scaled
     * uniformly to fit narrower ones, so full-width content and an image surface
     * always touch the card's edges. A `'content'` detent's card is its scaled
     * height. `measure` and `measureInWindow` report the scaled position and
     * size, `windowOverlay` included, except on the web, where React Native
     * Web's `measure` ignores transforms and only `measureInWindow` follows the
     * card.
     *
     * Space in an inset isn't part of the sheet: touches there reach the scrim or
     * whatever is behind it.
     */
    detents?: Detent[];
    /**
     * The minimum space between the card’s top and the host’s top, in points,
     * at every detent. Defaults to the part of the status bar that overlaps the
     * host, so the card stops below it; pass a lower value, or `0`, to go under
     * the status bar.
     *
     * @default The part of the status bar that overlaps the host.
     */
    topInset?: number;
    /**
     * The widest the sheet gets, in points, so a sheet on a tablet, a foldable,
     * a desktop browser or a landscape phone doesn't stretch across the whole
     * screen. It caps the column the sheet sits in, side `insets` included: the
     * card fills the column between its detent's insets, as it would fill a
     * screen this wide, and `placement` decides where the column sits when it is
     * narrower than the host. Applies at every detent, and doesn't relayout the
     * content: the content is laid out at the widest card's width.
     *
     * A number greater than 0. Leave it unset, or pass `Infinity`, for no cap.
     */
    maxWidth?: number;
    /**
     * Where the sheet sits across the host when `maxWidth` makes it narrower
     * than the host, like `UISheetPresentationController`'s `preferredPlacement`
     * on iOS 27. `'center'` puts the sheet's middle on the host's; `'start'` and
     * `'end'` put it against the start or end edge, following the layout
     * direction like the detents' `start` and `end` insets, so `'start'` is on
     * the right in a right-to-left layout. The detent's side insets then apply within the
     * sheet's width, as on a narrow screen.
     *
     * @default 'center'
     */
    placement?: SheetPlacement;
    /**
     * Finite, zero-based integer in `0..(detents.length - 1)`. When shortening
     * `detents`, update `index` to remain in range in the same render.
     */
    index: number;
    /**
     * Whether a sheet that is open when it first appears, such as at app launch,
     * animates in. Opening a closed sheet always animates.
     *
     * @default true
     */
    animateIn?: boolean;
    /**
     * Whether the sheet should animate when the active `'content'` detent changes
     * height. Disable this when your content animates its own height.
     *
     * @default true
     */
    animateContentHeight?: boolean;
    /**
     * Whether to keep the sheet in the tree only while it is open. The native
     * sheet view and its content mount in the same render that `index` selects an
     * open detent, so the content is in place before the sheet starts opening, and
     * unmount once the sheet settles at a closed detent, so the content stays
     * visible throughout the closing animation. While unmounted, the sheet emits
     * no `onPositionChange` events. Has no effect when no detent is closed.
     *
     * @default false
     */
    lazy?: boolean;
    /**
     * Called when a user-driven snap is initiated: the moment a drag commits to a
     * detent, or a close request closes a modal sheet that has no
     * `onCloseRequest`, before the animation settles. Does not fire for
     * programmatic `index` changes; you already know when you make those. Use it
     * to keep your controlled `index` state in sync. For the end of any movement,
     * use `onSettle`.
     */
    onIndexChange?: (index: number) => void;
    /** Called when a snap animation settles, including programmatic changes. */
    onSettle?: (index: number) => void;
    /**
     * Called as the sheet position changes. A standard native direct event; read
     * `event.nativeEvent.position` (the distance from the host's bottom to the
     * sheet's top). To handle it on the UI thread, see `wrapNativeView`.
     */
    onPositionChange?: (event: NativeSyntheticEvent<PositionChangeEventData>) => void;
    /**
     * Wraps the native sheet view—the one that emits `onPositionChange`—before it
     * is rendered. Pass `Animated.createAnimatedComponent` to handle
     * `onPositionChange` on the UI thread with a Reanimated worklet (e.g., from
     * `useEvent`): Because the animated wrapper sits directly on the native view,
     * the worklet binds to the sheet at mount, for both inline and modal sheets,
     * without the library depending on Reanimated.
     *
     * Called once; pass a stable function (a module-level reference such as
     * `Animated.createAnimatedComponent`, not an inline lambda recreated each
     * render).
     */
    wrapNativeView?: (component: ComponentType<any>) => ComponentType<any>;
    /**
     * Controls how gestures that start in nested scrollables interact with the
     * sheet. A string applies to both directions; an object configures expansion
     * and collapse independently. `initial` selects one owner at touch-down,
     * while `handoff` also permits ownership to transfer without lifting.
     *
     * @default { expand: 'handoff', collapse: 'initial' }
     */
    scrollCoordination?: ScrollCoordination;
    /**
     * Milliseconds the spring that carries the sheet to a resolved detent takes
     * to settle.
     *
     * The spring is critically damped, so this is also its stiffness: a longer
     * duration is a softer settle. It starts at the release velocity and never
     * passes the detent, so a release faster than the spring can stop in time
     * finishes sooner.
     *
     * Must be a finite number greater than 0; leave it unset for the default.
     *
     * @default 450
     */
    settleDuration?: number;
}
type ModalOnlyBottomSheetProps = {
    /** Internal flag used by `ModalBottomSheet`. */
    modal?: boolean;
    /** Controlled close request callback used by `ModalBottomSheet`. */
    onCloseRequest?: () => void;
    /**
     * Internal flag used by `ModalBottomSheet`. When set, the sheet is presented
     * in a window overlay above everything (including native modal screens)
     * instead of the `BottomSheetProvider` portal.
     */
    windowOverlay?: boolean;
    /** Scrim color used by `ModalBottomSheet`. */
    scrimColor?: ColorValue;
    /** Scrim dismiss-control label used by `ModalBottomSheet`. */
    scrimAccessibilityLabel?: string;
};
export type BottomSheetInternalProps = Omit<BottomSheetProps, 'detents'> & ModalOnlyBottomSheetProps & {
    /** `ModalBottomSheet`’s detents can also set a scrim opacity. */
    detents?: ModalDetent[];
};
/** Native bottom sheet that renders inline within the current screen layout. */
export declare const BottomSheet: (props: BottomSheetProps) => import("react").JSX.Element | null;
//# sourceMappingURL=BottomSheet.d.ts.map