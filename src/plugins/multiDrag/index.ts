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
} from "../../types";

import type { MultiDragConfig } from "./types";

import {
  parents,
  nodes,
  remapNodes,
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

export function multiDrag(multiDragConfig: Partial<MultiDragConfig> = {}) {
  return (parent: HTMLElement) => {
    const parentData = parents.get(parent);

    if (!parentData) return;

    return {
      setupParent() {
        parentData.config.multiDragConfig = multiDragConfig;

        parentData.config.handleDragstart =
          multiDragConfig.handleDragstart || handleDragstart;

        parentData.config.handleTouchstart =
          multiDragConfig.handleTouchstart || handleTouchstart;

        parentData.config.handleDragend =
          multiDragConfig.handleDragend || handleDragend;

        parentData.config.reapplyDragClasses =
          multiDragConfig.reapplyDragClasses || reapplyDragClasses;

        remapNodes(parent);
      },
    } satisfies DNDPluginData;
  };
}

function reapplyDragClasses(node: Node, parentData: ParentData) {
  if (!state) return;

  const dropZoneClass =
    "touchedNode" in state
      ? parentData.config.multiDragConfig.touchDropZoneClass
      : parentData.config.multiDragConfig.dropZoneClass;

  const draggedNodeEls = state.draggedNodes.map((x) => x.el);

  if (!draggedNodeEls.includes(node)) return;

  addClass([node], dropZoneClass, true);
}

function handleDragend(data: NodeEventData) {
  if (!state) return;

  end(data, state);

  selectionsEnd(data);

  resetState();
}

function selectionsEnd(data: NodeEventData) {
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

function handleDragstart(data: NodeEventData) {
  if (!(data.e instanceof DragEvent)) return;

  dragstart({
    e: data.e,
    targetData: data.targetData,
  });
}

function dragstart(data: NodeDragEventData) {
  const dragState = initDrag(data);

  const multiDragConfig = data.targetData.parent.data.config.multiDragConfig;

  const selectedValues =
    multiDragConfig.selections &&
    multiDragConfig.selections(data.targetData.parent.el);

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

function handleTouchstart(data: NodeEventData) {
  if (!(data.e instanceof TouchEvent)) return;

  touchstart({
    e: data.e,
    targetData: data.targetData,
  });
}

function touchstart(data: NodeTouchEventData) {
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

export function handleSelections(
  data: NodeEventData,
  selectedValues: Array<any>,
  state: DragState | TouchState,
  x: number,
  y: number
) {
  for (const child of data.targetData.parent.data.enabledNodes) {
    if (child === state.draggedNode.el) continue;

    const childData = nodes.get(child);

    if (!childData) continue;

    if (!selectedValues.includes(childData.value)) continue;

    state.draggedNodes.push({
      el: child,
      data: childData,
    });
  }
  const config = data.targetData.parent.data.config.multiDragConfig;

  const clonedEls = state.draggedNodes.map((x: NodeRecord) => {
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

export function stackNodes({
  data,
  state,
  x,
  y,
}: {
  data: NodeEventData;
  state: DragState | TouchState;
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
