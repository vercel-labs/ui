<script lang="ts">
  import { Tooltip, TooltipContent, TooltipTrigger } from "@ui-sdk/svelte/tooltip"

  const sides = [
    { side: "left", label: "Left" },
    { side: "top", label: "Top" },
    { side: "bottom", label: "Bottom" },
    { side: "right", label: "Right" },
  ] as const
</script>

<div data-slot="row">
  {#each sides as { side, label } (side)}
    <Tooltip>
      <TooltipTrigger>{label}</TooltipTrigger>
      <TooltipContent {side}>Add to library</TooltipContent>
    </Tooltip>
  {/each}
</div>
