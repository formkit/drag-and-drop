import {
  DNDPlugin,
  ParentConfig,
  NodeRecord,
  NodeDragEventData,
  NodeTouchEventData,
} from "../../types";
export interface MultiDragConfig<T> {
  [key: string]: any;
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
  handleEnd: (data: NodeDragEventData<T> | NodeTouchEventData<T>) => void;
  /**
   * Function that is called when dragstart occurs.
   */
  handleDragstart: (data: NodeDragEventData<T>) => void;
  /**
   * Function that is called when dragstart event occurs.
   */
  handleTouchstart: (data: NodeTouchEventData<T>) => void;
  /**
   * An array of functions to use for a given parent.
   */
  plugins?: Array<DNDPlugin>;
}

export interface MultiDragParentConfig<T> extends ParentConfig<T> {
  multiDragConfig: MultiDragConfig<T>;
}

export interface MultiDragState<T> {
  selectedNodes: Array<NodeRecord<T>>;
  activeNode: NodeRecord<T> | undefined;
}
