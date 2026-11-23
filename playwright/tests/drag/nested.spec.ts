import { test, expect, type Page } from "@playwright/test";
import { drag, syntheticDrag, selectNode } from "../../utils";

type Node = { id: string; children: Node[] };
async function tree(page: Page): Promise<Node[]> { return JSON.parse(await page.locator("#tree-data").innerText()); }
function find(nodes: Node[], id: string): Node | undefined { for (const n of nodes) { if (n.id === id) return n; const found = find(n.children, id); if (found) return found; } }
async function consistent(page: Page) {
  const values = await tree(page);
  const check = async (owner: string, children: Node[]) => {
    await expect(page.locator(`#list-${owner} > li`)).toHaveCount(children.length);
    expect(await page.locator(`#list-${owner} > li`).evaluateAll(els => els.map(el => el.id))).toEqual(children.map(n => n.id));
    for (const child of children) await check(child.id, child.children);
  };
  await check("root", values);
}
for (const mode of ["native", "synthetic"] as const) {
  test.describe(mode, () => {
    test.beforeEach(async ({ page }) => { await page.setViewportSize({ width: 1800, height: 2000 }); await page.goto(`http://127.0.0.1:3001/nested${mode === "synthetic" ? "?synthetic=1" : ""}`); await expect(page.locator("#A11")).toHaveAttribute("draggable", "true"); });
    async function move(page: Page, from: string, to: string) {
      await (mode === "native" ? drag : syntheticDrag)(page, { originEl: { id: from, position: "top" }, destinationEl: { id: to, position: "bottom" }, dragStart: true, drop: true });
    }
    for (const [from, to, owner, order] of [["A", "B", "root", ["B", "A", "C"]], ["A1", "A2", "A", ["A2", "A1"]], ["A11", "A12", "A1", ["A12", "A11"]]] as const) {
      test(`sort ${owner}`, async ({ page }) => { await move(page, from, to); const nodes = await tree(page); expect((owner === "root" ? nodes : find(nodes, owner)!.children).map(n => n.id)).toEqual(order); await consistent(page); });
    }
    test("transfer to another branch and retain subtree", async ({ page }) => { await move(page, "A1", "list-B"); const nodes = await tree(page); expect(find(nodes, "B")!.children.map(n => n.id)).toContain("A1"); expect(find(nodes, "A1")!.children.map(n => n.id)).toEqual(["A11", "A12"]); await consistent(page); });
    test("transfer deeper into empty list", async ({ page }) => { await move(page, "B1", "list-A11"); expect(find(await tree(page), "A11")!.children.map(n => n.id)).toContain("B1"); await consistent(page); });
    test("transfer shallower", async ({ page }) => { await move(page, "A11", "list-root"); expect((await tree(page)).map(n => n.id)).toContain("A11"); await consistent(page); });
    test("reject own descendant", async ({ page }) => { const before = await tree(page); await move(page, "A", "list-A11"); expect(await tree(page)).toEqual(before); await consistent(page); });
    test("child activation does not drag parent", async ({ page }) => { await move(page, "A11", "list-B"); const nodes = await tree(page); expect(nodes.map(n => n.id)).toEqual(["A", "B", "C"]); expect(find(nodes, "B")!.children.map(n => n.id)).toContain("A11"); await consistent(page); });
    test("reject descendants of any selected node", async ({ page }) => {
      await selectNode(page, { id: "A1" });
      await selectNode(page, { id: "A2", ctrlKey: true });
      const before = await tree(page);
      await move(page, "A1", "list-A2");
      expect(await tree(page)).toEqual(before);
      await consistent(page);
    });
    test("multi-drag siblings into another level", async ({ page }) => { await selectNode(page, { id: "A1" }); await selectNode(page, { id: "A2", ctrlKey: true }); await move(page, "A1", "list-B1"); expect(find(await tree(page), "B1")!.children.map(n => n.id)).toEqual(["A1", "A2"]); await consistent(page); });
  });
}

test("browser mouse drag starts the child rather than its ancestor", async ({ page }) => {
  await page.setViewportSize({ width: 1800, height: 2000 });
  await page.goto("http://127.0.0.1:3001/nested");
  await expect(page.locator("#A11")).toHaveAttribute("draggable", "true");
  const start = await page.locator("#label-A11").boundingBox();
  const end = await page.locator("#list-B").boundingBox();
  if (!start || !end) throw new Error("Missing drag target");
  await page.mouse.move(start.x + 5, start.y + 5);
  await page.mouse.down();
  await page.mouse.move(end.x + 10, end.y + end.height - 5, { steps: 20 });
  await page.mouse.move(end.x + 10, end.y + end.height - 5);
  await page.mouse.up();
  await expect.poll(async () => find(await tree(page), "B")!.children.map(n => n.id)).toContain("A11");
  expect((await tree(page)).map(n => n.id)).toEqual(["A", "B", "C"]);
  await consistent(page);
});
