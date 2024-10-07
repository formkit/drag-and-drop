import { test, expect, Page, chromium, devices } from "@playwright/test";
import { drag } from "../../utils";

let page: Page;

test.beforeEach(async ({ browser }) => {
  page = await browser.newPage();
});

<<<<<<< HEAD
// Needs more work
test.describe.skip("Non native selections single", async () => {
=======
test.describe("Non native selections single", async () => {
>>>>>>> release/v0.2.0
  test("Non native selections single select", async () => {
    page.goto("http://localhost:3001/selections/non-native-single");
    await new Promise((r) => setTimeout(r, 1000));

    // Can click to apply selected class and aria-selected
    await page.locator("#Apple").click();
    await expect(page.locator("#Apple")).toHaveAttribute(
      "aria-selected",
      "true"
    );
    await expect(page.locator("#Apple")).toHaveClass("item selected active");
    await page.locator("#Apple").click();

    // Clicking on the same item will deselect it
    await expect(page.locator("#Apple")).toHaveAttribute(
      "aria-selected",
      "false"
    );
    await expect(page.locator("#Apple")).toHaveClass("item active");

    // Can not click multiple items in single select mode
    await page.locator("#Apple").click();
    await expect(page.locator("#Apple")).toHaveAttribute(
      "aria-selected",
      "true"
    );
    await expect(page.locator("#Apple")).toHaveClass("item selected active");
    await page.locator("#Banana").click();
    await expect(page.locator("#Apple")).toHaveAttribute(
      "aria-selected",
      "false"
    );
    await expect(page.locator("#Apple")).toHaveClass("item");
    await expect(page.locator("#Banana")).toHaveAttribute(
      "aria-selected",
      "true"
    );
    await expect(page.locator("#Banana")).toHaveClass("item selected active");

    // Clicking the header will deselect all items
    await page.locator("#title").click();
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

    // Clicking Apple, then clicking "Carrot" in the other group will deselect
    // Apple
    await page.locator("#Apple").click();
    await expect(page.locator("#Apple")).toHaveAttribute(
      "aria-selected",
      "true"
    );
    await expect(page.locator("#Apple")).toHaveClass("item selected active");
    await page.locator("#Carrot").click();
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
