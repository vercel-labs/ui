<script lang="ts">
  import type { ChangeDetails } from "@ui-sdk/core"
  import {
    createPasswordInputController,
    Field,
    FieldDescription,
    FieldLabel,
    PasswordInput,
    PasswordInputControl,
    PasswordInputToggle,
  } from "@ui-sdk/svelte"
  import {
    passwordInputAction,
    passwordInputFixture,
    passwordInputOptions,
  } from "tests/fixtures/password-input.ts"

  const { controlled, cancel, ...options } = passwordInputOptions()
  const { form, email, password } = passwordInputFixture
  const reveal = createPasswordInputController()
  let action = $state("")
  let visible = $state(!!options.defaultVisible)

  function onVisibleChange(next: boolean, details: ChangeDetails) {
    if (cancel) {
      return details.cancel()
    }
    visible = next
    action = passwordInputAction.visible(next, details.reason)
  }

  function onSubmit(event: SubmitEvent) {
    event.preventDefault()
    const field = (event.currentTarget as HTMLFormElement).elements.namedItem(
      password.name
    ) as HTMLInputElement
    action = passwordInputAction.submit(field.type)
  }
</script>

<div class="fixture">
  <button>Before</button>
  <form aria-label={form.label} class="password-form" onsubmit={onSubmit}>
    <fieldset>
      <legend>{form.account}</legend>
      <label>
        {email.label}
        <input class="input" name={email.name} value={email.defaultValue} />
      </label>
      <Field>
        <FieldLabel>{password.label}</FieldLabel>
        <PasswordInput
          class="password-input"
          name={password.name}
          controller={reveal}
          {...options}
          visible={controlled ? visible : undefined}
          defaultVisible={controlled ? undefined : options.defaultVisible}
          {onVisibleChange}
        >
          <PasswordInputControl class="input" />
          <PasswordInputToggle
            class="password-toggle"
            aria-label={password.toggle}
          >
            <span aria-hidden="true">👁</span>
          </PasswordInputToggle>
        </PasswordInput>
        <FieldDescription>{password.description}</FieldDescription>
      </Field>
      <p class="caps-lock">{password.capsLock}</p>
    </fieldset>
    <button type="submit">{form.submit}</button>
    <button type="reset">{form.reset}</button>
  </form>
  <button onclick={() => reveal.toggleVisible()}
    >{passwordInputFixture.controller}</button
  >
  <button>After</button>
  <output role="status" aria-label="Last action">{action}</output>
</div>
