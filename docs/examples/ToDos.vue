<script setup lang="ts">
import { dragAndDrop } from "@formkit/drag-and-drop/vue";

const todoList = ref(null);
const doneList = ref(null);
const todos = ref([
  "Schedule perm",
  "Rewind VHS tapes",
  "Make change for the arcade",
  "Get disposable camera developed",
  "Learn C++",
  "Return Nintendo Power Glove",
]);
const dones = ref(["Pickup new mixtape from Beth"]);

dragAndDrop({
  parent: todoList,
  values: todos,
  group: "todoList",
});
dragAndDrop({
  parent: doneList,
  values: dones,
  group: "todoList",
});
</script>

<template>
  <DemoContainer name="Transfer">
    <div class="bg-slate-500 dark:bg-slate-800">
      <div class="kanban-board p-4 grid grid-cols-2 gap-4">
        <div class="kanban-column">
          <h2 class="kanban-title">ToDos</h2>

          <ul ref="todoList" class="kanban-list">
            <li v-for="todo in todos" :key="todo" class="kanban-item">
              {{ todo }}
            </li>
          </ul>
        </div>
        <div class="kanban-column">
          <h2 class="kanban-title">Complete</h2>

          <ul ref="doneList" class="kanban-list">
            <li
              v-for="done in dones"
              :key="done"
              class="kanban-item kanban-complete"
            >
              <span>
                {{ done }}
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </DemoContainer>
</template>

<style scoped>
.kanban-column {
  @apply bg-white p-4 rounded-lg shadow-md flex flex-col;
  @apply dark:bg-slate-600;
}
.kanban-title {
  @apply font-display text-slate-800 text-4xl mb-4 text-center;
  @apply dark:text-slate-200 dark:antialiased;
}
.kanban-list {
  @apply list-none h-full min-h-[400px];
}
.kanban-item {
  @apply bg-slate-100 text-slate-600 antialiased border p-4 font-display text-xl leading-none font-thin rounded-lg mb-2 last:mb-0 cursor-grab active:cursor-grabbing;
  @apply dark:bg-slate-500 dark:text-slate-50 dark:border-slate-400;
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
