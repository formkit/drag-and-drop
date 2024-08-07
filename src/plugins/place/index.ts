import type {
  NodeDragEventData,
  ParentConfig,
  DragState,
  NodePointerEventData,
  NodeRecord,
  PointeroverNodeEvent,
  ParentEventData,
  PointeroverParentEvent,
} from "../../types";
import {
  state,
  parents,
  handleEnd as originalHandleEnd,
  parentValues,
  setParentValues,
} from "../../index";
import { addNodeClass, removeClass } from "../../utils";

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
        placeParentConfig.handleDragoverNode =
          placeConfig.handleDragoverNode || handleDragoverNode;

        placeParentConfig.handleTouchOverNode =
          placeConfig.handleTouchOverNode || handleTouchOverNode;

        placeParentConfig.handleTouchOverParent =
          placeConfig.handleTouchOverParent || handleTouchOverParent;

        placeParentConfig.handleEnd = placeConfig.handleEnd || handleEnd;

        parentData.config = placeParentConfig;
      },
    };
  };
}

function handleDragoverNode<T>(data: NodeDragEventData<T>) {
  if (!state) return;

  dragoverNode(data, state);
}

export function handleDragoverParent<T>(_data: ParentEventData<T>) {}

export function handleTouchOverParent<T>(_data: PointeroverParentEvent<T>) {}

function handleTouchOverNode<T>(data: PointeroverNodeEvent<T>) {
  if (!state) return;

  if (data.detail.targetData.parent.el !== state.lastParent.el) return;

  const dropZoneClass =
    data.detail.targetData.parent.data.config.touchDropZoneClass;

  removeClass(
    placeState.draggedOverNodes.map((node) => node.el),
    dropZoneClass
  );

  const enabledNodes = data.detail.targetData.parent.data.enabledNodes;

  placeState.draggedOverNodes = enabledNodes.slice(
    data.detail.targetData.node.data.index,
    data.detail.targetData.node.data.index + state.draggedNodes.length
  );

  addNodeClass(
    placeState.draggedOverNodes.map((node) => node.el),
    dropZoneClass,
    true
  );

  state.lastTargetValue = data.detail.targetData.node.data.value;

  state.lastParent = data.detail.targetData.parent;
}

function dragoverNode<T>(data: NodeDragEventData<T>, state: DragState<T>) {
  data.e.preventDefault();

  data.e.stopPropagation();

  if (data.targetData.parent.el !== state.lastParent.el) return;

  const dropZoneClass = data.targetData.parent.data.config.dropZoneClass;

  removeClass(
    placeState.draggedOverNodes.map((node) => node.el),
    dropZoneClass
  );

  const enabledNodes = data.targetData.parent.data.enabledNodes;

  if (!enabledNodes) return;

  placeState.draggedOverNodes = enabledNodes.slice(
    data.targetData.node.data.index,
    data.targetData.node.data.index + state.draggedNodes.length
  );

  addNodeClass(
    placeState.draggedOverNodes.map((node) => node.el),
    dropZoneClass,
    true
  );

  state.lastTargetValue = data.targetData.node.data.value;

  state.lastParent = data.targetData.parent;
}

function handleEnd<T>(data: NodeDragEventData<T> | NodePointerEventData<T>) {
  if (!state) return;

  if (state.transferred || state.lastParent.el !== state.initialParent.el)
    return;

  const draggedParentValues = parentValues(
    state.initialParent.el,
    state.initialParent.data
  );

  const draggedValues = state.draggedNodes.map((node) => node.data.value);

  const newParentValues = [
    ...draggedParentValues.filter((x) => !draggedValues.includes(x)),
  ];

  const index = placeState.draggedOverNodes[0].data.index;

  newParentValues.splice(index, 0, ...draggedValues);

  setParentValues(data.targetData.parent.el, data.targetData.parent.data, [
    ...newParentValues,
  ]);

  const dropZoneClass =
    "clonedDraggedNode" in state
      ? data.targetData.parent.data.config.touchDropZoneClass
      : data.targetData.parent.data.config.dropZoneClass;

  removeClass(
    placeState.draggedOverNodes.map((node) => node.el),
    dropZoneClass
  );

  originalHandleEnd(data);
}
