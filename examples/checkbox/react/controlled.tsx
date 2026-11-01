"use client"

import * as React from "react"
import { createCheckboxController, type CheckedState } from "@ui-sdk/core/checkbox"
import { Checkbox, CheckboxIndicator } from "@ui-sdk/react/checkbox"
import { Check } from "lucide-react"

function Example() {
  const [updates] = React.useState(() => createCheckboxController())
  const [checked, setChecked] = React.useState<CheckedState>(false)
  const [reason, setReason] = React.useState("")

  return (
    <div data-slot="stack">
      <label data-slot="label">
        <Checkbox
          checked={checked}
          onCheckedChange={(next, details) => {
            setChecked(next)
            setReason(details.reason)
          }}
          controller={updates}
        >
          <CheckboxIndicator>
            <Check aria-hidden="true" />
          </CheckboxIndicator>
        </Checkbox>
        Email me about product updates
      </label>
      <button type="button" onClick={() => updates.toggle()}>
        Toggle from outside
      </button>
      <output data-slot="output">
        Checked: {String(checked)}
        {reason && `, last change: ${reason}`}
      </output>
    </div>
  )
}

export { Example }
