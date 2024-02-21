<script setup lang="ts"></script>

<template>
  <TheHero />
  <main
    class="relative z-20 pt-20 min-h-[200vh] border-t border-t-slate-100 shadow-[0_-2em_7em_2em_rgba(0,0,0,.33),0_-0.5em_1em_0.15em_rgba(0,0,0,0.25)] dark:border-t-slate-600 dark:shadow-[0_-2em_6em_1em_rgba(0,0,0,1)]"
  >
    <PageSection class="text-slate-700 dark:text-slate-200">
      <div class="docs-content">
        <h2>Introduction</h2>
        <SectionIntroduction />
        <h2>Core Features:</h2>
        <h3>Sortability</h3>
        <CodeExample example="sorting" />
        <h3>Transferability</h3>
        <CodeExample example="transfer" />
        <h3>Drag Handles</h3>
        <CodeExample example="drag-handles" />
        <h2>Configuration</h2>
        <CodeExampleNative example="config" />

        <h2>Plugins</h2>
        <p>
          Plugins are a powerful way to extend the functionality of the library.
          They can be used to add new features, modify existing ones, or even
          create entirely new experiences.
        </p>
        <h3>Multi Drag</h3>
        <p>
          The multi-drag plugin allows you to select multiple items and drag
          them together. Try selecting files like you would on your machine.
        </p>
        <CodeExample example="multi-drag" />
        <p>
          Notice in the last example we are passing a separate plugin to the
          multi-drag plugin. This is the selections plugin, which sets things
          like click handlers. If you would like to write your own logic (or
          have already written logic for selecting items), you can pass your own
          selected values to the `selections` property.
        </p>
        <CodeExampleNative example="multi-drag-config" />
      </div>
    </PageSection>
  </main>
</template>
