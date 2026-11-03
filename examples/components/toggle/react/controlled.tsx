"use client"

import { createToggleController, Toggle, ToggleIcon } from "@ui-sdk/react/toggle"
import { BellIcon } from "lucide-react"
import * as React from "react"

function Example() {
  const [notifications] = React.useState(createToggleController)
  const [pressed, setPressed] = React.useState(true)
  const [reason, setReason] = React.useState("")

  return (
    <div data-slot="stack">
      <Toggle
        pressed={pressed}
        onPressedChange={(next, details) => {
          setPressed(next)
          setReason(details.reason)
        }}
        controller={notifications}
      >
        <ToggleIcon data-variant="fill">
          <BellIcon />
        </ToggleIcon>
        Notifications
      </Toggle>
      <button type="button" onClick={() => notifications.toggle()}>
        Toggle from outside
      </button>
      <output data-slot="output">
        Notifications: {pressed ? "on" : "off"}
        {reason && `, last change: ${reason}`}
      </output>
    </div>
  )
}

export { Example }
