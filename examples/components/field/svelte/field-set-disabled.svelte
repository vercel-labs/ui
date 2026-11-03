<script lang="ts">
  import { Field, FieldLabel, FieldLegend, FieldSet } from "@ui-sdk/svelte/field"
  import { Input } from "@ui-sdk/svelte/input"
  import { Switch, SwitchThumb } from "@ui-sdk/svelte/switch"

  let same = $state(true)
</script>

<div data-slot="stack">
  <label data-slot="label">
    <Switch bind:checked={same}>
      <SwitchThumb />
    </Switch>
    Billing address is the same as shipping
  </label>
  <FieldSet disabled={same}>
    <FieldLegend>Billing address</FieldLegend>
    <Field name="billing-street">
      <FieldLabel>
        Street address
      </FieldLabel>
      <Input autocomplete="billing street-address" />
    </Field>
    <Field name="billing-city">
      <FieldLabel>
        City
      </FieldLabel>
      <Input autocomplete="billing address-level2" />
    </Field>
  </FieldSet>
</div>
