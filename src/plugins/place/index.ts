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
  draggedOverNodes: Array<NodeRecord<any>>(),
};

let dragoverEventListeneerSet = false;

interface PlaceConfig<T> extends ParentConfig<T> {}

export function place<T>(placeConfig: Partial<PlaceConfig<T>> = {}) {
  return (parent: HTMLElement) => {
    const parentData = parents.get(parent);

    if (!parentData) return;

    const placeParentConfig = {
      ...parentData.config,
      placeConfig: placeConfig,
    } as PlaceConfig<T>;

    if (!dragoverEventListeneerSet) {
      document.addEventListener("dragover", rootDragover);
      document.addEventListener(
        "handleRootPointerover" as keyof DocumentEventMap,
        (e) => rootPointerover(e as CustomEvent)
      );
    }

    return {
      setup() {
        placeParentConfig.handleNodeDragover =
          placeConfig.handleNodeDragover || handleDragoverNode;

        placeParentConfig.handleParentDragover =
          placeConfig.handleParentDragover || handleDragoverParent;

        placeParentConfig.handleNodePointerover =
          placeConfig.handleNodePointerover || handleNodePointerover;

        placeParentConfig.handleParentPointerover =
          placeConfig.handleParentPointerover || handlePointeroverParent;

        const originalHandleend = placeParentConfig.handleEnd;
        placeParentConfig.handleEnd = (state) => {
          handleEnd(state);

          originalHandleend(state);
        };

        parentData.config = placeParentConfig;
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

  const index = placeState.draggedOverNodes[0]?.data.index;

  // If we do not have dragged over nodes, then we know that we are appending
  // items to the end of the list/
  index !== undefined
    ? newValues.splice(index, 0, ...draggedValues)
    : newValues.push(...draggedValues);

  if (state.initialParent.el !== state.currentParent.el) {
    const initialParentValues = parentValues(
      state.initialParent.el,
      state.initialParent.data
    );

    const newInitialValues = initialParentValues.filter(
      (x) => !draggedValues.includes(x)
    );
    setParentValues(
      state.initialParent.el,
      state.initialParent.data,
      newInitialValues
    );

    setParentValues(
      state.currentParent.el,
      state.currentParent.data,
      newValues
    );
  } else if (
    state.initialParent.el === state.currentParent.el &&
    placeState.draggedOverNodes.length
  ) {
    setParentValues(
      state.currentParent.el,
      state.currentParent.data,
      newValues
    );
  }

  removeClass(
    placeState.draggedOverNodes.map((node) => node.el),
    isSynth
      ? state.currentParent.data.config.synthDropZoneClass
      : state.currentParent.data.config.dropZoneClass
  );

  placeState.draggedOverNodes = [];
}
