<script lang="ts" setup></script>

<template>
  <SectionWrapper>
    <h2 id="plugins">Plugins</h2>
    <p>
      Plugins are a powerful way to extend the functionality of the library.
      They can be used to add new features, modify existing ones, or even create
      entirely new experiences.
    </p>
    <h3 id="drop-or-swap">Drop or Swap</h3>
    <p>
      The examples seen so far have shown the values of a given list being
      updated as the end-user drags over the list and its children. To enable
      behavior where the values of the list are only updated when the user drops
      the item, use the <code>dropOrSwap</code> plugin.
    </p>
    <CodeExample example="drop-or-swap" />
    <h3 id="insert">Insert (Experimental)</h3>
    <p>
      Similar to the <code>dropOrSwap</code> plugin, the
      <code>insert</code> plugin does not update values until the user drops the
      item. In addition, the <code>insert</code> plugin will render an insert
      point between the items to indicate where the item will be placed.
    </p>
    <!-- <CodeExample example="insert" /> -->
    <h3 id="animations">Animations (Experimenal)</h3>
    <p>
      To add animations to your drag and drop experience, you can use the
      <code>animations</code> plugin.
    </p>
    <CodeExample example="animations" />
  </SectionWrapper>
</template>
