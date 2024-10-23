import type { Accessor, Signal } from "solid-js";
import type { ParentConfig } from "../types";

export type SolidElement<E extends HTMLElement> = E | Accessor<E>;

export interface SolidDragAndDropConfig<
  E extends Accessor<HTMLElement | null> | HTMLElement,
  ListItems extends unknown[]
> extends Partial<ParentConfig<ListItems[number]>> {
  parent: E;
  state: Signal<ListItems>;
}