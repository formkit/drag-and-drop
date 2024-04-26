import { test, expect, Page } from "@playwright/test";
import { dragDrop } from "../../utils";

let page: Page;

test.beforeEach(async ({ browser }) => {
  page = await browser.newPage();
});

test.describe("Sorting", async () => {
  test.only("Drag sort", async () => {
    await page.goto("http://localhost:3001/swap");
    // await new Promise((r) => setTimeout(r, 1000));
    // await dragDrop(page, {
    //   originEl: { id: "Apple", position: "center" },
    //   destinationEl: { id: "Banana", position: "center" },
    //   dragStart: true,
    // });
    // await expect(page.locator("#sort_values")).toHaveText(
    //   "Banana Apple Orange"
    // );
    // await dragDrop(page, {
    //   originEl: { id: "Banana", position: "center" },
    //   destinationEl: { id: "Orange", position: "center" },
    //   drop: true,
    // });
    // await expect(page.locator("#sort_values")).toHaveText(
    //   "Banana Orange Apple"
    // );
    // await dragDrop(page, {
    //   originEl: { id: "Banana", position: "center" },
    //   destinationEl: { id: "Orange", position: "center" },
    //   dragStart: true,
    // });
    // await expect(page.locator("#sort_values")).toHaveText(
    //   "Orange Banana Apple"
    // );
    // await dragDrop(page, {
    //   originEl: { id: "Banana", position: "center" },
    //   destinationEl: { id: "Apple", position: "center" },
    // });
    // await expect(page.locator("#sort_values")).toHaveText(
    //   "Orange Apple Banana"
    // );
  });
});
