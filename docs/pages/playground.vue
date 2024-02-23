<script setup lang="ts">
import type {
  DNDPlugin,
  DragState,
  TouchState,
  NodeEventData,
  ParentEventData,
} from "@formkit/drag-and-drop";
import { useDragAndDrop } from "@formkit/drag-and-drop/vue";
import {
  parents,
  parentValues,
  dragValues,
  setParentValues,
} from "@formkit/drag-and-drop";

interface Todo {
  label: string;
  key: string;
}

function sourceTransfer<T>(
  state: DragState<T> | TouchState<T>,
  data: NodeEventData<T> | ParentEventData<T>
) {
  const draggedValues = dragValues(state);

  const lastParentValues = parentValues(
    state.lastParent.el,
    state.lastParent.data
  ).filter((x: any) => !draggedValues.includes(x));

  setParentValues(state.lastParent.el, state.lastParent.data, lastParentValues);
}

function findDuplicates<T>(values: Array<T>) {
  const uniqueElements = new Set();
  const duplicates: Array<T> = [];

  values.forEach((item) => {
    if (uniqueElements.has(item)) {
      duplicates.push(item);
    } else {
      uniqueElements.add(item);
    }
  });

  return duplicates;
}

function targetTransfer<T>(
  state: DragState<T> | TouchState<T>,
  data: NodeEventData<T> | ParentEventData<T>
) {
  const draggedValues = dragValues(state);

  const targetParentValues = parentValues(
    data.targetData.parent.el,
    data.targetData.parent.data
  );

  const reset =
    state.initialParent.el === data.targetData.parent.el &&
    data.targetData.parent.data.config.sortable === false;

  let targetIndex: number;

  if ("node" in data.targetData) {
    if (reset) {
      targetIndex = state.initialIndex;
    } else if (data.targetData.parent.data.config.sortable === false) {
      targetIndex = data.targetData.parent.data.enabledNodes.length;
    } else {
      targetIndex = data.targetData.node.data.index;
    }

    targetParentValues.splice(targetIndex, 0, ...draggedValues);
  } else {
    targetIndex = reset
      ? state.initialIndex
      : data.targetData.parent.data.enabledNodes.length;

    targetParentValues.splice(targetIndex, 0, ...draggedValues);
  }

  const duplicates = findDuplicates(targetParentValues);

  for (const duplicate of duplicates as Array<Todo>) {
    if (!("key" in duplicate) || typeof duplicate !== "object") continue;
    const index = targetParentValues.indexOf(duplicate as T);
    const newKey = `${duplicate.key}-${Math.random()
      .toString(36)
      .substring(2, 15)}`;

    targetParentValues[index] = {
      ...(targetParentValues[index] as T),
      key: newKey,
    };
  }

  setParentValues(
    data.targetData.parent.el,
    data.targetData.parent.data,
    targetParentValues
  );
}

const targetClone: DNDPlugin = (parent) => {
  const parentData = parents.get(parent);

  if (!parentData) return;

  return {
    setup() {
      parentData.config.performTransfer = targetTransfer;
    },
  };
};

const sourceClone: DNDPlugin = (parent) => {
  const parentData = parents.get(parent);

  if (!parentData) return;

  return {
    setup() {
      parentData.config.performTransfer = sourceTransfer;
    },
  };
};

const initialTodos: Array<Todo> = [
  {
    label: "Schedule perm",
    key: "schedule-perm",
  },
  {
    label: "Rewind VHS tapes",
    key: "rewind-vhs",
  },
  {
    label: "Make change for the arcade",
    key: "make-change",
  },
  {
    label: "Get disposable camera developed",
    key: "disposable-camera",
  },
  {
    label: "Learn C++",
    key: "learn-cpp",
  },
  {
    label: "Return Nintendo Power Glove",
    key: "return-power-glove",
  },
];

const [todoList, todos] = useDragAndDrop(initialTodos, {
  group: "todoList",
  sortable: false,
  plugins: [sourceClone],
});

const doneValues: Array<Todo> = [
  {
    label: "Pickup new mix-tape from Beth",
    key: "mix-tape",
  },
];

const [doneList, dones] = useDragAndDrop(doneValues, {
  group: "todoList",
  plugins: [targetClone],
});
</script>

<template>
  <DemoContainer>
    <h2>Cloning example</h2>
    <div class="group bg-slate-200 dark:bg-slate-800">
      <div class="kanban-board p-px grid grid-cols-2 gap-px">
        <div class="kanban-column">
          <h2 class="kanban-title">ToDos</h2>

          <ul ref="todoList" class="kanban-list">
            <li
              v-for="todo in todos"
              :key="todo.key"
              class="kanban-item flex items-center"
            >
              {{ todo.label }}
            </li>
          </ul>
        </div>
        <div class="kanban-column">
          <h2 class="kanban-title">Complete</h2>

          <ul ref="doneList" class="kanban-list">
            <li
              v-for="done in dones"
              :key="done.key"
              class="kanban-item kanban-complete flex items-center"
            >
              <span>
                {{ done.label }}
              </span>
            </li>
          </ul>
        </div>
        <pre style="font-size: 10px; color: white">
          {{ todos }}
        </pre>
        <pre style="font-size: 10px; color: white">
          {{ dones }}
        </pre>
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
