<script lang="ts">
  import { Minus, Plus } from "@lucide/svelte"
  import { Field, FieldLabel } from "@ui-sdk/svelte/field"
  import {
    NumberInput,
    NumberInputDecrement,
    NumberInputGroup,
    NumberInputIncrement,
    NumberInputControl,
  } from "@ui-sdk/svelte/number-input"

</script>

<div dir="rtl">
  <Field>
    <FieldLabel>الكمية</FieldLabel>
    <NumberInput defaultValue={1} min={0}>
      <NumberInputGroup>
        <NumberInputDecrement aria-label="إنقاص">
          <Minus />
        </NumberInputDecrement>
        <NumberInputControl />
        <NumberInputIncrement aria-label="زيادة">
          <Plus />
        </NumberInputIncrement>
      </NumberInputGroup>
    </NumberInput>
  </Field>
</div>
