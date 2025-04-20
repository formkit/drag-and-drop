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
    "Depeche Mode - Violator",
    "Duran Duran - Rio",
    "Pet Shop Boys - Actually",
    "Kraftwerk - Computer World",
    "Tears for Fears - Songs from the Big Chair",
    "New Order - Blue Monday",
    "The Human League - Dare",
    "Gary Numan - The Pleasure Principle",
    "Ultravox - Vienna",
    "Visage - Visage",
    "Japan - Quiet Life",
    "Soft Cell - Non-Stop Erotic Cabaret",
    "Heaven 17 - Penthouse and Pavement",
    "OMD - Architecture & Morality",
    "A Flock of Seagulls - A Flock of Seagulls",
    "Talk Talk - It's My Life",
    "Simple Minds - New Gold Dream",
    "Eurythmics - Sweet Dreams",
    "The Art of Noise - Who's Afraid of the Art of Noise?",
    "Yellow Magic Orchestra - Solid State Survivor",
    "Alphaville - Forever Young",
    "Yazoo - Upstairs at Eric's",
    "Thomas Dolby - The Golden Age of Wireless",
    "Devo - Freedom of Choice",
    "Berlin - Pleasure Victim",
    "Missing Persons - Spring Session M",
    "Information Society - Information Society",
    "Front 242 - Front by Front",
    "Nitzer Ebb - That Total Age",
    "Ministry - Twitch",
  ],
  log: {
    previous: [],
    current: [],
  },
});

onMounted(() => {
  dragAndDrop<string>({
    parent: document.getElementById("cassettes")!,
    getValues: () => state.tapes,
    setValues: (newValues) => {
      state.tapes = reactive(newValues);
    },
    config: {
      scrollThreshold: 0.25,
    },
  });

  // DNDState.on("dragStarted", logEventHandler("[global] dragstarted"));
  // DNDState.on("dragEnded", logEventHandler("[global] dragended"));
});
</script>

<template>
  <div>
    <div class="cassette-container">
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
    </div>
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

.cassette-container {
  height: 400px;
  overflow-y: auto;
  border: 2px solid #666;
}

#cassettes {
  padding: 10px;
  border: 1px solid black;
  min-height: 800px;
}

.cassette {
  border: 1px solid black;
  background-color: #eeeeee;
  margin-bottom: 10px;
  padding: 20px;
  font-size: 16px;

  &:last-of-type {
    margin-bottom: 0;
  }

  &:hover {
    background-color: #e0e0e0;
    cursor: grab;
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
