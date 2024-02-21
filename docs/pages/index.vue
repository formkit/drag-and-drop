<script setup lang="ts"></script>

<template>
  <TheHero />
  <main
    class="page-container flex justify-center relative z-20 pt-20 min-h-[200vh] border-t border-t-slate-100 shadow-[0_-2em_7em_2em_rgba(0,0,0,.33),0_-0.5em_1em_0.15em_rgba(0,0,0,0.25)] dark:border-t-slate-600 dark:shadow-[0_-2em_6em_1em_rgba(0,0,0,1)]"
  >
    <TheSidebar />
    <div
      class="docs-content min-w-0 px-4 w-full max-w-[1000px] lg:pl-8 xl:pl-12"
    >
      <h2>Introduction</h2>
      <SectionIntroduction />
      <h2>Getting Started</h2>
      <p>
        Whether using a composable <code>useDragAndDrop</code> or a direct
        invocation of the core <code>dragAndDrop</code>, the API remains largely
        the same. The first parameter accepts an HTMLElement that represents the
        "parent" or the element containing the draggable elements. The second
        paramter is an array of values that are to be assigned to the draggable
        elements. The third parameter is an optional configuration object. This
        configuation object can be used to set characteristics/behaviors of the
        given parent.
      </p>
      <h2>Core Features</h2>
      <h3>Sortability</h3>
      <p>
        When calling <code>useDragAndDrop</code> or <code>dragAndDrop</code>,
        the default behavior is to allow sorting. This means that items can be
        reordered within a given list.
      </p>
      <CodeExample example="sorting" />
      <h3>Transferability</h3>
      <p>
        If the intention is to transfer values between lists, simply set the
        `group` property in the configuration to the same value for each list.
      </p>
      <CodeExample example="transfer" />
      <h3>Drag Handles</h3>
      <p>
        Drag handles are a common way to allow users to drag items without
        accidentally dragging them when they don't intend to. To implement drag
        handles, set the `dragHandle` property to a selector that will be used
        to find the handle.
      </p>
      <CodeExample example="drag-handles" />
      <h2>Configuration</h2>
      <p>
        Each list can be passed a configuration object. This object can be used
        to set options like <code>group</code>, <code>drag handles</code>, and
        or more dynamic options such as determining which direct descendants of
        a list are <code>draggable</code>. Invocation of
        <code>useDragAndDrop</code> or <code>dragAndDrop</code> can be used
        idempotently to update the configuration for a given list.
      </p>
      <CodeExampleNative :full-height="true" example="config" />

      <h2>Plugins</h2>
      <p>
        Plugins are a powerful way to extend the functionality of the library.
        They can be used to add new features, modify existing ones, or even
        create entirely new experiences.
      </p>
      <h3>Multi Drag</h3>
      <p>
        The multi-drag plugin allows you to select multiple items and drag them
        together. Try selecting files like you would on your machine.
      </p>
      <CodeExample example="multi-drag" />
      <p>
        Notice in the last example we are passing a separate plugin to the
        multi-drag plugin. This is the selections plugin, which sets things like
        click handlers. If you would like to write your own logic (or have
        already written logic for selecting items), you can pass your own
        selected values to the `selections` property.
      </p>
      <CodeExampleNative :full-height="true" example="multi-drag-config" />

      <SectionSupport />
    </div>
  </main>
  <TheFooter />
</template>
