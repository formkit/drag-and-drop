<script setup lang="ts">
import { useDragAndDrop } from "@formkit/drag-and-drop/vue";

const props = defineProps({
  dragHandles: {
    type: Boolean,
    default: false,
  },
});

const [todoList, todos] = useDragAndDrop(
  [
    "Schedule perm",
    "Rewind VHS tapes",
    "Make change for the arcade",
    "Get disposable camera developed",
    "Learn C++",
    "Return Nintendo Power Glove",
  ],
  {
    group: "todoList",
    dragHandle: !!props.dragHandles ? ".kanban-handle" : undefined,
  }
);
const [doneList, dones] = useDragAndDrop(["Pickup new mix-tape from Beth"], {
  group: "todoList",
  dragHandle: !!props.dragHandles ? ".kanban-handle" : undefined,
});

if (props.dragHandles) {
  dones.value.push("Implement drag handles");
}
</script>

<template>
  <DemoContainer :name="dragHandles ? 'Drag Handles' : 'Transfer'">
    <div
      class="group bg-slate-500 dark:bg-slate-800 data-[handles=true]:bg-emerald-700 dark:data-[handles=true]:bg-emerald-950"
      :data-handles="dragHandles"
    >
      <div class="kanban-board p-4 grid grid-cols-2 gap-4">
        <div class="kanban-column">
          <h2 class="kanban-title">ToDos</h2>

          <ul ref="todoList" class="kanban-list">
            <li v-for="todo in todos" :key="todo" class="kanban-item">
              <span
                v-if="dragHandles"
                class="kanban-handle inline-block w-2 mr-2 cursor-grab active:cursor-grabbing"
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
        </div>
        <div class="kanban-column">
          <h2 class="kanban-title">Complete</h2>

          <ul ref="doneList" class="kanban-list">
            <li
              v-for="done in dones"
              :key="done"
              class="kanban-item kanban-complete"
            >
              <span
                v-if="dragHandles"
                class="kanban-handle inline-block w-2 mr-2 cursor-grab active:cursor-grabbing"
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
        </div>
      </div>
    </div>
  </DemoContainer>
</template>

<style scoped>
.kanban-column {
  @apply bg-slate-50 p-4 shadow-md flex flex-col;
  @apply dark:bg-slate-600;
}
.kanban-title {
  @apply font-oldschool text-slate-800 text-4xl mb-4 text-center;
  @apply dark:text-slate-200 dark:antialiased;
}
.kanban-list {
  @apply list-none h-full min-h-[400px];
}
.kanban-item {
  @apply bg-slate-200 text-slate-600 antialiased border border-slate-300 p-4 font-oldschool text-xl leading-none font-thin mb-2 last:mb-0 group-data-[handles=false]:cursor-grab group-data-[handles=false]:active:cursor-grabbing;
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
