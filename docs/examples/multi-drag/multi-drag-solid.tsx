/** @jsxImportSource solid-js */
import { For } from "solid-js";
import { useDragAndDrop } from "@formkit/drag-and-drop/solid";

export function MyComponent() {
  const mockFileNames = [
    "dungeon_master.exe",
    "map_1.dat",
    "map_2.dat",
    "character1.txt",
    "character2.txt",
    "shell32.dll",
    "README.txt",
  ];
  const [parent1, files1] = useDragAndDrop<HTMLUListElement, string>(
    mockFileNames,
    {
      group: "A",
      multiDrag: true,
      selectedClass: "bg-blue-500 text-white",
    }
  );
  const [parent2, files2] = useDragAndDrop<HTMLUListElement, string>([], {
    group: "A",
    multiDrag: true,
    selectedClass: "bg-blue-500 text-white",
  });

  return (
    <div class="file-manager">
      <ul ref={parent1} class="file-list">
        <For each={files1()}>{(file) => <li class="file">{file}</li>}</For>
      </ul>
      <ul ref={parent2} class="file-list">
        <For each={files2()}>{(file) => <li class="file">{file}</li>}</For>
      </ul>
    </div>
  );
}
