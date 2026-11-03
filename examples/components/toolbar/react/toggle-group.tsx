"use client"

import { Toggle, ToggleGroup } from "@ui-sdk/react/toggle"
import { Toolbar, ToolbarButton, ToolbarSeparator } from "@ui-sdk/react/toolbar"
import { BoldIcon, CodeIcon, ItalicIcon, StrikethroughIcon } from "lucide-react"
import * as React from "react"

const formats = [
  { value: "bold", label: "Bold", icon: BoldIcon },
  { value: "italic", label: "Italic", icon: ItalicIcon },
  { value: "strikethrough", label: "Strikethrough", icon: StrikethroughIcon },
]

function Example() {
  const [style, setStyle] = React.useState<string[]>(["bold"])
  return (
    <div data-slot="stack">
      <Toolbar aria-label="Text">
        <ToggleGroup multiple value={style} onValueChange={setStyle} aria-label="Text style">
          {formats.map(({ value, label, icon: Icon }) => (
            <Toggle data-variant="ghost" key={value} value={value} aria-label={label}>
              <Icon />
            </Toggle>
          ))}
        </ToggleGroup>
        <ToolbarSeparator />
        <Toggle data-variant="ghost" aria-label="Code">
          <CodeIcon />
        </Toggle>
        <ToolbarButton data-variant="secondary" onClick={() => setStyle([])}>
          Clear
        </ToolbarButton>
      </Toolbar>
      <output data-slot="output">Style: {style.join(", ") || "none"}</output>
    </div>
  )
}

export { Example }
