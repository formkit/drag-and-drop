<script lang="ts" setup>
function toggleDark() {
  const html = document.querySelector("html");
  if (!html) return;
  html.classList.toggle("dark");
}
</script>

<template>
  <div class="page-section">
    <div
      :class="`
      super-header
      w-full
      mt-4
      mb-[12%]
      sm:mb-10
      md:mb-14
      lg:mb-16
      flex
      justify-between
      items-center
    `"
    >
      <NuxtLink
        to="https://formkit.com?utm_source=dnd&utm_medium=website&utm_campaign=header"
        :class="`
        group/logo
        head-message
        text-xs
        md:text-sm
        flex
        transition-all
        text-slate-700
        hover:text-slate-800
        grayscale
        hover:grayscale-0
        opacity-80
        hover:opacity-100

        dark:text-slate-300
        dark:hover:text-slate-200
      `"
      >
        <LogoMark
          class="w-3 mr-2 fill-[#FCAB5E] grayscale group-hover/logo:grayscale-0"
        />
        Made with <span class="text-pink-500 mx-[0.25ch]">♥</span> by
        <span class="hidden sm:inline sm:mx-[0.5ch]">the</span> FormKit
        <span class="hidden sm:inline sm:ml-[0.5ch]">team</span>
      </NuxtLink>
      <ul class="flex gap-4">
        <li>
          <NuxtLink
            to="https://github.com/formkit/drag-and-drop"
            class="group/github flex items-center relative"
          >
            <GitHubStars />
            <GitHubLogo
              class="text-slate-700 opacity-70 group-hover/github:opacity-100 w-4 h-4 sm:w-5 sm:h-5 dark:text-slate-300"
            />
          </NuxtLink>
        </li>
        <li>
          <button @click="toggleDark">Light/Dark Mode</button>
        </li>
      </ul>
    </div>
  </div>
</template>

<style></style>
