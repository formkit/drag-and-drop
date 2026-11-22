/** @jsxImportSource solid-js */
import { For } from "solid-js";
import { useDragAndDrop } from "@formkit/drag-and-drop/solid";
import {
  selectedValues,
  setSelectedValues,
  clearSelection,
} from "@formkit/drag-and-drop";

export function MyComponent() {
  const [list, tapes] = useDragAndDrop<HTMLUListElement, string>(
    ["Depeche Mode", "Duran Duran", "Pet Shop Boys", "Kraftwerk"],
    { multiDrag: true, selectedClass: "selected" }
  );
  let el!: HTMLUListElement;

  // Select by value (replaces the current selection)
  const selectSynth = () => setSelectedValues(el, ["Kraftwerk", "Pet Shop Boys"]);
  // Read the current selection
  const logSelection = () => console.log(selectedValues(el));

  return (
    <>
      <ul
        ref={(node) => {
          el = node;
          list(node);
        }}
      >
        <For each={tapes()}>{(tape) => <li>{tape}</li>}</For>
      </ul>
      <button onClick={selectSynth}>Select synth-pop</button>
      <button onClick={logSelection}>Log selection</button>
      <button onClick={() => clearSelection()}>Clear</button>
    </>
  );
}
