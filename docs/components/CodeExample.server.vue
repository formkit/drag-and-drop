<script lang="ts" setup>
import { codeToHtml } from "shiki";
import { transformerTwoslash } from "@shikijs/twoslash";

const html = await codeToHtml('console.log("hello world")', {
  theme: "solarized-light",
  lang: "typescript",
  transformers: [transformerTwoslash()],
});
</script>

<template>
  <div v-html="html"></div>
</template>
