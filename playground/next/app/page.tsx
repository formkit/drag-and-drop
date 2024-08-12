"use client";

import { dragAndDrop } from "@formkit/drag-and-drop/react";
import { useRef, useState } from "react";
import React from "react";

export default function Home() {
  const [imageList, setImageList] = useState(["hello", "world"]);

  const parent = useRef() as React.MutableRefObject<HTMLDivElement>;

  dragAndDrop({
    parent,
    state: [imageList, setImageList],
  });

  return (
    <div ref={parent}>
      {imageList.map((tape) => (
        <li className="cassette" data-label={tape} key={tape}>
          {tape}
        </li>
      ))}
    </div>
  );
}
