import { test, expect, Page } from "@playwright/test";
import { drag } from "../../utils";

let page: Page;

test.beforeEach(async ({ browser }) => {
  page = await browser.newPage();
});

test.describe("Native selections with dragging", async () => {
  test.only("Selections", async () => {
    await page.goto("http://localhost:3001/selections");
    await new Promise((r) => setTimeout(r, 1000));
    await page.locator("#Apple").click();
    await expect(page.locator("#Apple")).toHaveAttribute(
      "aria-selected",
      "true"
    );
    await expect(page.locator("#Apple")).toHaveClass("item selected active");
  });
});
