<script setup lang="ts">
import { ChevronRightIcon } from "@lucide/vue"
import {
  Menu,
  MenuContent,
  MenuItem,
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
    <Menu @action="(value: string) => (action = value)">
      <MenuTrigger>Edit</MenuTrigger>
      <MenuContent>
        <MenuItem value="undo" shortcut="mod+z">Undo</MenuItem>
        <MenuItem value="redo" shortcut="mod+shift+z">Redo</MenuItem>
        <MenuSeparator />
        <MenuSub>
          <MenuSubTrigger>
            Find
            <ChevronRightIcon aria-hidden="true" />
          </MenuSubTrigger>
          <MenuSubContent>
            <MenuItem value="find" shortcut="mod+f">Find…</MenuItem>
            <MenuItem value="find-next" shortcut="mod+g">Find next</MenuItem>
            <MenuItem value="find-previous" shortcut="mod+shift+g">Find previous</MenuItem>
          </MenuSubContent>
        </MenuSub>
        <MenuSub>
          <MenuSubTrigger>
            Transform
            <ChevronRightIcon aria-hidden="true" />
          </MenuSubTrigger>
          <MenuSubContent>
            <MenuSub>
              <MenuSubTrigger>
                Case
                <ChevronRightIcon aria-hidden="true" />
              </MenuSubTrigger>
              <MenuSubContent>
                <MenuItem value="uppercase">Uppercase</MenuItem>
                <MenuItem value="lowercase">Lowercase</MenuItem>
              </MenuSubContent>
            </MenuSub>
            <MenuItem value="trim">Trim whitespace</MenuItem>
          </MenuSubContent>
        </MenuSub>
      </MenuContent>
    </Menu>
    <output data-slot="output">{{ action ? `Ran ${action}` : "Pick an item" }}</output>
  </div>
</template>
