<script setup lang="ts">
import {
  Autocomplete,
  AutocompleteContent,
  AutocompleteEmpty,
  AutocompleteInput,
  AutocompleteItem,
  AutocompleteItemIcon,
  AutocompleteItemText,
  AutocompleteLabel,
  AutocompleteList,
  Combobox,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
  ComboboxItemIcon,
  ComboboxItemText,
  ComboboxLabel,
  ComboboxList,
  ComboboxValueIcon,
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandItemIcon,
  CommandItemText,
  CommandList,
  Menu,
  MenuContent,
  MenuItem,
  MenuItemIcon,
  MenuTrigger,
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuLinkIcon,
  NavigationMenuList,
  Select,
  SelectContent,
  SelectItem,
  SelectItemIcon,
  SelectLabel,
  SelectTrigger,
  SelectValue,
  SelectValueIcon,
  Tabs,
  TabsList,
  TabsTab,
  TabsTabIcon,
  Toggle,
  ToggleGroup,
  ToggleIcon,
} from "@ui-sdk/vue"
import { iconsFixture as f, iconsOptions } from "tests/fixtures/item-icons.ts"
import { ref } from "vue"
import IconGlyph from "./IconGlyph.vue"

const action = ref("")
const { unnamed, select, combobox } = iconsOptions()
const hasIcon = (entry: { icon?: string; emoji?: string }) =>
  !!(entry.icon || entry.emoji)
</script>

<template>
  <div class="fixture icons-fixture">
    <button>Before</button>

    <Menu @action="(value) => (action = `menu:${value}`)">
      <MenuTrigger class="trigger">{{ f.menu.trigger }}</MenuTrigger>
      <MenuContent class="popup">
        <MenuItem
          v-for="item in f.menu.items"
          :key="item.value"
          :value="item.value"
        >
          <MenuItemIcon v-if="hasIcon(item)" :mirror="item.mirror"
            ><IconGlyph :entry="item"
          /></MenuItemIcon>
          {{ item.label }}
        </MenuItem>
        <MenuItem
          :value="f.menu.iconOnly.value"
          :aria-label="f.menu.iconOnly.label"
        >
          <MenuItemIcon><IconGlyph :entry="f.menu.iconOnly" /></MenuItemIcon>
        </MenuItem>
        <MenuItem v-if="unnamed" :value="f.unnamed.value">
          <MenuItemIcon><IconGlyph :entry="f.unnamed" /></MenuItemIcon>
        </MenuItem>
      </MenuContent>
    </Menu>

    <Select
      :placeholder="f.select.placeholder"
      :default-value="select"
      @value-change="(value) => (action = `select:${value}`)"
    >
      <SelectLabel class="label">{{ f.select.label }}</SelectLabel>
      <SelectTrigger class="trigger">
        <SelectValueIcon class="value-icon" />
        <SelectValue class="value" />
      </SelectTrigger>
      <SelectContent class="popup list-popup">
        <SelectItem
          v-for="item in f.select.items"
          :key="item.value"
          class="item"
          :value="item.value"
        >
          <SelectItemIcon v-if="hasIcon(item)"
            ><IconGlyph :entry="item"
          /></SelectItemIcon>
          {{ item.label }}
        </SelectItem>
      </SelectContent>
    </Select>

    <Combobox
      :default-value="combobox"
      @value-change="(value) => (action = `combobox:${value}`)"
    >
      <ComboboxLabel class="label">{{ f.combobox.label }}</ComboboxLabel>
      <ComboboxValueIcon class="value-icon" />
      <ComboboxInput class="input" />
      <ComboboxContent class="popup list-popup">
        <ComboboxList>
          <ComboboxItem
            v-for="item in f.combobox.items"
            :key="item.value"
            class="item"
            :value="item.value"
          >
            <ComboboxItemIcon v-if="hasIcon(item)"
              ><IconGlyph :entry="item"
            /></ComboboxItemIcon>
            <ComboboxItemText>{{ item.label }}</ComboboxItemText>
          </ComboboxItem>
        </ComboboxList>
      </ComboboxContent>
    </Combobox>

    <Autocomplete>
      <AutocompleteLabel class="label">{{
        f.autocomplete.label
      }}</AutocompleteLabel>
      <AutocompleteInput class="input" />
      <AutocompleteContent class="popup list-popup">
        <AutocompleteEmpty class="empty">No results</AutocompleteEmpty>
        <AutocompleteList>
          <AutocompleteItem
            v-for="item in f.autocomplete.items"
            :key="item.value"
            class="item"
            :value="item.label"
          >
            <AutocompleteItemIcon
              ><IconGlyph :entry="item"
            /></AutocompleteItemIcon>
            <AutocompleteItemText>{{ item.label }}</AutocompleteItemText>
          </AutocompleteItem>
        </AutocompleteList>
      </AutocompleteContent>
    </Autocomplete>

    <Command
      class="command"
      @action="
        (value) => {
          action = `command:${value}`
        }
      "
    >
      <CommandInput class="input" :aria-label="f.command.label" />
      <CommandEmpty class="empty">No results</CommandEmpty>
      <CommandList class="command-list">
        <CommandItem
          v-for="item in f.command.items"
          :key="item.value"
          class="item"
          :value="item.value"
        >
          <CommandItemIcon v-if="hasIcon(item)"
            ><IconGlyph :entry="item"
          /></CommandItemIcon>
          <CommandItemText>{{ item.label }}</CommandItemText>
        </CommandItem>
      </CommandList>
    </Command>

    <Tabs class="tabs">
      <TabsList class="tablist" :aria-label="f.tabs.label">
        <TabsTab
          v-for="tab in f.tabs.tabs"
          :key="tab.value"
          class="tab"
          :value="tab.value"
        >
          <TabsTabIcon><IconGlyph :entry="tab" /></TabsTabIcon>
          {{ tab.label }}
        </TabsTab>
        <TabsTab
          class="tab"
          :value="f.tabs.iconOnly.value"
          :aria-label="f.tabs.iconOnly.label"
        >
          <TabsTabIcon><IconGlyph :entry="f.tabs.iconOnly" /></TabsTabIcon>
        </TabsTab>
      </TabsList>
    </Tabs>

    <ToggleGroup :aria-label="f.toggles.label" class="toggle-group">
      <Toggle class="toggle" :value="f.toggles.bold.value">
        <ToggleIcon><IconGlyph :entry="f.toggles.bold" /></ToggleIcon>
        {{ f.toggles.bold.label }}
      </Toggle>
      <Toggle
        class="toggle"
        :value="f.toggles.iconOnly.value"
        :aria-label="f.toggles.iconOnly.label"
      >
        <ToggleIcon><IconGlyph :entry="f.toggles.iconOnly" /></ToggleIcon>
      </Toggle>
    </ToggleGroup>

    <NavigationMenu :aria-label="f.navigation.label" class="nav-menu">
      <NavigationMenuList class="nav-list">
        <NavigationMenuItem
          v-for="link in f.navigation.links"
          :key="link.value"
          :value="link.value"
        >
          <NavigationMenuLink :href="`#${link.value}`" class="nav-link">
            <NavigationMenuLinkIcon :mirror="link.mirror"
              ><IconGlyph :entry="link"
            /></NavigationMenuLinkIcon>
            {{ link.label }}
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>

    <button>After</button>
    <output role="status" aria-label="Last action">{{ action }}</output>
  </div>
</template>
