<script setup lang="ts">
import { Button } from "@ui-sdk/vue/button"
import { ref } from "vue"

const count = ref(0)
</script>

<template>
  <div data-slot="stack">
    <Button @click="count++">Button</Button>
    <output data-slot="output">Pressed {{ count }} {{ count === 1 ? "time" : "times" }}</output>
  </div>
</template>
