<script setup lang="ts">
import { FileIcon, XIcon } from "@lucide/vue"
import { TokenInput, TokenInputEditor, TokenInputToken, TokenInputTokenRemove } from "@ui-sdk/vue/token-input"
import {
  type TriggerMenuDataItem,
  TriggerMenu,
  TriggerMenuContent,
  TriggerMenuItem,
  TriggerMenuList,
} from "@ui-sdk/vue/trigger-menu"

const files = [
  { value: "src/app.tsx", label: "app.tsx", keywords: ["src"] },
  { value: "src/routes.ts", label: "routes.ts", keywords: ["src"] },
  { value: "src/styles.css", label: "styles.css", keywords: ["src"] },
  { value: "README.md", label: "README.md" },
  { value: "package.json", label: "package.json" },
]
</script>

<template>
  <TokenInput>
    <TokenInputEditor aria-label="Prompt" placeholder="Ask about a file, type @ to add one" />
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
      <TokenInputToken>
        <FileIcon aria-hidden="true" />
        {{ token.label }}
        <TokenInputTokenRemove>
          <XIcon aria-hidden="true" />
        </TokenInputTokenRemove>
      </TokenInputToken>
    </template>
  </TokenInput>
</template>
