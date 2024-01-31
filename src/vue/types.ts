import type { Ref } from "vue";

import type { ParentConfig } from "../types";

export type VueElement = HTMLElement | Ref<HTMLElement | null>;

export interface VueDragAndDropData extends VueParentConfig {
  parent: VueElement;
  values: Ref<Array<any>>;
}

export type VueParentConfig = Partial<ParentConfig>;
