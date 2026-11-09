<script lang="ts">
  import {
    Field,
    FieldDescription,
    FieldLabel,
    NumberInput,
    NumberInputControl,
    NumberInputDecrement,
    NumberInputGroup,
    NumberInputIncrement,
    NumberInputScrubArea,
  } from "@ui-sdk/svelte"
  import {
    numberInputFixture as f,
    numberInputOptions,
    serialize,
  } from "tests/fixtures/number-input.ts"

  const options = numberInputOptions()
  let action = $state("")
  let commits = $state<string[]>([])
  let submitted = $state("")
  let quantity = $state<number | null>(options.quantity)
  const shared = {
    wheel: options.wheel,
    disabled: options.disabled,
    readOnly: options.readOnly,
    locale: options.locale,
  }
  const currency = { style: "currency" as const, currency: f.amount.currency }

  // Records a change, or cancels it when the URL asks.
  function report(
    name: string,
    value: number | null,
    details: { cancel: () => void }
  ) {
    if (options.cancel === name) {
      return details.cancel()
    }
    action = `${name}:${String(value)}`
  }

  function commit(name: string, value: number | null) {
    commits = [...commits, `${name}:${String(value)}`]
  }

  function onSubmit(event: SubmitEvent) {
    event.preventDefault()
    submitted = serialize(event.currentTarget as HTMLFormElement)
  }
</script>

<div class="fixture">
  <button>Before</button>
  <form class="form" aria-label={f.formLabel} onsubmit={onSubmit}>
    <!-- The field names the quantity, so the field's name reaches the form. -->
    <Field name={f.quantity.name}>
      <FieldLabel>{f.quantity.label}</FieldLabel>
      <NumberInput
        {...shared}
        min={f.quantity.min}
        max={f.quantity.max}
        required={options.required}
        bind:value={
          () => (options.controlled ? quantity : undefined),
          (next) => (quantity = next ?? null)
        }
        defaultValue={options.controlled ? undefined : options.quantity}
        onValueChange={(value, details) =>
          report(f.quantity.name, value, details)}
        onValueCommit={(value) => commit(f.quantity.name, value)}
      >
        <NumberInputGroup class="number-input-group">
          <NumberInputDecrement aria-label={f.quantity.decrement}
            >−</NumberInputDecrement
          >
          <NumberInputControl class="number-input-control" />
          <NumberInputIncrement
            aria-label={f.quantity.increment}
            disabled={options.disabledIncrement}>+</NumberInputIncrement
          >
        </NumberInputGroup>
      </NumberInput>
      <FieldDescription>{f.quantity.description}</FieldDescription>
    </Field>

    <Field>
      <FieldLabel>{f.amount.label}</FieldLabel>
      <NumberInput
        {...shared}
        name={f.amount.name}
        defaultValue={f.amount.defaultValue}
        min={options.amountMin}
        step={f.amount.step}
        format={currency}
        onValueChange={(value, details) =>
          report(f.amount.name, value, details)}
        onValueCommit={(value) => commit(f.amount.name, value)}
      >
        <NumberInputScrubArea class="number-input-scrub"
          >{f.amount.scrub}</NumberInputScrubArea
        >
        <NumberInputGroup class="number-input-group">
          <NumberInputDecrement aria-label={f.amount.decrement}
            >−</NumberInputDecrement
          >
          <NumberInputControl class="number-input-control" />
          <NumberInputIncrement aria-label={f.amount.increment}
            >+</NumberInputIncrement
          >
        </NumberInputGroup>
      </NumberInput>
    </Field>

    <div class="row">
      <button type="submit">Save</button>
      <button type="reset">Reset</button>
    </div>
  </form>
  <button>After</button>
  <output role="status" aria-label="Last action">{action}</output>
  <output role="status" aria-label="Committed">{commits.join(" ")}</output>
  <output role="status" aria-label="Submitted">{submitted}</output>
</div>
