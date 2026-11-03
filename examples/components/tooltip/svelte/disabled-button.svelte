<script lang="ts">
  import { Tooltip, TooltipContent, TooltipTrigger } from "@ui-sdk/svelte/tooltip"

  let title = $state("")
  let status = $state("Draft")
  const blocked = $derived(!title.trim())

  function publish() {
    if (!blocked) {
      status = `Published “${title.trim()}”`
    }
  }
</script>

<div data-slot="stack">
  <input bind:value={title} placeholder="Post title" aria-label="Post title" />
  <div data-slot="row">
    <Tooltip disabled={!blocked}>
      <TooltipTrigger aria-disabled={blocked || undefined} onclick={publish}>Publish</TooltipTrigger>
      <TooltipContent>Add a title to publish</TooltipContent>
    </Tooltip>
    <output data-slot="output">{status}</output>
  </div>
</div>
