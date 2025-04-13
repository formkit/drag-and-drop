"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/solid/index.ts
var index_exports = {};
__export(index_exports, {
  dragAndDrop: () => dragAndDrop,
  useDragAndDrop: () => useDragAndDrop
});
module.exports = __toCommonJS(index_exports);
var import__ = require("../index.cjs");
var import_solid_js2 = require("solid-js");
var import_store = require("solid-js/store");

// src/solid/utils.ts
var import_solid_js = require("solid-js");
function getEl(parent) {
  if (parent instanceof HTMLElement) return parent;
  else if (typeof parent !== "function") return void 0;
  const p = parent();
  return p instanceof HTMLElement ? p : void 0;
}
function handleSolidElements(element, cb) {
  (0, import_solid_js.createEffect)((0, import_solid_js.on)(() => getEl(element), (el) => el && cb(el)));
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
    (0, import__.dragAndDrop)({ parent: el, getValues, setValues, config });
  };
}
function dragAndDrop(data) {
  if (!import__.isBrowser) return;
  if (!Array.isArray(data)) data = [data];
  data.forEach((dnd) => {
    const { parent, state, ...rest } = dnd;
    handleSolidElements(parent, handleParent(rest, state));
  });
}
function useDragAndDrop(initValues, options = {}) {
  const [parent, setParent] = (0, import_solid_js2.createSignal)(null);
  const [values, setValues2] = (0, import_store.createStore)(initValues);
  function updateConfig(config = {}) {
    dragAndDrop({ parent, state: [() => values, setValues2], ...config });
  }
  (0, import_solid_js2.onMount)(
    () => dragAndDrop({ parent, state: [() => values, setValues2], ...options })
  );
  (0, import_solid_js2.onCleanup)(() => {
    const p = parent();
    p && (0, import__.tearDown)(p);
  });
  return [setParent, () => values, setValues2, updateConfig];
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  dragAndDrop,
  useDragAndDrop
});
//# sourceMappingURL=index.cjs.map