"use strict";

import { useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import { BottomSheetContentWrapperView, BottomSheetView, BottomSheetSurfaceView } from './BottomSheetHostViews';
import { Portal } from "./BottomSheetProvider.js";
import { isLayoutRTL } from './layoutDirection';
import { crowdedInsetsWarning, resolveMaxWidth, resolvePlacement } from "./cardPlacement.js";
import { CONTENT_HEIGHT_MARKER_NATIVE_ID, isNormalizedDetentClosed, normalizeDetents, resolveSurfaceStyle, validateIndex, validateSettleDuration } from "./bottomSheetUtils.js";

/**
 * Payload of the {@link BottomSheetProps.onPositionChange} event, accessed as
 * `event.nativeEvent`.
 */
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const SCROLL_COORDINATION_LEVEL = {
  none: 0,
  initial: 1,
  handoff: 2
};
const DEFAULT_SCROLL_COORDINATION = {
  expand: 'handoff',
  collapse: 'initial'
};

/**
 * Props for the inline bottom-sheet component.
 */

// Incremented whenever any sheet opens, so the most recently opened sheet
// stacks on top and receives Back and Escape.
let lastOpenOrder = 0;

/** Native bottom sheet that renders inline within the current screen layout. */
export const BottomSheet = props => {
  const {
    children,
    surface,
    surfaceStyle,
    style,
    detents = [0, 'content'],
    topInset,
    maxWidth,
    placement,
    index,
    animateIn = true,
    animateContentHeight = true,
    lazy = false,
    onIndexChange,
    onSettle,
    onPositionChange,
    onCloseRequest,
    wrapNativeView,
    modal = false,
    windowOverlay = false,
    scrollCoordination,
    scrimColor,
    scrimAccessibilityLabel,
    settleDuration
  } = props;
  const coordination = scrollCoordination ?? DEFAULT_SCROLL_COORDINATION;
  const resolvedExpandCoordination = typeof coordination === 'string' ? coordination : coordination.expand;
  const resolvedCollapseCoordination = typeof coordination === 'string' ? coordination : coordination.collapse;
  const usesWindowOverlay = modal && windowOverlay;
  // All real geometry — the sheet's frame, the content wrapper's bounds, and
  // the default top inset (the overlapping status-bar inset) — is measured
  // natively from the window the sheet actually lives in and flows into the
  // shadow tree through state (see BottomSheetHostView /
  // BottomSheetHostingView). The window dimensions here
  // only size the window-overlay host for the first frame, before the overlay
  // window reports its measured geometry.
  const {
    width: windowWidth,
    height: windowHeight
  } = useWindowDimensions();
  // Percentage detents stay as unitless ratios and are resolved against the
  // host's height whenever detents are refreshed. Point detents retain
  // their requested height; native layout clamps both kinds to it.
  validateIndex(index, detents.length);
  validateSettleDuration(settleDuration);
  const isRTL = isLayoutRTL();
  const resolvedMaxWidth = resolveMaxWidth(maxWidth);
  const normalizedDetents = normalizeDetents(detents, topInset, {
    maxWidth: resolvedMaxWidth,
    placementBias: resolvePlacement(placement, isRTL)
  }, modal, isRTL);
  const selectedNormalizedDetent = normalizedDetents[index];
  const isSheetClosed = isNormalizedDetentClosed(selectedNormalizedDetent);
  const hasCloseRequestHandler = onCloseRequest != null;
  // Whether the sheet is open or still closing. Set during render so a lazy
  // sheet mounts in the same commit as the open index.
  const [isSheetActive, setIsSheetActive] = useState(!isSheetClosed);
  // `animateIn` only covers the initial presentation, but a lazy sheet's native
  // view also runs its first layout on every later open, which must animate.
  const [hasOpenedFromClosed, setHasOpenedFromClosed] = useState(false);
  if (!isSheetClosed && !isSheetActive) {
    setIsSheetActive(true);
    setHasOpenedFromClosed(true);
  }
  // The surface and content are laid out against the widest card, and the
  // native host scales them down to narrower ones. Stated as start/end because
  // insets are physical, while left/right may swap under RTL.
  const widestDetent = normalizedDetents.find(detent => detent.widestCard);
  const contentLeft = widestDetent?.insetLeft ?? 0;
  const contentRight = widestDetent?.insetRight ?? 0;
  // Caps the content at the widest card's width: the sheet's column less that
  // card's side insets, which Yoga applies as margins. The hosts place the card
  // themselves and move the content onto it, so where Yoga puts the capped box
  // (the start edge) only has to be the same for the surface and the content.
  const contentMaxWidth = resolvedMaxWidth > 0 ? Math.max(0, resolvedMaxWidth - contentLeft - contentRight) : undefined;
  // When the sheet last opened, relative to other sheets: 0 until it first
  // opens. This includes reopening while it is still closing.
  const [wasSheetClosed, setWasSheetClosed] = useState(isSheetClosed);
  const [openOrder, setOpenOrder] = useState(() => isSheetClosed ? 0 : ++lastOpenOrder);
  if (isSheetClosed !== wasSheetClosed) {
    setWasSheetClosed(isSheetClosed);
    if (!isSheetClosed) {
      setOpenOrder(++lastOpenOrder);
    }
  }
  const {
    cornerRadii,
    cornerCurve,
    shadows,
    elevation,
    shadowColor
  } = useMemo(() => resolveSurfaceStyle(surfaceStyle, isRTL), [surfaceStyle, isRTL]);
  const handleIndexChange = event => {
    onIndexChange?.(event.nativeEvent.index);
  };
  const handleSettle = event => {
    // Don't compare against `index`: the settle can arrive in the same batch as
    // the `onIndexChange` that closes the sheet, before `index` catches up. If
    // a newer open index superseded this settle, the render-time check above
    // reactivates the sheet before commit, so it never unmounts.
    const settledDetent = normalizedDetents[event.nativeEvent.index];
    if (settledDetent != null && isNormalizedDetentClosed(settledDetent)) {
      setIsSheetActive(false);
    }
    onSettle?.(event.nativeEvent.index);
  };

  // The native sheet view, optionally wrapped (e.g. with
  // `Animated.createAnimatedComponent`) so a Reanimated worklet can handle
  // `onPositionChange` on the UI thread. Wrapping the leaf native view (rather
  // than this whole component) keeps the animated boundary on the host that
  // emits events—so it resolves at mount, inline or inside the modal portal
  // alike. Computed once: a fresh wrapped component each render would remount
  // the native sheet.
  const [NativeView] = useState(() => wrapNativeView?.(BottomSheetView) ?? BottomSheetView);

  // Side insets that fill the host squeeze the card to nothing; the hosts clamp
  // it rather than fail, since a host can get that narrow at runtime. Warn in
  // development, against the host's laid-out width, after every render (the
  // detents may change without a layout) and on every layout.
  const hostWidthRef = useRef(0);
  const lastWarningRef = useRef(null);
  const warnAboutCrowdedInsets = () => {
    const warning = crowdedInsetsWarning(normalizedDetents, hostWidthRef.current, resolvedMaxWidth);
    if (warning !== null && warning !== lastWarningRef.current) {
      console.warn(warning);
    }
    lastWarningRef.current = warning;
  };
  useEffect(() => {
    if (__DEV__) warnAboutCrowdedInsets();
  });
  const handleLayout = __DEV__ ? event => {
    hostWidthRef.current = event.nativeEvent.layout.width;
    warnAboutCrowdedInsets();
  } : undefined;
  if (lazy && !isSheetActive) {
    return null;
  }
  const sheet = /*#__PURE__*/_jsx(View, {
    style: StyleSheet.absoluteFill,
    pointerEvents: modal ? isSheetClosed ? 'none' : 'auto' : 'box-none'
    // Keep both ancestor wrappers real native views (Android): this outer
    // one toggles pointerEvents ('none' <-> 'auto') on open/close, which is
    // exactly the prop change that forces Fabric to unflatten it and emit
    // the reparenting batch that can miss the Create mutation. The content
    // views below the native view already pin collapsable={false}; the
    // ancestors were the remaining flattenable gap. See issue #78.
    ,
    collapsable: false,
    children: /*#__PURE__*/_jsx(View, {
      pointerEvents: "box-none",
      style: StyleSheet.absoluteFill,
      collapsable: false,
      children: /*#__PURE__*/_jsxs(NativeView, {
        pointerEvents: "box-none",
        style: [
        // Inline (and portal) sheets fill their container — the portal
        // host spans the provider, so a modal sheet's canvas is the real
        // provider extent, laid out by Fabric in this window. In
        // window-overlay mode the host is reparented into a separate
        // full-screen window whose measured size reaches the shadow tree
        // via state; the window dimensions here are only the first-frame
        // estimate until that arrives.
        usesWindowOverlay ? {
          position: 'absolute',
          left: 0,
          bottom: 0,
          width: windowWidth,
          height: windowHeight
        } : StyleSheet.absoluteFill, style],
        detents: normalizedDetents,
        index: index,
        animateIn: animateIn || lazy && hasOpenedFromClosed,
        animateContentHeight: animateContentHeight,
        modal: modal,
        windowOverlay: usesWindowOverlay,
        openOrder: openOrder,
        hasCloseRequestHandler: hasCloseRequestHandler,
        scrollExpandCoordination: SCROLL_COORDINATION_LEVEL[resolvedExpandCoordination],
        scrollCollapseCoordination: SCROLL_COORDINATION_LEVEL[resolvedCollapseCoordination]
        // The hosts take seconds, and 0 tells them to use their default.
        ,
        settleDuration: settleDuration === undefined ? 0 : settleDuration / 1000,
        scrimColor: scrimColor
        // An empty label would leave the button unlabeled, so it falls back too.
        ,
        scrimAccessibilityLabel: scrimAccessibilityLabel || 'Dismiss',
        surfaceCornerRadii: cornerRadii,
        surfaceCornerCurve: cornerCurve,
        surfaceShadows: shadows,
        surfaceElevation: elevation,
        surfaceShadowColor: shadowColor,
        onIndexChange: handleIndexChange,
        onSettle: handleSettle,
        onPositionChange: onPositionChange,
        onCloseRequest: onCloseRequest,
        onLayout: handleLayout,
        children: [surface != null && /*#__PURE__*/_jsx(BottomSheetSurfaceView, {
          collapsable: false,
          pointerEvents: "box-none",
          style: [styles.surface, {
            start: isRTL ? contentRight : contentLeft,
            end: isRTL ? contentLeft : contentRight,
            maxWidth: contentMaxWidth
          }],
          children: surface
        }), /*#__PURE__*/_jsxs(BottomSheetContentWrapperView, {
          collapsable: false
          // The wrapper fills the sheet's content region exactly: the native
          // side reports the region's inset (the gap between the sheet's
          // height and the tallest detent, clamped to the space its insets leave) into
          // the shadow tree, where it is applied as Yoga bottom padding on
          // the sheet node, or as this wrapper's overflow when a narrow card's
          // region outgrows the sheet — so this in-flow flex: 1 child resolves
          // to the region the sheet can actually show, on every device and in
          // every mode. Its own component so `measure` includes the card's
          // scale, which its shadow node reports.
          ,
          style: [styles.contentWrapper, {
            marginStart: isRTL ? contentRight : contentLeft,
            marginEnd: isRTL ? contentLeft : contentRight,
            maxWidth: contentMaxWidth
          }],
          children: [children, /*#__PURE__*/_jsx(View, {
            collapsable: false,
            nativeID: CONTENT_HEIGHT_MARKER_NATIVE_ID,
            pointerEvents: "none"
          })]
        })]
      })
    })
  });
  if (modal) {
    // In window-overlay mode the sheet is rendered inline; the native layer
    // reparents it into a full-screen overlay above everything (including
    // native modal screens), so it bypasses the provider portal entirely.
    if (usesWindowOverlay) {
      return sheet;
    }
    return /*#__PURE__*/_jsx(Portal, {
      order: openOrder,
      children: sheet
    });
  }
  return sheet;
};
const styles = StyleSheet.create({
  surface: {
    position: 'absolute',
    top: 0,
    bottom: 0
  },
  contentWrapper: {
    flex: 1
  }
});
//# sourceMappingURL=BottomSheet.js.map