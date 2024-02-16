import type { ReactDragAndDropConfig } from "./types";
import type { ParentConfig } from "../types";
import type { Dispatch, SetStateAction, MutableRefObject } from "react";
import { useRef, useEffect, useState } from "react";
import { dragAndDrop as initParent, isBrowser } from "../index";
import { handleReactElements } from "./utils";
export * from "./types";

/**
 * Global store for parent els to values.
 */
const parentValues: WeakMap<
  HTMLElement,
  [Array<unknown>, React.Dispatch<React.SetStateAction<Array<unknown>>>]
> = new WeakMap();

function getValues(parent: HTMLElement): Array<unknown> {
  const values = parentValues.get(parent);
  if (!values) {
    console.warn("No values found for parent element");
    return [];
  }
  return values[0];
}

function setValues(newValues: Array<unknown>, parent: HTMLElement): void {
  const values = parentValues.get(parent);
  if (values) values[1](newValues);
  parentValues.set(parent, [newValues, values![1]]);
}

function handleParent<ListItem>(
  config: Partial<ReactDragAndDropConfig<ListItem[]>>,
  values: [Array<any>, React.Dispatch<React.SetStateAction<Array<any>>>]
) {
  return (el: HTMLElement) => {
    parentValues.set(el, values);
    initParent({ parent: el, getValues, setValues, config });
  };
}

/**
 * Entry point for React drag and drop.
 *
 * @param data - The drag and drop configuration.
 * @returns void
 */
export function dragAndDrop<ListItem>(
  data:
    | ReactDragAndDropConfig<ListItem[]>
    | Array<ReactDragAndDropConfig<ListItem[]>>
): void {
  if (!isBrowser) return;
  if (!Array.isArray(data)) data = [data];
  data.forEach((dnd) => {
    const { parent, state, ...rest } = dnd;
    handleReactElements(parent, handleParent(rest, state));
  });
}

/**
 * Hook for adding drag and drop/sortable support to a list of items.
 *
 * @param list - Initial list of data.
 * @param options - The drag and drop configuration.
 * @returns
 */
export function useDragAndDrop<ListItem>(
  list: ListItem[],
  options: Partial<ParentConfig> = {}
): [
  MutableRefObject<HTMLElement | null>,
  ListItem[],
  Dispatch<SetStateAction<ListItem[]>>
] {
  const parent: MutableRefObject<HTMLElement | null> = useRef(null);
  const [values, setValues] = useState(list);
  dragAndDrop<ListItem>({ parent, state: [values, setValues], ...options });

  useEffect(() => {
    dragAndDrop({ parent, state: [values, setValues], ...options });
  }, []);
  return [parent, values, setValues];
}
