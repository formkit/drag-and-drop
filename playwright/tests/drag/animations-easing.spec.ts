import { test, expect, Page } from "@playwright/test";
import { drag } from "../../utils";

let page: Page;

test.beforeEach(async ({ browser }) => {
  page = await browser.newPage();
});

test.describe("Animations plugin easing (#70)", async () => {
  test("a configured easing is applied to sort animations", async () => {
    await page.goto("http://localhost:3001/sort/animations-easing");
    await new Promise((r) => setTimeout(r, 1000));

    await drag(page, {
      originEl: { id: "Apple", position: "center" },
      destinationEl: { id: "Banana", position: "center" },
      dragStart: true,
    });

    // The 600ms animation is still running; read its timing.
    const easing = await page.evaluate(() => {
      for (const id of ["Apple", "Banana", "Orange"]) {
        const animation = document.getElementById(id)?.getAnimations()[0];
        if (animation)
          return (animation.effect as KeyframeEffect).getTiming().easing;
      }
      return null;
    });
    expect(easing).toBe("cubic-bezier(0.22, 1, 0.36, 1)");

    await expect(page.locator("#sort_values")).toHaveText(
      "Banana Apple Orange"
    );
  });
});
