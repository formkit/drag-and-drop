import { test, expect, Page } from "@playwright/test";
import { drag } from "../../utils";

let page: Page;

test.beforeEach(async ({ browser }) => {
  page = await browser.newPage();
});

test.describe("Native drag with drag handles", async () => {
  test("Native drag with drag handles. Should not be able to pick up item unless using drag handle", async () => {
    await page.goto("http://localhost:3001/draghandle");
    await new Promise((r) => setTimeout(r, 1000));
    // Should not be able to pick up item unless using drag handle
    await drag(page, {
      originEl: { id: "Apple", position: "center" },
      destinationEl: { id: "Banana", position: "center" },
      dragStart: true,
    });
    await expect(page.locator("#values_1")).toHaveText("Apple Banana Orange");
    // When using drag handle, should be able to pick up item and see dragging
    // class.
    await drag(page, {
      originEl: { id: "Apple_dragHandle", position: "center" },
      destinationEl: { id: "Banana", position: "center" },
      dragStart: true,
    });
    await expect(page.locator("#values_1")).toHaveText("Banana Apple Orange");
  });

  test("Native drag with shadowDragHandle. Should only drag when using handle inside shadow DOM", async () => {
    await page.goto("http://localhost:3001/draghandle");
    await new Promise((r) => setTimeout(r, 1000));

    await drag(page, {
      originEl: { id: "ShadowApple", position: "center" },
      destinationEl: { id: "ShadowBanana", position: "center" },
      dragStart: true,
    });
    await expect(page.locator("#values_shadow")).toHaveText(
      "ShadowApple ShadowBanana ShadowOrange"
    );

    await drag(page, {
      originEl: { id: "ShadowApple_shadowDragHandle", position: "center" },
      destinationEl: { id: "ShadowBanana", position: "center" },
      dragStart: true,
    });
    await expect(page.locator("#values_shadow")).toHaveText(
      "ShadowBanana ShadowApple ShadowOrange"
    );
  });
});
