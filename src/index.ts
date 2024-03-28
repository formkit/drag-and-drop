import type {
  DragAndDrop,
  Node,
  DNDPlugin,
  NodeEventData,
  TouchOverNodeEvent,
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
  NodeRecord,
} from "./types";
import {
  isBrowser,
  addClass,
  removeClass,
  getElFromPoint,
  isNode,
  getScrollParent,
  addEvents,
  copyNodeStyle,
  eventCoordinates,
  throttle,
} from "./utils";
export { isBrowser };
export * from "./types";
export { multiDrag } from "./plugins/multiDrag";
export { animations } from "./plugins/animations";
export { selections } from "./plugins/multiDrag/plugins/selections";
export * from "./utils";

const scrollConfig: {
  [key: string]: [number, number];
} = {
  up: [0, -1],
  down: [0, 1],
  left: [-1, 0],
  right: [1, 0],
};

export const nodes: NodesData<any> = new WeakMap<Node, NodeData<any>>();

export const parents: ParentsData<any> = new WeakMap<
  HTMLElement,
  ParentData<any>
>();
/**
 * The state of the drag and drop. Is undefined until either dragstart or
 * touchstart is called.
 */
export let state: DragState<any> | TouchState<any> | undefined = undefined;

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
export function setDragState<T>(
  dragStateProps: DragStateProps<T>
): DragState<T> {
  state = {
    ascendingDirection: false,
    incomingDirection: undefined,
    enterCount: 0,
    targetIndex: 0,
    affectedNodes: [],
    lastValue: undefined,
    activeNode: undefined,
    lastTargetValue: undefined,
    remapJustFinished: false,
    preventEnter: false,
    clonedDraggedEls: [],
    swappedNodeValue: false,
    originalZIndex: undefined,
    ...dragStateProps,
  } as DragState<T>;

  return state;
}

export function setTouchState<T>(
  dragState: DragState<T>,
  touchStateProps: TouchStateProps
): TouchState<T> {
  state = {
    ...dragState,
    ...touchStateProps,
  };

  return state as TouchState<T>;
}

export function dragStateProps<T>(
  data: NodeDragEventData<T> | NodeTouchEventData<T>
): DragStateProps<T> {
  const { x, y } = eventCoordinates(data.e);

  return {
    coordinates: {
      x,
      y,
    },
    draggedNode: {
      el: data.targetData.node.el,
      data: data.targetData.node.data,
    },
    draggedNodes: [
      {
        el: data.targetData.node.el,
        data: data.targetData.node.data,
      },
    ],
    initialIndex: data.targetData.node.data.index,
    initialParent: {
      el: data.targetData.parent.el,
      data: data.targetData.parent.data,
    },
    lastParent: {
      el: data.targetData.parent.el,
      data: data.targetData.parent.data,
    },
    scrollParent: getScrollParent(data.targetData.node.el),
  };
}

export function performSort<T>(
  state: DragState<T> | TouchState<T>,
  data: NodeDragEventData<T> | NodeTouchEventData<T>
) {
  const draggedValues = dragValues(state);

  const targetParentValues = parentValues(
    data.targetData.parent.el,
    data.targetData.parent.data
  );

  const newParentValues = [
    ...targetParentValues.filter((x) => !draggedValues.includes(x)),
  ];

  newParentValues.splice(data.targetData.node.data.index, 0, ...draggedValues);

  state.lastTargetValue = data.targetData.node.data.value;

  setParentValues(data.targetData.parent.el, data.targetData.parent.data, [
    ...newParentValues,
  ]);
}

export function parentValues<T>(
  parent: HTMLElement,
  parentData: ParentData<T>
): Array<T> {
  return [...parentData.getValues(parent)];
}

export function setParentValues<T>(
  parent: HTMLElement,
  parentData: ParentData<T>,
  values: Array<any>
): void {
  parentData.setValues(values, parent);
}

export function dragValues<T>(state: DragState<T> | TouchState<T>): Array<T> {
  return [...state.draggedNodes.map((x) => x.data.value)];
}

/**
 * Utility function to update parent config.
 */
export function updateConfig<T>(
  parent: HTMLElement,
  config: Partial<ParentConfig<T>>
) {
  const parentData = parents.get(parent);

  if (!parentData) return;

  parents.set(parent, {
    ...parentData,
    config: { ...parentData.config, ...config },
  });

  dragAndDrop({
    parent,
    getValues: parentData.getValues,
    setValues: parentData.setValues,
    config,
  });
}

/**
 * Initializes the drag and drop functionality for a given parent.
 *
 * @param {DragAndDrop} dragAndDrop - The drag and drop configuration.
 * @param {HTMLElement} dragAndDrop.parent - The parent element.
 *
 * @returns void
 */
export function dragAndDrop<T>({
  parent,
  getValues,
  setValues,
  config = {},
}: DragAndDrop<T>): void {
  if (!isBrowser) return;

  document.addEventListener("dragover", (e) => {
    e.preventDefault();

    if (state) {
      state.remapJustFinished = false;

      state.lastTargetValue = undefined;

      const { x, y } = eventCoordinates(e);

      state.coordinates.y = y;

      state.coordinates.x = x;

      handleScroll();
    }
  });

  tearDown(parent);

  const parentData: ParentData<T> = {
    getValues,
    setValues,
    config: {
      handleDragstart,
      handleDragoverNode,
      handleDragoverParent,
      handleEnd,
      handleTouchstart,
      handleTouchmove,
      handleTouchOverNode,
      handleTouchOverParent,
      performSort,
      performTransfer,
      root: document,
      setupNode,
      setupNodeRemap,
      reapplyDragClasses,
      tearDownNode,
      tearDownNodeRemap,
      remapFinished,
      scrollBehavior: {
        x: 0.8,
        y: 0.8,
      },
      threshold: {
        horizontal: 0,
        vertical: 0,
      },
      ...config,
    },
    enabledNodes: [],
    abortControllers: {},
  };

  setup(parent, parentData);

  config.plugins?.forEach((plugin) => {
    plugin(parent)?.tearDown?.();
  });

  config.plugins?.forEach((plugin: DNDPlugin) => {
    plugin(parent)?.setup?.();
  });

  remapNodes(parent, true);
}

export function tearDown(parent: HTMLElement) {
  const parentData = parents.get(parent);

  if (!parentData) return;

  if (parentData.abortControllers.mainParent) {
    parentData.abortControllers.mainParent.abort();
  }
}

function setup<T>(parent: HTMLElement, parentData: ParentData<T>): void {
  const nodesObserver = new MutationObserver(nodesMutated);

  nodesObserver.observe(parent, { childList: true });

  parents.set(parent, parentData as any);

  parentData.abortControllers.mainParent = addEvents(parent, {
    dragover: parentEventData(
      throttle(parentData.config.handleDragoverParent, 10)
    ),
    touchOverParent: parentData.config.handleTouchOverParent,
  });
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
export function remapNodes<T>(parent: HTMLElement, force?: boolean) {
  const parentData = parents.get(parent);

  if (!parentData) return;

  const enabledNodes: Array<Node> = [];

  const config = parentData.config;

  for (let x = 0; x < parent.children.length; x++) {
    const node = parent.children[x];

    if (!isNode(node)) continue;

    const nodeData = nodes.get(node);

    // Only tear down the node if someone has explicitly called dragAndDrop.
    if (force || !nodeData) {
      config.tearDownNode({ node, parent, nodeData, parentData });
    }

    if (config.disabled) continue;

    if (!config.draggable || (config.draggable && config.draggable(node))) {
      enabledNodes.push(node);
    }
  }

  // TODO: maybe get rid of this?
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

  const enabledNodeRecords: Array<NodeRecord<T>> = [];

  for (let x = 0; x < enabledNodes.length; x++) {
    const node = enabledNodes[x];
    const prevNodeData = nodes.get(node);
    const nodeData = Object.assign(
      prevNodeData ?? {
        privateClasses: [],
        abortControllers: {},
      },
      {
        value: values[x],
        index: x,
      }
    );

    // TODO: maybe get rid of this — duplicate of the next if statement
    if (state && nodeData.value === state.draggedNode.data.value) {
      state.draggedNode.data = nodeData;

      state.draggedNode.el = node;
    }

    if (
      state &&
      state.draggedNodes.map((x) => x.data.value).includes(nodeData.value)
    ) {
      const draggedNode = state.draggedNodes.find(
        (x) => x.data.value === nodeData.value
      );

      if (draggedNode) draggedNode.el = node;
    }

    enabledNodeRecords.push({
      el: node,
      data: nodeData,
    });

    const setupNodeData = {
      node,
      parent,
      parentData,
      nodeData,
    };

    if (force || !prevNodeData) {
      config.setupNode(setupNodeData);
    }

    setupNodeRemap(setupNodeData);
  }

  parents.set(parent, { ...parentData, enabledNodes: enabledNodeRecords });

  config.remapFinished(parentData);
}

export function remapFinished() {
  if (state) {
    state.preventEnter = false;
    state.swappedNodeValue = undefined;
    state.remapJustFinished = true;
  }
}

export function handleDragstart<T>(data: NodeEventData<T>) {
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
  addClass([el], draggingClass);

  setTimeout(() => {
    removeClass([el], draggingClass);

    addClass([el], dropZoneClass);
  });
}

export function initDrag<T>(eventData: NodeDragEventData<T>): DragState<T> {
  const dragState = setDragState(dragStateProps(eventData));

  eventData.e.stopPropagation();

  if (eventData.e.dataTransfer) {
    eventData.e.dataTransfer.dropEffect = "move";

    eventData.e.dataTransfer.effectAllowed = "move";

    eventData.e.dataTransfer.setDragImage(
      eventData.targetData.node.el,
      eventData.e.offsetX,
      eventData.e.offsetY
    );
  }

  return dragState;
}

function validateDragHandle<T>(data: NodeEventData<T>): boolean {
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

function touchstart<T>(data: NodeTouchEventData<T>) {
  if (!validateDragHandle(data)) return;

  const touchState = initTouch(data);

  handleTouchedNode(data, touchState);

  handleLongTouch(data, touchState);
}

export function dragstart<T>(data: NodeDragEventData<T>) {
  if (!validateDragHandle(data)) {
    data.e.preventDefault();

    return;
  }

  const config = data.targetData.parent.data.config;

  const dragState = initDrag(data);

  const originalZIndex = data.targetData.node.el.style.zIndex;

  dragState.originalZIndex = originalZIndex;

  data.targetData.node.el.style.zIndex = "9999";

  dragstartClasses(
    dragState.draggedNode.el,
    config.draggingClass,
    config.dropZoneClass
  );
}

export function handleTouchOverNode<T>(e: TouchOverNodeEvent<T>) {
  if (!state) return;

  if (e.detail.targetData.parent.el === state.lastParent.el)
    sort(e.detail, state);
  else transfer(e.detail, state);
}

export function setupNode<T>(data: SetupNodeData<T>) {
  const config = data.parentData.config;

  data.node.draggable = true;

  data.nodeData.abortControllers.mainNode = addEvents(data.node, {
    dragstart: nodeEventData(config.handleDragstart),
    dragover: nodeEventData(config.handleDragoverNode),
    dragend: nodeEventData(config.handleEnd),
    touchstart: nodeEventData(config.handleTouchstart),
    touchmove: nodeEventData(config.handleTouchmove),
    touchend: nodeEventData(config.handleEnd),
    touchOverNode: config.handleTouchOverNode,
  });

  config.reapplyDragClasses(data.node, data.parentData);

  // TODO: setupNode should maybe accept argument saying whether or not to
  // add events
  data.parentData.config.plugins?.forEach((plugin: DNDPlugin) => {
    plugin(data.parent)?.setupNode?.(data);
  });
}

export function setupNodeRemap<T>(data: SetupNodeData<T>) {
  nodes.set(data.node, data.nodeData);

  data.parentData.config.plugins?.forEach((plugin: DNDPlugin) => {
    plugin(data.parent)?.setupNodeRemap?.(data);
  });
}

function reapplyDragClasses<T>(node: Node, parentData: ParentData<T>) {
  if (!state) return;

  const dropZoneClass =
    "touchedNode" in state
      ? parentData.config.touchDropZoneClass
      : parentData.config.dropZoneClass;

  if (state.draggedNode.el !== node) return;

  addClass([node], dropZoneClass, true);
}

export function tearDownNodeRemap<T>(data: TearDownNodeData<T>) {
  data.parentData.config.plugins?.forEach((plugin: DNDPlugin) => {
    plugin(data.parent)?.tearDownNodeRemap?.(data);
  });
}

export function tearDownNode<T>(data: TearDownNodeData<T>) {
  data.parentData.config.plugins?.forEach((plugin: DNDPlugin) => {
    plugin(data.parent)?.tearDownNode?.(data);
  });

  data.node.draggable = false;

  if (data.nodeData?.abortControllers?.mainNode) {
    data.nodeData?.abortControllers?.mainNode.abort();
  }
}

export function handleEnd<T>(eventData: NodeEventData<T>) {
  if (!state) return;

  end(eventData, state);

  resetState();
}

export function end<T>(
  _eventData: NodeEventData<T>,
  state: DragState<T> | TouchState<T>
) {
  document.removeEventListener("contextmenu", preventDefault);

  if ("longTouchTimeout" in state && state.longTouchTimeout)
    clearTimeout(state.longTouchTimeout);

  const config = parents.get(state.initialParent.el)?.config;

  const isTouch = "touchedNode" in state;

  const dropZoneClass = isTouch
    ? config?.touchDropZoneClass
    : config?.dropZoneClass;

  if (state.originalZIndex !== undefined)
    state.draggedNode.el.style.zIndex = state.originalZIndex;

  addClass(
    state.draggedNodes.map((x) => x.el),
    dropZoneClass,
    true
  );

  removeClass(
    state.draggedNodes.map((x) => x.el),
    dropZoneClass
  );

  if (config?.longTouchClass) {
    removeClass(
      state.draggedNodes.map((x) => x.el),
      state.initialParent.data?.config?.longTouchClass
    );
  }

  if ("touchedNode" in state) state.touchedNode?.remove();
}

export function handleTouchstart<T>(eventData: NodeEventData<T>) {
  if (!(eventData.e instanceof TouchEvent)) return;

  touchstart({
    e: eventData.e,
    targetData: eventData.targetData,
  });
}

export function initTouch<T>(data: NodeTouchEventData<T>): TouchState<T> {
  data.e.stopPropagation();

  const clonedNode = data.targetData.node.el.cloneNode(true) as HTMLElement;

  const rect = data.targetData.node.el.getBoundingClientRect();

  const touchState = setTouchState(setDragState(dragStateProps(data)), {
    coordinates: {
      x: data.e.touches[0].clientX,
      y: data.e.touches[0].clientY,
    },
    scrollParent: getScrollParent(data.targetData.node.el),
    touchStartLeft: data.e.touches[0].clientX - rect.left,
    touchStartTop: data.e.touches[0].clientY - rect.top,
    touchedNode: clonedNode,
    touchMoving: false,
  });

  return touchState;
}

function preventDefault(e: Event) {
  e.preventDefault();
}

export function handleTouchedNode<T>(
  data: NodeTouchEventData<T>,
  touchState: TouchState<T>
) {
  touchState.touchedNodeDisplay = touchState.touchedNode.style.display;

  const rect = data.targetData.node.el.getBoundingClientRect();

  touchState.touchedNode.style.cssText = `
            width: ${rect.width}px;
            position: fixed;
            pointer-events: none;
            top: -9999px;
            z-index: 999999;
            display: none;
          `;

  document.body.append(touchState.touchedNode);

  copyNodeStyle(data.targetData.node.el, touchState.touchedNode as Node);

  touchState.touchedNode.style.display = "none";

  document.addEventListener("contextmenu", preventDefault);
}

export function handleLongTouch<T>(
  data: NodeEventData<T>,
  touchState: TouchState<T>
) {
  const config = data.targetData.parent.data.config;

  if (!config.longTouch) return;

  touchState.longTouchTimeout = setTimeout(() => {
    if (!touchState) return;

    touchState.longTouch = true;

    if (config.longTouchClass && data.e.cancelable)
      addClass(
        touchState.draggedNodes.map((x) => x.el),
        config.longTouchClass
      );

    data.e.preventDefault();
  }, config.longTouchTimeout || 200);
}

export function handleTouchmove<T>(eventData: NodeTouchEventData<T>) {
  if (!state || !("touchedNode" in state)) return;

  touchmove(eventData, state);
}

function touchmoveClasses<T>(
  touchState: TouchState<T>,
  config: ParentConfig<T>
) {
  if (config.longTouchClass)
    removeClass(
      touchState.draggedNodes.map((x) => x.el),
      config?.longTouchClass
    );

  if (config.touchDraggingClass)
    addClass([touchState.touchedNode], config.touchDraggingClass);

  if (config.touchDropZoneClass)
    addClass(
      touchState.draggedNodes.map((x) => x.el),
      config.touchDropZoneClass
    );
}

function getScrollData<T>(
  state?: DragState<T> | TouchState<T>
): ScrollData<T> | void {
  if (!state || !state.scrollParent) return;

  const { x, y, width, height } = state.scrollParent.getBoundingClientRect();

  const {
    x: xThresh,
    y: yThresh,
    scrollOutside,
  } = state.lastParent.data.config.scrollBehavior;

  return {
    state,
    xThresh,
    yThresh,
    scrollOutside,
    scrollParent: state.scrollParent,
    x,
    y,
    width,
    height,
  };
}

function shouldScroll<T>(
  direction: string
): DragState<T> | TouchState<T> | void {
  const data = getScrollData(state);

  if (!data) return;

  switch (direction) {
    case "down":
      return shouldScrollDown(data.state, data);

    case "up":
      return shouldScrollUp(data.state, data);

    case "right":
      return shouldScrollRight(data.state, data);

    case "left":
      return shouldScrollLeft(data.state, data);
  }
}

interface ScrollData<T> {
  state: DragState<T> | TouchState<T>;
  xThresh: number;
  yThresh: number;
  scrollParent: HTMLElement;
  scrollOutside?: boolean;
  x: number;
  y: number;
  width: number;
  height: number;
}

function shouldScrollRight<T>(
  state: TouchState<T> | DragState<T>,
  data: ScrollData<T>
): TouchState<T> | DragState<T> | void {
  const diff = data.scrollParent.clientWidth + data.x - state.coordinates.x;

  if (!data.scrollOutside && diff < 0) return;

  if (
    diff < (1 - data.xThresh) * data.scrollParent.clientWidth &&
    !(
      data.scrollParent.scrollLeft + data.scrollParent.clientWidth >=
      data.scrollParent.scrollWidth
    )
  )
    return state;
}

function shouldScrollLeft<T>(
  state: TouchState<T> | DragState<T>,
  data: ScrollData<T>
): TouchState<T> | DragState<T> | void {
  const diff = data.scrollParent.clientWidth + data.x - state.coordinates.x;

  if (!data.scrollOutside && diff > data.scrollParent.clientWidth) return;

  if (
    diff > data.xThresh * data.scrollParent.clientWidth &&
    data.scrollParent.scrollLeft !== 0
  )
    return state;
}

function shouldScrollUp<T>(
  state: TouchState<T> | DragState<T>,
  data: ScrollData<T>
): TouchState<T> | DragState<T> | void {
  const diff = data.scrollParent.clientHeight + data.y - state.coordinates.y;

  if (!data.scrollOutside && diff > data.scrollParent.clientHeight) return;

  if (
    diff > data.yThresh * data.scrollParent.clientHeight &&
    data.scrollParent.scrollTop !== 0
  )
    return state;
}

function shouldScrollDown<T>(
  state: TouchState<T> | DragState<T>,
  data: ScrollData<T>
): TouchState<T> | DragState<T> | void {
  const diff = data.scrollParent.clientHeight + data.y - state.coordinates.y;

  if (!data.scrollOutside && diff < 0) return;

  if (
    diff < (1 - data.yThresh) * data.scrollParent.clientHeight &&
    !(
      data.scrollParent.scrollTop + data.scrollParent.clientHeight >=
      data.scrollParent.scrollHeight
    )
  )
    return state;
}

function moveTouchedNode<T>(
  data: NodeTouchEventData<T>,
  touchState: TouchState<T>
) {
  touchState.touchMoving = true;

  touchState.touchedNode.style.display = touchState.touchedNodeDisplay || "";

  const { x, y } = eventCoordinates(data.e);

  touchState.coordinates.y = y;

  touchState.coordinates.x = x;

  const touchStartLeft = touchState.touchStartLeft ?? 0;

  const touchStartTop = touchState.touchStartTop ?? 0;

  touchState.touchedNode.style.left = `${x - touchStartLeft}px`;

  touchState.touchedNode.style.top = `${y - touchStartTop}px`;

  touchmoveClasses(touchState, data.targetData.parent.data.config);
}

function touchmove<T>(data: NodeTouchEventData<T>, touchState: TouchState<T>) {
  const config = data.targetData.parent.data.config;

  if (config.longTouch && !touchState.longTouch) {
    clearTimeout(touchState.longTouchTimeout);

    return;
  }

  if (data.e.cancelable) data.e.preventDefault();

  moveTouchedNode(data, touchState);

  handleScroll();

  const elFromPoint = getElFromPoint(data);

  if (!elFromPoint) return;

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

function handleScroll() {
  for (const direction of Object.keys(scrollConfig)) {
    const [x, y] = scrollConfig[direction];

    performScroll(direction, x, y);
  }
}

function performScroll(direction: string, x: number, y: number) {
  const state = shouldScroll(direction);

  if (!state) return;

  state.scrollParent.scrollBy(x, y);

  setTimeout(
    () => {
      performScroll(direction, x, y);
    },
    "touchedNode" in state ? 10 : 100
  );
}

export function handleDragoverNode<T>(data: NodeDragEventData<T>) {
  if (!state) return;

  const { x, y } = eventCoordinates(data.e);

  state.coordinates.y = y;

  state.coordinates.x = x;

  handleScroll();

  dragoverNode(data, state);
}

export function handleDragoverParent<T>(data: ParentEventData<T>) {
  if (!state) return;

  const { x, y } = eventCoordinates(data.e as DragEvent);

  state.coordinates.y = y;

  state.coordinates.x = x;

  handleScroll();

  transfer(data, state);
}

export function handleTouchOverParent<T>(e: TouchOverParentEvent<T>) {
  if (!state) return;

  transfer(e.detail, state);
}

export function validateTransfer<T>(
  data: ParentEventData<T>,
  state: DragState<T> | TouchState<T>
) {
  if (data.targetData.parent.el === state.lastParent.el) return false;

  const targetConfig = data.targetData.parent.data.config;

  if (targetConfig.dropZone === false) return false;

  const initialParentConfig = state.initialParent.data.config;

  if (targetConfig.accepts) {
    return targetConfig.accepts(
      data.targetData.parent,
      state.initialParent,
      state.lastParent,
      state
    );
  } else if (
    !targetConfig.group ||
    targetConfig.group !== initialParentConfig.group
  ) {
    return false;
  }

  return true;
}

function dragoverNode<T>(
  eventData: NodeDragEventData<T>,
  dragState: DragState<T>
) {
  eventData.e.preventDefault();

  eventData.e.stopPropagation();

  eventData.targetData.parent.el === dragState.lastParent?.el
    ? sort(eventData, dragState)
    : transfer(eventData, dragState);
}

export function validateSort<T>(
  data: NodeDragEventData<T> | NodeTouchEventData<T>,
  state: DragState<T> | TouchState<T>,
  x: number,
  y: number
): boolean {
  if (state.remapJustFinished) {
    state.remapJustFinished = false;

    state.lastTargetValue = data.targetData.node.data.value;

    return false;
  }

  if (state.lastTargetValue === data.targetData.node.data.value) return false;

  if (state.draggedNodes.map((x) => x.el).includes(data.targetData.node.el))
    return false;

  if (
    state.preventEnter ||
    state.swappedNodeValue === data.targetData.node.data.value ||
    data.targetData.parent.el !== state.lastParent?.el ||
    data.targetData.parent.data.config.sortable === false
  )
    return false;

  const targetRect = data.targetData.node.el.getBoundingClientRect();

  const dragRect = state.draggedNode.el.getBoundingClientRect();

  const yDiff = targetRect.y - dragRect.y;

  const xDiff = targetRect.x - dragRect.x;

  let incomingDirection: "above" | "below" | "left" | "right";

  const range =
    state.draggedNode.data.index > data.targetData.node.data.index
      ? [data.targetData.node.data.index, state.draggedNode.data.index]
      : [state.draggedNode.data.index, data.targetData.node.data.index];

  state.targetIndex = data.targetData.node.data.index;

  state.affectedNodes = data.targetData.parent.data.enabledNodes.filter(
    (node) => {
      return (
        range[0] <= node.data.index &&
        node.data.index <= range[1] &&
        node.el !== state.draggedNode.el
      );
    }
  );

  if (Math.abs(yDiff) > Math.abs(xDiff)) {
    incomingDirection = yDiff > 0 ? "above" : "below";
  } else {
    incomingDirection = xDiff > 0 ? "left" : "right";
  }

  const threshold = state.lastParent.data.config.threshold;

  switch (incomingDirection) {
    case "left":
      if (x > targetRect.x + targetRect.width * threshold.horizontal) {
        state.incomingDirection = "left";

        return true;
      }
      break;

    case "right":
      if (x < targetRect.x + targetRect.width * (1 - threshold.horizontal)) {
        state.incomingDirection = "right";

        return true;
      }
      break;

    case "above":
      if (y > targetRect.y + targetRect.height * threshold.vertical) {
        state.incomingDirection = "above";

        return true;
      }
      break;

    case "below":
      if (y < targetRect.y + targetRect.height * (1 - threshold.vertical)) {
        state.incomingDirection = "below";

        return true;
      }
      break;

    default:
      break;
  }

  return false;
}

export function sort<T>(
  data: NodeDragEventData<T> | NodeTouchEventData<T>,
  state: DragState<T> | TouchState<T>
) {
  const { x, y } = eventCoordinates(data.e);

  if (!validateSort(data, state, x, y)) return;

  state.swappedNodeValue = data.targetData.node.data.value;

  state.preventEnter = true;

  data.targetData.parent.data.config.performSort(state, data);
}

/**
 * Event listener used for all nodes.
 *
 * @param e - The event.
 *
 */
export function nodeEventData<T>(
  callback: any
): (e: Event) => NodeEventData<T> | undefined {
  function nodeTargetData(node: Node): NodeTargetData<T> | undefined {
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
        data: parentData as ParentData<T>,
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
export function performTransfer<T>(
  state: DragState<T> | TouchState<T>,
  data: NodeEventData<T> | ParentEventData<T>
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

  const reset =
    state.initialParent.el === data.targetData.parent.el &&
    data.targetData.parent.data.config.sortable === false;

  let targetIndex: number;

  if ("node" in data.targetData) {
    if (reset) {
      targetIndex = state.initialIndex;
    } else if (data.targetData.parent.data.config.sortable === false) {
      targetIndex = data.targetData.parent.data.enabledNodes.length;
    } else {
      targetIndex = data.targetData.node.data.index;
    }

    targetParentValues.splice(targetIndex, 0, ...draggedValues);
  } else {
    targetIndex = reset
      ? state.initialIndex
      : data.targetData.parent.data.enabledNodes.length;

    targetParentValues.splice(targetIndex, 0, ...draggedValues);
  }

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
export function transfer<T>(
  data: NodeEventData<T> | ParentEventData<T>,
  state: DragState<T> | TouchState<T>
): void {
  if (!validateTransfer(data, state)) return;

  data.targetData.parent.data.config.performTransfer(state, data);

  state.lastParent = data.targetData.parent;
}

export function parentEventData<T>(
  callback: any
): (e: Event) => NodeEventData<T> | undefined {
  function parentTargetData(
    parent: HTMLElement
  ): ParentTargetData<T> | undefined {
    const parentData = parents.get(parent);

    if (!parentData) return;

    return {
      parent: {
        el: parent,
        data: parentData as ParentData<T>,
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
