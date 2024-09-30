<script lang="ts" setup></script>

<template>
  <SectionWrapper>
    <h2 id="plugins">Plugins</h2>
    <p>
      Plugins are a powerful way to extend the functionality of the library.
      They can be used to add new features, modify existing ones, or even create
      entirely new experiences.
    </p>
    <h3 id="animations">Animations</h3>
    <p>
      To add animations to your drag and drop experience, you can use the
      first-party <code>animations</code> plugin.
    </p>
    <CodeExample example="animations" />
    <h3 id="swap">Swap</h3>
    <p>
      If you would prefer to only update values (sort) when the drag is
      released, you can use the <code>swap</code> plugin.
    </p>
    <CodeExample example="swap" />
    <h3 id="multi-drag">Multi Drag</h3>
    <p>
      The multi-drag plugin allows you to select multiple items and drag them
      together.
    </p>
    <CodeExample example="multi-drag" />
  </SectionWrapper>
</template>
