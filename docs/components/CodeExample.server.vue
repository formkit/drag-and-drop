<script lang="ts" setup>
import { codeToHtml } from "shiki";
import { createTwoslasher } from "twoslash-vue";
import { transformerTwoslash } from "@shikijs/twoslash";
const props = defineProps<{
  example: string;
}>();
console.log("res");
const res = await import(
  `../examples/${props.example}/${props.example}.vue?raw`
);
const code = res.default;
const html = await codeToHtml(code, {
  theme: "solarized-light",
  lang: "vue",
  transformers: [
    transformerTwoslash({
      twoslasher: createTwoslasher(),
    }),
  ],
});
</script>

<template>
  <div v-html="html"></div>
</template>
