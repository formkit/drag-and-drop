import { DNDAction, DNDPlugin, ParentConfig, NodeRecord } from "../../types";
export interface MultiDragConfig {
  [key: string]: any;
  draggingClass?: string;
  dropZoneClass?: string;
  selections?: (parent: HTMLElement) => Array<any>;
  touchDraggingClass?: string;
  touchDropZoneClass?: string;
  handleDragend: DNDAction;
  handleDragstart: DNDAction;
  handleTouchstart: DNDAction;
  plugins?: Array<DNDPlugin>;
}

export interface MultiDragParentConfig extends ParentConfig {
  multiDragConfig: MultiDragConfig;
}

export interface MultiDragState {
  selectedNodes: Array<NodeRecord>;
  activeNode: NodeRecord | undefined;
}
