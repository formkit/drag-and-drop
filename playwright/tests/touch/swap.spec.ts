import { test, expect, Page } from "@playwright/test";
import { touchDrop } from "../../utils";

let page: Page;

test.beforeEach(async ({ browser }) => {
  page = await browser.newPage();
});

test.describe("Touch swap", async () => {
  test("Touch swap", async () => {
    await page.goto("http://localhost:3001/swap");
    await new Promise((r) => setTimeout(r, 1000));
    await touchDrop(page, {
      originEl: { id: "Apple", position: "center" },
      destinationEl: { id: "Banana", position: "center" },
      dragStart: true,
    });
    // await expect(page.locator("#Apple")).not.toHaveClass("item yellow");
    // await expect(page.locator("#Banana")).toHaveClass("item yellow");
    await expect(page.locator("#values_1")).toHaveText("Apple Banana Orange");
    await touchDrop(page, {
      originEl: { id: "Apple", position: "center" },
      destinationEl: { id: "Banana", position: "center" },
      drop: true,
    });
    await expect(page.locator("#values_1")).toHaveText("Banana Apple Orange");
  });
});
