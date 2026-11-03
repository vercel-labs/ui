<script setup lang="ts">
import { Button } from "@ui-sdk/vue/button"
import { ref } from "vue"

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
const fail = ref(false)

async function save() {
  await wait(1000)
  if (fail.value) {
    throw new Error("Couldn't save. Check your connection and try again.")
  }
}
</script>

<template>
  <div data-slot="stack">
    <label data-slot="label">
      <input v-model="fail" type="checkbox" />
      Make saving fail
    </label>
    <Button @click="save">
      <template #render="{ props, state }">
        <div data-slot="stack">
          <button v-bind="props">
            {{ state.pending ? "Saving…" : state.error ? "Try again" : "Save changes" }}
          </button>
          <p data-slot="output" role="alert">
            {{ state.error instanceof Error ? state.error.message : "" }}
          </p>
        </div>
      </template>
    </Button>
  </div>
</template>
