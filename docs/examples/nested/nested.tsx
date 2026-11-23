import React from "react";
import { dragAndDrop, tearDown } from "@formkit/drag-and-drop";

type Node = { id: string; label: string; children: Node[] };
const initial: Node = { id: "root", label: "root", children: [
  { id: "1", label: "Projects", children: [{ id: "2", label: "Website", children: [] }] },
  { id: "3", label: "Archive", children: [] },
] };

function List({ owner, changed }: { owner: Node; changed: () => void }) {
  const list = React.useRef<HTMLUListElement>(null);
  React.useEffect(() => {
    const parent = list.current!;
    dragAndDrop({ parent, getValues: () => owner.children, setValues: values => {
      owner.children = values;
      changed();
    }, config: { group: "tree", multiDrag: true } });
    return () => tearDown(parent);
  }, [owner, changed]);
  return <ul ref={list} style={{ minHeight: 32, padding: 12, border: "1px dashed gray" }}>
    {owner.children.map(node => <li key={node.id}>{node.label}<List owner={node} changed={changed} /></li>)}
  </ul>;
}
export function Tree() {
  const [root] = React.useState(() => structuredClone(initial));
  const [, render] = React.useReducer(n => n + 1, 0);
  return <List owner={root} changed={render} />;
}
