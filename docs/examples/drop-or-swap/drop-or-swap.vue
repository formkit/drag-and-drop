<script setup lang="ts">
import { ref } from "vue";
import { dropOrSwap } from "../../../src/index";
import { useDragAndDrop } from "../../../src/vue/index";

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
    dropOrSwap({
      shouldSwap: () => todoShouldSwap.value,
    }),
  ],
});
const [doneList, dones] = useDragAndDrop(doneItems, {
  group: "todoList",
  plugins: [
    dropOrSwap({
      shouldSwap: () => doneShouldSwap.value,
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
