<script setup lang="ts">
import { ArrowUpIcon } from "@lucide/vue"
import { Button } from "@ui-sdk/vue/button"
</script>

<template>
  <div data-slot="row">
    <Button data-shape="round">Subscribe</Button>
    <Button data-shape="round" aria-label="Scroll to top">
      <ArrowUpIcon />
    </Button>
  </div>
</template>
