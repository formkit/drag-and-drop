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
var index_exports = {};
__export(index_exports, {
  addClass: () => addClass,
  addEvents: () => addEvents,
  addNodeClass: () => addNodeClass,
  addParentClass: () => addParentClass,
  animations: () => animations,
  dragAndDrop: () => dragAndDrop,
  dragStateProps: () => dragStateProps,
  dragValues: () => dragValues,
  dragstartClasses: () => dragstartClasses,
  dropOrSwap: () => dropOrSwap,
  getElFromPoint: () => getElFromPoint,
  handleClickNode: () => handleClickNode,
  handleClickParent: () => handleClickParent,
  handleDragend: () => handleDragend,
  handleDragstart: () => handleDragstart,
  handleEnd: () => handleEnd3,
  handleLongPress: () => handleLongPress,
  handleNodeBlur: () => handleNodeBlur,
  handleNodeDragover: () => handleNodeDragover3,
  handleNodeDrop: () => handleNodeDrop,
  handleNodeFocus: () => handleNodeFocus,
  handleNodeKeydown: () => handleNodeKeydown,
  handleNodePointerdown: () => handleNodePointerdown,
  handleNodePointerover: () => handleNodePointerover2,
  handleNodePointerup: () => handleNodePointerup,
  handleParentDragover: () => handleParentDragover3,
  handleParentDrop: () => handleParentDrop,
  handleParentFocus: () => handleParentFocus,
  handleParentKeydown: () => handleParentKeydown,
  handleParentPointerover: () => handleParentPointerover2,
  handlePointercancel: () => handlePointercancel,
  initDrag: () => initDrag,
  insert: () => insert,
  isBrowser: () => isBrowser,
  isDragState: () => isDragState,
  isNode: () => isNode,
  isSynthDragState: () => isSynthDragState,
  nodeEventData: () => nodeEventData,
  nodes: () => nodes,
  parentEventData: () => parentEventData,
  parentValues: () => parentValues,
  parents: () => parents,
  performSort: () => performSort,
  performTransfer: () => performTransfer,
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
  synthMove: () => synthMove,
  tearDown: () => tearDown,
  tearDownNode: () => tearDownNode,
  tearDownNodeRemap: () => tearDownNodeRemap,
  transfer: () => transfer,
  updateConfig: () => updateConfig,
  validateDragHandle: () => validateDragHandle,
  validateDragstart: () => validateDragstart,
  validateSort: () => validateSort,
  validateTransfer: () => validateTransfer
});
module.exports = __toCommonJS(index_exports);

// src/utils.ts
function pd(e) {
  e.preventDefault();
}
function sp(e) {
  e.stopPropagation();
}
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
function eqRegExp(x, y) {
  return x.source === y.source && x.flags.split("").sort().join("") === y.flags.split("").sort().join("");
}
function eq(valA, valB, deep = true, explicit = ["__key"]) {
  if (valA === valB) return true;
  if (typeof valB === "object" && typeof valA === "object" && valA !== null && valB !== null) {
    if (valA instanceof Map) return false;
    if (valA instanceof Set) return false;
    if (valA instanceof Date && valB instanceof Date)
      return valA.getTime() === valB.getTime();
    if (valA instanceof RegExp && valB instanceof RegExp)
      return eqRegExp(valA, valB);
    if (valA === null || valB === null) return false;
    const objA = valA;
    const objB = valB;
    if (Object.keys(objA).length !== Object.keys(objB).length) return false;
    for (const k of explicit) {
      if ((k in objA || k in objB) && objA[k] !== objB[k]) return false;
    }
    for (const key in objA) {
      if (!(key in objB)) return false;
      if (objA[key] !== objB[key] && !deep) return false;
      if (deep && !eq(objA[key], objB[key], deep, explicit)) return false;
    }
    return true;
  }
  return false;
}
function splitClass(className) {
  return className.split(" ").filter((x) => x);
}
function eventCoordinates(data) {
  return { x: data.clientX, y: data.clientY };
}

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

// src/plugins/insert/index.ts
var insertState = {
  draggedOverNodes: [],
  draggedOverParent: null,
  targetIndex: 0,
  ascending: false,
  insertPoint: null,
  dragging: false
};
var documentController;
function insert(insertConfig) {
  return (parent) => {
    const parentData = parents.get(parent);
    if (!parentData) return;
    const insertParentConfig = {
      ...parentData.config,
      insertConfig
    };
    return {
      teardown() {
        if (parentData.abortControllers.root) {
          parentData.abortControllers.root.abort();
        }
      },
      setup() {
        insertParentConfig.handleNodeDragover = insertConfig.handleNodeDragover || handleNodeDragover;
        insertParentConfig.handleParentPointerover = insertConfig.handleParentPointerover || handleParentPointerover;
        insertParentConfig.handleNodePointerover = insertConfig.handleNodePointerover || handleParentPointerover;
        insertParentConfig.handleParentDragover = insertConfig.handleParentDragover || handleParentDragover;
        const originalHandleend = insertParentConfig.handleEnd;
        insertParentConfig.handleEnd = (state2) => {
          handleEnd(state2);
          originalHandleend(state2);
        };
        parentData.on("dragStarted", () => {
          documentController = addEvents(document, {
            dragover: checkPosition,
            pointermove: checkPosition
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
        window.addEventListener("resize", defineRanges.bind(null, parent));
      }
    };
  };
}
function findFirstOverflowingParent(element) {
  let parent = element.parentElement;
  while (parent) {
    const { overflow, overflowY, overflowX } = getComputedStyle(parent);
    const isOverflowSet = overflow !== "visible" || overflowY !== "visible" || overflowX !== "visible";
    const isOverflowing = parent.scrollHeight > parent.clientHeight || parent.scrollWidth > parent.clientWidth;
    const hasScrollPosition = parent.scrollTop > 0 || parent.scrollLeft > 0;
    if (isOverflowSet && (isOverflowing || hasScrollPosition)) {
      return parent;
    }
    parent = parent.parentElement;
  }
  return null;
}
function checkPosition(e) {
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
function createVerticalRange(nodeCoords, otherCoords, isAscending) {
  const center = nodeCoords.top + nodeCoords.height / 2;
  if (!otherCoords) {
    const offset = nodeCoords.height / 2 + 10;
    return {
      y: isAscending ? [center, center + offset] : [center - offset, center],
      x: [nodeCoords.left, nodeCoords.right],
      vertical: true
    };
  }
  const otherEdge = isAscending ? otherCoords.top : otherCoords.bottom;
  const nodeEdge = isAscending ? nodeCoords.bottom : nodeCoords.top;
  const midpoint = nodeEdge + Math.abs(nodeEdge - otherEdge) / 2;
  return {
    y: isAscending ? [center, midpoint] : [midpoint, center],
    x: [nodeCoords.left, nodeCoords.right],
    vertical: true
  };
}
function createHorizontalRange(nodeCoords, otherCoords, isAscending, lastInRow = false) {
  const center = nodeCoords.left + nodeCoords.width / 2;
  if (!otherCoords) {
    if (isAscending) {
      return {
        x: [center, center + nodeCoords.width],
        y: [nodeCoords.top, nodeCoords.bottom],
        vertical: false
      };
    } else {
      return {
        x: [nodeCoords.left - 10, center],
        y: [nodeCoords.top, nodeCoords.bottom],
        vertical: false
      };
    }
  }
  if (isAscending && lastInRow) {
    return {
      x: [center, nodeCoords.right + 10],
      y: [nodeCoords.top, nodeCoords.bottom],
      vertical: false
    };
  }
  if (isAscending) {
    const nextNodeCenter = otherCoords.left + otherCoords.width / 2;
    return {
      x: [center, center + Math.abs(center - nextNodeCenter) / 2],
      y: [nodeCoords.top, nodeCoords.bottom],
      vertical: false
    };
  } else {
    return {
      x: [
        otherCoords.right + Math.abs(otherCoords.right - nodeCoords.left) / 2,
        center
      ],
      y: [nodeCoords.top, nodeCoords.bottom],
      vertical: false
    };
  }
}
function getRealCoords(el) {
  const { top, bottom, left, right, height, width } = el.getBoundingClientRect();
  const scrollLeft = window.scrollX || document.documentElement.scrollLeft;
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  return {
    top: top + scrollTop,
    bottom: bottom + scrollTop,
    left: left + scrollLeft,
    right: right + scrollLeft,
    height,
    width
  };
}
function defineRanges(parent) {
  if (!isDragState(state)) return;
  const parentData = parents.get(parent);
  if (!parentData) return;
  const enabledNodes = parentData.enabledNodes;
  enabledNodes.forEach((node, index) => {
    node.data.range = {};
    const prevNode = enabledNodes[index - 1];
    const nextNode = enabledNodes[index + 1];
    const nodeCoords = getRealCoords(node.el);
    const prevNodeCoords = prevNode ? getRealCoords(prevNode.el) : void 0;
    const nextNodeCoords = nextNode ? getRealCoords(nextNode.el) : void 0;
    const aboveOrBelowPrevious = prevNodeCoords && (nodeCoords.top > prevNodeCoords.bottom || nodeCoords.bottom < prevNodeCoords.top);
    const aboveOrBelowAfter = nextNodeCoords && (nodeCoords.top > nextNodeCoords.bottom || nodeCoords.bottom < nextNodeCoords.top);
    const fullishWidth = parent.getBoundingClientRect().width * 0.8 < nodeCoords.width;
    if (fullishWidth) {
      node.data.range.ascending = createVerticalRange(
        nodeCoords,
        nextNodeCoords,
        true
      );
      node.data.range.descending = createVerticalRange(
        nodeCoords,
        prevNodeCoords,
        false
      );
    } else if (aboveOrBelowAfter && !aboveOrBelowPrevious) {
      node.data.range.ascending = createHorizontalRange(
        nodeCoords,
        nextNodeCoords,
        true,
        true
      );
      node.data.range.descending = createHorizontalRange(
        nodeCoords,
        prevNodeCoords,
        false
      );
    } else if (!aboveOrBelowPrevious && !aboveOrBelowAfter) {
      node.data.range.ascending = createHorizontalRange(
        nodeCoords,
        nextNodeCoords,
        true
      );
      node.data.range.descending = createHorizontalRange(
        nodeCoords,
        prevNodeCoords,
        false
      );
    } else if (aboveOrBelowPrevious && !nextNodeCoords) {
      node.data.range.ascending = createHorizontalRange(
        nodeCoords,
        void 0,
        true
      );
    } else if (aboveOrBelowPrevious && !aboveOrBelowAfter) {
      node.data.range.ascending = createHorizontalRange(
        nodeCoords,
        nextNodeCoords,
        true
      );
      node.data.range.descending = createHorizontalRange(
        nodeCoords,
        void 0,
        false
      );
    }
  });
}
function handleNodeDragover(data) {
  const config = data.targetData.parent.data.config;
  if (!config.nativeDrag) return;
  data.e.preventDefault();
}
function processParentDragEvent(e, targetData, state2, isNativeDrag) {
  const config = targetData.parent.data.config;
  if (!isNativeDrag && config.nativeDrag) return;
  pd(e);
  if (isNativeDrag) pd(e);
  const { x, y } = eventCoordinates(e);
  const clientX = x;
  const clientY = y;
  const scrollLeft = window.scrollX || document.documentElement.scrollLeft;
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  state2.coordinates.x = clientX + scrollLeft;
  state2.coordinates.y = clientY + scrollTop;
  const nestedParent = targetData.parent.data.nestedParent;
  let realTargetParent = targetData.parent;
  if (nestedParent) {
    const rect = nestedParent.el.getBoundingClientRect();
    if (state2.coordinates.y > rect.top && state2.coordinates.y < rect.bottom)
      realTargetParent = nestedParent;
  }
  if (realTargetParent.el === state2.currentParent?.el) {
    moveBetween(realTargetParent, state2);
  } else {
    moveOutside(realTargetParent, state2);
  }
  state2.currentParent = realTargetParent;
}
function handleParentDragover(data, state2) {
  processParentDragEvent(data.e, data.targetData, state2, true);
}
function handleParentPointerover(data) {
  const { detail } = data;
  const { state: state2, targetData } = detail;
  if (state2.scrolling) return;
  processParentDragEvent(detail.e, targetData, state2, false);
}
function moveBetween(data, state2) {
  if (data.data.config.sortable === false) return;
  if (data.el === insertState.draggedOverParent?.el && insertState.draggedOverParent.data.getValues(data.el).length === 0) {
    return;
  } else if (insertState.draggedOverParent?.el) {
    removeClass(
      [insertState.draggedOverParent.el],
      insertState.draggedOverParent.data.config.dropZoneClass
    );
    insertState.draggedOverParent = null;
  }
  const foundRange = findClosest(data.data.enabledNodes, state2);
  if (!foundRange) return;
  const key = foundRange[1];
  if (foundRange) {
    const position = foundRange[0].data.range ? foundRange[0].data.range[key] : void 0;
    if (position)
      positioninsertPoint(
        data,
        position,
        foundRange[1] === "ascending",
        foundRange[0],
        insertState
      );
  }
}
function moveOutside(data, state2) {
  if (data.el === state2.currentParent.el) return false;
  const targetConfig = data.data.config;
  if (state2.draggedNode.el.contains(data.el)) return false;
  if (targetConfig.dropZone === false) return;
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
    insertState.draggedOverParent = data;
    const insertPoint = insertState.insertPoint;
    if (insertPoint) insertPoint.el.style.display = "none";
  } else {
    removeClass([state2.currentParent.el], targetConfig.dropZoneClass);
    const enabledNodes = data.data.enabledNodes;
    const foundRange = findClosest(enabledNodes, state2);
    if (!foundRange) return;
    const key = foundRange[1];
    if (foundRange) {
      const position = foundRange[0].data.range ? foundRange[0].data.range[key] : void 0;
      if (position)
        positioninsertPoint(
          data,
          position,
          foundRange[1] === "ascending",
          foundRange[0],
          insertState
        );
    }
  }
}
function findClosest(enabledNodes, state2) {
  let foundRange = null;
  for (let x = 0; x < enabledNodes.length; x++) {
    if (!state2 || !enabledNodes[x].data.range) continue;
    if (enabledNodes[x].data.range.ascending) {
      if (state2.coordinates.y > enabledNodes[x].data.range.ascending.y[0] && state2.coordinates.y < enabledNodes[x].data.range.ascending.y[1] && state2.coordinates.x > enabledNodes[x].data.range.ascending.x[0] && state2.coordinates.x < enabledNodes[x].data.range.ascending.x[1]) {
        foundRange = [enabledNodes[x], "ascending"];
        return foundRange;
      }
    }
    if (enabledNodes[x].data.range.descending) {
      if (state2.coordinates.y > enabledNodes[x].data.range.descending.y[0] && state2.coordinates.y < enabledNodes[x].data.range.descending.y[1] && state2.coordinates.x > enabledNodes[x].data.range.descending.x[0] && state2.coordinates.x < enabledNodes[x].data.range.descending.x[1]) {
        foundRange = [enabledNodes[x], "descending"];
        return foundRange;
      }
    }
  }
}
function createInsertPoint(parent, insertState2) {
  const insertPoint = parent.data.config.insertConfig?.insertPoint({
    el: parent.el,
    data: parent.data
  });
  if (!insertPoint)
    throw new Error("Insert point not found", { cause: parent });
  insertState2.insertPoint = {
    parent,
    el: insertPoint
  };
  document.body.appendChild(insertPoint);
  Object.assign(insertPoint, {
    position: "absolute",
    display: "none"
  });
}
function removeInsertPoint(insertState2) {
  if (insertState2.insertPoint?.el) insertState2.insertPoint.el.remove();
  insertState2.insertPoint = null;
}
function positioninsertPoint(parent, position, ascending, node, insertState2) {
  if (insertState2.insertPoint?.el !== parent.el) {
    removeInsertPoint(insertState2);
    createInsertPoint(parent, insertState2);
  }
  insertState2.draggedOverNodes = [node];
  if (!insertState2.insertPoint) return;
  if (position.vertical) {
    const topPosition = position.y[ascending ? 1 : 0] - insertState2.insertPoint.el.getBoundingClientRect().height / 2;
    Object.assign(insertState2.insertPoint.el.style, {
      top: `${topPosition}px`,
      left: `${position.x[0]}px`,
      right: `${position.x[1]}px`,
      height: "4px",
      width: `${position.x[1] - position.x[0]}px`
    });
  } else {
    const leftPosition = position.x[ascending ? 1 : 0] - insertState2.insertPoint.el.getBoundingClientRect().width / 2;
    insertState2.insertPoint.el.style.left = `${leftPosition}px`;
    Object.assign(insertState2.insertPoint.el.style, {
      top: `${position.y[0]}px`,
      bottom: `${position.y[1]}px`,
      width: "4px",
      height: `${position.y[1] - position.y[0]}px`
    });
  }
  insertState2.targetIndex = node.data.index;
  insertState2.ascending = ascending;
  insertState2.insertPoint.el.style.display = "block";
}
function handleEnd(state2) {
  if (!isDragState(state2)) return;
  const insertPoint = insertState.insertPoint;
  if (!insertState.draggedOverParent) {
    const draggedParentValues = parentValues(
      state2.initialParent.el,
      state2.initialParent.data
    );
    const transferred = state2.initialParent.el !== state2.currentParent.el;
    remapNodes(state2.initialParent.el);
    const draggedValues = state2.draggedNodes.map((node) => node.data.value);
    const enabledNodes = [...state2.initialParent.data.enabledNodes];
    const originalIndex = state2.draggedNodes[0].data.index;
    const targetIndex = insertState.targetIndex;
    if (!transferred && insertState.draggedOverNodes[0] && insertState.draggedOverNodes[0].el !== state2.draggedNodes[0].el) {
      const newParentValues = [
        ...draggedParentValues.filter(
          (x) => !draggedValues.some((y) => eq(x, y))
        )
      ];
      let index = insertState.draggedOverNodes[0].data.index;
      if (insertState.targetIndex > state2.draggedNodes[0].data.index && !insertState.ascending) {
        index--;
      } else if (insertState.targetIndex < state2.draggedNodes[0].data.index && insertState.ascending) {
        index++;
      }
      newParentValues.splice(index, 0, ...draggedValues);
      setParentValues(state2.initialParent.el, state2.initialParent.data, [
        ...newParentValues
      ]);
      if (state2.initialParent.data.config.onSort) {
        const sortEventData = {
          parent: {
            el: state2.initialParent.el,
            data: state2.initialParent.data
          },
          previousValues: [...draggedParentValues],
          previousNodes: [...enabledNodes],
          nodes: [...state2.initialParent.data.enabledNodes],
          values: [...newParentValues],
          draggedNodes: state2.draggedNodes,
          targetNodes: insertState.draggedOverNodes,
          previousPosition: originalIndex,
          position: index,
          state: state2
        };
        state2.initialParent.data.config.onSort(sortEventData);
      }
    } else if (transferred && insertState.draggedOverNodes.length) {
      const draggedParentValues2 = parentValues(
        state2.initialParent.el,
        state2.initialParent.data
      );
      let index = insertState.draggedOverNodes[0].data.index || 0;
      if (insertState.ascending) index++;
      const insertValues = state2.initialParent.data.config.insertConfig?.dynamicValues ? state2.initialParent.data.config.insertConfig.dynamicValues({
        sourceParent: state2.initialParent,
        targetParent: state2.currentParent,
        draggedNodes: state2.draggedNodes,
        targetNodes: insertState.draggedOverNodes,
        targetIndex: index
      }) : draggedValues;
      const newParentValues = [
        ...draggedParentValues2.filter(
          (x) => !draggedValues.some((y) => eq(x, y))
        )
      ];
      if (state2.currentParent.el.contains(state2.initialParent.el)) {
        setParentValues(state2.initialParent.el, state2.initialParent.data, [
          ...newParentValues
        ]);
        const targetParentValues = parentValues(
          state2.currentParent.el,
          state2.currentParent.data
        );
        targetParentValues.splice(index, 0, ...insertValues);
        setParentValues(state2.currentParent.el, state2.currentParent.data, [
          ...targetParentValues
        ]);
      } else {
        setParentValues(state2.initialParent.el, state2.initialParent.data, [
          ...newParentValues
        ]);
        const targetParentValues = parentValues(
          state2.currentParent.el,
          state2.currentParent.data
        );
        targetParentValues.splice(index, 0, ...insertValues);
        setParentValues(state2.currentParent.el, state2.currentParent.data, [
          ...targetParentValues
        ]);
      }
      const data = {
        sourceParent: state2.initialParent,
        targetParent: state2.currentParent,
        initialParent: state2.initialParent,
        draggedNodes: state2.draggedNodes,
        targetIndex,
        targetNodes: insertState.draggedOverNodes,
        state: state2
      };
      if (state2.initialParent.data.config.onTransfer)
        state2.initialParent.data.config.onTransfer(data);
      if (state2.currentParent.data.config.onTransfer)
        state2.currentParent.data.config.onTransfer(data);
    }
  } else if (insertState.draggedOverParent) {
    if (state2.currentParent.el.contains(state2.initialParent.el)) {
      const draggedParentValues = parentValues(
        state2.initialParent.el,
        state2.initialParent.data
      );
      const newParentValues = [
        ...draggedParentValues.filter(
          (x) => !draggedValues.some((y) => eq(x, y))
        )
      ];
      setParentValues(state2.initialParent.el, state2.initialParent.data, [
        ...newParentValues
      ]);
      const draggedOverParentValues = parentValues(
        insertState.draggedOverParent.el,
        insertState.draggedOverParent.data
      );
      const draggedValues = state2.draggedNodes.map((node) => node.data.value);
      const insertValues = state2.initialParent.data.config.insertConfig?.dynamicValues ? state2.initialParent.data.config.insertConfig.dynamicValues({
        sourceParent: state2.initialParent,
        targetParent: state2.currentParent,
        draggedNodes: state2.draggedNodes,
        targetNodes: insertState.draggedOverNodes
      }) : draggedValues;
      draggedOverParentValues.push(...insertValues);
      setParentValues(
        insertState.draggedOverParent.el,
        insertState.draggedOverParent.data,
        [...draggedOverParentValues]
      );
    } else {
      const draggedValues = state2.draggedNodes.map((node) => node.data.value);
      const draggedOverParentValues = parentValues(
        insertState.draggedOverParent.el,
        insertState.draggedOverParent.data
      );
      const insertValues = state2.initialParent.data.config.insertConfig?.dynamicValues ? state2.initialParent.data.config.insertConfig.dynamicValues({
        sourceParent: state2.initialParent,
        targetParent: state2.currentParent,
        draggedNodes: state2.draggedNodes,
        targetNodes: insertState.draggedOverNodes
      }) : draggedValues;
      draggedOverParentValues.push(...insertValues);
      setParentValues(
        insertState.draggedOverParent.el,
        insertState.draggedOverParent.data,
        [...draggedOverParentValues]
      );
      const draggedParentValues = parentValues(
        state2.initialParent.el,
        state2.initialParent.data
      );
      const newParentValues = [
        ...draggedParentValues.filter(
          (x) => !draggedValues.some((y) => eq(x, y))
        )
      ];
      setParentValues(state2.initialParent.el, state2.initialParent.data, [
        ...newParentValues
      ]);
    }
    const data = {
      sourceParent: state2.initialParent,
      targetParent: state2.currentParent,
      draggedNodes: state2.draggedNodes,
      targetNodes: insertState.draggedOverNodes,
      state: state2
    };
    if (state2.initialParent.data.config.insertConfig?.insertEvent)
      state2.initialParent.data.config.insertConfig.insertEvent(data);
    if (state2.currentParent.data.config.insertConfig?.insertEvent)
      state2.currentParent.data.config.insertConfig.insertEvent(data);
    removeClass(
      [insertState.draggedOverParent.el],
      insertState.draggedOverParent.data.config.dropZoneClass
    );
  }
  if (insertPoint) insertPoint.el.style.display = "none";
  const dropZoneClass = isSynthDragState(state2) ? state2.initialParent.data.config.synthDropZoneClass : state2.initialParent.data.config.dropZoneClass;
  removeClass(
    insertState.draggedOverNodes.map((node) => node.el),
    dropZoneClass
  );
  const dragPlaceholderClass = state2.initialParent.data.config.dragPlaceholderClass;
  removeClass(
    state2.draggedNodes.map((node) => node.el),
    dragPlaceholderClass
  );
  insertState.draggedOverNodes = [];
  insertState.draggedOverParent = null;
}

// src/plugins/drop-or-swap/index.ts
var dropSwapState = {
  draggedOverNodes: Array(),
  initialDraggedIndex: void 0,
  transferred: false,
  dragging: false
};
var documentController2;
function dropOrSwap(dropSwapConfig = {}) {
  return (parent) => {
    const parentData = parents.get(parent);
    if (!parentData) return;
    const dropSwapParentConfig = {
      ...parentData.config,
      dropSwapConfig
    };
    return {
      setup() {
        dropSwapParentConfig.handleNodeDragover = dropSwapConfig.handleNodeDragover || handleNodeDragover2;
        dropSwapParentConfig.handleParentDragover = dropSwapConfig.handleParentDragover || handleParentDragover2;
        dropSwapParentConfig.handleNodePointerover = dropSwapConfig.handleNodePointerover || handleNodePointerover;
        dropSwapParentConfig.handleParentPointerover = dropSwapConfig.handleParentPointerover || handeParentPointerover;
        const originalHandleend = dropSwapParentConfig.handleEnd;
        dropSwapParentConfig.handleEnd = (state2) => {
          handleEnd2(state2);
          originalHandleend(state2);
        };
        parentData.on("dragStarted", () => {
          documentController2 = addEvents(document, {
            dragover: rootDragover,
            handleRootPointerover: rootPointerover
          });
        });
        parentData.on("dragEnded", () => {
          documentController2?.abort();
        });
        parentData.config = dropSwapParentConfig;
      }
    };
  };
}
function rootDragover(_e) {
  if (!isDragState(state)) return;
  removeClass(
    [state.currentParent.el],
    state.currentParent.data.config.dropZoneParentClass
  );
  state.currentParent = state.initialParent;
}
function rootPointerover(_e) {
  if (!isSynthDragState(state)) return;
  removeClass(
    [state.currentParent.el],
    state.currentParent.data.config.synthDropZoneParentClass
  );
  state.currentParent = state.initialParent;
}
function updateDraggedOverNodes(data, state2) {
  const targetData = "detail" in data ? data.detail.targetData : data.targetData;
  const config = targetData.parent.data.config;
  const dropZoneClass = isSynthDragState(state2) ? config.synthDropZoneClass : config.dropZoneClass;
  removeClass(
    dropSwapState.draggedOverNodes.map((node) => node.el),
    dropZoneClass
  );
  const enabledNodes = targetData.parent.data.enabledNodes;
  if (!enabledNodes) return;
  dropSwapState.draggedOverNodes = enabledNodes.slice(
    targetData.node.data.index,
    targetData.node.data.index + state2.draggedNodes.length
  );
  addNodeClass(
    dropSwapState.draggedOverNodes.map((node) => node.el),
    dropZoneClass,
    true
  );
  state2.currentTargetValue = targetData.node.data.value;
  state2.currentParent = targetData.parent;
  addClass(
    state2.currentParent.el,
    isSynthDragState(state2) ? config.synthDropZoneParentClass : config.dropZoneParentClass,
    state2.currentParent.data,
    true
  );
}
function handleNodeDragover2(data, state2) {
  data.e.preventDefault();
  data.e.stopPropagation();
  updateDraggedOverNodes(data, state2);
}
function handleParentDragover2(data, state2) {
  data.e.preventDefault();
  data.e.stopPropagation();
  const currentConfig = state2.currentParent.data.config;
  removeClass(
    dropSwapState.draggedOverNodes.map((node) => node.el),
    currentConfig.dropZoneClass
  );
  removeClass([state2.currentParent.el], currentConfig.dropZoneParentClass);
  const config = data.targetData.parent.data.config;
  addClass(
    data.targetData.parent.el,
    config.dropZoneParentClass,
    data.targetData.parent.data,
    true
  );
  dropSwapState.draggedOverNodes = [];
  state2.currentParent = data.targetData.parent;
}
function handeParentPointerover(data) {
  const currentConfig = data.detail.state.currentParent.data.config;
  removeClass(
    dropSwapState.draggedOverNodes.map((node) => node.el),
    currentConfig.synthDropZoneClass
  );
  removeClass(
    [data.detail.state.currentParent.el],
    currentConfig.synthDropZoneParentClass
  );
  const config = data.detail.targetData.parent.data.config;
  addClass(
    data.detail.targetData.parent.el,
    config.synthDropZoneParentClass,
    data.detail.targetData.parent.data,
    true
  );
  dropSwapState.draggedOverNodes = [];
  data.detail.state.currentParent = data.detail.targetData.parent;
}
function handleNodePointerover(data) {
  if (!isSynthDragState(data.detail.state)) return;
  updateDraggedOverNodes(data, data.detail.state);
}
function swapElements(arr1, arr2, index1, index2) {
  const indices1 = Array.isArray(index1) ? index1 : [index1];
  if (arr2 === null) {
    const elementsFromArr1 = indices1.map((i) => arr1[i]);
    const elementFromArr2 = arr1[index2];
    arr1.splice(index2, 1, ...elementsFromArr1);
    indices1.forEach((i, idx) => {
      arr1[i] = idx === 0 ? elementFromArr2 : void 0;
    });
    return arr1.filter((el) => el !== void 0);
  } else {
    const elementsFromArr1 = indices1.map((i) => arr1[i]);
    const elementFromArr2 = arr2[index2];
    arr2.splice(index2, 1, ...elementsFromArr1);
    indices1.forEach((i, idx) => {
      arr1[i] = idx === 0 ? elementFromArr2 : void 0;
    });
    return [arr1.filter((el) => el !== void 0), arr2];
  }
}
function handleEnd2(state2) {
  const isSynth = isSynthDragState(state2);
  removeClass(
    [state2.currentParent.el],
    isSynth ? state2.currentParent.data.config.synthDropZoneParentClass : state2.currentParent.data.config.dropZoneParentClass
  );
  removeClass(
    dropSwapState.draggedOverNodes.map((node) => node.el),
    isSynth ? state2.currentParent.data.config.synthDropZoneClass : state2.currentParent.data.config.dropZoneClass
  );
  const values = parentValues(state2.currentParent.el, state2.currentParent.data);
  const draggedValues = state2.draggedNodes.map((node) => node.data.value);
  const newValues = values.filter((x) => !draggedValues.includes(x));
  const targetIndex = dropSwapState.draggedOverNodes[0]?.data.index;
  const draggedIndex = state2.draggedNodes[0].data.index;
  const initialParentValues = parentValues(
    state2.initialParent.el,
    state2.initialParent.data
  );
  if (targetIndex === void 0) {
    if (state2.initialParent.el === state2.currentParent.el) return;
    const newInitialValues = initialParentValues.filter(
      (x) => !draggedValues.includes(x)
    );
    setParentValues(
      state2.initialParent.el,
      state2.initialParent.data,
      newInitialValues
    );
    setParentValues(
      state2.currentParent.el,
      state2.currentParent.data,
      values.concat(draggedValues)
    );
    return;
  }
  let swap = false;
  const shouldSwap = state2.initialParent.data.config.dropSwapConfig?.shouldSwap;
  if (shouldSwap)
    swap = shouldSwap({
      sourceParent: state2.initialParent,
      targetParent: state2.currentParent,
      draggedNodes: state2.draggedNodes,
      targetNodes: dropSwapState.draggedOverNodes,
      state: state2
    });
  if (state2.initialParent.el === state2.currentParent.el) {
    newValues.splice(targetIndex, 0, ...draggedValues);
    setParentValues(
      state2.currentParent.el,
      state2.currentParent.data,
      swap ? swapElements(values, null, draggedIndex, targetIndex) : newValues
    );
  } else {
    if (swap) {
      const res = swapElements(
        initialParentValues,
        newValues,
        state2.initialIndex,
        targetIndex
      );
      setParentValues(
        state2.initialParent.el,
        state2.initialParent.data,
        res[0]
      );
      setParentValues(
        state2.currentParent.el,
        state2.currentParent.data,
        res[1]
      );
    } else {
      const newInitialValues = initialParentValues.filter(
        (x) => !draggedValues.includes(x)
      );
      setParentValues(
        state2.initialParent.el,
        state2.initialParent.data,
        newInitialValues
      );
      newValues.splice(targetIndex, 0, ...draggedValues);
      setParentValues(
        state2.currentParent.el,
        state2.currentParent.data,
        newValues
      );
    }
  }
}

// src/index.ts
var isBrowser = typeof window !== "undefined";
var parents = /* @__PURE__ */ new WeakMap();
var nodes = /* @__PURE__ */ new WeakMap();
function checkTouchSupport() {
  if (!isBrowser) return false;
  return "ontouchstart" in window || navigator.maxTouchPoints > 0;
}
var baseDragState = {
  activeDescendant: void 0,
  affectedNodes: [],
  coordinates: {
    x: 0,
    y: 0
  },
  currentTargetValue: void 0,
  on,
  emit,
  newActiveDescendant: void 0,
  originalZIndex: void 0,
  pointerSelection: false,
  preventEnter: false,
  rootUserSelect: void 0,
  nodePointerdown: void 0,
  longPress: false,
  scrolling: false,
  longPressTimeout: void 0,
  remapJustFinished: false,
  selectedNodes: [],
  selectedParent: void 0,
  preventSynthDrag: false,
  pointerDown: void 0
};
var state = baseDragState;
var dropped = false;
var documentController3;
var windowController;
var scrollTimeout;
var touchDevice = false;
var useNativeDrag = false;
function resetState() {
  const baseDragState2 = {
    activeDescendant: void 0,
    affectedNodes: [],
    coordinates: {
      x: 0,
      y: 0
    },
    on,
    emit,
    currentTargetValue: void 0,
    originalZIndex: void 0,
    pointerId: void 0,
    preventEnter: false,
    remapJustFinished: false,
    selectedNodes: [],
    nodePointerdown: void 0,
    rootUserSelect: void 0,
    preventSynthDrag: false,
    scrolling: false,
    selectedParent: void 0,
    pointerSelection: false,
    synthScrollDirection: void 0,
    draggedNodeDisplay: void 0,
    synthDragScrolling: false,
    longPress: false,
    pointerDown: void 0,
    longPressTimeout: void 0
  };
  state = { ...baseDragState2 };
}
function setDragState(dragStateProps2) {
  Object.assign(state, dragStateProps2);
  dragStateProps2.initialParent.data.emit("dragStarted", state);
  dropped = false;
  state.emit("dragStarted", state);
  return state;
}
function handleRootPointerdown(e) {
  if (state.activeState) setActive(state.activeState.parent, void 0, state);
  if (state.selectedState)
    deselect(state.selectedState.nodes, state.selectedState.parent, state);
  state.selectedState = state.activeState = void 0;
  if (e.pointerType === "mouse") {
    useNativeDrag = true;
  } else if (e.pointerType === "touch" || e.pointerType === "pen") {
    useNativeDrag = false;
  }
}
function handleRootPointerup(e) {
  pd(e);
  if (state.pointerDown) state.pointerDown.node.el.draggable = true;
  state.pointerDown = void 0;
  if (!isSynthDragState(state)) return;
  const config = state.currentParent.data.config;
  if (isSynthDragState(state)) config.handleEnd(state);
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
function handleRootDrop(_e) {
  if (!isDragState(state)) return;
  dropped = true;
  const handleEnd4 = state.initialParent.data.config.handleEnd;
  handleEnd4(state);
}
function handleRootDragover(e) {
  if (!isDragState(state)) return;
  pd(e);
}
function handleRootPointermove(e) {
  if (!state.pointerDown || !state.pointerDown.validated) return;
  const config = state.pointerDown.parent.data.config;
  if (useNativeDrag || e.pointerType === "mouse") {
    return;
  }
  if (!isSynthDragState(state) && (touchDevice || !touchDevice && !config.nativeDrag)) {
    pd(e);
    if (config.longPress && !state.longPress) {
      clearTimeout(state.longPressTimeout);
      state.longPress = false;
      return;
    }
    const nodes2 = config.draggedNodes(state.pointerDown);
    config.dragstartClasses(state.pointerDown.node, nodes2, config, true);
    const synthDragState = initSynthDrag(
      state.pointerDown.node,
      state.pointerDown.parent,
      e,
      state,
      nodes2
    );
    state.rootUserSelect = window.getComputedStyle(
      document.documentElement
    ).userSelect;
    document.body.style.userSelect = "none";
    synthMove(e, synthDragState);
  } else if (isSynthDragState(state)) {
    synthMove(e, state);
  }
}
function dragAndDrop({
  parent,
  getValues,
  setValues,
  config = {}
}) {
  if (!isBrowser) return;
  touchDevice = checkTouchSupport();
  if (!documentController3) {
    documentController3 = addEvents(document, {
      dragover: handleRootDragover,
      pointerdown: handleRootPointerdown,
      pointerup: handleRootPointerup,
      keydown: handleRootKeydown,
      drop: handleRootDrop,
      pointermove: handleRootPointermove,
      pointercancel: nodeEventData(config.handlePointercancel),
      touchmove: (e) => {
        if (isDragState(state) && e.cancelable) pd(e);
      }
    });
    const liveRegion = document.createElement("div");
    setAttrs(liveRegion, {
      "aria-live": "polite",
      "aria-atomic": "true",
      "data-dnd-live-region": "true"
    });
    Object.assign(liveRegion.style, {
      position: "absolute",
      top: "0px",
      left: "-9999px",
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
  if (!windowController)
    windowController = addEvents(window, {
      resize: () => {
        touchDevice = checkTouchSupport();
      }
    });
  tearDown(parent);
  const [emit2, on2] = createEmitter();
  const parentData = {
    getValues,
    setValues,
    config: {
      dragDropEffect: config.dragDropEffect ?? "move",
      dragEffectAllowed: config.dragEffectAllowed ?? "move",
      draggedNodes,
      dragstartClasses,
      handleNodeKeydown,
      handleParentKeydown,
      handleDragstart,
      handleNodeDragover: handleNodeDragover3,
      handleParentDragover: handleParentDragover3,
      handleNodeDrop,
      handleNodeFocus,
      handleNodeBlur,
      handlePointercancel,
      handleEnd: handleEnd3,
      handleDragend,
      handleParentFocus,
      handleNodePointerup,
      handleNodePointerover: handleNodePointerover2,
      handleParentPointerover: handleParentPointerover2,
      handleParentScroll,
      handleNodePointerdown,
      handleNodeDragenter,
      handleNodeDragleave,
      handleParentDrop,
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
      threshold: {
        horizontal: 0,
        vertical: 0
      },
      ...config
    },
    enabledNodes: [],
    abortControllers: {},
    privateClasses: [],
    on: on2,
    emit: emit2
  };
  const nodesObserver = new MutationObserver(nodesMutated);
  nodesObserver.observe(parent, { childList: true });
  parents.set(parent, parentData);
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
function dragStateProps(node, parent, e, draggedNodes2, offsetX, offsetY) {
  const { x, y } = eventCoordinates(e);
  const rect = node.el.getBoundingClientRect();
  return {
    affectedNodes: [],
    ascendingDirection: false,
    clonedDraggedEls: [],
    coordinates: {
      x,
      y
    },
    draggedNode: {
      el: node.el,
      data: node.data
    },
    draggedNodes: draggedNodes2,
    incomingDirection: void 0,
    initialIndex: node.data.index,
    initialParent: {
      el: parent.el,
      data: parent.data
    },
    currentParent: {
      el: parent.el,
      data: parent.data
    },
    longPress: parent.data.config.longPress ?? false,
    longPressTimeout: void 0,
    currentTargetValue: node.data.value,
    scrollEls: [],
    // Need to account for if the explicity offset is positive or negative
    startLeft: offsetX ? offsetX : x - rect.left,
    startTop: offsetY ? offsetY : y - rect.top,
    targetIndex: node.data.index,
    transferred: false
  };
}
function performSort({
  parent,
  draggedNodes: draggedNodes2,
  targetNodes
}) {
  remapNodes(parent.el);
  const draggedValues = draggedNodes2.map((x) => x.data.value);
  const targetParentValues = parentValues(parent.el, parent.data);
  const originalIndex = draggedNodes2[0].data.index;
  const enabledNodes = [...parent.data.enabledNodes];
  const newParentValues = [
    ...targetParentValues.filter((x) => !draggedValues.some((y) => eq(x, y)))
  ];
  newParentValues.splice(targetNodes[0].data.index, 0, ...draggedValues);
  if ("draggedNode" in state)
    state.currentTargetValue = targetNodes[0].data.value;
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
      draggedNodes: draggedNodes2,
      previousPosition: originalIndex,
      position: targetNodes[0].data.index,
      targetNodes,
      state
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
  const liveRegion = document.querySelector('[data-dnd-live-region="true"]');
  if (!liveRegion) return;
  liveRegion.id = parent.el.id + "-live-region";
  liveRegion.textContent = message;
}
function clearLiveRegion(parent) {
  const liveRegion = document.getElementById(parent.el.id + "-live-region");
  if (!liveRegion) return;
  liveRegion.textContent = "";
}
function handleParentFocus(data, state2) {
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
  targetNodes,
  state: state2
}) {
  remapNodes(initialParent.el);
  const draggedValues = draggedNodes2.map((x) => x.data.value);
  const currentParentValues = [
    ...parentValues(currentParent.el, currentParent.data).filter(
      (x) => !draggedValues.some((y) => eq(x, y))
    )
  ];
  const targetParentValues = parentValues(targetParent.el, targetParent.data);
  const reset = initialParent.el === targetParent.el && targetParent.data.config.sortable === false;
  let targetIndex;
  if (targetNodes.length) {
    if (reset) {
      targetIndex = initialIndex;
    } else if (targetParent.data.config.sortable === false) {
      targetIndex = targetParent.data.enabledNodes.length;
    } else {
      targetIndex = targetNodes[0].data.index;
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
      state: state2,
      targetNodes
    });
  }
  if (currentParent.data.config.onTransfer) {
    currentParent.data.config.onTransfer({
      sourceParent: currentParent,
      targetParent,
      initialParent,
      draggedNodes: draggedNodes2,
      targetIndex,
      state: state2,
      targetNodes: targetNodes ? targetNodes : []
    });
  }
}
function parentValues(parent, parentData) {
  return [...parentData.getValues(parent)];
}
function setParentValues(parent, parentData, values) {
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
function handleParentDrop(data, state2) {
  sp(data.e);
  dropped = true;
  const handleEnd4 = state2.initialParent.data.config.handleEnd;
  handleEnd4(state2);
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
  return "synthDragging" in state2 && !!state2.synthDragging;
}
function setup(parent, parentData) {
  parentData.abortControllers.mainParent = addEvents(parent, {
    keydown: parentEventData(parentData.config.handleParentKeydown),
    dragover: parentEventData(parentData.config.handleParentDragover),
    handleParentPointerover: parentData.config.handleParentPointerover,
    scroll: parentEventData(parentData.config.handleParentScroll),
    drop: parentEventData(parentData.config.handleParentDrop),
    hasNestedParent: (e) => {
      const parent2 = parents.get(e.target);
      if (!parent2) return;
      parent2.nestedParent = e.detail.parent;
    },
    focus: parentEventData(parentData.config.handleParentFocus)
  });
  if (parentData.config.externalDragHandle && parentData.config.externalDragHandle.el && parentData.config.externalDragHandle.callback) {
    parentData.abortControllers.externalDragHandle = addEvents(
      parentData.config.externalDragHandle.el,
      {
        pointerdown: (_e) => {
          if (!parentData.config.externalDragHandle || !parentData.config.externalDragHandle.callback)
            return;
          const draggableItem = parentData.config.externalDragHandle.callback();
          if (!isNode(draggableItem)) {
            console.warn(
              "No draggable item found from external drag handle callback"
            );
            return;
          }
          const nodeData = nodes.get(draggableItem);
          if (!nodeData) return;
          const parentNode = draggableItem.parentNode;
          if (!(parentNode instanceof HTMLElement)) return;
          const parent2 = parents.get(parentNode);
          if (!parent2) return;
          state.pointerDown = {
            parent: {
              el: parentNode,
              data: parent2
            },
            node: {
              el: draggableItem,
              data: nodeData
            },
            validated: true
          };
          draggableItem.draggable = true;
        }
      }
    );
  }
  if (parent.id)
    setAttrs(parent, {
      role: "listbox",
      tabindex: "0",
      "aria-multiselectable": parentData.config.multiDrag ? "true" : "false",
      "aria-activedescendant": "",
      "aria-describedby": parent.id + "-live-region"
    });
}
function setAttrs(el, attrs) {
  for (const key in attrs) el.setAttribute(key, attrs[key]);
}
function setupNode(data) {
  const config = data.parent.data.config;
  data.node.data.abortControllers.mainNode = addEvents(data.node.el, {
    keydown: nodeEventData(config.handleNodeKeydown),
    dragstart: nodeEventData(config.handleDragstart),
    dragover: nodeEventData(config.handleNodeDragover),
    dragenter: nodeEventData(config.handleNodeDragenter),
    dragleave: nodeEventData(config.handleNodeDragleave),
    dragend: nodeEventData(config.handleDragend),
    drop: nodeEventData(config.handleNodeDrop),
    focus: nodeEventData(config.handleNodeFocus),
    blur: nodeEventData(config.handleNodeBlur),
    pointerup: nodeEventData(config.handleNodePointerup),
    pointercancel: nodeEventData(config.handlePointercancel),
    pointerdown: nodeEventData(config.handleNodePointerdown),
    handleNodePointerover: config.handleNodePointerover,
    touchmove: (e) => {
      if (isDragState(state) && e.cancelable) pd(e);
    },
    contextmenu: (e) => {
      if (touchDevice) pd(e);
    }
  });
  data.node.el.setAttribute("role", "option");
  data.node.el.setAttribute("aria-selected", "false");
  data.node.el.draggable = true;
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
  if (mutationList.length === 1 && mutationList[0].addedNodes.length === 1 && !(mutationList[0].addedNodes[0] instanceof HTMLElement))
    return;
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
    if (!isNode(node) || node.id === "dnd-dragged-node-clone") continue;
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
  const values = parentData.getValues(parent);
  const enabledNodeRecords = [];
  for (let x = 0; x < enabledNodes.length; x++) {
    const node = enabledNodes[x];
    const prevNodeData = nodes.get(node);
    if (config.draggableValue && !config.draggableValue(values[x])) continue;
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
    if (!isDragState(state) && state.newActiveDescendant && eq(state.newActiveDescendant.data.value, nodeData.value)) {
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
    if (!isDragState(state) && state.activeState && eq(state.activeState.node.data.value, nodeData.value)) {
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
    if (isDragState(state) && eq(state.draggedNode.data.value, nodeData.value)) {
      state.draggedNode.data = nodeData;
      state.draggedNode.el = node;
      const draggedNode = state.draggedNodes.find(
        (x2) => x2.data.value === nodeData.value
      );
      if (draggedNode) draggedNode.el = node;
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
function draggedNodes(pointerDown) {
  if (!pointerDown.parent.data.config.multiDrag) {
    return [pointerDown.node];
  } else if (state.selectedState) {
    return [
      pointerDown.node,
      ...state.selectedState?.nodes.filter(
        (x) => x.el !== pointerDown.node.el
      )
    ];
  }
  return [];
}
function handleParentScroll(_data) {
  if (!isDragState(state)) return;
  state.emit("scrollStarted", state);
  if (isSynthDragState(state)) return;
  state.preventEnter = true;
  if (scrollTimeout) clearTimeout(scrollTimeout);
  scrollTimeout = setTimeout(() => {
    state.preventEnter = false;
    state.emit("scrollEnded", state);
  }, 100);
}
function handleDragstart(data, _state) {
  const config = data.targetData.parent.data.config;
  if (!config.nativeDrag || !validateDragstart(data) || !validateDragHandle({
    x: data.e.clientX,
    y: data.e.clientY,
    node: data.targetData.node,
    config
  })) {
    pd(data.e);
    return;
  }
  const nodes2 = config.draggedNodes({
    parent: data.targetData.parent,
    node: data.targetData.node
  });
  config.dragstartClasses(data.targetData.node, nodes2, config);
  const dragState = initDrag(data, nodes2);
  if (config.onDragstart)
    config.onDragstart({
      parent: data.targetData.parent,
      values: parentValues(
        data.targetData.parent.el,
        data.targetData.parent.data
      ),
      draggedNode: dragState.draggedNode,
      draggedNodes: dragState.draggedNodes,
      position: dragState.initialIndex,
      state: dragState
    });
}
function handleNodePointerdown(data, state2) {
  sp(data.e);
  state2.pointerDown = {
    parent: data.targetData.parent,
    node: data.targetData.node,
    validated: false
  };
  if (data.e.pointerType === "mouse") {
    useNativeDrag = true;
  } else if (data.e.pointerType === "touch" || data.e.pointerType === "pen") {
    useNativeDrag = false;
  }
  if (!validateDragHandle({
    x: data.e.clientX,
    y: data.e.clientY,
    node: data.targetData.node,
    config: data.targetData.parent.data.config
  }))
    return;
  state2.pointerDown = {
    parent: data.targetData.parent,
    node: data.targetData.node,
    validated: true
  };
  handleLongPress(data, state2, data.targetData.node);
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
      } else if (parentData.config.multiDrag && touchDevice) {
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
function dragstartClasses(_node, nodes2, config, isSynth = false) {
  addNodeClass(
    nodes2.map((x) => x.el),
    isSynth ? config.synthDraggingClass : config.draggingClass
  );
  setTimeout(() => {
    removeClass(
      nodes2.map((x) => x.el),
      isSynth ? config.synthDraggingClass : config.draggingClass
    );
    addNodeClass(
      nodes2.map((x) => x.el),
      isSynth ? config.synthDragPlaceholderClass : config.dragPlaceholderClass
    );
    addNodeClass(
      nodes2.map((x) => x.el),
      isSynth ? config.synthDropZoneClass : config.dropZoneClass
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
  sp(data.e);
  const dragState = setDragState(
    dragStateProps(
      data.targetData.node,
      data.targetData.parent,
      data.e,
      draggedNodes2
    )
  );
  if (data.e.dataTransfer) {
    const config = data.targetData.parent.data.config;
    data.e.dataTransfer.dropEffect = config.dragDropEffect;
    data.e.dataTransfer.effectAllowed = config.dragEffectAllowed;
    let dragImage;
    if (config.dragImage) {
      dragImage = config.dragImage(data, draggedNodes2);
    } else {
      if (!config.multiDrag) {
        data.e.dataTransfer.setDragImage(
          data.targetData.node.el,
          data.e.offsetX,
          data.e.offsetY
        );
        const originalZIndex = data.targetData.node.el.style.zIndex;
        dragState.originalZIndex = originalZIndex;
        data.targetData.node.el.style.zIndex = "9999";
        return dragState;
      } else {
        const wrapper = document.createElement("div");
        for (const node of draggedNodes2) {
          const clonedNode = node.el.cloneNode(true);
          clonedNode.style.pointerEvents = "none";
          clonedNode.id = node.el.id + "-clone";
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
      document.body.appendChild(dragImage);
    }
    data.e.dataTransfer.setDragImage(dragImage, data.e.offsetX, data.e.offsetY);
    setTimeout(() => {
      dragImage?.remove();
    });
  }
  return dragState;
}
function validateDragHandle({
  x,
  y,
  node,
  config
}) {
  if (config.externalDragHandle) return false;
  if (!config.dragHandle) return true;
  const dragHandles = node.el.querySelectorAll(config.dragHandle);
  if (!dragHandles) return false;
  const elFromPoint = config.root.elementFromPoint(x, y);
  if (!elFromPoint) return false;
  for (const handle of Array.from(dragHandles))
    if (elFromPoint === handle || handle.contains(elFromPoint)) return true;
  return false;
}
function handleClickNode(_data) {
}
function handleClickParent(_data) {
}
function handleNodeKeydown(_data) {
}
function handleParentKeydown(data, state2) {
  const activeDescendant = state2.activeState?.node;
  if (!activeDescendant) return;
  const parentData = data.targetData.parent.data;
  const enabledNodes = parentData.enabledNodes;
  if (!(data.e.target instanceof HTMLElement)) return;
  const index = enabledNodes.findIndex((x) => x.el === activeDescendant.el);
  if (index === -1) return;
  if (["ArrowDown", "ArrowUp", "ArrowRight", "ArrowLeft"].includes(data.e.key)) {
    if (data.e.target === data.targetData.parent.el) pd(data.e);
    const nextIndex = data.e.key === "ArrowDown" || data.e.key === "ArrowRight" ? index + 1 : index - 1;
    if (nextIndex < 0 || nextIndex >= enabledNodes.length) return;
    const nextNode = enabledNodes[nextIndex];
    setActive(data.targetData.parent, nextNode, state2);
  } else if (data.e.key === " ") {
    if (data.e.target === data.targetData.parent.el) pd(data.e);
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
        targetNodes: [state2.activeState.node]
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
        targetNodes: [state2.activeState.node]
      });
      state2.newActiveDescendant = state2.selectedState.nodes[0];
      setSelected(data.targetData.parent, [], void 0, state2);
      updateLiveRegion(data.targetData.parent, "Drop successful");
    }
  }
}
function preventSortOnScroll() {
  let scrollTimeout2;
  return () => {
    clearTimeout(scrollTimeout2);
    if (state) state.preventEnter = true;
    scrollTimeout2 = setTimeout(() => {
      if (state) state.preventEnter = false;
    }, 100);
  };
}
function handleNodePointerover2(e) {
  if (e.detail.targetData.parent.el === e.detail.state.currentParent.el)
    sort(e.detail, e.detail.state);
  else transfer(e.detail, e.detail.state);
}
function handleNodeDrop(data, state2) {
  const config = data.targetData.parent.data.config;
  if (!config.nativeDrag) return;
  sp(data.e);
  dropped = true;
  config.handleEnd(state2);
}
function handleNodeFocus(data) {
  if (data.e.target === data.e.currentTarget) return;
  if (state.pointerDown) state.pointerDown.node.el.draggable = false;
}
function handleNodeBlur(data) {
  if (data.e.target === data.e.currentTarget) return;
  if (state.pointerDown) state.pointerDown.node.el.draggable = true;
}
function handleDragend(data, state2) {
  const config = data.targetData.parent.data.config;
  if (!config.nativeDrag) return;
  pd(data.e);
  sp(data.e);
  if (dropped) {
    dropped = false;
    return;
  }
  config.handleEnd(state2);
}
function handlePointercancel(data, state2) {
  if (!isSynthDragState(state2)) return;
  pd(data.e);
  if (dropped) {
    dropped = false;
    return;
  }
  const config = parents.get(state2.initialParent.el)?.config;
  if (config?.onDragend) {
    config.onDragend({
      parent: state2.currentParent,
      values: parentValues(state2.currentParent.el, state2.currentParent.data),
      draggedNode: state2.draggedNode,
      draggedNodes: state2.draggedNodes,
      state: state2
    });
  }
  config?.handleEnd(state2);
}
function handleEnd3(state2) {
  if (state2.draggedNode) state2.draggedNode.el.draggable = true;
  document.body.style.userSelect = state2.rootUserSelect || "";
  if (isSynthDragState(state2)) {
    document.documentElement.style.overscrollBehavior = state2.rootOverScrollBehavior || "";
    document.documentElement.style.touchAction = state2.rootTouchAction || "";
  }
  if (isSynthDragState(state2)) cancelSynthScroll(state2);
  if ("longPressTimeout" in state2 && state2.longPressTimeout)
    clearTimeout(state2.longPressTimeout);
  const config = parents.get(state2.initialParent.el)?.config;
  const isSynth = isSynthDragState(state2);
  const dropZoneClass = isSynth ? config?.synthDropZoneClass : config?.dropZoneClass;
  if (state2.originalZIndex !== void 0)
    state2.draggedNode.el.style.zIndex = state2.originalZIndex;
  removeClass(
    state2.draggedNodes.map((x) => x.el),
    dropZoneClass
  );
  removeClass(
    state2.draggedNodes.map((x) => x.el),
    state2.initialParent.data?.config?.longPressClass
  );
  removeClass(
    state2.draggedNodes.map((x) => x.el),
    isSynth ? state2.initialParent.data.config.synthDragPlaceholderClass : state2.initialParent.data?.config?.dragPlaceholderClass
  );
  if (isSynth) state2.clonedDraggedNode.remove();
  deselect(state2.draggedNodes, state2.currentParent, state2);
  setActive(state2.currentParent, void 0, state2);
  resetState();
  state2.selectedState = void 0;
  config?.onDragend?.({
    parent: state2.currentParent,
    values: parentValues(state2.currentParent.el, state2.currentParent.data),
    draggedNode: state2.draggedNode,
    draggedNodes: state2.draggedNodes,
    state: state2
  });
  state2.emit("dragEnded", state2);
}
function handleNodePointerup(data, state2) {
  sp(data.e);
  if (!state2.pointerSelection && state2.selectedState)
    deselect(state2.selectedState.nodes, data.targetData.parent, state2);
  const config = data.targetData.parent.data.config;
  state2.pointerSelection = false;
  if ("longPressTimeout" in state2 && state2.longPressTimeout)
    clearTimeout(state2.longPressTimeout);
  removeClass(
    data.targetData.parent.data.enabledNodes.map((x) => x.el),
    config.longPressClass
  );
  if (!isDragState(state2)) return;
  config.handleEnd(state2);
}
function initSynthDrag(node, parent, e, _state, draggedNodes2) {
  const config = parent.data.config;
  let dragImage;
  let display = node.el.style.display;
  let result = void 0;
  if (config.synthDragImage) {
    result = config.synthDragImage(node, parent, e, draggedNodes2);
    dragImage = result.dragImage;
    dragImage.setAttribute("popover", "manual");
    dragImage.id = "dnd-dragged-node-clone";
    display = dragImage.style.display;
    Object.assign(dragImage.style, {
      position: "absolute",
      zIndex: 9999,
      pointerEvents: "none",
      margin: 0,
      willChange: "transform",
      overflow: "hidden",
      display: "none"
    });
  } else {
    if (!config.multiDrag || draggedNodes2.length === 1) {
      dragImage = node.el.cloneNode(true);
      dragImage.id = "dnd-dragged-node-clone";
      display = dragImage.style.display;
      dragImage.setAttribute("popover", "manual");
      Object.assign(dragImage.style, {
        position: "absolute",
        height: node.el.getBoundingClientRect().height + "px",
        width: node.el.getBoundingClientRect().width + "px",
        overflow: "hidden",
        margin: 0,
        willChange: "transform",
        pointerEvents: "none",
        zIndex: 9999
      });
    } else {
      const wrapper = document.createElement("div");
      wrapper.setAttribute("popover", "manual");
      for (const node2 of draggedNodes2) {
        const clonedNode = node2.el.cloneNode(true);
        clonedNode.style.pointerEvents = "none";
        clonedNode.style.margin = "0";
        wrapper.append(clonedNode);
      }
      display = wrapper.style.display;
      wrapper.id = "dnd-dragged-node-clone";
      dragImage = wrapper;
      Object.assign(dragImage.style, {
        display: "flex",
        flexDirection: "column",
        position: "absolute",
        overflow: "hidden",
        margin: 0,
        padding: 0,
        pointerEvents: "none",
        zIndex: 9999
      });
    }
  }
  dragImage.style.position = "absolute";
  parent.el.appendChild(dragImage);
  dragImage.showPopover();
  const synthDragStateProps = {
    clonedDraggedEls: [],
    clonedDraggedNode: dragImage,
    draggedNodeDisplay: display,
    synthDragScrolling: false,
    synthDragging: true,
    rootScrollWidth: document.scrollingElement?.scrollWidth,
    rootScrollHeight: document.scrollingElement?.scrollHeight,
    rootOverScrollBehavior: document.documentElement.style.overscrollBehavior,
    rootTouchAction: document.documentElement.style.touchAction
  };
  document.documentElement.style.overscrollBehavior = "none";
  document.documentElement.style.touchAction = "none";
  const synthDragState = setDragState({
    ...dragStateProps(
      node,
      parent,
      e,
      draggedNodes2,
      result?.offsetX,
      result?.offsetY
    ),
    ...synthDragStateProps
  });
  synthDragState.clonedDraggedNode.style.display = synthDragState.draggedNodeDisplay || "";
  return synthDragState;
}
function handleLongPress(data, state2, node) {
  const config = data.targetData.parent.data.config;
  if (!config.longPress) return;
  state2.longPressTimeout = setTimeout(() => {
    if (!state2) return;
    state2.longPress = true;
    if (config.longPressClass && data.e.cancelable)
      addNodeClass([node.el], config.longPressClass);
    pd(data.e);
  }, config.longPressDuration || 200);
}
function pointermoveClasses(state2, config) {
  if (config.longPressClass)
    removeClass(
      state2.draggedNodes.map((x) => x.el),
      config?.longPressClass
    );
}
function cancelSynthScroll(state2, cancelX = true, cancelY = true) {
  if (cancelX && state2.animationFrameIdX !== void 0) {
    cancelAnimationFrame(state2.animationFrameIdX);
    state2.animationFrameIdX = void 0;
  }
  if (cancelY && state2.animationFrameIdY !== void 0) {
    cancelAnimationFrame(state2.animationFrameIdY);
    state2.animationFrameIdY = void 0;
  }
  if (!state2.animationFrameIdX && !state2.animationFrameIdY) {
    state2.preventEnter = false;
  }
}
function moveNode(e, state2, scrollX2 = 0, scrollY2 = 0) {
  const { x, y } = eventCoordinates(e);
  state2.coordinates.y = y;
  state2.coordinates.x = x;
  const startLeft = state2.startLeft ?? 0;
  const startTop = state2.startTop ?? 0;
  const translateX = x - startLeft + window.scrollX;
  const translateY = y - startTop + window.scrollY;
  state2.clonedDraggedNode.style.transform = `translate(${translateX + scrollX2}px, ${translateY + scrollY2}px)`;
  if (e.cancelable) pd(e);
  pointermoveClasses(state2, state2.initialParent.data.config);
}
function synthMove(e, state2) {
  moveNode(e, state2);
  const coordinates = eventCoordinates(e);
  handleSynthScroll(coordinates, e, state2);
  const elFromPoint = getElFromPoint(coordinates);
  if (!elFromPoint) {
    document.dispatchEvent(
      new CustomEvent("handleRootPointerover", {
        detail: {
          e,
          state: state2
        }
      })
    );
    return;
  }
  const pointerMoveEventData = {
    e,
    targetData: elFromPoint,
    state: state2
  };
  if ("node" in elFromPoint) {
    elFromPoint.node.el.dispatchEvent(
      new CustomEvent("handleNodePointerover", {
        detail: pointerMoveEventData
      })
    );
  } else {
    elFromPoint.parent.el.dispatchEvent(
      new CustomEvent("handleParentPointerover", {
        detail: pointerMoveEventData
      })
    );
  }
}
function handleNodeDragover3(data, state2) {
  const config = data.targetData.parent.data.config;
  if (!config.nativeDrag) return;
  const { x, y } = eventCoordinates(data.e);
  state2.coordinates.y = y;
  state2.coordinates.x = x;
  pd(data.e);
  sp(data.e);
  data.targetData.parent.el === state2.currentParent?.el ? sort(data, state2) : transfer(data, state2);
}
function handleParentDragover3(data, state2) {
  const config = data.targetData.parent.data.config;
  if (!config.nativeDrag) return;
  pd(data.e);
  sp(data.e);
  Object.assign(eventCoordinates(data.e));
  transfer(data, state2);
}
function handleParentPointerover2(e) {
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
  if (draggedNodes2[0].el.contains(targetParent.el)) return false;
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
function handleNodeDragenter(data, _state) {
  pd(data.e);
}
function handleNodeDragleave(data, _state) {
  pd(data.e);
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
  if (data.targetData.node.el.contains(state2.draggedNodes[0].el)) return false;
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
    targetNodes: [data.targetData.node]
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
  data.e.preventDefault();
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
    targetNodes: "node" in data.targetData ? [data.targetData.node] : []
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
function isScrollX(el, e, style, rect, state2) {
  const threshold = 0.1;
  if (el === document.scrollingElement) {
    const canScrollLeft = el.scrollLeft > 0;
    const canScrollRight = el.scrollLeft + window.innerWidth < (state2.rootScrollWidth || 0);
    return {
      right: canScrollRight && e.clientX > el.clientWidth * (1 - threshold),
      left: canScrollLeft && e.clientX < el.clientWidth * threshold
    };
  }
  if ((style.overflowX === "auto" || style.overflowX === "scroll") && el !== document.body && el !== document.documentElement) {
    const scrollWidth = el.scrollWidth;
    const offsetWidth = el.offsetWidth;
    const scrollLeft = el.scrollLeft;
    return {
      right: e.clientX > rect.left + offsetWidth * (1 - threshold) && scrollLeft < scrollWidth - offsetWidth,
      left: e.clientX < rect.left + offsetWidth * threshold && scrollLeft > 0
    };
  }
  return {
    right: false,
    left: false
  };
}
function isScrollY(el, e, style, rect) {
  const threshold = 0.1;
  if (el === document.scrollingElement) {
    return {
      down: e.clientY > el.clientHeight * (1 - threshold),
      up: e.clientY < el.clientHeight * threshold
    };
  }
  if ((style.overflowY === "auto" || style.overflowY === "scroll") && el !== document.body && el !== document.documentElement) {
    const scrollHeight = el.scrollHeight;
    const offsetHeight = el.offsetHeight;
    const scrollTop = el.scrollTop;
    return {
      down: e.clientY > rect.top + offsetHeight * (1 - threshold) && scrollTop < scrollHeight - offsetHeight,
      up: e.clientY < rect.top + offsetHeight * threshold && scrollTop > 0
    };
  }
  return {
    down: false,
    up: false
  };
}
function scrollX(el, e, state2, right = true) {
  state2.preventEnter = true;
  const incr = right ? 5 : -5;
  function scroll(el2) {
    el2.scrollBy({ left: incr });
    moveNode(e, state2, incr, 0);
    state2.animationFrameIdX = requestAnimationFrame(scroll.bind(null, el2));
  }
  state2.animationFrameIdX = requestAnimationFrame(scroll.bind(null, el));
}
function scrollY(el, e, state2, up = true) {
  state2.preventEnter = true;
  const incr = up ? -5 : 5;
  function scroll() {
    el.scrollBy({ top: incr });
    moveNode(e, state2, 0, incr);
    state2.animationFrameIdY = requestAnimationFrame(scroll);
  }
  state2.animationFrameIdY = requestAnimationFrame(scroll);
}
function handleSynthScroll(coordinates, e, state2) {
  cancelSynthScroll(state2);
  const scrollables = {
    x: null,
    y: null
  };
  const els = document.elementsFromPoint(coordinates.x, coordinates.y);
  for (const el of els) {
    if (scrollables.x && scrollables.y) break;
    if (!(el instanceof HTMLElement)) continue;
    const rect = el.getBoundingClientRect();
    const style = window.getComputedStyle(el);
    if (!scrollables.x) {
      const { left, right } = isScrollX(el, e, style, rect, state2);
      if (left || right) {
        scrollables.x = el;
        scrollX(el, e, state2, right);
      }
    }
    if (!scrollables.y) {
      const { up, down } = isScrollY(el, e, style, rect);
      if (up || down) {
        scrollables.y = el;
        scrollY(el, e, state2, up);
      }
    }
  }
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
      passive: false,
      capture: eventName === "focus" || eventName === "blur"
    });
  }
  return abortController;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  addClass,
  addEvents,
  addNodeClass,
  addParentClass,
  animations,
  dragAndDrop,
  dragStateProps,
  dragValues,
  dragstartClasses,
  dropOrSwap,
  getElFromPoint,
  handleClickNode,
  handleClickParent,
  handleDragend,
  handleDragstart,
  handleEnd,
  handleLongPress,
  handleNodeBlur,
  handleNodeDragover,
  handleNodeDrop,
  handleNodeFocus,
  handleNodeKeydown,
  handleNodePointerdown,
  handleNodePointerover,
  handleNodePointerup,
  handleParentDragover,
  handleParentDrop,
  handleParentFocus,
  handleParentKeydown,
  handleParentPointerover,
  handlePointercancel,
  initDrag,
  insert,
  isBrowser,
  isDragState,
  isNode,
  isSynthDragState,
  nodeEventData,
  nodes,
  parentEventData,
  parentValues,
  parents,
  performSort,
  performTransfer,
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
  synthMove,
  tearDown,
  tearDownNode,
  tearDownNodeRemap,
  transfer,
  updateConfig,
  validateDragHandle,
  validateDragstart,
  validateSort,
  validateTransfer
});
//# sourceMappingURL=index.cjs.map