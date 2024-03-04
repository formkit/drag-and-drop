<script lang="ts" setup>
import { codeToHtml } from "shiki";
import { transformerTwoslash } from "@shikijs/twoslash";

const props = defineProps({
  example: String,
  fullHeight: {
    type: Boolean,
    default: false,
    required: false,
  },
});
const res = await import(
  `../examples/${props.example}/${props.example}.ts?raw`
);
const code = res.default;
const twoslash = transformerTwoslash();

const [html, darkHtml] = await Promise.all([
  codeToHtml(code, {
    theme: "github-light",
    lang: "ts",
    transformers: [twoslash],
  }),
  codeToHtml(code, {
    theme: "github-dark",
    lang: "ts",
    transformers: [twoslash],
  }),
]);
</script>

<template>
  <div :data-full-height="fullHeight">
    <div v-html="html" class="dark:hidden"></div>
    <div v-html="darkHtml" class="hidden dark:block"></div>
  </div>
</template>
