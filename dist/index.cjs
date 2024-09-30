"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  addClass: () => addClass,
  addEvents: () => addEvents,
  addNodeClass: () => addNodeClass,
  addParentClass: () => addParentClass,
  animations: () => animations,
  copyNodeStyle: () => copyNodeStyle,
  createEmitter: () => createEmitter,
  dragAndDrop: () => dragAndDrop,
  dragStateProps: () => dragStateProps,
  dragValues: () => dragValues,
  dragstartClasses: () => dragstartClasses,
  emit: () => emit,
  eventCoordinates: () => eventCoordinates,
  getElFromPoint: () => getElFromPoint,
  getRealCoords: () => getRealCoords,
  getScrollables: () => getScrollables,
  handleBlurParent: () => handleBlurParent,
  handleClickNode: () => handleClickNode,
  handleClickParent: () => handleClickParent,
  handleDragoverNode: () => handleDragoverNode4,
  handleDragoverParent: () => handleDragoverParent3,
  handleDragstart: () => handleDragstart,
  handleDropParent: () => handleDropParent,
  handleEnd: () => handleEnd,
  handleFocusParent: () => handleFocusParent,
  handleKeydownNode: () => handleKeydownNode,
  handleKeydownParent: () => handleKeydownParent,
  handleLongPress: () => handleLongPress,
  handlePointerdownNode: () => handlePointerdownNode,
  handlePointermove: () => handlePointermove,
  handlePointeroverNode: () => handlePointeroverNode3,
  handlePointeroverParent: () => handlePointeroverParent4,
  handlePointerupNode: () => handlePointerupNode,
  handleScroll: () => handleScroll,
  handleTouchstart: () => handleTouchstart,
  initDrag: () => initDrag,
  insertion: () => insertion,
  isBrowser: () => isBrowser,
  isDragState: () => isDragState,
  isNode: () => isNode,
  isSynthDragState: () => isSynthDragState,
  noDefault: () => noDefault,
  nodeEventData: () => nodeEventData,
  nodes: () => nodes,
  on: () => on,
  parentEventData: () => parentEventData,
  parentValues: () => parentValues,
  parents: () => parents,
  performSort: () => performSort,
  performTransfer: () => performTransfer,
  place: () => place,
  preventSortOnScroll: () => preventSortOnScroll,
  remapFinished: () => remapFinished,
  remapNodes: () => remapNodes,
  removeClass: () => removeClass,
  resetState: () => resetState,
  setAttrs: () => setAttrs,
  setDragState: () => setDragState,
  setParentValues: () => setParentValues,
  setupNode: () => setupNode,
  setupNodeRemap: () => setupNodeRemap,
  sort: () => sort,
  state: () => state,
  swap: () => swap,
  synthMove: () => synthMove,
  tearDown: () => tearDown,
  tearDownNode: () => tearDownNode,
  tearDownNodeRemap: () => tearDownNodeRemap,
  throttle: () => throttle,
  touchDevice: () => touchDevice,
  transfer: () => transfer,
  treeAncestors: () => treeAncestors,
  updateConfig: () => updateConfig,
  validateDragHandle: () => validateDragHandle,
  validateDragstart: () => validateDragstart,
  validateSort: () => validateSort,
  validateTransfer: () => validateTransfer
});
module.exports = __toCommonJS(src_exports);

// src/plugins/animations/index.ts
function animations(animationsConfig = {}) {
  const slideUp = [
    {
      transform: `translateY(${animationsConfig.yScale || 50}%)`
    },
    {
      transform: `translateY(${animationsConfig.yScale || 0}%)`
    }
  ];
  const slideDown = [
    {
      transform: `translateY(-${animationsConfig.yScale || 50}%)`
    },
    {
      transform: `translateY(${animationsConfig.yScale || 0}%)`
    }
  ];
  const slideLeft = [
    {
      transform: `translateX(${animationsConfig.xScale || 50}%)`
    },
    {
      transform: `translateX(${animationsConfig.xScale || 0}%)`
    }
  ];
  const slideRight = [
    {
      transform: `translateX(-${animationsConfig.xScale || 50}%)`
    },
    {
      transform: `translateX(${animationsConfig.xScale || 0}%)`
    }
  ];
  return (parent) => {
    const parentData = parents.get(parent);
    if (!parentData) return;
    return {
      setup() {
        if (document.head.querySelector("[data-drag-and-drop]")) return;
      },
      setupNodeRemap(data) {
        if (!isDragState(state)) return;
        const duration = animationsConfig.duration || 150;
        if (data.node.data.value === state.draggedNode.data.value) {
          switch (state.incomingDirection) {
            case "below":
              animate(data.node.el, slideUp, duration);
              break;
            case "above":
              animate(data.node.el, slideDown, duration);
              break;
            case "left":
              animate(data.node.el, slideRight, duration);
              break;
            case "right":
              animate(data.node.el, slideLeft, duration);
              break;
          }
          return;
        }
        if (!state.affectedNodes.map((x) => x.data.value).includes(data.node.data.value))
          return;
        const nodeRect = data.node.el.getBoundingClientRect();
        const nodeIndex = state.affectedNodes.findIndex(
          (x) => x.data.value === data.node.data.value
        );
        const draggedNodeIndex = state.draggedNode.data.index;
        const ascendingDirection = draggedNodeIndex >= state.targetIndex;
        let adjacentNode;
        if (ascendingDirection) {
          adjacentNode = state.affectedNodes[nodeIndex + 1] ? state.affectedNodes[nodeIndex + 1] : state.affectedNodes[nodeIndex - 1];
        } else {
          adjacentNode = state.affectedNodes[nodeIndex - 1] ? state.affectedNodes[nodeIndex - 1] : state.affectedNodes[nodeIndex + 1];
        }
        if (adjacentNode) {
          const xDiff = Math.abs(
            nodeRect.x - adjacentNode.el.getBoundingClientRect().x
          );
          const yDiff = Math.abs(
            nodeRect.y - adjacentNode.el.getBoundingClientRect().y
          );
          if (xDiff > yDiff && ascendingDirection) {
            animate(data.node.el, slideRight, duration);
          } else if (xDiff > yDiff && !ascendingDirection) {
            animate(data.node.el, slideLeft, duration);
          }
        } else {
          switch (state.incomingDirection) {
            case "below":
              animate(data.node.el, slideDown, duration);
              break;
            case "above":
              animate(data.node.el, slideUp, duration);
              break;
            case "left":
              animate(data.node.el, slideLeft, duration);
              break;
            case "right":
              animate(data.node.el, slideRight, duration);
              break;
          }
        }
      }
    };
  };
}
function animate(node, animation, duration) {
  if (!state) return;
  state.preventEnter = true;
  node.animate(animation, {
    duration,
    easing: "ease-in-out"
  });
  setTimeout(() => {
    if (!state) return;
    state.preventEnter = false;
  }, duration);
}

// src/plugins/insertion/index.ts
var insertionState = {
  draggedOverNodes: Array(),
  draggedOverParent: null,
  targetIndex: 0,
  ascending: false
};
function insertion(insertionConfig = {}) {
  return (parent) => {
    const parentData = parents.get(parent);
    if (!parentData) return;
    const insertionParentConfig = {
      ...parentData.config,
      insertionConfig
    };
    return {
      teardown() {
        if (parentData.abortControllers.root) {
          parentData.abortControllers.root.abort();
        }
      },
      setup() {
        insertionParentConfig.handleDragoverNode = insertionConfig.handleDragoverNode || handleDragoverNode;
        insertionParentConfig.handlePointeroverParent = insertionConfig.handlePointeroverParent || handlePointeroverParent;
        insertionParentConfig.handlePointeroverNode = insertionConfig.handlePointeroverNode || handlePointeroverParent;
        insertionParentConfig.handleDragoverParent = insertionConfig.handleDragoverParent || handleDragoverParent;
        insertionParentConfig.handleEnd = insertionConfig.handleEnd || handleEnd2;
        document.body.addEventListener("dragover", checkPosition);
        document.body.addEventListener("pointermove", checkPosition);
        const observer = new ResizeObserver(() => {
          defineRanges(parent);
        });
        observer.observe(parent);
        parentData.config = insertionParentConfig;
        state.on("dragStarted", () => {
          console.log("drag started");
          defineRanges(parent);
        });
        const insertionPointConfig = insertionConfig.insertionPoint || {};
        const div = document.createElement(insertionPointConfig.tag || "div");
        div.id = insertionPointConfig.id || "insertion-point";
        div.classList.add(
          ...insertionPointConfig.classes || ["insertion-point"]
        );
        div.style.position = "absolute";
        div.style.display = "none";
        document.body.appendChild(div);
        window.addEventListener("scroll", defineRanges.bind(null, parent));
        window.addEventListener("resize", defineRanges.bind(null, parent));
      },
      remapFinished() {
        defineRanges(parent);
      }
    };
  };
}
function checkPosition(e) {
  if (!isDragState(state)) return;
  const el = document.elementFromPoint(e.clientX, e.clientY);
  if (!(el instanceof HTMLElement)) return;
  if (!parents.has(el)) {
    const insertionPoint = document.getElementById("insertion-point");
    if (insertionPoint && insertionPoint === el) return;
    if (insertionPoint) insertionPoint.style.display = "none";
    if (insertionState.draggedOverParent) {
      removeClass(
        [insertionState.draggedOverParent.el],
        insertionState.draggedOverParent.data.config.dropZoneClass
      );
    }
    insertionState.draggedOverNodes = [];
    insertionState.draggedOverParent = null;
    state.currentParent = state.initialParent;
  }
}
function ascendingVertical(nodeCoords, nextNodeCoords) {
  const center = nodeCoords.top + nodeCoords.height / 2;
  if (!nextNodeCoords) {
    return {
      y: [center, center + nodeCoords.height / 2 + 10],
      x: [nodeCoords.left, nodeCoords.right],
      vertical: true
    };
  }
  return {
    y: [
      center,
      nodeCoords.bottom + Math.abs(nodeCoords.bottom - nextNodeCoords.top) / 2
    ],
    x: [nodeCoords.left, nodeCoords.right],
    vertical: true
  };
}
function descendingVertical(nodeCoords, prevNodeCoords) {
  const center = nodeCoords.top + nodeCoords.height / 2;
  if (!prevNodeCoords) {
    return {
      y: [center - nodeCoords.height / 2 - 10, center],
      x: [nodeCoords.left, nodeCoords.right],
      vertical: true
    };
  }
  return {
    y: [
      prevNodeCoords.bottom + Math.abs(prevNodeCoords.bottom - nodeCoords.top) / 2,
      center
    ],
    x: [nodeCoords.left, nodeCoords.right],
    vertical: true
  };
}
function ascendingHorizontal(nodeCoords, nextNodeCoords, lastInRow = false) {
  const center = nodeCoords.left + nodeCoords.width / 2;
  if (!nextNodeCoords) {
    return {
      x: [center, center + nodeCoords.width],
      y: [nodeCoords.top, nodeCoords.bottom],
      vertical: false
    };
  }
  if (lastInRow) {
    return {
      x: [center, nodeCoords.right + 10],
      y: [nodeCoords.top, nodeCoords.bottom],
      vertical: false
    };
  } else {
    const nextNodeCenter = nextNodeCoords.left + nextNodeCoords.width / 2;
    return {
      x: [center, center + Math.abs(center - nextNodeCenter) / 2],
      y: [nodeCoords.top, nodeCoords.bottom],
      vertical: false
    };
  }
}
function descendingHorizontal(nodeCoords, prevNodeCoords) {
  const center = nodeCoords.left + nodeCoords.width / 2;
  if (!prevNodeCoords) {
    return {
      x: [nodeCoords.left - 10, center],
      y: [nodeCoords.top, nodeCoords.bottom],
      vertical: false
    };
  }
  return {
    x: [
      prevNodeCoords.right + Math.abs(prevNodeCoords.right - nodeCoords.left) / 2,
      center
    ],
    y: [nodeCoords.top, nodeCoords.bottom],
    vertical: false
  };
}
function defineRanges(parent) {
  const parentData = parents.get(parent);
  if (!parentData) return;
  const enabledNodes = parentData.enabledNodes;
  enabledNodes.forEach((node, index) => {
    let aboveOrBelowPrevious = false;
    let aboveOrBelowAfter = false;
    let prevNodeCoords = void 0;
    let nextNodeCoords = void 0;
    if (enabledNodes[index - 1])
      prevNodeCoords = getRealCoords(enabledNodes[index - 1].el);
    if (enabledNodes[index + 1])
      nextNodeCoords = getRealCoords(enabledNodes[index + 1].el);
    const nodeCoords = getRealCoords(node.el);
    if (prevNodeCoords) {
      aboveOrBelowPrevious = nodeCoords.top > prevNodeCoords.bottom || nodeCoords.bottom < prevNodeCoords.top;
    }
    if (nextNodeCoords) {
      aboveOrBelowAfter = nodeCoords.top > nextNodeCoords.bottom || nodeCoords.bottom < nextNodeCoords.top;
    }
    const fullishWidth = parent.getBoundingClientRect().width * 0.8 < nodeCoords.width;
    if (!node.data.range) return;
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
function handleDragoverNode(data) {
  data.e.preventDefault();
}
function handleDragoverParent(data, state2) {
  if (!insertionState) return;
  data.e.stopPropagation();
  data.e.preventDefault();
  const { x, y } = eventCoordinates(data.e);
  const clientX = x;
  const clientY = y;
  const scrollLeft = window.scrollX || document.documentElement.scrollLeft;
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  state2.coordinates.x = clientX + scrollLeft;
  state2.coordinates.y = clientY + scrollTop;
  const nestedParent = data.targetData.parent.data.nestedParent;
  let realTargetParent = data.targetData.parent;
  if (nestedParent) {
    const rect = nestedParent.el.getBoundingClientRect();
    if (state2.coordinates.y > rect.top && state2.coordinates.y < rect.bottom)
      realTargetParent = nestedParent;
  }
  realTargetParent.el === state2.currentParent?.el ? moveBetween(realTargetParent) : moveOutside(realTargetParent, state2);
  state2.currentParent = realTargetParent;
}
function moveBetween(data) {
  if (data.data.config.sortable === false) return;
  if (data.el === insertionState.draggedOverParent?.el && insertionState.draggedOverParent.data.getValues(data.el).length === 0) {
    return;
  } else if (insertionState.draggedOverParent?.el) {
    removeClass(
      [insertionState.draggedOverParent.el],
      insertionState.draggedOverParent.data.config.dropZoneClass
    );
    insertionState.draggedOverParent = null;
  }
  const foundRange = findClosest(data.data.enabledNodes);
  if (!foundRange) return;
  const position = foundRange[0].data.range[foundRange[1]];
  if (!position) return;
  positionInsertionPoint(
    position,
    foundRange[1] === "ascending",
    foundRange[0]
  );
}
function moveOutside(data, state2) {
  if (data.el === state2.currentParent.el) return false;
  const targetConfig = data.data.config;
  if (targetConfig.treeGroup && state2.draggedNode.el.contains(data.el))
    return false;
  if (targetConfig.dropZone === false) return false;
  const initialParentConfig = state2.initialParent.data.config;
  if (targetConfig.accepts) {
    return targetConfig.accepts(
      data,
      state2.initialParent,
      state2.currentParent,
      state2
    );
  } else if (!targetConfig.group || targetConfig.group !== initialParentConfig.group) {
    return false;
  }
  const values = data.data.getValues(data.el);
  if (!values.length) {
    addParentClass([data.el], targetConfig.dropZoneClass);
    insertionState.draggedOverParent = data;
    const insertionPoint = document.getElementById("insertion-point");
    if (insertionPoint) insertionPoint.style.display = "none";
  } else {
    removeClass([state2.currentParent.el], targetConfig.dropZoneClass);
    const enabledNodes = data.data.enabledNodes;
    const foundRange = findClosest(enabledNodes);
    if (!foundRange) return;
    const position = foundRange[0].data.range[foundRange[1]];
    if (!position) return;
    positionInsertionPoint(
      position,
      foundRange[1] === "ascending",
      foundRange[0]
    );
  }
}
function findClosest(enabledNodes) {
  let foundRange = null;
  for (let x = 0; x < enabledNodes.length; x++) {
    if (!isDragState(state) || !enabledNodes[x].data.range) continue;
    const ascending = enabledNodes[x].data.range.ascending;
    const descending = enabledNodes[x].data.range.descending;
    if (!ascending && !descending) continue;
    if (ascending) {
      if (state.coordinates.y > ascending.y[0] && state.coordinates.y < ascending.y[1] && state.coordinates.x > ascending.x[0] && state.coordinates.x < ascending.x[1]) {
        foundRange = [enabledNodes[x], "ascending"];
        return foundRange;
      }
    }
    if (descending) {
      if (state.coordinates.y > descending.y[0] && state.coordinates.y < descending.y[1] && state.coordinates.x > descending.x[0] && state.coordinates.x < descending.x[1]) {
        foundRange = [enabledNodes[x], "descending"];
        return foundRange;
      }
    }
  }
}
function handlePointeroverParent(data, state2) {
  if (!insertionState) return;
  data.detail.e.stopPropagation();
  const { x, y } = eventCoordinates(data.detail.e);
  state2.coordinates.y = y;
  state2.coordinates.x = x;
  const nestedParent = data.detail.targetData.parent.data.nestedParent;
  let realTargetParent = data.detail.targetData.parent;
  if (nestedParent) {
    const rect = nestedParent.el.getBoundingClientRect();
    if (state2.coordinates.y > rect.top && state2.coordinates.y < rect.bottom)
      realTargetParent = nestedParent;
  }
  const enabledNodes = realTargetParent.data.enabledNodes;
  const foundRange = findClosest(enabledNodes);
  if (!foundRange) return;
  const position = foundRange[0].data.range[foundRange[1]];
  positionInsertionPoint(
    position,
    foundRange[1] === "ascending",
    foundRange[0]
  );
  data.detail.targetData.parent.el === state2.currentParent?.el ? moveBetween(realTargetParent) : moveOutside(realTargetParent, state2);
}
function positionInsertionPoint(position, ascending, node) {
  if (!state) return;
  const div = document.getElementById("insertion-point");
  if (!div) return;
  insertionState.draggedOverNodes = [node];
  if (position.vertical) {
    const topPosition = position.y[ascending ? 1 : 0] - div.getBoundingClientRect().height / 2;
    div.style.top = `${topPosition}px`;
    const leftCoordinate = position.x[0];
    const rightCoordinate = position.x[1];
    div.style.left = `${leftCoordinate}px`;
    div.style.right = `${rightCoordinate}px`;
    div.style.height = "4px";
    div.style.width = rightCoordinate - leftCoordinate + "px";
  } else {
    const leftPosition = position.x[ascending ? 1 : 0] - div.getBoundingClientRect().width / 2;
    div.style.left = `${leftPosition}px`;
    const topCoordinate = position.y[0];
    const bottomCoordinate = position.y[1];
    div.style.top = `${topCoordinate}px`;
    div.style.bottom = `${bottomCoordinate}px`;
    div.style.width = "4px";
    div.style.height = bottomCoordinate - topCoordinate + "px";
  }
  insertionState.targetIndex = node.data.index;
  insertionState.ascending = ascending;
  div.style.display = "block";
}
function handleEnd2(data, state2) {
  data.e.stopPropagation();
  const insertionPoint = document.getElementById("insertion-point");
  if (!insertionState.draggedOverParent) {
    const draggedParentValues = parentValues(
      state2.initialParent.el,
      state2.initialParent.data
    );
    const transferred = state2.initialParent.el !== state2.currentParent.el;
    const draggedValues = state2.draggedNodes.map((node) => node.data.value);
    const enabledNodes = [...data.targetData.parent.data.enabledNodes];
    const originalIndex = state2.draggedNodes[0].data.index;
    if (!transferred && insertionState.draggedOverNodes[0] && insertionState.draggedOverNodes[0].el !== state2.draggedNodes[0].el) {
      const newParentValues = [
        ...draggedParentValues.filter((x) => !draggedValues.includes(x))
      ];
      let index = insertionState.draggedOverNodes[0].data.index;
      if (insertionState.targetIndex > state2.draggedNodes[0].data.index && !insertionState.ascending) {
        index--;
      } else if (insertionState.targetIndex < state2.draggedNodes[0].data.index && insertionState.ascending) {
        index++;
      }
      newParentValues.splice(index, 0, ...draggedValues);
      setParentValues(data.targetData.parent.el, data.targetData.parent.data, [
        ...newParentValues
      ]);
      if (data.targetData.parent.data.config.onSort) {
        const sortEventData = {
          parent: {
            el: data.targetData.parent.el,
            data: data.targetData.parent.data
          },
          previousValues: [...draggedParentValues],
          previousNodes: [...enabledNodes],
          nodes: [...data.targetData.parent.data.enabledNodes],
          values: [...newParentValues],
          draggedNode: state2.draggedNode,
          previousPosition: originalIndex,
          position: index
        };
        data.targetData.parent.data.config.onSort(sortEventData);
      }
    } else if (transferred && insertionState.draggedOverNodes.length) {
      const targetParentValues = parentValues(
        state2.currentParent.el,
        state2.currentParent.data
      );
      const draggedParentValues2 = parentValues(
        state2.initialParent.el,
        state2.initialParent.data
      );
      let index = insertionState.draggedOverNodes[0].data.index || 0;
      if (insertionState.ascending) index++;
      const insertValues = state2.dynamicValues.length ? state2.dynamicValues : draggedValues;
      targetParentValues.splice(index, 0, ...insertValues);
      setParentValues(state2.currentParent.el, state2.currentParent.data, [
        ...targetParentValues
      ]);
      draggedParentValues2.splice(state2.initialIndex, draggedValues.length);
      setParentValues(state2.initialParent.el, state2.initialParent.data, [
        ...draggedParentValues2
      ]);
      const transferEventData = {
        sourceParent: state2.currentParent,
        targetParent: data.targetData.parent,
        initialParent: state2.initialParent,
        draggedNodes: state2.draggedNodes,
        targetIndex: index,
        state: state2
      };
      if (data.targetData.parent.data.config.onTransfer)
        data.targetData.parent.data.config.onTransfer(transferEventData);
      if (state2.currentParent.data.config.onTransfer)
        state2.currentParent.data.config.onTransfer(transferEventData);
    }
  } else if (insertionState.draggedOverParent) {
    const draggedOverParentValues = parentValues(
      insertionState.draggedOverParent.el,
      insertionState.draggedOverParent.data
    );
    const draggedValues = state2.draggedNodes.map((node) => node.data.value);
    const insertValues = state2.dynamicValues.length ? state2.dynamicValues : draggedValues;
    draggedOverParentValues.push(...insertValues);
    setParentValues(
      insertionState.draggedOverParent.el,
      insertionState.draggedOverParent.data,
      [...draggedOverParentValues]
    );
    const transferEventData = {
      sourceParent: state2.currentParent,
      targetParent: insertionState.draggedOverParent,
      initialParent: state2.initialParent,
      draggedNodes: state2.draggedNodes,
      targetIndex: draggedOverParentValues.length - 1,
      state: state2
    };
    if (data.targetData.parent.data.config.onTransfer)
      data.targetData.parent.data.config.onTransfer(transferEventData);
    if (state2.currentParent.data.config.onTransfer)
      state2.currentParent.data.config.onTransfer(transferEventData);
    removeClass(
      [insertionState.draggedOverParent.el],
      insertionState.draggedOverParent.data.config.dropZoneClass
    );
  }
  if (insertionPoint) insertionPoint.style.display = "none";
  const dropZoneClass = "clonedDraggedNode" in state2 ? data.targetData.parent.data.config.synthDropZoneClass : data.targetData.parent.data.config.dropZoneClass;
  removeClass(
    insertionState.draggedOverNodes.map((node) => node.el),
    dropZoneClass
  );
  const dragPlaceholderClass = data.targetData.parent.data.config.dragPlaceholderClass;
  removeClass(
    state2.draggedNodes.map((node) => node.el),
    dragPlaceholderClass
  );
  insertionState.draggedOverNodes = [];
  handleEnd(data, state2);
}

// src/plugins/place/index.ts
var placeState = {
  draggedOverNodes: Array()
};
function place(placeConfig = {}) {
  return (parent) => {
    const parentData = parents.get(parent);
    if (!parentData) return;
    const placeParentConfig = {
      ...parentData.config,
      placeConfig
    };
    return {
      setup() {
        placeParentConfig.handleDragoverNode = placeConfig.handleDragoverNode || handleDragoverNode2;
        placeParentConfig.handlePointeroverNode = placeConfig.handlePointeroverNode || handlePointeroverNode;
        placeParentConfig.handlePointeroverParent = placeConfig.handlePointeroverParent || handlePointeroverParent2;
        placeParentConfig.handleEnd = placeConfig.handleEnd || handleEnd3;
        parentData.config = placeParentConfig;
      }
    };
  };
}
function handleDragoverNode2(data, state2) {
  dragoverNode(data, state2);
}
function handlePointeroverParent2(_data) {
}
function handlePointeroverNode(data, state2) {
  if (data.detail.targetData.parent.el !== state2.currentParent.el) return;
  const dropZoneClass = data.detail.targetData.parent.data.config.synthDropZoneClass;
  removeClass(
    placeState.draggedOverNodes.map((node) => node.el),
    dropZoneClass
  );
  const enabledNodes = data.detail.targetData.parent.data.enabledNodes;
  placeState.draggedOverNodes = enabledNodes.slice(
    data.detail.targetData.node.data.index,
    data.detail.targetData.node.data.index + state2.draggedNodes.length
  );
  addNodeClass(
    placeState.draggedOverNodes.map((node) => node.el),
    dropZoneClass,
    true
  );
  state2.currentTargetValue = data.detail.targetData.node.data.value;
  state2.currentParent = data.detail.targetData.parent;
}
function dragoverNode(data, state2) {
  data.e.preventDefault();
  data.e.stopPropagation();
  if (data.targetData.parent.el !== state2.currentParent.el) return;
  const dropZoneClass = data.targetData.parent.data.config.dropZoneClass;
  removeClass(
    placeState.draggedOverNodes.map((node) => node.el),
    dropZoneClass
  );
  const enabledNodes = data.targetData.parent.data.enabledNodes;
  if (!enabledNodes) return;
  placeState.draggedOverNodes = enabledNodes.slice(
    data.targetData.node.data.index,
    data.targetData.node.data.index + state2.draggedNodes.length
  );
  addNodeClass(
    placeState.draggedOverNodes.map((node) => node.el),
    dropZoneClass,
    true
  );
  state2.currentTargetValue = data.targetData.node.data.value;
  state2.currentParent = data.targetData.parent;
}
function handleEnd3(data, state2) {
  if (!state2) return;
  if (state2.transferred || state2.currentParent.el !== state2.initialParent.el)
    return;
  const draggedParentValues = parentValues(
    state2.initialParent.el,
    state2.initialParent.data
  );
  const draggedValues = state2.draggedNodes.map((node) => node.data.value);
  const newParentValues = [
    ...draggedParentValues.filter((x) => !draggedValues.includes(x))
  ];
  const index = placeState.draggedOverNodes[0].data.index;
  newParentValues.splice(index, 0, ...draggedValues);
  setParentValues(data.targetData.parent.el, data.targetData.parent.data, [
    ...newParentValues
  ]);
  const dropZoneClass = "clonedDraggedNode" in state2 ? data.targetData.parent.data.config.synthDropZoneClass : data.targetData.parent.data.config.dropZoneClass;
  removeClass(
    placeState.draggedOverNodes.map((node) => node.el),
    dropZoneClass
  );
  handleEnd(data, state2);
}

// src/plugins/swap/index.ts
var swapState = {
  draggedOverNodes: Array()
};
function swap(swapConfig = {}) {
  return (parent) => {
    const parentData = parents.get(parent);
    if (!parentData) return;
    const swapParentConfig = {
      ...parentData.config,
      swapConfig
    };
    return {
      setup() {
        swapParentConfig.handleDragoverParent = swapConfig.handleDragoverParent || handleDragoverParent2;
        swapParentConfig.handleDragoverNode = swapConfig.handleDragoverNode || handleDragoverNode3;
        swapParentConfig.handlePointeroverNode = swapConfig.handlePointeroverNode || handlePointeroverNode2;
        swapParentConfig.handlePointeroverParent = swapConfig.handlePointeroverParent || handlePointeroverParent3;
        parentData.config = swapParentConfig;
      }
    };
  };
}
function handleDragoverNode3(data) {
  data.e.preventDefault();
}
function handleDragoverParent2(_data) {
}
function handlePointeroverParent3(_data) {
}
function handlePointeroverNode2(data) {
  if (!isDragState(state)) return;
  if (data.detail.targetData.parent.el !== state.currentParent.el) return;
  const dropZoneClass = data.detail.targetData.parent.data.config.synthDropZoneClass;
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
  state.currentParent = data.detail.targetData.parent;
}

// src/index.ts
var isBrowser = typeof window !== "undefined";
var touchDevice = window && "ontouchstart" in window;
var documentController;
var isNative = false;
var animationFrameId = null;
var scrollConfig = {
  up: [0, -1],
  down: [0, 1],
  left: [-1, 0],
  right: [1, 0]
};
var nodes = /* @__PURE__ */ new WeakMap();
var parents = /* @__PURE__ */ new WeakMap();
var treeAncestors = {};
var synthNodePointerDown = false;
function createEmitter() {
  const callbacks = /* @__PURE__ */ new Map();
  const emit2 = function(eventName, data) {
    if (!callbacks.get(eventName)) return;
    callbacks.get(eventName).forEach((cb) => {
      cb(data);
    });
  };
  const on2 = function(eventName, callback) {
    const cbs = callbacks.get(eventName) ?? [];
    cbs.push(callback);
    callbacks.set(eventName, cbs);
  };
  return [emit2, on2];
}
var [emit, on] = createEmitter();
var baseDragState = {
  activeDescendant: void 0,
  affectedNodes: [],
  currentTargetValue: void 0,
  on,
  emit,
  newActiveDescendant: void 0,
  originalZIndex: void 0,
  pointerSelection: false,
  preventEnter: false,
  remapJustFinished: false,
  selectednodes: [],
  selectedParent: void 0
};
var state = baseDragState;
function resetState() {
  const baseDragState2 = {
    activeDescendant: void 0,
    affectedNodes: [],
    on,
    emit,
    currentTargetValue: void 0,
    originalZIndex: void 0,
    pointerId: void 0,
    preventEnter: false,
    remapJustFinished: false,
    selectednodes: [],
    selectedParent: void 0,
    pointerSelection: false,
    synthScrollDirection: void 0,
    draggedNodeDisplay: void 0,
    synthDragScrolling: false
  };
  state = { ...baseDragState2 };
}
function setDragState(dragStateProps2) {
  Object.assign(state, dragStateProps2);
  state.emit("dragStarted", state);
  return state;
}
function handlePointerdownRoot(_e) {
  if (state.activeState) setActive(state.activeState.parent, void 0, state);
  if (state.selectedState)
    deselect(state.selectedState.nodes, state.selectedState.parent, state);
  state.selectedState = state.activeState = void 0;
}
function handleRootKeydown(e) {
  if (e.key === "Escape") {
    if (state.selectedState)
      deselect(state.selectedState.nodes, state.selectedState.parent, state);
    if (state.activeState)
      setActive(state.activeState.parent, void 0, state);
    state.selectedState = state.activeState = void 0;
  }
}
function handleRootDragover(e) {
  if (!isDragState(state)) return;
  e.preventDefault();
}
function dragAndDrop({
  parent,
  getValues,
  setValues,
  config = {}
}) {
  if (!isBrowser) return;
  if (!documentController)
    documentController = addEvents(document, {
      dragover: handleRootDragover,
      pointerdown: handlePointerdownRoot,
      keydown: handleRootKeydown
    });
  tearDown(parent);
  const parentData = {
    getValues,
    setValues,
    config: {
      dragDropEffect: config.dragDropEffect ?? "move",
      dragEffectAllowed: config.dragEffectAllowed ?? "move",
      draggedNodes,
      dragstartClasses,
      deepCopyStyles: config.deepCopyStyles ?? false,
      handleKeydownNode,
      handleKeydownParent,
      handleDragstart,
      handleDragoverNode: handleDragoverNode4,
      handleDragoverParent: handleDragoverParent3,
      handleEnd,
      handleBlurParent,
      handleFocusParent,
      handlePointerupNode,
      handleTouchstart,
      handlePointeroverNode: handlePointeroverNode3,
      handlePointeroverParent: handlePointeroverParent4,
      handlePointerdownNode,
      handlePointermove,
      handleDragenterNode,
      handleDragleaveNode,
      handleDropParent,
      multiDrag: config.multiDrag ?? false,
      nativeDrag: config.nativeDrag ?? true,
      performSort,
      performTransfer,
      root: config.root ?? document,
      setupNode,
      setupNodeRemap,
      reapplyDragClasses,
      tearDownNode,
      tearDownNodeRemap,
      remapFinished,
      scrollBehavior: {
        x: 0.9,
        y: 0.8
      },
      threshold: {
        horizontal: 0,
        vertical: 0
      },
      ...config
    },
    enabledNodes: [],
    abortControllers: {},
    privateClasses: []
  };
  const nodesObserver = new MutationObserver(nodesMutated);
  nodesObserver.observe(parent, { childList: true });
  parents.set(parent, parentData);
  if (config.treeAncestor && config.treeGroup)
    treeAncestors[config.treeGroup] = parent;
  config.plugins?.forEach((plugin) => {
    plugin(parent)?.tearDown?.();
  });
  config.plugins?.forEach((plugin) => {
    plugin(parent)?.tearDown?.();
  });
  config.plugins?.forEach((plugin) => {
    plugin(parent)?.setup?.();
  });
  setup(parent, parentData);
  remapNodes(parent, true);
}
function dragStateProps(data, draggedNodes2, nativeDrag = true) {
  const { x, y } = eventCoordinates(data.e);
  const rect = data.targetData.node.el.getBoundingClientRect();
  const scrollEls = [];
  for (const scrollable of getScrollables()) {
    scrollEls.push([
      scrollable,
      nativeDrag ? addEvents(scrollable, {
        scroll: preventSortOnScroll()
      }) : addEvents(scrollable, {
        pointermove: handleScroll
      })
    ]);
  }
  return {
    affectedNodes: [],
    ascendingDirection: false,
    clonedDraggedEls: [],
    dynamicValues: [],
    coordinates: {
      x,
      y
    },
    draggedNode: {
      el: data.targetData.node.el,
      data: data.targetData.node.data
    },
    draggedNodes: draggedNodes2,
    incomingDirection: void 0,
    initialIndex: data.targetData.node.data.index,
    initialParent: {
      el: data.targetData.parent.el,
      data: data.targetData.parent.data
    },
    currentParent: {
      el: data.targetData.parent.el,
      data: data.targetData.parent.data
    },
    longPress: data.targetData.parent.data.config.longPress ?? false,
    longPressTimeout: 0,
    currentTargetValue: data.targetData.node.data.value,
    scrollEls,
    startLeft: x - rect.left,
    startTop: y - rect.top,
    targetIndex: data.targetData.node.data.index,
    transferred: false
  };
}
function performSort({
  parent,
  draggedNodes: draggedNodes2,
  targetNode
}) {
  const draggedValues = draggedNodes2.map((x) => x.data.value);
  const targetParentValues = parentValues(parent.el, parent.data);
  const originalIndex = draggedNodes2[0].data.index;
  const enabledNodes = [...parent.data.enabledNodes];
  const newParentValues = [
    ...targetParentValues.filter((x) => !draggedValues.includes(x))
  ];
  newParentValues.splice(targetNode.data.index, 0, ...draggedValues);
  if ("draggedNode" in state) state.currentTargetValue = targetNode.data.value;
  setParentValues(parent.el, parent.data, [...newParentValues]);
  if (parent.data.config.onSort)
    parent.data.config.onSort({
      parent: {
        el: parent.el,
        data: parent.data
      },
      previousValues: [...targetParentValues],
      previousNodes: [...enabledNodes],
      nodes: [...parent.data.enabledNodes],
      values: [...newParentValues],
      draggedNode: draggedNodes2[0],
      previousPosition: originalIndex,
      position: targetNode.data.index
    });
}
function setActive(parent, newActiveNode, state2) {
  const activeDescendantClass = parent.data.config.activeDescendantClass;
  if (state2.activeState) {
    {
      removeClass([state2.activeState.node.el], activeDescendantClass);
      if (state2.activeState.parent.el !== parent.el)
        state2.activeState.parent.el.setAttribute("aria-activedescendant", "");
    }
  }
  if (!newActiveNode) {
    state2.activeState?.parent.el.setAttribute("aria-activedescendant", "");
    state2.activeState = void 0;
    return;
  }
  state2.activeState = {
    node: newActiveNode,
    parent
  };
  addNodeClass([newActiveNode.el], activeDescendantClass);
  state2.activeState.parent.el.setAttribute(
    "aria-activedescendant",
    state2.activeState.node.el.id
  );
}
function deselect(nodes2, parent, state2) {
  const selectedClass = parent.data.config.selectedClass;
  if (!state2.selectedState) return;
  const iterativeNodes = Array.from(nodes2);
  removeClass(
    nodes2.map((x) => x.el),
    selectedClass
  );
  for (const node of iterativeNodes) {
    node.el.setAttribute("aria-selected", "false");
    const index = state2.selectedState.nodes.findIndex((x) => x.el === node.el);
    if (index === -1) continue;
    state2.selectedState.nodes.splice(index, 1);
  }
  clearLiveRegion(parent);
}
function setSelected(parent, selectedNodes, newActiveNode, state2, pointerdown = false) {
  state2.pointerSelection = pointerdown;
  for (const node of selectedNodes) {
    node.el.setAttribute("aria-selected", "true");
    addNodeClass([node.el], parent.data.config.selectedClass, true);
  }
  state2.selectedState = {
    nodes: selectedNodes,
    parent
  };
  const selectedItems = selectedNodes.map(
    (x) => x.el.getAttribute("aria-label")
  );
  if (selectedItems.length === 0) {
    state2.selectedState = void 0;
    clearLiveRegion(parent);
    return;
  }
  setActive(parent, newActiveNode, state2);
  updateLiveRegion(
    parent,
    `${selectedItems.join(
      ", "
    )} ready for dragging. Use arrow keys to navigate. Press enter to drop ${selectedItems.join(
      ", "
    )}.`
  );
}
function updateLiveRegion(parent, message) {
  const parentId = parent.el.id;
  const liveRegion = document.getElementById(parentId + "-live-region");
  if (!liveRegion) return;
  liveRegion.textContent = message;
}
function clearLiveRegion(parent) {
  const liveRegion = document.getElementById(parent.el.id + "-live-region");
  if (!liveRegion) return;
  liveRegion.textContent = "";
}
function handleBlurParent(_data, _state) {
}
function handleFocusParent(data, state2) {
  const firstEnabledNode = data.targetData.parent.data.enabledNodes[0];
  if (!firstEnabledNode) return;
  if (state2.selectedState && state2.selectedState.parent.el !== data.targetData.parent.el) {
    setActive(data.targetData.parent, firstEnabledNode, state2);
  } else if (!state2.selectedState) {
    setActive(data.targetData.parent, firstEnabledNode, state2);
  }
}
function performTransfer({
  currentParent,
  targetParent,
  initialParent,
  draggedNodes: draggedNodes2,
  initialIndex,
  targetNode,
  state: state2
}) {
  const draggedValues = draggedNodes2.map((x) => x.data.value);
  const currentParentValues = parentValues(
    currentParent.el,
    currentParent.data
  ).filter((x) => !draggedValues.includes(x));
  const targetParentValues = parentValues(targetParent.el, targetParent.data);
  const reset = initialParent.el === targetParent.el && targetParent.data.config.sortable === false;
  let targetIndex;
  if (targetNode) {
    if (reset) {
      targetIndex = initialIndex;
    } else if (targetParent.data.config.sortable === false) {
      targetIndex = targetParent.data.enabledNodes.length;
    } else {
      targetIndex = targetNode.data.index;
    }
    targetParentValues.splice(targetIndex, 0, ...draggedValues);
  } else {
    targetIndex = reset ? initialIndex : targetParent.data.enabledNodes.length;
    targetParentValues.splice(targetIndex, 0, ...draggedValues);
  }
  setParentValues(currentParent.el, currentParent.data, currentParentValues);
  setParentValues(targetParent.el, targetParent.data, targetParentValues);
  if (targetParent.data.config.onTransfer) {
    targetParent.data.config.onTransfer({
      sourceParent: currentParent,
      targetParent,
      initialParent,
      draggedNodes: draggedNodes2,
      targetIndex,
      state: state2
    });
  }
  if (currentParent.data.config.onTransfer) {
    currentParent.data.config.onTransfer({
      sourceParent: currentParent,
      targetParent,
      initialParent,
      draggedNodes: draggedNodes2,
      targetIndex,
      state: state2
    });
  }
}
function parentValues(parent, parentData) {
  return [...parentData.getValues(parent)];
}
function findArrayCoordinates(obj, targetArray, path = []) {
  let result = [];
  if (obj === targetArray) result.push(path);
  if (Array.isArray(obj)) {
    const index = obj.findIndex((el) => el === targetArray);
    if (index !== -1) {
      result.push([...path, index]);
    } else {
      for (let i = 0; i < obj.length; i++) {
        result = result.concat(
          findArrayCoordinates(obj[i], targetArray, [...path, i])
        );
      }
    }
  } else if (typeof obj === "object" && obj !== null) {
    for (const key in obj) {
      result = result.concat(
        findArrayCoordinates(obj[key], targetArray, [...path, key])
      );
    }
  }
  return result;
}
function setValueAtCoordinatesUsingFindIndex(obj, targetArray, newArray) {
  const coordinates = findArrayCoordinates(obj, targetArray);
  let newValues;
  coordinates.forEach((coords) => {
    let current = obj;
    for (let i = 0; i < coords.length - 1; i++) {
      const index = coords[i];
      current = current[index];
    }
    const lastIndex = coords[coords.length - 1];
    current[lastIndex] = newArray;
    newValues = current[lastIndex];
  });
  return newValues;
}
function setParentValues(parent, parentData, values) {
  const treeGroup = parentData.config.treeGroup;
  if (treeGroup) {
    const ancestorEl = treeAncestors[treeGroup];
    const ancestorData = parents.get(ancestorEl);
    if (!ancestorData) return;
    const ancestorValues = ancestorData.getValues(ancestorEl);
    const initialParentValues = parentData.getValues(parent);
    const updatedValues = setValueAtCoordinatesUsingFindIndex(
      ancestorValues,
      initialParentValues,
      values
    );
    if (!updatedValues) {
      console.warn("No updated value found");
      return;
    }
    parentData.setValues(updatedValues, parent);
    return;
  }
  parentData.setValues(values, parent);
}
function dragValues(state2) {
  return [...state2.draggedNodes.map((x) => x.data.value)];
}
function updateConfig(parent, config) {
  const parentData = parents.get(parent);
  if (!parentData) return;
  parents.set(parent, {
    ...parentData,
    config: { ...parentData.config, ...config }
  });
  dragAndDrop({
    parent,
    getValues: parentData.getValues,
    setValues: parentData.setValues,
    config
  });
}
function handleDropParent(_data) {
}
function tearDown(parent) {
  const parentData = parents.get(parent);
  if (!parentData) return;
  if (parentData.abortControllers.mainParent)
    parentData.abortControllers.mainParent.abort();
}
function isDragState(state2) {
  return "draggedNode" in state2 && !!state2.draggedNode;
}
function isSynthDragState(state2) {
  return "pointerId" in state2 && !!state2.pointerId;
}
function setup(parent, parentData) {
  parentData.abortControllers.mainParent = addEvents(parent, {
    keydown: parentEventData(parentData.config.handleKeydownParent),
    dragover: parentEventData(parentData.config.handleDragoverParent),
    handlePointeroverParent: parentData.config.handlePointeroverParent,
    drop: parentEventData(parentData.config.handleDropParent),
    hasNestedParent: (e) => {
      const parent2 = parents.get(e.target);
      if (!parent2) return;
      parent2.nestedParent = e.detail.parent;
    },
    blur: parentEventData(parentData.config.handleBlurParent),
    focus: parentEventData(parentData.config.handleFocusParent)
  });
  setAttrs(parent, {
    role: "listbox",
    tabindex: "0",
    "aria-multiselectable": parentData.config.multiDrag ? "true" : "false",
    "aria-activedescendant": "",
    "aria-describedby": parent.id + "-live-region"
  });
  const liveRegion = document.createElement("div");
  setAttrs(liveRegion, {
    "aria-live": "polite",
    "aria-atomic": "true",
    "data-drag-and-drop-live-region": "true",
    id: parent.id.toString() + "-live-region"
  });
  Object.assign(liveRegion.style, {
    position: "absolute",
    width: "1px",
    height: "1px",
    padding: "0",
    overflow: "hidden",
    clip: "rect(0, 0, 0, 0)",
    whiteSpace: "nowrap",
    border: "0"
  });
  document.body.appendChild(liveRegion);
}
function setAttrs(el, attrs) {
  for (const key in attrs) el.setAttribute(key, attrs[key]);
}
function setupNode(data) {
  const config = data.parent.data.config;
  data.node.el.draggable = true;
  data.node.data.abortControllers.mainNode = addEvents(data.node.el, {
    keydown: nodeEventData(config.handleKeydownNode),
    dragstart: nodeEventData(config.handleDragstart),
    dragover: nodeEventData(config.handleDragoverNode),
    dragenter: nodeEventData(config.handleDragenterNode),
    dragleave: nodeEventData(config.handleDragleaveNode),
    dragend: nodeEventData(config.handleEnd),
    touchstart: nodeEventData(config.handleTouchstart),
    pointerdown: nodeEventData(config.handlePointerdownNode),
    pointerup: nodeEventData(config.handlePointerupNode),
    pointermove: nodeEventData(config.handlePointermove),
    handlePointeroverNode: config.handlePointeroverNode,
    mousedown: () => {
      if (!config.nativeDrag) isNative = false;
      else isNative = true;
    }
  });
  data.node.el.setAttribute("role", "option");
  data.node.el.setAttribute("aria-selected", "false");
  config.reapplyDragClasses(data.node.el, data.parent.data);
  data.parent.data.config.plugins?.forEach((plugin) => {
    plugin(data.parent.el)?.setupNode?.(data);
  });
}
function setupNodeRemap(data) {
  nodes.set(data.node.el, data.node.data);
  data.parent.data.config.plugins?.forEach((plugin) => {
    plugin(data.parent.el)?.setupNodeRemap?.(data);
  });
}
function reapplyDragClasses(node, parentData) {
  if (!isDragState(state)) return;
  const dropZoneClass = isSynthDragState(state) ? parentData.config.synthDropZoneClass : parentData.config.dropZoneClass;
  if (state.draggedNode.el !== node) return;
  addNodeClass([node], dropZoneClass, true);
}
function tearDownNodeRemap(data) {
  data.parent.data.config.plugins?.forEach((plugin) => {
    plugin(data.parent.el)?.tearDownNodeRemap?.(data);
  });
}
function tearDownNode(data) {
  data.parent.data.config.plugins?.forEach((plugin) => {
    plugin(data.parent.el)?.tearDownNode?.(data);
  });
  data.node.el.draggable = false;
  if (data.node.data?.abortControllers?.mainNode)
    data.node.data?.abortControllers?.mainNode.abort();
}
function nodesMutated(mutationList) {
  const parentEl = mutationList[0].target;
  if (!(parentEl instanceof HTMLElement)) return;
  const allSelectedAndActiveNodes = document.querySelectorAll(
    `[aria-selected="true"]`
  );
  const parentData = parents.get(parentEl);
  if (!parentData) return;
  for (let x = 0; x < allSelectedAndActiveNodes.length; x++) {
    const node = allSelectedAndActiveNodes[x];
    node.setAttribute("aria-selected", "false");
    removeClass([node], parentData.config.selectedClass);
  }
  remapNodes(parentEl);
}
function remapNodes(parent, force) {
  const parentData = parents.get(parent);
  if (!parentData) return;
  parentData.privateClasses = Array.from(parent.classList);
  const enabledNodes = [];
  const config = parentData.config;
  for (let x = 0; x < parent.children.length; x++) {
    const node = parent.children[x];
    if (!isNode(node)) continue;
    const nodeData = nodes.get(node);
    if (force || !nodeData)
      config.tearDownNode({
        parent: {
          el: parent,
          data: parentData
        },
        node: {
          el: node,
          data: nodeData
        }
      });
    if (config.disabled) continue;
    if (!config.draggable || config.draggable && config.draggable(node)) {
      enabledNodes.push(node);
    }
  }
  if (enabledNodes.length !== parentData.getValues(parent).length && !config.disabled) {
    console.warn(
      "The number of draggable items defined in the parent element does not match the number of values. This may cause unexpected behavior."
    );
    return;
  }
  if (parentData.config.treeGroup && !parentData.config.treeAncestor) {
    let nextAncestorEl = parent.parentElement;
    let eventDispatched = false;
    while (nextAncestorEl) {
      if (!parents.has(nextAncestorEl)) {
        nextAncestorEl = nextAncestorEl.parentElement;
        continue;
      }
      nextAncestorEl.dispatchEvent(
        new CustomEvent("hasNestedParent", {
          detail: {
            parent: { data: parentData, el: parent }
          }
        })
      );
      eventDispatched = true;
      nextAncestorEl = null;
    }
    if (!eventDispatched) console.warn("No ancestor found for tree group");
  }
  const values = parentData.getValues(parent);
  const enabledNodeRecords = [];
  for (let x = 0; x < enabledNodes.length; x++) {
    const node = enabledNodes[x];
    const prevNodeData = nodes.get(node);
    const nodeData = Object.assign(
      prevNodeData ?? {
        privateClasses: [],
        abortControllers: {}
      },
      {
        value: values[x],
        index: x
      }
    );
    if (!isDragState(state) && state.newActiveDescendant && state.newActiveDescendant.data.value === nodeData.value) {
      setActive(
        {
          data: parentData,
          el: parent
        },
        {
          el: node,
          data: nodeData
        },
        state
      );
    }
    if (!isDragState(state) && state.activeState && state.activeState.node.data.value === nodeData.value) {
      setActive(
        {
          data: parentData,
          el: parent
        },
        {
          el: node,
          data: nodeData
        },
        state
      );
    }
    if (isDragState(state) && nodeData.value === state.draggedNode.data.value) {
      state.draggedNode.data = nodeData;
      state.draggedNode.el = node;
      const draggedNode = state.draggedNodes.find(
        (x2) => x2.data.value === nodeData.value
      );
      if (draggedNode) draggedNode.el = node;
      if (isSynthDragState(state))
        state.draggedNode.el.setPointerCapture(state.pointerId);
    }
    enabledNodeRecords.push({
      el: node,
      data: nodeData
    });
    if (force || !prevNodeData)
      config.setupNode({
        parent: {
          el: parent,
          data: parentData
        },
        node: {
          el: node,
          data: nodeData
        }
      });
    setupNodeRemap({
      parent: {
        el: parent,
        data: parentData
      },
      node: {
        el: node,
        data: nodeData
      }
    });
  }
  parents.set(parent, { ...parentData, enabledNodes: enabledNodeRecords });
  config.remapFinished(parentData);
  parentData.config.plugins?.forEach((plugin) => {
    plugin(parent)?.remapFinished?.();
  });
}
function remapFinished() {
  state.remapJustFinished = true;
  if ("draggedNode" in state) state.affectedNodes = [];
}
function validateDragstart(data) {
  return !!data.targetData.parent.data.config.nativeDrag;
}
function draggedNodes(data) {
  if (!data.targetData.parent.data.config.multiDrag) {
    return [data.targetData.node];
  } else if (state.selectedState) {
    return [
      data.targetData.node,
      ...state.selectedState?.nodes.filter(
        (x) => x.el !== data.targetData.node.el
      )
    ];
  }
  return [];
}
function handleDragstart(data, state2) {
  if (!validateDragstart(data) || !validateDragHandle(data)) {
    data.e.preventDefault();
    return;
  }
  const config = data.targetData.parent.data.config;
  const nodes2 = config.draggedNodes(data);
  config.dragstartClasses(data.targetData.node, nodes2, config);
  const dragState = initDrag(data, nodes2);
  if (config.onDragstart)
    config.onDragstart(
      {
        parent: data.targetData.parent,
        values: parentValues(
          data.targetData.parent.el,
          data.targetData.parent.data
        ),
        draggedNode: dragState.draggedNode,
        draggedNodes: dragState.draggedNodes,
        position: dragState.initialIndex
      },
      state2
    );
}
function handlePointerdownNode(data, state2) {
  if (!validateDragHandle(data)) return;
  data.e.stopPropagation();
  synthNodePointerDown = true;
  const parentData = data.targetData.parent.data;
  let selectedNodes = [data.targetData.node];
  const commandKey = data.e.ctrlKey || data.e.metaKey;
  const shiftKey = data.e.shiftKey;
  const targetNode = data.targetData.node;
  if (commandKey && parentData.config.multiDrag) {
    if (state2.selectedState) {
      const idx = state2.selectedState.nodes.findIndex(
        (x) => x.el === targetNode.el
      );
      if (idx === -1) {
        selectedNodes = [...state2.selectedState.nodes, targetNode];
      } else {
        selectedNodes = state2.selectedState.nodes.filter(
          (x) => x.el !== targetNode.el
        );
      }
    } else {
      selectedNodes = [targetNode];
    }
    setSelected(
      data.targetData.parent,
      selectedNodes,
      data.targetData.node,
      state2,
      true
    );
    return;
  }
  if (shiftKey && parentData.config.multiDrag) {
    const nodes2 = data.targetData.parent.data.enabledNodes;
    if (state2.selectedState && state2.activeState) {
      if (state2.selectedState.parent.el !== data.targetData.parent.el) {
        deselect(state2.selectedState.nodes, state2.selectedState.parent, state2);
        state2.selectedState = void 0;
        for (let x = 0; x <= targetNode.data.index; x++)
          selectedNodes.push(nodes2[x]);
      } else {
        const [minIndex, maxIndex] = state2.activeState.node.data.index < data.targetData.node.data.index ? [
          state2.activeState.node.data.index,
          data.targetData.node.data.index
        ] : [
          data.targetData.node.data.index,
          state2.activeState.node.data.index
        ];
        selectedNodes = nodes2.slice(minIndex, maxIndex + 1);
      }
    } else {
      for (let x = 0; x <= targetNode.data.index; x++)
        selectedNodes.push(nodes2[x]);
    }
    setSelected(
      data.targetData.parent,
      selectedNodes,
      data.targetData.node,
      state2,
      true
    );
    return;
  }
  if (state2.selectedState?.nodes?.length) {
    const idx = state2.selectedState.nodes.findIndex(
      (x) => x.el === data.targetData.node.el
    );
    if (idx === -1) {
      if (state2.selectedState.parent.el !== data.targetData.parent.el) {
        deselect(state2.selectedState.nodes, data.targetData.parent, state2);
      } else if (parentData.config.multiDrag && (touchDevice || !isNative)) {
        selectedNodes.push(...state2.selectedState.nodes);
      } else {
        deselect(state2.selectedState.nodes, data.targetData.parent, state2);
      }
      setSelected(
        data.targetData.parent,
        selectedNodes,
        data.targetData.node,
        state2,
        true
      );
    }
  } else {
    setSelected(
      data.targetData.parent,
      [data.targetData.node],
      data.targetData.node,
      state2,
      true
    );
  }
}
function dragstartClasses(_node, nodes2, config) {
  addNodeClass(
    nodes2.map((x) => x.el),
    config.draggingClass
  );
  setTimeout(() => {
    removeClass(
      nodes2.map((x) => x.el),
      config.draggingClass
    );
    removeClass(
      nodes2.map((x) => x.el),
      config.activeDescendantClass
    );
    removeClass(
      nodes2.map((x) => x.el),
      config.selectedClass
    );
  });
}
function initDrag(data, draggedNodes2) {
  const dragState = setDragState(dragStateProps(data, draggedNodes2));
  data.e.stopPropagation();
  if (data.e.dataTransfer) {
    const config = data.targetData.parent.data.config;
    data.e.dataTransfer.dropEffect = config.dragDropEffect;
    data.e.dataTransfer.effectAllowed = config.dragEffectAllowed;
    let dragImage;
    if (config.dragImage) {
      dragImage = config.dragImage(data, draggedNodes2);
    } else {
      if (!config.multiDrag) {
        dragImage = data.targetData.node.el.cloneNode(true);
        copyNodeStyle(data.targetData.node.el, dragImage);
        const clonedNode = data.targetData.node.el.cloneNode(
          true
        );
        copyNodeStyle(data.targetData.node.el, clonedNode, true);
        Object.assign(clonedNode.style, {
          pointerEvents: "none",
          zIndex: "99999",
          position: "absolute",
          left: "-9999px"
        });
        document.body.appendChild(clonedNode);
        data.e.dataTransfer.setDragImage(
          clonedNode,
          data.e.offsetX,
          data.e.offsetY
        );
        setTimeout(() => {
          document.body.removeChild(clonedNode);
        });
        return dragState;
      } else {
        const wrapper = document.createElement("div");
        for (const node of draggedNodes2) {
          const clonedNode = node.el.cloneNode(true);
          clonedNode.style.pointerEvents = "none";
          copyNodeStyle(node.el, clonedNode, true);
          wrapper.append(clonedNode);
        }
        const { width } = draggedNodes2[0].el.getBoundingClientRect();
        Object.assign(wrapper.style, {
          display: "flex",
          flexDirection: "column",
          width: `${width}px`,
          position: "absolute",
          pointerEvents: "none",
          zIndex: "9999",
          left: "-9999px"
        });
        dragImage = wrapper;
      }
      console.log("append drag iamge", dragImage);
      document.body.appendChild(dragImage);
    }
    data.e.dataTransfer.setDragImage(dragImage, data.e.offsetX, data.e.offsetY);
    setTimeout(() => {
      dragImage?.remove();
    });
  }
  return dragState;
}
function validateDragHandle(data) {
  const config = data.targetData.parent.data.config;
  if (!config.dragHandle) return true;
  const dragHandles = data.targetData.node.el.querySelectorAll(
    config.dragHandle
  );
  if (!dragHandles) return false;
  const coordinates = data.e;
  const elFromPoint = config.root.elementFromPoint(
    coordinates.x,
    coordinates.y
  );
  if (!elFromPoint) return false;
  for (const handle of Array.from(dragHandles))
    if (elFromPoint === handle || handle.contains(elFromPoint)) return true;
  return false;
}
function handleClickNode(_data) {
}
function handleClickParent(_data) {
}
function handleKeydownNode(_data) {
}
function handleKeydownParent(data, state2) {
  const activeDescendant = state2.activeState?.node;
  if (!activeDescendant) return;
  const parentData = data.targetData.parent.data;
  const enabledNodes = parentData.enabledNodes;
  const index = enabledNodes.findIndex((x) => x.el === activeDescendant.el);
  if (index === -1) return;
  if (["ArrowDown", "ArrowUp", "ArrowRight", "ArrowLeft"].includes(data.e.key)) {
    data.e.preventDefault();
    const nextIndex = data.e.key === "ArrowDown" || data.e.key === "ArrowRight" ? index + 1 : index - 1;
    if (nextIndex < 0 || nextIndex >= enabledNodes.length) return;
    const nextNode = enabledNodes[nextIndex];
    setActive(data.targetData.parent, nextNode, state2);
  } else if (data.e.key === " ") {
    data.e.preventDefault();
    state2.selectedState && state2.selectedState.nodes.includes(activeDescendant) ? setSelected(
      data.targetData.parent,
      state2.selectedState.nodes.filter((x) => x.el !== activeDescendant.el),
      activeDescendant,
      state2
    ) : setSelected(
      data.targetData.parent,
      [activeDescendant],
      activeDescendant,
      state2
    );
  } else if (data.e.key === "Enter" && state2.selectedState) {
    if (state2.selectedState.parent.el === data.targetData.parent.el && state2.activeState) {
      if (state2.selectedState.nodes[0].el === state2.activeState.node.el) {
        updateLiveRegion(data.targetData.parent, "Cannot drop item on itself");
        return;
      }
      state2.newActiveDescendant = state2.selectedState.nodes[0];
      parentData.config.performSort({
        parent: data.targetData.parent,
        draggedNodes: state2.selectedState.nodes,
        targetNode: state2.activeState.node
      });
      deselect([], data.targetData.parent, state2);
      updateLiveRegion(data.targetData.parent, "Drop successful");
    } else if (state2.activeState && state2.selectedState.parent.el !== data.targetData.parent.el && validateTransfer({
      currentParent: data.targetData.parent,
      targetParent: state2.selectedState.parent,
      initialParent: state2.selectedState.parent,
      draggedNodes: state2.selectedState.nodes,
      state: state2
    })) {
      parentData.config.performTransfer({
        currentParent: state2.selectedState.parent,
        targetParent: data.targetData.parent,
        initialParent: state2.selectedState.parent,
        draggedNodes: state2.selectedState.nodes,
        initialIndex: state2.selectedState.nodes[0].data.index,
        state: state2,
        targetNode: state2.activeState.node
      });
      state2.newActiveDescendant = state2.selectedState.nodes[0];
      setSelected(data.targetData.parent, [], void 0, state2);
      updateLiveRegion(data.targetData.parent, "Drop successful");
    }
  }
}
function preventSortOnScroll() {
  let scrollTimeout;
  return () => {
    clearTimeout(scrollTimeout);
    if (state) state.preventEnter = true;
    scrollTimeout = setTimeout(() => {
      if (state) state.preventEnter = false;
    }, 100);
  };
}
function handlePointeroverNode3(e) {
  if (e.detail.targetData.parent.el === e.detail.state.currentParent.el)
    sort(e.detail, e.detail.state);
  else transfer(e.detail, e.detail.state);
}
function handleEnd(data, state2) {
  data.e.preventDefault();
  cancelSynthScroll();
  for (const [_el, controller] of state2.scrollEls) controller.abort();
  if ("longPressTimeout" in state2 && state2.longPressTimeout)
    clearTimeout(state2.longPressTimeout);
  const config = parents.get(state2.initialParent.el)?.config;
  const isSynth = "clonedDraggedNode" in state2 && state2.clonedDraggedNode;
  const dropZoneClass = isSynth ? config?.synthDropZoneClass : config?.dropZoneClass;
  if (state2.originalZIndex !== void 0)
    state2.draggedNode.el.style.zIndex = state2.originalZIndex;
  removeClass(
    state2.draggedNodes.map((x) => x.el),
    dropZoneClass
  );
  if (config?.longPressClass) {
    removeClass(
      state2.draggedNodes.map((x) => x.el),
      state2.initialParent.data?.config?.longPressClass
    );
  }
  if (isSynth) state2.clonedDraggedNode.remove();
  if (config?.onDragend)
    config.onDragend({
      parent: state2.currentParent,
      values: parentValues(state2.currentParent.el, state2.currentParent.data),
      draggedNode: state2.draggedNode,
      draggedNodes: state2.draggedNodes,
      position: state2.initialIndex
    });
  deselect(state2.draggedNodes, state2.currentParent, state2);
  setActive(data.targetData.parent, void 0, state2);
  resetState();
  state2.selectedState = void 0;
  synthNodePointerDown = false;
}
function handleTouchstart(data, _state) {
  if (data.e.cancelable) data.e.preventDefault();
}
function handlePointerupNode(data, state2) {
  if (!state2.pointerSelection && state2.selectedState)
    deselect(state2.selectedState.nodes, data.targetData.parent, state2);
  state2.pointerSelection = false;
  synthNodePointerDown = false;
  if (!isDragState(state2)) return;
  handleEnd(data, state2);
}
function handlePointermove(data, state2) {
  if (isNative || !synthNodePointerDown || !validateDragHandle(data)) return;
  if (!isSynthDragState(state2)) {
    const config = data.targetData.parent.data.config;
    const nodes2 = config.draggedNodes(data);
    config.dragstartClasses(data.targetData.node, nodes2, config);
    const synthDragState = initSynthDrag(data, state2, nodes2);
    synthDragState.clonedDraggedNode.style.display = synthDragState.draggedNodeDisplay || "";
    synthMove(data, synthDragState);
    if (config.onDragstart)
      config.onDragstart(
        {
          parent: data.targetData.parent,
          values: parentValues(
            data.targetData.parent.el,
            data.targetData.parent.data
          ),
          draggedNode: synthDragState.draggedNode,
          draggedNodes: synthDragState.draggedNodes,
          position: synthDragState.initialIndex
        },
        synthDragState
      );
    synthDragState.draggedNode.el.setPointerCapture(data.e.pointerId);
    synthDragState.pointerId = data.e.pointerId;
    return;
  }
  synthMove(data, state2);
}
function initSynthDrag(data, _state, draggedNodes2) {
  const config = data.targetData.parent.data.config;
  let dragImage;
  console.log("init synth drag");
  if (config.synthDragImage) {
    dragImage = config.synthDragImage(data, draggedNodes2);
  } else {
    if (!config.multiDrag || draggedNodes2.length === 1) {
      dragImage = data.targetData.node.el.cloneNode(true);
      copyNodeStyle(data.targetData.node.el, dragImage);
      Object.assign(dragImage.style, {
        width: data.targetData.node.el.getBoundingClientRect().width,
        zIndex: 9999,
        pointerEvents: "none"
      });
      document.body.appendChild(dragImage);
    } else {
      const wrapper = document.createElement("div");
      for (const node of draggedNodes2) {
        const clonedNode = node.el.cloneNode(true);
        copyNodeStyle(node.el, clonedNode);
        clonedNode.style.pointerEvents = "none";
        wrapper.append(clonedNode);
      }
      const { width } = draggedNodes2[0].el.getBoundingClientRect();
      Object.assign(wrapper.style, {
        display: "flex",
        flexDirection: "column",
        width: `${width}px`,
        position: "fixed",
        pointerEvents: "none",
        zIndex: "9999",
        left: "-9999px"
      });
      dragImage = wrapper;
    }
  }
  const display = dragImage.style.display;
  dragImage.style.display = "none";
  document.body.append(dragImage);
  dragImage.style.position = "absolute";
  const synthDragStateProps = {
    clonedDraggedEls: [],
    clonedDraggedNode: dragImage,
    draggedNodeDisplay: display,
    synthDragScrolling: false
  };
  addEvents(document, {
    contextmenu: noDefault
  });
  const synthDragState = setDragState({
    ...dragStateProps(data, draggedNodes2, false),
    ...synthDragStateProps
  });
  return synthDragState;
}
function handleLongPress(data, dragState) {
  const config = data.targetData.parent.data.config;
  if (!config.longPress) return;
  dragState.longPressTimeout = setTimeout(() => {
    if (!dragState) return;
    dragState.longPress = true;
    if (config.longPressClass && data.e.cancelable)
      addNodeClass(
        dragState.draggedNodes.map((x) => x.el),
        config.longPressClass
      );
    data.e.preventDefault();
  }, config.longPressTimeout || 200);
}
function pointermoveClasses(state2, config) {
  if (config.longPressClass)
    removeClass(
      state2.draggedNodes.map((x) => x.el),
      config?.longPressClass
    );
  if (config.synthDropZoneClass)
    addNodeClass(
      state2.draggedNodes.map((x) => x.el),
      config.synthDropZoneClass,
      true
    );
}
function getScrollData(e, state2) {
  if (!(e.currentTarget instanceof HTMLElement)) return;
  const {
    x: xThresh,
    y: yThresh,
    scrollOutside
  } = state2.initialParent.data.config.scrollBehavior;
  const coordinates = getRealCoords(e.currentTarget);
  return {
    xThresh,
    yThresh,
    scrollOutside,
    scrollParent: e.currentTarget,
    x: coordinates.left,
    y: coordinates.top,
    clientWidth: e.currentTarget.clientWidth,
    clientHeight: e.currentTarget.clientHeight,
    scrollWidth: e.currentTarget.scrollWidth,
    scrollHeight: e.currentTarget.scrollHeight
  };
}
function cancelSynthScroll() {
  if (animationFrameId !== null) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }
}
function setSynthScrollDirection(direction, el, state2) {
  if (state2.synthScrollDirection === direction) return;
  state2.synthScrollDirection = direction;
  cancelSynthScroll();
  if (direction === "up" && el.scrollTop === 0) return;
  if (direction === "down" && el.scrollTop + el.clientHeight >= el.scrollHeight)
    return;
  if (direction === "left" && el.scrollLeft === 0) return;
  if (direction === "right" && el.scrollLeft + el.clientWidth >= el.scrollWidth)
    return;
  let lastTimestamp = null;
  const scroll = (timestamp) => {
    if (lastTimestamp === null) lastTimestamp = timestamp;
    const elapsed = timestamp - lastTimestamp;
    const baseSpeed = 500;
    const distance = baseSpeed * elapsed / 1e3;
    if (state2.synthScrollDirection === void 0 && animationFrameId) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
      return;
    }
    switch (direction) {
      case "up":
        el.scrollBy(0, -distance);
        state2.clonedDraggedNode.style.top = `${state2.coordinates.y + el.scrollTop}px`;
        break;
      case "down":
        el.scrollBy(0, distance);
        state2.clonedDraggedNode.style.top = `${state2.coordinates.y + el.scrollTop - state2.startTop}px`;
        break;
      case "left":
        el.scrollBy(-distance, 0);
        state2.clonedDraggedNode.style.left = `${state2.coordinates.x + el.scrollLeft}px`;
        break;
      case "right":
        state2.clonedDraggedNode.style.left = `${state2.coordinates.x + el.scrollLeft}px`;
        el.scrollBy(distance, 0);
    }
    lastTimestamp = timestamp;
    animationFrameId = requestAnimationFrame(scroll);
  };
  animationFrameId = requestAnimationFrame(scroll);
}
function shouldScroll(direction, e, state2) {
  const dataScrollData = getScrollData(e, state2);
  if (!dataScrollData) return false;
  switch (direction) {
    case "down":
      return !!shouldScrollDown(state2, dataScrollData);
    case "up":
      return !!shouldScrollUp(state2, dataScrollData);
    case "right":
      return !!shouldScrollRight(state2, dataScrollData);
    case "left":
      return !!shouldScrollLeft(state2, dataScrollData);
    default:
      return false;
  }
}
function shouldScrollRight(state2, data) {
  return;
  const diff = data.scrollParent.clientWidth + data.x - state2.coordinates.x;
  if (!data.scrollOutside && diff < 0) return;
  if (diff < (1 - data.xThresh) * data.scrollParent.clientWidth && !(data.scrollParent.scrollLeft + data.scrollParent.clientWidth >= data.scrollParent.scrollWidth))
    return state2;
}
function shouldScrollLeft(state2, data) {
  return;
  const diff = data.scrollParent.clientWidth + data.x - state2.coordinates.x;
  if (!data.scrollOutside && diff > data.scrollParent.clientWidth) return;
  if (diff > data.xThresh * data.scrollParent.clientWidth && data.scrollParent.scrollLeft !== 0)
    return state2;
}
function shouldScrollUp(state2, data) {
  return state2.coordinates.y <= 0.1 * data.scrollParent.clientHeight && data.scrollParent.scrollTop !== 0;
}
function shouldScrollDown(state2, data) {
  return state2.coordinates.y > data.clientHeight * data.yThresh && data.scrollParent.scrollTop !== data.scrollParent.clientHeight;
}
function moveNode(data, state2) {
  const { x, y } = eventCoordinates(data.e);
  state2.coordinates.y = y;
  state2.coordinates.x = x;
  const startLeft = state2.startLeft ?? 0;
  const startTop = state2.startTop ?? 0;
  state2.clonedDraggedNode.style.top = `${y - startTop + window.scrollY}px`;
  state2.clonedDraggedNode.style.left = `${x - startLeft + window.scrollX}px`;
  if (data.e.cancelable) data.e.preventDefault();
  pointermoveClasses(state2, data.targetData.parent.data.config);
}
function synthMove(data, state2) {
  const config = data.targetData.parent.data.config;
  if (config.longPress && !state2.longPress) {
    clearTimeout(state2.longPressTimeout);
    return;
  }
  moveNode(data, state2);
  const elFromPoint = getElFromPoint(eventCoordinates(data.e));
  if (!elFromPoint) return;
  const pointerMoveEventData = {
    e: data.e,
    targetData: elFromPoint,
    state: state2
  };
  if ("node" in elFromPoint) {
    elFromPoint.node.el.dispatchEvent(
      new CustomEvent("handlePointeroverNode", {
        detail: pointerMoveEventData
      })
    );
  } else {
    elFromPoint.parent.el.dispatchEvent(
      new CustomEvent("handlePointeroverParent", {
        detail: pointerMoveEventData
      })
    );
  }
}
function handleScroll(e) {
  e.stopPropagation();
  if (!isSynthDragState(state)) return;
  let directionSet = false;
  for (const direction of Object.keys(scrollConfig)) {
    if (shouldScroll(direction, e, state)) {
      setSynthScrollDirection(
        direction,
        e.currentTarget,
        state
      );
      directionSet = true;
      break;
    }
  }
  if (!directionSet) state.synthScrollDirection = void 0;
}
function handleDragoverNode4(data, state2) {
  const { x, y } = eventCoordinates(data.e);
  state2.coordinates.y = y;
  state2.coordinates.x = x;
  data.e.preventDefault();
  data.e.stopPropagation();
  data.targetData.parent.el === state2.currentParent?.el ? sort(data, state2) : transfer(data, state2);
}
function handleDragoverParent3(data, state2) {
  if (!state2) return;
  Object.assign(eventCoordinates(data.e));
  transfer(data, state2);
}
function handlePointeroverParent4(e) {
  if (e.detail.targetData.parent.el !== e.detail.state.currentParent.el)
    transfer(e.detail, e.detail.state);
}
function validateTransfer({
  currentParent,
  targetParent,
  initialParent,
  draggedNodes: draggedNodes2,
  state: state2
}) {
  if (targetParent.el === currentParent.el) return false;
  const targetConfig = targetParent.data.config;
  if (targetConfig.treeGroup && draggedNodes2[0].el.contains(targetParent.el))
    return false;
  if (targetConfig.dropZone === false) return false;
  const initialParentConfig = initialParent.data.config;
  if (targetConfig.accepts) {
    return targetConfig.accepts(
      targetParent,
      initialParent,
      currentParent,
      state2
    );
  } else if (!targetConfig.group || targetConfig.group !== initialParentConfig.group) {
    return false;
  }
  return true;
}
function handleDragenterNode(data, _state) {
  data.e.preventDefault();
}
function handleDragleaveNode(data, _state) {
  data.e.preventDefault();
}
function validateSort(data, state2, x, y) {
  if (state2.affectedNodes.map((x2) => x2.data.value).includes(data.targetData.node.data.value)) {
    return false;
  }
  if (state2.remapJustFinished) {
    state2.remapJustFinished = false;
    if (data.targetData.node.data.value === state2.currentTargetValue || state2.draggedNodes.map((x2) => x2.el).includes(data.targetData.node.el)) {
      state2.currentTargetValue = data.targetData.node.data.value;
    }
    return false;
  }
  if (state2.preventEnter) return false;
  if (state2.draggedNodes.map((x2) => x2.el).includes(data.targetData.node.el)) {
    state2.currentTargetValue = void 0;
    return false;
  }
  if (data.targetData.node.data.value === state2.currentTargetValue)
    return false;
  if (data.targetData.parent.el !== state2.currentParent?.el || data.targetData.parent.data.config.sortable === false)
    return false;
  const targetRect = data.targetData.node.el.getBoundingClientRect();
  const dragRect = state2.draggedNode.el.getBoundingClientRect();
  const yDiff = targetRect.y - dragRect.y;
  const xDiff = targetRect.x - dragRect.x;
  let incomingDirection;
  if (Math.abs(yDiff) > Math.abs(xDiff)) {
    incomingDirection = yDiff > 0 ? "above" : "below";
  } else {
    incomingDirection = xDiff > 0 ? "left" : "right";
  }
  const threshold = state2.currentParent.data.config.threshold;
  switch (incomingDirection) {
    case "left":
      if (x > targetRect.x + targetRect.width * threshold.horizontal) {
        state2.incomingDirection = "left";
        return true;
      }
      break;
    case "right":
      if (x < targetRect.x + targetRect.width * (1 - threshold.horizontal)) {
        state2.incomingDirection = "right";
        return true;
      }
      break;
    case "above":
      if (y > targetRect.y + targetRect.height * threshold.vertical) {
        state2.incomingDirection = "above";
        return true;
      }
      break;
    case "below":
      if (y < targetRect.y + targetRect.height * (1 - threshold.vertical)) {
        state2.incomingDirection = "below";
        return true;
      }
      break;
    default:
      break;
  }
  return false;
}
function sort(data, state2) {
  const { x, y } = eventCoordinates(data.e);
  if (!validateSort(data, state2, x, y)) return;
  const range = state2.draggedNode.data.index > data.targetData.node.data.index ? [data.targetData.node.data.index, state2.draggedNode.data.index] : [state2.draggedNode.data.index, data.targetData.node.data.index];
  state2.targetIndex = data.targetData.node.data.index;
  state2.affectedNodes = data.targetData.parent.data.enabledNodes.filter(
    (node) => {
      return range[0] <= node.data.index && node.data.index <= range[1] && node.el !== state2.draggedNode.el;
    }
  );
  data.targetData.parent.data.config.performSort({
    parent: data.targetData.parent,
    draggedNodes: state2.draggedNodes,
    targetNode: data.targetData.node
  });
}
function nodeEventData(callback) {
  function nodeTargetData(node) {
    const nodeData = nodes.get(node);
    if (!nodeData) return;
    const parentData = parents.get(node.parentNode);
    if (!parentData) return;
    return {
      node: {
        el: node,
        data: nodeData
      },
      parent: {
        el: node.parentNode,
        data: parentData
      }
    };
  }
  return (e) => {
    const targetData = nodeTargetData(e.currentTarget);
    if (!targetData) return;
    return callback(
      {
        e,
        targetData
      },
      state
    );
  };
}
function transfer(data, state2) {
  if (!validateTransfer({
    currentParent: state2.currentParent,
    targetParent: data.targetData.parent,
    initialParent: state2.initialParent,
    draggedNodes: state2.draggedNodes,
    state: state2
  }))
    return;
  data.targetData.parent.data.config.performTransfer({
    currentParent: state2.currentParent,
    targetParent: data.targetData.parent,
    initialParent: state2.initialParent,
    draggedNodes: state2.draggedNodes,
    initialIndex: state2.initialIndex,
    state: state2,
    targetNode: "node" in data.targetData ? data.targetData.node : void 0
  });
  state2.currentParent = data.targetData.parent;
  state2.transferred = true;
}
function parentEventData(callback) {
  function parentTargetData(parent) {
    const parentData = parents.get(parent);
    if (!parentData) return;
    return {
      parent: {
        el: parent,
        data: parentData
      }
    };
  }
  return (e) => {
    const targetData = parentTargetData(e.currentTarget);
    if (!targetData) return;
    return callback(
      {
        e,
        targetData
      },
      state
    );
  };
}
function noDefault(e) {
  e.preventDefault();
}
function throttle(callback, limit) {
  var wait = false;
  return function(...args) {
    if (!wait) {
      callback.call(null, ...args);
      wait = true;
      setTimeout(function() {
        wait = false;
      }, limit);
    }
  };
}
function splitClass(className) {
  return className.split(" ").filter((x) => x);
}
function addNodeClass(els, className, omitAppendPrivateClass = false) {
  function nodeSetter(node, nodeData) {
    nodes.set(node, nodeData);
  }
  for (const el of els) {
    const nodeData = nodes.get(el);
    const newData = addClass(el, className, nodeData, omitAppendPrivateClass);
    if (!newData) continue;
    nodeSetter(el, newData);
  }
}
function addParentClass(els, className, omitAppendPrivateClass = false) {
  function parentSetter(parent, parentData) {
    parents.set(parent, parentData);
  }
  for (const el of els) {
    const parentData = parents.get(el);
    const newData = addClass(el, className, parentData, omitAppendPrivateClass);
    if (!newData) continue;
    parentSetter(el, newData);
  }
}
function addClass(el, className, data, omitAppendPrivateClass = false) {
  if (!className) return;
  const classNames = splitClass(className);
  if (!classNames.length) return;
  if (classNames.includes("longPress")) return;
  if (!data) {
    el.classList.add(...classNames);
    return;
  }
  const privateClasses = [];
  for (const className2 of classNames) {
    if (!el.classList.contains(className2)) {
      el.classList.add(className2);
    } else if (el.classList.contains(className2) && omitAppendPrivateClass === false) {
      privateClasses.push(className2);
    }
  }
  data.privateClasses = privateClasses;
  return data;
}
function removeClass(els, className) {
  if (!className) return;
  const classNames = splitClass(className);
  if (!classNames.length) return;
  for (const node of els) {
    if (!isNode(node)) {
      node.classList.remove(...classNames);
      continue;
    }
    const nodeData = nodes.get(node) || parents.get(node);
    if (!nodeData) continue;
    for (const className2 of classNames) {
      if (!nodeData.privateClasses.includes(className2)) {
        node.classList.remove(className2);
      }
    }
  }
}
function isScrollable(element) {
  if (element === document.documentElement) {
    return element.scrollHeight > element.clientHeight || element.scrollWidth > element.clientWidth;
  }
  const style = window.getComputedStyle(element);
  return (style.overflowY === "auto" || style.overflowY === "scroll") && element.scrollHeight > element.clientHeight || (style.overflowX === "auto" || style.overflowX === "scroll") && element.scrollWidth > element.clientWidth;
}
function getScrollables() {
  return Array.from(document.querySelectorAll("*")).filter(
    (el) => el instanceof HTMLElement && isScrollable(el)
  );
}
function getElFromPoint(coordinates) {
  let target = document.elementFromPoint(coordinates.x, coordinates.y);
  if (!isNode(target)) return;
  let isParent;
  let invalidEl = true;
  while (target && invalidEl) {
    if (nodes.has(target) || parents.has(target)) {
      invalidEl = false;
      isParent = parents.has(target);
      break;
    }
    target = target.parentNode;
  }
  if (!isParent) {
    const targetNodeData = nodes.get(target);
    if (!targetNodeData) return;
    const targetParentData = parents.get(target.parentNode);
    if (!targetParentData) return;
    return {
      node: {
        el: target,
        data: targetNodeData
      },
      parent: {
        el: target.parentNode,
        data: targetParentData
      }
    };
  } else {
    const parentData = parents.get(target);
    if (!parentData) return;
    return {
      parent: {
        el: target,
        data: parentData
      }
    };
  }
}
function isNode(el) {
  return el instanceof HTMLElement && el.parentNode instanceof HTMLElement;
}
function addEvents(el, events) {
  const abortController = new AbortController();
  for (const eventName in events) {
    const handler = events[eventName];
    el.addEventListener(eventName, handler, {
      signal: abortController.signal,
      passive: false
    });
  }
  return abortController;
}
function copyNodeStyle(sourceNode, targetNode, omitKeys = false) {
  const computedStyle = window.getComputedStyle(sourceNode);
  const omittedKeys = [
    "position",
    "z-index",
    "top",
    "left",
    "x",
    "pointer-events",
    "y",
    "transform-origin",
    "filter",
    "-webkit-text-fill-color"
  ];
  for (const key of Array.from(computedStyle)) {
    if (omitKeys === false && key && omittedKeys.includes(key)) continue;
    targetNode.style.setProperty(
      key,
      computedStyle.getPropertyValue(key),
      computedStyle.getPropertyPriority(key)
    );
  }
  for (const child of Array.from(sourceNode.children)) {
    if (!isNode(child)) continue;
    const targetChild = targetNode.children[Array.from(sourceNode.children).indexOf(child)];
    copyNodeStyle(child, targetChild, omitKeys);
  }
}
function eventCoordinates(data) {
  return { x: data.clientX, y: data.clientY };
}
function getRealCoords(el) {
  const { top, bottom, left, right, height, width } = el.getBoundingClientRect();
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
    width
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  addClass,
  addEvents,
  addNodeClass,
  addParentClass,
  animations,
  copyNodeStyle,
  createEmitter,
  dragAndDrop,
  dragStateProps,
  dragValues,
  dragstartClasses,
  emit,
  eventCoordinates,
  getElFromPoint,
  getRealCoords,
  getScrollables,
  handleBlurParent,
  handleClickNode,
  handleClickParent,
  handleDragoverNode,
  handleDragoverParent,
  handleDragstart,
  handleDropParent,
  handleEnd,
  handleFocusParent,
  handleKeydownNode,
  handleKeydownParent,
  handleLongPress,
  handlePointerdownNode,
  handlePointermove,
  handlePointeroverNode,
  handlePointeroverParent,
  handlePointerupNode,
  handleScroll,
  handleTouchstart,
  initDrag,
  insertion,
  isBrowser,
  isDragState,
  isNode,
  isSynthDragState,
  noDefault,
  nodeEventData,
  nodes,
  on,
  parentEventData,
  parentValues,
  parents,
  performSort,
  performTransfer,
  place,
  preventSortOnScroll,
  remapFinished,
  remapNodes,
  removeClass,
  resetState,
  setAttrs,
  setDragState,
  setParentValues,
  setupNode,
  setupNodeRemap,
  sort,
  state,
  swap,
  synthMove,
  tearDown,
  tearDownNode,
  tearDownNodeRemap,
  throttle,
  touchDevice,
  transfer,
  treeAncestors,
  updateConfig,
  validateDragHandle,
  validateDragstart,
  validateSort,
  validateTransfer
});
//# sourceMappingURL=index.cjs.map