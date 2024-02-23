<script setup lang="ts">
import { useDragAndDrop } from "@formkit/drag-and-drop/vue";

const todoItems = ["Schedule perm", "Rewind VHS tapes", "Make change for the arcade", "Get disposable camera developed", "Learn C++", "Return Nintendo Power Glove"];
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
        <span class="kanban-handle"></span>
        {{ todo }}
      </li>
    </ul>
    <ul ref="doneList" class="kanban-column">
      <li v-for="done in dones" :key="done" class="kanban-item">
        <span class="kanban-handle"></span>
        {{ done }}
      </li>
    </ul>
  </div>
</template>
