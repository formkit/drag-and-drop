/**
 * Primary entry point for the Drag and Drop.
 *
 */
export interface InitParent {
  parent: HTMLElement;
  getValues: (parent: HTMLElement) => Array<any>;
  setValues: (parent: HTMLElement, values: Array<any>) => void;
  config?: Partial<ParentConfig>;
}

export type DNDAction = (
  data: ParentEventData | NodeEventData,
  dragState: DragState
) => void;

export type DNDNodeAction = (data: NodeEventData, dragState: DragState) => void;

export type DNDParentAction = (
  data: ParentEventData,
  dragState: DragState
) => void;

export interface ParentConfig {
  [key: string]: any;
  accepts?: (
    targetParentData: ParentRecord,
    initialParentData: ParentRecord,
    lastParentData: ParentRecord,
    state: DragState | TouchState
  ) => boolean;
  disabled?: boolean;
  dragHandles?: boolean;
  draggable?: (child: HTMLElement) => boolean;
  draggingClass?: string;
  dropZoneClass?: string;
  group?: string;
  dropZone?: boolean;
  handleDragend: DNDNodeAction;
  handleDragstart: DNDNodeAction;
  longTouchClass?: string;
  name?: string;
  plugins?: Array<DNDPlugin>;
  root: Document | ShadowRoot;
  setupNode: SetupNode;
  sortable?: boolean;
  tearDownNode: TearDownNode;
  touchDraggingClass?: string;
  touchDropZoneClass?: string;
}

export interface ParentData {
  getValues: (parent: HTMLElement) => Array<any>;
  setValues: (parent: HTMLElement, values: Array<any>) => void;
  config: ParentConfig;
  enabledNodes: Array<Node>;
  abortControllers: Record<string, AbortControllers>;
}

export interface EventListeners {
  [key: string]: Array<EventListener>;
}

//export interface NodeTargetData extends DropZoneTargetData {
//  node: NodeRecord;
//}

export interface NodeEventData {
  e: Event;
  targetData: NodeTargetData;
}

export interface NodeDragEventData extends NodeEventData {
  e: DragEvent;
}

export interface NodeTouchEventData {
  e: TouchEvent;
  targetData: NodeTargetData;
}

export interface ParentEventData {
  e: Event;
  targetData: ParentTargetData;
}

export interface ParentTargetData {
  parent: ParentRecord;
}

//export interface NodeEventData {
//  e: Event;
//  targetData: NodeTargetData;
//}

//export interface ParentEventData {
//  e: Event;
//  targetData: ParentTargetData;
//}

export interface DropZone {
  dropZone: HTMLElement;
  config: DropZoneConfig;
}

export interface NodeRecord {
  el: Node;
  data: NodeData;
}

export interface ParentRecord {
  el: HTMLElement;
  data: ParentData;
}

export type DropZoneElement = HTMLElement;

export interface NodeDragEventData {
  e: DragEvent;
  targetData: NodeTargetData;
}

export interface DropZoneDragEventData {
  e: DragEvent;
  targetData: DropZoneTargetData;
}

export interface NodeTouchEventData {
  e: TouchEvent;
  targetData: NodeTargetData;
}

export interface NodeTouchMoveEventData {
  e: TouchEvent;
  targetData: NodeTouchMoveTargetData;
}

export interface NodeFromPoint {
  node: NodeRecord;
  parent: ParentRecord;
}

export interface ParentFromPoint {
  parent: ParentRecord;
  dropZone?: DropZoneRecord;
}

export interface DNDTouchNodeState extends DNDNodeState {
  touchedNode: HTMLElement;
}

// ACTION EVENTS:

export type DNDDragAction = (data: NodeEventData) => void;

export type DNDTouchAction = (data: NodeTouchEventData) => void;

export interface actions {
  touchend?: TouchendEvent;
  touchmove?: TouchAction;
  touchstart?: TouchAction;
}

export type SetDraggableEvent = (el: Node, state: DNDState) => void;

export type RemoveDraggableEvent = (
  el: Node,
  state: DNDState,
  originalRemoveDraggable?: RemoveDraggableEvent
) => void;

export type Dragstart = (event: NodeDragEventData) => void;

export type End = (
  e: NodeDragTargetEvent | NodeTouchTargetEvent | NodeTouchEvent,
  state: DNDState,
  originalEnd?: End
) => void;

export type Dragleave = (
  e: DropZoneDragEvent,
  state: DNDState,
  originalDragleave?: Dragleave
) => void;

export type Transfer = (
  e:
    | DropZoneDragTargetEvent
    | NodeDragTargetEvent
    | DropZoneTouchTargetEvent
    | NodeTouchTargetEvent,
  state: DNDState,
  originalTransfer?: Transfer
) => void;

export type Drop = (
  e: DropZoneDragEvent,
  state: DNDState,
  originalDrop?: Drop
) => void;

export type TransferReturn = (
  e:
    | NodeDragTargetEvent
    | DropZoneDragEvent
    | NodeTouchTargetEvent
    | DropZoneTouchEvent,
  state: DNDState,
  originalTransferReturn?: TransferReturn
) => void;

export type Touchstart = (
  e: NodeTouchEvent,
  state: DNDState,
  originalTouchstart?: Touchstart
) => void;

export type Touchmove = (
  e: NodeTouchEvent,
  state: DNDState,
  originalTouchmove?: Touchmove
) => void;

export type Touchend = (
  e: NodeTouchEvent,
  state: DNDState,
  originalTouchend?: Touchend
) => void;

/**
 * The event for the dragstart event.
 *
 * @public
 */
export interface SortEvent {
  (e: NodeDragEvent | NodeTouchEvent, state: DNDState): void;
}

/**
 * The event for the dragleave event.
 *
 * @public
 */
export interface DragleaveEvent {
  (e: DropZoneDragEvent, state: DNDState, originalDragleave: Dragleave): void;
}

/**
 * The event for the dragleave event.
 *
 * @public
 */
export interface EndEvent {
  (
    e: NodeDragTargetEvent | NodeTouchTargetEvent | NodeTouchEvent,
    state: DNDState,
    originalEnd: End
  ): void;
}

/**
 * The event for the dragleave event.
 *
 * @public
 */
export interface DropEvent {
  (e: DropZoneDragEvent, state: DNDState, originDrop: Drop): void;
}

/**
 * The event for the dragstart event.
 *
 * @public
 */
export interface TransferEvent {
  (
    e: DropZoneDragEvent | NodeDragEvent | DropZoneTouchEvent | NodeTouchEvent,
    state: DNDState,
    originalTransfer: Transfer
  ): void;
}

/**
 * The event for the dragstart event.
 *
 * @public
 */
export interface DropEvent {
  (e: DropZoneDragEvent, state: DNDState, originalTransfer: Transfer): void;
}

/**
 * The event for the transfer return event.
 *
 * @public
 */
export interface TransferReturnEvent {
  (
    e: NodeDragEvent | DropZoneDragEvent,
    state: DNDState,
    originalTransferReturn: TransferReturn
  ): void;
}

/**
 * The event for the transfer return event.
 *
 * @public
 */
export interface TouchstartEvent {
  (e: NodeTouchEvent, state: DNDState, originalTouchstart: Touchstart): void;
}

export interface NodeData {
  index: number;
  value: any;
  privateClasses: Array<string>;
  abortControllers: Record<string, AbortControllers>;
}

export type NodeEvent = (data: NodeEventData) => void;

export interface Node extends HTMLElement {
  parentNode: HTMLElement;
}

export interface TouchOverNodeEvent extends Event {
  detail: {
    e: TouchEvent;
    targetData: NodeTargetData;
  };
}

export interface TouchOverParentEvent extends Event {
  detail: {
    e: TouchEvent;
    targetData: ParentTargetData;
  };
}

//export type NodeEventToHandler = Array<[string, (e: Event) => void]>;

export interface DNDData {
  nodes: WeakMap<Node, NodeData>;
  parents: WeakMap<HTMLElement, ParentData>;
  parentObservers: WeakMap<HTMLElement, MutationObserver>;
  [key: string]: any;
}

export type NodesData = WeakMap<Node, NodeData>;

export type ParentsData = WeakMap<HTMLElement, ParentData>;

export type ParentObservers = WeakMap<HTMLElement, MutationObserver>;

export interface NodeTargetData {
  node: NodeRecord;
  parent: ParentRecord;
}

export interface DNDPluginData {
  setupParent: () => void;
  tearDownParent: () => void;
  setupNode?: SetupNode;
  tearDownNode?: TearDownNode;
}

export interface PluginData {
  parent: HTMLElement;
}

export type DNDPlugin = (parent: HTMLElement) => DNDPluginData | undefined;

export interface DragAndDropData {
  parent: HTMLElement;
  values: Array<any>;
}

export type SetupNode = (data: SetupNodeData) => void;

export type TearDownNode = (data: TearDownNodeData) => void;

export interface SetupNodeData {
  node: Node;
  nodeData: NodeData;
  parent: HTMLElement;
  parentData: ParentData;
}

export interface TearDownNodeData {
  node: Node;
  nodeData?: NodeData;
  parent: HTMLElement;
  parentData: ParentData;
}

export type EventHandlers = Record<string, (e: Event) => void>;

export interface TouchState extends DragState {
  touchMoving: boolean;
  touchStartLeft: number;
  touchStartTop: number;
  touchedNode: HTMLElement;
  longTouchTimeout: ReturnType<typeof setTimeout> | undefined;
  scrollParent: HTMLElement | undefined;
  scrollParentOverflow: string | undefined;
  longTouch: boolean;
  draggedNode: NodeRecord;
  draggedNodes: Array<NodeRecord>;
  initialParent: ParentRecord;
  lastParent: ParentRecord;
}

export interface DragState extends DragStateProps {
  direction: number | undefined;
  enterCount: number;
  lastCoordinates: {
    x: number;
    y: number;
  };
  lastValue: any;
  draggedNode: NodeRecord;
  draggedNodes: Array<NodeRecord>;
  initialParent: ParentRecord;
  lastParent: ParentRecord;
  clonedDraggedEls: Array<Element>;
}

export interface DragStateProps {
  draggedNode: NodeRecord;
  draggedNodes: Array<NodeRecord>;
  initialParent: ParentRecord;
  lastParent: ParentRecord;
}

export interface TouchStateProps {
  touchedNode: HTMLElement;
  touchStartLeft: number;
  touchStartTop: number;
}

export interface AbortControllers {
  [key: string]: AbortController;
}
