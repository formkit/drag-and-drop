import { test, expect, Page } from "@playwright/test";
import { drag } from "../../utils";

let page: Page;

let count: number;

test.beforeEach(async ({ browser }) => {
  page = await browser.newPage();
});

test.describe("Place plugin", async () => {
  test("Place plugin", async () => {
    await page.goto("http://localhost:3001/place");
    await new Promise((r) => setTimeout(r, 1000));
    await drag(page, {
      originEl: { id: "Apple", position: "center" },
      destinationEl: { id: "Apple", position: "center" },
      dragStart: true,
    });
    await expect(page.locator("#Apple")).toHaveClass("item dropZone");
    await expect(page.locator("#values_1")).toHaveText("Apple Banana Orange");

    count = await page.locator(".dropZone").count();
    await expect(count).toBe(1);
    await expect(page.locator("#Apple")).toHaveClass("item dropZone");

    // When dragging over to sibling item, should not expect the sort to occur.
    // Should see drop zone class applied to the sibling item.
    await drag(page, {
      originEl: { id: "Apple", position: "center" },
      destinationEl: { id: "Banana", position: "center" },
    });
    await expect(page.locator("#values_1")).toHaveText("Apple Banana Orange");
    count = await page.locator(".dropZone").count();
    await expect(count).toBe(1);
    await expect(page.locator("#Banana")).toHaveClass("item dropZone");

    // Dropping the item will transfer the item to the new location.
    await drag(page, {
      originEl: { id: "Apple", position: "center" },
      destinationEl: { id: "Banana", position: "center" },
      drop: true,
    });
    count = await page.locator(".dropZone").count();
    await expect(count).toBe(0);
    await expect(page.locator("#values_1")).toHaveText("Banana Apple Orange");

    // Dragging item over another list item will not transfer the item until
    // the item is dropped.
    await drag(page, {
      originEl: { id: "Orange", position: "center" },
      destinationEl: { id: "Tomato", position: "center" },
      dragStart: true,
    });
    await expect(page.locator("#Tomato")).toHaveClass("item dropZone");
    await expect(page.locator("#values_1")).toHaveText("Banana Apple Orange");
    await expect(page.locator("#values_2")).toHaveText("Tomato Potato Onion");

    // Dropping the item will transfer the item to the new location.
    await drag(page, {
      originEl: { id: "Orange", position: "center" },
      destinationEl: { id: "Tomato", position: "center" },
      drop: true,
    });
    await expect(page.locator("#values_1")).toHaveText("Banana Apple");
    await expect(page.locator("#values_2")).toHaveText(
      "Orange Tomato Potato Onion"
    );
    count = await page.locator(".dropZone").count();
    await expect(count).toBe(0);

    //await expect(page.locator("#values_1")).toHaveText("Banana Apple Orange");

    //await drag(page, {
    //  originEl: { id: "Banana", position: "center" },
    //  destinationEl: { id: "Orange", position: "center" },
    //  drop: true,
    //});
    //await expect(page.locator("#sort_values")).toHaveText(
    //  "Banana Orange Apple"
    //);
    //await drag(page, {
    //  originEl: { id: "Banana", position: "center" },
    //  destinationEl: { id: "Orange", position: "center" },
    //  dragStart: true,
    //});
    //await expect(page.locator("#sort_values")).toHaveText(
    //  "Orange Banana Apple"
    //);
    //await drag(page, {
    //  originEl: { id: "Banana", position: "center" },
    //  destinationEl: { id: "Apple", position: "center" },
    //});
    //await expect(page.locator("#sort_values")).toHaveText(
    //  "Orange Apple Banana"
    //);
  });
});
