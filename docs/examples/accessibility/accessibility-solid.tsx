/** @jsxImportSource solid-js */
import { createSignal, createMemo, For } from "solid-js";
import { useDragAndDrop } from "@formkit/drag-and-drop/solid";

// Initial data for the lists
const initialItems1 = ["Apples", "Bananas", "Oranges", "Grapes"];
const initialItems2 = ["Milk", "Cheese", "Yogurt"];

interface SelectedItem {
  listIndex: 0 | 1;
  itemIndex: number;
  value: string;
}

export default function AccessibilityDemoSolid() {
  // --- Refs and Signals ---
  const [liveMessage, setLiveMessage] = createSignal("");
  let liveRegionRef: HTMLDivElement | undefined;

  // Variables to hold the actual DOM elements for comparison
  let list1RefEl: HTMLUListElement | undefined;
  let list2RefEl: HTMLUListElement | undefined;

  // --- Announcer Function ---
  const announce = (message: string) => {
    setLiveMessage(message);
    // Optional: Clear message after delay
    // setTimeout(() => setLiveMessage(''), 5000);
  };

  // --- Drag and Drop Setup ---
  // useDragAndDrop returns [setRef, itemsSignal, setItemsSignal] in Solid
  const [setList1Ref, items1, setItems1] = useDragAndDrop<
    HTMLUListElement,
    string
  >(initialItems1, {
    group: "accessibleList",
    // Let types be inferred
    onDragstart: (state) =>
      announce(`Drag started for ${state.draggedNode.data.value}.`),
    onSort: (event) =>
      announce(
        `Sorted ${event.draggedNodes[0].data.value} in List 1 to position ${
          event.position + 1
        }.`
      ),
    onTransfer: (event) => {
      // Compare event source element with the element stored in list1RefEl
      announce(
        `Transferred ${event.draggedNodes[0].data.value} from List ${
          event.sourceParent.el === list1RefEl ? 1 : 2
        } to List 1 at position ${event.targetIndex + 1}.`
      );
    },
    onDragend: (state) =>
      announce(`Drag ended for ${state.draggedNode.data.value}.`),
  });

  const [setList2Ref, items2, setItems2] = useDragAndDrop<
    HTMLUListElement,
    string
  >(initialItems2, {
    group: "accessibleList",
    onDragstart: (state) =>
      announce(`Drag started for ${state.draggedNode.data.value}.`),
    onSort: (event) =>
      announce(
        `Sorted ${event.draggedNodes[0].data.value} in List 2 to position ${
          event.position + 1
        }.`
      ),
    onTransfer: (event) => {
      // Compare event source element with the element stored in list1RefEl
      announce(
        `Transferred ${event.draggedNodes[0].data.value} from List ${
          event.sourceParent.el === list1RefEl ? 1 : 2
        } to List 2 at position ${event.targetIndex + 1}.`
      );
    },
    onDragend: (state) =>
      announce(`Drag ended for ${state.draggedNode.data.value}.`),
  });

  // --- Keyboard Navigation State ---
  const [focusedListIndex, setFocusedListIndex] = createSignal<0 | 1 | null>(
    null
  );
  const [focusedItemIndex, setFocusedItemIndex] = createSignal<number | null>(
    null
  );
  const [selectedItem, setSelectedItem] = createSignal<SelectedItem | null>(
    null
  );

  // --- Computed Values ---
  const focusedItemId = createMemo(() => {
    const listIndex = focusedListIndex();
    const itemIndex = focusedItemIndex();
    const currentItems = listIndex === 0 ? items1() : items2(); // Access signal value
    const prefix = listIndex === 0 ? "list1-item" : "list2-item";

    if (
      itemIndex !== null &&
      itemIndex >= 0 &&
      itemIndex < currentItems.length
    ) {
      return `${prefix}-${currentItems[itemIndex]}`;
    }
    return undefined;
  });

  // --- Event Handlers ---
  const handleListFocus = (listIndex: 0 | 1) => {
    setFocusedListIndex(listIndex);
    const currentItems = listIndex === 0 ? items1() : items2();
    if (focusedItemIndex() === null && currentItems.length > 0) {
      setFocusedItemIndex(0);
    }
    announce(
      `List ${listIndex + 1} focused. Use up and down arrows to navigate items.`
    );
  };

  const handleListBlur = () => {
    // Basic blur handling
  };

  const handleListKeydown = (event: KeyboardEvent, listIndex: 0 | 1) => {
    if (focusedListIndex() !== listIndex) return;

    const currentItems = listIndex === 0 ? items1() : items2();
    const setItems = listIndex === 0 ? setItems1 : setItems2;
    const currentItemIndex = focusedItemIndex(); // Access signal value

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        if (currentItems.length > 0) {
          const nextIndex =
            currentItemIndex === null
              ? 0
              : (currentItemIndex + 1) % currentItems.length;
          setFocusedItemIndex(nextIndex);
          announce(currentItems[nextIndex]);
        }
        break;

      case "ArrowUp":
        event.preventDefault();
        if (currentItems.length > 0) {
          const prevIndex =
            currentItemIndex === null
              ? currentItems.length - 1
              : (currentItemIndex - 1 + currentItems.length) %
                currentItems.length;
          setFocusedItemIndex(prevIndex);
          announce(currentItems[prevIndex]);
        }
        break;

      case " ": // Spacebar
        event.preventDefault();
        if (
          currentItemIndex !== null &&
          currentItemIndex >= 0 &&
          currentItemIndex < currentItems.length
        ) {
          const currentItemValue = currentItems[currentItemIndex];
          const currentSelection = selectedItem(); // Access signal value
          if (
            currentSelection?.listIndex === listIndex &&
            currentSelection?.itemIndex === currentItemIndex
          ) {
            setSelectedItem(null);
            announce(`${currentItemValue} deselected.`);
          } else {
            setSelectedItem({
              listIndex,
              itemIndex: currentItemIndex,
              value: currentItemValue,
            });
            announce(
              `${currentItemValue} selected. Use arrow keys to choose drop position, then press Enter.`
            );
          }
        }
        break;

      case "Enter":
        event.preventDefault();
        const currentSelection = selectedItem(); // Access signal value
        if (
          currentSelection &&
          currentItemIndex !== null &&
          currentItemIndex >= 0 &&
          currentItemIndex < currentItems.length
        ) {
          const {
            listIndex: sourceListIndex,
            itemIndex: sourceItemIndex,
            value: itemValue,
          } = currentSelection;
          const targetListIndex = listIndex;
          const targetItemIndex = currentItemIndex;

          if (
            sourceListIndex === targetListIndex &&
            sourceItemIndex === targetItemIndex
          ) {
            announce(`Keyboard: Cannot drop ${itemValue} onto itself.`);
            setSelectedItem(null);
            break;
          }

          const sourceItemsArray = sourceListIndex === 0 ? items1() : items2();
          const setSourceItems = sourceListIndex === 0 ? setItems1 : setItems2;
          const targetItemsArray = targetListIndex === 0 ? items1() : items2();
          const setTargetItems = targetListIndex === 0 ? setItems1 : setItems2;

          const newSourceItems = [...sourceItemsArray];
          newSourceItems.splice(sourceItemIndex, 1);

          const newTargetItems =
            sourceListIndex === targetListIndex
              ? newSourceItems
              : [...targetItemsArray];

          let effectiveTargetIndex = targetItemIndex;
          if (sourceListIndex === targetListIndex) {
            if (sourceItemIndex < targetItemIndex) {
              effectiveTargetIndex = targetItemIndex - 1;
            } else {
              effectiveTargetIndex = targetItemIndex;
            }
          } else {
            effectiveTargetIndex = targetItemIndex;
          }
          effectiveTargetIndex = Math.max(
            0,
            Math.min(effectiveTargetIndex, newTargetItems.length)
          );

          newTargetItems.splice(effectiveTargetIndex, 0, itemValue);

          // Use signal setters to update state
          setSourceItems(newSourceItems);
          if (sourceListIndex !== targetListIndex) {
            setTargetItems(newTargetItems);
          }
          // If same list, setSourceItems updated the array

          announce(
            `Keyboard: Moved ${itemValue} to position ${
              effectiveTargetIndex + 1
            } in List ${targetListIndex + 1}.`
          );

          setSelectedItem(null);
          setFocusedItemIndex(effectiveTargetIndex);
          setFocusedListIndex(targetListIndex);
        }
        break;

      case "Escape":
        event.preventDefault();
        if (selectedItem()) {
          // Access signal value
          announce(`Selection cancelled for ${selectedItem()!.value}.`);
          setSelectedItem(null);
        } else {
          announce("Escape pressed. No item selected.");
          (event.target as HTMLElement).blur();
          setFocusedListIndex(null);
          setFocusedItemIndex(null);
        }
        break;

      default:
        return;
    }
  };

  // --- JSX ---
  return (
    // Using a standard div wrapper
    <div class="container p-4 border-4 border-blue-300">
      <h1 class="text-xl font-bold mb-4">SolidJS Accessibility Demo</h1>
      <div class="accessibility-demo">
        {/* ARIA Live Region */}
        <div ref={liveRegionRef} aria-live="polite" class="sr-only">
          {liveMessage()} {/* Access signal value */}
        </div>

        <div class="lists-container">
          {/* List 1 */}
          <div class="list-wrapper">
            <h2 id="list1-item-heading">List 1</h2>
            <ul
              // Assign element to variable via ref callback
              ref={list1RefEl} // Assign element directly
              class="list"
              tabindex="0"
              role="listbox"
              aria-labelledby="list1-item-heading"
              aria-activedescendant={
                focusedListIndex() === 0 ? focusedItemId() : undefined
              }
              onFocus={() => handleListFocus(0)}
              onBlur={handleListBlur}
              onKeyDown={(e) => handleListKeydown(e, 0)}
            >
              <For
                each={items1()}
                fallback={<li class="empty-list-message">Empty</li>}
              >
                {(item, index) => {
                  // Use memos or functions for computed values inside For if needed
                  const isFocused = () =>
                    focusedListIndex() === 0 && focusedItemIndex() === index();
                  const isSelected = () =>
                    selectedItem()?.listIndex === 0 &&
                    selectedItem()?.itemIndex === index();
                  const itemId = () => `list1-item-${item}`;
                  return (
                    <li
                      id={itemId()}
                      // Use classList directive for dynamic classes
                      classList={{
                        item: true,
                        "item-focused": isFocused(),
                        "item-selected": isSelected(),
                      }}
                      role="option"
                      aria-selected={isFocused()}
                      tabindex="-1"
                    >
                      {item}
                    </li>
                  );
                }}
              </For>
            </ul>
          </div>

          {/* List 2 */}
          <div class="list-wrapper">
            <h2 id="list2-item-heading">List 2</h2>
            <ul
              ref={list2RefEl} // Assign element directly
              class="list"
              tabindex="0"
              role="listbox"
              aria-labelledby="list2-item-heading"
              aria-activedescendant={
                focusedListIndex() === 1 ? focusedItemId() : undefined
              }
              onFocus={() => handleListFocus(1)}
              onBlur={handleListBlur}
              onKeyDown={(e) => handleListKeydown(e, 1)}
            >
              <For
                each={items2()}
                fallback={<li class="empty-list-message">Empty</li>}
              >
                {(item, index) => {
                  const isFocused = () =>
                    focusedListIndex() === 1 && focusedItemIndex() === index();
                  const isSelected = () =>
                    selectedItem()?.listIndex === 1 &&
                    selectedItem()?.itemIndex === index();
                  const itemId = () => `list2-item-${item}`;
                  return (
                    <li
                      id={itemId()}
                      classList={{
                        item: true,
                        "item-focused": isFocused(),
                        "item-selected": isSelected(),
                      }}
                      role="option"
                      aria-selected={isFocused()}
                      tabindex="-1"
                    >
                      {item}
                    </li>
                  );
                }}
              </For>
            </ul>
          </div>
        </div>

        {/* Instructions */}
        <div class="instructions">
          <h3>Keyboard Instructions</h3>
          <ul>
            <li>
              Use <kbd>Tab</kbd> or <kbd>Shift+Tab</kbd> to focus a list.
            </li>
            <li>
              Use <kbd>↑</kbd> / <kbd>↓</kbd> arrows to navigate items within
              the focused list.
            </li>
            <li>
              Press <kbd>Spacebar</kbd> to select/deselect the highlighted item
              for moving.
            </li>
            <li>
              With an item selected, use <kbd>↑</kbd> / <kbd>↓</kbd> (within the
              same or another focused list) to choose the drop position.
            </li>
            <li>
              Press <kbd>Enter</kbd> to drop the selected item at the
              highlighted position.
            </li>
            <li>
              Press <kbd>Escape</kbd> to cancel a selection or leave the list.
            </li>
          </ul>
        </div>
      </div>
      {/* Styles needed externally */}
    </div>
  );
}
