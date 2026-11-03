<script lang="ts">
  import { SettingsIcon } from "@lucide/svelte"
  import { Collapsible, CollapsiblePanel, CollapsibleTrigger } from "@ui-sdk/svelte/collapsible"
</script>

<Collapsible>
  <p>Radius</p>
  <p data-slot="hint">Set the corner radius of the element.</p>
  <div data-slot="row">
    <label data-slot="label">
      <span>Radius</span>
      <input type="number" min="0" value="8" />
    </label>
    <CollapsibleTrigger data-variant="secondary">
      <SettingsIcon />
      Edit each axis
    </CollapsibleTrigger>
  </div>
  <CollapsiblePanel>
    <div data-slot="grid">
      <label data-slot="label">
        <span>Radius X</span>
        <input type="number" min="0" value="8" />
      </label>
      <label data-slot="label">
        <span>Radius Y</span>
        <input type="number" min="0" value="8" />
      </label>
    </div>
  </CollapsiblePanel>
</Collapsible>
