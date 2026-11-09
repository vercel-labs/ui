<script lang="ts">
  import {
    Collapsible,
    CollapsiblePanel,
    CollapsibleTrigger,
  } from "@ui-sdk/svelte"

  let action = $state("")
</script>

<div class="fixture">
  <button>Before</button>
  <Collapsible
    class="collapsible"
    onOpenChange={(open) => (action = open ? "open" : "closed")}
  >
    {#snippet children(state)}
      <span class={state.open ? "is-open" : "is-closed"} hidden></span>
      <CollapsibleTrigger class="collapsible-trigger">
        {#snippet render({ props, state: trigger })}
          <div {...props}>
            Files<span aria-hidden="true"> {trigger.open ? "−" : "+"}</span>
          </div>
        {/snippet}
      </CollapsibleTrigger>
      <CollapsiblePanel class="collapsible-panel">
        {#snippet render({ props })}
          <section {...props}>The files panel.</section>
        {/snippet}
      </CollapsiblePanel>
    {/snippet}
  </Collapsible>
  <button>After</button>
  <output role="status" aria-label="Last action">{action}</output>
</div>
