<script lang="ts">
  import { ChevronDownIcon } from "@lucide/svelte"
  import { Collapsible, CollapsiblePanel, CollapsibleTrigger } from "@ui-sdk/svelte/collapsible"
  import { Field, FieldControl, FieldLabel } from "@ui-sdk/svelte/field"
</script>

<Collapsible data-variant="card">
  <CollapsibleTrigger>
    <span data-slot="stack">
      <span>Add a delivery note</span>
      <span data-slot="hint">Optional, for the courier</span>
    </span>
    <ChevronDownIcon />
  </CollapsibleTrigger>
  <CollapsiblePanel keepMounted>
    <Field>
      <FieldLabel>Delivery note</FieldLabel>
      <FieldControl placeholder="Leave it with the front desk…">
        {#snippet render({ props })}
          <textarea {...props}></textarea>
        {/snippet}
      </FieldControl>
    </Field>
  </CollapsiblePanel>
</Collapsible>
