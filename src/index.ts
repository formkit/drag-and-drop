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
  selectedDragItems: [],
};

/**
 * The state of the drag and drop.
 */
export let state:
  | DragState<unknown>
  | SynthDragState<unknown>
  | BaseDragState<unknown> = baseDragState;

export function resetState() {
  const baseDragState = {
    activeDescendant: undefined,
    on,
    emit,
    originalZIndex: undefined,
    preventEnter: false,
    remapJustFinished: false,
    selectedDragItems: [],
    selectedParent: undefined,
  };

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
    | (SynthDragStateProps & DragStateProps<T>)
    | DragStateProps<T>
    | undefined
): DragState<T> | SynthDragState<T> {
  Object.assign(state, dragStateProps);

  //state.emit("dragStarted", state);

  return state as DragState<T> | SynthDragState<T>;
}

/**
 *
 */
function handleRootPointerdown(_e: PointerEvent) {
  if (!state.activeState) return;

  setActive(state.activeState.parent, undefined, state);

  if (!state.selectedState) return;

  setSelected(state.selectedState.parent, [], state);
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
      pointerdown: handleRootPointerdown,
    });

  tearDown(parent);

  const parentData: ParentData<T> = {
    getValues,
    setValues,
    config: {
      ariaLabel: config.ariaLabel ?? "Please select an item",
      clickawayDeselectContainer: config.clickawayDeselectContainer ?? parent,
      dragDropEffect: "move",
      dragEffectAllowed: "move",
      draggedNodes,
      dragImage,
      dragstartClasses,
      deepCopyStyles: config.deepCopyStyles ?? false,
      handleKeydownNode,
      handleKeydownParent,
      handleDragstart,
      handleDragoverNode,
      handleDragoverParent,
      handleEnd,
      handleFocusParent,
      handlePointerupNode,
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
      root: config.root ?? document,
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

function dragImage<T>(
  _draggedNode: NodeRecord<T>,
  draggedNodes: Array<NodeRecord<T>>,
  _data: ParentData<T>
) {
  return draggedNodes[0].el;
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
    clonedDraggedEls: [],
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
    draggedNodes,
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

/**
 * This function sets the active node. This will clean the prior active state
 * as well as removing any classes or attribute set.
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
    removeClass([state.activeState.dragItem.el], activeDescendantClass);

    if (state.activeState.parent.el !== parent.el)
      state.activeState.parent.el.setAttribute("aria-activedescendant", "");
  }

  if (!newActiveNode) return;

  state.activeState = {
    dragItem: newActiveNode,
    parent,
  };

  addNodeClass([newActiveNode.el], activeDescendantClass, true);

  state.activeState.parent.el.setAttribute(
    "aria-activedescendant",
    state.activeState.dragItem.el.id
  );
}

/**
 * This function sets the selected nodes. This will clean the prior selected state
 * as well as removing any classes or attributes set.
 */
function setSelected<T>(
  parent: ParentRecord<T>,
  newlySelectedNodes: Array<NodeRecord<T>>,
  state: BaseDragState<T>
) {
  const selectedClass = parent.data.config.selectedClass;

  if (state.selectedState) {
    removeClass(
      state.selectedState.dragItems.map((x) => x.el),
      selectedClass
    );

    for (const node of state.selectedState.dragItems) {
      node.el.setAttribute("aria-checked", "false");
    }
  }

  if (!newlySelectedNodes.length) {
    state.selectedState = undefined;

    updateLiveRegion(parent);

    return;
  }

  state.selectedState = {
    dragItems: newlySelectedNodes,
    parent: parent,
  };

  addNodeClass(
    newlySelectedNodes.map((x) => x.el),
    selectedClass,
    true
  );

  for (const node of newlySelectedNodes) {
    node.el.setAttribute("aria-checked", "true");
  }

  updateLiveRegion(parent);
}

function updateLiveRegion<T>(parent: ParentRecord<T>) {
  const parentId = parent.el.id;

  const liveRegion = document.getElementById(parentId + "-live-region");

  if (!liveRegion) return;

  const numberOfSelectedItems = state.selectedState?.dragItems.length || 0;

  liveRegion.textContent =
    numberOfSelectedItems === 0
      ? "No items selected"
      : `${numberOfSelectedItems} items selected`;
}

export function handleFocusParent<T>(
  data: ParentEventData<T>,
  state: BaseDragState<T> | DragState<T> | SynthDragState<T>
) {
  const firstEnabledNode = data.targetData.parent.data.enabledNodes[0];

  if (!firstEnabledNode) return;

  setActive(data.targetData.parent, firstEnabledNode, state);

  updateLiveRegion(data.targetData.parent);
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
    keydown: parentEventData(parentData.config.handleKeydownParent),
    dragover: parentEventData(parentData.config.handleDragoverParent),
    handlePointeroverParent: parentData.config.handlePointeroverParent,
    drop: parentEventData(parentData.config.handleDropParent),
    hasNestedParent: (e: CustomEvent) => {
      const parent = parents.get(e.target as HTMLElement);

      if (!parent) return;

      parent.nestedParent = e.detail.parent;
    },
    focus: parentEventData(parentData.config.handleFocusParent),
  });

  parent.setAttribute("role", "listbox");

  parent.setAttribute("tabindex", "0");

  parent.setAttribute("aria-multiselectable", "false");

  parent.setAttribute("aria-activeDescendant", "");

  parent.setAttribute("aria-label", parentData.config.ariaLabel);

  parent.setAttribute("aria-describedby", parent.id + "-live-region");

  const liveRegion = document.createElement("div");

  //liveRegion.setAttribute("aria-live", "polite");

  //liveRegion.setAttribute("aria-atomic", "true");

  //liveRegion.setAttribute("id", parent.id.toString() + "-live-region");

  setAttrs(liveRegion, {
    "aria-live": "polite",
    "aria-atomic": "true",
    id: parent.id.toString() + "-live-region",
  });

  //Object.assign(liveRegion.style, {
  //  position: "absolute",
  //  width: "1px",
  //  height: "1px",
  //  padding: "0",
  //  overflow: "hidden",
  //  clip: "rect(0, 0, 0, 0)",
  //  whiteSpace: "nowrap",
  //  border: "0",
  //});

  document.body.appendChild(liveRegion);
}

export function setAttrs(el: HTMLElement, attrs: Record<string, string>) {
  for (const key in attrs) {
    el.setAttribute(key, attrs[key]);
  }
}

export function setupNode<T>(data: SetupNodeData<T>) {
  const config = data.parentData.config;

  data.node.draggable = true;

  data.nodeData.abortControllers.mainNode = addEvents(data.node, {
    keydown: nodeEventData(config.handleKeydownNode),
    dragstart: nodeEventData(config.handleDragstart),
    dragover: nodeEventData(config.handleDragoverNode),
    dragenter: nodeEventData(config.handleDragenterNode),
    dragleave: nodeEventData(config.handleDragleaveNode),
    dragend: nodeEventData(config.handleEnd),
    touchstart: nodeEventData(config.handleTouchstart),
    pointerdown: nodeEventData(config.handlePointerdownNode),
    pointermove: nodeEventData(config.handlePointermove),
    pointerup: nodeEventData(config.handlePointerupNode),
    handlePointeroverNode: config.handlePointeroverNode,
    mousedown: () => {
      if (!config.nativeDrag) isNative = false;
      else isNative = true;
    },
  });

  data.node.setAttribute("role", "option");

  data.node.setAttribute("aria-checked", "false");

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

export function validateDragstart(data: NodeEventData<any>): boolean {
  return !!data.targetData.parent.data.config.nativeDrag;
}

function draggedNodes<T>(data: NodeEventData<T>): Array<NodeRecord<T>> {
  return [data.targetData.node];
}

/**
 * Responsible for assigning dragstart classes to the dragged nodes.
 */
export function handleDragstart<T>(
  data: NodeDragEventData<T>,
  _state: BaseDragState<T>
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

export function handlePointerdownNode<T>(
  data: NodePointerEventData<T>,
  state: BaseDragState<T>
) {
  data.e.stopPropagation();

  data.targetData.node.el.setAttribute("aria-checked", "true");

  pointerdown(
    {
      e: data.e,
      targetData: data.targetData,
    },
    state
  );
}

export function dragstartClasses<T>(
  _node: NodeRecord<T>,
  nodes: Array<NodeRecord<T>>,
  config: ParentConfig<T>
) {
  addNodeClass(
    nodes.map((x) => x.el),
    config.draggingClass
  );

  setTimeout(() => {
    removeClass(
      nodes.map((x) => x.el),
      config.draggingClass
    );

    addNodeClass(
      nodes.map((x) => x.el),
      config.dropZoneClass
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

    const dragImage = config?.dragImage(
      data.targetData.node,
      draggedNodes,
      data.targetData.parent.data
    );

    data.e.dataTransfer.setDragImage(
      dragImage || data.targetData.node.el,
      data.e.offsetX,
      data.e.offsetY
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

  for (const handle of Array.from(dragHandles))
    if (elFromPoint === handle || handle.contains(elFromPoint)) return true;

  return false;
}

export function handleClickNode<T>(_data: NodeEventData<T>) {}

export function handleClickParent<T>(_data: ParentEventData<T>) {}

export function handleKeydownNode<T>(_data: NodeEventData<T>) {}

export function handleKeydownParent<T>(
  data: ParentKeydownEventData<T>,
  state: BaseDragState<T>
) {
  data.e.preventDefault();

  const activeDescendant = state.activeState?.dragItem;

  if (!activeDescendant) return;

  const parentData = data.targetData.parent.data;

  const enabledNodes = parentData.enabledNodes;

  const index = enabledNodes.findIndex((x) => x.el === activeDescendant.el);

  if (index === -1) return;

  if (
    ["ArrowDown", "ArrowUp", "ArrowRight", "ArrowLeft"].includes(data.e.key)
  ) {
    const nextIndex =
      data.e.key === "ArrowDown" || data.e.key === "ArrowRight"
        ? index + 1
        : index - 1;

    if (nextIndex < 0 || nextIndex >= enabledNodes.length) return;

    const nextNode = enabledNodes[nextIndex];

    setActive(data.targetData.parent, nextNode, state);
  } else if (data.e.key === " ") {
    setActive(data.targetData.parent, activeDescendant, state);

    state.selectedState &&
    state.selectedState.dragItems.includes(activeDescendant)
      ? setSelected(
          data.targetData.parent,
          state.selectedState.dragItems.filter(
            (x) => x.el !== activeDescendant.el
          ),
          state
        )
      : setSelected(data.targetData.parent, [activeDescendant], state);
  }
}

export function pointerdown<T>(
  data: NodePointerEventData<T>,
  _state: BaseDragState<T>
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

export function handlePointeroverNode<T>(e: PointeroverNodeEvent<T>) {
  if (e.detail.targetData.parent.el === e.detail.state.lastParent.el)
    sort(e.detail, e.detail.state);
  else transfer(e.detail, e.detail.state);
}

export function handleEnd<T>(
  data: NodeEventData<T>,
  state: DragState<T> | SynthDragState<T>
) {
  data.e.preventDefault();

  end(data, state);

  resetState();

  synthNodePointerDown = false;
}

export function end<T>(
  _data: NodeEventData<T>,
  state: DragState<T> | SynthDragState<T>
) {
  if ("longPressTimeout" in state && state.longPressTimeout)
    clearTimeout(state.longPressTimeout);

  const config = parents.get(state.initialParent.el)?.config;

  const isSynth = "clonedDraggedNode" in state && state.clonedDraggedNode;

  const dropZoneClass = isSynth
    ? config?.synthDropZoneClass
    : config?.dropZoneClass;

  if (state.originalZIndex !== undefined)
    state.draggedNode.el.style.zIndex = state.originalZIndex;

  //addNodeClass(
  //  state.draggedNodes.map((x) => x.el),
  //  dropZoneClass,
  //  true
  //);

  removeClass(
    state.draggedNodes.map((x) => x.el),
    dropZoneClass
  );

  removeClass(
    state.draggedNodes.map((x) => x.el),
    config?.dragPlaceholderClass
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
  _state: BaseDragState<T>
) {
  if (data.e.cancelable) data.e.preventDefault();
}

export function handlePointerupNode<T>(
  data: NodePointerEventData<T>,
  state: DragState<T> | SynthDragState<T> | BaseDragState<T>
) {
  if (!isDragState(state)) return;

  handleEnd(data, state as DragState<T> | SynthDragState<T>);
}

export function handlePointermove<T>(
  data: NodePointerEventData<T>,
  state: SynthDragState<T> | BaseDragState<T>
) {
  data.e.stopPropagation();

  if (isNative || !synthNodePointerDown || !validateDragHandle(data)) return;

  if (!isSynthDragState(state)) {
    const config = data.targetData.parent.data.config;

    const nodes = config.draggedNodes(data);

    config.dragstartClasses(data.targetData.node, nodes, config);

    const synthDragState = initSynthDrag(data, state, nodes);

    synthMove(data, synthDragState);

    if (config.onDragstart)
      config.onDragstart({
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

function initSynthDrag<T>(
  data: NodePointerEventData<T>,
  _state: BaseDragState<T>,
  draggedNodes: Array<NodeRecord<T>>
): SynthDragState<T> {
  // NEXT STEP HERE:

  const display = data.targetData.node.el.style.display;

  const rect = data.targetData.node.el.getBoundingClientRect();

  const clonedDraggedNode = data.targetData.node.el.cloneNode(
    true
  ) as HTMLElement;

  clonedDraggedNode.style.cssText = `
            width: ${rect.width}px;
            position: absolute;
            pointer-events: none;
            z-index: 99999;
          `;

  document.body.append(clonedDraggedNode);

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
): ScrollData | undefined {
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

let animationFrameId: number | null = null;

function setSynthScrollDirection<T>(
  direction: "up" | "down" | "left" | "right" | undefined,
  el: HTMLElement,
  state: SynthDragState<T>
) {
  if (state.synthScrollDirection === direction) return;

  if (direction === "up" && el.scrollTop === 0) return;

  if (direction === "down" && el.scrollTop + el.clientHeight >= el.scrollHeight)
    return;

  if (direction === "left" && el.scrollLeft === 0) return;

  if (direction === "right" && el.scrollLeft + el.clientWidth >= el.scrollWidth)
    return;

  state.synthScrollDirection = direction;

  // Cancel any ongoing animation frame when direction changes
  if (animationFrameId !== null) {
    cancelAnimationFrame(animationFrameId);

    animationFrameId = null;
  }

  let lastTimestamp: number | null = null;

  // Function to perform the scrolling based on the current direction
  const scroll = (timestamp: number) => {
    if (lastTimestamp === null) lastTimestamp = timestamp;

    const elapsed = timestamp - lastTimestamp;

    // Base scroll speed in pixels per second
    const baseSpeed = 500; // Adjust this value as needed

    // Calculate how much to scroll based on time elapsed
    const distance = (baseSpeed * elapsed) / 1000; // Pixels to scroll
    if (state.synthScrollDirection === undefined && animationFrameId) {
      cancelAnimationFrame(animationFrameId);

      animationFrameId = null;

      return;
    }

    switch (direction) {
      case "up":
        el.scrollBy(0, -distance);

        break;
      case "down":
        el.scrollBy(0, distance);

        break;
      case "left":
        el.scrollBy(-distance, 0);

        break;
      case "right":
        el.scrollBy(distance, 0);

        break;
    }

    lastTimestamp = timestamp;

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
  const diff = data.scrollParent.clientHeight + data.y - state.coordinates.y;

  if (!data.scrollOutside && diff > data.scrollParent.clientHeight)
    return false;

  if (
    diff > data.yThresh * data.scrollParent.clientHeight &&
    data.scrollParent.scrollTop !== 0
  ) {
    return true;
  }

  return false;
}

function shouldScrollDown<T>(state: DragState<T>, data: ScrollData): boolean {
  const diff = data.scrollParent.clientHeight + data.y - state.coordinates.y;

  if (!data.scrollOutside && diff < 0) return false;

  if (
    diff < (1 - data.yThresh) * data.scrollParent.clientHeight &&
    !(
      data.scrollParent.scrollTop + data.scrollParent.clientHeight >=
      data.scrollParent.scrollHeight
    )
  ) {
    return true;
  }

  return false;
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

export function handleScroll(e: DragEvent | PointerEvent) {
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

  Object.assign(eventCoordinates(data.e as DragEvent));

  transfer(data, state);
}

export function handlePointeroverParent<T>(e: PointeroverParentEvent<T>) {
  if (e.detail.targetData.parent.el !== e.detail.state.lastParent.el)
    transfer(e.detail, e.detail.state);
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

    return callback(
      {
        e,
        targetData,
      },
      state
    );
  };
}
