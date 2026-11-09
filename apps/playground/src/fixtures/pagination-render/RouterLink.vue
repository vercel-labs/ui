<script setup lang="ts">
// A client-side router's link: it navigates without a page load, unless a
// handler before it prevented that.
const props = defineProps<{
  href?: string
  onClick?: (event: MouseEvent) => void
}>()

function navigate(event: MouseEvent) {
  props.onClick?.(event)
  if (event.defaultPrevented) {
    return
  }
  event.preventDefault()
  history.pushState(null, "", props.href)
}
</script>

<template>
  <a :href="props.href" @click="navigate"><slot /></a>
</template>
