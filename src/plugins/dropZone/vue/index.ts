import type { VueDropZones, VueDropZoneConfig } from "./types";

import { handleVueElements } from "../../../vue/utils";

import { setupDropZone as setupDropZoneCore } from "../index";

export function dropZones(data: VueDropZones) {
  return (parent: HTMLElement) => {
    return {
      setupParent() {
        data.forEach((dz: VueDropZoneConfig) => {
          if (dz.el instanceof HTMLElement) {
            setupDropZone(parent, dz)(dz.el);

            return;
          }

          handleVueElements(dz.el, setupDropZone(parent, dz));
        });
      },
    };
  };
}

function setupDropZone(parent: HTMLElement, dzConfig: VueDropZoneConfig) {
  return (dropZone: HTMLElement) => {
    setupDropZoneCore(
      {
        ...dzConfig,
        el: dropZone,
      },
      parent
    );
  };
}
