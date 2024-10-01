import type {
  NodeDragEventData,
  ParentConfig,
  DragState,
  SynthDragState,
  NodeRecord,
  PointeroverNodeEvent,
  ParentEventData,
  PointeroverParentEvent,
} from "../../types";
import {
  parents,
  parentValues,
  setParentValues,
  addNodeClass,
  isSynthDragState,
  removeClass,
} from "../../index";

export const placeState = {
  draggedOverNodes: Array<NodeRecord<any>>(),
};

interface PlaceConfig<T> extends ParentConfig<T> {}

export function place<T>(placeConfig: Partial<PlaceConfig<T>> = {}) {
  return (parent: HTMLElement) => {
    const parentData = parents.get(parent);

    if (!parentData) return;

    const placeParentConfig = {
      ...parentData.config,
      placeConfig: placeConfig,
    } as PlaceConfig<T>;

    return {
      setup() {
        placeParentConfig.handleNodeDragover =
          placeConfig.handleNodeDragover || handleDragoverNode;

        placeParentConfig.handleParentDragover =
          placeConfig.handleParentDragover || handleDragoverParent;

        placeParentConfig.handleNodePointerover =
          placeConfig.handleNodePointerover || handlePointeroverNode;

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
}

function handleDragoverNode<T>(
  data: NodeDragEventData<T>,
  state: DragState<T>
) {
  data.e.preventDefault();

  data.e.stopPropagation();

  updateDraggedOverNodes(data, state);
}

export function handleDragoverParent<T>(_data: ParentEventData<T>) {}

export function handlePointeroverParent<T>(_data: PointeroverParentEvent<T>) {}

function handlePointeroverNode<T>(
  data: PointeroverNodeEvent<T>,
  state: DragState<T>
) {
  updateDraggedOverNodes(data, state);
}

function handleEnd<T>(state: DragState<T> | SynthDragState<T>) {
  const values = parentValues(state.currentParent.el, state.currentParent.data);

  const draggedValues = state.draggedNodes.map((node) => node.data.value);

  const newValues = values.filter((x) => !draggedValues.includes(x));

  const index = placeState.draggedOverNodes[0].data.index;

  newValues.splice(index, 0, ...draggedValues);

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
  }

  setParentValues(state.currentParent.el, state.currentParent.data, newValues);

  const dropZoneClass = isSynthDragState(state)
    ? state.currentParent.data.config.synthDropZoneClass
    : state.currentParent.data.config.dropZoneClass;

  removeClass(
    placeState.draggedOverNodes.map((node) => node.el),
    dropZoneClass
  );
}
