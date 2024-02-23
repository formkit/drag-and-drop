// src/react/index.ts
import { useRef, useEffect, useState } from "react";
import { dragAndDrop as initParent, isBrowser, tearDown } from "../index.mjs";

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
function handleReactElements(elements, cb) {
  if (!Array.isArray(elements))
    elements = [elements];
  for (const element of elements) {
    const el = getEl(element);
    if (el)
      cb(el);
  }
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
    initParent({ parent: el, getValues, setValues, config });
  };
}
function dragAndDrop(data) {
  if (!isBrowser)
    return;
  if (!Array.isArray(data))
    data = [data];
  data.forEach((dnd) => {
    const { parent, state, ...rest } = dnd;
    handleReactElements(parent, handleParent(rest, state));
  });
}
function useDragAndDrop(list, options = {}) {
  const parent = useRef(null);
  const [values, setValues2] = useState(list);
  useEffect(() => {
    dragAndDrop({ parent, state: [values, setValues2], ...options });
    return () => {
      if (parent.current)
        tearDown(parent.current);
    };
  }, [parent.current]);
  return [parent, values, setValues2];
}
export {
  dragAndDrop,
  useDragAndDrop
};
//# sourceMappingURL=index.mjs.map