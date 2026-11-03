<script lang="ts">
  import { ChevronDownIcon } from "@lucide/svelte"
  import { Collapsible, CollapsiblePanel, CollapsibleTrigger } from "@ui-sdk/svelte/collapsible"
</script>

<div data-slot="stack">
  <Collapsible>
    <CollapsibleTrigger data-variant="secondary">
      Ingredients
      <ChevronDownIcon />
    </CollapsibleTrigger>
    <CollapsiblePanel hiddenUntilFound>
      <p data-slot="hint">
        Flour, butter, brown sugar, eggs, a pinch of cardamom and sea salt.
      </p>
    </CollapsiblePanel>
  </Collapsible>
</div>
