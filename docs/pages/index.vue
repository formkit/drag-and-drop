<script setup lang="ts"></script>

<template>
  <TheHero />
  <main
    class="relative z-20 pt-20 min-h-[200vh] border-t border-t-slate-100 shadow-[0_-2em_7em_2em_rgba(0,0,0,.33),0_-0.5em_1em_0.15em_rgba(0,0,0,0.25)] dark:border-t-slate-600 dark:shadow-[0_-2em_6em_1em_rgba(0,0,0,1)]"
  >
    <PageSection class="text-slate-700 dark:text-slate-200">
      <h2 class="text-2xl">Introduction</h2>

      <Introduction />
      <h2 class="text-2xl">Core Features:</h2>
      <Sort />
      <Transfer />
      <ToDos :drag-handles="true" />
    </PageSection>
  </main>
</template>
