import type { Accessor } from "solid-js";
import type { ParentConfig } from "../types";
import type { createStore } from "solid-js/store";

export type SolidElement<E extends HTMLElement> = E | Accessor<E>;

export type SolidState<T> = [Accessor<T>, ((items: T) => void) | ReturnType<typeof createStore>[1]]

export interface SolidDragAndDropConfig<
  E extends Accessor<HTMLElement | null> | HTMLElement,
  ListItems extends unknown[]
> extends Partial<ParentConfig<ListItems[number]>> {
  parent: E;
  state: SolidState<ListItems>;
}