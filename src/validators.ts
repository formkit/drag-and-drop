import {
  DropZoneDragTargetEvent,
  NodeDragTargetEvent,
  DropZoneTouchTargetEvent,
  NodeTouchTargetEvent,
} from "./types";
import { state } from "./state";

/**
 * Validates sort action should be performed.
 *
 * @param nEvent
 *
 * @returns {boolean} - Whether or not the sort action should be performed.
 * @internal
 */
export function validateSort(
  e: NodeDragTargetEvent | NodeTouchTargetEvent
): boolean {
  const dzConfig = e.targetParentData.dzConfig;

  if (dzConfig && dzConfig.nodeDropZone === false) return false;

  return e.targetParentData.config?.sortable !== false;
}

/**
 * Validates child transfer action should be performed.
 *
 * @param e
 *
 * @returns {boolean} - Whether or not the child transfer action should be performed.
 * @internal
 */
export function validateTransfer(
  e:
    | DropZoneDragTargetEvent
    | NodeDragTargetEvent
    | DropZoneTouchTargetEvent
    | NodeTouchTargetEvent
): boolean {
  const draggedValues = state.draggedNodes.map(
    (el) => state.nodeData.get(el)?.value
  );

  const targetParentValues = e.targetParentData.getValues(e.targetParent);

  const draggedParentValues = e.draggedParentData.getValues(e.draggedParent);

  const ctData = {
    name: e.targetParentData.config?.name,
    group: e.targetParentData.dzConfig?.group,
    values: targetParentValues,
  };

  const deData = {
    name: e.draggedParentData.config?.name,
    group: e.draggedParentData.dzConfig?.group,
    values: draggedParentValues,
  };

  const accepts = e.targetParentData.dzConfig?.accepts;

  if (accepts) return accepts(ctData, deData, draggedValues);
  else if (ctData.group) {
    return ctData.group === deData.group;
  }

  return true;
}
