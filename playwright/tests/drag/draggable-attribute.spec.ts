import { test, expect, Page } from "@playwright/test";

let page: Page;

test.beforeEach(async ({ browser }) => {
  page = await browser.newPage();
});

test.describe("draggable attribute sync", async () => {
  test("with a drag handle, items are only draggable while pressing the handle (#139)", async () => {
    await page.goto("http://localhost:3001/draghandle");
    await new Promise((r) => setTimeout(r, 1000));

    await expect(page.locator("#Apple")).toHaveAttribute(
      "draggable",
      "false"
    );

    // Real pointer press on the handle arms native dragging.
    const handle = page.locator("#Apple_dragHandle");
    const box = await handle.boundingBox();
    if (!box) throw new Error("handle not visible");
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.down();
    await expect(page.locator("#Apple")).toHaveAttribute("draggable", "true");

    // Releasing disarms it again.
    await page.mouse.up();
    await expect(page.locator("#Apple")).toHaveAttribute("draggable", "false");
  });

  test("text inside items with drag handles is selectable (#139)", async () => {
    await page.goto("http://localhost:3001/draghandle");
    await new Promise((r) => setTimeout(r, 1000));

    const text = page.locator("#Apple .item-text");
    const box = await text.boundingBox();
    if (!box) throw new Error("item text not visible");

    await page.mouse.move(box.x + 2, box.y + box.height / 2);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width - 2, box.y + box.height / 2, {
      steps: 5,
    });
    await page.mouse.up();

    const selection = await page.evaluate(
      () => window.getSelection()?.toString() ?? ""
    );
    expect(selection.length).toBeGreaterThan(0);
  });

  test("elements excluded by the draggable callback lose the attribute (#96)", async () => {
    await page.goto("http://localhost:3001/sort/draggable-toggle");
    await new Promise((r) => setTimeout(r, 1000));

    await expect(page.locator("#Apple")).toHaveAttribute("draggable", "true");

    await page.locator("#disable_dragging").click();

    await expect(page.locator("#Apple")).toHaveAttribute("draggable", "false");
    await expect(page.locator("#Banana")).toHaveAttribute(
      "draggable",
      "false"
    );

    await page.locator("#enable_dragging").click();

    await expect(page.locator("#Apple")).toHaveAttribute("draggable", "true");
  });
});
