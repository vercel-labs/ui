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
  <FieldLabel>Guests</FieldLabel>
  <NumberInput defaultValue={2} min={1} max={8}>
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
  <FieldDescription>Between 1 and 8 guests.</FieldDescription>
</Field>
