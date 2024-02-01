import type { Ref } from "vue";

import type { VueElement } from "./types";

import { watch } from "vue";

/**
 * Checks if the given parent is an HTMLElement.
 *
 * @param dnd - The drag and drop configuration.
 */
export function getEl(
  parent: HTMLElement | Ref<HTMLElement | null>
): HTMLElement | void {
  if (parent instanceof HTMLElement) return parent;
  else if (parent.value instanceof HTMLElement) return parent.value;
  else if ("$el" in parent && parent.$el instanceof HTMLElement)
    return parent.$el;
}

export function handleVueElements(
  elements: Array<VueElement> | VueElement,
  cb: (el: HTMLElement) => void
): void {
  if (!Array.isArray(elements)) elements = [elements];

  for (const element of elements) {
    const validEl = getEl(element);

    if (validEl) cb(validEl);

    const stop = watch(element, (newEl) => {
      if (!newEl) return;

      const validEl = getEl(newEl);

      !validEl ? console.warn("Invalid parent element", newEl) : cb(validEl);

      stop();
    });
  }
}
