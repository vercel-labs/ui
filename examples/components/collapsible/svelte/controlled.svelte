<script lang="ts">
  import { ChevronDownIcon } from "@lucide/svelte"
  import {
    Collapsible,
    CollapsiblePanel,
    CollapsibleTrigger,
    createCollapsibleController,
  } from "@ui-sdk/svelte/collapsible"

  const recoveryCodes = ["7KQ2-M9XD", "P4TR-8HZC", "W3NB-6JUE", "C5YF-2LSA"]

  const collapsible = createCollapsibleController()

  let open = $state(false)
  let reason = $state("")
</script>

<div data-slot="stack">
    <Collapsible bind:open controller={collapsible} onOpenChange={(_, details) => (reason = details.reason)}>
      <CollapsibleTrigger data-variant="secondary">
        Recovery codes
        <ChevronDownIcon />
      </CollapsibleTrigger>
      <CollapsiblePanel>
        <div data-slot="stack">
          <p>Each code signs you in once if you lose your phone.</p>
          <ul data-slot="log">
            {#each recoveryCodes as code (code)}
              <li>{code}</li>
            {/each}
          </ul>
          <button data-variant="secondary" onclick={() => collapsible.close()}>
            Done
          </button>
        </div>
      </CollapsiblePanel>
    </Collapsible>
    <button data-variant="secondary" onclick={() => collapsible.toggle()}>
      Toggle from outside
    </button>
    <output data-slot="output">
      {open ? "Open" : "Closed"}{reason ? `, last change: ${reason}` : ""}
    </output>
</div>
