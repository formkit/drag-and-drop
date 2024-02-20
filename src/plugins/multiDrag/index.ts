import type {
  Node,
  NodeEventData,
  NodeRecord,
  DragState,
  TouchState,
  ParentData,
  NodeDragEventData,
  NodeTouchEventData,
  DNDPluginData,
  TearDownNodeData,
  SetupNodeData,
} from "../../types";
import type {
  MultiDragConfig,
  MultiDragParentConfig,
  MultiDragState,
} from "./types";

import {
  parents,
  handleLongTouch,
  initDrag,
  initTouch,
  dragstartClasses,
  handleTouchedNode,
  end,
  state,
  resetState,
} from "../../index";
import { addClass, removeClass, copyNodeStyle, splitClass } from "../../utils";

export const multiDragState: MultiDragState<any> = {
  selectedNodes: Array<NodeRecord<any>>(),

  activeNode: undefined,
};

export function multiDrag<T>(
  multiDragConfig: Partial<MultiDragConfig<T>> = {}
) {
  return (parent: HTMLElement) => {
    const parentData = parents.get(parent);

    if (!parentData) return;

    const multiDragParentConfig = {
      ...parentData.config,
      multiDragConfig: multiDragConfig,
    } as MultiDragParentConfig<T>;

    return {
      setup() {
        multiDragParentConfig.handleDragstart =
          multiDragConfig.multiHandleDragstart || multiHandleDragstart;

        multiDragParentConfig.handleTouchstart =
          multiDragConfig.multiHandleTouchstart || multiHandleTouchstart;

        multiDragParentConfig.handleDragend =
          multiDragConfig.multiHandleDragend || multiHandleDragend;

        multiDragParentConfig.reapplyDragClasses =
          multiDragConfig.multiReapplyDragClasses || multiReapplyDragClasses;

        parentData.config = multiDragParentConfig;

        multiDragParentConfig.multiDragConfig?.plugins?.forEach((plugin) => {
          plugin(parent)?.tearDown?.();
        });

        multiDragParentConfig.multiDragConfig?.plugins?.forEach((plugin) => {
          plugin(parent)?.setup?.();
        });
      },

      tearDownNode<T>(data: TearDownNodeData<T>) {
        multiDragParentConfig.multiDragConfig?.plugins?.forEach((plugin) => {
          plugin(data.parent)?.tearDownNode?.(data);
        });
      },

      setupNode<T>(data: SetupNodeData<T>) {
        multiDragParentConfig.multiDragConfig?.plugins?.forEach((plugin) => {
          plugin(data.parent)?.setupNode?.(data);
        });
      },
    } satisfies DNDPluginData;
  };
}

function multiReapplyDragClasses<T>(node: Node, parentData: ParentData<T>) {
  if (!state) return;

  const dropZoneClass =
    "touchedNode" in state
      ? parentData.config.multiDragConfig.touchDropZoneClass
      : parentData.config.multiDragConfig.dropZoneClass;

  const draggedNodeEls = state.draggedNodes.map((x) => x.el);

  if (!draggedNodeEls.includes(node)) return;

  addClass([node], dropZoneClass, true);
}

function multiHandleDragend<T>(data: NodeEventData<T>) {
  if (!state) return;

  end(data, state);

  selectionsEnd(data);

  resetState();
}

function selectionsEnd<T>(data: NodeEventData<T>) {
  const config = data.targetData.parent.data.config;

  const multiDragconfig = data.targetData.parent.data.config.multiDragConfig;

  const root = config.root || document;

  const isTouch = state && "touchedNode" in state;

  const dropZoneClass = isTouch
    ? multiDragconfig.selectionDropZoneClass
    : multiDragconfig.touchSelectionDraggingClass;

  if (dropZoneClass) {
    const elsWithDropZoneClass = root.querySelectorAll(
      `.${splitClass(dropZoneClass)}`
    );

    removeClass(Array.from(elsWithDropZoneClass), dropZoneClass);
  }
}

function multiHandleDragstart<T>(data: NodeEventData<T>) {
  if (!(data.e instanceof DragEvent)) return;

  dragstart({
    e: data.e,
    targetData: data.targetData,
  });
}

function dragstart<T>(data: NodeDragEventData<T>) {
  const dragState = initDrag(data);

  const multiDragConfig = data.targetData.parent.data.config.multiDragConfig;

  let selectedValues =
    multiDragState.selectedNodes.map((node) => node.data.value) ||
    (multiDragConfig.selections &&
      multiDragConfig.selections(data.targetData.parent.el));

  if (!selectedValues.includes(data.targetData.node.data.value)) {
    selectedValues = [data.targetData.node.data.value, ...selectedValues];
  }

  const originalZIndex = data.targetData.node.el.style.zIndex;

  dragState.originalZIndex = originalZIndex;

  data.targetData.node.el.style.zIndex = "9999";

  if (Array.isArray(selectedValues) && selectedValues.length) {
    const targetRect = data.targetData.node.el.getBoundingClientRect();

    const [x, y] = [
      data.e.clientX - targetRect.left,
      data.e.clientY - targetRect.top,
    ];

    stackNodes(handleSelections(data, selectedValues, dragState, x, y));
  } else {
    const config = data.targetData.parent.data.config;

    dragstartClasses(
      dragState.draggedNode.el,
      config.draggingClass,
      config.dropZoneClass
    );
  }
}

function multiHandleTouchstart<T>(data: NodeEventData<T>) {
  if (!(data.e instanceof TouchEvent)) return;

  touchstart({
    e: data.e,
    targetData: data.targetData,
  });
}

function touchstart<T>(data: NodeTouchEventData<T>) {
  const touchState = initTouch(data);

  const multiDragConfig = data.targetData.parent.data.config.multiDragConfig;

  const selectedValues =
    multiDragConfig?.selections &&
    multiDragConfig?.selections(data.targetData.parent.el);

  if (Array.isArray(selectedValues) && selectedValues.length) {
    stackNodes(
      handleSelections(
        data,
        selectedValues,
        touchState,
        touchState.touchStartLeft,
        touchState.touchStartTop
      )
    );
  } else {
    handleTouchedNode(data, touchState);
  }

  handleLongTouch(data, touchState);
}

export function handleSelections<T>(
  data: NodeEventData<T>,
  selectedValues: Array<T>,
  state: DragState<T> | TouchState<T>,
  x: number,
  y: number
) {
  for (const child of data.targetData.parent.data.enabledNodes) {
    if (child.el === state.draggedNode.el) continue;

    if (!selectedValues.includes(child.data.value)) continue;

    state.draggedNodes.push(child);
  }
  const config = data.targetData.parent.data.config.multiDragConfig;

  const clonedEls = state.draggedNodes.map((x: NodeRecord<T>) => {
    const el = x.el.cloneNode(true) as Node;

    copyNodeStyle(x.el, el, true);

    if (data.e instanceof DragEvent) addClass([el], config.draggingClass);

    return el;
  });

  setTimeout(() => {
    if (data.e instanceof DragEvent) {
      addClass(
        state.draggedNodes.map((x) => x.el),
        config.dropZoneClass
      );
    }
  });

  state.clonedDraggedEls = clonedEls;

  return { data, state, x, y };
}

export function stackNodes<T>({
  data,
  state,
  x,
  y,
}: {
  data: NodeEventData<T>;
  state: DragState<T> | TouchState<T>;
  x: number;
  y: number;
}) {
  const wrapper = document.createElement("div");

  for (const el of state.clonedDraggedEls) wrapper.append(el);

  const { width } = state.draggedNode.el.getBoundingClientRect();

  wrapper.style.cssText = `
        display: flex;
        flex-direction: column;
        width: ${width}px;
        position: absolute;
        left: -9999px
      `;

  document.body.append(wrapper);

  if (data.e instanceof DragEvent) {
    data.e.dataTransfer?.setDragImage(wrapper, x, y);

    setTimeout(() => {
      wrapper.remove();
    });
  } else if ("touchedNode" in state) {
    state.touchedNode = wrapper;
  }
}
