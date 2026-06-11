import { test, expect, Page } from "@playwright/test";

let page: Page;

test.beforeAll(async ({ browser }) => {
  page = await browser.newPage();
  await page.goto("http://127.0.0.1:5173/");
});

/**
 * Regression for #169: when framework commits lag behind the values array
 * (React renders are async — Test4 defers its commits by 50ms), remapping
 * mid-drag must not reassign node identities. Every registered node must
 * keep the value it visibly renders; pairing values onto stale DOM
 * positionally attaches wrong values/indices and corrupts subsequent sorts.
 */
test.describe("React deferred renders during drag (#169)", async () => {
  test("node identities survive sorts while commits lag", async () => {
    const id = "react_deferred_sort";

    const result = await page.evaluate(async (id) => {
      const mod = await import(
        /* @vite-ignore */
        "/@fs/" +
          // eslint-disable-next-line no-useless-concat
          "Users/justinschroeder/Projects/formkit-coordinator/.dmux/worktrees/drag-drop-review/drag-and-drop/src/index.ts"
      );

      const byId = (v: string) => document.getElementById(`${id}_${v}`)!;
      const dataTransfer = new DataTransfer();
      const props = (el: Element) => {
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
        Array.from(
          document.querySelectorAll(`#${id} .item`)
        ).map((el) => ({
          rendered: (el.textContent ?? "").trim(),
          registered: mod.nodes.get(el)?.value ?? null,
        }));

      // Keep the list away from the viewport edges: dragovers near an edge
      // engage auto-scroll, which sets preventEnter and swallows sorts.
      document.getElementById(id)!.scrollIntoView({ block: "center" });
      await new Promise((r) => setTimeout(r, 200));

      const dragged = byId("one");
      dragged.dispatchEvent(new DragEvent("dragstart", props(dragged)));
      // Wait out the preventEnter window that follows dragstart.
      await new Promise((r) => setTimeout(r, 250));

      // Sort #1: values update immediately, the commit lands 50ms later.
      const t1 = byId("three");
      t1.dispatchEvent(new DragEvent("dragover", props(t1)));
      t1.dispatchEvent(new DragEvent("dragover", props(t1)));

      // Sort #2 races the pending commit: the remap inside performSort runs
      // against stale DOM.
      await new Promise((r) => setTimeout(r, 20));
      const t2 = byId("five");
      t2.dispatchEvent(new DragEvent("dragover", props(t2)));
      t2.dispatchEvent(new DragEvent("dragover", props(t2)));

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
        document.getElementById(`${id}_values`)?.textContent ?? "";

      return { midDrag, settled, values };
    }, id);

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
