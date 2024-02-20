import type { Ref } from "vue";
import type { VueDragAndDropData, VueParentConfig } from "./types";
import {
  ParentConfig,
  dragAndDrop as initParent,
  isBrowser,
  tearDown,
} from "../index";
import { handleVueElements } from "./utils";
import { onUnmounted, ref } from "vue";

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
function setValues(newValues: Array<any>, parent: HTMLElement): void {
  const currentValues = parentValues.get(parent);

  if (currentValues) currentValues.value = newValues;
}

/**
 * Entry point for Vue drag and drop.
 *
 * @param data - The drag and drop configuration.
 *
 * @returns void
 */
export function dragAndDrop<T>(
  data: VueDragAndDropData<T> | Array<VueDragAndDropData<T>>
): void {
  if (!isBrowser) return;

  if (!Array.isArray(data)) data = [data];

  data.forEach((dnd) => {
    const { parent, values, ...rest } = dnd;

    handleVueElements(parent, handleParent(rest, values));
  });
}

/**
 * Creates a new instance of drag and drop and returns the parent element and
 * a ref of the values to use in your template.
 *
 * @param initialValues - The initial values of the parent element.
 * @returns The parent element and values for drag and drop.
 */
export function useDragAndDrop<T>(
  initialValues: T[],
  options: Partial<ParentConfig<T>> = {}
): [Ref<HTMLElement | undefined>, Ref<T[]>] {
  const parent = ref<HTMLElement | undefined>();
  const values = ref(initialValues) as Ref<T[]>;
  dragAndDrop({ parent, values, ...options });
  onUnmounted(() => parent.value && tearDown(parent.value));
  return [parent, values];
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
function handleParent<T>(
  config: Partial<VueParentConfig<T>>,
  values: Ref<Array<any>>
) {
  return (parent: HTMLElement) => {
    parentValues.set(parent, values);

    initParent({
      parent,
      getValues,
      setValues,
      config: {
        ...config,
        dropZones: [],
      },
    });
  };
}
