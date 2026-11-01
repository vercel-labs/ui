<script lang="ts">
  import { Minus, Plus } from "@lucide/svelte"
  import { Field, FieldDescription, FieldLabel } from "@ui-sdk/svelte/field"
  import {
    NumberInput,
    NumberInputDecrement,
    NumberInputGroup,
    NumberInputIncrement,
    NumberInputControl,
  } from "@ui-sdk/svelte/number-input"

</script>

<Field>
  <FieldLabel>Seats included</FieldLabel>
  <NumberInput defaultValue={5} readOnly>
    <NumberInputGroup>
      <NumberInputDecrement aria-label="Decrease">
        <Minus aria-hidden="true" />
      </NumberInputDecrement>
      <NumberInputControl />
      <NumberInputIncrement aria-label="Increase">
        <Plus aria-hidden="true" />
      </NumberInputIncrement>
    </NumberInputGroup>
  </NumberInput>
  <FieldDescription>Set by your plan.</FieldDescription>
</Field>
