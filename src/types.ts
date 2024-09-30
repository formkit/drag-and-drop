/**
 * The central entry point of the library.
 */
export interface DragAndDrop<T> {
  /**
   * The parent element that will contain the draggable nodes.
   */
  parent: HTMLElement;
  /**
   * A function that returns the values assigned to the parent.
   */
  getValues: (parent: HTMLElement) => Array<T>;
  /**
   * A function that sets the values assigned to the parent.
   */
  setValues: (values: Array<T>, parent: HTMLElement) => void;
  /**
   * An optional configuration object.
   */
  config?: Partial<ParentConfig<T>>;
}

export interface ParentDragEventData<T> extends ParentEventData<T> {
  e: DragEvent;
}

export type NativeDragEffects = "link" | "none" | "copy" | "move";

/**
 * The configuration object for a given parent.
 */
export interface ParentConfig<T> {
  /**
   * A function that returns whether a given parent accepts a given node.
   */
  accepts?: (
    targetParentData: ParentRecord<T>,
    initialParentData: ParentRecord<T>,
    currentParentData: ParentRecord<T>,
    state: BaseDragState<T>
  ) => boolean;
  activeDescendantClass?: string;
  /**
   * The data transfer effect to use for the drag operation.
   */
  dragEffectAllowed: NativeDragEffects;
  /**
   * The data transfer effect to use for the drag operation.
   */
  dragDropEffect: NativeDragEffects;
  /**
   * A function that returns the image to use for the drag operation. This is
   * invoked for native operations. The clonedNode is what will be set as the drag
   * image, but this can be updated.
   */
  dragImage?: (
    data: NodeDragEventData<T>,
    draggedNodes: Array<NodeRecord<T>>
  ) => HTMLElement;
  /**
   * A flag to disable dragability of all nodes in the parent.
   */
  disabled?: boolean;
  /**
   * A selector for the drag handle. Will search at any depth within the node.
   */
  dragHandle?: string;
  /**
   * A function that returns whether a given node is draggable.
   */
  draggable?: (child: HTMLElement) => boolean;
  draggedNodes: (data: NodeEventData<T>) => Array<NodeRecord<T>>;
  /**
   * The class to add to a node when it is being dragged.
   */
  draggingClass?: string;
  /**
   * Accepts array of "dragged nodes" and applies dragstart classes to them.
   */
  dragstartClasses: (
    node: NodeRecord<T>,
    nodes: Array<NodeRecord<T>>,
    config: ParentConfig<T>
  ) => void;
  dragPlaceholderClass?: string;
  /**
   * The class to add to a node when the node is dragged over it.
   */
  dropZoneClass?: string;
  /**
   * A flag to indicate whether the parent itself is a dropZone.
   */
  dropZone?: boolean;
  /**
   * The group that the parent belongs to. This is used for allowing multiple
   * parents to transfer nodes between each other.
   */
  group?: string;
  handleParentBlur: (data: ParentEventData<T>, state: BaseDragState<T>) => void;
  handleParentFocus: (
    data: ParentEventData<T>,
    state: BaseDragState<T>
  ) => void;
  handleNodeKeydown: (data: NodeEventData<T>, state: DragState<T>) => void;
  handleParentKeydown: (
    data: ParentKeydownEventData<T>,
    state: DragState<T>
  ) => void;
  /**
   * Function that is called when dragend or touchend event occurs.
   */
  handleDragend: (
    data: NodeDragEventData<T> | NodePointerEventData<T>,
    state: DragState<T>
  ) => void;
  /**
   * Function that is called when dragstart event occurs.
   */
  handleDragstart: (data: NodeDragEventData<T>, state: DragState<T>) => void;
  handleNodeDrop: (data: NodeDragEventData<T>, state: DragState<T>) => void;
  handleNodePointerup: (
    data: NodePointerEventData<T>,
    state: DragState<T>
  ) => void;
  /**
   * Function that is called when touchstart event occurs.
   */
  handleNodeTouchstart: (
    data: NodePointerEventData<T>,
    state: DragState<T>
  ) => void;
  /**
   * Function that is called when a dragenter event is triggered on the node.
   */
  handleNodeDragenter: (
    data: NodeDragEventData<T>,
    state: DragState<T>
  ) => void;
  /**
   * Dragleave event on node
   */
  handleNodeDragleave: (
    data: NodeDragEventData<T>,
    state: DragState<T>
  ) => void;
  /**
   * Function that is called when a dragover event is triggered on the parent.
   */
  handleParentDragover: (
    data: ParentDragEventData<T>,
    state: DragState<T>
  ) => void;
  /**
   * Drop event on parent
   */
  handleParentDrop: (data: ParentDragEventData<T>, state: DragState<T>) => void;
  /**
   * Function that is called when a dragover event is triggered on a node.
   */
  handleNodeDragover: (data: NodeDragEventData<T>, state: DragState<T>) => void;
  /*
   * Function that is called when a pointerdown is triggered on node.
   */
  handleNodePointerdown: (
    data: NodePointerEventData<T>,
    state: DragState<T>
  ) => void;
  /**
   * Function that is called when either a pointermove or touchmove event is fired
   * where now the "dragged" node is being moved programatically.
   */
  handleNodePointermove: (
    data: NodePointerEventData<T>,
    state: DragState<T>
  ) => void;
  /**
   * Function that is called when a node that is being moved by touchmove event
   * is over a given node (similar to dragover).
   */
  handleNodePointerover: (
    data: PointeroverNodeEvent<T>,
    state: DragState<T>
  ) => void;
  /**
   * Function that is called when a node that is being moved by touchmove event
   * is over the parent (similar to dragover).
   */
  handleParentPointerover: (
    e: PointeroverParentEvent<T>,
    state: DragState<T>
  ) => void;
  /**
   * A flag to indicate whether long touch is enabled.
   */
  longPress?: boolean;
  /**
   * The class to add to a node when a long touch action is performed.
   */
  longPressClass?: string;
  /**
   * The time in milliseconds to wait before a long touch is performed.
   */
  longPressTimeout?: number;
  /**
   * The name of the parent (used for accepts function for increased specificity).
   */
  name?: string;
  multiDrag?: boolean;
  /**
   * If set to false, the library will not use the native drag and drop API.
   */
  nativeDrag?: boolean;
  /**
   * Function that is called when a sort operation is to be performed.
   */
  performSort: ({
    parent,
    draggedNodes,
    targetNode,
  }: {
    parent: ParentRecord<T>;
    draggedNodes: Array<NodeRecord<T>>;
    targetNode: NodeRecord<T>;
  }) => void;
  /**
   * Function that is called when a transfer operation is to be performed.
   */
  performTransfer: ({
    currentParent,
    targetParent,
    initialParent,
    draggedNodes,
    initialIndex,
    state,
    targetNode,
  }: {
    currentParent: ParentRecord<T>;
    targetParent: ParentRecord<T>;
    initialParent: ParentRecord<T>;
    draggedNodes: Array<NodeRecord<T>>;
    initialIndex: number;
    state: BaseDragState<T> | DragState<T> | SynthDragState<T>;
    targetNode?: NodeRecord<T>;
  }) => void;
  /**
   * An array of functions to use for a given parent.
   */
  plugins?: Array<DNDPlugin>;
  /**
   * Takes a given node and reapplies the drag classes.
   */
  reapplyDragClasses: (node: Node, parentData: ParentData<T>) => void;
  /**
   * Invoked when the remapping of a given parent's nodes is finished.
   */
  remapFinished: (data: ParentData<T>) => void;
  /**
   * The root element to use for the parent.
   */
  root: Document | ShadowRoot;
  selectedClass?: string;
  /**
   * Function that is called when a node is set up.
   */
  setupNode: SetupNode;
  /**
   * Called when the value of the parent is changed and the nodes are remapped.
   */
  setupNodeRemap: SetupNode;
  /**
   * The scroll behavior of the parent.
   *
   * If a parent of the dragged element is scrollable, the parent will scroll on its x and y axis.
   *
   * I.e. Setting x: 0.9 will begin scrolling the parent when the dragged element is 90% horizontally.
   *
   * Scroll Outside determines whether or not the parent will scroll when the dragged element is outside of the parent.
   */
  scrollBehavior: {
    x: number;
    y: number;
    scrollOutside?: boolean;
  };
  /**
   * Flag for whether or not to allow sorting within a given parent.
   */
  sortable?: boolean;
  /**
   * A function that returns the image to use for the drag operation. This is
   * invoked for synth drag operations operations. The clonedNode is what will
   * be set as the drag image, but this can be updated.
   */
  synthDragImage?: (
    data: NodePointerEventData<T>,
    draggedNodes: Array<NodeRecord<T>>
  ) => HTMLElement;
  /**
   * Function that is called when a node is torn down.
   */
  tearDownNode: TearDownNode;
  /**
   * Called when the value of the parent is changed and the nodes are remapped.
   */
  tearDownNodeRemap: TearDownNode;
  /**
   * Property to identify the parent record who is the ancestor of the current parent.
   */
  treeAncestor?: ParentRecord<T>;
  /**
   * Property to identify which group of tree descendants the current parent belongs to.
   */
  treeGroup?: string;
  /**
   * The threshold for a drag to be considered a valid sort
   * operation.
   */
  threshold: {
    horizontal: number;
    vertical: number;
  };
  /**
   * The class to add to a node when it is being synthetically dragged.
   */
  synthDraggingClass?: string;
  synthDropZoneClass?: string;
  synthActiveDescendantClass?: string;
  /**
   * Config option to allow recursive copying of computed styles of dragged
   * element to the cloned one that will be dragged (only for synthetic drag).
   */
  deepCopyStyles?: boolean;
  /**
   * Callback function for when a sort operation is performed.
   */
  onSort?: SortEvent;
  /**
   * Callback function for when a transfer operation is performed.
   */
  onTransfer?: TransferEvent;
  /**
   * Fired when a drag is started, whether native drag or synthetic
   */
  onDragstart?: DragstartEvent;
  /**
   * Fired when a drag is ended, whether native drag or synthetic
   */
  onDragend?: DragendEvent;
}

/**
 * The data assigned to a given parent in the `parents` weakmap.
 */
export interface ParentData<T> {
  /**
   * A function that returns the values assigned to the parent.
   */
  getValues: (parent: HTMLElement) => Array<T>;
  /**
   * A function that sets the values assigned to the parent.
   */
  setValues: (values: Array<T>, parent: HTMLElement) => void;
  /**
   * The configuration object for the parent.
   */
  config: ParentConfig<T>;
  /**
   * The nodes that are currently enabled for drag and drop.
   */
  enabledNodes: Array<NodeRecord<T>>;
  /**
   * The abort controllers for the parent.
   */
  abortControllers: Record<string, AbortController>;
  /**
   * The private classes of the node (used for preventing erroneous removal of
   * classes).
   */
  privateClasses: Array<string>;
  /**
   * Set on parentData indicating that the current parent is nested beneath an ancestor.
   */
  nestedParent?: ParentRecord<T>;
}

/**
 * The data assigned to a given node in the `nodes` weakmap.
 */
export interface NodeData<T> {
  /**
   * The index of the in respect to its adjacent enabled nodes.
   */
  index: number;
  /**
   * The value of the node.
   */
  value: T;
  /**
   * The private classes of the node (used for preventing erroneous removal of
   * classes).
   */
  privateClasses: Array<string>;
  /**
   * The abort controllers for the node.
   */
  abortControllers: Record<string, AbortController>;
  /**
   * Set by the insertion plugin to define the coordinates for a given node.
   */
  range?: {
    ascending: {
      y: number[];
      x: number[];
      vertical: boolean;
    };
    descending: {
      y: number[];
      x: number[];
      vertical: boolean;
    };
  };
}

/**
 * The data passed to the node event listener.
 */
export interface NodeEventData<T> {
  /**
   * The event that was triggered.
   */
  e: Event;
  /**
   * The data of the target node.
   */
  targetData: NodeTargetData<T>;
}

/**
 * The data passed to the node event listener when the event is a drag event.
 */
export interface NodeDragEventData<T> extends NodeEventData<T> {
  e: DragEvent;
}
/**
 * The data passed to the node event listener when the event is a pointer event (not a native drag event).
 */
export interface NodePointerEventData<T> extends NodeEventData<T> {
  /**
   * The event that was triggered.
   */
  e: PointerEvent;
  /**
   * The data of the target node.
   */
  targetData: NodeTargetData<T>;
}

export interface ParentPointerEventData<T> extends ParentEventData<T> {
  /**
   * The event that was triggered.
   */
  e: PointerEvent;
  /**
   * The data of the target node.
   */
  targetData: ParentTargetData<T>;
}

export interface ParentKeydownEventData<T> extends ParentEventData<T> {
  /**
   * The event that was triggered.
   */
  e: KeyboardEvent;
  /**
   * The data of the target node.
   */
  targetData: ParentTargetData<T>;
}

/**
 * The data passed to the parent event listener.
 *
 * @param e - The event that was triggered.
 * @param targetData - The data of the target parent.
 */
export interface ParentEventData<T> {
  e: Event;
  targetData: ParentTargetData<T>;
}

/**
 * The target data of the parent involved with the event, whether a node or
 * parent event.
 *
 * @param param - The parent record.
 */
export interface ParentTargetData<T> {
  parent: ParentRecord<T>;
}

/**
 * The target data of the node involved with the event.
 *
 * @param node - The node record.
 * @param parent - The parent record.
 */
export interface NodeTargetData<T> {
  node: NodeRecord<T>;
  parent: ParentRecord<T>;
}

/**
 * The node record, contains the el and the data in the `nodes` weakmap.
 */
export interface NodeRecord<T> {
  el: Node;
  data: NodeData<T>;
}

/**
 * The parent record, contains the el and the data in the `parents` weakmap.
 */
export interface ParentRecord<T> {
  el: HTMLElement;
  data: ParentData<T>;
}

/**
 * Potential payload for the `getElementFromPoint` function.
 */
export interface NodeFromPoint<T> {
  /**
   * The node record.
   */
  node: NodeRecord<T>;
  /**
   * The parent record.
   */
  parent: ParentRecord<T>;
}

/**
 * Potential payload for the `getElementFromPoint` function.
 */
export interface ParentFromPoint<T> {
  /**
   * The parent record.
   */
  parent: ParentRecord<T>;
}

/**
 * The event listener for a node event.
 *
 * @param data - The data passed to the event listener.
 */
export type NodeEvent = <T>(data: NodeEventData<T>) => void;

/**
 * The interface for a node in the context of FormKit's Drag and Drop.
 */
export interface Node extends HTMLElement {
  parentNode: HTMLElement;
}

/**
 * The payload of the custom event dispatched when a node is "touched" over a
 * node.
 */
export interface PointeroverNodeEvent<T> extends Event {
  detail: {
    e: PointerEvent;
    targetData: NodeTargetData<T>;
    state: SynthDragState<T>;
  };
}

/**
 * The payload of the custom event dispatched when a node is "touched" over a
 * parent.
 */
export interface PointeroverParentEvent<T> extends Event {
  detail: {
    e: PointerEvent;
    targetData: ParentTargetData<T>;
    state: SynthDragState<T>;
  };
}

/**
 * The WeakMap of nodes.
 */
export type NodesData<T> = WeakMap<Node, NodeData<T>>;

/**
 * The WeakMap of parents.
 */
export type ParentsData<T> = WeakMap<HTMLElement, ParentData<T>>;

/**
 * The WeakMap of parent observers.
 */
export type ParentObservers = WeakMap<HTMLElement, MutationObserver>;

/**
 * The interface for a drag and drop plugin.
 */
export interface DNDPluginData {
  /**
   * The function to call when the parent is set up.
   */
  setup?: () => void;
  /**
   * The function to call when the parent is torn down.
   */
  tearDown?: () => void;
  /**
   * Called when entry point function is invoked on parent.
   */
  setupNode?: SetupNode;
  /**
   * Called when entry point function is invoked on parent.
   */
  tearDownNode?: TearDownNode;
  /**
   * Called anytime the nodes are mutated
   */
  setupNodeRemap?: SetupNode;
  /**
   * Called when the parent is dragged over.
   */
  tearDownNodeRemap?: TearDownNode;
  /**
   * Called when all nodes have finished remapping for a given parent
   */
  remapFinished?: () => void;
}

/**
 * The data passed to the plugin when it is set up.
 */
export interface PluginData {
  parent: HTMLElement;
}

export type DNDPlugin = (parent: HTMLElement) => DNDPluginData | undefined;

export interface DragAndDropData {
  parent: HTMLElement;
  values: Array<any>;
}

export type SetupNode = <T>(data: SetupNodeData<T>) => void;

export type TearDownNode = <T>(data: TearDownNodeData<T>) => void;

export type RemapFinished = <T>(data: RemapFinishedData<T>) => void;

export interface RemapFinishedData<T> {
  parent: ParentRecord<T>;
}

/**
 * The payload of when the setupNode function is called in a given plugin.
 */
export interface SetupNodeData<T> {
  node: NodeRecord<T>;
  parent: ParentRecord<T>;
}

/**
 * The payload of when the tearDownNode function is called in a given plugin.
 */
export interface TearDownNodeData<T> {
  node: {
    el: Node;
    data?: NodeData<T>;
  };
  parent: ParentRecord<T>;
}

export type EventHandlers = Record<string, (e: Event) => void>;

/**
 * The state of the current drag. State is only created when a drag start
 * event is triggered.
 *
 * @param activeNode - The node that was most recently clicked (used optionally).
 * @param affectedNodes - The nodes that will be updated by a drag action
 * (sorted).
 * @param ascendingDirection - Indicates whetehr the dragged node is moving to a
 * node with a higher index or not.
 * @param clonedDraggedEls - The cloned elements of the dragged node. This is
 * used primarily for TouchEvents or multi-drag purposes.
 * @param draggedNode - The node that is being dragged.
 * @param draggedNodes - The nodes that are being dragged.
 * @param incomingDirection - The direction that the dragged node is moving into
 * a dragover node.
 * @param initialParent - The parent that the dragged node was initially in.
 * @param currentParent - The parent that the dragged node was most recently in.
 * @param lastValue - The last value of the dragged node.
 * @param originalZIndex - The original z-index of the dragged node.
 * @param preventEnter - A flag to prevent a sort operation from firing until
 * the mutation observer has had a chance to update the data of the remapped
 * nodes.
 * @param swappedNodeValue - The value of the node that was swapped with the
 * dragged node.
 * @param targetIndex - The index of the node that the dragged node is moving
 * into.
 */

export type SynthDragState<T> = SynthDragStateProps & DragState<T>;

export interface SynthDragStateProps {
  /**
   * Element
   */
  clonedDraggedNode: HTMLElement;
  /**
   * Direction of the synthetic drag scroll
   */
  synthScrollDirection: "up" | "down" | "left" | "right" | undefined;
  /**
   * The display of the synthetic node.
   */
  draggedNodeDisplay: string;
  /**
   * Flag indcating whether a scrollable el is being scrolled via.
   * synthetic drag.
   */
  synthDragScrolling: boolean;
  /**
   * Pointer id of dragged el
   */
  pointerId: number;
}

export type DragState<T> = DragStateProps<T> & BaseDragState<T>;

export type BaseDragState<T> = {
  activeState?: {
    node: NodeRecord<T>;
    parent: ParentRecord<T>;
  };
  /**
   * The nodes that will be updated by a drag action (sorted).
   */
  affectedNodes: Array<NodeRecord<T>>;
  /**
   * The last value the dragged node targeted.
   */
  currentTargetValue: T | undefined;
  emit: (event: string, data: unknown) => void;
  on: (event: string, callback: CallableFunction) => void;
  newActiveDescendant?: NodeRecord<T>;
  /**
   * The original z-index of the dragged node.
   */
  originalZIndex?: string;
  pointerSelection: boolean;
  preventEnter: boolean;
  /**
   * Flag indicating that the remap just finished.
   */
  remapJustFinished: boolean;
  selectedState?: {
    nodes: Array<NodeRecord<T>>;
    parent: ParentRecord<T>;
  };
};

export interface DragStateProps<T> {
  /**
   * The nodes that will be updated by a drag action (sorted).
   */
  affectedNodes: Array<NodeRecord<T>>;
  /**
   * Indicates whether the dragged node is moving to a node with a higher index
   * or not.
   */
  ascendingDirection: boolean;
  /**
   * The cloned elements of the dragged node. This is used primarily for
   * TouchEvents or multi-drag purposes.
   */
  clonedDraggedEls: Array<Element>;
  /**
   * The coordinates of the dragged element itself.
   */
  coordinates: {
    x: number;
    y: number;
  };
  /**
   * The parent that the dragged node was most recently in.
   */
  currentParent: ParentRecord<T>;
  currentTargetValue: T | undefined;
  /**
   * The node that is being dragged.
   */
  draggedNode: NodeRecord<T>;
  /**
   * The nodes that are being dragged.
   */
  draggedNodes: Array<NodeRecord<T>>;
  /**
   * Values to be inserted during sort and transfer operations.
   */
  dynamicValues: Array<T>;
  /**
   * The direction that the dragged node is moving into a dragover node.
   */
  incomingDirection: "above" | "below" | "left" | "right" | undefined;
  /**
   * The index of the node that the dragged node was initially in.
   */
  initialIndex: number;
  /**
   * The parent that the dragged node was initially in.
   */
  initialParent: ParentRecord<T>;
  /**
   * longPress - A flag to indicate whether a long press has occurred.
   */
  longPress: boolean;
  /**
   * Long press timeout
   */
  longPressTimeout: number;
  /**
   * scrollEls
   */
  scrollEls: Array<[HTMLElement, AbortController]>;
  /**
   * The top position of pointerdown.
   */
  startTop: number;
  /**
   * The left position of the pointerdown.
   */
  startLeft: number;
  /**
   * The index of the node that the dragged node is moving into.
   */
  targetIndex: number;
  /**
   * Flag indicating that the dragged node was transferred
   */
  transferred: boolean;
}

export type SortEvent = <T>(data: SortEventData<T>) => void;

export type TransferEvent = <T>(data: TransferEventData<T>) => void;

export type DragstartEvent = <T>(
  data: DragstartEventData<T>,
  state: DragState<T>
) => void;

export type DragendEvent = <T>(data: DragendEventData<T>) => void;

export interface SortEventData<T> {
  parent: ParentRecord<T>;
  previousValues: Array<T>;
  values: Array<T>;
  previousNodes: Array<NodeRecord<T>>;
  nodes: Array<NodeRecord<T>>;
  draggedNode: NodeRecord<T>;
  previousPosition: number;
  position: number;
}

export interface TransferEventData<T> {
  sourceParent: ParentRecord<T>;
  targetParent: ParentRecord<T>;
  initialParent: ParentRecord<T>;
  draggedNodes: Array<NodeRecord<T>>;
  targetIndex: number;
  state: BaseDragState<T> | DragState<T> | SynthDragState<T>;
  targetNode?: NodeRecord<T>;
}

export interface DragstartEventData<T> {
  parent: ParentRecord<T>;
  values: Array<T>;
  draggedNode: NodeRecord<T>;
  draggedNodes: Array<NodeRecord<T>>;
  position: number;
}

export interface DragendEventData<T> {
  parent: ParentRecord<T>;
  values: Array<T>;
  draggedNode: NodeRecord<T>;
  draggedNodes: Array<NodeRecord<T>>;
  position: number;
}

export interface ScrollData {
  xThresh: number;
  yThresh: number;
  scrollParent: HTMLElement;
  scrollOutside?: boolean;
  x: number;
  y: number;
  clientWidth: number;
  clientHeight: number;
  scrollHeight: number;
  scrollWidth: number;
}

export interface Coordinates {
  top: number;
  bottom: number;
  left: number;
  right: number;
  height: number;
  width: number;
}

export type StateEvents =
  | "start"
  | "dragstart"
  | "synthdragstart"
  | "end"
  | "dragend"
  | "synthdragend";
