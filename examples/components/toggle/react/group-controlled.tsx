"use client"

import { Toggle, ToggleGroup, ToggleIcon, createToggleGroupController } from "@ui-sdk/react/toggle"
import { BoldIcon, ItalicIcon, UnderlineIcon } from "lucide-react"
import * as React from "react"

const formatting = [
  { value: "bold", label: "Bold", icon: BoldIcon },
  { value: "italic", label: "Italic", icon: ItalicIcon },
  { value: "underline", label: "Underline", icon: UnderlineIcon },
]

function Example() {
  const [editor] = React.useState(createToggleGroupController)
  const [value, setValue] = React.useState(["bold"])
  const [reason, setReason] = React.useState("")

  return (
    <div data-slot="stack">
      <ToggleGroup
        multiple
        aria-label="Text formatting"
        value={value}
        onValueChange={(next, details) => {
          setValue(next)
          setReason(details.reason)
        }}
        controller={editor}
      >
        {formatting.map((item) => (
          <Toggle key={item.value} value={item.value} aria-label={item.label}>
            <ToggleIcon>
              <item.icon />
            </ToggleIcon>
          </Toggle>
        ))}
      </ToggleGroup>
      <button type="button" onClick={() => editor.setValue([])}>
        Clear
      </button>
      <output data-slot="output">
        Pressed: {value.length ? value.join(", ") : "none"}
        {reason && `, last change: ${reason}`}
      </output>
    </div>
  )
}

export { Example }
