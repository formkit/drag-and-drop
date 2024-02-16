<script lang="ts" setup></script>

<template>
  <div
    :class="`
      super-header
      w-full
      mt-4
      mb-[12%]
      sm:mb-10
      md:mb-14
      lg:mb-20
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
        text-stone-700
        hover:text-stone-800
        grayscale
        hover:grayscale-0
        opacity-80
        hover:opacity-100
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
            class="text-stone-700 opacity-70 group-hover/github:opacity-100 w-4 h-4 sm:w-5 sm:h-5"
          />
        </NuxtLink>
      </li>
    </ul>
  </div>
</template>

<style></style>
