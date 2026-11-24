import { type CodegenTypes, type ColorValue, type ViewProps } from 'react-native';
type NativeDetent = Readonly<{
    value: CodegenTypes.Double;
    kind: string;
    programmatic: boolean;
    usesStatusBarTopInset: boolean;
    insetTop: CodegenTypes.Double;
    insetLeft: CodegenTypes.Double;
    insetRight: CodegenTypes.Double;
    insetBottom: CodegenTypes.Double;
    widestCard: boolean;
    maxWidth: CodegenTypes.Double;
    placementBias: CodegenTypes.Double;
    scrimOpacity: CodegenTypes.Double;
    cornerRadius: CodegenTypes.Double;
    cornerRadiusTransitionDistance: CodegenTypes.Double;
    bottomAnchoredContentTopInset: CodegenTypes.Double;
}>;
export interface NativeProps extends ViewProps {
    detents: ReadonlyArray<NativeDetent>;
    index: CodegenTypes.Int32;
    animateIn?: CodegenTypes.WithDefault<boolean, true>;
    animateContentHeight?: CodegenTypes.WithDefault<boolean, true>;
    modal: boolean;
    windowOverlay?: boolean;
    openOrder?: CodegenTypes.Int32;
    hasCloseRequestHandler: boolean;
    scrollExpandCoordination: CodegenTypes.Int32;
    scrollCollapseCoordination: CodegenTypes.Int32;
    settleDuration?: CodegenTypes.WithDefault<CodegenTypes.Double, 0>;
    scrimColor?: ColorValue;
    scrimAccessibilityLabel?: string;
    surfaceCornerRadii?: ReadonlyArray<CodegenTypes.Double>;
    surfaceCornerCurve?: CodegenTypes.WithDefault<'circular' | 'continuous', 'circular'>;
    surfaceShadows?: ReadonlyArray<Readonly<{
        offsetX: CodegenTypes.Double;
        offsetY: CodegenTypes.Double;
        blurRadius: CodegenTypes.Double;
        spreadDistance: CodegenTypes.Double;
        color: ColorValue;
        opacity: CodegenTypes.Double;
        excludesInterior: boolean;
    }>>;
    surfaceElevation?: CodegenTypes.WithDefault<CodegenTypes.Double, 0>;
    surfaceShadowColor?: ColorValue;
    onIndexChange?: CodegenTypes.DirectEventHandler<Readonly<{
        index: CodegenTypes.Int32;
    }>>;
    onSettle?: CodegenTypes.DirectEventHandler<Readonly<{
        index: CodegenTypes.Int32;
    }>>;
    onPositionChange?: CodegenTypes.DirectEventHandler<Readonly<{
        position: CodegenTypes.Double;
        index: CodegenTypes.Double;
    }>>;
    onCloseRequest?: CodegenTypes.DirectEventHandler<null>;
}
declare const _default: import("react-native").HostComponent<NativeProps>;
export default _default;
//# sourceMappingURL=BottomSheetNativeComponent.d.ts.map