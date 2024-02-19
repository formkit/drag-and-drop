import type {
  ParentRecord,
  DragState,
  TouchState,
  AbortController,
} from "../../types";

export type DropZoneEvent = (data: DropZoneEventData) => void;

export interface DropZoneEventData {
  e: Event;
  targetData: DropZoneTargetData;
}

export interface DropZoneTargetData {
  parent: ParentRecord;
  dropZone: DropZoneRecord;
}

export interface DropZoneRecord {
  el: HTMLElement;
  config: DropZoneConfig;
}

export interface DropZoneConfig {
  el: HTMLElement;
  accepts?: (
    targetDropZone: DropZoneRecord,
    targetParentData: ParentRecord,
    initialParentData: ParentRecord,
    lastParentData: ParentRecord,
    state: DragState | TouchState
  ) => boolean;
  disabled?: boolean;
  name?: string;
  handleDragoverDropZone?: (data: DropZoneEventData) => void;
}

export interface DropZoneData {
  parent: HTMLElement;
  config: DropZoneConfig;
  abortControllers: Record<string, AbortController>;
}

export type DropZones = Array<DropZoneConfig>;

export type DropZoneObservers = WeakMap<HTMLElement, MutationObserver>;
