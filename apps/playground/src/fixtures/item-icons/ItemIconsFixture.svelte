<script lang="ts">
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
  } from "@ui-sdk/svelte"
  import { iconsFixture as f, iconsOptions } from "tests/fixtures/item-icons.ts"
  import IconGlyph from "./IconGlyph.svelte"

  let action = $state("")
  const { unnamed, select, combobox } = iconsOptions()
  const hasIcon = (entry: { icon?: string; emoji?: string }) =>
    !!(entry.icon || entry.emoji)
</script>

<div class="fixture icons-fixture">
  <button>Before</button>

  <Menu onAction={(value) => (action = `menu:${value}`)}>
    <MenuTrigger class="trigger">{f.menu.trigger}</MenuTrigger>
    <MenuContent class="popup">
      {#each f.menu.items as item (item.value)}
        <MenuItem value={item.value}>
          {#if hasIcon(item)}<MenuItemIcon mirror={item.mirror}
              ><IconGlyph entry={item} /></MenuItemIcon
            >{/if}
          {item.label}
        </MenuItem>
      {/each}
      <MenuItem
        value={f.menu.iconOnly.value}
        aria-label={f.menu.iconOnly.label}
      >
        <MenuItemIcon><IconGlyph entry={f.menu.iconOnly} /></MenuItemIcon>
      </MenuItem>
      {#if unnamed}
        <MenuItem value={f.unnamed.value}>
          <MenuItemIcon><IconGlyph entry={f.unnamed} /></MenuItemIcon>
        </MenuItem>
      {/if}
    </MenuContent>
  </Menu>

  <Select
    placeholder={f.select.placeholder}
    defaultValue={select}
    onValueChange={(value) => (action = `select:${value}`)}
  >
    <SelectLabel class="label">{f.select.label}</SelectLabel>
    <SelectTrigger class="trigger">
      <SelectValueIcon class="value-icon" />
      <SelectValue class="value" />
    </SelectTrigger>
    <SelectContent class="popup list-popup">
      {#each f.select.items as item (item.value)}
        <SelectItem class="item" value={item.value}>
          {#if hasIcon(item)}<SelectItemIcon
              ><IconGlyph entry={item} /></SelectItemIcon
            >{/if}
          {item.label}
        </SelectItem>
      {/each}
    </SelectContent>
  </Select>

  <Combobox
    defaultValue={combobox}
    onValueChange={(value) => (action = `combobox:${value}`)}
  >
    <ComboboxLabel class="label">{f.combobox.label}</ComboboxLabel>
    <ComboboxValueIcon class="value-icon" />
    <ComboboxInput class="input" />
    <ComboboxContent class="popup list-popup">
      <ComboboxList>
        {#each f.combobox.items as item (item.value)}
          <ComboboxItem class="item" value={item.value}>
            {#if hasIcon(item)}<ComboboxItemIcon
                ><IconGlyph entry={item} /></ComboboxItemIcon
              >{/if}
            <ComboboxItemText>{item.label}</ComboboxItemText>
          </ComboboxItem>
        {/each}
      </ComboboxList>
    </ComboboxContent>
  </Combobox>

  <Autocomplete>
    <AutocompleteLabel class="label">{f.autocomplete.label}</AutocompleteLabel>
    <AutocompleteInput class="input" />
    <AutocompleteContent class="popup list-popup">
      <AutocompleteEmpty class="empty">No results</AutocompleteEmpty>
      <AutocompleteList>
        {#each f.autocomplete.items as item (item.value)}
          <AutocompleteItem class="item" value={item.label}>
            <AutocompleteItemIcon
              ><IconGlyph entry={item} /></AutocompleteItemIcon
            >
            <AutocompleteItemText>{item.label}</AutocompleteItemText>
          </AutocompleteItem>
        {/each}
      </AutocompleteList>
    </AutocompleteContent>
  </Autocomplete>

  <Command
    class="command"
    onAction={(value) => {
      action = `command:${value}`
    }}
  >
    <CommandInput class="input" aria-label={f.command.label} />
    <CommandEmpty class="empty">No results</CommandEmpty>
    <CommandList class="command-list">
      {#each f.command.items as item (item.value)}
        <CommandItem class="item" value={item.value}>
          {#if hasIcon(item)}<CommandItemIcon
              ><IconGlyph entry={item} /></CommandItemIcon
            >{/if}
          <CommandItemText>{item.label}</CommandItemText>
        </CommandItem>
      {/each}
    </CommandList>
  </Command>

  <Tabs class="tabs">
    <TabsList class="tablist" aria-label={f.tabs.label}>
      {#each f.tabs.tabs as tab (tab.value)}
        <TabsTab class="tab" value={tab.value}>
          <TabsTabIcon><IconGlyph entry={tab} /></TabsTabIcon>
          {tab.label}
        </TabsTab>
      {/each}
      <TabsTab
        class="tab"
        value={f.tabs.iconOnly.value}
        aria-label={f.tabs.iconOnly.label}
      >
        <TabsTabIcon><IconGlyph entry={f.tabs.iconOnly} /></TabsTabIcon>
      </TabsTab>
    </TabsList>
  </Tabs>

  <ToggleGroup aria-label={f.toggles.label} class="toggle-group">
    <Toggle class="toggle" value={f.toggles.bold.value}>
      <ToggleIcon><IconGlyph entry={f.toggles.bold} /></ToggleIcon>
      {f.toggles.bold.label}
    </Toggle>
    <Toggle
      class="toggle"
      value={f.toggles.iconOnly.value}
      aria-label={f.toggles.iconOnly.label}
    >
      <ToggleIcon><IconGlyph entry={f.toggles.iconOnly} /></ToggleIcon>
    </Toggle>
  </ToggleGroup>

  <NavigationMenu aria-label={f.navigation.label} class="nav-menu">
    <NavigationMenuList class="nav-list">
      {#each f.navigation.links as link (link.value)}
        <NavigationMenuItem value={link.value}>
          <NavigationMenuLink href={`#${link.value}`} class="nav-link">
            <NavigationMenuLinkIcon mirror={link.mirror}
              ><IconGlyph entry={link} /></NavigationMenuLinkIcon
            >
            {link.label}
          </NavigationMenuLink>
        </NavigationMenuItem>
      {/each}
    </NavigationMenuList>
  </NavigationMenu>

  <button>After</button>
  <output role="status" aria-label="Last action">{action}</output>
</div>
