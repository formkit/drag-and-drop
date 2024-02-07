import type { ReactDragAndDropData } from "./types";

export * from "./types";

import { initParent } from "../index";

/**
 * Global store for parent els to values.
 */
const parentValues: WeakMap<
  HTMLElement,
  [Array<any>, React.Dispatch<React.SetStateAction<Array<any>>>]
> = new WeakMap();

function getValues(parent: HTMLElement): Array<any> {
  const values = parentValues.get(parent);

  if (!values) {
    console.warn("No values found for parent element");

    return [];
  }

  console.log("values", values);

  return values[0];
}

function setValues(parent: HTMLElement, newValues: Array<any>): void {
  const values = parentValues.get(parent);

  if (values) {
    console.log("new values", newValues);
    values[1](newValues);
  }
}

/**
 * Entry point for React drag and drop.
 *
 * @param data - The drag and drop configuration.
 *
 * @returns void
 */
export function dragAndDrop(
  data: ReactDragAndDropData | Array<ReactDragAndDropData>
): void {
  console.log("drag and drop", data);
  if (!Array.isArray(data)) data = [data];

  data.forEach((dnd) => {
    if (!(dnd.parent instanceof HTMLElement)) return;

    parentValues.set(dnd.parent, dnd.values);

    initParent({ parent: dnd.parent, getValues, setValues, config: {} });
  });

  //for (const { parent, values } of data) {
  //  if (parent instanceof HTMLElement) {
  //    parentValues.set(parent, values);
  //  } else {
  //    parentValues.set(parent, values);
  //  }
  //}
}
