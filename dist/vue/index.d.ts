import { Ref } from 'vue';

interface ParentDragEventData<T> extends ParentEventData<T> {
    e: DragEvent;
}
type NativeDragEffects = "link" | "none" | "copy" | "move";
/**
 * The configuration object for a given parent.
 */
interface ParentConfig<T> {
    /**
     * A function that returns whether a given parent accepts a given node.
     */
    accepts?: (targetParentData: ParentRecord<T>, initialParentData: ParentRecord<T>, currentParentData: ParentRecord<T>, state: BaseDragState<T>) => boolean;
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
    dragImage?: (data: NodeDragEventData<T>, draggedNodes: Array<NodeRecord<T>>) => HTMLElement;
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
    dragstartClasses: (node: NodeRecord<T>, nodes: Array<NodeRecord<T>>, config: ParentConfig<T>, isSynthDrag?: boolean) => void;
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
    handleParentFocus: (data: ParentEventData<T>, state: BaseDragState<T>) => void;
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
    handleNodePointerup: (data: NodePointerEventData<T>, state: DragState<T>) => void;
    handleParentScroll: (data: ParentEventData<T>, state: DragState<T> | BaseDragState<T> | SynthDragState<T>) => void;
    /**
     * Function that is called when a dragenter event is triggered on the node.
     */
    handleNodeDragenter: (data: NodeDragEventData<T>, state: DragState<T>) => void;
    handleNodeBlur: (data: NodeEventData<T>, state: DragState<T>) => void;
    handleNodeFocus: (data: NodeEventData<T>, state: DragState<T>) => void;
    /**
     * Dragleave event on node
     */
    handleNodeDragleave: (data: NodeDragEventData<T>, state: DragState<T>) => void;
    /**
     * Function that is called when a dragover event is triggered on the parent.
     */
    handleParentDragover: (data: ParentDragEventData<T>, state: DragState<T>) => void;
    /**
     * Drop event on parent
     */
    handleParentDrop: (data: ParentDragEventData<T>, state: DragState<T>) => void;
    /**
     * Function that is called when a dragover event is triggered on a node.
     */
    handleNodeDragover: (data: NodeDragEventData<T>, state: DragState<T>) => void;
    handlePointercancel: (data: NodeDragEventData<T> | NodePointerEventData<T>, state: DragState<T> | SynthDragState<T> | BaseDragState<T>) => void;
    handleNodePointerdown: (data: NodePointerEventData<T>, state: DragState<T>) => void;
    /**
     * Function that is called when a node that is being moved by touchmove event
     * is over a given node (similar to dragover).
     */
    handleNodePointerover: (data: PointeroverNodeEvent<T>, state: SynthDragState<T>) => void;
    /**
     * Function that is called when a node that is being moved by touchmove event
     * is over the parent (similar to dragover).
     */
    handleParentPointerover: (e: PointeroverParentEvent<T>, state: SynthDragState<T>) => void;
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
    performSort: ({ parent, draggedNodes, targetNodes, }: {
        parent: ParentRecord<T>;
        draggedNodes: Array<NodeRecord<T>>;
        targetNodes: Array<NodeRecord<T>>;
    }) => void;
    /**
     * Function that is called when a transfer operation is to be performed.
     */
    performTransfer: ({ currentParent, targetParent, initialParent, draggedNodes, initialIndex, state, targetNodes, }: {
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
    synthDragImage?: (node: NodeRecord<T>, parent: ParentRecord<T>, e: PointerEvent, draggedNodes: Array<NodeRecord<T>>) => {
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
    /**
     * The private classes of the node (used for preventing erroneous removal of
     * classes).
     */
    privateClasses: Array<string>;
    /**
     * Set on parentData indicating that the current parent is nested beneath an ancestor.
     */
    nestedParent?: ParentRecord<T>;
    emit: (event: string, data: unknown) => void;
    on: (event: string, callback: (data: unknown) => void) => void;
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
    /**
     * Set by the insertion plugin to define the coordinates for a given node.
     */
    range?: {
        ascending?: {
            y: number[];
            x: number[];
            vertical: boolean;
        };
        descending?: {
            y: number[];
            x: number[];
            vertical: boolean;
        };
    };
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
 * The data passed to the node event listener when the event is a pointer event (not a native drag event).
 */
interface NodePointerEventData<T> extends NodeEventData<T> {
    /**
     * The event that was triggered.
     */
    e: PointerEvent;
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
 * The interface for a node in the context of FormKit's Drag and Drop.
 */
interface Node extends HTMLElement {
    parentNode: HTMLElement;
}
/**
 * The payload of the custom event dispatched when a node is "touched" over a
 * node.
 */
interface PointeroverNodeEvent<T> extends Event {
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
interface PointeroverParentEvent<T> extends Event {
    detail: {
        e: PointerEvent;
        targetData: ParentTargetData<T>;
        state: SynthDragState<T>;
    };
}
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
    /**
     * Called when all nodes have finished remapping for a given parent
     */
    remapFinished?: () => void;
}
type DNDPlugin = (parent: HTMLElement) => DNDPluginData | undefined;
type SetupNode = <T>(data: SetupNodeData<T>) => void;
type TearDownNode = <T>(data: TearDownNodeData<T>) => void;
/**
 * The payload of when the setupNode function is called in a given plugin.
 */
interface SetupNodeData<T> {
    node: NodeRecord<T>;
    parent: ParentRecord<T>;
}
/**
 * The payload of when the tearDownNode function is called in a given plugin.
 */
interface TearDownNodeData<T> {
    node: {
        el: Node;
        data?: NodeData<T>;
    };
    parent: ParentRecord<T>;
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
type SynthDragState<T> = SynthDragStateProps & DragState<T>;
interface SynthDragStateProps {
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
type DragState<T> = DragStateProps<T> & BaseDragState<T>;
type BaseDragState<T> = {
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
    on: (event: string, callback: (data: unknown) => void) => void;
    preventSynthDrag: boolean;
    longPress: boolean;
    longPressTimeout: ReturnType<typeof setTimeout> | undefined;
    pointerDown: {
        parent: ParentRecord<T>;
        node: NodeRecord<T>;
        validated: boolean;
    } | undefined;
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
    scrolling: boolean;
    rootUserSelect: string | undefined;
    lastScrollContainerX: HTMLElement | null;
    lastScrollContainerY: HTMLElement | null;
    rootScrollWidth: number | undefined;
    rootScrollHeight: number | undefined;
    windowScrollX: number | undefined;
    windowScrollY: number | undefined;
    dragItemRect: DOMRect | undefined;
    lastScrollDirectionX: "positive" | "negative" | undefined;
    lastScrollDirectionY: "positive" | "negative" | undefined;
    scrollDebounceTimeout: ReturnType<typeof setTimeout> | undefined;
    frameIdX?: number;
    frameIdY?: number;
};
interface DragStateProps<T> {
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
    longPressTimeout: ReturnType<typeof setTimeout> | undefined;
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
    lastScrollContainerX?: HTMLElement | null;
    lastScrollContainerY?: HTMLElement | null;
    frameIdX?: number;
    frameIdY?: number;
}
type SortEvent = <T>(data: SortEventData<T>) => void;
type TransferEvent = <T>(data: TransferEventData<T>) => void;
type DragstartEvent = <T>(data: DragstartEventData<T>) => void;
type DragendEvent = <T>(data: DragendEventData<T>) => void;
interface SortEventData<T> {
    parent: ParentRecord<T>;
    previousValues: Array<T>;
    values: Array<T>;
    previousNodes: Array<NodeRecord<T>>;
    nodes: Array<NodeRecord<T>>;
    draggedNodes: Array<NodeRecord<T>>;
    targetNodes: Array<NodeRecord<T>>;
    previousPosition: number;
    position: number;
    state: BaseDragState<T> | DragState<T> | SynthDragState<T>;
}
interface TransferEventData<T> {
    sourceParent: ParentRecord<T>;
    targetParent: ParentRecord<T>;
    initialParent: ParentRecord<T>;
    draggedNodes: Array<NodeRecord<T>>;
    targetNodes: Array<NodeRecord<T>>;
    targetIndex: number;
    state: BaseDragState<T> | DragState<T> | SynthDragState<T>;
}
interface DragstartEventData<T> {
    parent: ParentRecord<T>;
    values: Array<T>;
    draggedNode: NodeRecord<T>;
    draggedNodes: Array<NodeRecord<T>>;
    position: number;
    state: BaseDragState<T> | DragState<T> | SynthDragState<T>;
}
interface DragendEventData<T> {
    parent: ParentRecord<T>;
    values: Array<T>;
    draggedNode: NodeRecord<T>;
    draggedNodes: Array<NodeRecord<T>>;
    state: BaseDragState<T> | DragState<T> | SynthDragState<T>;
}
interface ShouldSwapData<T> {
    sourceParent: ParentRecord<T>;
    targetParent: ParentRecord<T>;
    draggedNodes: Array<NodeRecord<T>>;
    targetNodes: Array<NodeRecord<T>>;
    state: BaseDragState<T> | DragState<T> | SynthDragState<T>;
}
interface DropSwapConfig<T> {
    shouldSwap?: (data: ShouldSwapData<T>) => boolean;
    handleNodeDragover?: (data: NodeDragEventData<T>, state: DragState<T>) => void;
    handleParentDragover?: (data: ParentDragEventData<T>, state: DragState<T>) => void;
    handleParentPointerover?: (e: PointeroverParentEvent<T>, state: DragState<T>) => void;
    handleNodePointerover?: (data: PointeroverNodeEvent<T>, state: SynthDragState<T>) => void;
}
interface InsertConfig<T> {
    insertPoint: (parent: ParentRecord<T>) => HTMLElement;
    insertEvent?: (data: InsertEvent<T>) => void;
    handleNodeDragover?: (data: NodeDragEventData<T>, state: DragState<T>) => void;
    handleParentDragover?: (data: ParentDragEventData<T>, state: DragState<T>) => void;
    handleParentPointerover?: (data: PointeroverParentEvent<T>) => void;
    handleNodePointerover?: (data: PointeroverNodeEvent<T>) => void;
    handleEnd?: (state: BaseDragState<T> | DragState<T> | SynthDragState<T>) => void;
    dynamicValues?: (data: DynamicValuesData<T>) => Array<T>;
}
type DynamicValuesData<T> = {
    sourceParent: ParentRecord<T>;
    targetParent: ParentRecord<T>;
    draggedNodes: Array<NodeRecord<T>>;
    targetNodes: Array<NodeRecord<T>>;
    targetIndex?: number;
};
interface InsertEvent<T> {
    sourceParent: ParentRecord<T>;
    targetParent: ParentRecord<T>;
    draggedNodes: Array<NodeRecord<T>>;
    targetNodes: Array<NodeRecord<T>>;
    state: BaseDragState<T> | DragState<T> | SynthDragState<T>;
}

type VueElement = HTMLElement | Ref<HTMLElement | undefined>;
interface VueDragAndDropData<T> extends VueParentConfig<T> {
    parent: HTMLElement | Ref<HTMLElement | undefined>;
    values: Ref<Array<T>> | Array<T>;
}
type VueParentConfig<T> = Partial<ParentConfig<T>>;

/**
 * Entry point for Vue drag and drop.
 *
 * @param data - The drag and drop configuration.
 *
 * @returns void
 */
declare function dragAndDrop<T>(data: VueDragAndDropData<T> | Array<VueDragAndDropData<T>>): void;
/**
 * Creates a new instance of drag and drop and returns the parent element and
 * a ref of the values to use in your template.
 *
 * @param initialValues - The initial values of the parent element.
 *
 * @returns The parent element and values for drag and drop.
 */
declare function useDragAndDrop<T>(initialValues: T[], options?: Partial<VueParentConfig<T>>): [
    Ref<HTMLElement | undefined>,
    Ref<T[]>,
    (config: Partial<VueParentConfig<T>>) => void
];

export { type VueDragAndDropData, type VueElement, type VueParentConfig, dragAndDrop, useDragAndDrop };
