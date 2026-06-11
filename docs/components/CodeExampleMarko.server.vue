<script lang="ts" setup>
import { highlightCode } from "~/utils/shiki";

const props = defineProps<{
  example: string;
}>();
const res = await import(
  `../examples/${props.example}/${props.example}.marko?raw`
);
const code = res.default;
const { html, darkHtml } = await highlightCode(code, "marko");
</script>

<template>
  <div>
    <div v-html="html" class="dark:hidden"></div>
    <div v-html="darkHtml" class="hidden dark:block"></div>
    <div
      :id="`raw-code-container-${props.example}-marko`"
      style="display: none"
    >
      <pre>{{ code }}</pre>
    </div>
  </div>
</template>
