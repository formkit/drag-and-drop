import { NodeAction, DNDPlugin, ParentConfig, NodeRecord } from "../../types";
export interface MultiDragConfig {
  [key: string]: any;
  draggingClass?: string;
  dropZoneClass?: string;
  selections?: (parent: HTMLElement) => Array<any>;
  touchDraggingClass?: string;
  touchDropZoneClass?: string;
  handleDragend: NodeAction;
  handleDragstart: NodeAction;
  handleTouchstart: NodeAction;
  plugins?: Array<DNDPlugin>;
}

export interface MultiDragParentConfig extends ParentConfig {
  multiDragConfig: MultiDragConfig;
}

export interface MultiDragState {
  selectedNodes: Array<NodeRecord>;
  activeNode: NodeRecord | undefined;
}
