<script setup lang="ts">
import Header from "~/components/header.vue"
import { Confirmer } from "~/components/ui/alert-dialog"
import { Toaster } from "~/components/ui/toast"
import { provideTracker } from "~/composables/tracker"

const tracker = provideTracker()
</script>

<template>
  <div class="flex h-dvh flex-col overflow-hidden font-sans text-sm">
    <Header />
    <NuxtPage />
  </div>
  <Toaster />
  <Confirmer :confirm="tracker.confirm" />
</template>
