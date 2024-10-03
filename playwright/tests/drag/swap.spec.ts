import { test, expect, Page } from "@playwright/test";
import { drag } from "../../utils";

let page: Page;

test.beforeEach(async ({ browser }) => {
  page = await browser.newPage();
});

test.describe("Drag swap", async () => {
  test("Test #1: Swapping within list.", async () => {
    await page.goto("http://localhost:3001/swap");
    await new Promise((r) => setTimeout(r, 1000));

    // Taking first item, hovering over second, and releading it should swap
    // the items.
    await drag(page, {
      originEl: { id: "Apple", position: "center" },
      destinationEl: { id: "Apple", position: "center" },
      dragStart: true,
    });
    await expect(page.locator("#list_1")).toHaveClass("list dropZoneParent");
    await expect(page.locator("#Apple")).toHaveClass(
      "item dragPlaceholder dropZone"
    );

    await drag(page, {
      originEl: { id: "Apple", position: "center" },
      destinationEl: { id: "Banana", position: "center" },
    });
    await expect(page.locator("#list_1")).toHaveClass("list dropZoneParent");
    await expect(page.locator("#Apple")).toHaveClass("item dragPlaceholder");
    await expect(page.locator("#Banana")).toHaveClass("item dropZone");

    await drag(page, {
      originEl: { id: "Banana", position: "center" },
      destinationEl: { id: "Banana", position: "center" },
      drop: true,
    });
    await expect(page.locator("#list_1")).toHaveClass("list");
    await expect(page.locator("#Apple")).toHaveClass("item");
    await expect(page.locator("#Banana")).toHaveClass("item");
    await expect(page.locator("#values_1")).toHaveText("Banana Apple Orange");

    // Taking first item, hovering over the parent (not a node), and releasing
    // it should not change the order.
    await drag(page, {
      originEl: { id: "Banana", position: "center" },
      destinationEl: { id: "Banana", position: "center" },
      dragStart: true,
    });
    await expect(page.locator("#list_1")).toHaveClass("list dropZoneParent");
    await expect(page.locator("#Banana")).toHaveClass(
      "item dragPlaceholder dropZone"
    );

    await drag(page, {
      originEl: { id: "Banana", position: "center" },
      destinationEl: { id: "values_1", position: "center" },
    });
    await expect(page.locator("#list_1")).toHaveClass("list dropZoneParent");
    await expect(page.locator("#Banana")).toHaveClass("item dragPlaceholder");
    await expect(page.locator("#values_1")).toHaveText("Banana Apple Orange");

    await drag(page, {
      originEl: { id: "Banana", position: "center" },
      destinationEl: { id: "values_1", position: "center" },
      drop: true,
    });
    await expect(page.locator("#list_1")).toHaveClass("list");
    await expect(page.locator("#Banana")).toHaveClass("item");
    await expect(page.locator("#values_1")).toHaveText("Banana Apple Orange");

    // Taking the last item and dropping it on the first item should swap the
    // items.
    await drag(page, {
      originEl: { id: "Banana", position: "center" },
      destinationEl: { id: "Orange", position: "center" },
      dragStart: true,
      drop: true,
    });
    await expect(page.locator("#values_1")).toHaveText("Orange Apple Banana");
  });

  test("Test #2: Swapping between lists.", async () => {
    await page.goto("http://localhost:3001/swap");
    await new Promise((r) => setTimeout(r, 1000));

    // Taking first item, hovering over the second list (not a node), and
    // releasing it should append it to the end of the second list.
    await drag(page, {
      originEl: { id: "Apple", position: "center" },
      destinationEl: { id: "values_2", position: "center" },
      dragStart: true,
    });
    await expect(page.locator("#list_2")).toHaveClass("list dropZoneParent");
    await expect(page.locator("#Apple")).toHaveClass("item dragPlaceholder");
    await expect(page.locator("#values_1")).toHaveText("Apple Banana Orange");
    await expect(page.locator("#values_2")).toHaveText("Tomato Potato Onion");
    await drag(page, {
      originEl: { id: "values_2", position: "center" },
      destinationEl: { id: "values_2", position: "center" },
      drop: true,
    });
    await expect(page.locator("#list_1")).toHaveClass("list");
    await expect(page.locator("#list_2")).toHaveClass("list");
    await expect(page.locator("#Apple")).toHaveClass("item");
    await expect(page.locator("#values_1")).toHaveText("Banana Orange");
    await expect(page.locator("#values_2")).toHaveText(
      "Tomato Potato Onion Apple"
    );

    // Taking banana and dropping it on Tomato should swap the items.
    await drag(page, {
      originEl: { id: "Banana", position: "center" },
      destinationEl: { id: "Tomato", position: "center" },
      drop: true,
      dragStart: true,
    });
    await expect(page.locator("#values_1")).toHaveText("Tomato Orange");
    await expect(page.locator("#values_2")).toHaveText(
      "Banana Potato Onion Apple"
    );

    // Take "Orange" and swap it with "Potato".
    await drag(page, {
      originEl: { id: "Orange", position: "center" },
      destinationEl: { id: "Potato", position: "center" },
      dragStart: true,
      drop: true,
    });
    await expect(page.locator("#values_1")).toHaveText("Tomato Potato");
    await expect(page.locator("#values_2")).toHaveText(
      "Banana Orange Onion Apple"
    );
  });
});
