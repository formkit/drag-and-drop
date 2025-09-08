import type { Ref, ShallowRef } from "vue";
import type { ParentConfig } from "../types";

export type VueElement = HTMLElement | Ref<HTMLElement | undefined | null>;

export interface VueDragAndDropData<T> extends VueParentConfig<T> {
  parent: HTMLElement | ShallowRef<HTMLElement | null | undefined>;
  values: Ref<Array<T>> | Array<T>;
}

export type VueParentConfig<T> = Partial<ParentConfig<T>>;
