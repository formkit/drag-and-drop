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

  async function replaceImports(fileName) {
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
