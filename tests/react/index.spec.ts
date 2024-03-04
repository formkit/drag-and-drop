import { test, expect, Page } from "@playwright/test";
import { dragDrop } from "../utils";

let page: Page;

test.beforeAll(async ({ browser }) => {
  page = await browser.newPage();
  await page.goto("http://localhost:5173/");
});

test.describe("Vue wrapper correctly inits parent", async () => {
  test("Init parent by passing in the parent elmeent directly to `dragAndDrop `function.", async () => {
    const listitems = page.locator("#react_1 .item");
    for (let i = 0; i < (await listitems.count()); i++) {
      await expect(listitems.nth(i)).toHaveAttribute("draggable", "true");
    }
    await dragDrop(page, {
      origin: "#react_1_10_of_clubs",
      destination: "#react_1_jack_of_hearts",
      dragStart: true,
      drop: false,
    });
    await expect(page.locator("#react_1_values")).toHaveText(
      "jack_of_hearts 10_of_clubs queen_of_spades"
    );
    await dragDrop(page, {
      destination: "#react_1_queen_of_spades",
      dragStart: false,
      drop: true,
    });
    await expect(page.locator("#react_1_values")).toHaveText(
      "jack_of_hearts queen_of_spades 10_of_clubs"
    );
    await dragDrop(page, {
      origin: "#react_1_jack_of_hearts",
      destination: "#react_1_queen_of_spades",
      dragStart: true,
      drop: false,
    });
    await expect(page.locator("#react_1_values")).toHaveText(
      "queen_of_spades jack_of_hearts 10_of_clubs"
    );
    await dragDrop(page, {
      destination: "#react_1_10_of_clubs",
      dragStart: false,
      drop: true,
    });
    await expect(page.locator("#react_1_values")).toHaveText(
      "queen_of_spades 10_of_clubs jack_of_hearts"
    );
  });

  test("Iniit parent by passing in a React ref directly to `dragAndDrop` function.", async () => {
    const listitems = page.locator("#react_2 .item");
    for (let i = 0; i < (await listitems.count()); i++) {
      await expect(listitems.nth(i)).toHaveAttribute("draggable", "true");
    }
    await dragDrop(page, {
      origin: "#react_2_10_of_clubs",
      destination: "#react_2_jack_of_hearts",
      dragStart: true,
      drop: false,
    });
    await expect(page.locator("#react_2_values")).toHaveText(
      "jack_of_hearts 10_of_clubs queen_of_spades"
    );
    await dragDrop(page, {
      destination: "#react_2_queen_of_spades",
      dragStart: false,
      drop: true,
    });
    await expect(page.locator("#react_2_values")).toHaveText(
      "jack_of_hearts queen_of_spades 10_of_clubs"
    );
    await dragDrop(page, {
      origin: "#react_2_jack_of_hearts",
      destination: "#react_2_queen_of_spades",
      dragStart: true,
      drop: false,
    });
    await expect(page.locator("#react_2_values")).toHaveText(
      "queen_of_spades jack_of_hearts 10_of_clubs"
    );
    await dragDrop(page, {
      destination: "#react_2_10_of_clubs",
      dragStart: false,
      drop: true,
    });
    await expect(page.locator("#react_2_values")).toHaveText(
      "queen_of_spades 10_of_clubs jack_of_hearts"
    );
  });

  test("Init parent by calling `useDragAndDrop`.", async () => {
    const listitems = page.locator("#react_3 .item");
    for (let i = 0; i < (await listitems.count()); i++) {
      await expect(listitems.nth(i)).toHaveAttribute("draggable", "true");
    }
    await dragDrop(page, {
      origin: "#react_3_10_of_clubs",
      destination: "#react_3_jack_of_hearts",
      dragStart: true,
      drop: false,
    });
    await expect(page.locator("#react_3_values")).toHaveText(
      "jack_of_hearts 10_of_clubs queen_of_spades"
    );
    await dragDrop(page, {
      destination: "#react_3_queen_of_spades",
      dragStart: false,
      drop: true,
    });
    await expect(page.locator("#react_3_values")).toHaveText(
      "jack_of_hearts queen_of_spades 10_of_clubs"
    );
    await dragDrop(page, {
      origin: "#react_3_jack_of_hearts",
      destination: "#react_3_queen_of_spades",
      dragStart: true,
      drop: false,
    });
    await expect(page.locator("#react_3_values")).toHaveText(
      "queen_of_spades jack_of_hearts 10_of_clubs"
    );
    await dragDrop(page, {
      destination: "#react_3_10_of_clubs",
      dragStart: false,
      drop: true,
    });
    await expect(page.locator("#react_3_values")).toHaveText(
      "queen_of_spades 10_of_clubs jack_of_hearts"
    );
  });
});
