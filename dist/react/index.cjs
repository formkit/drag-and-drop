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

// src/react/index.ts
var react_exports = {};
__export(react_exports, {
  dragAndDrop: () => dragAndDrop,
  useDragAndDrop: () => useDragAndDrop
});
module.exports = __toCommonJS(react_exports);
var import_react = require("react");
var import__ = require("../index.cjs");

// src/react/utils.ts
function getEl(parent) {
  if (parent instanceof HTMLElement)
    return parent;
  else if ("current" in parent && parent.current instanceof HTMLElement)
    return parent.current;
  else {
    console.warn("Invalid parent element", parent);
    return;
  }
}
function handleReactElements(element, cb) {
  const el = getEl(element);
  if (el)
    cb(el);
}

// src/react/index.ts
var parentValues = /* @__PURE__ */ new WeakMap();
function getValues(parent) {
  const values = parentValues.get(parent);
  if (!values) {
    console.warn("No values found for parent element");
    return [];
  }
  return values[0];
}
function setValues(newValues, parent) {
  const values = parentValues.get(parent);
  if (values)
    values[1](newValues);
  parentValues.set(parent, [newValues, values[1]]);
}
function handleParent(config, values) {
  return (el) => {
    parentValues.set(el, values);
    (0, import__.dragAndDrop)({ parent: el, getValues, setValues, config });
  };
}
function dragAndDrop(data) {
  if (!import__.isBrowser)
    return;
  if (!Array.isArray(data))
    data = [data];
  data.forEach((dnd) => {
    const { parent, state, ...rest } = dnd;
    handleReactElements(parent, handleParent(rest, state));
  });
}
function useDragAndDrop(list, options = {}) {
  const parent = (0, import_react.useRef)(null);
  const [values, setValues2] = (0, import_react.useState)(list);
  function updateConfig(config = {}) {
    dragAndDrop({ parent, state: [values, setValues2], ...config });
  }
  (0, import_react.useEffect)(() => {
    dragAndDrop({ parent, state: [values, setValues2], ...options });
  }, [values]);
  (0, import_react.useEffect)(() => {
    return () => {
      if (parent.current)
        (0, import__.tearDown)(parent.current);
    };
  }, []);
  return [parent, values, setValues2, updateConfig];
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  dragAndDrop,
  useDragAndDrop
});
//# sourceMappingURL=index.cjs.map