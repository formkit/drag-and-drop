<script lang="ts" setup>
import { codeToHtml } from "shiki";
import { transformerTwoslash } from "@shikijs/twoslash";

const props = defineProps<{
  example: string;
}>();
const res = await import(
  `../examples/${props.example}/${props.example}.ts?raw`
);
const code = res.default;

const html = await codeToHtml(code, {
  theme: "github-light",
  lang: "ts",
  transformers: [transformerTwoslash()],
});
// const darkHtml = await codeToHtml(code, {
//   theme: "github-dark",
//   lang: "ts",
//   transformers: [
//     createTransformerFactory(createTwoslasher())({
//       langs: ["ts", "tsx", "js"],
//       renderer: rendererRich(),
//     }),
//   ],
// });
</script>

<template>
  <div v-html="html" class="dark:hidden"></div>
  <!-- <div v-html="darkHtml" class="hidden dark:block"></div> -->
</template>
