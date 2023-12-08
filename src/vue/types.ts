import type { Ref } from "vue";
export interface DropZoneConfigVue {
  accepts?: (el: HTMLElement) => boolean;
  dropZones?: Array<{
    element: HTMLElement | Ref<HTMLElement | null>;
    accepts: (draggedParentName: string | undefined) => boolean;
  }>;
}
