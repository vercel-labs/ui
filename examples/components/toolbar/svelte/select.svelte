<script lang="ts">
  import { CheckIcon, ChevronsUpDownIcon, MonitorIcon, ZoomInIcon, ZoomOutIcon } from "@lucide/svelte"
  import {
    Select,
    SelectContent,
    SelectItem,
    SelectItemIndicator,
    SelectTrigger,
    SelectValue,
  } from "@ui-sdk/svelte/select"
  import { Toolbar, ToolbarButton, ToolbarSeparator } from "@ui-sdk/svelte/toolbar"

  const zooms = ["50%", "75%", "100%", "150%", "200%"]

  let zoom = $state("100%")
  const index = $derived(zooms.indexOf(zoom))
</script>

<Toolbar aria-label="View">
  <ToolbarButton data-variant="secondary"
    aria-label="Zoom out"
    disabled={index === 0}
    onclick={() => (zoom = zooms[index - 1])}
  >
    <ZoomOutIcon />
  </ToolbarButton>
  <Select value={zoom} onValueChange={(value) => typeof value === "string" && (zoom = value)}>
    <ToolbarButton data-variant="secondary" aria-label="Zoom">
      {#snippet render({ props })}
        <SelectTrigger {...props}>
          <SelectValue />
          <ChevronsUpDownIcon />
        </SelectTrigger>
      {/snippet}
    </ToolbarButton>
    <SelectContent>
      {#each zooms as level (level)}
        <SelectItem value={level}>
          {level}
          <SelectItemIndicator>
            <CheckIcon />
          </SelectItemIndicator>
        </SelectItem>
      {/each}
    </SelectContent>
  </Select>
  <ToolbarButton data-variant="secondary"
    aria-label="Zoom in"
    disabled={index === zooms.length - 1}
    onclick={() => (zoom = zooms[index + 1])}
  >
    <ZoomInIcon />
  </ToolbarButton>
  <ToolbarSeparator />
  <ToolbarButton data-variant="secondary" aria-label="Fit to screen" onclick={() => (zoom = "100%")}>
    <MonitorIcon />
  </ToolbarButton>
</Toolbar>
