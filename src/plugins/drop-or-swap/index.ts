import type {
  DropSwapConfig,
  NodeDragEventData,
  DragState,
  SynthDragState,
  NodeRecord,
  PointeroverNodeEvent,
  ParentDragEventData,
  PointeroverParentEvent,
  DropSwapState,
} from "../../types";
import {
  parents,
  parentValues,
  setParentValues,
  addNodeClass,
  isSynthDragState,
  removeClass,
  addClass,
  state,
  addEvents,
  isDragState,
} from "../../index";

export const dropSwapState: DropSwapState<unknown> = {
  draggedOverNodes: Array<NodeRecord<unknown>>(),
  initialDraggedIndex: undefined,
  transferred: false,
  dragging: false,
};

/**
 * Abort controller for the document.
 */
let documentController: AbortController | undefined;

export function dropOrSwap<T>(dropSwapConfig: DropSwapConfig<T> = {}) {
  return (parent: HTMLElement) => {
    const parentData = parents.get(parent);

    if (!parentData) return;

    const dropSwapParentConfig = {
      ...parentData.config,
      dropSwapConfig,
    };

    return {
      setup() {
        dropSwapParentConfig.handleNodeDragover =
          dropSwapConfig.handleNodeDragover || handleNodeDragover;

        dropSwapParentConfig.handleParentDragover =
          dropSwapConfig.handleParentDragover || handleParentDragover;

        dropSwapParentConfig.handleNodePointerover =
          dropSwapConfig.handleNodePointerover || handleNodePointerover;

        dropSwapParentConfig.handleParentPointerover =
          dropSwapConfig.handleParentPointerover || handeParentPointerover;

        const originalHandleend = dropSwapParentConfig.handleEnd;

        dropSwapParentConfig.handleEnd = (
          state: DragState<T> | SynthDragState<T>
        ) => {
          handleEnd(state);

          originalHandleend(state);
        };

        parentData.on("dragStarted", () => {
          documentController = addEvents(document, {
            dragover: rootDragover,
            handleRootPointerover: rootPointerover,
          });
        });

        parentData.on("dragEnded", () => {
          documentController?.abort();
        });

        parentData.config = dropSwapParentConfig;
      },
    };
  };
}

function rootDragover(_e: DragEvent) {
  if (!isDragState(state)) return;

  removeClass(
    [state.currentParent.el],
    state.currentParent.data.config.dropZoneParentClass
  );

  state.currentParent = state.initialParent;
}

function rootPointerover(_e: CustomEvent) {
  if (!isSynthDragState(state)) return;

  removeClass(
    [state.currentParent.el],
    state.currentParent.data.config.synthDropZoneParentClass
  );

  state.currentParent = state.initialParent;
}

function updateDraggedOverNodes<T>(
  data: PointeroverNodeEvent<T> | NodeDragEventData<T>,
  state: DragState<T> | SynthDragState<T>
) {
  const targetData =
    "detail" in data ? data.detail.targetData : data.targetData;

  const config = targetData.parent.data.config;

  const dropZoneClass = isSynthDragState(state)
    ? config.synthDropZoneClass
    : config.dropZoneClass;

  removeClass(
    dropSwapState.draggedOverNodes.map((node) => node.el),
    dropZoneClass
  );

  const enabledNodes = targetData.parent.data.enabledNodes;

  if (!enabledNodes) return;

  dropSwapState.draggedOverNodes = enabledNodes.slice(
    targetData.node.data.index,
    targetData.node.data.index + state.draggedNodes.length
  );

  addNodeClass(
    dropSwapState.draggedOverNodes.map((node) => node.el),
    dropZoneClass,
    true
  );

  state.currentTargetValue = targetData.node.data.value;

  state.currentParent = targetData.parent;

  addClass(
    state.currentParent.el,
    isSynthDragState(state)
      ? config.synthDropZoneParentClass
      : config.dropZoneParentClass,
    state.currentParent.data,
    true
  );
}

function handleNodeDragover<T>(
  data: NodeDragEventData<T>,
  state: DragState<T>
) {
  data.e.preventDefault();

  data.e.stopPropagation();

  updateDraggedOverNodes(data, state);
}

export function handleParentDragover<T>(
  data: ParentDragEventData<T>,
  state: DragState<T>
) {
  data.e.preventDefault();

  data.e.stopPropagation();

  const currentConfig = state.currentParent.data.config;

  removeClass(
    dropSwapState.draggedOverNodes.map((node) => node.el),
    currentConfig.dropZoneClass
  );

  removeClass([state.currentParent.el], currentConfig.dropZoneParentClass);

  const config = data.targetData.parent.data.config;

  addClass(
    data.targetData.parent.el,
    config.dropZoneParentClass,
    data.targetData.parent.data,
    true
  );

  dropSwapState.draggedOverNodes = [];

  state.currentParent = data.targetData.parent;
}

export function handeParentPointerover<T>(data: PointeroverParentEvent<T>) {
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

function handleNodePointerover<T>(data: PointeroverNodeEvent<T>) {
  if (!isSynthDragState(data.detail.state)) return;

  updateDraggedOverNodes(data, data.detail.state);
}

function swapElements<T>(
  arr1: T[],
  arr2: T[] | null,
  index1: number | number[],
  index2: number
): T[] | [T[], T[]] {
  const indices1 = Array.isArray(index1) ? index1 : [index1];

  if (arr2 === null) {
    const elementsFromArr1 = indices1.map((i) => arr1[i]);

    const elementFromArr2 = arr1[index2];

    arr1.splice(index2, 1, ...elementsFromArr1);

    indices1.forEach((i, idx) => {
      arr1[i] = idx === 0 ? elementFromArr2 : (undefined as unknown as T);
    });

    return arr1.filter((el) => el !== undefined);
  } else {
    const elementsFromArr1 = indices1.map((i) => arr1[i]);

    const elementFromArr2 = arr2[index2];

    arr2.splice(index2, 1, ...elementsFromArr1);

    indices1.forEach((i, idx) => {
      arr1[i] = idx === 0 ? elementFromArr2 : (undefined as unknown as T);
    });

    return [arr1.filter((el) => el !== undefined), arr2];
  }
}

function handleEnd<T>(state: DragState<T> | SynthDragState<T>) {
  const isSynth = isSynthDragState(state);

  removeClass(
    [state.currentParent.el],
    isSynth
      ? state.currentParent.data.config.synthDropZoneParentClass
      : state.currentParent.data.config.dropZoneParentClass
  );

  removeClass(
    dropSwapState.draggedOverNodes.map((node) => node.el),
    isSynth
      ? state.currentParent.data.config.synthDropZoneClass
      : state.currentParent.data.config.dropZoneClass
  );

  const values = parentValues(state.currentParent.el, state.currentParent.data);

  const draggedValues = state.draggedNodes.map((node) => node.data.value);

  const newValues = values.filter((x) => !draggedValues.includes(x));

  const targetIndex = dropSwapState.draggedOverNodes[0]?.data.index;

  const draggedIndex = state.draggedNodes[0].data.index;

  const initialParentValues = parentValues(
    state.initialParent.el,
    state.initialParent.data
  );

  if (targetIndex === undefined) {
    if (state.initialParent.el === state.currentParent.el) return;

    const newInitialValues = initialParentValues.filter(
      (x) => !draggedValues.includes(x)
    );

    setParentValues(
      state.initialParent.el,
      state.initialParent.data,
      newInitialValues
    );

    setParentValues(
      state.currentParent.el,
      state.currentParent.data,
      values.concat(draggedValues)
    );

    return;
  }

  let swap = false;

  const shouldSwap = state.initialParent.data.config.dropSwapConfig?.shouldSwap;

  if (shouldSwap)
    swap = shouldSwap({
      sourceParent: state.initialParent,
      targetParent: state.currentParent,
      draggedNodes: state.draggedNodes,
      targetNodes: dropSwapState.draggedOverNodes as NodeRecord<T>[],
      state,
    });

  if (state.initialParent.el === state.currentParent.el) {
    newValues.splice(targetIndex, 0, ...draggedValues);

    setParentValues(
      state.currentParent.el,
      state.currentParent.data,
      swap ? swapElements(values, null, draggedIndex, targetIndex) : newValues
    );
  } else {
    if (swap) {
      const res = swapElements(
        initialParentValues,
        newValues,
        state.initialIndex,
        targetIndex
      );

      setParentValues(
        state.initialParent.el,
        state.initialParent.data,
        res[0] as T[]
      );

      setParentValues(
        state.currentParent.el,
        state.currentParent.data,
        res[1] as T[]
      );
    } else {
      const newInitialValues = initialParentValues.filter(
        (x) => !draggedValues.includes(x)
      );

      setParentValues(
        state.initialParent.el,
        state.initialParent.data,
        newInitialValues
      );

      newValues.splice(targetIndex, 0, ...draggedValues);

      setParentValues(
        state.currentParent.el,
        state.currentParent.data,
        newValues
      );
    }
  }
}
