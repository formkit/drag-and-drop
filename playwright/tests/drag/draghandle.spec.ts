import { test, expect, Page } from "@playwright/test";
import { drag } from "../../utils";

let page: Page;

test.beforeEach(async ({ browser }) => {
  page = await browser.newPage();
});

test.describe("Native drag with drag handles", async () => {
  test("Focused button handles enable dragging on the first pointerdown", async () => {
    await page.goto("http://localhost:3001/draghandle");

    const handle = page.locator("#Apple_dragHandle");
    const item = page.locator("#Apple");
    const box = await handle.boundingBox();

    expect(box).not.toBeNull();

    await page.mouse.move(box!.x + box!.width / 2, box!.y + box!.height / 2);
    await page.mouse.down();

    await expect(handle).toBeFocused();
    await expect(item).toHaveAttribute("draggable", "true");

    await page.mouse.up();
  });

  for (const target of [
    {
      name: "nested non-handle target",
      childId: "Apple_nonHandle_child",
      buttonId: "Apple_nonHandle",
    },
    {
      name: "nested ignored target",
      childId: "Apple_dragIgnore_child",
      buttonId: "Apple_dragIgnore",
    },
  ]) {
    test(`Focused ${target.name} keeps dragging disabled`, async () => {
      await page.goto("http://localhost:3001/draghandle");

      const child = page.locator(`#${target.childId}`);
      const button = page.locator(`#${target.buttonId}`);
      const item = page.locator("#Apple");
      const box = await child.boundingBox();

      expect(box).not.toBeNull();

      await page.mouse.move(box!.x + box!.width / 2, box!.y + box!.height / 2);
      await page.mouse.down();

      await expect(button).toBeFocused();
      await expect(item).toHaveAttribute("draggable", "false");

      await page.mouse.up();
    });
  }

  test("Native drag with drag handles. Should not be able to pick up item unless using drag handle", async () => {
    await page.goto("http://localhost:3001/draghandle");
    await new Promise((r) => setTimeout(r, 1000));
    // Should not be able to pick up item unless using drag handle
    await drag(page, {
      originEl: { id: "Apple", position: "center" },
      destinationEl: { id: "Banana", position: "center" },
      dragStart: true,
    });
    await expect(page.locator("#values_1")).toHaveText("Apple Banana Orange");
    // When using drag handle, should be able to pick up item and see dragging
    // class.
    await drag(page, {
      originEl: { id: "Apple_dragHandle", position: "center" },
      destinationEl: { id: "Banana", position: "center" },
      dragStart: true,
    });
    await expect(page.locator("#values_1")).toHaveText("Banana Apple Orange");
  });
});
