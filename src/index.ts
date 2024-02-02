import type {
  InitParent,
  Node,
  DNDPlugin,
  NodeEventData,
  TouchOverNodeEvent,
  ParentObservers,
  ParentsData,
  NodesData,
  DragState,
  TouchState,
  DragStateProps,
  TouchStateProps,
  NodeData,
  ParentData,
  SetupNodeData,
  TearDownNodeData,
  NodeTargetData,
  ParentConfig,
  ParentTargetData,
  ParentEventData,
  TouchOverParentEvent,
  NodeDragEventData,
  NodeTouchEventData,
} from "./types";

import {
  isBrowser,
  handleClass,
  getElFromPoint,
  isNode,
  getScrollParent,
  addEvents,
  copyNodeStyle,
  eventCoordinates,
  splitClass,
} from "./utils";

export * from "./types";

export { multiDrag } from "./plugins/multiDrag";

export const nodes: NodesData = new WeakMap<Node, NodeData>();

export const parents: ParentsData = new WeakMap<HTMLElement, ParentData>();

export const parentObservers: ParentObservers = new WeakMap<
  HTMLElement,
  MutationObserver
>();

/**
 * The state of the drag and drop. Is undefined until either dragstart or
 * touchstart is called.
 */
export let state: DragState | TouchState | undefined = undefined;

export function resetState() {
  state = undefined;
}

/**
 * @param {DragStateProps} dragStateProps - Attributes to update state with.
 *
 * @mutation - Updates state with node values.
 *
 * @returns void
 */
export function setDragState(dragStateProps: DragStateProps): DragState {
  state = {
    direction: undefined,
    enterCount: 0,
    lastCoordinates: { x: 0, y: 0 },
    lastValue: undefined,
    clonedDraggedEls: [],
    ...dragStateProps,
  } as DragState;

  return state;
}

export function setTouchState(
  dragState: DragState,
  touchStateProps: TouchStateProps
): TouchState {
  state = {
    ...dragState,
    ...touchStateProps,
  };

  return state as TouchState;
}

export function dragStateProps(targetData: NodeTargetData): DragStateProps {
  return {
    draggedNode: {
      el: targetData.node.el,
      data: targetData.node.data,
    },
    draggedNodes: [
      {
        el: targetData.node.el,
        data: targetData.node.data,
      },
    ],
    initialParent: {
      el: targetData.parent.el,
      data: targetData.parent.data,
    },
    lastParent: {
      el: targetData.parent.el,
      data: targetData.parent.data,
    },
  };
}

export function performSort(
  state: DragState | TouchState,
  data: NodeDragEventData | NodeTouchEventData
) {
  const draggedValues = dragValues(state);

  const targetParentValues = parentValues(
    data.targetData.parent.el,
    data.targetData.parent.data
  );

  const newParentValues = [
    ...targetParentValues.filter((x: any) => !draggedValues.includes(x)),
  ];

  newParentValues.splice(data.targetData.node.data.index, 0, ...draggedValues);

  setParentValues(data.targetData.parent.el, data.targetData.parent.data, [
    ...newParentValues,
  ]);
}

export function parentValues(
  parent: HTMLElement,
  parentData: ParentData
): Array<any> {
  return [...parentData.getValues(parent)];
}

export function setParentValues(
  parent: HTMLElement,
  parentData: ParentData,
  values: Array<any>
): void {
  parentData.setValues(parent, values);
}

export function dragValues(state: DragState | TouchState): Array<any> | any {
  return [...state.draggedNodes.map((x) => x.data.value)];
}

/**
 * Initializes the drag and drop functionality for a given parent.
 *
 * @param id - The id of the parent element.
 *
 * @param getValues - A function that returns the current values of the parent element.
 *
 * @param setValues - A function that sets the values of the parent element.
 *
 * @param config - The config for the parent element.
 *
 * @returns void
 *
 */
export function initParent({
  parent,
  getValues,
  setValues,
  config = {},
}: InitParent): void {
  if (!isBrowser) return;

  document.addEventListener("dragover", (e) => {
    e.preventDefault();
  });

  tearDownParent(parent);

  const parentData: ParentData = {
    getValues,
    setValues,
    config: {
      handleDragstart,
      handleDragoverNode,
      handleDragoverParent,
      handleDragend,
      handleTouchstart,
      handleTouchmove,
      handleTouchOverNode,
      handleTouchOverParent,
      performSort,
      performTransfer,
      root: document,
      setupNode,
      reapplyDragClasses,
      tearDownNode,
      ...config,
    },
    enabledNodes: [],
    abortControllers: {},
  };

  setupParent(parent, parentData);

  config.plugins?.forEach((plugin) => {
    plugin(parent)?.tearDownParent();
  });

  remapNodes(parent);

  config.plugins?.forEach((plugin: DNDPlugin) => {
    plugin(parent)?.setupParent();
  });
}

function tearDownParent(parent: HTMLElement) {
  const parentData = parents.get(parent);

  if (!parentData) return;

  for (const event of Object.keys(parentData.abortControllers["mainParent"])) {
    parentData.abortControllers["mainParent"][event].abort();
  }

  for (const node of Array.from(parent.children)) {
    if (isNode(node)) {
      nodes.delete(node);
    }
  }

  parents.delete(parent);

  const parentObserver = parentObservers.get(parent.parentNode as HTMLElement);

  if (parentObserver) parentObserver.disconnect();

  parentObservers.delete(parent);
}

function setupParent(parent: HTMLElement, parentData: ParentData) {
  const nodesObserver = new MutationObserver(nodesMutated);

  nodesObserver.observe(parent, { childList: true });

  if (parent.parentNode) {
    const parentObserver = new MutationObserver(parentMutated);

    parentObserver.observe(parent.parentNode, { childList: true });

    if (!(parent.parentNode instanceof HTMLElement)) return;

    parentObservers.set(parent.parentNode, parentObserver);
  }

  parents.set(parent, { ...parentData });

  const abortControllers = addEvents(parent, {
    dragover: parentEventData(parentData.config.handleDragoverParent),
    touchOverParent: parentData.config.handleTouchOverParent,
  });

  parentData.abortControllers["mainParent"] = abortControllers;
}

function parentMutated(mutationList: MutationRecord[]) {
  for (const mutation of mutationList) {
    for (const removedNode of Array.from(mutation.removedNodes)) {
      if (!(removedNode instanceof HTMLElement)) continue;

      const parentData = parents.get(removedNode);

      if (!parentData) continue;

      for (const node of Array.from(removedNode.childNodes)) {
        if (isNode(node) && parentData.enabledNodes.includes(node)) {
          nodes.delete(node);
        }
      }

      parents.delete(removedNode);
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

  remapNodes(parentEl);
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
export function remapNodes(parent: HTMLElement) {
  const parentData = parents.get(parent);

  if (!parentData) return;

  const enabledNodes: Array<Node> = [];

  const config = parentData.config;

  for (let x = 0; x < parent.children.length; x++) {
    const node = parent.children[x];

    if (!isNode(node)) continue;

    const nodeData = nodes.get(node);

    config.tearDownNode({ node, parent, nodeData, parentData });

    if (config.disabled) return;

    if (!config.draggable || (config.draggable && config.draggable(node)))
      enabledNodes.push(node);
  }

  if (
    enabledNodes.length !== parentData.getValues(parent).length &&
    !config.disabled
  ) {
    console.warn(
      "The number of enabled nodes does not match the number of values."
    );

    return;
  }

  const values = parentData.getValues(parent);

  for (let x = 0; x < enabledNodes.length; x++) {
    const node = enabledNodes[x];

    const nodeData = {
      value: values[x],
      index: x,
      privateClasses: [],
      abortControllers: {},
    };

    config.setupNode({ node, parent, parentData, nodeData });
  }

  parents.set(parent, { ...parentData, enabledNodes });
}

export function handleDragstart(data: NodeEventData) {
  if (!(data.e instanceof DragEvent)) return;

  dragstart({
    e: data.e,
    targetData: data.targetData,
  });
}

export function dragstartClasses(
  el: HTMLElement | Node | Element,
  draggingClass: string | undefined,
  dropZoneClass: string | undefined
) {
  handleClass([el], draggingClass);

  setTimeout(() => {
    handleClass([el], draggingClass, true);

    handleClass([el], dropZoneClass);
  });
}

export function initDrag(eventData: NodeDragEventData): DragState {
  const dragState = setDragState(dragStateProps(eventData.targetData));

  if (eventData.e.dataTransfer) {
    eventData.e.dataTransfer.dropEffect = "move";
    eventData.e.dataTransfer.effectAllowed = "move";
  }

  return dragState;
}

function validateDragHandle(data: NodeEventData): boolean {
  if (!(data.e instanceof DragEvent) && !(data.e instanceof TouchEvent))
    return false;

  const config = data.targetData.parent.data.config;

  if (!config.dragHandle) return true;

  const dragHandles = data.targetData.node.el.querySelectorAll(
    config.dragHandle
  );

  if (!dragHandles) return false;

  const coordinates = eventCoordinates(data.e);

  const elFromPoint = config.root.elementFromPoint(
    coordinates.x,
    coordinates.y
  );

  if (!elFromPoint) return false;

  for (const handle of Array.from(dragHandles)) {
    if (elFromPoint === handle || handle.contains(elFromPoint)) return true;
  }

  return false;
}

function touchstart(data: NodeTouchEventData) {
  if (!validateDragHandle(data)) {
    data.e.preventDefault();

    return;
  }

  const touchState = initTouch(data);

  handleTouchedNode(data, touchState);

  handleLongTouch(data, touchState);
}

export function dragstart(data: NodeDragEventData) {
  if (!validateDragHandle(data)) {
    data.e.preventDefault();

    return;
  }

  const config = data.targetData.parent.data.config;

  const dragState = initDrag(data);

  dragstartClasses(
    dragState.draggedNode.el,
    config.draggingClass,
    config.dropZoneClass
  );
}

export function handleTouchOverNode(e: TouchOverNodeEvent) {
  if (!state) return;

  if (e.detail.targetData.parent.el === state.lastParent.el)
    sort(e.detail, state);
}

export function setupNode(data: SetupNodeData) {
  nodes.set(data.node, data.nodeData);

  const config = data.parentData.config;

  data.node.setAttribute("draggable", "true");

  const abortControllers = addEvents(data.node, {
    dragstart: nodeEventData(config.handleDragstart),
    dragover: nodeEventData(config.handleDragoverNode),
    dragend: nodeEventData(config.handleDragend),
    touchstart: nodeEventData(config.handleTouchstart),
    touchmove: nodeEventData(config.handleTouchmove),
    touchend: nodeEventData(config.handleDragend),
    touchOverNode: config.handleTouchOverNode,
  });

  data.nodeData.abortControllers["mainNode"] = abortControllers;

  data.parentData.config.plugins?.forEach((plugin: DNDPlugin) => {
    plugin(data.parent)?.setupNode?.(data);
  });

  config.reapplyDragClasses(data.node, data.parentData);
}

function reapplyDragClasses(node: Node, parentData: ParentData) {
  if (!state) return;

  const dropZoneClass =
    "touchedNode" in state
      ? parentData.config.touchDropZoneClass
      : parentData.config.dropZoneClass;

  const nodeValue = nodes.get(node)?.value;

  if (nodeValue !== state.draggedNode.data.value) return;

  handleClass([node], dropZoneClass, false, true);
}

export function tearDownNode(data: TearDownNodeData) {
  data.node.setAttribute("draggable", "false");

  if (data.nodeData?.abortControllers?.mainNode) {
    for (const event of Object.keys(data.nodeData.abortControllers.mainNode)) {
      data.nodeData.abortControllers.mainNode[event].abort();
    }
  }

  data.parentData.config.plugins?.forEach((plugin: DNDPlugin) => {
    plugin(data.parent)?.tearDownNode?.(data);
  });

  nodes.delete(data.node);
}

export function handleDragend(eventData: NodeEventData) {
  if (!state) return;

  end(eventData, state);

  resetState();
}

export function end(_eventData: NodeEventData, state: DragState | TouchState) {
  if ("longTouchTimeout" in state && state.longTouchTimeout)
    clearTimeout(state.longTouchTimeout);

  const config = parents.get(state.initialParent.el)?.config;

  const root = config?.root || document;

  const isTouch = "touchedNode" in state;

  const dropZoneClass = isTouch
    ? config?.touchDropZoneClass
    : config?.dropZoneClass;

  handleClass(
    state.draggedNodes.map((x) => x.el),
    dropZoneClass,
    true
  );

  if (dropZoneClass) {
    const elsWithDropZoneClass = root.querySelectorAll(
      `.${splitClass(dropZoneClass)}`
    );

    handleClass(Array.from(elsWithDropZoneClass), dropZoneClass, true);
  }

  if (config?.longTouchClass) {
    handleClass(
      state.draggedNodes.map((x) => x.el),
      state.initialParent.data?.config?.longTouchClass,
      true
    );
  }

  if ("touchedNode" in state) {
    state.touchedNode?.remove();

    if (state.scrollParent) {
      state.scrollParent.style.overflow = state.scrollParentOverflow || "";
    }
  }
}

export function handleTouchstart(eventData: NodeEventData) {
  if (!(eventData.e instanceof TouchEvent)) return;

  touchstart({
    e: eventData.e,
    targetData: eventData.targetData,
  });
}

export function initTouch(data: NodeTouchEventData): TouchState {
  data.e.stopPropagation();

  const clonedNode = data.targetData.node.el.cloneNode(true) as HTMLElement;

  const rect = data.targetData.node.el.getBoundingClientRect();

  const touchState = setTouchState(
    setDragState(dragStateProps(data.targetData)),
    {
      touchStartLeft: data.e.touches[0].clientX - rect.left,
      touchStartTop: data.e.touches[0].clientY - rect.top,
      touchedNode: clonedNode,
    }
  );

  return touchState;
}

export function handleTouchedNode(
  data: NodeTouchEventData,
  touchState: TouchState
) {
  touchState.touchedNodeDisplay = touchState.touchedNode.style.display;

  const rect = data.targetData.node.el.getBoundingClientRect();

  touchState.touchedNode.style.cssText = `
            width: ${rect.width}px;
            position: absolute;
            pointer-events: none;
            top: -9999px;
            z-index: 999999;
            display: none;
          `;

  document.body.append(touchState.touchedNode);

  copyNodeStyle(data.targetData.node.el, touchState.touchedNode as Node);

  touchState.touchedNode.style.display = "none";
}

export function handleLongTouch(data: NodeEventData, touchState: TouchState) {
  const config = data.targetData.parent.data.config;

  if (!config.longTouch) return;

  touchState.longTouchTimeout = setTimeout(() => {
    if (!touchState) return;

    touchState.longTouch = true;

    const parentScroll = getScrollParent(touchState.draggedNode.el);

    if (parentScroll) {
      touchState.scrollParent = parentScroll;

      touchState.scrollParentOverflow = parentScroll.style.overflow;

      parentScroll.style.overflow = "hidden";
    }

    if (config.longTouchClass && data.e.cancelable)
      handleClass(
        touchState.draggedNodes.map((x) => x.el),
        config.longTouchClass
      );

    data.e.preventDefault();

    document.addEventListener("contextmenu", function (e) {
      e.preventDefault();
    });
  }, config.longTouchTimeout || 200);
}

export function handleTouchmove(eventData: NodeTouchEventData) {
  if (!state || !("touchedNode" in state)) return;

  touchmove(eventData, state);
}

function touchmoveClasses(touchState: TouchState, config: ParentConfig) {
  if (config.longTouchClass)
    handleClass(
      touchState.draggedNodes.map((x) => x.el),
      config?.longTouchClass,
      true
    );

  if (config.touchDraggingClass)
    handleClass([touchState.touchedNode], config.touchDraggingClass);

  if (config.touchDropZoneClass)
    handleClass(
      touchState.draggedNodes.map((x) => x.el),
      config.touchDropZoneClass
    );
}

function moveTouchedNode(data: NodeTouchEventData, touchState: TouchState) {
  touchState.touchedNode.style.display = touchState.touchedNodeDisplay || "";

  const x = data.e.touches[0].clientX + window.scrollX;

  const y = data.e.touches[0].clientY + window.scrollY;

  const windowHeight = window.innerHeight + window.scrollY;

  if (y > windowHeight - 50) {
    window.scrollBy(0, 10);
  } else if (y < window.scrollY + 50) {
    window.scrollBy(0, -10);
  }

  const touchStartLeft = touchState.touchStartLeft ?? 0;

  const touchStartTop = touchState.touchStartTop ?? 0;

  touchState.touchedNode.style.left = `${x - touchStartLeft}px`;

  touchState.touchedNode.style.top = `${y - touchStartTop}px`;
}

function touchmove(data: NodeTouchEventData, touchState: TouchState) {
  if (data.e.cancelable) data.e.preventDefault();

  const config = data.targetData.parent.data.config;

  if (config.longTouch && !touchState.longTouch) {
    clearTimeout(touchState.longTouchTimeout);

    return;
  }

  if (touchState.touchMoving !== true) {
    touchState.touchMoving = true;

    touchmoveClasses(touchState, config);
  }

  moveTouchedNode(data, touchState);

  const elFromPoint = getElFromPoint(data);

  if (!elFromPoint) return;

  if (
    "node" in elFromPoint &&
    elFromPoint.node.el === touchState.draggedNodes[0].el
  ) {
    touchState.lastValue = data.targetData.node.data.value;

    return;
  }

  const touchMoveEventData = {
    e: data.e,
    targetData: elFromPoint,
  };

  if ("node" in elFromPoint) {
    elFromPoint.node.el.dispatchEvent(
      new CustomEvent("touchOverNode", {
        detail: touchMoveEventData,
      })
    );
  } else {
    elFromPoint.parent.el.dispatchEvent(
      new CustomEvent("touchOverParent", {
        detail: touchMoveEventData,
      })
    );
  }
}

export function handleDragoverNode(data: NodeDragEventData) {
  if (!state) return;

  dragoverNode(data, state);
}

export function handleDragoverParent(eventData: ParentEventData) {
  if (!state) return;

  transfer(eventData, state);
}

export function handleTouchOverParent(e: TouchOverParentEvent) {
  if (!state) return;

  transfer(e.detail, state);
}

export function validateTransfer(
  data: ParentEventData,
  state: DragState | TouchState
) {
  if (data.targetData.parent.el === state.lastParent.el) return false;

  const targetConfig = data.targetData.parent.data.config;

  if (targetConfig.dropZone === false) return false;

  const initialParentConfig = state.initialParent.data.config;

  if (
    targetConfig.accepts &&
    !targetConfig.accepts(
      data.targetData.parent,
      state.initialParent,
      state.lastParent,
      state
    )
  ) {
    return false;
  } else if (
    !targetConfig.group ||
    targetConfig.group !== initialParentConfig.group
  ) {
    return false;
  }

  return true;
}

function dragoverNode(
  eventData: NodeDragEventData | NodeTouchEventData,
  dragState: DragState
) {
  eventData.e.preventDefault();

  eventData.targetData.parent.el === dragState.lastParent?.el
    ? sort(eventData, dragState)
    : transfer(eventData, dragState);
}

export function validateSort(
  data: NodeDragEventData | NodeTouchEventData,
  dragState: DragState | TouchState,
  x: number,
  y: number
): boolean {
  if (!dragState) return false;

  if (
    data.targetData.parent.el !== dragState.lastParent?.el ||
    data.targetData.node.data.value === dragState.lastValue
  )
    return false;

  if (dragState.lastValue === data.targetData.node.data.value) {
    if (dragState.direction !== 1) return false;

    if (
      x >= dragState.lastCoordinates.y - 20 &&
      y >=
        dragState.lastCoordinates.x -
          data.targetData.node.el.getBoundingClientRect().width / 20
    )
      return false;
  }

  return true;
}

export function sort(
  data: NodeDragEventData | NodeTouchEventData,
  state: DragState | TouchState
) {
  const { x, y } = eventCoordinates(data.e);

  if (!validateSort(data, state, x, y)) return;

  data.targetData.parent.data.config.performSort(state, data);

  state.lastValue = data.targetData.node.data.value;

  state.lastCoordinates = { x, y };

  state.direction =
    data.targetData.node.data.index > state.draggedNode.data.index ? 1 : -1;
}

/**
 * Event listener used for all nodes.
 *
 * @param e - The event.
 *
 */
export function nodeEventData(
  callback: any
): (e: Event) => NodeEventData | undefined {
  function nodeTargetData(node: Node): NodeTargetData | undefined {
    const nodeData = nodes.get(node);

    const parent = node.parentNode || state?.lastParent?.el;

    if (!nodeData) return;

    const parentData = parents.get(parent);

    if (!parentData) return;

    return {
      node: {
        el: node,
        data: nodeData,
      },
      parent: {
        el: parent,
        data: parentData,
      },
    };
  }

  return (e: Event) => {
    const targetData = nodeTargetData(e.currentTarget as Node);

    if (!targetData) return;

    return callback({
      e,
      targetData,
    });
  };
}

// TRANSFER LOGIC:
export function performTransfer(
  state: DragState | TouchState,
  data: NodeEventData | ParentEventData
) {
  const draggedValues = dragValues(state);

  const lastParentValues = parentValues(
    state.lastParent.el,
    state.lastParent.data
  ).filter((x: any) => !draggedValues.includes(x));

  const targetParentValues = parentValues(
    data.targetData.parent.el,
    data.targetData.parent.data
  );

  "node" in data.targetData
    ? targetParentValues.splice(
        data.targetData.node.data.index,
        0,
        ...draggedValues
      )
    : targetParentValues.push(...draggedValues);

  setParentValues(state.lastParent.el, state.lastParent.data, lastParentValues);

  setParentValues(
    data.targetData.parent.el,
    data.targetData.parent.data,
    targetParentValues
  );
}

/**
 * Used when the dragged element enters into a parent other than its own.
 *
 * @param eventData
 *
 * @param state
 *
 * @internal
 *
 * @returns void
 */
export function transfer(
  data: NodeEventData | ParentEventData,
  state: DragState | TouchState
): void {
  if (!validateTransfer(data, state)) return;

  data.targetData.parent.data.config.performTransfer(state, data);

  state.lastParent = data.targetData.parent;
}

export function parentEventData(
  callback: any
): (e: Event) => NodeEventData | undefined {
  function parentTargetData(parent: HTMLElement): ParentTargetData | undefined {
    const parentData = parents.get(parent);

    if (!parentData) return;

    return {
      parent: {
        el: parent,
        data: parentData,
      },
    };
  }

  return (e: Event) => {
    const targetData = parentTargetData(e.currentTarget as HTMLElement);

    if (!targetData) return;

    return callback({
      e,
      targetData,
    });
  };
}
