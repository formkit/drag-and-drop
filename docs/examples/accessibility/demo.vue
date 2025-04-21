<script setup lang="ts">
import { ref, computed, nextTick } from "vue";
import { useDragAndDrop } from "@formkit/drag-and-drop/vue";

// Refs for ARIA Live region
const liveMessage = ref("");
const liveRegion = ref<HTMLDivElement | null>(null);

// Function to update the live region
function announce(message: string) {
  liveMessage.value = message;
  // Optional: Clear the message after a delay if needed
  // setTimeout(() => { liveMessage.value = ''; }, 5000);
}

// Initial data for the lists
const initialItems1 = ["Apples", "Bananas", "Oranges", "Grapes"];
const initialItems2 = ["Milk", "Cheese", "Yogurt"];

// Setup drag and drop for List 1
const [list1Node, items1] = useDragAndDrop(initialItems1, {
  group: "accessibleList",
  onDragstart: (state) => {
    announce(`Drag started for ${state.draggedNode.data.value}.`);
  },
  onSort: (event) => {
    announce(
      `Sorted ${event.draggedNodes[0].data.value} in List 1 to position ${
        event.position + 1
      }.`
    );
  },
  onTransfer: (event) => {
    announce(
      `Transferred ${event.draggedNodes[0].data.value} from List ${
        event.sourceParent.el === list1Node.value ? 1 : 2
      } to List 1 at position ${event.targetIndex + 1}.`
    );
  },
  onDragend: (state) => {
    announce(`Drag ended for ${state.draggedNode.data.value}.`);
  },
});

// Setup drag and drop for List 2
const [list2Node, items2] = useDragAndDrop(initialItems2, {
  group: "accessibleList",
  onDragstart: (state) => {
    announce(`Drag started for ${state.draggedNode.data.value}.`);
  },
  onSort: (event) => {
    announce(
      `Sorted ${event.draggedNodes[0].data.value} in List 2 to position ${
        event.position + 1
      }.`
    );
  },
  onTransfer: (event) => {
    announce(
      `Transferred ${event.draggedNodes[0].data.value} from List ${
        event.sourceParent.el === list1Node.value ? 1 : 2
      } to List 2 at position ${event.targetIndex + 1}.`
    );
  },
  onDragend: (state) => {
    announce(`Drag ended for ${state.draggedNode.data.value}.`);
  },
});

// State for keyboard navigation
const focusedListIndex = ref<0 | 1 | null>(null);
const focusedItemIndex = ref<number | null>(null); // Index within the focused list
const selectedItem = ref<{
  listIndex: 0 | 1;
  itemIndex: number;
  value: string;
} | null>(null);

const lists = computed(() => [
  { node: list1Node, items: items1, idPrefix: "list1-item" },
  { node: list2Node, items: items2, idPrefix: "list2-item" },
]);

const focusedItemId = computed(() => {
  if (focusedListIndex.value !== null && focusedItemIndex.value !== null) {
    const list = lists.value[focusedListIndex.value];
    if (list && focusedItemIndex.value < list.items.value.length) {
      return `${list.idPrefix}-${list.items.value[focusedItemIndex.value]}`;
    }
  }
  return undefined;
});

// Function to handle focus moving to a list
function handleListFocus(listIndex: 0 | 1) {
  focusedListIndex.value = listIndex;
  // Optionally focus the first item if none is focused
  if (
    focusedItemIndex.value === null &&
    lists.value[listIndex].items.value.length > 0
  ) {
    focusedItemIndex.value = 0;
  }
  announce(
    `List ${listIndex + 1} focused. Use up and down arrows to navigate items.`
  );
}

// Function to handle blur from a list
function handleListBlur() {
  // Keep focus state if moving between related elements or temporarily losing focus
  // For simplicity now, we clear it. More robust logic might be needed.
  // focusedListIndex.value = null;
  // focusedItemIndex.value = null;
}

// Function to handle keydown events on lists
async function handleListKeydown(event: KeyboardEvent, listIndex: 0 | 1) {
  if (focusedListIndex.value !== listIndex) return; // Ignore if not the focused list

  const list = lists.value[listIndex];
  const items = list.items.value;
  const currentItemIndex = focusedItemIndex.value;

  switch (event.key) {
    case "ArrowDown":
      event.preventDefault();
      if (items.length > 0) {
        const nextIndex =
          currentItemIndex === null ? 0 : (currentItemIndex + 1) % items.length;
        focusedItemIndex.value = nextIndex;
        announce(items[nextIndex]);
        await nextTick(); // Ensure DOM updates before focusing
        // Optionally focus the element itself if not purely virtual
        // const el = document.getElementById(focusedItemId.value!);
        // el?.focus();
      }
      break;

    case "ArrowUp":
      event.preventDefault();
      if (items.length > 0) {
        const prevIndex =
          currentItemIndex === null
            ? items.length - 1
            : (currentItemIndex - 1 + items.length) % items.length;
        focusedItemIndex.value = prevIndex;
        announce(items[prevIndex]);
        await nextTick();
        // const el = document.getElementById(focusedItemId.value!);
        // el?.focus();
      }
      break;

    case " ": // Spacebar
      event.preventDefault();
      if (currentItemIndex !== null) {
        if (
          selectedItem.value?.listIndex === listIndex &&
          selectedItem.value?.itemIndex === currentItemIndex
        ) {
          // Deselect if selecting the same item again
          selectedItem.value = null;
          announce(`${items[currentItemIndex]} deselected.`);
        } else {
          // Select the currently focused item
          selectedItem.value = {
            listIndex,
            itemIndex: currentItemIndex,
            value: items[currentItemIndex],
          };
          announce(
            `${items[currentItemIndex]} selected. Use arrow keys to choose drop position, then press Enter.`
          );
        }
      }
      break;

    case "Enter":
      event.preventDefault();
      if (selectedItem.value && currentItemIndex !== null) {
        const sourceListIndex = selectedItem.value.listIndex;
        const sourceItemIndex = selectedItem.value.itemIndex;
        const targetListIndex = listIndex;
        const targetItemIndex = currentItemIndex;
        const itemValue = selectedItem.value.value;

        // Prevent dropping onto itself without moving
        if (
          sourceListIndex === targetListIndex &&
          sourceItemIndex === targetItemIndex
        ) {
          // Announce slightly different message for keyboard attempt
          announce(`Keyboard: Cannot drop ${itemValue} onto itself.`);
          selectedItem.value = null; // Clear selection
          break;
        }

        // Perform the move by directly modifying the reactive refs
        const sourceItems = lists.value[sourceListIndex].items;
        const targetItems = lists.value[targetListIndex].items;

        // 1. Remove from source
        sourceItems.value.splice(sourceItemIndex, 1);

        // 2. Insert into target
        // Adjust target index if moving within the same list downwards
        let effectiveTargetIndex = targetItemIndex;
        // If dropping onto the same list
        if (sourceListIndex === targetListIndex) {
          // If dropping after the original position
          if (sourceItemIndex < targetItemIndex) {
            // No adjustment needed because the targetItemIndex already accounts
            // for the removal of the item before it.
            // However, if the target *was* the placeholder *after* the last item,
            // we might need to adjust. Let's refine this slightly.
            // The targetItemIndex is the index *before* insertion.
            effectiveTargetIndex = targetItemIndex; // This seems correct for splice insertion point
          } else {
            // If dropping before the original position, the targetItemIndex is correct.
            effectiveTargetIndex = targetItemIndex;
          }
        } else {
          // If dropping onto a different list, the targetItemIndex is correct.
          effectiveTargetIndex = targetItemIndex;
        }

        // Ensure the index is valid for splice (handles dropping at the end)
        effectiveTargetIndex = Math.max(
          0,
          Math.min(effectiveTargetIndex, targetItems.value.length)
        );

        targetItems.value.splice(effectiveTargetIndex, 0, itemValue);

        // Announce the keyboard-driven move
        announce(
          `Keyboard: Moved ${itemValue} to position ${
            effectiveTargetIndex + 1
          } in List ${targetListIndex + 1}.`
        );

        // Reset state
        selectedItem.value = null;
        // Keep focus on the item in its new position if possible
        focusedItemIndex.value = effectiveTargetIndex;
        focusedListIndex.value = targetListIndex; // Ensure focus stays on target list
      }
      break;

    case "Escape":
      event.preventDefault();
      if (selectedItem.value) {
        announce(`Selection cancelled for ${selectedItem.value.value}.`);
        selectedItem.value = null;
      } else {
        // Optionally blur the list or reset focus
        announce("Escape pressed. No item selected.");
        (event.target as HTMLElement).blur(); // Example: blur the list
        focusedListIndex.value = null;
        focusedItemIndex.value = null;
      }
      break;

    // Add Home/End key support if desired
    // case "Home": ...
    // case "End": ...

    default:
      // Allow other keys like Tab to function normally
      return;
  }
}
</script>

<template>
  <DemoContainer name="accessibility">
    <div class="accessibility-demo">
      <div ref="liveRegion" aria-live="polite" class="sr-only">
        {{ liveMessage }}
      </div>

      <div class="lists-container">
        <div class="list-wrapper">
          <h2 id="list1-heading">List 1</h2>
          <ul
            ref="list1Node"
            class="list"
            tabindex="0"
            role="listbox"
            aria-labelledby="list1-heading"
            :aria-activedescendant="
              focusedListIndex === 0 ? focusedItemId : undefined
            "
            @focus="handleListFocus(0)"
            @blur="handleListBlur"
            @keydown="handleListKeydown($event, 0)"
          >
            <li
              v-for="(item, index) in items1"
              :key="item"
              :id="`list1-item-${item}`"
              class="item"
              role="option"
              :aria-selected="
                focusedListIndex === 0 && focusedItemIndex === index
              "
              :class="{
                'item-focused':
                  focusedListIndex === 0 && focusedItemIndex === index,
                'item-selected':
                  selectedItem?.listIndex === 0 &&
                  selectedItem?.itemIndex === index,
              }"
              tabindex="-1"
            >
              {{ item }}
            </li>
            <li v-if="items1.length === 0" class="empty-list-message">Empty</li>
          </ul>
        </div>

        <div class="list-wrapper">
          <h2 id="list2-heading">List 2</h2>
          <ul
            ref="list2Node"
            class="list"
            tabindex="0"
            role="listbox"
            aria-labelledby="list2-heading"
            :aria-activedescendant="
              focusedListIndex === 1 ? focusedItemId : undefined
            "
            @focus="handleListFocus(1)"
            @blur="handleListBlur"
            @keydown="handleListKeydown($event, 1)"
          >
            <li
              v-for="(item, index) in items2"
              :key="item"
              :id="`list2-item-${item}`"
              class="item"
              role="option"
              :aria-selected="
                focusedListIndex === 1 && focusedItemIndex === index
              "
              :class="{
                'item-focused':
                  focusedListIndex === 1 && focusedItemIndex === index,
                'item-selected':
                  selectedItem?.listIndex === 1 &&
                  selectedItem?.itemIndex === index,
              }"
              tabindex="-1"
            >
              {{ item }}
            </li>
            <li v-if="items2.length === 0" class="empty-list-message">Empty</li>
          </ul>
        </div>
      </div>
      <div class="instructions">
        <h3>Keyboard Instructions</h3>
        <ul>
          <li>Use <kbd>Tab</kbd> or <kbd>Shift+Tab</kbd> to focus a list.</li>
          <li>
            Use <kbd>↑</kbd> / <kbd>↓</kbd> arrows to navigate items within the
            focused list.
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
            Press <kbd>Enter</kbd> to drop the selected item at the highlighted
            position.
          </li>
          <li>
            Press <kbd>Escape</kbd> to cancel a selection or leave the list.
          </li>
        </ul>
      </div>
    </div>
  </DemoContainer>
</template>

<style scoped>
.accessibility-demo {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.lists-container {
  display: flex;
  gap: 2rem;
  justify-content: space-around;
}

.list-wrapper {
  flex: 1;
  min-width: 150px;
}

.list {
  list-style: none;
  padding: 0.5rem;
  margin: 0;
  border: 2px solid #ccc;
  border-radius: 5px;
  min-height: 150px;
  background-color: #f9f9f9;
}

.list:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}

.item {
  padding: 0.75rem;
  margin-bottom: 0.5rem;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 3px;
  cursor: default; /* Indicate keyboard interaction */
  user-select: none; /* Prevent text selection interfering */
}

.item:last-child {
  margin-bottom: 0;
}

/* Style for the virtually focused item */
.item-focused {
  outline: 2px solid #007bff;
  outline-offset: 2px;
  background-color: #e7f3ff;
}

/* Style for the selected item */
.item-selected {
  background-color: #cce5ff;
  border-color: #b8daff;
  font-weight: bold;
}

.empty-list-message {
  text-align: center;
  color: #666;
  padding: 1rem;
  font-style: italic;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

.instructions {
  margin-top: 1rem;
  padding: 1rem;
  background-color: #f0f0f0;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
}

.instructions h3 {
  margin-top: 0;
}

.instructions kbd {
  display: inline-block;
  padding: 0.1em 0.4em;
  font-size: 0.9em;
  line-height: 1;
  color: #24292e;
  vertical-align: middle;
  background-color: #fafbfc;
  border: solid 1px #d1d5da;
  border-radius: 3px;
  box-shadow: inset 0 -1px 0 #d1d5da;
}

h2 {
  text-align: center;
  margin-bottom: 0.5rem;
}
</style>
