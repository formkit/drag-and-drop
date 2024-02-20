<script setup lang="ts"></script>

<template>
  <h2 class="text-xl">Transfer</h2>
  <p class="text-lg">
    Drag and Drop can be used to transfer items between lists. This is useful
    for creating a list of items that can be added to or removed from a
    collection.
  </p>
  <ToDos :drag-handles="false" />
</template>
