import {
  DNDPlugin,
  ParentConfig,
  NodeRecord,
  NodeDragEventData,
  NodeTouchEventData,
} from "../../types";
export interface MultiDragConfig {
  [key: string]: any;
  draggingClass?: string;
  dropZoneClass?: string;
  selections?: (parent: HTMLElement) => Array<any>;
  touchDraggingClass?: string;
  touchDropZoneClass?: string;
  handleDragend: NodeDragEventData | NodeTouchEventData;
  handleDragstart: NodeDragEventData;
  handleTouchstart: NodeTouchEventData;
  plugins?: Array<DNDPlugin>;
}

export interface MultiDragParentConfig<T> extends ParentConfig<T> {
  multiDragConfig: MultiDragConfig;
}

export interface MultiDragState {
  selectedNodes: Array<NodeRecord>;
  activeNode: NodeRecord | undefined;
}
