<script lang="ts">
  import type { ChangeDetails } from "@ui-sdk/core"
  import {
    createPopoverController,
    Dialog,
    DialogContent,
    DialogTrigger,
    Drawer,
    DrawerContent,
    DrawerTrigger,
    Menu,
    MenuContent,
    MenuGroup,
    MenuGroupLabel,
    MenuItem,
    MenuTrigger,
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "@ui-sdk/svelte"
  import {
    contentFor,
    describeChange,
    payloadOf,
    popupPayloadsFixture as fixture,
  } from "tests/fixtures/popup-payloads.ts"

  const people = createPopoverController<string>()
  let lastOpen = $state("")
  let lastPayload = $state("")

  function opened(name: string, open: boolean, { event }: ChangeDetails) {
    if (open) {
      lastOpen = describeChange(name, "open", event)
    }
  }

  function payloadChanged(
    name: string,
    payload: unknown,
    { event }: ChangeDetails
  ) {
    lastPayload = describeChange(name, `payload ${payload}`, event)
  }
</script>

<div class="fixture">
  <button>Before</button>
  <Menu
    onOpenChange={(open, details) => opened("menu", open, details)}
    onPayloadChange={(payload, details) =>
      payloadChanged("menu", payload, details)}
  >
    {#each fixture.menu.triggers as label (label)}
      <MenuTrigger payload={payloadOf(label)}>{label}</MenuTrigger>
    {/each}
    <MenuContent class="popup">
      {#snippet children(state)}
        <MenuGroup>
          <MenuGroupLabel>{contentFor(state.payload)}</MenuGroupLabel>
          <MenuItem class="item" value="open">{fixture.menu.item}</MenuItem>
        </MenuGroup>
      {/snippet}
    </MenuContent>
  </Menu>
  <Popover
    controller={people}
    onOpenChange={(open, details) => opened("popover", open, details)}
    onPayloadChange={(payload, details) =>
      payloadChanged("popover", payload, details)}
  >
    {#each fixture.popover.triggers as label (label)}
      <PopoverTrigger payload={payloadOf(label)}>{label}</PopoverTrigger>
    {/each}
    <PopoverContent class="popup">
      {#snippet children(state)}
        {contentFor(state.payload)}
        <button
          onclick={() => people.open({ payload: fixture.popover.show.payload })}
        >
          {fixture.popover.show.label}
        </button>
      {/snippet}
    </PopoverContent>
  </Popover>
  <Dialog
    modal={false}
    onOpenChange={(open, details) => opened("dialog", open, details)}
    onPayloadChange={(payload, details) =>
      payloadChanged("dialog", payload, details)}
  >
    {#each fixture.dialog.triggers as label (label)}
      <DialogTrigger payload={payloadOf(label)}>{label}</DialogTrigger>
    {/each}
    <DialogContent class="dialog">
      {#snippet children(state)}{contentFor(state.payload)}{/snippet}
    </DialogContent>
  </Dialog>
  <Drawer
    modal={false}
    onOpenChange={(open, details) => opened("drawer", open, details)}
    onPayloadChange={(payload, details) =>
      payloadChanged("drawer", payload, details)}
  >
    {#each fixture.drawer.triggers as label (label)}
      <DrawerTrigger payload={payloadOf(label)}>{label}</DrawerTrigger>
    {/each}
    <DrawerContent class="drawer">
      {#snippet children(state)}{contentFor(state.payload)}{/snippet}
    </DrawerContent>
  </Drawer>
  <output role="status" aria-label="Last open">{lastOpen}</output>
  <output role="status" aria-label="Last payload">{lastPayload}</output>
</div>
