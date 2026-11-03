<script lang="ts">
  import { BellIcon, ExternalLinkIcon } from "@lucide/svelte"
  import {
    Popover,
    PopoverContent,
    PopoverDescription,
    PopoverTitle,
    PopoverTrigger,
  } from "@ui-sdk/svelte/popover"
  import { Tooltip, TooltipContent, TooltipTrigger } from "@ui-sdk/svelte/tooltip"
</script>

<div data-slot="row">
  <Popover>
    <Tooltip>
      <TooltipTrigger>
        {#snippet render({ props })}
          <PopoverTrigger {...props}>
            <BellIcon />
          </PopoverTrigger>
        {/snippet}
      </TooltipTrigger>
      <TooltipContent>Notifications</TooltipContent>
    </Tooltip>
    <PopoverContent sideOffset={8}>
      <PopoverTitle>Notifications</PopoverTitle>
      <PopoverDescription>You're all caught up.</PopoverDescription>
    </PopoverContent>
  </Popover>
  <Tooltip>
    <TooltipTrigger href="https://example.com/changelog" data-variant="link">
      {#snippet render({ props })}
        <a {...props}>
          Changelog
          <ExternalLinkIcon />
        </a>
      {/snippet}
    </TooltipTrigger>
    <TooltipContent>
      {#snippet render({ props })}
        <div {...props}>What's new in 2.0</div>
      {/snippet}
    </TooltipContent>
  </Tooltip>
</div>
