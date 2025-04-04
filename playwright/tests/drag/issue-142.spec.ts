import { test, expect, Page } from "@playwright/test";

let page: Page;

test.beforeEach(async ({ browser }) => {
  page = await browser.newPage();
});

test.describe("Issue #142", async () => {
  test.only("Text selection and deselection should work correctly in input fields", async () => {
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
});
