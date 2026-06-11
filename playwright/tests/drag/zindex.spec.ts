import { test, expect, Page } from "@playwright/test";
import { drag } from "../../utils";

let page: Page;

test.beforeEach(async ({ browser }) => {
  page = await browser.newPage();
});

test.describe("Dragged node z-index", async () => {
  test("inline z-index is restored after drag ends (#154)", async () => {
    await page.goto("http://localhost:3001/sort");
    await new Promise((r) => setTimeout(r, 1000));
    await drag(page, {
      originEl: { id: "Apple", position: "center" },
      destinationEl: { id: "Banana", position: "center" },
      dragStart: true,
      drop: true,
    });
    await expect(page.locator("#sort_values")).toHaveText(
      "Banana Apple Orange"
    );
    const zIndex = await page.evaluate(
      () => document.getElementById("Apple")?.style.zIndex
    );
    expect(zIndex).toBe("");
  });
});
