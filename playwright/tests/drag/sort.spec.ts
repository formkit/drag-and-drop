import { test, expect, Page } from "@playwright/test";
import { dragDrop } from "../../utils";

let page: Page;

test.beforeAll(async ({ browser }) => {
  page = await browser.newPage();
});

test.describe.only("Sorting", async () => {
  test("Vertical drag sort", async () => {
    await page.goto("http://localhost:3001/sort/vertical");
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

  test("Uneven vertical drag sort", async () => {
    await page.goto("http://localhost:3001/sort/vertical/uneven");
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

  test("Vertical sort with animations", async () => {
    await page.goto("http://localhost:3001/sort/vertical/animations");
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

  test("Vertical sort with uneven els and animations", async () => {
    await page.goto("http://localhost:3001/sort/vertical/uneven-animations");
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
