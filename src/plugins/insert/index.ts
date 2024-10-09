import type { InsertConfig } from "../../types";
import type {
  DragState,
  NodeDragEventData,
  NodeRecord,
  ParentEventData,
  PointeroverParentEvent,
  ParentRecord,
  SynthDragState,
  InsertEvent,
  InsertState,
} from "../../types";

import {
  parents,
  parentValues,
  setParentValues,
  state,
  addParentClass,
  isDragState,
  isSynthDragState,
  eventCoordinates,
  removeClass,
  addEvents,
} from "../../index";

export const insertState: InsertState<unknown> = {
  draggedOverNodes: [],
  draggedOverParent: null,
  targetIndex: 0,
  ascending: false,
  coordinates: { x: 0, y: 0 },
  insertPoint: null,
  dragging: false,
};

let documentController: AbortController | undefined;

// WIP: This is a work in progress and not yet fully functional
export function insert<T>(insertConfig: InsertConfig<T>) {
  return (parent: HTMLElement) => {
    const parentData = parents.get(parent);

    if (!parentData) return;

    const insertParentConfig = {
      ...parentData.config,
      insertConfig,
    };

    return {
      teardown() {
        if (parentData.abortControllers.root) {
          parentData.abortControllers.root.abort();
        }
      },
      setup() {
        insertParentConfig.handleNodeDragover =
          insertConfig.handleNodeDragover || handleNodeDragover;

        insertParentConfig.handleParentPointerover =
          insertConfig.handleParentPointerover || handleParentPointerover;

        insertParentConfig.handleNodePointerover =
          insertConfig.handleNodePointerover || handleParentPointerover;

        insertParentConfig.handleParentDragover =
          insertConfig.handleParentDragover || handleParentDragover;

        const originalHandleend = insertParentConfig.handleEnd;

        insertParentConfig.handleEnd = (
          state: DragState<T> | SynthDragState<T>
        ) => {
          handleEnd(state);

          originalHandleend(state);
        };

        parentData.on("dragStarted", () => {
          documentController = addEvents(document, {
            dragover: checkPosition,
            pointermove: checkPosition,
          });
        });

        parentData.on("dragEnded", () => {
          documentController?.abort();
        });

        parentData.config = insertParentConfig;

        state.on("dragStarted", () => {
          const insertPoint = parentData.config.insertConfig?.insertPoint({
            el: parent,
            data: parentData,
          });

          if (!insertPoint) return;

          if (!document.body.contains(insertPoint))
            document.body.appendChild(insertPoint);

          Object.assign(insertPoint, {
            position: "absolute",
            display: "none",
          });

          insertState.insertPoint = insertPoint;
        });

        window.addEventListener("scroll", defineRanges.bind(null, parent));

        window.addEventListener("resize", defineRanges.bind(null, parent));
      },

      remapFinished() {
        defineRanges(parent);
      },
    };
  };
}

function checkPosition(e: DragEvent | PointerEvent) {
  if (!isDragState(state)) return;

  const el = document.elementFromPoint(e.clientX, e.clientY);

  if (!(el instanceof HTMLElement)) return;

  if (!parents.has(el)) {
    const insertPoint = insertState.insertPoint;

    if (insertPoint && insertPoint === el) return;

    if (insertPoint) insertPoint.style.display = "none";

    if (insertState.draggedOverParent) {
      removeClass(
        [insertState.draggedOverParent.el],
        insertState.draggedOverParent.data.config.dropZoneClass
      );
    }

    insertState.draggedOverNodes = [];

    insertState.draggedOverParent = null;

    state.currentParent = state.initialParent;
  }
}

function ascendingVertical(
  nodeCoords: Coordinates,
  nextNodeCoords?: Coordinates
) {
  const center = nodeCoords.top + nodeCoords.height / 2;

  if (!nextNodeCoords) {
    return {
      y: [center, center + nodeCoords.height / 2 + 10],
      x: [nodeCoords.left, nodeCoords.right],
      vertical: true,
    };
  }

  return {
    y: [
      center,
      nodeCoords.bottom + Math.abs(nodeCoords.bottom - nextNodeCoords.top) / 2,
    ],
    x: [nodeCoords.left, nodeCoords.right],
    vertical: true,
  };
}

function descendingVertical(
  nodeCoords: Coordinates,
  prevNodeCoords?: Coordinates
) {
  const center = nodeCoords.top + nodeCoords.height / 2;

  if (!prevNodeCoords) {
    return {
      y: [center - nodeCoords.height / 2 - 10, center],
      x: [nodeCoords.left, nodeCoords.right],
      vertical: true,
    };
  }

  return {
    y: [
      prevNodeCoords.bottom +
        Math.abs(prevNodeCoords.bottom - nodeCoords.top) / 2,
      center,
    ],
    x: [nodeCoords.left, nodeCoords.right],
    vertical: true,
  };
}

function ascendingHorizontal(
  nodeCoords: Coordinates,
  nextNodeCoords?: Coordinates,
  lastInRow = false
) {
  const center = nodeCoords.left + nodeCoords.width / 2;

  if (!nextNodeCoords) {
    return {
      x: [center, center + nodeCoords.width],
      y: [nodeCoords.top, nodeCoords.bottom],
      vertical: false,
    };
  }

  if (lastInRow) {
    return {
      x: [center, nodeCoords.right + 10],
      y: [nodeCoords.top, nodeCoords.bottom],
      vertical: false,
    };
  } else {
    const nextNodeCenter = nextNodeCoords.left + nextNodeCoords.width / 2;

    return {
      x: [center, center + Math.abs(center - nextNodeCenter) / 2],
      y: [nodeCoords.top, nodeCoords.bottom],
      vertical: false,
    };
  }
}

function descendingHorizontal(
  nodeCoords: Coordinates,
  prevNodeCoords?: Coordinates
) {
  const center = nodeCoords.left + nodeCoords.width / 2;

  if (!prevNodeCoords) {
    return {
      x: [nodeCoords.left - 10, center],
      y: [nodeCoords.top, nodeCoords.bottom],
      vertical: false,
    };
  }

  return {
    x: [
      prevNodeCoords.right +
        Math.abs(prevNodeCoords.right - nodeCoords.left) / 2,
      center,
    ],
    y: [nodeCoords.top, nodeCoords.bottom],
    vertical: false,
  };
}

interface Coordinates {
  top: number;
  bottom: number;
  left: number;
  right: number;
  height: number;
  width: number;
}

function getRealCoords(el: HTMLElement): Coordinates {
  const { top, bottom, left, right, height, width } =
    el.getBoundingClientRect();

  const scrollLeft = window.scrollX || document.documentElement.scrollLeft;
  const scrollTop = window.scrollY || document.documentElement.scrollTop;

  const adjustedTop = top + scrollTop;
  const adjustedBottom = bottom + scrollTop;
  const adjustedLeft = left + scrollLeft;
  const adjustedRight = right + scrollLeft;

  return {
    top: adjustedTop,
    bottom: adjustedBottom,
    left: adjustedLeft,
    right: adjustedRight,
    height,
    width,
  };
}

function defineRanges(parent: HTMLElement) {
  const parentData = parents.get(parent);

  if (!parentData) return;

  const enabledNodes = parentData.enabledNodes;

  enabledNodes.forEach((node, index) => {
    node.data.range = {};

    let aboveOrBelowPrevious = false;

    let aboveOrBelowAfter = false;

    let prevNodeCoords = undefined;

    let nextNodeCoords = undefined;

    if (enabledNodes[index - 1])
      prevNodeCoords = getRealCoords(enabledNodes[index - 1].el);

    if (enabledNodes[index + 1])
      nextNodeCoords = getRealCoords(enabledNodes[index + 1].el);

    const nodeCoords = getRealCoords(node.el);

    if (prevNodeCoords) {
      aboveOrBelowPrevious =
        nodeCoords.top > prevNodeCoords.bottom ||
        nodeCoords.bottom < prevNodeCoords.top;
    }

    if (nextNodeCoords) {
      aboveOrBelowAfter =
        nodeCoords.top > nextNodeCoords.bottom ||
        nodeCoords.bottom < nextNodeCoords.top;
    }

    const fullishWidth =
      parent.getBoundingClientRect().width * 0.8 < nodeCoords.width;

    if (fullishWidth) {
      node.data.range.ascending = ascendingVertical(nodeCoords, nextNodeCoords);
      node.data.range.descending = descendingVertical(
        nodeCoords,
        prevNodeCoords
      );
    } else if (aboveOrBelowAfter && !aboveOrBelowPrevious) {
      node.data.range.ascending = ascendingHorizontal(
        nodeCoords,
        nextNodeCoords,
        true
      );
      node.data.range.descending = descendingHorizontal(
        nodeCoords,
        prevNodeCoords
      );
    } else if (!aboveOrBelowPrevious && !aboveOrBelowAfter) {
      node.data.range.ascending = ascendingHorizontal(
        nodeCoords,
        nextNodeCoords
      );
      node.data.range.descending = descendingHorizontal(
        nodeCoords,
        prevNodeCoords
      );
    } else if (aboveOrBelowPrevious && !nextNodeCoords) {
      node.data.range.ascending = ascendingHorizontal(nodeCoords);
    } else if (aboveOrBelowPrevious && !aboveOrBelowAfter) {
      node.data.range.ascending = ascendingHorizontal(
        nodeCoords,
        nextNodeCoords
      );

      node.data.range.descending = descendingHorizontal(nodeCoords);
    }
  });
}

export function handleNodeDragover<T>(data: NodeDragEventData<T>) {
  data.e.preventDefault();
}

export function handleParentDragover<T>(
  data: ParentEventData<T>,
  state: DragState<T>
) {
  if (!state || !insertState) return;

  data.e.stopPropagation();

  data.e.preventDefault();

  const { x, y } = eventCoordinates(data.e as DragEvent | PointerEvent);

  // Get the client coordinates
  const clientX = x;
  const clientY = y;

  // Get the scroll positions
  const scrollLeft = window.scrollX || document.documentElement.scrollLeft;
  const scrollTop = window.scrollY || document.documentElement.scrollTop;

  // Calculate the coordinates relative to the entire document
  insertState.coordinates.x = clientX + scrollLeft;
  insertState.coordinates.y = clientY + scrollTop;

  const nestedParent = data.targetData.parent.data.nestedParent;

  let realTargetParent = data.targetData.parent;

  if (nestedParent) {
    const rect = nestedParent.el.getBoundingClientRect();

    if (
      insertState.coordinates.y > rect.top &&
      insertState.coordinates.y < rect.bottom
    )
      realTargetParent = nestedParent;
  }

  realTargetParent.el === state.currentParent?.el
    ? moveBetween(realTargetParent)
    : moveOutside(realTargetParent, state);

  state.currentParent = realTargetParent;
}

export function moveBetween<T>(data: ParentRecord<T>) {
  if (data.data.config.sortable === false) return;

  if (
    data.el === insertState.draggedOverParent?.el &&
    insertState.draggedOverParent.data.getValues(data.el).length === 0
  ) {
    return;
  } else if (insertState.draggedOverParent?.el) {
    removeClass(
      [insertState.draggedOverParent.el],
      insertState.draggedOverParent.data.config.dropZoneClass
    );
    insertState.draggedOverParent = null;
  }

  const foundRange = findClosest(data.data.enabledNodes);

  if (!foundRange) return;

  const key = foundRange[1] as "ascending" | "descending";

  if (foundRange) {
    const position = foundRange[0].data.range
      ? foundRange[0].data.range[key]
      : undefined;

    if (position)
      positioninsertPoint(
        position,
        foundRange[1] === "ascending",
        foundRange[0]
      );
  }
}

function moveOutside<T>(data: ParentRecord<T>, state: DragState<T>) {
  if (data.el === state.currentParent.el) return false;

  const targetConfig = data.data.config;

  if (targetConfig.treeGroup && state.draggedNode.el.contains(data.el))
    return false;

  if (targetConfig.dropZone === false) return false;

  const initialParentConfig = state.initialParent.data.config;

  if (targetConfig.accepts) {
    return targetConfig.accepts(
      data,
      state.initialParent,
      state.currentParent,
      state
    );
  } else if (
    !targetConfig.group ||
    targetConfig.group !== initialParentConfig.group
  ) {
    return false;
  }

  const values = data.data.getValues(data.el);

  if (!values.length) {
    addParentClass([data.el], targetConfig.dropZoneClass);

    insertState.draggedOverParent = data as ParentRecord<unknown>;

    const insertPoint = insertState.insertPoint;

    if (insertPoint) insertPoint.style.display = "none";
  } else {
    removeClass([state.currentParent.el], targetConfig.dropZoneClass);

    const enabledNodes = data.data.enabledNodes;

    const foundRange = findClosest(enabledNodes);

    if (!foundRange) return;

    const key = foundRange[1] as "ascending" | "descending";

    if (foundRange) {
      const position = foundRange[0].data.range
        ? foundRange[0].data.range[key]
        : undefined;

      if (position)
        positioninsertPoint(
          position,
          foundRange[1] === "ascending",
          foundRange[0]
        );
    }
  }
}

function findClosest<T>(enabledNodes: NodeRecord<T>[]) {
  let foundRange: [NodeRecord<T>, string] | null = null;

  for (let x = 0; x < enabledNodes.length; x++) {
    if (!state || !enabledNodes[x].data.range) continue;

    if (enabledNodes[x].data.range!.ascending) {
      if (
        insertState.coordinates.y >
          enabledNodes[x].data.range!.ascending!.y[0] &&
        insertState.coordinates.y <
          enabledNodes[x].data.range!.ascending!.y[1] &&
        insertState.coordinates.x >
          enabledNodes[x].data.range!.ascending!.x[0] &&
        insertState.coordinates.x < enabledNodes[x].data.range!.ascending!.x[1]
      ) {
        foundRange = [enabledNodes[x], "ascending"];

        return foundRange;
      }
    }

    if (enabledNodes[x].data.range!.descending) {
      if (
        insertState.coordinates.y >
          enabledNodes[x].data.range!.descending!.y[0] &&
        insertState.coordinates.y <
          enabledNodes[x].data.range!.descending!.y[1] &&
        insertState.coordinates.x >
          enabledNodes[x].data.range!.descending!.x[0] &&
        insertState.coordinates.x < enabledNodes[x].data.range!.descending!.x[1]
      ) {
        foundRange = [enabledNodes[x], "descending"];

        return foundRange;
      }
    }
  }
}

export function handleParentPointerover<T>(
  data: PointeroverParentEvent<T>,
  state: SynthDragState<T>
) {
  data.detail.e.stopPropagation();

  const { x, y } = eventCoordinates(data.detail.e as PointerEvent);

  state.coordinates.y = y;

  state.coordinates.x = x;

  const nestedParent = data.detail.targetData.parent.data.nestedParent;

  let realTargetParent = data.detail.targetData.parent;

  if (nestedParent) {
    const rect = nestedParent.el.getBoundingClientRect();

    if (state.coordinates.y > rect.top && state.coordinates.y < rect.bottom)
      realTargetParent = nestedParent;
  }

  const enabledNodes = realTargetParent.data.enabledNodes;

  const foundRange = findClosest(enabledNodes);

  if (!foundRange) return;

  const key = foundRange[1] as "ascending" | "descending";

  if (foundRange) {
    const position = foundRange[0].data.range
      ? foundRange[0].data.range[key]
      : undefined;

    if (position)
      positioninsertPoint(
        position,
        foundRange[1] === "ascending",
        foundRange[0]
      );
  }

  data.detail.targetData.parent.el === state.currentParent.el
    ? moveBetween(realTargetParent)
    : moveOutside(realTargetParent, state);
}

function positioninsertPoint<T>(
  position: { x: number[]; y: number[]; vertical: boolean },
  ascending: boolean,
  node: NodeRecord<T>
) {
  if (!state) return;

  insertState.draggedOverNodes = [node];

  if (!insertState.insertPoint) return;

  if (position.vertical) {
    const topPosition =
      position.y[ascending ? 1 : 0] -
      insertState.insertPoint.getBoundingClientRect().height / 2;

    insertState.insertPoint.style.top = `${topPosition}px`;

    const leftCoordinate = position.x[0];

    const rightCoordinate = position.x[1];

    insertState.insertPoint.style.left = `${leftCoordinate}px`;

    insertState.insertPoint.style.right = `${rightCoordinate}px`;

    insertState.insertPoint.style.height = "4px";

    insertState.insertPoint.style.width =
      rightCoordinate - leftCoordinate + "px";
  } else {
    const leftPosition =
      position.x[ascending ? 1 : 0] -
      insertState.insertPoint.getBoundingClientRect().width / 2;
    insertState.insertPoint.style.left = `${leftPosition}px`;

    const topCoordinate = position.y[0];

    const bottomCoordinate = position.y[1];

    insertState.insertPoint.style.top = `${topCoordinate}px`;

    insertState.insertPoint.style.bottom = `${bottomCoordinate}px`;

    insertState.insertPoint.style.width = "4px";

    insertState.insertPoint.style.height =
      bottomCoordinate - topCoordinate + "px";
  }

  insertState.targetIndex = node.data.index;

  insertState.ascending = ascending;

  insertState.insertPoint.style.display = "block";
}

export function handleParentDrop<T>(_data: NodeDragEventData<T>) {}

export function handleEnd<T>(state: DragState<T> | SynthDragState<T>) {
  const insertPoint = insertState.insertPoint;

  if (!insertState.draggedOverParent) {
    const draggedParentValues = parentValues(
      state.initialParent.el,
      state.initialParent.data
    );

    const transferred = state.initialParent.el !== state.currentParent.el;

    const draggedValues = state.draggedNodes.map((node) => node.data.value);

    //const originalIndex = state.draggedNodes[0].data.index;

    //const targetIndex = insertState.targetIndex;

    if (
      !transferred &&
      insertState.draggedOverNodes[0] &&
      insertState.draggedOverNodes[0].el !== state.draggedNodes[0].el
    ) {
      const newParentValues = [
        ...draggedParentValues.filter((x) => !draggedValues.includes(x)),
      ];

      let index = insertState.draggedOverNodes[0].data.index;

      if (
        insertState.targetIndex > state.draggedNodes[0].data.index &&
        !insertState.ascending
      ) {
        index--;
      } else if (
        insertState.targetIndex < state.draggedNodes[0].data.index &&
        insertState.ascending
      ) {
        index++;
      }

      newParentValues.splice(index, 0, ...draggedValues);

      setParentValues(state.initialParent.el, state.initialParent.data, [
        ...newParentValues,
      ]);

      if (state.initialParent.data.config.onSort) {
        //const sortEventData = {
        //  parent: {
        //    state.initialParent.el,
        //    state.initialParent.data,
        //  },
        //  previousValues: [...draggedParentValues],
        //  state.initialParent.data.enabledNodes],
        //  values: [...newParentValues],
        //  draggedNode: state.draggedNode,
        //  previousPosition: originalIndex,
        //  position: index,
        //};
        //state.initialParent.data.config.onSort(sortEventData);
      }
    } else if (transferred && insertState.draggedOverNodes.length) {
      const targetParentValues = parentValues(
        state.currentParent.el,
        state.currentParent.data
      );
      const draggedParentValues = parentValues(
        state.initialParent.el,
        state.initialParent.data
      );

      // For the time being, we will not be remoing the value of the original dragged parent.
      let index = insertState.draggedOverNodes[0].data.index || 0;

      if (insertState.ascending) index++;

      const insertValues = state.dynamicValues.length
        ? state.dynamicValues
        : draggedValues;

      targetParentValues.splice(index, 0, ...insertValues);

      setParentValues(state.currentParent.el, state.currentParent.data, [
        ...targetParentValues,
      ]);

      draggedParentValues.splice(state.initialIndex, draggedValues.length);

      setParentValues(state.initialParent.el, state.initialParent.data, [
        ...draggedParentValues,
      ]);

      const data: InsertEvent<T> = {
        sourceParent: state.initialParent,
        targetParent: state.currentParent,
        draggedNodes: state.draggedNodes,
        targetNodes: insertState.draggedOverNodes as NodeRecord<T>[],
        state,
      };

      if (state.initialParent.data.config.insertConfig?.insertEvent)
        state.initialParent.data.config.insertConfig.insertEvent(data);
      if (state.currentParent.data.config.insertConfig?.insertEvent)
        state.currentParent.data.config.insertConfig.insertEvent(data);
    }
  } else if (insertState.draggedOverParent) {
    const draggedValues = state.draggedNodes.map((node) => node.data.value);

    const draggedParentValues = parentValues(
      state.initialParent.el,
      state.initialParent.data
    );
    const newParentValues = [
      ...draggedParentValues.filter((x) => !draggedValues.includes(x)),
    ];
    const draggedOverParentValues = parentValues(
      insertState.draggedOverParent.el,
      insertState.draggedOverParent.data
    );

    const insertValues = state.dynamicValues.length
      ? state.dynamicValues
      : draggedValues;

    draggedOverParentValues.push(...insertValues);

    setParentValues(
      insertState.draggedOverParent.el,
      insertState.draggedOverParent.data,
      [...draggedOverParentValues]
    );

    setParentValues(state.initialParent.el, state.initialParent.data, [
      ...newParentValues,
    ]);

    const data: InsertEvent<T> = {
      sourceParent: state.initialParent,
      targetParent: state.currentParent,
      draggedNodes: state.draggedNodes,
      targetNodes: insertState.draggedOverNodes as NodeRecord<T>[],
      state,
    };

    if (state.initialParent.data.config.insertConfig?.insertEvent)
      state.initialParent.data.config.insertConfig.insertEvent(data);
    if (state.currentParent.data.config.insertConfig?.insertEvent)
      state.currentParent.data.config.insertConfig.insertEvent(data);

    removeClass(
      [insertState.draggedOverParent.el],
      insertState.draggedOverParent.data.config.dropZoneClass
    );
  }

  if (insertPoint) insertPoint.style.display = "none";

  const dropZoneClass = isSynthDragState(state)
    ? state.initialParent.data.config.synthDropZoneClass
    : state.initialParent.data.config.dropZoneClass;

  removeClass(
    insertState.draggedOverNodes.map((node) => node.el),
    dropZoneClass
  );

  const dragPlaceholderClass =
    state.initialParent.data.config.dragPlaceholderClass;

  removeClass(
    state.draggedNodes.map((node) => node.el),
    dragPlaceholderClass
  );

  insertState.draggedOverNodes = [];

  insertState.draggedOverParent = null;
}
