/** @jsxImportSource solid-js */
import { For, onCleanup, onMount } from "solid-js";
import { createMutable } from "solid-js/store";
import { dragAndDrop, tearDown } from "@formkit/drag-and-drop";

type Node = { id: string; label: string; children: Node[] };
function List(props: { owner: Node }) {
  let list!: HTMLUListElement;
  onMount(() => {
    dragAndDrop({ parent: list, getValues: () => props.owner.children,
      setValues: values => { props.owner.children = values; },
      config: { group: "tree", multiDrag: true } });
    onCleanup(() => tearDown(list));
  });
  return <ul ref={list} style={{ "min-height": "2rem", padding: "12px", border: "1px dashed gray" }}>
    <For each={props.owner.children}>{node => <li>{node.label}<List owner={node} /></li>}</For>
  </ul>;
}
export function Tree() {
  const root = createMutable<Node>({ id: "root", label: "root", children: [
    { id: "1", label: "Projects", children: [{ id: "2", label: "Website", children: [] }] },
    { id: "3", label: "Archive", children: [] },
  ] });
  return <List owner={root} />;
}
