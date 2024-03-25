import type {
  SetupNodeData,
  NodeDragEventData,
  ParentConfig,
  DragState,
  NodeTouchEventData,
  NodeRecord,
} from "../../types";
import {
  state,
  parents,
  handleEnd as originalHandleEnd,
  dragValues,
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

        swapParentConfig.handleEnd = swapConfig.handleEnd || handleEnd;

        swapParentConfig.handleDragoverParent = () => {};

        console.log("setup here");

        parentData.config = swapParentConfig;
      },

      setupNode<T>(data: SetupNodeData<T>) {
        //console.log("setup", data);
      },

      tearDownNode() {},

      setupNodeRemap<T>() {},

      tearDownNodeRemap<T>() {},
    };
  };
}

function handleDragoverNode<T>(data: NodeDragEventData<T>) {
  if (!state) return;

  dragoverNode(data, state);
}

function dragoverNode<T>(data: NodeDragEventData<T>, state: DragState<T>) {
  data.e.preventDefault();

  data.e.stopPropagation();

  console.log("dragover node");

  const dropZoneClass =
    "touchedNode" in state
      ? data.targetData.parent.data.config.touchDropZoneClass
      : data.targetData.parent.data.config.dropZoneClass;

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

  targetParentValues = targetParentValues.filter(
    (x) => !draggedValues.includes(x) && !draggedOverNodeValues.includes(x)
  );

  //targetParentValues.splice(draggedOverIndex, 0, ...draggedValues);

  //targetParentValues.splice(draggedIndex, 0, ...draggedOverNodeValues);

  //setParentValues(state.initialParent.el, data.targetData.parent.data, [
  //  ...targetParentValues,
  //]);

  //if (state.initialParent.el !== state.lastParent.el) {
  //  targetParentValues = targetParentValues.filter(
  //    (x) => !draggedOverNodeValues.includes(x)
  //  );

  //  console.log("filtered targetParentValues", targetParentValues);

  //  targetParentValues.splice(
  //    state.draggedNodes[0].data.index,
  //    0,
  //    ...draggedValues
  //  );

  //  setParentValues(state.lastParent.el, state.lastParent.data, [
  //    ...targetParentValues,
  //  ]);
  //}

  //const targetNodeData = {
  //  el: state.lastTarget.el,
  //  data: state.lastTarget.data,
  //};

  //if (state.initialParent.el === state.lastParent.el) {
  //  const newParentValues = [
  //    ...targetParentValues.filter((x) => !draggedValues.includes(x)),
  //  ];

  //  newParentValues.splice(
  //    swapState.draggedOverNodes[0].data.index,
  //    0,
  //    ...draggedValues
  //  );

  //  console.log(newParentValues);

  //  //setParentValues(state.initialParent.el, data.targetData.parent.data, [
  //  //  ...newParentValues,
  //  //]);
  //} else {
  //  console.log("boom");
  //}

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
