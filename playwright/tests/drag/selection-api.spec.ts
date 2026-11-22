import { test, expect } from "@playwright/test";

const BASE = process.env.DND_TESTS_URL ?? "http://127.0.0.1:3001";

test.beforeEach(async ({ page }) => {
  await page.goto(`${BASE}/selection-api`);
  await page.waitForTimeout(500);
});

const selectedIds = (page: import("@playwright/test").Page) =>
  page.locator("li.selected").evaluateAll((els) => els.map((e) => e.id));

test("setSelectedValues selects by value and selectedValues reads it", async ({ page }) => {
  await page.click("#select");
  expect(await selectedIds(page)).toEqual(["Banana", "Pear"]);
  await expect(page.locator("#Banana")).toHaveAttribute("aria-selected", "true");
  expect(await page.evaluate(() => (window as any).readSelection())).toBe("Banana,Pear");
});

test("clicking outside clears a programmatic selection like a pointer one", async ({ page }) => {
  await page.click("#select");
  await page.click("#read");
  await expect(page.locator("#selection")).toHaveText("");
  expect(await selectedIds(page)).toEqual([]);
});

test("clearSelection removes classes and aria-selected", async ({ page }) => {
  await page.click("#select");
  await page.click("#clear");
  expect(await selectedIds(page)).toEqual([]);
  await expect(page.locator("#Banana")).toHaveAttribute("aria-selected", "false");
  await page.click("#read");
  await expect(page.locator("#selection")).toHaveText("");
});

test("without multiDrag only the first match is selected", async ({ page }) => {
  await page.click("#select-single");
  expect(await selectedIds(page)).toEqual(["Two"]);
});

test("selecting in another parent replaces the selection", async ({ page }) => {
  await page.click("#select");
  await page.click("#select-single");
  expect(await selectedIds(page)).toEqual(["Two"]);
  await page.click("#read");
  await expect(page.locator("#selection")).toHaveText("");
});

test("pointer selection is readable and dragging a programmatic selection moves it", async ({ page }) => {
  await page.click("#Apple");
  expect(await page.evaluate(() => (window as any).readSelection())).toBe("Apple");
  await page.click("#select");
  await page.dragAndDrop("#Pear", "#Apple");
  await page.waitForTimeout(300);
  const values = (await page.locator("#values").textContent())!.split(",");
  expect(values.indexOf("Banana")).toBeLessThan(values.indexOf("Apple"));
  expect(values.indexOf("Pear")).toBeLessThan(values.indexOf("Apple"));
});

test("cmd/ctrl-clicking a selected node deselects it visually", async ({ page }) => {
  const mod = process.platform === "darwin" ? "Meta" : "Control";
  await page.click("#Apple");
  await page.click("#Orange", { modifiers: [mod] });
  expect(await selectedIds(page)).toEqual(["Apple", "Orange"]);
  await page.click("#Apple", { modifiers: [mod] });
  expect(await selectedIds(page)).toEqual(["Orange"]);
  await expect(page.locator("#Apple")).toHaveAttribute("aria-selected", "false");
});
