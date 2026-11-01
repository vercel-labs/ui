<script setup lang="ts">
import { Trash } from "@lucide/vue"
import { Button } from "@ui-sdk/vue/button"
</script>

<template>
  <Button data-variant="destructive">
    <Trash />
    Delete
  </Button>
</template>
