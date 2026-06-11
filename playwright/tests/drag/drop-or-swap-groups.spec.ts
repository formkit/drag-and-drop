import { test, expect, Page } from "@playwright/test";
import { drag } from "../../utils";

let page: Page;

test.beforeEach(async ({ browser }) => {
  page = await browser.newPage();
  await page.goto("http://localhost:3001/drop-or-swap/groups");
  await new Promise((r) => setTimeout(r, 1000));
});

test.describe("dropOrSwap group validation (#157, #148)", async () => {
  test("transfers between lists sharing a group", async () => {
    await drag(page, {
      originEl: { id: "Apple", position: "center" },
      destinationEl: { id: "Cherry", position: "center" },
      dragStart: true,
      drop: true,
    });
    await expect(page.locator("#values_b")).toContainText("Apple");
    await expect(page.locator("#values_a")).not.toContainText("Apple");
  });

  test("does not transfer between lists with different groups (#157)", async () => {
    await drag(page, {
      originEl: { id: "Apple", position: "center" },
      destinationEl: { id: "Eggplant", position: "center" },
      dragStart: true,
    });
    // No drop-target styling may be offered over a foreign-group list.
    await expect(page.locator("#list_c")).not.toHaveClass(/dropZoneParent/);
    await expect(page.locator("#Eggplant")).not.toHaveClass(/dropZone/);
    await drag(page, {
      originEl: { id: "Apple", position: "center" },
      destinationEl: { id: "Eggplant", position: "center" },
      drop: true,
    });
    await expect(page.locator("#values_a")).toHaveText("Apple Banana");
    await expect(page.locator("#values_c")).toHaveText("Eggplant Fig");
  });

  test("does not transfer between independent no-group lists", async () => {
    await drag(page, {
      originEl: { id: "Apple", position: "center" },
      destinationEl: { id: "Honeydew", position: "center" },
      dragStart: true,
      drop: true,
    });
    await expect(page.locator("#values_a")).toHaveText("Apple Banana");
    await expect(page.locator("#values_e")).toHaveText("Honeydew Iceberg");
  });

  test("accepts() fires during hover, not only on release (#148)", async () => {
    await drag(page, {
      originEl: { id: "Apple", position: "center" },
      destinationEl: { id: "Grape", position: "center" },
      dragStart: true,
    });
    // accepts() must have been consulted while hovering.
    const calls = Number(await page.locator("#accepts_calls").textContent());
    expect(calls).toBeGreaterThan(0);
    await drag(page, {
      originEl: { id: "Apple", position: "center" },
      destinationEl: { id: "Grape", position: "center" },
      drop: true,
    });
    await expect(page.locator("#values_d")).toContainText("Apple");
    await expect(page.locator("#values_a")).not.toContainText("Apple");
  });

  test("still sorts within a no-group list", async () => {
    await drag(page, {
      originEl: { id: "Honeydew", position: "center" },
      destinationEl: { id: "Iceberg", position: "center" },
      dragStart: true,
      drop: true,
    });
    await expect(page.locator("#values_e")).toHaveText("Iceberg Honeydew");
  });
});
