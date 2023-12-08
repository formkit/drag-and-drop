import type { Ref } from "vue";
import { ref, watch } from "vue";
import initParent from "../index";
import {
  DragstartEvent,
  SortEvent,
  DragleaveEvent,
  End,
  TouchstartEvent,
  TouchmoveEvent,
  TouchendEvent,
  DropEvent,
} from "../types";
import { isBrowser } from "../utils";

type DNDConfigCollection = Array<DNDConfig>;

/**
 * The configuration for the drag and drop functionality.
 *
 * @public
 */
export interface DNDConfig {
  parent: HTMLElement | Ref<HTMLElement | null>;
  values: Ref<Array<any>>;
  disabled?: boolean;
  draggable?: (child: HTMLElement) => boolean;
  name?: string;
  plugins?: Array<any>;
  root?: Document | ShadowRoot;
  sortable?: boolean;
  dragstart?: DragstartEvent;
  sort?: SortEvent;
  dragleave?: DragleaveEvent;
  dragend?: End;
  touchstart?: TouchstartEvent;
  touchmove?: TouchmoveEvent;
  touchend?: TouchendEvent;
  drop?: DropEvent;
  setDragImage?: (
    clonedEl: HTMLElement,
    draggedEl: HTMLElement,
    x: number,
    y: number
  ) => [HTMLElement, number, number];
  longTouch?: boolean;
  draggingClass?: string;
  touchDraggingClass?: string;
  dropZoneClass?: string;
  touchDropZoneClass?: string;
  selectionDraggingClass?: string;
  touchSelectionDraggingClass?: string;
  selectionDropZoneClass?: string;
  touchSelectionDropZoneClass?: string;
  longTouchClass?: string;
  setSelections?: (el: HTMLElement) => any[];
}

/**
 * The configuration for the drag and drop functionality.
 *
 * @internal
 */
interface DNDConfigValid extends DNDConfig {
  parent: HTMLElement;
}

/**
 * Global store for parent values.
 */
const parentValues: WeakMap<HTMLElement, Ref<Array<any>>> = new WeakMap();

/**
 * Returns the values of the parent element.
 *
 * @param parent - The parent element.
 *
 * @returns The values of the parent element.
 */
function getValues(parent: HTMLElement): Array<any> {
  const values = parentValues.get(parent);
  if (!values || !Array.isArray(values.value)) {
    console.warn("No values found for parent element");
    return [];
  }
  return values.value;
}

/**
 * Sets the values of the parent element.
 *
 * @param parent - The parent element.
 * @param newValues - The new values for the parent element.
 *
 * @returns void
 */
function setValues(parent: HTMLElement, newValues: Array<any>): void {
  const currentValues = parentValues.get(parent);
  if (currentValues) currentValues.value = newValues;
  else parentValues.set(parent, ref(newValues));
}

/**
 * Checks if the given element is a HTMLElement and reassigns the parent key
 * if necessary.
 *
 * @param dnd - The drag and drop configuration.
 */
function isEl(dnd: DNDConfig): dnd is DNDConfigValid {
  if (dnd.parent instanceof HTMLElement) {
    return true;
  } else if (dnd.parent.value instanceof HTMLElement) {
    dnd.parent = dnd.parent.value;
    return true;
  } else if ("$el" in dnd.parent && dnd.parent.$el instanceof HTMLElement) {
    dnd.parent = dnd.parent.$el;
    return true;
  } else {
    const stop = watch(dnd.parent, (newParent) => {
      if (!newParent) return;
      if (isEl(dnd)) initDragAndDrop(dnd);
      else console.warn("Invalid parent element", newParent);
      stop();
    });
  }
  return false;
}

/**
 * Function for evaluating the parent element.
 *
 * @param dnd - The drag and drop configuration.
 *
 * @returns void
 */
export function dragAndDrop(data: DNDConfigCollection | DNDConfig): void {
  if (!isBrowser) return;
  if (!Array.isArray(data)) data = [data];
  data.forEach((dnd: DNDConfig) => {
    if (isEl(dnd)) initDragAndDrop(dnd);
  });
}

/**
 * Initializes the drag and drop functionality.
 *
 * @param dnd - The drag and drop configuration.
 *
 * @returns void
 */
function initDragAndDrop(dnd: DNDConfigValid): void {
  parentValues.set(dnd.parent, dnd.values);
  const { ...rest } = dnd;
  initParent(dnd.parent, getValues, setValues, rest);
}
