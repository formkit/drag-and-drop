<script setup lang="ts"></script>

<template>
  <TheHero />
  <main
    class="relative z-20 pt-20 min-h-[200vh] border-t border-t-slate-100 shadow-[0_-2em_7em_2em_rgba(0,0,0,.33),0_-0.5em_1em_0.15em_rgba(0,0,0,0.25)] dark:border-t-slate-600 dark:shadow-[0_-2em_6em_1em_rgba(0,0,0,1)]"
  >
    <PageSection class="text-slate-700 dark:text-slate-200">
      <div class="docs-content">
        <h2>Introduction</h2>
        <h3>I'm a sub-section</h3>
        <SectionIntroduction />
        <h2>Core Features:</h2>
        <CodeExample example="transfer" />
        <CodeExample example="drag-handles" />
      </div>
    </PageSection>
  </main>
</template>
