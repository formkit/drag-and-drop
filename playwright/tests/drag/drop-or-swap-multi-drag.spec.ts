import { test, expect, Page } from "@playwright/test";
import { drag, selectNode } from "../../utils";

let page: Page;

let count: number;

test.beforeEach(async ({ browser }) => {
  page = await browser.newPage();
});

test.describe("Place plugin with multi drag", async () => {
  test("Test #1", async () => {
    await page.goto("http://localhost:3001/drop-or-swap/multi-drag");
    await new Promise((r) => setTimeout(r, 1000));

    await selectNode(page, { id: "Apple" });
    await expect(page.locator("#Apple")).toHaveClass("item selected");
    await selectNode(page, { id: "Banana", shiftKey: true });
    await expect(page.locator("#Apple")).toHaveClass("item selected");
    await expect(page.locator("#Banana")).toHaveClass("item selected");

    await drag(page, {
      originEl: { id: "Apple", position: "center" },
      destinationEl: { id: "Onion", position: "center" },
      dragStart: true,
      drop: true,
    });

    await expect(page.locator("#values_1")).toHaveText("Orange");
    await expect(page.locator("#values_2")).toHaveText(
      "Tomato Potato Apple Banana Onion"
    );
  });
});
