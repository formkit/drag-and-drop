import type {
  Node,
  NodeEventData,
  NodeRecord,
  DragState,
  TouchState,
  ParentData,
} from "../../types";

import type { MultiDragConfig } from "./types";

import {
  parents,
  nodes,
  remapNodes,
  NodeDragEventData,
  NodeTouchEventData,
  handleLongTouch,
  initDrag,
  initTouch,
  dragstartClasses,
  handleTouchedNode,
  end,
  state,
  resetState,
} from "../../index";

import { handleClass, copyNodeStyle, splitClass } from "../../utils";

export function multiDrag(multiDragConfig: Partial<MultiDragConfig> = {}) {
  return (parent: HTMLElement) => {
    const parentData = parents.get(parent);

    if (!parentData) return;

    return {
      tearDownParent() {},

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
    };
  };
}

function reapplyDragClasses(node: Node, parentData: ParentData) {
  if (!state) return;

  const dropZoneClass =
    "touchedNode" in state
      ? parentData.config.multiDragConfig.touchDropZoneClass
      : parentData.config.multiDragConfig.dropZoneClass;

  const nodeValue = nodes.get(node)?.value;

  const draggedValues = state.draggedNodes.map((x) => x.data.value);

  if (!draggedValues.includes(nodeValue)) return;

  handleClass([node], dropZoneClass);
}

function handleDragend(data: NodeDragEventData) {
  if (!state) return;

  end(data, state);

  selectionsEnd(data);

  resetState();
}

function selectionsEnd(data: NodeEventData) {
  const config = data.targetData.parent.data.config.multiDragConfig;

  const root = config.root || document;

  const isTouch = data.e instanceof TouchEvent;

  const dropZoneClass = isTouch
    ? config.selectionDropZoneClass
    : config.touchSelectionDraggingClass;

  if (dropZoneClass) {
    const elsWithDropZoneClass = root.querySelectorAll(
      `.${splitClass(dropZoneClass)}`
    );

    handleClass(Array.from(elsWithDropZoneClass), dropZoneClass, true);
  }
}

function handleDragstart(data: NodeDragEventData) {
  const dragState = initDrag(data);

  const multiDragConfig = data.targetData.parent.data.config.multiDragConfig;

  const selectedNodes =
    multiDragConfig.selections &&
    multiDragConfig.selections(data.targetData.parent.el);

  if (Array.isArray(selectedNodes) && selectedNodes.length) {
    const targetRect = data.targetData.node.el.getBoundingClientRect();

    const [x, y] = [
      data.e.clientX - targetRect.left,
      data.e.clientY - targetRect.top,
    ];

    stackNodes(handleSelections(data, selectedNodes, dragState, x, y));
  } else {
    const config = data.targetData.parent.data.config;

    dragstartClasses(
      dragState.draggedNode.el,
      config.draggingClass,
      config.dropZoneClass
    );
  }
}

function handleTouchstart(data: NodeTouchEventData) {
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
  selectedNodes: Array<Node>,
  state: DragState | TouchState,
  x: number,
  y: number
) {
  for (const node of selectedNodes) {
    if (node !== data.targetData.node.el) {
      const nodeData = nodes.get(node);

      if (!nodeData) continue;

      state.draggedNodes.push({
        el: node,
        data: nodeData,
      });
    }
  }

  const config = data.targetData.parent.data.config.multiDragConfig;

  const clonedEls = state.draggedNodes.map((x: NodeRecord) => {
    const el = x.el.cloneNode(true) as Node;

    copyNodeStyle(x.el, el, true);

    if (data.e instanceof DragEvent) handleClass([el], config.draggingClass);

    return el;
  });

  setTimeout(() => {
    if (data.e instanceof DragEvent) {
      handleClass(
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
