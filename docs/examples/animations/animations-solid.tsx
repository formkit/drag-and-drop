/** @jsxImportSource solid-js */
import { For } from "solid-js";
import { animations } from "@formkit/drag-and-drop";
import { useDragAndDrop } from "@formkit/drag-and-drop/solid";

export function MyComponent() {
  const [parent, tapes] = useDragAndDrop<HTMLUListElement, string>(
    [
      "Depeche Mode",
      "Duran Duran",
      "Pet Shop Boys",
      "Kraftwerk",
      "Tears for Fears",
      "Spandau Ballet",
    ],
    { plugins: [animations()] }
  );
  return (
    <ul ref={parent}>
      <For each={tapes()}>
        {(tape) => (
          <li class="cassette" data-label={tape}>
            {tape}
          </li>
        )}
      </For>
    </ul>
  );
}
