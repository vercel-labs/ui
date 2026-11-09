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
} from "@ui-sdk/solid/autocomplete"
import {
  Combobox,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
  ComboboxItemIcon,
  ComboboxItemText,
  ComboboxLabel,
  ComboboxList,
  ComboboxValueIcon,
} from "@ui-sdk/solid/combobox"
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandItemIcon,
  CommandItemText,
  CommandList,
} from "@ui-sdk/solid/command"
import {
  Menu,
  MenuContent,
  MenuItem,
  MenuItemIcon,
  MenuTrigger,
} from "@ui-sdk/solid/menu"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuLinkIcon,
  NavigationMenuList,
} from "@ui-sdk/solid/navigation-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectItemIcon,
  SelectLabel,
  SelectTrigger,
  SelectValue,
  SelectValueIcon,
} from "@ui-sdk/solid/select"
import { Tabs, TabsList, TabsTab, TabsTabIcon } from "@ui-sdk/solid/tabs"
import { Toggle, ToggleGroup, ToggleIcon } from "@ui-sdk/solid/toggle"
import { render } from "@solidjs/web"
import { createSignal, For, Show } from "solid-js"
import {
  icons,
  iconsFixture as f,
  iconsOptions,
  type IconName,
} from "tests/fixtures/item-icons.ts"

function Svg(props: { name: IconName }) {
  return (
    <svg
      viewBox="0 0 16 16"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
    >
      <title>{icons[props.name].title}</title>
      <path d={icons[props.name].path} />
    </svg>
  )
}

// What an entry's icon part holds: its SVG or its emoji.
const glyph = (entry: { icon?: IconName; emoji?: string }) =>
  entry.icon ? <Svg name={entry.icon} /> : entry.emoji

const hasIcon = (entry: { icon?: IconName; emoji?: string }) =>
  !!(entry.icon || entry.emoji)

function Fixture() {
  const [action, setAction] = createSignal("")
  // Read here, not at module level: the server renders this module too.
  const { unnamed, select, combobox } = iconsOptions()
  return (
    <div class="fixture icons-fixture">
      <button>Before</button>

      <Menu onAction={(value) => setAction(`menu:${value}`)}>
        <MenuTrigger class="trigger">{f.menu.trigger}</MenuTrigger>
        <MenuContent class="popup">
          <For each={f.menu.items}>
            {(item) => (
              <MenuItem value={item.value}>
                <Show when={hasIcon(item)}>
                  <MenuItemIcon mirror={item.mirror}>
                    {glyph(item)}
                  </MenuItemIcon>
                </Show>
                {item.label}
              </MenuItem>
            )}
          </For>
          <MenuItem
            value={f.menu.iconOnly.value}
            aria-label={f.menu.iconOnly.label}
          >
            <MenuItemIcon>{glyph(f.menu.iconOnly)}</MenuItemIcon>
          </MenuItem>
          <Show when={unnamed}>
            <MenuItem value={f.unnamed.value}>
              <MenuItemIcon>
                <Svg name={f.unnamed.icon} />
              </MenuItemIcon>
            </MenuItem>
          </Show>
        </MenuContent>
      </Menu>

      <Select<string>
        placeholder={f.select.placeholder}
        defaultValue={select}
        onValueChange={(value) => setAction(`select:${value}`)}
      >
        <SelectLabel class="label">{f.select.label}</SelectLabel>
        <SelectTrigger class="trigger">
          <SelectValueIcon class="value-icon" />
          <SelectValue class="value" />
        </SelectTrigger>
        <SelectContent class="popup list-popup">
          <For each={f.select.items}>
            {(item) => (
              <SelectItem class="item" value={item.value}>
                <Show when={hasIcon(item)}>
                  <SelectItemIcon>{glyph(item)}</SelectItemIcon>
                </Show>
                {item.label}
              </SelectItem>
            )}
          </For>
        </SelectContent>
      </Select>

      <Combobox<string>
        defaultValue={combobox}
        onValueChange={(value) => setAction(`combobox:${value}`)}
      >
        <ComboboxLabel class="label">{f.combobox.label}</ComboboxLabel>
        <ComboboxValueIcon class="value-icon" />
        <ComboboxInput class="input" />
        <ComboboxContent class="popup list-popup">
          <ComboboxList>
            <For each={f.combobox.items}>
              {(item) => (
                <ComboboxItem class="item" value={item.value}>
                  <Show when={hasIcon(item)}>
                    <ComboboxItemIcon>{glyph(item)}</ComboboxItemIcon>
                  </Show>
                  <ComboboxItemText>{item.label}</ComboboxItemText>
                </ComboboxItem>
              )}
            </For>
          </ComboboxList>
        </ComboboxContent>
      </Combobox>

      <Autocomplete>
        <AutocompleteLabel class="label">
          {f.autocomplete.label}
        </AutocompleteLabel>
        <AutocompleteInput class="input" />
        <AutocompleteContent class="popup list-popup">
          <AutocompleteEmpty class="empty">No results</AutocompleteEmpty>
          <AutocompleteList>
            <For each={f.autocomplete.items}>
              {(item) => (
                <AutocompleteItem class="item" value={item.label}>
                  <AutocompleteItemIcon>{glyph(item)}</AutocompleteItemIcon>
                  <AutocompleteItemText>{item.label}</AutocompleteItemText>
                </AutocompleteItem>
              )}
            </For>
          </AutocompleteList>
        </AutocompleteContent>
      </Autocomplete>

      <Command
        class="command"
        onAction={(value) => {
          setAction(`command:${value}`)
        }}
      >
        <CommandInput class="input" aria-label={f.command.label} />
        <CommandEmpty class="empty">No results</CommandEmpty>
        <CommandList class="command-list">
          <For each={f.command.items}>
            {(item) => (
              <CommandItem class="item" value={item.value}>
                <Show when={hasIcon(item)}>
                  <CommandItemIcon>{glyph(item)}</CommandItemIcon>
                </Show>
                <CommandItemText>{item.label}</CommandItemText>
              </CommandItem>
            )}
          </For>
        </CommandList>
      </Command>

      <Tabs class="tabs">
        <TabsList class="tablist" aria-label={f.tabs.label}>
          <For each={f.tabs.tabs}>
            {(tab) => (
              <TabsTab class="tab" value={tab.value}>
                <TabsTabIcon>{glyph(tab)}</TabsTabIcon>
                {tab.label}
              </TabsTab>
            )}
          </For>
          <TabsTab
            class="tab"
            value={f.tabs.iconOnly.value}
            aria-label={f.tabs.iconOnly.label}
          >
            <TabsTabIcon>{glyph(f.tabs.iconOnly)}</TabsTabIcon>
          </TabsTab>
        </TabsList>
      </Tabs>

      <ToggleGroup aria-label={f.toggles.label} class="toggle-group">
        <Toggle class="toggle" value={f.toggles.bold.value}>
          <ToggleIcon>{glyph(f.toggles.bold)}</ToggleIcon>
          {f.toggles.bold.label}
        </Toggle>
        <Toggle
          class="toggle"
          value={f.toggles.iconOnly.value}
          aria-label={f.toggles.iconOnly.label}
        >
          <ToggleIcon>{glyph(f.toggles.iconOnly)}</ToggleIcon>
        </Toggle>
      </ToggleGroup>

      <NavigationMenu aria-label={f.navigation.label} class="nav-menu">
        <NavigationMenuList class="nav-list">
          <For each={f.navigation.links}>
            {(link) => (
              <NavigationMenuItem value={link.value}>
                <NavigationMenuLink href={`#${link.value}`} class="nav-link">
                  <NavigationMenuLinkIcon mirror={link.mirror}>
                    {glyph(link)}
                  </NavigationMenuLinkIcon>
                  {link.label}
                </NavigationMenuLink>
              </NavigationMenuItem>
            )}
          </For>
        </NavigationMenuList>
      </NavigationMenu>

      <button>After</button>
      <output role="status" aria-label="Last action">
        {action()}
      </output>
    </div>
  )
}

function mount(root: HTMLElement) {
  render(() => <Fixture />, root)
}

export { Fixture, mount }
