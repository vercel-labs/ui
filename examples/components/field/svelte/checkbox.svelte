<script lang="ts">
  import { CheckIcon } from "@lucide/svelte"
  import { Checkbox, CheckboxIndicator } from "@ui-sdk/svelte/checkbox"
  import { Field, FieldDescription, FieldLabel } from "@ui-sdk/svelte/field"
</script>

<Field>
  <Checkbox name="usage">
    <CheckboxIndicator>
      <CheckIcon />
    </CheckboxIndicator>
  </Checkbox>
  <div data-slot="stack">
    <FieldLabel>Share usage data</FieldLabel>
    <FieldDescription>
      Help us improve by sending anonymous crash reports and usage statistics.
    </FieldDescription>
  </div>
</Field>
