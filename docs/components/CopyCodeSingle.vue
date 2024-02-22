<script lang="ts" setup>
const props = defineProps<{
  command: string;
}>();
const didCopy = useTimedRef(4000);

function copyCode() {
  navigator.clipboard.writeText(`${props.command}`);
  didCopy.value = true;
}
</script>

<template>
  <a
    href="#copy-code"
    @click.prevent="copyCode"
    ref="code"
    class="group relative font-mono text-xs text-fuchsia-700 shadow-sm py-[14px] px-4 bg-white/40 backdrop-blur-sm rounded-lg border border-white flex items-center min-w-[320px] dark:bg-black/40 dark:border-fuchsia-600 dark:text-fuchsia-300"
  >
    <span
      v-if="!didCopy"
      v-text="command"
      :key="command"
      class="whitespace-nowrap"
    />
    <IconCopy
      v-if="!didCopy"
      class="w-3 basis-3 flex-shrink-0 ml-auto text-gray-500 dark:text-gray-300 group-hover:text-sky-600 dark:group-hover:text-sky-300"
    />
    <span
      v-if="didCopy"
      :key="command"
      class="whitespace-nowrap text-green-700 flex w-full items-center gap-2 dark:text-green-400"
    >
      Command copied!
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="w-4 h-4 ml-auto"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="m4.5 12.75 6 6 9-13.5"
        />
      </svg>
    </span>
  </a>
</template>

<style></style>
