<script lang="ts">
  import { CheckIcon, ChevronRightIcon } from "@lucide/svelte"
  import {
    Menu,
    MenuCheckboxItem,
    MenuContent,
    MenuItem,
    MenuItemIndicator,
    MenuSeparator,
    MenuSub,
    MenuSubContent,
    MenuSubTrigger,
    MenuTrigger,
    type MenuData,
    type MenuDataItem,
  } from "@ui-sdk/svelte/menu"
  import { Menubar } from "@ui-sdk/svelte/menubar"

  const file: MenuData = [
    { value: "new", label: "New File", shortcut: "mod+alt+n" },
    { value: "open", label: "Open…" },
    { type: "separator" },
    { type: "submenu", label: "Share", items: [{ value: "email", label: "Email link" }] },
  ]
  const view: MenuData = [
    { type: "checkbox", value: "minimap", label: "Minimap", defaultChecked: true },
    { type: "checkbox", value: "wrap", label: "Word Wrap" },
  ]


  let last = $state("nothing yet")
</script>

{#snippet entries(items: MenuData)}
  {#each items as entry}
    {@const item: MenuDataItem = typeof entry === "string" ? { value: entry, label: entry } : entry}
    {#if item.type === "separator"}
      <MenuSeparator />
    {:else if item.type === "checkbox"}
      <MenuCheckboxItem value={item.value} defaultChecked={item.defaultChecked}>
        <MenuItemIndicator>
          <CheckIcon aria-hidden="true" />
        </MenuItemIndicator>
        {item.label}
      </MenuCheckboxItem>
    {:else if item.type === "submenu"}
      <MenuSub>
        <MenuSubTrigger>
          {item.label}
          <ChevronRightIcon aria-hidden="true" />
        </MenuSubTrigger>
        <MenuSubContent>
          {@render entries(item.items)}
        </MenuSubContent>
      </MenuSub>
    {:else if item.type === undefined || item.type === "item"}
      <MenuItem value={item.value} shortcut={item.shortcut}>{item.label}</MenuItem>
    {/if}
  {/each}
{/snippet}

<div data-slot="stack">
  <Menubar>
    <Menu items={file} onAction={(value) => (last = value)}>
      <MenuTrigger>File</MenuTrigger>
      <MenuContent>
        {@render entries(file)}
      </MenuContent>
    </Menu>
    <Menu items={view} onCheckedChange={(checked, details) => (last = `${details.value} ${checked ? "on" : "off"}`)}>
      <MenuTrigger>View</MenuTrigger>
      <MenuContent>
        {@render entries(view)}
      </MenuContent>
    </Menu>
  </Menubar>
  <output data-slot="output">Last: {last}</output>
</div>
