import { isBrowser } from "./utils";
import type {
  DNDConfig,
  Node,
  NodeDragTargetEvent,
  NodeTouchEvent,
  NodeTouchTargetEvent,
  DropZoneDragTargetEvent,
  DNDState,
  NodeTarget,
  DropZoneTarget,
} from "./types";
import { validateSort } from "./validators";
import { isNode } from "./predicates";
import { state } from "./state";
import {
  dragstart,
  sort,
  transferReturn,
  dragleave,
  end,
  touchstart,
  touchmove,
  drop,
} from "./actions";
import {
  nodeDragTarget,
  getTouchTarget,
  dzDragTarget,
  dragTransfer,
  touchTransfer,
  handleClass,
} from "./utils";

export { setUpDropZone } from "./plugins/dropZone";

export * from "./types";

function dragover(e: DragEvent) {
  e.preventDefault();
}

/**
 * Initializes the drag and drop functionality.
 *
 * @param id - The id of the parent element.
 * @param getValues - A function that returns the current values of the parent element.
 * @param setValues - A function that sets the values of the parent element.
 * @param config - The config for the parent element.
 *
 * @returns void
 * @internal
 */
export default function initParent(
  parent: HTMLElement,
  getValues: (parent: HTMLElement) => Array<any>,
  setValues: (parent: HTMLElement, values: Array<any>) => void,
  config: DNDConfig
): void {
  if (!isBrowser) return;

  document.addEventListener("dragover", dragover);

  if (!state.parents.has(parent)) {
    state.parents.add(parent);

    const nodesObserver = new MutationObserver(nodesMutated);

    nodesObserver.observe(parent, { childList: true });

    if (parent.parentNode) {
      parent.addEventListener("dragenter", dzDragEvent);

      parent.addEventListener("dragover", dzDragEvent);

      parent.addEventListener("dragleave", dzDragEvent);

      parent.addEventListener("drop", dzDragEvent);

      const parentObserver = new MutationObserver(parentMutated);

      parentObserver.observe(parent.parentNode, { childList: true });

      if (!(parent.parentNode instanceof HTMLElement)) return;

      state.parentObservers.set(parent.parentNode, parentObserver);
    }
  }

  if (!config.setDraggable) {
    config.setDraggable = setDraggable;
  }

  if (!config.removeDraggable) {
    config.removeDraggable = removeDraggable;
  }

  const currentPlugins = state.parentData.get(parent)?.config?.plugins;

  currentPlugins?.forEach((plugin) => {
    if (plugin.tearDown) {
      plugin.tearDown(parent, config);
    }
  });

  state.parentData.set(parent, {
    getValues,
    setValues,
    config,
    enabledNodes: [],
  });

  config.plugins?.forEach((plugin: any) => {
    plugin.setUp(parent, config);
  });

  remap(parent);
}

function parentMutated(mutationList: MutationRecord[]) {
  for (const mutation of mutationList) {
    for (const removedNode of Array.from(mutation.removedNodes)) {
      if (!(removedNode instanceof HTMLElement)) continue;

      const parentData = state.parentData.has(removedNode);

      if (!parentData) continue;

      state.parentData.delete(removedNode);

      let hasParent = false;

      for (const node of Array.from(mutation.target.childNodes)) {
        if (state.parents.has(node as HTMLElement)) {
          state.parents.delete(removedNode);

          hasParent = true;

          break;
        }
      }

      if (!hasParent) {
        const parentObserver = state.parentObservers.get(
          mutation.target as HTMLElement
        );

        if (parentObserver) {
          parentObserver.disconnect();
          state.parentObservers.delete(mutation.target as HTMLElement);
        }
      }
    }
  }
}

/**
 * Called when the nodes of a given parent element are mutated.
 *
 * @param mutationList - The list of mutations.
 *
 * @returns void
 *
 * @internal
 */
function nodesMutated(mutationList: MutationRecord[]) {
  const parentEl = mutationList[0].target;

  if (!(parentEl instanceof HTMLElement)) return;

  remap(parentEl);
}

/**
 * Remaps the data of the parent element's children.
 *
 * @param parent - The parent element.
 *
 * @returns void
 *
 * @internal
 */
function remap(parent: HTMLElement) {
  const parentData = state.parentData.get(parent);

  if (!parentData) return;

  const enabledNodes: Array<Node> = [];

  const config = parentData.config;

  for (let x = 0; x < parent.children.length; x++) {
    const child = parent.children[x];

    if (!isNode(child, state)) continue;

    if (
      (config && config.draggable && !config.draggable(child)) ||
      config?.disabled
    ) {
      if (state.removeDraggable) state.removeDraggable(child);
    } else if (parentData.config?.setDraggable) {
      parentData.config.setDraggable(child);

      enabledNodes.push(child);
    }
  }

  if (enabledNodes.length !== parentData.getValues(parent).length) {
    console.warn(
      "The number of enabled nodes does not match the number of values."
    );
    return;
  }

  const values = parentData.getValues(parent);
  for (let x = 0; x < enabledNodes.length; x++) {
    const child = enabledNodes[x];

    state.nodeData.set(child, {
      value: values[x],
      index: x,
      privateClasses: [],
    });

    if (!state.draggedNode || !config) continue;

    let dropZoneClass: string | undefined;

    const hasSelections = state.selectedValues.includes(values[x]);

    if (
      !hasSelections &&
      state.nodeData.get(state.draggedNode)?.value !== values[x]
    )
      continue;

    const isTouch = !!state.touchedNode;
    if (isTouch) {
      dropZoneClass = hasSelections
        ? config?.touchSelectionDropZoneClass
        : config?.touchDropZoneClass;
    } else {
      dropZoneClass = hasSelections
        ? config?.selectionDropZoneClass
        : config?.dropZoneClass;
    }

    handleClass([child], dropZoneClass, state, false, true);
  }

  state.parentData.set(parent, { ...parentData, enabledNodes });
}

function removeDraggable(child: Node) {
  if (child.getAttribute("draggable") === "true") {
    child.removeAttribute("draggable");
  }
  child.removeEventListener("dragstart", nodeDragEvent);
  child.removeEventListener("dragenter", nodeDragEvent);
  child.removeEventListener("dragend", nodeDragEvent);
  child.removeEventListener("dragover", nodeDragEvent);
  child.removeEventListener("touchstart", nodeTouchEvent);
  child.removeEventListener("touchmove", nodeTouchEvent);
  child.removeEventListener("touchend", nodeTouchEvent);
}

function setDraggable(child: Node) {
  child.setAttribute("draggable", "true");
  child.addEventListener("dragstart", nodeDragEvent);
  child.addEventListener("dragenter", nodeDragEvent);
  child.addEventListener("dragend", nodeDragEvent);
  child.addEventListener("dragover", nodeDragEvent);
  child.addEventListener("touchstart", nodeTouchEvent, { passive: false });
  child.addEventListener("touchmove", nodeTouchEvent, { passive: false });
  child.addEventListener("touchend", nodeTouchEvent);
}

export function nodeDragEvent(e: DragEvent): void {
  e.stopPropagation();

  const targetData = nodeDragTarget(e);

  if (!targetData) return;

  if (e.type === "dragstart") {
    state.lastParent = targetData.targetParent;

    state.draggedNode = targetData.targetNode;

    state.initialParent = targetData.targetParent;

    if (!state.draggedNode) return;

    state.draggedNodes = [state.draggedNode];

    state.initialParentValues = targetData.targetParentData.getValues(
      targetData.targetParent
    );
  }

  const transferData = dragTransfer();

  if (transferData === undefined) return;

  const eventData: NodeDragTargetEvent = {
    event: e,
    ...targetData,
    ...transferData,
  };

  const draggedConfig = eventData.draggedParentData.config;

  switch (eventData.event.type) {
    case "dragstart":
      draggedConfig?.dragstart
        ? draggedConfig.dragstart(eventData, state, dragstart)
        : dragstart(eventData, state);
      break;
    case "dragover":
      eventData.event.preventDefault();
      if (eventData.targetNode === eventData.draggedNode) {
        state.lastValue = eventData.targetNodeData.value;
        return;
      }

      if (eventData.targetParent === eventData.lastParent) {
        handleSort(eventData, state);
      } else {
        // TODO:
        const config = eventData.targetParentData.config;
        config?.transferReturn
          ? config.transferReturn(eventData, state, transferReturn)
          : transferReturn(eventData, state);
      }
      break;
    case "dragend":
      draggedConfig?.end
        ? draggedConfig.end(eventData, state, end)
        : end(eventData, state);
      break;
    default:
      break;
  }
}

function nodeTouchEvent(e: TouchEvent): void {
  e.stopPropagation();
  if (state.touchMoving && e.type === "touchstart") return;
  if (!isNode(e.currentTarget, state)) return;

  if (e.type === "touchstart") {
    state.draggedNode = e.currentTarget;

    const clone = e.currentTarget.cloneNode(true);

    if (!(clone instanceof HTMLElement)) return;

    const parentData = state.parentData.get(e.currentTarget.parentNode);

    if (!parentData) return;

    const parentValues = parentData.getValues(e.currentTarget.parentNode);

    if (!parentValues) return;

    state.touchedNode = clone;

    state.draggedNodes = [state.draggedNode];

    state.lastParent = e.currentTarget.parentNode;

    state.initialParent = e.currentTarget.parentNode;

    state.initialParentValues = parentValues;
  }

  if (!state.touchedNode) return;

  const transferData = touchTransfer();

  if (transferData === undefined) return;

  const config = transferData.draggedParentData.config;

  const touchEvent: NodeTouchEvent = {
    event: e,
    ...transferData,
  };

  const draggedConfig = touchEvent.draggedParentData.config;
  let touchTarget: NodeTarget | DropZoneTarget | undefined;
  switch (e.type) {
    case "touchstart":
      config?.touchstart
        ? config.touchstart(touchEvent, state, touchstart)
        : touchstart(touchEvent, state);
      break;
    case "touchmove":
      config?.touchmove
        ? config.touchmove(touchEvent, state, touchmove)
        : touchmove(touchEvent, state);

      if (config?.longTouch && !state.longTouch) return;

      touchTarget = getTouchTarget(e);

      if (!touchTarget) return;

      if ("targetNode" in touchTarget) {
        const event: NodeTouchTargetEvent = {
          event: e,
          ...touchTarget,
          ...transferData,
        };

        if (event.targetNode === event.draggedNode) {
          state.lastValue = event.targetNodeData.value;
          return;
        }

        if (event.targetParent === event.lastParent) {
          handleSort(event, state);
        }
      }
      break;
    case "touchend":
      //state.touchedNode.remove();
      state.touchMoving = false;

      draggedConfig?.end
        ? draggedConfig.end(touchEvent, state, end)
        : end(touchEvent, state);
      break;
  }
}

function dzDragEvent(e: DragEvent): void {
  e.stopPropagation();

  e.preventDefault();

  const targetData = dzDragTarget(e);

  if (!targetData) return;

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
      if (event.targetParent === event.draggedParent && state.leftParent) {
        event.targetParentData.config?.transferReturn
          ? event.targetParentData.config.transferReturn(
              event,
              state,
              transferReturn
            )
          : transferReturn(event, state);

        state.leftParent = false;
      }
      break;
    case "dragleave":
      event.event.preventDefault();

      if (
        !event.targetParent.contains(
          document.elementFromPoint(event.event.clientX, event.event.clientY)
        )
      ) {
        event.targetParentData.config?.dragleave
          ? event.targetParentData.config.dragleave(event, state, dragleave)
          : dragleave(event, state);
        state.leftParent = true;
      } else if (
        state.lastParent !== event.targetParent &&
        state.lastParent === event.draggedParent
      ) {
        // TODO: Not sure if needed
        //if (event.targetParent === event.draggedParent && state.leftParent) {
        //  state.enterCount++;
        //  event.targetParentData.config?.transferReturn
        //    ? event.targetParentData.config.transferReturn(
        //        event,
        //        state,
        //        transferReturn
        //      )
        //    : transferReturn(event, state);
        //  state.leftParent = false;
        //}
      }
      break;
    case "drop":
      if (event.targetParent == event.draggedParent) {
        dzConfig && dzConfig.drop
          ? dzConfig.drop(event, state, drop)
          : drop(event, state);
      }
  }
}

function handleSort(
  event: NodeDragTargetEvent | NodeTouchTargetEvent,
  state: DNDState
) {
  const clientX =
    "touchedNode" in event
      ? event.event.touches[0].clientX
      : event.event.clientX;

  const clientY =
    "touchedNode" in event
      ? event.event.touches[0].clientY
      : event.event.clientY;
  if (state.lastValue === event.targetNodeData.value) {
    if (state.direction !== 1) {
      return;
    }

    if (
      clientY >= state.lastCoordinates.y - 20 &&
      clientX >=
        state.lastCoordinates.x -
          event.targetNode.getBoundingClientRect().width / 20
    ) {
      return;
    }
  }
  if (!validateSort(event)) {
    return;
  }

  state.lastValue = event.targetNodeData.value;

  state.lastCoordinates = { x: clientX, y: clientY };

  state.direction =
    event.targetNodeData.index > event.draggedNodeData.index ? 1 : -1;

  event.targetParentData.config?.sort
    ? event.targetParentData.config.sort(event, state, sort)
    : sort(event, state);
}
