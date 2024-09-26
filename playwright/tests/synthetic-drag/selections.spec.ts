import { test, expect, Page, chromium, devices } from "@playwright/test";
import { drag } from "../../utils";

let page: Page;

test.beforeEach(async ({ browser }) => {
  page = await browser.newPage();
});

test.describe("Non native Selections", async () => {
  test.only("Selections", async () => {
    page.goto("http://localhost:3001/selections/non-native");
    await new Promise((r) => setTimeout(r, 1000));
    await page.locator("#Apple").click();
    await expect(page.locator("#Apple")).toHaveAttribute(
      "aria-selected",
      "true"
    );
    await expect(page.locator("#Apple")).toHaveClass("item red");
    await page.locator("#Apple").click();
    await expect(page.locator("#Apple")).toHaveAttribute(
      "aria-selected",
      "false"
    );
    await expect(page.locator("#Apple")).toHaveClass("item");
    await page.locator("#Apple").click();
    await expect(page.locator("#Apple")).toHaveAttribute(
      "aria-selected",
      "true"
    );
    await expect(page.locator("#Apple")).toHaveClass("item red");
    await page.locator("#Banana").click();
    await expect(page.locator("#Apple")).toHaveAttribute(
      "aria-selected",
      "true"
    );
    await expect(page.locator("#Apple")).toHaveClass("item red");
    await expect(page.locator("#Banana")).toHaveAttribute(
      "aria-selected",
      "true"
    );
    await expect(page.locator("#Banana")).toHaveClass("item red");
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
    await page.locator("#Apple").click();
    await expect(page.locator("#Apple")).toHaveAttribute(
      "aria-selected",
      "true"
    );
    await expect(page.locator("#Apple")).toHaveClass("item red");
    await page.locator("#Banana").click();
    await expect(page.locator("#Apple")).toHaveAttribute(
      "aria-selected",
      "true"
    );
    await expect(page.locator("#Apple")).toHaveClass("item red");
    await expect(page.locator("#Banana")).toHaveAttribute(
      "aria-selected",
      "true"
    );
    await expect(page.locator("#Banana")).toHaveClass("item red");
    await page.locator("#Apple").click();
    await expect(page.locator("#Apple")).toHaveAttribute(
      "aria-selected",
      "false"
    );
    await expect(page.locator("#Apple")).toHaveClass("item");
    await expect(page.locator("#Banana")).toHaveAttribute(
      "aria-selected",
      "true"
    );
    await expect(page.locator("#Banana")).toHaveClass("item red");
  });
});
