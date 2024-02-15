import type { ReactDragAndDropData, ReactParentConfig } from "./types";

import { dragAndDrop as initParent, isBrowser } from "../index";

import { handleReactElements } from "./utils";

export * from "./types";

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

  return values[0];
}

function setValues(newValues: Array<any>, parent: HTMLElement): void {
  const values = parentValues.get(parent);

  if (values) values[1](newValues);

  parentValues.set(parent, [newValues, values![1]]);
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
  if (!isBrowser) return;

  if (!Array.isArray(data)) data = [data];
  data.forEach((dnd) => {
    const { parent, values, ...rest } = dnd;

    handleReactElements(parent, handleParent(rest, values));
  });
}

function handleParent(
  config: Partial<ReactParentConfig>,
  values: [Array<any>, React.Dispatch<React.SetStateAction<Array<any>>>]
) {
  return (el: HTMLElement) => {
    parentValues.set(el, values);

    initParent({ parent: el, getValues, setValues, config });
  };
}
