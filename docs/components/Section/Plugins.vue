<script lang="ts" setup></script>

<template>
  <SectionWrapper>
    <h2 id="plugins">Plugins</h2>
    <p>
      Plugins are a powerful way to extend the functionality of the library.
      They can be used to add new features, modify existing ones, or even create
      entirely new experiences.
    </p>
    <h3 id="multi-drag">Multi Drag</h3>
    <p>
      The multi-drag plugin allows you to select multiple items and drag them
      together. Try selecting files like you would on your machine.
    </p>
    <CodeExample example="multi-drag" />
    <p>
      Notice in the last example we are passing a separate plugin to the
      multi-drag plugin. This is the selections plugin, which sets things like
      click handlers. If you would like to write your own logic (or have already
      written logic for selecting items), you can pass your own selected values
      to the <code>selections</code> property.
    </p>
  </SectionWrapper>
</template>
