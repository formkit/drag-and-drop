import type {
  NodeDragEventData,
  ParentConfig,
  DragState,
  SynthDragState,
  NodeRecord,
  PointeroverNodeEvent,
  ParentDragEventData,
  PointeroverParentEvent,
} from "../../types";
import {
  parents,
  parentValues,
  setParentValues,
  addNodeClass,
  isSynthDragState,
  removeClass,
  addClass,
  state,
  isDragState,
} from "../../index";

export const placeState = {
  draggedOverNodes: Array<NodeRecord<unknown>>(),
  initialDraggedIndex: 0,
};

let dragoverEventListeneerSet = false;

interface SwapConfig<T> extends ParentConfig<T> {}

export function swap<T>(swapConfig: Partial<SwapConfig<T>> = {}) {
  return (parent: HTMLElement) => {
    const parentData = parents.get(parent);

    if (!parentData) return;

    const swapParentConfig = {
      ...parentData.config,
      swapConfig: swapConfig,
    } as SwapConfig<T>;

    if (!dragoverEventListeneerSet) {
      document.addEventListener("dragover", rootDragover);
      document.addEventListener(
        "handleRootPointerover" as keyof DocumentEventMap,
        (e) => rootPointerover(e as CustomEvent)
      );
    }

    return {
      setup() {
        swapParentConfig.handleNodeDragover =
          swapConfig.handleNodeDragover || handleDragoverNode;

        swapParentConfig.handleParentDragover =
          swapConfig.handleParentDragover || handleDragoverParent;

        swapParentConfig.handleNodePointerover =
          swapConfig.handleNodePointerover || handleNodePointerover;

        swapParentConfig.handleParentPointerover =
          swapConfig.handleParentPointerover || handlePointeroverParent;

        const originalHandleend = swapParentConfig.handleEnd;
        swapParentConfig.handleEnd = (state) => {
          handleEnd(state);

          originalHandleend(state);
        };

        parentData.config = swapParentConfig;
      },
    };
  };
}

function rootDragover(_e: DragEvent) {
  if (!isDragState(state)) return;

  removeClass(
    [state.currentParent.el],
    state.currentParent.data.config.dropZoneParentClass
  );
}

function rootPointerover(_e: CustomEvent) {
  if (!isSynthDragState(state)) return;

  removeClass(
    [state.currentParent.el],
    state.currentParent.data.config.synthDropZoneParentClass
  );
}

function updateDraggedOverNodes<T>(
  data: PointeroverNodeEvent<T> | NodeDragEventData<T>,
  state: DragState<T> | SynthDragState<T>
) {
  const targetData =
    "detail" in data ? data.detail.targetData : data.targetData;

  const config = targetData.parent.data.config;

  const dropZoneClass = isSynthDragState(state)
    ? config.synthDropZoneClass
    : config.dropZoneClass;

  removeClass(
    placeState.draggedOverNodes.map((node) => node.el),
    dropZoneClass
  );

  const enabledNodes = targetData.parent.data.enabledNodes;

  if (!enabledNodes) return;

  placeState.draggedOverNodes = enabledNodes.slice(
    targetData.node.data.index,
    targetData.node.data.index + state.draggedNodes.length
  );

  addNodeClass(
    placeState.draggedOverNodes.map((node) => node.el),
    dropZoneClass,
    true
  );

  state.currentTargetValue = targetData.node.data.value;

  state.currentParent = targetData.parent;

  addClass(
    state.currentParent.el,
    isSynthDragState(state)
      ? config.synthDropZoneParentClass
      : config.dropZoneParentClass,
    state.currentParent.data,
    true
  );
}

function handleDragoverNode<T>(
  data: NodeDragEventData<T>,
  state: DragState<T>
) {
  data.e.preventDefault();

  data.e.stopPropagation();

  updateDraggedOverNodes(data, state);
}

export function handleDragoverParent<T>(
  data: ParentDragEventData<T>,
  state: DragState<T>
) {
  data.e.preventDefault();

  data.e.stopPropagation();

  const currentConfig = state.currentParent.data.config;

  removeClass(
    placeState.draggedOverNodes.map((node) => node.el),
    currentConfig.dropZoneClass
  );

  removeClass([state.currentParent.el], currentConfig.dropZoneParentClass);

  const config = data.targetData.parent.data.config;

  addClass(
    data.targetData.parent.el,
    config.dropZoneParentClass,
    data.targetData.parent.data,
    true
  );

  placeState.draggedOverNodes = [];

  state.currentParent = data.targetData.parent;
}

export function handlePointeroverParent<T>(data: PointeroverParentEvent<T>) {
  const currentConfig = data.detail.state.currentParent.data.config;

  removeClass(
    placeState.draggedOverNodes.map((node) => node.el),
    currentConfig.synthDropZoneClass
  );

  removeClass(
    [data.detail.state.currentParent.el],
    currentConfig.synthDropZoneParentClass
  );

  const config = data.detail.targetData.parent.data.config;

  addClass(
    data.detail.targetData.parent.el,
    config.synthDropZoneParentClass,
    data.detail.targetData.parent.data,
    true
  );

  placeState.draggedOverNodes = [];
}

function handleNodePointerover<T>(data: PointeroverNodeEvent<T>) {
  if (!isSynthDragState(data.detail.state)) return;

  updateDraggedOverNodes(data, data.detail.state);
}

function handleEnd<T>(state: DragState<T> | SynthDragState<T>) {
  const isSynth = isSynthDragState(state);

  removeClass(
    [state.currentParent.el],
    isSynth
      ? state.currentParent.data.config.synthDropZoneParentClass
      : state.currentParent.data.config.dropZoneParentClass
  );

  const values = parentValues(state.currentParent.el, state.currentParent.data);

  const draggedValues = state.draggedNodes.map((node) => node.data.value);

  const newValues = values.filter((x) => !draggedValues.includes(x));

  const targetIndex = placeState.draggedOverNodes[0]?.data.index;

  let newTargetParentValues: Array<T> = [];

  if (state.initialParent.el == state.currentParent.el) {
    if (targetIndex !== undefined) {
      newValues.splice(targetIndex, 0, ...draggedValues);

      setParentValues(
        state.currentParent.el,
        state.currentParent.data,
        newValues
      );
    }
  } else if (state.initialParent.el !== state.currentParent.el) {
    const initialParentValues = parentValues(
      state.initialParent.el,
      state.initialParent.data
    );

    if (targetIndex === undefined) {
      newTargetParentValues = newValues.concat(draggedValues);

      setParentValues(
        state.currentParent.el,
        state.currentParent.data,
        newTargetParentValues
      );

      setParentValues(
        state.initialParent.el,
        state.initialParent.data,
        initialParentValues.filter((x) => !draggedValues.includes(x))
      );
    } else {
      const targetedNodeValues = state.currentParent.data.enabledNodes
        .slice(targetIndex, targetIndex + draggedValues.length)
        .map((node) => node.data.value);

      const newInitialParentValues = initialParentValues.filter(
        (x) => !draggedValues.includes(x)
      );

      newInitialParentValues.splice(
        state.initialIndex,
        0,
        ...targetedNodeValues
      );

      setParentValues(
        state.initialParent.el,
        state.initialParent.data,
        newInitialParentValues
      );

      const newTargetParentValues = newValues.filter(
        (x) => !targetedNodeValues.includes(x)
      );

      newTargetParentValues.splice(targetIndex, 0, ...draggedValues);

      setParentValues(
        state.currentParent.el,
        state.currentParent.data,
        newTargetParentValues
      );
    }
  }

  removeClass(
    placeState.draggedOverNodes.map((node) => node.el),
    isSynth
      ? state.currentParent.data.config.synthDropZoneClass
      : state.currentParent.data.config.dropZoneClass
  );
}
