<img src="https://s3.amazonaws.com/cdn.formk.it/web-assets/drag-and-drop.gif" alt="FormKit Drag & Drop" width="250" height="250">

[![Tests](https://github.com/formkit/drag-and-drop/actions/workflows/ci.yml/badge.svg)](https://github.com/formkit/drag-and-drop/actions/workflows/ci.yml)![GitHub Sponsors](https://img.shields.io/github/sponsors/formkit)
![NPM Version](https://img.shields.io/npm/v/%40formkit%2Ftempo)

## Introduction

FormKit’s Drag and Drop is a small library for adding data-first drag and drop sorting and transferring for lists in your app. It’s simple, flexible, framework agnostic, and clocks in at only ~4Kb gzipped.

<a href="https://drag-and-drop.formkit.com">
Check out the docs here!
</a>

---

Created by the <a href="https://formkit.com">FormKit team</a>.

> [!NOTE]  
> Unlike many projects this repository includes the `dist` directory since the documentation extracts TypeScript types from the build source code.

## About this repository

## Marko

FormKit Drag and Drop supports Marko v6 via a native tag integration. Because Marko's `<lifecycle>` tag provides `onMount`, `onUpdate`, and `onDestroy` hooks directly, no separate composable or hook wrapper is needed — the `<dnd>` tag _is_ the integration.

### Installation

```bash
npm install @formkit/drag-and-drop
```

Ensure your project uses [`@marko/vite`](https://github.com/marko-js/vite) (v5.4+ for Vite 5, v6+ for Vite 8).

### Usage

Use the `:=` bind shorthand to wire up reactive state with two-way binding:

```marko
<let/tapes=[
  "Depeche Mode",
  "Duran Duran",
  "Pet Shop Boys",
  "Kraftwerk",
  "Tears for Fears",
  "Spandau Ballet",
]>

<ul/parent>
  <for|tape| of=tapes by="id">
    <li>${tape}</li>
  </for>
</ul>

<dnd:=tapes parent=parent/>
```

### Auto-discovery

The `<dnd>` tag is auto-discoverable — no import needed. Simply install `@formkit/drag-and-drop` and use `<dnd>` in any `.marko` template.

### Explicit import

If you prefer an explicit import (e.g. to rename the tag or resolve a conflict):

```marko
import Dnd from "@formkit/drag-and-drop/marko"

<Dnd:=tapes parent=parent/>
```

### Disabling drag and drop

Pass a reactive `config` variable and replace it to trigger an update:

```marko
<let/tapes=["Depeche Mode", "Duran Duran", "Pet Shop Boys"]>
<let/config={}>

<ul/parent>
  <for|tape| of=tapes by="id">
    <li>${tape}</li>
  </for>
</ul>

<dnd:=tapes parent=parent config=config/>

<button onClick() { config = { disabled: true }; }>Disable</button>
```


