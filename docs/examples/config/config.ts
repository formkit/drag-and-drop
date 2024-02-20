const parentConfig: ParentConfig = {
  /**
   * A function that returns whether a given parent accepts a
   * dragged node.
   */
  accepts?: (
    targetParentData: ParentRecord,
    initialParentData: ParentRecord,
    lastParentData: ParentRecord,
    state: DragState | TouchState
  ) => boolean;

  /**
   * A flag to disable dragability of all nodes in the parent.
   */
  disabled?: boolean;

  /**
   * A selector for the drag handle. Will search any depth within the node.
   */
  dragHandle?: string;

  /**
   * A function that returns whether a given node is draggable.
   */
  draggable?: (node: Node, state: DragState | TouchState) => boolean;

  /**
   * The class to add to a node when it is being dragged.
   */
  draggingClass?: string;

  /**
   * A flag to indicate whether the parent itself is a dropZone.
   */
   dropZone?: boolean;


  /**
   * The class to add to a node when the node is dragged over it.
   */
  dropZoneClass?: string;


  /**
   * The group that the parent belongs to. This is used for allowing multiple
   * parents to transfer nodes between each other.
   */
  group?: string;

  /**
   * Function that is called when dragend or touchend event occurs.
   */
  handleEnd: (data: NodeDragEventData | NodeTouchEventData) => void;

  /**
   * Function that is called when dragstart event occurs.
   */
  handleDragstart: (data: NodeDragEventData) => void;

  /**
   * Function that is called when touchstart event occurs.
   */
  handleTouchstart: (data: NodeTouchEventData) => void;

  /**
   * Function that is called when a dragover event is triggered on the parent.
   */
  handleDragoverParent: (data: ParentDragEventData) => void;

  /**
   * Function that is called when a dragover event is triggered on a node.
   */
  handleDragoverNode: (data: NodeDragEventData) => void;

  /**
   * Function that is called when a touchmove event is triggered on a node.
   */
  handleTouchmove: (data: NodeTouchEventData) => void;

  /**
   * Function that is called when a node that is being moved by touchmove event
   * is over a given node (similar to dragover).
   */
  handleTouchmoveNode: (data: TouchOverNodeEvent) => void;

  /**
   * Function that is called when a node that is being moved by touchmove event
   * is over the parent (similar to dragover).
   */
  handleTouchmoveParent: (data: TouchOverParentEvent) => void;

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
  performSort: (state: DragState | TouchState, data: NodeDragEventData | NodeTouchEventData) => void;

  /**
   * Function that is called when a transfer operation is to be performed.
   */
  performTransfer: (state: DragState | TouchState, data: NodeEventData | NodeParentEventData) => void;

  /**
   * An array of functions to use for a given parent.
   */
  plugins: Array<DNDPlugin>

  /**
   * The root element to use for the parent.
   */
  root: Document | ShadowRoot;

  /**
   * Function that is called when a node is set up.
   */
   setupNode: SetupNode

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
   threshold {
    horizontal: number;
    vertical: number;
   }

   /**
    * Class to add to a node when it is being dragged via. touch.
    */
    touchDraggingClass?: string;

    /**
     * The class to add to a node when a node is dragged over it via touch.
     */
    touchDropZoneClass?: string;
}
