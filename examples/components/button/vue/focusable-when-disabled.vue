<script setup lang="ts">
import { Button } from "@ui-sdk/vue/button"
import { Field, FieldControl, FieldLabel } from "@ui-sdk/vue/field"
import { computed, ref, useId } from "vue"
import { useLog } from "../../../shared/vue/log"

const log = useLog()
const title = ref("")
const hint = useId()
const ready = computed(() => title.value.trim() !== "")

function onTitle(event: Event) {
  title.value = (event.target as HTMLInputElement).value
}
</script>

<template>
  <div data-slot="stack">
    <Field>
      <FieldLabel>Title</FieldLabel>
      <FieldControl :value="title" @input="onTitle" />
    </Field>
    <div data-slot="row">
      <Button
        :disabled="!ready"
        focusable-when-disabled
        :aria-describedby="hint"
        @click="log(`Published “${title}”`)"
      >
        Publish
      </Button>
      <p :id="hint" data-slot="hint">
        {{ ready ? "Ready to publish." : "Add a title to publish." }}
      </p>
    </div>
  </div>
</template>
