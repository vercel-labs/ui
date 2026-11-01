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
  <FieldLabel>Font size</FieldLabel>
  <NumberInput defaultValue={16} min={8} max={72} wheel>
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
  <FieldDescription >Focus the input, then scroll over it.</FieldDescription>
</Field>
