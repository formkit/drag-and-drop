import { test, expect, Page } from "@playwright/test";
import { syntheticDrag } from "../../utils";

let page: Page;

let count: number;

test.beforeEach(async ({ browser }) => {
  page = await browser.newPage();
});

test.describe("Place plugin synthetic", async () => {
  test("Test #1", async () => {
    await page.goto("http://localhost:3001/place");
    await new Promise((r) => setTimeout(r, 1000));
    // When initially dragging apple, we should expect to the apple receive
    // the drag placeholder class and the drop zone class. We should also see
    // the parent container receive the parent drop zone class.
    await syntheticDrag(await page, {
      originEl: { id: "Apple", position: "center" },
      destinationEl: { id: "Apple", position: "center" },
      dragStart: true,
    });
    await expect(await page.locator("#values_1")).toHaveText(
      "Apple Banana Orange"
    );
    count = await page.locator(".synthDropZone").count();
    await expect(count).toBe(1);
    count = await page.locator(".synthDragPlaceholder").count();
    await expect(count).toBe(1);
    await expect(page.locator("#list_1")).toHaveClass(
      "list synthDropZoneParent"
    );

    // When dragging over to sibling item, should not expect the sort to occur.
    // Should see drop zone class applied to the sibling item. The drop zone
    // class should be removed from the original item. The drag placeholder
    // class should remain on the original item until dragend.
    await syntheticDrag(page, {
      originEl: { id: "Apple", position: "center" },
      destinationEl: { id: "Banana", position: "center" },
    });
    await expect(page.locator("#values_1")).toHaveText("Apple Banana Orange");
    count = await page.locator(".synthDropZone").count();
    await expect(count).toBe(1);
    await expect(page.locator("#Banana")).toHaveClass("item synthDropZone");
    await expect(page.locator("#Apple")).toHaveClass(
      "item synthDragPlaceholder"
    );
    count = await page.locator(".synthDragPlaceholder").count();
    await expect(count).toBe(1);
    await expect(page.locator("#list_1")).toHaveClass(
      "list synthDropZoneParent"
    );

    // Dropping the item will transfer the item to the new location.
    await syntheticDrag(page, {
      originEl: { id: "Apple", position: "center" },
      destinationEl: { id: "Banana", position: "center" },
      drop: true,
    });
    count = await page.locator(".synthDropZone").count();
    await expect(count).toBe(0);
    count = await page.locator(".synthDragPlaceholder").count();
    await expect(count).toBe(0);
    await expect(page.locator("#values_1")).toHaveText("Banana Apple Orange");
    await expect(page.locator("#list_1")).toHaveClass("list");

    // Beginning of drag should set both drag placeholder and drop zone on
    // orange.
    await syntheticDrag(page, {
      originEl: { id: "Orange", position: "center" },
      destinationEl: { id: "Orange", position: "center" },
      dragStart: true,
    });
    await expect(page.locator("#Orange")).toHaveClass(
      "item synthDragPlaceholder synthDropZone"
    );
    await expect(page.locator("#values_1")).toHaveText("Banana Apple Orange");
    await expect(page.locator("#values_2")).toHaveText("Tomato Potato Onion");
    count = await page.locator(".synthDropZone").count();
    await expect(count).toBe(1);
    count = await page.locator(".synthDragPlaceholder").count();
    await expect(count).toBe(1);
    await expect(page.locator("#list_1")).toHaveClass(
      "list synthDropZoneParent"
    );

    // Dropping the item will transfer the item to the new location.
    await syntheticDrag(page, {
      originEl: { id: "Orange", position: "center" },
      destinationEl: { id: "Tomato", position: "center" },
      drop: true,
    });
    await expect(page.locator("#values_1")).toHaveText("Banana Apple");
    await expect(page.locator("#values_2")).toHaveText(
      "Orange Tomato Potato Onion"
    );
    count = await page.locator(".synthDropZone").count();
    await expect(count).toBe(0);
    count = await page.locator(".synthDragPlaceholder").count();
    await expect(count).toBe(0);

    await expect(page.locator("#values_1")).toHaveText("Banana Apple");
  });

  // Skipping for now.
  test.skip("Test #2", async () => {
    await page.goto("http://localhost:3001/place");
    await new Promise((r) => setTimeout(r, 1000));

    // Picking up Orange should set the drag placeholder and drop zone on Orange
    // and the parent drop zone class on the parent container.
    //await syntheticDrag(page, {
    //  originEl: { id: "Orange", position: "center" },
    //  destinationEl: { id: "Orange", position: "center" },
    //  dragStart: true,
    //});
    //await expect(page.locator("#Orange")).toHaveClass(
    //  "item synthDragPlaceholder synthDropZone"
    //);
    //await expect(await page.locator(".synthDragPlaceholder").count()).toBe(1);
    //await expect(await page.locator(".synthDropZone").count()).toBe(1);
    //await expect(await page.locator(".synthDropZoneParent").count()).toBe(1);
    //await expect(page.locator("#list_1")).toHaveClass(
    //  "list synthDropZoneParent"
    //);

    // Dragging off of the Orange but still within the same parent container
    // should remove the drop zone class from the original item, keep the drag
    // placeholder class on the original item, and keep the parent drop zone
    // class on the parent container.
    await syntheticDrag(page, {
      originEl: { id: "Orange", position: "center" },
      destinationEl: { id: "title", position: "center" },
      dragStart: true,
    });
    await expect(page.locator("#Orange")).toHaveClass(
      "item synthDragPlaceholder"
    );
    await expect(page.locator("#list_1")).toHaveClass(
      "list synthDropZoneParent"
    );
    await expect(await page.locator(".synthDragPlaceholder").count()).toBe(1);
    await expect(await page.locator(".synthDropZone").count()).toBe(0);
    await expect(await page.locator(".synthDropZoneParent").count()).toBe(1);

    // Dragging to a random place on the document, should remove the drop zone
    // classses from the original item and parent container. The drag
    // placeholder class should remain on the original item.
    await syntheticDrag(page, {
      originEl: { id: "values_1", position: "center" },
      destinationEl: { id: "title", position: "center" },
    });
    await expect(page.locator("#Orange")).toHaveClass(
      "item synthDragPlaceholder"
    );
    await expect(page.locator("#list_1")).toHaveClass("list");
    await expect(await page.locator(".synthDragPlaceholder").count()).toBe(1);
    await expect(await page.locator(".synthDropZone").count()).toBe(0);
    await expect(await page.locator(".synthDropZoneParent").count()).toBe(0);

    // Dragging to a different parent container should set the parent drop zone
    // class on the new parent container.
    await syntheticDrag(page, {
      originEl: { id: "Orange", position: "center" },
      destinationEl: { id: "values_2", position: "center" },
    });
    await expect(page.locator("#Orange")).toHaveClass(
      "item synthDragPlaceholder"
    );
    await expect(page.locator("#list_1")).toHaveClass("list");
    await expect(page.locator("#list_2")).toHaveClass(
      "list synthDropZoneParent"
    );

    // Drag over specific dragged item
    await syntheticDrag(page, {
      originEl: { id: "values_2", position: "center" },
      destinationEl: { id: "Onion", position: "center" },
    });
    await expect(page.locator("#Orange")).toHaveClass(
      "item synthDragPlaceholder"
    );
    await expect(page.locator("#Onion")).toHaveClass("item synthDropZone");
    await expect(page.locator("#list_1")).toHaveClass("list");
    await expect(page.locator("#list_2")).toHaveClass(
      "list synthDropZoneParent"
    );

    // Drag back over second list but not over a dragged node
    await syntheticDrag(page, {
      originEl: { id: "Onion", position: "center" },
      destinationEl: { id: "values_2", position: "center" },
    });
    await expect(page.locator("#Orange")).toHaveClass(
      "item synthDragPlaceholder"
    );
    await expect(page.locator("#Onion")).toHaveClass("item");
    await expect(page.locator("#list_1")).toHaveClass("list");
    await expect(page.locator("#list_2")).toHaveClass(
      "list synthDropZoneParent"
    );

    // Drop item in parent container. Item should be appended at the end of the
    // list
    await syntheticDrag(page, {
      originEl: { id: "values_2", position: "center" },
      destinationEl: { id: "values_2", position: "center" },
      drop: true,
    });
    await expect(page.locator("#Orange")).toHaveClass("item");
    await expect(await page.locator(".synthDragPlaceholder").count()).toBe(0);
    await expect(await page.locator(".synthDropZone").count()).toBe(0);
    await expect(await page.locator(".synthDropZoneParent").count()).toBe(0);
    await expect(page.locator("#values_1")).toHaveText("Apple Banana");
    await expect(page.locator("#values_2")).toHaveText(
      "Tomato Potato Onion Orange"
    );
  });
});
