import { test, expect } from "@playwright/test";

test.describe("Drag handle after focusing an inner control (formkit/formkit#1755)", () => {
  test("a real mouse drag via the handle still works after an inner button was focused", async ({ page, browserName }) => {
    test.skip(browserName !== "chromium", "Native mouse drag emulation is Chromium-only in Playwright");
    await page.goto("http://localhost:3001/dragHandle/inner-focus");
    await new Promise((r) => setTimeout(r, 1000));
    // Focus a control inside the first item (like clicking a row's button).
    await page.locator("#Apple_button").click();
    await expect(page.locator("#Apple_button")).toBeFocused();
    // Drag the same item by its handle with a real mouse.
    await page.locator("#Apple_dragHandle").dragTo(page.locator("#Banana"));
    await expect(page.locator("#inner_focus_values")).toHaveText("Banana Apple Orange");
  });
});
