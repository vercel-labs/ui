<script lang="ts">
  import { BoldIcon, ItalicIcon, UnderlineIcon } from "@lucide/svelte"
  import { Toggle, ToggleGroup, ToggleIcon } from "@ui-sdk/svelte/toggle"

  const formatting = [
    { value: "bold", label: "Bold", icon: BoldIcon },
    { value: "italic", label: "Italic", icon: ItalicIcon },
    { value: "underline", label: "Underline", icon: UnderlineIcon },
  ]
</script>

<div data-slot="stack">
  <ToggleGroup multiple disabled defaultValue={["bold"]} aria-label="Text formatting, disabled">
    {#each formatting as item (item.value)}
      <Toggle value={item.value} aria-label={item.label}>
        <ToggleIcon>
          <item.icon />
        </ToggleIcon>
      </Toggle>
    {/each}
  </ToggleGroup>
  <ToggleGroup multiple aria-label="Text formatting">
    {#each formatting as item (item.value)}
      <Toggle value={item.value} disabled={item.value === "underline"} aria-label={item.label}>
        <ToggleIcon>
          <item.icon />
        </ToggleIcon>
      </Toggle>
    {/each}
  </ToggleGroup>
</div>
