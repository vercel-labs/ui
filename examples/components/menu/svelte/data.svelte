<script lang="ts">
  import { CheckIcon, ChevronRightIcon, CircleIcon } from "@lucide/svelte"
  import {
    Menu,
    MenuCheckboxItem,
    MenuContent,
    MenuGroup,
    MenuGroupLabel,
    MenuItem,
    MenuItemIndicator,
    MenuRadioGroup,
    MenuRadioItem,
    MenuSeparator,
    MenuSub,
    MenuSubContent,
    MenuSubTrigger,
    MenuTrigger,
    type MenuData,
    type MenuDataItem,
  } from "@ui-sdk/svelte/menu"

  const fileMenu: MenuData = [
    { value: "quick-open", label: "Quick open…", shortcut: "mod+p" },
    { value: "open", label: "Open…", shortcut: "mod+o" },
    { value: "save", label: "Save", shortcut: "mod+s", disabled: true },
    { type: "separator" },
    {
      type: "group",
      label: "Show",
      items: [
        { type: "checkbox", value: "toolbar", label: "Toolbar", defaultChecked: true },
        { type: "checkbox", value: "status", label: "Status bar", closeOnSelect: true },
      ],
    },
    {
      type: "radio-group",
      name: "sort",
      label: "Sort by",
      defaultValue: "name",
      items: [
        { value: "name", label: "Name" },
        { value: "date", label: "Date modified" },
        { value: "size", label: "Size", disabled: true },
      ],
    },
    { type: "separator" },
    {
      type: "submenu",
      label: "Share",
      items: [
        { value: "email", label: "Email" },
        { value: "link", label: "Copy link", closeOnSelect: false },
      ],
    },
    { type: "submenu", label: "Move to", disabled: true, items: [{ value: "archive", label: "Archive" }] },
    { type: "separator" },
    { value: "delete", label: "Delete", destructive: true },
  ]

  let status = $state("")
</script>

<div data-slot="stack">
  {#snippet entries(items: MenuData)}
    {#each items as entry}
      {@const item: MenuDataItem = typeof entry === "string" ? { value: entry, label: entry } : entry}
      {#if item.type === "separator"}
        <MenuSeparator />
      {:else if item.type === "group"}
        <MenuGroup>
          {#if item.label}
            <MenuGroupLabel>{item.label}</MenuGroupLabel>
          {/if}
          {@render entries(item.items)}
        </MenuGroup>
      {:else if item.type === "checkbox"}
        <MenuCheckboxItem
          value={item.value}
          disabled={item.disabled}
          checked={item.checked}
          defaultChecked={item.defaultChecked}
          closeOnSelect={item.closeOnSelect}
        >
          <MenuItemIndicator>
            <CheckIcon aria-hidden="true" />
          </MenuItemIndicator>
          {item.label}
        </MenuCheckboxItem>
      {:else if item.type === "radio-group"}
        <MenuRadioGroup name={item.name} value={item.value} defaultValue={item.defaultValue}>
          {#if item.label}
            <MenuGroupLabel>{item.label}</MenuGroupLabel>
          {/if}
          {#each item.items as radio (radio.value)}
            <MenuRadioItem value={radio.value} disabled={radio.disabled}>
              <MenuItemIndicator>
                <CircleIcon aria-hidden="true" />
              </MenuItemIndicator>
              {radio.label}
            </MenuRadioItem>
          {/each}
        </MenuRadioGroup>
      {:else if item.type === "submenu"}
        <MenuSub>
          <MenuSubTrigger disabled={item.disabled}>
            {item.label}
            <ChevronRightIcon aria-hidden="true" />
          </MenuSubTrigger>
          <MenuSubContent>
            {@render entries(item.items)}
          </MenuSubContent>
        </MenuSub>
      {:else}
        <MenuItem
          value={item.value}
          disabled={item.disabled}
          shortcut={item.shortcut}
          closeOnSelect={item.closeOnSelect}
          destructive={item.destructive}
        >
          {item.label}
        </MenuItem>
      {/if}
    {/each}
  {/snippet}

  <Menu
    items={fileMenu}
    shortcuts
    onAction={(value: string) => (status = `Ran ${value}`)}
    onCheckedChange={(checked, details) => (status = `${details.value} ${checked ? "on" : "off"}`)}
    onValueChange={(value, details) => (status = `${details.group}: ${value}`)}
  >
    <MenuTrigger>File</MenuTrigger>
    <MenuContent>
      {@render entries(fileMenu)}
    </MenuContent>
  </Menu>
  <output data-slot="output">{status || "Try the menu, or press its shortcuts while it's closed"}</output>
</div>
