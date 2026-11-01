<script lang="ts">
  import { Check } from "@lucide/svelte"
  import { Checkbox, CheckboxIndicator } from "@ui-sdk/svelte/checkbox"

  const formId = "checkbox-signup"
  let submitted = $state("")

  function onSubmit(event: SubmitEvent) {
    event.preventDefault()
    const data = new FormData(event.currentTarget as HTMLFormElement)
    const entries = [...data].map(([name, value]) => `${name}=${value}`)
    submitted = entries.join(", ") || "nothing"
  }
</script>

<div data-slot="stack">
  <form data-slot="stack" id={formId} onsubmit={onSubmit} onreset={() => (submitted = "")}>
    <label data-slot="label">
      <Checkbox name="terms" value="yes" required>
        <CheckboxIndicator>
          <Check aria-hidden="true" />
        </CheckboxIndicator>
      </Checkbox>
      I agree to the terms
    </label>
    <div data-slot="row">
      <button type="submit">
        Submit
      </button>
      <button type="reset">
        Reset
      </button>
    </div>
  </form>
  <label data-slot="label">
    <Checkbox form={formId} name="newsletter" value="weekly" defaultChecked>
      <CheckboxIndicator>
        <Check aria-hidden="true" />
      </CheckboxIndicator>
    </Checkbox>
    Send me the weekly newsletter
  </label>
  <output data-slot="output">{submitted ? `Submitted: ${submitted}` : ""}</output>
</div>
