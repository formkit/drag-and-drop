import React from "react";
import { useState } from "react";
import { useDragAndDrop } from "@formkit/drag-and-drop/react";

export function myComponent() {
  const [parent, values, _setValues, updateConfig] = useDragAndDrop<
    HTMLUListElement,
    string
  >([
    "Depeche Mode",
    "Duran Duran",
    "Pet Shop Boys",
    "Kraftwerk",
    "Tears for Fears",
    "Spandau Ballet",
  ]);

  const [disabled, setDisabled] = useState(false);

  const toggleDisabled = () => {
    setDisabled(!disabled);

    updateConfig({ disabled: !disabled });
  };
  return (
    <div>
      <ul ref={parent}>
        {values.map((tape) => (
          <li className="cassette" data-label={tape} key={tape}>
            {tape}
          </li>
        ))}
      </ul>
      <button onClick={toggleDisabled}>
        {disabled ? "Enable" : "Disable"} drag and drop
      </button>
    </div>
  );
}
