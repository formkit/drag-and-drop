import type { ReactDragAndDropConfig } from "./types";
import type { ParentConfig } from "../types";
import type { Dispatch, SetStateAction, RefObject } from "react";
import { useRef, useEffect, useState } from "react";
import { dragAndDrop as initParent, isBrowser, tearDown } from "../index";
import { handleReactElements } from "./utils";
export * from "./types";

/**
 * Global store for parent els to values.
 */
const parentValues: WeakMap<
  HTMLElement,
  [Array<unknown>, React.Dispatch<React.SetStateAction<Array<unknown>>>]
> = new WeakMap();

function getValues<T>(parent: HTMLElement): Array<T> {
  const values = parentValues.get(parent);
  if (!values) {
    console.warn("No values found for parent element");
    return [];
  }
  return values[0] as Array<T>;
}

function setValues(newValues: Array<unknown>, parent: HTMLElement): void {
  const values = parentValues.get(parent);
  if (values) values[1](newValues);
  parentValues.set(parent, [newValues, values![1]]);
}

function handleParent<E extends RefObject<HTMLElement | null> | HTMLElement, T>(
  config: Partial<ReactDragAndDropConfig<E, T[]>>,
  values: [Array<any>, React.Dispatch<React.SetStateAction<Array<any>>>]
) {
  return (el: HTMLElement) => {
    parentValues.set(el, values);
    initParent<T>({ parent: el, getValues, setValues, config });
  };
}

/**
 * Entry point for React drag and drop.
 *
 * @param data - The drag and drop configuration.
 * @returns void
 */
export function dragAndDrop<E extends HTMLElement, I>(
  data:
    | ReactDragAndDropConfig<RefObject<E | null> | HTMLElement, I[]>
    | Array<ReactDragAndDropConfig<RefObject<E | null> | HTMLElement, I[]>>
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
export function useDragAndDrop<E extends HTMLElement, T = unknown>(
  list: T[],
  options: Partial<ParentConfig<T>> = {}
): [RefObject<E>, T[], Dispatch<SetStateAction<T[]>>] {
  const parent: RefObject<E> = useRef<E>(null);
  const [values, setValues] = useState(list);

  useEffect(() => {
    dragAndDrop({ parent, state: [values, setValues], ...options });
    return () => {
      if (parent.current) tearDown(parent.current);
    };
  }, [parent.current]);

  return [parent, values, setValues];
}
