import type {
  NodeDragEventData,
  NodePointerEventData,
  DNDPlugin,
} from "@formkit/drag-and-drop";

export interface MultiDragConfig<T> {
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
  synthDraggingClass?: string;
  /**
   * Class added when a node is being (touch) dragged over a dropZone.
   */
  synthDropZoneClass?: string;
  /**
   * Function that is called when dragend event occurrs event occurs.
   */
  multiHandleEnd: (
    data: NodeDragEventData<T> | NodePointerEventData<T>
  ) => void;
  /**
   * Function that is called when dragstart occurs.
   */
  multiHandleDragstart: (data: NodeDragEventData<T>) => void;
  /**
   * Function that is called when dragstart event occurs.
   */
  multiHandlePointerdown: (data: NodePointerEventData<T>) => void;
  multiReapplyDragClasses: (
    data: NodeDragEventData<T> | NodePointerEventData<T>
  ) => void;
  /**
   * An array of functions to use for a given parent.
   */
  plugins?: Array<DNDPlugin>;
}
