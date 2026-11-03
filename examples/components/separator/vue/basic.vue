<script setup lang="ts">
import { Separator } from "@ui-sdk/vue/separator"
</script>

<template>
  <div data-slot="stack">
    <div data-slot="stack">
      <p>Account</p>
      <p data-slot="hint">Manage your profile and preferences.</p>
    </div>
    <Separator />
    <p>Your changes are saved automatically.</p>
  </div>
</template>
