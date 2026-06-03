/** A detent value in points, or `'content'` to size to the measured content height. */
export type DetentValue = number | 'content';
/** A draggable detent or an object form that can mark a detent as programmatic-only. */
export type Detent = DetentValue | {
    value: DetentValue;
    programmatic?: boolean;
};
/** Marks a detent as reachable only via controlled `index` updates, not dragging. */
export declare const programmatic: (value: DetentValue) => Detent;
export declare const detentValue: (detent: Detent) => DetentValue;
export declare const isDetentProgrammatic: (detent: Detent) => boolean;
export declare const findSnapTarget: (currentTranslate: number, velocityY: number, currentIndex: number, allPositions: {
    index: number;
    translateY: number;
    isDraggable: boolean;
}[]) => number;
export declare const resolveDetent: (detent: Detent, contentHeight: number, maxHeight: number) => number;
export declare const clampIndex: (index: number, detentCount: number) => number;
//# sourceMappingURL=bottomSheetUtils.d.ts.map