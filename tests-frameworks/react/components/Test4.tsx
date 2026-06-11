import React from "react";

import { useState, useEffect, useRef } from "react";

import { dragAndDrop } from "../../../src/react/index";

/**
 * Regression component for #169: state updates are committed in a
 * transition, so the DOM lags behind the values array the way a slow
 * React render does. Rapid drags must not scramble node identities.
 */
function Test4(props: { id: string; testDescription: string }) {
  const [values, setValues] = useState(["one", "two", "three", "four", "five"]);

  const parent = useRef(null);

  useEffect(() => {
    dragAndDrop<HTMLUListElement, string>({
      parent,
      state: [
        values,
        // Commit to React 50ms late: the adapter's value store updates
        // synchronously while the DOM lags behind, the way a slow React
        // render does in real apps (#169).
        (newValues) =>
          setTimeout(
            () => setValues(newValues as React.SetStateAction<string[]>),
            50
          ),
      ],
    });
  }, [values]);

  return (
    <>
      <h3>#{props.id}</h3>
      <h4>{props.testDescription}</h4>
      <ul id={props.id} ref={parent}>
        {values.map((value) => (
          <li className="item" key={value} id={props.id + "_" + value}>
            {value}
          </li>
        ))}
      </ul>
      <span id={props.id + "_values"}>{values.join(" ")}</span>
    </>
  );
}

export default Test4;
