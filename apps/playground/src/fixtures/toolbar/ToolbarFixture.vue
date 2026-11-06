<script setup lang="ts">
import {
  Menu,
  MenuContent,
  MenuItem,
  MenuTrigger,
  NumberInput,
  NumberInputControl,
  Toggle,
  ToggleGroup,
  Toolbar,
  ToolbarButton,
  ToolbarGroup,
  ToolbarInput,
  ToolbarLink,
  ToolbarSeparator,
  createToolbarController,
} from "@ui-sdk/vue"
import { toolbarFixture as f, toolbarLocked, toolbarOptions } from "tests/fixtures/toolbar.ts"
import { ref, type SetupContext } from "vue"

const action = ref("")
const controller = createToolbarController()
const options = toolbarOptions()
// For ?locked: disabled groups around Text style, Spellcheck, History and Help until Unlock.
const lockable = toolbarLocked()
const locked = ref(lockable)
// Renders its children alone, where a locked fixture has a group.
const Plain = (_: unknown, { slots }: SetupContext) => slots.default?.()
const groups = [
  { ...f.style, multiple: true },
  { ...f.alignment, multiple: false },
]
</script>

<template>
  <div class="fixture">
    <button>Before</button>
    <Toolbar class="toolbar" :aria-label="f.label" :controller="controller" v-bind="options">
      <template v-for="(group, index) in groups" :key="group.label">
        <component
          :is="lockable && index === 0 ? ToolbarGroup : Plain"
          v-bind="lockable && index === 0 ? { 'aria-label': 'Locked style', disabled: locked } : {}"
        >
          <ToggleGroup
            class="toggle-group"
            :aria-label="group.label"
            :multiple="group.multiple"
            :default-value="group.defaultValue"
            @value-change="(value: string[]) => (action = `${group.label}: ${value.join(', ') || 'none'}`)"
          >
            <Toggle
              v-for="item in group.items"
              :key="item.value"
              class="toggle"
              :value="item.value"
              :disabled="(item as { disabled?: boolean }).disabled"
            >
              {{ item.label }}
            </Toggle>
          </ToggleGroup>
        </component>
        <ToolbarSeparator v-if="index < groups.length" />
      </template>
      <Menu @action="(value: string) => (action = `font: ${value}`)">
        <ToolbarButton>
          <template #render="{ props }">
            <MenuTrigger v-bind="props">{{ f.font.trigger }}</MenuTrigger>
          </template>
        </ToolbarButton>
        <MenuContent class="popup">
          <MenuItem v-for="item in f.font.items" :key="item" class="item" :value="item">{{ item }}</MenuItem>
        </MenuContent>
      </Menu>
      <NumberInput
        :default-value="f.size.defaultValue"
        @value-change="(value: number | null) => (action = `size: ${value}`)"
      >
        <ToolbarInput :aria-label="f.size.label">
          <template #render="{ props }">
            <NumberInputControl v-bind="props" />
          </template>
        </ToolbarInput>
      </NumberInput>
      <ToolbarInput :aria-label="f.comment.label" :value="f.comment.defaultValue" />
      <ToolbarGroup class="toolbar-group" :aria-label="f.history.label" :disabled="lockable && locked">
        <ToolbarButton
          v-for="item in f.history.items"
          :key="item.label"
          :disabled="(item as { disabled?: boolean }).disabled"
          @click="action = item.label.toLowerCase()"
        >
          {{ item.label }}
        </ToolbarButton>
      </ToolbarGroup>
      <component
        :is="lockable ? ToolbarGroup : Plain"
        v-bind="lockable ? { 'aria-label': 'Locked proofing', disabled: locked } : {}"
      >
        <Toggle
          class="toggle"
          @pressed-change="(pressed: boolean) => (action = `spellcheck: ${pressed ? 'on' : 'off'}`)"
        >
          {{ f.spellcheck.label }}
        </Toggle>
      </component>
      <component
        :is="lockable ? ToolbarGroup : Plain"
        v-bind="lockable ? { 'aria-label': 'Locked help', disabled: locked } : {}"
      >
        <ToolbarLink :href="f.help.href">{{ f.help.label }}</ToolbarLink>
      </component>
    </Toolbar>
    <button>After</button>
    <output role="status" aria-label="Last action">{{ action }}</output>
    <button @click="controller.focus()">Focus toolbar</button>
    <button @click="locked = false">Unlock</button>
  </div>
</template>
