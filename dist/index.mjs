// src/utils.ts
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
var isBrowser = typeof window !== "undefined";
function addNodeClass(els, className, omitAppendPrivateClass = false) {
  function nodeSetter(node, nodeData) {
    nodes.set(node, nodeData);
  }
  for (const el of els) {
    const nodeData = nodes.get(el);
    const newData = addClass(el, className, nodeData, omitAppendPrivateClass);
    if (!newData)
      continue;
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
    if (!newData)
      continue;
    parentSetter(el, newData);
  }
}
function addClass(el, className, data, omitAppendPrivateClass = false) {
  if (!className)
    return;
  const classNames = splitClass(className);
  if (!classNames.length)
    return;
  if (classNames.includes("longPress"))
    return;
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
  if (!className)
    return;
  const classNames = splitClass(className);
  if (!classNames.length)
    return;
  for (const node of els) {
    if (!isNode(node)) {
      node.classList.remove(...classNames);
      continue;
    }
    const nodeData = nodes.get(node) || parents.get(node);
    if (!nodeData)
      continue;
    for (const className2 of classNames) {
      if (!nodeData.privateClasses.includes(className2)) {
        node.classList.remove(className2);
      }
    }
  }
}
function isScrollable(element) {
  const style = window.getComputedStyle(element);
  return (style.overflowY === "auto" || style.overflowY === "scroll") && element.scrollHeight > element.clientHeight || (style.overflowX === "auto" || style.overflowX === "scroll") && element.scrollWidth > element.clientWidth;
}
function getScrollables() {
  return Array.from(document.querySelectorAll("*")).filter(
    (el) => el instanceof HTMLElement && isScrollable(el)
  );
}
function getElFromPoint(eventData) {
  if (!(eventData.e instanceof PointerEvent))
    return;
  const newX = eventData.e.clientX;
  const newY = eventData.e.clientY;
  let target = document.elementFromPoint(newX, newY);
  if (!isNode(target))
    return;
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
    if (!targetNodeData)
      return;
    const targetParentData = parents.get(target.parentNode);
    if (!targetParentData)
      return;
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
    if (!parentData)
      return;
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
function preventDefault(e) {
  e.preventDefault();
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
    if (omitKeys === false && key && omittedKeys.includes(key))
      continue;
    targetNode.style.setProperty(
      key,
      computedStyle.getPropertyValue(key),
      computedStyle.getPropertyPriority(key)
    );
  }
  for (const child of Array.from(sourceNode.children)) {
    if (!isNode(child))
      continue;
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
function createEmitter() {
  const callbacks = /* @__PURE__ */ new Map();
  const emit2 = function(eventName, ...data) {
    callbacks.get(eventName).forEach((cb) => {
      cb(...data);
    });
  };
  const on2 = function(eventName, callback) {
    const cbs = callbacks.get(eventName) ?? [];
    cbs.push(callback);
    callbacks.set(eventName, cbs);
  };
  return [emit2, on2];
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
    if (!parentData)
      return;
    return {
      setup() {
        if (document.head.querySelector("[data-drag-and-drop]"))
          return;
      },
      setupNodeRemap(data) {
        if (!isDragState(state))
          return;
        const duration = animationsConfig.duration || 150;
        if (data.nodeData.value === state.draggedNode.data.value) {
          switch (state.incomingDirection) {
            case "below":
              animate(data.node, slideUp, duration);
              break;
            case "above":
              animate(data.node, slideDown, duration);
              break;
            case "left":
              animate(data.node, slideRight, duration);
              break;
            case "right":
              animate(data.node, slideLeft, duration);
              break;
          }
          return;
        }
        if (!state.affectedNodes.map((x) => x.data.value).includes(data.nodeData.value))
          return;
        const nodeRect = data.node.getBoundingClientRect();
        const nodeIndex = state.affectedNodes.findIndex(
          (x) => x.data.value === data.nodeData.value
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
            animate(data.node, slideRight, duration);
          } else if (xDiff > yDiff && !ascendingDirection) {
            animate(data.node, slideLeft, duration);
          }
        } else {
          switch (state.incomingDirection) {
            case "below":
              animate(data.node, slideDown, duration);
              break;
            case "above":
              animate(data.node, slideUp, duration);
              break;
            case "left":
              animate(data.node, slideLeft, duration);
              break;
            case "right":
              animate(data.node, slideRight, duration);
              break;
          }
        }
      }
    };
  };
}
function animate(node, animation, duration) {
  if (!state)
    return;
  state.preventEnter = true;
  node.animate(animation, {
    duration,
    easing: "ease-in-out"
  });
  setTimeout(() => {
    if (!state)
      return;
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
    if (!parentData)
      return;
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
        insertionParentConfig.handleDragstart = insertionConfig.handleDragstart || handleDragstart;
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
        if (parentData.config.sortable === false)
          return;
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
  if (!isDragState(state))
    return;
  const el = document.elementFromPoint(e.clientX, e.clientY);
  if (!(el instanceof HTMLElement))
    return;
  if (!parents.has(el)) {
    const insertionPoint = document.getElementById("insertion-point");
    if (insertionPoint && insertionPoint === el)
      return;
    if (insertionPoint)
      insertionPoint.style.display = "none";
    if (insertionState.draggedOverParent) {
      removeClass(
        [insertionState.draggedOverParent.el],
        insertionState.draggedOverParent.data.config.dropZoneClass
      );
    }
    insertionState.draggedOverNodes = [];
    insertionState.draggedOverParent = null;
    state.lastParent = state.initialParent;
  }
}
function handleDragstart(data, state2) {
  if (!(data.e instanceof DragEvent))
    return;
  dragstart(
    {
      e: data.e,
      targetData: data.targetData
    },
    state2
  );
  setTimeout(() => {
    if (data.targetData.parent.data.config.sortable === false)
      return;
    defineRanges(data.targetData.parent.el);
  });
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
  if (!parentData)
    return;
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
    if (!node.data.range)
      return;
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
  if (!insertionState)
    return;
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
  realTargetParent.el === state2.lastParent?.el ? moveBetween(realTargetParent) : moveOutside(realTargetParent, state2);
  state2.lastParent = realTargetParent;
}
function moveBetween(data) {
  if (data.data.config.sortable === false)
    return;
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
  if (!foundRange)
    return;
  const position = foundRange[0].data.range[foundRange[1]];
  if (!position)
    return;
  positionInsertionPoint(
    position,
    foundRange[1] === "ascending",
    foundRange[0]
  );
}
function moveOutside(data, state2) {
  if (data.el === state2.lastParent.el)
    return false;
  const targetConfig = data.data.config;
  if (targetConfig.treeGroup && state2.draggedNode.el.contains(data.el))
    return false;
  if (targetConfig.dropZone === false)
    return false;
  const initialParentConfig = state2.initialParent.data.config;
  if (targetConfig.accepts) {
    return targetConfig.accepts(
      data,
      state2.initialParent,
      state2.lastParent,
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
    if (insertionPoint)
      insertionPoint.style.display = "none";
  } else {
    removeClass([state2.lastParent.el], targetConfig.dropZoneClass);
    const enabledNodes = data.data.enabledNodes;
    const foundRange = findClosest(enabledNodes);
    if (!foundRange)
      return;
    const position = foundRange[0].data.range[foundRange[1]];
    if (!position)
      return;
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
    if (!isDragState(state) || !enabledNodes[x].data.range)
      continue;
    const ascending = enabledNodes[x].data.range.ascending;
    const descending = enabledNodes[x].data.range.descending;
    if (!ascending && !descending)
      continue;
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
  if (!insertionState)
    return;
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
  if (!foundRange)
    return;
  const position = foundRange[0].data.range[foundRange[1]];
  positionInsertionPoint(
    position,
    foundRange[1] === "ascending",
    foundRange[0]
  );
  data.detail.targetData.parent.el === state2.lastParent?.el ? moveBetween(realTargetParent) : moveOutside(realTargetParent, state2);
}
function positionInsertionPoint(position, ascending, node) {
  if (!state)
    return;
  const div = document.getElementById("insertion-point");
  if (!div)
    return;
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
    const transferred = state2.initialParent.el !== state2.lastParent.el;
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
        state2.lastParent.el,
        state2.lastParent.data
      );
      const draggedParentValues2 = parentValues(
        state2.initialParent.el,
        state2.initialParent.data
      );
      let index = insertionState.draggedOverNodes[0].data.index || 0;
      if (insertionState.ascending)
        index++;
      const insertValues = state2.dynamicValues.length ? state2.dynamicValues : draggedValues;
      targetParentValues.splice(index, 0, ...insertValues);
      setParentValues(state2.lastParent.el, state2.lastParent.data, [
        ...targetParentValues
      ]);
      draggedParentValues2.splice(state2.initialIndex, draggedValues.length);
      setParentValues(state2.initialParent.el, state2.initialParent.data, [
        ...draggedParentValues2
      ]);
      const transferEventData = {
        sourceParent: state2.lastParent,
        targetParent: data.targetData.parent,
        previousSourceValues: [...targetParentValues],
        sourceValues: [...state2.lastParent.data.getValues(state2.lastParent.el)],
        previousTargetValues: [...targetParentValues],
        targetValues: [
          ...data.targetData.parent.data.getValues(data.targetData.parent.el)
        ],
        previousSourceNodes: [...state2.lastParent.data.enabledNodes],
        sourceNodes: [...state2.lastParent.data.enabledNodes],
        previousTargetNodes: [...data.targetData.parent.data.enabledNodes],
        targetNodes: [...data.targetData.parent.data.enabledNodes],
        draggedNode: state2.draggedNode,
        sourcePreviousPosition: state2.initialIndex,
        targetPosition: index
      };
      if (data.targetData.parent.data.config.onTransfer)
        data.targetData.parent.data.config.onTransfer(transferEventData);
      if (state2.lastParent.data.config.onTransfer)
        state2.lastParent.data.config.onTransfer(transferEventData);
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
      sourceParent: state2.lastParent,
      targetParent: data.targetData.parent,
      previousSourceValues: [...draggedOverParentValues],
      sourceValues: [...state2.lastParent.data.getValues(state2.lastParent.el)],
      previousTargetValues: [...draggedOverParentValues],
      targetValues: [
        ...data.targetData.parent.data.getValues(data.targetData.parent.el)
      ],
      previousSourceNodes: [...state2.lastParent.data.enabledNodes],
      sourceNodes: [...state2.lastParent.data.enabledNodes],
      previousTargetNodes: [...data.targetData.parent.data.enabledNodes],
      targetNodes: [...data.targetData.parent.data.enabledNodes],
      draggedNode: state2.draggedNode,
      sourcePreviousPosition: state2.initialIndex,
      targetPosition: 0
    };
    if (data.targetData.parent.data.config.onTransfer)
      data.targetData.parent.data.config.onTransfer(transferEventData);
    if (state2.lastParent.data.config.onTransfer)
      state2.lastParent.data.config.onTransfer(transferEventData);
    removeClass(
      [insertionState.draggedOverParent.el],
      insertionState.draggedOverParent.data.config.dropZoneClass
    );
  }
  if (insertionPoint)
    insertionPoint.style.display = "none";
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

// src/plugins/multiDrag/index.ts
var multiDragState = {
  selectedNodes: Array(),
  activeNode: void 0
};
function multiDrag(multiDragConfig = {}) {
  return (parent) => {
    const parentData = parents.get(parent);
    if (!parentData)
      return;
    const multiDragParentConfig = {
      ...parentData.config,
      multiDragConfig
    };
    return {
      setup() {
        multiDragParentConfig.handleDragstart = multiDragConfig.handleDragstart || handleDragstart2;
        multiDragParentConfig.handlePointerdownNode = multiDragConfig.handlePointerdownNode || handlePointerdownNode;
        multiDragParentConfig.handleEnd = multiDragConfig.handleEnd || handleEnd3;
        multiDragParentConfig.reapplyDragClasses = multiDragConfig.reapplyDragClasses || reapplyDragClasses;
        parentData.config = multiDragParentConfig;
        multiDragParentConfig.multiDragConfig.plugins?.forEach((plugin) => {
          plugin(parent)?.tearDown?.();
        });
        multiDragParentConfig.multiDragConfig.plugins?.forEach((plugin) => {
          plugin(parent)?.setup?.();
        });
      },
      tearDownNodeRemap(data) {
        multiDragParentConfig.multiDragConfig?.plugins?.forEach((plugin) => {
          plugin(data.parent)?.tearDownNodeRemap?.(data);
        });
      },
      tearDownNode(data) {
        multiDragParentConfig.multiDragConfig?.plugins?.forEach((plugin) => {
          plugin(data.parent)?.tearDownNode?.(data);
        });
      },
      setupNodeRemap(data) {
        multiDragParentConfig.multiDragConfig?.plugins?.forEach((plugin) => {
          plugin(data.parent)?.setupNodeRemap?.(data);
        });
      },
      setupNode(data) {
        multiDragParentConfig.multiDragConfig?.plugins?.forEach((plugin) => {
          plugin(data.parent)?.setupNode?.(data);
        });
      }
    };
  };
}
function reapplyDragClasses(node, parentData) {
  if (!isDragState(state))
    return;
  const multiDragConfig = parentData.config.multiDragConfig;
  if (!multiDragConfig)
    return;
  const dropZoneClass = "clonedDraggedNode" in state ? parentData.config.synthDropZoneClass : parentData.config.dropZoneClass;
  const draggedNodeEls = state.draggedNodes.map((x) => x.el);
  if (!draggedNodeEls.includes(node))
    return;
  addNodeClass([node], dropZoneClass, true);
}
function handleEnd3(data, state2) {
  end(data, state2);
  selectionsEnd(data, state2);
  resetState();
}
function selectionsEnd(data, _state) {
  const multiDragConfig = data.targetData.parent.data.config.multiDragConfig;
  if (!multiDragConfig)
    return;
  const selectedClass = data.targetData.parent.data.config.selectionsConfig?.selectedClass;
  if (selectedClass) {
    removeClass(
      multiDragState.selectedNodes.map((x) => x.el),
      selectedClass
    );
  }
  multiDragState.selectedNodes = [];
  multiDragState.activeNode = void 0;
}
function handleDragstart2(data, state2) {
  if (!(data.e instanceof DragEvent))
    return;
  multiDragstart(
    {
      e: data.e,
      targetData: data.targetData
    },
    state2
  );
}
function multiDragstart(data, _state) {
  const dragState = initDrag(data);
  const multiDragConfig = data.targetData.parent.data.config.multiDragConfig;
  if (!multiDragConfig)
    return;
  const parentValues2 = data.targetData.parent.data.getValues(
    data.targetData.parent.el
  );
  let selectedValues = multiDragState.selectedNodes.length ? multiDragState.selectedNodes.map((x) => x.data.value) : multiDragConfig.selections && multiDragConfig.selections(parentValues2, data.targetData.parent.el);
  if (selectedValues === void 0)
    return;
  if (!selectedValues.includes(data.targetData.node.data.value)) {
    selectedValues = [data.targetData.node.data.value, ...selectedValues];
    const selectionConfig = data.targetData.parent.data.config.selectionsConfig;
    addNodeClass(
      [data.targetData.node.el],
      selectionConfig?.selectedClass,
      true
    );
    multiDragState.selectedNodes.push(data.targetData.node);
  }
  const originalZIndex = data.targetData.node.el.style.zIndex;
  dragState.originalZIndex = originalZIndex;
  data.targetData.node.el.style.zIndex = "9999";
  if (Array.isArray(selectedValues) && selectedValues.length) {
    const targetRect = data.targetData.node.el.getBoundingClientRect();
    const [x, y] = [
      data.e.clientX - targetRect.left,
      data.e.clientY - targetRect.top
    ];
    stackNodes(handleSelections(data, selectedValues, dragState, x, y));
  } else {
    const config = data.targetData.parent.data.config;
    dragstartClasses(
      dragState.draggedNode.el,
      config.draggingClass,
      config.dropZoneClass,
      config.dragPlaceholderClass
    );
  }
}
function handlePointerdownNode(data, state2) {
  multiPointerdown(
    {
      e: data.e,
      targetData: data.targetData
    },
    state2
  );
}
function multiPointerdown(_data, _state) {
  return;
  console.log("redo multi pointerdown");
}
function handleSelections(data, selectedValues, state2, x, y) {
  console.log("state", state2);
  for (const child of data.targetData.parent.data.enabledNodes) {
    if (child.el === state2.draggedNode.el)
      continue;
    if (!selectedValues.includes(child.data.value))
      continue;
    state2.draggedNodes.push(child);
  }
  const config = data.targetData.parent.data.config.multiDragConfig;
  const clonedEls = state2.draggedNodes.map((x2) => {
    const el = x2.el.cloneNode(true);
    copyNodeStyle(x2.el, el, true);
    if (data.e instanceof DragEvent && config)
      addNodeClass([el], config.draggingClass);
    return el;
  });
  setTimeout(() => {
    if (data.e instanceof DragEvent && config) {
      addNodeClass(
        state2.draggedNodes.map((x2) => x2.el),
        config.dropZoneClass
      );
    }
  });
  state2.clonedDraggedEls = clonedEls;
  return { data, state: state2, x, y };
}
function stackNodes({
  data,
  state: state2,
  x,
  y
}) {
  const wrapper = document.createElement("div");
  for (const el of state2.clonedDraggedEls) {
    if (el instanceof HTMLElement)
      el.style.pointerEvents = "none";
    wrapper.append(el);
  }
  const { width } = state2.draggedNode.el.getBoundingClientRect();
  wrapper.style.cssText = `
        display: flex;
        flex-direction: column;
        width: ${width}px;
        position: fixed;
        pointer-events: none;
        z-index: 9999;
        left: -9999px
      `;
  document.body.append(wrapper);
  if (data.e instanceof DragEvent) {
    data.e.dataTransfer?.setDragImage(wrapper, x, y);
    setTimeout(() => {
      wrapper.remove();
    });
  } else if ("touchedNode" in state2) {
    state2.touchedNode = wrapper;
  }
}

// src/plugins/place/index.ts
var placeState = {
  draggedOverNodes: Array()
};
function place(placeConfig = {}) {
  return (parent) => {
    const parentData = parents.get(parent);
    if (!parentData)
      return;
    const placeParentConfig = {
      ...parentData.config,
      placeConfig
    };
    return {
      setup() {
        placeParentConfig.handleDragoverNode = placeConfig.handleDragoverNode || handleDragoverNode2;
        placeParentConfig.handlePointeroverNode = placeConfig.handlePointeroverNode || handlePointeroverNode;
        placeParentConfig.handlePointeroverParent = placeConfig.handlePointeroverParent || handlePointeroverParent2;
        placeParentConfig.handleEnd = placeConfig.handleEnd || handleEnd4;
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
  if (data.detail.targetData.parent.el !== state2.lastParent.el)
    return;
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
  state2.lastTargetValue = data.detail.targetData.node.data.value;
  state2.lastParent = data.detail.targetData.parent;
}
function dragoverNode(data, state2) {
  data.e.preventDefault();
  data.e.stopPropagation();
  if (data.targetData.parent.el !== state2.lastParent.el)
    return;
  const dropZoneClass = data.targetData.parent.data.config.dropZoneClass;
  removeClass(
    placeState.draggedOverNodes.map((node) => node.el),
    dropZoneClass
  );
  const enabledNodes = data.targetData.parent.data.enabledNodes;
  if (!enabledNodes)
    return;
  placeState.draggedOverNodes = enabledNodes.slice(
    data.targetData.node.data.index,
    data.targetData.node.data.index + state2.draggedNodes.length
  );
  addNodeClass(
    placeState.draggedOverNodes.map((node) => node.el),
    dropZoneClass,
    true
  );
  state2.lastTargetValue = data.targetData.node.data.value;
  state2.lastParent = data.targetData.parent;
}
function handleEnd4(data, state2) {
  if (!state2)
    return;
  if (state2.transferred || state2.lastParent.el !== state2.initialParent.el)
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

// src/plugins/multiDrag/plugins/selections/index.ts
function selections(selectionsConfig = {}) {
  return (parent) => {
    const parentData = parents.get(parent);
    if (!parentData)
      return;
    const selectionsParentConfig = {
      ...parentData.config,
      selectionsConfig
    };
    return {
      setup() {
        parentData.config.selectionsConfig = selectionsConfig;
        selectionsParentConfig.handleClickNode = selectionsConfig.handleClickNode || handleClickNode;
        selectionsParentConfig.handleKeydownNode = selectionsConfig.handleKeydownNode || handleKeydownNode;
        selectionsConfig.clickawayDeselect = selectionsConfig.clickawayDeselect === void 0 ? true : selectionsConfig.clickawayDeselect;
        if (!selectionsConfig.clickawayDeselect)
          return;
        const rootAbortControllers = addEvents(parentData.config.root, {
          click: handleRootClick.bind(null, parentData.config)
        });
        parentData.abortControllers["root"] = rootAbortControllers;
      },
      tearDown() {
        if (parentData.abortControllers.root) {
          parentData.abortControllers.root.abort();
        }
      },
      tearDownNode(data) {
        if (data.parentData.abortControllers.selectionsNode) {
          data.parentData.abortControllers.selectionsNode.abort();
        }
      },
      setupNode(data) {
        const config = data.parentData.config;
        data.node.setAttribute("tabindex", "0");
        const abortControllers = addEvents(data.node, {
          click: nodeEventData(config.handleClickNode),
          keydown: nodeEventData(config.handleKeydownNode)
        });
        data.nodeData.abortControllers["selectionsNode"] = abortControllers;
      }
    };
  };
}
function handleRootClick(config) {
  if (!config.selectionsConfig)
    return;
  removeClass(
    multiDragState.selectedNodes.map((x) => x.el),
    config.selectionsConfig.selectedClass
  );
  multiDragState.selectedNodes = [];
  multiDragState.activeNode = void 0;
}
function handleKeydownNode(data) {
  keydown(data);
}
function handleClickNode(data) {
  click(data);
}
function click(data) {
  data.e.stopPropagation();
  console.log("click");
  return;
  const selectionsConfig = data.targetData.parent.data.config.selectionsConfig;
  if (!selectionsConfig)
    return;
  const ctParentData = data.targetData.parent.data;
  const selectedClass = selectionsConfig.selectedClass;
  const targetNode = data.targetData.node;
  let commandKey = false;
  let shiftKey = false;
  if (data.e instanceof MouseEvent) {
    commandKey = data.e.ctrlKey || data.e.metaKey;
    shiftKey = data.e.shiftKey;
  }
  if (shiftKey && multiDragState.isTouch === false) {
    if (!multiDragState.activeNode) {
      multiDragState.activeNode = {
        el: data.targetData.node.el,
        data: data.targetData.node.data
      };
      for (let x = 0; x <= data.targetData.node.data.index; x++) {
        multiDragState.selectedNodes.push(ctParentData.enabledNodes[x]);
        if (selectedClass) {
          addNodeClass([ctParentData.enabledNodes[x].el], selectedClass, true);
        }
      }
    } else {
      const [minIndex, maxIndex] = multiDragState.activeNode.data.index < data.targetData.node.data.index ? [
        multiDragState.activeNode.data.index,
        data.targetData.node.data.index
      ] : [
        data.targetData.node.data.index,
        multiDragState.activeNode.data.index
      ];
      const selectedNodes = ctParentData.enabledNodes.slice(
        minIndex,
        maxIndex + 1
      );
      if (selectedNodes.length === 1) {
        for (const node of multiDragState.selectedNodes) {
          if (selectedClass)
            node.el.classList.remove(selectedClass);
        }
        multiDragState.selectedNodes = [
          {
            el: data.targetData.node.el,
            data: data.targetData.node.data
          }
        ];
        multiDragState.activeNode = {
          el: data.targetData.node.el,
          data: data.targetData.node.data
        };
        if (selectedClass) {
          data.targetData.node.el.classList.add(selectedClass);
        }
      }
      for (let x = minIndex - 1; x >= 0; x--) {
        if (multiDragState.selectedNodes.includes(ctParentData.enabledNodes[x])) {
          multiDragState.selectedNodes = [
            ...multiDragState.selectedNodes.filter(
              (el) => el !== ctParentData.enabledNodes[x]
            )
          ];
          if (selectedClass) {
            addNodeClass(
              [ctParentData.enabledNodes[x].el],
              selectedClass,
              true
            );
          }
        } else {
          break;
        }
      }
      for (let x = maxIndex; x < ctParentData.enabledNodes.length; x++) {
        if (multiDragState.selectedNodes.includes(ctParentData.enabledNodes[x])) {
          multiDragState.selectedNodes = [
            ...multiDragState.selectedNodes.filter(
              (el) => el !== ctParentData.enabledNodes[x]
            )
          ];
          if (selectedClass) {
            removeClass([ctParentData.enabledNodes[x].el], selectedClass);
          }
        } else {
          break;
        }
      }
      for (const node of selectedNodes) {
        if (!multiDragState.selectedNodes.map((x) => x.el).includes(node.el)) {
          multiDragState.selectedNodes.push(node);
        }
        if (selectedClass) {
          addNodeClass([node.el], selectedClass, true);
        }
      }
    }
  } else if (commandKey) {
    if (multiDragState.selectedNodes.map((x) => x.el).includes(targetNode.el)) {
      multiDragState.selectedNodes = multiDragState.selectedNodes.filter(
        (el) => el.el !== targetNode.el
      );
      if (selectedClass) {
        removeClass([targetNode.el], selectedClass);
      }
    } else {
      multiDragState.activeNode = targetNode;
      if (selectedClass) {
        addNodeClass([targetNode.el], selectedClass, true);
      }
      multiDragState.selectedNodes.push(targetNode);
    }
  } else if (!commandKey && multiDragState.isTouch === false) {
    if (multiDragState.selectedNodes.map((x) => x.el).includes(targetNode.el)) {
      multiDragState.selectedNodes = multiDragState.selectedNodes.filter(
        (el) => el.el !== targetNode.el
      );
      if (selectedClass) {
        removeClass([targetNode.el], selectedClass);
      }
    } else {
      multiDragState.activeNode = {
        el: data.targetData.node.el,
        data: data.targetData.node.data
      };
      if (selectedClass) {
        for (const el of multiDragState.selectedNodes) {
          removeClass([el.el], selectedClass);
        }
        addNodeClass([data.targetData.node.el], selectedClass, true);
      }
      multiDragState.selectedNodes = [
        {
          el: data.targetData.node.el,
          data: data.targetData.node.data
        }
      ];
    }
  } else {
    if (multiDragState.selectedNodes.map((x) => x.el).includes(targetNode.el)) {
      multiDragState.selectedNodes = multiDragState.selectedNodes.filter(
        (el) => el.el !== targetNode.el
      );
      if (selectedClass) {
        removeClass([targetNode.el], selectedClass);
      }
    } else {
      multiDragState.activeNode = targetNode;
      if (selectedClass) {
        addNodeClass([targetNode.el], selectedClass, true);
      }
      multiDragState.selectedNodes.push(targetNode);
    }
  }
}
function keydown(data) {
  if (!(data.e instanceof KeyboardEvent))
    return;
  const keys = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];
  if (!keys.includes(data.e.key) || !multiDragState.activeNode)
    return;
  const selectionsConfig = data.targetData.parent.data.config.selectionsConfig;
  data.e.preventDefault();
  const parentData = data.targetData.parent.data;
  const nodeData = data.targetData.node.data;
  const enabledNodes = parentData.enabledNodes;
  const moveUp = data.e.key === "ArrowUp" || data.e.key === "ArrowLeft";
  const moveDown = data.e.key === "ArrowDown" || data.e.key === "ArrowRight";
  const invalidKeydown = moveUp && nodeData.index === 0 || moveDown && nodeData.index === enabledNodes.length - 1;
  if (invalidKeydown)
    return;
  const adjacentNode = enabledNodes[nodeData.index + (moveUp ? -1 : 1)];
  if (!selectionsConfig)
    return;
  const selectedClass = selectionsConfig.selectedClass;
  if (!adjacentNode)
    return;
  if (data.e.altKey) {
    if (multiDragState.selectedNodes.length > 1) {
      for (const el of multiDragState.selectedNodes) {
        if (selectedClass && multiDragState.activeNode !== el) {
          removeClass([el.el], selectedClass);
        }
      }
      multiDragState.selectedNodes = multiDragState.selectedNodes.filter(
        (el) => el !== multiDragState.activeNode
      );
    }
    const parentValues2 = parentData.getValues(data.targetData.parent.el);
    [
      parentValues2[nodeData.index],
      parentValues2[nodeData.index + (moveUp ? -1 : 1)]
    ] = [
      parentValues2[nodeData.index + (moveUp ? -1 : 1)],
      parentValues2[nodeData.index]
    ];
    parentData.setValues(parentValues2, data.targetData.parent.el);
  } else if (data.e.shiftKey && true) {
    if (!multiDragState.selectedNodes.map((x) => x.el).includes(adjacentNode.el)) {
      multiDragState.selectedNodes.push(adjacentNode);
      if (selectedClass) {
        addNodeClass([adjacentNode.el], selectedClass, true);
      }
      multiDragState.activeNode = adjacentNode;
    } else {
      if (multiDragState.selectedNodes.map((x) => x.el).includes(multiDragState.activeNode.el)) {
        multiDragState.selectedNodes = multiDragState.selectedNodes.filter(
          (el) => el !== multiDragState.activeNode
        );
        if (selectedClass) {
          removeClass([multiDragState.activeNode.el], selectedClass);
        }
        multiDragState.activeNode = adjacentNode;
      }
    }
  } else {
    for (const el of multiDragState.selectedNodes) {
      if (selectedClass && multiDragState.activeNode !== el) {
        removeClass([el.el], selectedClass);
      }
    }
    removeClass([multiDragState.activeNode.el], selectedClass);
    multiDragState.selectedNodes = [adjacentNode];
    addNodeClass([adjacentNode.el], selectedClass, true);
    multiDragState.activeNode = adjacentNode;
  }
  data.targetData.node.el.blur();
  multiDragState.activeNode = adjacentNode;
  multiDragState.activeNode.el.focus();
}

// src/plugins/swap/index.ts
var swapState = {
  draggedOverNodes: Array()
};
function swap(swapConfig = {}) {
  return (parent) => {
    const parentData = parents.get(parent);
    if (!parentData)
      return;
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
        swapParentConfig.handleEnd = swapConfig.handleEnd || handleEnd5;
        parentData.config = swapParentConfig;
      }
    };
  };
}
function handleDragoverNode3(data) {
  if (!state)
    return;
  dragoverNode2(data, state);
}
function handleDragoverParent2(_data) {
}
function handlePointeroverParent3(_data) {
}
function handlePointeroverNode2(data) {
  if (!state)
    return;
  if (data.detail.targetData.parent.el !== state.lastParent.el)
    return;
  const dropZoneClass = data.detail.targetData.parent.data.config.touchDropZoneClass;
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
  state.lastTargetValue = data.detail.targetData.node.data.value;
  state.lastParent = data.detail.targetData.parent;
}
function dragoverNode2(data, state2) {
  data.e.preventDefault();
  data.e.stopPropagation();
  if (data.targetData.parent.el !== state2.lastParent.el)
    return;
  const dropZoneClass = data.targetData.parent.data.config.dropZoneClass;
  removeClass(
    swapState.draggedOverNodes.map((node) => node.el),
    dropZoneClass
  );
  const enabledNodes = data.targetData.parent.data.enabledNodes;
  if (!enabledNodes)
    return;
  swapState.draggedOverNodes = enabledNodes.slice(
    data.targetData.node.data.index,
    data.targetData.node.data.index + state2.draggedNodes.length
  );
  addNodeClass(
    swapState.draggedOverNodes.map((node) => node.el),
    dropZoneClass,
    true
  );
  state2.lastTargetValue = data.targetData.node.data.value;
  state2.lastParent = data.targetData.parent;
}
function handleEnd5(data) {
  if (!state)
    return;
  if (!state.transferred) {
    const draggedParentValues = parentValues(
      state.initialParent.el,
      state.initialParent.data
    );
    let targetParentValues = parentValues(
      state.lastParent.el,
      state.lastParent.data
    );
    const draggedValues = state.draggedNodes.map((node) => node.data.value);
    const draggedOverNodeValues = swapState.draggedOverNodes.map(
      (node) => node.data.value
    );
    const draggedIndex = state.draggedNodes[0].data.index;
    const draggedOverIndex = swapState.draggedOverNodes[0].data.index;
    targetParentValues.splice(
      draggedOverIndex,
      draggedValues.length,
      ...draggedValues
    );
    if (state.initialParent.el === state.lastParent.el) {
      targetParentValues.splice(
        draggedIndex,
        draggedValues.length,
        ...draggedOverNodeValues
      );
      setParentValues(state.initialParent.el, state.initialParent.data, [
        ...targetParentValues
      ]);
    } else {
      draggedParentValues.splice(
        draggedIndex,
        draggedValues.length,
        ...draggedOverNodeValues
      );
      setParentValues(state.lastParent.el, state.lastParent.data, [
        ...targetParentValues
      ]);
      setParentValues(state.initialParent.el, state.initialParent.data, [
        ...draggedParentValues
      ]);
    }
  }
  const dropZoneClass = "clonedDraggedNode" in state ? data.targetData.parent.data.config.touchDropZoneClass : data.targetData.parent.data.config.dropZoneClass;
  removeClass(
    swapState.draggedOverNodes.map((node) => node.el),
    dropZoneClass
  );
  handleEnd(data);
}

// src/index.ts
var documentController;
var isNative = false;
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
var [emit, on] = createEmitter();
var baseDragState = {
  on,
  emit,
  originalZIndex: void 0,
  preventEnter: false,
  remapJustFinished: false
};
var state = baseDragState;
function resetState() {
  state = baseDragState;
}
function setDragState(dragStateProps2) {
  Object.assign(state, dragStateProps2);
  state.emit("dragStarted", state);
  return state;
}
function dragAndDrop({
  parent,
  getValues,
  setValues,
  config = {}
}) {
  if (!isBrowser)
    return;
  tearDown(parent);
  const parentData = {
    getValues,
    setValues,
    config: {
      deepCopyStyles: false,
      handleClickNode: handleClickNode2,
      handleClickParent,
      handleKeydownNode: handleKeydownNode2,
      handleKeydownParent,
      handleDragstart: handleDragstart3,
      handleDragoverNode: handleDragoverNode4,
      handleDragoverParent: handleDragoverParent3,
      handleEnd,
      handlePointerup,
      handleTouchstart,
      handlePointeroverNode: handlePointeroverNode3,
      handlePointeroverParent: handlePointeroverParent4,
      handlePointerdownNode: handlePointerdownNode2,
      handlePointermove,
      handleDragenterNode,
      handleDragleaveNode,
      handleDropParent,
      nativeDrag: config.nativeDrag ?? true,
      performSort,
      performTransfer,
      root: document,
      setupNode,
      setupNodeRemap,
      reapplyDragClasses: reapplyDragClasses2,
      tearDownNode,
      tearDownNodeRemap,
      remapFinished,
      scrollBehavior: {
        x: 0.8,
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
function dragStateProps(data, nativeDrag = true) {
  const { x, y } = eventCoordinates(data.e);
  const rect = data.targetData.node.el.getBoundingClientRect();
  const scrollEls = [];
  documentController = addEvents(document, {
    dragover: preventDefault
  });
  for (const scrollable of getScrollables()) {
    let controller;
    if (nativeDrag) {
      controller = addEvents(scrollable, {
        scroll: preventSortOnScroll()
      });
    } else {
      controller = addEvents(scrollable, {
        pointermove: handleScroll
      });
    }
    scrollEls.push([scrollable, controller]);
  }
  return {
    affectedNodes: [],
    ascendingDirection: false,
    clonedDraggedEls: [],
    dynamicValues: [],
    pointerMoved: false,
    coordinates: {
      x,
      y
    },
    draggedNode: {
      el: data.targetData.node.el,
      data: data.targetData.node.data
    },
    draggedNodes: [
      {
        el: data.targetData.node.el,
        data: data.targetData.node.data
      }
    ],
    incomingDirection: void 0,
    initialIndex: data.targetData.node.data.index,
    initialParent: {
      el: data.targetData.parent.el,
      data: data.targetData.parent.data
    },
    lastParent: {
      el: data.targetData.parent.el,
      data: data.targetData.parent.data
    },
    longPress: data.targetData.parent.data.config.longPress ?? false,
    longPressTimeout: 0,
    lastTargetValue: data.targetData.node.data.value,
    scrollEls,
    startLeft: x - rect.left,
    startTop: y - rect.top,
    targetIndex: data.targetData.node.data.index,
    transferred: false
  };
}
function performSort(state2, data) {
  const draggedValues = dragValues(state2);
  const targetParentValues = parentValues(
    data.targetData.parent.el,
    data.targetData.parent.data
  );
  const originalIndex = state2.draggedNode.data.index;
  const enabledNodes = [...data.targetData.parent.data.enabledNodes];
  const newParentValues = [
    ...targetParentValues.filter((x) => !draggedValues.includes(x))
  ];
  newParentValues.splice(data.targetData.node.data.index, 0, ...draggedValues);
  state2.lastTargetValue = data.targetData.node.data.value;
  setParentValues(data.targetData.parent.el, data.targetData.parent.data, [
    ...newParentValues
  ]);
  if (data.targetData.parent.data.config.onSort) {
    data.targetData.parent.data.config.onSort({
      parent: {
        el: data.targetData.parent.el,
        data: data.targetData.parent.data
      },
      previousValues: [...targetParentValues],
      previousNodes: [...enabledNodes],
      nodes: [...data.targetData.parent.data.enabledNodes],
      values: [...newParentValues],
      draggedNode: state2.draggedNode,
      previousPosition: originalIndex,
      position: data.targetData.node.data.index
    });
  }
}
function performTransfer(state2, data) {
  const draggedValues = dragValues(state2);
  const lastParentValues = parentValues(
    state2.lastParent.el,
    state2.lastParent.data
  ).filter((x) => !draggedValues.includes(x));
  const targetParentValues = parentValues(
    data.targetData.parent.el,
    data.targetData.parent.data
  );
  const reset = state2.initialParent.el === data.targetData.parent.el && data.targetData.parent.data.config.sortable === false;
  let targetIndex;
  if ("node" in data.targetData) {
    if (reset) {
      targetIndex = state2.initialIndex;
    } else if (data.targetData.parent.data.config.sortable === false) {
      targetIndex = data.targetData.parent.data.enabledNodes.length;
    } else {
      targetIndex = data.targetData.node.data.index;
    }
    targetParentValues.splice(targetIndex, 0, ...draggedValues);
  } else {
    targetIndex = reset ? state2.initialIndex : data.targetData.parent.data.enabledNodes.length;
    targetParentValues.splice(targetIndex, 0, ...draggedValues);
  }
  setParentValues(state2.lastParent.el, state2.lastParent.data, lastParentValues);
  setParentValues(
    data.targetData.parent.el,
    data.targetData.parent.data,
    targetParentValues
  );
  function createTransferEventData(state3, data2, lastParentValues2, targetParentValues2, targetIndex2) {
    return {
      sourceParent: state3.lastParent,
      targetParent: data2.targetData.parent,
      previousSourceValues: [...lastParentValues2],
      sourceValues: [...state3.lastParent.data.getValues(state3.lastParent.el)],
      previousTargetValues: [...targetParentValues2],
      targetValues: [
        ...data2.targetData.parent.data.getValues(data2.targetData.parent.el)
      ],
      previousSourceNodes: [...state3.lastParent.data.enabledNodes],
      sourceNodes: [...state3.lastParent.data.enabledNodes],
      previousTargetNodes: [...data2.targetData.parent.data.enabledNodes],
      targetNodes: [...data2.targetData.parent.data.enabledNodes],
      draggedNode: state3.draggedNode,
      sourcePreviousPosition: state3.initialIndex,
      targetPosition: targetIndex2
    };
  }
  if (data.targetData.parent.data.config.onTransfer) {
    const transferEventData = createTransferEventData(
      state2,
      data,
      lastParentValues,
      targetParentValues,
      targetIndex
    );
    data.targetData.parent.data.config.onTransfer(transferEventData);
  }
  if (state2.lastParent.data.config.onTransfer) {
    const transferEventData = createTransferEventData(
      state2,
      data,
      lastParentValues,
      targetParentValues,
      targetIndex
    );
    state2.lastParent.data.config.onTransfer(transferEventData);
  }
}
function parentValues(parent, parentData) {
  return [...parentData.getValues(parent)];
}
function findArrayCoordinates(obj, targetArray, path = []) {
  let result = [];
  if (obj === targetArray)
    result.push(path);
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
    if (!ancestorData)
      return;
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
  if (!parentData)
    return;
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
  if (!parentData)
    return;
  if (parentData.abortControllers.mainParent)
    parentData.abortControllers.mainParent.abort();
}
function isDragState(state2) {
  return "draggedNode" in state2;
}
function isSynthDragState(state2) {
  return "pointerId" in state2;
}
function setup(parent, parentData) {
  if (state)
    on("dragStarted", () => {
    });
  parentData.abortControllers.mainParent = addEvents(parent, {
    click: parentEventData(parentData.config.handleClickParent),
    keydown: parentEventData(parentData.config.handleKeydownParent),
    dragover: parentEventData(parentData.config.handleDragoverParent),
    handlePointeroverParent: parentData.config.handlePointeroverParent,
    drop: parentEventData(parentData.config.handleDropParent),
    hasNestedParent: (e) => {
      const parent2 = parents.get(e.target);
      if (!parent2)
        return;
      parent2.nestedParent = e.detail.parent;
    }
  });
}
function setupNode(data) {
  const config = data.parentData.config;
  data.node.draggable = true;
  data.nodeData.abortControllers.mainNode = addEvents(data.node, {
    click: nodeEventData(config.handleClickParent),
    keydown: nodeEventData(config.handleKeydownNode),
    dragstart: nodeEventData(config.handleDragstart),
    dragover: nodeEventData(config.handleDragoverNode),
    dragenter: nodeEventData(config.handleDragenterNode),
    dragleave: nodeEventData(config.handleDragleaveNode),
    dragend: nodeEventData(config.handleEnd),
    touchstart: nodeEventData(config.handleTouchstart),
    pointerdown: nodeEventData(config.handlePointerdownNode),
    pointermove: nodeEventData(config.handlePointermove),
    pointerup: nodeEventData(config.handlePointerup),
    handlePointeroverNode: config.handlePointeroverNode,
    mousedown: () => {
      if (!config.nativeDrag)
        isNative = false;
      else
        isNative = true;
    }
  });
  config.reapplyDragClasses(data.node, data.parentData);
  data.parentData.config.plugins?.forEach((plugin) => {
    plugin(data.parent)?.setupNode?.(data);
  });
}
function setupNodeRemap(data) {
  nodes.set(data.node, data.nodeData);
  data.parentData.config.plugins?.forEach((plugin) => {
    plugin(data.parent)?.setupNodeRemap?.(data);
  });
}
function reapplyDragClasses2(node, parentData) {
  if (!isDragState(state))
    return;
  const dropZoneClass = "clonedDraggedNode" in state ? parentData.config.synthDropZoneClass : parentData.config.dropZoneClass;
  if (state.draggedNode.el !== node)
    return;
  addNodeClass([node], dropZoneClass, true);
}
function tearDownNodeRemap(data) {
  data.parentData.config.plugins?.forEach((plugin) => {
    plugin(data.parent)?.tearDownNodeRemap?.(data);
  });
}
function tearDownNode(data) {
  data.parentData.config.plugins?.forEach((plugin) => {
    plugin(data.parent)?.tearDownNode?.(data);
  });
  data.node.draggable = false;
  if (data.nodeData?.abortControllers?.mainNode)
    data.nodeData?.abortControllers?.mainNode.abort();
}
function nodesMutated(mutationList) {
  const parentEl = mutationList[0].target;
  if (!(parentEl instanceof HTMLElement))
    return;
  remapNodes(parentEl);
}
function remapNodes(parent, force) {
  const parentData = parents.get(parent);
  if (!parentData)
    return;
  parentData.privateClasses = Array.from(parent.classList);
  const enabledNodes = [];
  const config = parentData.config;
  for (let x = 0; x < parent.children.length; x++) {
    const node = parent.children[x];
    if (!isNode(node))
      continue;
    const nodeData = nodes.get(node);
    if (force || !nodeData)
      config.tearDownNode({ node, parent, nodeData, parentData });
    if (config.disabled)
      continue;
    if (!config.draggable || config.draggable && config.draggable(node)) {
      enabledNodes.push(node);
    }
  }
  if (enabledNodes.length !== parentData.getValues(parent).length && !config.disabled) {
    console.warn(
      "The number of enabled nodes does not match the number of values."
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
    if (!eventDispatched)
      console.warn("No ancestor found for tree group");
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
    if (isDragState(state) && state.draggedNode && nodeData.value === state.draggedNode.data.value) {
      state.draggedNode.data = nodeData;
      state.draggedNode.el = node;
      const draggedNode = state.draggedNodes.find(
        (x2) => x2.data.value === nodeData.value
      );
      if (draggedNode)
        draggedNode.el = node;
      if (isSynthDragState(state))
        state.draggedNode.el.setPointerCapture(state.pointerId);
    }
    enabledNodeRecords.push({
      el: node,
      data: nodeData
    });
    const setupNodeData = {
      node,
      parent,
      parentData,
      nodeData
    };
    if (force || !prevNodeData)
      config.setupNode(setupNodeData);
    setupNodeRemap(setupNodeData);
  }
  parents.set(parent, { ...parentData, enabledNodes: enabledNodeRecords });
  config.remapFinished(parentData);
  parentData.config.plugins?.forEach((plugin) => {
    plugin(parent)?.remapFinished?.();
  });
}
function remapFinished() {
  state.remapJustFinished = true;
  if ("draggedNode" in state)
    state.affectedNodes = [];
}
function handleDragstart3(data, state2) {
  if (!(data.e instanceof DragEvent))
    return;
  if (!data.targetData.parent.data.config.nativeDrag) {
    data.e.preventDefault();
    return;
  }
  dragstart(
    {
      e: data.e,
      targetData: data.targetData
    },
    state2
  );
}
function handlePointerdownNode2(eventData, state2) {
  eventData.e.stopPropagation();
  pointerdown(
    {
      e: eventData.e,
      targetData: eventData.targetData
    },
    state2
  );
}
function dragstartClasses(el, draggingClass, dropZoneClass, dragPlaceholderClass) {
  addNodeClass([el], draggingClass);
  setTimeout(() => {
    removeClass([el], draggingClass);
    addNodeClass([el], dragPlaceholderClass);
    addNodeClass([el], dropZoneClass);
  });
}
function initDrag(eventData) {
  const dragState = setDragState(dragStateProps(eventData));
  eventData.e.stopPropagation();
  if (eventData.e.dataTransfer) {
    eventData.e.dataTransfer.dropEffect = "move";
    eventData.e.dataTransfer.effectAllowed = "move";
    eventData.e.dataTransfer.setDragImage(
      eventData.targetData.node.el,
      eventData.e.offsetX,
      eventData.e.offsetY
    );
  }
  return dragState;
}
function validateDragHandle(data) {
  if (!(data.e instanceof DragEvent) && !(data.e instanceof PointerEvent))
    return false;
  const config = data.targetData.parent.data.config;
  if (!config.dragHandle)
    return true;
  const dragHandles = data.targetData.node.el.querySelectorAll(
    config.dragHandle
  );
  if (!dragHandles)
    return false;
  const coordinates = data.e;
  const elFromPoint = config.root.elementFromPoint(
    coordinates.x,
    coordinates.y
  );
  if (!elFromPoint)
    return false;
  for (const handle of Array.from(dragHandles)) {
    if (elFromPoint === handle || handle.contains(elFromPoint))
      return true;
  }
  return false;
}
function handleClickNode2(_data) {
}
function handleClickParent(_data) {
}
function handleKeydownNode2(_data) {
}
function handleKeydownParent(_data) {
}
function pointerdown(data, _state) {
  if (!validateDragHandle(data))
    return;
  synthNodePointerDown = true;
}
function preventSortOnScroll() {
  let scrollTimeout;
  return () => {
    clearTimeout(scrollTimeout);
    if (state)
      state.preventEnter = true;
    scrollTimeout = setTimeout(() => {
      if (state)
        state.preventEnter = false;
    }, 100);
  };
}
function dragstart(data, _state) {
  if (!validateDragHandle(data)) {
    data.e.preventDefault();
    return;
  }
  const dragState = initDrag(data);
  const config = data.targetData.parent.data.config;
  const originalZIndex = data.targetData.node.el.style.zIndex;
  dragState.originalZIndex = originalZIndex;
  data.targetData.node.el.style.zIndex = "9999";
  dragstartClasses(
    dragState.draggedNode.el,
    config.draggingClass,
    config.dropZoneClass,
    config.dragPlaceholderClass
  );
  if (config.onDragstart)
    config.onDragstart({
      parent: data.targetData.parent,
      values: parentValues(
        data.targetData.parent.el,
        data.targetData.parent.data
      ),
      draggedNode: dragState.draggedNode,
      draggedNodes: dragState.draggedNodes,
      position: dragState.initialIndex
    });
}
function handlePointeroverNode3(e) {
  if (e.detail.targetData.parent.el === e.detail.state.lastParent.el)
    sort(e.detail, e.detail.state);
  else
    transfer(e.detail, e.detail.state);
}
function handleEnd(data, state2) {
  data.e.preventDefault();
  end(data, state2);
  resetState();
  synthNodePointerDown = false;
}
function end(_data, state2) {
  if (documentController) {
    documentController.abort();
    documentController = void 0;
  }
  if ("longPressTimeout" in state2 && state2.longPressTimeout)
    clearTimeout(state2.longPressTimeout);
  const config = parents.get(state2.initialParent.el)?.config;
  const isSynth = "clonedDraggedNode" in state2 && state2.clonedDraggedNode;
  const dropZoneClass = isSynth ? config?.synthDropZoneClass : config?.dropZoneClass;
  if (state2.originalZIndex !== void 0)
    state2.draggedNode.el.style.zIndex = state2.originalZIndex;
  addNodeClass(
    state2.draggedNodes.map((x) => x.el),
    dropZoneClass,
    true
  );
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
  if ("clonedDraggedNode" in state2 && state2.clonedDraggedNode)
    state2.clonedDraggedNode.remove();
  if (config?.onDragend)
    config.onDragend({
      parent: state2.lastParent,
      values: parentValues(state2.lastParent.el, state2.lastParent.data),
      draggedNode: state2.draggedNode,
      draggedNodes: state2.draggedNodes,
      position: state2.initialIndex
    });
}
function handleTouchstart(data, _state) {
  data.e.preventDefault();
}
function handlePointerup(data, state2) {
  if (!isDragState(state2))
    return;
  handleEnd(data, state2);
}
function handlePointermove(data, state2) {
  if (isNative || !synthNodePointerDown || !validateDragHandle(data))
    return;
  if (!isSynthDragState(state2)) {
    const synthDragState = initSyntheticDrag(data, state2);
    synthMove(data, synthDragState);
    if (data.targetData.parent.data.config.onDragstart)
      data.targetData.parent.data.config.onDragstart({
        parent: data.targetData.parent,
        values: parentValues(
          data.targetData.parent.el,
          data.targetData.parent.data
        ),
        draggedNode: synthDragState.draggedNode,
        draggedNodes: synthDragState.draggedNodes,
        position: synthDragState.initialIndex
      });
    synthDragState.draggedNode.el.setPointerCapture(data.e.pointerId);
    synthDragState.pointerId = data.e.pointerId;
    return;
  }
  synthMove(data, state2);
}
function initSyntheticDrag(data, _state) {
  const display = data.targetData.node.el.style.display;
  const rect = data.targetData.node.el.getBoundingClientRect();
  const clonedDraggedNode = data.targetData.node.el.cloneNode(
    true
  );
  clonedDraggedNode.style.cssText = `
            width: ${rect.width}px;
            position: absolute;
            pointer-events: none;
            z-index: 999999;
          `;
  document.body.append(clonedDraggedNode);
  clonedDraggedNode.id = "hello world";
  if (data.targetData.parent.data.config.deepCopyStyles)
    copyNodeStyle(data.targetData.node.el, clonedDraggedNode);
  clonedDraggedNode.style.display = "none";
  const synthDragStateProps = {
    clonedDraggedEls: [],
    clonedDraggedNode,
    draggedNodeDisplay: display,
    synthDragScrolling: false
  };
  addEvents(document, {
    contextmenu: noDefault
  });
  const synthDragState = setDragState({
    ...dragStateProps(data, false),
    ...synthDragStateProps
  });
  return synthDragState;
}
function handleLongPress(data, dragState) {
  const config = data.targetData.parent.data.config;
  if (!config.longPress)
    return;
  dragState.longPressTimeout = setTimeout(() => {
    if (!dragState)
      return;
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
  if (config.synthDraggingClass && state2.clonedDraggedNode)
    addNodeClass([state2.clonedDraggedNode], config.synthDraggingClass);
  if (config.synthDropZoneClass)
    addNodeClass(
      state2.draggedNodes.map((x) => x.el),
      config.synthDropZoneClass
    );
}
function getScrollData(e, state2) {
  if (!(e.currentTarget instanceof HTMLElement))
    return;
  const { x, y, width, height } = e.currentTarget.getBoundingClientRect();
  const {
    x: xThresh,
    y: yThresh,
    scrollOutside
  } = state2.initialParent.data.config.scrollBehavior;
  return {
    xThresh,
    yThresh,
    scrollOutside,
    scrollParent: e.currentTarget,
    x,
    y,
    width,
    height
  };
}
var animationFrameId = null;
function setSynthScrollDirection(direction, el, state2) {
  if (state2.synthScrollDirection === direction)
    return;
  if (direction === "up" && el.scrollTop === 0)
    return;
  if (direction === "down" && el.scrollTop + el.clientHeight >= el.scrollHeight)
    return;
  if (direction === "left" && el.scrollLeft === 0)
    return;
  if (direction === "right" && el.scrollLeft + el.clientWidth >= el.scrollWidth)
    return;
  state2.synthScrollDirection = direction;
  if (animationFrameId !== null) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }
  let lastTimestamp = null;
  const scroll = (timestamp) => {
    if (lastTimestamp === null)
      lastTimestamp = timestamp;
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
        break;
      case "down":
        el.scrollBy(0, distance);
        break;
      case "left":
        el.scrollBy(-distance, 0);
        break;
      case "right":
        el.scrollBy(distance, 0);
        break;
    }
    lastTimestamp = timestamp;
    animationFrameId = requestAnimationFrame(scroll);
  };
  animationFrameId = requestAnimationFrame(scroll);
}
function shouldScroll(direction, e, state2) {
  const dataScrollData = getScrollData(e, state2);
  if (!dataScrollData)
    return false;
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
  if (!data.scrollOutside && diff < 0)
    return;
  if (diff < (1 - data.xThresh) * data.scrollParent.clientWidth && !(data.scrollParent.scrollLeft + data.scrollParent.clientWidth >= data.scrollParent.scrollWidth))
    return state2;
}
function shouldScrollLeft(state2, data) {
  return;
  const diff = data.scrollParent.clientWidth + data.x - state2.coordinates.x;
  if (!data.scrollOutside && diff > data.scrollParent.clientWidth)
    return;
  if (diff > data.xThresh * data.scrollParent.clientWidth && data.scrollParent.scrollLeft !== 0)
    return state2;
}
function shouldScrollUp(state2, data) {
  const diff = data.scrollParent.clientHeight + data.y - state2.coordinates.y;
  if (!data.scrollOutside && diff > data.scrollParent.clientHeight)
    return false;
  if (diff > data.yThresh * data.scrollParent.clientHeight && data.scrollParent.scrollTop !== 0) {
    return true;
  }
  return false;
}
function shouldScrollDown(state2, data) {
  const diff = data.scrollParent.clientHeight + data.y - state2.coordinates.y;
  if (!data.scrollOutside && diff < 0)
    return false;
  if (diff < (1 - data.yThresh) * data.scrollParent.clientHeight && !(data.scrollParent.scrollTop + data.scrollParent.clientHeight >= data.scrollParent.scrollHeight)) {
    return true;
  }
  return false;
}
function moveNode(data, state2) {
  state2.pointerMoved = true;
  state2.clonedDraggedNode.style.display = state2.draggedNodeDisplay || "";
  const { x, y } = eventCoordinates(data.e);
  state2.coordinates.y = y;
  state2.coordinates.x = x;
  const startLeft = state2.startLeft ?? 0;
  const startTop = state2.startTop ?? 0;
  state2.clonedDraggedNode.style.left = `${x - startLeft}px`;
  state2.clonedDraggedNode.style.top = `${y - startTop}px`;
  if (data.e.cancelable)
    data.e.preventDefault();
  pointermoveClasses(state2, data.targetData.parent.data.config);
}
function synthMove(data, state2) {
  const config = data.targetData.parent.data.config;
  if (config.longPress && !state2.longPress) {
    clearTimeout(state2.longPressTimeout);
    return;
  }
  moveNode(data, state2);
  const elFromPoint = getElFromPoint(data);
  if (!elFromPoint)
    return;
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
  if (!isSynthDragState(state))
    return;
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
  if (!directionSet)
    state.synthScrollDirection = void 0;
}
function handleDragoverNode4(data, state2) {
  const { x, y } = eventCoordinates(data.e);
  state2.coordinates.y = y;
  state2.coordinates.x = x;
  dragoverNode3(data, state2);
}
function handleDragoverParent3(data, state2) {
  if (!state2)
    return;
  const { x, y } = eventCoordinates(data.e);
  state2.coordinates.y = y;
  state2.coordinates.x = x;
  transfer(data, state2);
}
function handlePointeroverParent4(e) {
  if (e.detail.targetData.parent.el !== e.detail.state.lastParent.el)
    transfer(e.detail, e.detail.state);
}
function validateTransfer(data, state2) {
  if (data.targetData.parent.el === state2.lastParent.el)
    return false;
  const targetConfig = data.targetData.parent.data.config;
  if (targetConfig.treeGroup && state2.draggedNode.el.contains(data.targetData.parent.el)) {
    return false;
  }
  if (targetConfig.dropZone === false)
    return false;
  const initialParentConfig = state2.initialParent.data.config;
  if (targetConfig.accepts) {
    return targetConfig.accepts(
      data.targetData.parent,
      state2.initialParent,
      state2.lastParent,
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
function dragoverNode3(eventData, dragState) {
  eventData.e.preventDefault();
  eventData.e.stopPropagation();
  eventData.targetData.parent.el === dragState.lastParent?.el ? sort(eventData, dragState) : transfer(eventData, dragState);
}
function validateSort(data, state2, x, y) {
  if (state2.affectedNodes.map((x2) => x2.data.value).includes(data.targetData.node.data.value)) {
    return false;
  }
  if (state2.remapJustFinished) {
    state2.remapJustFinished = false;
    if (data.targetData.node.data.value === state2.lastTargetValue || state2.draggedNodes.map((x2) => x2.el).includes(data.targetData.node.el)) {
      state2.lastTargetValue = data.targetData.node.data.value;
    }
    return false;
  }
  if (state2.preventEnter)
    return false;
  if (state2.draggedNodes.map((x2) => x2.el).includes(data.targetData.node.el)) {
    state2.lastTargetValue = void 0;
    return false;
  }
  if (data.targetData.node.data.value === state2.lastTargetValue)
    return false;
  if (data.targetData.parent.el !== state2.lastParent?.el || data.targetData.parent.data.config.sortable === false)
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
  const threshold = state2.lastParent.data.config.threshold;
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
  if (!validateSort(data, state2, x, y))
    return;
  const range = state2.draggedNode.data.index > data.targetData.node.data.index ? [data.targetData.node.data.index, state2.draggedNode.data.index] : [state2.draggedNode.data.index, data.targetData.node.data.index];
  state2.targetIndex = data.targetData.node.data.index;
  state2.affectedNodes = data.targetData.parent.data.enabledNodes.filter(
    (node) => {
      return range[0] <= node.data.index && node.data.index <= range[1] && node.el !== state2.draggedNode.el;
    }
  );
  data.targetData.parent.data.config.performSort(state2, data);
}
function nodeEventData(callback) {
  function nodeTargetData(node) {
    const nodeData = nodes.get(node);
    if (!nodeData)
      return;
    const parentData = parents.get(node.parentNode);
    if (!parentData)
      return;
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
    if (!targetData)
      return;
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
  if (!validateTransfer(data, state2))
    return;
  data.targetData.parent.data.config.performTransfer(state2, data);
  state2.lastParent = data.targetData.parent;
  state2.transferred = true;
}
function parentEventData(callback) {
  function parentTargetData(parent) {
    const parentData = parents.get(parent);
    if (!parentData)
      return;
    return {
      parent: {
        el: parent,
        data: parentData
      }
    };
  }
  return (e) => {
    const targetData = parentTargetData(e.currentTarget);
    if (!targetData)
      return;
    return callback({
      e,
      targetData,
      state
    });
  };
}
export {
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
  dragstart,
  dragstartClasses,
  emit,
  end,
  eventCoordinates,
  getElFromPoint,
  getRealCoords,
  getScrollables,
  handleClickNode2 as handleClickNode,
  handleClickParent,
  handleDragoverNode4 as handleDragoverNode,
  handleDragoverParent3 as handleDragoverParent,
  handleDragstart3 as handleDragstart,
  handleDropParent,
  handleEnd,
  handleKeydownNode2 as handleKeydownNode,
  handleKeydownParent,
  handleLongPress,
  handlePointerdownNode2 as handlePointerdownNode,
  handlePointermove,
  handlePointeroverNode3 as handlePointeroverNode,
  handlePointeroverParent4 as handlePointeroverParent,
  handlePointerup,
  handleScroll,
  handleTouchstart,
  initDrag,
  insertion,
  isBrowser,
  isDragState,
  isNode,
  isSynthDragState,
  multiDrag,
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
  pointerdown,
  preventDefault,
  preventSortOnScroll,
  remapFinished,
  remapNodes,
  removeClass,
  resetState,
  selections,
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
  transfer,
  treeAncestors,
  updateConfig,
  validateDragHandle,
  validateSort,
  validateTransfer
};
//# sourceMappingURL=index.mjs.map