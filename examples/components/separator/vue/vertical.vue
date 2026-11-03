<script setup lang="ts">
import { Separator } from "@ui-sdk/vue/separator"
</script>

<template>
  <div data-slot="row">
    <span>Profile</span>
    <Separator orientation="vertical" />
    <span>Billing</span>
    <Separator orientation="vertical" />
    <span>Settings</span>
  </div>
</template>
