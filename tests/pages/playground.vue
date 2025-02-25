<script lang="ts" setup>
import { dragAndDrop } from "../../src/vue";

const availableInputs = ref([
  {
    group: "Simple Text Inputs",
    color: "green",
    options: [
      {
        label: "Text",
        value: "text",
        attrs: {
          help: "Single line text input.",
          pro: false,
        },
      },
      {
        label: "Textarea",
        value: "textarea",
        attrs: {
          help: "Multi-line text input.",
          pro: false,
        },
      },
    ],
  },
  {
    group: "Specialized Text Inputs",
    color: "blue",
    options: [
      {
        label: "Currency",
        value: "currency",
        attrs: {
          help: "Number formatted to locale and currency.",
          pro: true,
        },
      },
      {
        label: "Email",
        value: "email",
        attrs: {
          help: "Text with browser email validation.",
          pro: false,
        },
      },
      {
        label: "Number",
        value: "number",
        attrs: {
          help: "Number with optional min, max, and step.",
          pro: false,
        },
      },
      {
        label: "Password",
        value: "password",
        attrs: {
          help: "Text with obfuscated input value.",
          pro: false,
        },
      },
      {
        label: "Telephone",
        value: "tel",
        attrs: {
          help: "Text with input optimized for a phone number.",
          pro: false,
        },
      },
      {
        label: "Url",
        value: "url",
        attrs: {
          help: "Text with browser url validation.",
          pro: false,
        },
      },
    ],
  },
  {
    group: "Date & Time Inputs",
    color: "purple",
    options: [
      {
        label: "Datepicker",
        value: "datepicker",
        attrs: {
          help: "Date selection input with calendar and timezone support.",
          pro: true,
        },
      },
    ],
  },
  {
    group: "Option Inputs",
    color: "orange",
    options: [
      {
        label: "Autocomplete",
        value: "autocomplete",
        attrs: {
          help: "Input with search that allows single or multiple selections.",
          pro: true,
        },
      },
      {
        label: "Checkbox",
        value: "checkbox",
        attrs: {
          help: "Single or multiple checkbox input.",
          pro: false,
        },
      },
      {
        label: "Dropdown",
        value: "dropdown",
        attrs: {
          help: "Input with single or multiple selections from a list of options",
          pro: true,
        },
      },
      {
        label: "Radio",
        value: "radio",
        attrs: {
          help: "Single selection input from a set of options.",
          pro: false,
        },
      },
      {
        label: "Taglist",
        value: "taglist",
        attrs: {
          help: "Input allowing multiple selections from a list of options.",
          pro: true,
        },
      },
      {
        label: "Toggle Buttons",
        value: "togglebuttons",
        attrs: {
          help: "Button style input with single or multiple selections.",
          pro: true,
        },
      },
    ],
  },
  {
    group: "Range Inputs",
    color: "red",
    options: [
      {
        label: "Rating",
        value: "rating",
        attrs: {
          help: "Rating input with customizable min and max value and step.",
          pro: true,
        },
      },
      {
        label: "Slider",
        value: "slider",
        attrs: {
          help: "Slider input with support for up to two handles and customizable min, max, and step.",
          pro: true,
        },
      },
    ],
  },
  {
    group: "Color Inputs",
    color: "teal",
    options: [
      {
        label: "Colorpicker",
        value: "colorpicker",
        attrs: {
          help: "Color picker input with support for multiple color formats, alpha transparency, and swatches.",
          pro: true,
        },
      },
    ],
  },
  {
    group: "File Inputs",
    color: "yellow",
    options: [
      {
        label: "File",
        value: "file",
        attrs: {
          help: "File upload input with support for single or multiple files.",
          pro: false,
        },
      },
    ],
  },
  {
    group: "Control Inputs",
    color: "indigo",
    options: [
      {
        label: "Repeater",
        value: "repeater",
        attrs: {
          help: "Input that allows for repeating a set of nested inputs.",
          locked: true,
          pro: true,
        },
      },
      {
        label: "Toggle",
        value: "toggle",
        attrs: {
          help: "Toggle input with on/off state and customizable text.",
          pro: true,
        },
      },
    ],
  },
]);

const query = ref("");

//const filteredInputs = computed(() => {
//  return availableInputs
//    .map((group) => {
//      const filteredOptions = group.options.filter(
//        (input: Record<string, any>) => {
//          return input.label.toLowerCase().includes(query.value.toLowerCase());
//        }
//      );
//      return {
//        ...group,
//        options: filteredOptions,
//      };
//    })
//    .filter((group) => group.options.length);
//});

const filteredInputs = computed({
  get() {
    return availableInputs.value
      .map((group) => {
        const filteredOptions = group.options.filter(
          (input: Record<string, any>) => {
            return input.label
              .toLowerCase()
              .includes(query.value.toLowerCase());
          }
        );
        return {
          ...group,
          options: filteredOptions,
        };
      })
      .filter((group) => group.options.length);
  },
  set(value) {
    console.log("actually updating values");
    availableInputs.value = value;
  },
});

function initDnd(
  el: Element | ComponentPublicInstance | null,
  values: Array<Record<string, any>>
) {
  if (!(el instanceof HTMLElement)) return;

  dragAndDrop({
    parent: el,
    values,
    treeGroup: "input-list",
    group: "formkit-builder",
    sortable: false,
    accepts: () => false,
  });
}
</script>

<template>
  <div class="relative pb-10">
    <div
      class="input-search sticky top-0 h-[2.5rem] z-20 bg-white border-b border-y-slate-300"
    >
      <FormKit
        v-model="query"
        type="search"
        prefix-icon="search"
        placeholder="Search inputs"
        inner-class="$reset flex items-center px-4 py-2 w-full"
      />
    </div>
    <div
      class="relative"
      v-for="group in filteredInputs"
      data-input-group="true"
      :key="group.group"
    >
      {{ group.group }}

      <h2
        class="top-[calc(2.5rem-1px)] text-sm font-semibold text-slate-500 pt-3.5 pb-1 px-2"
        v-if="'group' in group"
      >
        {{ group.group }}
      </h2>

      <div
        class="grid grid-cols-3 gap-2 p-2 bg-gray-50/50"
        :ref="(el) => initDnd(el, group.options)"
      >
        <div
          class="group relative flex flex-col items-center shadow-sm border border-slate-300 bg-white p-2.5 rounded-lg select-none transition-colors cursor-grab"
          v-for="input in group.options"
          :key="input"
          :title="input.attrs.help"
        >
          <div
            class="aspect-square flex items-center justify-center p-2 rounded w-8 mb-1 shrink-0 mt-1 [&_svg]:w-full"
          >
            <FormKitIcon :icon="`input_${input.value}`" />
          </div>
          <div class="mt-1">
            <p class="text-[13px] text-gray-600 text-center leading-tight">
              {{ input.label }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.outside {
  min-height: 20px;
  margin: 10px;
  border: 2px solid red;
}

.inside {
  min-height: 50px;
  margin: 10px;
  border: 2px solid green;
}

.content {
  padding: 5px;
  border: 1px solid black;
  margin: 10px;
}
</style>
