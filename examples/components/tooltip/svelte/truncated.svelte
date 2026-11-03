<script lang="ts">
  import { FileIcon } from "@lucide/svelte"
  import type { ChangeDetails } from "@ui-sdk/core"
  import { Tooltip, TooltipContent, TooltipTrigger } from "@ui-sdk/svelte/tooltip"

  const files = [
    "Quarterly report, final revised version for the board.pdf",
    "Notes.txt",
    "Design review recording, October 2nd.mp4",
    "Budget.xlsx",
  ]

  function onlyTruncated(open: boolean, details: ChangeDetails<string>) {
    const target = details.event?.target
    const name = target instanceof Element ? target.closest("button")?.querySelector("span") : null
    if (open && name && name.scrollWidth <= name.clientWidth) {
      details.cancel()
    }
  }
</script>

<ul>
  {#each files as file (file)}
    <li>
      <Tooltip type="label" onOpenChange={onlyTruncated}>
        <TooltipTrigger>
          <FileIcon />
          <span>{file}</span>
        </TooltipTrigger>
        <TooltipContent>{file}</TooltipContent>
      </Tooltip>
    </li>
  {/each}
</ul>
