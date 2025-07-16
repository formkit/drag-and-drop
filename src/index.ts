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
  SetupNodeData,
  TearDownNodeData,
  BaseDragState,
  SynthDragState,
  SynthDragStateProps,
  ParentRecord,
  EventHandlers,
  NodeFromPoint,
  ParentFromPoint,
  ParentDragEventData,
  DragstartEventData,
} from "./types";

import {
  pd,
  sp,
  on,
  emit,
  createEmitter,
  eq,
  splitClass,
  eventCoordinates,
} from "./utils";

export * from "./types";
export { animations } from "./plugins/animations";
export { insert } from "./plugins/insert";
export { dropOrSwap } from "./plugins/drop-or-swap";

/**
 * Check to see if code is running in a browser.
 */
export const isBrowser = typeof window !== "undefined";

/**
 * Parents or "lists" are the containers that nodes or "draggable items" can be
 * dragged from and into.
 *
 * @type {WeakMap<HTMLElement, ParentData<unknown>>}
 */
export const parents: ParentsData<any> = new WeakMap<
  HTMLElement,
  ParentData<unknown>
>();

/**
 * Nodes are the draggable items and the direct descendants of the parents.
 *
 * @type {WeakMap<Node, NodeData<unknown>>}
 */
export const nodes: NodesData<any> = new WeakMap<Node, NodeData<unknown>>();

function isMobilePlatform() {
  if (!isBrowser) return false;

  if ("userAgentData" in navigator) {
    return (navigator.userAgentData as { mobile: boolean }).mobile === true;
  }

  const ua = navigator.userAgent;

  const isMobileUA = /android|iphone|ipod/i.test(ua);

  const isIpad =
    /iPad/.test(ua) ||
    (ua.includes("Macintosh") && navigator.maxTouchPoints > 1);

  return isMobileUA || isIpad;
}

/**
 * The base drag state.
 *
 * @type {BaseDragState<unknown>}
 */
const baseDragState = {
  affectedNodes: [],
  coordinates: {
    x: 0,
    y: 0,
  },
  currentTargetValue: undefined,
  on,
  emit,
  originalZIndex: undefined,
  pointerSelection: false,
  preventEnter: false,
  rootUserSelect: undefined,
  nodePointerdown: undefined,
  longPress: false,
  scrolling: false,
  longPressTimeout: undefined,
  remapJustFinished: false,
  selectedNodes: [],
  selectedParent: undefined,
  preventSynthDrag: false,
  pointerDown: undefined,
  lastScrollContainerX: null,
  lastScrollContainerY: null,
  rootScrollWidth: undefined,
  rootScrollHeight: undefined,
  dragItemRect: undefined,
  windowScrollX: undefined,
  windowScrollY: undefined,
  lastScrollDirectionX: undefined,
  lastScrollDirectionY: undefined,
  scrollDebounceTimeout: undefined,
  frameIdX: undefined,
  frameIdY: undefined,
};

/**
 * The state of the drag and drop.
 *
 * @type {BaseDragState<unknown>}
 */
export let state: BaseDragState<unknown> = baseDragState;

/**
 * Variable to check if the drop has occurred.
 */
let dropped = false;

/**
 * Abort controller for the document.
 */
let documentController: AbortController | undefined;

/**
 * Timeout for the scroll.
 */
let scrollTimeout: ReturnType<typeof setTimeout>;

export function resetState() {
  // Clear any existing timeouts to prevent stale references
  if (state.scrollDebounceTimeout) {
    clearTimeout(state.scrollDebounceTimeout);
  }

  if (state.longPressTimeout) {
    clearTimeout(state.longPressTimeout);
  }

  // Cancel any animation frames
  if (state.frameIdX !== undefined) {
    cancelAnimationFrame(state.frameIdX);
  }

  if (state.frameIdY !== undefined) {
    cancelAnimationFrame(state.frameIdY);
  }

  const baseDragState = {
    affectedNodes: [],
    coordinates: {
      x: 0,
      y: 0,
    },
    on,
    emit,
    currentTargetValue: undefined,
    originalZIndex: undefined,
    pointerId: undefined,
    preventEnter: false,
    remapJustFinished: false,
    selectedNodes: [],
    nodePointerdown: undefined,
    rootUserSelect: undefined,
    preventSynthDrag: false,
    scrolling: false,
    selectedParent: undefined,
    pointerSelection: false,
    synthScrollDirection: undefined,
    draggedNodeDisplay: undefined,
    synthDragScrolling: false,
    longPress: false,
    pointerDown: undefined,
    longPressTimeout: undefined,
    lastScrollContainerX: null,
    lastScrollContainerY: null,
    rootScrollWidth: undefined,
    rootScrollHeight: undefined,
    dragItemRect: undefined,
    windowScrollX: undefined,
    windowScrollY: undefined,
    lastScrollDirectionX: undefined,
    lastScrollDirectionY: undefined,
    scrollDebounceTimeout: undefined,
    frameIdX: undefined,
    frameIdY: undefined,
  };

  state = { ...baseDragState } as BaseDragState<unknown>;
}

/**
 * @param {DragStateProps} dragStateProps - Attributes to update state with.
 *
 * @mutation - Updates state with node values.
 *
 * @returns void
 */
export function setDragState<T>(
  dragStateProps: (SynthDragStateProps & DragStateProps<T>) | DragStateProps<T>
): DragState<T> | SynthDragState<T> {
  Object.assign(state, dragStateProps);

  dragStateProps.initialParent.data.emit("dragStarted", state);

  dropped = false;

  state.emit("dragStarted", state);

  return state as DragState<T> | SynthDragState<T>;
}

/**
 *
 */
function handleRootPointerdown() {
  if (state.activeState) setActive(state.activeState.parent, undefined, state);

  if (state.selectedState)
    deselect(state.selectedState.nodes, state.selectedState.parent, state);

  state.selectedState = state.activeState = undefined;
}

function handleRootPointerup() {
  if (state.pointerDown) state.pointerDown.node.el.draggable = true;

  state.pointerDown = undefined;

  if (!isSynthDragState(state)) return;

  const config = state.currentParent.data.config;

  if (isSynthDragState(state)) config.handleEnd(state);
}

/**
 * Handles the keydown event on the root element.
 *
 * @param {KeyboardEvent} e - The keyboard event.
 */
function handleRootKeydown(e: KeyboardEvent) {
  if (e.key === "Escape") {
    if (state.selectedState)
      deselect(state.selectedState.nodes, state.selectedState.parent, state);

    if (state.activeState)
      setActive(state.activeState.parent, undefined, state);

    state.selectedState = state.activeState = undefined;
  }
}

function handleRootDrop(_e: DragEvent) {
  if (!isDragState(state)) return;

  dropped = true;

  const handleEnd = state.initialParent.data.config.handleEnd;

  handleEnd(state);
}

function handleRootDragover(e: DragEvent) {
  if (!isDragState(state)) return;

  pd(e);

  const { x, y } = eventCoordinates(e);

  if (isDragState(state)) {
    handleSynthScroll({ x, y }, e, state);
  }
}

function handleRootPointermove(e: PointerEvent) {
  if (!state.pointerDown || !state.pointerDown.validated) return;

  const config = state.pointerDown.parent.data.config;

  if (e.pointerType === "mouse" && !isMobilePlatform()) {
    return;
  }

  if (!isSynthDragState(state)) {
    pd(e);

    if (config.longPress && !state.longPress) {
      clearTimeout(state.longPressTimeout);

      state.longPress = false;

      return;
    }

    const nodes = config.draggedNodes(state.pointerDown);

    config.dragstartClasses(state.pointerDown.node, nodes, config, true);

    const rect = state.pointerDown.node.el.getBoundingClientRect();

    const synthDragState = initSynthDrag(
      state.pointerDown.node,
      state.pointerDown.parent,
      e,
      state,
      nodes,
      rect
    );

    synthMove(e, synthDragState, true);
  } else if (isSynthDragState(state)) {
    synthMove(e, state);
  }
}

function handleTouchmove(e: TouchEvent) {
  if (isDragState(state) && e.cancelable) pd(e);
}

function handleContextmenu(e: Event) {
  if (isSynthDragState(state)) pd(e);
}

/**
 * Initializes the drag and drop functionality for a given parent.
 *
 * @param {DragAndDrop} dragAndDrop - The drag and drop configuration.
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

  if (!documentController) {
    documentController = addEvents(document, {
      dragover: handleRootDragover,
      pointerdown: handleRootPointerdown,
      pointerup: handleRootPointerup,
      keydown: handleRootKeydown,
      drop: handleRootDrop,
      pointermove: handleRootPointermove,
      pointercancel: nodeEventData(config.handlePointercancel),
      touchmove: handleTouchmove,
      contextmenu: handleContextmenu,
    });
  }

  tearDown(parent);

  const [emit, on] = createEmitter();

  const parentData: ParentData<T> = {
    getValues,
    setValues,
    config: {
      dragDropEffect: config.dragDropEffect ?? "move",
      dragEffectAllowed: config.dragEffectAllowed ?? "move",
      draggedNodes,
      dragstartClasses,
      handleNodeKeydown,
      handleDragstart,
      handleNodeDragover,
      handleParentDragover,
      handleNodeDrop,
      handleNodeFocus,
      handleNodeBlur,
      handlePointercancel,
      handleEnd,
      handleDragend,
      handleParentFocus,
      handleNodePointerup,
      handleNodePointerover,
      handleParentPointerover,
      handleParentScroll,
      handleNodePointerdown,
      handleNodeDragenter,
      handleNodeDragleave,
      handleParentDrop,
      multiDrag: config.multiDrag ?? false,
      nativeDrag: config.nativeDrag ?? true,
      performSort,
      performTransfer,
      root: config.root ?? document,
      setupNode,
      setupNodeRemap,
      reapplyDragClasses,
      tearDownNode,
      tearDownNodeRemap,
      remapFinished,
      threshold: {
        horizontal: 0,
        vertical: 0,
      },
      ...config,
    },
    enabledNodes: [],
    abortControllers: {},
    privateClasses: [],
    on,
    emit,
  };

  const nodesObserver = new MutationObserver(nodesMutated);

  nodesObserver.observe(parent, { childList: true });

  parents.set(parent, parentData);

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
  node: NodeRecord<T>,
  parent: ParentRecord<T>,
  e: PointerEvent | DragEvent,
  draggedNodes: Array<NodeRecord<T>>,
  offsetX?: number,
  offsetY?: number
): DragStateProps<T> {
  const { x, y } = eventCoordinates(e);

  const rect = node.el.getBoundingClientRect();

  return {
    affectedNodes: [],
    ascendingDirection: false,
    clonedDraggedEls: [],
    coordinates: {
      x,
      y,
    },
    draggedNode: {
      el: node.el,
      data: node.data,
    },
    draggedNodes,
    incomingDirection: undefined,
    initialIndex: node.data.index,
    initialParent: {
      el: parent.el,
      data: parent.data,
    },
    currentParent: {
      el: parent.el,
      data: parent.data,
    },
    longPress: parent.data.config.longPress ?? false,
    longPressTimeout: undefined,
    currentTargetValue: node.data.value,
    scrollEls: [],
    startLeft: offsetX ? offsetX : x - (rect?.left ?? 0),
    startTop: offsetY ? offsetY : y - (rect?.top ?? 0),
    targetIndex: node.data.index,
    transferred: false,
  };
}

/**
 * Perform the sort of the nodes.
 *
 * @param {ParentRecord<T>} parent - The parent record.
 * @param {Array<NodeRecord<T>>} draggedNodes - The dragged nodes.
 * @param {Array<NodeRecord<T>>} targetNodes - The target nodes.
 *
 * @returns void
 */
export function performSort<T>({
  parent,
  draggedNodes,
  targetNodes,
}: {
  parent: ParentRecord<T>;
  draggedNodes: Array<NodeRecord<T>>;
  targetNodes: Array<NodeRecord<T>>;
}) {
  remapNodes(parent.el);

  const draggedValues = draggedNodes.map((x) => x.data.value);

  const targetParentValues = parentValues(parent.el, parent.data);

  const originalIndex = draggedNodes[0].data.index;

  const enabledNodes = [...parent.data.enabledNodes];

  const newParentValues = [
    ...targetParentValues.filter((x) => !draggedValues.some((y) => eq(x, y))),
  ];
  newParentValues.splice(targetNodes[0].data.index, 0, ...draggedValues);

  if ("draggedNode" in state)
    state.currentTargetValue = targetNodes[0].data.value;

  setParentValues(parent.el, parent.data, [...newParentValues]);

  if (parent.data.config.onSort) {
    parent.data.config.onSort({
      parent: {
        el: parent.el,
        data: parent.data,
      } as ParentRecord<unknown>,
      previousValues: [...targetParentValues],
      previousNodes: [...enabledNodes],
      nodes: [...parent.data.enabledNodes],
      values: [...newParentValues],
      draggedNodes: draggedNodes,
      previousPosition: originalIndex,
      position: targetNodes[0].data.index,
      targetNodes,
      state,
    });
  }
}

/**
 * This function sets the active node as well as removing any classes or
 * attribute set.
 *
 * @param {ParentEventData} data - The parent event data.
 * @param {NodeRecord} newActiveNode - The new active node.
 * @param {BaseDragState} state - The current drag state.
 */
function setActive<T>(
  parent: ParentRecord<T>,
  newActiveNode: NodeRecord<T> | undefined,
  state: BaseDragState<T>
) {
  if (!newActiveNode) {
    state.activeState = undefined;

    return;
  }

  state.activeState = {
    node: newActiveNode,
    parent,
  };
}

/**
 * This function deselects the nodes. This will clean the prior selected state
 * as well as removing any classes or attributes set.
 *
 * @param {Array<NodeRecord<T>>} nodes - The nodes to deselect.
 * @param {ParentRecord<T>} parent - The parent record.
 * @param {BaseDragState<T>} state - The current drag state.
 */
function deselect<T>(
  nodes: Array<NodeRecord<T>>,
  parent: ParentRecord<T>,
  state: BaseDragState<T>
) {
  const selectedClass = parent.data.config.selectedClass;

  if (!state.selectedState) return;

  const iterativeNodes = Array.from(nodes);

  removeClass(
    nodes.map((x) => x.el),
    selectedClass
  );

  for (const node of iterativeNodes) {
    node.el.setAttribute("aria-selected", "false");

    const index = state.selectedState.nodes.findIndex((x) => x.el === node.el);

    if (index === -1) continue;

    state.selectedState.nodes.splice(index, 1);
  }
}

/**
 * This function sets the selected nodes. This will clean the prior selected
 * state as well as removing any classes or attributes set.
 *
 * @param {ParentRecord<T>} parent - The parent record.
 * @param {Array<NodeRecord<T>>} selectedNodes - The nodes to select.
 * @param {NodeRecord<T> | undefined} newActiveNode - The new active node.
 * @param {BaseDragState<T>} state - The current drag state.
 * @param {boolean} pointerdown - Whether the pointerdown event was triggered.
 */
function setSelected<T>(
  parent: ParentRecord<T>,
  selectedNodes: Array<NodeRecord<T>>,
  newActiveNode: NodeRecord<T> | undefined,
  state: BaseDragState<T>,
  pointerdown = false
) {
  state.pointerSelection = pointerdown;

  for (const node of selectedNodes) {
    node.el.setAttribute("aria-selected", "true");

    addNodeClass([node.el], parent.data.config.selectedClass, true);
  }

  state.selectedState = {
    nodes: selectedNodes,
    parent,
  };

  setActive(parent, newActiveNode, state);
}

/**
 * Handle the parent focus event.
 *
 * @param {ParentEventData<T>} data - The parent event data.
 * @param {BaseDragState<T> | DragState<T> | SynthDragState<T>} state - The drag state.
 *
 * @returns void
 */
export function handleParentFocus<T>(
  data: ParentEventData<T>,
  state: BaseDragState<T> | DragState<T> | SynthDragState<T>
) {
  const firstEnabledNode = data.targetData.parent.data.enabledNodes[0];

  if (!firstEnabledNode) return;

  if (
    state.selectedState &&
    state.selectedState.parent.el !== data.targetData.parent.el
  ) {
    setActive(data.targetData.parent, firstEnabledNode, state);
  } else if (!state.selectedState) {
    setActive(data.targetData.parent, firstEnabledNode, state);
  }
}

/**
 * Perform the transfer of the nodes.
 *
 * @param data - The transfer data.
 * @param state - The drag state.
 *
 * @returns void
 */
export function performTransfer<T>({
  currentParent,
  targetParent,
  initialParent,
  draggedNodes,
  initialIndex,
  targetNodes,
  state,
}: {
  currentParent: ParentRecord<T>;
  targetParent: ParentRecord<T>;
  initialParent: ParentRecord<T>;
  draggedNodes: Array<NodeRecord<T>>;
  initialIndex: number;
  state: BaseDragState<T> | DragState<T> | SynthDragState<T>;
  targetNodes: Array<NodeRecord<T>>;
}) {
  remapNodes(initialParent.el);

  const draggedValues = draggedNodes.map((x) => x.data.value);

  const currentParentValues = [
    ...parentValues(currentParent.el, currentParent.data).filter(
      (x) => !draggedValues.some((y) => eq(x, y))
    ),
  ];

  const targetParentValues = parentValues(targetParent.el, targetParent.data);

  const reset =
    initialParent.el === targetParent.el &&
    targetParent.data.config.sortable === false;

  let targetIndex: number;

  if (targetNodes.length) {
    if (reset) {
      targetIndex = initialIndex;
    } else if (targetParent.data.config.sortable === false) {
      targetIndex = targetParent.data.enabledNodes.length;
    } else {
      targetIndex = targetNodes[0].data.index;
    }

    targetParentValues.splice(targetIndex, 0, ...draggedValues);
  } else {
    targetIndex = reset ? initialIndex : targetParent.data.enabledNodes.length;

    targetParentValues.splice(targetIndex, 0, ...draggedValues);
  }

  setParentValues(currentParent.el, currentParent.data, currentParentValues);

  setParentValues(targetParent.el, targetParent.data, targetParentValues);

  if (targetParent.data.config.onTransfer) {
    targetParent.data.config.onTransfer({
      sourceParent: currentParent,
      targetParent,
      initialParent,
      draggedNodes,
      targetIndex,
      state,
      targetNodes,
    });
  }

  if (currentParent.data.config.onTransfer) {
    currentParent.data.config.onTransfer({
      sourceParent: currentParent,
      targetParent,
      initialParent,
      draggedNodes,
      targetIndex,
      state,
      targetNodes: targetNodes ? targetNodes : [],
    });
  }
}

/**
 * Get the values of the parent.
 *
 * @param parent - The parent element.
 * @param parentData - The parent data.
 *
 * @returns The values of the parent.
 */
export function parentValues<T>(
  parent: HTMLElement,
  parentData: ParentData<T>
): Array<T> {
  return [...parentData.getValues(parent)];
}

/**
 * Set the values of the parent.
 *
 * @param parent - The parent element.
 * @param parentData - The parent data.
 * @param values - The values to set.
 *
 * @returns void
 */
export function setParentValues<T>(
  parent: HTMLElement,
  parentData: ParentData<T>,
  values: Array<any>
): void {
  parentData.setValues(values, parent);
}

/**
 * Get the values of the dragged nodes.
 *
 * @param state - The drag state.
 *
 * @returns The values of the dragged nodes.
 */
export function dragValues<T>(state: DragState<T>): Array<T> {
  return [...state.draggedNodes.map((x) => x.data.value)];
}

/**
 * Utility function to update parent config.
 *
 * @param parent - The parent element.
 * @param config - The config to update.
 *
 * @returns void
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
 * Handle the parent drop event.
 *
 * @param data - The parent event data.
 * @param state - The drag state.
 *
 * @returns void
 */
export function handleParentDrop<T>(
  data: ParentEventData<T>,
  state: DragState<T>
) {
  sp(data.e);

  dropped = true;

  const handleEnd = state.initialParent.data.config.handleEnd;

  handleEnd(state);
}

/**
 * Tear down the parent.
 *
 * @param parent - The parent element.
 *
 * @returns void
 */
export function tearDown(parent: HTMLElement) {
  const parentData = parents.get(parent);

  if (!parentData) return;

  if (parentData.abortControllers.mainParent)
    parentData.abortControllers.mainParent.abort();
}

/**
 * Check if the state is a drag state.
 *
 * @param state - The state to check.
 *
 * @returns Whether the state is a drag state.
 */
export function isDragState<T>(
  state: BaseDragState<T>
): state is DragState<T> | SynthDragState<T> {
  return "draggedNode" in state && !!state.draggedNode;
}

/**
 * Check if the state is a synth drag state.
 *
 * @param state - The state to check.
 *
 * @returns Whether the state is a synth drag state.
 */
export function isSynthDragState<T>(
  state: BaseDragState<T>
): state is SynthDragState<T> {
  return "synthDragging" in state && !!state.synthDragging;
}

/**
 * Setup the parent.
 *
 * @param parent - The parent element.
 * @param parentData - The parent data.
 *
 * @returns void
 */
function setup<T>(parent: HTMLElement, parentData: ParentData<T>): void {
  parentData.abortControllers.mainParent = addEvents(parent, {
    dragover: parentEventData(parentData.config.handleParentDragover),
    handleParentPointerover: parentData.config.handleParentPointerover,
    scroll: parentEventData(parentData.config.handleParentScroll),
    drop: parentEventData(parentData.config.handleParentDrop),
    hasNestedParent: (e: CustomEvent) => {
      const parent = parents.get(e.target as HTMLElement);

      if (!parent) return;

      parent.nestedParent = e.detail.parent;
    },
    focus: parentEventData(parentData.config.handleParentFocus),
  });

  if (
    parentData.config.externalDragHandle &&
    parentData.config.externalDragHandle.el &&
    parentData.config.externalDragHandle.callback
  ) {
    parentData.abortControllers.externalDragHandle = addEvents(
      parentData.config.externalDragHandle.el,
      {
        pointerdown: (_e: PointerEvent) => {
          if (
            !parentData.config.externalDragHandle ||
            !parentData.config.externalDragHandle.callback
          )
            return;

          const draggableItem = parentData.config.externalDragHandle.callback();

          if (!isNode(draggableItem)) {
            console.warn(
              "No draggable item found from external drag handle callback"
            );

            return;
          }

          const nodeData = nodes.get(draggableItem);

          if (!nodeData) return;

          const parentNode = draggableItem.parentNode;

          if (!(parentNode instanceof HTMLElement)) return;

          const parent = parents.get(parentNode);

          if (!parent) return;

          state.pointerDown = {
            parent: {
              el: parentNode,
              data: parent,
            },
            node: {
              el: draggableItem,
              data: nodeData,
            },
            validated: true,
          };

          draggableItem.draggable = true;
        },
      }
    );
  }
}

/**
 * Set the attributes of the element.
 *
 * @param el - The element.
 * @param attrs - The attributes to set.
 *
 * @returns void
 */
export function setAttrs(el: HTMLElement, attrs: Record<string, string>) {
  for (const key in attrs) el.setAttribute(key, attrs[key]);
}

/**
 * Setup the node.
 *
 * @param data - The setup node data.
 *
 * @returns void
 */
export function setupNode<T>(data: SetupNodeData<T>) {
  const config = data.parent.data.config;

  data.node.data.abortControllers.mainNode = addEvents(data.node.el, {
    keydown: nodeEventData(config.handleNodeKeydown),
    dragstart: nodeEventData(config.handleDragstart),
    dragover: nodeEventData(config.handleNodeDragover),
    dragenter: nodeEventData(config.handleNodeDragenter),
    dragleave: nodeEventData(config.handleNodeDragleave),
    dragend: nodeEventData(config.handleDragend),
    drop: nodeEventData(config.handleNodeDrop),
    focus: nodeEventData(config.handleNodeFocus),
    blur: nodeEventData(config.handleNodeBlur),
    pointerup: nodeEventData(config.handleNodePointerup),
    pointercancel: nodeEventData(config.handlePointercancel),
    pointerdown: nodeEventData(config.handleNodePointerdown),
    handleNodePointerover: config.handleNodePointerover,
    touchmove: (e: TouchEvent) => {
      if (isDragState(state) && e.cancelable) pd(e);
    },
    contextmenu: (e: Event) => {
      if (isSynthDragState(state)) pd(e);
    },
  });

  data.node.el.draggable = true;

  config.reapplyDragClasses(data.node.el, data.parent.data);

  data.parent.data.config.plugins?.forEach((plugin: DNDPlugin) => {
    plugin(data.parent.el)?.setupNode?.(data);
  });
}

/**
 * Setup the node remap.
 *
 * @param data - The setup node data.
 *
 * @returns void
 */
export function setupNodeRemap<T>(data: SetupNodeData<T>) {
  nodes.set(data.node.el, data.node.data);

  data.parent.data.config.plugins?.forEach((plugin: DNDPlugin) => {
    plugin(data.parent.el)?.setupNodeRemap?.(data);
  });
}

/**
 * Reapply the drag classes to the node.
 *
 * @param node - The node.
 * @param parentData - The parent data.
 *
 * @returns void
 */
function reapplyDragClasses<T>(node: Node, parentData: ParentData<T>) {
  if (!isDragState(state)) return;

  const dropZoneClass = isSynthDragState(state)
    ? parentData.config.synthDropZoneClass
    : parentData.config.dropZoneClass;

  if (state.draggedNode.el !== node) return;

  addNodeClass([node], dropZoneClass, true);
}

/**
 * Tear down the node remap.
 *
 * @param data - The tear down node data.
 *
 * @returns void
 */
export function tearDownNodeRemap<T>(data: TearDownNodeData<T>) {
  data.parent.data.config.plugins?.forEach((plugin: DNDPlugin) => {
    plugin(data.parent.el)?.tearDownNodeRemap?.(data);
  });
}

/**
 * Tear down the node.
 *
 * @param data - The tear down node data.
 *
 * @returns void
 */
export function tearDownNode<T>(data: TearDownNodeData<T>) {
  data.parent.data.config.plugins?.forEach((plugin: DNDPlugin) => {
    plugin(data.parent.el)?.tearDownNode?.(data);
  });

  data.node.el.draggable = false;

  if (data.node.data?.abortControllers?.mainNode)
    data.node.data?.abortControllers?.mainNode.abort();
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
  // TODO: This could be better, but using it as a way to ignore comments and text
  if (
    mutationList.length === 1 &&
    mutationList[0].addedNodes.length === 1 &&
    !(mutationList[0].addedNodes[0] instanceof HTMLElement)
  )
    return;

  const parentEl = mutationList[0].target;

  if (!(parentEl instanceof HTMLElement)) return;

  const parentData = parents.get(parentEl);

  if (!parentData) return;

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

    if (!isNode(node) || node.id === "dnd-dragged-node-clone") continue;

    const nodeData = nodes.get(node);

    // Only tear down the node if we have explicitly called dragAndDrop
    if (force || !nodeData)
      config.tearDownNode({
        parent: {
          el: parent,
          data: parentData,
        },
        node: {
          el: node,
          data: nodeData,
        },
      });

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
      "The number of draggable items defined in the parent element does not match the number of values. This may cause unexpected behavior."
    );

    return;
  }

  const values = parentData.getValues(parent);

  const enabledNodeRecords: Array<NodeRecord<T>> = [];

  for (let x = 0; x < enabledNodes.length; x++) {
    const node = enabledNodes[x];

    const prevNodeData = nodes.get(node);

    if (config.draggableValue && !config.draggableValue(values[x])) continue;

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
      !isDragState(state) &&
      state.activeState &&
      eq(state.activeState.node.data.value, nodeData.value)
    ) {
      setActive(
        {
          data: parentData,
          el: parent,
        },
        {
          el: node,
          data: nodeData,
        },
        state
      );
    }

    if (
      isDragState(state) &&
      eq(state.draggedNode.data.value, nodeData.value)
    ) {
      state.draggedNode.data = nodeData;

      state.draggedNode.el = node;

      const draggedNode = state.draggedNodes.find(
        (x) => x.data.value === nodeData.value
      );

      if (draggedNode) draggedNode.el = node;
    }

    enabledNodeRecords.push({
      el: node,
      data: nodeData,
    });

    if (force || !prevNodeData)
      config.setupNode({
        parent: {
          el: parent,
          data: parentData,
        },
        node: {
          el: node,
          data: nodeData,
        },
      });

    setupNodeRemap({
      parent: {
        el: parent,
        data: parentData,
      },
      node: {
        el: node,
        data: nodeData,
      },
    });
  }

  parents.set(parent, { ...parentData, enabledNodes: enabledNodeRecords });

  config.remapFinished(parentData);

  parentData.config.plugins?.forEach((plugin: DNDPlugin) => {
    plugin(parent)?.remapFinished?.();
  });
}

/**
 * Set the remap just finished flag.
 *
 * @returns void
 */
export function remapFinished() {
  state.remapJustFinished = true;

  if ("draggedNode" in state) state.affectedNodes = [];
}

/**
 * Validate the drag start.
 *
 * @param data - The node event data.
 *
 * @returns Whether the drag start is valid.
 */
export function validateDragstart(data: NodeEventData<any>): boolean {
  return !!data.targetData.parent.data.config.nativeDrag;
}

/**
 * Get the dragged nodes.
 *
 * @param pointerDown - The pointer down data.
 *
 * @returns The dragged nodes.
 */
function draggedNodes<T>(pointerDown: {
  parent: ParentRecord<T>;
  node: NodeRecord<T>;
}): Array<NodeRecord<T>> {
  if (!pointerDown.parent.data.config.multiDrag) {
    return [pointerDown.node];
  } else if (state.selectedState) {
    return [
      pointerDown.node,
      ...(state.selectedState?.nodes.filter(
        (x) => x.el !== pointerDown.node.el
      ) as Array<NodeRecord<T>>),
    ];
  }

  return [];
}

/**
 * Handle the parent scroll.
 *
 * @param data - The parent event data.
 *
 * @returns void
 */
function handleParentScroll<T>(_data: ParentEventData<T>) {
  if (!isDragState(state)) return;

  state.emit("scrollStarted", state);

  if (isSynthDragState(state)) return;

  state.preventEnter = true;

  if (scrollTimeout) clearTimeout(scrollTimeout);

  scrollTimeout = setTimeout(() => {
    state.preventEnter = false;

    state.emit("scrollEnded", state);
  }, 100);
}

/**
 * Responsible for assigning dragstart classes to the dragged nodes.
 */
export function handleDragstart<T>(
  data: NodeDragEventData<T>,
  _state: BaseDragState<T>
) {
  const config = data.targetData.parent.data.config;

  if (
    !config.nativeDrag ||
    !validateDragstart(data) ||
    !validateDragHandle({
      x: data.e.clientX,
      y: data.e.clientY,
      node: data.targetData.node,
      config,
    })
  ) {
    pd(data.e);

    return;
  }

  let nodes = config.draggedNodes({
    parent: data.targetData.parent,
    node: data.targetData.node,
  });

  // On Safari, pointerdown can sometimes not fire before the dragstart event.
  if (nodes.length === 0) {
    nodes = [data.targetData.node];
  }

  config.dragstartClasses(data.targetData.node, nodes, config);

  const dragState = initDrag(data, nodes);

  if (config.onDragstart) {
    const dragstartData: DragstartEventData<T> = {
      parent: data.targetData.parent,
      values: parentValues(
        data.targetData.parent.el,
        data.targetData.parent.data
      ),
      draggedNode: dragState.draggedNode,
      draggedNodes: dragState.draggedNodes,
      position: dragState.initialIndex,
      state: dragState,
    };
    config.onDragstart(dragstartData);
  }
}

export function handleNodePointerdown<T>(
  data: NodePointerEventData<T>,
  state: BaseDragState<T>
) {
  sp(data.e);

  state.pointerDown = {
    parent: data.targetData.parent,
    node: data.targetData.node,
    validated: false,
  };

  if (
    !validateDragHandle({
      x: data.e.clientX,
      y: data.e.clientY,
      node: data.targetData.node,
      config: data.targetData.parent.data.config,
    })
  )
    return;

  state.pointerDown.validated = true;

  handleLongPress(data, state, data.targetData.node);

  const parentData = data.targetData.parent.data;

  let selectedNodes = [data.targetData.node];

  const commandKey = data.e.ctrlKey || data.e.metaKey;

  const shiftKey = data.e.shiftKey;

  const targetNode = data.targetData.node;

  if (commandKey && parentData.config.multiDrag) {
    if (state.selectedState) {
      const idx = state.selectedState.nodes.findIndex(
        (x) => x.el === targetNode.el
      );

      if (idx === -1) {
        selectedNodes = [...state.selectedState.nodes, targetNode];
      } else {
        selectedNodes = state.selectedState.nodes.filter(
          (x) => x.el !== targetNode.el
        );
      }
    } else {
      selectedNodes = [targetNode];
    }

    setSelected(
      data.targetData.parent,
      selectedNodes,
      data.targetData.node,
      state,
      true
    );

    return;
  }

  if (shiftKey && parentData.config.multiDrag) {
    const nodes = data.targetData.parent.data.enabledNodes;

    if (state.selectedState && state.activeState) {
      if (state.selectedState.parent.el !== data.targetData.parent.el) {
        deselect(state.selectedState.nodes, state.selectedState.parent, state);

        state.selectedState = undefined;

        for (let x = 0; x <= targetNode.data.index; x++)
          selectedNodes.push(nodes[x]);
      } else {
        const [minIndex, maxIndex] =
          state.activeState.node.data.index < data.targetData.node.data.index
            ? [
                state.activeState.node.data.index,
                data.targetData.node.data.index,
              ]
            : [
                data.targetData.node.data.index,
                state.activeState.node.data.index,
              ];

        selectedNodes = nodes.slice(minIndex, maxIndex + 1);
      }
    } else {
      for (let x = 0; x <= targetNode.data.index; x++)
        selectedNodes.push(nodes[x]);
    }

    setSelected(
      data.targetData.parent,
      selectedNodes,
      data.targetData.node,
      state,
      true
    );

    return;
  }

  if (state.selectedState?.nodes?.length) {
    const idx = state.selectedState.nodes.findIndex(
      (x) => x.el === data.targetData.node.el
    );

    if (idx === -1) {
      if (state.selectedState.parent.el !== data.targetData.parent.el) {
        deselect(state.selectedState.nodes, data.targetData.parent, state);
      } else if (parentData.config.multiDrag && isMobilePlatform()) {
        selectedNodes.push(...state.selectedState.nodes);
      } else {
        deselect(state.selectedState.nodes, data.targetData.parent, state);
      }

      setSelected(
        data.targetData.parent,
        selectedNodes,
        data.targetData.node,
        state,
        true
      );
    }
  } else {
    setSelected(
      data.targetData.parent,
      [data.targetData.node],
      data.targetData.node,
      state,
      true
    );
  }
}

/**
 * Add dragstart classes to the nodes.
 *
 * @param node - The node.
 * @param nodes - The nodes.
 * @param config - The parent config.
 * @param isSynth - Whether the drag is synthetic.
 *
 * @returns void
 */
export function dragstartClasses<T>(
  _node: NodeRecord<T>,
  nodes: Array<NodeRecord<T>>,
  config: ParentConfig<T>,
  isSynth = false
) {
  addNodeClass(
    nodes.map((x) => x.el),
    isSynth ? config.synthDraggingClass : config.draggingClass
  );

  setTimeout(() => {
    removeClass(
      nodes.map((x) => x.el),
      isSynth ? config.synthDraggingClass : config.draggingClass
    );

    addNodeClass(
      nodes.map((x) => x.el),
      isSynth ? config.synthDragPlaceholderClass : config.dragPlaceholderClass
    );

    addNodeClass(
      nodes.map((x) => x.el),
      isSynth ? config.synthDropZoneClass : config.dropZoneClass
    );

    removeClass(
      nodes.map((x) => x.el),
      config.selectedClass
    );
  });
}

export function initDrag<T>(
  data: NodeDragEventData<T>,
  draggedNodes: Array<NodeRecord<T>>
): DragState<T> {
  sp(data.e);

  const dragState = setDragState(
    dragStateProps(
      data.targetData.node,
      data.targetData.parent,
      data.e,
      draggedNodes
    )
  );

  if (data.e.dataTransfer) {
    const config = data.targetData.parent.data.config;

    data.e.dataTransfer.dropEffect = config.dragDropEffect;
    data.e.dataTransfer.effectAllowed = config.dragEffectAllowed;

    let dragImage: HTMLElement | undefined;

    data.e.dataTransfer.setData("text/plain", "");

    if (config.dragImage) {
      dragImage = config.dragImage(data, draggedNodes);
    } else {
      if (!config.multiDrag || draggedNodes.length === 1) {
        data.targetData.node.el.style.zIndex = "9999";
        data.targetData.node.el.style.boxSizing = "border-box";

        data.e.dataTransfer.setDragImage(
          data.targetData.node.el,
          data.e.offsetX,
          data.e.offsetY
        );

        dragState.originalZIndex = data.targetData.node.el.style.zIndex;

        return dragState;
      } else {
        const wrapper = document.createElement("div");

        wrapper.setAttribute("id", "dnd-dragged-node-clone");

        wrapper.setAttribute("popover", "manual");

        for (const node of draggedNodes) {
          const clone = node.el.cloneNode(true) as HTMLElement;

          clone.id = node.el.id + "-clone";

          clone.style.pointerEvents = "none";

          wrapper.appendChild(clone);
        }

        const { width } = draggedNodes[0].el.getBoundingClientRect();

        Object.assign(wrapper.style, {
          display: "flex",
          flexDirection: "column",
          width: `${width}px`,
          position: "absolute",
          pointerEvents: "none",
          zIndex: "9999",
          left: "-9999px",
          boxSizing: "border-box",
          background: "transparent",
          overflow: "hidden",
        });

        data.targetData.parent.el.appendChild(wrapper);

        wrapper.showPopover();

        wrapper.getBoundingClientRect(); // ← forces layout

        dragImage = wrapper;

        data.e.dataTransfer.setDragImage(
          dragImage,
          data.e.offsetX,
          data.e.offsetY
        );
      }
    }

    setTimeout(() => {
      dragImage?.remove();
    });
  }

  return dragState;
}

export function validateDragHandle<T>({
  x,
  y,
  node,
  config,
}: {
  x: number;
  y: number;
  node: NodeRecord<T>;
  config: ParentConfig<T>;
}): boolean {
  if (config.externalDragHandle) return false;

  if (!config.dragHandle) return true;

  const dragHandles = node.el.querySelectorAll(config.dragHandle);

  if (!dragHandles) return false;

  const elFromPoint = config.root.elementFromPoint(x, y);

  if (!elFromPoint) return false;

  for (const handle of Array.from(dragHandles))
    if (elFromPoint === handle || handle.contains(elFromPoint)) return true;

  return false;
}

export function handleClickNode<T>(_data: NodeEventData<T>) {}

export function handleClickParent<T>(_data: ParentEventData<T>) {}

export function handleNodeKeydown<T>(_data: NodeEventData<T>) {}

/**
 * Prevent the sort on scroll.
 *
 * @returns A function to prevent the sort on scroll.
 */
export function preventSortOnScroll() {
  let scrollTimeout: ReturnType<typeof setTimeout>;

  return () => {
    clearTimeout(scrollTimeout);

    if (state) state.preventEnter = true;

    scrollTimeout = setTimeout(() => {
      if (state) state.preventEnter = false;
    }, 100);
  };
}

/**
 * Handle the node pointer over.
 *
 * @param e - The node pointer over event.
 *
 * @returns void
 */
export function handleNodePointerover<T>(e: PointeroverNodeEvent<T>) {
  if (e.detail.targetData.parent.el === e.detail.state.currentParent.el)
    sort(e.detail, e.detail.state);
  else transfer(e.detail, e.detail.state);
}

/**
 * Handle the node drop.
 *
 * @param data - The node drag event data.
 * @param state - The drag state.
 *
 * @returns void
 */
export function handleNodeDrop<T>(
  data: NodeDragEventData<T>,
  state: DragState<T> | SynthDragState<T>
) {
  const config = data.targetData.parent.data.config;

  if (!config.nativeDrag) return;

  sp(data.e);

  dropped = true;

  config.handleEnd(state);
}

export function handleNodeFocus<T>(data: NodeEventData<T>) {
  if (data.e.target === data.e.currentTarget) return;

  if (state.pointerDown) state.pointerDown.node.el.draggable = false;
}

export function handleNodeBlur<T>(data: NodeEventData<T>) {
  if (data.e.target === data.e.currentTarget) return;

  if (state.pointerDown) state.pointerDown.node.el.draggable = true;
}

/**
 * Handle the drag end.
 *
 * @param data - The node drag event data.
 * @param state - The drag state.
 *
 * @returns void
 */
export function handleDragend<T>(
  data: NodeDragEventData<T>,
  state: DragState<T>
) {
  const config = data.targetData.parent.data.config;

  if (!config.nativeDrag) return;

  pd(data.e);

  sp(data.e);

  if (dropped) {
    dropped = false;

    return;
  }

  config.handleEnd(state);
}

/**
 * Handle the pointer cancel.
 *
 * @param data - The node event data.
 * @param state - The drag state.
 *
 * @returns void
 */
export function handlePointercancel<T>(
  data: NodeEventData<T>,
  state: DragState<T> | SynthDragState<T> | BaseDragState<T>
) {
  if (!isSynthDragState(state)) return;

  pd(data.e);

  if (dropped) {
    dropped = false;

    return;
  }

  const config = parents.get(state.initialParent.el)?.config;

  if (config?.onDragend) {
    config.onDragend({
      parent: state.currentParent,
      values: parentValues(state.currentParent.el, state.currentParent.data),
      draggedNode: state.draggedNode,
      draggedNodes: state.draggedNodes,
      state,
    });
  }

  config?.handleEnd(state);
}

/**
 * Handle the drag end.
 *
 * @param state - The drag state.
 *
 * @returns void
 */
export function handleEnd<T>(state: DragState<T> | SynthDragState<T>) {
  if (state.draggedNode) state.draggedNode.el.draggable = true;

  // --- Capture necessary data BEFORE resetState might affect it ---
  const nodesToClean = state.draggedNodes.map((x) => x.el);
  const initialParentData = state.initialParent.data;
  const isSynth = isSynthDragState(state);
  const config = parents.get(state.initialParent.el)?.config;
  const dropZoneClass = isSynth
    ? config?.synthDropZoneClass
    : config?.dropZoneClass;
  const longPressClass = initialParentData?.config?.longPressClass;
  const placeholderClass = isSynth
    ? initialParentData?.config?.synthDragPlaceholderClass // Corrected potential typo: used initialParentData
    : initialParentData?.config?.dragPlaceholderClass;
  const originalZIndex = state.originalZIndex;
  // --- End data capture ---

  if (isSynthDragState(state)) {
    // Ensure cloned node removal happens reasonably quickly
    if (state.clonedDraggedNode) {
      // Check if it exists
      state.clonedDraggedNode.remove();
    }
    if (state.longPressTimeout) {
      // Check if timeout exists
      clearTimeout(state.longPressTimeout);
    }
  }

  // Ensure scrolling is properly cancelled (needs state, do before reset)
  cancelSynthScroll(state);

  // Clear any lingering scroll directions and timeouts (needs state, do before reset)
  state.lastScrollDirectionX = undefined;
  state.lastScrollDirectionY = undefined;
  state.preventEnter = false;
  if (state.scrollDebounceTimeout) {
    clearTimeout(state.scrollDebounceTimeout);
    state.scrollDebounceTimeout = undefined; // Ensure it's marked as cleared
  }

  // Apply z-index change synchronously if needed
  if (originalZIndex !== undefined && state.draggedNode) {
    state.draggedNode.el.style.zIndex = originalZIndex;
  }

  // Use single rAF with captured data for class removal
  requestAnimationFrame(() => {
    // Use the captured data, not the potentially reset global state
    removeClass(nodesToClean, dropZoneClass);
    removeClass(nodesToClean, longPressClass);
    removeClass(nodesToClean, placeholderClass);
  });

  // Deselect and reset active state (needs state, do before reset)
  deselect(state.draggedNodes, state.currentParent, state);
  setActive(state.currentParent, undefined, state);

  // Prepare data for callback/event *before* resetState
  const finalStateForCallback = { ...state }; // Shallow copy for safety

  // Call onDragend callback *before* resetState
  config?.onDragend?.({
    parent: finalStateForCallback.currentParent,
    values: parentValues(
      finalStateForCallback.currentParent.el,
      finalStateForCallback.currentParent.data
    ),
    draggedNode: finalStateForCallback.draggedNode,
    draggedNodes: finalStateForCallback.draggedNodes,
    state: finalStateForCallback,
  });

  // Emit event *before* resetState
  state.emit("dragEnded", finalStateForCallback); // Emit with the final state representation

  // Reset global state LAST
  resetState();

  // No need to set state.selectedState = undefined; resetState handles it.
}

/**
 * Handle the node pointer up.
 *
 * @param data - The node pointer event data.
 * @param state - The drag state.
 *
 * @returns void
 */
export function handleNodePointerup<T>(
  data: NodePointerEventData<T>,
  state: DragState<T> | SynthDragState<T> | BaseDragState<T>
) {
  sp(data.e);

  if (!state.pointerSelection && state.selectedState)
    deselect(state.selectedState.nodes, data.targetData.parent, state);

  const config = data.targetData.parent.data.config;

  state.pointerSelection = false;

  if ("longPressTimeout" in state && state.longPressTimeout)
    clearTimeout(state.longPressTimeout);

  state.longPress = false;

  removeClass(
    data.targetData.parent.data.enabledNodes.map((x) => x.el),
    config.longPressClass
  );

  if (!isDragState(state)) return;

  config.handleEnd(state as DragState<T> | SynthDragState<T>);
}

/**
 * Initialize the synth drag.
 *
 * @param node - The node.
 * @param parent - The parent.
 * @param e - The pointer event.
 * @param _state - The drag state.
 * @param draggedNodes - The dragged nodes.
 * @param rect - The bounding rect of the original element
 *
 * @returns The synth drag state.
 */
function initSynthDrag<T>(
  node: NodeRecord<T>,
  parent: ParentRecord<T>,
  e: PointerEvent,
  _state: BaseDragState<T>,
  draggedNodes: Array<NodeRecord<T>>,
  rect: DOMRect
): SynthDragState<T> {
  const config = parent.data.config;

  let dragImage: HTMLElement;

  let result:
    | { dragImage: HTMLElement; offsetX?: number; offsetY?: number }
    | undefined;

  const criticalStyleProps = [
    "display",
    "flexDirection",
    "alignItems",
    "justifyContent",
    "padding",
    "paddingTop",
    "margin",
    "marginTop",
    "marginBottom",
    "marginLeft",
    "marginRight",
    "paddingBottom",
    "paddingLeft",
    "paddingRight",
    "border",
    "borderRadius",
    "background",
    "backgroundColor",
    "boxShadow",
    "font",
    "color",
    "lineHeight",
    "gap",
    "width",
    "height",
    "boxSizing",
    "overflow",
  ] as const;

  const copyCriticalStyles = (src: HTMLElement, dest: HTMLElement) => {
    const computed = window.getComputedStyle(src);
    criticalStyleProps.forEach((prop) => {
      dest.style[prop] = computed[prop]!;
    });
  };

  // Helper to style the drag image
  const applyBaseStyles = (
    el: HTMLElement,
    extraStyles: Partial<CSSStyleDeclaration> = {}
  ) => {
    Object.assign(el.style, {
      position: "absolute",
      zIndex: "9999",
      pointerEvents: "none",
      willChange: "transform",
      boxSizing: "border-box",
      opacity: "0",
      overflow: "hidden",
      width: `${rect.width}px`,
      height: `${rect.height}px`,
      ...extraStyles,
    });
  };

  // Custom drag image
  if (config.synthDragImage) {
    result = config.synthDragImage(node, parent, e, draggedNodes);
    dragImage = result.dragImage;
    dragImage.setAttribute("popover", "manual");
    applyBaseStyles(dragImage);
  }

  // Single drag
  else if (!config.multiDrag || draggedNodes.length === 1) {
    dragImage = node.el.cloneNode(true) as HTMLElement;
    copyCriticalStyles(node.el as HTMLElement, dragImage);
    dragImage.setAttribute("popover", "manual");
    applyBaseStyles(dragImage);
  }

  // Multi-drag
  else {
    const wrapper = document.createElement("div");

    wrapper.setAttribute("popover", "manual");

    draggedNodes.forEach((dragged) => {
      const clone = dragged.el.cloneNode(true) as HTMLElement;

      copyCriticalStyles(dragged.el as HTMLElement, clone);

      clone.style.pointerEvents = "none";

      clone.style.margin = "0";

      wrapper.append(clone);
    });

    wrapper.style.display = "flex";
    wrapper.style.flexDirection = "column";
    wrapper.style.padding = "0";
    wrapper.style.margin = "0";
    wrapper.style.position = "absolute";
    wrapper.style.zIndex = "9999";
    wrapper.style.pointerEvents = "none";

    dragImage = wrapper;
  }

  dragImage.id = "dnd-dragged-node-clone";

  parent.el.appendChild(dragImage);

  dragImage.showPopover();

  const synthDragStateProps = {
    clonedDraggedEls: [],
    clonedDraggedNode: dragImage,
    synthDragScrolling: false,
    synthDragging: true,
    rootScrollWidth: document.scrollingElement?.scrollWidth,
    rootScrollHeight: document.scrollingElement?.scrollHeight,
  };

  const synthDragState = setDragState({
    ...dragStateProps(
      node,
      parent,
      e,
      draggedNodes,
      result?.offsetX,
      result?.offsetY
    ),
    ...synthDragStateProps,
  }) as SynthDragState<T>;

  return synthDragState;
}

/**
 * Handle the long press.
 *
 * @param data - The node pointer event data.
 * @param state - The drag state.
 * @param node - The node.
 *
 * @returns void
 */
export function handleLongPress<T>(
  data: NodePointerEventData<T>,
  state: BaseDragState<T>,
  node: NodeRecord<T>
) {
  const config = data.targetData.parent.data.config;

  state.longPressTimeout = setTimeout(() => {
    if (!state) return;

    state.longPress = true;

    if (config.longPressClass && data.e.cancelable)
      addNodeClass([node.el], config.longPressClass);

    pd(data.e);
  }, config.longPressDuration || 1000);
}

function cancelSynthScroll<T>(
  state: DragState<T>,
  cancelX = true,
  cancelY = true
) {
  if (cancelX) {
    if (state.frameIdX !== undefined) {
      cancelAnimationFrame(state.frameIdX);
      state.frameIdX = undefined;
    }
    state.lastScrollDirectionX = undefined;
  }

  if (cancelY) {
    if (state.frameIdY !== undefined) {
      cancelAnimationFrame(state.frameIdY);
      state.frameIdY = undefined;
    }
    state.lastScrollDirectionY = undefined;
  }

  if (!state.frameIdX && !state.frameIdY) {
    state.preventEnter = false;
  }
}

function moveNode<T>(state: SynthDragState<T>, justStarted = false) {
  const { x, y } = state.coordinates;

  const startLeft = state.startLeft ?? 0;
  const startTop = state.startTop ?? 0;

  const currentScrollX = window.scrollX ?? 0;
  const currentScrollY = window.scrollY ?? 0;

  const translateX = x - startLeft + currentScrollX;
  const translateY = y - startTop + currentScrollY;

  state.clonedDraggedNode.style.transform = `translate3d(${translateX}px, ${translateY}px, 0px)`;

  if (justStarted) {
    state.clonedDraggedNode.style.opacity = "1";

    removeClass(
      state.draggedNodes.map((x) => x.el),
      state.initialParent.data.config?.longPressClass
    );
  }
}

export function synthMove<T>(
  e: PointerEvent,
  state: SynthDragState<T>,
  justStarted = false
) {
  const coordinates = eventCoordinates(e);
  state.coordinates.x = coordinates.x;
  state.coordinates.y = coordinates.y;

  moveNode(state, justStarted); // Pass only state now

  // Clear any existing timeout to avoid multiple concurrent timeouts
  if (state.scrollDebounceTimeout) {
    clearTimeout(state.scrollDebounceTimeout);
    state.scrollDebounceTimeout = undefined;
  }

  // Only set a new timeout if we're still in a valid drag state
  state.scrollDebounceTimeout = setTimeout(() => {
    // Only process if the drag state is still active
    if (isSynthDragState(state)) {
      handleSynthScroll(state.coordinates, e, state);
    }
  }, 16); // ~1 frame (60fps)

  const elFromPoint = getElFromPoint(coordinates);

  if (!elFromPoint) {
    document.dispatchEvent(
      new CustomEvent("handleRootPointerover", {
        detail: {
          e,
          state,
        },
      })
    );

    return;
  }

  const pointerMoveEventData = {
    e,
    targetData: elFromPoint,
    state,
  };

  if ("node" in elFromPoint) {
    elFromPoint.node.el.dispatchEvent(
      new CustomEvent("handleNodePointerover", {
        detail: pointerMoveEventData,
      })
    );
  } else {
    elFromPoint.parent.el.dispatchEvent(
      new CustomEvent("handleParentPointerover", {
        detail: pointerMoveEventData,
      })
    );
  }
}

/**
 * Handle the node drag over.
 *
 * @param data - The node drag event data.
 * @param state - The drag state.
 *
 * @returns void
 */
export function handleNodeDragover<T>(
  data: NodeDragEventData<T>,
  state: DragState<T>
) {
  const config = data.targetData.parent.data.config;

  if (!config.nativeDrag) return;

  const { x, y } = eventCoordinates(data.e);

  state.coordinates.y = y;

  state.coordinates.x = x;

  pd(data.e);

  sp(data.e);

  if (isDragState(state)) {
    handleSynthScroll({ x, y }, data.e, state);
  }

  data.targetData.parent.el === state.currentParent?.el
    ? sort(data, state)
    : transfer(data, state);
}

/**
 * Handle the parent drag over.
 *
 * @param data - The parent drag event data.
 * @param state - The drag state.
 *
 * @returns void
 */
export function handleParentDragover<T>(
  data: ParentDragEventData<T>,
  state: DragState<T>
) {
  const config = data.targetData.parent.data.config;

  if (!config.nativeDrag) return;

  pd(data.e);

  sp(data.e);

  const { x, y } = eventCoordinates(data.e);

  if (isDragState(state)) {
    handleSynthScroll({ x, y }, data.e, state);
  }

  transfer(data, state);
}

/**
 * Handle the parent pointer over.
 *
 * @param e - The parent pointer over event.
 *
 * @returns void
 */
export function handleParentPointerover<T>(e: PointeroverParentEvent<T>) {
  if (e.detail.targetData.parent.el !== e.detail.state.currentParent.el)
    transfer(e.detail, e.detail.state);
}

/**
 * Validate the transfer.
 *
 * @param data - The transfer data.
 *
 * @returns Whether the transfer is valid.
 */
export function validateTransfer<T>({
  currentParent,
  targetParent,
  initialParent,
  draggedNodes,
  state,
}: {
  currentParent: ParentRecord<T>;
  targetParent: ParentRecord<T>;
  initialParent: ParentRecord<T>;
  draggedNodes: Array<NodeRecord<T>>;
  state: BaseDragState<T>;
}) {
  if (targetParent.el === currentParent.el) return false;

  const targetConfig = targetParent.data.config;

  if (draggedNodes[0].el.contains(targetParent.el)) return false;

  if (targetConfig.dropZone === false) return false;

  const initialParentConfig = initialParent.data.config;

  if (targetConfig.accepts) {
    return targetConfig.accepts(
      targetParent,
      initialParent,
      currentParent,
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

/**
 * Handle the node drag enter.
 *
 * @param data - The node drag event data.
 * @param _state - The drag state.
 *
 * @returns void
 */
function handleNodeDragenter<T>(
  data: NodeDragEventData<T>,
  _state: DragState<T>
) {
  pd(data.e);
}

/**
 * Handle the node drag leave.
 *
 * @param data - The node drag event data.
 * @param _state - The drag state.
 *
 * @returns void
 */
function handleNodeDragleave<T>(
  data: NodeDragEventData<T>,
  _state: DragState<T>
) {
  pd(data.e);
}

/**
 * Validate the sort.
 *
 * @param data - The node drag event data or node pointer event data.
 * @param state - The drag state.
 * @param x - The x coordinate.
 * @param y - The y coordinate.
 *
 * @returns Whether the sort is valid.
 */
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
      data.targetData.node.data.value === state.currentTargetValue ||
      state.draggedNodes.map((x) => x.el).includes(data.targetData.node.el)
    ) {
      state.currentTargetValue = data.targetData.node.data.value;
    }

    return false;
  }

  if (state.preventEnter) return false;

  if (state.draggedNodes.map((x) => x.el).includes(data.targetData.node.el)) {
    state.currentTargetValue = undefined;

    return false;
  }

  if (data.targetData.node.data.value === state.currentTargetValue)
    return false;

  if (
    data.targetData.parent.el !== state.currentParent?.el ||
    data.targetData.parent.data.config.sortable === false
  )
    return false;

  if (data.targetData.node.el.contains(state.draggedNodes[0].el)) return false;

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

  const threshold = state.currentParent.data.config.threshold;

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

/**
 * Sort the nodes.
 *
 * @param data - The node drag event data or node pointer event data.
 * @param state - The drag state.
 *
 * @returns void
 */
export function sort<T>(
  data: NodeDragEventData<T> | NodePointerEventData<T>,
  state: DragState<T>
) {
  const { x, y } = eventCoordinates(data.e);

  if (!validateSort(data, state, x, y)) {
    return;
  }

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

  data.targetData.parent.data.config.performSort({
    parent: data.targetData.parent,
    draggedNodes: state.draggedNodes,
    targetNodes: [data.targetData.node],
  });
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
        data: parentData,
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
 * Transfer the nodes.
 *
 * @param data - The node event data or parent event data.
 * @param state - The drag state.
 *
 * @returns void
 */
export function transfer<T>(
  data: NodeEventData<T> | ParentEventData<T>,
  state: DragState<T>
): void {
  pd(data.e);

  if (
    !validateTransfer({
      currentParent: state.currentParent,
      targetParent: data.targetData.parent as any,
      initialParent: state.initialParent,
      draggedNodes: state.draggedNodes,
      state,
    })
  )
    return;

  data.targetData.parent.data.config.performTransfer({
    currentParent: state.currentParent,
    targetParent: data.targetData.parent,
    initialParent: state.initialParent,
    draggedNodes: state.draggedNodes,
    initialIndex: state.initialIndex,
    state,
    targetNodes: "node" in data.targetData ? [data.targetData.node] : [],
  });

  state.currentParent = data.targetData.parent;

  state.transferred = true;
}

/**
 * Event listener used for all parents.
 *
 * @param callback - The callback.
 *
 * @returns A function to get the parent event data.
 */
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
 * Add class to the node.
 *
 * @param els - The nodes.
 * @param className - The class name.
 * @param omitAppendPrivateClass - Whether to omit append private class.
 *
 * @returns void
 */
export function addNodeClass<T>(
  els: Array<Node | HTMLElement | Element>,
  className: string | undefined,
  omitAppendPrivateClass = false
) {
  function nodeSetter<T>(node: Node, nodeData: NodeData<T>) {
    nodes.set(node, nodeData);
  }

  for (const el of els) {
    const nodeData = nodes.get(el as Node);

    const newData = addClass(el, className, nodeData, omitAppendPrivateClass);

    if (!newData) continue;

    nodeSetter(el as Node, newData as NodeData<T>);
  }
}

/**
 * Add class to the parent.
 *
 * @param els - The parents.
 * @param className - The class name.
 * @param omitAppendPrivateClass - Whether to omit append private class.
 *
 * @returns void
 */
export function addParentClass<T>(
  els: Array<HTMLElement>,
  className: string | undefined,
  omitAppendPrivateClass = false
) {
  function parentSetter<T>(parent: HTMLElement, parentData: ParentData<T>) {
    parents.set(parent, parentData);
  }

  for (const el of els) {
    const parentData = parents.get(el);

    const newData = addClass(el, className, parentData, omitAppendPrivateClass);

    if (!newData) continue;

    parentSetter(el, newData as ParentData<T>);
  }
}

/**
 * Add class to the node.
 *
 * @param el - The node.
 * @param className - The class name.
 * @param data - The node data.
 * @param omitAppendPrivateClass - Whether to omit append private class.
 *
 * @returns void
 */
export function addClass(
  el: Node | HTMLElement | Element,
  className: string | undefined,
  data: NodeData<any> | ParentData<any> | undefined,
  omitAppendPrivateClass = false
) {
  if (!className) return;

  const classNames = splitClass(className);

  if (!classNames.length) return;

  if (!data) {
    el.classList.add(...classNames);
    return;
  }
  // Revert to original logic: Initialize privateClasses as empty for this call.
  const privateClasses = [];

  for (const currentClassName of classNames) {
    if (!el.classList.contains(currentClassName)) {
      el.classList.add(currentClassName);
    } else if (
      // Only add to privateClasses if the element already had the class
      // AND omitAppendPrivateClass is specifically false for THIS call.
      el.classList.contains(currentClassName) &&
      omitAppendPrivateClass === false
    ) {
      privateClasses.push(currentClassName);
    }
  }
  // Assign the newly computed privateClasses, overwriting any previous value.
  data.privateClasses = privateClasses;
  return data;
}

/**
 * Remove class from the nodes.
 *
 * @param els - The nodes.
 * @param className - The class name.
 *
 * @returns void
 */
export function removeClass(
  els: Array<Node | HTMLElement | Element>,
  className: string | undefined
) {
  if (!className) return;

  const classNames = splitClass(className);

  if (!classNames.length) return;

  for (const node of els) {
    if (!isNode(node)) {
      node.classList.remove(...classNames);
      continue;
    }

    const nodeData = nodes.get(node) || parents.get(node);

    if (!nodeData) continue;

    for (const className of classNames) {
      if (!nodeData.privateClasses.includes(className)) {
        node.classList.remove(className);
      }
    }
  }
}

type ScrollDirection<T> = { axis: "x"; state: DragState<T> } | { axis: "y" };

function getScrollDirection<T>(
  el: HTMLElement,
  e: PointerEvent | DragEvent,
  style: CSSStyleDeclaration,
  rect: DOMRect,
  opts: ScrollDirection<T>
): Record<string, boolean> {
  const threshold = 0.075;

  const isX = opts.axis === "x";
  const isRoot = el === document.scrollingElement;
  const scrollProp = isX ? "scrollLeft" : "scrollTop";
  const sizeProp = isX ? "clientWidth" : "clientHeight";
  const offsetProp = isX ? "offsetWidth" : "offsetHeight";
  const scrollSizeProp = isX ? "scrollWidth" : "scrollHeight";
  const clientCoord = isX ? e.clientX : e.clientY;
  const rectStart = isX ? rect.left : rect.top;
  const overflow = isX ? style.overflowX : style.overflowY;

  if (isRoot) {
    const scrollPos = el[scrollProp];
    const clientSize = el[sizeProp];
    const canScrollBefore = scrollPos > 0;
    const canScrollAfter =
      scrollPos + clientSize <
      (isX
        ? (opts.state as SynthDragState<T>).rootScrollWidth || 0
        : el[scrollSizeProp]);

    return isX
      ? {
          left: canScrollBefore && clientCoord < clientSize * threshold,
          right: canScrollAfter && clientCoord > clientSize * (1 - threshold),
        }
      : {
          up: canScrollBefore && clientCoord < clientSize * threshold,
          down: canScrollAfter && clientCoord > clientSize * (1 - threshold),
        };
  }

  if (
    (overflow === "auto" || overflow === "scroll") &&
    el !== document.body &&
    el !== document.documentElement
  ) {
    const scrollSize = el[scrollSizeProp];
    const offsetSize = el[offsetProp];
    const scrollPos = el[scrollProp];

    const canScrollBefore = scrollPos > 0;
    const canScrollAfter = scrollPos < scrollSize - offsetSize;

    return isX
      ? {
          left:
            canScrollBefore && clientCoord < rectStart + offsetSize * threshold,
          right:
            canScrollAfter &&
            clientCoord > rectStart + offsetSize * (1 - threshold),
        }
      : {
          up:
            canScrollBefore && clientCoord < rectStart + offsetSize * threshold,
          down:
            canScrollAfter &&
            clientCoord > rectStart + offsetSize * (1 - threshold),
        };
  }

  return isX ? { left: false, right: false } : { up: false, down: false };
}

type Axis = "x" | "y";

function scrollAxis<T>(
  el: HTMLElement,
  _e: PointerEvent | DragEvent,
  state: DragState<T>,
  options: {
    axis: Axis;
    direction: "positive" | "negative";
  }
) {
  // Check if this is a stale call from a previous state
  if (!isDragState(state) || !state.draggedNode) {
    return; // State has been reset or is no longer in a drag state
  }

  state.preventEnter = true;

  const isX = options.axis === "x";
  const dirFactor = options.direction === "positive" ? 1 : -1;
  const speed = 20;

  const key = isX ? "lastScrollDirectionX" : "lastScrollDirectionY";
  const idKey = isX ? "frameIdX" : "frameIdY";

  // Cancel any existing animation first, regardless of direction
  if (state[idKey] !== undefined) {
    cancelAnimationFrame(state[idKey]!);
    state[idKey] = undefined;
  }

  state[key] = options.direction;

  const scrollLoop = () => {
    // Check again if state is still valid
    if (!isDragState(state) || !state.draggedNode) {
      if (state[idKey] !== undefined) {
        cancelAnimationFrame(state[idKey]!);
        state[idKey] = undefined;
      }
      return;
    }

    const scrollProp = isX ? "scrollLeft" : "scrollTop";
    const sizeProp = isX ? "clientWidth" : "clientHeight";
    const scrollSizeProp = isX ? "scrollWidth" : "scrollHeight";

    const scrollPos = el[scrollProp];
    const clientSize = el[sizeProp];
    const scrollSize = el[scrollSizeProp];

    const canScroll =
      dirFactor > 0 ? scrollPos + clientSize < scrollSize : scrollPos > 0;

    if (!canScroll) {
      state[idKey] = undefined;
      state[key] = undefined;
      return;
    }

    el[scrollProp] += speed * dirFactor;

    if (isSynthDragState(state)) {
      moveNode(state);
    }

    state[idKey] = requestAnimationFrame(scrollLoop);
  };

  state[idKey] = requestAnimationFrame(scrollLoop);
}

function isPointerInside(el: HTMLElement, x: number, y: number): boolean {
  const rect = el.getBoundingClientRect();
  return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
}

function handleSynthScroll<T>(
  coordinates: { x: number; y: number },
  e: PointerEvent | DragEvent,
  state: DragState<T>
) {
  // First check if this is a stale call from a previous state
  if (!isDragState(state) || !state.draggedNode) {
    return; // State has been reset or is no longer in a drag state
  }

  cancelSynthScroll(state);

  const { x, y } = coordinates;

  let scrolled = false;

  const attemptScroll = (
    axis: "x" | "y",
    direction: "positive" | "negative",
    container: HTMLElement
  ) => {
    scrollAxis(container, e, state, { axis, direction });
    scrolled = true;
  };

  const checkAndScroll = (el: HTMLElement) => {
    const style = window.getComputedStyle(el);
    const rect = el.getBoundingClientRect();

    const xResult = getScrollDirection(el, e, style, rect, {
      axis: "x",
      state,
    });

    const yResult = getScrollDirection(el, e, style, rect, { axis: "y" });

    if (xResult.left || xResult.right) {
      state.lastScrollContainerX = el;
      attemptScroll("x", xResult.right ? "positive" : "negative", el);
    }

    if (yResult.up || yResult.down) {
      state.lastScrollContainerY = el;
      attemptScroll("y", yResult.down ? "positive" : "negative", el);
    }
  };

  if (
    state.lastScrollContainerX &&
    isPointerInside(state.lastScrollContainerX, x, y)
  ) {
    checkAndScroll(state.lastScrollContainerX);
  }

  if (
    !scrolled &&
    state.lastScrollContainerY &&
    isPointerInside(state.lastScrollContainerY, x, y)
  ) {
    checkAndScroll(state.lastScrollContainerY);
  }

  if (!scrolled) {
    let el = document.elementFromPoint(x, y);
    while (
      el &&
      !(scrolled && state.lastScrollContainerX && state.lastScrollContainerY)
    ) {
      if (el instanceof HTMLElement) {
        checkAndScroll(el);
      }
      el = el.parentElement;
    }
  }

  if (!scrolled) {
    const root = document.scrollingElement;
    if (root instanceof HTMLElement) {
      checkAndScroll(root);
    }
  }

  if (!scrolled) cancelSynthScroll(state);
}

export function getElFromPoint<T>(coordinates: {
  x: number;
  y: number;
}): NodeFromPoint<T> | ParentFromPoint<T> | undefined {
  let target = document.elementFromPoint(coordinates.x, coordinates.y);

  if (!isNode(target)) return;

  let isParent;

  let invalidEl = true;

  while (target && invalidEl) {
    if (nodes.has(target as Node) || parents.has(target as HTMLElement)) {
      invalidEl = false;

      isParent = parents.has(target as HTMLElement);

      break;
    }

    target = target.parentNode as Node;
  }

  if (!isParent) {
    const targetNodeData = nodes.get(target as Node);

    if (!targetNodeData) return;

    const targetParentData = parents.get(target.parentNode as Node);

    if (!targetParentData) return;

    return {
      node: {
        el: target as Node,
        data: targetNodeData,
      },
      parent: {
        el: target.parentNode as Node,
        data: targetParentData as ParentData<T>,
      },
    };
  } else {
    const parentData = parents.get(target as HTMLElement);

    if (!parentData) return;

    return {
      parent: {
        el: target as HTMLElement,
        data: parentData as ParentData<T>,
      },
    };
  }
}

/**
 * Checks to see that a given element and its parent node is instance of
 * HTMLElement.
 *
 * @param {unknown} el - The element to check.
 *
 * @returns {boolean} - Whether or not provided element is of type Node.
 */
export function isNode(el: unknown): el is Node {
  return el instanceof HTMLElement && el.parentNode instanceof HTMLElement;
}

/**
 * Takes a given el and event handlers, assigns them, and returns the used abort
 * controller.
 *
 * @param el - The element to add the event listeners to.
 * @param events - The events to add to the element.
 * @returns - The abort controller used for the event listeners.
 */
export function addEvents(
  el: Document | ShadowRoot | Node | HTMLElement | Window,
  events: EventHandlers | any
): AbortController {
  const abortController = new AbortController();

  for (const eventName in events) {
    const handler = events[eventName];

    el.addEventListener(eventName, handler, {
      signal: abortController.signal,
      passive: false,
      capture: eventName === "focus" || eventName === "blur",
    });
  }

  return abortController;
}
