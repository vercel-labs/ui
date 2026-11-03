"use client"

import { registerShortcut } from "@ui-sdk/core/shortcuts"
import { Tooltip, TooltipContent, TooltipShortcut, TooltipTrigger } from "@ui-sdk/react/tooltip"
import { SaveIcon, Share2Icon } from "lucide-react"
import * as React from "react"

function Example() {
  const [status, setStatus] = React.useState("Nothing yet")
  const save = () => setStatus("Saved")
  const share = () => setStatus("Shared")

  React.useEffect(() => {
    const offSave = registerShortcut("mod+s", save)
    const offShare = registerShortcut("mod+shift+e", share)
    return () => {
      offSave()
      offShare()
    }
  }, [])

  return (
    <div data-slot="stack">
      <div data-slot="row">
        <Tooltip shortcut="mod+s">
          <TooltipTrigger onClick={save}>
            <SaveIcon />
          </TooltipTrigger>
          <TooltipContent>
            Save
            <TooltipShortcut />
          </TooltipContent>
        </Tooltip>
        <Tooltip shortcut="mod+shift+e">
          <TooltipTrigger onClick={share}>
            <Share2Icon />
            Share
          </TooltipTrigger>
          <TooltipContent>
            Share with your team
            <TooltipShortcut render={(props, state) => <kbd {...props}>{state.text}</kbd>} />
          </TooltipContent>
        </Tooltip>
      </div>
      <output data-slot="output">{status}</output>
    </div>
  )
}

export { Example }
