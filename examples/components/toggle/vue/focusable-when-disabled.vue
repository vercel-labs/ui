<script setup lang="ts">
import { PinIcon } from "@lucide/vue"
import { Toggle, ToggleIcon } from "@ui-sdk/vue/toggle"
import { useId } from "vue"

const hint = useId()
</script>

<template>
  <div data-slot="stack">
    <Toggle disabled focusable-when-disabled>
      <template #render="{ props }">
        <button v-bind="props" :aria-describedby="hint">
          <ToggleIcon>
            <PinIcon />
          </ToggleIcon>
          Pin to top
        </button>
      </template>
    </Toggle>
    <p :id="hint" data-slot="hint">Only owners can pin messages.</p>
  </div>
</template>
