import type {
  SetupNodeData,
  NodeEventData,
  TearDownNodeData,
  ParentConfig,
} from "../../../../types";

import type { SelectionsConfig } from "./types";

import { parents, state, nodeEventData } from "../../../../index";

import { addEvents, removeClass, addClass } from "../../../../utils";

import { multiDragState } from "../../index";

export function selections(selectionsConfig: SelectionsConfig = {}) {
  return (parent: HTMLElement) => {
    const parentData = parents.get(parent);

    if (!parentData) return;

    return {
      setupParent() {
        parentData.config.selectionsConfig = selectionsConfig;

        parentData.config.handleClick =
          selectionsConfig.handleClick || handleClick;

        selectionsConfig.clickawayDeselect =
          selectionsConfig.clickawayDeselect === undefined
            ? true
            : selectionsConfig.clickawayDeselect;

        if (!selectionsConfig.clickawayDeselect) return;

        const rootAbortControllers = addEvents(parentData.config.root, {
          click: handleRootClick.bind(null, parentData.config),
        });

        parentData.abortControllers["root"] = rootAbortControllers;
      },

      teardownNode(data: TearDownNodeData) {
        if (data.nodeData?.abortControllers?.mainNode) {
          for (const event of Object.keys(
            data.nodeData.abortControllers.mainNode
          )) {
            data.nodeData.abortControllers.selectionsNode[event].abort();
          }
        }
      },

      setupNode(data: SetupNodeData) {
        const config = data.parentData.config;

        const abortControllers = addEvents(data.node, {
          click: nodeEventData(config.handleClick),
        });

        data.nodeData.abortControllers["selectionsNode"] = abortControllers;
      },
    };
  };
  //return {
  //  s(parent: HTMLElement, config: Config) {
  //    const parentData = state.parentData.get(parent);
  //    if (!parentData) return;
  //    multiDragConfig.multiDragstart = multiDragstart;
  //    parentData.multiDragConfig = multiDragConfig;
  //    state.parentData.set(parent, {
  //      ...parentData,
  //    });
  //    document.addEventListener("click", docClick);
  //    document.addEventListener("keydown", keydown);
  //    const parentConfig = parentData.config;
  //    if (
  //      !parentConfig ||
  //      !parentConfig.setDraggable ||
  //      !parentConfig.removeDraggable
  //    )
  //      return;
  //    const setDraggable = parentConfig.setDraggable;
  //    parentConfig.setDraggable = (node: Node) => {
  //      setDraggable(node);
  //      setEvents(node);
  //      return node;
  //    };
  //    const removeDraggable = parentConfig.removeDraggable;
  //    state.removeDraggable = (el: Node) => {
  //      removeDraggable(el);
  //      removeEvents(el);
  //      return el;
  //    };
  //  },
  //  tearDown(parent: HTMLElement) {
  //    document.removeEventListener("click", docClick);
  //    document.removeEventListener("keydown", keydown);
  //    const parentData = state.parentData.get(parent);
  //    if (!parentData) return;
  //    delete parentData.multiDragConfig;
  //  },
  //};
}

function handleRootClick(config: ParentConfig, e: Event) {
  for (const nodeRecord of multiDragState.selectedNodes) {
    console.log("handle root click", nodeRecord);
    nodeRecord.el.classList.remove(config.selectionsConfig.selectedClass);
  }

  multiDragState.selectedNodes = [];
  //const el = getElFromPoint({
  //  e,
  //  nodes: state.nodeData,
  //  parents: state.parentData,
  //});
  //if (!el) return;
  //if (el.node) {
  //  handleClick(el);
  //}
}

function handleClick(data: NodeEventData) {
  click(data);
}

function click(data: NodeEventData) {
  data.e.stopPropagation();

  const selectionsConfig = data.targetData.parent.data.config.selectionsConfig;

  let commandKey;

  let shiftKey;

  if (data.e instanceof MouseEvent) {
    commandKey = data.e.ctrlKey || data.e.metaKey;

    shiftKey = data.e.shiftKey;
  }

  const ctParentData = data.targetData.parent.data;

  const selectedClass = selectionsConfig.selectedClass;

  console.log("selectedClass", selectedClass);

  const targetNode = data.targetData.node;

  if (shiftKey) {
    if (!multiDragState.activeNode) {
      multiDragState.activeNode = {
        el: data.targetData.node.el,
        data: data.targetData.node.data,
      };

      for (let x = 0; x <= data.targetData.node.data.index; x++) {
        multiDragState.selectedNodes.push(ctParentData.enabledNodes[x]);
        if (selectedClass) {
          addClass([ctParentData.enabledNodes[x].el], selectedClass);
        }
      }
    } else {
      const [minIndex, maxIndex] =
        multiDragState.activeNode.data.index < data.targetData.node.data.index
          ? [
              multiDragState.activeNode.data.index,
              data.targetData.node.data.index,
            ]
          : [
              data.targetData.node.data.index,
              multiDragState.activeNode.data.index,
            ];

      const selectedNodes = ctParentData.enabledNodes.slice(
        minIndex,
        maxIndex + 1
      );

      if (selectedNodes.length === 1) {
        for (const node of multiDragState.selectedNodes) {
          if (selectedClass) node.el.classList.remove(selectedClass);
        }

        multiDragState.selectedNodes = [
          {
            el: data.targetData.node.el,
            data: data.targetData.node.data,
          },
        ];

        multiDragState.activeNode = {
          el: data.targetData.node.el,
          data: data.targetData.node.data,
        };

        if (selectedClass) {
          data.targetData.node.el.classList.add(selectedClass);
        }
      }
      for (let x = minIndex - 1; x >= 0; x--) {
        if (
          multiDragState.selectedNodes.includes(ctParentData.enabledNodes[x])
        ) {
          multiDragState.selectedNodes = [
            ...multiDragState.selectedNodes.filter(
              (el) => el !== ctParentData.enabledNodes[x]
            ),
          ];

          if (selectedClass) {
            addClass([ctParentData.enabledNodes[x].el], selectedClass);
          }
        } else {
          break;
        }
      }
      for (let x = maxIndex; x < ctParentData.enabledNodes.length; x++) {
        if (
          multiDragState.selectedNodes.includes(ctParentData.enabledNodes[x])
        ) {
          multiDragState.selectedNodes = [
            ...multiDragState.selectedNodes.filter(
              (el) => el !== ctParentData.enabledNodes[x]
            ),
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
          addClass([node.el], selectedClass);
        }
      }
    }
  } else if (!commandKey) {
    multiDragState.activeNode = {
      el: data.targetData.node.el,
      data: data.targetData.node.data,
    };

    if (selectedClass) {
      for (const el of multiDragState.selectedNodes) {
        removeClass([el.el], selectedClass);
      }

      addClass([data.targetData.node.el], selectedClass);
    }
    multiDragState.selectedNodes = [
      {
        el: data.targetData.node.el,
        data: data.targetData.node.data,
      },
    ];
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
        addClass([targetNode.el], selectedClass);
      }
      multiDragState.selectedNodes.push(targetNode);
    }
    //if (multiDragConfig.selected) {
    //  //const nodeData = multiDragState.nodeData.get(e.currentTarget);
    //  //if (!nodeData) return;
    //  multiDragConfig.selected({
    //    el: e.currentTarget,
    //    nodeData,
    //    parent: e.currentTarget.parentNode as HTMLElement,
    //    parentData: ctParentData,
    //  });
  }
}

function docClick(e: MouseEvent) {
  for (const el of state.selectedNodes) {
    const parentData = state.parentData.get(el.parentNode);
    const multiDragConfigSelectedClass =
      parentData?.multiDragConfig?.selectedClass;
    if (multiDragConfigSelectedClass) {
      el.classList.remove(multiDragConfigSelectedClass);
    }
  }
  selectedNodes = [];
  state.activeNode = undefined;
}

function setEvents(el: Node) {
  el.addEventListener("click", clickEvent);
}

function removeEvents(el: Node) {
  el.removeEventListener("click", clickEvent);
}

function keydown(e: KeyboardEvent) {
  const keys = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];
  if (!keys.includes(e.key) || !state.activeNode) return;
  e.preventDefault();
  const parentData = state.parentData.get(state.activeNode.parentNode);
  const nodeData = state.nodeData.get(state.activeNode);
  if (!parentData || !nodeData) return;
  const enabledNodes = parentData.enabledNodes;
  if (!enabledNodes) return;
  const invalidKeydown =
    ((e.key === "ArrowUp" || e.key === "ArrowRight") && nodeData.index === 0) ||
    ((e.key === "ArrowDown" || e.key === "ArrowLeft") &&
      nodeData.index === enabledNodes.length - 1);
  if (invalidKeydown) return;
  const moveUp = e.key === "ArrowUp" || e.key === "ArrowLeft";
  const adjacentNode = enabledNodes[nodeData.index + (moveUp ? -1 : 1)];
  const selectedClass = parentData?.multiDragConfig?.selectedClass;
  if (!adjacentNode) return;
  if (e.altKey) {
    if (state.selectedNodes.length > 1) {
      for (const el of state.selectedNodes) {
        if (selectedClass && state.activeNode !== el)
          el.classList.remove(selectedClass);
      }
      state.selectedNodes = state.selectedNodes.filter(
        (el) => el !== state.activeNode
      );
    }
    const parentData = state.parentData.get(adjacentNode.parentNode);
    if (!parentData) return;
    const parentValues = [...parentData.getValues(state.activeNode.parentNode)];
    [
      parentValues[nodeData.index],
      parentValues[nodeData.index + (moveUp ? -1 : 1)],
    ] = [
      parentValues[nodeData.index + (moveUp ? -1 : 1)],
      parentValues[nodeData.index],
    ];
    parentData.setValues(state.activeNode.parentNode, parentValues);
  } else if (e.shiftKey) {
    if (!state.selectedNodes.includes(adjacentNode)) {
      state.selectedNodes.push(adjacentNode);
      if (selectedClass) adjacentNode.classList.add(selectedClass);
      state.activeNode = adjacentNode;
    } else {
      if (state.selectedNodes.includes(state.activeNode)) {
        state.selectedNodes = state.selectedNodes.filter(
          (el) => el !== state.activeNode
        );
        if (selectedClass) state.activeNode.classList.remove(selectedClass);
        state.activeNode = adjacentNode;
      }
    }
  } else {
    for (let el of state.selectedNodes) {
      if (selectedClass && state.activeNode !== el)
        el.classList.remove(selectedClass);
    }
    state.activeNode.classList.remove(
      parentData?.multiDragConfig?.selectedClass || ""
    );
    state.selectedNodes = [adjacentNode];
    adjacentNode.classList.add(
      parentData?.multiDragConfig?.selectedClass || ""
    );
    state.activeNode = adjacentNode;
  }
  state.activeNode.blur();
}

function clickEvent(e: MouseEvent) {
  e.stopPropagation();
  if (!isNode(e.currentTarget, state)) return;
  const multiDragConfig = state.parentData.get(
    e.currentTarget.parentNode
  )?.multiDragConfig;
  if (!multiDragConfig) return;
  const commandKey = e.ctrlKey || e.metaKey;
  const ctParentData = state.parentData.get(e.currentTarget.parentNode);
  const selectedClass = ctParentData?.multiDragConfig?.selectedClass;
  if (!ctParentData || !ctParentData.multiDragConfig) return;
  if (e.shiftKey) {
    if (!state.activeNode) {
      state.activeNode = e.currentTarget;
      const activeNodeData = state.nodeData.get(state.activeNode);
      if (!activeNodeData) return;
      for (let x = 0; x <= activeNodeData.index; x++) {
        state.selectedNodes.push(ctParentData.enabledNodes[x]);
        if (selectedClass)
          ctParentData.enabledNodes[x].classList.add(selectedClass);
      }
    } else {
      const activeNodeData = state.nodeData.get(state.activeNode);
      const clickedNodeData = state.nodeData.get(e.currentTarget);
      if (!activeNodeData || !clickedNodeData) return;
      const [minIndex, maxIndex] =
        activeNodeData.index < clickedNodeData.index
          ? [activeNodeData.index, clickedNodeData.index]
          : [clickedNodeData.index, activeNodeData.index];
      const selectedNodes = ctParentData.enabledNodes.slice(
        minIndex,
        maxIndex + 1
      );
      if (selectedNodes.length === 1) {
        for (const node of state.selectedNodes) {
          if (selectedClass) node.classList.remove(selectedClass);
        }
        state.selectedNodes = [e.currentTarget];
        state.activeNode = e.currentTarget;
        if (selectedClass) e.currentTarget.classList.add(selectedClass);
      }
      for (let x = minIndex - 1; x >= 0; x--) {
        if (state.selectedNodes.includes(ctParentData.enabledNodes[x])) {
          state.selectedNodes = [
            ...state.selectedNodes.filter(
              (el) => el !== ctParentData.enabledNodes[x]
            ),
          ];
          if (selectedClass)
            ctParentData.enabledNodes[x].classList.remove(selectedClass);
        } else {
          break;
        }
      }
      for (let x = maxIndex; x < ctParentData.enabledNodes.length; x++) {
        if (state.selectedNodes.includes(ctParentData.enabledNodes[x])) {
          state.selectedNodes = [
            ...state.selectedNodes.filter(
              (el) => el !== ctParentData.enabledNodes[x]
            ),
          ];
          if (selectedClass)
            ctParentData.enabledNodes[x].classList.remove(selectedClass);
        } else {
          break;
        }
      }
      for (const node of selectedNodes) {
        if (!state.selectedNodes.includes(node)) state.selectedNodes.push(node);
        if (selectedClass) node.classList.add(selectedClass);
      }
    }
  } else if (!commandKey) {
    state.activeNode = e.currentTarget;
    if (selectedClass) {
      for (const el of state.selectedNodes) {
        el.classList.remove(selectedClass);
      }
      state.activeNode.classList.add(selectedClass);
    }
    state.selectedNodes = [e.currentTarget];
  } else if (commandKey) {
    if (state.selectedNodes.includes(e.currentTarget)) {
      state.selectedNodes = state.selectedNodes.filter(
        (el) => el !== e.currentTarget
      );
      if (selectedClass) e.currentTarget.classList.remove(selectedClass);
    } else {
      state.activeNode = e.currentTarget;
      if (selectedClass) e.currentTarget.classList.add(selectedClass);
      state.selectedNodes.push(e.currentTarget);
    }
  }
  if (multiDragConfig.selected) {
    const nodeData = state.nodeData.get(e.currentTarget);
    if (!nodeData) return;
    multiDragConfig.selected({
      el: e.currentTarget,
      nodeData,
      parent: e.currentTarget.parentNode as HTMLElement,
      parentData: ctParentData,
    });
  }
}
