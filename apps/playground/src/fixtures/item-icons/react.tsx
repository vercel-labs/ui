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
} from "@ui-sdk/react/autocomplete"
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
} from "@ui-sdk/react/combobox"
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandItemIcon,
  CommandItemText,
  CommandList,
} from "@ui-sdk/react/command"
import {
  Menu,
  MenuContent,
  MenuItem,
  MenuItemIcon,
  MenuTrigger,
} from "@ui-sdk/react/menu"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuLinkIcon,
  NavigationMenuList,
} from "@ui-sdk/react/navigation-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectItemIcon,
  SelectLabel,
  SelectTrigger,
  SelectValue,
  SelectValueIcon,
} from "@ui-sdk/react/select"
import { Tabs, TabsList, TabsTab, TabsTabIcon } from "@ui-sdk/react/tabs"
import { Toggle, ToggleGroup, ToggleIcon } from "@ui-sdk/react/toggle"
import * as React from "react"
import { createRoot } from "react-dom/client"
import {
  icons,
  iconsFixture as f,
  iconsOptions,
  type IconName,
} from "tests/fixtures/item-icons.ts"

function Svg({ name }: { name: IconName }) {
  return (
    <svg
      viewBox="0 0 16 16"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
    >
      <title>{icons[name].title}</title>
      <path d={icons[name].path} />
    </svg>
  )
}

// What an entry's icon part holds: its SVG or its emoji.
const glyph = (entry: { icon?: IconName; emoji?: string }) =>
  entry.icon ? <Svg name={entry.icon} /> : entry.emoji

function Fixture() {
  const [action, setAction] = React.useState("")
  const { unnamed, select, combobox } = iconsOptions()
  return (
    <div className="fixture icons-fixture">
      <button>Before</button>

      <Menu onAction={(value) => setAction(`menu:${value}`)}>
        <MenuTrigger className="trigger">{f.menu.trigger}</MenuTrigger>
        <MenuContent className="popup">
          {f.menu.items.map((item) => (
            <MenuItem key={item.value} value={item.value}>
              {(item.icon || item.emoji) && (
                <MenuItemIcon mirror={item.mirror}>{glyph(item)}</MenuItemIcon>
              )}
              {item.label}
            </MenuItem>
          ))}
          <MenuItem
            value={f.menu.iconOnly.value}
            aria-label={f.menu.iconOnly.label}
          >
            <MenuItemIcon>{glyph(f.menu.iconOnly)}</MenuItemIcon>
          </MenuItem>
          {unnamed && (
            <MenuItem value={f.unnamed.value}>
              <MenuItemIcon>
                <Svg name={f.unnamed.icon} />
              </MenuItemIcon>
            </MenuItem>
          )}
        </MenuContent>
      </Menu>

      <Select<string>
        placeholder={f.select.placeholder}
        defaultValue={select}
        onValueChange={(value) => setAction(`select:${value}`)}
      >
        <SelectLabel className="label">{f.select.label}</SelectLabel>
        <SelectTrigger className="trigger">
          <SelectValueIcon className="value-icon" />
          <SelectValue className="value" />
        </SelectTrigger>
        <SelectContent className="popup list-popup">
          {f.select.items.map((item) => (
            <SelectItem key={item.value} className="item" value={item.value}>
              {(item.icon || item.emoji) && (
                <SelectItemIcon>{glyph(item)}</SelectItemIcon>
              )}
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Combobox<string>
        defaultValue={combobox}
        onValueChange={(value) => setAction(`combobox:${value}`)}
      >
        <ComboboxLabel className="label">{f.combobox.label}</ComboboxLabel>
        <ComboboxValueIcon className="value-icon" />
        <ComboboxInput className="input" />
        <ComboboxContent className="popup list-popup">
          <ComboboxList>
            {f.combobox.items.map((item) => (
              <ComboboxItem
                key={item.value}
                className="item"
                value={item.value}
              >
                {(item.icon || item.emoji) && (
                  <ComboboxItemIcon>{glyph(item)}</ComboboxItemIcon>
                )}
                <ComboboxItemText>{item.label}</ComboboxItemText>
              </ComboboxItem>
            ))}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>

      <Autocomplete>
        <AutocompleteLabel className="label">
          {f.autocomplete.label}
        </AutocompleteLabel>
        <AutocompleteInput className="input" />
        <AutocompleteContent className="popup list-popup">
          <AutocompleteEmpty className="empty">No results</AutocompleteEmpty>
          <AutocompleteList>
            {f.autocomplete.items.map((item) => (
              <AutocompleteItem
                key={item.value}
                className="item"
                value={item.label}
              >
                <AutocompleteItemIcon>{glyph(item)}</AutocompleteItemIcon>
                <AutocompleteItemText>{item.label}</AutocompleteItemText>
              </AutocompleteItem>
            ))}
          </AutocompleteList>
        </AutocompleteContent>
      </Autocomplete>

      <Command
        className="command"
        onAction={(value) => setAction(`command:${value}`)}
      >
        <CommandInput className="input" aria-label={f.command.label} />
        <CommandEmpty className="empty">No results</CommandEmpty>
        <CommandList className="command-list">
          {f.command.items.map((item) => (
            <CommandItem key={item.value} className="item" value={item.value}>
              {(item.icon || item.emoji) && (
                <CommandItemIcon>{glyph(item)}</CommandItemIcon>
              )}
              <CommandItemText>{item.label}</CommandItemText>
            </CommandItem>
          ))}
        </CommandList>
      </Command>

      <Tabs className="tabs">
        <TabsList className="tablist" aria-label={f.tabs.label}>
          {f.tabs.tabs.map((tab) => (
            <TabsTab key={tab.value} className="tab" value={tab.value}>
              <TabsTabIcon>{glyph(tab)}</TabsTabIcon>
              {tab.label}
            </TabsTab>
          ))}
          <TabsTab
            className="tab"
            value={f.tabs.iconOnly.value}
            aria-label={f.tabs.iconOnly.label}
          >
            <TabsTabIcon>{glyph(f.tabs.iconOnly)}</TabsTabIcon>
          </TabsTab>
        </TabsList>
      </Tabs>

      <ToggleGroup aria-label={f.toggles.label} className="toggle-group">
        <Toggle className="toggle" value={f.toggles.bold.value}>
          <ToggleIcon>{glyph(f.toggles.bold)}</ToggleIcon>
          {f.toggles.bold.label}
        </Toggle>
        <Toggle
          className="toggle"
          value={f.toggles.iconOnly.value}
          aria-label={f.toggles.iconOnly.label}
        >
          <ToggleIcon>{glyph(f.toggles.iconOnly)}</ToggleIcon>
        </Toggle>
      </ToggleGroup>

      <NavigationMenu aria-label={f.navigation.label} className="nav-menu">
        <NavigationMenuList className="nav-list">
          {f.navigation.links.map((link) => (
            <NavigationMenuItem key={link.value} value={link.value}>
              <NavigationMenuLink href={`#${link.value}`} className="nav-link">
                <NavigationMenuLinkIcon mirror={link.mirror}>
                  {glyph(link)}
                </NavigationMenuLinkIcon>
                {link.label}
              </NavigationMenuLink>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>

      <button>After</button>
      <output role="status" aria-label="Last action">
        {action}
      </output>
    </div>
  )
}

function mount(root: HTMLElement) {
  createRoot(root).render(<Fixture />)
}

export { Fixture, mount }
