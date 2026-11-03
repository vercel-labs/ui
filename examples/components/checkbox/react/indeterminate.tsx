"use client"

import { Checkbox, CheckboxIndicator } from "@ui-sdk/react/checkbox"
import { CheckIcon, MinusIcon } from "lucide-react"

function Example() {
  return (
    <label data-slot="label">
      <Checkbox defaultChecked="indeterminate">
        <CheckboxIndicator
          render={(props, state) => (
            <span {...props}>
              {state.indeterminate ? <MinusIcon aria-hidden="true" /> : <CheckIcon aria-hidden="true" />}
            </span>
          )}
        />
      </Checkbox>
      All notifications
    </label>
  )
}

export { Example }
