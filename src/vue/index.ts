import type { MaybeRef, Ref } from "vue";
import type { VueDragAndDropData, VueParentConfig } from "./types";
import { dragAndDrop as initParent, isBrowser, tearDown } from "../index";
import { isRef, onUnmounted, ref, unref } from "vue";
import { handleVueElements } from "./utils";
export * from "./types";

/**
 * Global store for parent els to values.
 */
const parentValues: WeakMap<HTMLElement, MaybeRef<Array<any>>> = new WeakMap();

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

  return unref(values);
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

  // Only update reactive values. If static, let's not update.
  if (currentValues && isRef(currentValues)) currentValues.value = newValues;
  //else if (currentValues) parentValues.set(parent, newValues);
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
 *
 * @returns The parent element and values for drag and drop.
 */
export function useDragAndDrop<T>(
  initialValues: T[],
  options: Partial<VueParentConfig<T>> = {}
): [
  Ref<HTMLElement | undefined>,
  Ref<T[]>,
  (config: Partial<VueParentConfig<T>>) => void
] {
  const parent = ref<HTMLElement | undefined>();

  const values = ref(initialValues) as Ref<T[]>;

  function updateConfig(config: Partial<VueParentConfig<T>> = {}) {
    dragAndDrop({ parent, values, ...config });
  }

  dragAndDrop({ parent, values, ...options });

  onUnmounted(() => parent.value && tearDown(parent.value));

  return [parent, values, updateConfig];
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
  values: MaybeRef<Array<T>>
) {
  return (parent: HTMLElement) => {
    parentValues.set(parent, values);

    initParent({
      parent,
      getValues,
      setValues,
      config: {
        ...config,
      },
    });
  };
}
