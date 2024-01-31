import type { DropZoneEventToHandler, DropZoneEventData } from "./types";

import { dropZones } from "./index";

import { parents } from "../../index";

export function addDropZoneEvents(
  dropZone: HTMLElement,
  events: DropZoneEventToHandler,
  abortControllerKey: string
): void {
  const dropZoneData = dropZones.get(dropZone);

  if (!dropZoneData) return;

  const abortController = new AbortController();

  function handleEvent(e: Event, cb: (eventData: DropZoneEventData) => void) {
    const eventData = dzEventData(e);

    if (eventData) cb(eventData);
  }

  for (const event of events) {
    dropZone.addEventListener(event[0], (e) => handleEvent(e, event[1]), {
      signal: abortController.signal,
    });
  }

  dropZoneData.abortControllers[abortControllerKey] = abortController;
}

export function removeDropZoneEvents(
  el: HTMLElement,
  abortControllerKey: string
): void {
  const dropZoneData = dropZones.get(el);

  if (!dropZoneData) return;

  dropZoneData.abortControllers[abortControllerKey]?.abort();
}

/**
 * Event listener used for all parents and dropzones.
 */
export function dropZoneEventData(e: Event): DropZoneEventData | undefined {
  if (!(e.currentTarget instanceof HTMLElement)) return;

  const parentData = parents.get(e.currentTarget);

  if (parentData) {
    return {
      e,
      targetData: {
        parent: {
          el: e.currentTarget,
          data: parentData,
        },
      },
    };
  }

  const dzData = dropZones.get(e.currentTarget);

  if (dzData) {
    const parentData = dzData.parent && parents.get(dzData.parent);

    if (!parentData) return;

    return {
      e,

      targetData: {
        parent: {
          el: dzData.parent,
          data: parentData,
        },

        dropZone: {
          el: e.currentTarget,
          config: dzData.config,
        },
      },
    };
  }
}
