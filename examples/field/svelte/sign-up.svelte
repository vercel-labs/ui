<script lang="ts">
  import { Check } from "@lucide/svelte"
  import { Checkbox, CheckboxIndicator } from "@ui-sdk/svelte/checkbox"
  import { Field, FieldControl, FieldDescription, FieldError, FieldLabel } from "@ui-sdk/svelte/field"
  import { Radio, RadioGroup, RadioIndicator } from "@ui-sdk/svelte/radio"
  import { Switch, SwitchThumb } from "@ui-sdk/svelte/switch"

  const planOptions = [
    { value: "hobby", title: "Hobby", description: "For personal projects." },
    { value: "pro", title: "Pro", description: "For teams that ship daily." },
  ]

  let submitted = $state("")

  function submit(event: SubmitEvent) {
    event.preventDefault()
    const data = new FormData(event.currentTarget as HTMLFormElement)
    submitted = Array.from(data.entries())
      .map(([key, value]) => `${key}: ${key === "password" ? "•".repeat(String(value).length) : value}`)
      .join("\n")
  }
</script>

<form data-slot="stack" onsubmit={submit} onreset={() => (submitted = "")}>
  <Field>
    <FieldLabel>Name</FieldLabel>
    <FieldControl name="name" required autocomplete="name" placeholder="Ada Lovelace" />
    <div>
      <FieldError match="valueMissing">Enter your name.</FieldError>
    </div>
  </Field>
  <Field name="email">
    <FieldLabel>Email</FieldLabel>
    <FieldControl type="email" required autocomplete="email" placeholder="m@example.com" />
    <div>
      <FieldError />
    </div>
  </Field>
  <Field name="password">
    <FieldLabel>Password</FieldLabel>
    <FieldControl type="password" required minlength={8} pattern=".*[0-9].*" autocomplete="new-password" />
    <FieldDescription>At least 8 characters, with a number.</FieldDescription>
    <div>
      <FieldError match="valueMissing">Enter a password.</FieldError>
      <FieldError match="tooShort">Use at least 8 characters.</FieldError>
      <FieldError match="patternMismatch">Include at least one number.</FieldError>
    </div>
  </Field>
  <Field>
    <FieldLabel>Plan</FieldLabel>
    <RadioGroup name="plan" required>
      {#each planOptions as plan (plan.value)}
        <label data-slot="card">
          <Radio value={plan.value}>
            <RadioIndicator />
          </Radio>
          <span data-slot="stack">
            <span>{plan.title}</span>
            <span data-slot="hint">{plan.description}</span>
          </span>
        </label>
      {/each}
    </RadioGroup>
    <div>
      <FieldError match="valueMissing">Choose a plan.</FieldError>
    </div>
  </Field>
  <Field>
    <div data-slot="stack">
      <FieldLabel>Send me updates</FieldLabel>
      <FieldDescription>Product news, about once a month.</FieldDescription>
    </div>
    <Switch name="updates" defaultChecked>
      <SwitchThumb />
    </Switch>
  </Field>
  <Field>
    <div data-slot="row">
      <Checkbox name="terms" required>
        <CheckboxIndicator>
          <Check aria-hidden="true" />
        </CheckboxIndicator>
      </Checkbox>
      <FieldLabel>
        I accept the terms of service
      </FieldLabel>
    </div>
    <div>
      <FieldError match="valueMissing">Accept the terms to continue.</FieldError>
    </div>
  </Field>
  <div data-slot="row">
    <button type="submit">
      Submit
    </button>
    <button type="reset">
      Reset
    </button>
  </div>
  <output data-slot="output"
    aria-label="Submitted"
  >{submitted}</output>
</form>
