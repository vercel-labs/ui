<script lang="ts">
  import { BoldIcon, SearchIcon } from "@lucide/svelte"
  import { NumberInput, NumberInputControl } from "@ui-sdk/svelte/number-input"
  import { Toolbar, ToolbarButton, ToolbarInput } from "@ui-sdk/svelte/toolbar"
</script>

<Toolbar aria-label="Text">
  <ToolbarButton data-variant="secondary" aria-label="Bold">
    <BoldIcon />
  </ToolbarButton>
  <NumberInput defaultValue={14} min={8} max={72}>
    <ToolbarInput aria-label="Font size">
      {#snippet render({ props })}
        <NumberInputControl {...props} />
      {/snippet}
    </ToolbarInput>
  </NumberInput>
  <ToolbarInput aria-label="Find" placeholder="Find…" />
  <ToolbarButton data-variant="secondary" aria-label="Search">
    <SearchIcon />
  </ToolbarButton>
</Toolbar>
