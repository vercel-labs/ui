<script setup lang="ts">
import { ChevronRight, Plus } from "@lucide/vue"
import { Button } from "@ui-sdk/vue/button"
</script>

<template>
  <div data-slot="row">
    <Button>
      <Plus />
      New project
    </Button>
    <Button>
      Continue
      <ChevronRight />
    </Button>
  </div>
</template>
