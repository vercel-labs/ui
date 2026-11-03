<script lang="ts">
  import { Tooltip, TooltipContent, TooltipTrigger } from "@ui-sdk/svelte/tooltip"

  const items = ["Inbox", "Drafts", "Sent"]
  let status = $state("Closed")

  function complete(item: string, open: boolean) {
    if (open) status = `${item} open`
    else if (status === `${item} closing`) status = `${item} closed`
  }
</script>

<div data-slot="stack">
  <div data-slot="row">
    {#each items as item (item)}
      <Tooltip
        onOpenChange={(open) => (status = open ? `${item} opening` : `${item} closing`)}
        onOpenChangeComplete={(open) => complete(item, open)}
      >
        <TooltipTrigger>{item}</TooltipTrigger>
        <TooltipContent>Open {item.toLowerCase()}</TooltipContent>
      </Tooltip>
    {/each}
  </div>
  <output data-slot="output">{status}</output>
</div>
