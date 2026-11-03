"use client"

import { Tooltip, TooltipContent, TooltipTrigger } from "@ui-sdk/react/tooltip"
import { BoldIcon, CodeIcon, ItalicIcon, LinkIcon, UnderlineIcon } from "lucide-react"
import * as React from "react"

const tools = [
  { icon: BoldIcon, label: "Bold" },
  { icon: ItalicIcon, label: "Italic" },
  { icon: UnderlineIcon, label: "Underline" },
  { icon: LinkIcon, label: "Link" },
  { icon: CodeIcon, label: "Code" },
]

const delays = [0, 600, 1200]
const closeDelays = [0, 300]

function Example() {
  const [delay, setDelay] = React.useState(600)
  const [closeDelay, setCloseDelay] = React.useState(0)
  const [enabled, setEnabled] = React.useState(true)

  return (
    <div data-slot="stack">
      <div data-slot="grid">
        <span data-slot="hint">delay</span>
        <div data-slot="row" role="group" aria-label="delay">
          {delays.map((value) => (
            <button
              key={value}
              type="button"
              data-size="sm"
              aria-pressed={delay === value}
              onClick={() => setDelay(value)}
            >
              {value}
            </button>
          ))}
        </div>
        <span data-slot="hint">closeDelay</span>
        <div data-slot="row" role="group" aria-label="closeDelay">
          {closeDelays.map((value) => (
            <button
              key={value}
              type="button"
              data-size="sm"
              aria-pressed={closeDelay === value}
              onClick={() => setCloseDelay(value)}
            >
              {value}
            </button>
          ))}
        </div>
      </div>
      <label data-slot="label">
        <input type="checkbox" checked={enabled} onChange={(event) => setEnabled(event.target.checked)} />
        Show tooltips
      </label>
      <div data-slot="row" role="group" aria-label="Formatting">
        {tools.map((tool) => (
          <Tooltip key={tool.label} delay={delay} closeDelay={closeDelay} disabled={!enabled}>
            <TooltipTrigger>
              <tool.icon />
            </TooltipTrigger>
            <TooltipContent>{tool.label}</TooltipContent>
          </Tooltip>
        ))}
      </div>
    </div>
  )
}

export { Example }
