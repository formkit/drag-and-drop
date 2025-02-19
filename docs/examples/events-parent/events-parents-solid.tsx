/** @jsxImportSource solid-js */
// Start of Selection
import { createSignal } from "solid-js";
import { For } from "solid-js";
import { useDragAndDrop } from "@formkit/drag-and-drop/solid";

export function App() {
  const [dragStatus, setDragStatus] = createSignal("Not dragging");
  const [valuesChanged, setValuesChanged] = createSignal("Not sorting");

  const [parent, items] = useDragAndDrop<HTMLUListElement, string>(
    ["🍦 vanilla", "🍫 chocolate", "🍓 strawberry"],
    {
      onDragstart: () => {
        setDragStatus("Dragging");
      },
      onDragend: () => {
        setDragStatus("Not dragging");
        setValuesChanged("Not sorting");
      },
      onSort: (event) => {
        setValuesChanged(`${event.previousValues} -> ${event.values}`);
      },
    }
  );

  return (
    <div>
      <strong>Rank your favorite flavors</strong>
      <br />
      <span>{dragStatus()}</span>
      <span>{valuesChanged()}</span>
      <br />
      <ul ref={parent}>
        <For each={items()}>{(item) => <li>{item}</li>}</For>
      </ul>
    </div>
  );
}
