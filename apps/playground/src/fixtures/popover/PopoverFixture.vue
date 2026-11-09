<script setup lang="ts">
import { createPopoverController } from "@ui-sdk/core/popover"
import {
  Menu,
  MenuContent,
  MenuItem,
  MenuTrigger,
  Popover,
  PopoverArrow,
  PopoverClose,
  PopoverContent,
  PopoverDescription,
  PopoverShortcut,
  PopoverTitle,
  PopoverTrigger,
} from "@ui-sdk/vue"
import {
  popoverContentOptions,
  popoverFixture,
  popoverOptions,
  popoverParts,
} from "tests/fixtures/popover.ts"
import { ref } from "vue"

const controller = createPopoverController()
const options = popoverOptions()
const content = popoverContentOptions()
const parts = popoverParts()
const action = ref("")
const triggerShown = ref(true)
</script>

<template>
  <div class="fixture">
    <button>Before</button>
    <Popover v-bind="options" :controller="controller">
      <PopoverTrigger
        v-if="triggerShown"
        :shortcut="parts.shortcut ? popoverFixture.shortcut.trigger : undefined"
      >
        {{ popoverFixture.trigger }}
        <PopoverShortcut v-if="parts.shortcut" />
      </PopoverTrigger>
      <PopoverContent class="popup" :side-offset="8" v-bind="content">
        <PopoverArrow class="arrow" />
        <PopoverTitle v-if="parts.title" class="title">{{
          popoverFixture.title
        }}</PopoverTitle>
        <PopoverDescription class="description">{{
          popoverFixture.description
        }}</PopoverDescription>
        <label class="field">
          {{ popoverFixture.field }}
          <input :value="popoverFixture.defaultValue" />
        </label>
        <div class="actions">
          <button @click="action = 'save'">
            {{ popoverFixture.action }}
            <PopoverShortcut
              v-if="parts.shortcut"
              :shortcut="popoverFixture.shortcut.save"
            />
          </button>
          <PopoverClose>{{ popoverFixture.close }}</PopoverClose>
          <button v-if="parts.removable" @click="triggerShown = false">
            {{ popoverFixture.remove }}
          </button>
        </div>
        <Menu
          v-if="parts.menu"
          :container="options.container"
          @action="(value: string) => (action = value)"
        >
          <MenuTrigger>{{ popoverFixture.menu.trigger }}</MenuTrigger>
          <MenuContent class="popup">
            <MenuItem
              v-for="item in popoverFixture.menu.items"
              :key="item.value"
              :value="item.value"
              class="item"
            >
              {{ item.label }}
            </MenuItem>
          </MenuContent>
        </Menu>
        <Popover v-if="parts.nested">
          <PopoverTrigger>{{ popoverFixture.nested.trigger }}</PopoverTrigger>
          <PopoverContent class="popup">
            <PopoverTitle class="title">{{
              popoverFixture.nested.title
            }}</PopoverTitle>
            <button @click="action = 'archive'">
              {{ popoverFixture.nested.action }}
            </button>
          </PopoverContent>
        </Popover>
      </PopoverContent>
    </Popover>
    <button>After</button>
    <output role="status" aria-label="Last action">{{ action }}</output>
    <button @click="controller.open()">Open with controller</button>
    <PopoverTrigger
      v-if="parts.shortcut"
      :controller="controller"
      :shortcut="popoverFixture.shortcut.remote.keys"
    >
      {{ popoverFixture.shortcut.remote.trigger }}
      <PopoverShortcut />
    </PopoverTrigger>
  </div>
</template>
