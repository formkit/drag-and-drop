<script setup lang="ts">
import { useDragAndDrop } from "@formkit/drag-and-drop/vue";

const todoItems = [
  "Schedule perm",
  "Rewind VHS tapes",
  "Make change for the arcade",
  "Get disposable camera developed",
  "Learn C++",
  "Return Nintendo Power Glove",
];
const doneItems = ["Pickup new mix-tape from Beth", "Implement drag handles"];

const [todoList, todos] = useDragAndDrop(todoItems, {
  group: "todoList",
  dragHandle: ".kanban-handle",
});
const [doneList, dones] = useDragAndDrop(doneItems, {
  group: "todoList",
  dragHandle: ".kanban-handle",
});
</script>

<template>
  <div class="kanban-board">
    <ul ref="todoList" class="kanban-column">
      <li v-for="todo in todos" :key="todo" class="kanban-item">
        <svg
          class="kanban-handle"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 256 512"
        >
          <path
            fill="currentColor"
            d="M48 144a48 48 0 1 0 0-96 48 48 0 1 0 0 96zm0 160a48 48 0 1 0 0-96 48 48 0 1 0 0 96zM96 416A48 48 0 1 0 0 416a48 48 0 1 0 96 0zM208 144a48 48 0 1 0 0-96 48 48 0 1 0 0 96zm48 112a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zM208 464a48 48 0 1 0 0-96 48 48 0 1 0 0 96z"
          />
        </svg>
        {{ todo }}
      </li>
    </ul>
    <ul ref="doneList" class="kanban-column">
      <li v-for="done in dones" :key="done" class="kanban-item">
        <svg
          class="kanban-handle"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 256 512"
        >
          <path
            fill="currentColor"
            d="M48 144a48 48 0 1 0 0-96 48 48 0 1 0 0 96zm0 160a48 48 0 1 0 0-96 48 48 0 1 0 0 96zM96 416A48 48 0 1 0 0 416a48 48 0 1 0 96 0zM208 144a48 48 0 1 0 0-96 48 48 0 1 0 0 96zm48 112a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zM208 464a48 48 0 1 0 0-96 48 48 0 1 0 0 96z"
          />
        </svg>
        {{ done }}
      </li>
    </ul>
  </div>
</template>
