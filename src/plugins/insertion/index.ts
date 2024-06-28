import type {
  NodeDragEventData,
  ParentConfig,
  DragState,
  NodeTouchEventData,
  NodeRecord,
  TouchOverNodeEvent,
  ParentEventData,
  TouchOverParentEvent,
  ParentRecord,
  ParentData,
  Node,
  NodeData,
  SetupNodeData,
} from "../../types";
import {
  state,
  parents,
  handleEnd as originalHandleEnd,
  parentValues,
  setParentValues,
  nodeEventData,
  handleScroll,
  nodes,
  setupNodeRemap,
  remapFinished,
} from "../../index";
import { eventCoordinates, removeClass, addClass, throttle } from "../../utils";

export const insertionState = {
  draggedOverNodes: Array<NodeRecord<any>>(),
};

interface InsertionConfig<T> extends ParentConfig<T> {}

export function insertion<T>(
  insertionConfig: Partial<InsertionConfig<T>> = {}
) {
  return (parent: HTMLElement) => {
    const parentData = parents.get(parent);

    if (!parentData) return;

    const insertionParentConfig = {
      ...parentData.config,
      insertionConfig: insertionConfig,
    } as InsertionConfig<T>;

    return {
      setup() {
        insertionParentConfig.handleDragoverNode =
          insertionConfig.handleDragoverNode || handleDragoverNode;

        insertionParentConfig.handleDragoverParent =
          insertionConfig.handleDragoverParent || handleDragoverParent;

        insertionParentConfig.handleEnd =
          insertionConfig.handleEnd || handleEnd;

        parentData.config = insertionParentConfig;

        const observer = parentResizeObserver();

        setPosition(parentData, parent);

        observer.observe(parent);

        const div = document.createElement("div");

        div.id = "insertion-point";

        div.style.position = "absolute";

        div.style.backgroundColor = "green";

        div.style.display = "none";

        div.style.zIndex = "1000";

        document.body.appendChild(div);
      },
      setupNodeRemap(data: SetupNodeData<T>) {
        setPosition(data.nodeData, data.node);

        const observer = nodeResizeObserver();

        observer.observe(data.node);
      },

      remapFinished() {
        defineRanges(parentData.enabledNodes);
        console.log("enabled nodes", parentData.enabledNodes);
      },
    };
  };
}

function ascendingVertical<T>(node: NodeRecord<T>, nextNode?: NodeRecord<T>) {
  const center = node.data.top + node.data.height / 2;

  if (!nextNode) {
    return {
      y: [center, center + node.data.height],
      x: [node.data.left, node.data.right],
      vertical: true,
    };
  }

  const nextNodeCenter = nextNode.data.top + nextNode.data.height / 2;

  return {
    y: [center, center + Math.abs(center - nextNodeCenter) / 2],
    x: [node.data.left, node.data.right],
    vertical: true,
  };
}

function ascendingHorizontal<T>(node: NodeRecord<T>, nextNode?: NodeRecord<T>) {
  const center = node.data.left + node.data.width / 2;

  if (!nextNode) {
    return {
      x: [center, center + node.data.width],
      y: [node.data.top, node.data.bottom],
      vertical: false,
    };
  }

  const nextNodeCenter = nextNode.data.left + nextNode.data.width / 2;

  return {
    x: [center, center + Math.abs(center - nextNodeCenter) / 2],
    y: [node.data.top, node.data.bottom],
    vertical: false,
  };
}

function descendingVertical<T>(node: NodeRecord<T>, prevNode?: NodeRecord<T>) {
  const center = node.data.top + node.data.height / 2;

  if (!prevNode) {
    return {
      y: [center - node.data.height, center],
      x: [node.data.left, node.data.right],
      vertical: true,
    };
  }

  return {
    y: [
      prevNode.data.bottom + Math.abs(prevNode.data.bottom - node.data.top) / 2,
      center,
    ],
    x: [node.data.left, node.data.right],
    vertical: true,
  };
}

function descendingHorizontal<T>(
  node: NodeRecord<T>,
  prevNode?: NodeRecord<T>
) {
  const center = node.data.left + node.data.width / 2;

  if (!prevNode) {
    return {
      x: [center - node.data.width, center],
      y: [node.data.top, node.data.bottom],
      vertical: false,
    };
  }

  return {
    x: [
      prevNode.data.right + Math.abs(prevNode.data.right - node.data.left) / 2,
      center,
    ],
    y: [node.data.top, node.data.bottom],
    vertical: false,
  };
}

function getLayoutDirection<T>(el1: NodeRecord<T>, el2: NodeRecord<T>) {
  const isAboveOrBelow =
    el1.data.top > el2.data.bottom || el1.data.bottom < el2.data.top;

  return isAboveOrBelow ? "column" : "row";
}

function defineRanges<T>(enabledNodes: Array<NodeRecord<T>>) {
  enabledNodes.forEach((node, index) => {
    node.data.range = {};

    if (index !== enabledNodes.length - 1) {
      const vertical =
        getLayoutDirection(node, enabledNodes[index + 1]) === "column";
      node.data.range.ascending = vertical
        ? ascendingVertical(node, enabledNodes[index + 1])
        : ascendingHorizontal(node, enabledNodes[index + 1]);
    } else {
      const vertical =
        getLayoutDirection(node, enabledNodes[index - 1]) === "column";
      node.data.range.ascending = vertical
        ? ascendingVertical(node)
        : ascendingHorizontal(node);
    }

    if (index === 0) {
      const vertical =
        getLayoutDirection(node, enabledNodes[index + 1]) === "column";

      node.data.range.descending = vertical
        ? descendingVertical(node)
        : descendingHorizontal(node);
    } else {
      const vertical =
        getLayoutDirection(node, enabledNodes[index - 1]) === "column";

      node.data.range.descending = vertical
        ? descendingVertical(node, enabledNodes[index - 1])
        : descendingHorizontal(node, enabledNodes[index - 1]);
    }
  });
}

function setPosition<T>(data: NodeData<T> | ParentData<T>, el: HTMLElement) {
  const { top, bottom, left, right, height, width } =
    el.getBoundingClientRect();

  data.top = top;
  data.bottom = bottom;
  data.left = left;
  data.right = right;
  data.height = height;
  data.width = width;
}

function nodeResizeObserver() {
  const observer = new ResizeObserver((entries) => {
    for (const entry of entries) {
      const { target } = entry;

      const nodeData = nodes.get(target as Node);

      if (!nodeData) return;

      setPosition(nodeData, target as Node);
    }
  });

  return observer;
}

function parentResizeObserver() {
  const observer = new ResizeObserver((entries) => {
    for (const entry of entries) {
      const { target } = entry;

      if (!(target instanceof HTMLElement)) return;

      const parentData = parents.get(target);

      if (!parentData) return;

      setPosition(parentData, target);
    }
  });

  return observer;
}

export function handleDragoverNode<T>(data: NodeDragEventData<T>) {
  if (!state) return;

  if (data.targetData.parent.el !== state.lastParent.el) return;

  data.e.stopPropagation();

  data.e.preventDefault();

  const { x, y } = eventCoordinates(data.e as DragEvent);

  state.coordinates.y = y;

  state.coordinates.x = x;

  handleScroll();

  const foundRange = findClosest([data.targetData.node]);

  if (!foundRange) return;

  const position = foundRange[0].data.range[foundRange[1]];

  positionInsertionPoint(
    position,
    foundRange[1] === "ascending",
    foundRange[0]
  );

  data.e.stopPropagation();

  data.e.preventDefault();
}

function findClosest<T>(enabledNodes: NodeRecord<T>[]) {
  let foundRange: [NodeRecord<T>, string] | null = null;

  for (let x = 0; x < enabledNodes.length; x++) {
    if (!state || !enabledNodes[x].data.range) continue;

    if (enabledNodes[x].data.range.ascending) {
      if (
        state.coordinates.y > enabledNodes[x].data.range.ascending.y[0] &&
        state.coordinates.y < enabledNodes[x].data.range.ascending.y[1] &&
        state.coordinates.x > enabledNodes[x].data.range.ascending.x[0] &&
        state.coordinates.x < enabledNodes[x].data.range.ascending.x[1]
      ) {
        foundRange = [enabledNodes[x], "ascending"];

        return foundRange;
      }
    }

    if (enabledNodes[x].data.range.descending) {
      if (
        state.coordinates.y > enabledNodes[x].data.range.descending.y[0] &&
        state.coordinates.y < enabledNodes[x].data.range.descending.y[1] &&
        state.coordinates.x > enabledNodes[x].data.range.descending.x[0] &&
        state.coordinates.x < enabledNodes[x].data.range.descending.x[1]
      ) {
        foundRange = [enabledNodes[x], "descending"];

        return foundRange;
      }
    }
  }
}

export function handleDragoverParent<T>(data: ParentEventData<T>) {
  if (!state) return;

  if (data.targetData.parent.el !== state.lastParent.el) return;

  const { x, y } = eventCoordinates(data.e as DragEvent);

  state.coordinates.y = y;

  state.coordinates.x = x;

  handleScroll();

  const enabledNodes = data.targetData.parent.data.enabledNodes;

  const foundRange = findClosest(enabledNodes);

  if (!foundRange) return;

  const position = foundRange[0].data.range[foundRange[1]];

  positionInsertionPoint(
    position,
    foundRange[1] === "ascending",
    foundRange[0]
  );

  data.e.stopPropagation();

  data.e.preventDefault();
}

function positionInsertionPoint<T>(
  position: { x: number[]; y: number[]; vertical: boolean },
  ascending: boolean,
  node: NodeRecord<T>
) {
  const div = document.getElementById("insertion-point");

  if (!div) return;

  if (position.vertical) {
    const topPosition =
      position.y[ascending ? 1 : 0] - div.getBoundingClientRect().height / 2;

    div.style.top = `${topPosition}px`;

    const leftCoordinate = position.x[0];

    const rightCoordinate = position.x[1];

    div.style.left = `${leftCoordinate}px`;

    div.style.right = `${rightCoordinate}px`;

    div.style.height = "10px";

    div.style.width = rightCoordinate - leftCoordinate + "px";
  } else {
    const leftPosition =
      position.x[ascending ? 1 : 0] - div.getBoundingClientRect().width / 2;

    div.style.left = `${leftPosition}px`;

    const topCoordinate = position.y[0];

    const bottomCoordinate = position.y[1];

    div.style.top = `${topCoordinate}px`;

    div.style.bottom = `${bottomCoordinate}px`;

    div.style.width = "10px";

    div.style.height = bottomCoordinate - topCoordinate + "px";
  }

  insertionState.draggedOverNodes = [node];

  insertionState.targetIndex = node.data.index;

  insertionState.ascending = ascending;

  div.style.display = "block";
}

function handleEnd<T>(data: NodeDragEventData<T> | NodeTouchEventData<T>) {
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

  let index = insertionState.draggedOverNodes[0].data.index;

  console.log("original index", index);

  if (
    insertionState.targetIndex > state.draggedNodes[0].data.index &&
    !insertionState.ascending
  ) {
    index--;
  } else if (
    insertionState.targetIndex < state.draggedNodes[0].data.index &&
    insertionState.ascending
  ) {
    index++;
  }

  console.log("new indedx", index);

  newParentValues.splice(index, 0, ...draggedValues);

  setParentValues(data.targetData.parent.el, data.targetData.parent.data, [
    ...newParentValues,
  ]);

  const dropZoneClass =
    "touchedNode" in state
      ? data.targetData.parent.data.config.touchDropZoneClass
      : data.targetData.parent.data.config.dropZoneClass;

  removeClass(
    insertionState.draggedOverNodes.map((node) => node.el),
    dropZoneClass
  );

  const div = document.getElementById("insertion-point");

  if (!div) return;

  div.style.display = "none";

  originalHandleEnd(data);
}
