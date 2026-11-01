<script lang="ts">
  import { Check } from "@lucide/svelte"
  import { Checkbox, CheckboxGroup, CheckboxIndicator } from "@ui-sdk/svelte/checkbox"
  import { Field, FieldDescription, FieldError, FieldLabel } from "@ui-sdk/svelte/field"

  const channels = [
    { value: "email", label: "Email" },
    { value: "sms", label: "SMS" },
    { value: "push", label: "Push notifications" },
  ]

  let saved = $state<string | null>(null)

  function onSubmit(event: SubmitEvent) {
    event.preventDefault()
    saved = new FormData(event.target as HTMLFormElement).getAll("notifications").join(", ")
  }
</script>

<form data-slot="stack" onsubmit={onSubmit}>
  <Field>
    <FieldLabel>Notifications</FieldLabel>
    <FieldDescription>
      Choose how we tell you about your orders.
    </FieldDescription>
    <CheckboxGroup name="notifications" required>
      {#each channels as channel (channel.value)}
        <label data-slot="label">
          <Checkbox value={channel.value}>
            <CheckboxIndicator>
              <Check aria-hidden="true" />
            </CheckboxIndicator>
          </Checkbox>
          {channel.label}
        </label>
      {/each}
    </CheckboxGroup>
    <div><FieldError>Choose at least one way to be notified.</FieldError></div>
  </Field>
  <button type="submit">
    Save
  </button>
  <output data-slot="output">{saved !== null ? `notifications: ${saved}` : ""}</output>
</form>
