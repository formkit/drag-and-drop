<script lang="ts" setup></script>

<template>
  <SectionWrapper>
    <h2 id="configuration">Configuration</h2>
    <p>
      Each parent can be passed a configuration object. This object can be used
      to set options like <code>group</code>, <code>drag handles</code>, and or
      more dynamic options such as determining which direct descendants of a
      list are <code>draggable</code>. Invocation of
      <code>useDragAndDrop</code> or <code>dragAndDrop</code> can be used
      idempotently to update the configuration for a given list.
    </p>
    <CodeExampleNative :full-height="true" example="config" />
  </SectionWrapper>
</template>
