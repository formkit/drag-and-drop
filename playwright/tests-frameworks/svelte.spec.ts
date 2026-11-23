import { test, expect } from "@playwright/test";
import { drag } from "../utils";

const url = process.env.FRAMEWORKS_URL ?? "http://127.0.0.1:5173/";

test.describe("Svelte attachment", () => {
  test("sorts, transfers, accepts new values and attaches once", async ({ page }) => {
    await page.goto(url);
    const values = page.locator("#svelte_a_values");
    await expect(values).toHaveText("10_of_clubs jack_of_hearts queen_of_spades");

    await drag(page, {
      originEl: { id: "svelte_10_of_clubs", position: "center" },
      destinationEl: { id: "svelte_jack_of_hearts", position: "center" },
      dragStart: true,
      drop: true,
    });
    await expect(values).toHaveText("jack_of_hearts 10_of_clubs queen_of_spades");

    await drag(page, {
      originEl: { id: "svelte_queen_of_spades", position: "center" },
      destinationEl: { id: "svelte_king_of_diamonds", position: "center" },
      dragStart: true,
      drop: true,
    });
    await expect(page.locator("#svelte_b_values")).toContainText("queen_of_spades");
    await expect(values).toHaveText("jack_of_hearts 10_of_clubs");

    await page.locator("#svelte_add").click();
    await expect(values).toHaveText("jack_of_hearts 10_of_clubs ace_of_spades");
    await drag(page, {
      originEl: { id: "svelte_ace_of_spades", position: "center" },
      destinationEl: { id: "svelte_jack_of_hearts", position: "center" },
      dragStart: true,
      drop: true,
    });
    await expect(values).toHaveText(/^ace_of_spades/);

    // List changes must not tear down and re-attach drag and drop.
    expect(await page.evaluate(() => (window as any).__svelteAttaches)).toBe(1);
  });
});
