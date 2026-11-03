<script lang="ts">
  import { BoldIcon, ItalicIcon, Share2Icon, UnderlineIcon } from "@lucide/svelte"
  import { Tooltip, TooltipContent, TooltipTrigger } from "@ui-sdk/svelte/tooltip"

  const formats = [
    { icon: BoldIcon, label: "Bold" },
    { icon: ItalicIcon, label: "Italic" },
    { icon: UnderlineIcon, label: "Underline" },
  ]
</script>

<div data-slot="row">
  {#each formats as format (format.label)}
    <Tooltip>
      <TooltipTrigger>
        <format.icon />
      </TooltipTrigger>
      <TooltipContent>{format.label}</TooltipContent>
    </Tooltip>
  {/each}
  <Tooltip type="label">
    <TooltipTrigger>¶</TooltipTrigger>
    <TooltipContent>Show formatting marks</TooltipContent>
  </Tooltip>
  <Tooltip>
    <TooltipTrigger>
      <Share2Icon />
      Share
    </TooltipTrigger>
    <TooltipContent>Anyone with the link can view</TooltipContent>
  </Tooltip>
</div>
