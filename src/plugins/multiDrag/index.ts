import type {
  Node,
  NodeEventData,
  NodeRecord,
  DragState,
  ParentData,
  NodeDragEventData,
  NodePointerEventData,
  TearDownNodeData,
  SetupNodeData,
  MultiDragConfig,
  MultiDragParentConfig,
  MultiDragState,
  BaseDragState,
} from "../../types";

import {
  parents,
  initDrag,
  dragstartClasses,
  end,
  state,
  resetState,
  isDragState,
} from "../../index";
import { addNodeClass, removeClass, copyNodeStyle } from "../../utils";

export const multiDragState: MultiDragState<any> = {
  selectedNodes: Array<NodeRecord<any>>(),

  activeNode: undefined,
};

export function multiDrag<T>(
  multiDragConfig: Partial<MultiDragConfig<T>> = {}
) {
  return (parent: HTMLElement) => {
    const parentData = parents.get(parent);

    if (!parentData) return;

    const multiDragParentConfig = {
      ...parentData.config,
      multiDragConfig: multiDragConfig,
    } as MultiDragParentConfig<T>;

    return {
      setup() {
        multiDragParentConfig.handleDragstart =
          multiDragConfig.handleDragstart || handleDragstart;

        multiDragParentConfig.handlePointerdownNode =
          multiDragConfig.handlePointerdownNode || handlePointerdownNode;

        multiDragParentConfig.handleEnd =
          multiDragConfig.handleEnd || handleEnd;

        multiDragParentConfig.reapplyDragClasses =
          multiDragConfig.reapplyDragClasses || reapplyDragClasses;

        parentData.config = multiDragParentConfig;

        multiDragParentConfig.multiDragConfig.plugins?.forEach((plugin) => {
          plugin(parent)?.tearDown?.();
        });

        multiDragParentConfig.multiDragConfig.plugins?.forEach((plugin) => {
          plugin(parent)?.setup?.();
        });
      },

      tearDownNodeRemap<T>(data: TearDownNodeData<T>) {
        multiDragParentConfig.multiDragConfig?.plugins?.forEach((plugin) => {
          plugin(data.parent)?.tearDownNodeRemap?.(data);
        });
      },

      tearDownNode<T>(data: TearDownNodeData<T>) {
        multiDragParentConfig.multiDragConfig?.plugins?.forEach((plugin) => {
          plugin(data.parent)?.tearDownNode?.(data);
        });
      },

      setupNodeRemap<T>(data: SetupNodeData<T>) {
        multiDragParentConfig.multiDragConfig?.plugins?.forEach((plugin) => {
          plugin(data.parent)?.setupNodeRemap?.(data);
        });
      },

      setupNode<T>(data: SetupNodeData<T>) {
        multiDragParentConfig.multiDragConfig?.plugins?.forEach((plugin) => {
          plugin(data.parent)?.setupNode?.(data);
        });
      },
    };
  };
}

function reapplyDragClasses<T>(node: Node, parentData: ParentData<T>) {
  if (!isDragState(state)) return;

  const multiDragConfig = parentData.config.multiDragConfig;

  if (!multiDragConfig) return;

  const dropZoneClass =
    "clonedDraggedNode" in state
      ? parentData.config.synthDropZoneClass
      : parentData.config.dropZoneClass;

  const draggedNodeEls = state.draggedNodes.map((x) => x.el);

  if (!draggedNodeEls.includes(node)) return;

  addNodeClass([node], dropZoneClass, true);
}

export function handleEnd<T>(data: NodeEventData<T>, state: DragState<T>) {
  end(data, state);

  selectionsEnd(data, state);

  resetState();
}

export function selectionsEnd<T>(data: NodeEventData<T>, _state: DragState<T>) {
  const multiDragConfig = data.targetData.parent.data.config.multiDragConfig;

  if (!multiDragConfig) return;

  const selectedClass =
    data.targetData.parent.data.config.selectionsConfig?.selectedClass;

  if (selectedClass) {
    removeClass(
      multiDragState.selectedNodes.map((x) => x.el),
      selectedClass
    );
  }

  multiDragState.selectedNodes = [];

  multiDragState.activeNode = undefined;
}

export function handleDragstart<T>(
  data: NodeEventData<T>,
  state: DragState<T>
) {
  if (!(data.e instanceof DragEvent)) return;

  multiDragstart(
    {
      e: data.e,
      targetData: data.targetData,
    },
    state
  );
}

export function multiDragstart<T>(
  data: NodeDragEventData<T>,
  _state: DragState<T>
) {
  const dragState = initDrag(data);

  const multiDragConfig = data.targetData.parent.data.config.multiDragConfig;

  if (!multiDragConfig) return;

  const parentValues = data.targetData.parent.data.getValues(
    data.targetData.parent.el
  );

  let selectedValues = multiDragState.selectedNodes.length
    ? multiDragState.selectedNodes.map((x) => x.data.value)
    : multiDragConfig.selections &&
      multiDragConfig.selections(parentValues, data.targetData.parent.el);

  if (selectedValues === undefined) return;

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
      data.e.clientY - targetRect.top,
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

export function handlePointerdownNode<T>(
  data: NodePointerEventData<T>,
  state: DragState<T>
) {
  multiPointerdown(
    {
      e: data.e,
      targetData: data.targetData,
    },
    state
  );
}

export function multiPointerdown<T>(
  _data: NodePointerEventData<T>,
  _state: BaseDragState
) {
  return;
  //console.log("pointerdown");
  //return;
  //multiDragState.activeNode = data.targetData.node;

  //const multiDragConfig = data.targetData.parent.data.config.multiDragConfig;

  //if (!multiDragConfig) return;

  //const parentValues = data.targetData.parent.data.getValues(
  //  data.targetData.parent.el
  //);

  //let selectedValues = [];

  //if (data.targetData.parent.data.config.selectionsConfig) {
  //  selectedValues = multiDragState.selectedNodes.map((x) => x.data.value);
  //} else {
  //  selectedValues =
  //    (multiDragConfig.selections &&
  //      multiDragConfig.selections(parentValues, data.targetData.parent.el)) ||
  //    [];
  //}

  //selectedValues = [data.targetData.node.data.value, ...selectedValues];

  //const selectionConfig = data.targetData.parent.data.config.selectionsConfig;

  //addNodeClass([data.targetData.node.el], selectionConfig?.selectedClass, true);

  //const rees = handleSelections(data, selectedValues, state, 0, 0);
  //console.log(rees);
  //if (Array.isArray(selectedValues) && selectedValues.length) {
  //  stackNodes(
  //    handleSelections(
  //      data,
  //      selectedValues,
  //      state,
  //      state.startLeft,
  //      state.startTop
  //    )
  //  );
  //}

  //handleLongPress(data, state);
}

export function handleSelections<T>(
  data: NodeEventData<T>,
  selectedValues: Array<T>,
  state: DragState<T>,
  x: number,
  y: number
) {
  for (const child of data.targetData.parent.data.enabledNodes) {
    if (child.el === state.draggedNode.el) continue;

    if (!selectedValues.includes(child.data.value)) continue;

    state.draggedNodes.push(child);
  }

  const config = data.targetData.parent.data.config.multiDragConfig;

  const clonedEls = state.draggedNodes.map((x: NodeRecord<T>) => {
    const el = x.el.cloneNode(true) as Node;

    copyNodeStyle(x.el, el, true);

    if (data.e instanceof DragEvent && config)
      addNodeClass([el], config.draggingClass);

    return el;
  });

  setTimeout(() => {
    if (data.e instanceof DragEvent && config) {
      addNodeClass(
        state.draggedNodes.map((x) => x.el),
        config.dropZoneClass
      );
    }
  });

  state.clonedDraggedEls = clonedEls;

  return { data, state, x, y };
}

export function stackNodes<T>({
  data,
  state,
  x,
  y,
}: {
  data: NodeEventData<T>;
  state: DragState<T>;
  x: number;
  y: number;
}) {
  const wrapper = document.createElement("div");

  for (const el of state.clonedDraggedEls) {
    if (el instanceof HTMLElement) el.style.pointerEvents = "none";

    wrapper.append(el);
  }

  const { width } = state.draggedNode.el.getBoundingClientRect();

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
  } else if ("touchedNode" in state) {
    state.touchedNode = wrapper;
  }
}
