<script setup lang="ts">
import {
  type Token,
  TokenInput,
  TokenInputEditor,
  type TokenInputValue,
  type TokenInputValueChangeDetails,
  toText,
} from "@ui-sdk/vue/token-input"
import {
  type TriggerMenuDataItem,
  TriggerMenu,
  TriggerMenuContent,
  TriggerMenuItem,
  TriggerMenuList,
} from "@ui-sdk/vue/trigger-menu"
import { ref } from "vue"

const files = [
  { value: "src/app.tsx", label: "app.tsx", keywords: ["src"] },
  { value: "src/routes.ts", label: "routes.ts", keywords: ["src"] },
  { value: "src/styles.css", label: "styles.css", keywords: ["src"] },
  { value: "README.md", label: "README.md" },
  { value: "package.json", label: "package.json" },
]

const draft: TokenInputValue = [
  "Explain ",
  { type: "file", value: "src/routes.ts", label: "routes.ts" },
  " in two sentences.",
]

const value = ref<TokenInputValue>(draft)
const last = ref("")

function onChange(next: TokenInputValue, details: TokenInputValueChangeDetails) {
  const removed = details.removed.map((token) => token.label).join(", ")
  last.value = `${details.reason}${details.inputType ? ` (${details.inputType})` : ""}${removed ? `, removed ${removed}` : ""}`
}
</script>

<template>
  <div data-slot="stack">
    <TokenInput
      v-model:value="value"
      :history="{ limit: 50, groupDelay: 1000 }"
      :get-token-description="(token: Token) => (token.type === 'file' ? 'attached file' : token.type)"
      @value-change="onChange"
    >
      <TokenInputEditor aria-label="Prompt" />
      <TriggerMenu :triggers="[{ char: '@', type: 'file', items: files }]">
        <TriggerMenuContent>
          <TriggerMenuList v-slot="{ state }">
            <TriggerMenuItem
              v-for="item in state.items as TriggerMenuDataItem[]"
              :key="item.value"
              :value="item.value"
              :label="item.label"
              :disabled="item.disabled"
            >
              {{ item.label }}
            </TriggerMenuItem>
          </TriggerMenuList>
        </TriggerMenuContent>
      </TriggerMenu>
    </TokenInput>
    <p data-slot="output">
      {{ last || "Type, paste or press Cmd+Z." }}
    </p>
    <p data-slot="output">{{ toText(value) }}</p>
  </div>
</template>
