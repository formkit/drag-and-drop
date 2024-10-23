import type { Accessor } from "solid-js";

/**
 * Checks if the given parent is an HTMLElement.
 *
 * @param dnd - The drag and drop configuration.
 */
export function getEl<E>(
  parent: HTMLElement | Accessor<E | null>
): HTMLElement | void {
  if (parent instanceof HTMLElement) return parent;
  else if (typeof parent === 'function' && parent() instanceof HTMLElement)
    return parent() as HTMLElement;
}

export function handleSolidElements<E>(
  element: HTMLElement | Accessor<E | null>,
  cb: (el: HTMLElement) => void
): void {
  const el = getEl(element);

  if (el) cb(el);
}
