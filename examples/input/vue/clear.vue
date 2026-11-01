<script setup lang="ts">
import { Search, X } from "@lucide/vue"
import type { InputValueChangeReason } from "@ui-sdk/core/input"
import { Input, InputClear, InputGroup } from "@ui-sdk/vue/input"
import { ref } from "vue"

const query = ref("Lovelace")
const reason = ref("")
</script>

<template>
  <div data-slot="stack">
    <InputGroup>
      <Search aria-hidden="true" />
      <Input
        v-model:value="query"
        type="search"
        aria-label="Search people"
        @value-change="(_: string, details: { reason: InputValueChangeReason }) => (reason = details.reason)"
      />
      <InputClear aria-label="Clear search">
        <X aria-hidden="true" />
      </InputClear>
    </InputGroup>
    <p data-slot="hint">
      {{ reason ? `Last change: ${reason}` : "Type, or clear the search." }}
    </p>
  </div>
</template>
