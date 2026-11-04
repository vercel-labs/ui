<script lang="ts">
  import { CheckIcon } from "@lucide/svelte"
  import { Checkbox, CheckboxIndicator } from "@ui-sdk/svelte/checkbox"
  import { Tooltip, TooltipContent, TooltipTrigger } from "@ui-sdk/svelte/tooltip"
  import { useLog } from "../../../shared/svelte/log"

  const log = useLog()
  let open = $state(false)
</script>

<div data-slot="stack">
  <div data-slot="controls">
    <label data-slot="label">
      <Checkbox bind:checked={() => open, (next) => (open = next === true)}>
        <CheckboxIndicator>
          <CheckIcon aria-hidden="true" />
        </CheckboxIndicator>
      </Checkbox>
      Open
    </label>
  </div>
  <Tooltip bind:open onOpenChange={(next, details) => log(`${next ? "Opened" : "Closed"} (${details.reason})`)}>
    <TooltipTrigger>Export</TooltipTrigger>
    <TooltipContent>Download as CSV</TooltipContent>
  </Tooltip>
</div>
