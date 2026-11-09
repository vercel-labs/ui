<script setup lang="ts">
import {
  createMenuController,
  createPopoverController,
  createTabsController,
  Menu,
  MenuCheckboxItem,
  MenuContent,
  MenuContextTrigger,
  MenuItem,
  MenuItemIndicator,
  MenuRadioGroup,
  MenuRadioItem,
  MenuTrigger,
  Popover,
  PopoverContent,
  PopoverTitle,
  Tabs,
  TabsList,
  TabsPanel,
  TabsTab,
} from "@ui-sdk/vue"
import type { MenuDataItem } from "@ui-sdk/core/menu"
import { alignmentFixture, alignmentOptions } from "tests/fixtures/alignment.ts"
import { ref } from "vue"

const rowMenu = createMenuController<string>()
const details = createPopoverController<string>()
const sections = createTabsController()
const { keepMounted } = alignmentOptions()

const action = ref("")
const result = ref("")
const complete = ref("")
const change = ref("")
const tabChanges = ref(0)

const dataItems: MenuDataItem[] = [
  { type: "checkbox", value: "grid", label: "Grid" },
  {
    type: "radio-group",
    name: "sort",
    items: [
      { value: "name", label: "Name" },
      { value: "date", label: "Date" },
    ],
  },
]

function showDetails(payload: string) {
  details.open({ payload }).then((closed) => {
    result.value = `${closed.reason}:${closed.returnValue ?? ""}`
  })
}

function onSelect(value: string) {
  if (value === "details") {
    showDetails(String(rowMenu.getPayload()))
  }
}
</script>

<template>
  <div class="fixture">
    <button>Before</button>

    <ul class="rows">
      <li v-for="row in alignmentFixture.rows" :key="row">
        Row {{ row }}
        <MenuTrigger
          :controller="rowMenu"
          :payload="row"
          :aria-label="`Actions for ${row}`"
          >…</MenuTrigger
        >
      </li>
    </ul>
    <Menu
      :controller="rowMenu"
      @action="(value) => (action = `${value}:${rowMenu.getPayload()}`)"
      @open-change-complete="(open) => (complete = open ? 'open' : 'closed')"
    >
      <MenuContent v-slot="{ state }" class="popup" :keep-mounted="keepMounted">
        <div class="payload">Row {{ state.payload }}</div>
        <MenuItem
          v-for="item in alignmentFixture.rowActions"
          :key="item.value"
          class="item"
          :value="item.value"
          @select="onSelect(item.value)"
        >
          {{ item.label }}
        </MenuItem>
      </MenuContent>
    </Menu>

    <Popover :controller="details" modal="trap-focus">
      <PopoverContent v-slot="{ state }" class="popup">
        <form method="dialog">
          <PopoverTitle class="title">Details</PopoverTitle>
          <p class="payload">Details for {{ state.payload }}</p>
          <button value="save">Save</button>
          <button value="cancel">Cancel</button>
        </form>
      </PopoverContent>
    </Popover>
    <button @click="showDetails('button')">Show details</button>

    <Menu @action="(value) => (action = value)">
      <MenuContextTrigger class="canvas">Canvas</MenuContextTrigger>
      <MenuContent class="popup">
        <MenuItem
          v-for="item in alignmentFixture.canvasActions"
          :key="item.value"
          class="item"
          :value="item.value"
        >
          {{ item.label }}
        </MenuItem>
      </MenuContent>
    </Menu>

    <Menu
      :items="dataItems"
      @checked-change="
        (checked, details) => (change = `checked:${details.value}:${checked}`)
      "
      @value-change="
        (value, details) => (change = `value:${details.group}:${value}`)
      "
    >
      <MenuTrigger>Data</MenuTrigger>
      <!-- The data's items, rendered with the fixture's classes. -->
      <MenuContent class="popup">
        <template v-for="(entry, index) in dataItems" :key="index">
          <MenuCheckboxItem
            v-if="entry.type === 'checkbox'"
            class="item"
            :value="entry.value"
          >
            <MenuItemIndicator class="indicator">✓</MenuItemIndicator>
            {{ entry.label }}
          </MenuCheckboxItem>
          <MenuRadioGroup
            v-else-if="entry.type === 'radio-group'"
            :name="entry.name"
          >
            <MenuRadioItem
              v-for="radio in entry.items"
              :key="radio.value"
              class="item"
              :value="radio.value"
            >
              <MenuItemIndicator class="indicator">•</MenuItemIndicator>
              {{ radio.label }}
            </MenuRadioItem>
          </MenuRadioGroup>
        </template>
      </MenuContent>
    </Menu>

    <Menu>
      <MenuTrigger>View</MenuTrigger>
      <MenuContent class="popup">
        <MenuCheckboxItem
          v-for="value in ['ruler', 'guides']"
          :key="value"
          class="item"
          :value="value"
        >
          <MenuItemIndicator class="indicator">✓</MenuItemIndicator>
          {{ value === "ruler" ? "Ruler" : "Guides" }}
        </MenuCheckboxItem>
      </MenuContent>
    </Menu>

    <Tabs
      class="tabs"
      :controller="sections"
      hidden-until-found
      @value-change="tabChanges++"
    >
      <TabsList class="tablist scrolling" aria-label="Sections">
        <TabsTab
          v-for="section in alignmentFixture.sections"
          :key="section"
          class="tab"
          :value="section.toLowerCase()"
        >
          {{ section }}
        </TabsTab>
      </TabsList>
      <TabsPanel
        v-for="section in alignmentFixture.sections"
        :key="section"
        class="panel"
        :value="section.toLowerCase()"
      >
        The {{ section }} section
      </TabsPanel>
    </Tabs>
    <button @click="sections.select('hotel')">Show the last section</button>

    <button>After</button>
    <output role="status" aria-label="Last action">{{ action }}</output>
    <output aria-label="Last result">{{ result }}</output>
    <output aria-label="Last complete">{{ complete }}</output>
    <output aria-label="Last change">{{ change }}</output>
    <output aria-label="Tab changes">{{ tabChanges }}</output>
  </div>
</template>
