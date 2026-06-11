import { codeToHtml } from "shiki";
import { createTwoslasher } from "twoslash-vue";
import { createTransformerFactory, rendererRich } from "@shikijs/twoslash";
import { transformerTwoslash } from "@shikijs/twoslash";

// Single shared twoslash instances — reused across all island renders
const twoslasherVue = createTwoslasher();
const richTransformerFactory = createTransformerFactory(twoslasherVue);
const richRenderer = rendererRich();

const tsxTransformer = richTransformerFactory({
  langs: ["ts", "tsx", "js"],
  renderer: richRenderer,
});

const vueTransformer = richTransformerFactory({
  langs: ["vue"],
  renderer: richRenderer,
});

const nativeTransformer = transformerTwoslash();

export async function highlightCode(
  code: string,
  lang: "tsx" | "vue" | "ts" | "marko",
) {
  const shikiLang = lang === "marko" ? "html" : lang;

  const transformer =
    lang === "vue"
      ? vueTransformer
      : lang === "ts"
        ? nativeTransformer
        : lang === "marko"
          ? undefined
          : tsxTransformer;

  const [html, darkHtml] = await Promise.all([
    codeToHtml(code, {
      theme: "github-light",
      lang: shikiLang,
      ...(transformer ? { transformers: [transformer] } : {}),
    }),
    codeToHtml(code, {
      theme: "github-dark",
      lang: shikiLang,
      ...(transformer ? { transformers: [transformer] } : {}),
    }),
  ]);

  return { html, darkHtml };
}
