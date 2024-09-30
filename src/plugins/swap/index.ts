import type {
  NodeDragEventData,
  ParentConfig,
  NodeRecord,
  ParentEventData,
  PointeroverParentEvent,
  PointeroverNodeEvent,
} from "../../types";
import {
  state,
  parents,
  addNodeClass,
  removeClass,
  isDragState,
} from "../../index";

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
        swapParentConfig.handleDragoverParent =
          swapConfig.handleDragoverParent || handleDragoverParent;

        swapParentConfig.handleDragoverNode =
          swapConfig.handleDragoverNode || handleDragoverNode;

        swapParentConfig.handlePointeroverNode =
          swapConfig.handlePointeroverNode || handlePointeroverNode;

        swapParentConfig.handlePointeroverParent =
          swapConfig.handlePointeroverParent || handlePointeroverParent;

        parentData.config = swapParentConfig;
      },
    };
  };
}

function handleDragoverNode<T>(data: NodeDragEventData<T>) {
  data.e.preventDefault();
}

export function handleDragoverParent<T>(_data: ParentEventData<T>) {}

export function handlePointeroverParent<T>(_data: PointeroverParentEvent<T>) {}

function handlePointeroverNode<T>(data: PointeroverNodeEvent<T>) {
  if (!isDragState(state)) return;

  if (data.detail.targetData.parent.el !== state.currentParent.el) return;

  const dropZoneClass =
    data.detail.targetData.parent.data.config.synthDropZoneClass;

  removeClass(
    swapState.draggedOverNodes.map((node) => node.el),
    dropZoneClass
  );

  const enabledNodes = data.detail.targetData.parent.data.enabledNodes;

  swapState.draggedOverNodes = enabledNodes.slice(
    data.detail.targetData.node.data.index,
    data.detail.targetData.node.data.index + state.draggedNodes.length
  );

  addNodeClass(
    swapState.draggedOverNodes.map((node) => node.el),
    dropZoneClass,
    true
  );

  state.currentTargetValue = data.detail.targetData.node.data.value;

  state.currentParent = data.detail.targetData.parent as any;
}
//function handleEnd<T>(data: NodeDragEventData<T> | NodePointerEventData<T>) {
//  if (!state) return;

//  if (!state.transferred) {
//    const draggedParentValues = parentValues(
//      state.initialParent.el,
//      state.initialParent.data
//    );

//    let targetParentValues = parentValues(
//      state.lastParent.el,
//      state.lastParent.data
//    );

//    const draggedValues = state.draggedNodes.map((node) => node.data.value);

//    const draggedOverNodeValues = swapState.draggedOverNodes.map(
//      (node) => node.data.value
//    );

//    const draggedIndex = state.draggedNodes[0].data.index;

//    const draggedOverIndex = swapState.draggedOverNodes[0].data.index;

//    targetParentValues.splice(
//      draggedOverIndex,
//      draggedValues.length,
//      ...draggedValues
//    );

//    if (state.initialParent.el === state.lastParent.el) {
//      targetParentValues.splice(
//        draggedIndex,
//        draggedValues.length,
//        ...draggedOverNodeValues
//      );

//      setParentValues(state.initialParent.el, state.initialParent.data, [
//        ...targetParentValues,
//      ]);
//    } else {
//      draggedParentValues.splice(
//        draggedIndex,
//        draggedValues.length,
//        ...draggedOverNodeValues
//      );

//      setParentValues(state.lastParent.el, state.lastParent.data, [
//        ...targetParentValues,
//      ]);

//      setParentValues(state.initialParent.el, state.initialParent.data, [
//        ...draggedParentValues,
//      ]);
//    }
//  }

//  const dropZoneClass =
//    "clonedDraggedNode" in state
//      ? data.targetData.parent.data.config.touchDropZoneClass
//      : data.targetData.parent.data.config.dropZoneClass;

//  removeClass(
//    swapState.draggedOverNodes.map((node) => node.el),
//    dropZoneClass
//  );

//  originalHandleEnd(data);
//}
