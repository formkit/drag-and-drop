import type { Node, DNDState } from "./types";

/**
 * Checks to see that a given element and its parent node are instances of
 * HTML Elements. Also checks that the given el and its parent node are in
 * our data sets.
 *
 * @param {unknown} el - The element to check.
 * @returns {boolean} - Whether or not the element is a ValidEl.
 */
export function isNode(el: unknown, state: DNDState): el is Node {
  return (
    (el instanceof HTMLElement && el.parentNode instanceof HTMLElement) ||
    state.lastParent instanceof HTMLElement
  );
}
