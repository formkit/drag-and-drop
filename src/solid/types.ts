import type { Accessor } from "solid-js";
import type { ParentConfig } from "../types";
import type { createStore, Store } from "solid-js/store";

export type SolidElement<E extends HTMLElement> = E | Accessor<E>;

export interface SolidDragAndDropConfig<
  E extends Accessor<HTMLElement | null> | HTMLElement,
  ListItems extends unknown[]
> extends Partial<ParentConfig<ListItems[number]>> {
  parent: E;
  state: [Accessor<Store<ListItems>>, ReturnType<typeof createStore<ListItems>>[1]];
}