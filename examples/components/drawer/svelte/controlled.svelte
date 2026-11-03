<script lang="ts">
  import {
    Drawer,
    DrawerBackdrop,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerHandle,
    DrawerTitle,
    DrawerTrigger,
    type SnapPoint,
  } from "@ui-sdk/svelte/drawer"

  const snapPoints: SnapPoint[] = [0.25, 0.5, 1]

  let open = $state(false)
  let snapPoint = $state<SnapPoint>(0.5)
  let log = $state<string[]>([])
  const write = (line: string) => (log = [line, ...log].slice(0, 8))
  const onOpenChange = (next: boolean, details: { reason: string }) =>
    write(`onOpenChange(${next}, "${details.reason}")`)
  const onOpenChangeComplete = (next: boolean) => write(`onOpenChangeComplete(${next})`)
  const onSnapPointChange = (next: SnapPoint, details: { reason: string }) =>
    write(`onSnapPointChange(${next}, "${details.reason}")`)
</script>

<div data-slot="stack">
  <div data-slot="row">
    <label data-slot="label">
      <input bind:checked={open} type="checkbox" />
      open
    </label>
    <fieldset data-slot="row">
      <legend>snapPoint</legend>
      {#each snapPoints as point (point)}
        <label data-slot="label">
          <input bind:group={snapPoint} type="radio" name="controlled-snap-point" value={point} />
          {point}
        </label>
      {/each}
    </fieldset>
  </div>
  <Drawer
    bind:open
    bind:snapPoint
    {snapPoints}

    {onOpenChange}
    {onOpenChangeComplete}
    {onSnapPointChange}
  >
    <DrawerTrigger>
      Open
    </DrawerTrigger>
    <DrawerBackdrop />
    <DrawerContent>
      <DrawerHandle aria-label="Resize" />
      <div data-slot="stack">
        <DrawerTitle>Controlled</DrawerTitle>
        <DrawerDescription>
          Open at {snapPoint}. Drag it, or pick a size, and watch the log.
        </DrawerDescription>
      </div>
      <div data-slot="row">
        {#each snapPoints as point (point)}
          <button type="button" aria-pressed={snapPoint === point} onclick={() => (snapPoint = point)}>
            {point}
          </button>
        {/each}
        <DrawerClose data-variant="solid">
          Close
        </DrawerClose>
      </div>
    </DrawerContent>
  </Drawer>
  <p data-slot="hint">open: {open}, snapPoint: {snapPoint}</p>
  <ol data-slot="log">
    {#each log as line, index (index)}
      <li>{line}</li>
    {/each}
  </ol>
</div>
