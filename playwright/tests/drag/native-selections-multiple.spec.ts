import { test, expect, Page } from "@playwright/test";
import { drag } from "../../utils";

let page: Page;

test.beforeEach(async ({ browser }) => {
  page = await browser.newPage();
});

test.describe("Native selections mulitple", async () => {
  test("Native selections multiple", async () => {
    await page.goto("http://localhost:3001/selections/native-multiple");
    await new Promise((r) => setTimeout(r, 1000));
    // When the parent is focused, the first item should get the active class
    // and the aria-activedescendant should be set to the id of the first item
    await page.locator("#fruits").focus();
    await expect(page.locator("#Apple")).toHaveAttribute(
      "aria-selected",
      "false"
    );
    await expect(page.locator("#Apple")).toHaveClass("item active");
    await expect(page.locator("#fruits")).toHaveAttribute(
      "aria-activedescendant",
      "Apple"
    );

    // Presing arrow down should set the active descendant to the next item
    await page.keyboard.press("ArrowDown");
    await expect(page.locator("#Apple")).toHaveAttribute(
      "aria-selected",
      "false"
    );
    await expect(page.locator("#Apple")).toHaveClass("item");
    await expect(page.locator("#Banana")).toHaveAttribute(
      "aria-selected",
      "false"
    );
    await expect(page.locator("#Banana")).toHaveClass("item active");
    await expect(page.locator("#fruits")).toHaveAttribute(
      "aria-activedescendant",
      "Banana"
    );

    //  Pressing arrow down again should set the active descendant to the next
    // item;
    await page.keyboard.press("ArrowDown");
    await expect(page.locator("#Banana")).toHaveAttribute(
      "aria-selected",
      "false"
    );
    await expect(page.locator("#Banana")).toHaveClass("item");
    await expect(page.locator("#Orange")).toHaveAttribute(
      "aria-selected",
      "false"
    );
    await expect(page.locator("#Orange")).toHaveClass("item active");
    await expect(page.locator("#fruits")).toHaveAttribute(
      "aria-activedescendant",
      "Orange"
    );

    //  Pressing the arrow down when at the end of the list should not change the
    //  active descendant
    await page.keyboard.press("ArrowDown");
    await expect(page.locator("#Orange")).toHaveAttribute(
      "aria-selected",
      "false"
    );
    await expect(page.locator("#Orange")).toHaveClass("item active");
    await expect(page.locator("#fruits")).toHaveAttribute(
      "aria-activedescendant",
      "Orange"
    );

    // Pressing the arrow up should set the active descendant to the previous
    // item
    await page.keyboard.press("ArrowUp");
    await expect(page.locator("#Orange")).toHaveAttribute(
      "aria-selected",
      "false"
    );
    await expect(page.locator("#Orange")).toHaveClass("item");
    await expect(page.locator("#Banana")).toHaveAttribute(
      "aria-selected",
      "false"
    );
    await expect(page.locator("#Banana")).toHaveClass("item active");
    await expect(page.locator("#fruits")).toHaveAttribute(
      "aria-activedescendant",
      "Banana"
    );

    //  Pressing the arrow up again should set the active descendant to the
    //  previous item
    await page.keyboard.press("ArrowUp");
    await expect(page.locator("#Banana")).toHaveAttribute(
      "aria-selected",
      "false"
    );
    await expect(page.locator("#Banana")).toHaveClass("item");
    await expect(page.locator("#Apple")).toHaveAttribute(
      "aria-selected",
      "false"
    );
    await expect(page.locator("#Apple")).toHaveClass("item active");
    await expect(page.locator("#fruits")).toHaveAttribute(
      "aria-activedescendant",
      "Apple"
    );

    //   Pressing the arrow up when at the beginning of the list should not change
    //   the active descendant
    await page.keyboard.press("ArrowUp");
    await expect(page.locator("#Apple")).toHaveAttribute(
      "aria-selected",
      "false"
    );
    await expect(page.locator("#Apple")).toHaveClass("item active");
    await expect(page.locator("#fruits")).toHaveAttribute(
      "aria-activedescendant",
      "Apple"
    );

    // Clicking the document will remove the active descendant
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
    await expect(page.locator("#Orange")).toHaveClass("item");
    await expect(page.locator("#Orange")).toHaveAttribute(
      "aria-selected",
      "false"
    );
    await expect(page.locator("#fruits")).toHaveAttribute(
      "aria-activedescendant",
      ""
    );

    // Focus the parent again to set the active descendant, then clicking the
    // other list should remove the active descendant
    await page.locator("#fruits").focus();
    await expect(page.locator("#Apple")).toHaveAttribute(
      "aria-selected",
      "false"
    );
    await expect(page.locator("#Apple")).toHaveClass("item active");
    await expect(page.locator("#fruits")).toHaveAttribute(
      "aria-activedescendant",
      "Apple"
    );
    await page.locator("#vegetables").focus();
    await expect(page.locator("#Apple")).toHaveAttribute(
      "aria-selected",
      "false"
    );
    await expect(page.locator("#Apple")).toHaveClass("item");
    await expect(page.locator("#fruits")).toHaveAttribute(
      "aria-activedescendant",
      ""
    );
    await expect(page.locator("#Carrot")).toHaveAttribute(
      "aria-selected",
      "false"
    );
    await expect(page.locator("#Carrot")).toHaveClass("item active");
    await expect(page.locator("#vegetables")).toHaveAttribute(
      "aria-activedescendant",
      "Carrot"
    );

    // Clicking the document should remove the active descendant
    await page.locator("#title").click();
    await expect(page.locator("#Carrot")).toHaveAttribute(
      "aria-selected",
      "false"
    );
    await expect(page.locator("#Carrot")).toHaveClass("item");
    await expect(page.locator("#vegetables")).toHaveAttribute(
      "aria-activedescendant",
      ""
    );

    // Clicking an item should select it and set the active descendant as well
    // as the selected class
    await page.locator("#Apple").click();
    await expect(page.locator("#Apple")).toHaveAttribute(
      "aria-selected",
      "true"
    );
    await expect(page.locator("#Apple")).toHaveClass("item selected active");
    await expect(page.locator("#fruits")).toHaveAttribute(
      "aria-activedescendant",
      "Apple"
    );
    await expect(page.locator("#fruits-live-region")).toHaveText(
      "Apple ready for dragging. Use arrow keys to navigate. Press enter to drop Apple."
    );

    // Pressing the arrow down should set the active descendant to the next item
    // but not change the selected item
    await page.keyboard.press("ArrowDown");
    await expect(page.locator("#Apple")).toHaveAttribute(
      "aria-selected",
      "true"
    );
    await expect(page.locator("#Apple")).toHaveClass("item selected");
    await expect(page.locator("#Banana")).toHaveClass("item active");
    await expect(page.locator("#Banana")).toHaveAttribute(
      "aria-selected",
      "false"
    );
    await expect(page.locator("#fruits")).toHaveAttribute(
      "aria-activedescendant",
      "Banana"
    );

    // Clicking banana should select it and set the active descendant and remove
    // selected from apple
    await page.locator("#Banana").click();
    await expect(page.locator("#Apple")).toHaveAttribute(
      "aria-selected",
      "false"
    );
    await expect(page.locator("#Apple")).toHaveClass("item");
    await expect(page.locator("#Banana")).toHaveAttribute(
      "aria-selected",
      "true"
    );
    await expect(page.locator("#Banana")).toHaveClass("item selected active");
    await expect(page.locator("#fruits")).toHaveAttribute(
      "aria-activedescendant",
      "Banana"
    );
    await expect(page.locator("#fruits-live-region")).toHaveText(
      "Banana ready for dragging. Use arrow keys to navigate. Press enter to drop Banana."
    );

    // Clicking the document should remove the active descendant and the
    // selected class
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
    await expect(page.locator("#fruits")).toHaveAttribute(
      "aria-activedescendant",
      ""
    );
    await expect(page.locator("#fruits-live-region")).toHaveText("");

    // Focus on the parent again to set the active descendant, then press space
    // to select the item
    await page.locator("#fruits").focus();
    await expect(page.locator("#Apple")).toHaveAttribute(
      "aria-selected",
      "false"
    );
    await expect(page.locator("#Apple")).toHaveClass("item active");
    await expect(page.locator("#fruits")).toHaveAttribute(
      "aria-activedescendant",
      "Apple"
    );
    await page.keyboard.press("Space");
    await expect(page.locator("#Apple")).toHaveAttribute(
      "aria-selected",
      "true"
    );
    await expect(page.locator("#Apple")).toHaveClass("item selected active");
    await expect(page.locator("#fruits")).toHaveAttribute(
      "aria-activedescendant",
      "Apple"
    );
    await expect(page.locator("#fruits-live-region")).toHaveText(
      "Apple ready for dragging. Use arrow keys to navigate. Press enter to drop Apple."
    );
    await page.locator("#title").click();

    // When holding shift key and selecting an item (orange), we should expect
    // to see all items between the active descendant and the selected item
    //  become selected because multi is enabled.
    await page.locator("#Orange").click({
      modifiers: ["Shift"],
    });
    await expect(page.locator("#Apple")).toHaveAttribute(
      "aria-selected",
      "true"
    );
    await expect(page.locator("#Apple")).toHaveClass("item selected");
    await expect(page.locator("#Banana")).toHaveAttribute(
      "aria-selected",
      "true"
    );
    await expect(page.locator("#Banana")).toHaveClass("item selected");
    await expect(page.locator("#Orange")).toHaveAttribute(
      "aria-selected",
      "true"
    );
    await expect(page.locator("#Orange")).toHaveClass("item selected active");
    await page.locator("#title").click();

    // When holding shift and selecting the same item, we should expect the
    // selected class to remain.
    await page.locator("#Orange").click({
      modifiers: ["Shift"],
    });
    await expect(page.locator("#Apple")).toHaveAttribute(
      "aria-selected",
      "true"
    );
    await expect(page.locator("#Apple")).toHaveClass("item selected");
    await expect(page.locator("#Banana")).toHaveAttribute(
      "aria-selected",
      "true"
    );
    await expect(page.locator("#Banana")).toHaveClass("item selected");
    await expect(page.locator("#Orange")).toHaveAttribute(
      "aria-selected",
      "true"
    );
    await expect(page.locator("#Orange")).toHaveClass("item selected active");

    // Holding shift and clicking "Potato" in the vegetables list should select
    // all items in that list. The selected class should be removed from the
    // fruits list
    await page.locator("#Potato").click({
      modifiers: ["Shift"],
    });
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
    await expect(page.locator("#Orange")).toHaveAttribute(
      "aria-selected",
      "false"
    );
    await expect(page.locator("#Orange")).toHaveClass("item");
    await expect(page.locator("#Carrot")).toHaveAttribute(
      "aria-selected",
      "true"
    );
    await expect(page.locator("#Carrot")).toHaveClass("item selected");
    await expect(page.locator("#Broccoli")).toHaveAttribute(
      "aria-selected",
      "true"
    );
    await expect(page.locator("#Broccoli")).toHaveAttribute(
      "aria-selected",
      "true"
    );
    await expect(page.locator("#Potato")).toHaveAttribute(
      "aria-selected",
      "true"
    );
    await expect(page.locator("#Potato")).toHaveClass("item selected active");

    // Clicking the document should remove the active descendant and the
    // selected class
    await page.locator("#title").click();
    await expect(page.locator("#Carrot")).toHaveAttribute(
      "aria-selected",
      "false"
    );
    await expect(page.locator("#Carrot")).toHaveClass("item");
    await expect(page.locator("#Broccoli")).toHaveAttribute(
      "aria-selected",
      "false"
    );
    await expect(page.locator("#Broccoli")).toHaveClass("item");
    await expect(page.locator("#Potato")).toHaveAttribute(
      "aria-selected",
      "false"
    );
    await expect(page.locator("#Potato")).toHaveClass("item");

    // Clicking Apple, then holding ctrl/cmd and clicking Banana should select
    // both items
    await page.locator("#Apple").click();
    await expect(page.locator("#Apple")).toHaveAttribute(
      "aria-selected",
      "true"
    );
    await expect(page.locator("#Apple")).toHaveClass("item selected active");
    await page.locator("#Banana").click({
      modifiers: ["Meta"],
    });
    await expect(page.locator("#Apple")).toHaveAttribute(
      "aria-selected",
      "true"
    );
    await expect(page.locator("#Apple")).toHaveClass("item selected");
    await expect(page.locator("#Banana")).toHaveAttribute(
      "aria-selected",
      "true"
    );
    await expect(page.locator("#Banana")).toHaveClass("item selected active");
  });
});
