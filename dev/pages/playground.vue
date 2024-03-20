<script setup>
import Test from "../components/Test.vue";
import { ref, watch } from "vue";

const items = ref({
  answers: [{ name: 1 }, { name: 0.6052854008960278 }, { name: 3 }],
});

function onUpdateAnswers(newAnswers) {
  items.value = { answers: newAnswers };
}

function addAnswer() {
  const newAnswers = [...items.value.answers, { name: Math.random() }];
  items.value = { answers: newAnswers };
}
</script>

<template>
  <div>
    <Test
      v-slot="{ sortedAnswers }"
      :answers="items.answers"
      @update:answers="onUpdateAnswers"
      class="container"
    >
      <div class="test" v-for="item in sortedAnswers" :key="item.name">
        <div>drag me</div>
        {{ item.name }}
      </div>
    </Test>
    <button @click="addAnswer()">Add an item</button>
  </div>
</template>

<style>
.container {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.test {
  display: flex;
  flex-direction: column;
  background: grey;
  justify-content: center;
  width: 20px;
  word-break: break-word;
}
</style>
