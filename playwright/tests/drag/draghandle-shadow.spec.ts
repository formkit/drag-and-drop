import { test, expect, Page } from "@playwright/test";
import { drag } from "../../utils";

let page: Page;

test.beforeEach(async ({ browser }) => {
  page = await browser.newPage();
  await page.goto("http://localhost:3001/draghandle/shadow");
  await new Promise((r) => setTimeout(r, 1000));
});

/**
 * Dispatches a pointerdown on an element that may live inside an open shadow
 * root, the way a real pointerdown would occur (composed, bubbling out of the
 * shadow tree). Native dragstart then fires on the draggable element itself,
 * which is what the drag() helper dispatches — matching real browser order.
 */
async function pointerdownDeep(page: Page, id: string) {
  await page.evaluate((id) => {
    function findDeep(root: Document | ShadowRoot): Element | null {
      const direct = root.querySelector(`#${CSS.escape(id)}`);
      if (direct) return direct;
      for (const el of Array.from(root.querySelectorAll("*"))) {
        if (el.shadowRoot) {
          const found = findDeep(el.shadowRoot);
          if (found) return found;
        }
      }
      return null;
    }

    const el = findDeep(document);

    if (!el) throw new Error(`Element not found: ${id}`);

    const rect = el.getBoundingClientRect();
    const x = rect.x + rect.width / 2;
    const y = rect.y + rect.height / 2;

    el.dispatchEvent(
      new PointerEvent("pointerdown", {
        bubbles: true,
        cancelable: true,
        composed: true,
        button: 0,
        buttons: 1,
        clientX: x,
        clientY: y,
        pointerId: 1,
        pointerType: "mouse",
        screenX: x,
        screenY: y,
      })
    );
  }, id);
}

test.describe("Drag handles inside shadow DOM (#170)", async () => {
  test("item drags when the pointer goes down on its shadow DOM handle", async () => {
    await pointerdownDeep(page, "Apple_shadowHandle");
    await drag(page, {
      originEl: { id: "Apple", position: "center" },
      destinationEl: { id: "Banana", position: "center" },
      dragStart: true,
      drop: true,
    });
    await expect(page.locator("#shadow_values")).toHaveText(
      "Banana Apple Orange"
    );
  });

  test("item does not drag when the pointer goes down outside the handle", async () => {
    await pointerdownDeep(page, "Apple");
    await drag(page, {
      originEl: { id: "Apple", position: "center" },
      destinationEl: { id: "Banana", position: "center" },
      dragStart: true,
      drop: true,
    });
    await expect(page.locator("#shadow_values")).toHaveText(
      "Apple Banana Orange"
    );
  });
});
