import { untrack } from "svelte";
import {
  dragAndDrop as initParent,
  isBrowser,
  tearDown,
  type ParentConfig,
} from "../index";

/**
 * A Svelte 5 attachment: `(element) => cleanup`.
 */
export type DragAndDropAttachment = (parent: HTMLElement) => (() => void) | void;

/**
 * Drag and drop for Svelte 5, as an attachment
 * (https://svelte.dev/docs/svelte/@attach). Pass a getter and a setter for
 * your `$state` array, plus any config:
 *
 * ```svelte
 * <script>
 *   import { dragAndDrop } from "@formkit/drag-and-drop/svelte";
 *   let tapes = $state(["Depeche Mode", "Duran Duran", "Pet Shop Boys"]);
 * </script>
 *
 * <ul {@attach dragAndDrop(() => tapes, (v) => (tapes = v), { group: "a" })}>
 *   {#each tapes as tape (tape)}<li>{tape}</li>{/each}
 * </ul>
 * ```
 *
 * Config is reactive: if it reads `$state`, Svelte re-attaches with the new
 * config. Changes to the list itself don't re-attach.
 *
 * @param values - Returns the current list.
 * @param setValues - Replaces the list (called after sorting/transfers).
 * @param config - The drag and drop configuration.
 */
export function dragAndDrop<T>(
  values: () => T[],
  setValues: (values: T[]) => void,
  config: Partial<ParentConfig<T>> = {}
): DragAndDropAttachment {
  return (parent) => {
    if (!isBrowser) return;

    // Setting up reads the list; don't let that make the attachment re-run on
    // every change to it.
    untrack(() =>
      initParent<T>({
        parent,
        getValues: () => values(),
        setValues: (newValues) => setValues(newValues),
        config,
      })
    );

    return () => tearDown(parent);
  };
}
