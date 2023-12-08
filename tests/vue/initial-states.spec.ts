import { test, expect, Page } from "@playwright/test";
import { dragDrop } from "../utils";

let page: Page;

test.beforeAll(async ({ browser }) => {
  page = await browser.newPage();
  await page.goto("http://localhost:3000/tests/initial-states");
});

test.describe("Drag functionality can be added to a given list by calling the dragAndDrop function in Vue`s setup script.", async () => {
  test("dragAndDrop called in setup script with ref", async () => {
    // Drag start apple and drag to banana
    await expect(page.locator("#Apple")).toHaveAttribute("draggable", "true");
    await expect(page.locator("#Banana")).toHaveAttribute("draggable", "true");
    await expect(page.locator("#Orange")).toHaveAttribute("draggable", "true");
    // Drag start apple and drag to banana
    await dragDrop(page, {
      origin: "#Apple",
      destination: "#Banana",
      dragStart: true,
      drop: true,
    });
    await expect(page.locator("#values_1")).toHaveValue("Banana Apple Orange");
  });

  test("dragAndDrop called onMounted with ref", async () => {
    // Drag start apple and drag to banana
    await expect(page.locator("#Pear")).toHaveAttribute("draggable", "true");
    await expect(page.locator("#Strawberry")).toHaveAttribute(
      "draggable",
      "true"
    );
    // Drag start apple and drag to banana
    await dragDrop(page, {
      origin: "#Pear",
      destination: "#Strawberry",
      dragStart: true,
      drop: true,
    });
    await expect(page.locator("#values_2")).toHaveValue("Strawberry Pear");
  });

  test("dragAndDrop called in setup script, and element renders after one second after onMounted", async () => {
    await expect(page.locator("#Peach")).toHaveAttribute("draggable", "true");
    await expect(page.locator("#Grape")).toHaveAttribute("draggable", "true");
    await dragDrop(page, {
      origin: "#Peach",
      destination: "#Grape",
      dragStart: true,
      drop: true,
    });
    await expect(page.locator("#values_3")).toHaveValue("Grape Peach");
  });

  test("dragAndDrop called on mounted, directly passes HTMLElement", async () => {
    await expect(page.locator("#Watermelon")).toHaveAttribute(
      "draggable",
      "true"
    );
    await expect(page.locator("#Kiwi")).toHaveAttribute("draggable", "true");
    await expect(page.locator("#Mango")).toHaveAttribute("draggable", "true");
    await dragDrop(page, {
      origin: "#Watermelon",
      destination: "#Kiwi",
      dragStart: true,
      drop: true,
    });
    await expect(page.locator("#values_4")).toHaveValue(
      "Kiwi Watermelon Mango"
    );
  });
});
