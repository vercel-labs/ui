"use client"

import * as React from "react"
import { Toggle, ToggleIcon } from "@ui-sdk/react/toggle"
import { PinIcon } from "lucide-react"

function Example() {
  const hint = React.useId()
  return (
    <div data-slot="stack">
      <Toggle disabled focusableWhenDisabled aria-describedby={hint}>
        <ToggleIcon>
          <PinIcon />
        </ToggleIcon>
        Pin to top
      </Toggle>
      <p id={hint} data-slot="hint">
        Only owners can pin messages.
      </p>
    </div>
  )
}

export { Example }
