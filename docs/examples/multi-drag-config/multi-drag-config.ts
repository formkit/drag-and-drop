import type {
  NodeDragEventData,
  NodeTouchEventData,
  DNDPlugin,
} from "@formkit/drag-and-drop";

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
  handleDragend: NodeDragEventData<T> | NodeTouchEventData<T>;
  /**
   * Function that is called when dragstart occurs.
   */
  handleDragstart: NodeDragEventData<T>;
  /**
   * Function that is called when dragstart event occurs.
   */
  handleTouchstart: NodeTouchEventData<T>;
  /**
   * An array of functions to use for a given parent.
   */
  plugins?: Array<DNDPlugin>;
}
