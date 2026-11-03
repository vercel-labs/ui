<script setup lang="ts">
import { Input } from "@ui-sdk/vue/input"
</script>

<template>
  <form data-slot="row" role="search" @submit.prevent>
    <Input type="search" name="q" aria-label="Search" placeholder="Search…" />
    <button type="submit">Search</button>
  </form>
</template>
