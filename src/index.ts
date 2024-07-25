import type {
  DNDPlugin,
  DragAndDrop,
  DragStateProps,
  Node,
  DragState,
  NodeData,
  NodeDragEventData,
  NodeEventData,
  NodeRecord,
  NodesData,
  NodeTargetData,
  ParentConfig,
  ParentData,
  ParentEventData,
  ParentsData,
  ParentTargetData,
  ScrollData,
  SetupNodeData,
  TearDownNodeData,
  PointeroverNodeEvent,
  PointeroverParentEvent,
  NodePointerEventData,
} from "./types";
import {
  addClass,
  addEvents,
  copyNodeStyle,
  eventCoordinates,
  getElFromPoint,
  getScrollParent,
  isBrowser,
  isNode,
  noDefault,
  removeClass,
  throttle,
} from "./utils";
export { animations } from "./plugins/animations";
export { insertion } from "./plugins/insertion";
export { multiDrag } from "./plugins/multiDrag";
export { selections } from "./plugins/multiDrag/plugins/selections";
export { place } from "./plugins/place";
export { swap } from "./plugins/swap";
export * from "./types";
export * from "./utils";
export { isBrowser };

let isNative = false;

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
  ParentData<unknown>
>();

export const treeAncestors: Record<string, HTMLElement> = {};

/**
 * The state of the drag and drop. Is undefined until either dragstart or
 * touchstart is called.
 */
export let state: DragState<any> | undefined;

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
    dragMoving: false,
    longPress: false,
    draggedNodeDisplay: undefined,
    dynamicValues: [],
    longPressTimeout: 0,
    lastValue: undefined,
    activeNode: undefined,
    lastTargetValue: undefined,
    remapJustFinished: false,
    clonedDraggedEls: [],
    originalZIndex: undefined,
    transferred: false,
    ...dragStateProps,
  } as DragState<T>;

  return state;
}

export function dragStateProps<T>(
  data: NodeDragEventData<T> | NodePointerEventData<T>
): DragStateProps<T> {
  const { x, y } = eventCoordinates(data.e);

  const rect = data.targetData.node.el.getBoundingClientRect();

  return {
    clonedDraggedNode: data.targetData.node.el.cloneNode(true) as Node,
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
    startLeft: x - rect.left,
    startTop: y - rect.top,
  };
}

export function performSort<T>(
  state: DragState<T>,
  data: NodeDragEventData<T> | NodePointerEventData<T>
) {
  const draggedValues = dragValues(state);

  const targetParentValues = parentValues(
    data.targetData.parent.el,
    data.targetData.parent.data
  );

  const originalIndex = state.draggedNode.data.index;

  const enabledNodes = [...data.targetData.parent.data.enabledNodes];

  const newParentValues = [
    ...targetParentValues.filter((x) => !draggedValues.includes(x)),
  ];

  newParentValues.splice(data.targetData.node.data.index, 0, ...draggedValues);

  state.lastTargetValue = data.targetData.node.data.value;

  setParentValues(data.targetData.parent.el, data.targetData.parent.data, [
    ...newParentValues,
  ]);

  if (data.targetData.parent.data.config.onSort) {
    const sortEventData = {
      parent: {
        el: data.targetData.parent.el,
        data: data.targetData.parent.data,
      },
      previousValues: [...targetParentValues],
      previousNodes: [...enabledNodes],
      nodes: [...data.targetData.parent.data.enabledNodes],
      values: [...newParentValues],
      draggedNode: state.draggedNode,
      previousPosition: originalIndex,
      position: data.targetData.node.data.index,
    };

    data.targetData.parent.data.config.onSort(sortEventData);
  }
}

export function parentValues<T>(
  parent: HTMLElement,
  parentData: ParentData<T>
): Array<T> {
  return [...parentData.getValues(parent)];
}

function findArrayCoordinates(
  obj: any,
  targetArray: Array<any>,
  path: Array<any> = []
) {
  let result: Array<any> = [];

  if (obj === targetArray) result.push(path);

  if (Array.isArray(obj)) {
    const index = obj.findIndex((el) => el === targetArray);
    if (index !== -1) {
      result.push([...path, index]);
    } else {
      for (let i = 0; i < obj.length; i++) {
        result = result.concat(
          findArrayCoordinates(obj[i], targetArray, [...path, i])
        );
      }
    }
  } else if (typeof obj === "object" && obj !== null) {
    for (const key in obj) {
      result = result.concat(
        findArrayCoordinates(obj[key], targetArray, [...path, key])
      );
    }
  }

  return result;
}

function setValueAtCoordinatesUsingFindIndex(
  obj,
  targetArray,
  newArray,
  parent
) {
  const coordinates = findArrayCoordinates(obj, targetArray);

  let newValues;

  coordinates.forEach((coords) => {
    let current = obj;
    for (let i = 0; i < coords.length - 1; i++) {
      const index = coords[i];
      current = current[index];
    }
    const lastIndex = coords[coords.length - 1];

    current[lastIndex] = newArray;

    // We want to access getter of object we are setting to set the new values
    // of the nested parent element (should be a part of the original structure of
    // ancestor values).
    newValues = current[lastIndex];
  });

  return newValues;
}

export function setParentValues<T>(
  parent: HTMLElement,
  parentData: ParentData<T>,
  values: Array<any>
): void {
  const treeGroup = parentData.config.treeGroup;

  if (treeGroup) {
    const ancestorEl = treeAncestors[treeGroup];

    const ancestorData = parents.get(ancestorEl);

    if (!ancestorData) return;

    const ancestorValues = ancestorData.getValues(ancestorEl);

    const initialParentValues = parentData.getValues(parent);

    const updatedValues = setValueAtCoordinatesUsingFindIndex(
      ancestorValues,
      initialParentValues,
      values,
      parent
    );

    if (!updatedValues) {
      console.warn("No updated value found");

      return;
    }

    parentData.setValues(updatedValues, parent);

    return;
  }

  parentData.setValues(values, parent);
}

export function dragValues<T>(state: DragState<T>): Array<T> {
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
      handlePointeroverNode,
      handlePointeroverParent,
      handlePointerdown,
      handlePointermove,
      handleDragenterNode,
      handleDragleaveNode,
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

  const nodesObserver = new MutationObserver(nodesMutated);

  nodesObserver.observe(parent, { childList: true });

  parents.set(parent, parentData);

  if (config.treeAncestor && config.treeGroup)
    treeAncestors[config.treeGroup] = parent;

  config.plugins?.forEach((plugin) => {
    plugin(parent)?.tearDown?.();
  });

  config.plugins?.forEach((plugin) => {
    plugin(parent)?.tearDown?.();
  });

  config.plugins?.forEach((plugin: DNDPlugin) => {
    plugin(parent)?.setup?.();
  });

  setup(parent, parentData);

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
  parentData.abortControllers.mainParent = addEvents(parent, {
    dragover: parentEventData(
      throttle(parentData.config.handleDragoverParent, 10)
    ),
    handlePointeroverParent: parentData.config.handlepointeroverParent,
  });
}

export function setupNode<T>(data: SetupNodeData<T>) {
  const config = data.parentData.config;

  data.node.draggable = true;

  data.nodeData.abortControllers.mainNode = addEvents(data.node, {
    dragstart: nodeEventData(config.handleDragstart),
    dragover: nodeEventData(config.handleDragoverNode),
    dragenter: nodeEventData(config.handleDragenterNode),
    dragleave: nodeEventData(config.handleDragleaveNode),
    dragend: nodeEventData(config.handleEnd),
    touchstart: noDefault,
    pointerdown: nodeEventData(config.handlePointerdown),
    pointermove: nodeEventData(config.handlePointermove),
    pointerup: nodeEventData(config.handleEnd),
    handlePointeroverNode: config.handlePointeroverNode,
    hasNestedChildren: (e: CustomEvent) => {
      console.log(e.detail);
      const node = nodes.get(e.target as Node);

      if (!node) return;

      node.hasNestedChildren = e.detail.hasNestedChildren;

      node.nestedParent = e.detail.parent;
    },
    mousedown: () => {
      isNative = true;
    },
  });

  config.reapplyDragClasses(data.node, data.parentData);

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

  if (data.nodeData?.abortControllers?.mainNode)
    data.nodeData?.abortControllers?.mainNode.abort();
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

    // Only tear down the node if we have explicitly called dragAndDrop
    if (force || !nodeData) {
      config.tearDownNode({ node, parent, nodeData, parentData });
    }

    if (config.disabled) continue;

    if (!config.draggable || (config.draggable && config.draggable(node))) {
      enabledNodes.push(node);
    }
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

  if (parentData.config.treeGroup && !parentData.config.treeAncestor) {
    let nextAncestorEl = parent.parentElement;
    while (nextAncestorEl) {
      if (!nodes.has(nextAncestorEl as Node)) {
        nextAncestorEl = nextAncestorEl.parentElement;

        continue;
      }

      nextAncestorEl.dispatchEvent(
        new CustomEvent("hasNestedChildren", {
          detail: {
            hasNestedChildren: !!enabledNodes.length,
            parent: { data: parentData, el: parent },
          },
        })
      );

      nextAncestorEl = null;
    }
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

    if (force || !prevNodeData) config.setupNode(setupNodeData);

    setupNodeRemap(setupNodeData);
  }

  parents.set(parent, { ...parentData, enabledNodes: enabledNodeRecords });

  config.remapFinished(parentData);

  parentData.config.plugins?.forEach((plugin: DNDPlugin) => {
    plugin(parent)?.remapFinished?.();
  });
}

export function remapFinished() {
  if (state) {
    state.remapJustFinished = true;

    state.affectedNodes = [];
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
  dropZoneClass: string | undefined,
  dragPlaceholderClass: string | undefined
) {
  addClass([el], draggingClass);

  setTimeout(() => {
    removeClass([el], draggingClass);

    addClass([el], dragPlaceholderClass);

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

  dragState.clonedDraggedNode = undefined;

  return dragState;
}

export function validateDragHandle<T>(data: NodeEventData<T>): boolean {
  if (!(data.e instanceof DragEvent) && !(data.e instanceof PointerEvent))
    return false;

  const config = data.targetData.parent.data.config;

  if (!config.dragHandle) return true;

  const dragHandles = data.targetData.node.el.querySelectorAll(
    config.dragHandle
  );

  if (!dragHandles) return false;

  const coordinates = data.e;

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

function pointerdown<T>(data: NodePointerEventData<T>) {
  if (!validateDragHandle(data)) return;

  const dragState = initSyntheticDrag(data);

  handleSyntheticDraggedNode(data, dragState);

  handleLongPress(data, dragState);
}

export function handleSyntheticDraggedNode<T>(
  data: NodePointerEventData<T>,
  dragState: DragState<T>
) {
  dragState.draggedNodeDisplay = dragState.draggedNode.el.style.display;

  const rect = data.targetData.node.el.getBoundingClientRect();

  dragState.clonedDraggedNode.style.cssText = `
            width: ${rect.width}px;
            position: fixed;
            top: -9999px;
            pointer-events: none;
            z-index: 999999;
            display: none;
          `;

  document.body.append(dragState.clonedDraggedNode);

  copyNodeStyle(data.targetData.node.el, dragState.clonedDraggedNode);

  dragState.clonedDraggedNode.style.display = "none";

  dragState.draggedNode.el.setPointerCapture(data.e.pointerId);

  document.addEventListener("contextmenu", noDefault);
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
    config.dropZoneClass,
    config.dragPlaceholderClass
  );
}

export function handlePointeroverNode<T>(e: PointeroverNodeEvent<T>) {
  if (!state) return;

  if (e.detail.targetData.parent.el === state.lastParent.el)
    sort(e.detail, state);
  else transfer(e.detail, state);
}

export function handleEnd<T>(eventData: NodeEventData<T>) {
  if (!state) return;

  end(eventData, state);

  resetState();
}

export function end<T>(_eventData: NodeEventData<T>, state: DragState<T>) {
  document.removeEventListener("contextmenu", noDefault);

  if ("longPressTimeout" in state && state.longPressTimeout)
    clearTimeout(state.longPressTimeout);

  const config = parents.get(state.initialParent.el)?.config;

  const isSynth = "clonedDraggedNode" in state && state.clonedDraggedNode;

  const dropZoneClass = isSynth
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

  if (isSynth) state.clonedDraggedNode.remove();
}

export function handleTouchstart<T>(eventData: NodeEventData<T>) {
  eventData.e.preventDefault();
}

export function handlePointerdown<T>(eventData: NodePointerEventData<T>) {
  eventData.e.stopPropagation();

  pointerdown({
    e: eventData.e,
    targetData: eventData.targetData,
  });
}

export function handlePointermove<T>(eventData: NodePointerEventData<T>) {
  if (!state || isNative) return;

  syntheticMove(eventData, state);
}

function initSyntheticDrag<T>(data: NodePointerEventData<T>) {
  data.e.stopPropagation();

  const syntheticDragState = setDragState(dragStateProps(data));

  return syntheticDragState;
}

export function handleLongPress<T>(
  data: NodePointerEventData<T>,
  dragState: DragState<T>
) {
  const config = data.targetData.parent.data.config;

  if (!config.longPress) return;

  dragState.longPressTimeout = setTimeout(() => {
    if (!dragState) return;

    dragState.longPress = true;

    if (config.longPressClass && data.e.cancelable)
      addClass(
        dragState.draggedNodes.map((x) => x.el),
        config.longPressClass
      );

    data.e.preventDefault();
  }, config.longPressTimeout || 200);
}

function pointermoveClasses<T>(
  dragState: DragState<T>,
  config: ParentConfig<T>
) {
  if (config.longTouchClass)
    removeClass(
      dragState.draggedNodes.map((x) => x.el),
      config?.longTouchClass
    );

  if (config.touchDraggingClass)
    addClass([dragState.clonedDraggedNode], config.touchDraggingClass);

  if (config.touchDropZoneClass)
    addClass(
      dragState.draggedNodes.map((x) => x.el),
      config.touchDropZoneClass
    );
}

function getScrollData<T>(state?: DragState<T>): ScrollData<T> | void {
  if (!state || !state.scrollParent) return;

  // If the scrollParent is the document and it isn't a touch event, then
  // we can just let the browser handle the scrolling.
  if (
    state.scrollParent === document.documentElement &&
    !("clonedDraggedNode" in state)
  ) {
    return;
  }

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

function shouldScroll<T>(direction: string): DragState<T> | void {
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

function shouldScrollRight<T>(
  state: DragState<T> | DragState<T>,
  data: ScrollData<T>
): DragState<T> | DragState<T> | void {
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
  state: DragState<T>,
  data: ScrollData<T>
): DragState<T> | void {
  const diff = data.scrollParent.clientWidth + data.x - state.coordinates.x;

  if (!data.scrollOutside && diff > data.scrollParent.clientWidth) return;

  if (
    diff > data.xThresh * data.scrollParent.clientWidth &&
    data.scrollParent.scrollLeft !== 0
  )
    return state;
}

function shouldScrollUp<T>(
  state: DragState<T>,
  data: ScrollData<T>
): DragState<T> | void {
  const diff = data.scrollParent.clientHeight + data.y - state.coordinates.y;

  if (!data.scrollOutside && diff > data.scrollParent.clientHeight) return;

  if (
    diff > data.yThresh * data.scrollParent.clientHeight &&
    data.scrollParent.scrollTop !== 0
  )
    return state;
}

function shouldScrollDown<T>(
  state: DragState<T>,
  data: ScrollData<T>
): DragState<T> | void {
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

function moveNode<T>(data: NodePointerEventData<T>, dragState: DragState<T>) {
  dragState.dragMoving = true;

  dragState.clonedDraggedNode.style.display =
    dragState.draggedNodeDisplay || "";

  const { x, y } = eventCoordinates(data.e);

  dragState.coordinates.y = y;

  dragState.coordinates.x = x;

  const startLeft = dragState.startLeft ?? 0;

  const startTop = dragState.startTop ?? 0;

  dragState.clonedDraggedNode.style.left = `${x - startLeft}px`;

  dragState.clonedDraggedNode.style.top = `${y - startTop}px`;

  if (data.e.cancelable) data.e.preventDefault();

  pointermoveClasses(dragState, data.targetData.parent.data.config);
}

function syntheticMove<T>(
  data: NodePointerEventData<T>,
  dragState: DragState<T>
) {
  dragState.draggedNode.el.setPointerCapture(data.e.pointerId);

  const config = data.targetData.parent.data.config;

  if (config.longPress && !dragState.longPress) {
    clearTimeout(dragState.longPressTimeout);

    return;
  }

  if (data.e.cancelable) data.e.preventDefault();

  moveNode(data, dragState);

  handleScroll();

  const elFromPoint = getElFromPoint(data);

  if (!elFromPoint) return;

  const pointerMoveEventData = {
    e: data.e,
    targetData: elFromPoint,
  };

  if ("node" in elFromPoint) {
    elFromPoint.node.el.dispatchEvent(
      new CustomEvent("handlePointeroverNode", {
        detail: pointerMoveEventData,
      })
    );
  } else {
    elFromPoint.parent.el.dispatchEvent(
      new CustomEvent("handlePointeroverParent", {
        detail: pointerMoveEventData,
      })
    );
  }
}

export function handleScroll() {
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
    "clonedDraggedNode" in state ? 10 : 100
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

export function handlePointeroverParent<T>(e: PointeroverParentEvent<T>) {
  if (!state) return;

  transfer(e.detail, state);
}

export function validateTransfer<T>(
  data: ParentEventData<T>,
  state: DragState<T>
) {
  if (data.targetData.parent.el === state.lastParent.el) return false;

  const targetConfig = data.targetData.parent.data.config;

  if (
    targetConfig.treeGroup &&
    state.draggedNode.el.contains(data.targetData.parent.el)
  ) {
    return false;
  }

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

function handleDragenterNode<T>(
  data: NodeDragEventData<T>,
  _state: DragState<T>
) {
  data.e.preventDefault();
}

function handleDragleaveNode<T>(
  data: NodeDragEventData<T>,
  _state: DragState<T>
) {
  data.e.preventDefault();
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
  data: NodeDragEventData<T> | NodePointerEventData<T>,
  state: DragState<T>,
  x: number,
  y: number
): boolean {
  if (
    state.affectedNodes
      .map((x) => x.data.value)
      .includes(data.targetData.node.data.value)
  ) {
    return false;
  }

  if (state.remapJustFinished) {
    state.remapJustFinished = false;

    if (
      data.targetData.node.data.value === state.lastTargetValue ||
      state.draggedNodes.map((x) => x.el).includes(data.targetData.node.el)
    ) {
      state.lastTargetValue = data.targetData.node.data.value;
    }

    return false;
  }

  if (state.draggedNodes.map((x) => x.el).includes(data.targetData.node.el)) {
    state.lastTargetValue = undefined;
    return false;
  }

  if (data.targetData.node.data.value === state.lastTargetValue) return false;

  if (
    data.targetData.parent.el !== state.lastParent?.el ||
    data.targetData.parent.data.config.sortable === false
  )
    return false;

  const targetRect = data.targetData.node.el.getBoundingClientRect();

  const dragRect = state.draggedNode.el.getBoundingClientRect();

  const yDiff = targetRect.y - dragRect.y;

  const xDiff = targetRect.x - dragRect.x;

  let incomingDirection: "above" | "below" | "left" | "right";

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
  data: NodeDragEventData<T> | NodePointerEventData<T>,
  state: DragState<T>
) {
  const { x, y } = eventCoordinates(data.e);

  if (!validateSort(data, state, x, y)) return;

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
  state: DragState<T>,
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

  function createTransferEventData(
    state: DragState<T>,
    data: NodeEventData<T> | ParentEventData<T>,
    lastParentValues: Array<T>,
    targetParentValues: Array<T>,
    targetIndex: number
  ) {
    return {
      sourceParent: state.lastParent,
      targetParent: data.targetData.parent,
      previousSourceValues: [...lastParentValues],
      sourceValues: [...state.lastParent.data.getValues(state.lastParent.el)],
      previousTargetValues: [...targetParentValues],
      targetValues: [
        ...data.targetData.parent.data.getValues(data.targetData.parent.el),
      ],
      previousSourceNodes: [...state.lastParent.data.enabledNodes],
      sourceNodes: [...state.lastParent.data.enabledNodes],
      previousTargetNodes: [...data.targetData.parent.data.enabledNodes],
      targetNodes: [...data.targetData.parent.data.enabledNodes],
      draggedNode: state.draggedNode,
      sourcePreviousPosition: state.initialIndex,
      targetPosition: targetIndex,
    };
  }

  if (data.targetData.parent.data.config.onTransfer) {
    const transferEventData = createTransferEventData(
      state,
      data,
      lastParentValues,
      targetParentValues,
      targetIndex
    );

    data.targetData.parent.data.config.onTransfer(transferEventData);
  }

  if (state.lastParent.data.config.onTransfer) {
    const transferEventData = createTransferEventData(
      state,
      data,
      lastParentValues,
      targetParentValues,
      targetIndex
    );

    state.lastParent.data.config.onTransfer(transferEventData);
  }
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
  state: DragState<T>
): void {
  if (!validateTransfer(data, state)) return;

  data.targetData.parent.data.config.performTransfer(state, data);

  state.lastParent = data.targetData.parent;

  state.transferred = true;
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
