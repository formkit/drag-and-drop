import type {
  Node,
  NodeEventData,
  NodeRecord,
  DragState,
  ParentData,
  TearDownNodeData,
  SetupNodeData,
  MultiDragConfig,
  MultiDragParentConfig,
} from "../../types";

import { parents, end, state, resetState, isDragState } from "../../index";
import { addNodeClass, removeClass, copyNodeStyle } from "../../utils";

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
        multiDragParentConfig.dragImage = (
          _draggedNode: NodeRecord<T>,
          draggedNodes: Array<NodeRecord<T>>,
          data: ParentData<T>
        ) => {
          const wrapper = document.createElement("div");

          draggedNodes.map((x: NodeRecord<T>) => {
            const el = x.el.cloneNode(true) as Node;

            if (data.config.deepCopyStyles) copyNodeStyle(x.el, el, true);

            if (el instanceof HTMLElement) el.style.pointerEvents = "none";

            wrapper.append(el);

            const { width } = draggedNodes[0].el.getBoundingClientRect();

            Object.assign(wrapper.style, {
              display: "flex",
              flexDirection: "column",
              width: `${width}px`,
              position: "absolute",
              pointerEvents: "none",
              zIndex: "9999",
              left: "-9999px",
            });

            return el;
          });

          document.body.append(wrapper);

          return wrapper;
        };

        multiDragParentConfig.draggedNodes = (data: NodeEventData<T>) => {
          const parentRecord = data.targetData.parent;

          let selectedValues: Array<T> = [];

          if (multiDragConfig.selectedValues) {
            selectedValues = multiDragConfig.selectedValues(
              parentRecord.data.getValues(parentRecord.el),
              parentRecord.el
            );
          }

          if (!selectedValues.length) return [data.targetData.node];

          const selectedNodes = parentRecord.data.enabledNodes.filter((x) =>
            selectedValues.includes(x.data.value)
          );

          if (
            !selectedNodes.map((x) => x.el).includes(data.targetData.node.el)
          ) {
            selectedNodes.unshift(data.targetData.node);
          }

          return selectedNodes;
        };

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
      ? multiDragConfig.synthDropZoneClass
      : multiDragConfig.dropZoneClass;

  const draggedNodeEls = state.draggedNodes.map((x) => x.el);

  if (!draggedNodeEls.includes(node)) return;

  addNodeClass([node], dropZoneClass, true);
}

export function handleEnd<T>(data: NodeEventData<T>, state: DragState<T>) {
  end(data, state);

  selectionsEnd(data, state);

  resetState();
}

export function selectionsEnd<T>(data: NodeEventData<T>, state: DragState<T>) {
  const multiDragConfig = data.targetData.parent.data.config.multiDragConfig;

  if (!multiDragConfig) return;

  const selectedClass =
    data.targetData.parent.data.config.selectionsConfig?.selectedClass;

  if (selectedClass) {
    removeClass(
      state.selectedNodes.map((x) => x.el),
      selectedClass
    );
  }

  state.selectedNodes = [];

  state.activeNode = undefined;
}

//export function handleSelections<T>(
//  data: NodeEventData<T>,
//  selectedValues: Array<T>,
//  state: DragState<T>,
//  x: number,
//  y: number
//) {
//  //for (const child of data.targetData.parent.data.enabledNodes) {
//  //  if (child.el === state.draggedNode.el) continue;

//  //  if (!selectedValues.includes(child.data.value)) continue;

//  //  state.draggedNodes.push(child);
//  //}
//  console.log("handle selections");
//  const config = data.targetData.parent.data.config.multiDragConfig;

//  const clonedEls = state.draggedNodes.map((x: NodeRecord<T>) => {
//    const el = x.el.cloneNode(true) as Node;

//    copyNodeStyle(x.el, el, true);

//    if (data.e instanceof DragEvent && config)
//      addNodeClass([el], config.draggingClass);

//    return el;
//  });

//  //setTimeout(() => {
//  //  if (data.e instanceof DragEvent && config) {
//  //    addNodeClass(
//  //      state.draggedNodes.map((x) => x.el),
//  //      config.dropZoneClass
//  //    );
//  //  }
//  //});

//  state.clonedDraggedEls = clonedEls;

//  return { data, state, x, y };
//}

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
  console.log("stack nodes");
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

  state.clonedDraggedNode = wrapper;

  //if (data.e instanceof DragEvent) {
  //  data.e.dataTransfer?.setDragImage(wrapper, x, y);

  //  setTimeout(() => {
  //    wrapper.remove();
  //  });
  //} else {
  //  state.clonedDraggedNOde = wrapper;
  //}
}
