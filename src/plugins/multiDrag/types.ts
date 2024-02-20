import {
  DNDPlugin,
  ParentConfig,
  NodeRecord,
  NodeDragEventData,
  NodeTouchEventData,
} from "../../types";
export interface MultiDragConfig<T> {
  [key: string]: any;
  draggingClass?: string;
  dropZoneClass?: string;
  selections?: (parent: HTMLElement) => Array<any>;
  touchDraggingClass?: string;
  touchDropZoneClass?: string;
  handleDragend: NodeDragEventData<T> | NodeTouchEventData<T>;
  handleDragstart: NodeDragEventData<T>;
  handleTouchstart: NodeTouchEventData<T>;
  plugins?: Array<DNDPlugin>;
}

export interface MultiDragParentConfig<T> extends ParentConfig<T> {
  multiDragConfig: MultiDragConfig<T>;
}

export interface MultiDragState<T> {
  selectedNodes: Array<NodeRecord<T>>;
  activeNode: NodeRecord<T> | undefined;
}
