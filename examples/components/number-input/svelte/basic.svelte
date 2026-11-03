<script lang="ts">
  import { MinusIcon, PlusIcon } from "@lucide/svelte"
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
      <MinusIcon aria-hidden="true" />
    </NumberInputDecrement>
    <NumberInputControl aria-label="Quantity" />
    <NumberInputIncrement aria-label="Increase">
      <PlusIcon aria-hidden="true" />
    </NumberInputIncrement>
  </NumberInputGroup>
</NumberInput>
