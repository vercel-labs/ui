<script setup lang="ts">
import { ChevronDownIcon } from "@lucide/vue"
import { Collapsible, CollapsiblePanel, CollapsibleTrigger } from "@ui-sdk/vue/collapsible"
import { ref } from "vue"

const notes = [
  "Search now matches file contents, not only names.",
  "Shared links remember the folder they were opened from.",
  "Uploads resume after the connection drops.",
]

const settled = ref("")
</script>

<template>
  <Collapsible @open-change-complete="(open: boolean) => (settled = open ? 'opening' : 'closing')">
    <CollapsibleTrigger data-variant="secondary">
      Release notes
      <ChevronDownIcon />
    </CollapsibleTrigger>
    <CollapsiblePanel>
      <ul>
        <li v-for="note in notes" :key="note">{{ note }}</li>
      </ul>
    </CollapsiblePanel>
  </Collapsible>
  <output data-slot="output">{{ settled ? `Finished ${settled}` : "Not animated yet" }}</output>
</template>
