import type {
  ParentConfig,
  NodeDragEventData,
  PointeroverParentEvent,
  ParentDragEventData,
  PointeroverNodeEvent,
  NodePointerEventData,
} from "../../types";

export interface InsertionConfig<T> {
  handleDragstart: (data: NodeDragEventData<T>) => void;
  handleDragoverNode: (data: NodeDragEventData<T>) => void;
  handleDragoverParent: (data: ParentDragEventData<T>) => void;
  handlePointeroverParent: (data: PointeroverParentEvent<T>) => void;
  handlePointeroverNode: (data: PointeroverNodeEvent<T>) => void;
  handleEnd: (data: NodeDragEventData<T> | NodePointerEventData<T>) => void;
}

export interface InsertionParentConfig<T> extends ParentConfig<T> {
  insertionConfig: InsertionConfig<T>;
}
