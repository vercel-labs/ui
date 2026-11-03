<script lang="ts">
  import { createTooltipController, Tooltip, TooltipContent, TooltipTrigger } from "@ui-sdk/svelte/tooltip"

  const tooltip = createTooltipController()
  let open = $state(false)
  let reason = $state("")
</script>

<div data-slot="stack">
  <div data-slot="row">
    <Tooltip bind:open controller={tooltip} onOpenChange={(_, details) => (reason = details.reason)}>
      <TooltipTrigger>Export</TooltipTrigger>
      <TooltipContent>Download a CSV of this table</TooltipContent>
    </Tooltip>
    <button type="button" onclick={() => tooltip.open()}>
      Show from elsewhere
    </button>
  </div>
  <output data-slot="output">{open ? "Open" : "Closed"}{reason ? `, last change: ${reason}` : ""}</output>
</div>
