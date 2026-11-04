<script lang="ts">
  import type { ChangeDetails } from "@ui-sdk/core"
  import type { InputValueChangeReason } from "@ui-sdk/core/input"
  import {
    Field,
    FieldDescription,
    FieldError,
    FieldLabel,
    FieldLegend,
    FieldSet,
    Input,
    InputClear,
    InputGroup,
    Textarea,
  } from "@ui-sdk/svelte"
  import {
    formFixture as f,
    formOptions,
    invalidOf,
    messageOf,
    save,
    serializeData,
    without,
    type FormErrors,
  } from "tests/fixtures/form.ts"

  const options = formOptions()
  let errors = $state<FormErrors | undefined>(options.errors)
  let action = $state("")
  let submitted = $state("")
  let username = $state("")
  let contactDisabled = $state(false)

  let pending = false

  async function onsubmit(event: SubmitEvent) {
    event.preventDefault()
    if (pending) return
    const data = new FormData(event.currentTarget as HTMLFormElement)
    pending = true
    try {
      const result = await save(data, options.action)
      errors = result
      if (!result) submitted = serializeData(data)
    } catch {
      // The fake server failed. The page keeps what it showed.
    } finally {
      pending = false
    }
  }

  function onUsername(value: string, details: ChangeDetails<InputValueChangeReason>) {
    if (options.noDigits && /\d/.test(value)) return details.cancel()
    action = `${f.username.name}:${value}:${details.reason}`
    username = value
    errors = without(errors, f.username.name)
  }

  function onWebsite(value: string, details: ChangeDetails<InputValueChangeReason>) {
    action = `${f.website.name}:${value}:${details.reason}`
  }
</script>

<div class="fixture">
  <button>Before</button>
  <form class="form" aria-label={f.formLabel} {onsubmit} onreset={() => (errors = undefined)}>
      <FieldSet class="form" disabled={options.disabled || undefined}>
        <FieldLegend>{f.profile.legend}</FieldLegend>
        <FieldDescription>{f.profile.description}</FieldDescription>
        <Field name={f.username.name} invalid={invalidOf(errors, f.username.name)}>
          <FieldLabel class="label">{f.username.label}</FieldLabel>
          <Input
            class="input"
            required
            minlength={3}
            value={options.controlled ? username : undefined}
            onValueChange={onUsername}
          />
          <FieldDescription>{f.username.description}</FieldDescription>
          <FieldError class="field-error">
            {#snippet children(state)}{messageOf(errors, f.username.name) || state.message}{/snippet}
          </FieldError>
        </Field>
        <Field name={f.bio.name} invalid={invalidOf(errors, f.bio.name)}>
          <FieldLabel class="label">{f.bio.label}</FieldLabel>
          <Textarea class="textarea" autoResize submitShortcut={options.submitShortcut} />
          <FieldDescription>{f.bio.description}</FieldDescription>
          <FieldError class="field-error">
            {#snippet children(state)}{messageOf(errors, f.bio.name) || state.message}{/snippet}
          </FieldError>
        </Field>
      </FieldSet>
      <FieldSet class="form" disabled={contactDisabled || undefined}>
        <FieldLegend>{f.contact.legend}</FieldLegend>
        <Field name={f.email.name} invalid={invalidOf(errors, f.email.name)}>
          <FieldLabel class="label">{f.email.label}</FieldLabel>
          <Input
            class="input"
            type="email"
            defaultValue={f.email.defaultValue}
            onValueChange={() => (errors = without(errors, f.email.name))}
          />
          <FieldError class="field-error">
            {#snippet children(state)}{messageOf(errors, f.email.name) || state.message}{/snippet}
          </FieldError>
        </Field>
        <Field name={f.website.name}>
          <FieldLabel class="label">{f.website.label}</FieldLabel>
          <InputGroup class="input-group">
            <span>{f.website.prefix}</span>
            <Input class="input" onValueChange={onWebsite} />
            <InputClear aria-label={f.website.clear}>×</InputClear>
          </InputGroup>
        </Field>
      </FieldSet>
      <div class="row">
        <button type="submit">Save</button>
        <button type="reset">Reset</button>
      </div>
  </form>
  <button type="button" onclick={() => (contactDisabled = !contactDisabled)}>Toggle contact</button>
  <button>After</button>
  <output role="status" aria-label="Last action">{action}</output>
  <output role="status" aria-label="Submitted">{submitted}</output>
</div>
