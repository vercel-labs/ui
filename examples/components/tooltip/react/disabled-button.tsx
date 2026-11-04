"use client"

import { Field, FieldControl, FieldLabel } from "@ui-sdk/react/field"
import { Tooltip, TooltipContent, TooltipTrigger } from "@ui-sdk/react/tooltip"
import * as React from "react"
import { useLog } from "../../../shared/react/log"

function Example() {
  const log = useLog()
  const [title, setTitle] = React.useState("")
  const blocked = !title.trim()

  return (
    <div data-slot="stack">
      <Field>
        <FieldLabel>Post title</FieldLabel>
        <FieldControl value={title} onChange={(event) => setTitle(event.target.value)} />
      </Field>
      <Tooltip disabled={!blocked}>
        <TooltipTrigger
          data-variant="solid"
          aria-disabled={blocked || undefined}
          onClick={() => {
            if (!blocked) log(`Published “${title.trim()}”`)
          }}
        >
          Publish
        </TooltipTrigger>
        <TooltipContent side="right">Add a title to publish</TooltipContent>
      </Tooltip>
    </div>
  )
}

export { Example }
