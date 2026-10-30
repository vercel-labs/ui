<script setup lang="ts">
import {
  Menu,
  MenuCheckboxItem,
  MenuContent,
  MenuItem,
  MenuRadioGroup,
  MenuRadioItem,
  MenuSeparator,
  MenuSub,
  MenuSubContent,
  MenuSubTrigger,
  MenuTrigger,
  Menubar,
  createMenubarController,
} from "@ui-sdk/vue"
import { menubarFixture as f, menubarOptions } from "tests/fixtures/menubar.ts"
import { onMounted, ref } from "vue"

const action = ref("")
const options = menubarOptions()
const run = (value: string) => (action.value = value)
const controller = createMenubarController()
// Specs drive the menubar through its controller. Only in the browser: the server has no window.
onMounted(() => Object.assign(window, { __menubar: controller }))
</script>

<template>
  <div class="fixture">
    <button>Before</button>
    <Menubar class="menubar" :aria-label="f.label" :controller="controller" v-bind="options">
      <Menu @action="run">
        <MenuTrigger>{{ f.file.trigger }}</MenuTrigger>
        <MenuContent class="popup">
          <MenuItem
            v-for="item in f.file.items"
            :key="item.value"
            class="item"
            :value="item.value"
            :shortcut="item.shortcut"
          >
            {{ item.label }}
          </MenuItem>
          <MenuSub>
            <MenuSubTrigger class="item">{{ f.file.share.trigger }}</MenuSubTrigger>
            <MenuSubContent class="popup">
              <MenuItem v-for="item in f.file.share.items" :key="item.value" class="item" :value="item.value">
                {{ item.label }}
              </MenuItem>
            </MenuSubContent>
          </MenuSub>
          <MenuSeparator class="separator" />
          <MenuItem class="item" :value="f.file.print.value">{{ f.file.print.label }}</MenuItem>
        </MenuContent>
      </Menu>
      <Menu @action="run">
        <MenuTrigger>{{ f.edit.trigger }}</MenuTrigger>
        <MenuContent class="popup">
          <MenuItem
            v-for="item in f.edit.items"
            :key="item.value"
            class="item"
            :value="item.value"
            :disabled="item.disabled"
          >
            {{ item.label }}
          </MenuItem>
        </MenuContent>
      </Menu>
      <Menu
        @checked-change="
          (checked: boolean, details: { value: string }) => run(`${details.value}: ${checked ? 'on' : 'off'}`)
        "
      >
        <MenuTrigger :shortcut="f.view.shortcut">{{ f.view.trigger }}</MenuTrigger>
        <MenuContent class="popup">
          <MenuCheckboxItem
            v-for="item in f.view.checkboxes"
            :key="item.value"
            class="item"
            :value="item.value"
            :default-checked="item.defaultChecked"
          >
            {{ item.label }}
          </MenuCheckboxItem>
        </MenuContent>
      </Menu>
      <Menu>
        <MenuTrigger>{{ f.profiles.trigger }}</MenuTrigger>
        <MenuContent class="popup">
          <MenuRadioGroup
            :default-value="f.profiles.defaultValue"
            @value-change="(value: string) => run(`profile: ${value}`)"
          >
            <MenuRadioItem
              v-for="item in f.profiles.items"
              :key="item.value"
              class="item"
              :value="item.value"
            >
              {{ item.label }}
            </MenuRadioItem>
          </MenuRadioGroup>
        </MenuContent>
      </Menu>
      <Menu @action="run">
        <MenuTrigger disabled>{{ f.help.trigger }}</MenuTrigger>
        <MenuContent class="popup">
          <MenuItem v-for="item in f.help.items" :key="item.value" class="item" :value="item.value">{{
            item.label
          }}</MenuItem>
        </MenuContent>
      </Menu>
    </Menubar>
    <button>After</button>
    <output role="status" aria-label="Last action">{{ action }}</output>
  </div>
</template>
