<script lang="ts">
  import { MinusIcon, PlusIcon } from "@lucide/svelte"
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
  <FieldLabel>Hours</FieldLabel>
  <NumberInput defaultValue={1.5} min={0} max={24} step={0.25} largeStep={1} smallStep={0.05}>
    <NumberInputGroup>
      <NumberInputDecrement aria-label="Decrease">
        <MinusIcon aria-hidden="true" />
      </NumberInputDecrement>
      <NumberInputControl />
      <NumberInputIncrement aria-label="Increase">
        <PlusIcon aria-hidden="true" />
      </NumberInputIncrement>
    </NumberInputGroup>
  </NumberInput>
  <FieldDescription
    >Steps by a quarter hour. Hold Shift to step by an hour, or Alt (Option) for three
    minutes.</FieldDescription
  >
</Field>
