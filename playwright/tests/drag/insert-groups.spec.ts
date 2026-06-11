import { test, expect, Page } from "@playwright/test";
import { drag } from "../../utils";

let page: Page;

test.beforeEach(async ({ browser }) => {
  page = await browser.newPage();
  await page.goto("http://localhost:3001/insert/groups");
  await new Promise((r) => setTimeout(r, 1000));
});

test.describe("Insert plugin group validation (#149, #151)", async () => {
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

  test("does not transfer between lists with different groups", async () => {
    await drag(page, {
      originEl: { id: "Apple", position: "center" },
      destinationEl: { id: "Eggplant", position: "center" },
      dragStart: true,
    });
    // The insert point must not be offered over a foreign-group list.
    await expect(page.locator("#insert-point")).toBeHidden();
    await drag(page, {
      originEl: { id: "Apple", position: "center" },
      destinationEl: { id: "Eggplant", position: "center" },
      drop: true,
    });
    await expect(page.locator("#values_a")).toHaveText("Apple Banana");
    await expect(page.locator("#values_c")).toHaveText("Eggplant Fig");
  });

  test("does not transfer between independent lists with no group", async () => {
    await drag(page, {
      originEl: { id: "Apple", position: "center" },
      destinationEl: { id: "Honeydew", position: "center" },
      dragStart: true,
      drop: true,
    });
    await expect(page.locator("#values_a")).toHaveText("Apple Banana");
    await expect(page.locator("#values_e")).toHaveText("Honeydew Iceberg");
  });

  test("transfers into a list whose accepts() allows the drag", async () => {
    await drag(page, {
      originEl: { id: "Apple", position: "center" },
      destinationEl: { id: "Grape", position: "center" },
      dragStart: true,
      drop: true,
    });
    await expect(page.locator("#values_d")).toContainText("Apple");
    await expect(page.locator("#values_a")).not.toContainText("Apple");
  });

  test("still sorts within a no-group list", async () => {
    await drag(page, {
      originEl: { id: "Honeydew", position: "center" },
      destinationEl: { id: "Iceberg", position: "bottom" },
      dragStart: true,
      drop: true,
    });
    await expect(page.locator("#values_e")).toHaveText("Iceberg Honeydew");
  });

  test("shows the insert point over a same-group list", async () => {
    await drag(page, {
      originEl: { id: "Apple", position: "center" },
      destinationEl: { id: "Cherry", position: "center" },
      dragStart: true,
    });
    await expect(page.locator("#insert-point")).toBeVisible();
  });
});
