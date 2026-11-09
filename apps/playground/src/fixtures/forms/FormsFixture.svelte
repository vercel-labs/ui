<script lang="ts">
  import type { CheckedState } from "@ui-sdk/core/checkbox"
  import {
    Checkbox,
    CheckboxGroup,
    CheckboxIndicator,
    Field,
    FieldControl,
    FieldDescription,
    FieldError,
    FieldLabel,
    Radio,
    RadioGroup,
    RadioIndicator,
    Switch,
    SwitchThumb,
  } from "@ui-sdk/svelte"
  import {
    formsFixture as f,
    formsOptions,
    serialize,
  } from "tests/fixtures/forms.ts"

  const options = formsOptions()
  let action = $state("")
  let source = $state("")
  let submitted = $state("")
  let terms = $state<CheckedState>(false)
  let shipping = $state(false)
  const all = f.toppings.items.map((item) => item.value)

  // Records a change, or cancels it when the URL asks.
  function report(
    name: string,
    value: unknown,
    details: { cancel: () => void; source: string }
  ) {
    if (options.cancel === name) {
      return details.cancel()
    }
    action = `${name}:${String(value)}`
    source = details.source
  }

  function onTerms(
    checked: CheckedState,
    details: { cancel: () => void; canceled: boolean; source: string }
  ) {
    report(f.terms.name, checked, details)
    if (!details.canceled) {
      terms = checked
    }
  }

  function onToppings(
    value: string[],
    details: { cancel: () => void; source: string }
  ) {
    report(f.toppings.name, value.join(","), details)
  }

  function onPlan(
    value: string | null,
    details: { cancel: () => void; source: string }
  ) {
    report(f.plan.name, value, details)
  }

  function onSubmit(event: SubmitEvent) {
    event.preventDefault()
    submitted = serialize(event.currentTarget as HTMLFormElement)
  }
</script>

<div class="fixture">
  <button>Before</button>
  <form class="form" id={f.formId} aria-label={f.formLabel} onsubmit={onSubmit}>
    <Field>
      <div class="row">
        <Checkbox
          class="checkbox"
          name={f.terms.name}
          value={f.terms.value}
          required
          readOnly={options.readOnly}
          checked={options.controlled ? terms : undefined}
          onCheckedChange={onTerms}
        >
          <CheckboxIndicator class="checkbox-indicator" />
        </Checkbox>
        <FieldLabel>{f.terms.label}</FieldLabel>
      </div>
      <FieldDescription>{f.terms.description}</FieldDescription>
      <FieldError class="field-error" match="valueMissing"
        >{f.terms.error}</FieldError
      >
    </Field>

    <fieldset>
      <legend id={f.toppings.legendId}>{f.toppings.legend}</legend>
      <CheckboxGroup
        class="form"
        aria-labelledby={f.toppings.legendId}
        name={f.toppings.name}
        defaultValue={f.toppings.defaultValue}
        allValues={all}
        required={options.toppingsRequired}
        onValueChange={onToppings}
      >
        <label>
          <Checkbox class="checkbox" parent>
            <CheckboxIndicator class="checkbox-indicator" />
          </Checkbox>
          {f.toppings.parent}
        </label>
        {#each f.toppings.items as item (item.value)}
          <label>
            <Checkbox class="checkbox" value={item.value}>
              <CheckboxIndicator class="checkbox-indicator" />
            </Checkbox>
            {item.label}
          </label>
        {/each}
      </CheckboxGroup>
    </fieldset>

    {#each f.switches as item (item.name)}
      <label>
        <Switch
          class="switch"
          name={item.name}
          defaultChecked={item.defaultChecked}
          onCheckedChange={(checked, details) =>
            report(item.name, checked, details)}
        >
          <SwitchThumb class="switch-thumb" />
        </Switch>
        {item.label}
      </label>
    {/each}

    <Field>
      <FieldLabel>{f.plan.label}</FieldLabel>
      <RadioGroup
        class="form"
        name={f.plan.name}
        required
        defaultValue={options.plan}
        readOnly={options.readOnly}
        disabled={options.disabled}
        loop={options.loop}
        onValueChange={onPlan}
      >
        {#each f.plan.items as item (item.value)}
          <label>
            <Radio class="radio" value={item.value} disabled={item.disabled}>
              <RadioIndicator class="radio-indicator" />
            </Radio>
            {item.label}
          </label>
        {/each}
      </RadioGroup>
      <FieldDescription>{f.plan.description}</FieldDescription>
      <FieldError class="field-error" />
    </Field>

    <Field invalid={options.invalid}>
      <FieldLabel>{f.email.label}</FieldLabel>
      <FieldControl type="email" name={f.email.name} required />
      <FieldDescription>{f.email.description}</FieldDescription>
      <FieldError class="field-error" />
    </Field>

    {#if options.nickname}
      <Field>
        <FieldLabel>{f.nickname.label}</FieldLabel>
        <FieldControl name={f.nickname.name} required />
      </Field>
    {/if}

    <fieldset disabled={shipping}>
      <legend>{f.shipping.legend}</legend>
      <label>
        <Checkbox class="checkbox" name={f.shipping.name}>
          <CheckboxIndicator class="checkbox-indicator" />
        </Checkbox>
        {f.shipping.label}
      </label>
    </fieldset>

    <div class="row">
      <button type="submit">Save</button>
      <button type="reset">Reset</button>
    </div>
  </form>
  <label>
    <Checkbox
      class="checkbox"
      form={f.formId}
      name={f.newsletter.name}
      value={f.newsletter.value}
    >
      <CheckboxIndicator class="checkbox-indicator" />
    </Checkbox>
    {f.newsletter.label}
  </label>
  <button type="button" onclick={() => (shipping = !shipping)}
    >Toggle shipping</button
  >
  <button>After</button>
  <output role="status" aria-label="Last action">{action}</output>
  <output aria-label="Last source">{source}</output>
  <output role="status" aria-label="Submitted">{submitted}</output>
</div>
