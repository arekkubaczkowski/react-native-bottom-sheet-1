"use strict";

import { createContext, useContext, useId, useLayoutEffect, useState, useSyncExternalStore } from 'react';
import { StyleSheet, View } from 'react-native';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const PortalContext = /*#__PURE__*/createContext(null);
const PortalHost = () => {
  const context = useContext(PortalContext);
  const portals = useSyncExternalStore(context.subscribe, context.getSnapshot, context.getSnapshot);
  return portals.map(([key, element]) => /*#__PURE__*/_jsx(View, {
    style: StyleSheet.absoluteFill,
    pointerEvents: "box-none",
    children: element
  }, key));
};

/** Provides the portal host required for modal bottom sheets. */
export const BottomSheetProvider = ({
  children
}) => {
  const [context] = useState(() => {
    const portals = new Map();
    const subscribers = new Set();
    let snapshot = [];
    const notify = () => {
      snapshot = Array.from(portals.entries());
      subscribers.forEach(subscriber => subscriber());
    };
    return {
      addPortal: (key, element) => {
        portals.set(key, element);
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
  children
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
    addPortal(id, children);
  }, [id, children, addPortal]);
  useLayoutEffect(() => {
    return () => {
      removePortal(id);
    };
  }, [id, removePortal]);
  return null;
};
//# sourceMappingURL=BottomSheetProvider.js.map