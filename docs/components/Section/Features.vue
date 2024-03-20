<script lang="ts" setup></script>

<template>
  <SectionWrapper>
    <h2 id="features">Features</h2>
    <p>
      Drag and drop ships out of the box with the ability to sort and transfer
      individual items between lists. Further customization is also available
      via <a href="#plugins">first-party plugins</a>, and of course you can
      always <a href="#custom-plugins">write your own</a>.
    </p>
    <h3 id="sortability">Sortability</h3>
    <p>
      Using <code>useDragAndDrop</code> or
      <code>dragAndDrop</code> automatically makes a lists sortable. Dragging
      items within your list will automatically change your list’s state to
      reflect the new order (which in turn allows the framework to re-render to
      the correct order).
    </p>
    <CalloutTip>
      It’s important to use a unique key on each item of your list.
    </CalloutTip>
    <CodeExample example="sorting" />
    <p>
      If there is a direct descendant of the parent that should not become
      draggable, set the <code>draggable</code> property of the parent config.
      <code>draggable</code> is a callback function that lets you determine
      whether or not a given element should be draggable.
    </p>
    <h3 id="draggable">Draggable</h3>
    <CodeExample example="draggable" />
    <h3>Transferability</h3>
    <p>
      If the intention is to transfer values between lists, simply set the
      <code>group</code> property in the configuration to the same value for
      each list.
    </p>
    <CodeExample example="transfer" />
    <h3 id="disable-sort">Disable sort</h3>
    <p>
      If you would like to prevent sorting within a given list, but still allow
      transfer, set the <code>sortable</code> property to <code>false</code> in
      the configuration.
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
    <h3 id="update-config">Updating config</h3>
    <p>
      The parent config can be updated at any time by using the
      <code>updateConfig</code> method returned from
      <code>useDragAndDrop</code>. Alternatively, the parent config can be
      updated by importing <code>updateConfig</code> from
      <code>@formkit/drag-and-drop</code>.
    </p>
    <CodeExample example="update-config" />
  </SectionWrapper>
</template>

<style></style>
