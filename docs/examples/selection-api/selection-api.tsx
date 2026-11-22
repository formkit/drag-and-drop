import React from "react";
import { useDragAndDrop } from "@formkit/drag-and-drop/react";
import {
  selectedValues,
  setSelectedValues,
  clearSelection,
} from "@formkit/drag-and-drop";

export function myComponent() {
  const [list, tapes] = useDragAndDrop<HTMLUListElement, string>(
    ["Depeche Mode", "Duran Duran", "Pet Shop Boys", "Kraftwerk"],
    { multiDrag: true, selectedClass: "selected" }
  );

  // Select by value (replaces the current selection)
  const selectSynth = () =>
    setSelectedValues(list.current!, ["Kraftwerk", "Pet Shop Boys"]);
  // Read the current selection
  const logSelection = () => console.log(selectedValues(list.current!));

  return (
    <>
      <ul ref={list}>
        {tapes.map((tape) => (
          <li key={tape}>{tape}</li>
        ))}
      </ul>
      <button onClick={selectSynth}>Select synth-pop</button>
      <button onClick={logSelection}>Log selection</button>
      <button onClick={() => clearSelection()}>Clear</button>
    </>
  );
}
