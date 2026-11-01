<script lang="ts">
  import { Check } from "@lucide/svelte"
  import { Checkbox, CheckboxIndicator } from "@ui-sdk/svelte/checkbox"
  import { Field, FieldDescription, FieldLabel } from "@ui-sdk/svelte/field"
</script>

<Field>
  <Checkbox name="two-factor" defaultChecked readOnly>
    <CheckboxIndicator>
      <Check aria-hidden="true" />
    </CheckboxIndicator>
  </Checkbox>
  <div data-slot="stack">
    <FieldLabel>Require two-factor authentication</FieldLabel>
    <FieldDescription>
      Your organization requires this setting.
    </FieldDescription>
  </div>
</Field>
