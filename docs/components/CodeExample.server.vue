<script lang="ts" setup>
import { codeToHtml } from "shiki";
import { transformerTwoslash } from "@shikijs/twoslash";
const props = defineProps<{
  example: string;
}>();
const html = await codeToHtml(
  await import(`../examples/${props.example}/${props.example}.vue?raw`),
  {
    theme: "solarized-light",
    lang: "typescript",
    transformers: [transformerTwoslash()],
  }
);
</script>

<template>
  <div v-html="html"></div>
</template>
