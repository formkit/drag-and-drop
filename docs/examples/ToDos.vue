<script setup lang="ts">
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
    sortable: props.sortable,
  }
);
const [doneList, dones] = useDragAndDrop(["Pickup new mix-tape from Beth"], {
  group: "todoList",
  dragHandle: !!props.dragHandles ? ".kanban-handle" : undefined,
  sortable: props.sortable,
});

if (props.dragHandles) {
  dones.value.push("Implement drag handles");
}
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

          <ul ref="todoList" class="kanban-list">
            <li
              v-for="todo in todos"
              :key="todo"
              class="kanban-item flex items-center"
            >
              <span
                v-if="dragHandles"
                class="kanban-handle inline-block shrink-0 w-2 mr-2 cursor-grab active:cursor-grabbing"
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
              class="kanban-item kanban-complete flex items-center"
            >
              <span
                v-if="dragHandles"
                class="kanban-handle block w-2 mr-2 shrink-0 cursor-grab active:cursor-grabbing"
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
  @apply bg-slate-100 text-slate-600 antialiased border border-slate-300 p-2 md:p-4 font-oldschool text-base md:text-lg lg:text-xl leading-none font-thin mb-2 last:mb-0 group-data-[handles=false]:cursor-grab group-data-[handles=false]:active:cursor-grabbing;
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
