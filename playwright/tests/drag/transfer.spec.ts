import { test, expect, Page } from "@playwright/test";
import { dragDrop } from "../../utils";

let page: Page;

test.beforeAll(async ({ browser }) => {
  page = await browser.newPage();
  await page.goto("http://localhost:3001/transfer");
});

test.describe.only("Transferring", async () => {
  test("Drag transferring works as expected.", async () => {
    await dragDrop(page, {
      origin: "#transfer_1_Apple",
      destination: "#transfer_values_2",
      dragStart: true,
      drop: false,
    });
    await expect(page.locator("#transfer_values_1")).toHaveText(
      "Banana Orange"
    );
    await expect(page.locator("#transfer_values_2")).toHaveText(
      "Cherry Grape Pineapple Apple"
    );
    await dragDrop(page, {
      origin: "#transfer_2_Apple",
      destination: "#transfer_values_3",
      drop: true,
    });
    await expect(page.locator("#transfer_values_2")).toHaveText(
      "Cherry Grape Pineapple"
    );
    await expect(page.locator("#transfer_values_3")).toHaveText(
      "Strawberry Watermelon Kiwi Apple"
    );
    await dragDrop(page, {
      origin: "#transfer_3_Strawberry",
      destination: "#transfer_values_2",
      dragStart: true,
      drop: false,
    });
    await expect(page.locator("#transfer_values_2")).toHaveText(
      "Cherry Grape Pineapple Strawberry"
    );
    await expect(page.locator("#transfer_values_3")).toHaveText(
      "Watermelon Kiwi Apple"
    );
    await dragDrop(page, {
      origin: "#transfer_2_Strawberry",
      destination: "#transfer_values_1",
      dragStart: true,
      drop: true,
    });
    await expect(page.locator("#transfer_values_1")).toHaveText(
      "Banana Orange Strawberry"
    );
    await expect(page.locator("#transfer_values_2")).toHaveText(
      "Cherry Grape Pineapple"
    );
  });
});
