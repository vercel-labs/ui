<script setup lang="ts">
import { Button } from "@ui-sdk/vue/button"

const actions = ["Archive", "Report", "Snooze"]
</script>

<template>
  <div data-slot="row" role="group" aria-label="Message actions">
    <Button v-for="action in actions" :key="action">
      {{ action }}
    </Button>
  </div>
</template>
