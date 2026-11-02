import { test, expect, Page } from "@playwright/test";
import { drag } from "../../utils";

let page: Page;

test.beforeEach(async ({ browser }) => {
  page = await browser.newPage();
});

test.describe("Sorting deep-equal values (formkit/formkit#1754)", async () => {
  test("dragging one of two identical items keeps both", async () => {
    await page.goto("http://localhost:3001/sort/duplicates");
    await new Promise((r) => setTimeout(r, 1000));
    await drag(page, {
      originEl: { id: "item-0", position: "center" },
      destinationEl: { id: "item-2", position: "center" },
      dragStart: true,
      drop: true,
    });
    await expect(page.locator("#sort_values")).toHaveText("one two one");
    await expect(page.locator("#test li")).toHaveCount(3);
  });
});
