import { test, expect, Page } from "@playwright/test";
import { syntheticDrag } from "../../utils";

let page: Page;
let pageErrors: string[];

test.beforeEach(async ({ browser }) => {
  page = await browser.newPage();
  pageErrors = [];
  page.on("pageerror", (err) => pageErrors.push(String(err)));
});

async function holdPointer(page: Page, id: string, ms: number) {
  await page.evaluate((id) => {
    const el = document.getElementById(id);
    if (!el) throw new Error(`Element not found: ${id}`);
    const rect = el.getBoundingClientRect();
    const x = rect.x + rect.width / 2;
    const y = rect.y + rect.height / 2;
    el.dispatchEvent(
      new PointerEvent("pointerdown", {
        bubbles: true,
        cancelable: true,
        composed: true,
        button: 0,
        buttons: 1,
        clientX: x,
        clientY: y,
        pointerId: 1,
        pointerType: "touch",
        screenX: x,
        screenY: y,
      })
    );
  }, id);
  await new Promise((r) => setTimeout(r, ms));
}

async function releasePointer(page: Page, id: string) {
  await page.evaluate((id) => {
    const el = document.getElementById(id);
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.dispatchEvent(
      new PointerEvent("pointerup", {
        bubbles: true,
        cancelable: true,
        composed: true,
        button: 0,
        buttons: 0,
        clientX: rect.x + rect.width / 2,
        clientY: rect.y + rect.height / 2,
        pointerId: 1,
        pointerType: "touch",
      })
    );
  }, id);
}

test.describe("Long press config (#173)", async () => {
  test("a long hold with longPress disabled is a no-op", async () => {
    await page.goto("http://localhost:3001/sort/longpress-disabled");
    await new Promise((r) => setTimeout(r, 1000));

    // Hold past the default longPressDuration (1000ms) without moving.
    await holdPointer(page, "Apple", 1300);

    // The long press timer must not have fired: no long press class, no
    // uncaught errors.
    await expect(page.locator("#Apple")).not.toHaveClass(/long-press/);
    expect(pageErrors).toEqual([]);

    await releasePointer(page, "Apple");

    // Dragging afterwards still works normally.
    await syntheticDrag(page, {
      originEl: { id: "Apple", position: "center" },
      destinationEl: { id: "Banana", position: "center" },
      dragStart: true,
      drop: true,
    });
    await expect(page.locator("#sort_values")).toHaveText(
      "Banana Apple Orange"
    );
    expect(pageErrors).toEqual([]);
  });

  test("longPress: true still applies the class and drags after the hold", async () => {
    await page.goto("http://localhost:3001/sort/longpress");
    await new Promise((r) => setTimeout(r, 1000));

    await holdPointer(page, "Apple", 1300);

    await expect(page.locator("#Apple")).toHaveClass(/long-press/);

    await releasePointer(page, "Apple");

    // A drag that includes the hold works end to end.
    await holdPointer(page, "Apple", 1300);
    await syntheticDrag(page, {
      originEl: { id: "Apple", position: "center" },
      destinationEl: { id: "Banana", position: "center" },
      drop: true,
    });
    await expect(page.locator("#sort_values")).toHaveText(
      "Banana Apple Orange"
    );
    expect(pageErrors).toEqual([]);
  });
});
