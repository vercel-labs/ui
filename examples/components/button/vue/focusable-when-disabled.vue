<script setup lang="ts">
import { Button } from "@ui-sdk/vue/button"
import { computed, ref, useId } from "vue"

const title = ref("")
const published = ref(false)
const hint = useId()
const ready = computed(() => title.value.trim() !== "")
</script>

<template>
  <div data-slot="stack">
    <label data-slot="label">
      Title
      <input v-model="title" @input="published = false" />
    </label>
    <div data-slot="row">
      <Button :disabled="!ready" focusable-when-disabled @click="published = true">
        <template #render="{ props }">
          <button v-bind="props" :aria-describedby="hint">Publish</button>
        </template>
      </Button>
      <p :id="hint">
        {{ !ready ? "Add a title to publish." : published ? "Published." : "Ready to publish." }}
      </p>
    </div>
  </div>
</template>
