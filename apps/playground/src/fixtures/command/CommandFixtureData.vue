<script setup lang="ts">
import {
  CommandGroup,
  CommandGroupLabel,
  CommandItem,
  CommandItemText,
  CommandSeparator,
  CommandShortcut,
  type CommandData,
  type CommandDataItem,
} from "@ui-sdk/vue"
import CommandFixtureData from "./CommandFixtureData.vue"

defineProps<{ items: CommandData; highlight?: boolean }>()

// A plain string is a command whose value is its label.
const commandOf = (entry: string | CommandDataItem): CommandDataItem =>
  typeof entry === "string" ? { value: entry, label: entry } : entry

// Groups keep their key while filtering hides the ones before them.
const keyOf = (entry: CommandData[number], index: number) =>
  typeof entry === "string"
    ? entry
    : !("type" in entry)
      ? entry.value
      : entry.type === "group"
        ? `group-${entry.label ?? index}`
        : `separator-${index}`
</script>

<!-- The data's commands, groups and separators, styled like the composed ones. -->
<template>
  <template v-for="(entry, index) in items" :key="keyOf(entry, index)">
    <CommandSeparator
      v-if="
        typeof entry !== 'string' &&
        'type' in entry &&
        entry.type === 'separator'
      "
      class="separator"
    />
    <CommandGroup
      v-else-if="
        typeof entry !== 'string' && 'type' in entry && entry.type === 'group'
      "
    >
      <CommandGroupLabel v-if="entry.label" class="label">{{
        entry.label
      }}</CommandGroupLabel>
      <CommandFixtureData :items="entry.items" :highlight="highlight" />
    </CommandGroup>
    <CommandItem
      v-else-if="typeof entry === 'string' || !('type' in entry)"
      class="item"
      :value="commandOf(entry).value"
      :label="commandOf(entry).label"
      :keywords="commandOf(entry).keywords"
      :disabled="commandOf(entry).disabled"
      :shortcut="commandOf(entry).shortcut"
    >
      <CommandItemText v-if="highlight">{{
        commandOf(entry).label
      }}</CommandItemText>
      <template v-else>{{ commandOf(entry).label }}</template>
      <CommandShortcut v-if="commandOf(entry).shortcut" class="shortcut" />
    </CommandItem>
  </template>
</template>
