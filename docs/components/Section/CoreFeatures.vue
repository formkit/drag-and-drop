<script lang="ts" setup></script>

<template>
  <SectionWrapper>
    <!-- <h2 id="features">Core Features</h2>

    <h3 id="sortability">Sortability</h3>
    <p>
      Using <code>useDragAndDrop</code> or
      <code>dragAndDrop</code> automatically makes a lists sortable. Dragging
      items within your list will automatically change your list’s state to
      reflect the new order (which in turn allows the framework to re-render to
      the correct order):
    </p>
    <CalloutTip>
      It’s important to use a unique key on each item of your list.
    </CalloutTip>
    <CodeExample example="sorting" />
    <h3 id="draggable">Draggable</h3>
    <p>
      For drag-and-drop to function correctly, the length of array of values
      provided must be equivalent to the number of immediate children to the
      parent element. If they are not, a console warning will appear:
      <code
        >The number of draggable items in the parent does not match the number
        of values, which may lead to unexpected behavior."</code
      >
      The most common cause of this is when the parent element has an immediate
      child that is not meant to be draggable. In this case, the configuration
      property <code>draggable</code> can be set to a callback function that
      lets you determine whether or not a given element should be draggable:
    </p>
    <CodeExample example="draggable" />
    <h3>Transferability</h3>
    <p>
      In addition to sorting, drag-and-drop allows transferring values between
      parents (lists). To enable this, set the configuration property
      <code>group</code> to the same value for each list that should allow value
      transfers. Notice in the example below that items can be appended to the
      end of the list by hovering over the list itself, or inserted into the
      list by hovering over the target parent's draggable items.
    </p>
    <CodeExample example="transfer" />
    <h3 id="disable-sort">Disable sort</h3>
    <p>
      Sortability within a given parent can be toggled on and off by setting the
      <code>sortable</code> property to in the configuration.
    </p>
    <CodeExample example="sortable" />
    <h3 id="accepts">Accepts</h3>
    <p>
      For a more nuanced transfer experience, define the
      <code>accepts</code> property in the configuration. This property is a
      callback function that lets you determine whether or not a given element
      can be transferred into the given list.
    </p>
    <CodeExample example="accepts" />
    <h3 id="drag-handles">Drag Handles</h3>
    <p>
      Drag handles are a common way to allow users to drag items without
      accidentally dragging them when they don't intend to. To implement drag
      handles, set the <code>dragHandle</code> property to a selector that will
      be used to find the handle.
    </p>
    <CodeExample example="drag-handles" />
    <h3 id="update-config">Updating Config</h3>
    <p>
      The parent's configuration can be updated idempotently during runtime by
      using the
      <code>updateConfig</code> method. In the example below, clicking the
      button will toggle whether drag and drop is enabled for the parent.
    </p>
    <CodeExample example="update-config" /> -->
    <h3 id="multi-drag">Multi Drag</h3>
    <p>
      Multi drag allows users to select multiple items and drag them all at
      once. To enable multi drag, set the <code>multiDrag</code> property to
      <code>true</code> in the configuration.
    </p>
    <CodeExample example="multi-drag" />
  </SectionWrapper>
</template>
