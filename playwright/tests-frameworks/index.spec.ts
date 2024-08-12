import { test, expect, Page } from "@playwright/test";
import { drag } from "../utils";

let page: Page;

test.beforeAll(async ({ browser }) => {
  page = await browser.newPage();
  await page.goto("http://localhost:5173/");
});

test.describe("Vue wrappers working as expected", async () => {
  test("dragAndDrop() can enable sorting, accept new values, and update the parent config", async () => {
    // Check that the list items can be sorted
    await drag(page, {
      originEl: {
        id: "vue_drag_and_drop_10_of_clubs",
        position: "center",
      },
      destinationEl: {
        id: "vue_drag_and_drop_jack_of_hearts",
        position: "center",
      },
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
    await drag(page, {
      originEl: {
        id: "vue_drag_and_drop_10_of_clubs",
        position: "center",
      },
      destinationEl: {
        id: "vue_drag_and_drop_queen_of_spades",
        position: "center",
      },
      dragStart: true,
      drop: true,
    });
    await expect(page.locator("#vue_drag_and_drop_values")).toHaveText(
      "jack_of_hearts queen_of_spades 10_of_clubs"
    );
    // Disable drag and drop
    await page.locator("#vue_drag_and_drop_disable").click();
    // Check that the list items can not be sorted
    await drag(page, {
      originEl: {
        id: "vue_drag_and_drop_10_of_clubs",
        position: "center",
      },
      destinationEl: {
        id: "vue_drag_and_drop_queen_of_spades",
        position: "center",
      },
      dragStart: true,
      drop: true,
    });
    await expect(page.locator("#vue_drag_and_drop_values")).toHaveText(
      "jack_of_hearts queen_of_spades 10_of_clubs"
    );
  });

  test("useDragAndDrop() can enable sorting, accept new values, and update the parent config", async () => {
    // Check that the list items can be sorted
    await drag(page, {
      originEl: {
        id: "vue_use_drag_and_drop_10_of_clubs",
        position: "center",
      },
      destinationEl: {
        id: "vue_use_drag_and_drop_jack_of_hearts",
        position: "center",
      },
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
    await drag(page, {
      originEl: {
        id: "vue_use_drag_and_drop_10_of_clubs",
        position: "center",
      },
      destinationEl: {
        id: "vue_use_drag_and_drop_queen_of_spades",
        position: "center",
      },
      dragStart: true,
      drop: true,
    });
    await expect(page.locator("#vue_use_drag_and_drop_values")).toHaveText(
      "jack_of_hearts queen_of_spades 10_of_clubs"
    );
    // Disable drag and drop
    await page.locator("#vue_use_drag_and_drop_disable").click();
    // Check that the list items can not be sorted
    await drag(page, {
      originEl: {
        id: "vue_use_drag_and_drop_10_of_clubs",
        position: "center",
      },
      destinationEl: {
        id: "vue_use_drag_and_drop_jack_of_hearts",
        position: "center",
      },
      dragStart: true,
      drop: true,
    });
    await expect(page.locator("#vue_use_drag_and_drop_values")).toHaveText(
      "jack_of_hearts queen_of_spades 10_of_clubs"
    );
  });
});

test.describe("React wrapper working as expected", async () => {
  test("dragAndDrop() can enable sorting, accept new values, and update the parent config", async () => {
    // Check that the list items can be sorted
    await drag(page, {
      originEl: {
        id: "react_drag_and_drop_10_of_clubs",
        position: "center",
      },
      destinationEl: {
        id: "react_drag_and_drop_jack_of_hearts",
        position: "center",
      },
      dragStart: true,
      drop: true,
    });
    await expect(page.locator("#react_drag_and_drop_values")).toHaveText(
      "jack_of_hearts 10_of_clubs"
    );
    // Add value
    await page.locator("#react_drag_and_drop_add_value").click();
    await expect(page.locator("#react_drag_and_drop_values")).toHaveText(
      "jack_of_hearts 10_of_clubs queen_of_spades"
    );
    // Check that the list items can be sorted
    await drag(page, {
      originEl: {
        id: "react_drag_and_drop_10_of_clubs",
        position: "center",
      },
      destinationEl: {
        id: "react_drag_and_drop_queen_of_spades",
        position: "center",
      },
      dragStart: true,
      drop: true,
    });
    await expect(page.locator("#react_drag_and_drop_values")).toHaveText(
      "jack_of_hearts queen_of_spades 10_of_clubs"
    );
    // Disable drag and drop
    await page.locator("#react_drag_and_drop_disable").click();
    // Check that the list items can not be sorted
    await drag(page, {
      originEl: {
        id: "react_drag_and_drop_10_of_clubs",
        position: "center",
      },
      destinationEl: {
        id: "react_drag_and_drop_queen_of_spades",
        position: "center",
      },
      dragStart: true,
      drop: true,
    });
    await expect(page.locator("#react_drag_and_drop_values")).toHaveText(
      "jack_of_hearts queen_of_spades 10_of_clubs"
    );
  });

  test("useDragAndDrop() can enable sorting, accept new values, and update the parent config", async () => {
    // Check that the list items can be sorted
    await drag(page, {
      originEl: {
        id: "react_use_drag_and_drop_10_of_clubs",
        position: "center",
      },
      destinationEl: {
        id: "react_use_drag_and_drop_jack_of_hearts",
        position: "center",
      },
      dragStart: true,
      drop: true,
    });
    await expect(page.locator("#react_use_drag_and_drop_values")).toHaveText(
      "jack_of_hearts 10_of_clubs"
    );
    // Add value
    await page.locator("#react_use_drag_and_drop_add_value").click();
    await expect(page.locator("#react_use_drag_and_drop_values")).toHaveText(
      "jack_of_hearts 10_of_clubs queen_of_spades"
    );
    // Check that the list items can be sorted
    await drag(page, {
      originEl: {
        id: "react_use_drag_and_drop_10_of_clubs",
        position: "center",
      },
      destinationEl: {
        id: "react_use_drag_and_drop_queen_of_spades",
        position: "center",
      },
      dragStart: true,
      drop: true,
    });
    await expect(page.locator("#react_use_drag_and_drop_values")).toHaveText(
      "jack_of_hearts queen_of_spades 10_of_clubs"
    );
    // Disable drag and drop
    await page.locator("#react_use_drag_and_drop_disable").click();
    // Check that the list items can not be sorted
    await drag(page, {
      originEl: {
        id: "react_use_drag_and_drop_10_of_clubs",
        position: "center",
      },
      destinationEl: {
        id: "react_use_drag_and_drop_queen_of_spades",
        position: "center",
      },
      dragStart: true,
      drop: true,
    });
    await expect(page.locator("#react_use_drag_and_drop_values")).toHaveText(
      "jack_of_hearts queen_of_spades 10_of_clubs"
    );
  });
});
