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
  BaseDragState,
  NativeDragEffects,
  NodeRecord,
  DropSwapConfig,
  InsertConfig,
  ParentData,
  ParentKeydownEventData,
  SynthDragState,
} from "@formkit/drag-and-drop";

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
   * A selector for the drag handle. Will search at any depth within the
   * draggable element.
   */
  dragHandle?: string;
  /**
   * External drag handle
   */
  externalDragHandle?: {
    el: HTMLElement;
    callback: () => HTMLElement;
  };
  /**
   * A function that returns whether a given node is draggable.
   */
  draggable?: (child: HTMLElement) => boolean;
  /**
   * A function that returns whether a given value is draggable
   */
  draggableValue?: (values: T) => boolean;
  draggedNodes: (pointerDown: {
    parent: ParentRecord<T>;
    node: NodeRecord<T>;
  }) => Array<NodeRecord<T>>;
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
    config: ParentConfig<T>,
    isSynthDrag?: boolean
  ) => void;
  // When drag starts, this will be applied to the dragged node(s) (not their
  // representations being dragged) on dragstart. This will remain on the nodes
  // until the drag ends.
  dragPlaceholderClass?: string;
  /**
   * The configuration object for the drop and swap plugin.
   */
  dropSwapConfig?: DropSwapConfig<T>;
  /**
   * The class to add to a node when the node is dragged over it.
   */
  dropZoneClass?: string;
  /**
   * The class to add to a parent when it is dragged over.
   */
  dropZoneParentClass?: string;
  /**
   * A flag to indicate whether the parent itself is a dropZone.
   */
  dropZone?: boolean;
  /**
   * The group that the parent belongs to. This is used for allowing multiple
   * parents to transfer nodes between each other.
   */
  group?: string;
  handleParentFocus: (
    data: ParentEventData<T>,
    state: BaseDragState<T>
  ) => void;
  handleNodeKeydown: (data: NodeEventData<T>, state: DragState<T>) => void;

  /**
   * Function that is called when dragend or touchend event occurs.
   */
  handleDragend: (data: NodeDragEventData<T>, state: DragState<T>) => void;
  /**
   * Function that is called when dragstart event occurs.
   */
  handleDragstart: (data: NodeDragEventData<T>, state: DragState<T>) => void;
  handleEnd: (state: DragState<T> | SynthDragState<T>) => void;
  handleNodeDrop: (data: NodeDragEventData<T>, state: DragState<T>) => void;
  handleNodePointerup: (
    data: NodePointerEventData<T>,
    state: DragState<T>
  ) => void;
  handleParentScroll: (
    data: ParentEventData<T>,
    state: DragState<T> | BaseDragState<T> | SynthDragState<T>
  ) => void;
  /**
   * Function that is called when a dragenter event is triggered on the node.
   */
  handleNodeDragenter: (
    data: NodeDragEventData<T>,
    state: DragState<T>
  ) => void;
  handleNodeBlur: (data: NodeEventData<T>, state: DragState<T>) => void;
  handleNodeFocus: (data: NodeEventData<T>, state: DragState<T>) => void;
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
  handlePointercancel: (
    data: NodeDragEventData<T> | NodePointerEventData<T>,
    state: DragState<T> | SynthDragState<T> | BaseDragState<T>
  ) => void;
  /*
   * Function that is called when a pointerdown is triggered on node.
   */
  handleNodePointerdown: (
    data: NodePointerEventData<T>,
    state: DragState<T>
  ) => void;
  /**
   * Function that is called when a node that is being moved by touchmove event
   * is over a given node (similar to dragover).
   */
  handleNodePointerover: (
    data: PointeroverNodeEvent<T>,
    state: SynthDragState<T>
  ) => void;
  /**
   * Function that is called when a node that is being moved by touchmove event
   * is over the parent (similar to dragover).
   */
  handleParentPointerover: (
    e: PointeroverParentEvent<T>,
    state: SynthDragState<T>
  ) => void;
  /**
   * Config option for insert plugin.
   */
  insertConfig?: InsertConfig<T>;
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
  longPressDuration?: number;
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
    targetNodes,
  }: {
    parent: ParentRecord<T>;
    draggedNodes: Array<NodeRecord<T>>;
    targetNodes: Array<NodeRecord<T>>;
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
    targetNodes,
  }: {
    currentParent: ParentRecord<T>;
    targetParent: ParentRecord<T>;
    initialParent: ParentRecord<T>;
    draggedNodes: Array<NodeRecord<T>>;
    initialIndex: number;
    state: BaseDragState<T> | DragState<T> | SynthDragState<T>;
    targetNodes: Array<NodeRecord<T>>;
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
  /**
   * The class to add to a node when it is selected (clicked or pressed).
   */
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
   * Flag for whether or not to allow sorting within a given parent.
   */
  sortable?: boolean;
  /**
   * The class to add to a parent when it is dragged over.
   */
  synthDropZoneParentClass?: string;
  /**
   * A function that returns the image to use for the drag operation. This is
   * invoked for synth drag operations operations. The clonedNode is what will
   * be set as the drag image, but this can be updated.
   */
  synthDragImage?: (
    node: NodeRecord<T>,
    parent: ParentRecord<T>,
    e: PointerEvent,
    draggedNodes: Array<NodeRecord<T>>
  ) => {
    dragImage: HTMLElement;
    offsetX?: number;
    offsetY?: number;
  };
  /**
   * Function that is called when a node is torn down.
   */
  tearDownNode: TearDownNode;
  /**
   * Called when the value of the parent is changed and the nodes are remapped.
   */
  tearDownNodeRemap: TearDownNode;
  /**
   * Property to identify which group of tree descendants the current parent belongs to.
   */
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
  /**
   * On synth drag start, this is applied to the dragged node(s) (not their
   * representations being dragged).
   */
  synthDragPlaceholderClass?: string;
  /**
   * When hovering over a node, this class is applied to the node.
   */
  synthDropZoneClass?: string;

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
