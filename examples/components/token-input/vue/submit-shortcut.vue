<script setup lang="ts">
import { toLabel, TokenInput, TokenInputEditor, type TokenInputValue } from "@ui-sdk/vue/token-input"
import { ref } from "vue"

const sent = ref("")
</script>

<template>
  <div data-slot="stack">
    <TokenInput submit-shortcut="mod+enter" @submit="(value: TokenInputValue) => (sent = toLabel(value))">
      <TokenInputEditor aria-label="Message" placeholder="Enter adds a line, Cmd/Ctrl+Enter sends" />
    </TokenInput>
    <p data-slot="output">
      {{ sent ? `Sent:\n${sent}` : "Nothing sent yet." }}
    </p>
  </div>
</template>
