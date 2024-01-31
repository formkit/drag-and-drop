import type { DragState, TouchState } from "../../types";

import type {
  DropZoneConfig,
  DropZoneEventData,
  DropZoneData,
  DropZoneTargetData,
  DropZones,
  DropZoneObservers,
} from "./types";

import { parents, state } from "../../index";

import { addEvents } from "../../utils";

export const dzData = new WeakMap<HTMLElement, DropZoneData>();

export const dropZoneObservers: DropZoneObservers = new WeakMap<
  HTMLElement,
  MutationObserver
>();

export function dropZoneEventData(
  callback: any
): (e: Event) => DropZoneEventData | undefined {
  function dropZoneTargetData(
    dropZone: HTMLElement
  ): DropZoneTargetData | undefined {
    const dropZoneData = dzData.get(dropZone);

    if (!dropZoneData) return;

    const parentData = parents.get(dropZoneData.parent);

    if (!parentData) return;

    return {
      parent: {
        el: dropZoneData.parent,
        data: parentData,
      },

      dropZone: {
        el: dropZone,
        config: dropZoneData.config,
      },
    };
  }

  return (e: Event) => {
    const targetData = dropZoneTargetData(e.currentTarget as HTMLElement);

    if (!targetData) return;

    return callback({
      e,
      targetData,
    });
  };
}

export function dropZones(data: DropZones) {
  return (parent: HTMLElement) => {
    return {
      tearDownParent() {
        data.forEach((dzConfig) => {
          tearDownDropZone(dzConfig.el);
        });
      },

      setupParent() {
        data.forEach((dzConfig) => {
          setupDropZone(dzConfig, parent);
        });
      },
    };
  };
}

export function tearDownDropZone(dropZone: HTMLElement) {
  const dropZoneData = dzData.get(dropZone);

  if (!dropZoneData) return;

  for (const event of Object.keys(
    dropZoneData.abortControllers["mainDropZone"]
  )) {
    dropZoneData.abortControllers["mainDropZone"][event].abort();
  }

  dzData.delete(dropZone);
}

/**
 * Initializes a drop zone based on the parent.
 *
 * @param dropZone - The drop zone element.
 *
 * @param parent - The parent element.
 *
 * @param dzConfig - The config for the drop zone.
 *
 * @returns void
 */
export function setupDropZone(dzConfig: DropZoneConfig, parent: HTMLElement) {
  const dropZoneData: DropZoneData = {
    parent,
    config: {
      handleDragoverDropZone,
      ...dzConfig,
    },
    abortControllers: {},
  };

  const abortControllers = addEvents(dzConfig.el, {
    dragover: dropZoneEventData(dropZoneData.config.handleDragoverDropZone),
  });

  dropZoneData.abortControllers["mainDropZone"] = abortControllers;

  dzData.set(dzConfig.el, dropZoneData);

  if (!(dzConfig.el.parentNode instanceof HTMLElement)) return;

  const dropZoneObserver = new MutationObserver(dropZoneMutated);

  dropZoneObserver.observe(dzConfig.el.parentNode, {
    childList: true,
  });

  dropZoneObservers.set(dzConfig.el, dropZoneObserver);
}

export function validateTransfer(
  data: DropZoneEventData,
  state: DragState | TouchState
) {
  if (data.targetData.parent.el === state.lastParent.el) return false;

  const targetConfig = data.targetData.parent.data.config;

  if (targetConfig.dropZone === false) return false;

  const initialParentConfig = state.initialParent.data.config;

  if (
    targetConfig.accepts &&
    !targetConfig.accepts(
      data.targetData.parent,
      state.initialParent,
      state.lastParent,
      state
    )
  ) {
    return false;
  } else if (
    targetConfig.group &&
    targetConfig.group !== initialParentConfig.group
  ) {
    return false;
  }

  if (
    data.targetData.dropZone.config.accepts &&
    !data.targetData.dropZone.config.accepts(
      data.targetData.dropZone,
      data.targetData.parent,
      state.initialParent,
      state.lastParent,
      state
    )
  )
    return false;

  return true;
}

function handleDragoverDropZone(eventData: DropZoneEventData) {
  if (!state) return;

  transfer(eventData, state);
}

function transfer(data: DropZoneEventData, state: DragState | TouchState) {
  if (!validateTransfer(data, state)) return;

  data.targetData.parent.data.config.performTransfer(state, data);

  state.lastParent = data.targetData.parent;
}

function dropZoneMutated(mutationList: MutationRecord[]) {
  for (const mutation of mutationList) {
    for (const removedNode of Array.from(mutation.removedNodes)) {
      if (!(removedNode instanceof HTMLElement)) continue;

      const dropZoneData = dzData.get(removedNode);

      if (!dropZoneData) continue;

      dzData.delete(removedNode);
    }
  }
}
