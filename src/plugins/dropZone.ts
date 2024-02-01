import { state } from "../state";
import type {
  Node,
  DNDConfig,
  DropZoneConfig,
  DropZoneDragEvent,
  DNDState,
  NodeDragTargetEvent,
  DropZoneTouchEvent,
  DropZoneDragTargetEvent,
  NodeTouchTargetEvent,
  DropZoneTouchTargetEvent,
} from "../types";
import { validateTransfer } from "../validators";
import { transferReturn } from "../actions";
import {
  dzDragTarget,
  dragTransfer,
  nodeDragTarget,
  getTouchTarget,
  touchTransfer,
} from "../utils";

export function setUpDropZone(
  dzConfig: DropZoneConfig = {},
  parent: HTMLElement,
  config: DNDConfig
) {
  const parentData = state.parentData.get(parent);
  if (!parentData) return;
  !config.disabled
    ? activateDZ(parent, dzConfig, parent)
    : deactivateDZ(parent);
  for (const dz of dzConfig.validDropZones || []) {
    activateDZ(dz, dzConfig, parent);
  }
  const parentConfig = parentData.config;
  if (!parentConfig || !parentConfig.setDraggable) return;
  const setDraggable = parentConfig.setDraggable;
  parentConfig.setDraggable = (node: Node) => {
    setDraggable(node);
    setNodeEvents(node);
    return node;
  };
}

export function tearDownDropZone(parent: HTMLElement) {
  deactivateDZ(parent);
}

/**
 * Activates a dropzone.
 *
 * @param dz - The dropzone element.
 * @param dzConfig - The dropzone configuration.
 * @param parent - The parent element (which indicates that we were not dealing
 * with a parent).
 */
export function activateDZ(
  dz: HTMLElement,
  dzConfig?: DropZoneConfig,
  parent?: HTMLElement
) {
  dz.addEventListener("dragover", dzDragEvent);
  dz.addEventListener("drop", dzDragEvent);
  const parentData = state.parentData.get(dz);
  if (!parentData) return;
  if (parent) {
    parentData.dzConfig = dzConfig;
    state.dropZones.set(dz, parent);
    state.parentData.set(dz, parentData);
  } else {
    parentData.dzConfig = dzConfig;
    state.parentData.set(dz, parentData);
  }
}

/**
 * Deactivates a dropzone.
 *
 * @param dz - The dropzone element.
 * @param parent - The parent element.
 */
function deactivateDZ(dz: HTMLElement) {
  dz.removeEventListener("dragover", dzDragEvent);
  dz.removeEventListener("drop", dzDragEvent);
  const parentData = state.parentData.get(dz);
  if (!parentData) return;
}

function setNodeEvents(node: Node) {
  node.addEventListener("dragover", nodeDragEvent);
  node.addEventListener("touchmove", nodeTouchEvent);
}

function dzDragEvent(e: DragEvent): void {
  e.stopPropagation();
  e.preventDefault();
  const targetData = dzDragTarget(e);
  if (targetData === undefined) return;
  const transferData = dragTransfer();
  if (transferData === undefined) return;
  const event: DropZoneDragTargetEvent = {
    event: e,
    ...targetData,
    ...transferData,
  };
  const dzConfig = event.targetParentData.dzConfig;
  switch (event.event.type) {
    case "dragover":
      if (
        state.lastParent !== event.targetParent &&
        event.draggedParent !== event.targetParent
      ) {
        handleTransfer(event, state);
        state.enterCount++;
        state.leftParent = true;
      }
      break;
    case "drop":
      if (event.targetParent !== event.draggedParent) {
        dzConfig && dzConfig.drop
          ? dzConfig.drop(event, state, transferDrop)
          : transferDrop(event, state);
      }
  }
}

function nodeDragEvent(e: DragEvent): void {
  e.stopPropagation();
  e.preventDefault();
  const targetData = nodeDragTarget(e);
  if (!targetData) return;
  const transferData = dragTransfer();
  if (transferData === undefined) return;
  const event: NodeDragTargetEvent = {
    event: e,
    ...targetData,
    ...transferData,
  };
  if (!event) return;
  if (
    e.type === "dragover" &&
    state.lastParent !== event.targetParent &&
    event.targetParent !== event.draggedParent
  ) {
    const dzConfig = event.targetParentData?.dzConfig;
    // TODO:
    if (dzConfig && dzConfig.nodeDropZone === false) return;
    if (event.targetParent !== event.draggedParent) {
      handleTransfer(event, state);
      state.leftParent = true;
    }
  }
}

function nodeTouchEvent(e: TouchEvent): void {
  if (e.type !== "touchmove") return;
  const targetData = getTouchTarget(e);
  if (targetData === undefined) return;
  const transferData = touchTransfer();
  if (transferData === undefined) return;
  if ("targetNode" in targetData) {
    const nodeEvent: NodeTouchTargetEvent = {
      event: e,
      ...targetData,
      ...transferData,
    };
    if (nodeEvent.targetParent === nodeEvent.draggedParent) {
      transferReturn(nodeEvent, state);
      return;
    }
    if (nodeEvent.lastParent == nodeEvent.targetParent) return;
    handleTransfer(nodeEvent, state);
    state.leftParent = true;
  } else {
    const parentEvent: DropZoneTouchEvent = {
      event: e,
      ...targetData,
      ...transferData,
    };
    if (
      parentEvent.lastParent !== parentEvent.draggedParent &&
      parentEvent.draggedParent === parentEvent.targetParent
    ) {
      transferReturn(parentEvent, state);
      state.leftParent = false;
    } else if (
      parentEvent.targetParent !== parentEvent.draggedParent &&
      parentEvent.lastParent !== parentEvent.targetParent
    ) {
      handleTransfer(parentEvent, state);
      state.leftParent = true;
    }
  }
}

function handleTransfer(
  e:
    | DropZoneDragTargetEvent
    | NodeDragTargetEvent
    | DropZoneTouchTargetEvent
    | NodeTouchTargetEvent,
  state: DNDState
) {
  if (!validateTransfer(e)) return;
  const dzConfig = e.targetParentData.dzConfig;
  dzConfig?.transfer
    ? dzConfig.transfer(e, state, transferAction)
    : transferAction(e, state);
  state.lastParent = e.targetParent;
}

/**
 * Used when the dragged element enters into another list (not that of its
 * initial dragged element parent).
 *
 * @param data - The transfer data,
 * @param hook
 */
export function transferAction(
  e:
    | DropZoneDragTargetEvent
    | NodeDragTargetEvent
    | DropZoneTouchTargetEvent
    | NodeTouchTargetEvent,
  state: DNDState
): void {
  let lastParentValues = [...e.lastParentData.getValues(e.lastParent)];
  const draggedNodeValues = state.draggedNodes.map(
    (x) => state.nodeData.get(x)?.value
  );
  lastParentValues = [
    ...lastParentValues.filter((x) => !draggedNodeValues.includes(x)),
  ];
  const targetParentValues = [...e.targetParentData.getValues(e.targetParent)];
  if ("targetNodeData" in e) {
    targetParentValues.splice(
      e.targetNodeData.index,
      0,
      ...state.draggedNodes.map((x: Node) => state.nodeData.get(x)?.value)
    );
  } else {
    targetParentValues.push(...draggedNodeValues);
  }

  e.lastParentData.setValues(e.lastParent, lastParentValues);
  e.targetParentData.setValues(e.targetParent, targetParentValues);
}

function transferDrop(_event: DropZoneDragEvent, state: DNDState) {
  if (!state.draggedNode) return;
}
