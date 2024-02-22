import React from "react";
import { useState } from "react";
import type { DNDPlugin } from "@formkit/drag-and-drop";
import { useDragAndDrop } from "@formkit/drag-and-drop/react";
import { parents } from "@formkit/drag-and-drop";

export function myComponent() {
  const [dragStatus, setDragStatus] = useState("Not dragging");

  const [dragCount, setCount] = useState(0);

  const dragStatusPlugin: DNDPlugin = (parent) => {
    const parentData = parents.get(parent);

    if (!parentData) return;

    function dragstart(event: DragEvent) {
      const node = event.target as HTMLElement;
      setDragStatus(`Dragging ${node.textContent}`);
      setCount(dragCount + 1);
    }

    function dragend() {
      setDragStatus("Not dragging");
    }

    return {
      setup() {},
      teardown() {},

      setupNode(data) {
        data.node.addEventListener("dragstart", dragstart);

        data.node.addEventListener("dragend", dragend);
      },
      tearDownNode(data) {
        data.node.removeEventListener("dragstart", dragstart);

        data.node.removeEventListener("dragend", dragend);
      },

      setupNodeRemap(data) {},
      tearDownNodeRemap(data) {},
    };
  };

  const [parent, items] = useDragAndDrop<HTMLUListElement, string>(
    ["🍦 vanilla", "🍫 chocolate", "🍓 strawberry"],
    {
      plugins: [dragStatusPlugin],
    }
  );
  return (
    <div>
      <h1>{dragStatus}</h1>
      <h1>{dragCount}</h1>
      <ul ref={parent}>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
