import React from "react";
import type { ParentConfig } from "@formkit/drag-and-drop";
import { useDragAndDrop } from "@formkit/drag-and-drop/react";

export function myComponent() {
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
    if (lastParent.el === target2.current) {
      return false;
    }

    return items2.length < 3;
  };

  const config2: Partial<ParentConfig<string>> = {};

  config2.accepts = (_parent, lastParent) => {
    if (lastParent.el === target1.current) {
      return false;
    }

    return items3.length < 5;
  };

  const [target1, items2] = useDragAndDrop(["item1", "item2"], config1);

  const [target2, items3] = useDragAndDrop(["item3", "item4"], config2);

  return (
    <div>
      <ul ref={source}>
        {items1.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <ul ref="target1">
        {items2.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>

      <ul ref="target2">
        {items3.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

export default myComponent;

const [source, items1] = useDragAndDrop(
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
    accepts: () => {
      return true;
    },
  }
);
