import { test, expect, Page } from "@playwright/test";
import { dragDrop } from "../../utils";

let page: Page;

test.beforeAll(async ({ browser }) => {
  page = await browser.newPage();
  await page.goto("http://localhost:3001/sort/vertical");
});

test.describe("Sorting", async () => {
  test.only("Vertical drag sort works as expected.", async () => {
    await dragDrop(page, {
      originEl: { id: "Apple", position: "center" },
      destinationEl: { id: "Banana", position: "center" },
      dragStart: true,
    });
    await expect(page.locator("#sort_values")).toHaveText(
      "Banana Apple Orange"
    );
    await dragDrop(page, {
      originEl: { id: "Banana", position: "center" },
      destinationEl: { id: "Orange", position: "center" },
      drop: true,
    });
    await expect(page.locator("#sort_values")).toHaveText(
      "Banana Orange Apple"
    );
    await dragDrop(page, {
      originEl: { id: "Banana", position: "center" },
      destinationEl: { id: "Orange", position: "center" },
      dragStart: true,
    });
    await expect(page.locator("#sort_values")).toHaveText(
      "Orange Banana Apple"
    );
    await dragDrop(page, {
      originEl: { id: "Banana", position: "center" },
      destinationEl: { id: "Apple", position: "center" },
    });
    await expect(page.locator("#sort_values")).toHaveText(
      "Orange Apple Banana"
    );
  });
});
