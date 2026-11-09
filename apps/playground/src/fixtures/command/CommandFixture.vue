<script setup lang="ts">
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandGroupLabel,
  CommandInput,
  CommandItem,
  CommandItemText,
  CommandList,
  CommandPage,
  CommandSeparator,
  CommandShortcut,
  CommandStatus,
} from "@ui-sdk/vue"
import CommandFixtureData from "./CommandFixtureData.vue"
import {
  commandData,
  commandFixture as f,
  commandOptions,
  runAction,
} from "tests/fixtures/command.ts"
import { longItems } from "tests/fixtures/select.ts"
import { ref } from "vue"

const props = defineProps<{ data?: boolean }>()
const { slow, fail, long, highlight, unvalued, ...options } = commandOptions()
const action = ref("")
const lastHighlight = ref("")
const items = long ? longItems() : props.data ? commandData() : undefined

function onAction(value: string) {
  action.value = `action:${value}`
  return runAction(slow, fail)
}
</script>

<template>
  <div class="fixture">
    <button>Before</button>
    <Command
      v-bind="options"
      class="command"
      :items="items"
      @action="onAction"
      @value-change="
        (value: string | null, details: { reason: string }) =>
          (lastHighlight = `${value}:${details.reason}`)
      "
    >
      <CommandInput class="input" :aria-label="f.input" />
      <CommandEmpty class="empty">{{ f.empty }}</CommandEmpty>
      <CommandStatus v-slot="{ state }" class="status">{{
        state.loading ? "Loading…" : ""
      }}</CommandStatus>
      <CommandList v-if="items" v-slot="{ state }" class="command-list">
        <CommandFixtureData :items="state.items" :highlight="highlight" />
      </CommandList>
      <CommandList v-else class="command-list">
        <CommandPage>
          <template v-for="(group, index) in f.groups" :key="group.label">
            <CommandSeparator v-if="index > 0" class="separator" />
            <CommandGroup>
              <CommandGroupLabel class="label">{{
                group.label
              }}</CommandGroupLabel>
              <CommandItem
                v-for="item in group.items"
                :key="item.value"
                class="item"
                :value="unvalued ? undefined : item.value"
                :keywords="'keywords' in item ? item.keywords : undefined"
                :disabled="'disabled' in item ? item.disabled : undefined"
                :shortcut="'shortcut' in item ? item.shortcut : undefined"
                :page="'page' in item ? item.page : undefined"
              >
                <CommandItemText v-if="highlight">{{
                  item.label
                }}</CommandItemText>
                <template v-else>{{ item.label }}</template>
                <CommandShortcut v-if="'shortcut' in item" class="shortcut" />
              </CommandItem>
            </CommandGroup>
          </template>
        </CommandPage>
        <CommandPage value="theme">
          <CommandItem
            v-for="item in f.theme"
            :key="item.value"
            class="item"
            :value="item.value"
          >
            {{ item.label }}
          </CommandItem>
        </CommandPage>
      </CommandList>
    </Command>
    <button>After</button>
    <output role="status" aria-label="Last action">{{ action }}</output>
    <output role="status" aria-label="Last highlight">{{
      lastHighlight
    }}</output>
  </div>
</template>
