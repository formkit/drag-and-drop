/** @jsxImportSource solid-js */
import type { ParentConfig } from "@formkit/drag-and-drop";

import { For } from "solid-js";
import { useDragAndDrop } from "@formkit/drag-and-drop/solid";

export default function MyComponent() {
  const [source, items1] = useDragAndDrop<HTMLUListElement, string>(
    [
      "dungeon_master.exe",
      "map_1.dat",
      "map_2.dat",
      "character1.txt",
      "character2.txt",
      "shell32.dll",
      "README.txt",
    ],
    {
      draggable: (el) => {
        return el.id !== "no-drag";
      },
    }
  );

  const config1: Partial<ParentConfig<string>> = {};
  config1.accepts = (_parent, lastParent) => {
    if (lastParent.el === target2()) {
      return false;
    }
    return items2().length < 3;
  };

  const config2: Partial<ParentConfig<string>> = {};
  config2.accepts = (_parent, lastParent) => {
    if (lastParent.el === target1()) {
      return false;
    }
    return items3().length < 5;
  };

  const [target1, items2] = useDragAndDrop(
    ["knight.bmp", "dragon.bmp"],
    config1
  );
  const [target2, items3] = useDragAndDrop(["brick.bmp", "moss.bmp"], config2);

  return (
    <div>
      <ul ref={source}>
        <For each={items1()}>{(item) => <li>{item}</li>}</For>
      </ul>
      <ul ref={target1}>
        <For each={items2()}>{(item) => <li>{item}</li>}</For>
      </ul>
      <ul ref={target2}>
        <For each={items3()}>{(item) => <li>{item}</li>}</For>
      </ul>
    </div>
  );
}
