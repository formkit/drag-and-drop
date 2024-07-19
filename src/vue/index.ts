import type { Ref } from "vue";
import type { VueDragAndDropData, VueParentConfig } from "./types";
import {
  ParentConfig,
  dragAndDrop as initParent,
  isBrowser,
  tearDown,
  parents,
  insertion,
} from "../index";
import {
  onUnmounted,
  ref,
  provide,
  defineComponent,
  h,
  PropType,
  onMounted,
  inject,
} from "vue";
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
  values: Ref<Array<any>>
) {
  return (parent: HTMLElement) => {
    parentValues.set(parent, values);

    let setter = config.nestedConfig?.nestedSetValues
      ? config.nestedConfig.nestedSetValues
      : setValues;

    initParent({
      parent,
      getValues,
      setValues: setter,
      config: {
        ...config,
        dropZones: [],
      },
    });
  };
}

/**
 * Responsible for providing the parent element itself.
 */
export const NestedGroup = /* #__PURE__ */ defineComponent(
  (props, { slots }) => {
    const parentRef = ref();

    provide("nestedGroup", parentRef);

    return () =>
      slots.default
        ? h(
            props.tag,
            {
              ref: parentRef,
            },
            slots
          )
        : null;
  },
  {
    props: {
      tag: {
        type: String as PropType<string>,
        default: "div",
      },
    },
  }
);

// export function useNestedDragAndDrop(
//   group: HTMLElement,
//   parent: HTMLElement,
//   values: Array<any>
// ) {
//   dragAndDrop({
//     parent: group,
//     values: ref(values),
//   });
// }

function nestedSetValues(newValues: Array<any>, parent: HTMLElement) {
  const previousValues = parentValues.get(parent);

  const parentData = parents.get(parent);

  if (!parentData) {
    console.warn("No parent data found");

    return;
  }

  const ancestorValues = parentValues.get(parentData.config.nestedConfig.group);

  // const flattenedValues = parentData.values.flat();

  console.log("ancestor values", ancestorValues);

  if (!ancestorValues) {
    console.warn("No ancestor values found");

    return;
  }

  const coordinates: Array<Array<number>> = [];

  console.log("previous values", previousValues.value);

  setValueAtCoordinatesUsingFindIndex(
    ancestorValues.value,
    previousValues.value,
    newValues,
    parent
  );

  previousValues.value = newValues;
  console.log("previousValues", previousValues);

  parentValues.set(parent, previousValues);

  console.log("new values", newValues);
}

function findArrayCoordinates(
  obj: any,
  targetArray: Array<any>,
  path: Array<any> = []
) {
  let result: Array<any> = [];

  if (obj === targetArray) result.push(path);

  if (Array.isArray(obj)) {
    const index = obj.findIndex((el) => el === targetArray);
    if (index !== -1) {
      result.push([...path, index]);
    } else {
      for (let i = 0; i < obj.length; i++) {
        result = result.concat(
          findArrayCoordinates(obj[i], targetArray, [...path, i])
        );
      }
    }
  } else if (typeof obj === "object" && obj !== null) {
    for (const key in obj) {
      result = result.concat(
        findArrayCoordinates(obj[key], targetArray, [...path, key])
      );
    }
  }

  return result;
}

function setValueAtCoordinatesUsingFindIndex(
  obj,
  targetArray,
  newArray,
  parent
) {
  const coordinates = findArrayCoordinates(obj, targetArray);
  console.log("coordinates", coordinates);

  coordinates.forEach((coords) => {
    let current = obj;
    for (let i = 0; i < coords.length - 1; i++) {
      const index = coords[i];
      current = current[index];
      console.log("current", current);
    }
    const lastIndex = coords[coords.length - 1];
    current[lastIndex] = newArray;
    targetArray = newArray;

    console.log("other current", current);
    console.log("targetArray", targetArray);
  });
}

/**
 * Responsible for taking the provided values and initializing the drag and drop with
 * a modified setValues function.
 */
export const NestedList = /* #__PURE__ */ defineComponent(
  (props, { slots }) => {
    const parentRef = ref();

    const parentValues = ref(props.values);

    onMounted(() => {
      const groupEl = inject("nestedGroup");

      if (!groupEl || !groupEl.value) {
        console.warn("Group not found");

        return;
      }

      // useNestedDragAndDrop(groupEl, parentRef.value, props.values);
      console.log("parent values", parentValues);
      dragAndDrop({
        parent: parentRef,
        values: parentValues,
        group: "nested",
        nestedConfig: {
          group: groupEl.value,
          nestedSetValues,
        },
        plugins: [insertion()],
      });
    });

    // const parent = inject("nestedParent");

    // console.log("parent", parent);

    // const parentValues = inject("parentValues");

    // dragAndDrop({
    //   parent: parentRef,
    //   values: parentValues,
    // });

    return () =>
      slots.default
        ? h(
            props.tag,
            {
              ref: parentRef,
            },
            slots
          )
        : null;
  },
  {
    props: {
      values: {
        type: Array as PropType<Array<any>>,
        default: () => [],
      },
      tag: {
        type: String as PropType<string>,
        default: "div",
      },
      config: {
        type: Object as PropType<VueDragAndDropData<unknown>>,
        default: () => ({}),
      },
    },
  }
);
