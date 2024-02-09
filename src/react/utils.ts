import type { ReactElement } from "./types";

/**
 * Checks if the given parent is an HTMLElement.
 *
 * @param dnd - The drag and drop configuration.
 */
export function getEl(parent: HTMLElement | ReactElement): HTMLElement | void {
  if (parent instanceof HTMLElement) return parent;
  else if ("current" in parent && parent.current instanceof HTMLElement)
    return parent.current;
}

export function handleReactElements(
  elements: Array<ReactElement> | ReactElement,
  cb: (el: HTMLElement) => void
): void {
  if (!Array.isArray(elements)) elements = [elements];

  for (const element of elements) {
    const el = getEl(element);

    if (el) cb(el);
  }
}
