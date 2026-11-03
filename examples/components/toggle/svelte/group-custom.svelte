<script lang="ts">
  import { Toggle, ToggleGroup } from "@ui-sdk/svelte/toggle"

  const weights = [
    { value: "light", label: "Light" },
    { value: "normal", label: "Normal" },
    { value: "medium", label: "Medium" },
    { value: "bold", label: "Bold" },
  ]

  let weight = $state("normal")

  function select(value: string[]) {
    weight = value[0] ?? "normal"
  }
</script>

<div data-slot="stack">
  <ToggleGroup defaultValue={["normal"]} deselectable={false} aria-label="Font weight" onValueChange={select}>
    {#each weights as item (item.value)}
      <Toggle value={item.value} data-variant={item.value}>
        {item.label}
      </Toggle>
    {/each}
  </ToggleGroup>
  <p data-variant={weight}>The quick brown fox jumps over the lazy dog.</p>
</div>
