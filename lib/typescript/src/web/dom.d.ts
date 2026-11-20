import type { ColorValue } from 'react-native';
export declare const readSafeAreaTop: () => number;
export declare const isScrollbarHit: (event: PointerEvent) => boolean;
export declare const isTextEditingTarget: (target: EventTarget | null) => boolean;
export declare const clamp: (value: number, min: number, max: number) => number;
/**
 * Formats a color for CSS. Platform color objects have no web equivalent and
 * draw transparent.
 */
export declare const processedColorToCss: (color: ColorValue) => string;
//# sourceMappingURL=dom.d.ts.map