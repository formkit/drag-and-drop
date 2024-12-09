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
  BaseDragState,
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
  eq,
  remapNodes,
} from "../../index";

export const insertState: InsertState<unknown> = {
  draggedOverNodes: [],
  draggedOverParent: null,
  targetIndex: 0,
  ascending: false,
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
          defineRanges(parent);
        });

        state.on("scrollStarted", () => {
          if (insertState.insertPoint)
            insertState.insertPoint.el.style.display = "none";
        });

        state.on("scrollEnded", () => {
          defineRanges(parent);
        });

        const firstScrollableParent = findFirstOverflowingParent(parent);

        if (firstScrollableParent) {
          firstScrollableParent.addEventListener(
            "scroll",
            defineRanges.bind(null, parent)
          );
        }

        //window.addEventListener("scroll", defineRanges.bind(null, parent));

        window.addEventListener("resize", defineRanges.bind(null, parent));
      },
    };
  };
}

function findFirstOverflowingParent(element: HTMLElement): HTMLElement | null {
  let parent = element.parentElement;

  while (parent) {
    const { overflow, overflowY, overflowX } = getComputedStyle(parent);

    // Check if the overflow property is set to scroll, auto, or hidden (anything other than visible)
    const isOverflowSet =
      overflow !== "visible" ||
      overflowY !== "visible" ||
      overflowX !== "visible";

    // Check if there is actual overflow (scrolling)
    const isOverflowing =
      parent.scrollHeight > parent.clientHeight ||
      parent.scrollWidth > parent.clientWidth;
    const hasScrollPosition = parent.scrollTop > 0 || parent.scrollLeft > 0;

    if (isOverflowSet && (isOverflowing || hasScrollPosition)) {
      return parent;
    }

    parent = parent.parentElement;
  }

  return null; // No overflowing parent found
}

function checkPosition(e: DragEvent | PointerEvent) {
  if (!isDragState(state)) return;

  const el = document.elementFromPoint(e.clientX, e.clientY);

  if (!(el instanceof HTMLElement)) return;

  if (!parents.has(el)) {
    const insertPoint = insertState.insertPoint;

    if (insertPoint?.el === el) return;

    if (insertPoint) insertPoint.el.style.display = "none";

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
  if (!isDragState(state)) return;

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
  const config = data.targetData.parent.data.config;

  if (!config.nativeDrag) return;

  data.e.preventDefault();
}

function processParentDragEvent<T>(
  event: DragEvent | PointerEvent,
  targetData: ParentEventData<T>["targetData"],
  state: DragState<T>,
  isNativeDrag: boolean
) {
  const config = targetData.parent.data.config;

  if (!isNativeDrag && config.nativeDrag) return;

  event.stopPropagation();

  if (isNativeDrag) event.preventDefault();

  const { x, y } = eventCoordinates(event);

  // Calculate global coordinates
  const clientX = x;
  const clientY = y;

  const scrollLeft = window.scrollX || document.documentElement.scrollLeft;
  const scrollTop = window.scrollY || document.documentElement.scrollTop;

  state.coordinates.x = clientX + scrollLeft;
  state.coordinates.y = clientY + scrollTop;

  const nestedParent = targetData.parent.data.nestedParent;

  let realTargetParent = targetData.parent;

  if (nestedParent) {
    const rect = nestedParent.el.getBoundingClientRect();

    if (state.coordinates.y > rect.top && state.coordinates.y < rect.bottom)
      realTargetParent = nestedParent;
  }

  if (realTargetParent.el === state.currentParent?.el) {
    moveBetween(realTargetParent, state);
  } else {
    moveOutside(realTargetParent, state);
  }

  state.currentParent = realTargetParent;
}

export function handleParentDragover<T>(
  data: ParentEventData<T>,
  state: DragState<T>
) {
  processParentDragEvent(data.e as DragEvent, data.targetData, state, true);
}

export function handleParentPointerover<T>(data: PointeroverParentEvent<T>) {
  const { detail } = data;

  const { state, targetData } = detail;

  if (state.scrolling) return;

  processParentDragEvent(detail.e, targetData, state, false);
}

export function moveBetween<T>(data: ParentRecord<T>, state: DragState<T>) {
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

  const foundRange = findClosest(data.data.enabledNodes, state);

  if (!foundRange) return;

  const key = foundRange[1] as "ascending" | "descending";

  if (foundRange) {
    const position = foundRange[0].data.range
      ? foundRange[0].data.range[key]
      : undefined;

    if (position)
      positioninsertPoint(
        data,
        position,
        foundRange[1] === "ascending",
        foundRange[0],
        insertState as InsertState<T>
      );
  }
}

function moveOutside<T>(data: ParentRecord<T>, state: DragState<T>) {
  if (data.el === state.currentParent.el) return false;

  const targetConfig = data.data.config;

  if (targetConfig.treeGroup && state.draggedNode.el.contains(data.el))
    return false;

  if (targetConfig.dropZone === false) return;

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

    if (insertPoint) insertPoint.el.style.display = "none";
  } else {
    removeClass([state.currentParent.el], targetConfig.dropZoneClass);

    const enabledNodes = data.data.enabledNodes;

    const foundRange = findClosest(enabledNodes, state);

    if (!foundRange) return;

    const key = foundRange[1] as "ascending" | "descending";

    if (foundRange) {
      const position = foundRange[0].data.range
        ? foundRange[0].data.range[key]
        : undefined;

      if (position)
        positioninsertPoint(
          data,
          position,
          foundRange[1] === "ascending",
          foundRange[0],
          insertState as InsertState<T>
        );
    }
  }
}

function findClosest<T>(enabledNodes: NodeRecord<T>[], state: DragState<T>) {
  let foundRange: [NodeRecord<T>, string] | null = null;

  for (let x = 0; x < enabledNodes.length; x++) {
    if (!state || !enabledNodes[x].data.range) continue;

    if (enabledNodes[x].data.range!.ascending) {
      if (
        state.coordinates.y > enabledNodes[x].data.range!.ascending!.y[0] &&
        state.coordinates.y < enabledNodes[x].data.range!.ascending!.y[1] &&
        state.coordinates.x > enabledNodes[x].data.range!.ascending!.x[0] &&
        state.coordinates.x < enabledNodes[x].data.range!.ascending!.x[1]
      ) {
        foundRange = [enabledNodes[x], "ascending"];

        return foundRange;
      }
    }

    if (enabledNodes[x].data.range!.descending) {
      if (
        state.coordinates.y > enabledNodes[x].data.range!.descending!.y[0] &&
        state.coordinates.y < enabledNodes[x].data.range!.descending!.y[1] &&
        state.coordinates.x > enabledNodes[x].data.range!.descending!.x[0] &&
        state.coordinates.x < enabledNodes[x].data.range!.descending!.x[1]
      ) {
        foundRange = [enabledNodes[x], "descending"];

        return foundRange;
      }
    }
  }
}

function createInsertPoint<T>(
  parent: ParentRecord<T>,
  insertState: InsertState<T>
) {
  const insertPoint = parent.data.config.insertConfig?.insertPoint({
    el: parent.el,
    data: parent.data,
  });

  if (!insertPoint)
    throw new Error("Insert point not found", { cause: parent });

  insertState.insertPoint = {
    parent,
    el: insertPoint,
  };

  document.body.appendChild(insertPoint);

  Object.assign(insertPoint, {
    position: "absolute",
    display: "none",
  });
}

function removeInsertPoint<T>(insertState: InsertState<T>) {
  if (insertState.insertPoint?.el) insertState.insertPoint.el.remove();

  insertState.insertPoint = null;
}

function positioninsertPoint<T>(
  parent: ParentRecord<T>,
  position: { x: number[]; y: number[]; vertical: boolean },
  ascending: boolean,
  node: NodeRecord<T>,
  insertState: InsertState<T>
) {
  if (insertState.insertPoint?.el !== parent.el) {
    removeInsertPoint(insertState);

    createInsertPoint(parent, insertState);
  }

  insertState.draggedOverNodes = [node];

  if (!insertState.insertPoint) return;

  if (position.vertical) {
    const topPosition =
      position.y[ascending ? 1 : 0] -
      insertState.insertPoint.el.getBoundingClientRect().height / 2;

    Object.assign(insertState.insertPoint.el.style, {
      top: `${topPosition}px`,
      left: `${position.x[0]}px`,
      right: `${position.x[1]}px`,
      height: "4px",
      width: `${position.x[1] - position.x[0]}px`,
    });
  } else {
    const leftPosition =
      position.x[ascending ? 1 : 0] -
      insertState.insertPoint.el.getBoundingClientRect().width / 2;
    insertState.insertPoint.el.style.left = `${leftPosition}px`;

    Object.assign(insertState.insertPoint.el.style, {
      top: `${position.y[0]}px`,
      bottom: `${position.y[1]}px`,
      width: "4px",
      height: `${position.y[1] - position.y[0]}px`,
    });
  }

  insertState.targetIndex = node.data.index;

  insertState.ascending = ascending;

  insertState.insertPoint.el.style.display = "block";
}

export function handleParentDrop<T>(_data: NodeDragEventData<T>) {}

export function handleEnd<T>(
  state: DragState<T> | SynthDragState<T> | BaseDragState<T>
) {
  if (!isDragState(state)) return;

  const insertPoint = insertState.insertPoint;

  if (!insertState.draggedOverParent) {
    const draggedParentValues = parentValues(
      state.initialParent.el,
      state.initialParent.data
    );

    const transferred = state.initialParent.el !== state.currentParent.el;

    remapNodes(state.initialParent.el);

    const draggedValues = state.draggedNodes.map((node) => node.data.value);

    const enabledNodes = [...state.initialParent.data.enabledNodes];

    const originalIndex = state.draggedNodes[0].data.index;

    const targetIndex = insertState.targetIndex;

    if (
      !transferred &&
      insertState.draggedOverNodes[0] &&
      insertState.draggedOverNodes[0].el !== state.draggedNodes[0].el
    ) {
      const newParentValues = [
        ...draggedParentValues.filter(
          (x) => !draggedValues.some((y) => eq(x, y))
        ),
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
        const sortEventData = {
          parent: {
            el: state.initialParent.el,
            data: state.initialParent.data,
          } as ParentRecord<unknown>,
          previousValues: [...draggedParentValues],
          previousNodes: [...enabledNodes],
          nodes: [...state.initialParent.data.enabledNodes],
          values: [...newParentValues],
          draggedNodes: state.draggedNodes,
          targetNodes: insertState.draggedOverNodes,
          previousPosition: originalIndex,
          position: index,
          state: state as DragState<unknown>,
        };

        state.initialParent.data.config.onSort(sortEventData);
      }
    } else if (transferred && insertState.draggedOverNodes.length) {
      const draggedParentValues = parentValues(
        state.initialParent.el,
        state.initialParent.data
      );

      // For the time being, we will not be remoing the value of the original dragged parent.
      let index = insertState.draggedOverNodes[0].data.index || 0;

      if (insertState.ascending) index++;

      const insertValues = state.initialParent.data.config.insertConfig
        ?.dynamicValues
        ? state.initialParent.data.config.insertConfig.dynamicValues({
            sourceParent: state.initialParent,
            targetParent: state.currentParent,
            draggedNodes: state.draggedNodes,
            targetNodes: insertState.draggedOverNodes as NodeRecord<T>[],
            targetIndex: index,
          })
        : draggedValues;

      const newParentValues = [
        ...draggedParentValues.filter(
          (x) => !draggedValues.some((y) => eq(x, y))
        ),
      ];

      if (state.currentParent.el.contains(state.initialParent.el)) {
        // Update initial parent values first
        setParentValues(state.initialParent.el, state.initialParent.data, [
          ...newParentValues,
        ]);

        // Now get the target parent values.
        const targetParentValues = parentValues(
          state.currentParent.el,
          state.currentParent.data
        );

        targetParentValues.splice(index, 0, ...insertValues);

        setParentValues(state.currentParent.el, state.currentParent.data, [
          ...targetParentValues,
        ]);
      } else {
        setParentValues(state.initialParent.el, state.initialParent.data, [
          ...newParentValues,
        ]);

        const targetParentValues = parentValues(
          state.currentParent.el,
          state.currentParent.data
        );

        targetParentValues.splice(index, 0, ...insertValues);

        setParentValues(state.currentParent.el, state.currentParent.data, [
          ...targetParentValues,
        ]);
      }

      const data = {
        sourceParent: state.initialParent,
        targetParent: state.currentParent,
        initialParent: state.initialParent,
        draggedNodes: state.draggedNodes,
        targetIndex,
        targetNodes: insertState.draggedOverNodes as NodeRecord<T>[],
        state,
      };

      if (state.initialParent.data.config.onTransfer)
        state.initialParent.data.config.onTransfer(data);
      if (state.currentParent.data.config.onTransfer)
        state.currentParent.data.config.onTransfer(data);
    }
  } else if (insertState.draggedOverParent) {
    if (state.currentParent.el.contains(state.initialParent.el)) {
      const draggedParentValues = parentValues(
        state.initialParent.el,
        state.initialParent.data
      );

      const newParentValues = [
        ...draggedParentValues.filter(
          (x) => !draggedValues.some((y) => eq(x, y))
        ),
      ];

      setParentValues(state.initialParent.el, state.initialParent.data, [
        ...newParentValues,
      ]);

      const draggedOverParentValues = parentValues(
        insertState.draggedOverParent.el,
        insertState.draggedOverParent.data
      );

      const draggedValues = state.draggedNodes.map((node) => node.data.value);

      const insertValues = state.initialParent.data.config.insertConfig
        ?.dynamicValues
        ? state.initialParent.data.config.insertConfig.dynamicValues({
            sourceParent: state.initialParent,
            targetParent: state.currentParent,
            draggedNodes: state.draggedNodes,
            targetNodes: insertState.draggedOverNodes as NodeRecord<T>[],
          })
        : draggedValues;

      draggedOverParentValues.push(...insertValues);

      setParentValues(
        insertState.draggedOverParent.el,
        insertState.draggedOverParent.data,
        [...draggedOverParentValues]
      );
    } else {
      const draggedValues = state.draggedNodes.map((node) => node.data.value);

      const draggedOverParentValues = parentValues(
        insertState.draggedOverParent.el,
        insertState.draggedOverParent.data
      );

      const insertValues = state.initialParent.data.config.insertConfig
        ?.dynamicValues
        ? state.initialParent.data.config.insertConfig.dynamicValues({
            sourceParent: state.initialParent,
            targetParent: state.currentParent,
            draggedNodes: state.draggedNodes,
            targetNodes: insertState.draggedOverNodes as NodeRecord<T>[],
          })
        : draggedValues;

      draggedOverParentValues.push(...insertValues);

      setParentValues(
        insertState.draggedOverParent.el,
        insertState.draggedOverParent.data,
        [...draggedOverParentValues]
      );
      const draggedParentValues = parentValues(
        state.initialParent.el,
        state.initialParent.data
      );

      const newParentValues = [
        ...draggedParentValues.filter(
          (x) => !draggedValues.some((y) => eq(x, y))
        ),
      ];

      setParentValues(state.initialParent.el, state.initialParent.data, [
        ...newParentValues,
      ]);
    }

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

  if (insertPoint) insertPoint.el.style.display = "none";

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
