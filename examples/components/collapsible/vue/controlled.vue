<script setup lang="ts">
import { ChevronDownIcon } from "@lucide/vue"
import type { ChangeDetails } from "@ui-sdk/core"
import {
  Collapsible,
  CollapsiblePanel,
  CollapsibleTrigger,
  createCollapsibleController,
} from "@ui-sdk/vue/collapsible"
import { ref } from "vue"

const recoveryCodes = ["7KQ2-M9XD", "P4TR-8HZC", "W3NB-6JUE", "C5YF-2LSA"]

const collapsible = createCollapsibleController()

const open = ref(false)
const reason = ref("")
</script>

<template>
  <div data-slot="stack">
    <Collapsible
      v-model:open="open"
      :controller="collapsible"
      @open-change="(_: boolean, details: ChangeDetails) => (reason = details.reason)"
    >
      <CollapsibleTrigger data-variant="secondary">
        Recovery codes
        <ChevronDownIcon />
      </CollapsibleTrigger>
      <CollapsiblePanel>
        <div data-slot="stack">
          <p>Each code signs you in once if you lose your phone.</p>
          <ul data-slot="log">
            <li v-for="code in recoveryCodes" :key="code">{{ code }}</li>
          </ul>
          <button data-variant="secondary" @click="collapsible.close()">Done</button>
        </div>
      </CollapsiblePanel>
    </Collapsible>
    <button data-variant="secondary" @click="collapsible.toggle()">Toggle from outside</button>
    <output data-slot="output"
      >{{ open ? "Open" : "Closed" }}{{ reason ? `, last change: ${reason}` : "" }}</output
    >
  </div>
</template>
