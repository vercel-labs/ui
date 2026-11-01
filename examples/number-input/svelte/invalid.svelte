<script lang="ts">
  import { Minus, Plus } from "@lucide/svelte"
  import { Field, FieldError, FieldLabel } from "@ui-sdk/svelte/field"
  import {
    NumberInput,
    NumberInputDecrement,
    NumberInputGroup,
    NumberInputIncrement,
    NumberInputControl,
  } from "@ui-sdk/svelte/number-input"

  let submitted = $state("")

  function onSubmit(event: Event) {
    submitted = String(new FormData(event.currentTarget as HTMLFormElement).get("age"))
  }
</script>

<form data-slot="stack" onsubmit={(event) => { event.preventDefault(); onSubmit(event) }}>
  <Field>
    <FieldLabel>Age</FieldLabel>
    <NumberInput name="age" required min={18} max={120} onValueChange={() => (submitted = '')}>
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
    <div><FieldError match="valueMissing">Enter your age.</FieldError></div>
  </Field>
  <button type="submit">
    Continue
  </button>
  <output data-slot="output">{submitted ? `Submitted: age=${submitted}` : ""}</output>
</form>
