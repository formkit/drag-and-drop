/**
 * Compile-time regression tests, checked by `tsc --noEmit`. Not part of any
 * runtime bundle (nothing imports this module).
 *
 * #162: ParentConfig's event handlers must carry the config's generic so
 * handler parameters are typed as the consumer's item type, not a fresh
 * unrelated `T`.
 */
import type { ParentConfig } from "./types";

interface Item {
  id: string;
  label: string;
}

export const eventHandlerTypeChecks: Partial<ParentConfig<Item>> = {
  onSort: (data) => {
    const values: Array<Item> = data.values;
    const previous: Array<Item> = data.previousValues;
    const dragged: Item = data.draggedNodes[0].data.value;
    void [values, previous, dragged];
  },
  onTransfer: (data) => {
    const dragged: Item = data.draggedNodes[0].data.value;
    const index: number = data.targetIndex;
    void [dragged, index];
  },
  onDragstart: (data) => {
    const values: Array<Item> = data.values;
    const dragged: Item = data.draggedNode.data.value;
    void [values, dragged];
  },
  onDragend: (data) => {
    const values: Array<Item> = data.values;
    const dragged: Item = data.draggedNode.data.value;
    void [values, dragged];
  },
};
