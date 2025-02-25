/** @jsxImportSource solid-js */
import { For } from "solid-js";
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
    {
      draggable: (el) => {
        return el.id !== "no-drag";
      },
    }
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
      <div id="no-drag">I am NOT draggable</div>
    </ul>
  );
}
