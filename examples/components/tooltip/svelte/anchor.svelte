<script lang="ts">
  import { InfoIcon } from "@lucide/svelte"
  import { Field, FieldControl, FieldLabel } from "@ui-sdk/svelte/field"
  import { Tooltip, TooltipContent, TooltipTrigger } from "@ui-sdk/svelte/tooltip"

  let field: HTMLDivElement | undefined = $state()
</script>

<Field>
  <FieldLabel>Webhook URL</FieldLabel>
  <div data-slot="row" bind:this={field}>
    <FieldControl placeholder="https://" />
    <Tooltip>
      <TooltipTrigger aria-label="About webhooks">
        <InfoIcon aria-hidden="true" />
      </TooltipTrigger>
      <TooltipContent anchor={field} side="bottom" align="start">
        We send a POST request here for every new order.
      </TooltipContent>
    </Tooltip>
  </div>
</Field>
