import type { RefObject } from "react";
import { useEffect } from "react";

/**
 * Checks if the given parent is an HTMLElement.
 *
 * @param dnd - The drag and drop configuration.
 */
export function getEl<E>(
  parent: HTMLElement | RefObject<E | null>
): HTMLElement | void {
  if (parent instanceof HTMLElement) return parent;
  else if ("current" in parent && parent.current instanceof HTMLElement)
    return parent.current;
  else {
    console.warn("Invalid parent element", parent);

    return;
  }
}

export function handleReactElements<E>(
  element: HTMLElement | RefObject<E | null>,
  cb: (el: HTMLElement) => void
): void {
  const el = getEl(element);

  if (el) cb(el);

  console.log("useEffect", el);
}
