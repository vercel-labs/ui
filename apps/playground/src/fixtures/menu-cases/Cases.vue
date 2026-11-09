<script setup lang="ts">
import {
  Menu,
  MenuCheckboxItem,
  MenuContent,
  MenuGroupLabel,
  MenuItem,
  MenuRadioGroup,
  MenuRadioItem,
  MenuSeparator,
  MenuSub,
  MenuSubContent,
  MenuSubTrigger,
  MenuTrigger,
} from "@ui-sdk/vue"
import { ref } from "vue"

const action = ref("")
const selections = ref(0)
const align = ref("left")
const open = ref(false)
// Specs close the controlled menu from outside it.
;(window as unknown as { __closeControlled: () => void }).__closeControlled =
  () => (open.value = false)

function closeFromState(event: Event) {
  event.preventDefault()
  open.value = false
}

function keepOpen(event: Event) {
  event.preventDefault()
  selections.value++
}
</script>

<template>
  <div class="fixture">
    <button>Before</button>
    <Menu @action="(value: string) => (action = value)">
      <MenuTrigger>Edit</MenuTrigger>
      <MenuContent class="popup">
        <MenuItem class="item" value="pin" @select="keepOpen">Pin</MenuItem>
        <MenuItem class="item" value="zoom" :close-on-select="false"
          >Zoom in</MenuItem
        >
        <MenuItem class="item" value="erase" shortcut="mod+backspace"
          >Erase</MenuItem
        >
        <MenuItem class="item" value="window" shortcut="alt+n"
          >New window</MenuItem
        >
        <MenuSeparator class="separator" />
        <MenuCheckboxItem class="item" value="autosave" close-on-select
          >Autosave</MenuCheckboxItem
        >
        <MenuCheckboxItem class="item" value="pinned" checked
          >Pinned</MenuCheckboxItem
        >
        <MenuRadioGroup v-model:value="align">
          <MenuGroupLabel class="label">Align</MenuGroupLabel>
          <MenuRadioItem class="item" value="left">Left</MenuRadioItem>
          <MenuRadioItem class="item" value="right">Right</MenuRadioItem>
        </MenuRadioGroup>
        <MenuSub>
          <MenuSubTrigger class="item" disabled>Share</MenuSubTrigger>
          <MenuSubContent class="popup">
            <MenuItem class="item" value="email">Email</MenuItem>
          </MenuSubContent>
        </MenuSub>
        <MenuSub :loop="false">
          <MenuSubTrigger class="item">More</MenuSubTrigger>
          <MenuSubContent class="popup">
            <MenuItem class="item" value="first">First</MenuItem>
            <MenuItem class="item" value="last">Last</MenuItem>
          </MenuSubContent>
        </MenuSub>
      </MenuContent>
    </Menu>
    <Menu>
      <MenuTrigger>Offsets</MenuTrigger>
      <MenuContent
        class="popup"
        :side-offset="8"
        :align-offset="-4"
        :collision-padding="24"
      >
        <MenuItem class="item" value="one">One</MenuItem>
        <MenuItem class="item" value="two">Two</MenuItem>
      </MenuContent>
    </Menu>
    <Menu v-model:open="open">
      <MenuTrigger>Controlled</MenuTrigger>
      <MenuContent class="popup">
        <MenuItem class="item" value="done" @select="closeFromState"
          >Done</MenuItem
        >
        <MenuItem class="item" value="later">Later</MenuItem>
      </MenuContent>
    </Menu>
    <button @click="align = 'right'">Align right</button>
    <button>After</button>
    <output role="status" aria-label="Last action">{{ action }}</output>
    <output role="status" aria-label="Selections">{{ selections }}</output>
  </div>
</template>
