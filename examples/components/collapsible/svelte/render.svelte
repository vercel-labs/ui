<script lang="ts">
  import { ChevronRightIcon } from "@lucide/svelte"
  import { Collapsible, CollapsiblePanel, CollapsibleTrigger } from "@ui-sdk/svelte/collapsible"
</script>

<Collapsible>
  {#snippet render({ props })}
    <div {...props}>
      <CollapsibleTrigger data-variant="secondary">
        {#snippet render({ props: triggerProps, state: triggerState })}
          <h3>
            <button {...triggerProps}>
              <ChevronRightIcon />
              <span>Track parcel</span>
            </button>
            <span data-slot="hint">
              {triggerState.open ? "3 updates" : "Arrives Thursday"}
            </span>
          </h3>
        {/snippet}
      </CollapsibleTrigger>
      <CollapsiblePanel>
        {#snippet render({ props })}
          <ol {...props}>
            <li data-slot="row">
              Out for delivery <span>07:40</span>
            </li>
            <li data-slot="row">
              Arrived at the local depot <span>05:12</span>
            </li>
            <li data-slot="row">
              Left the sorting center <span>Wed 21:03</span>
            </li>
          </ol>
        {/snippet}
      </CollapsiblePanel>
    </div>
  {/snippet}
</Collapsible>
