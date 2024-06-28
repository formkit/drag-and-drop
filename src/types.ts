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

/**
 * The configuration object for a given parent.
 */
export interface ParentConfig<T> {
  [key: string]: any;
  /**
   * A function that returns whether a given parent accepts a given node.
   */
  accepts?: (
    targetParentData: ParentRecord<T>,
    initialParentData: ParentRecord<T>,
    lastParentData: ParentRecord<T>,
    state: DragState<T> | TouchState<T>
  ) => boolean;
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
  /**
   * The class to add to a node when it is being dragged.
   */
  draggingClass?: string;
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
  /**
   * Function that is called when dragend or touchend event occurs.
   */
  handleEnd: (data: NodeDragEventData<T> | NodeTouchEventData<T>) => void;
  /**
   * Function that is called when dragstart event occurs.
   */
  handleDragstart: (data: NodeDragEventData<T>) => void;
  /**
   * Function that is called when touchstart event occurs.
   */
  handleTouchstart: (data: NodeTouchEventData<T>) => void;
  /**
   * Function that is called when a dragover event is triggered on the parent.
   */
  handleDragoverParent: (data: ParentDragEventData<T>) => void;
  /**
   * Function that is called when a dragover event is triggered on a node.
   */
  handleDragoverNode: (data: NodeDragEventData<T>) => void;
  /**
   * Function that is called when a touchmove event is triggered on a node.
   */
  handleTouchmove: (data: NodeTouchEventData<T>) => void;
  /**
   * Function that is called when a node that is being moved by touchmove event
   * is over a given node (similar to dragover).
   */
  handleTouchOverNode: (data: TouchOverNodeEvent<T>) => void;
  /**
   * Function that is called when a node that is being moved by touchmove event
   * is over the parent (similar to dragover).
   */
  handleTouchOverParent: (e: TouchOverParentEvent<T>) => void;
  /**
   * A flag to indicate whether long touch is enabled.
   */
  longTouch?: boolean;
  /**
   * The class to add to a node when a long touch action is performed.
   */
  longTouchClass?: string;
  /**
   * The time in milliseconds to wait before a long touch is performed.
   */
  longTouchTimeout?: number;
  /**
   * The name of the parent (used for accepts function for increased specificity).
   */
  name?: string;
  /**
   * Function that is called when a sort operation is to be performed.
   */
  performSort: (
    state: DragState<T> | TouchState<T>,
    data: NodeDragEventData<T> | NodeTouchEventData<T>
  ) => void;
  /**
   * Function that is called when a transfer operation is to be performed.
   */
  performTransfer: (
    state: DragState<T> | TouchState<T>,
    data: NodeEventData<T> | ParentEventData<T>
  ) => void;
  /**
   * An array of functions to use for a given parent.
   */
  plugins?: Array<DNDPlugin>;
  /**
   * The root element to use for the parent.
   */
  root: Document | ShadowRoot;
  /**
   * Function that is called when a node is set up.
   */
  setupNode: SetupNode;
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
   * Function that is called when a node is torn down.
   */
  tearDownNode: TearDownNode;
  /**
   * The threshold for a drag to be considered a valid sort
   * operation.
   */
  threshold: {
    horizontal: number;
    vertical: number;
  };
  /**
   * The class to add to a node when it is being dragged via touch.
   */
  touchDraggingClass?: string;
  touchDropZoneClass?: string;
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

  [key: string]: any;
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

  [key: string]: any;
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
 * The data passed to the node event listener when the event is a touch event.
 */
export interface NodeTouchEventData<T> extends NodeEventData<T> {
  /**
   * The event that was triggered.
   */
  e: TouchEvent;
  /**
   * The data of the target node.
   */
  targetData: NodeTargetData<T>;
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
export interface TouchOverNodeEvent<T> extends Event {
  detail: {
    e: TouchEvent;
    targetData: NodeTargetData<T>;
  };
}

/**
 * The payload of the custom event dispatched when a node is "touched" over a
 * parent.
 */
export interface TouchOverParentEvent<T> extends Event {
  detail: {
    e: TouchEvent;
    targetData: ParentTargetData<T>;
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

export type RemapFinished = <T>(data: ParentData<T>) => void;

/**
 * The payload of when the setupNode function is called in a given plugin.
 */
export interface SetupNodeData<T> {
  /**
   * The node that is being set up.
   */
  node: Node;
  /**
   * The data of the node that is being set up.
   */
  nodeData: NodeData<T>;
  /**
   * The parent of the node that is being set up.
   */
  parent: HTMLElement;
  /**
   * The data of the parent of the node that is being set up.
   */
  parentData: ParentData<T>;
}

/**
 * The payload of when the tearDownNode function is called in a given plugin.
 */
export interface TearDownNodeData<T> {
  /**
   * The node that is being torn down.
   */
  node: Node;
  /**
   * The data of the node that is being torn down.
   */
  nodeData?: NodeData<T>;
  /**
   * The parent of the node that is being torn down.
   */
  parent: HTMLElement;
  /**
   * The data of the parent of the node that is being torn down.
   */
  parentData: ParentData<T>;
}

export type EventHandlers = Record<string, (e: Event) => void>;

/**
 * The state of the current drag. TouchState is only created when a touch start
 * event has occurred.
 */
export interface TouchState<T> extends DragState<T> {
  /**
   * A flag to indicate whether the dragged (touched) node is moving.
   */
  touchMoving: boolean;
  /**
   * The left position of the touch start.
   */
  touchStartLeft: number;
  /**
   * The top position of the touch start.
   */
  touchStartTop: number;
  /**
   * The node that was most recently touched.
   */
  touchedNode: HTMLElement;
  /**
   * The timeout for a long touch.
   */
  longTouchTimeout: ReturnType<typeof setTimeout> | undefined;
  /**
   * A flag to indicate whether a long touch has occurred.
   */
  longTouch: boolean;
  /**
   * The display of the touched node.
   */
  touchedNodeDisplay: string | undefined;
}

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
 * @param lastParent - The parent that the dragged node was most recently in.
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
export interface DragState<T> extends DragStateProps<T> {
  /**
   * The node that was most recently clicked (used optionally).
   */
  activeNode: NodeRecord<T> | undefined;
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
   * The node that is being dragged.
   */
  draggedNode: NodeRecord<T>;
  /**
   * The nodes that are being dragged.
   */
  draggedNodes: Array<NodeRecord<T>>;
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
   * The parent that the dragged node was most recently in.
   */
  lastParent: ParentRecord<T>;
  /**
   * The last value of the dragged node.
   */
  lastValue: any;
  /**
   * The last value the dragged node targeted.
   */
  lastTargetValue: any;
  /**
   * The original z-index of the dragged node.
   */
  originalZIndex: string | undefined;
  /**
   * A flag to prevent a sort operation from firing until the mutation observer
   * has had a chance to update the data of the remapped nodes.
   */
  preventEnter: boolean;
  /**
   * Flag indicating that the remap just finished.
   */
  remapJustFinished: boolean;
  /**
   * The nearest parent that is scrollable.
   */
  scrollParent: HTMLElement;
  /**
   * The index of the node that the dragged node is moving into.
   */
  targetIndex: number;
  /**
   * Flag indicating that the dragged node was transferred
   */
  transferred: boolean;
}

export interface DragStateProps<T> {
  coordinates: {
    x: number;
    y: number;
  };
  draggedNode: NodeRecord<T>;
  draggedNodes: Array<NodeRecord<T>>;
  initialIndex: number;
  initialParent: ParentRecord<T>;
  lastParent: ParentRecord<T>;
  scrollParent: HTMLElement;
}

export interface TouchStateProps {
  coordinates: {
    x: number;
    y: number;
  };
  touchedNode: HTMLElement;
  touchStartLeft: number;
  touchStartTop: number;
  touchMoving: boolean;
  scrollParent: HTMLElement;
}

export interface ScrollData<T> {
  state: DragState<T> | TouchState<T>;
  xThresh: number;
  yThresh: number;
  scrollParent: HTMLElement;
  scrollOutside?: boolean;
  x: number;
  y: number;
  width: number;
  height: number;
}
