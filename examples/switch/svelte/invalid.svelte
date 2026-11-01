<script lang="ts">
  import { Field, FieldError, FieldLabel } from "@ui-sdk/svelte/field"
  import { Switch, SwitchThumb } from "@ui-sdk/svelte/switch"

  let submitted = $state(false)

  function onSubmit(event: SubmitEvent) {
    event.preventDefault()
    submitted = true
  }
</script>

<form data-slot="stack" onsubmit={onSubmit}>
  <Field>
    <div data-slot="row">
      <Switch name="terms" required onCheckedChange={() => (submitted = false)}>
        <SwitchThumb />
      </Switch>
      <FieldLabel>I agree to the terms</FieldLabel>
    </div>
    <div>
      <FieldError match="valueMissing">
        You must agree to the terms to continue.
      </FieldError>
    </div>
  </Field>
  <button type="submit">
    Continue
  </button>
  <output data-slot="output">{submitted ? "Thanks, you're all set." : ""}</output>
</form>
