<script lang="ts">
  import { TextAlignCenterIcon, TextAlignEndIcon, TextAlignStartIcon } from "@lucide/svelte"
  import { Toggle, ToggleGroup, ToggleIcon } from "@ui-sdk/svelte/toggle"

  const alignments = [
    { value: "left", label: "Align left", icon: TextAlignStartIcon },
    { value: "center", label: "Align center", icon: TextAlignCenterIcon },
    { value: "right", label: "Align right", icon: TextAlignEndIcon },
  ]
</script>

<ToggleGroup defaultValue={["left"]} aria-label="Text alignment">
  {#each alignments as item (item.value)}
    <Toggle value={item.value} aria-label={item.label}>
      <ToggleIcon>
        <item.icon />
      </ToggleIcon>
    </Toggle>
  {/each}
</ToggleGroup>
