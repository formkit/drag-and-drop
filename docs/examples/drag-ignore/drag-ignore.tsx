import React from "react";
import { useDragAndDrop } from "@formkit/drag-and-drop/react";

type Tape = { name: string; note: string };

export function myComponent() {
  const [list, tapes, setTapes] = useDragAndDrop<HTMLUListElement, Tape>(
    [
      { name: "Depeche Mode", note: "" },
      { name: "Duran Duran", note: "" },
      { name: "Pet Shop Boys", note: "" },
      { name: "Kraftwerk", note: "" },
    ],
    { dragIgnore: ".no-drag" }
  );

  return (
    <ul ref={list}>
      {tapes.map((tape) => (
        <li key={tape.name}>
          {tape.name}
          {/* Clicks and text selection here won't start a drag */}
          <input
            className="no-drag"
            value={tape.note}
            onChange={(e) =>
              setTapes(
                tapes.map((t) =>
                  t.name === tape.name ? { ...t, note: e.target.value } : t
                )
              )
            }
          />
        </li>
      ))}
    </ul>
  );
}
