import { test, expect, Page } from "@playwright/test";

let page: Page;

test.beforeEach(async ({ browser }) => {
  page = await browser.newPage();
});

test.describe("Issue #142", async () => {
  test("Text selection and deselection should work correctly in input fields", async () => {
    await page.goto("http://localhost:3001/issue-142");

    // Get the input element
    const input = page.locator(".text-input");

    // Double click on "World" to select it
    await input.dblclick();

    // Verify that text is selected
    const selectedText = await page.evaluate(() => {
      const input = document.querySelector(".text-input") as HTMLInputElement;
      return input.value.substring(input.selectionStart!, input.selectionEnd!);
    });
    expect(selectedText).toBe("World");

    // Click once more to deselect
    await input.click();

    // Verify that text is no longer selected
    const selectionAfterClick = await page.evaluate(() => {
      const input = document.querySelector(".text-input") as HTMLInputElement;
      return input.selectionStart === input.selectionEnd;
    });
    expect(selectionAfterClick).toBe(true);
  });

  test("Text selection and deselection should work correctly in input fields within draggables", async () => {
    await page.goto("http://localhost:3001/issue-142");

    // Get the input element within the first draggable item
    const draggableInput = page.locator(
      "ul.fruit-list li.item:first-child input"
    );

    // Get the initial value to verify selection later
    const initialValue = await draggableInput.inputValue();

    // Double click to select all text
    await draggableInput.dblclick();

    // Verify that text is selected
    let selectedText = await page.evaluate(() => {
      const input = document.querySelector(
        "ul.fruit-list li.item:first-child input"
      ) as HTMLInputElement;
      return input
        ? input.value.substring(input.selectionStart!, input.selectionEnd!)
        : "";
    });
    expect(selectedText).toBe(initialValue); // Should select the whole value ("Apple")

    // Click once more to deselect
    await draggableInput.click();

    // Verify that text is no longer selected
    const selectionAfterClick = await page.evaluate(() => {
      const input = document.querySelector(
        "ul.fruit-list li.item:first-child input"
      ) as HTMLInputElement;
      return input ? input.selectionStart === input.selectionEnd : false;
    });
    expect(selectionAfterClick).toBe(true);
  });
});
