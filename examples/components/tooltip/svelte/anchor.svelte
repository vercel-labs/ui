<script lang="ts">
  import { InfoIcon } from "@lucide/svelte"
  import { Tooltip, TooltipContent, TooltipTrigger } from "@ui-sdk/svelte/tooltip"

  const id = $props.id()
  let field: HTMLDivElement | undefined = $state()
</script>

<div data-slot="stack">
  <label data-slot="label" for={id}>Webhook URL</label>
  <div data-slot="row" bind:this={field}>
    <input {id} placeholder="https://" />
    <Tooltip>
      <TooltipTrigger aria-label="About webhooks">
        <InfoIcon />
      </TooltipTrigger>
      <TooltipContent anchor={field} align="start">
        We send a POST request to this URL for every new order.
      </TooltipContent>
    </Tooltip>
  </div>
</div>
