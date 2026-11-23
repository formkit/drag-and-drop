import { test, expect, Page } from "@playwright/test";
import { drag, selectNode, syntheticDrag } from "../../utils";

const source = (page: Page) => page.locator("#source-values");
const a = (page: Page) => page.locator("#a-values");
const b = (page: Page) => page.locator("#b-values");

test.beforeEach(async ({ page }) => { await page.goto("http://localhost:3001/clone"); await page.waitForTimeout(500); });

test("native copies once, moves between targets, returns to source and drops", async ({ page }) => {
  await drag(page, { originEl: { id: "Apple", position: "center" }, destinationEl: { id: "a", position: "bottom" }, dragStart: true });
  await expect(source(page)).toHaveText("Apple Banana Orange");
  await expect(a(page)).toHaveText("Apple");
  await drag(page, { originEl: { id: "Apple", position: "center" }, destinationEl: { id: "b", position: "bottom" } });
  await expect(a(page)).toHaveText(""); await expect(b(page)).toHaveText("Apple");
  await drag(page, { originEl: { id: "Apple", position: "center" }, destinationEl: { id: "source", position: "bottom" } });
  await expect(source(page)).toHaveText("Apple Banana Orange"); await expect(b(page)).toHaveText("");
  await drag(page, { originEl: { id: "Apple", position: "center" }, destinationEl: { id: "a", position: "bottom" }, drop: true });
  await expect(a(page)).toHaveText("Apple"); await expect(source(page)).toHaveText("Apple Banana Orange");
});

test("native cancellation removes the copy", async ({ page }) => {
  await drag(page, { originEl: { id: "Apple", position: "center" }, destinationEl: { id: "a", position: "bottom" }, dragStart: true });
  await page.locator("#Apple").dispatchEvent("dragend", { dataTransfer: await page.evaluateHandle(() => new DataTransfer()) });
  await expect(a(page)).toHaveText(""); await expect(source(page)).toHaveText("Apple Banana Orange");
});

test("multi-drag copies selection in order", async ({ page }) => {
  await selectNode(page, { id: "Apple" }); await selectNode(page, { id: "Banana", shiftKey: true });
  await drag(page, { originEl: { id: "Apple", position: "center" }, destinationEl: { id: "a", position: "bottom" }, dragStart: true, drop: true });
  await expect(a(page)).toHaveText("Apple Banana"); await expect(source(page)).toHaveText("Apple Banana Orange");
});

test("sorting a clone source still sorts", async ({ page }) => {
  await page.goto("http://localhost:3001/clone?sortable=1"); await page.waitForTimeout(500);
  await drag(page, { originEl: { id: "Apple", position: "center" }, destinationEl: { id: "Orange", position: "center" }, dragStart: true, drop: true });
  await expect(source(page)).toHaveText("Banana Orange Apple");
});

test("synthetic drag moves one copy and drops or cancels outside", async ({ page }) => {
  await page.goto("http://localhost:3001/clone?synth=1"); await page.waitForTimeout(500);
  await syntheticDrag(page, { originEl: { id: "Apple", position: "center" }, destinationEl: { id: "a", position: "bottom" }, dragStart: true });
  await expect(a(page)).toHaveText("Apple"); await expect(source(page)).toHaveText("Apple Banana Orange");
  await syntheticDrag(page, { originEl: { id: "Apple", position: "center" }, destinationEl: { id: "b", position: "bottom" }, drop: true });
  await expect(a(page)).toHaveText(""); await expect(b(page)).toHaveText("Apple");
  await syntheticDrag(page, { originEl: { id: "Apple", position: "center" }, destinationEl: { id: "a", position: "bottom" }, dragStart: true });
  await expect(a(page)).toHaveText("Apple");
  await syntheticDrag(page, { originEl: { id: "Apple", position: "center" }, destinationEl: { id: "outside", position: "center" }, drop: true });
  await expect(a(page)).toHaveText(""); await expect(b(page)).toHaveText("Apple");
});

test("browser native drag drops a copy", async ({ page }) => {
  await page.locator("#Apple").dragTo(page.locator("#a"), { targetPosition: { x: 100, y: 150 } });
  await expect(source(page)).toHaveText("Apple Banana Orange");
  await expect(a(page)).toHaveText("Apple");
});

for (const mode of ["deep", "custom", "fallback"]) {
  test(`copies object values with ${mode} cloning`, async ({ page }) => {
    await page.goto(`http://localhost:3001/clone-objects?mode=${mode}`);
    await page.waitForTimeout(800);
    await drag(page, { originEl: { id: "object-item", position: "center" }, destinationEl: { id: "object-target", position: "bottom" }, dragStart: true });
    await expect(page.locator("#object-target li")).toHaveText(mode === "custom" ? "custom" : "original");
    await expect(page.locator("#identity")).toHaveText(mode === "fallback" ? "true" : "false");
    await expect(page.locator("#nested-identity")).toHaveText(mode === "deep" ? "false" : "true");
    await drag(page, { originEl: { id: "object-item", position: "center" }, destinationEl: { id: "object-target2", position: "bottom" }, drop: true });
    await expect(page.locator("#object-target li")).toHaveCount(0);
    await expect(page.locator("#object-target2 li")).toHaveText(mode === "custom" ? "custom" : "original");
    await expect(page.locator("#object-source li")).toHaveText("original");
  });
}
