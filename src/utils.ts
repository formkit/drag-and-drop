import type {
  EventHandlers,
  Node,
  NodeEventData,
  NodeFromPoint,
  ParentData,
  ParentFromPoint,
} from "./types";

import { nodes, parents } from "./index";

export function noDefault(e: Event) {
  e.preventDefault();
}

export function throttle(callback: any, limit: number) {
  var wait = false;
  return function (...args: any[]) {
    if (!wait) {
      callback.call(null, ...args);
      wait = true;
      setTimeout(function () {
        wait = false;
      }, limit);
    }
  };
}

function splitClass(className: string): Array<string> {
  return className.split(" ").filter((x) => x);
}

/**
 * Check to see if code is running in a browser.
 *
 * @internal
 */
export const isBrowser = typeof window !== "undefined";

export function addClass(
  els: Array<Node | HTMLElement | Element>,
  className: string | undefined,
  omitAppendPrivateClass = false
) {
  if (!className) return;

  const classNames = splitClass(className);

  if (!classNames.length) return;

  if (classNames.includes("longPress")) return;

  for (const node of els) {
    if (!isNode(node) || !nodes.has(node)) {
      node.classList.add(...classNames);

      continue;
    }

    const privateClasses = [];

    const nodeData = nodes.get(node);

    if (!nodeData) continue;

    for (const className of classNames) {
      if (!node.classList.contains(className)) {
        node.classList.add(className);
      } else if (
        node.classList.contains(className) &&
        omitAppendPrivateClass === false
      ) {
        privateClasses.push(className);
      }
    }

    nodeData.privateClasses = privateClasses;

    nodes.set(node, nodeData);
  }
}

export function removeClass(
  els: Array<Node | HTMLElement | Element>,
  className: string | undefined
) {
  if (!className) return;

  const classNames = splitClass(className);

  if (!classNames.length) return;

  for (const node of els) {
    if (!isNode(node)) {
      node.classList.remove(...classNames);
      continue;
    }

    const nodeData = nodes.get(node);

    if (!nodeData) continue;
    for (const className of classNames) {
      if (!nodeData.privateClasses.includes(className)) {
        node.classList.remove(className);
      }
    }
  }
}

/**
 * Used for getting the closest scrollable parent of a given element.
 *
 * @param node - The element to get the closest scrollable parent of.
 *
 * @internal
 */
export function getScrollParent(childNode: HTMLElement): HTMLElement {
  let parentNode = childNode.parentNode;

  while (
    parentNode !== null &&
    parentNode.nodeType === 1 &&
    parentNode instanceof HTMLElement
  ) {
    const computedStyle = window.getComputedStyle(parentNode);

    const overflow = computedStyle.getPropertyValue("overflow");

    if (overflow === "scroll" || overflow === "auto") return parentNode;

    parentNode = parentNode.parentNode;
  }

  return document.documentElement;
}
/**
 * Used for setting a single event listener on x number of events for a given
 * element.
 *
 * @param el - The element to set the event listener on.
 *
 * @param events - An array of events to set the event listener on.
 *
 * @param fn - The function to run when the event is triggered.
 *
 * @param remove - Whether or not to remove the event listener.
 *
 * @internal
 */
export function events(
  el: Node | HTMLElement,
  events: Array<string>,
  fn: any,
  remove = false
) {
  events.forEach((event) => {
    remove ? el.removeEventListener(event, fn) : el.addEventListener(event, fn);
  });
}

export function getElFromPoint<T>(
  eventData: NodeEventData<T>
): NodeFromPoint<T> | ParentFromPoint<T> | undefined {
  if (!(eventData.e instanceof PointerEvent)) return;

  const newX = eventData.e.clientX;

  const newY = eventData.e.clientY;

  let target = document.elementFromPoint(newX, newY);

  if (!isNode(target)) return;

  let isParent;

  let invalidEl = true;

  while (target && invalidEl) {
    if (nodes.has(target as Node) || parents.has(target as HTMLElement)) {
      invalidEl = false;

      isParent = parents.has(target as HTMLElement);

      break;
    }

    target = target.parentNode as Node;
  }

  if (!isParent) {
    const targetNodeData = nodes.get(target as Node);

    if (!targetNodeData) return;

    const targetParentData = parents.get(target.parentNode as Node);

    if (!targetParentData) return;

    return {
      node: {
        el: target as Node,
        data: targetNodeData,
      },
      parent: {
        el: target.parentNode as Node,
        data: targetParentData as ParentData<T>,
      },
    };
  } else {
    const parentData = parents.get(target as HTMLElement);

    if (!parentData) return;

    return {
      parent: {
        el: target as HTMLElement,
        data: parentData as ParentData<T>,
      },
    };
  }
}

/**
 * Checks to see that a given element and its parent node are instances of
 * HTML Elements.
 *
 * @param {unknown} el - The element to check.
 *
 * @returns {boolean} - Whether or not provided element is of type Node.
 */
export function isNode(el: unknown): el is Node {
  return el instanceof HTMLElement && el.parentNode instanceof HTMLElement;
}

/**
 * Takes a given el and event handlers, assigns them, and returns the used abort
 * controller.
 *
 * @param el - The element to add the event listeners to.
 * @param events - The events to add to the element.
 * @returns - The abort controller used for the event listeners.
 */
export function addEvents(
  el: Document | ShadowRoot | Node | HTMLElement,
  events: EventHandlers | any
): AbortController {
  const abortController = new AbortController();
  for (const eventName in events) {
    const handler = events[eventName];
    el.addEventListener(eventName, handler, {
      signal: abortController.signal,
      passive: false,
    });
  }
  return abortController;
}

export function copyNodeStyle(
  sourceNode: Node,
  targetNode: Node,
  omitKeys = false
) {
  const computedStyle = window.getComputedStyle(sourceNode);

  const omittedKeys = [
    "position",
    "z-index",
    "top",
    "left",
    "x",
    "pointer-events",
    "y",
    "transform-origin",
    "filter",
    "-webkit-text-fill-color",
  ];

  for (const key of Array.from(computedStyle)) {
    if (omitKeys === false && key && omittedKeys.includes(key)) continue;

    targetNode.style.setProperty(
      key,
      computedStyle.getPropertyValue(key),
      computedStyle.getPropertyPriority(key)
    );
  }

  for (const child of Array.from(sourceNode.children)) {
    if (!isNode(child)) continue;

    const targetChild = targetNode.children[
      Array.from(sourceNode.children).indexOf(child)
    ] as Node;

    copyNodeStyle(child, targetChild, omitKeys);
  }
}

export function eventCoordinates(data: DragEvent | PointerEvent) {
  return { x: data.clientX, y: data.clientY };
}
