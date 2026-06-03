"use strict";

/** A detent value in points, or `'content'` to size to the measured content height. */

/** A draggable detent or an object form that can mark a detent as programmatic-only. */

/** Marks a detent as reachable only via controlled `index` updates, not dragging. */
export const programmatic = value => ({
  value,
  programmatic: true
});
export const detentValue = detent => {
  if (typeof detent === 'object' && detent !== null) return detent.value;
  return detent;
};
export const isDetentProgrammatic = detent => {
  if (typeof detent === 'object' && detent !== null) {
    return detent.programmatic === true;
  }
  return false;
};
const VELOCITY_THRESHOLD = 800;
export const findSnapTarget = (currentTranslate, velocityY, currentIndex, allPositions) => {
  const draggablePositions = allPositions.filter(position => position.isDraggable);
  const effectivePositions = draggablePositions.length > 0 ? draggablePositions : allPositions;
  let targetIndex = currentIndex;
  let minDistance = Infinity;
  for (const position of effectivePositions) {
    const distance = Math.abs(currentTranslate - position.translateY);
    if (distance < minDistance) {
      minDistance = distance;
      targetIndex = position.index;
    }
  }
  if (Math.abs(velocityY) > VELOCITY_THRESHOLD) {
    if (velocityY > 0) {
      const lowerPosition = effectivePositions.filter(position => position.translateY > currentTranslate + 1).sort((a, b) => a.translateY - b.translateY)[0];
      if (lowerPosition !== undefined) targetIndex = lowerPosition.index;
    } else {
      const upperPosition = effectivePositions.filter(position => position.translateY < currentTranslate - 1).sort((a, b) => b.translateY - a.translateY)[0];
      if (upperPosition !== undefined) targetIndex = upperPosition.index;
    }
  }
  return targetIndex;
};
export const resolveDetent = (detent, contentHeight, maxHeight) => {
  const detentValueInput = detentValue(detent);
  if (typeof detentValueInput === 'number') return detentValueInput;
  if (detentValueInput === 'content') {
    return contentHeight > 0 ? Math.min(contentHeight, maxHeight) : maxHeight;
  }
  throw new Error(`Invalid detent: \`${detentValueInput}\`.`);
};
export const clampIndex = (index, detentCount) => {
  if (detentCount <= 0) return 0;
  return Math.min(Math.max(index, 0), detentCount - 1);
};
//# sourceMappingURL=bottomSheetUtils.js.map