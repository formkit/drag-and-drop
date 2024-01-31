import type { DropZoneConfig } from "../types";

import type { VueDropZones, VueDropZoneConfig } from "./types";

import { handleVueElements } from "../../../vue/utils";

import {
  setupDropZone as setupDropZoneCore,
  dropZones as dropZonePlugin,
  dzData,
} from "../index";

export function dropZones(data: VueDropZones) {
  return (parent: HTMLElement) => {
    return {
      tearDownParent() {},
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
    //const dzPlugin = dropZonePlugin()(parent);
    //const dzPlugin = dropZonePlugin(dzConfig)(parent);
    //if (!dzPlugin) return;
    //return {
    //  tearDownParent() {
    //    dzPlugin.tearDownParent();
    //  },
    //  setupParent() {
    //    dzConfig.dropZones?.forEach((dz: VueDropZone | VueElement) => {
    //      console.log("drop zone");
    //      if ("dropZone" in dz) {
    //        handleVueElements(
    //          dz.dropZone,
    //          handleDropZone(parent, dz.config || {})
    //        );
    //      } else if (!("dropZone" in dz)) {
    //        handleVueElements(dz, handleDropZone(parent, {}));
    //      }
    //    });
    //    dzPlugin.setupParent();
    //  },
    //};
  };
}

//function setupDropzone(parent: HTMLElement, dzConfig: Partial<DropZoneConfig>) {
//return (dropZone: HTMLElement) => {
//  const dropZoneData = dzData.get(dropZone);

//  if (!dropZoneData) return;

//  setupDropZone(dropZone, dropZoneData);
//};
//}

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
