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

  let submitted = $state("")
  const form = $props.id()

  function onSubmit(event: Event) {
    const data = [...new FormData(event.currentTarget as HTMLFormElement)].map(
      ([name, value]) => `${name}=${value}`,
    )
    submitted = data.join(", ")
  }
</script>

<div data-slot="stack">
  <form data-slot="stack" id={form} onsubmit={(event) => { event.preventDefault(); onSubmit(event) }} onreset={() => (submitted = '')}>
    <Field>
      <FieldLabel>Quantity</FieldLabel>
      <NumberInput name="quantity" defaultValue={2} min={1}>
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
    </Field>
    <Field>
      <FieldLabel>Tip</FieldLabel>
      <NumberInput
        name="tip"
        defaultValue={1234.5}
        min={0}
        step={0.01}
        format={{ style: 'currency', currency: 'USD' }}
      >
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
    </Field>
    <div data-slot="row">
      <button type="submit">
        Save
      </button>
      <button type="reset">
        Reset
      </button>
    </div>
  </form>
  <Field>
    <FieldLabel>Gift cards</FieldLabel>
    <NumberInput name="gift-cards" form={form} defaultValue={0} min={0}>
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
  </Field>
  <output data-slot="output">{submitted ? `Submitted: ${submitted}` : ""}</output>
</div>
