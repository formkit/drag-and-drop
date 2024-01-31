import type {
  Node,
  NodeTouchEventData,
  NodeRecord,
  NodeEventData,
} from "./types";

//import { State } from "./globals";

import { cleanup, getScrollParent, handleClass } from "./utils";

export const defaultActions = {
  touchstart,
  touchmove,
  end,
};

/**
 * Defines the dragged elements and sets the drag image.
 *
 * @param el - The element that is being dragged.
 * @param e - The drag event.
 */
export function dragstart(data: NodeEventData) {
  // TODO: Allow this to be configurable
  if (data.e && data.e instanceof DragEvent && data.e.dataTransfer) {
    data.e.dataTransfer.dropEffect = "move";

    data.e.dataTransfer.effectAllowed = "move";
  }

  return;

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

export function touchstart(data: NodeTouchEventData) {
  return;
  data.e.stopPropagation();

  if (!State.touchedNode) return;

  const draggedNode = data.targetData.node.el;

  const rect = draggedNode.getBoundingClientRect();

  State.touchStartLeft = data.e.touches[0].clientX - rect.left;

  State.touchStartTop = data.e.touches[0].clientY - rect.top;

  const config = data.targetData.parent.data.config;

  const selectedValues =
    config?.setSelections && config?.setSelections(draggedNode.parentNode);

  if (Array.isArray(selectedValues) && selectedValues.length) {
    stackNodes(
      handleSelections(
        data.e,
        selectedValues,
        State,
        State.touchStartLeft,
        State.touchStartTop
      )
    );
  } else {
    State.touchedNode.style.cssText = `
            width: ${rect.width}px;
            position: absolute;
            pointer-events: none;
            top: -9999px;
            z-index: 999999;
            display: none;
          `;

    document.body.append(State.touchedNode);

    copyNodeStyle(data.targetData.node.el, State.touchedNode as Node);

    State.touchedNode.style.display = "none";
  }

  if (config?.longTouch) {
    State.longTouchTimeout = setTimeout(() => {
      State.longTouch = true;

      const parentScroll = getScrollParent(draggedNode);

      if (parentScroll) {
        State.scrollParent = parentScroll;

        State.scrollParentOverflow = parentScroll.style.overflow;

        parentScroll.style.overflow = "hidden";
      }

      if (config.longTouchClass)
        if (data.e.cancelable)
          handleClass(
            State.draggedNodes.map((x) => x.el),
            config.longTouchClass,
            State
          );

      data.e.preventDefault();

      document.addEventListener("contextmenu", function (e) {
        e.preventDefault();
      });
    }, 200);
  }
}

export function touchmove(data: NodeTouchEventData) {
  const state = State;

  if (!state.touchedNode) return;

  const config = data.targetData.parent.data.config;

  if (config?.longTouch && !state.longTouch) {
    clearTimeout(state.longTouchTimeout);

    return;
  }

  if (state.touchMoving !== true) {
    state.touchMoving = true;

    handleClass(
      state.draggedNodes.map((x) => x.el),
      config?.longTouchClass,
      state,
      true
    );

    //const hasSelections =
    //  Array.isArray(state.selectedValues) && state.selectedValues.length;

    //if (hasSelections) {
    //  handleClass(
    //    state.clonedDraggedNodes,
    //    config?.touchSelectionDraggingClass,
    //    state
    //  );

    //  handleClass(
    //    state.draggedNodes,
    //    config?.touchSelectionDropZoneClass,
    //    state
    //  );
    //} else {
    //  handleClass([state.touchedNode], config?.touchDraggingClass, state);
    //  handleClass(state.draggedNodes, config?.touchDropZoneClass, state);
    //}
  }

  state.touchedNode.style.display = "block";

  const x = data.e.touches[0].clientX + window.scrollX;

  const y = data.e.touches[0].clientY + window.scrollY;

  const windowHeight = window.innerHeight + window.scrollY;

  if (y > windowHeight - 50) {
    window.scrollBy(0, 10);
  } else if (y < window.scrollY + 50) {
    window.scrollBy(0, -10);
  }

  const touchStartLeft = state.touchStartLeft ?? 0;

  const touchStartTop = state.touchStartTop ?? 0;

  state.touchedNode.style.left = `${x - touchStartLeft}px`;

  state.touchedNode.style.top = `${y - touchStartTop}px`;

  if (data.e.cancelable) data.e.preventDefault();
}

/**
 * Used when the dragged element is inserted to another element of its list.
 *
 * @param data - Event data.
 *
 *
 * @internal
 *
 * @returns {void}
 */
export function sort(data: NodeEventData) {
  const targetParentValues = data.targetData.parent.data.getValues(
    data.targetData.parent.el
  );

  const draggedNodeValues = State.draggedNodes.map(
    (x: NodeRecord) => x.data.value
  );

  const newParentValues = [
    ...targetParentValues.filter((x: Node) => !draggedNodeValues.includes(x)),
  ];

  newParentValues.splice(
    data.targetData.node.data.index,
    0,
    ...draggedNodeValues
  );

  data.targetData.parent.data.setValues(
    data.targetData.parent.el,
    newParentValues
  );
}

/**
 * Used when the dragged element is dropped outside of a dropzone.
 *
 * @param state - The current state of the DND system.
 */
export function end(eventData: NodeEventData) {
  if (eventData.e instanceof DragEvent && State.longTouch) return;

  if (!(eventData.e instanceof DragEvent)) {
    State.longTouch = false;
    clearTimeout(State.longTouchTimeout);
  }

  cleanup(eventData);
}
