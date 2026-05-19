import { test, expect, Page } from "@playwright/test";
import { syntheticDrag } from "../../utils";

let page: Page;

test.beforeEach(async ({ browser }) => {
  page = await browser.newPage();
});

test.describe("Synth Drag handles", async () => {
  test("Test #1: Elements can only be picked up by the drag handle.", async () => {
    await page.goto("http://localhost:3001/draghandle");
    await new Promise((r) => setTimeout(r, 1000));
    // Should not be able to pick up item unless using drag handle
    await syntheticDrag(page, {
      originEl: { id: "Apple", position: "center" },
      destinationEl: { id: "Banana", position: "center" },
      dragStart: true,
    });
    await expect(page.locator("#values_1")).toHaveText("Apple Banana Orange");
    // When using drag handle, should be able to pick up item and see dragging
    // class.
    await syntheticDrag(page, {
      originEl: { id: "Apple_dragHandle", position: "center" },
      destinationEl: { id: "Banana", position: "center" },
      dragStart: true,
    });
    await expect(page.locator("#values_1")).toHaveText("Banana Apple Orange");
  });

  test("Test #2: shadowDragHandle should match a handle inside shadow DOM.", async () => {
    await page.goto("http://localhost:3001/draghandle");
    await new Promise((r) => setTimeout(r, 1000));

    await syntheticDrag(page, {
      originEl: { id: "ShadowApple", position: "center" },
      destinationEl: { id: "ShadowBanana", position: "center" },
      dragStart: true,
    });
    await expect(page.locator("#values_shadow")).toHaveText(
      "ShadowApple ShadowBanana ShadowOrange"
    );

    await syntheticDrag(page, {
      originEl: { id: "ShadowApple_shadowDragHandle", position: "center" },
      destinationEl: { id: "ShadowBanana", position: "center" },
      dragStart: true,
    });
    await expect(page.locator("#values_shadow")).toHaveText(
      "ShadowBanana ShadowApple ShadowOrange"
    );
  });
});
