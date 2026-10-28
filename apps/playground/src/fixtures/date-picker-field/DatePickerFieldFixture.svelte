<script lang="ts">
  import {
    DatePicker,
    DatePickerContent,
    DatePickerHint,
    DatePickerInput,
    DatePickerTrigger,
  } from "@ui-sdk/svelte/date-picker"
  import { Field, FieldDescription, FieldError, FieldLabel } from "@ui-sdk/svelte/field"
  import {
    datePickerFieldFixture as f,
    datePickerFieldOptions,
    datePickerFixture,
  } from "tests/fixtures/date-picker.ts"

  const { required, disabled } = datePickerFieldOptions()
  let submitted = $state("")
  let shown = $state(true)

  function onSubmit(event: SubmitEvent) {
    event.preventDefault()
    submitted = JSON.stringify([...new FormData(event.currentTarget as HTMLFormElement)])
  }
</script>

<div class="fixture">
  <button>Before</button>
  <form onsubmit={onSubmit}>
    <Field class="field" name={datePickerFixture.name} {disabled}>
      <FieldLabel>{f.label}</FieldLabel>
      {#if shown}
        <DatePicker class="date-picker" today={datePickerFixture.today} {required}>
          <DatePickerInput />
          <DatePickerTrigger />
          <DatePickerHint class="date-picker-hint" />
          <DatePickerContent class="date-picker-content" />
        </DatePicker>
      {/if}
      <FieldDescription>{f.description}</FieldDescription>
      <FieldError class="field-error" />
    </Field>
    <button type="submit">Submit</button>
    <button type="button" onclick={() => (shown = false)}>Remove date picker</button>
  </form>
  <output role="status" aria-label="Submitted">{submitted}</output>
</div>
