import { test, expect, Page } from "@playwright/test";
import { touchDrop } from "../../utils";

let page: Page;

test.beforeAll(async ({ browser }) => {
  page = await browser.newPage();
  await page.goto("http://localhost:3001/sort");
});

test.describe("Sorting", async () => {
  test("Touch sort works as expected.", async () => {
    await touchDrop(page, {
      origin: "#Apple",
      destination: "#Banana",
      touchStart: true,
      drop: false,
    });
    await expect(page.locator("#sort_values")).toHaveText(
      "Banana Apple Orange"
    );
    await touchDrop(page, {
      origin: "#Apple",
      destination: "#Orange",
      touchStart: false,
      drop: true,
    });
    await expect(page.locator("#sort_values")).toHaveText(
      "Banana Orange Apple"
    );
    await touchDrop(page, {
      origin: "#Banana",
      destination: "#Orange",
      touchStart: true,
      drop: false,
    });
    await expect(page.locator("#sort_values")).toHaveText(
      "Orange Banana Apple"
    );
    await touchDrop(page, {
      origin: "#Banana",
      destination: "#Apple",
      touchStart: false,
      drop: true,
    });
    await expect(page.locator("#sort_values")).toHaveText(
      "Orange Apple Banana"
    );
  });
});
