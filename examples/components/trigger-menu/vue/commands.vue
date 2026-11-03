<script setup lang="ts">
import {
  type TriggerMenuDataItem,
  TriggerMenu,
  TriggerMenuContent,
  TriggerMenuHint,
  TriggerMenuInput,
  TriggerMenuItem,
  TriggerMenuList,
} from "@ui-sdk/vue/trigger-menu"
import { ref } from "vue"

const commands = [
  {
    value: "model",
    label: "model",
    arguments: [
      { name: "model", hint: "<model>", required: true, items: ["opus", "sonnet", "haiku"] },
      { name: "effort", hint: "[effort]", items: ["low", "medium", "high"], allowCustomValue: false },
    ],
  },
  { value: "search", label: "search", arguments: [{ name: "query", hint: "<query>", required: true }] },
  { value: "clear", label: "clear" },
  { value: "send", label: "send", after: "submit" as const },
]

const last = ref("")

function onSelect(value: string, details: { arguments: Record<string, string> }) {
  last.value = `/${value} ${JSON.stringify(details.arguments)}`
}

function send(event: Event) {
  last.value = `Sent: ${new FormData(event.currentTarget as HTMLFormElement).get("prompt")}`
}
</script>

<template>
  <form data-slot="stack" @submit.prevent="send">
    <TriggerMenu
      :triggers="[{ char: '/', boundary: 'start', type: 'command', items: commands }]"
      :on-select="onSelect"
    >
      <TriggerMenuInput name="prompt" aria-label="Prompt" placeholder="Try /model or /search" />
      <TriggerMenuHint />
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
    <p data-slot="hint">{{ last || "/send submits the form." }}</p>
  </form>
</template>
