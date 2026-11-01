<script lang="ts">
  import { Field, FieldDescription, FieldError, FieldLabel } from "@ui-sdk/svelte/field"
  import { Radio, RadioGroup, RadioIndicator } from "@ui-sdk/svelte/radio"

  const options = [
    { value: "email", label: "Email only" },
    { value: "sms", label: "SMS only" },
    { value: "both", label: "Both email and SMS" },
  ]

  let saved = $state("")

  function submit(event: SubmitEvent) {
    event.preventDefault()
    saved = String(new FormData(event.currentTarget as HTMLFormElement).get("notifications"))
  }
</script>

<form data-slot="stack" onsubmit={submit}>
  <Field>
    <FieldLabel>Notification preferences</FieldLabel>
    <FieldDescription>
      Choose how you want to receive notifications.
    </FieldDescription>
    <RadioGroup name="notifications" required>
      {#each options as option (option.value)}
        <label data-slot="label">
          <Radio value={option.value}>
            <RadioIndicator />
          </Radio>
          {option.label}
        </label>
      {/each}
    </RadioGroup>
    <FieldError>Choose how to receive notifications.</FieldError>
  </Field>
  <button type="submit">
    Save
  </button>
  {#if saved}
    <output data-slot="output">Saved: {saved}</output>
  {/if}
</form>
