<script lang="ts" setup></script>

<template>
  <SectionWrapper>
    <h2>Getting Started</h2>
    <p></p>
    <h3>Install</h3>
    <p>
      Drag and Drop is published as <code>@formkit/drag-and-drop</code> on npm.
      Click to copy the install command for your package manager of choice:
    </p>
    <ul
      class="my-8 flex flex-col md:grid grid-cols-2 gap-4 max-w-2xl !list-none !ml-0"
    >
      <li><CopyCodeSingle command="npm install @formkit/drag-and-drop" /></li>
      <li><CopyCodeSingle command="pnpm add @formkit/drag-and-drop" /></li>
      <li><CopyCodeSingle command="yarn add @formkit/drag-and-drop" /></li>
      <li><CopyCodeSingle command="bun install @formkit/drag-and-drop" /></li>
    </ul>
    <h3>Usage</h3>
    <p>
      Drag and drop ships two main functions: <code>dragAndDrop</code> and
      <code>useDragAndDrop</code>. These can be imported for your framework of
      choice by using the subpath import
      <code>@formkit/drag-and-drop/{react/vue}</code>. A native JavaScript
      version of the <code>dragAndDrop</code> function is also available at
      <code>@formkit/drag-and-drop</code>.
    </p>
    <p>
      Whichever method you choose, the core concept remains the same: FormKit's
      Drag and Drop accepts two main arguments — the parent element containing
      the draggable items and the data that those items represent.
    </p>
    <h3>useDragAndDrop</h3>
    <p>
      The <code>useDragAndDrop</code> hook is the most convenient way to add
      Drag and Drop to your app and is available for React and Vue. Call this
      function with an initial array of values and the configuration options. It
      returns an array of values containing a a template ref, a reactive set of
      values (and a setter in the case of React), as well as a function to
      update the parent's config. The template ref should be assigned to the
      parent DOM element of the items you wish to make draggable. The reactive
      array of values should be used in your template to render the draggable
      elements.
    </p>
    <code class="block"
      ><div>
        <div class="comment">// Example parent configuration object:</div>

        <span class="def">const </span>
        <span
          >config = { <span class="">sortable</span>:
          <span class="var">false</span> }</span
        >
      </div>
      <br />
      <div class="comment">// React:</div>
      <span class="def">const</span
      ><span class="fn">
        [<span class="var">parentRef</span>, <span class="var">values</span>,
        <span class="var">setValues</span>,
        <span class="var">updateConfig</span>] = useDragAndDrop</span
      >(<br />
      <span class="indent">['Item 1', 'Item2', 'Item3']</span>,
      <br />
      <span class="indent">config</span><br />)
      <div class="comment"><br />// Vue:</div>
      <span class="def">const</span
      ><span class="fn">
        [<span class="var">parentRef</span>, <span class="var">values</span>,
        <span class="var">updateConfig</span>] = useDragAndDrop</span
      >(<br />
      <span class="indent">['Item 1', 'Item2', 'Item3']</span>,
      <br />
      <span class="indent">config</span><br />)
    </code>
    <h3>dragAndDrop</h3>
    <p>
      The <code>dragAndDrop</code> hook allows you to define your own ref and
      list state. This is useful if you need to integrate with a pre-existing
      app without changing your component structure.
    </p>
    <code class="block"
      ><div class="comment">// Example parent configuration object:</div>
      <span class="def">const</span>
      <span>
        config = { <span class="">sortable</span>:
        <span class="var">false</span> }</span
      >
      <br />
      <br />
      <div class="comment">// React:</div>
      <span class="fn">dragAndDrop</span>({<br />
      <span class="indent">parent: <span class="var">parentRef</span></span
      >,<br />
      <span class="indent"
        >state: [<span class="var">values</span>,
        <span class="var">setValues</span>]</span
      >, <br /><span class="indent">config</span><br />})
      <div class="comment"><br />// Vue:</div>
      <span class="fn">dragAndDrop</span>({<br />
      <span class="indent">parent: <span class="var">parentRef</span></span
      >,<br />
      <span class="indent">values: <span class="var">valueRef</span>,</span
      ><br /><span class="indent">config</span><br />})
      <div>
        <br /><span class="comment"
          >// Vanilla JS: (import from core, not subpath)</span
        ><br />
        <span class="fn">dragAndDrop</span>({<br />
        <span class="indent">parent: <span class="var">HTMLElement</span></span
        >,<br />
        <span class="indent"
          >getValues: <span class="var">() => {</span><br
        /></span>
        <br /><span class="indent"
          ><span class="indent"></span
          ><span class="comment">// Return array of values</span></span
        ><br /><span class="indent">}, </span><br /><span class="indent"
          >setValues:</span
        ><span class="var">
          (newValues) =>
          <br />
          <span class="indent" /> <span class="indent" /><span class="comment"
            >// Do something with updated values</span
          ></span
        >
        <br />
        <span class="indent">}, </span>
        <span class="indent"></span><br /><span class="indent">config</span
        ><br />})
      </div>
    </code>
  </SectionWrapper>
</template>
