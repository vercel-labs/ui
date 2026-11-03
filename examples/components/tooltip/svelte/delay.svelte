<script lang="ts">
  import { BoldIcon, CodeIcon, ItalicIcon, LinkIcon, UnderlineIcon } from "@lucide/svelte"
  import { Tooltip, TooltipContent, TooltipTrigger } from "@ui-sdk/svelte/tooltip"

  const tools = [
    { icon: BoldIcon, label: "Bold" },
    { icon: ItalicIcon, label: "Italic" },
    { icon: UnderlineIcon, label: "Underline" },
    { icon: LinkIcon, label: "Link" },
    { icon: CodeIcon, label: "Code" },
  ]

  const delays = [0, 600, 1200]
  const closeDelays = [0, 300]
  let delay = $state(600)
  let closeDelay = $state(0)
  let enabled = $state(true)
</script>

<div data-slot="stack">
  <div data-slot="grid">
    <span data-slot="hint">delay</span>
    <div data-slot="row" role="group" aria-label="delay">
      {#each delays as value (value)}
        <button type="button" data-size="sm" aria-pressed={delay === value} onclick={() => (delay = value)}>
          {value}
        </button>
      {/each}
    </div>
    <span data-slot="hint">closeDelay</span>
    <div data-slot="row" role="group" aria-label="closeDelay">
      {#each closeDelays as value (value)}
        <button
          type="button"
          data-size="sm"
          aria-pressed={closeDelay === value}
          onclick={() => (closeDelay = value)}
        >
          {value}
        </button>
      {/each}
    </div>
  </div>
  <label data-slot="label">
    <input bind:checked={enabled} type="checkbox" />
    Show tooltips
  </label>
  <div data-slot="row" role="group" aria-label="Formatting">
    {#each tools as tool (tool.label)}
      <Tooltip {delay} {closeDelay} disabled={!enabled}>
        <TooltipTrigger>
          <tool.icon />
        </TooltipTrigger>
        <TooltipContent>{tool.label}</TooltipContent>
      </Tooltip>
    {/each}
  </div>
</div>
