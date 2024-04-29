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
      <code>@formkit/drag-and-drop/react</code>. A native JavaScript version of
      the <code>dragAndDrop</code> function is also available at
      <code>@formkit/drag-and-drop</code>.
    </p>
    <h3>useDragAndDrop</h3>
    <p>
      The <code>useDragAndDrop</code> hook is the most convenient way to add
      Drag and Drop to your app. Call this function with an initial array of
      values. It returns a tuple containing a template ref and a reactive
      array of values. The template ref should be assigned to the parent DOM
      element of the items you wish to make draggable. The reactive array of
      values should be used in your template to render the draggable elements.
    </p>
    <code class="block"
      ><div class="comment">// React:</div>
      <span class="def">const</span
      ><span class="fn">
        [<span class="var">parentRef</span>, <span class="var">values</span>,
        <span class="var">setValues</span>] = useDragAndDrop</span
      >(<br />
      <span class="indent">['Item 1', 'Item2', 'Item3']</span><br />)
      <div class="comment"><br />// Vue:</div>
      <span class="def">const</span
      ><span class="fn">
        [<span class="var">parentRef</span>, <span class="var">values</span>] =
        useDragAndDrop</span
      >(<br />
      <span class="indent">['Item 1', 'Item2', 'Item3']</span><br />)
    </code>
    <h3>dragAndDrop</h3>
    <p>
      The <code>dragAndDrop</code> hook allows you to define your own ref and
      list state. This is useful if you need to integrate with a pre-existing
      app without changing your component structure.
    </p>
    <code class="block"
      ><div class="comment">// React:</div>
      <span class="fn">dragAndDrop</span>({<br />
      <span class="indent">parent: <span class="var">parentRef</span></span
      >,<br />
      <span class="indent"
        >state: [<span class="var">values</span>,
        <span class="var">setValues</span>]</span
      ><br />})
      <div class="comment"><br />// Vue:</div>
      <span class="fn">dragAndDrop</span>({<br />
      <span class="indent">parent: <span class="var">parentRef</span></span
      >,<br />
      <span class="indent">value: <span class="var">valueRef</span></span
      ><br />})
    </code>
  </SectionWrapper>
</template>
