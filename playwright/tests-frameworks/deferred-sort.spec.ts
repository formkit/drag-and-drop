import { test, expect, Page } from "@playwright/test";
import { resolve } from "path";

let page: Page;

// Vite serves repo files at /@fs/<absolute path>; resolve the library entry
// from the repo root (playwright runs from the config directory) so the
// import works on any machine (CI included).
const libraryModuleUrl = `/@fs${resolve(process.cwd(), "src/index.ts")}`;

test.beforeAll(async ({ browser }) => {
  page = await browser.newPage();
  await page.goto("http://127.0.0.1:5173/");
});

interface ProbeEntry {
  rendered: string;
  registered: string | null;
}

interface ProbeResult {
  midDrag: Array<ProbeEntry>;
  settled: Array<ProbeEntry>;
  values: string;
}

/**
 * Regression for #169: when framework commits lag behind the values array
 * (React renders are async — Test4 defers its commits by 50ms), remapping
 * mid-drag must not reassign node identities. Every registered node must
 * keep the value it visibly renders; pairing values onto stale DOM
 * positionally attaches wrong values/indices and corrupts subsequent sorts.
 *
 * The probe runs as a string-evaluated script: Playwright's transpilation
 * of function arguments rewrites dynamic import(), which must reach the
 * browser untouched to load the library module instance Vite serves.
 */
test.describe("React deferred renders during drag (#169)", async () => {
  test("node identities survive sorts while commits lag", async () => {
    const id = "react_deferred_sort";

    const script = `(async () => {
      const mod = await import(${JSON.stringify(libraryModuleUrl)});
      const id = ${JSON.stringify(id)};

      const byId = (v) => document.getElementById(id + "_" + v);
      const dataTransfer = new DataTransfer();
      const props = (el) => {
        const rect = el.getBoundingClientRect();
        return {
          bubbles: true,
          cancelable: true,
          clientX: rect.x + rect.width / 2,
          clientY: rect.y + rect.height / 2,
          dataTransfer,
        };
      };

      const probe = () =>
        Array.from(document.querySelectorAll("#" + id + " .item")).map(
          (el) => ({
            rendered: (el.textContent ?? "").trim(),
            registered: mod.nodes.get(el)?.value ?? null,
          })
        );

      // Keep the list away from the viewport edges: dragovers near an edge
      // engage auto-scroll, which sets preventEnter and swallows sorts.
      document.getElementById(id).scrollIntoView({ block: "center" });
      await new Promise((r) => setTimeout(r, 200));

      const dragged = byId("one");
      dragged.dispatchEvent(new DragEvent("dragstart", props(dragged)));
      // Wait out the preventEnter window that follows dragstart.
      await new Promise((r) => setTimeout(r, 250));

      // Sort #1: values update immediately, the commit lands 50ms later.
      // Sort #2 races the pending commit: the remap inside performSort runs
      // against stale DOM. Double dragover each time: the first after a
      // remap is swallowed by remapJustFinished.
      for (const v of ["three", "five"]) {
        const el = byId(v);
        el.dispatchEvent(new DragEvent("dragover", props(el)));
        el.dispatchEvent(new DragEvent("dragover", props(el)));
        await new Promise((r) => setTimeout(r, 20));
      }

      // Inspect node identities inside the mispair window, before the
      // deferred commit re-syncs the DOM.
      const midDrag = probe();

      // Finish the drag and let all commits settle.
      const last = byId("five");
      last.dispatchEvent(new DragEvent("drop", props(last)));
      document.dispatchEvent(new DragEvent("dragend", props(last)));
      await new Promise((r) => setTimeout(r, 600));

      const settled = probe();

      const values =
        document.getElementById(id + "_values")?.textContent ?? "";

      return { midDrag, settled, values };
    })()`;

    const result = (await page.evaluate(script)) as ProbeResult;

    // The invariant under test: a node never carries a value other than
    // the one it renders, even while the DOM lags the values array.
    for (const { rendered, registered } of result.midDrag) {
      expect(registered).toBe(rendered);
    }
    for (const { rendered, registered } of result.settled) {
      expect(registered).toBe(rendered);
    }

    // And the drag itself lands where the user hovered last.
    expect(result.values).toBe("two three four five one");
  });
});
