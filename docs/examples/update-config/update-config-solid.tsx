/** @jsxImportSource solid-js */
import { createSignal } from "solid-js";
import { For } from "solid-js";
import { useDragAndDrop } from "@formkit/drag-and-drop/solid";

export function MyComponent() {
  const [parent, values, , updateConfig] = useDragAndDrop<
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

  const [disabled, setDisabled] = createSignal(false);

  const toggleDisabled = () => {
    setDisabled(!disabled());
    updateConfig({ disabled: !disabled() });
  };

  return (
    <div>
      <ul ref={parent}>
        <For each={values()}>
          {(tape) => (
            <li class="cassette" data-label={tape}>
              {tape}
            </li>
          )}
        </For>
      </ul>
      <button onClick={toggleDisabled}>
        {disabled() ? "Enable" : "Disable"} drag and drop
      </button>
    </div>
  );
}
