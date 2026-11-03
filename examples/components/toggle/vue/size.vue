<script setup lang="ts">
import { Toggle } from "@ui-sdk/vue/toggle"
</script>

<template>
  <div data-slot="row">
    <Toggle data-variant="outline" data-size="sm"> Small </Toggle>
    <Toggle data-variant="outline"> Default </Toggle>
    <Toggle data-variant="outline" data-size="lg"> Large </Toggle>
  </div>
</template>
