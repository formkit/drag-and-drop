import { setUpDropZone, tearDownDropZone } from "../plugins/dropZone";
import { isBrowser } from "../utils";
import type { Ref } from "vue";
import { watch } from "vue";
import type { TransferEvent, DropEvent } from "../types";

interface DropZoneConfigVue {
  group?: string;
  accepts?: (
    ctData: {
      name: string | undefined;
      group: string | undefined;
      values: Array<any>;
    },
    deData: {
      name: string | undefined;
      group: string | undefined;
      values: Array<any>;
    },
    draggedValues: Array<any>
  ) => boolean;
  parentDropZone?: boolean;
  nodeDropZone?: boolean;
  transfer?: TransferEvent;
  drop?: DropEvent;
  dropZones?: Array<{
    element: HTMLElement | Ref<HTMLElement | null>;
    accepts?: (draggedParentName: string | undefined) => boolean;
  }>;
  validDropZones?: Array<HTMLElement>;
}

export function dropZone(dzConfig: DropZoneConfigVue = {}) {
  return {
    setUp(parent: HTMLElement, config: any) {
      const enabledDZs = [];
      if (dzConfig.dropZones && isBrowser) {
        const dropZones = dzConfig.dropZones;
        for (const dz of dropZones) {
          const el = getEl(dz.element);
          if (el instanceof HTMLElement) enabledDZs.push(el);
          else {
            const stop = watch(dz.element, (newEl) => {
              if (!newEl) return;
              if (newEl instanceof HTMLElement) {
                stop();
                enabledDZs.push(newEl);
              } else console.warn("Invalid dropzone element", newEl);
            });
          }
        }
        delete dzConfig.dropZones;
      }
      dzConfig.validDropZones = enabledDZs;
      return setUpDropZone(dzConfig, parent, config);
    },
    tearDown(parent: HTMLElement) {
      return tearDownDropZone(parent);
    },
  };
}

function getEl(el: HTMLElement | Ref<HTMLElement | null>) {
  if (el instanceof HTMLElement) {
    return el;
  } else if (el.value instanceof HTMLElement) {
    return el.value;
  } else if ("$el" in el && el.$el instanceof HTMLElement) {
    return el.$el;
  }
  return false;
}
