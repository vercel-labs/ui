<script setup lang="ts">
import { Toggle, ToggleGroup } from "@ui-sdk/vue/toggle"
</script>

<template>
  <ToggleGroup :default-value="['all']" aria-label="Calls">
    <Toggle value="all" data-variant="outline"> All </Toggle>
    <Toggle value="missed" data-variant="outline"> Missed </Toggle>
  </ToggleGroup>
</template>
