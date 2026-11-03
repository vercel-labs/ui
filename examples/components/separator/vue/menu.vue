<script setup lang="ts">
import { Separator } from "@ui-sdk/vue/separator"
</script>

<template>
  <div data-slot="row">
    <div data-slot="stack">
      <span>Settings</span>
      <span data-slot="hint">Manage preferences</span>
    </div>
    <Separator orientation="vertical" />
    <div data-slot="stack">
      <span>Account</span>
      <span data-slot="hint">Profile & security</span>
    </div>
    <Separator orientation="vertical" />
    <div data-slot="stack">
      <span>Help</span>
      <span data-slot="hint">Support & docs</span>
    </div>
  </div>
</template>
