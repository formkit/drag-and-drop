import { test, expect } from "@playwright/test";
import { drag, syntheticDrag, selectNode } from "../../utils";

for (const scenario of [
  { name: "native", query: "", target: "Banana", synth: false },
  { name: "synthetic", query: "?synth=1", target: "Banana", synth: true },
  { name: "cross-list", query: "", target: "Pear", synth: false },
  { name: "dropOrSwap", query: "?swap=1", target: "Banana", synth: false },
]) {
  test(`${scenario.name} settles at its final slot`, async ({ page }) => {
    await page.goto(`http://localhost:3001/drop-animation${scenario.query}`);
    await page.waitForTimeout(1000);
    await page.evaluate(() => {
      const data = { x: 0, y: 0, offsetX: 0, offsetY: 0 };
      (window as unknown as { release: typeof data }).release = data;
      document.addEventListener("dragstart", (e) => {
        const rect = (e.target as HTMLElement).getBoundingClientRect();
        data.offsetX = e.clientX - rect.left; data.offsetY = e.clientY - rect.top;
      }, true);
      document.addEventListener("dragover", (e) => { data.x = e.clientX - data.offsetX; data.y = e.clientY - data.offsetY; }, true);
      document.addEventListener("pointerup", () => {
        const rect = document.getElementById("dnd-dragged-node-clone")?.getBoundingClientRect();
        if (rect) { data.x = rect.left; data.y = rect.top; }
      }, true);
    });
    await (scenario.synth ? syntheticDrag : drag)(page, {
      originEl: { id: "Apple", position: "top" },
      destinationEl: { id: scenario.target, position: "bottom" },
      dragStart: true,
      drop: true,
    });
    const apple = page.locator("#Apple");
    await expect.poll(() => apple.evaluate((el) => el.getAnimations().some((a) => a.effect?.getTiming().duration === 1200))).toBe(true);
    const frames = await apple.evaluate((el) => {
      const animation = el.getAnimations().find((a) => a.effect?.getTiming().duration === 1200)!;
      const frames = (animation.effect as KeyframeEffect).getKeyframes();
      return { state: animation.playState, frames: frames.map((frame) => { const m = new DOMMatrix(frame.transform); return { x: m.m41, y: m.m42 }; }) };
    });
    expect(frames.state).toBe("running");
    expect(Math.abs(frames.frames[0].x) + Math.abs(frames.frames[0].y)).toBeGreaterThan(1);
    expect(frames.frames[1]).toEqual({ x: 0, y: 0 });
    await expect.poll(() => apple.evaluate((el) => el.getAnimations().length), { timeout: 3000 }).toBe(0);
    const positions = await apple.evaluate((el) => {
      const rect = el.getBoundingClientRect();
      const release = (window as unknown as { release: { x: number; y: number } }).release;
      return { x: release.x - rect.left, y: release.y - rect.top };
    });
    expect(frames.frames[0].x).toBeCloseTo(positions.x, 0);
    expect(frames.frames[0].y).toBeCloseTo(positions.y, 0);
    await expect(scenario.target === "Pear" ? page.locator("#target-values") : page.locator("#source-values")).toContainText("Apple");
  });
}

test("drop animation is opt-in", async ({ page }) => {
  await page.goto("http://localhost:3001/drop-animation?swap=1&off=1");
  await page.waitForTimeout(1000);
  await drag(page, { originEl: { id: "Apple", position: "top" }, destinationEl: { id: "Banana", position: "bottom" }, dragStart: true, drop: true });
  expect(await page.locator("#Apple").evaluate((el) => el.getAnimations().length)).toBe(0);
});


test("reduced motion skips settling", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("http://localhost:3001/drop-animation?swap=1");
  await page.waitForTimeout(1000);
  await drag(page, { originEl: { id: "Apple", position: "top" }, destinationEl: { id: "Banana", position: "bottom" }, dragStart: true, drop: true });
  expect(await page.locator("#Apple").evaluate((el) => el.getAnimations().length)).toBe(0);
});

test("a browser native drag survives pointer cancellation", async ({ page }) => {
  await page.goto("http://localhost:3001/drop-animation?swap=1");
  await page.waitForTimeout(1000);
  await page.locator("#Apple").dragTo(page.locator("#Banana"), {
    sourcePosition: { x: 30, y: 5 }, targetPosition: { x: 90, y: 40 },
  });
  await expect.poll(() => page.locator("#Apple").evaluate((el) => el.getAnimations().length)).toBeGreaterThan(0);
});

test("a transferred copy settles in its target", async ({ page }) => {
  await page.goto("http://localhost:3001/drop-animation?clone=1");
  await page.waitForTimeout(1000);
  await drag(page, { originEl: { id: "Apple", position: "top" }, destinationEl: { id: "Pear", position: "bottom" }, dragStart: true, drop: true });
  await expect(page.locator("#source-values")).toContainText("Apple");
  await expect(page.locator("#target-values")).toContainText("Apple");
  const copy = page.locator("ul").nth(1).locator("#Apple");
  await expect.poll(() => copy.evaluate((el) => el.getAnimations().some((a) => a.effect?.getTiming().duration === 1200))).toBe(true);
});


test("each selected item settles", async ({ page }) => {
  await page.goto("http://localhost:3001/drop-animation?multi=1");
  await page.waitForTimeout(1000);
  await selectNode(page, { id: "Apple" });
  await selectNode(page, { id: "Banana", shiftKey: true });
  await drag(page, { originEl: { id: "Apple", position: "top" }, destinationEl: { id: "Orange", position: "bottom" }, dragStart: true, drop: true });
  for (const id of ["Apple", "Banana"]) {
    await expect.poll(() => page.locator(`#${id}`).evaluate((el) => el.getAnimations().some((a) => a.effect?.getTiming().duration === 1200))).toBe(true);
  }
});
