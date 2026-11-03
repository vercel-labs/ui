<script setup lang="ts">
import {
  type TokenDeletion,
  TokenInput,
  TokenInputEditor,
  TokenInputToken,
  type TokenInputValue,
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
  { type: "file", value: "src/routes.ts", label: "routes.ts", data: { trigger: "@" } },
  " in two sentences.",
]

const deletion = ref<TokenDeletion>("whole")
const options = ["whole", "select", "revert"] as const
</script>

<template>
  <div data-slot="stack">
    <div role="radiogroup" aria-label="Backspace" data-slot="row">
      <label v-for="option in options" :key="option" data-slot="label">
        <input
          v-model="deletion"
          type="radio"
          name="token-deletion"
          :value="option"
          data-slot="visually-hidden"
        />
        {{ option }}
      </label>
    </div>
    <TokenInput :token-deletion="deletion" :default-value="draft">
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
      <template #token="{ token }">
        <TokenInputToken>@{{ token.label }}</TokenInputToken>
      </template>
    </TokenInput>
  </div>
</template>
