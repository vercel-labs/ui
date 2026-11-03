<script setup lang="ts">
import { LoaderCircleIcon } from "@lucide/vue"
import { Button } from "@ui-sdk/vue/button"

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
const save = () => wait(1500)
</script>

<template>
  <Button @click="save" pending-announcement="Saving">
    <LoaderCircleIcon data-slot="spinner" aria-hidden="true" />
    Save
  </Button>
</template>
