import React from "react";
import { useDragAndDrop } from "@formkit/drag-and-drop/react";

export function myComponent() {
  const [parent, tapes] = useDragAndDrop<HTMLUListElement, string>(
    [
      "ACDC LIVE",
      "Metallica",
      "Guns N' Roses",
      "Def Leppard",
      "Bon Jovi",
      "Van Halen",
    ],
    {
      draggable: (el) => {
        return el.id !== "no-drag";
      },
    }
  );
  return (
    <ul ref={parent}>
      {tapes.map((tape) => (
        <li className="cassette" data-label={tape} key={tape}>
          {tape}
        </li>
      ))}
      <div id="no-drag">I am NOT draggable</div>
    </ul>
  );
}
