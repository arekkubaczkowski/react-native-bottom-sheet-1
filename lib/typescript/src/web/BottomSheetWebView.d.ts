import { type ComponentRef, type ReactNode, type Ref } from 'react';
import { View, type ViewProps } from 'react-native';
import type { NativeProps } from '../BottomSheetNativeComponent';
type ViewInstance = ComponentRef<typeof View>;
type BottomSheetViewProps = NativeProps & {
    children?: ReactNode;
    ref?: Ref<ViewInstance>;
};
/**
 * The web counterpart of the native `BottomSheetSurfaceView`. The host
 * identifies it by component type, like the native hosts do, and lays it out
 * to cover the full sheet.
 */
export declare const BottomSheetSurfaceView: (props: ViewProps & {
    ref?: Ref<ViewInstance>;
}) => import("react").JSX.Element;
/**
 * The web counterpart of the native `BottomSheetView`. It accepts the same
 * props and emits the same events, delegating geometry, gestures, and
 * animation to `BottomSheetWebController`.
 */
export declare const BottomSheetView: (props: BottomSheetViewProps) => import("react").JSX.Element | null;
export {};
//# sourceMappingURL=BottomSheetWebView.d.ts.map