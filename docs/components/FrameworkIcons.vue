<script setup lang="ts">
import IconReact from "~/components/IconReact.vue";
import IconVue from "~/components/IconVue.vue";
import IconJavaScript from "~/components/IconJavaScript.vue";
import IconSolid from "~/components/IconSolid.vue";
const props = defineProps({
  active: String,
});

const activeFramework = computed(() => {
  if (props.active === "react") return IconReact;
  if (props.active === "vue") return IconVue;
  if (props.active === "native") return IconJavaScript;
  if (props.active === "solid") return IconSolid;
});
</script>

<template>
  <component :is="activeFramework" class="inline-block w-5" />
</template>
