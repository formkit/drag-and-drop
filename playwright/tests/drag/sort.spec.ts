import { test, expect, Page } from "@playwright/test";
import { dragDrop } from "../../utils";

let page: Page;

test.beforeAll(async ({ browser }) => {
  page = await browser.newPage();
  await page.goto("http://localhost:3001/sort");
});

test.describe("Sorting", async () => {
  test("Drag sort works as expected.", async () => {
    await dragDrop(page, {
      origin: "#Apple",
      destination: "#Banana",
      dragStart: true,
      drop: false,
    });
    await expect(page.locator("#sort_values")).toHaveText(
      "Banana Apple Orange"
    );
    await dragDrop(page, {
      origin: "#Banana",
      destination: "#Orange",
      dragStart: false,
      drop: true,
    });
    await expect(page.locator("#sort_values")).toHaveText(
      "Banana Orange Apple"
    );
    await dragDrop(page, {
      origin: "#Banana",
      destination: "#Orange",
      dragStart: true,
      drop: false,
    });
    await expect(page.locator("#sort_values")).toHaveText(
      "Orange Banana Apple"
    );
    await dragDrop(page, {
      origin: "#Banana",
      destination: "#Apple",
      dragStart: false,
      drop: true,
    });
    await expect(page.locator("#sort_values")).toHaveText(
      "Orange Apple Banana"
    );
  });
});
