import { dragAndDrop } from "@formkit/drag-and-drop";
import type {
  DragstartEventData,
  SortEventData,
  TransferEventData,
  DragendEventData,
} from "@formkit/drag-and-drop";

// --- State Management ---
let items1 = ["Apples", "Bananas", "Oranges", "Grapes"];
let items2 = ["Milk", "Cheese", "Yogurt"];

let focusedListIndex: 0 | 1 | null = null;
let focusedItemIndex: number | null = null;
let selectedItem: {
  listIndex: 0 | 1;
  itemIndex: number;
  value: string;
} | null = null;
let liveMessage = "";

// --- DOM References (Assume these elements exist in the HTML) ---
const list1Element = document.getElementById("list1") as HTMLUListElement;
const list2Element = document.getElementById("list2") as HTMLUListElement;
const liveRegionElement = document.getElementById(
  "live-region"
) as HTMLDivElement;

if (!list1Element || !list2Element || !liveRegionElement) {
  console.error("Required DOM elements not found for accessibility demo.");
  // Handle the error appropriately, maybe return or throw
}

const lists = [
  {
    el: list1Element,
    items: () => items1,
    setItems: (newItems: string[]) => {
      items1 = newItems;
    },
    idPrefix: "list1-item",
    name: "List 1",
  },
  {
    el: list2Element,
    items: () => items2,
    setItems: (newItems: string[]) => {
      items2 = newItems;
    },
    idPrefix: "list2-item",
    name: "List 2",
  },
];

// --- ARIA Live Region ---
function announce(message: string) {
  liveMessage = message;
  if (liveRegionElement) {
    liveRegionElement.textContent = liveMessage;
  }
  // Optional: Clear message after delay
  // setTimeout(() => { if (liveRegionElement) liveRegionElement.textContent = ''; }, 5000);
}

// --- Rendering ---
function renderList(listIndex: 0 | 1) {
  const listData = lists[listIndex];
  if (!listData || !listData.el) return;

  const currentItems = listData.items();
  listData.el.innerHTML = ""; // Clear existing items

  if (currentItems.length === 0) {
    const li = document.createElement("li");
    li.className = "empty-list-message";
    li.textContent = "Empty";
    listData.el.appendChild(li);
    // Clear active descendant when list is empty
    listData.el.removeAttribute("aria-activedescendant");
    return;
  }

  currentItems.forEach((item, index) => {
    const li = document.createElement("li");
    const itemId = `${listData.idPrefix}-${item}`; // Consider making IDs more robust if items can have same name
    li.id = itemId;
    li.className = "item";
    li.setAttribute("role", "option");
    li.setAttribute("tabindex", "-1"); // Items are not directly tabbable
    li.textContent = item;

    const isFocused =
      focusedListIndex === listIndex && focusedItemIndex === index;
    const isSelected =
      selectedItem?.listIndex === listIndex &&
      selectedItem?.itemIndex === index;

    li.setAttribute("aria-selected", String(isFocused)); // Reflect focus state

    if (isFocused) {
      li.classList.add("item-focused");
    } else {
      li.classList.remove("item-focused");
    }

    if (isSelected) {
      li.classList.add("item-selected");
    } else {
      li.classList.remove("item-selected");
    }

    listData.el.appendChild(li);
  });

  // Update aria-activedescendant on the list itself
  if (
    focusedListIndex === listIndex &&
    focusedItemIndex !== null &&
    focusedItemIndex < currentItems.length
  ) {
    const activeDescendantId = `${listData.idPrefix}-${currentItems[focusedItemIndex]}`;
    listData.el.setAttribute("aria-activedescendant", activeDescendantId);
  } else {
    listData.el.removeAttribute("aria-activedescendant");
  }
}

// --- Drag and Drop Initialization ---
dragAndDrop<string>({
  // List 1
  parent: list1Element,
  getValues: () => items1,
  setValues: (newValues) => {
    items1 = newValues;
    renderList(0);
    // If items were potentially transferred from list 2, ensure it's re-rendered
    // Note: The library should ideally handle calling setValues on the source list too.
    // If it doesn't reliably, we might need a flag or check here.
    // For simplicity, we assume the library calls setValues on both lists involved in a transfer.
  },
  config: {
    group: "accessibleList",
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
          event.sourceParent.el === list1Element ? 1 : 2
        } to List 1 at position ${event.targetIndex + 1}.`
      );
      // Since setValues in the target (list 1) already re-renders list 1,
      // and we assume the lib calls setValues on source (list 2), list 2 should also re-render.
    },
    onDragend: (state) =>
      announce(`Drag ended for ${state.draggedNode.data.value}.`),
  },
});

dragAndDrop<string>({
  // List 2
  parent: list2Element,
  getValues: () => items2,
  setValues: (newValues) => {
    items2 = newValues;
    renderList(1);
  },
  config: {
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
      announce(
        `Transferred ${event.draggedNodes[0].data.value} from List ${
          event.sourceParent.el === list1Element ? 1 : 2
        } to List 2 at position ${event.targetIndex + 1}.`
      );
      // Assume setValues on source (list 1) handles its re-render.
    },
    onDragend: (state) =>
      announce(`Drag ended for ${state.draggedNode.data.value}.`),
  },
});

// --- Event Handlers ---
function handleFocus(listIndex: 0 | 1) {
  focusedListIndex = listIndex;
  const currentItems = lists[listIndex].items();
  if (focusedItemIndex === null && currentItems.length > 0) {
    focusedItemIndex = 0; // Default to first item on focus
  }
  announce(
    `List ${listIndex + 1} focused. Use up and down arrows to navigate items.`
  );
  renderList(listIndex); // Update focused list visuals
  // Render the other list to remove potential old focus styles
  renderList(listIndex === 0 ? 1 : 0);
}

function handleBlur(event: FocusEvent, listIndex: 0 | 1) {
  // Simple blur handling: Reset focus only if focus moves outside the component entirely.
  // A more robust solution might involve checking relatedTarget against a container element.
  // For this example, we'll reset if focus leaves the list element itself.
  const listElement = lists[listIndex].el;
  // Check if relatedTarget is null or outside the current list element
  if (
    !event.relatedTarget ||
    (event.relatedTarget instanceof Node &&
      !listElement.contains(event.relatedTarget))
  ) {
    // Check if focus moved to the *other* list, if so, handleFocus will manage it.
    const otherListIndex = listIndex === 0 ? 1 : 0;
    const otherListElement = lists[otherListIndex].el;
    if (event.relatedTarget !== otherListElement) {
      focusedListIndex = null;
      focusedItemIndex = null;
      // Don't announce blur unless necessary, can be noisy
      // announce("List blurred.");
      renderList(listIndex); // Re-render to remove focus styles
    }
  }
}

function handleKeydown(event: KeyboardEvent, listIndex: 0 | 1) {
  if (focusedListIndex !== listIndex) return;

  const currentItems = lists[listIndex].items();
  let currentItemIndex = focusedItemIndex; // Use local var for modifications

  switch (event.key) {
    case "ArrowDown":
    case "ArrowUp":
      event.preventDefault();
      if (currentItems.length > 0) {
        let nextIndex;
        if (event.key === "ArrowDown") {
          nextIndex =
            currentItemIndex === null
              ? 0
              : (currentItemIndex + 1) % currentItems.length;
        } else {
          // ArrowUp
          nextIndex =
            currentItemIndex === null
              ? currentItems.length - 1
              : (currentItemIndex - 1 + currentItems.length) %
                currentItems.length;
        }
        focusedItemIndex = nextIndex; // Update state
        announce(currentItems[nextIndex]);
        renderList(listIndex); // Re-render to update focus style and aria-activedescendant
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
          selectedItem = null; // Deselect
          announce(`${currentItemValue} deselected.`);
        } else {
          selectedItem = {
            listIndex,
            itemIndex: currentItemIndex,
            value: currentItemValue,
          }; // Select
          announce(
            `${currentItemValue} selected. Use arrow keys to choose drop position, then press Enter.`
          );
        }
        renderList(listIndex); // Re-render to update selection style
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
          selectedItem = null;
          renderList(listIndex); // Update style
          break;
        }

        // Perform move in data arrays
        const sourceItemsArray = lists[sourceListIndex].items();
        const targetItemsArray = lists[targetListIndex].items();

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

        // Update state arrays *before* calling render
        lists[sourceListIndex].setItems(newSourceItems);
        if (sourceListIndex !== targetListIndex) {
          lists[targetListIndex].setItems(newTargetItems);
        }
        // If same list, the source setter already updated the correct underlying array

        announce(
          `Keyboard: Moved ${itemValue} to position ${
            effectiveTargetIndex + 1
          } in List ${targetListIndex + 1}.`
        );

        // Reset selection and update focus state
        selectedItem = null;
        focusedItemIndex = effectiveTargetIndex;
        focusedListIndex = targetListIndex; // Focus stays on the target list

        // Re-render both lists with updated data and focus
        renderList(0);
        renderList(1);
      }
      break;

    case "Escape":
      event.preventDefault();
      if (selectedItem) {
        announce(`Selection cancelled for ${selectedItem.value}.`);
        selectedItem = null;
        renderList(listIndex); // Update style
      } else {
        announce("Escape pressed. No item selected.");
        (event.target as HTMLElement).blur(); // Blur the list
        // Blur handler should take care of resetting state and rendering
      }
      break;

    default:
      return; // Allow other keys
  }
}

// --- Initial Setup ---
if (list1Element && list2Element) {
  // Make lists tabbable
  list1Element.setAttribute("tabindex", "0");
  list2Element.setAttribute("tabindex", "0");

  // Add ARIA roles
  list1Element.setAttribute("role", "listbox");
  list1Element.setAttribute("aria-labelledby", "list1-heading"); // Assume h2 has id='list1-heading'
  list2Element.setAttribute("role", "listbox");
  list2Element.setAttribute("aria-labelledby", "list2-heading"); // Assume h2 has id='list2-heading'

  list1Element.addEventListener("focus", () => handleFocus(0));
  list1Element.addEventListener("blur", (e) => handleBlur(e, 0));
  list1Element.addEventListener("keydown", (e) => handleKeydown(e, 0));

  list2Element.addEventListener("focus", () => handleFocus(1));
  list2Element.addEventListener("blur", (e) => handleBlur(e, 1));
  list2Element.addEventListener("keydown", (e) => handleKeydown(e, 1));

  // Initial render
  renderList(0);
  renderList(1);
}
