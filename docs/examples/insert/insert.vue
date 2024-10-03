<script setup lang="ts">
import { ref } from "vue";
import { insert } from "@formkit/drag-and-drop";
import { useDragAndDrop } from "@formkit/drag-and-drop/vue";

const insertPointClasses = [
  "absolute",
  "bg-blue-500",
  "z-[1000]",
  "rounded-full",
  "duration-[5ms]",
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

const todoItems = [
  "Schedule perm",
  "Rewind VHS tapes",
  "Make change for the arcade",
  "Get disposable camera developed",
  "Learn C++",
  "Return Nintendo Power Glove",
];
const doneItems = ["Pickup new mix-tape from Beth"];

const todoShouldSwap = ref(false);
const doneShouldSwap = ref(false);

const [todoList, todos] = useDragAndDrop(todoItems, {
  group: "todoList",
  plugins: [
    insert({
      insertPoint: (parent) => {
        const div = document.createElement("div");

        for (const cls of insertPointClasses) div.classList.add(cls);

        return div;
      },
    }),
  ],
});
const [doneList, dones] = useDragAndDrop(doneItems, {
  group: "todoList",
  plugins: [
    insert({
      insertPoint: (parent) => {
        const div = document.createElement("div");

        for (const cls of insertPointClasses) div.classList.add(cls);

        return div;
      },
    }),
  ],
});

function toggleTodoSwap() {
  todoShouldSwap.value = !todoShouldSwap.value;
}

function toggleDoneSwap() {
  doneShouldSwap.value = !doneShouldSwap.value;
}
</script>

<template>
  <div class="kanban-board">
    <ul ref="todoList" class="kanban-column">
      <li v-for="todo in todos" :key="todo" class="kanban-item">
        {{ todo }}
      </li>
    </ul>
    <div>
      <button
        @click="toggleTodoSwap()"
        class="bg-indigo-500 text-white font-bold py-2 px-4 rounded-lg mt-4"
      >
        Toggle {{ todoShouldSwap ? "Drop" : "Swap" }}
      </button>
    </div>
    <ul ref="doneList" class="kanban-column">
      <li v-for="done in dones" :key="done" class="kanban-item">
        {{ done }}
      </li>
    </ul>
    <div>
      <button
        @click="toggleDoneSwap()"
        class="bg-indigo-500 text-white font-bold py-2 px-4 rounded-lg mt-4"
      >
        Toggle {{ doneShouldSwap ? "Drop" : "Swap" }}
      </button>
    </div>
  </div>
</template>
