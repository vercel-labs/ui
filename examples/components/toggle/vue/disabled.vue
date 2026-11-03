<script setup lang="ts">
import { Toggle } from "@ui-sdk/vue/toggle"
</script>

<template>
  <div data-slot="row">
    <Toggle disabled> Disabled </Toggle>
    <Toggle default-pressed disabled> Disabled </Toggle>
  </div>
</template>
