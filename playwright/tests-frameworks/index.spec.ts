import { test, expect, Page } from "@playwright/test";
import { drag } from "../utils";

let page: Page;

test.beforeAll(async ({ browser }) => {
  page = await browser.newPage();
  await page.goto("http://127.0.0.1:5173/");
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
  test("useDragAndDrop() keeps sorting across multiple rows during one drag", async ({
    browserName,
  }) => {
    test.skip(
      browserName !== "chromium",
      "Synthetic native DragEvent sequence is only deterministic in Chromium."
    );

    await page.evaluate(async () => {
      const originElement = document.getElementById(
        "react_use_drag_and_drop_continuous_depeche_mode"
      );
      const targetIds = [
        "react_use_drag_and_drop_continuous_duran_duran",
        "react_use_drag_and_drop_continuous_pet_shop_boys",
        "react_use_drag_and_drop_continuous_kraftwerk",
      ];

      if (!originElement) throw new Error("Missing origin element");

      const dataTransfer = new DataTransfer();

      const getEventProps = (element: Element) => {
        const rect = element.getBoundingClientRect();
        const x = rect.x + rect.width / 2;
        const y = rect.y + rect.height / 2;

        return {
          bubbles: true,
          cancelable: true,
          clientX: x,
          clientY: y,
          dataTransfer,
          screenX: x,
          screenY: y,
        };
      };

      originElement.dispatchEvent(
        new DragEvent("dragstart", getEventProps(originElement))
      );

      for (const id of targetIds) {
        await new Promise((resolve) => setTimeout(resolve, 100));

        const targetElement = document.getElementById(id);

        if (!targetElement) throw new Error(`Missing target element ${id}`);

        targetElement.dispatchEvent(
          new DragEvent("dragover", getEventProps(targetElement))
        );

        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      const dropElement = document.getElementById(targetIds[targetIds.length - 1]);

      if (!dropElement) throw new Error("Missing drop element");

      await new Promise((resolve) => setTimeout(resolve, 100));

      dropElement.dispatchEvent(
        new DragEvent("drop", getEventProps(dropElement))
      );

      await new Promise((resolve) => setTimeout(resolve, 200));
    });

    await expect(
      page.locator("#react_use_drag_and_drop_continuous_values")
    ).toHaveText(
      "duran_duran pet_shop_boys kraftwerk depeche_mode tears_for_fears spandau_ballet"
    );
  });

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

  test.describe("Solid wrappers working as expected", async () => {
    test("dragAndDrop() can enable sorting, accept new values, and update the parent config", async () => {
      // Check that the list items can be sorted
      await drag(page, {
        originEl: {
          id: "solid_drag_and_drop_10_of_clubs",
          position: "center",
        },
        destinationEl: {
          id: "solid_drag_and_drop_jack_of_hearts",
          position: "center",
        },
        dragStart: true,
        drop: true,
      });
      await expect(page.locator("#solid_drag_and_drop_values")).toHaveText(
        "jack_of_hearts 10_of_clubs"
      );
      // Add value
      await page.locator("#solid_drag_and_drop_add_value").click();
      await expect(page.locator("#solid_drag_and_drop_values")).toHaveText(
        "jack_of_hearts 10_of_clubs queen_of_spades"
      );
      // Check that the list items can be sorted
      await drag(page, {
        originEl: {
          id: "solid_drag_and_drop_10_of_clubs",
          position: "center",
        },
        destinationEl: {
          id: "solid_drag_and_drop_queen_of_spades",
          position: "center",
        },
        dragStart: true,
        drop: true,
      });
      await expect(page.locator("#solid_drag_and_drop_values")).toHaveText(
        "jack_of_hearts queen_of_spades 10_of_clubs"
      );
      // Disable drag and drop
      await page.locator("#solid_drag_and_drop_disable").click();
      // Check that the list items can not be sorted
      await drag(page, {
        originEl: {
          id: "solid_drag_and_drop_10_of_clubs",
          position: "center",
        },
        destinationEl: {
          id: "solid_drag_and_drop_queen_of_spades",
          position: "center",
        },
        dragStart: true,
        drop: true,
      });
      await expect(page.locator("#solid_drag_and_drop_values")).toHaveText(
        "jack_of_hearts queen_of_spades 10_of_clubs"
      );
    });

    test("useDragAndDrop() can enable sorting, accept new values, and update the parent config", async () => {
      // Check that the list items can be sorted
      await drag(page, {
        originEl: {
          id: "solid_use_drag_and_drop_10_of_clubs",
          position: "center",
        },
        destinationEl: {
          id: "solid_use_drag_and_drop_jack_of_hearts",
          position: "center",
        },
        dragStart: true,
        drop: true,
      });
      await expect(page.locator("#solid_use_drag_and_drop_values")).toHaveText(
        "jack_of_hearts 10_of_clubs"
      );
      // Add value
      await page.locator("#solid_use_drag_and_drop_add_value").click();
      await expect(page.locator("#solid_use_drag_and_drop_values")).toHaveText(
        "jack_of_hearts 10_of_clubs queen_of_spades"
      );
      // Check that the list items can be sorted
      await drag(page, {
        originEl: {
          id: "solid_use_drag_and_drop_10_of_clubs",
          position: "center",
        },
        destinationEl: {
          id: "solid_use_drag_and_drop_queen_of_spades",
          position: "center",
        },
        dragStart: true,
        drop: true,
      });
      await expect(page.locator("#solid_use_drag_and_drop_values")).toHaveText(
        "jack_of_hearts queen_of_spades 10_of_clubs"
      );
      // Disable drag and drop
      await page.locator("#solid_use_drag_and_drop_disable").click();
      // Check that the list items can not be sorted
      await drag(page, {
        originEl: {
          id: "solid_use_drag_and_drop_10_of_clubs",
          position: "center",
        },
        destinationEl: {
          id: "solid_use_drag_and_drop_jack_of_hearts",
          position: "center",
        },
        dragStart: true,
        drop: true,
      });
      await expect(page.locator("#solid_use_drag_and_drop_values")).toHaveText(
        "jack_of_hearts queen_of_spades 10_of_clubs"
      );
    });
  });
});

test.describe("Marko wrappers working as expected", async () => {
  test("dragAndDrop() can enable sorting, accept new values, and update the parent config", async () => {
    // Check that the list items can be sorted
    await drag(page, {
      originEl: {
        id: "marko_drag_and_drop_10_of_clubs",
        position: "center",
      },
      destinationEl: {
        id: "marko_drag_and_drop_jack_of_hearts",
        position: "center",
      },
      dragStart: true,
      drop: true,
    });
    await expect(page.locator("#marko_drag_and_drop_values")).toHaveText(
      "jack_of_hearts 10_of_clubs"
    );
    // Add value
    await page.locator("#marko_drag_and_drop_add_value").click();
    await expect(page.locator("#marko_drag_and_drop_values")).toHaveText(
      "jack_of_hearts 10_of_clubs queen_of_spades"
    );
    // Check that the list items can be sorted
    await drag(page, {
      originEl: {
        id: "marko_drag_and_drop_10_of_clubs",
        position: "center",
      },
      destinationEl: {
        id: "marko_drag_and_drop_queen_of_spades",
        position: "center",
      },
      dragStart: true,
      drop: true,
    });
    await expect(page.locator("#marko_drag_and_drop_values")).toHaveText(
      "jack_of_hearts queen_of_spades 10_of_clubs"
    );
    // Disable drag and drop
    await page.locator("#marko_drag_and_drop_disable").click();
    // Check that the list items can not be sorted
    await drag(page, {
      originEl: {
        id: "marko_drag_and_drop_10_of_clubs",
        position: "center",
      },
      destinationEl: {
        id: "marko_drag_and_drop_queen_of_spades",
        position: "center",
      },
      dragStart: true,
      drop: true,
    });
    await expect(page.locator("#marko_drag_and_drop_values")).toHaveText(
      "jack_of_hearts queen_of_spades 10_of_clubs"
    );
    // Re-enable drag and drop
    await page.locator("#marko_drag_and_drop_enable").click();
    // Check that the list items can be sorted again
    await drag(page, {
      originEl: {
        id: "marko_drag_and_drop_10_of_clubs",
        position: "center",
      },
      destinationEl: {
        id: "marko_drag_and_drop_jack_of_hearts",
        position: "center",
      },
      dragStart: true,
      drop: true,
    });
    await expect(page.locator("#marko_drag_and_drop_values")).toHaveText(
      "10_of_clubs jack_of_hearts queen_of_spades"
    );
  });

  test("useDragAndDrop() can enable sorting, accept new values, and update the parent config", async () => {
    // Check that the list items can be sorted
    await drag(page, {
      originEl: {
        id: "marko_use_drag_and_drop_10_of_clubs",
        position: "center",
      },
      destinationEl: {
        id: "marko_use_drag_and_drop_jack_of_hearts",
        position: "center",
      },
      dragStart: true,
      drop: true,
    });
    await expect(page.locator("#marko_use_drag_and_drop_values")).toHaveText(
      "jack_of_hearts 10_of_clubs"
    );
    // Add value
    await page.locator("#marko_use_drag_and_drop_add_value").click();
    await expect(page.locator("#marko_use_drag_and_drop_values")).toHaveText(
      "jack_of_hearts 10_of_clubs queen_of_spades"
    );
    // Check that the list items can be sorted
    await drag(page, {
      originEl: {
        id: "marko_use_drag_and_drop_10_of_clubs",
        position: "center",
      },
      destinationEl: {
        id: "marko_use_drag_and_drop_queen_of_spades",
        position: "center",
      },
      dragStart: true,
      drop: true,
    });
    await expect(page.locator("#marko_use_drag_and_drop_values")).toHaveText(
      "jack_of_hearts queen_of_spades 10_of_clubs"
    );
    // Disable drag and drop
    await page.locator("#marko_use_drag_and_drop_disable").click();
    // Check that the list items can not be sorted
    await drag(page, {
      originEl: {
        id: "marko_use_drag_and_drop_10_of_clubs",
        position: "center",
      },
      destinationEl: {
        id: "marko_use_drag_and_drop_jack_of_hearts",
        position: "center",
      },
      dragStart: true,
      drop: true,
    });
    await expect(page.locator("#marko_use_drag_and_drop_values")).toHaveText(
      "jack_of_hearts queen_of_spades 10_of_clubs"
    );
    // Re-enable drag and drop
    await page.locator("#marko_use_drag_and_drop_enable").click();
    // Check that the list items can be sorted again
    await drag(page, {
      originEl: {
        id: "marko_use_drag_and_drop_10_of_clubs",
        position: "center",
      },
      destinationEl: {
        id: "marko_use_drag_and_drop_jack_of_hearts",
        position: "center",
      },
      dragStart: true,
      drop: true,
    });
    await expect(page.locator("#marko_use_drag_and_drop_values")).toHaveText(
      "10_of_clubs jack_of_hearts queen_of_spades"
    );
  });

  test("transfer() can move items between two lists", async () => {
    // Verify initial state
    await expect(page.locator("#marko_transfer_values1")).toHaveText(
      "10_of_clubs jack_of_hearts"
    );
    await expect(page.locator("#marko_transfer_values2")).toHaveText(
      "queen_of_spades"
    );
    // Transfer 10_of_clubs from list1 to list2
    await drag(page, {
      originEl: {
        id: "marko_transfer_10_of_clubs",
        position: "center",
      },
      destinationEl: {
        id: "marko_transfer_queen_of_spades",
        position: "center",
      },
      dragStart: true,
      drop: true,
    });
    await expect(page.locator("#marko_transfer_values1")).toHaveText(
      "jack_of_hearts"
    );
    await expect(page.locator("#marko_transfer_values2")).toHaveText(
      "10_of_clubs queen_of_spades"
    );
  });
});
