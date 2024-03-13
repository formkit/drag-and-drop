import { test, expect, Page } from "@playwright/test";
import { dragDrop, touchDrop } from "../../utils";

let page: Page;

test.beforeAll(async ({ browser }) => {
  page = await browser.newPage();
  await page.goto("http://localhost:5173/");
});

test.describe("Vue wrappers working as expected", async () => {
  test("dragAndDrop() can enable sorting, accept new values, and update the parent config", async () => {
    // Check that the list items can be sorted
    await dragDrop(page, {
      origin: "#vue_drag_and_drop_10_of_clubs",
      destination: "#vue_drag_and_drop_jack_of_hearts",
      dragStart: true,
      drop: true,
    });
    await expect(page.locator("#vue_drag_and_drop_values")).toHaveText(
      "jack_of_hearts 10_of_clubs"
    );
    // Add value
    await page.locator("#vue_drag_and_drop_add_value").click();
    await expect(page.locator("#vue_drag_and_drop_values")).toHaveText(
      "jack_of_hearts 10_of_clubs queen_of_spades"
    );
    // Check that the list items can be sorted
    await dragDrop(page, {
      origin: "#vue_drag_and_drop_10_of_clubs",
      destination: "#vue_drag_and_drop_queen_of_spades",
      dragStart: true,
      drop: true,
    });
    await expect(page.locator("#vue_drag_and_drop_values")).toHaveText(
      "jack_of_hearts queen_of_spades 10_of_clubs"
    );
    // Disable drag and drop
    await page.locator("#vue_drag_and_drop_disable").click();
    // Check that the list items can not be sorted
    await dragDrop(page, {
      origin: "#vue_drag_and_drop_10_of_clubs",
      destination: "#vue_drag_and_drop_queen_of_spades",
      dragStart: true,
      drop: true,
    });
    await expect(page.locator("#vue_drag_and_drop_values")).toHaveText(
      "jack_of_hearts queen_of_spades 10_of_clubs"
    );
  });

  test("useDragAndDrop() can enable sorting, accept new values, and update the parent config", async () => {
    // Check that the list items can be sorted
    await dragDrop(page, {
      origin: "#vue_use_drag_and_drop_10_of_clubs",
      destination: "#vue_use_drag_and_drop_jack_of_hearts",
      dragStart: true,
      drop: true,
    });
    await expect(page.locator("#vue_use_drag_and_drop_values")).toHaveText(
      "jack_of_hearts 10_of_clubs"
    );
    // Add value
    await page.locator("#vue_use_drag_and_drop_add_value").click();
    await expect(page.locator("#vue_use_drag_and_drop_values")).toHaveText(
      "jack_of_hearts 10_of_clubs queen_of_spades"
    );
    // Check that the list items can be sorted
    await dragDrop(page, {
      origin: "#vue_use_drag_and_drop_10_of_clubs",
      destination: "#vue_use_drag_and_drop_queen_of_spades",
      dragStart: true,
      drop: true,
    });
    await expect(page.locator("#vue_use_drag_and_drop_values")).toHaveText(
      "jack_of_hearts queen_of_spades 10_of_clubs"
    );
    // Disable drag and drop
    await page.locator("#vue_use_drag_and_drop_disable").click();
    // Check that the list items can not be sorted
    await dragDrop(page, {
      origin: "#vue_use_drag_and_drop_10_of_clubs",
      destination: "#vue_use_drag_and_drop_queen_of_spades",
      dragStart: true,
      drop: true,
    });
    await expect(page.locator("#vue_use_drag_and_drop_values")).toHaveText(
      "jack_of_hearts queen_of_spades 10_of_clubs"
    );
  });
});
