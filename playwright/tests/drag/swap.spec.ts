import { test, expect, Page } from "@playwright/test";
import { drag } from "../../utils";

let page: Page;

test.beforeEach(async ({ browser }) => {
  page = await browser.newPage();
});

test.describe.skip("Drag swap", async () => {
  test.only("Drag swap", async () => {
    await page.goto("http://localhost:3001/swap");
    await new Promise((r) => setTimeout(r, 1000));
    await drag(page, {
      originEl: { id: "Apple", position: "center" },
      destinationEl: { id: "Banana", position: "center" },
      dragStart: true,
    });
    await expect(page.locator("#values_1")).toHaveText("Apple Banana Orange");
    await drag(page, {
      originEl: { id: "Banana", position: "center" },
      destinationEl: { id: "Banana", position: "center" },
      drop: true,
    });
    await expect(page.locator("#values_1")).toHaveText("Banana Apple Orange");
  });
});
