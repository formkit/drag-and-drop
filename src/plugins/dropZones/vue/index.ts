import type { VueDropZones, VueDropZoneConfig } from "./types";

import { handleVueElements } from "../../../vue/utils";

import {
  setupDropZone as setupDropZoneCore,
  tearDownDropZone as tearDownDropZoneCore,
} from "../index";

export function dropZones(data: VueDropZones) {
  return (parent: HTMLElement) => {
    return {
      tearDown() {
        data.forEach((dz: VueDropZoneConfig) => {
          if (dz.el instanceof HTMLElement) {
            tearDownDropZone()(dz.el);

            return;
          }

          handleVueElements(dz.el, tearDownDropZone());
        });
      },
      setup() {
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

function tearDownDropZone() {
  return (dropZone: HTMLElement) => {
    tearDownDropZoneCore(dropZone);
  };
}
