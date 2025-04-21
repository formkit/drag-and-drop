<script lang="ts" setup>
import { codeToHtml } from "shiki";
import { createTwoslasher } from "twoslash-vue";
import { createTransformerFactory, rendererRich } from "@shikijs/twoslash";

const props = defineProps<{
  example: string;
}>();
const res = await import(
  `../examples/${props.example}/${props.example}.tsx?raw`
);
const code = res.default;

const html = await codeToHtml(code, {
  theme: "github-light",
  lang: "tsx",
  transformers: [
    createTransformerFactory(createTwoslasher())({
      langs: ["ts", "tsx", "js"],
      renderer: rendererRich(),
    }),
  ],
});
const darkHtml = await codeToHtml(code, {
  theme: "github-dark",
  lang: "tsx",
  transformers: [
    createTransformerFactory(createTwoslasher())({
      langs: ["ts", "tsx", "js"],
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
    <div
      :id="`raw-code-container-${props.example}-react`"
      style="display: none"
    >
      <pre>{{ code }}</pre>
    </div>
  </div>
</template>
