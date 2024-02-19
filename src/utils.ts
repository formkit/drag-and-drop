import type {
  Node,
  NodeEventData,
  NodeFromPoint,
  ParentFromPoint,
  EventHandlers,
  AbortControllers,
} from "./types";

import { parents, nodes } from "./index";

export function splitClass(className: string): Array<string> {
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

  if (classNames.includes("longTouch")) return;

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
export function getScrollParent(
  node: HTMLElement | null
): HTMLElement | undefined {
  if (node == null) return undefined;

  if (node.scrollHeight > node.clientHeight) {
    return node;
  } else if (node.parentNode instanceof HTMLElement) {
    return getScrollParent(node.parentNode);
  }

  return undefined;
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

export function getElFromPoint(
  eventData: NodeEventData
): NodeFromPoint | ParentFromPoint | undefined {
  if (!(eventData.e instanceof TouchEvent)) return;

  const newX = eventData.e.touches[0].clientX;

  const newY = eventData.e.touches[0].clientY;

  const els = document.elementsFromPoint(newX, newY);

  if (!nodes) return;

  for (const node of els) {
    if (isNode(node) && nodes.has(node)) {
      const targetNode = node;

      const targetNodeData = nodes.get(targetNode);

      const targetParentData = parents.get(targetNode.parentNode);

      if (!targetNodeData || !targetParentData) return;

      return {
        node: {
          el: targetNode,
          data: targetNodeData,
        },
        parent: {
          el: targetNode.parentNode,
          data: targetParentData,
        },
      };
    } else if (node instanceof HTMLElement) {
      const parentData = parents.get(node);

      if (parentData) {
        return {
          parent: {
            el: node,
            data: parentData,
          },
        };
      }
    }
  }

  return undefined;
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
 *
 * @param events - The events to add to the element.
 *
 * @returns - The abort controller used for the event listeners.
 */
export function addEvents(
  el: Document | ShadowRoot | Node | HTMLElement,
  events: EventHandlers
): AbortControllers {
  const keysToControllers: AbortControllers = {};
  for (const key in events) {
    const abortController = new AbortController();
    const event = events[key];

    el.addEventListener(key, event, {
      signal: abortController.signal,
      passive: false,
    });

    keysToControllers[key] = abortController;
  }

  return keysToControllers;
}

export function copyNodeStyle(
  sourceNode: Node,
  targetNode: Node,
  omitKeys = false
) {
  const computedStyle = window.getComputedStyle(sourceNode);

  const omittedKeys = [
    "position",
    "top",
    "left",
    "x",
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

export function eventCoordinates(data: DragEvent | TouchEvent) {
  return data instanceof DragEvent
    ? { x: data.clientX, y: data.clientY }
    : { x: data.touches[0].clientX, y: data.touches[0].clientY };
}
