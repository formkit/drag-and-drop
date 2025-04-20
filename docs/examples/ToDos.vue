<script setup lang="ts">
import { dropOrSwap, insert } from "@formkit/drag-and-drop";
import { useDragAndDrop } from "@formkit/drag-and-drop/vue";

const props = defineProps({
  dragHandles: {
    type: Boolean,
    default: false,
  },
  sortable: {
    type: Boolean,
    default: true,
  },
  useDropOrSwap: {
    type: Boolean,
    default: false,
  },
  transfer: {
    type: Boolean,
    default: true,
  },
  insert: {
    type: Boolean,
    default: false,
  },
});

const todoShouldSwap = ref(false);
const doneShouldSwap = ref(false);

const todoConfig = {
  group: "todoList",
  dragHandle: props.dragHandles ? ".kanban-handle" : undefined,
  sortable: props.sortable,
  plugins: (() => {
    const pluginArray = [];
    if (props.insert) {
      pluginArray.push(
        insert({
          insertPoint: (parent) => {
            const div = document.createElement("div");

            for (const cls of insertPointClasses) div.classList.add(cls);

            return div;
          },
        })
      );
    }
    if (props.useDropOrSwap) {
      pluginArray.push(
        dropOrSwap({
          shouldSwap: () => {
            return todoShouldSwap.value;
          },
        })
      );
    }
    return pluginArray.length ? pluginArray : undefined;
  })(),
  dropZoneClass: !props.insert ? "!bg-lime-200" : undefined,
  dropZoneParentClass: !props.insert ? "!border-4 border-lime-300" : undefined,
  synthDropZoneClass: !props.insert ? "!bg-lime-200" : undefined,
  synthDropZoneParentClass: !props.insert
    ? "!border-4 border-lime-300"
    : undefined,
};

const doneConfig = {
  group: "todoList",
  dragHandle: props.dragHandles ? ".kanban-handle" : undefined,
  sortable: props.sortable,
  plugins: (() => {
    const pluginArray = [];
    if (props.insert) {
      pluginArray.push(
        insert({
          insertPoint: (parent) => {
            const div = document.createElement("div");

            for (const cls of insertPointClasses) div.classList.add(cls);

            return div;
          },
        })
      );
    }
    if (props.useDropOrSwap) {
      pluginArray.push(
        dropOrSwap({
          shouldSwap: () => {
            return todoShouldSwap.value;
          },
        })
      );
    }
    return pluginArray.length ? pluginArray : undefined;
  })(),
  dropZoneClass: !props.insert ? "!bg-lime-200" : undefined,
  dropZoneParentClass: !props.insert ? "!border-4 border-lime-300" : undefined,
  synthDropZoneClass: !props.insert ? "!bg-lime-200" : undefined,
  synthDropZoneParentClass: !props.insert
    ? "!border-4 border-lime-300"
    : undefined,
};

const [todoList, todos] = useDragAndDrop(
  [
    "Schedule perm",
    "Rewind VHS tapes",
    "Make change for the arcade",
    "Get disposable camera developed",
    "Learn C++",
    "Return Nintendo Power Glove",
  ],
  todoConfig
);
const [doneList, dones] = useDragAndDrop(
  ["Pickup new mix-tape from Beth"],
  doneConfig
);

if (props.dragHandles) {
  dones.value.push("Implement drag handles");
}

function toggleTodoSwap() {
  todoShouldSwap.value = !todoShouldSwap.value;
}

function toggleDoneSwap() {
  doneShouldSwap.value = !doneShouldSwap.value;
}

const insertPointClasses = [
  "absolute",
  "bg-blue-500",
  "z-[1000]",
  "rounded-full",
  "duration-[5ms]",
  "h-1",
  "box-border",
  "before:block",
  'before:content-["Insert"]',
  "before:whitespace-nowrap",
  "before:block",
  "before:bg-blue-500",
  "before:py-1",
  "before:px-2",
  "before:rounded-full",
  "before:text-xs",
  "before:absolute",
  "before:top-1/2",
  "before:left-1/2",
  "before:-translate-y-1/2",
  "before:-translate-x-1/2",
  "before:text-white",
  "before:text-xs",
];
</script>

<template>
  <DemoContainer :name="dragHandles ? 'Drag Handles' : 'Transfer'">
    <div
      class="group bg-slate-200 dark:bg-slate-800"
      :data-handles="dragHandles"
    >
      <div class="kanban-board p-px grid grid-cols-2 gap-px">
        <div class="kanban-column">
          <h2 class="kanban-title">ToDos</h2>

          <ul ref="todoList" class="kanban-list" aria-label="Todo List">
            <li
              v-for="todo in todos"
              :key="todo"
              class="kanban-item flex items-center"
              :aria-label="todo"
            >
              <span
                v-if="dragHandles"
                class="kanban-handle inline-block shrink-0 w-2 mr-2 cursor-grab"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 512">
                  <path
                    fill="currentColor"
                    d="M48 144a48 48 0 1 0 0-96 48 48 0 1 0 0 96zm0 160a48 48 0 1 0 0-96 48 48 0 1 0 0 96zM96 416A48 48 0 1 0 0 416a48 48 0 1 0 96 0zM208 144a48 48 0 1 0 0-96 48 48 0 1 0 0 96zm48 112a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zM208 464a48 48 0 1 0 0-96 48 48 0 1 0 0 96z"
                  />
                </svg>
              </span>
              {{ todo }}
            </li>
          </ul>
          <div v-if="useDropOrSwap">
            <button
              @click="toggleTodoSwap()"
              class="bg-indigo-500 text-white font-bold py-2 px-4 rounded-lg mt-4"
            >
              Toggle {{ todoShouldSwap ? "Drop" : "Swap" }}
            </button>
          </div>
          <pre
            class="bg-white text-gray-800 p-4 border border-gray-300 rounded-lg font-mono text-sm shadow-sm overflow-x-auto whitespace-pre-wrap whitespace-pre mt-10"
            >{{ JSON.stringify(todos) }}</pre
          >
        </div>
        <div v-if="transfer" class="kanban-column">
          <h2 class="kanban-title">Complete</h2>

          <ul ref="doneList" class="kanban-list" aria-label="Done List">
            <li
              v-for="done in dones"
              :key="done"
              class="kanban-item kanban-complete flex items-center"
              :aria-label="done"
            >
              <span
                v-if="dragHandles"
                class="kanban-handle block w-2 mr-2 shrink-0 cursor-grab"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 512">
                  <path
                    fill="currentColor"
                    d="M48 144a48 48 0 1 0 0-96 48 48 0 1 0 0 96zm0 160a48 48 0 1 0 0-96 48 48 0 1 0 0 96zM96 416A48 48 0 1 0 0 416a48 48 0 1 0 96 0zM208 144a48 48 0 1 0 0-96 48 48 0 1 0 0 96zm48 112a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zM208 464a48 48 0 1 0 0-96 48 48 0 1 0 0 96z"
                  />
                </svg>
              </span>
              <span>
                {{ done }}
              </span>
            </li>
          </ul>
          <div v-if="useDropOrSwap">
            <button
              @click="toggleDoneSwap()"
              class="bg-indigo-500 text-white font-bold py-2 px-4 rounded-lg mt-4"
            >
              Toggle {{ doneShouldSwap ? "Drop" : "Swap" }}
            </button>
          </div>
          <pre
            class="bg-white text-gray-800 p-4 border border-gray-300 rounded-lg font-mono text-sm shadow-sm overflow-x-auto whitespace-pre-wrap whitespace-pre mt-10"
            >{{ JSON.stringify(dones) }}</pre
          >
        </div>
      </div>
    </div>
  </DemoContainer>
</template>

<style scoped>
.kanban-column {
  @apply p-2 md:p-4 shadow-md flex flex-col border-4 border-indigo-300;
}
.kanban-title {
  @apply font-oldschool text-slate-500 text-xl md:text-2xl lg:text-3xl xl:text-4xl mb-4 text-center;
  @apply dark:text-slate-200 dark:antialiased;
}
.kanban-list {
  @apply list-none h-full min-h-[300px] md:min-h-[400px];
}
.kanban-item {
  @apply bg-slate-100 text-slate-600 antialiased border border-slate-300 p-2 md:p-4 font-oldschool text-base md:text-lg lg:text-xl leading-none font-thin mb-2 last:mb-0 group-data-[handles=false]:cursor-grab;
  @apply dark:bg-slate-600 dark:text-slate-50 dark:border-slate-400;
}
.kanban-complete {
  @apply line-through text-red-500/50;
  @apply dark:text-red-400/80;
}
.kanban-complete span {
  @apply text-slate-600;
  @apply dark:text-slate-100;
}
</style>
