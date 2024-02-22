<script setup lang="ts">
import { ref, onMounted } from "vue";

const h2s = ref<HTMLElement[]>([]);
const h3s = ref<HTMLElement[]>([]);
const headingsTree = new Map<HTMLElement, HTMLElement[]>();

onMounted(() => {
  h2s.value =
    (Array.from(
      document.querySelectorAll(".docs-content h2:not(.demo-container h2)")
    ) as HTMLElement[]) || [];
  h3s.value =
    (Array.from(
      document.querySelectorAll(".docs-content h3:not(.demo-container h3)")
    ) as HTMLElement[]) || [];

  // add ids to all headings based on their text content
  const headings = Array.from(document.querySelectorAll("h2, h3"));
  headings.forEach((heading) => {
    const id = heading.textContent?.toLowerCase().replace(/\s/g, "-");
    if (id) {
      heading.id = id;
    }
  });

  // create a tree of h2s and h3s
  h2s.value.forEach((h2, i) => {
    if (!h2s.value) return;
    const nextH2 = h2s.value[i + 1];
    const h3sUnderH2 = h3s.value.filter((h3) => {
      if (nextH2) {
        return h3.offsetTop > h2.offsetTop && h3.offsetTop < nextH2.offsetTop;
      }
      return h3.offsetTop > h2.offsetTop;
    });
    headingsTree.set(h2, h3sUnderH2);
  });

  const hash = window.location.hash.slice(1);
  const el = document.getElementById(hash);
  if (el) {
    // TODO: figure out why this delay is necessary
    setTimeout(() => {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 800);
  }
});
</script>

<template>
  <aside
    :class="`
      docs-sidebar
      hidden
      lg:flex
      flex-col
      pl-2
      w-full
      max-w-[180px]
    `"
  >
    <nav
      :class="`
        docs-sidebar-nav
        sticky
        px-4
        py-4
        bg-slate-100/10
        dark:bg-slate-800/10
        backdrop-blur-sm
        border
        rounded-lg
        border-sky-200/50
        dark:border-fuchsia-400/20
        top-2
        shadow-sm
        max-h-[calc(100dvh-0.5rem)]
        overflow-auto
      `"
    >
      <ul class="pl-2">
        <li v-for="section in h2s">
          <a
            :href="`#${section.id}`"
            class="inline-block text-base font-semibold text-cyan-800 hover:text-cyan-600 py-1 dark:text-fuchsia-300 dark:hover:text-fuchsia-100"
          >
            {{ section.textContent }}
          </a>

          <ul
            v-if="headingsTree.get(section)"
            class="relative ml-5 before:w-px before:bg-slate-400/50 before:absolute before:top-2 before:bottom-2 before:-left-5 dark:before:bg-fuchsia-300/25"
          >
            <li v-for="subSection in headingsTree.get(section)">
              <a
                :href="`#${subSection.id}`"
                class="inline-block text-sm text-cyan-800/75 hover:text-cyan-600 py-1 dark:text-fuchsia-300/50 dark:hover:text-fuchsia-300"
              >
                {{ subSection.textContent }}
              </a>
            </li>
          </ul>
        </li>
      </ul>
    </nav>
  </aside>
</template>
