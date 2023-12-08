import { test, expect, Page } from "@playwright/test";
import { dragDrop } from "../utils";

let page: Page;

test.beforeEach(async ({ browser }) => {
  page = await browser.newPage();
  await page.goto("http://localhost:3000/tests/transfer");
});

// TESTS TRANSFER ACTIONS BETWEEN PARENTS
test.describe("TESTS TRANSFER ACTIONS BETWEEN PARENTS", () => {
  test("Moving item 'Apple' to list 2, then moving Apple back to list 1.", async () => {
    await dragDrop(page, {
      origin: "#Apple",
      destination: "#second_list_values",
      dragStart: true,
      drop: false,
    });
    await expect(page.locator("#first_list_values")).toHaveValue(
      "Banana Orange"
    );
    await expect(page.locator("#first_list .item")).toHaveCount(2);
    await expect(page.locator("#second_list_values")).toHaveValue(
      "Pear Strawberry Apple"
    );
    await expect(page.locator("#second_list .item")).toHaveCount(3);
    await dragDrop(page, {
      origin: "#Apple",
      destination: "#first_list_values",
      dragStart: false,
      drop: false,
    });
    await expect(page.locator("#first_list_values")).toHaveValue(
      "Apple Banana Orange"
    );
    await expect(page.locator("#first_list .item")).toHaveCount(3);
    await expect(page.locator("#first_list #Apple")).toBeVisible();
    await expect(page.locator("#second_list_values")).toHaveValue(
      "Pear Strawberry"
    );
    await expect(page.locator("#second_list .item")).toHaveCount(2);
  });

  test("Moving item 'Apple' to list 2, then moving Apple to list 3, then moving Apple to list 2, then moving Apple to list 1.", async () => {
    // Drag start apple and drag to banana
    await dragDrop(page, {
      origin: "#Apple",
      destination: "#second_list_values",
      dragStart: true,
      drop: false,
    });
    await expect(page.locator("#first_list_values")).toHaveValue(
      "Banana Orange"
    );
    await expect(page.locator("#first_list .item")).toHaveCount(2);
    await expect(page.locator("#second_list_values")).toHaveValue(
      "Pear Strawberry Apple"
    );
    await expect(page.locator("#second_list .item")).toHaveCount(3);
    await dragDrop(page, {
      origin: "#Apple",
      destination: "#third_list_values",
      dragStart: false,
      drop: false,
    });
    await expect(page.locator("#first_list_values")).toHaveValue(
      "Banana Orange"
    );
    await expect(page.locator("#first_list .item")).toHaveCount(2);
    await expect(page.locator("#second_list_values")).toHaveValue(
      "Pear Strawberry"
    );
    await expect(page.locator("#second_list .item")).toHaveCount(2);
    await expect(page.locator("#third_list_values")).toHaveValue(
      "Peach Grape Apple"
    );
    await expect(page.locator("#third_list .item")).toHaveCount(3);
    await dragDrop(page, {
      origin: "#Apple",
      destination: "#second_list_values",
      dragStart: false,
      drop: false,
    });
    await expect(page.locator("#first_list_values")).toHaveValue(
      "Banana Orange"
    );
    await expect(page.locator("#first_list .item")).toHaveCount(2);
    await expect(page.locator("#first_list #Apple")).toBeHidden();
    await expect(page.locator("#second_list_values")).toHaveValue(
      "Pear Strawberry Apple"
    );
    await expect(page.locator("#second_list .item")).toHaveCount(3);
    await expect(page.locator("#third_list_values")).toHaveValue("Peach Grape");
    await expect(page.locator("#third_list .item")).toHaveCount(2);
    await dragDrop(page, {
      origin: "#Apple",
      destination: "#first_list_values",
      dragStart: false,
      drop: false,
    });
    await expect(page.locator("#first_list_values")).toHaveValue(
      "Apple Banana Orange"
    );
    await expect(page.locator("#first_list .item")).toHaveCount(3);
    await expect(page.locator("#first_list #Apple")).toBeVisible();
    await expect(page.locator("#second_list_values")).toHaveValue(
      "Pear Strawberry"
    );
    await expect(page.locator("#second_list .item")).toHaveCount(2);
    await expect(page.locator("#third_list_values")).toHaveValue("Peach Grape");
    await expect(page.locator("#third_list .item")).toHaveCount(2);
  });

  test("Moving 'Apple' to second list and dropping. Moving Apple to third list and dropping. Moving Apple to second list and dropping. Moving Apple to first list and dropping.", async () => {
    await dragDrop(page, {
      origin: "#Apple",
      destination: "#second_list_values",
      dragStart: true,
      drop: true,
    });
    await expect(page.locator("#first_list_values")).toHaveValue(
      "Banana Orange"
    );
    await expect(page.locator("#first_list .item")).toHaveCount(2);
    await expect(page.locator("#second_list_values")).toHaveValue(
      "Pear Strawberry Apple"
    );
    await expect(page.locator("#second_list .item")).toHaveCount(3);
    await dragDrop(page, {
      origin: "#Apple",
      destination: "#third_list_values",
      dragStart: true,
      drop: true,
    });
    await expect(page.locator("#first_list_values")).toHaveValue(
      "Banana Orange"
    );
    await expect(page.locator("#first_list .item")).toHaveCount(2);
    await expect(page.locator("#second_list_values")).toHaveValue(
      "Pear Strawberry"
    );
    await expect(page.locator("#second_list .item")).toHaveCount(2);
    await expect(page.locator("#third_list_values")).toHaveValue(
      "Peach Grape Apple"
    );
    await expect(page.locator("#third_list .item")).toHaveCount(3);
    await dragDrop(page, {
      origin: "#Apple",
      destination: "#second_list_values",
      dragStart: true,
      drop: true,
    });
    await expect(page.locator("#first_list_values")).toHaveValue(
      "Banana Orange"
    );
    await expect(page.locator("#first_list .item")).toHaveCount(2);
    await expect(page.locator("#second_list_values")).toHaveValue(
      "Pear Strawberry Apple"
    );
    await expect(page.locator("#second_list .item")).toHaveCount(3);
    await expect(page.locator("#third_list_values")).toHaveValue("Peach Grape");
    await expect(page.locator("#third_list .item")).toHaveCount(2);
    await dragDrop(page, {
      origin: "#Apple",
      destination: "#first_list_values",
      dragStart: true,
      drop: true,
    });
    await expect(page.locator("#first_list_values")).toHaveValue(
      "Banana Orange Apple"
    );
    await expect(page.locator("#first_list .item")).toHaveCount(3);
    await expect(page.locator("#second_list_values")).toHaveValue(
      "Pear Strawberry"
    );
    await expect(page.locator("#second_list .item")).toHaveCount(2);
    await expect(page.locator("#third_list_values")).toHaveValue("Peach Grape");
    await expect(page.locator("#third_list .item")).toHaveCount(2);
  });

  test("Resetting the third and second list and removing the dropZone plugin will prevent the first list from transferring items to them", async () => {
    await page.locator("#reset").click();
    await expect(page.locator("#first_list_values")).toHaveValue(
      "Apple Banana Orange"
    );
    await dragDrop(page, {
      origin: "#Apple",
      destination: "#second_list_values",
      dragStart: true,
      drop: true,
    });
    await expect(page.locator("#first_list_values")).toHaveValue(
      "Apple Banana Orange"
    );
  });
});
