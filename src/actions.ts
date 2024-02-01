import type {
  DNDState,
  Node,
  NodeTouchEvent,
  NodeDragTargetEvent,
  NodeTouchTargetEvent,
  DropZoneDragEvent,
  DropZoneTouchEvent,
  DropZoneDragTargetEvent,
} from "./types";
import {
  cleanUp,
  stackNodes,
  copyNodeStyle,
  handleSelections,
  getScrollParent,
  handleClass,
} from "./utils";

/**
 * Defines the dragged elements and sets the drag image.
 *
 * @param el - The element that is being dragged.
 * @param e - The drag event.
 */
export function dragstart(e: NodeDragTargetEvent, state: DNDState) {
  // TODO: Allow this to be configurable
  if (e.event.dataTransfer) {
    e.event.dataTransfer.dropEffect = "move";

    e.event.dataTransfer.effectAllowed = "move";
  }
  const config = e.targetParentData.config;

  const selectedValues =
    config?.setSelections && config?.setSelections(e.draggedNode.parentNode);

  if (Array.isArray(selectedValues) && selectedValues.length) {
    const targetRect = e.targetNode.getBoundingClientRect();

    const x = e.event.clientX - targetRect.left;

    const y = e.event.clientY - targetRect.top;

    stackNodes(handleSelections(e, selectedValues, state, x, y));
  } else if (config) {
    handleClass(state.draggedNodes, config.draggingClass, state);

    setTimeout(() => {
      handleClass(state.draggedNodes, config.draggingClass, state, true);
      handleClass(state.draggedNodes, config.dropZoneClass, state);
    });
  }
}

export function touchstart(e: NodeTouchEvent, state: DNDState) {
  e.event.stopPropagation();

  const rect = e.draggedNode.getBoundingClientRect();

  state.touchStartLeft = e.event.touches[0].clientX - rect.left;

  state.touchStartTop = e.event.touches[0].clientY - rect.top;

  const config = e.draggedParentData.config;

  const selectedValues =
    config?.setSelections && config?.setSelections(e.draggedNode.parentNode);

  if (Array.isArray(selectedValues) && selectedValues.length) {
    stackNodes(
      handleSelections(
        e,
        selectedValues,
        state,
        state.touchStartLeft,
        state.touchStartTop
      )
    );
  } else {
    state.touchedNode = e.touchedNode;

    e.touchedNode.style.cssText = `
            width: ${rect.width}px;
            position: absolute;
            pointer-events: none;
            top: -9999px;
            z-index: 999999;
            display: none;
          `;

    document.body.append(e.touchedNode);

    copyNodeStyle(e.draggedNode, e.touchedNode as Node);

    e.touchedNode.style.display = "none";
  }

  if (config?.longTouch) {
    state.longTouchTimeout = setTimeout(() => {
      state.longTouch = true;

      const parentScroll = getScrollParent(e.draggedNode);

      if (parentScroll) {
        state.scrollParent = parentScroll;

        state.scrollParentOverflow = parentScroll.style.overflow;

        parentScroll.style.overflow = "hidden";
      }

      if (config.longTouchClass)
        handleClass(state.draggedNodes, config.longTouchClass, state);

      if (e.event.cancelable) e.event.preventDefault();

      document.addEventListener("contextmenu", function (e) {
        e.preventDefault();
      });
    }, 200);
  }
}

export function touchmove(e: NodeTouchEvent, state: DNDState) {
  if (!state.touchedNode) return;

  const config = e.draggedParentData.config;

  if (config?.longTouch && !state.longTouch) {
    clearTimeout(state.longTouchTimeout);
    return;
  }

  if (state.touchMoving !== true) {
    state.touchMoving = true;

    handleClass(state.draggedNodes, config?.longTouchClass, state, true);

    const hasSelections =
      Array.isArray(state.selectedValues) && state.selectedValues.length;

    if (hasSelections) {
      handleClass(
        state.clonedDraggedNodes,
        config?.touchSelectionDraggingClass,
        state
      );

      handleClass(
        state.draggedNodes,
        config?.touchSelectionDropZoneClass,
        state
      );
    } else {
      handleClass([state.touchedNode], config?.touchDraggingClass, state);
      handleClass(state.draggedNodes, config?.touchDropZoneClass, state);
    }
  }

  e.touchedNode.style.display = "block";

  const x = e.event.touches[0].clientX + window.scrollX;

  const y = e.event.touches[0].clientY + window.scrollY;

  const windowHeight = window.innerHeight + window.scrollY;

  if (y > windowHeight - 50) {
    window.scrollBy(0, 10);
  } else if (y < window.scrollY + 50) {
    window.scrollBy(0, -10);
  }

  const touchStartLeft = state.touchStartLeft ?? 0;

  const touchStartTop = state.touchStartTop ?? 0;

  e.touchedNode.style.left = `${x - touchStartLeft}px`;

  e.touchedNode.style.top = `${y - touchStartTop}px`;

  if (e.event.cancelable) e.event.preventDefault();
}

/**
 * Used when the dragged element is inserted to another element of its list.
 *
 * @param e - The drag event.
 * @param state - The current state of the DND system.
 *
 * @internal
 * @returns {void}
 */
export function sort(
  e: NodeDragTargetEvent | NodeTouchTargetEvent,
  state: DNDState
) {
  const targetParentValues = e.targetParentData.getValues(e.targetParent);

  const draggedNodeValues = state.draggedNodes.map(
    (x) => state.nodeData.get(x)?.value
  );

  const newParentValues = [
    ...targetParentValues.filter((x: Node) => !draggedNodeValues.includes(x)),
  ];

  newParentValues.splice(e.targetNodeData.index, 0, ...draggedNodeValues);
  e.targetParentData.setValues(e.targetParent, newParentValues);
}

/**
 * Used when a dragged element is transferred back to its original list.
 *
 * @param e
 * @param dragData
 */
export function transferReturn(
  e:
    | NodeDragTargetEvent
    | DropZoneDragTargetEvent
    | NodeTouchTargetEvent
    | DropZoneTouchEvent,
  state: DNDState
) {
  if (e.draggedParent === e.lastParent) return;

  const leftParentValues = [...e.lastParentData.getValues(e.lastParent)];

  const draggedValues = state.draggedNodes.map(
    (x) => state.nodeData.get(x)?.value
  );

  const newLeftParentValues = [
    ...leftParentValues.filter((x: Node) => !draggedValues.includes(x)),
  ];

  e.lastParentData.setValues(e.lastParent, newLeftParentValues);

  state.lastParent = e.draggedParent;

  e.draggedParentData.setValues(e.draggedParent, state.initialParentValues);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function dragleave(_e: DropZoneDragEvent, _state: DNDState) {}

/**
 * Used when the dragged element is dropped outside of a dropzone.
 *
 * @param state - The current state of the DND system.
 */
export function end(
  e: NodeDragTargetEvent | NodeTouchTargetEvent | NodeTouchEvent,
  state: DNDState
) {
  if (e.event instanceof DragEvent && state.longTouch) return;

  if (!(e.event instanceof DragEvent)) {
    state.longTouch = false;
    clearTimeout(state.longTouchTimeout);
  }

  if (
    state.draggedNode &&
    state.draggedNode.parentNode &&
    state.draggedNode.parentNode !== state.lastParent &&
    state.initialParent
  ) {
    const deData = state.nodeData.get(state.draggedNode);

    if (deData) {
      const deParentData = state.parentData.get(state.draggedNode.parentNode);

      const deParentValues = [
        ...(deParentData?.getValues(state.draggedNode.parentNode) || []),
      ];

      const deIndex = deData.index;

      deParentValues.splice(deIndex, state.draggedNodes.length);

      deParentData?.setValues(state.initialParent, deParentValues);
    }
  }

  cleanUp(e);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function drop(e: DropZoneDragEvent, _state: DNDState) {
  cleanUp(e);
}
