/**
 * Function to prevent default behavior of an event.
 *
 * @param {Event} e - The event to prevent default behavior of.
 */
export function pd(e: Event) {
  e.preventDefault();
}

/**
 * Function to stop propagation of an event.
 *
 * @param {Event} e - The event to stop propagation of.
 */
export function sp(e: Event) {
  e.stopPropagation();
}

/**
 * Function to get the bounding client rect of an element.
 *
 * @param {HTMLElement} el - The element to get the bounding client rect of.
 *
 * @returns {ClientRect} The bounding client rect of the element.
 */
export function rect(el: HTMLElement): ClientRect {
  return el.getBoundingClientRect();
}

/**
 * Function to create an emitter.
 *
 * @returns {[Function, Function]} A tuple containing emit and on functions
 */
export function createEmitter<T>() {
  const callbacks = new Map<string, Array<(data: T) => void>>();

  const emit = function (eventName: string, data: T) {
    if (!callbacks.get(eventName)) return;
    callbacks.get(eventName)!.forEach((cb) => {
      cb(data);
    });
  };

  const on = function (eventName: string, callback: (data: T) => void) {
    const cbs = callbacks.get(eventName) ?? [];

    cbs.push(callback);

    callbacks.set(eventName, cbs);
  };

  return [emit, on] as const;
}

/**
 * The emit and on functions for drag and drop.
 *
 * @type {[Function, Function]}
 */
export const [emit, on] = createEmitter();

/**
 * A regular expression to test for a valid date string.
 *
 * @param x - A RegExp to compare.
 * @param y - A RegExp to compare.
 * @public
 */
export function eqRegExp(x: RegExp, y: RegExp): boolean {
  return (
    x.source === y.source &&
    x.flags.split("").sort().join("") === y.flags.split("").sort().join("")
  );
}

/**
 * Compare two values for equality, optionally at depth.
 *
 * @param valA - First value.
 * @param valB - Second value.
 * @param deep - If it will compare deeply if it's an object.
 * @param explicit - An array of keys to explicity check.
 *
 * @returns `boolean`
 *
 * @public
 */
export function eq(
  valA: unknown,
  valB: unknown,
  deep = true,
  explicit: string[] = ["__key"]
): boolean {
  if (valA === valB) return true;

  if (
    typeof valB === "object" &&
    typeof valA === "object" &&
    valA !== null &&
    valB !== null
  ) {
    if (valA instanceof Map) return false;
    if (valA instanceof Set) return false;
    if (valA instanceof Date && valB instanceof Date)
      return valA.getTime() === valB.getTime();
    if (valA instanceof RegExp && valB instanceof RegExp)
      return eqRegExp(valA, valB);
    if (valA === null || valB === null) return false;

    const objA = valA as Record<string, unknown>;
    const objB = valB as Record<string, unknown>;

    if (Object.keys(objA).length !== Object.keys(objB).length) return false;

    for (const k of explicit) {
      if ((k in objA || k in objB) && objA[k] !== objB[k]) return false;
    }

    for (const key in objA) {
      if (!(key in objB)) return false;
      if (objA[key] !== objB[key] && !deep) return false;
      if (deep && !eq(objA[key], objB[key], deep, explicit)) return false;
    }
    return true;
  }
  return false;
}

/**
 * Split a class name into an array of class names.
 *
 * @param className - The class name to split.
 *
 * @returns An array of class names.
 */
export function splitClass(className: string): Array<string> {
  return className.split(" ").filter((x) => x);
}

export function getRealCoords(el: HTMLElement): {
  top: number;
  bottom: number;
  left: number;
  right: number;
  height: number;
  width: number;
} {
  const { top, bottom, left, right, height, width } =
    el.getBoundingClientRect();

  const scrollLeft = window.scrollX || document.documentElement.scrollLeft;
  const scrollTop = window.scrollY || document.documentElement.scrollTop;

  return {
    top: top + scrollTop,
    bottom: bottom + scrollTop,
    left: left + scrollLeft,
    right: right + scrollLeft,
    height,
    width,
  };
}

export function eventCoordinates(data: DragEvent | PointerEvent) {
  return { x: data.clientX, y: data.clientY };
}
