import { test, expect, Page, chromium, devices } from "@playwright/test";
import { drag } from "../../utils";

let page: Page;

test.beforeEach(async ({ browser }) => {
  page = await browser.newPage();
});

test.describe("Non native selections multiple", async () => {
  test("Non native selections multiple", async () => {
    page.goto("http://localhost:3001/selections/non-native-multiple");
    await new Promise((r) => setTimeout(r, 1000));

    // Can pointerdown/up to apply selected class and aria-selected
    await page.locator("#Apple").dispatchEvent("pointerdown");
    await page.locator("#Apple").dispatchEvent("pointerup");
    await expect(page.locator("#Apple")).toHaveAttribute(
      "aria-selected",
      "true"
    );
    await expect(page.locator("#Apple")).toHaveClass("item selected active");
    await page.locator("#Apple").dispatchEvent("pointerdown");
    await page.locator("#Apple").dispatchEvent("pointerup");

    // Pointer events on the same item will deselect it
    await expect(page.locator("#Apple")).toHaveAttribute(
      "aria-selected",
      "false"
    );
    await expect(page.locator("#Apple")).toHaveClass("item active");

    // Can pointer select multiple items in single select mode
    await page.locator("#Apple").dispatchEvent("pointerdown");
    await page.locator("#Apple").dispatchEvent("pointerup");
    await expect(page.locator("#Apple")).toHaveAttribute(
      "aria-selected",
      "true"
    );
    await expect(page.locator("#Apple")).toHaveClass("item selected active");
    await page.locator("#Banana").dispatchEvent("pointerdown");
    await page.locator("#Banana").dispatchEvent("pointerup");
    await expect(page.locator("#Apple")).toHaveAttribute(
      "aria-selected",
      "true"
    );
    await expect(page.locator("#Apple")).toHaveClass("item selected");
    await expect(page.locator("#Banana")).toHaveAttribute(
      "aria-selected",
      "true"
    );
    await expect(page.locator("#Banana")).toHaveClass("item selected active");

    // Pointer events on header will deselect all items
    await page.locator("#title").dispatchEvent("pointerdown");
    await page.locator("#title").dispatchEvent("pointerup");
    await expect(page.locator("#Apple")).toHaveAttribute(
      "aria-selected",
      "false"
    );
    await expect(page.locator("#Apple")).toHaveClass("item");
    await expect(page.locator("#Banana")).toHaveAttribute(
      "aria-selected",
      "false"
    );
    await expect(page.locator("#Banana")).toHaveClass("item");

    // Selecting Apple, then selecting "Carrot" in the other group will deselect
    // Apple
    await page.locator("#Apple").dispatchEvent("pointerdown");
    await page.locator("#Apple").dispatchEvent("pointerup");
    await expect(page.locator("#Apple")).toHaveAttribute(
      "aria-selected",
      "true"
    );
    await expect(page.locator("#Apple")).toHaveClass("item selected active");
    await page.locator("#Carrot").dispatchEvent("pointerdown");
    await page.locator("#Carrot").dispatchEvent("pointerup");
    await expect(page.locator("#Apple")).toHaveAttribute(
      "aria-selected",
      "false"
    );
    await expect(page.locator("#Apple")).toHaveClass("item");
    await expect(page.locator("#Carrot")).toHaveAttribute(
      "aria-selected",
      "true"
    );
    await expect(page.locator("#Carrot")).toHaveClass("item selected active");
  });
});
