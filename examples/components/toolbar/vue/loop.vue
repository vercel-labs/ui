<script setup lang="ts">
import { Toolbar, ToolbarButton } from "@ui-sdk/vue/toolbar"
</script>

<template>
  <Toolbar :loop="false" aria-label="Pages">
    <ToolbarButton
      data-variant="secondary"
      v-for="label in ['First', 'Previous', 'Next', 'Last']"
      :key="label"
    >
      {{ label }}
    </ToolbarButton>
  </Toolbar>
</template>
