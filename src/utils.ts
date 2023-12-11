import type {
  DragTransfer,
  TouchTransfer,
  DropZoneTarget,
  NodeTarget,
  NodeDragEvent,
  NodeTouchEvent,
  Node,
  DNDState,
  NodeDragTargetEvent,
  NodeTouchTargetEvent,
  DropZoneDragEvent,
} from "./types";
import { isNode } from "./predicates";
import { state } from "./state";

/**
 * Conditional to check if the code is running in a browser.
 *
 * @internal
 */
export const isBrowser = typeof window !== "undefined";

export function cleanUp(
  e:
    | NodeDragTargetEvent
    | NodeTouchTargetEvent
    | NodeTouchEvent
    | DropZoneDragEvent
) {
  if (!state.draggedNode || !state.initialParent || !state.lastParent) return;

  const config = state.parentData.get(state.initialParent)?.config;

  const root = config?.root || document;

  if (config) {
    const hasSelections = state.selectedValues.length > 0;

    const isTouch = e.event instanceof TouchEvent;

    let dropZoneClass: string | undefined;

    if (isTouch) {
      dropZoneClass = hasSelections
        ? config.touchSelectionDropZoneClass
        : config.touchDropZoneClass;
    } else {
      dropZoneClass = hasSelections
        ? config.selectionDropZoneClass
        : config.dropZoneClass;
    }

    handleClass(state.draggedNodes, dropZoneClass, state, true);

    if (dropZoneClass) {
      const elsWithDropZoneClass = root.querySelectorAll(
        `.${splitClass(dropZoneClass)}`
      );

      handleClass(Array.from(elsWithDropZoneClass), dropZoneClass, state, true);
    }
  }

  handleClass(
    state.draggedNodes,
    state.parentData.get(state.initialParent)?.config?.longTouchClass,
    state,
    true
  );

  state.touchedNode?.remove();
  state.touchedNode = undefined;
  state.lastParent = undefined;
  state.draggedNode = undefined;
  state.draggedNodes = [];
  state.selectedNodes = [];
  state.selectedValues = [];
  state.touchStartTop = state.touchedNode = undefined;
  state.touchStartLeft = 0;
  state.lastValue = undefined;
  state.touchMoving = false;
  state.lastCoordinates = {
    x: 0,
    y: 0,
  };
  state.direction = undefined;
  if (state.scrollParent) {
    state.scrollParent.style.overflow = state.scrollParentOverflow || "";
    state.scrollParent = undefined;
    state.scrollParentOverflow = undefined;
  }
}

export function dragTransfer(): DragTransfer | undefined {
  if (!state.draggedNode || !state.lastParent || !state.initialParent) return;
  const draggedNodeData = state.nodeData.get(state.draggedNode);
  const draggedParentData = state.parentData.get(state.initialParent);
  const lastParentData = state.parentData.get(state.lastParent);
  if (!draggedNodeData || !draggedParentData || !lastParentData) return;
  else
    return {
      draggedNode: state.draggedNode,
      draggedNodeData,
      draggedParent: state.initialParent,
      draggedParentData,
      lastParent: state.lastParent,
      lastParentData,
    };
}

export function touchTransfer(): TouchTransfer | undefined {
  if (!state.touchedNode) return;
  const data = dragTransfer();
  if (data === undefined) return;
  const transferTouchData: TouchTransfer = {
    ...data,
    touchedNode: state.touchedNode,
  };
  return transferTouchData;
}

export function nodeDragTarget(e: DragEvent): NodeTarget | undefined {
  if (!isNode(e.currentTarget, state)) return;
  const targetNodeData = state.nodeData.get(e.currentTarget);
  const targetParentData = state.parentData.get(
    e.currentTarget.parentNode || state.lastParent
  );
  if (!targetNodeData || !targetParentData) return;
  const targetData: NodeTarget = {
    targetNode: e.currentTarget,
    targetNodeData,
    targetParent: e.currentTarget.parentNode || state.lastParent,
    targetParentData,
  };
  return targetData;
}

export function dzDragTarget(e: DragEvent): DropZoneTarget | undefined {
  if (!isNode(e.currentTarget, state)) return;
  const targetParentData = state.parentData.get(e.currentTarget);
  if (!targetParentData) return;
  const targetData: DropZoneTarget = {
    targetParent: e.currentTarget,
    targetParentData,
  };
  return targetData;
}

export function getTouchTarget(
  e: TouchEvent
): NodeTarget | DropZoneTarget | undefined {
  const newX = e.touches[0].clientX;
  const newY = e.touches[0].clientY;
  const nodes = document.elementsFromPoint(newX, newY);
  if (!nodes) return;
  for (const node of nodes) {
    if (isNode(node, state) && state.nodeData.has(node)) {
      const targetNode = node;
      const targetNodeData = state.nodeData.get(targetNode);
      const targetParentData = state.parentData.get(targetNode.parentNode);
      if (!targetNodeData || !targetParentData) return;
      return {
        targetNode: targetNode,
        targetNodeData,
        targetParent: targetNode.parentNode,
        targetParentData,
      };
    } else if (node instanceof HTMLElement && state.dropZones.has(node)) {
      if (!state.parentData.has(node)) return;
      const targetParentData = state.parentData.get(node);
      if (!targetParentData) return;
      return {
        targetParent: node,
        targetParentData,
      };
    }
  }
  return undefined;
}

export function handleSelections(
  e: NodeDragEvent | NodeTouchEvent,
  selectedValues: Array<any>,
  state: DNDState,
  x: number,
  y: number
) {
  state.selectedValues = selectedValues;

  for (const child of e.draggedParentData.enabledNodes) {
    if (child === e.draggedNode) {
      state.selectedNodes.push(child);
      continue;
    }

    const childValue = state.nodeData.get(child)?.value;

    if (!childValue) continue;

    if (selectedValues?.includes(childValue)) {
      state.draggedNodes.push(child);
    }
  }

  const config = e.draggedParentData.config;

  const clonedEls = state.draggedNodes.map((x: Node) => {
    const el = x.cloneNode(true) as Node;

    copyNodeStyle(x, el, true);
    if (e.event instanceof DragEvent)
      handleClass([el], config?.selectionDraggingClass, state);

    return el;
  });

  setTimeout(() => {
    if (e.event instanceof DragEvent && config?.selectionDropZoneClass)
      for (const node of state.draggedNodes) {
        node.classList.add(config?.selectionDropZoneClass);
      }
  });

  state.clonedDraggedNodes = clonedEls;

  return { e, clonedEls, x, y };
}

export function stackNodes({
  e,
  clonedEls,
  x,
  y,
}: {
  e: NodeDragEvent | NodeTouchEvent;
  clonedEls: Array<Node>;
  x: number;
  y: number;
}) {
  const wrapper = document.createElement("div");

  if (!(wrapper instanceof HTMLElement)) return;

  for (const el of clonedEls) wrapper.append(el);

  const rect = e.draggedNode.getBoundingClientRect();

  wrapper.style.cssText = `
        display: flex;
        flex-direction: column;
        width: ${rect.width}px;
        position: absolute;
        left: -9999px
      `;

  document.body.append(wrapper);

  if (e.event instanceof DragEvent) {
    e.event.dataTransfer?.setDragImage(wrapper, x, y);

    setTimeout(() => {
      wrapper.remove();
    });
  } else {
    state.touchedNode = wrapper;
  }
}

export function copyNodeStyle(
  sourceNode: Node,
  targetNode: Node,
  omitKeys = false
) {
  const computedStyle = window.getComputedStyle(sourceNode);

  const omittedKeys = [
    "position",
    "top",
    "left",
    "x",
    "y",
    "transform-origin",
    "filter",
    "-webkit-text-fill-color",
  ];

  for (const key of Array.from(computedStyle)) {
    if (omitKeys === false && key && omittedKeys.includes(key)) continue;
    targetNode.style.setProperty(
      key,
      computedStyle.getPropertyValue(key),
      computedStyle.getPropertyPriority(key)
    );
  }

  for (const child of Array.from(sourceNode.children)) {
    if (!isNode(child, state)) continue;

    const targetChild = targetNode.children[
      Array.from(sourceNode.children).indexOf(child)
    ] as Node;

    copyNodeStyle(child, targetChild, omitKeys);
  }
}

export function handleClass(
  nodes: Array<Node | HTMLElement | Element>,
  className: string | undefined,
  state: DNDState,
  remove = false,
  omitAppendPrivateClass = false
) {
  if (!className) return;

  const classNames = splitClass(className);

  if (!classNames.length) return;

  remove
    ? removeClass(nodes, classNames, state)
    : addClass(nodes, classNames, state, omitAppendPrivateClass);
}

export function addClass(
  nodes: Array<Node | HTMLElement | Element>,
  classNames: Array<string>,
  state: DNDState,
  omitAppendPrivateClass = false
) {
  for (const node of nodes) {
    if (!isNode(node, state) || !state.nodeData.has(node)) {
      node.classList.add(...classNames);

      continue;
    }

    const privateClasses = [];

    const nodeData = state.nodeData.get(node);

    if (!nodeData) continue;

    for (const className of classNames) {
      if (!node.classList.contains(className)) {
        node.classList.add(className);
      } else if (omitAppendPrivateClass === false) {
        privateClasses.push(className);
      }
    }

    nodeData.privateClasses = privateClasses;

    state.nodeData.set(node, nodeData);
  }
}

export function removeClass(
  nodes: Array<Node | HTMLElement | Element>,
  classNames: Array<string>,
  state: DNDState
) {
  for (const node of nodes) {
    if (!isNode(node, state)) {
      node.classList.remove(...classNames);

      continue;
    }

    const nodeData = state.nodeData.get(node);

    if (!nodeData) continue;

    for (const className of classNames) {
      if (!nodeData.privateClasses.includes(className)) {
        node.classList.remove(className);
      }
    }
  }
}

export function splitClass(className: string): Array<string> {
  return className.split(" ").filter((x) => x);
}

export function getScrollParent(
  node: HTMLElement | null
): HTMLElement | undefined {
  if (node == null) {
    return undefined;
  }

  if (node.scrollHeight > node.clientHeight) {
    return node;
  } else {
    if (node.parentNode instanceof HTMLElement)
      return getScrollParent(node.parentNode);
  }
  return undefined;
}
