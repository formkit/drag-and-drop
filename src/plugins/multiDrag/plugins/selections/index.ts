import type {
  SetupNodeData,
  NodeEventData,
  TearDownNodeData,
  ParentConfig,
  NodePointerEventData,
  BaseDragState,
} from "../../../../types";

import {
  state,
  parents,
  nodeEventData,
  addEvents,
  removeClass,
  addNodeClass,
} from "../../../../index";

export function selections<T>(selectionsConfig: SelectionsConfig<T> = {}) {
  return (parent: HTMLElement) => {
    const parentData = parents.get(parent);

    if (!parentData) return;

    const selectionsParentConfig = {
      ...parentData.config,
      selectionsConfig,
    } as SelectionsParentConfig<T>;

    return {
      setup() {
        selectionsParentConfig.handleKeydownNode =
          selectionsConfig.handleKeydownNode || handleKeydownNode;

        selectionsParentConfig.handlePointerupNode =
          selectionsConfig.handlePointerupNode || handlePointerupNode;

        selectionsConfig.clickawayDeselect =
          selectionsConfig.clickawayDeselect === undefined
            ? true
            : selectionsConfig.clickawayDeselect;

        if (!selectionsConfig.clickawayDeselect) return;

        const rootAbortControllers = addEvents(parentData.config.root, {
          pointerdown: handlePointerdownRoot.bind(null, parentData.config),
        });

        parentData.abortControllers["root"] = rootAbortControllers;

        parentData.config.selectionsConfig = selectionsConfig;

        parentData.config = selectionsParentConfig;
      },

      tearDown() {
        if (parentData.abortControllers.root)
          parentData.abortControllers.root.abort();
      },

      tearDownNode<T>(data: TearDownNodeData<T>) {
        if (data.parentData.abortControllers.selectionsNode)
          data.parentData.abortControllers.selectionsNode.abort();
      },

      setupNode<T>(data: SetupNodeData<T>) {
        data.node.setAttribute("tabindex", "0");

        addEvents(data.node, {
          pointerdown: nodeEventData(
            selectionsConfig.handlePointerdownNode || handlePointerdownNode
          ),
        });
      },
    };
  };
}

function handlePointerdownRoot<T>(config: ParentConfig<T>, e: PointerEvent) {
  if (!config.selectionsConfig) return;

  const isTouch = e.pointerType === "touch";

  removeClass(
    state.selectedNodes.map((x) => x.el),
    !isTouch
      ? config.selectionsConfig.selectedClass
      : config.selectionsConfig.synthSelectedClass
  );

  state.selectedNodes = [];

  state.activeNode = undefined;
}

function handleKeydownNode<T>(data: NodeEventData<T>) {
  keydown(data);
}

function handlePointerdownNode<T>(
  data: NodePointerEventData<T>,
  state: BaseDragState<T>
) {
  pointerdown(data);
  //data.e.stopPropagation();
  //const selectionsConfig = data.targetData.parent.data.config.selectionsConfig;
  //if (!selectionsConfig) return;
  //const selectedClass = selectionsConfig.selectedClass;
  //state.activeNode = data.targetData.node;
  //const idx = state.selectedNodes.findIndex(
  //  (el) => el.el === data.targetData.node.el
  //);
  //if (idx !== -1) {
  //  const el = state.selectedNodes.splice(idx, 1);
  //  removeClass([el[0].el], selectedClass);
  //} else {
  //  if (selectedClass)
  //    addNodeClass([data.targetData.node.el], selectedClass, true);
  //  state.selectedNodes.push(data.targetData.node);
  //}
}

function pointerdown<T>(data: NodePointerEventData<T>) {}

function selectionsHandler<T>(
  data: NodeEventData<T>,
  selectionsConfig: SelectionsConfig<T>
) {
  const synthSelectedClass = selectionsConfig.synthSelectedClass;

  addNodeClass([data.targetData.node.el], synthSelectedClass, true);
}

function handlePointerupNode<T>(data: NodePointerEventData<T>) {
  const selectionsConfig = data.targetData.parent.data.config.selectionsConfig;

  if (!selectionsConfig) return;

  const selectedClass = selectionsConfig.selectedClass;

  //if (shiftKey || commandKey) {

  //  return;
  //}

  //removeClass([data.targetData.node.el], selectedClass);

  const [shiftKey, commandKey] = [
    data.e.shiftKey,
    data.e.ctrlKey || data.e.metaKey,
  ];

  const isTouch = data.e.pointerType === "touch";

  if (isTouch) {
    selectionsHandler(data, selectionsConfig);

    return;
  }
}

function click<T>(data: NodeEventData<T>) {
  data.e.stopPropagation();

  const selectionsConfig = data.targetData.parent.data.config.selectionsConfig;

  if (!selectionsConfig) return;

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
        data: data.targetData.node.data,
      };

      for (let x = 0; x <= data.targetData.node.data.index; x++) {
        multiDragState.selectedNodes.push(ctParentData.enabledNodes[x]);
        if (selectedClass) {
          addNodeClass([ctParentData.enabledNodes[x].el], selectedClass, true);
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
        data: data.targetData.node.data,
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
          data: data.targetData.node.data,
        },
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

function keydown<T>(data: NodeEventData<T>) {
  if (!(data.e instanceof KeyboardEvent)) return;

  const keys = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];

  if (!keys.includes(data.e.key) || !multiDragState.activeNode) return;

  const selectionsConfig = data.targetData.parent.data.config.selectionsConfig;

  data.e.preventDefault();

  const parentData = data.targetData.parent.data;

  const nodeData = data.targetData.node.data;

  const enabledNodes = parentData.enabledNodes;

  const moveUp = data.e.key === "ArrowUp" || data.e.key === "ArrowLeft";

  const moveDown = data.e.key === "ArrowDown" || data.e.key === "ArrowRight";

  const invalidKeydown =
    (moveUp && nodeData.index === 0) ||
    (moveDown && nodeData.index === enabledNodes.length - 1);

  if (invalidKeydown) return;

  const adjacentNode = enabledNodes[nodeData.index + (moveUp ? -1 : 1)];

  if (!selectionsConfig) return;

  const selectedClass = selectionsConfig.selectedClass;

  if (!adjacentNode) return;

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
    const parentValues = parentData.getValues(data.targetData.parent.el);

    [
      parentValues[nodeData.index],
      parentValues[nodeData.index + (moveUp ? -1 : 1)],
    ] = [
      parentValues[nodeData.index + (moveUp ? -1 : 1)],
      parentValues[nodeData.index],
    ];

    parentData.setValues(parentValues, data.targetData.parent.el);
  } else if (data.e.shiftKey && false === false) {
    if (
      !multiDragState.selectedNodes.map((x) => x.el).includes(adjacentNode.el)
    ) {
      multiDragState.selectedNodes.push(adjacentNode);

      if (selectedClass) {
        addNodeClass([adjacentNode.el], selectedClass, true);
      }

      multiDragState.activeNode = adjacentNode;
    } else {
      if (
        multiDragState.selectedNodes
          .map((x) => x.el)
          .includes(multiDragState.activeNode.el)
      ) {
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
