<script lang="ts" setup>
import { codeToHtml } from "shiki";
import { createTwoslasher } from "twoslash-vue";
import { createTransformerFactory, rendererRich } from "@shikijs/twoslash";

const props = defineProps<{
  example: string;
}>();
const res = await import(
  `../examples/${props.example}/${props.example}.vue?raw`
);
const code = res.default;

const html = await codeToHtml(code, {
  theme: "github-light",
  lang: "vue",
  transformers: [
    createTransformerFactory(createTwoslasher())({
      langs: ["vue"],
      renderer: rendererRich(),
    }),
  ],
});
const darkHtml = await codeToHtml(code, {
  theme: "github-dark",
  lang: "vue",
  transformers: [
    createTransformerFactory(createTwoslasher())({
      langs: ["vue"],
      renderer: rendererRich(),
    }),
  ],
});
</script>

<template>
  <div>
    <div v-html="html" class="dark:hidden"></div>
    <div v-html="darkHtml" class="hidden dark:block"></div>
    <!-- Hidden container for raw code -->
    <div :id="`raw-code-container-${props.example}-vue`" style="display: none">
      <pre>{{ code }}</pre>
    </div>
  </div>
</template>
