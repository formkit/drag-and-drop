import React from "react";

import { useDragAndDrop } from "../../../src/react/index";

type Tape = {
  id: string;
  label: string;
};

const tapes: Tape[] = [
  { id: "depeche_mode", label: "Depeche Mode" },
  { id: "duran_duran", label: "Duran Duran" },
  { id: "pet_shop_boys", label: "Pet Shop Boys" },
  { id: "kraftwerk", label: "Kraftwerk" },
  { id: "tears_for_fears", label: "Tears for Fears" },
  { id: "spandau_ballet", label: "Spandau Ballet" },
];

function Test3(props: { id: string; testDescription: string }) {
  const [parent, values] = useDragAndDrop<HTMLUListElement, Tape>(tapes);

  return (
    <>
      <h3>#{props.id}</h3>
      <h4>{props.testDescription}</h4>
      <ul
        id={props.id}
        ref={parent}
        style={{ display: "block", width: "220px" }}
      >
        {values.map((tape) => (
          <li
            className="item"
            key={tape.id}
            id={props.id + "_" + tape.id}
            style={{
              boxSizing: "border-box",
              display: "block",
              height: "56px",
              margin: "0 0 8px",
              padding: "16px",
              width: "220px",
            }}
          >
            {tape.label}
          </li>
        ))}
      </ul>
      <span id={props.id + "_values"}>
        {values.map((x: Tape) => x.id).join(" ")}
      </span>
    </>
  );
}

export default Test3;
