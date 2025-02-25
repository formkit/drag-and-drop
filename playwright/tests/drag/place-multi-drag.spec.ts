import { test, expect, Page } from "@playwright/test";
import { drag } from "../../utils";

let page: Page;

let count: number;

test.beforeEach(async ({ browser }) => {
  page = await browser.newPage();
});

test.describe("Place plugin with multi drag", async () => {
  test("Test #1", async () => {
    await page.goto("http://localhost:3001/place/multi-drag");
    await new Promise((r) => setTimeout(r, 1000));

    await page.locator("#Apple").click();
    await expect(page.locator("#Apple")).toHaveClass("item selected");
    await page.locator("#Banana").click({
      modifiers: ["Shift"],
    });
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
