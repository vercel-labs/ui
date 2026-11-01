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

  const fields = [
    {
      label: "Preis",
      locale: "de-DE",
      defaultValue: 1234.5,
      step: 0.01,
      format: { style: "currency", currency: "EUR" },
    },
    {
      label: "Budget",
      locale: "en-IN",
      defaultValue: 1234567,
      step: 1000,
      format: { style: "currency", currency: "INR", maximumFractionDigits: 0 },
    },
  ] satisfies {
    label: string
    locale: string
    defaultValue: number
    step: number
    format: Intl.NumberFormatOptions
  }[]

</script>

<div data-slot="stack">
  {#each fields as field (field.label)}
    <Field>
      <FieldLabel>{field.label}</FieldLabel>
      <NumberInput
        defaultValue={field.defaultValue}
        step={field.step}
        format={field.format}
        locale={field.locale}
        min={0}
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
      <FieldDescription >Formatted for {field.locale}.</FieldDescription>
    </Field>
  {/each}
</div>
