<script setup lang="ts">
import { CheckIcon, ChevronRightIcon } from "@lucide/vue"
import {
  Menu,
  MenuCheckboxItem,
  MenuContent,
  MenuGroupLabel,
  MenuItem,
  MenuItemIndicator,
  MenuRadioGroup,
  MenuRadioItem,
  MenuSeparator,
  MenuSub,
  MenuSubContent,
  MenuSubTrigger,
  MenuTrigger,
} from "@ui-sdk/vue/menu"
import { ref } from "vue"

const action = ref("")
</script>

<template>
  <div data-slot="stack">
    <div data-slot="row">
      <Menu @action="(value: string) => (action = value)">
        <MenuTrigger>Document</MenuTrigger>
        <MenuContent>
          <MenuItem value="undo" shortcut="mod+z" disabled> Undo </MenuItem>
          <MenuItem value="redo" shortcut="mod+shift+z"> Redo </MenuItem>
          <MenuSeparator />
          <MenuCheckboxItem value="autosave" default-checked disabled>
            <MenuItemIndicator>
              <CheckIcon aria-hidden="true" />
            </MenuItemIndicator>
            Autosave
          </MenuCheckboxItem>
          <MenuSeparator />
          <MenuRadioGroup default-value="pdf">
            <MenuGroupLabel>Export as</MenuGroupLabel>
            <MenuRadioItem value="pdf">
              <MenuItemIndicator>
                <CheckIcon aria-hidden="true" />
              </MenuItemIndicator>
              PDF
            </MenuRadioItem>
            <MenuRadioItem value="docx" disabled>
              <MenuItemIndicator>
                <CheckIcon aria-hidden="true" />
              </MenuItemIndicator>
              Word
            </MenuRadioItem>
            <MenuRadioItem value="markdown">
              <MenuItemIndicator>
                <CheckIcon aria-hidden="true" />
              </MenuItemIndicator>
              Markdown
            </MenuRadioItem>
          </MenuRadioGroup>
          <MenuSeparator />
          <MenuSub>
            <MenuSubTrigger disabled>
              Move to
              <ChevronRightIcon aria-hidden="true" />
            </MenuSubTrigger>
            <MenuSubContent>
              <MenuItem>Archive</MenuItem>
            </MenuSubContent>
          </MenuSub>
        </MenuContent>
      </Menu>
      <Menu>
        <MenuTrigger disabled>Locked</MenuTrigger>
        <MenuContent>
          <MenuItem>Unlock</MenuItem>
        </MenuContent>
      </Menu>
    </div>
    <output data-slot="output">
      {{ action ? `Ran ${action}` : "Disabled items can be focused but not chosen" }}
    </output>
  </div>
</template>
