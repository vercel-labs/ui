<script setup lang="ts">
import { LoaderCircle } from "@lucide/vue"
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
  <div class="flex w-full max-w-sm flex-col gap-3">
    <Command
      pending-announcement="Deploying"
      class="flex min-h-40 w-full max-w-sm flex-col overflow-hidden rounded-3xl bg-popover p-1 text-popover-foreground ring-1 ring-foreground/5"
    >
      <div class="shrink-0 p-1 pb-0">
        <CommandInput
          aria-label="Search actions"
          placeholder="Search actions..."
          class="m-0 box-border h-8 w-full min-w-0 shrink-0 rounded-2xl border border-transparent bg-input/50 px-2.5 py-1 text-base leading-6 text-inherit transition-[color,box-shadow] duration-200 placeholder:text-muted-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm md:leading-5"
        />
      </div>
      <CommandList class="min-h-0 p-1 outline-none">
        <CommandItem
          v-slot="{ state }"
          value="deploy"
          class="group relative flex min-h-7 cursor-default items-center justify-between gap-2 rounded-xl px-2 py-1.5 text-sm leading-5 outline-none select-none data-highlighted:bg-muted data-highlighted:text-foreground data-disabled:pointer-events-none data-disabled:opacity-50 data-pending:cursor-progress"
          @select="deploy"
        >
          Deploy to production
          <LoaderCircle
            aria-hidden="true"
            v-if="state.pending"
            class="pointer-events-none block size-4 shrink-0 animate-spin text-muted-foreground"
          />
        </CommandItem>
        <CommandItem
          v-slot="{ state }"
          value="sync"
          class="group relative flex min-h-7 cursor-default items-center justify-between gap-2 rounded-xl px-2 py-1.5 text-sm leading-5 outline-none select-none data-highlighted:bg-muted data-highlighted:text-foreground data-disabled:pointer-events-none data-disabled:opacity-50 data-pending:cursor-progress"
          @select="sync"
        >
          Sync with server
          <LoaderCircle
            aria-hidden="true"
            v-if="state.pending"
            class="pointer-events-none block size-4 shrink-0 animate-spin text-muted-foreground"
          />
          <span v-else-if="state.error !== undefined" class="text-xs leading-4 font-medium text-foreground"
            >Failed, try again</span
          >
        </CommandItem>
      </CommandList>
    </Command>
    <output class="block min-h-5 text-sm leading-5 text-muted-foreground">{{
      log || "Run a command"
    }}</output>
  </div>
</template>
