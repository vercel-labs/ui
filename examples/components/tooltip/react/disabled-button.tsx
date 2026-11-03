"use client"

import { Tooltip, TooltipContent, TooltipTrigger } from "@ui-sdk/react/tooltip"
import * as React from "react"

function Example() {
  const [title, setTitle] = React.useState("")
  const [status, setStatus] = React.useState("Draft")
  const blocked = !title.trim()

  return (
    <div data-slot="stack">
      <input
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        placeholder="Post title"
        aria-label="Post title"
      />
      <div data-slot="row">
        <Tooltip disabled={!blocked}>
          <TooltipTrigger
            aria-disabled={blocked || undefined}
            onClick={() => {
              if (!blocked) {
                setStatus(`Published “${title.trim()}”`)
              }
            }}
          >
            Publish
          </TooltipTrigger>
          <TooltipContent>Add a title to publish</TooltipContent>
        </Tooltip>
        <output data-slot="output">{status}</output>
      </div>
    </div>
  )
}

export { Example }
