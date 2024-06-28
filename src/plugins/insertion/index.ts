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
import { eventCoordinates, addEvents, throttle } from "../../utils";

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

        parentData.config = insertionParentConfig;

        const observer = parentResizeObserver();

        setPosition(parentData, parent);

        observer.observe(parent);

        const div = document.createElement("div");

        div.id = "insertion-point";

        div.style.height = "10px";

        div.style.position = "absolute";

        div.style.backgroundColor = "red";

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
        // setTimeout(() => {
        //   defineRanges(data.enabledNodes);
        // }, 2000);
      },
    };
  };
}

function getAscendingRange<T>(
  node: NodeRecord<T>,
  nextNode?: NodeRecord<T>,
  isVertical?: boolean
) {
  const center = node.data.top + node.data.height / 2;

  if (!nextNode) {
    return {
      y: [center, center + node.data.height],
      x: [node.data.left, node.data.right],
    };
  }

  const nextNodeCenter = nextNode.data.top + nextNode.data.height / 2;

  return {
    y: [center, center + Math.abs(center - nextNodeCenter) / 2],
    x: [node.data.left, node.data.right],
  };
}

function getDescendingRange<T>(
  node: NodeRecord<T>,
  prevNode?: NodeRecord<T>,
  isVertical?: boolean
) {
  const center = node.data.top + node.data.height / 2;

  if (!prevNode) {
    return {
      y: [center - node.data.height, center],
      x: [node.data.left, node.data.right],
    };
  }

  return {
    y: [
      prevNode.data.bottom + Math.abs(prevNode.data.bottom - node.data.top) / 2,
      center,
    ],
    x: [node.data.left, node.data.right],
  };
}

function defineRanges<T>(enabledNodes: Array<NodeRecord<T>>) {
  enabledNodes.forEach((node, index) => {
    node.data.range = {};
    if (index !== enabledNodes.length - 1) {
      node.data.range.ascending = getAscendingRange(
        node,
        enabledNodes[index + 1],
        node.data.top < enabledNodes[index + 1].data.bottom
      );
    } else {
      node.data.range.ascending = getAscendingRange(node, undefined);
    }
    if (index === 0) {
      node.data.range.descending = getDescendingRange(node, undefined);
    } else {
      node.data.range.descending = getDescendingRange(
        node,
        enabledNodes[index - 1],
        node.data.top > enabledNodes[index - 1].data.bottom
      );
    }
  });
  console.log(enabledNodes);
}

function setPosition<T>(data: NodeData<T> | ParentData<T>, el: HTMLElement) {
  const { top, bottom, left, right, height } = el.getBoundingClientRect();

  data.top = top;
  data.bottom = bottom;
  data.left = left;
  data.right = right;
  data.height = height;
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

  data.e.stopPropagation();

  data.e.preventDefault();

  return;

  const { x, y } = eventCoordinates(data.e as DragEvent);

  state.coordinates.y = y;

  state.coordinates.x = x;

  handleScroll();

  const closestChild = findClosest(
    state.coordinates.x,
    state.coordinates.y,
    [data.targetData.node],
    true
  );

  console.log("in node", closestChild);

  // const closestChild = findClosest(
  //   state.coordinates.x,
  //   state.coordinates.y,
  //   data.targetData.parent.data.enabledNodes
  // );
}

export function handleDragoverParent<T>(data: ParentEventData<T>) {
  console.log("dragover parent");
  if (!state) return;

  const { x, y } = eventCoordinates(data.e as DragEvent);

  state.coordinates.y = y;

  state.coordinates.x = x;

  handleScroll();

  const enabledNodes = data.targetData.parent.data.enabledNodes;

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

        break;
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

        break;
      }
    }
  }

  if (!foundRange) return;

  console.log("found range", foundRange[0].data.range);

  const div = document.getElementById("insertion-point");

  if (!div) return;

  div.style.display = "block";

  const position = foundRange[0].data.range[foundRange[1]];

  console.log("position[0]", position.y[0]);
  console.log("position[1]", position.y[1]);

  const topPosition =
    position.y[foundRange[1] === "ascending" ? 1 : 0] -
    div.getBoundingClientRect().height / 2;

  console.log("top position", topPosition);

  div.style.top = `${topPosition}px`;

  const leftCoordinate = position.x[0];

  const rightCoordinate = position.x[1];

  div.style.left = `${leftCoordinate}px`;

  div.style.right = `${rightCoordinate}px`;

  // console.log("parent closest", closestChild);

  // if (!closestChild) return;

  data.e.stopPropagation();

  data.e.preventDefault();

  // transfer(data, state);
}

// function findClosest(cursorX: number, cursorY: number, nodes: NodeRecord<T>[]) {
//   let closestNode = null;
//   let minDistance = 100;
//   let closestDistance = Infinity;

//   nodes.forEach((node) => {
//     const yDistances = [
//       { side: "top", distance: Math.abs(cursorY - node.data.top) },
//       { side: "bottom", distance: Math.abs(cursorY - node.data.bottom) },
//     ];

//     const xDistances = [
//       { side: "left", distance: Math.abs(cursorX - node.data.left) },
//       { side: "right", distance: Math.abs(cursorX - node.data.right) },
//     ];

//     const closestY = yDistances.reduce((prev, current) =>
//       prev.distance < current.distance ? prev : current
//     );

//     const closestX = xDistances.reduce((prev, current) =>
//       prev.distance < current.distance ? prev : current
//     );

//     const closestSide =
//       closestY.distance < closestX.distance ? closestY : closestX;

//     if (
//       (closestSide.distance < closestDistance &&
//         ["left", "right"].includes(closestSide.side) &&
//         closestY.distance < minDistance) ||
//       (["top", "bottom"].includes(closestSide.side) &&
//         closestX.distance < minDistance)
//     ) {
//       console.log("getting here");
//       closestDistance = closestSide.distance;
//       closestNode = { ...node, closestSide: closestSide.side };
//     }
//   });

//   return closestNode;
// }

/**
 * Returns the node
 *
 * @param parent
 * @returns Node | HTMLElement | null
 */
function placeIndicator<T>(
  cursorX: number,
  cursorY: number,
  nodes: NodeRecord<T>[]
) {
  const closestNode = findClosestNode(cursorX, cursorY, nodes);

  if (!closestNode) return;

  console.log(closestNode.el.id);
}

// function findClosestNode<T>(
//   cursorX: number,
//   cursorY: number,
//   nodes: NodeRecord<T>[]
// ) {
//   let closestNode = null;
//   let closestDistanceY = Infinity;
//   let closestDistanceX = Infinity;

//   nodes.forEach((node, index) => {
//     const yDistances = [
//       { side: "top", distance: Math.abs(cursorY - node.data.top) },
//       { side: "bottom", distance: Math.abs(cursorY - node.data.bottom) },
//     ];

//     const xDistances = [
//       { side: "left", distance: Math.abs(cursorX - node.data.left) },
//       { side: "right", distance: Math.abs(cursorX - node.data.right) },
//     ];

//     const closestY = yDistances.reduce((prev, current) =>
//       prev.distance < current.distance ? prev : current
//     );

//     const closestX = xDistances.reduce((prev, current) =>
//       prev.distance < current.distance ? prev : current
//     );

//     const closestSide =
//       closestY.distance < closestX.distance ? closestY : closestX;

//     // console.log("closest side", closestSide, closestY, closestX);

//     if (
//       (["left", "right"].includes(closestSide.side) &&
//         closestSide.distance <= closestDistanceX &&
//         closestY.distance <= closestDistanceY) ||
//       (["top", "bottom"].includes(closestSide.side) &&
//         closestSide.distance <= closestDistanceY &&
//         closestX.distance <= closestDistanceX)
//     ) {
//       closestDistanceY = closestY.distance;
//       closestDistanceX = closestX.distance;
//       closestNode = {
//         ...node,
//         index,
//         closestSide: closestSide,
//         closestY: closestY,
//         closestX: closestX,
//       };
//     }
//   });

//   return closestNode;
// }
