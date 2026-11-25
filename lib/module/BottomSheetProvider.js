"use strict";

import { createContext, useContext, useId, useLayoutEffect, useState, useSyncExternalStore } from 'react';
import { StyleSheet, View } from 'react-native';
import { BottomSheetPortalHostView } from './BottomSheetHostViews';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const PortalContext = /*#__PURE__*/createContext(null);
const PortalHost = () => {
  const context = useContext(PortalContext);
  const portals = useSyncExternalStore(context.subscribe, context.getSnapshot, context.getSnapshot);
  if (portals.length === 0) {
    return null;
  }
  return (
    /*#__PURE__*/
    // While a sheet in it is open, the native host hides its siblings - the
    // screen behind the sheets - from screen readers. See issue #75.
    _jsx(BottomSheetPortalHostView, {
      style: StyleSheet.absoluteFill,
      pointerEvents: "box-none",
      children: portals.map(([key, element]) => /*#__PURE__*/_jsx(View, {
        style: StyleSheet.absoluteFill,
        pointerEvents: "box-none"
        // Keep this wrapper a real native view (Android). As a layout-only
        // view Fabric flattens it, and portal-entry churn (a sheet remounted
        // while the previous instance tears down) makes the differ unflatten
        // it mid-flight - a reparenting batch that can arrive without the
        // wrapper's Create mutation, killing the surface with "Unable to
        // find viewState for tag". See issue #78.
        ,
        collapsable: false,
        children: element
      }, key))
    })
  );
};

/** Props for {@link BottomSheetProvider}. */

/** Provides the portal host required for modal bottom sheets. */
export const BottomSheetProvider = ({
  children
}) => {
  const [context] = useState(() => {
    const portals = new Map();
    const subscribers = new Set();
    let snapshot = [];
    const notify = () => {
      // Higher orders render later, so on top. The sort is stable, so equal
      // orders keep the order in which their portals mounted.
      snapshot = Array.from(portals.entries()).sort(([, a], [, b]) => a.order - b.order).map(([key, {
        element
      }]) => [key, element]);
      subscribers.forEach(subscriber => subscriber());
    };
    return {
      addPortal: (key, element, order) => {
        portals.set(key, {
          element,
          order
        });
        notify();
      },
      removePortal: key => {
        portals.delete(key);
        notify();
      },
      subscribe: callback => {
        subscribers.add(callback);
        return () => {
          subscribers.delete(callback);
        };
      },
      getSnapshot: () => snapshot
    };
  });
  return /*#__PURE__*/_jsxs(PortalContext.Provider, {
    value: context,
    children: [children, /*#__PURE__*/_jsx(PortalHost, {})]
  });
};
export const Portal = ({
  children,
  order = 0
}) => {
  const context = useContext(PortalContext);
  if (context === null) {
    throw new Error('`Portal` must be used within `BottomSheetProvider`.');
  }
  const {
    addPortal,
    removePortal
  } = context;
  const id = useId();
  useLayoutEffect(() => {
    addPortal(id, children, order);
  }, [id, children, order, addPortal]);
  useLayoutEffect(() => {
    return () => {
      removePortal(id);
    };
  }, [id, removePortal]);
  return null;
};
//# sourceMappingURL=BottomSheetProvider.js.map