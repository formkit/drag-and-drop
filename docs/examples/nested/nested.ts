import { reactive, html } from "@arrow-js/core";
import { dragAndDrop } from "@formkit/drag-and-drop";

type Node = { id: string; label: string; children: Node[] };
const root = reactive<Node>({ id: "root", label: "root", children: [
  { id: "1", label: "Projects", children: [{ id: "2", label: "Website", children: [] }] },
  { id: "3", label: "Archive", children: [] },
] });

function list(owner: Node): ReturnType<typeof html> {
  const element = html`<ul id="tree-${owner.id}" style="min-height: 2rem; padding: 12px; border: 1px dashed gray">
    ${() => owner.children.map(node => html`<li>${node.label}${list(node)}</li>`.key(node.id))}
  </ul>`;
  // Arrow mounts templates lazily; register each list after it is in the DOM.
  queueMicrotask(() => {
    const parent = document.getElementById(`tree-${owner.id}`);
    if (parent) dragAndDrop({ parent, getValues: () => owner.children,
      setValues: values => { owner.children = reactive(values); },
      config: { group: "tree", multiDrag: true } });
  });
  return element;
}
list(root)(document.getElementById("app")!);
