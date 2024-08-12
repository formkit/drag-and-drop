import type {
  ParentRecord,
  DragState,
  NodeDragEventData,
  NodePointerEventData,
  NodeEventData,
  DNDPlugin,
  PointeroverNodeEvent,
  SetupNode,
  ParentEventData,
  TearDownNode,
  PointeroverParentEvent,
  SortEvent,
  TransferEvent,
  DragstartEvent,
  DragendEvent,
  ParentDragEventData,
} from "@formkit/drag-and-drop";

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
    state: DragState<T>
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
  handleEnd: (data: NodeDragEventData<T> | NodePointerEventData<T>) => void;
  /**
   * Function that is called when dragstart event occurs.
   */
  handleDragstart: (data: NodeDragEventData<T>) => void;
  /**
   * Function that is called when touchstart event occurs.
   */
  handleTouchstart: (data: NodePointerEventData<T>) => void;
  /**
   * Function that is called when a dragover event is triggered on the parent.
   */
  handleDragoverParent: (data: ParentDragEventData<T>) => void;
  /**
   * Function that is called when a dragover event is triggered on a node.
   */
  handleDragoverNode: (data: NodeDragEventData<T>) => void;
  /**
   * Function that is called when either a pointermove or touchmove event is fired
   * where now the "dragged" node is being moved programatically.
   */
  handlePointermove: (data: NodePointerEventData<T>) => void;
  /**
   * Function that is called when a node that is being moved by touchmove event
   * is over a given node (similar to dragover).
   */
  handlePointeroverNode: (data: PointeroverNodeEvent<T>) => void;
  /**
   * Function that is called when a node that is being moved by touchmove event
   * is over the parent (similar to dragover).
   */
  handlePointeroverParent: (e: PointeroverParentEvent<T>) => void;
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
  /**
   * If set to false, the library will not use the native drag and drop API.
   */
  nativeDrag?: boolean;
  /**
   * Function that is called when a sort operation is to be performed.
   */
  performSort: (
    state: DragState<T>,
    data: NodeDragEventData<T> | NodePointerEventData<T>
  ) => void;
  /**
   * Function that is called when a transfer operation is to be performed.
   */
  performTransfer: (
    state: DragState<T>,
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
  synthDraggingClass?: string;
  synthDropZoneClass?: string;
  /**
   * EVENT LISTENERS:
   *
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
