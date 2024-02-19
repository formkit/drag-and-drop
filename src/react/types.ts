import type { ParentConfig } from "../types";
import type { RefObject } from "react";

export type ReactElement<E extends HTMLElement> = E | RefObject<E>;

export interface ReactDragAndDropConfig<
  E extends RefObject<HTMLElement | null> | HTMLElement,
  ListItems extends unknown[]
> extends Partial<ParentConfig> {
  parent: E;
  state: [ListItems, React.Dispatch<React.SetStateAction<ListItems>>];
}
