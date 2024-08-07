import type { Ref } from 'vue'
import type { VueDragAndDropData, VueParentConfig } from './types'
import {
  dragAndDrop as initParent,
  isBrowser,
  tearDown,
  parents,
  insertion,
} from '../index'
import {
  onUnmounted,
  ref,
  provide,
  defineComponent,
  h,
  onMounted,
  inject,
} from 'vue'
import { handleVueElements } from './utils'
export * from './types'

/**
 * Global store for parent els to values.
 */
const parentValues: WeakMap<HTMLElement, Ref<Array<any>> | Array<any>> =
  new WeakMap()

/**
 * Returns the values of the parent element.
 *
 * @param parent - The parent element.
 *
 * @returns The values of the parent element.
 */
function getValues(parent: HTMLElement): Array<any> {
  const values = parentValues.get(parent)

  if (!values) {
    console.warn('No values found for parent element')

    return []
  }

  return 'value' in values ? values.value : values
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
  const currentValues = parentValues.get(parent)

  if (currentValues && 'value' in currentValues) {
    currentValues.value = newValues
  } else if (currentValues) {
    parentValues.set(parent, newValues)
  }
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
  if (!isBrowser) return

  if (!Array.isArray(data)) data = [data]

  data.forEach((dnd) => {
    const { parent, values, ...rest } = dnd

    handleVueElements(parent, handleParent(rest, values))
  })
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
  options: Partial<ParentConfig<T>> = {}
): [
  Ref<HTMLElement | undefined>,
  Ref<T[]>,
  (config: Partial<VueParentConfig<T>>) => void
] {
  const parent = ref<HTMLElement | undefined>()

  const values = ref(initialValues) as Ref<T[]>

  function updateConfig(config: Partial<VueParentConfig<T>> = {}) {
    dragAndDrop({ parent, values, ...config })
  }

  dragAndDrop({ parent, values, ...options })

  onUnmounted(() => parent.value && tearDown(parent.value))

  return [parent, values, updateConfig]
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
  values: Ref<Array<T>> | Array<T>
) {
  return (parent: HTMLElement) => {
    parentValues.set(parent, values)

    initParent({
      parent,
      getValues,
      setValues,
      config: {
        ...config,
        dropZones: [],
      },
    })
  }
}

/**
 * Responsible for providing the parent element itself.
 */
export const NestedGroup = /* #__PURE__ */ defineComponent(
  (props, { slots }) => {
    const parentRef = ref()

    provide('nestedGroup', parentRef)

    return () =>
      slots.default
        ? h(
            props.tag,
            {
              ref: parentRef,
            },
            slots
          )
        : null
  },
  {
    props: {
      tag: {
        type: String as PropType<string>,
        default: 'div',
      },
    },
  }
)

/**
 * Responsible for taking the provided values and initializing the drag and drop with
 * a modified setValues function.
 */
export const NestedList = /* #__PURE__ */ defineComponent(
  (props, { slots }) => {
    const parentRef = ref()

    const parentValues = ref(props.values)

    onMounted(() => {
      const groupEl = inject('nestedGroup')

      // useNestedDragAndDrop(groupEl, parentRef.value, props.values);
      dragAndDrop({
        parent: parentRef,
        values: parentValues,
        group: 'nested',
        nestedConfig: {
          group: groupEl.value,
        },
        plugins: [insertion()],
      })
    })

    return () =>
      slots.default
        ? h(
            props.tag,
            {
              ref: parentRef,
            },
            slots
          )
        : null
  },
  {
    props: {
      values: {
        type: Array as PropType<Array<any>>,
        default: () => [],
      },
      tag: {
        type: String as PropType<string>,
        default: 'div',
      },
      config: {
        type: Object as PropType<VueDragAndDropData<unknown>>,
        default: () => ({}),
      },
    },
  }
)
