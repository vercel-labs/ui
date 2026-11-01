"use client"

import { Checkbox, CheckboxIndicator } from "@ui-sdk/react/checkbox"
import { Check, Minus } from "lucide-react"

function Example() {
  return (
    <label data-slot="label">
      <Checkbox defaultChecked="indeterminate">
        <CheckboxIndicator
          render={(props, state) => (
            <span {...props}>
              {state.indeterminate ? <Minus aria-hidden="true" /> : <Check aria-hidden="true" />}
            </span>
          )}
        />
      </Checkbox>
      All notifications
    </label>
  )
}

export { Example }
