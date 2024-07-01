/**
 * The central entry point of the library.
 */
interface DragAndDrop<T> {
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
interface ParentDragEventData<T> extends ParentEventData<T> {
    e: DragEvent;
}
/**
 * The configuration object for a given parent.
 */
interface ParentConfig<T> {
    [key: string]: any;
    /**
     * A function that returns whether a given parent accepts a given node.
     */
    accepts?: (targetParentData: ParentRecord<T>, initialParentData: ParentRecord<T>, lastParentData: ParentRecord<T>, state: DragState<T> | TouchState<T>) => boolean;
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
    performSort: (state: DragState<T> | TouchState<T>, data: NodeDragEventData<T> | NodeTouchEventData<T>) => void;
    /**
     * Function that is called when a transfer operation is to be performed.
     */
    performTransfer: (state: DragState<T> | TouchState<T>, data: NodeEventData<T> | ParentEventData<T>) => void;
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
interface ParentData<T> {
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
}
/**
 * The data assigned to a given node in the `nodes` weakmap.
 */
interface NodeData<T> {
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
}
/**
 * The data passed to the node event listener.
 */
interface NodeEventData<T> {
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
interface NodeDragEventData<T> extends NodeEventData<T> {
    e: DragEvent;
}
/**
 * The data passed to the node event listener when the event is a touch event.
 */
interface NodeTouchEventData<T> extends NodeEventData<T> {
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
interface ParentEventData<T> {
    e: Event;
    targetData: ParentTargetData<T>;
}
/**
 * The target data of the parent involved with the event, whether a node or
 * parent event.
 *
 * @param param - The parent record.
 */
interface ParentTargetData<T> {
    parent: ParentRecord<T>;
}
/**
 * The target data of the node involved with the event.
 *
 * @param node - The node record.
 * @param parent - The parent record.
 */
interface NodeTargetData<T> {
    node: NodeRecord<T>;
    parent: ParentRecord<T>;
}
/**
 * The node record, contains the el and the data in the `nodes` weakmap.
 */
interface NodeRecord<T> {
    el: Node;
    data: NodeData<T>;
}
/**
 * The parent record, contains the el and the data in the `parents` weakmap.
 */
interface ParentRecord<T> {
    el: HTMLElement;
    data: ParentData<T>;
}
/**
 * Potential payload for the `getElementFromPoint` function.
 */
interface NodeFromPoint<T> {
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
interface ParentFromPoint<T> {
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
type NodeEvent = <T>(data: NodeEventData<T>) => void;
/**
 * The interface for a node in the context of FormKit's Drag and Drop.
 */
interface Node extends HTMLElement {
    parentNode: HTMLElement;
}
/**
 * The payload of the custom event dispatched when a node is "touched" over a
 * node.
 */
interface TouchOverNodeEvent<T> extends Event {
    detail: {
        e: TouchEvent;
        targetData: NodeTargetData<T>;
    };
}
/**
 * The payload of the custom event dispatched when a node is "touched" over a
 * parent.
 */
interface TouchOverParentEvent<T> extends Event {
    detail: {
        e: TouchEvent;
        targetData: ParentTargetData<T>;
    };
}
/**
 * The WeakMap of nodes.
 */
type NodesData<T> = WeakMap<Node, NodeData<T>>;
/**
 * The WeakMap of parents.
 */
type ParentsData<T> = WeakMap<HTMLElement, ParentData<T>>;
/**
 * The WeakMap of parent observers.
 */
type ParentObservers = WeakMap<HTMLElement, MutationObserver>;
/**
 * The interface for a drag and drop plugin.
 */
interface DNDPluginData {
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
}
/**
 * The data passed to the plugin when it is set up.
 */
interface PluginData {
    parent: HTMLElement;
}
type DNDPlugin = (parent: HTMLElement) => DNDPluginData | undefined;
interface DragAndDropData {
    parent: HTMLElement;
    values: Array<any>;
}
type SetupNode = <T>(data: SetupNodeData<T>) => void;
type TearDownNode = <T>(data: TearDownNodeData<T>) => void;
/**
 * The payload of when the setupNode function is called in a given plugin.
 */
interface SetupNodeData<T> {
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
interface TearDownNodeData<T> {
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
type EventHandlers = Record<string, (e: Event) => void>;
/**
 * The state of the current drag. TouchState is only created when a touch start
 * event has occurred.
 */
interface TouchState<T> extends DragState<T> {
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
interface DragState<T> extends DragStateProps<T> {
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
interface DragStateProps<T> {
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
interface TouchStateProps {
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
interface ScrollData<T> {
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

declare function throttle(callback: any, limit: number): (...args: any[]) => void;
/**
 * Check to see if code is running in a browser.
 *
 * @internal
 */
declare const isBrowser: boolean;
declare function addClass(els: Array<Node | HTMLElement | Element>, className: string | undefined, omitAppendPrivateClass?: boolean): void;
declare function removeClass(els: Array<Node | HTMLElement | Element>, className: string | undefined): void;
/**
 * Used for getting the closest scrollable parent of a given element.
 *
 * @param node - The element to get the closest scrollable parent of.
 *
 * @internal
 */
declare function getScrollParent(childNode: HTMLElement): HTMLElement;
/**
 * Used for setting a single event listener on x number of events for a given
 * element.
 *
 * @param el - The element to set the event listener on.
 *
 * @param events - An array of events to set the event listener on.
 *
 * @param fn - The function to run when the event is triggered.
 *
 * @param remove - Whether or not to remove the event listener.
 *
 * @internal
 */
declare function events(el: Node | HTMLElement, events: Array<string>, fn: any, remove?: boolean): void;
declare function getElFromPoint<T>(eventData: NodeEventData<T>): NodeFromPoint<T> | ParentFromPoint<T> | undefined;
/**
 * Checks to see that a given element and its parent node are instances of
 * HTML Elements.
 *
 * @param {unknown} el - The element to check.
 *
 * @returns {boolean} - Whether or not provided element is of type Node.
 */
declare function isNode(el: unknown): el is Node;
/**
 * Takes a given el and event handlers, assigns them, and returns the used abort
 * controller.
 *
 * @param el - The element to add the event listeners to.
 * @param events - The events to add to the element.
 * @returns - The abort controller used for the event listeners.
 */
declare function addEvents(el: Document | ShadowRoot | Node | HTMLElement, events: EventHandlers | any): AbortController;
declare function copyNodeStyle(sourceNode: Node, targetNode: Node, omitKeys?: boolean): void;
declare function eventCoordinates(data: DragEvent | TouchEvent): {
    x: number;
    y: number;
};

interface MultiDragConfig<T> {
    /**
     * Class added when a node is being dragged.
     */
    draggingClass?: string;
    /**
     * Class added when a node is being dragged over a dropZone.
     */
    dropZoneClass?: string;
    /**
     * Function to set which values of a given parent are "selected". This is
     * called on dragstart or touchstart.
     */
    selections?: (parentValues: Array<T>, parent: HTMLElement) => Array<T>;
    /**
     * Class added when a node is being (touch) dragged.
     */
    touchDraggingClass?: string;
    /**
     * Class added when a node is being (touch) dragged over a dropZone.
     */
    touchDropZoneClass?: string;
    /**
     * Function that is called when dragend event occurrs event occurs.
     */
    multiHandleEnd: (data: NodeDragEventData<T> | NodeTouchEventData<T>) => void;
    /**
     * Function that is called when dragstart occurs.
     */
    multiHandleDragstart: (data: NodeDragEventData<T>) => void;
    /**
     * Function that is called when dragstart event occurs.
     */
    multiHandleTouchstart: (data: NodeTouchEventData<T>) => void;
    multiReapplyDragClasses: (data: NodeDragEventData<T> | NodeTouchEventData<T>) => void;
    /**
     * An array of functions to use for a given parent.
     */
    plugins?: Array<DNDPlugin>;
}
interface MultiDragState<T> {
    selectedNodes: Array<NodeRecord<T>>;
    activeNode: NodeRecord<T> | undefined;
    isTouch: boolean;
}

declare const multiDragState: MultiDragState<any>;
declare function multiDrag<T>(multiDragConfig?: Partial<MultiDragConfig<T>>): (parent: HTMLElement) => {
    setup(): void;
    tearDownNodeRemap<T>(data: TearDownNodeData<T>): void;
    tearDownNode<T_1>(data: TearDownNodeData<T_1>): void;
    setupNodeRemap<T_2>(data: SetupNodeData<T_2>): void;
    setupNode<T_3>(data: SetupNodeData<T_3>): void;
} | undefined;
declare function multiReapplyDragClasses<T>(node: Node, parentData: ParentData<T>): void;
declare function multiHandleEnd<T>(data: NodeEventData<T>): void;
declare function selectionsEnd<T>(data: NodeEventData<T>, state: DragState<T> | TouchState<T>): void;
declare function multiHandleDragstart<T>(data: NodeEventData<T>): void;
declare function multiDragstart<T>(data: NodeDragEventData<T>): void;
declare function multiHandleTouchstart<T>(data: NodeEventData<T>): void;
declare function multiTouchstart<T>(data: NodeTouchEventData<T>): void;
declare function handleSelections<T>(data: NodeEventData<T>, selectedValues: Array<T>, state: DragState<T> | TouchState<T>, x: number, y: number): {
    data: NodeEventData<T>;
    state: DragState<T> | TouchState<T>;
    x: number;
    y: number;
};
declare function stackNodes<T>({ data, state, x, y, }: {
    data: NodeEventData<T>;
    state: DragState<T> | TouchState<T>;
    x: number;
    y: number;
}): void;

interface AnimationsConfig {
    duration?: number;
    remapFinished?: () => void;
    yScale?: number;
    xScale?: number;
}

declare function animations(animationsConfig?: Partial<AnimationsConfig>): (parent: HTMLElement) => {
    setup(): void;
    setupNodeRemap<T>(data: SetupNodeData<T>): void;
} | undefined;

interface SelectionsConfig<T> {
    handleClick?: (data: NodeEventData<T>) => void;
    handleKeydown?: (data: NodeEventData<T>) => void;
    selectedClass?: string;
    clickawayDeselect?: boolean;
}

declare function selections<T>(selectionsConfig?: SelectionsConfig<T>): (parent: HTMLElement) => {
    setup(): void;
    tearDown(): void;
    tearDownNode<T>(data: TearDownNodeData<T>): void;
    setupNode<T_1>(data: SetupNodeData<T_1>): void;
} | undefined;

interface SwapConfig<T> extends ParentConfig<T> {
}
declare function swap<T>(swapConfig?: Partial<SwapConfig<T>>): (parent: HTMLElement) => {
    setup(): void;
} | undefined;

interface PlaceConfig<T> extends ParentConfig<T> {
}
declare function place<T>(placeConfig?: Partial<PlaceConfig<T>>): (parent: HTMLElement) => {
    setup(): void;
} | undefined;

declare const nodes: NodesData<any>;
declare const parents: ParentsData<any>;
/**
 * The state of the drag and drop. Is undefined until either dragstart or
 * touchstart is called.
 */
declare let state: DragState<any> | TouchState<any> | undefined;
declare function resetState(): void;
/**
 * @param {DragStateProps} dragStateProps - Attributes to update state with.
 *
 * @mutation - Updates state with node values.
 *
 * @returns void
 */
declare function setDragState<T>(dragStateProps: DragStateProps<T>): DragState<T>;
declare function setTouchState<T>(dragState: DragState<T>, touchStateProps: TouchStateProps): TouchState<T>;
declare function dragStateProps<T>(data: NodeDragEventData<T> | NodeTouchEventData<T>): DragStateProps<T>;
declare function performSort<T>(state: DragState<T> | TouchState<T>, data: NodeDragEventData<T> | NodeTouchEventData<T>): void;
declare function parentValues<T>(parent: HTMLElement, parentData: ParentData<T>): Array<T>;
declare function setParentValues<T>(parent: HTMLElement, parentData: ParentData<T>, values: Array<any>): void;
declare function dragValues<T>(state: DragState<T> | TouchState<T>): Array<T>;
/**
 * Utility function to update parent config.
 */
declare function updateConfig<T>(parent: HTMLElement, config: Partial<ParentConfig<T>>): void;
/**
 * Initializes the drag and drop functionality for a given parent.
 *
 * @param {DragAndDrop} dragAndDrop - The drag and drop configuration.
 * @param {HTMLElement} dragAndDrop.parent - The parent element.
 *
 * @returns void
 */
declare function dragAndDrop<T>({ parent, getValues, setValues, config, }: DragAndDrop<T>): void;
declare function tearDown(parent: HTMLElement): void;
/**
 * Remaps the data of the parent element's children.
 *
 * @param parent - The parent element.
 *
 * @returns void
 *
 * @internal
 */
declare function remapNodes<T>(parent: HTMLElement, force?: boolean): void;
declare function remapFinished(): void;
declare function handleDragstart<T>(data: NodeEventData<T>): void;
declare function dragstartClasses(el: HTMLElement | Node | Element, draggingClass: string | undefined, dropZoneClass: string | undefined): void;
declare function initDrag<T>(eventData: NodeDragEventData<T>): DragState<T>;
declare function dragstart<T>(data: NodeDragEventData<T>): void;
declare function handleTouchOverNode<T>(e: TouchOverNodeEvent<T>): void;
declare function setupNode<T>(data: SetupNodeData<T>): void;
declare function setupNodeRemap<T>(data: SetupNodeData<T>): void;
declare function tearDownNodeRemap<T>(data: TearDownNodeData<T>): void;
declare function tearDownNode<T>(data: TearDownNodeData<T>): void;
declare function handleEnd<T>(eventData: NodeEventData<T>): void;
declare function end<T>(_eventData: NodeEventData<T>, state: DragState<T> | TouchState<T>): void;
declare function handleTouchstart<T>(eventData: NodeEventData<T>): void;
declare function initTouch<T>(data: NodeTouchEventData<T>): TouchState<T>;
declare function handleTouchedNode<T>(data: NodeTouchEventData<T>, touchState: TouchState<T>): void;
declare function handleLongTouch<T>(data: NodeEventData<T>, touchState: TouchState<T>): void;
declare function handleTouchmove<T>(eventData: NodeTouchEventData<T>): void;
declare function handleDragoverNode<T>(data: NodeDragEventData<T>): void;
declare function handleDragoverParent<T>(data: ParentEventData<T>): void;
declare function handleTouchOverParent<T>(e: TouchOverParentEvent<T>): void;
declare function validateTransfer<T>(data: ParentEventData<T>, state: DragState<T> | TouchState<T>): boolean;
declare function validateSort<T>(data: NodeDragEventData<T> | NodeTouchEventData<T>, state: DragState<T> | TouchState<T>, x: number, y: number): boolean;
declare function sort<T>(data: NodeDragEventData<T> | NodeTouchEventData<T>, state: DragState<T> | TouchState<T>): void;
/**
 * Event listener used for all nodes.
 *
 * @param e - The event.
 *
 */
declare function nodeEventData<T>(callback: any): (e: Event) => NodeEventData<T> | undefined;
declare function performTransfer<T>(state: DragState<T> | TouchState<T>, data: NodeEventData<T> | ParentEventData<T>): void;
/**
 * Used when the dragged element enters into a parent other than its own.
 *
 * @param eventData
 *
 * @param state
 *
 * @internal
 *
 * @returns void
 */
declare function transfer<T>(data: NodeEventData<T> | ParentEventData<T>, state: DragState<T> | TouchState<T>): void;
declare function parentEventData<T>(callback: any): (e: Event) => NodeEventData<T> | undefined;

export { type DNDPlugin, type DNDPluginData, type DragAndDrop, type DragAndDropData, type DragState, type DragStateProps, type EventHandlers, type Node, type NodeData, type NodeDragEventData, type NodeEvent, type NodeEventData, type NodeFromPoint, type NodeRecord, type NodeTargetData, type NodeTouchEventData, type NodesData, type ParentConfig, type ParentData, type ParentDragEventData, type ParentEventData, type ParentFromPoint, type ParentObservers, type ParentRecord, type ParentTargetData, type ParentsData, type PluginData, type ScrollData, type SetupNode, type SetupNodeData, type TearDownNode, type TearDownNodeData, type TouchOverNodeEvent, type TouchOverParentEvent, type TouchState, type TouchStateProps, addClass, addEvents, animations, copyNodeStyle, dragAndDrop, dragStateProps, dragValues, dragstart, dragstartClasses, end, eventCoordinates, events, getElFromPoint, getScrollParent, handleDragoverNode, handleDragoverParent, handleDragstart, handleEnd, handleLongTouch, handleSelections, handleTouchOverNode, handleTouchOverParent, handleTouchedNode, handleTouchmove, handleTouchstart, initDrag, initTouch, isBrowser, isNode, multiDrag, multiDragState, multiDragstart, multiHandleDragstart, multiHandleEnd, multiHandleTouchstart, multiReapplyDragClasses, multiTouchstart, nodeEventData, nodes, parentEventData, parentValues, parents, performSort, performTransfer, place, remapFinished, remapNodes, removeClass, resetState, selections, selectionsEnd, setDragState, setParentValues, setTouchState, setupNode, setupNodeRemap, sort, stackNodes, state, swap, tearDown, tearDownNode, tearDownNodeRemap, throttle, transfer, updateConfig, validateSort, validateTransfer };
