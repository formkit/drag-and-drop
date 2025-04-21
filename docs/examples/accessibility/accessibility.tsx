import React, { useState, useRef, useCallback, useMemo } from "react";
import { useDragAndDrop } from "@formkit/drag-and-drop/react";

// Initial data for the lists
const initialItems1 = ["Apples", "Bananas", "Oranges", "Grapes"];
const initialItems2 = ["Milk", "Cheese", "Yogurt"];

interface SelectedItem {
  listIndex: 0 | 1;
  itemIndex: number;
  value: string;
}

export default function AccessibilityDemoReact() {
  // Refs for ARIA Live region
  const [liveMessage, setLiveMessage] = useState("");
  const liveRegionRef = useRef<HTMLDivElement>(null);

  // Function to update the live region
  const announce = useCallback((message: string) => {
    setLiveMessage(message);
    // Optional: Clear the message after a delay
    // const timer = setTimeout(() => setLiveMessage(''), 5000);
    // return () => clearTimeout(timer);
  }, []);

  // Setup drag and drop for List 1
  const [list1Ref, items1, setItems1] = useDragAndDrop<
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
      announce(
        `Transferred ${event.draggedNodes[0].data.value} from List ${
          event.sourceParent.el === list1Ref.current ? 1 : 2
        } to List 1 at position ${event.targetIndex + 1}.`
      );
    },
    onDragend: (state) =>
      announce(`Drag ended for ${state.draggedNode.data.value}.`),
  });

  // Setup drag and drop for List 2
  const [list2Ref, items2, setItems2] = useDragAndDrop<
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
      // Compare against element refs
      announce(
        `Transferred ${event.draggedNodes[0].data.value} from List ${
          event.sourceParent.el === list1Ref.current ? 1 : 2
        } to List 2 at position ${event.targetIndex + 1}.`
      );
    },
    onDragend: (state) =>
      announce(`Drag ended for ${state.draggedNode.data.value}.`),
  });

  // State for keyboard navigation
  const [focusedListIndex, setFocusedListIndex] = useState<0 | 1 | null>(null);
  const [focusedItemIndex, setFocusedItemIndex] = useState<number | null>(null);
  const [selectedItem, setSelectedItem] = useState<SelectedItem | null>(null);

  // Calculate focusedItemId directly
  const focusedItemId = useMemo(() => {
    if (
      focusedListIndex === 0 &&
      focusedItemIndex !== null &&
      focusedItemIndex < items1.length
    ) {
      return `list1-item-${items1[focusedItemIndex]}`;
    }
    if (
      focusedListIndex === 1 &&
      focusedItemIndex !== null &&
      focusedItemIndex < items2.length
    ) {
      return `list2-item-${items2[focusedItemIndex]}`;
    }
    return undefined;
  }, [focusedListIndex, focusedItemIndex, items1, items2]);

  const handleListFocus = useCallback(
    (listIndex: 0 | 1) => {
      setFocusedListIndex(listIndex);
      const currentItems = listIndex === 0 ? items1 : items2;
      if (focusedItemIndex === null && currentItems.length > 0) {
        setFocusedItemIndex(0);
      }
      announce(
        `List ${
          listIndex + 1
        } focused. Use up and down arrows to navigate items.`
      );
    },
    [items1, items2, announce, focusedItemIndex]
  );

  const handleListBlur = useCallback(() => {
    // Minimal blur handler - prevents immediate focus loss when clicking between elements
    // More complex logic might be needed for specific focus management scenarios
  }, []);

  const handleListKeydown = useCallback(
    (event: React.KeyboardEvent<HTMLUListElement>, listIndex: 0 | 1) => {
      if (focusedListIndex !== listIndex) return;

      const currentItems = listIndex === 0 ? items1 : items2;
      const setItems = listIndex === 0 ? setItems1 : setItems2;
      const currentItemIndex = focusedItemIndex;

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
            if (
              selectedItem?.listIndex === listIndex &&
              selectedItem?.itemIndex === currentItemIndex
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
          if (
            selectedItem &&
            currentItemIndex !== null &&
            currentItemIndex >= 0 &&
            currentItemIndex < currentItems.length
          ) {
            const {
              listIndex: sourceListIndex,
              itemIndex: sourceItemIndex,
              value: itemValue,
            } = selectedItem;
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

            const sourceItemsArray = sourceListIndex === 0 ? items1 : items2;
            const setSourceItems =
              sourceListIndex === 0 ? setItems1 : setItems2;
            const targetItemsArray = targetListIndex === 0 ? items1 : items2;
            const setTargetItems =
              targetListIndex === 0 ? setItems1 : setItems2;

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

            // Update state using the hook's setters
            setSourceItems(newSourceItems);
            if (sourceListIndex !== targetListIndex) {
              setTargetItems(newTargetItems);
            }
            // If same list, setSourceItems has updated the array

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
          if (selectedItem) {
            announce(`Selection cancelled for ${selectedItem.value}.`);
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
    },
    [
      focusedListIndex,
      focusedItemIndex,
      selectedItem,
      items1,
      items2,
      setItems1,
      setItems2,
      announce,
    ]
  );

  return (
    // Using a standard div wrapper instead of DemoContainer
    <div className="container p-4 border-4 border-blue-300">
      <h1 className="text-xl font-bold mb-4">React Accessibility Demo</h1>
      <div className="accessibility-demo">
        <div ref={liveRegionRef} aria-live="polite" className="sr-only">
          {liveMessage}
        </div>

        <div className="lists-container">
          {/* List 1 */}
          <div className="list-wrapper">
            <h2 id="list1-item-heading">List 1</h2>
            <ul
              ref={list1Ref} // Assign ref from hook
              className="list"
              tabIndex={0}
              role="listbox"
              aria-labelledby="list1-item-heading"
              aria-activedescendant={
                focusedListIndex === 0 ? focusedItemId : undefined
              }
              onFocus={() => handleListFocus(0)}
              onBlur={handleListBlur}
              onKeyDown={(e) => handleListKeydown(e, 0)}
            >
              {items1.length > 0 ? (
                items1.map((item, index) => {
                  const isFocused =
                    focusedListIndex === 0 && focusedItemIndex === index;
                  const isSelected =
                    selectedItem?.listIndex === 0 &&
                    selectedItem?.itemIndex === index;
                  const itemId = `list1-item-${item}`;
                  return (
                    <li
                      key={itemId}
                      id={itemId}
                      className={`item ${isFocused ? "item-focused" : ""} ${
                        isSelected ? "item-selected" : ""
                      }`}
                      role="option"
                      aria-selected={isFocused}
                      tabIndex={-1}
                    >
                      {item}
                    </li>
                  );
                })
              ) : (
                <li className="empty-list-message">Empty</li>
              )}
            </ul>
          </div>

          {/* List 2 */}
          <div className="list-wrapper">
            <h2 id="list2-item-heading">List 2</h2>
            <ul
              ref={list2Ref} // Assign ref from hook
              className="list"
              tabIndex={0}
              role="listbox"
              aria-labelledby="list2-item-heading"
              aria-activedescendant={
                focusedListIndex === 1 ? focusedItemId : undefined
              }
              onFocus={() => handleListFocus(1)}
              onBlur={handleListBlur}
              onKeyDown={(e) => handleListKeydown(e, 1)}
            >
              {items2.length > 0 ? (
                items2.map((item, index) => {
                  const isFocused =
                    focusedListIndex === 1 && focusedItemIndex === index;
                  const isSelected =
                    selectedItem?.listIndex === 1 &&
                    selectedItem?.itemIndex === index;
                  const itemId = `list2-item-${item}`;
                  return (
                    <li
                      key={itemId}
                      id={itemId}
                      className={`item ${isFocused ? "item-focused" : ""} ${
                        isSelected ? "item-selected" : ""
                      }`}
                      role="option"
                      aria-selected={isFocused}
                      tabIndex={-1}
                    >
                      {item}
                    </li>
                  );
                })
              ) : (
                <li className="empty-list-message">Empty</li>
              )}
            </ul>
          </div>
        </div>

        <div className="instructions">
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
      {/* Styles assumed to be global or handled via CSS Modules/Tailwind etc. */}
    </div>
  );
}
