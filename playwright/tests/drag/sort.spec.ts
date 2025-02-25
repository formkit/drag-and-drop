import { test, expect, Page } from "@playwright/test";
import { drag } from "../../utils";

let page: Page;

test.beforeEach(async ({ browser }) => {
  page = await browser.newPage();
});

test.describe("Sorting", async () => {
  test("Drag sort", async () => {
    await page.goto("http://localhost:3001/sort");
    await new Promise((r) => setTimeout(r, 1000));
    await drag(page, {
      originEl: { id: "Apple", position: "center" },
      destinationEl: { id: "Banana", position: "center" },
      dragStart: true,
    });
    await expect(page.locator("#sort_values")).toHaveText(
      "Banana Apple Orange"
    );
    await drag(page, {
      originEl: { id: "Banana", position: "center" },
      destinationEl: { id: "Orange", position: "center" },
      drop: true,
    });
    await expect(page.locator("#sort_values")).toHaveText(
      "Banana Orange Apple"
    );
    await drag(page, {
      originEl: { id: "Banana", position: "center" },
      destinationEl: { id: "Orange", position: "center" },
      dragStart: true,
    });
    await expect(page.locator("#sort_values")).toHaveText(
      "Orange Banana Apple"
    );
    await drag(page, {
      originEl: { id: "Banana", position: "center" },
      destinationEl: { id: "Apple", position: "center" },
    });
    await expect(page.locator("#sort_values")).toHaveText(
      "Orange Apple Banana"
    );
  });

  test("Uneven drag sort", async () => {
    await page.goto("http://localhost:3001/sort/uneven");
    await new Promise((r) => setTimeout(r, 1000));
    await drag(page, {
      originEl: { id: "Apple", position: "center" },
      destinationEl: { id: "Banana", position: "center" },
      dragStart: true,
    });
    await expect(page.locator("#sort_values")).toHaveText(
      "Banana Apple Orange"
    );
    await drag(page, {
      originEl: { id: "Banana", position: "center" },
      destinationEl: { id: "Orange", position: "center" },
      drop: true,
    });
    await expect(page.locator("#sort_values")).toHaveText(
      "Banana Orange Apple"
    );
    await drag(page, {
      originEl: { id: "Banana", position: "center" },
      destinationEl: { id: "Orange", position: "center" },
      dragStart: true,
    });
    await expect(page.locator("#sort_values")).toHaveText(
      "Orange Banana Apple"
    );
    await drag(page, {
      originEl: { id: "Banana", position: "center" },
      destinationEl: { id: "Apple", position: "center" },
    });
    await expect(page.locator("#sort_values")).toHaveText(
      "Orange Apple Banana"
    );
  });

  test("Sort with animations", async () => {
    await page.goto("http://localhost:3001/sort/animations");
    await new Promise((r) => setTimeout(r, 1000));
    await drag(page, {
      originEl: { id: "Apple", position: "center" },
      destinationEl: { id: "Banana", position: "center" },
      dragStart: true,
    });
    await expect(page.locator("#sort_values")).toHaveText(
      "Banana Apple Orange"
    );
    await drag(page, {
      originEl: { id: "Banana", position: "center" },
      destinationEl: { id: "Orange", position: "center" },
      drop: true,
    });
    await expect(page.locator("#sort_values")).toHaveText(
      "Banana Orange Apple"
    );
    await drag(page, {
      originEl: { id: "Banana", position: "center" },
      destinationEl: { id: "Orange", position: "center" },
      dragStart: true,
    });
    await expect(page.locator("#sort_values")).toHaveText(
      "Orange Banana Apple"
    );
    await drag(page, {
      originEl: { id: "Banana", position: "center" },
      destinationEl: { id: "Apple", position: "center" },
    });
    await expect(page.locator("#sort_values")).toHaveText(
      "Orange Apple Banana"
    );
  });

  test("Sort with uneven els and animations", async () => {
    await page.goto("http://localhost:3001/sort/uneven-animations");
    await new Promise((r) => setTimeout(r, 1000));
    await drag(page, {
      originEl: { id: "Apple", position: "center" },
      destinationEl: { id: "Banana", position: "center" },
      dragStart: true,
    });
    await expect(page.locator("#sort_values")).toHaveText(
      "Banana Apple Orange"
    );
    await drag(page, {
      originEl: { id: "Banana", position: "center" },
      destinationEl: { id: "Orange", position: "center" },
      drop: true,
    });
    await expect(page.locator("#sort_values")).toHaveText(
      "Banana Orange Apple"
    );
    await drag(page, {
      originEl: { id: "Banana", position: "center" },
      destinationEl: { id: "Orange", position: "center" },
      dragStart: true,
    });
    await expect(page.locator("#sort_values")).toHaveText(
      "Orange Banana Apple"
    );
    await drag(page, {
      originEl: { id: "Banana", position: "center" },
      destinationEl: { id: "Apple", position: "center" },
    });
    await expect(page.locator("#sort_values")).toHaveText(
      "Orange Apple Banana"
    );
  });
});
