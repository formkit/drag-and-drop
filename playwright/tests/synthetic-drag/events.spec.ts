import { test, expect, Page } from "@playwright/test";
import { syntheticDrag } from "../../utils";

let page: Page;

test.beforeEach(async ({ browser }) => {
  page = await browser.newPage();
});

test.describe("Synthetic drag events", async () => {
  test("onDragstart callback fires when synth drag starts", async () => {
    await page.goto("http://localhost:3001/synthetic-drag-events");
    await new Promise((r) => setTimeout(r, 1000));

    await syntheticDrag(page, {
      originEl: { id: "Apple", position: "center" },
      destinationEl: { id: "Banana", position: "center" },
      dragStart: true,
    });

    await expect(page.locator("#dragstart_count")).toHaveText("1");
    await expect(page.locator("#dragstart_value")).toHaveText("Apple");
  });
});
