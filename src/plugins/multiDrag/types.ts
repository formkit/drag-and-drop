export interface MultiDragConfig {
  [key: string]: any;
  draggingClass?: string;
  dropZoneClass?: string;
  selections?: (parent: HTMLElement) => Element[];
  touchDraggingClass?: string;
  touchDropZoneClass?: string;
}
