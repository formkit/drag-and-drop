import type { Ref } from "vue";
import type { ParentConfig } from "../types";

export interface VueDragAndDropData<T> extends VueParentConfig<T> {
  parent: HTMLElement | Ref<HTMLElement | undefined>;
  values: Ref<Array<T>>;
}

export type VueParentConfig<T> = Partial<ParentConfig<T>>;
