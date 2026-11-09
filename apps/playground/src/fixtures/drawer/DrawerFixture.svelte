<script lang="ts">
  import {
    createDrawerController,
    Drawer,
    DrawerBackdrop,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerHandle,
    DrawerOutlet,
    DrawerShortcut,
    DrawerTitle,
    DrawerTrigger,
  } from "@ui-sdk/svelte/drawer"
  import {
    drawerFixture,
    drawerOptions,
    drawerParts,
    exposeDrawerFixture,
    recordDrawer,
  } from "tests/fixtures/drawer.ts"

  const controller = createDrawerController()
  // The specs' hooks live on the window, which the server doesn't have.
  if (typeof window !== "undefined") {
    exposeDrawerFixture(controller)
  }

  const options = drawerOptions()
  const parts = drawerParts()
  let action = $state("")
  let more = $state(false)
</script>

<div class="fixture">
  <button>Before</button>
  <Drawer
    {controller}
    {...options}
    onOpenChange={(open, details) =>
      recordDrawer(`drawer:${open}:${details.reason}`)}
    onSnapPointChange={(snapPoint, details) =>
      recordDrawer(`${snapPoint}:${details.reason}`)}
    onDismissAttempt={(details) => recordDrawer(`attempt:${details.reason}`)}
  >
    <DrawerTrigger>{drawerFixture.trigger}</DrawerTrigger>
    {#if parts.backdrop}<DrawerBackdrop class="drawer-backdrop" />{/if}
    <DrawerContent class="drawer">
      <DrawerHandle class="handle" aria-label={drawerFixture.handle} />
      <DrawerTitle class="title">{drawerFixture.title}</DrawerTitle>
      <DrawerDescription class="description"
        >{drawerFixture.description}</DrawerDescription
      >
      {#if parts.field}
        <label class="field">
          {drawerFixture.field}
          <input />
        </label>
      {/if}
      {#if parts.scroll}
        <ul class="scroll" aria-label={drawerFixture.scroll.label} tabindex="0">
          {#each drawerFixture.scroll.items as item (item)}<li>
              {item}
            </li>{/each}
        </ul>
      {/if}
      {#if parts.grow}
        <button onclick={() => (more = true)}
          >{drawerFixture.grow.button}</button
        >
        {#if more}<p class="more">{drawerFixture.grow.text}</p>{/if}
      {/if}
      <div class="actions">
        <button onclick={() => (action = "submit")}
          >{drawerFixture.action}</button
        >
        <DrawerClose>{drawerFixture.close}</DrawerClose>
      </div>
      {#if parts.nested}
        <Drawer
          onOpenChange={(open, details) =>
            recordDrawer(`nested:${open}:${details.reason}`)}
        >
          <DrawerTrigger>{drawerFixture.nested.trigger}</DrawerTrigger>
          {#if parts.backdrop}<DrawerBackdrop class="drawer-backdrop" />{/if}
          <DrawerContent class="drawer">
            <DrawerTitle class="title">{drawerFixture.nested.title}</DrawerTitle
            >
            <DrawerClose>{drawerFixture.nested.close}</DrawerClose>
          </DrawerContent>
        </Drawer>
      {/if}
    </DrawerContent>
  </Drawer>
  <button>After</button>
  <output role="status" aria-label="Last action">{action}</output>
  <button onclick={() => controller.open()}>{drawerFixture.controller}</button>
  <button onclick={() => (action = "page")}>{drawerFixture.page}</button>
  {#if parts.shortcut}
    <DrawerTrigger {controller} shortcut={drawerFixture.shortcut.keys}>
      {drawerFixture.shortcut.trigger}
      <DrawerShortcut />
    </DrawerTrigger>
  {/if}
  {#if parts.outlet}
    <DrawerOutlet
      {controller}
      class="outlet"
      role="region"
      aria-label={drawerFixture.outlet.label}
      keyframes={drawerFixture.outlet.keyframes}
    />
  {/if}
</div>
