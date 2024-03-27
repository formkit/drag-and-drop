import type {
  NodeDragEventData,
  ParentConfig,
  DragState,
  NodeTouchEventData,
  NodeRecord,
  TouchState,
} from "../../types";
import {
  state,
  parents,
  handleEnd as originalHandleEnd,
  parentValues,
  setParentValues,
} from "../../index";
import { addClass, removeClass } from "../../utils";

export const swapState = {
  draggedOverNodes: Array<NodeRecord<any>>(),
};

interface SwapConfig<T> extends ParentConfig<T> {}

export function swap<T>(swapConfig: Partial<SwapConfig<T>> = {}) {
  return (parent: HTMLElement) => {
    const parentData = parents.get(parent);

    if (!parentData) return;

    const swapParentConfig = {
      ...parentData.config,
      swapConfig: swapConfig,
    } as SwapConfig<T>;

    return {
      setup() {
        swapParentConfig.handleDragoverNode =
          swapConfig.handleDragoverNode || handleDragoverNode;

        swapParentConfig.handleTouchOverNode =
          swapConfig.handleTouchOverNode || handleTouchOverNode;

        swapParentConfig.handleEnd = swapConfig.handleEnd || handleEnd;

        swapParentConfig.handleDragoverParent = () => {};

        swapParentConfig.handleTouchOverParent = () => {};

        parentData.config = swapParentConfig;
      },
    };
  };
}

function handleDragoverNode<T>(data: NodeDragEventData<T>) {
  if (!state) return;

  dragoverNode(data, state);
}

function handleTouchOverNode<T>(data: NodeTouchEventData<T>) {
  if (!state) return;

  const dropZoneClass = data.targetData.parent.data.config.touchDropZoneClass;

  removeClass(
    swapState.draggedOverNodes.map((node) => node.el),
    dropZoneClass
  );

  const enabledNodes = data.targetData.parent.data.enabledNodes;

  if (!enabledNodes) return;

  swapState.draggedOverNodes = enabledNodes.slice(
    data.targetData.node.data.index,
    data.targetData.node.data.index + state.draggedNodes.length
  );

  addClass(
    swapState.draggedOverNodes.map((node) => node.el),
    dropZoneClass,
    true
  );

  state.lastTargetValue = data.targetData.node.data.value;

  state.lastParent = data.targetData.parent;
}

function dragoverNode<T>(data: NodeDragEventData<T>, state: DragState<T>) {
  data.e.preventDefault();

  data.e.stopPropagation();

  const dropZoneClass = data.targetData.parent.data.config.dropZoneClass;

  removeClass(
    swapState.draggedOverNodes.map((node) => node.el),
    dropZoneClass
  );

  const enabledNodes = data.targetData.parent.data.enabledNodes;

  if (!enabledNodes) return;

  swapState.draggedOverNodes = enabledNodes.slice(
    data.targetData.node.data.index,
    data.targetData.node.data.index + state.draggedNodes.length
  );

  addClass(
    swapState.draggedOverNodes.map((node) => node.el),
    dropZoneClass,
    true
  );

  state.lastTargetValue = data.targetData.node.data.value;

  state.lastParent = data.targetData.parent;
}

function handleEnd<T>(data: NodeDragEventData<T> | NodeTouchEventData<T>) {
  if (!state) return;

  const draggedParentValues = parentValues(
    state.initialParent.el,
    state.initialParent.data
  );

  let targetParentValues = parentValues(
    state.lastParent.el,
    state.lastParent.data
  );

  const draggedValues = state.draggedNodes.map((node) => node.data.value);

  const draggedOverNodeValues = swapState.draggedOverNodes.map(
    (node) => node.data.value
  );

  const draggedIndex = state.draggedNodes[0].data.index;

  const draggedOverIndex = swapState.draggedOverNodes[0].data.index;

  targetParentValues.splice(
    draggedOverIndex,
    draggedValues.length,
    ...draggedValues
  );

  if (state.initialParent.el === state.lastParent.el) {
    targetParentValues.splice(
      draggedIndex,
      draggedValues.length,
      ...draggedOverNodeValues
    );

    setParentValues(state.initialParent.el, state.initialParent.data, [
      ...targetParentValues,
    ]);
  } else {
    draggedParentValues.splice(
      draggedIndex,
      draggedValues.length,
      ...draggedOverNodeValues
    );

    setParentValues(state.lastParent.el, state.lastParent.data, [
      ...targetParentValues,
    ]);

    setParentValues(state.initialParent.el, state.initialParent.data, [
      ...draggedParentValues,
    ]);
  }

  const dropZoneClass =
    "touchedNode" in state
      ? data.targetData.parent.data.config.touchDropZoneClass
      : data.targetData.parent.data.config.dropZoneClass;

  removeClass(
    swapState.draggedOverNodes.map((node) => node.el),
    dropZoneClass
  );

  originalHandleEnd(data);
}
