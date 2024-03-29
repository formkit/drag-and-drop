<script lang="ts" setup>
import { useDragAndDrop } from "../../src/vue/index";
import {
  handleEnd as dragAndDropEnd,
  handleDragstart as dragAndDropDragstart,
  animations,
  type NodeDragEventData,
  type NodeTouchEventData,
  tearDown,
} from "../../src/index";
import { watch } from "vue";

const emit = defineEmits<{
  (e: "add"): void;
  (e: "update:answers", list: []): void;
}>();

const props = defineProps<{
  answers: [];
}>();

const [parent, items] = useDragAndDrop(props.answers, {
  handleEnd,
  handleDragstart,
});

watch(
  () => props.answers,
  (v) => {
    items.value = v;
  }
);

function handleDragstart(data) {
  console.log(data);
  dragAndDropDragstart(data);
}

function handleEnd(data) {
  emit("update:answers", items.value);

  dragAndDropEnd(data);
}
</script>

<template>
  <div ref="parent">
    <slot :sorted-answers="items"></slot>
  </div>
</template>
