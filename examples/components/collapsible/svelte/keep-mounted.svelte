<script lang="ts">
  import { ChevronDownIcon } from "@lucide/svelte"
  import { Collapsible, CollapsiblePanel, CollapsibleTrigger } from "@ui-sdk/svelte/collapsible"
</script>

<Collapsible>
  <CollapsibleTrigger data-variant="secondary">
    Add a delivery note
    <ChevronDownIcon />
  </CollapsibleTrigger>
  <CollapsiblePanel keepMounted>
    <label data-slot="label">
      <span>Delivery note</span>
      <textarea
        placeholder="Leave it with the front desk…"
      ></textarea>
    </label>
  </CollapsiblePanel>
</Collapsible>
