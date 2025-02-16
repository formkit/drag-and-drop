import { test, expect, Page } from "@playwright/test";
import { drag } from "../../utils";

let page: Page;

test.beforeEach(async ({ browser }) => {
  page = await browser.newPage();
});

test.describe("Issue #133", async () => {
  test("When an element is transferred to another list, and then moved back to the root and dropped, `config.handlEnd` should still be invoked.", async () => {
    await page.goto("http://localhost:3001/issue-133");
    await new Promise((r) => setTimeout(r, 1000));
    await expect(
      page.locator("body").getAttribute("data-target-dragend")
    ).resolves.toBe(null);
    // Should not be able to pick up item unless using drag handle
    await drag(page, {
      originEl: { id: "Apple", position: "center" },
      destinationEl: { id: "Apple", position: "center" },
      dragStart: true,
      drop: false,
    });
    await expect(
      page.locator("body").getAttribute("data-target-dragend")
    ).resolves.toBe(null);
    // When using drag handle, should be able to pick up item and see dragging
    // class.
    await drag(page, {
      originEl: { id: "Apple", position: "center" },
      destinationEl: { id: "Pineapple", position: "center" },
    });

    await expect(page.locator("#values_1")).toHaveText(
      "Banana Orange Cherry Grape"
    );
    await expect(page.locator("#values_2")).toHaveText(
      "Apple Pineapple Strawberry"
    );

    await drag(page, {
      originEl: { id: "Apple", position: "center" },
      destinationEl: { id: "issue-133-title", position: "center" },
      drop: true,
    });

    await new Promise((r) => setTimeout(r, 1000));

    await expect(
      page.locator("body").getAttribute("data-source-dragend")
    ).resolves.toBe("true");
  });
});
