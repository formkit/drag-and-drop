import React from "react";
import { useState } from "react";
import { useDragAndDrop } from "@formkit/drag-and-drop/react";
import { parents, addEvents } from "@formkit/drag-and-drop";

function App() {
  const [dragStatus, setDragStatus] = useState("Not dragging");
  const [dragCount, setDragCount] = useState(0);

  const dragStatusPlugin = (parent) => {
    const parentData = parents.get(parent);
    if (!parentData) return;

    function dragstart(event) {
      const node = event.target;
      setDragStatus(`Dragging ${node.textContent}`);
      setDragCount((count) => count + 1);
    }

    function dragend() {
      setDragStatus("Not dragging");
    }

    return {
      setup() {},
      teardown() {},
      setupNode(data) {
        data.nodeData.abortControllers.customPlugin = addEvents(data.node, {
          dragstart: dragstart,
          dragend: dragend,
        });
      },
      tearDownNode(data) {
        if (data.nodeData?.abortControllers?.customPlugin) {
          data.nodeData?.abortControllers?.customPlugin.abort();
        }
      },
      setupNodeRemap() {},
      tearDownNodeRemap() {},
    };
  };
  const [parent, items] = useDragAndDrop(
    ["🍦 vanilla", "🍫 chocolate", "🍓 strawberry"],
    { plugins: [dragStatusPlugin] }
  );
  return (
    <div>
      <strong>Rank your favorite flavors</strong>
      <br />
      <span>{dragStatus}</span>
      <br />
      <span>{dragCount}</span>
      <ul ref={parent}>
        {items.map((item) => {
          return <li key={item}>{item}</li>;
        })}
      </ul>
    </div>
  );
}

export default App;
