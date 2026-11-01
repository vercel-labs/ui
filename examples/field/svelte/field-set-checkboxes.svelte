<script lang="ts">
  import { Check } from "@lucide/svelte"
  import { Checkbox, CheckboxGroup, CheckboxIndicator } from "@ui-sdk/svelte/checkbox"
  import { FieldDescription, FieldLegend, FieldSet } from "@ui-sdk/svelte/field"

  const items = [
    { value: "comments", label: "Comments on your posts" },
    { value: "mentions", label: "Mentions" },
    { value: "follows", label: "New followers" },
  ]
</script>

<FieldSet>
  <FieldLegend>Notifications</FieldLegend>
  <FieldDescription>Choose what we email you about.</FieldDescription>
  <CheckboxGroup name="notify" defaultValue={["mentions"]}>
    {#each items as item (item.value)}
      <label data-slot="label">
        <Checkbox value={item.value}>
          <CheckboxIndicator>
            <Check aria-hidden="true" />
          </CheckboxIndicator>
        </Checkbox>
        {item.label}
      </label>
    {/each}
  </CheckboxGroup>
</FieldSet>
