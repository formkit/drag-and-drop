import React from "react";
import { useDragAndDrop } from "@formkit/drag-and-drop/react";
import { multiDrag, selections } from "@formkit/drag-and-drop";

export function myComponent() {
  const mockFileNames = ["dungeon_master.exe", "map_1.dat", "map_2.dat", "character1.txt", "character2.txt", "shell32.dll", "README.txt"];
  const [parent1, files1] = useDragAndDrop<HTMLUListElement, string>(
    mockFileNames,
    {
      group: "A",
      plugins: [
        multiDrag({
          plugins: [
            selections({
              selectedClass: "bg-blue-500 text-white",
            }),
          ],
        }),
      ],
    }
  );
  const [parent2, files2] = useDragAndDrop<HTMLUListElement, string>([], {
    group: "A",
    plugins: [
      multiDrag({
        plugins: [
          selections({
            selectedClass: "bg-blue-500 text-white",
          }),
        ],
      }),
    ],
  });

  return (
    <div className="file-manager">
      <ul ref={parent1} className="file-list">
        {files1.map((file) => (
          <li key={file} className="file">{file}</li>
        ))}
      </ul>
      <ul ref={parent2} className="file-list">
        {files2.map((file) => (
          <li key={file} className="file">{file}</li>
        ))}
      </ul>
    </div>
  );
}
