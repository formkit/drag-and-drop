import type { Ref } from "vue";

import type { VueDragAndDropData, VueParentConfig } from "./types";

import { ref } from "vue";

import { initParent } from "../index";

import { isBrowser } from "../utils";

import { handleVueElements } from "./utils";

export * from "./types";

/**
 * Global store for parent els to values.
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

  if (!values) {
    console.warn("No values found for parent element");

    return [];
  }

  return values.value;
}

/**
 * Sets the values of the parent element.
 *
 * @param parent - The parent element.
 *
 * @param newValues - The new values for the parent element.
 *
 * @returns void
 */
function setValues(parent: HTMLElement, newValues: Array<any>): void {
  const currentValues = parentValues.get(parent);

  if (currentValues) {
    currentValues.value = newValues;
  } else {
    parentValues.set(parent, ref(newValues));
  }
}

/**
 * Entry point for Vue drag and drop.
 *
 * @param data - The drag and drop configuration.
 *
 * @returns void
 */
export function dragAndDrop(
  data: VueDragAndDropData | Array<VueDragAndDropData>
): void {
  if (!isBrowser) return;

  if (!Array.isArray(data)) data = [data];

  data.forEach((dnd) => {
    const { parent, values, ...rest } = dnd;

    handleVueElements(parent, handleParent(rest, values));
  });
}

/**
 * Sets the HTMLElement parent to weakmap with provided values and calls
 * initParent.
 *
 * @param config - The config of the parent.
 *
 * @param values - The values of the parent element.
 *
 */
function handleParent(
  config: Partial<VueParentConfig>,
  values: Ref<Array<any>>
) {
  return (parent: HTMLElement) => {
    parentValues.set(parent, values);

    initParent(
      Object.assign(
        {},
        {
          parent,
          getValues,
          setValues,
          config: {
            ...config,
            dropZones: [],
          },
        }
      )
    );
  };
}
