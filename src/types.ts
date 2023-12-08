export interface Plugin {
  setUp: (parent: HTMLElement, config: DNDConfig) => void;
  tearDown?: (parent: HTMLElement, config: DNDConfig) => void;
}

export interface DNDConfig {
  disabled?: boolean;
  draggable?: (child: HTMLElement) => boolean;
  name?: string;
  root?: Document | ShadowRoot;
  sortable?: boolean;
  plugins?: Array<Plugin>;
  dragstart?: DragstartEvent;
  sort?: SortEvent;
  dragleave?: DragleaveEvent;
  end?: EndEvent;
  transfer?: TransferEvent;
  transferReturn?: TransferReturnEvent;
  touchstart?: TouchstartEvent;
  touchmove?: TouchmoveEvent;
  touchend?: TouchendEvent;
  drop?: DropEvent;
  setDraggable?: ((el: Node) => void) | undefined;
  removeDraggable?: ((el: Node) => void) | undefined;
  draggingClass?: string;
  touchDraggingClass?: string;
  dropZoneClass?: string;
  touchDropZoneClass?: string;
  selectionDraggingClass?: string;
  touchSelectionDraggingClass?: string;
  selectionDropZoneClass?: string;
  touchSelectionDropZoneClass?: string;
  longTouchClass?: string;
  setSelections?: (el: HTMLElement) => any[];
  [key: string]: any;
}

export type Dragstart = (
  e: NodeDragTargetEvent,
  state: DNDState,
  originalDragstart?: Dragstart
) => void;

export type Sort = (
  e: NodeDragTargetEvent | NodeTouchTargetEvent,
  state: DNDState,
  originalSort?: Sort
) => void;

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
export interface DragstartEvent {
  (e: NodeDragTargetEvent, state: DNDState, originalDragstart: Dragstart): void;
}

/**
 * The event for the dragstart event.
 *
 * @public
 */
export interface SortEvent {
  (
    e: NodeDragEvent | NodeTouchEvent,
    state: DNDState,
    originalDragsort: Sort
  ): void;
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

export interface DropZoneConfig {
  group?: string;
  accepts?: (
    ctData: {
      name: string | undefined;
      group: string | undefined;
      values: Array<any>;
    },
    deData: {
      name: string | undefined;
      group: string | undefined;
      values: Array<any>;
    },
    draggedValues: Array<any>
  ) => boolean;
  parentDropZone?: boolean;
  nodeDropZone?: boolean;
  validDropZones?: Array<HTMLElement>;
  transfer?: TransferEvent;
  drop?: DropEvent;
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

/**
 * The event for the transfer return event.
 *
 * @public
 */
export interface TouchmoveEvent {
  (e: NodeTouchEvent, state: DNDState, originalTouchmove: Touchmove): void;
}

/**
 * The event for the transfer return event.
 *
 * @public
 */
export interface TouchendEvent {
  (e: NodeTouchEvent, state: DNDState, originalTouchend: Touchend): void;
}

export interface MultiDragConfig {
  selectedClass?: string;
  selected?: Selected;
  multiDragstart?: MultiDragstart;
  setStyle?: setStyle;
  originClass?: string;
  originLeaveClass?: string;
  transitClass?: string;
}

type setStyle = (
  e: NodeDragEvent,
  state: DNDState,
  draggedNodes: Array<Node>,
  x: number,
  y: number
) => [Node, number, number];

export type MultiDragstart = (
  e: NodeDragTargetEvent,
  state: DNDState,
  originalMultiDragstart?: MultiDragstart
) => void;

/**
 * The event for the dragleave event.
 *
 * @public
 */
export interface MultiDragstartEvent {
  (
    e: NodeDragEvent | NodeTouchEvent,
    state: DNDState,
    originalMultiDragstart: Dragleave
  ): void;
}

export interface NodeTarget {
  targetNode: Node;
  targetNodeData: NodeData;
  targetParent: HTMLElement;
  targetParentData: ParentData;
}

export interface DragTransfer {
  draggedNode: Node;
  draggedNodeData: NodeData;
  draggedParent: HTMLElement;
  draggedParentData: ParentData;
  lastParent: HTMLElement;
  lastParentData: ParentData;
}

export interface NodeDragEvent {
  event: DragEvent;
  draggedNode: Node;
  draggedNodeData: NodeData;
  draggedParent: HTMLElement;
  draggedParentData: ParentData;
  lastParent: HTMLElement;
  lastParentData: ParentData;
}

export type NodeDragTargetEvent = NodeDragEvent & NodeTarget;

export interface TouchTransfer extends DragTransfer {
  touchedNode: HTMLElement;
}

export interface NodeTouchEvent {
  event: TouchEvent;
  draggedNode: Node;
  draggedNodeData: NodeData;
  draggedParent: HTMLElement;
  draggedParentData: ParentData;
  lastParent: HTMLElement;
  lastParentData: ParentData;
  touchedNode: HTMLElement;
}

export type NodeTouchTargetEvent = NodeTouchEvent & NodeTarget;

export interface DropZoneTarget {
  targetParent: HTMLElement;
  targetParentData: ParentData;
}

export interface DropZoneDragEvent {
  event: DragEvent;
  draggedNode: Node;
  draggedNodeData: NodeData;
  draggedParent: HTMLElement;
  draggedParentData: ParentData;
  lastParent: HTMLElement;
  lastParentData: ParentData;
}

export type DropZoneDragTargetEvent = DropZoneDragEvent & DropZoneTarget;

export interface DropZoneTouchEvent {
  event: TouchEvent;
  draggedNode: Node;
  draggedNodeData: NodeData;
  draggedParent: HTMLElement;
  draggedParentData: ParentData;
  lastParent: HTMLElement;
  lastParentData: ParentData;
  touchedNode: HTMLElement;
}

export type DropZoneTouchTargetEvent = DropZoneTouchEvent & DropZoneTarget;

export type DropZoneEvent = DropZoneTarget & DragTransfer;
export interface DropZoneDragEvent extends DropZoneEvent {
  event: DragEvent;
}

export interface DropZoneTouchEvent extends DropZoneEvent {
  event: TouchEvent;
  targetParent: HTMLElement;
  targetParentData: ParentData;
}

export type DNDState = {
  activeNode: Node | undefined;
  clonedDraggedNodes: Array<HTMLElement>;
  direction: number | undefined;
  draggedNode: Node | undefined;
  draggedNodes: CarriedNodes;
  dropped: boolean;
  dropZones: WeakMap<HTMLElement, HTMLElement>;
  enterCount: number;
  nodeData: WeakMap<Node, NodeData>;
  hiddenNodes: WeakMap<HTMLElement, Array<Node>>;
  initialParent: HTMLElement | undefined;
  initialParentValues: Array<any>;
  lastCoordinates: {
    x: number;
    y: number;
  };
  lastValue: any | undefined;
  lastParent: HTMLElement | undefined;
  leftParent: boolean;
  longTouch: boolean;
  longTouchTimeout: ReturnType<typeof setTimeout> | undefined;
  parentData: WeakMap<HTMLElement, ParentData>;
  parentObservers: WeakMap<HTMLElement, MutationObserver>;
  parents: WeakSet<HTMLElement>;
  preventEnter: boolean;
  removeDraggable: ((el: Node) => void) | undefined;
  selectedNodes: Array<Node>;
  selectedValues: Array<any>;
  touchMoving: boolean;
  touchedNode: HTMLElement | undefined;
  touchEnded: boolean;
  touchStartLeft: number | undefined;
  touchStartTop: number | undefined;
};

export interface ParentData {
  getValues: (parent: HTMLElement) => Array<any>;
  setValues: (parent: HTMLElement, values: Array<any>) => void;
  config?: DNDConfig;
  enabledNodes: Array<Node>;
  dzConfig?: DropZoneConfig;
}

type CarriedNodes = Array<Node>;

export interface NodeData {
  index: number;
  value: any;
  privateClasses: Array<string>;
}

export interface Node extends HTMLElement {
  parentNode: HTMLElement;
}

type Selected = (data: SelectedData) => void;

interface SelectedData {
  el: HTMLElement;
  nodeData: NodeData;
  parent: HTMLElement;
  parentData: ParentData;
}
