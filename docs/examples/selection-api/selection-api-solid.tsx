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

  // Select by value (replaces the current selection)
  const selectSynth = () =>
    setSelectedValues(list()!, ["Kraftwerk", "Pet Shop Boys"]);
  // Read the current selection
  const logSelection = () => console.log(selectedValues(list()!));

  return (
    <>
      <ul ref={list}>
        <For each={tapes()}>{(tape) => <li>{tape}</li>}</For>
      </ul>
      <button onClick={selectSynth}>Select synth-pop</button>
      <button onClick={clearSelection}>Clear</button>
    </>
  );
}
