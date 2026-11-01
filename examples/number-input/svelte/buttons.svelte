<script lang="ts">
  import { Minus, Plus } from "@lucide/svelte"
  import {
    NumberInput,
    NumberInputDecrement,
    NumberInputGroup,
    NumberInputIncrement,
    NumberInputControl,
  } from "@ui-sdk/svelte/number-input"

</script>

<NumberInput defaultValue={1} min={0}>
  <NumberInputGroup>
    <NumberInputDecrement aria-label="Decrease">
      <Minus />
    </NumberInputDecrement>
    <NumberInputControl aria-label="Quantity" />
    <NumberInputIncrement aria-label="Increase">
      <Plus />
    </NumberInputIncrement>
  </NumberInputGroup>
</NumberInput>
