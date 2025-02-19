import { createEffect, on, type Accessor } from "solid-js";

/**
 * Checks if the given parent is an HTMLElement.
 *
 * @param dnd - The drag and drop configuration.
 */
export function getEl<E>(
  parent: HTMLElement | Accessor<E | null>
): HTMLElement | void {
  if (parent instanceof HTMLElement) return parent;
  else if (typeof parent !== 'function') return undefined;
  const p = parent();
  return p instanceof HTMLElement ? p : undefined;
}

export function handleSolidElements<E>(
  element: HTMLElement | Accessor<E | null>,
  cb: (el: HTMLElement) => void
): void {
  createEffect(on(() => getEl(element), (el) => el && cb(el)));
}
