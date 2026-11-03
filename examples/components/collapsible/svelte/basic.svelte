<script lang="ts">
  import { ChevronDownIcon } from "@lucide/svelte"
  import { Collapsible, CollapsiblePanel, CollapsibleTrigger } from "@ui-sdk/svelte/collapsible"

  const details = [
    { label: "Shipping address", value: "221B Baker Street, London" },
    { label: "Items", value: "2 × Linen shirt" },
    { label: "Delivery", value: "Standard, arrives March 7" },
    { label: "Total", value: "$84.00" },
  ]
</script>

<Collapsible>
  <div data-slot="row">
    <div data-slot="stack">
      <p>Order #4189</p>
      <p data-slot="hint">Placed on March 3</p>
    </div>
    <span data-slot="row">
      Shipped
    </span>
  </div>
  <div>
    <CollapsibleTrigger data-variant="secondary">
      Order details
      <ChevronDownIcon />
    </CollapsibleTrigger>
    <CollapsiblePanel>
      <dl>
        {#each details as detail (detail.label)}
          <div data-slot="row">
            <dt>{detail.label}</dt>
            <dd>{detail.value}</dd>
          </div>
        {/each}
      </dl>
    </CollapsiblePanel>
  </div>
</Collapsible>
