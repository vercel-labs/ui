import { Checkbox, CheckboxIndicator } from "@ui-sdk/solid/checkbox"
import { createSignal } from "solid-js"

const formId = "checkbox-signup"

function Example() {
  const [submitted, setSubmitted] = createSignal("")

  return (
    <div data-slot="stack">
      <form
        data-slot="stack"
        id={formId}
        onSubmit={(event) => {
          event.preventDefault()
          const entries = [...new FormData(event.currentTarget)].map(([name, value]) => `${name}=${value}`)
          setSubmitted(entries.join(", ") || "nothing")
        }}
        onReset={() => setSubmitted("")}
      >
        <label data-slot="label">
          <Checkbox name="terms" value="yes" required>
            <CheckboxIndicator>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <path d="M20 6 9 17l-5-5" />
              </svg>
            </CheckboxIndicator>
          </Checkbox>
          I agree to the terms
        </label>
        <div data-slot="row">
          <button type="submit">Submit</button>
          <button type="reset">Reset</button>
        </div>
      </form>
      <label data-slot="label">
        <Checkbox form={formId} name="newsletter" value="weekly" defaultChecked>
          <CheckboxIndicator>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <path d="M20 6 9 17l-5-5" />
            </svg>
          </CheckboxIndicator>
        </Checkbox>
        Send me the weekly newsletter
      </label>
      <output data-slot="output">{submitted() && `Submitted: ${submitted()}`}</output>
    </div>
  )
}

export { Example }
