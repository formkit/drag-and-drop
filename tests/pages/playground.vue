<script setup lang="ts">
import { reactive, onMounted } from "vue";
import { dragAndDrop, state as DNDState } from "../../src";

type LogEntry = { name: string; qty: number };
type Log = {
  previous: LogEntry[];
  current: LogEntry[];
};

const state = reactive<{ tapes: string[]; log: Log }>({
  tapes: [
    "Depeche Mode",
    "Duran Duran",
    "Pet Shop Boys",
    "Kraftwerk",
    "Tears for Fears",
  ],
  log: {
    previous: [],
    current: [],
  },
});

function logEventHandler(name: string) {
  console.log("logEventHandler", name);
  return (event: any) => {
    console.log(name, event);
    const lastEntry = state.log.current[state.log.current.length - 1];
    if (lastEntry && lastEntry.name === name) {
      lastEntry.qty += 1;
    } else {
      state.log.current.push(reactive({ name: name, qty: 1 }));
    }
  };
}

onMounted(() => {
  dragAndDrop<string>({
    parent: document.getElementById("cassettes")!,
    getValues: () => state.tapes,
    setValues: (newValues) => {
      state.tapes = reactive(newValues);
    },
    config: {
      // onDragstart: logEventHandler("[parent] dragstart"),
      onDragstart: () => console.log("hellooooooooooo parent dragstart"),
      onDragend: logEventHandler("[parent] dragend"),
      onSort: logEventHandler("[parent] sort"),
    },
  });

  // DNDState.on("dragStarted", logEventHandler("[global] dragstarted"));
  // DNDState.on("dragEnded", logEventHandler("[global] dragended"));
});
</script>

<template>
  <div>
    <ul id="cassettes">
      <li
        v-for="tape in state.tapes"
        :key="tape"
        class="cassette"
        :data-label="tape"
      >
        {{ tape }}
      </li>
    </ul>
    <hr />
    <h3>State</h3>
    <p class="state">{{ JSON.stringify(state.tapes) }}</p>
    <hr />
    <h3>Events</h3>
    <button
      @click="
        () => {
          state.log = reactive({
            previous: [...state.log.current],
            current: [],
          });
        }
      "
    >
      clear
    </button>
    <div class="event-logs">
      <div>
        <h4>Previous</h4>
        <ul>
          <li v-for="log in state.log.previous" :key="log.name">
            {{ log.name }}{{ log.qty > 1 ? `(${log.qty})` : "" }}
          </li>
        </ul>
      </div>
      <div>
        <h4>Current</h4>
        <ul>
          <li v-for="log in state.log.current" :key="log.name">
            {{ log.name }}{{ log.qty > 1 ? `(${log.qty})` : "" }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
body {
  font-family: sans-serif;
}

ul {
  list-style-type: none;
  list-style-position: inside;
  padding: 0;
}

#cassettes {
  padding: 10px;
  border: 1px solid black;
}

.cassette {
  border: 1px solid black;
  background-color: #eeeeee;
  margin-bottom: 10px;
  padding: 10px;

  &:last-of-type {
    margin-bottom: 0;
  }
}

.state {
  font-family: monospace;
}

.event-logs {
  font-family: monospace;
  display: flex;

  > div {
    flex: 1;
  }
}
</style>
