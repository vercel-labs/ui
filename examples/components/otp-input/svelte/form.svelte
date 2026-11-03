<script lang="ts">
  import { Field, FieldDescription, FieldError, FieldLabel } from "@ui-sdk/svelte/field"
  import { OTPInput, OTPInputGroup, OTPInputSlot } from "@ui-sdk/svelte/otp-input"

  let submitted = $state("")

  function onSubmit(event: Event) {
    const data = [...new FormData(event.currentTarget as HTMLFormElement)].map(
      ([name, value]) => `${name}=${value}`,
    )
    submitted = data.join(", ")
  }
</script>

<div data-slot="stack">
  <form id="verify" data-slot="stack" onsubmit={(event) => { event.preventDefault(); onSubmit(event) }} onreset={() => (submitted = '')}>
    <Field>
      <FieldLabel>Verification code</FieldLabel>
      <OTPInput name="code" required autoComplete="one-time-code">
        <OTPInputGroup>
          {#each { length: 6 } as _, index}
            <OTPInputSlot index={index} />
          {/each}
        </OTPInputGroup>
      </OTPInput>
      <FieldDescription>Enter the six-digit code from your message.</FieldDescription>
      <div><FieldError /></div>
    </Field>
    <div data-slot="row">
      <button type="submit">Verify</button>
      <button type="reset">Reset</button>
    </div>
  </form>
  <Field>
    <FieldLabel>Recovery code (optional)</FieldLabel>
    <OTPInput name="recovery" form="verify" maxLength={8} pattern="alphanumeric">
      <OTPInputGroup>
        {#each { length: 8 } as _, index}
          <OTPInputSlot index={index} />
        {/each}
      </OTPInputGroup>
    </OTPInput>
  </Field>
  <output data-slot="output">{submitted ? `Submitted: ${submitted}` : ""}</output>
</div>
