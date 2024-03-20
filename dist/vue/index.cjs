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

// src/vue/index.ts
var vue_exports = {};
__export(vue_exports, {
  dragAndDrop: () => dragAndDrop,
  useDragAndDrop: () => useDragAndDrop
});
module.exports = __toCommonJS(vue_exports);
var import__ = require("../index.cjs");

// src/vue/utils.ts
var import_vue = require("vue");
function getEl(parent) {
  if (parent instanceof HTMLElement)
    return parent;
  else if (parent.value instanceof HTMLElement)
    return parent.value;
  else if ("$el" in parent && parent.$el instanceof HTMLElement)
    return parent.$el;
}
function handleVueElements(elements, cb) {
  if (!Array.isArray(elements))
    elements = [elements];
  for (const element of elements) {
    const validEl = getEl(element);
    if (validEl)
      return cb(validEl);
    const stop = (0, import_vue.watch)(element, (newEl) => {
      if (!newEl)
        return;
      const validEl2 = getEl(newEl);
      !validEl2 ? console.warn("Invalid parent element", newEl) : cb(validEl2);
      stop();
    });
  }
}

// src/vue/index.ts
var import_vue2 = require("vue");
var parentValues = /* @__PURE__ */ new WeakMap();
function getValues(parent) {
  const values = parentValues.get(parent);
  if (!values) {
    console.warn("No values found for parent element");
    return [];
  }
  return values.value;
}
function setValues(newValues, parent) {
  const currentValues = parentValues.get(parent);
  if (currentValues)
    currentValues.value = newValues;
}
function dragAndDrop(data) {
  if (!import__.isBrowser)
    return;
  if (!Array.isArray(data))
    data = [data];
  data.forEach((dnd) => {
    const { parent, values, ...rest } = dnd;
    handleVueElements(parent, handleParent(rest, values));
  });
}
function useDragAndDrop(initialValues, options = {}) {
  const parent = (0, import_vue2.ref)();
  const values = (0, import_vue2.ref)(initialValues);
  function updateConfig(config = {}) {
    dragAndDrop({ parent, values, ...config });
  }
  dragAndDrop({ parent, values, ...options });
  (0, import_vue2.onUnmounted)(() => parent.value && (0, import__.tearDown)(parent.value));
  return [parent, values, updateConfig];
}
function handleParent(config, values) {
  return (parent) => {
    parentValues.set(parent, values);
    (0, import__.dragAndDrop)({
      parent,
      getValues,
      setValues,
      config: {
        ...config,
        dropZones: []
      }
    });
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  dragAndDrop,
  useDragAndDrop
});
//# sourceMappingURL=index.cjs.map