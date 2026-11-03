<script setup lang="ts">
import {
  fromText,
  toLabel,
  toText,
  TokenInput,
  TokenInputEditor,
  type Token,
  type TokenCodec,
  type TokenInputValue,
} from "@ui-sdk/vue/token-input"
import { ref } from "vue"

const slack: TokenCodec = {
  format: (token: Token) => `<@${token.value}>`,
  parse: (text: string) =>
    text.split(/(<@[\w.-]+>)/).map((part) => {
      const id = /^<@([\w.-]+)>$/.exec(part)?.[1]
      return id ? { type: "mention", value: id, label: `@${id}` } : part
    }),
}
const value = ref<TokenInputValue>(fromText("Ping <@ada> and <@grace>", slack))
</script>

<template>
  <div data-slot="stack">
    <TokenInput v-model:value="value" :codec="slack" copy="label">
      <TokenInputEditor aria-label="Message" />
    </TokenInput>
    <dl>
      <dt>Codec</dt>
      <dd>{{ toText(value, slack) }}</dd>
      <dt>Default</dt>
      <dd>{{ toText(value) }}</dd>
      <dt>Label</dt>
      <dd>{{ toLabel(value) }}</dd>
    </dl>
  </div>
</template>
