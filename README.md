# DragAndDrop for Vue

# 💻 Install

via npm

```sh
npm install @formkit/drag-and-drop
```

or via yarn

```sh
yarn add @formkit/drag-and-drop
```

or via pnpm

```sh
pnpm install @formkit/drag-and-drop
```

# Intro

# 🕹 Usage

## Sortability

The two required arguments for `dragAndDrop` are `parent` and `values`. Parent represents the parent element for the items that are intended to be made draggable. The parent can be passed either as a template ref or as an HTML element. Values is the array of values that will be iterated over in the template script. The values must be type of `Ref<Array<any>>`.

Important notes:

- Only the immediate children of `myList` will become draggable.
- The values you are iterating over, in `myListValues`, must be keyed with unique values in order for Vue to properly rerender when sorting occurs.
- You do not necessarily need to pass a ref to the parent key of `dragAndDrop`. You can call dragAndDrop by instead passing an HTML element.

```javascript
<script setup>
import { dragAndDrop } from '@formkit/dragAndDrop';

const myList = ref(null)
const myListValues = ref(['Apple', 'Banana', 'Orange'])

dragAndDrop({
  parent: myList,
  values: myListValues
})
</script>
```

```html
<template>
  <div ref="myList">
    <div v-for="item in myListValues" :key="item">
      <div>{{ item }}</div>
    </div>
  </div>
</template>
```

By default, all immediate children of a parent will become draggable. To filter which children become draggable, assign the draggable property of settings.

```javascript
<script setup>
import { dragAndDrop } from '@formkit/dragAndDrop';

const myList = ref(null)
const myListValues = ref(['Apple', 'Banana', 'Orange'])

dragAndDrop({
  parent: myList,
  values: myListValues,
  settings: {
    draggable: (node: HTMLElement) => {
      return child.classList.contains('item')
    }
  }
})
</script>
```

```html
<template>
  <div ref="myList">
    <h2>My List</h2>
    <div v-for="item in myListValues" :key="item" class="item">
      <div>{{ item }}</div>
    </div>
  </div>
</template>
```

## Transferability

Additionally, if we specify two separate lists, they will allow both sortability (within the list itself) as well as transferability between each other. Notice that instead of passing a single object to `dragAndDrop`, we are instead passing an array of objects.

Important notes:

- The items that are transferred from their respective parent lists will be hidden when dragging the element over a new list. The dragged element's value will not be removed from the original list until a drop occurs. Why? In the case that a user "drops" their dragged item off the browser, the `dragend` event will not fire if the dragged element is removed from its parent. Setting these transferred nodes to `display: none` circuments that issue.

```javascript
<script setup>
import { dragAndDrop } from '@formkit/dragAndDrop';

const list1 = ref(null)
const list2 = ref(null)
const list1Values = ref(['Apple', 'Banana', 'Orange'])
const list2Values = ref(['Strawberry', 'Pear'])

dragAndDrop([
  {
    parent: list1,
    values: list1Values
  },
  {
    parent: list2,
    values: list2Values
  }
])
</script>
```

```html
<template>
  <div>
    <div ref="list1">
      <div v-for="item in list1Values" :key="item">
        <div>{{ item }}</div>
      </div>
    </div>
    <div ref="list2">
      <div v-for="item in list2Values" :key="item">{{ item }}</div>
    </div>
  </div>
</template>
```
