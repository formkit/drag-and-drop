import type { DropZoneConfig } from "../types";

import type { Ref } from "vue";

export type VueElement = HTMLElement | Ref<HTMLElement | null>;

export type VueDropZones = Array<VueDropZoneConfig>;
export interface VueDropZoneConfig extends Omit<DropZoneConfig, "el"> {
  el: VueElement;
}
