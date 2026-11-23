<script lang="ts" setup></script>

<template>
  <SectionWrapper>
    <h2 id="features">Core Features</h2>

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
    <h3 id="nested-lists">Nested lists (trees)</h3>
    <p>
      Render a list for each node, including leaves, and bind each list to that
      node’s children. Give all lists the same <code>group</code> and use stable,
      unique keys. Moving a node moves its children with it. Give empty lists a
      visible minimum size so they can receive drops.
    </p>
    <p>
      Transfers into a dragged node’s own descendants are rejected by core,
      including for multi-drag and synthetic drag, when child lists are nested
      in their owning item’s DOM. Portaled or virtualized lists need their own
      data-based <code>accepts</code> check. Each list must have only its
      values as immediate draggable children; keep labels inside their list items.
      Transfers happen while hovering. If a list moves when the source is
      removed, a stationary pointer can land on a different target; reserve
      space or otherwise keep drop targets stable while dragging.
    </p>
    <CodeExample example="nested" />
    <h3 id="cloning">Cloning</h3>
    <p>
      Set <code>clone: true</code> on a source list to copy values when they
      are dragged to another list. The source retains its values; the copy moves
      between targets as you drag and is removed if the drag is cancelled or
      dropped outside a list. Use <code>sortable: false</code> for a palette.
      Multi-drag copies each selected value in order.
    </p>
    <p>
      By default, each value is deep-copied (<code>structuredClone</code>,
      falling back to a property-by-property copy for framework proxies such
      as Vue reactive objects; functions and class instances are kept by
      reference). Pass a function as <code>clone</code> to
      create custom copies, such as assigning a fresh unique key for each item.
      Transfers fire <code>onTransfer</code> for both lists with the nodes
      leaving the current list; after rendering, drag state tracks the copied
      nodes. <code>onDragend</code> receives the final parent and dragged nodes,
      or the original source and nodes when a clone is cancelled.
    </p>
    <CodeExample example="clone" />
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
    <h3 id="drag-ignore">Drag Ignore</h3>
    <p>
      Sometimes a draggable item contains things users need to interact with
      &mdash; inputs, buttons, selectable text. Set the
      <code>dragIgnore</code> property to a selector, and pointer or drag
      events that start on matching elements (or their descendants) won't
      begin a drag.
    </p>
    <CodeExample example="drag-ignore" />
    <h3 id="update-config">Updating Config</h3>
    <p>
      The parent's configuration can be updated idempotently during runtime by
      using the
      <code>updateConfig</code> method. In the example below, clicking the
      button will toggle whether drag and drop is enabled for the parent.
    </p>
    <CodeExample example="update-config" />
    <h3 id="multi-drag">Multi Drag</h3>
    <p>
      Multi drag allows users to select multiple items and drag them all at
      once. To enable multi drag, set the <code>multiDrag</code> property to
      <code>true</code> in the configuration.
    </p>
    <CodeExample example="multi-drag" />
    <h4 id="selection-api">Controlling the selection</h4>
    <p>
      Read and change the selection from code with
      <code>selectedValues(parent)</code>,
      <code>setSelectedValues(parent, values)</code> (values are matched with
      <code>===</code>; only the first match is selected without
      <code>multiDrag</code>) and <code>clearSelection()</code>. Programmatic
      selections behave exactly like pointer ones: they get the
      <code>selectedClass</code> and <code>aria-selected</code>, drag together,
      and clear when the user clicks outside the list.
    </p>
    <CodeExample example="selection-api" />
  </SectionWrapper>
</template>
