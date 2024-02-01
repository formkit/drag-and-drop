import dragAndDrop from "./index";
import { defineComponent, h, PropType, ref, watch } from "vue";

export const DNDList = /* #__PURE__ */ defineComponent(
  (props, { slots, emit }) => {
    const parentRef = ref();
    //let parentValues = Toef(props.modelValue);
    const parentValues = ref(props.modelValue);
    const parent = slots.default ? slots.default() : null;
    if (parent && parent.length > 1)
      console.warn("DNDProvider can only have one child");

    dragAndDrop([
      {
        parent: parentRef,
        listValues: parentValues,
      },
    ]);

    watch(parentValues, (newVal) => {
      emit("update:modelValue", newVal);
    });

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
      modelValue: {
        type: Array as PropType<Array<any>>,
        default: () => [],
      },
      sortable: {
        type: Boolean,
        default: true,
      },
      tag: {
        type: String,
        default: "div",
      },
    },
    emits: ["update:modelValue"],
  }
);
