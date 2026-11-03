<script setup lang="ts">
import { BoldIcon, ChevronDownIcon, ItalicIcon, UnderlineIcon } from "@lucide/vue"
import { Menu, MenuContent, MenuItem, MenuTrigger } from "@ui-sdk/vue/menu"
import { Toggle, ToggleGroup } from "@ui-sdk/vue/toggle"
import { Toolbar, ToolbarButton, ToolbarSeparator } from "@ui-sdk/vue/toolbar"
</script>

<template>
  <Toolbar aria-label="Formatting">
    <ToggleGroup multiple aria-label="Text style">
      <Toggle data-variant="ghost" value="bold" aria-label="Bold">
        <BoldIcon />
      </Toggle>
      <Toggle data-variant="ghost" value="italic" aria-label="Italic">
        <ItalicIcon />
      </Toggle>
      <Toggle data-variant="ghost" value="underline" aria-label="Underline">
        <UnderlineIcon />
      </Toggle>
    </ToggleGroup>
    <ToolbarSeparator />
    <Menu>
      <ToolbarButton data-variant="secondary">
        <template #render="{ props }">
          <MenuTrigger v-bind="props">
            Sans
            <ChevronDownIcon />
          </MenuTrigger>
        </template>
      </ToolbarButton>
      <MenuContent>
        <MenuItem v-for="font in ['Sans', 'Serif', 'Mono']" :key="font">
          {{ font }}
        </MenuItem>
      </MenuContent>
    </Menu>
  </Toolbar>
</template>
