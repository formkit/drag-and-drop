/** @jsxImportSource solid-js */
import { For, type JSX } from "solid-js";
import { useDragAndDrop } from "@formkit/drag-and-drop/solid";

export const MyComponent = (): JSX.Element => {
  const [parent, tapes] = useDragAndDrop<HTMLUListElement, string>([
    "Depeche Mode",
    "Duran Duran",
    "Pet Shop Boys",
    "Kraftwerk",
    "Tears for Fears",
    "Spandau Ballet",
  ]);

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
};
