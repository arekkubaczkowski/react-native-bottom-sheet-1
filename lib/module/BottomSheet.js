"use strict";

import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaFrame, useSafeAreaInsets } from 'react-native-safe-area-context';
import BottomSheetNativeView from './BottomSheetNativeComponent';
import BottomSheetSurfaceNativeComponent from './BottomSheetSurfaceNativeComponent';
import { Portal } from "./BottomSheetProvider.js";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export { programmatic } from "./bottomSheetUtils.js";

/**
 * Payload of the {@link BottomSheetProps.onPositionChange} event, accessed as
 * `event.nativeEvent`.
 */

/**
 * Props for the inline bottom-sheet component.
 */

/** Native bottom sheet that renders inline within the current screen layout. */
export const BottomSheet = ({
  children,
  surface,
  style,
  detents = [0, 'content'],
  index,
  animateIn = true,
  onIndexChange,
  onSettle,
  onPositionChange,
  wrapNativeView,
  modal = false,
  disableScrollableNegotiation = false,
  scrimColor,
  scrimOpacities
}) => {
  const {
    height: windowHeight
  } = useSafeAreaFrame();
  const insets = useSafeAreaInsets();
  const maxHeight = windowHeight - insets.top;
  const nativeDetents = detents.map(detent => {
    const programmatic = isDetentProgrammatic(detent);
    const value = resolveDetentValue(detent);
    if (value === 'content') {
      return {
        value: 0,
        kind: 'content',
        programmatic
      };
    }
    return {
      value: Math.max(0, Math.min(value, maxHeight)),
      kind: 'points',
      programmatic
    };
  });
  const clampedIndex = Math.max(0, Math.min(index, nativeDetents.length - 1));
  const selectedDetentValue = detents[clampedIndex] ? resolveDetentValue(detents[clampedIndex]) : 0;
  const isCollapsed = selectedDetentValue === 0;
  // Default the scrim opacity per detent: transparent at any closed detent,
  // fully opaque at every open one. Mapping each detent independently keeps
  // this correct regardless of the order detents are passed in.
  const resolvedScrimOpacity = scrimOpacities ?? detents.map(detent => resolveDetentValue(detent) === 0 ? 0 : 1);
  const handleIndexChange = event => {
    onIndexChange?.(event.nativeEvent.index);
  };
  const handleSettle = event => {
    onSettle?.(event.nativeEvent.index);
  };

  // The native sheet view, optionally wrapped (e.g. with
  // `Animated.createAnimatedComponent`) so a Reanimated worklet can handle
  // `onPositionChange` on the UI thread. Wrapping the leaf native view (rather
  // than this whole component) keeps the animated boundary on the host that
  // emits events—so it resolves at mount, inline or inside the modal portal
  // alike. Computed once: a fresh wrapped component each render would remount
  // the native sheet.
  const [NativeView] = useState(() => wrapNativeView?.(BottomSheetNativeView) ?? BottomSheetNativeView);
  const sheet = /*#__PURE__*/_jsx(View, {
    style: StyleSheet.absoluteFill,
    pointerEvents: modal ? isCollapsed ? 'none' : 'auto' : 'box-none',
    children: /*#__PURE__*/_jsx(View, {
      pointerEvents: "box-none",
      style: StyleSheet.absoluteFill,
      children: /*#__PURE__*/_jsxs(NativeView, {
        pointerEvents: "box-none",
        style: [{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          // The native host always spans the full height of its container.
          // Detents are still capped to `maxHeight`, so the sheet itself
          // never extends under the status bar.
          height: windowHeight
        }, style],
        detents: nativeDetents,
        maxDetentHeight: maxHeight,
        index: index,
        animateIn: animateIn,
        modal: modal,
        disableScrollableNegotiation: disableScrollableNegotiation,
        scrimColor: scrimColor,
        scrimOpacities: resolvedScrimOpacity,
        onIndexChange: handleIndexChange,
        onSettle: handleSettle,
        onPositionChange: onPositionChange,
        children: [surface != null && /*#__PURE__*/_jsx(BottomSheetSurfaceNativeComponent, {
          collapsable: false,
          pointerEvents: "box-none",
          style: StyleSheet.absoluteFill,
          children: surface
        }), /*#__PURE__*/_jsxs(View, {
          collapsable: false,
          style: {
            flex: 1,
            maxHeight
          },
          children: [children, /*#__PURE__*/_jsx(View, {
            collapsable: false,
            pointerEvents: "none"
          })]
        })]
      })
    })
  });
  if (modal) {
    return /*#__PURE__*/_jsx(Portal, {
      children: sheet
    });
  }
  return sheet;
};
function isDetentProgrammatic(detent) {
  if (typeof detent === 'object' && detent !== null) {
    return detent.programmatic === true;
  }
  return false;
}
function resolveDetentValue(detent) {
  if (typeof detent === 'object' && detent !== null) {
    return detent.value;
  }
  return detent;
}
//# sourceMappingURL=BottomSheet.js.map