/** @jsxImportSource solid-js */
import { For } from "solid-js";
import { useDragAndDrop } from "@formkit/drag-and-drop/solid";

export function MyComponent() {
  const [list, tapes] = useDragAndDrop<HTMLUListElement, string>(
    ["Depeche Mode", "Duran Duran", "Pet Shop Boys", "Kraftwerk"],
    { dragIgnore: ".no-drag" }
  );

  return (
    <ul ref={list}>
      <For each={tapes()}>
        {(tape) => (
          <li>
            {tape}
            {/* Clicks and text selection here won't start a drag */}
            <input class="no-drag" />
          </li>
        )}
      </For>
    </ul>
  );
}
