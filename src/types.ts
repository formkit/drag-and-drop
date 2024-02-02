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
  handleTouchstart: DNDNodeAction;
  handleDragoverParent: DNDParentAction;
  handleDragoverNode: (data: NodeDragEventData) => void;
  handleTouchmove: (data: NodeTouchEventData) => void;
  longTouchClass?: string;
  name?: string;
  plugins?: Array<DNDPlugin>;
  root: Document | ShadowRoot;
  setupNode: SetupNode;
  sortable?: boolean;
  tearDownNode: TearDownNode;
  threshold: {
    horizontal: number;
    vertical: number;
  };
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

export interface NodeTouchEventData {
  e: TouchEvent;
  targetData: NodeTargetData;
}

export interface NodeFromPoint {
  node: NodeRecord;
  parent: ParentRecord;
}

export interface ParentFromPoint {
  parent: ParentRecord;
}

export type DNDDragAction = (data: NodeEventData) => void;

export type DNDTouchAction = (data: NodeTouchEventData) => void;

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
  touchedNodeDisplay: string | undefined;
  initialParent: ParentRecord;
  lastParent: ParentRecord;
}

export interface DragState extends DragStateProps {
  enterCount: number;
  preventEnter: boolean;
  lastValue: any;
  draggedNode: NodeRecord;
  draggedNodes: Array<NodeRecord>;
  initialParent: ParentRecord;
  lastParent: ParentRecord;
  clonedDraggedEls: Array<Element>;
  swappedNodeValue: any | undefined;
  preventSortValue: any | undefined;
  incomingDirection: "above" | "below" | "left" | "right" | undefined;
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
