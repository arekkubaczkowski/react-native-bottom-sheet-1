import type { ReactNode } from 'react';
/** Props for {@link BottomSheetProvider}. */
export interface BottomSheetProviderProps {
    /** The app content. Modal sheets render above it. */
    children: ReactNode;
}
/** Provides the portal host required for modal bottom sheets. */
export declare const BottomSheetProvider: ({ children }: BottomSheetProviderProps) => import("react").JSX.Element;
export declare const Portal: ({ children, order, }: {
    children: ReactNode;
    /** Stacking order among portals: higher renders on top. */
    order?: number;
}) => null;
//# sourceMappingURL=BottomSheetProvider.d.ts.map