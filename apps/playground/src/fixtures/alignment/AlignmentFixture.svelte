<script lang="ts">
  import type { MenuDataItem } from "@ui-sdk/core/menu"
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
  } from "@ui-sdk/svelte"
  import {
    alignmentFixture,
    alignmentOptions,
  } from "tests/fixtures/alignment.ts"

  const rowMenu = createMenuController<string>()
  const details = createPopoverController<string>()
  const sections = createTabsController()
  const { keepMounted } = alignmentOptions()

  let action = $state("")
  let result = $state("")
  let complete = $state("")
  let change = $state("")
  let tabChanges = $state(0)

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
      result = `${closed.reason}:${closed.returnValue ?? ""}`
    })
  }

  function onSelect(value: string) {
    if (value === "details") {
      showDetails(String(rowMenu.getPayload()))
    }
  }
</script>

<div class="fixture">
  <button>Before</button>

  <ul class="rows">
    {#each alignmentFixture.rows as row (row)}
      <li>
        Row {row}
        <MenuTrigger
          controller={rowMenu}
          payload={row}
          aria-label={`Actions for ${row}`}>…</MenuTrigger
        >
      </li>
    {/each}
  </ul>
  <Menu
    controller={rowMenu}
    onAction={(value) => (action = `${value}:${rowMenu.getPayload()}`)}
    onOpenChangeComplete={(open) => (complete = open ? "open" : "closed")}
  >
    <MenuContent class="popup" {keepMounted}>
      {#snippet children(state)}
        <div class="payload">Row {state.payload}</div>
        {#each alignmentFixture.rowActions as item (item.value)}
          <MenuItem
            class="item"
            value={item.value}
            onSelect={() => onSelect(item.value)}
          >
            {item.label}
          </MenuItem>
        {/each}
      {/snippet}
    </MenuContent>
  </Menu>

  <Popover controller={details} modal="trap-focus">
    <PopoverContent class="popup">
      {#snippet children(state)}
        <form method="dialog">
          <PopoverTitle class="title">Details</PopoverTitle>
          <p class="payload">Details for {state.payload}</p>
          <button value="save">Save</button>
          <button value="cancel">Cancel</button>
        </form>
      {/snippet}
    </PopoverContent>
  </Popover>
  <button onclick={() => showDetails("button")}>Show details</button>

  <Menu onAction={(value) => (action = value)}>
    <MenuContextTrigger class="canvas">Canvas</MenuContextTrigger>
    <MenuContent class="popup">
      {#each alignmentFixture.canvasActions as item (item.value)}
        <MenuItem class="item" value={item.value}>{item.label}</MenuItem>
      {/each}
    </MenuContent>
  </Menu>

  <Menu
    items={dataItems}
    onCheckedChange={(checked, details) =>
      (change = `checked:${details.value}:${checked}`)}
    onValueChange={(value, details) =>
      (change = `value:${details.group}:${value}`)}
  >
    <MenuTrigger>Data</MenuTrigger>
    <!-- The data's items, rendered with the fixture's classes. -->
    <MenuContent class="popup">
      {#each dataItems as entry, index (index)}
        {#if entry.type === "checkbox"}
          <MenuCheckboxItem class="item" value={entry.value}>
            <MenuItemIndicator class="indicator">✓</MenuItemIndicator>
            {entry.label}
          </MenuCheckboxItem>
        {:else if entry.type === "radio-group"}
          <MenuRadioGroup name={entry.name}>
            {#each entry.items as radio (radio.value)}
              <MenuRadioItem class="item" value={radio.value}>
                <MenuItemIndicator class="indicator">•</MenuItemIndicator>
                {radio.label}
              </MenuRadioItem>
            {/each}
          </MenuRadioGroup>
        {/if}
      {/each}
    </MenuContent>
  </Menu>

  <Menu>
    <MenuTrigger>View</MenuTrigger>
    <MenuContent class="popup">
      {#each ["ruler", "guides"] as value (value)}
        <MenuCheckboxItem class="item" {value}>
          <MenuItemIndicator class="indicator">✓</MenuItemIndicator>
          {value === "ruler" ? "Ruler" : "Guides"}
        </MenuCheckboxItem>
      {/each}
    </MenuContent>
  </Menu>

  <Tabs
    class="tabs"
    controller={sections}
    hiddenUntilFound
    onValueChange={() => tabChanges++}
  >
    <TabsList class="tablist scrolling" aria-label="Sections">
      {#each alignmentFixture.sections as section (section)}
        <TabsTab class="tab" value={section.toLowerCase()}>{section}</TabsTab>
      {/each}
    </TabsList>
    {#each alignmentFixture.sections as section (section)}
      <TabsPanel class="panel" value={section.toLowerCase()}
        >The {section} section</TabsPanel
      >
    {/each}
  </Tabs>
  <button onclick={() => sections.select("hotel")}>Show the last section</button
  >

  <button>After</button>
  <output role="status" aria-label="Last action">{action}</output>
  <output aria-label="Last result">{result}</output>
  <output aria-label="Last complete">{complete}</output>
  <output aria-label="Last change">{change}</output>
  <output aria-label="Tab changes">{tabChanges}</output>
</div>
