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
    <h3 id="insertion">Insertion</h3>
    <p>
      By default, <code>@formkit/drag-and-drop</code> will immediately update
      the values of the list when the dragged element is moved over another
      element. If you would prefer to only update values when the drag is
      released, you can use the <code>insertion</code> plugin. When using the
      insertion plugin, an <code>insertion point</code> will be displayed to
      indicate where the dragged element will be placed when the drag is
      released.
    </p>
    <CodeExample example="swap" />
    <h3 id="swap">Swap</h3>
    <p>
      Similar to the insertion plugin, if you would prefer to only update values
      (sort) when the drag is released, you can use the
      <code>swap</code> plugin.
    </p>
    <CodeExample example="multi-drag" />
    <h3 id="insertion">Multi Drag</h3>
    <p>
      The multi-drag plugin allows you to select multiple items and drag them
      together.
    </p>
    <p>
      Notice in the last example we are passing a separate plugin to the
      multi-drag plugin. This is the selections plugin, which sets things like
      click handlers. If you would like to write your own logic (or have already
      written logic for selecting items), you can pass your own selected values
      to the <code>selections</code> property.
    </p>
    <h3 id="custom-plugin">Custom Plugins</h3>
    <p>
      You can create your own plugins to extend the functionality of the
      library. Here is an example of a custom plugin that adds a drag and drop
      feature to a list of flavors.
    </p>
    <p>
      Plugins accept a parent element and return an object with methods that are
      called internally at different lifecycles:
    </p>
    <ul>
      <li>
        <code>setup</code> and <code>tearDown</code> are called when
        <code>useDragAndDrop</code> or <code>dragAndDrop</code>
        is called.
      </li>
      <li>
        <code>setupNode</code> and <code>tearDownNode</code> are also called
        when parent is initialized and accept data representing a given node (or
        child).
      </li>
      <li>
        <code>setupNodeRemap</code> and <code>tearDownNodeRemap</code> are
        called when the value of the parent is changed and the nodes are
        remapped.
      </li>
    </ul>
    <CodeExample example="custom-plugin" />
  </SectionWrapper>
</template>
