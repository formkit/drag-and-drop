import { test, expect, Page } from "@playwright/test";
import { syntheticDrag } from "../../utils";

let page: Page;

let count: number;

test.beforeAll(async ({ browser }) => {
  page = await browser.newPage();
  await page.goto("http://localhost:3001/transfer");
});

test.describe.skip("Transferring", async () => {
  test("Drag transferring works as expected. Testing synthDropZone class as well.", async () => {
    await new Promise((r) => setTimeout(r, 1000));

    // When drag starts, the origin element should have the class "synthDropZone" and
    // should be the only element with that class.
    await syntheticDrag(page, {
      originEl: {
        id: "Apple",
        position: "center",
      },
      destinationEl: { id: "Apple", position: "center" },
      dragStart: true,
      drop: false,
    });

    count = await page.locator(".synthDropZone").count();
    await expect(count).toBe(1);
    await expect(page.locator("#Apple")).toHaveClass("item synthDropZone");

    // Dragging over to the list will add the item to the list and the drop zone
    // class will persist. Values should transfer correctly.
    await syntheticDrag(page, {
      originEl: {
        id: "Apple",
        position: "center",
      },
      destinationEl: { id: "values_2", position: "center" },
      drop: false,
    });
    await new Promise((r) => setTimeout(r, 10000));
    await expect(page.locator("#values_1")).toHaveText("Banana Orange");
    await expect(page.locator("#values_2")).toHaveText(
      "Cherry Grape Pineapple Apple"
    );

    // Dragging the same item apple to the third list will remove the item from
    // the second list and add it to the third list. The drop zone class will
    // persist to the third list.
    await syntheticDrag(page, {
      originEl: {
        id: "Apple",
        position: "center",
      },
      destinationEl: { id: "values_3", position: "center" },
      drop: true,
    });
    count = await page.locator(".synthDropZone").count();
    await expect(count).toBe(0);
    await expect(page.locator("#values_2")).toHaveText(
      "Cherry Grape Pineapple"
    );
    await expect(page.locator("#values_3")).toHaveText(
      "Strawberry Watermelon Kiwi Apple"
    );

    // Dragging strawberry from the third list to the second list will remove it
    // from the third list and add it to the second list. The drop zone class
    // will be in the second list.
    await syntheticDrag(page, {
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
    count = await page.locator(".synthDropZone").count();
    await expect(count).toBe(1);
    await expect(page.locator("#Strawberry")).toHaveClass("item synthDropZone");
    await expect(page.locator("#values_2")).toHaveText(
      "Cherry Grape Pineapple Strawberry"
    );
    await expect(page.locator("#values_3")).toHaveText("Watermelon Kiwi Apple");

    // Dragging strawberry from the second list to the first list will remove it
    // from the second list and add it to the first list. The drop zone class
    // will be removd since we're dropping
    await syntheticDrag(page, {
      originEl: {
        id: "Strawberry",
        position: "center",
      },
      destinationEl: {
        id: "values_1",
        position: "center",
      },
      drop: true,
    });
    await expect(page.locator("#values_1")).toHaveText(
      "Banana Orange Strawberry"
    );
    await expect(page.locator("#values_2")).toHaveText(
      "Cherry Grape Pineapple"
    );
    await expect(page.locator("#Strawberry")).toHaveClass("item");
  });
});
