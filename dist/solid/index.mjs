// src/solid/index.ts
import {
  dragAndDrop as initParent,
  isBrowser,
  tearDown
} from "../index.mjs";
import {
  createSignal,
  onCleanup,
  onMount
} from "solid-js";
import { createStore } from "solid-js/store";

// src/solid/utils.ts
import { createEffect, on } from "solid-js";
function getEl(parent) {
  if (parent instanceof HTMLElement) return parent;
  else if (typeof parent !== "function") return void 0;
  const p = parent();
  return p instanceof HTMLElement ? p : void 0;
}
function handleSolidElements(element, cb) {
  createEffect(on(() => getEl(element), (el) => el && cb(el)));
}

// src/solid/index.ts
var parentValues = /* @__PURE__ */ new WeakMap();
function getValues(parent) {
  const values = parentValues.get(parent);
  if (!values) {
    console.warn("No values found for parent element");
    return [];
  }
  return values[0]();
}
function setValues(newValues, parent) {
  const currentValues = parentValues.get(parent);
  if (currentValues) currentValues[1](newValues);
}
function handleParent(config, values) {
  return (el) => {
    parentValues.set(el, values);
    initParent({ parent: el, getValues, setValues, config });
  };
}
function dragAndDrop(data) {
  if (!isBrowser) return;
  if (!Array.isArray(data)) data = [data];
  data.forEach((dnd) => {
    const { parent, state, ...rest } = dnd;
    handleSolidElements(parent, handleParent(rest, state));
  });
}
function useDragAndDrop(initValues, options = {}) {
  const [parent, setParent] = createSignal(null);
  const [values, setValues2] = createStore(initValues);
  function updateConfig(config = {}) {
    dragAndDrop({ parent, state: [() => values, setValues2], ...config });
  }
  onMount(
    () => dragAndDrop({ parent, state: [() => values, setValues2], ...options })
  );
  onCleanup(() => {
    const p = parent();
    p && tearDown(p);
  });
  return [setParent, () => values, setValues2, updateConfig];
}
export {
  dragAndDrop,
  useDragAndDrop
};
//# sourceMappingURL=index.mjs.map