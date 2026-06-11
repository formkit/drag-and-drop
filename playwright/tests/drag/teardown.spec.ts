import { test, expect, Page } from "@playwright/test";
import { syntheticDrag } from "../../utils";

let page: Page;
let pageErrors: string[];

test.beforeEach(async ({ browser }) => {
  page = await browser.newPage();
  pageErrors = [];
  page.on("pageerror", (err) => pageErrors.push(String(err)));
  // Framework error handlers (Vue/Nuxt) can swallow the exception before it
  // becomes an uncaught pageerror — capture console errors as well.
  page.on("console", (msg) => {
    if (msg.type() === "error") pageErrors.push(msg.text());
  });
  await page.goto("http://localhost:3001/teardown");
  await new Promise((r) => setTimeout(r, 1000));
});

function touchEventProps(x: number, y: number, extra: object = {}) {
  return {
    bubbles: true,
    cancelable: true,
    composed: true,
    clientX: x,
    clientY: y,
    pointerId: 1,
    pointerType: "touch",
    ...extra,
  };
}

test.describe("Teardown mid-interaction (#145)", async () => {
  test("unmounting the list between pointerdown and pointermove does not throw", async () => {
    // Press an item (touch), as if the user is about to drag.
    await page.evaluate(() => {
      const el = document.getElementById("Apple");
      if (!el) throw new Error("missing item");
      const rect = el.getBoundingClientRect();
      el.dispatchEvent(
        new PointerEvent("pointerdown", {
          bubbles: true,
          cancelable: true,
          composed: true,
          button: 0,
          buttons: 1,
          clientX: rect.x + rect.width / 2,
          clientY: rect.y + rect.height / 2,
          pointerId: 1,
          pointerType: "touch",
        })
      );
    });

    // The component unmounts mid-press (e.g. a route change or state-driven
    // v-if). Programmatic click: a real pointer click would release the held
    // pointer and end the interaction we're testing.
    await page.locator("#toggle").evaluate((el) => (el as HTMLElement).click());
    await expect(page.locator("#teardown_values")).toBeHidden();

    // The held pointer moves: the document-level handler must not try to
    // start a synthetic drag against the unmounted list.
    await page.evaluate(() => {
      document.dispatchEvent(
        new PointerEvent("pointermove", {
          bubbles: true,
          cancelable: true,
          composed: true,
          buttons: 1,
          clientX: 200,
          clientY: 200,
          pointerId: 1,
          pointerType: "touch",
        })
      );
    });
    await new Promise((r) => setTimeout(r, 300));

    expect(pageErrors).toEqual([]);

    // Remounting yields a fully functional list again.
    await page.locator("#toggle").evaluate((el) => (el as HTMLElement).click());
    await expect(page.locator("#teardown_values")).toHaveText(
      "Apple Banana Orange"
    );
    await syntheticDrag(page, {
      originEl: { id: "Apple", position: "center" },
      destinationEl: { id: "Banana", position: "center" },
      dragStart: true,
      drop: true,
    });
    await expect(page.locator("#teardown_values")).toHaveText(
      "Banana Apple Orange"
    );
    expect(pageErrors).toEqual([]);
  });
});
