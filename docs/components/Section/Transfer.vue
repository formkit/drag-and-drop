<script setup lang="ts"></script>

<template>
  <SectionWrapper>
    <h2>Transfer</h2>
    <p>
      Drag and Drop can be used to transfer items between lists. This is useful
      for creating a list of items that can be added to or removed from a
      collection.
    </p>
    <ToDos :drag-handles="false" />
  </SectionWrapper>
</template>
