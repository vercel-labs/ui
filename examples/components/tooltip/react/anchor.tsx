"use client"

import { Tooltip, TooltipContent, TooltipTrigger } from "@ui-sdk/react/tooltip"
import { InfoIcon } from "lucide-react"
import * as React from "react"

function Example() {
  const id = React.useId()
  const [field, setField] = React.useState<HTMLDivElement | null>(null)

  return (
    <div data-slot="stack">
      <label data-slot="label" htmlFor={id}>
        Webhook URL
      </label>
      <div data-slot="row" ref={setField}>
        <input id={id} placeholder="https://" />
        <Tooltip>
          <TooltipTrigger aria-label="About webhooks">
            <InfoIcon />
          </TooltipTrigger>
          <TooltipContent anchor={field} align="start">
            We send a POST request to this URL for every new order.
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  )
}

export { Example }
