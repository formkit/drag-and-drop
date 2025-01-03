import { test, expect, Page } from "@playwright/test";
import { drag } from "../../utils";

let page: Page;

let count: number;

test.beforeEach(async ({ browser }) => {
  page = await browser.newPage();
});

test.describe("Place plugin", async () => {
  test("Test #1", async () => {
    await page.goto("http://localhost:3001/place");
    await new Promise((r) => setTimeout(r, 1000));
    // When initially dragging apple, we should expect to the apple receive
    // the drag placeholder class and the drop zone class. We should also see
    // the parent container receive the parent drop zone class.
    await drag(page, {
      originEl: { id: "Apple", position: "center" },
      destinationEl: { id: "Apple", position: "center" },
      dragStart: true,
    });
    await expect(page.locator("#values_1")).toHaveText("Apple Banana Orange");
    count = await page.locator(".dropZone").count();
    await expect(count).toBe(1);
    count = await page.locator(".dragPlaceholder").count();
    await expect(count).toBe(1);
    await expect(page.locator("#list_1")).toHaveClass("list dropZoneParent");

    // When dragging over to sibling item, should not expect the sort to occur.
    // Should see drop zone class applied to the sibling item. The drop zone
    // class should be removed from the original item. The drag placeholder
    // class should remain on the original item until dragend.
    await drag(page, {
      originEl: { id: "Apple", position: "center" },
      destinationEl: { id: "Banana", position: "center" },
    });
    await expect(page.locator("#values_1")).toHaveText("Apple Banana Orange");
    count = await page.locator(".dropZone").count();
    await expect(count).toBe(1);
    await expect(page.locator("#Banana")).toHaveClass("item dropZone");
    await expect(page.locator("#Apple")).toHaveClass("item dragPlaceholder");
    count = await page.locator(".dragPlaceholder").count();
    await expect(count).toBe(1);
    await expect(page.locator("#list_1")).toHaveClass("list dropZoneParent");

    // Dropping the item will transfer the item to the new location.
    await drag(page, {
      originEl: { id: "Apple", position: "center" },
      destinationEl: { id: "Banana", position: "center" },
      drop: true,
    });
    count = await page.locator(".dropZone").count();
    await expect(count).toBe(0);
    count = await page.locator(".dragPlaceholder").count();
    await expect(count).toBe(0);
    await expect(page.locator("#values_1")).toHaveText("Banana Apple Orange");
    await expect(page.locator("#list_1")).toHaveClass("list");

    // Beginning of drag should set both drag placeholder and drop zone on
    // orange.
    await drag(page, {
      originEl: { id: "Orange", position: "center" },
      destinationEl: { id: "Orange", position: "center" },
      dragStart: true,
    });
    await expect(page.locator("#Orange")).toHaveClass(
      "item dragPlaceholder dropZone"
    );
    await expect(page.locator("#values_1")).toHaveText("Banana Apple Orange");
    await expect(page.locator("#values_2")).toHaveText("Tomato Potato Onion");
    count = await page.locator(".dropZone").count();
    await expect(count).toBe(1);
    count = await page.locator(".dragPlaceholder").count();
    await expect(count).toBe(1);
    await expect(page.locator("#list_1")).toHaveClass("list dropZoneParent");

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
    count = await page.locator(".dragPlaceholder").count();
    await expect(count).toBe(0);

    await expect(page.locator("#values_1")).toHaveText("Banana Apple");
  });

  test("Test #2", async () => {
    await page.goto("http://localhost:3001/place");
    await new Promise((r) => setTimeout(r, 1000));

    // Picking up Orange should set the drag placeholder and drop zone on Orange
    // and the parent drop zone class on the parent container.
    await drag(page, {
      originEl: { id: "Orange", position: "center" },
      destinationEl: { id: "Orange", position: "center" },
      dragStart: true,
    });
    await expect(page.locator("#Orange")).toHaveClass(
      "item dragPlaceholder dropZone"
    );
    await expect(await page.locator(".dragPlaceholder").count()).toBe(1);
    await expect(await page.locator(".dropZone").count()).toBe(1);
    await expect(await page.locator(".dropZoneParent").count()).toBe(1);
    await expect(page.locator("#list_1")).toHaveClass("list dropZoneParent");

    // Dragging off of the Orange but still within the same parent container
    // should remove the drop zone class from the original item, keep the drag
    // placeholder class on the original item, and keep the parent drop zone
    // class on the parent container.
    await drag(page, {
      originEl: { id: "Orange", position: "center" },
      destinationEl: { id: "values_1", position: "center" },
    });
    await expect(page.locator("#Orange")).toHaveClass("item dragPlaceholder");
    await expect(page.locator("#list_1")).toHaveClass("list dropZoneParent");
    await expect(await page.locator(".dragPlaceholder").count()).toBe(1);
    await expect(await page.locator(".dropZone").count()).toBe(0);
    await expect(await page.locator(".dropZoneParent").count()).toBe(1);

    // Dragging to a random place on the document, should remove the drop zone
    // classses from the original item and parent container. The drag
    // placeholder class should remain on the original item.
    await drag(page, {
      originEl: { id: "values_1", position: "center" },
      destinationEl: { id: "title", position: "center" },
    });
    await expect(page.locator("#Orange")).toHaveClass("item dragPlaceholder");
    await expect(page.locator("#list_1")).toHaveClass("list");
    await expect(await page.locator(".dragPlaceholder").count()).toBe(1);
    await expect(await page.locator(".dropZone").count()).toBe(0);
    await expect(await page.locator(".dropZoneParent").count()).toBe(0);

    // Dragging to a different parent container should set the parent drop zone
    // class on the new parent container.
    await drag(page, {
      originEl: { id: "Orange", position: "center" },
      destinationEl: { id: "values_2", position: "center" },
    });
    await expect(page.locator("#Orange")).toHaveClass("item dragPlaceholder");
    await expect(page.locator("#list_1")).toHaveClass("list");
    await expect(page.locator("#list_2")).toHaveClass("list dropZoneParent");

    // Drag over specific dragged item
    await drag(page, {
      originEl: { id: "values_2", position: "center" },
      destinationEl: { id: "Onion", position: "center" },
    });
    await expect(page.locator("#Orange")).toHaveClass("item dragPlaceholder");
    await expect(page.locator("#Onion")).toHaveClass("item dropZone");
    await expect(page.locator("#list_1")).toHaveClass("list");
    await expect(page.locator("#list_2")).toHaveClass("list dropZoneParent");

    // Drag back over second list but not over a dragged node
    await drag(page, {
      originEl: { id: "Onion", position: "center" },
      destinationEl: { id: "values_2", position: "center" },
    });
    await expect(page.locator("#Orange")).toHaveClass("item dragPlaceholder");
    await expect(page.locator("#Onion")).toHaveClass("item");
    await expect(page.locator("#list_1")).toHaveClass("list");
    await expect(page.locator("#list_2")).toHaveClass("list dropZoneParent");

    // Drop item in parent container. Item should be appended at the end of the
    // list
    await drag(page, {
      originEl: { id: "values_2", position: "center" },
      destinationEl: { id: "values_2", position: "center" },
      drop: true,
    });
    await expect(page.locator("#Orange")).toHaveClass("item");
    await expect(await page.locator(".dragPlaceholder").count()).toBe(0);
    await expect(await page.locator(".dropZone").count()).toBe(0);
    await expect(await page.locator(".dropZoneParent").count()).toBe(0);
    await expect(page.locator("#values_1")).toHaveText("Apple Banana");
    await expect(page.locator("#values_2")).toHaveText(
      "Tomato Potato Onion Orange"
    );
  });
});
