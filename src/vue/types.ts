import type { Ref } from "vue";
import type { ParentConfig } from "../types";

export interface VueDragAndDropData<T> extends VueParentConfig {
  parent: HTMLElement | Ref<HTMLElement | undefined>;
  values: Ref<Array<T>>;
}

export type VueParentConfig = Partial<ParentConfig>;
