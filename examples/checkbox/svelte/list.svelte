<script lang="ts">
  import { Check } from "@lucide/svelte"
  import { Checkbox, CheckboxIndicator } from "@ui-sdk/svelte/checkbox"

  const items = [
    { value: "hard-disks", label: "Hard disks", checked: false },
    { value: "external-disks", label: "External disks", checked: true },
    { value: "media", label: "CDs, DVDs and iPods", checked: true },
    { value: "servers", label: "Connected servers", checked: false },
  ]
</script>

<fieldset data-slot="stack">
  <legend>Show these items on the desktop</legend>
  <p data-slot="hint">Select the items you want to show on the desktop.</p>
  {#each items as item (item.value)}
    <label data-slot="label">
      <Checkbox name="desktop" value={item.value} defaultChecked={item.checked}>
        <CheckboxIndicator>
          <Check aria-hidden="true" />
        </CheckboxIndicator>
      </Checkbox>
      {item.label}
    </label>
  {/each}
</fieldset>
