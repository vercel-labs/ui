<script setup lang="ts">
import { LoaderCircleIcon } from "@lucide/vue"
import { Command, CommandInput, CommandItem, CommandList } from "@ui-sdk/vue/command"
import { ref } from "vue"

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms))

const log = ref("")

async function deploy() {
  await wait(1200)
  log.value = "Deployed"
}

async function sync() {
  await wait(600)
  throw new Error("Offline")
}
</script>

<template>
  <div data-slot="stack">
    <Command>
      <CommandInput aria-label="Search actions" placeholder="Search actions..." />
      <CommandList>
        <CommandItem v-slot="{ state }" value="deploy" @select="deploy">
          Deploy to production
          <LoaderCircleIcon data-slot="spinner" aria-hidden="true" v-if="state.pending" />
        </CommandItem>
        <CommandItem v-slot="{ state }" value="sync" @select="sync">
          Sync with server
          <LoaderCircleIcon data-slot="spinner" aria-hidden="true" v-if="state.pending" />
          <span v-else-if="state.error !== undefined" data-slot="hint">Failed, try again</span>
        </CommandItem>
      </CommandList>
    </Command>
    <output data-slot="output">{{ log || "Run a command" }}</output>
  </div>
</template>
