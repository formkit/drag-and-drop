import type {
  DNDPlugin,
  DragAndDrop,
  DragState,
  DragStateProps,
  Node,
  NodeData,
  NodeDragEventData,
  NodeEventData,
  NodePointerEventData,
  NodeRecord,
  NodeTargetData,
  NodesData,
  ParentConfig,
  ParentData,
  ParentEventData,
  ParentTargetData,
  ParentsData,
  PointeroverNodeEvent,
  PointeroverParentEvent,
  ScrollData,
  SetupNodeData,
  TearDownNodeData,
  BaseDragState,
  SynthDragState,
  SynthDragStateProps,
} from "./types";
import {
  addEvents,
  addNodeClass,
  copyNodeStyle,
  eventCoordinates,
  getElFromPoint,
  getScrollables,
  isBrowser,
  isNode,
  noDefault,
  removeClass,
  createEmitter,
  preventDefault,
} from "./utils";

export * from "./types";
export * from "./utils";
export { animations } from "./plugins/animations";
export { insertion } from "./plugins/insertion";
export { isBrowser };
export { multiDrag } from "./plugins/multiDrag";
export { place } from "./plugins/place";
export { selections } from "./plugins/multiDrag/plugins/selections";
export { swap } from "./plugins/swap";

/**
 * Abort controller for the document.
 */
let documentController: AbortController | undefined;

let isNative = false;

const scrollConfig: {
  [key: string]: [number, number];
} = {
  up: [0, -1],
  down: [0, 1],
  left: [-1, 0],
  right: [1, 0],
};

export const nodes: NodesData<any> = new WeakMap<Node, NodeData<unknown>>();

export const parents: ParentsData<any> = new WeakMap<
  HTMLElement,
  ParentData<unknown>
>();

export const treeAncestors: Record<string, HTMLElement> = {};

let synthNodePointerDown = false;

export const [emit, on] = createEmitter();

const baseDragState = {
  on,
  emit,
  originalZIndex: undefined,
  preventEnter: false,
  remapJustFinished: false,
};

/**
 * The state of the drag and drop.
 */
export let state: DragState<unknown> | SynthDragState<unknown> | BaseDragState =
  baseDragState;

export function resetState() {
  console.log("reset state");
  state = baseDragState;
}

/**
 * @param {DragStateProps} dragStateProps - Attributes to update state with.
 *
 * @mutation - Updates state with node values.
 *
 * @returns void
 */
export function setDragState<T>(
  dragStateProps:
    | (SynthDragStateProps<T> & DragStateProps<T>)
    | DragStateProps<T>
    | undefined
): DragState<T> | SynthDragState<T> {
  Object.assign(state, dragStateProps);

  state.emit("dragStarted", state.clonedDraggedNode);

  return state as DragState<T> | SynthDragState<T>;
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
      deepCopyStyles: false,
      handleDragstart,
      handleDragoverNode,
      handleDragoverParent,
      handleEnd,
      handleTouchstart,
      handlePointeroverNode,
      handlePointeroverParent,
      handlePointerdownNode,
      handlePointermove,
      handleDragenterNode,
      handleDragleaveNode,
      handleDropParent,
      nativeDrag: config.nativeDrag ?? true,
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
    privateClasses: [],
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

export function dragStateProps<T>(
  data: NodeDragEventData<T> | NodePointerEventData<T>,
  nativeDrag = true
): DragStateProps<T> {
  const { x, y } = eventCoordinates(data.e);

  const rect = data.targetData.node.el.getBoundingClientRect();

  const scrollEls: Array<[HTMLElement, AbortController]> = [];

  documentController = addEvents(document, {
    dragover: preventDefault,
  });

  for (const scrollable of getScrollables()) {
    let controller;

    if (nativeDrag) {
      controller = addEvents(scrollable, {
        scroll: preventSortOnScroll(),
      });
    } else {
      controller = addEvents(scrollable, {
        pointermove: handleScroll,
      });
    }

    scrollEls.push([scrollable, controller]);
  }

  return {
    affectedNodes: [],
    ascendingDirection: false,
    dynamicValues: [],
    pointerMoved: false,
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
    incomingDirection: undefined,
    initialIndex: data.targetData.node.data.index,
    initialParent: {
      el: data.targetData.parent.el,
      data: data.targetData.parent.data,
    },
    lastParent: {
      el: data.targetData.parent.el,
      data: data.targetData.parent.data,
    },
    longPress: data.targetData.parent.data.config.longPress ?? false,
    longPressTimeout: 0,
    lastTargetValue: data.targetData.node.data.value,
    scrollEls,
    startLeft: x - rect.left,
    startTop: y - rect.top,
    targetIndex: data.targetData.node.data.index,
    transferred: false,
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
    data.targetData.parent.data.config.onSort({
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
    });
  }
}

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
  obj: Array<any>,
  targetArray: Array<any>,
  newArray: Array<any>
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
      values
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

export function handleDropParent<T>(_data: ParentEventData<T>) {}

export function tearDown(parent: HTMLElement) {
  const parentData = parents.get(parent);

  if (!parentData) return;

  if (parentData.abortControllers.mainParent)
    parentData.abortControllers.mainParent.abort();
}

function isDragState<T>(
  state: BaseDragState
): state is DragState<T> | SynthDragState<T> {
  return "draggedNode" in state;
}

function isSynthDragState<T>(state: BaseDragState): state is SynthDragState<T> {
  return "clonedDraggedNode" in state;
}

function setup<T>(parent: HTMLElement, parentData: ParentData<T>): void {
  if (state) on("dragStarted", () => {});
  parentData.abortControllers.mainParent = addEvents(parent, {
    dragover: parentEventData(parentData.config.handleDragoverParent),
    handlePointeroverParent: parentData.config.handlePointeroverParent,
    drop: parentEventData(parentData.config.handleDropParent),
    hasNestedParent: (e: CustomEvent) => {
      const parent = parents.get(e.target as HTMLElement);

      if (!parent) return;

      parent.nestedParent = e.detail.parent;
    },
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
    touchstart: nodeEventData(config.handleTouchstart),
    pointerdown: nodeEventData(config.handlePointerdownNode),
    pointermove: nodeEventData(config.handlePointermove),
    pointerup: nodeEventData(config.handleEnd),
    handlePointeroverNode: config.handlePointeroverNode,
    mousedown: () => {
      if (!config.nativeDrag) isNative = false;
      else isNative = true;
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
  if (!isDragState(state)) return;

  const dropZoneClass =
    "clonedDraggedNode" in state
      ? parentData.config.synthDropZoneClass
      : parentData.config.dropZoneClass;

  if (state.draggedNode.el !== node) return;

  addNodeClass([node], dropZoneClass, true);
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

  parentData.privateClasses = Array.from(parent.classList);

  const enabledNodes: Array<Node> = [];

  const config = parentData.config;

  for (let x = 0; x < parent.children.length; x++) {
    const node = parent.children[x];

    if (!isNode(node)) continue;

    const nodeData = nodes.get(node);

    // Only tear down the node if we have explicitly called dragAndDrop
    if (force || !nodeData)
      config.tearDownNode({ node, parent, nodeData, parentData });

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

    let eventDispatched = false;

    while (nextAncestorEl) {
      if (!parents.has(nextAncestorEl as HTMLElement)) {
        nextAncestorEl = nextAncestorEl.parentElement;

        continue;
      }

      nextAncestorEl.dispatchEvent(
        new CustomEvent("hasNestedParent", {
          detail: {
            parent: { data: parentData, el: parent },
          },
        })
      );

      eventDispatched = true;

      nextAncestorEl = null;
    }

    if (!eventDispatched) console.warn("No ancestor found for tree group");
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

    if (
      isDragState(state) &&
      state.draggedNode &&
      nodeData.value === state.draggedNode.data.value
    ) {
      state.draggedNode.data = nodeData;

      state.draggedNode.el = node;
      const draggedNode = state.draggedNodes.find(
        (x) => x.data.value === nodeData.value
      );

      if (draggedNode) draggedNode.el = node;

      if (isSynthDragState(state))
        state.draggedNode.el.setPointerCapture(state.pointerId);
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
  state.remapJustFinished = true;

  if ("draggedNode" in state) state.affectedNodes = [];
}

export function handleDragstart<T>(
  data: NodeEventData<T>,
  state: BaseDragState
) {
  if (!(data.e instanceof DragEvent)) return;

  if (!data.targetData.parent.data.config.nativeDrag) {
    data.e.preventDefault();

    return;
  }

  dragstart(
    {
      e: data.e,
      targetData: data.targetData,
    },
    state
  );
}

export function handlePointerdownNode<T>(
  eventData: NodePointerEventData<T>,
  state: BaseDragState
) {
  eventData.e.stopPropagation();

  pointerdown(
    {
      e: eventData.e,
      targetData: eventData.targetData,
    },
    state
  );
}

export function dragstartClasses(
  el: HTMLElement | Node | Element,
  draggingClass: string | undefined,
  dropZoneClass: string | undefined,
  dragPlaceholderClass: string | undefined
) {
  addNodeClass([el], draggingClass);

  setTimeout(() => {
    removeClass([el], draggingClass);

    addNodeClass([el], dragPlaceholderClass);

    addNodeClass([el], dropZoneClass);
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

export function pointerdown<T>(
  data: NodePointerEventData<T>,
  _state: BaseDragState
) {
  if (!validateDragHandle(data)) return;

  synthNodePointerDown = true;
}

export function preventSortOnScroll() {
  let scrollTimeout: number;

  return () => {
    clearTimeout(scrollTimeout);

    if (state) state.preventEnter = true;

    scrollTimeout = setTimeout(() => {
      if (state) state.preventEnter = false;
    }, 100);
  };
}

export function dragstart<T>(
  data: NodeDragEventData<T>,
  _state: BaseDragState
) {
  if (!validateDragHandle(data)) {
    data.e.preventDefault();

    return;
  }

  const dragState = initDrag(data);

  //for (const el of dragState.scrollEls) el[1].abort();
  //}

  const config = data.targetData.parent.data.config;

  const originalZIndex = data.targetData.node.el.style.zIndex;

  dragState.originalZIndex = originalZIndex;

  // TODO: Gross
  data.targetData.node.el.style.zIndex = "9999";

  dragstartClasses(
    dragState.draggedNode.el,
    config.draggingClass,
    config.dropZoneClass,
    config.dragPlaceholderClass
  );

  if (config.onDragstart)
    config.onDragstart({
      parent: data.targetData.parent,
      values: parentValues(
        data.targetData.parent.el,
        data.targetData.parent.data
      ),
      draggedNode: dragState.draggedNode,
      draggedNodes: dragState.draggedNodes,
      position: dragState.initialIndex,
    });
}

export function handlePointeroverNode<T>(e: PointeroverNodeEvent<T>) {
  if (e.detail.targetData.parent.el === e.detail.state.lastParent.el)
    sort(e.detail, e.detail.state);
  else transfer(e.detail, e.detail.state);
}

export function handleEnd<T>(
  data: NodeEventData<T>,
  state: DragState<T> | SynthDragState<T>
) {
  if (!state) return;
  return;

  data.e.preventDefault();

  end(data, state);

  resetState();

  synthNodePointerDown = false;
}

export function end<T>(
  _eventData: NodeEventData<T>,
  state: DragState<T> | SynthDragState<T>
) {
  state.scrolling = false;
  if (documentController) {
    documentController.abort();

    documentController = undefined;
  }

  if ("longPressTimeout" in state && state.longPressTimeout)
    clearTimeout(state.longPressTimeout);

  const config = parents.get(state.initialParent.el)?.config;

  const isSynth = "clonedDraggedNode" in state && state.clonedDraggedNode;

  const dropZoneClass = isSynth
    ? config?.synthDropZoneClass
    : config?.dropZoneClass;

  if (state.originalZIndex !== undefined)
    state.draggedNode.el.style.zIndex = state.originalZIndex;

  addNodeClass(
    state.draggedNodes.map((x) => x.el),
    dropZoneClass,
    true
  );

  removeClass(
    state.draggedNodes.map((x) => x.el),
    dropZoneClass
  );

  if (config?.longPressClass) {
    removeClass(
      state.draggedNodes.map((x) => x.el),
      state.initialParent.data?.config?.longPressClass
    );
  }

  if ("clonedDraggedNode" in state && state.clonedDraggedNode)
    state.clonedDraggedNode.remove();

  if (config?.onDragend)
    config.onDragend({
      parent: state.lastParent,
      values: parentValues(state.lastParent.el, state.lastParent.data),
      draggedNode: state.draggedNode,
      draggedNodes: state.draggedNodes,
      position: state.initialIndex,
    });
}

export function handleTouchstart<T>(
  data: NodeEventData<T>,
  _state: BaseDragState
) {
  data.e.preventDefault();
}

export function handlePointermove<T>(
  data: NodePointerEventData<T>,
  state: SynthDragState<T> | BaseDragState
) {
  // TODO: Probably need stopPropagation here

  if (isNative || !synthNodePointerDown || !validateDragHandle(data)) return;

  if (!isSynthDragState(state)) {
    const synthDragState = initSyntheticDrag(data, state) as SynthDragState<T>;

    synthMove(data, synthDragState);

    if (data.targetData.parent.data.config.onDragstart)
      data.targetData.parent.data.config.onDragstart({
        parent: data.targetData.parent,
        values: parentValues(
          data.targetData.parent.el,
          data.targetData.parent.data
        ),
        draggedNode: synthDragState.draggedNode,
        draggedNodes: synthDragState.draggedNodes,
        position: synthDragState.initialIndex,
      });

    synthDragState.draggedNode.el.setPointerCapture(data.e.pointerId);

    synthDragState.pointerId = data.e.pointerId;

    return;
  }

  synthMove(data, state as SynthDragState<T>);
}

function initSyntheticDrag<T>(
  data: NodePointerEventData<T>,
  _state: BaseDragState
): SynthDragState<T> {
  const display = data.targetData.node.el.style.display;

  const rect = data.targetData.node.el.getBoundingClientRect();

  const clonedDraggedNode = data.targetData.node.el.cloneNode(
    true
  ) as HTMLElement;

  clonedDraggedNode.style.cssText = `
            width: ${rect.width}px;
            position: absolute;
            pointer-events: none;
            z-index: 999999;
          `;

  document.body.append(clonedDraggedNode);

  clonedDraggedNode.id = "hello world";

  if (data.targetData.parent.data.config.deepCopyStyles)
    copyNodeStyle(data.targetData.node.el, clonedDraggedNode);

  clonedDraggedNode.style.display = "none";

  const synthDragStateProps = {
    clonedDraggedEls: [],
    clonedDraggedNode,
    draggedNodeDisplay: display,
    synthDragScrolling: false,
  };

  addEvents(document, {
    contextmenu: noDefault,
  });

  const synthDragState = setDragState({
    ...dragStateProps(data, false),
    ...synthDragStateProps,
  }) as SynthDragState<T>;

  return synthDragState;
}

export function handleLongPress<T>(
  data: NodePointerEventData<T>,
  dragState: SynthDragState<T>
) {
  const config = data.targetData.parent.data.config;

  if (!config.longPress) return;

  dragState.longPressTimeout = setTimeout(() => {
    if (!dragState) return;

    dragState.longPress = true;

    if (config.longPressClass && data.e.cancelable)
      addNodeClass(
        dragState.draggedNodes.map((x) => x.el),
        config.longPressClass
      );

    data.e.preventDefault();
  }, config.longPressTimeout || 200);
}

function pointermoveClasses<T>(
  state: SynthDragState<T>,
  config: ParentConfig<T>
) {
  if (config.longPressClass)
    removeClass(
      state.draggedNodes.map((x) => x.el),
      config?.longPressClass
    );

  if (config.synthDraggingClass && state.clonedDraggedNode)
    addNodeClass([state.clonedDraggedNode], config.synthDraggingClass);

  if (config.synthDropZoneClass)
    addNodeClass(
      state.draggedNodes.map((x) => x.el),
      config.synthDropZoneClass
    );
}

function getScrollData<T>(
  e: DragEvent | PointerEvent,
  state: DragState<T> | SynthDragState<T>
): ScrollData<T> | undefined {
  if (!(e.currentTarget instanceof HTMLElement)) return;

  const { x, y, width, height } = e.currentTarget.getBoundingClientRect();

  const {
    x: xThresh,
    y: yThresh,
    scrollOutside,
  } = state.initialParent.data.config.scrollBehavior;

  return {
    xThresh,
    yThresh,
    scrollOutside,
    scrollParent: e.currentTarget,
    x,
    y,
    width,
    height,
  };
}

let interval: number | null = null;

let animationFrameId: number | null = null;

function setSynthScrollDirection<T>(
  direction: "up" | "down" | "left" | "right" | undefined,
  el: HTMLElement,
  state: SynthDragState<T>
) {
  if (state.syntheticScrollDirection === direction) return;

  state.syntheticScrollDirection = direction;

  // Cancel any ongoing animation frame when direction changes
  if (animationFrameId !== null) {
    cancelAnimationFrame(animationFrameId);

    animationFrameId = null;
  }

  // Function to perform the scrolling based on the current direction
  const scroll = () => {
    if (state.syntheticScrollDirection === undefined && animationFrameId) {
      cancelAnimationFrame(animationFrameId);

      animationFrameId = null;

      return;
    }

    switch (direction) {
      case "up":
        el.scrollBy(0, -3);

        break;
      case "down":
        el.scrollBy(0, 3);

        break;
      case "left":
        el.scrollBy(-3, 0);

        break;
      case "right":
        el.scrollBy(3, 0);

        break;
    }

    // Continue the loop by requesting the next animation frame
    animationFrameId = requestAnimationFrame(scroll);
  };

  // Start the scrolling loop
  animationFrameId = requestAnimationFrame(scroll);
}

function shouldScroll<T>(
  direction: string,
  e: DragEvent | PointerEvent,
  state: DragState<T> | SynthDragState<T>
): boolean {
  const dataScrollData = getScrollData(e, state);

  if (!dataScrollData) return false;

  switch (direction) {
    case "down":
      return !!shouldScrollDown(state, dataScrollData);

    case "up":
      return !!shouldScrollUp(state, dataScrollData);

    case "right":
      return !!shouldScrollRight(state, dataScrollData);

    case "left":
      return !!shouldScrollLeft(state, dataScrollData);

    default:
      return false;
  }
}

function shouldScrollRight<T>(
  state: DragState<T> | SynthDragState<T>,
  data: ScrollData<T>
): DragState<T> | DragState<T> | void {
  return;
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
  return;
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
  ) {
    return data.scrollParent;
  }
}

function shouldScrollDown<T>(
  state: DragState<T>,
  data: ScrollData<T>
): HTMLElement | void {
  const diff = data.scrollParent.clientHeight + data.y - state.coordinates.y;

  if (!data.scrollOutside && diff < 0) return;

  if (
    diff < (1 - data.yThresh) * data.scrollParent.clientHeight &&
    !(
      data.scrollParent.scrollTop + data.scrollParent.clientHeight >=
      data.scrollParent.scrollHeight
    )
  ) {
    return data.scrollParent;
  }
}

function moveNode<T>(data: NodePointerEventData<T>, state: SynthDragState<T>) {
  state.pointerMoved = true;

  state.clonedDraggedNode.style.display = state.draggedNodeDisplay || "";

  const { x, y } = eventCoordinates(data.e);

  state.coordinates.y = y;

  state.coordinates.x = x;

  const startLeft = state.startLeft ?? 0;

  const startTop = state.startTop ?? 0;

  state.clonedDraggedNode.style.left = `${x - startLeft}px`;

  state.clonedDraggedNode.style.top = `${y - startTop}px`;

  if (data.e.cancelable) data.e.preventDefault();

  pointermoveClasses(state, data.targetData.parent.data.config);
}

export function synthMove<T>(
  data: NodePointerEventData<T>,
  state: SynthDragState<T>
) {
  const config = data.targetData.parent.data.config;

  if (config.longPress && !state.longPress) {
    clearTimeout(state.longPressTimeout);

    return;
  }

  moveNode(data, state);

  //handleScroll(data, state);

  const elFromPoint = getElFromPoint(data);

  if (!elFromPoint) return;

  const pointerMoveEventData = {
    e: data.e,
    targetData: elFromPoint,
    state,
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

export function handleScroll<T>(e: DragEvent | PointerEvent) {
  if (!isSynthDragState(state)) return;

  let directionSet = false;

  for (const direction of Object.keys(scrollConfig)) {
    if (shouldScroll(direction, e, state)) {
      setSynthScrollDirection(direction, e.currentTarget, state);

      directionSet = true;

      break;
    }
  }

  if (!directionSet) state.syntheticScrollDirection = undefined;
}

export function handleDragoverNode<T>(
  data: NodeDragEventData<T>,
  state: DragState<T>
) {
  const { x, y } = eventCoordinates(data.e);

  state.coordinates.y = y;

  state.coordinates.x = x;

  dragoverNode(data, state);
}

export function handleDragoverParent<T>(
  data: ParentEventData<T>,
  state: DragState<T>
) {
  if (!state) return;

  const { x, y } = eventCoordinates(data.e as DragEvent);

  state.coordinates.y = y;

  state.coordinates.x = x;

  //if (!state.initialParent.data.config.nativeDragScroll) handleScroll(state);

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

  if (state.preventEnter) return false;

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

    if (!nodeData) return;

    const parentData = parents.get(node.parentNode);

    if (!parentData) return;

    return {
      node: {
        el: node,
        data: nodeData,
      },
      parent: {
        el: node.parentNode,
        data: parentData as ParentData<T>,
      },
    };
  }

  return (e: Event) => {
    const targetData = nodeTargetData(e.currentTarget as Node);

    if (!targetData) return;

    return callback(
      {
        e,
        targetData,
      },
      state
    );
  };
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
      state,
    });
  };
}
