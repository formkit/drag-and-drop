import { test, expect, Page } from "@playwright/test";

let page: Page;

test.beforeEach(async ({ browser }) => {
  page = await browser.newPage();
});

/**
 * Regression for https://github.com/formkit/drag-and-drop/issues/206
 *
 * When a native-draggable child (e.g. <img>, <a>) inside a draggable list
 * item triggers a native dragend on its parent without the library ever
 * observing a corresponding dragstart, the global state is still in its
 * post-resetState() form: state.draggedNodes is undefined. handleEnd used
 * to dereference it directly and threw a TypeError at src/index.ts#L1976.
 */
test.describe("Issue #206", async () => {
  test("handleEnd should not throw when a native dragend fires on a draggable node without a prior dragstart", async () => {
    const errors: string[] = [];
    page.on("pageerror", (err) => {
      errors.push(err.message);
    });
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });

    await page.goto("http://localhost:3001/issue-206");
    await new Promise((r) => setTimeout(r, 1000));

    // Dispatch a native dragend directly on the draggable <li>, simulating a
    // browser-fired dragend that is unrelated to the library's drag pipeline
    // (no preceding dragstart was observed by handleDragstart).
    await page.evaluate(() => {
      const target = document.getElementById("Apple") as HTMLElement;
      if (!target) throw new Error("Apple node not found");
      const rect = target.getBoundingClientRect();
      const eventProps = {
        bubbles: false,
        cancelable: true,
        clientX: rect.x + rect.width / 2,
        clientY: rect.y + rect.height / 2,
        screenX: rect.x + rect.width / 2,
        screenY: rect.y + rect.height / 2,
      };
      target.dispatchEvent(new DragEvent("dragend", eventProps));
    });

    // Give the handler a tick to run.
    await new Promise((r) => setTimeout(r, 250));

    // The library must not have thrown a TypeError due to state.draggedNodes
    // being undefined when handleEnd executed.
    const offending = errors.filter((m) =>
      /Cannot read propert(y|ies) (of null|of undefined|\(reading 'map'\))/.test(
        m
      )
    );
    expect(offending).toEqual([]);
  });
});
