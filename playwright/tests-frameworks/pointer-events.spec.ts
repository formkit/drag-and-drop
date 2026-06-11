import { test, expect, Page } from "@playwright/test";

let page: Page;

test.beforeAll(async ({ browser }) => {
  page = await browser.newPage();
  await page.goto("http://127.0.0.1:5173/");
});

test.describe("Consumer pointer event handlers (#166)", async () => {
  test("React onPointerDown inside a draggable item still fires", async () => {
    // Real input: click presses the pointer down on the button inside the
    // draggable item. React's delegated listener at the root must receive
    // the event — the library may not stop pointerdown propagation.
    await page.locator("#react_drag_and_drop_10_of_clubs_button").click();
    await expect(page.locator("#react_drag_and_drop_pointerdowns")).toHaveText(
      "1"
    );
    await page.locator("#react_drag_and_drop_jack_of_hearts_button").click();
    await expect(page.locator("#react_drag_and_drop_pointerdowns")).toHaveText(
      "2"
    );
  });
});
