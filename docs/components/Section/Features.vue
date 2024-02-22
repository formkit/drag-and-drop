<script lang="ts" setup></script>

<template>
  <SectionWrapper>
    <h2 id="features">Features</h2>
    <p>
      Drag and drop ships out of the box with the ability to sort and transfer
      individual items between lists. Further customization is also available
      via first-party plugins, and of course you can always write your own.
    </p>
    <h3 id="sortability">Sortability</h3>
    <p>
      When calling <code>useDragAndDrop</code> or <code>dragAndDrop</code>, the
      default behavior is to allow sorting.
    </p>
    <CodeExample example="sorting" />
    <p>
      If there is a direct descendant of the parent that should not become
      draggable, set the <code>draggable</code> property of the parent config.
      <code>draggable</code> is a callback function that lets you determine
      whether or not a given element should be draggable.
    </p>
    <h4 id="draggable">Draggable</h4>
    <CodeExample example="draggable" />
    <h3>Transferability</h3>
    <p>
      If the intention is to transfer values between lists, simply set the
      `group` property in the configuration to the same value for each list.
    </p>
    <CodeExample example="transfer" />
    <h4 id="sortable">Sortable</h4>
    <p>
      If you would like to prevent sorting within a given list, but still allow
      transfer, set the <code>sortable</code> property to `false` in the
      configuration.
    </p>
    <CodeExample example="sortable" />
    <h4 id="accepts">Accepts</h4>
    <p>
      For a more nuanced transfer experience, define the `accepts` property in
      the configuration. This property is a callback function that lets you
      determine whether or not a given element can be transferred into the given
      list.
    </p>
    <CodeExample example="accepts" />
    <h3 id="drag-handles">Drag Handles</h3>
    <p>
      Drag handles are a common way to allow users to drag items without
      accidentally dragging them when they don't intend to. To implement drag
      handles, set the `dragHandle` property to a selector that will be used to
      find the handle.
    </p>
    <CodeExample example="drag-handles" />
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
      to the `selections` property.
    </p>

    <h2 id="configuration">Configuration</h2>
    <h3 id="core-configuration">Core configuration</h3>
    <p>
      Each list can be passed a configuration object. This object can be used to
      set options like <code>group</code>, <code>drag handles</code>, and or
      more dynamic options such as determining which direct descendants of a
      list are <code>draggable</code>. Invocation of
      <code>useDragAndDrop</code> or <code>dragAndDrop</code> can be used
      idempotently to update the configuration for a given list.
    </p>
    <h3 id="plugin-configuration">Plugin configuration</h3>
    <h4 id="multi-drag">Multi-drag</h4>
    <CodeExampleNative :full-height="true" example="multi-drag-config" />

    <CodeExampleNative :full-height="true" example="config" />
  </SectionWrapper>
</template>

<style></style>
