// TODO:
import React from "react";
import { useDragAndDrop } from "@formkit/drag-and-drop/react";
import { multiDrag, selections } from "@formkit/drag-and-drop";

export function myComponent() {
  const mockFileNames = [
    "file1.txt",
    "file2.txt",
    "file3.txt",
    "file4.txt",
    "file5.txt",
    "file6.txt",
    "file7.txt",
  ];

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
    <div className="group bg-slate-500 dark:bg-slate-800 data-[handles=true]:bg-emerald-700 dark:data-[handles=true]:bg-emerald-950">
      <div className="kanban-board p-4 flex bg-white justify-between">
        <ul ref={parent1}>
          {files1.map((file) => (
            <li key={file}>{file}</li>
          ))}
        </ul>
        <ul ref={parent2}>
          {files2.map((file) => (
            <li key={file}>{file}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
