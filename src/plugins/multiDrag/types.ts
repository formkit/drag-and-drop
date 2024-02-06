import { DNDNodeAction } from "../../types";
export interface MultiDragConfig {
  [key: string]: any;
  draggingClass?: string;
  dropZoneClass?: string;
  selections?: (parent: HTMLElement) => Array<any>;
  touchDraggingClass?: string;
  touchDropZoneClass?: string;
  handleDragend: DNDNodeAction;
  handleDragstart: DNDNodeAction;
  handleTouchstart: DNDNodeAction;
}
