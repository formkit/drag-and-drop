<p align="center">
  <a href="https://drag-and-drop.formkit.com">
    <img src="https://drag-and-drop.formkit.com/og.png" alt="FormKit Drag & Drop — a tiny declarative library for modern apps" width="640">
  </a>
</p>

<p align="center">
  <a href="https://github.com/formkit/drag-and-drop/actions/workflows/ci.yml"><img src="https://github.com/formkit/drag-and-drop/actions/workflows/ci.yml/badge.svg" alt="Tests"></a>
  <a href="https://www.npmjs.com/package/@formkit/drag-and-drop"><img src="https://img.shields.io/npm/v/%40formkit%2Fdrag-and-drop?color=fe44dc&label=npm" alt="npm version"></a>
  <a href="https://bundlephobia.com/package/@formkit/drag-and-drop"><img src="https://img.shields.io/bundlephobia/minzip/%40formkit%2Fdrag-and-drop?color=409baf&label=gzip" alt="gzip size"></a>
  <a href="https://github.com/formkit/drag-and-drop/blob/main/LICENSE"><img src="https://img.shields.io/npm/l/%40formkit%2Fdrag-and-drop?color=8b32c9" alt="MIT license"></a>
</p>

## Introduction

FormKit's Drag and Drop is a small library for adding data-first drag and drop sorting and transferring of lists to your app. It's **simple**, **flexible**, **framework agnostic**, and clocks in at only **~4Kb gzipped**.

Data-first means your array is the source of truth: drag an item and your data reorders with it — no DOM spelunking, no sortable-state to sync. It ships with first-class wrappers for **React**, **Vue**, and **Solid**, works in plain **JS/TS**, and has built-in support for multi-drag, animations, insert indicators, drop zones, drag handles, and list-to-list transfers.

## Quick start

```bash
npm install @formkit/drag-and-drop
```

```jsx
import { useDragAndDrop } from "@formkit/drag-and-drop/react";

export function Tapes() {
  const [ref, tapes] = useDragAndDrop([
    "Depeche Mode",
    "Duran Duran",
    "Pet Shop Boys",
    "Kraftwerk",
  ]);

  return (
    <ul ref={ref}>
      {tapes.map((tape) => (
        <li key={tape}>{tape}</li>
      ))}
    </ul>
  );
}
```

That's a fully sortable list — drag the items and `tapes` stays in order. The same API is available for Vue, Solid, and vanilla JS/TS.

<p align="center">
  <a href="https://drag-and-drop.formkit.com">
    <img src="https://raw.githubusercontent.com/formkit/drag-and-drop/main/docs/public/img/read-the-docs.svg" alt="Read the docs" width="300">
  </a>
</p>

---

<p align="center">
  Created by the <a href="https://formkit.com">FormKit team</a> · MIT License
</p>
