import { expect, test } from "@playwright/test";
import { syntheticDrag } from "../../utils";

test("ignored elements do not activate synthetic dragging", async ({
  page,
}) => {
  await page.goto("http://localhost:3001/drag-ignore");

  await syntheticDrag(page, {
    originEl: { id: "Apple_ignore_child", position: "center" },
    destinationEl: { id: "Banana", position: "center" },
    dragStart: true,
  });

  await expect(page.locator("#drag_ignore_values")).toHaveText(
    "Apple Banana Orange"
  );

  await syntheticDrag(page, {
    originEl: { id: "Apple", position: "left" },
    destinationEl: { id: "Banana", position: "center" },
    dragStart: true,
  });

  await expect(page.locator("#drag_ignore_values")).toHaveText(
    "Banana Apple Orange"
  );
});
