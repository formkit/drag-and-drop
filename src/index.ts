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
  ParentKeydownEventData,
  SynthDragStateProps,
  ParentRecord,
  EventHandlers,
  NodeFromPoint,
  ParentFromPoint,
  Coordinates,
} from "./types";

export * from "./types";
export { animations } from "./plugins/animations";
export { insert } from "./plugins/insert";
export { dropOrSwap } from "./plugins/drop-or-swap";

/**
 * Check to see if code is running in a browser.
 *
 * @internal
 */
export const isBrowser = typeof window !== "undefined";

export const touchDevice = window && "ontouchstart" in window;

let dropped = false;

/**
 * Abort controller for the document.
 */
let documentController: AbortController | undefined;

let isNative = false;

let animationFrameId: number | null = null;

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

export function createEmitter() {
  const callbacks = new Map<string, CallableFunction[]>();

  const emit = function (eventName: string, data: any) {
    if (!callbacks.get(eventName)) return;
    callbacks.get(eventName)!.forEach((cb) => {
      cb(data);
    });
  };

  const on = function (eventName: string, callback: any) {
    const cbs = callbacks.get(eventName) ?? [];

    cbs.push(callback);

    callbacks.set(eventName, cbs);
  };

  return [emit, on];
}

export const [emit, on] = createEmitter();

const baseDragState = {
  activeDescendant: undefined,
  affectedNodes: [],
  currentTargetValue: undefined,
  on,
  emit,
  newActiveDescendant: undefined,
  originalZIndex: undefined,
  pointerSelection: false,
  preventEnter: false,
  remapJustFinished: false,
  selectednodes: [],
  selectedParent: undefined,
};

/**
 * The state of the drag and drop.
 */
export let state: BaseDragState<unknown> = baseDragState;

export function resetState() {
  const baseDragState = {
    activeDescendant: undefined,
    affectedNodes: [],
    on,
    emit,
    currentTargetValue: undefined,
    originalZIndex: undefined,
    pointerId: undefined,
    preventEnter: false,
    remapJustFinished: false,
    selectednodes: [],
    selectedParent: undefined,
    pointerSelection: false,
    synthScrollDirection: undefined,
    draggedNodeDisplay: undefined,
    synthDragScrolling: false,
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
  dragStateProps:
    | (SynthDragStateProps & DragStateProps<T>)
    | DragStateProps<T>
    | undefined
): DragState<T> | SynthDragState<T> {
  Object.assign(state, dragStateProps);

  dropped = false;

  state.emit("dragStarted", state);

  return state as DragState<T> | SynthDragState<T>;
}

/**
 *
 */
function handlePointerdownRoot(_e: PointerEvent) {
  if (state.activeState) setActive(state.activeState.parent, undefined, state);

  if (state.selectedState)
    deselect(state.selectedState.nodes, state.selectedState.parent, state);

  state.selectedState = state.activeState = undefined;
}

function handlePointerupRoot(_e: PointerEvent) {
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
  //e.preventDefault();
}

/**
 * If we are currently dragging, then let's prevent default on dragover to avoid
 * the default behavior of the browser on drop.
 */
function handleRootDragover(e: DragEvent) {
  if (!isDragState(state)) return;

  e.preventDefault();
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

  if (!documentController)
    documentController = addEvents(document, {
      dragover: handleRootDragover,
      pointerdown: handlePointerdownRoot,
      pointerup: handlePointerupRoot,
      keydown: handleRootKeydown,
      drop: handleRootDrop,
    });

  tearDown(parent);

  const parentData: ParentData<T> = {
    getValues,
    setValues,
    config: {
      dragDropEffect: config.dragDropEffect ?? "move",
      dragEffectAllowed: config.dragEffectAllowed ?? "move",
      draggedNodes,
      dragstartClasses,
      deepCopyStyles: config.deepCopyStyles ?? false,
      handleNodeKeydown,
      handleParentKeydown,
      handleDragstart,
      handleNodeDragover,
      handleParentDragover,
      handleNodeDrop,
      handlePointercancel,
      handleEnd,
      handleDragend,
      handleParentBlur,
      handleParentFocus,
      handleNodePointerup,
      handleNodeTouchstart,
      handleNodePointerover,
      handleParentPointerover,
      handleNodePointerdown,
      handleNodePointermove,
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
      scrollBehavior: {
        x: 0.95,
        y: 0.95,
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
  draggedNodes: Array<NodeRecord<T>>,
  nativeDrag = true
): DragStateProps<T> {
  const { x, y } = eventCoordinates(data.e);

  const rect = data.targetData.node.el.getBoundingClientRect();

  const scrollEls: Array<[HTMLElement, AbortController]> = [];

  for (const scrollable of getScrollables()) {
    scrollEls.push([
      scrollable,
      nativeDrag
        ? addEvents(scrollable, {
            scroll: preventSortOnScroll(),
          })
        : addEvents(scrollable, {
            pointermove: handleScroll,
          }),
    ]);
  }

  return {
    affectedNodes: [],
    ascendingDirection: false,
    clonedDraggedEls: [],
    dynamicValues: [],
    coordinates: {
      x,
      y,
    },
    draggedNode: {
      el: data.targetData.node.el,
      data: data.targetData.node.data,
    },
    draggedNodes,
    incomingDirection: undefined,
    initialIndex: data.targetData.node.data.index,
    initialParent: {
      el: data.targetData.parent.el,
      data: data.targetData.parent.data,
    },
    currentParent: {
      el: data.targetData.parent.el,
      data: data.targetData.parent.data,
    },
    longPress: data.targetData.parent.data.config.longPress ?? false,
    longPressTimeout: 0,
    currentTargetValue: data.targetData.node.data.value,
    scrollEls,
    startLeft: x - rect.left,
    startTop: y - rect.top,
    targetIndex: data.targetData.node.data.index,
    transferred: false,
  };
}

export function performSort<T>({
  parent,
  draggedNodes,
  targetNode,
}: {
  parent: ParentRecord<T>;
  draggedNodes: Array<NodeRecord<T>>;
  targetNode: NodeRecord<T>;
}) {
  return;
  const config = parent.data.config;

  const draggedValues = draggedNodes.map((x) => x.data.value);

  const targetParentValues = parentValues(parent.el, parent.data);

  const originalIndex = draggedNodes[0].data.index;

  const enabledNodes = [...parent.data.enabledNodes];

  const newParentValues = [
    ...targetParentValues.filter((x) => !draggedValues.includes(x)),
  ];

  newParentValues.splice(targetNode.data.index, 0, ...draggedValues);

  if ("draggedNode" in state) state.currentTargetValue = targetNode.data.value;

  //console.log(
  //  "new parent values for sort",
  //  newParentValues.map((x) => x.name)
  //);

  console.log(
    "final values",
    newParentValues.map((x) => x.name)
  );
  setParentValues(parent.el, parent.data, [...newParentValues]);

  //  if (parent.data.config.onSort)
  //    parent.data.config.onSort({
  //      parent: {
  //        el: parent.el,
  //        data: parent.data,
  //      },
  //      previousValues: [...targetParentValues],
  //      previousNodes: [...enabledNodes],
  //      nodes: [...parent.data.enabledNodes],
  //      values: [...newParentValues],
  //      draggedNode: draggedNodes[0],
  //      previousPosition: originalIndex,
  //      position: targetNode.data.index,
  //    });
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
  const activeDescendantClass = parent.data.config.activeDescendantClass;

  if (state.activeState) {
    {
      removeClass([state.activeState.node.el], activeDescendantClass);

      if (state.activeState.parent.el !== parent.el)
        state.activeState.parent.el.setAttribute("aria-activedescendant", "");
    }
  }

  if (!newActiveNode) {
    state.activeState?.parent.el.setAttribute("aria-activedescendant", "");

    state.activeState = undefined;

    return;
  }

  state.activeState = {
    node: newActiveNode,
    parent,
  };

  addNodeClass([newActiveNode.el], activeDescendantClass);

  state.activeState.parent.el.setAttribute(
    "aria-activedescendant",
    state.activeState.node.el.id
  );
}

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

  clearLiveRegion(parent);
}

/**
 * This function sets the selected nodes. This will clean the prior selected state
 * as well as removing any classes or attributes set.
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

  const selectedItems = selectedNodes.map((x) =>
    x.el.getAttribute("aria-label")
  );

  if (selectedItems.length === 0) {
    state.selectedState = undefined;

    clearLiveRegion(parent);

    return;
  }

  setActive(parent, newActiveNode, state);

  updateLiveRegion(
    parent,
    `${selectedItems.join(
      ", "
    )} ready for dragging. Use arrow keys to navigate. Press enter to drop ${selectedItems.join(
      ", "
    )}.`
  );
}

function updateLiveRegion<T>(parent: ParentRecord<T>, message: string) {
  const parentId = parent.el.id;

  const liveRegion = document.getElementById(parentId + "-live-region");

  if (!liveRegion) return;

  liveRegion.textContent = message;
}

function clearLiveRegion<T>(parent: ParentRecord<T>) {
  const liveRegion = document.getElementById(parent.el.id + "-live-region");

  if (!liveRegion) return;

  liveRegion.textContent = "";
}

export function handleParentBlur<T>(
  _data: ParentEventData<T>,
  _state: BaseDragState<T> | DragState<T> | SynthDragState<T>
) {}

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

export function performTransfer<T>({
  currentParent,
  targetParent,
  initialParent,
  draggedNodes,
  initialIndex,
  targetNode,
  state,
}: {
  currentParent: ParentRecord<T>;
  targetParent: ParentRecord<T>;
  initialParent: ParentRecord<T>;
  draggedNodes: Array<NodeRecord<T>>;
  initialIndex: number;
  state: BaseDragState<T> | DragState<T> | SynthDragState<T>;
  targetNode?: NodeRecord<T>;
}) {
  console.trace();
  console.log("perform transfer");

  console.log("current parent", currentParent.data);
  console.log("target parent", targetParent.el);

  const draggedValues = draggedNodes.map((x) => x.data.value);

  const currentParentValues = parentValues(
    currentParent.el,
    currentParent.data
  ).filter((x: any) => !draggedValues.includes(x));

  console.log(
    "current parent values 2",
    currentParentValues.map((x) => x.name)
  );

  const targetParentValues = parentValues(targetParent.el, targetParent.data);

  console.log(
    "target parent values 2",
    targetParentValues.map((x) => x.name)
  );

  console.log(
    "dragged values",
    draggedValues.map((x) => x)
  );

  const reset =
    initialParent.el === targetParent.el &&
    targetParent.data.config.sortable === false;

  let targetIndex: number;

  if (targetNode) {
    if (reset) {
      targetIndex = initialIndex;
    } else if (targetParent.data.config.sortable === false) {
      targetIndex = targetParent.data.enabledNodes.length;
    } else {
      targetIndex = targetNode.data.index;
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
    });
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

  console.log("parent", parent);

  if (treeGroup) {
    const ancestorEl = treeAncestors[treeGroup];

    const ancestorData = parents.get(ancestorEl);

    if (!ancestorData) return;

    const ancestorValues = ancestorData.getValues(ancestorEl);

    console.log("ancestor values", ancestorValues);

    console.log("ancestor el", ancestorEl);

    const initialParentValues = parentData.getValues(parent);

    console.log("initial parent values", initialParentValues);

    const updatedValues = setValueAtCoordinatesUsingFindIndex(
      ancestorValues,
      initialParentValues,
      values
    );

    console.log(
      "UPDATED VALUES",
      updatedValues.map((x) => x.name)
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

export function handleParentDrop<T>(
  data: ParentEventData<T>,
  state: DragState<T>
) {
  dropped = true;

  const config = data.targetData.parent.data.config;

  config.handleEnd(state);
}

export function tearDown(parent: HTMLElement) {
  const parentData = parents.get(parent);

  if (!parentData) return;

  if (parentData.abortControllers.mainParent)
    parentData.abortControllers.mainParent.abort();
}

export function isDragState<T>(
  state: BaseDragState<T>
): state is DragState<T> | SynthDragState<T> {
  return "draggedNode" in state && !!state.draggedNode;
}

export function isSynthDragState<T>(
  state: BaseDragState<T>
): state is SynthDragState<T> {
  return "pointerId" in state && !!state.pointerId;
}

function setup<T>(parent: HTMLElement, parentData: ParentData<T>): void {
  parentData.abortControllers.mainParent = addEvents(parent, {
    keydown: parentEventData(parentData.config.handleParentKeydown),
    dragover: parentEventData(parentData.config.handleParentDragover),
    handleParentPointerover: parentData.config.handleParentPointerover,
    drop: parentEventData(parentData.config.handleParentDrop),
    hasNestedParent: (e: CustomEvent) => {
      const parent = parents.get(e.target as HTMLElement);

      if (!parent) return;

      parent.nestedParent = e.detail.parent;
    },
    blur: parentEventData(parentData.config.handleParentBlur),
    focus: parentEventData(parentData.config.handleParentFocus),
  });

  setAttrs(parent, {
    role: "listbox",
    tabindex: "0",
    "aria-multiselectable": parentData.config.multiDrag ? "true" : "false",
    "aria-activedescendant": "",
    "aria-describedby": parent.id + "-live-region",
  });

  const liveRegion = document.createElement("div");

  setAttrs(liveRegion, {
    "aria-live": "polite",
    "aria-atomic": "true",
    "data-drag-and-drop-live-region": "true",
    id: parent.id.toString() + "-live-region",
  });

  Object.assign(liveRegion.style, {
    position: "absolute",
    width: "1px",
    height: "1px",
    padding: "0",
    overflow: "hidden",
    clip: "rect(0, 0, 0, 0)",
    whiteSpace: "nowrap",
    border: "0",
  });

  document.body.appendChild(liveRegion);
}

export function setAttrs(el: HTMLElement, attrs: Record<string, string>) {
  for (const key in attrs) el.setAttribute(key, attrs[key]);
}

export function setupNode<T>(data: SetupNodeData<T>) {
  const config = data.parent.data.config;

  data.node.el.draggable = true;

  data.node.data.abortControllers.mainNode = addEvents(data.node.el, {
    keydown: nodeEventData(config.handleNodeKeydown),
    dragstart: nodeEventData(config.handleDragstart),
    dragover: nodeEventData(config.handleNodeDragover),
    dragenter: nodeEventData(config.handleNodeDragenter),
    dragleave: nodeEventData(config.handleNodeDragleave),
    dragend: nodeEventData(config.handleDragend),
    drop: nodeEventData(config.handleNodeDrop),
    touchstart: nodeEventData(config.handleNodeTouchstart),
    pointercancel: nodeEventData(config.handlePointercancel),
    pointerdown: nodeEventData(config.handleNodePointerdown),
    pointerup: nodeEventData(config.handleNodePointerup),
    pointermove: nodeEventData(config.handleNodePointermove),
    handleNodePointerover: config.handleNodePointerover,
    mousedown: () => {
      if (!config.nativeDrag) isNative = false;
      else isNative = true;
    },
  });

  data.node.el.setAttribute("role", "option");

  data.node.el.setAttribute("aria-selected", "false");

  config.reapplyDragClasses(data.node.el, data.parent.data);

  data.parent.data.config.plugins?.forEach((plugin: DNDPlugin) => {
    plugin(data.parent.el)?.setupNode?.(data);
  });
}

export function setupNodeRemap<T>(data: SetupNodeData<T>) {
  nodes.set(data.node.el, data.node.data);

  data.parent.data.config.plugins?.forEach((plugin: DNDPlugin) => {
    plugin(data.parent.el)?.setupNodeRemap?.(data);
  });
}

function reapplyDragClasses<T>(node: Node, parentData: ParentData<T>) {
  if (!isDragState(state)) return;

  const dropZoneClass = isSynthDragState(state)
    ? parentData.config.synthDropZoneClass
    : parentData.config.dropZoneClass;

  if (state.draggedNode.el !== node) return;

  addNodeClass([node], dropZoneClass, true);
}

export function tearDownNodeRemap<T>(data: TearDownNodeData<T>) {
  data.parent.data.config.plugins?.forEach((plugin: DNDPlugin) => {
    plugin(data.parent.el)?.tearDownNodeRemap?.(data);
  });
}

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
  const parentEl = mutationList[0].target;

  if (!(parentEl instanceof HTMLElement)) return;

  const allSelectedAndActiveNodes = document.querySelectorAll(
    `[aria-selected="true"]`
  );

  const parentData = parents.get(parentEl);

  if (!parentData) return;

  for (let x = 0; x < allSelectedAndActiveNodes.length; x++) {
    const node = allSelectedAndActiveNodes[x];

    node.setAttribute("aria-selected", "false");

    removeClass([node], parentData.config.selectedClass);
  }

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

  if (enabledNodes.length === 0) {
    //console.log("parent", parent);
    //console.log("show me the values", parentData.getValues(parent));
  }

  if (
    enabledNodes.length !== parentData.getValues(parent).length &&
    !config.disabled
  ) {
    //console.log(
    //  "parentData.getValues(parent).length",
    //  parentData.getValues(parent).map((x) => x.name)
    //);
    //console.log(
    //  "enabledNodes.length",
    //  enabledNodes.map((x) => x.textContent)
    //);
    //console.log("parent.el", parent);
    console.warn(
      "The number of draggable items defined in the parent element does not match the number of values. This may cause unexpected behavior."
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
      !isDragState(state) &&
      state.newActiveDescendant &&
      state.newActiveDescendant.data.value === nodeData.value
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
      !isDragState(state) &&
      state.activeState &&
      state.activeState.node.data.value === nodeData.value
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

    if (isDragState(state) && nodeData.value === state.draggedNode.data.value) {
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

export function remapFinished() {
  state.remapJustFinished = true;

  if ("draggedNode" in state) state.affectedNodes = [];
}

export function validateDragstart(data: NodeEventData<any>): boolean {
  return !!data.targetData.parent.data.config.nativeDrag;
}

function draggedNodes<T>(data: NodeEventData<T>): Array<NodeRecord<T>> {
  if (!data.targetData.parent.data.config.multiDrag) {
    return [data.targetData.node];
  } else if (state.selectedState) {
    return [
      data.targetData.node,
      ...(state.selectedState?.nodes.filter(
        (x) => x.el !== data.targetData.node.el
      ) as Array<NodeRecord<T>>),
    ];
  }

  return [];
}

/**
 * Responsible for assigning dragstart classes to the dragged nodes.
 */
export function handleDragstart<T>(
  data: NodeDragEventData<T>,
  state: BaseDragState<T>
) {
  if (!validateDragstart(data) || !validateDragHandle(data)) {
    data.e.preventDefault();

    return;
  }

  const config = data.targetData.parent.data.config;

  const nodes = config.draggedNodes(data);

  config.dragstartClasses(data.targetData.node, nodes, config);

  const dragState = initDrag(data, nodes);

  if (config.onDragstart)
    config.onDragstart(
      {
        parent: data.targetData.parent,
        values: parentValues(
          data.targetData.parent.el,
          data.targetData.parent.data
        ),
        draggedNode: dragState.draggedNode,
        draggedNodes: dragState.draggedNodes,
        position: dragState.initialIndex,
      },
      state as DragState<T>
    );
}

export function handleNodePointerdown<T>(
  data: NodePointerEventData<T>,
  state: BaseDragState<T>
) {
  if (!validateDragHandle(data)) return;

  data.e.stopPropagation();

  synthNodePointerDown = true;

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
      } else if (parentData.config.multiDrag && (touchDevice || !isNative)) {
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
      config.activeDescendantClass
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
  const dragState = setDragState(dragStateProps(data, draggedNodes));

  data.e.stopPropagation();

  if (data.e.dataTransfer) {
    const config = data.targetData.parent.data.config;

    data.e.dataTransfer.dropEffect = config.dragDropEffect;

    data.e.dataTransfer.effectAllowed = config.dragEffectAllowed;

    let dragImage: HTMLElement | undefined;

    if (config.dragImage) {
      dragImage = config.dragImage(data, draggedNodes);
    } else {
      if (!config.multiDrag) {
        data.e.dataTransfer.setDragImage(
          data.targetData.node.el,
          data.e.offsetX,
          data.e.offsetY
        );

        return dragState;
      } else {
        const wrapper = document.createElement("div");

        for (const node of draggedNodes) {
          const clonedNode = node.el.cloneNode(true) as HTMLElement;

          clonedNode.style.pointerEvents = "none";

          clonedNode.id = node.el.id + "-clone";

          copyNodeStyle(node.el, clonedNode, true);

          wrapper.append(clonedNode);
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
        });

        dragImage = wrapper;
      }

      document.body.appendChild(dragImage);
    }

    data.e.dataTransfer.setDragImage(dragImage, data.e.offsetX, data.e.offsetY);

    setTimeout(() => {
      dragImage?.remove();
    });
  }

  return dragState;
}

export function validateDragHandle<T>(
  data: NodeDragEventData<T> | NodePointerEventData<T>
): boolean {
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

  for (const handle of Array.from(dragHandles))
    if (elFromPoint === handle || handle.contains(elFromPoint)) return true;

  return false;
}

export function handleClickNode<T>(_data: NodeEventData<T>) {}

export function handleClickParent<T>(_data: ParentEventData<T>) {}

export function handleNodeKeydown<T>(_data: NodeEventData<T>) {}

export function handleParentKeydown<T>(
  data: ParentKeydownEventData<T>,
  state: BaseDragState<T>
) {
  const activeDescendant = state.activeState?.node;

  if (!activeDescendant) return;

  const parentData = data.targetData.parent.data;

  const enabledNodes = parentData.enabledNodes;

  const index = enabledNodes.findIndex((x) => x.el === activeDescendant.el);

  if (index === -1) return;

  if (
    ["ArrowDown", "ArrowUp", "ArrowRight", "ArrowLeft"].includes(data.e.key)
  ) {
    data.e.preventDefault();

    const nextIndex =
      data.e.key === "ArrowDown" || data.e.key === "ArrowRight"
        ? index + 1
        : index - 1;

    if (nextIndex < 0 || nextIndex >= enabledNodes.length) return;

    const nextNode = enabledNodes[nextIndex];

    setActive(data.targetData.parent, nextNode, state);
  } else if (data.e.key === " ") {
    data.e.preventDefault();

    state.selectedState && state.selectedState.nodes.includes(activeDescendant)
      ? setSelected(
          data.targetData.parent,
          state.selectedState.nodes.filter((x) => x.el !== activeDescendant.el),
          activeDescendant,
          state
        )
      : setSelected(
          data.targetData.parent,
          [activeDescendant],
          activeDescendant,
          state
        );

    //if (!state.selectedState)
    //  updateLiveRegion(data.targetData.parent, "", true);
  } else if (data.e.key === "Enter" && state.selectedState) {
    if (
      state.selectedState.parent.el === data.targetData.parent.el &&
      state.activeState
    ) {
      if (state.selectedState.nodes[0].el === state.activeState.node.el) {
        updateLiveRegion(data.targetData.parent, "Cannot drop item on itself");

        return;
      }

      state.newActiveDescendant = state.selectedState.nodes[0];

      parentData.config.performSort({
        parent: data.targetData.parent,
        draggedNodes: state.selectedState.nodes,
        targetNode: state.activeState.node,
      });

      deselect([], data.targetData.parent, state);

      updateLiveRegion(data.targetData.parent, "Drop successful");
    } else if (
      state.activeState &&
      state.selectedState.parent.el !== data.targetData.parent.el &&
      validateTransfer({
        currentParent: data.targetData.parent,
        targetParent: state.selectedState.parent,
        initialParent: state.selectedState.parent,
        draggedNodes: state.selectedState.nodes,
        state,
      })
    ) {
      parentData.config.performTransfer({
        currentParent: state.selectedState.parent,
        targetParent: data.targetData.parent,
        initialParent: state.selectedState.parent,
        draggedNodes: state.selectedState.nodes,
        initialIndex: state.selectedState.nodes[0].data.index,
        state,
        targetNode: state.activeState.node,
      });

      state.newActiveDescendant = state.selectedState.nodes[0];

      setSelected(data.targetData.parent, [], undefined, state);

      updateLiveRegion(data.targetData.parent, "Drop successful");
    }
  }
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

export function handleNodePointerover<T>(e: PointeroverNodeEvent<T>) {
  if (e.detail.targetData.parent.el === e.detail.state.currentParent.el)
    sort(e.detail, e.detail.state);
  else transfer(e.detail, e.detail.state);
}

export function handleNodeDrop<T>(
  data: NodeDragEventData<T>,
  state: DragState<T> | SynthDragState<T>
) {
  data.e.stopPropagation();

  dropped = true;

  const config = data.targetData.parent.data.config;

  config.handleEnd(state);
}

export function handleDragend<T>(
  data: NodeDragEventData<T>,
  state: DragState<T>
) {
  data.e.preventDefault();

  if (dropped) {
    dropped = false;

    return;
  }

  const config = data.targetData.parent.data.config;

  if (config?.onDragend) {
    config.onDragend({
      parent: state.currentParent,
      values: parentValues(state.currentParent.el, state.currentParent.data),
      draggedNode: state.draggedNode,
      draggedNodes: state.draggedNodes,
      position: state.initialIndex,
    });
  }

  config.handleEnd(state);
}

export function handlePointercancel<T>(
  data: NodeEventData<T>,
  state: DragState<T> | SynthDragState<T> | BaseDragState<T>
) {
  if (!isSynthDragState(state)) return;

  data.e.preventDefault();

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
      position: state.initialIndex,
    });
  }

  config?.handleEnd(state);
}

export function handleEnd<T>(state: DragState<T> | SynthDragState<T>) {
  cancelSynthScroll();

  if ("longPressTimeout" in state && state.longPressTimeout)
    clearTimeout(state.longPressTimeout);

  const config = parents.get(state.initialParent.el)?.config;

  const isSynth = "clonedDraggedNode" in state && state.clonedDraggedNode;

  const dropZoneClass = isSynth
    ? config?.synthDropZoneClass
    : config?.dropZoneClass;

  if (state.originalZIndex !== undefined)
    state.draggedNode.el.style.zIndex = state.originalZIndex;

  removeClass(
    state.draggedNodes.map((x) => x.el),
    dropZoneClass
  );

  removeClass(
    state.draggedNodes.map((x) => x.el),
    state.initialParent.data?.config?.longPressClass
  );

  removeClass(
    state.draggedNodes.map((x) => x.el),
    isSynth
      ? state.initialParent.data.config.synthDragPlaceholderClass
      : state.initialParent.data?.config?.dragPlaceholderClass
  );

  if (isSynth) state.clonedDraggedNode.remove();

  deselect(state.draggedNodes, state.currentParent, state);

  setActive(state.currentParent, undefined, state);

  resetState();

  state.selectedState = undefined;

  synthNodePointerDown = false;

  state.emit("dragend", state);
}

export function handleNodeTouchstart<T>(
  data: NodeEventData<T>,
  _state: BaseDragState<T>
) {
  if (data.e.cancelable) data.e.preventDefault();
}

export function handleNodePointerup<T>(
  data: NodePointerEventData<T>,
  state: DragState<T> | SynthDragState<T> | BaseDragState<T>
) {
  if (!state.pointerSelection && state.selectedState)
    deselect(state.selectedState.nodes, data.targetData.parent, state);

  const config = data.targetData.parent.data.config;

  state.pointerSelection = false;

  synthNodePointerDown = false;

  if (!isDragState(state)) return;

  config.handleEnd(state as DragState<T> | SynthDragState<T>);
}

export function handleNodePointermove<T>(
  data: NodePointerEventData<T>,
  state: SynthDragState<T> | BaseDragState<T>
) {
  // TODO: I think this is OK but not sure.
  //data.e.stopPropagation();

  if (isNative || !synthNodePointerDown || !validateDragHandle(data)) return;

  if (!isSynthDragState(state)) {
    const config = data.targetData.parent.data.config;

    const nodes = config.draggedNodes(data);

    config.dragstartClasses(data.targetData.node, nodes, config, true);

    const synthDragState = initSynthDrag(data, state, nodes);

    synthDragState.clonedDraggedNode.style.display =
      synthDragState.draggedNodeDisplay || "";

    synthMove(data, synthDragState);

    if (config.onDragstart)
      config.onDragstart(
        {
          parent: data.targetData.parent,
          values: parentValues(
            data.targetData.parent.el,
            data.targetData.parent.data
          ),
          draggedNode: synthDragState.draggedNode,
          draggedNodes: synthDragState.draggedNodes,
          position: synthDragState.initialIndex,
        },
        synthDragState
      );

    synthDragState.draggedNode.el.setPointerCapture(data.e.pointerId);

    synthDragState.pointerId = data.e.pointerId;

    return;
  }

  synthMove(data, state as SynthDragState<T>);
}

function initSynthDrag<T>(
  data: NodePointerEventData<T>,
  _state: BaseDragState<T>,
  draggedNodes: Array<NodeRecord<T>>
): SynthDragState<T> {
  const config = data.targetData.parent.data.config;

  let dragImage: HTMLElement | undefined;

  if (config.synthDragImage) {
    dragImage = config.synthDragImage(data, draggedNodes);
  } else {
    if (!config.multiDrag || draggedNodes.length === 1) {
      dragImage = data.targetData.node.el.cloneNode(true) as HTMLElement;

      dragImage.id = data.targetData.node.el.id + "-clone";

      copyNodeStyle(data.targetData.node.el, dragImage);

      Object.assign(dragImage.style, {
        width: data.targetData.node.el.getBoundingClientRect().width,
        zIndex: 9999,
        pointerEvents: "none",
      });

      document.body.appendChild(dragImage);
    } else {
      const wrapper = document.createElement("div");

      for (const node of draggedNodes) {
        const clonedNode = node.el.cloneNode(true) as HTMLElement;

        copyNodeStyle(node.el, clonedNode);

        clonedNode.style.pointerEvents = "none";

        clonedNode.id = node.el.id + "-clone";

        wrapper.append(clonedNode);
      }

      const { width } = draggedNodes[0].el.getBoundingClientRect();

      Object.assign(wrapper.style, {
        display: "flex",
        flexDirection: "column",
        width: `${width}px`,
        position: "fixed",
        pointerEvents: "none",
        zIndex: "9999",
        left: "-9999px",
      });

      dragImage = wrapper;
    }
  }

  const display = dragImage.style.display;

  dragImage.style.display = "none";

  document.body.append(dragImage);

  dragImage.style.position = "absolute";

  const synthDragStateProps = {
    clonedDraggedEls: [],
    clonedDraggedNode: dragImage,
    draggedNodeDisplay: display,
    synthDragScrolling: false,
  };

  addEvents(document, {
    contextmenu: noDefault,
  });

  const synthDragState = setDragState({
    ...dragStateProps(data, draggedNodes, false),
    ...synthDragStateProps,
  }) as SynthDragState<T>;

  return synthDragState;
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
}

function getScrollData<T>(
  e: DragEvent | PointerEvent,
  state: DragState<T> | SynthDragState<T>
): ScrollData | undefined {
  if (!(e.currentTarget instanceof HTMLElement)) return;

  const {
    x: xThresh,
    y: yThresh,
    scrollOutside,
  } = state.initialParent.data.config.scrollBehavior;

  const coordinates = getRealCoords(e.currentTarget);

  return {
    xThresh,
    yThresh,
    scrollOutside,
    scrollParent: e.currentTarget,
    x: coordinates.left,
    y: coordinates.top,
    clientWidth: e.currentTarget.clientWidth,
    clientHeight: e.currentTarget.clientHeight,
    scrollWidth: e.currentTarget.scrollWidth,
    scrollHeight: e.currentTarget.scrollHeight,
  };
}

function cancelSynthScroll() {
  if (animationFrameId !== null) {
    cancelAnimationFrame(animationFrameId);

    animationFrameId = null;
  }
}

function setSynthScrollDirection<T>(
  direction: "up" | "down" | "left" | "right" | undefined,
  el: HTMLElement,
  state: SynthDragState<T>
) {
  if (state.synthScrollDirection === direction) return;

  state.synthScrollDirection = direction;

  // Cancel any ongoing animation frame when direction changes
  cancelSynthScroll();

  if (direction === "up" && el.scrollTop === 0) return;

  if (direction === "down" && el.scrollTop + el.clientHeight >= el.scrollHeight)
    return;

  if (direction === "left" && el.scrollLeft === 0) return;

  if (direction === "right" && el.scrollLeft + el.clientWidth >= el.scrollWidth)
    return;

  let lastTimestamp: number | null = null;

  // Function to perform the scrolling based on the current direction
  const scroll = (timestamp: number) => {
    if (lastTimestamp === null) lastTimestamp = timestamp;

    const elapsed = timestamp - lastTimestamp;

    // Base scroll speed in pixels per second
    const baseSpeed = 500;

    const distance = (baseSpeed * elapsed) / 1000; // Pixels to scroll

    if (state.synthScrollDirection === undefined && animationFrameId) {
      cancelAnimationFrame(animationFrameId);

      animationFrameId = null;

      return;
    }

    switch (direction) {
      case "up":
        el.scrollBy(0, -distance);
        state.clonedDraggedNode.style.top = `${
          state.coordinates.y + el.scrollTop
        }px`;

        break;
      case "down":
        el.scrollBy(0, distance);
        state.clonedDraggedNode.style.top = `${
          state.coordinates.y + el.scrollTop - state.startTop
        }px`;

        break;
      case "left":
        el.scrollBy(-distance, 0);

        state.clonedDraggedNode.style.left = `${
          state.coordinates.x + el.scrollLeft
        }px`;

        break;
      case "right":
        state.clonedDraggedNode.style.left = `${
          state.coordinates.x + el.scrollLeft
        }px`;

        el.scrollBy(distance, 0);
    }

    lastTimestamp = timestamp;

    animationFrameId = requestAnimationFrame(scroll);
  };

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
  data: ScrollData
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
  data: ScrollData
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

function shouldScrollUp<T>(state: DragState<T>, data: ScrollData): boolean {
  return (
    state.coordinates.y <= 0.1 * data.scrollParent.clientHeight &&
    data.scrollParent.scrollTop !== 0
  );
}

function shouldScrollDown<T>(state: DragState<T>, data: ScrollData): boolean {
  return (
    state.coordinates.y > data.clientHeight * data.yThresh &&
    data.scrollParent.scrollTop !== data.scrollParent.clientHeight
  );
}

function moveNode<T>(data: NodePointerEventData<T>, state: SynthDragState<T>) {
  const { x, y } = eventCoordinates(data.e);

  state.coordinates.y = y;

  state.coordinates.x = x;

  const startLeft = state.startLeft ?? 0;

  const startTop = state.startTop ?? 0;

  state.clonedDraggedNode.style.top = `${y - startTop + window.scrollY}px`;

  state.clonedDraggedNode.style.left = `${x - startLeft + window.scrollX}px`;

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

  const elFromPoint = getElFromPoint(eventCoordinates(data.e));

  if (!elFromPoint) {
    document.dispatchEvent(
      new CustomEvent("handleRootPointerover", {
        detail: {
          e: data.e,
          state,
        },
      })
    );

    return;
  }
  const pointerMoveEventData = {
    e: data.e,
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

export function handleScroll(e: DragEvent | PointerEvent) {
  e.stopPropagation();

  if (!isSynthDragState(state)) return;
  let directionSet = false;

  for (const direction of Object.keys(scrollConfig)) {
    if (shouldScroll(direction, e, state)) {
      setSynthScrollDirection(
        direction as "up" | "down" | "left" | "right" | undefined,
        e.currentTarget as HTMLElement,
        state
      );

      directionSet = true;

      break;
    }
  }

  if (!directionSet) state.synthScrollDirection = undefined;
}

export function handleNodeDragover<T>(
  data: NodeDragEventData<T>,
  state: DragState<T>
) {
  const { x, y } = eventCoordinates(data.e);

  state.coordinates.y = y;

  state.coordinates.x = x;

  data.e.preventDefault();

  data.e.stopPropagation();

  data.targetData.parent.el === state.currentParent?.el
    ? sort(data, state)
    : transfer(data, state);
}

export function handleParentDragover<T>(
  data: ParentEventData<T>,
  state: DragState<T>
) {
  data.e.preventDefault();

  data.e.stopPropagation();

  return;

  Object.assign(eventCoordinates(data.e as DragEvent));

  transfer(data, state);
}

export function handleParentPointerover<T>(e: PointeroverParentEvent<T>) {
  if (e.detail.targetData.parent.el !== e.detail.state.currentParent.el)
    transfer(e.detail, e.detail.state);
}

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

  if (targetConfig.treeGroup && draggedNodes[0].el.contains(targetParent.el))
    return false;

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

function handleNodeDragenter<T>(
  data: NodeDragEventData<T>,
  _state: DragState<T>
) {
  data.e.preventDefault();
}

function handleNodeDragleave<T>(
  data: NodeDragEventData<T>,
  _state: DragState<T>
) {
  data.e.preventDefault();
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

  if (
    data.targetData.parent.data.config.treeGroup &&
    data.targetData.node.el.contains(state.draggedNodes[0].el)
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

  data.targetData.parent.data.config.performSort({
    parent: data.targetData.parent,
    draggedNodes: state.draggedNodes,
    targetNode: data.targetData.node,
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
 * Used when the dragged element enters into a parent other than its own.
 */
export function transfer<T>(
  data: NodeEventData<T> | ParentEventData<T>,
  state: DragState<T>
): void {
  if (
    !validateTransfer({
      currentParent: state.currentParent,
      targetParent: data.targetData.parent,
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
    targetNode: "node" in data.targetData ? data.targetData.node : undefined,
  });

  state.currentParent = data.targetData.parent;

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

    return callback(
      {
        e,
        targetData,
      },
      state
    );
  };
}

export function noDefault(e: Event) {
  e.preventDefault();
}

export function throttle(callback: any, limit: number) {
  var wait = false;
  return function (...args: any[]) {
    if (!wait) {
      callback.call(null, ...args);
      wait = true;
      setTimeout(function () {
        wait = false;
      }, limit);
    }
  };
}

function splitClass(className: string): Array<string> {
  return className.split(" ").filter((x) => x);
}

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

export function addClass(
  el: Node | HTMLElement | Element,
  className: string | undefined,
  data: NodeData<any> | ParentData<any> | undefined,
  omitAppendPrivateClass = false
) {
  if (!className) return;

  const classNames = splitClass(className);

  if (!classNames.length) return;

  if (classNames.includes("longPress")) return;

  if (!data) {
    el.classList.add(...classNames);

    return;
  }

  const privateClasses = [];

  for (const className of classNames) {
    if (!el.classList.contains(className)) {
      el.classList.add(className);
    } else if (
      el.classList.contains(className) &&
      omitAppendPrivateClass === false
    ) {
      privateClasses.push(className);
    }
  }

  data.privateClasses = privateClasses;

  return data;
}

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

function isScrollable(element: HTMLElement) {
  if (element === document.documentElement) {
    return (
      element.scrollHeight > element.clientHeight ||
      element.scrollWidth > element.clientWidth
    );
  }

  const style = window.getComputedStyle(element);

  return (
    ((style.overflowY === "auto" || style.overflowY === "scroll") &&
      element.scrollHeight > element.clientHeight) ||
    ((style.overflowX === "auto" || style.overflowX === "scroll") &&
      element.scrollWidth > element.clientWidth)
  );
}

/**
 * Used for getting the closest scrollable parent of a given element.
 *
 * @param node - The parent element to start the search from.
 *
 * @returns The closest scrollable parent or the document's root element.
 *
 * @internal
 */
export function getScrollables(): Array<HTMLElement> {
  return Array.from(document.querySelectorAll("*")).filter(
    (el) => el instanceof HTMLElement && isScrollable(el)
  ) as Array<HTMLElement>;
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
 * Checks to see that a given element and its parent node are instances of
 * HTML Elements.
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
  el: Document | ShadowRoot | Node | HTMLElement,
  events: EventHandlers | any
): AbortController {
  const abortController = new AbortController();

  for (const eventName in events) {
    const handler = events[eventName];

    el.addEventListener(eventName, handler, {
      signal: abortController.signal,
      passive: false,
    });
  }

  return abortController;
}

export function copyNodeStyle(
  sourceNode: HTMLElement,
  targetNode: HTMLElement,
  omitKeys = false
) {
  const computedStyle = window.getComputedStyle(sourceNode);

  const omittedKeys = [
    "position",
    "z-index",
    "top",
    "left",
    "x",
    "pointer-events",
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
    if (!isNode(child)) continue;

    const targetChild = targetNode.children[
      Array.from(sourceNode.children).indexOf(child)
    ] as Node;

    copyNodeStyle(child, targetChild, omitKeys);
  }
}

export function eventCoordinates(data: DragEvent | PointerEvent) {
  return { x: data.clientX, y: data.clientY };
}

export function getRealCoords(el: HTMLElement): Coordinates {
  const { top, bottom, left, right, height, width } =
    el.getBoundingClientRect();

  const scrollLeft = window.scrollX || document.documentElement.scrollLeft;
  const scrollTop = window.scrollY || document.documentElement.scrollTop;

  const adjustedTop = top + scrollTop;
  const adjustedBottom = bottom + scrollTop;
  const adjustedLeft = left + scrollLeft;
  const adjustedRight = right + scrollLeft;

  return {
    top: adjustedTop,
    bottom: adjustedBottom,
    left: adjustedLeft,
    right: adjustedRight,
    height,
    width,
  };
}
