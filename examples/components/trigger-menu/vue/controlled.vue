<script setup lang="ts">
import {
  type TriggerMenuDataItem,
  TriggerMenu,
  TriggerMenuContent,
  TriggerMenuInput,
  TriggerMenuItem,
  TriggerMenuList,
} from "@ui-sdk/vue/trigger-menu"
import { ref } from "vue"

const people = [
  { value: "ada", label: "Ada Lovelace", keywords: ["ada"] },
  { value: "alan", label: "Alan Turing" },
  { value: "grace", label: "Grace Hopper" },
  { value: "katherine", label: "Katherine Johnson" },
  { value: "linus", label: "Linus Torvalds", disabled: true },
  { value: "margaret", label: "Margaret Hamilton" },
]

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

const open = ref(false)
const log = ref<string[]>([])
const note = (line: string) => (log.value = [line, ...log.value].slice(0, 4))
const triggers = [
  { char: "@", items: people },
  { char: "/", boundary: "start" as const, items: commands },
]
</script>

<template>
  <TriggerMenu
    v-model:open="open"
    :triggers="triggers"
    :auto-highlight="false"
    :loop="false"
    shortcut="ctrl+j"
    status="idle"
    @open-change="
      (next: boolean, details: { reason: string; trigger: string | null }) =>
        note(`${next ? 'opened' : 'closed'} ${details.trigger ?? ''} (${details.reason})`)
    "
    @open-change-complete="(next: boolean) => note(next ? 'finished opening' : 'finished closing')"
    @query-change="
      (query: string, details: { argument?: string }) =>
        note(`query “${query}”${details.argument ? ` for ${details.argument}` : ''}`)
    "
  >
    <div data-slot="stack">
      <TriggerMenuInput aria-label="Message" placeholder="Type @ or /" />
      <ul data-slot="output">
        <li v-for="(line, index) in log" :key="index">{{ line }}</li>
      </ul>
    </div>
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
</template>
