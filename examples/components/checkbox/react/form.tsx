"use client"

import * as React from "react"
import { Checkbox, CheckboxIndicator } from "@ui-sdk/react/checkbox"
import { CheckIcon } from "lucide-react"

const formId = "checkbox-signup"

function Example() {
  const [submitted, setSubmitted] = React.useState("")

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
              <CheckIcon aria-hidden="true" />
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
            <CheckIcon aria-hidden="true" />
          </CheckboxIndicator>
        </Checkbox>
        Send me the weekly newsletter
      </label>
      <output data-slot="output">{submitted && `Submitted: ${submitted}`}</output>
    </div>
  )
}

export { Example }
