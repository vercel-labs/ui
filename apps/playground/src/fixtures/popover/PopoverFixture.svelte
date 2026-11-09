<script lang="ts">
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
  } from "@ui-sdk/svelte"
  import {
    popoverContentOptions,
    popoverFixture,
    popoverOptions,
    popoverParts,
  } from "tests/fixtures/popover.ts"

  const controller = createPopoverController()
  const options = popoverOptions()
  const content = popoverContentOptions()
  const parts = popoverParts()
  let action = $state("")
  let triggerShown = $state(true)
</script>

<div class="fixture">
  <button>Before</button>
  <Popover {...options} {controller}>
    {#if triggerShown}
      <PopoverTrigger
        shortcut={parts.shortcut ? popoverFixture.shortcut.trigger : undefined}
      >
        {popoverFixture.trigger}
        {#if parts.shortcut}<PopoverShortcut />{/if}
      </PopoverTrigger>
    {/if}
    <PopoverContent class="popup" sideOffset={8} {...content}>
      <PopoverArrow class="arrow" />
      {#if parts.title}<PopoverTitle class="title"
          >{popoverFixture.title}</PopoverTitle
        >{/if}
      <PopoverDescription class="description"
        >{popoverFixture.description}</PopoverDescription
      >
      <label class="field">
        {popoverFixture.field}
        <input value={popoverFixture.defaultValue} />
      </label>
      <div class="actions">
        <button onclick={() => (action = "save")}>
          {popoverFixture.action}
          {#if parts.shortcut}<PopoverShortcut
              shortcut={popoverFixture.shortcut.save}
            />{/if}
        </button>
        <PopoverClose>{popoverFixture.close}</PopoverClose>
        {#if parts.removable}
          <button onclick={() => (triggerShown = false)}
            >{popoverFixture.remove}</button
          >
        {/if}
      </div>
      {#if parts.menu}
        <Menu
          container={options.container}
          onAction={(value) => (action = value)}
        >
          <MenuTrigger>{popoverFixture.menu.trigger}</MenuTrigger>
          <MenuContent class="popup">
            {#each popoverFixture.menu.items as item (item.value)}
              <MenuItem value={item.value} class="item">{item.label}</MenuItem>
            {/each}
          </MenuContent>
        </Menu>
      {/if}
      {#if parts.nested}
        <Popover>
          <PopoverTrigger>{popoverFixture.nested.trigger}</PopoverTrigger>
          <PopoverContent class="popup">
            <PopoverTitle class="title"
              >{popoverFixture.nested.title}</PopoverTitle
            >
            <button onclick={() => (action = "archive")}
              >{popoverFixture.nested.action}</button
            >
          </PopoverContent>
        </Popover>
      {/if}
    </PopoverContent>
  </Popover>
  <button>After</button>
  <output role="status" aria-label="Last action">{action}</output>
  <button onclick={() => controller.open()}>Open with controller</button>
  {#if parts.shortcut}
    <PopoverTrigger {controller} shortcut={popoverFixture.shortcut.remote.keys}>
      {popoverFixture.shortcut.remote.trigger}
      <PopoverShortcut />
    </PopoverTrigger>
  {/if}
</div>
