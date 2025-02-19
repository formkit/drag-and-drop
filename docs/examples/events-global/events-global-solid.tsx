/** @jsxImportSource solid-js */
import { createSignal } from "solid-js";
import { For } from "solid-js";
import { state } from "@formkit/drag-and-drop";
import { useDragAndDrop } from "@formkit/drag-and-drop/solid";

export function App() {
  const [dragStatus, setDragStatus] = createSignal("Not dragging");

  const [parent, items] = useDragAndDrop<HTMLUListElement, string>([
    "🍦 vanilla",
    "🍫 chocolate",
    "🍓 strawberry",
  ]);

  const onDragStarted = () => setDragStatus("Dragging");
  const onDragEnded = () => setDragStatus("Not dragging");

  state.on("dragStarted", onDragStarted);
  state.on("dragEnded", onDragEnded);

  return (
    <div>
      <strong>Rank your favorite flavors</strong>
      <br />
      <span>{dragStatus()}</span>
      <br />
      <ul ref={parent}>
        <For each={items()}>{(item) => <li>{item}</li>}</For>
      </ul>
    </div>
  );
}
