<script lang="ts" setup></script>

<template>
  <h2>Introduction</h2>
  <!--In the spring of 2021, I was tasked with implementing sortable functionality
    for FormKitPro's taglist input. -->
  <!--<a href="https://formkit.com"></a>-->
  <a href="https://formkit.com/">FormKit's</a> Drag and Drop is a simple and
  easy to use JavaScript library for enabling end-users to sort an array of
  values or to transfer values from one array to another. Unlike most comparable
  packages, Drag and Drop does not perform any direct DOM manipulations to do
  so. Instead, it takes a declarative approach by updating state and allowing
  the reactive framework (of your choosing) to handle the rest.
  <div class="divider"></div>
  <h2>Getting started</h2>
  Installation instructions here:
  <div class="divider"></div>
  <h2>Features:</h2>
  <br />
  <h4>Sorting (Ranking something 80s related.)</h4>
  <p>
    When `dragAndDrop` is called with a given parent element, the immediate
    children of that parent element will be sortable.
  </p>
  <br />
  <h4>Transfer (kanban board example)</h4>
  <p>
    To enable transfer functionality between two parents, set the `group` in the
    config object of each to be the same.
  </p>
  <br />
  <h4>Drag handles</h4>
  <br />
  <h4>
    Accepts (Accepts a callback function that returns a boolean to determine if
    transfer operation should be allowed)
  </h4>
  <br />
  <h4>
    Disabled (show it being enabled, and then on button press, you can't drag
    any more of its items.)
  </h4>
  <br />
  <h4>Draggable</h4>
  <p>
    There are many cases where you would not want all the immediate children of
    the parent to be sortable. In these cases, you pass a `draggable` callback
    function to the config.
  </p>
  <CodeExample example="config" />

  <div class="divider"></div>
  <h2>Plugins</h2>
  <h4>Multi drag</h4>
  <h4>Animations</h4>
  <h4>Selections</h4>
  <h4>Drop Zones</h4>

  // Props table for config
  <table>
    <tr>
      <th>Property</th>
      <th>Type</th>
      <th>Description</th>
    </tr>
    <tr>
      <td>group</td>
      <td>string</td>
      <td>
        A string that is used to determine which parents can transfer with each
        other.
      </td>
    </tr>
    <tr>
      <td>draggable</td>
      <td>function</td>
      <td>
        A callback function that returns a boolean to determine if the given
        child element should be draggable.
      </td>
    </tr>
    <tr>
      <td>accepts</td>
      <td>function</td>
      <td>
        A callback function that returns a boolean to determine if the transfer
        operation should be allowed.
      </td>
    </tr>
    <tr>
      <td>disabled</td>
      <td>boolean</td>
      <td>A boolean that determines if the parent is disabled or not.</td>
    </tr>
    <tr>
      <td>dragHandle</td>
      <td>string</td>
      <td>
        A string that is used as a query selector to determine which child is
        the drag handle. Can be at any depth.
      </td>
    </tr>
    <tr>
      <td>handleDragstart</td>
      <td>function</td>
      <td>Function called before executing dragstart operation.</td>
    </tr>
    <tr>
      <td>handleTouchstart</td>
      <td>function</td>
      <td>Function called before executing touchstart operation.</td>
    </tr>
    <tr>
      <td>onDrop</td>
      <td>function</td>
      <td>A callback function that is called when the drop operation ends.</td>
    </tr>
    <tr>
      <td>onTransfer</td>
      <td>function</td>
      <td>
        A callback function that is called when the transfer operation ends.
      </td>
    </tr>
  </table>
</template>

<style scoped>
h2 {
  font-size: 1.5em;
}

h4 {
  font-size: 1.2em;
}

.divider {
  margin: 20px 0;
  border-top: 1px solid black;
}
</style>
