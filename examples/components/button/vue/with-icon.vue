<script setup lang="ts">
import { ChevronRightIcon, PlusIcon } from "@lucide/vue"
import { Button } from "@ui-sdk/vue/button"
</script>

<template>
  <div data-slot="row">
    <Button>
      <PlusIcon />
      New project
    </Button>
    <Button>
      Continue
      <ChevronRightIcon />
    </Button>
  </div>
</template>
