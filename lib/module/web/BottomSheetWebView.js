"use strict";

import { Children, isValidElement, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { StyleSheet, View } from 'react-native';
import { BottomSheetWebController } from "./controller.js";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const DEFAULT_CORNER_RADII = [0, 0, 0, 0];
const DEFAULT_SHADOWS = [];

// React Native for Web views render DOM elements, and their refs resolve to
// them.
const asElement = view => view;

/**
 * The web counterpart of the native `BottomSheetSurfaceView`. The host
 * identifies it by component type, like the native hosts do, and lays it out
 * to cover the full sheet.
 */
export const BottomSheetSurfaceView = props => /*#__PURE__*/_jsx(View, {
  ...props
});

/**
 * The web counterpart of the native `BottomSheetView`. It accepts the same
 * props and emits the same events, delegating geometry, gestures, and
 * animation to `BottomSheetWebController`.
 */
export const BottomSheetView = props => {
  const {
    children,
    style,
    ref,
    detents,
    index,
    animateIn,
    animateContentHeight,
    modal,
    windowOverlay = false,
    openOrder = 0,
    hasCloseRequestHandler,
    scrollExpandCoordination,
    scrollCollapseCoordination,
    settleDuration,
    scrimColor,
    scrimAccessibilityLabel,
    surfaceCornerRadii = DEFAULT_CORNER_RADII,
    surfaceShadows = DEFAULT_SHADOWS,
    // CSS has no continuous corner curve; corners are drawn circular. Taken
    // out of the props so it is not forwarded to the host view.
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    surfaceCornerCurve,
    // Android only. Taken out of the props for the same reason.
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    surfaceElevation,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    surfaceShadowColor,
    onIndexChange,
    onSettle,
    onPositionChange,
    onCloseRequest,
    ...viewProps
  } = props;
  const [controller] = useState(() => new BottomSheetWebController());
  const hostRef = useRef(null);
  const scrimRef = useRef(null);
  const scrimDismissRef = useRef(null);
  const containerRef = useRef(null);
  const cardRef = useRef(null);
  const shadowRef = useRef(null);
  const surfaceRef = useRef(null);
  const contentRef = useRef(null);
  // Detents that fail validation are found while measuring, outside render.
  // Rethrow them during render so error boundaries see them, as the native
  // hosts raise them as fatal errors.
  const [error, setError] = useState(null);
  // In window-overlay mode the sheet is portaled into the document body, which
  // only exists on the client.
  const [canPortal, setCanPortal] = useState(false);
  const setHostRef = useCallback(view => {
    hostRef.current = view;
    if (typeof ref === 'function') {
      ref(view);
    } else if (ref != null) {
      ref.current = view;
    }
  }, [ref]);
  useEffect(() => {
    setCanPortal(true);
  }, []);
  const isMounted = !windowOverlay || canPortal;
  useLayoutEffect(() => {
    const host = asElement(hostRef.current);
    const scrim = asElement(scrimRef.current);
    const scrimDismiss = asElement(scrimDismissRef.current);
    const container = asElement(containerRef.current);
    const card = asElement(cardRef.current);
    const shadow = asElement(shadowRef.current);
    const surfaceElement = asElement(surfaceRef.current);
    const content = asElement(contentRef.current);
    if (!host || !scrim || !scrimDismiss || !container || !card || !shadow || !surfaceElement || !content) {
      return;
    }
    controller.attach({
      host,
      scrim,
      scrimDismiss,
      container,
      card,
      shadow,
      surface: surfaceElement,
      content
    });
    return () => controller.detach();
  }, [controller, isMounted]);
  useLayoutEffect(() => {
    controller.setCallbacks({
      onIndexChange: newIndex => onIndexChange?.({
        nativeEvent: {
          index: newIndex
        }
      }),
      onSettle: newIndex => onSettle?.({
        nativeEvent: {
          index: newIndex
        }
      }),
      onPositionChange: (position, positionIndex) => onPositionChange?.({
        nativeEvent: {
          position,
          index: positionIndex
        }
      }),
      onCloseRequest: () => onCloseRequest?.({
        nativeEvent: null
      }),
      onError: message => setError(new Error(message))
    });
    controller.update({
      detents,
      index,
      animateIn: animateIn !== false,
      animateContentHeight: animateContentHeight !== false,
      modal: modal === true,
      hasCloseRequestHandler: hasCloseRequestHandler === true,
      openOrder,
      scrollExpandCoordination,
      scrollCollapseCoordination,
      settleDuration: settleDuration ?? 0,
      cornerRadii: surfaceCornerRadii,
      shadows: surfaceShadows
    });
  });
  if (error !== null) {
    throw error;
  }
  if (!isMounted) {
    return null;
  }
  let surface = null;
  const sheetContent = [];
  Children.toArray(children).forEach(child => {
    if (/*#__PURE__*/isValidElement(child) && child.type === BottomSheetSurfaceView) {
      surface = child;
    } else {
      sheetContent.push(child);
    }
  });
  const sheet = /*#__PURE__*/_jsxs(View, {
    ...viewProps,
    ref: setHostRef,
    style: [styles.host, style, windowOverlay && StyleSheet.absoluteFill],
    children: [/*#__PURE__*/_jsx(View, {
      ref: scrimRef,
      style: [StyleSheet.absoluteFill, {
        backgroundColor: scrimColor
      }]
    }), /*#__PURE__*/_jsx(View, {
      ref: scrimDismissRef,
      role: "button",
      "aria-label": scrimAccessibilityLabel
      // Out of the tab order: Escape is the keyboard's dismissal path.
      ,
      focusable: false,
      style: styles.scrimDismiss,
      pointerEvents: "none"
    }), /*#__PURE__*/_jsxs(View, {
      ref: containerRef,
      style: styles.container
      // Hand React Native for Web's responder to the sheet once it drags, so
      // pressables under the pointer cancel their press.
      ,
      onMoveShouldSetResponderCapture: controller.shouldCaptureResponder
      // Only the card takes pointers: a press in a corner it clips away
      // reaches the scrim (or the page) instead. Presses on the card still
      // bubble through here to the drag listeners.
      ,
      pointerEvents: "box-none",
      children: [/*#__PURE__*/_jsx(View, {
        ref: shadowRef,
        style: styles.shadow,
        pointerEvents: "none"
      }), /*#__PURE__*/_jsxs(View, {
        ref: cardRef,
        style: StyleSheet.absoluteFill,
        children: [/*#__PURE__*/_jsx(View, {
          ref: surfaceRef,
          style: StyleSheet.absoluteFill,
          pointerEvents: "box-none",
          children: surface
        }), /*#__PURE__*/_jsx(View, {
          ref: contentRef,
          children: sheetContent
        })]
      })]
    })]
  });
  if (windowOverlay) {
    return /*#__PURE__*/createPortal(/*#__PURE__*/_jsx(View, {
      style: [styles.overlay, {
        zIndex: openOrder
      }],
      pointerEvents: "box-none",
      children: sheet
    }), getOverlayLayer());
  }
  return sheet;
};
let overlayLayer = null;

/**
 * The layer that holds every window-overlay sheet. It sits above React Native
 * for Web's `Modal` layer (z-index 9999), matching the window overlay's place
 * above modal screens. As its own stacking context, it keeps the sheets'
 * open-order z-indexes from competing with the app's.
 */
const getOverlayLayer = () => {
  if (overlayLayer === null || !overlayLayer.isConnected) {
    overlayLayer = document.createElement('div');
    Object.assign(overlayLayer.style, {
      position: 'fixed',
      inset: '0',
      zIndex: '10000',
      pointerEvents: 'none'
    });
    document.body.appendChild(overlayLayer);
  }
  return overlayLayer;
};
const styles = StyleSheet.create({
  host: {
    overflow: 'hidden'
  },
  scrimDismiss: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    transformOrigin: 'top'
  },
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0
  },
  shadow: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0
  },
  overlay: {
    // React Native for Web supports fixed positioning; the overlay spans the
    // viewport above the app, like the native window-level overlay.
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  }
});
//# sourceMappingURL=BottomSheetWebView.js.map