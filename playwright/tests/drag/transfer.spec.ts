import { test, expect, Page } from "@playwright/test";
import { dragDrop } from "../../utils";

let page: Page;

test.beforeAll(async ({ browser }) => {
  page = await browser.newPage();
  await page.goto("http://localhost:3001/transfer");
});

test.describe("Transferring", async () => {
  test("Drag transferring works as expected.", async () => {
    await new Promise((r) => setTimeout(r, 1000));
    await dragDrop(page, {
      originEl: {
        id: "Apple",
        position: "center",
      },
      destinationEl: { id: "values_2", position: "center" },
      dragStart: true,
      drop: false,
    });
    await expect(page.locator("#values_1")).toHaveText("Banana Orange");
    await expect(page.locator("#values_2")).toHaveText(
      "Cherry Grape Pineapple Apple"
    );
    await dragDrop(page, {
      originEl: {
        id: "Apple",
        position: "center",
      },
      destinationEl: { id: "values_3", position: "center" },
      drop: true,
    });
    await expect(page.locator("#values_2")).toHaveText(
      "Cherry Grape Pineapple"
    );
    await expect(page.locator("#values_3")).toHaveText(
      "Strawberry Watermelon Kiwi Apple"
    );
    await dragDrop(page, {
      originEl: {
        id: "Strawberry",
        position: "center",
      },
      destinationEl: {
        id: "values_2",
        position: "center",
      },

      dragStart: true,
      drop: false,
    });
    await expect(page.locator("#values_2")).toHaveText(
      "Cherry Grape Pineapple Strawberry"
    );
    await expect(page.locator("#values_3")).toHaveText("Watermelon Kiwi Apple");
    await dragDrop(page, {
      originEl: {
        id: "Strawberry",
        position: "center",
      },
      destinationEl: {
        id: "values_1",
        position: "center",
      },
    });
    await expect(page.locator("#values_1")).toHaveText(
      "Banana Orange Strawberry"
    );
    await expect(page.locator("#values_2")).toHaveText(
      "Cherry Grape Pineapple"
    );
  });
});
