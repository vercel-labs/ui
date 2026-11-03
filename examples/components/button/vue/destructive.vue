<script setup lang="ts">
import { TrashIcon } from "@lucide/vue"
import { Button } from "@ui-sdk/vue/button"
</script>

<template>
  <Button data-variant="destructive">
    <TrashIcon />
    Delete
  </Button>
</template>
