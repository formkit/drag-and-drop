<script setup lang="ts"></script>

<template>
  <div class="overflow-hidden transform-gpu">
    <EyebrowHeader />
    <TheHero />
  </div>
  <main
    class="page-container flex justify-center relative z-20 pt-10 md:pt-20 min-h-[200vh] border-t border-t-slate-100 shadow-[0_-2em_7em_2em_rgba(0,0,0,.33),0_-0.5em_1em_0.15em_rgba(0,0,0,0.25)] dark:border-t-slate-600 dark:shadow-[0_-2em_6em_1em_rgba(0,0,0,1)]"
  >
    <TheSidebar />
    <div
      class="docs-content min-w-0 px-4 w-full max-w-[1000px] lg:pl-8 xl:pl-12"
    >
      <SectionIntroduction />
      <SectionGettingStarted />
      <SectionFeatures />
      <!--<SectionPlugins />
      <SectionEvents />
      <SectionConfiguration />
      <SectionSupport />-->
    </div>
  </main>
  <TheFooter />
</template>
