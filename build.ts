import { build } from "tsup";
import { fileURLToPath } from "url";
import { resolve, dirname } from "pathe";
import { readFile, writeFile, copyFile, mkdir } from "fs/promises";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

(async function buildItAll() {
  // Build the main entry
  await build({
    entry: ["src/index.ts"],
    format: ["cjs", "esm"],
    splitting: false,
    sourcemap: true,
    clean: true,
    dts: true,
    outDir: "dist",
    outExtension: ({ format }) => ({ js: format === "cjs" ? ".cjs" : ".mjs" }),
  });

  // Build the vue entry
  await build({
    entry: ["src/vue/index.ts"],
    format: ["cjs", "esm"],
    external: ["vue", "../index", "../utils"],
    splitting: false,
    sourcemap: true,
    clean: true,
    dts: true,
    outDir: "dist/vue",
    outExtension: ({ format }) => ({ js: format === "cjs" ? ".cjs" : ".mjs" }),
  });

  // Build the react entry
  await build({
    entry: ["src/react/index.ts"],
    format: ["cjs", "esm"],
    external: ["react", "react-dom", "../index", "../utils"],
    splitting: false,
    sourcemap: true,
    clean: true,
    dts: true,
    outDir: "dist/react",
    outExtension: ({ format }) => ({ js: format === "cjs" ? ".cjs" : ".mjs" }),
  });

  // Build the solid entry
  await build({
    entry: ["src/solid/index.ts"],
    format: ["cjs", "esm"],
    external: ["solid-js", "../index", "../utils"],
    splitting: false,
    sourcemap: true,
    clean: true,
    dts: true,
    outDir: "dist/solid",
    outExtension: ({ format }) => ({ js: format === "cjs" ? ".cjs" : ".mjs" }),
  });

  async function replaceImports(fileName: string) {
    const format = fileName.endsWith("mjs") ? "mjs" : "cjs";
    const file = await readFile(resolve(__dirname, `${fileName}`), "utf8");
    const updatedFile = file.replace(
      /\.\.\/(index|utils)/g,
      `../index.${format}`
    );
    await writeFile(resolve(__dirname, `${fileName}`), updatedFile, "utf8");
  }

  await replaceImports("dist/vue/index.mjs");
  await replaceImports("dist/vue/index.cjs");
  await replaceImports("dist/react/index.mjs");
  await replaceImports("dist/react/index.cjs");
  await replaceImports("dist/solid/index.mjs");
  await replaceImports("dist/solid/index.cjs");

  // Marko — distribute as source, no compilation step needed.
  // .marko files are compiled by the consumer's bundler (@marko/vite, @marko/webpack).
  // "../index" in dnd.marko resolves to dist/index.mjs at consumer build time.
  console.log("Copying Marko integration...");
  const markoDistTagsDir = resolve(__dirname, "dist/tags");
  await mkdir(markoDistTagsDir, { recursive: true });
  await copyFile(
    resolve(__dirname, "src/marko/dnd.marko"),
    resolve(markoDistTagsDir, "dnd.marko")
  );
  // marko.json at dist root enables <dnd> auto-discovery in consuming projects.
  // "tags-dir" is the correct key (confirmed from @marko/vite fixture packages).
  await writeFile(
    resolve(__dirname, "dist/marko.json"),
    JSON.stringify({ "tags-dir": "./tags", "script-lang": "ts" }, null, 2),
    "utf8"
  );

  console.log("Rewriting package.json...");

  const packageJson = {
    name: "@formkit/drag-and-drop",
    ...JSON.parse(await readFile(resolve(__dirname, `package.json`), "utf8")),
  };
  delete packageJson.devDependencies;
  delete packageJson.private;
  const updatedFile = JSON.stringify(packageJson, null, 2);
  await writeFile(
    resolve(__dirname, `./dist/package.json`),
    updatedFile,
    "utf8"
  );

  console.log("Copy README.md and LICENSE");
  await writeFile(
    resolve(__dirname, `./dist/README.md`),
    await readFile(resolve(__dirname, `./README.md`), "utf8"),
    "utf8"
  );
  await writeFile(
    resolve(__dirname, `./dist/LICENSE`),
    await readFile(resolve(__dirname, `./LICENSE`), "utf8"),
    "utf8"
  );
})();
