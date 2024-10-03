import { test, expect, Page } from "@playwright/test";
import { syntheticDrag } from "../../utils";

let page: Page;

let count: number;

test.beforeAll(async ({ browser }) => {
  page = await browser.newPage();
  await page.goto("http://localhost:3001/transfer");
});

test.describe("Transferring", async () => {
  test("Drag transferring works as expected. Testing synthDropZone class as well.", async () => {
    await new Promise((r) => setTimeout(r, 1000));

    count = await page.locator(".synthDropZone").count();
    //await expect(count).toBe(1);
    //await expect(page.locator("#Apple")).toHaveClass("item synthDropZone");

    // Dragging over to the list will add the item to the list and the drop zone
    // class will persist. Values should transfer correctly.
    await syntheticDrag(page, {
      originEl: {
        id: "Apple",
        position: "center",
      },
      destinationEl: { id: "Cherry", position: "center" },
      dragStart: true,
    });
    await expect(page.locator("#values_1")).toHaveText("Banana Orange");
    await expect(page.locator("#values_2")).toHaveText(
      "Apple Cherry Grape Pineapple"
    );

    // Dragging the same item apple to the third list will remove the item from
    // the second list and add it to the third list. The drop zone class will
    // persist to the third list.
    await syntheticDrag(page, {
      originEl: {
        id: "Apple",
        position: "center",
      },
      destinationEl: { id: "Strawberry", position: "center" },
      drop: true,
    });
    count = await page.locator(".synthDropZone").count();
    await expect(count).toBe(0);
    await expect(page.locator("#values_2")).toHaveText(
      "Cherry Grape Pineapple"
    );
    await expect(page.locator("#values_3")).toHaveText(
      "Apple Strawberry Watermelon Kiwi"
    );
  });
});
