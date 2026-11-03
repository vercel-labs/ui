"use client"

import { Tooltip, TooltipContent, TooltipTrigger } from "@ui-sdk/react/tooltip"
import * as React from "react"

const items = ["Inbox", "Drafts", "Sent"]

function Example() {
  const [status, setStatus] = React.useState("Closed")

  return (
    <div data-slot="stack">
      <div data-slot="row">
        {items.map((item) => (
          <Tooltip
            key={item}
            onOpenChange={(open) => setStatus(open ? `${item} opening` : `${item} closing`)}
            onOpenChangeComplete={(open) =>
              setStatus((status) =>
                open ? `${item} open` : status === `${item} closing` ? `${item} closed` : status,
              )
            }
          >
            <TooltipTrigger>{item}</TooltipTrigger>
            <TooltipContent>Open {item.toLowerCase()}</TooltipContent>
          </Tooltip>
        ))}
      </div>
      <output data-slot="output">{status}</output>
    </div>
  )
}

export { Example }
