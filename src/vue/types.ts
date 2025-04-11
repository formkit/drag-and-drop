import type { Ref } from "vue";
import type { ParentConfig } from "../types";

export type VueElement = HTMLElement | Ref<HTMLElement | null | undefined>;

export interface VueDragAndDropData<T> extends VueParentConfig<T> {
  parent: VueElement;
  values: Ref<Array<T>> | Array<T>;
}

export type VueParentConfig<T> = Partial<ParentConfig<T>>;
