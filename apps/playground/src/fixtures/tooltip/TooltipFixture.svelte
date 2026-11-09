<script lang="ts">
  import { createTooltipController } from "@ui-sdk/core/tooltip"
  import {
    Popover,
    PopoverClose,
    PopoverContent,
    PopoverTitle,
    PopoverTrigger,
    Tooltip,
    TooltipArrow,
    TooltipContent,
    TooltipShortcut,
    TooltipTrigger,
  } from "@ui-sdk/svelte"
  import {
    tooltipContentOptions,
    tooltipFixture,
    tooltipOptions,
    tooltipParts,
  } from "tests/fixtures/tooltip.ts"

  const controller = createTooltipController()
  const options = tooltipOptions()
  const content = tooltipContentOptions()
  const parts = tooltipParts()
  const { save, toolbar, profile, info, publish, iconPopover } = tooltipFixture
  let action = $state("")

  function publishPress(event: MouseEvent) {
    if (
      (event.currentTarget as HTMLElement).getAttribute("aria-disabled") !==
      "true"
    ) {
      action = publish.action
    }
  }
</script>

<div class="fixture tooltip-page">
  <button>Before</button>
  <Tooltip
    {...options}
    {controller}
    defaultOpen={parts.open}
    shortcut={save.shortcut}
  >
    <TooltipTrigger
      disabled={parts.nativeDisabled || undefined}
      onclick={() => (action = "save")}
    >
      {save.trigger}
    </TooltipTrigger>
    <TooltipContent class="tooltip" {...content}>
      <TooltipArrow class="arrow" />
      {save.content}
      <TooltipShortcut />
    </TooltipContent>
  </Tooltip>
  <div class="toolbar" role="group" aria-label="Formatting">
    {#each toolbar as item (item.content)}
      <Tooltip {...options}>
        <TooltipTrigger>
          <span aria-hidden="true">{item.icon}</span>
        </TooltipTrigger>
        <TooltipContent class="tooltip">{item.content}</TooltipContent>
      </Tooltip>
    {/each}
  </div>
  <Popover container={options.container}>
    <Tooltip {...options}>
      <TooltipTrigger>
        {#snippet render({ props })}
          <PopoverTrigger {...props}>{profile.trigger}</PopoverTrigger>
        {/snippet}
      </TooltipTrigger>
      <TooltipContent class="tooltip">{profile.content}</TooltipContent>
    </Tooltip>
    <PopoverContent class="popup" sideOffset={8}>
      <PopoverTitle class="title">{profile.popover}</PopoverTitle>
      <div class="actions">
        <Tooltip {...options}>
          <TooltipTrigger>{profile.help.trigger}</TooltipTrigger>
          <TooltipContent class="tooltip">{profile.help.content}</TooltipContent
          >
        </Tooltip>
        <PopoverClose>{profile.close}</PopoverClose>
      </div>
    </PopoverContent>
  </Popover>
  <Tooltip {...options} toggleable>
    <TooltipTrigger aria-label={info.trigger}>
      <span aria-hidden="true">i</span>
    </TooltipTrigger>
    <TooltipContent class="tooltip">{info.content}</TooltipContent>
  </Tooltip>
  {#if parts.disabled}
    <Tooltip {...options}>
      <TooltipTrigger aria-disabled="true" onclick={publishPress}
        >{publish.trigger}</TooltipTrigger
      >
      <TooltipContent class="tooltip">{publish.content}</TooltipContent>
    </Tooltip>
  {/if}
  {#if parts.iconPopover}
    <Popover container={options.container}>
      <Tooltip {...options}>
        <TooltipTrigger>
          {#snippet render({ props })}
            <PopoverTrigger {...props}>
              <span aria-hidden="true">{iconPopover.icon}</span>
            </PopoverTrigger>
          {/snippet}
        </TooltipTrigger>
        <TooltipContent class="tooltip">{iconPopover.content}</TooltipContent>
      </Tooltip>
      <PopoverContent class="popup">{iconPopover.popover}</PopoverContent>
    </Popover>
    <Popover container={options.container}>
      <PopoverTrigger>
        <span aria-hidden="true">{iconPopover.unnamed}</span>
      </PopoverTrigger>
      <PopoverContent class="popup">{iconPopover.popover}</PopoverContent>
    </Popover>
  {/if}
  <button>After</button>
  <output role="status" aria-label="Last action">{action}</output>
  <button onclick={() => controller.open()}>Open with controller</button>
  {#if parts.shortcut}
    <TooltipTrigger {controller}>
      {tooltipFixture.shortcut.trigger}
      <TooltipShortcut />
    </TooltipTrigger>
  {/if}
</div>
