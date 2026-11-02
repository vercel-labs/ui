<script lang="ts">
  import type { ChangeDetails } from "@ui-sdk/core"
  import { createDateInputController, DateInput, Field, FieldError, FieldLabel, TimeInput } from "@ui-sdk/svelte"
  import { dateInputAction, dateInputFixture as f, dateInputOptions } from "tests/fixtures/date-input.ts"

  const controller = createDateInputController()
  const { date, time, cancel, ...shared } = dateInputOptions()
  let action = $state("")
  let submitted = $state("")

  function onDateChange(value: string | null, details: ChangeDetails) {
    if (cancel && value === cancel) return details.cancel()
    action = dateInputAction.change("date", value, details.reason)
  }

  function onTimeChange(value: string | null, details: ChangeDetails) {
    action = dateInputAction.change("time", value, details.reason)
  }

  function onSubmit(event: SubmitEvent) {
    event.preventDefault()
    submitted = JSON.stringify([...new FormData(event.currentTarget as HTMLFormElement)])
  }
</script>

<div class="fixture">
  <button>Before</button>
  <form aria-label={f.form.label} onsubmit={onSubmit}>
    <Field class="field" name={f.date.name}>
      <FieldLabel>{f.date.label}</FieldLabel>
      <DateInput class="date-input" {controller} {...date} {...shared} onValueChange={onDateChange} />
      <FieldError class="field-error" />
    </Field>
    <Field class="field" name={f.time.name}>
      <FieldLabel>{f.time.label}</FieldLabel>
      <TimeInput class="date-input" {...time} {...shared} onValueChange={onTimeChange} />
    </Field>
    <button type="submit">{f.form.submit}</button>
    <button type="reset">{f.form.reset}</button>
  </form>
  <button onclick={() => controller.setValue(f.filled)}>Set date</button>
  <button onclick={() => controller.clear()}>Clear date</button>
  <button>After</button>
  <output role="status" aria-label="Last action">{action}</output>
  <output aria-label="Submitted">{submitted}</output>
</div>
