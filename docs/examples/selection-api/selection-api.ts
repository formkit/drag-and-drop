import {
  dragAndDrop,
  selectedValues,
  setSelectedValues,
  clearSelection,
} from "@formkit/drag-and-drop";

const list = document.getElementById("list")!;
const tapes = ["Depeche Mode", "Duran Duran", "Pet Shop Boys", "Kraftwerk"];

dragAndDrop({
  parent: list,
  getValues: () => tapes,
  setValues: (newValues) => {
    tapes.splice(0, tapes.length, ...newValues);
  },
  config: { multiDrag: true, selectedClass: "selected" },
});

// Select by value (replaces the current selection)
setSelectedValues(list, ["Kraftwerk", "Pet Shop Boys"]);
// Read the current selection
console.log(selectedValues(list)); // ["Pet Shop Boys", "Kraftwerk"]
// Clear it
clearSelection();
