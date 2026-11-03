import { registerShortcut } from "@ui-sdk/core/shortcuts"
import { Tooltip, TooltipContent, TooltipShortcut, TooltipTrigger } from "@ui-sdk/solid/tooltip"
import { createEffect, createSignal } from "solid-js"

function Example() {
  const [status, setStatus] = createSignal("Nothing yet")
  const save = () => setStatus("Saved")
  const share = () => setStatus("Shared")

  createEffect(
    () => 0,
    () => {
      const offSave = registerShortcut("mod+s", save)
      const offShare = registerShortcut("mod+shift+e", share)
      return () => {
        offSave()
        offShare()
      }
    },
  )

  return (
    <div data-slot="stack">
      <div data-slot="row">
        <Tooltip shortcut="mod+s">
          <TooltipTrigger onClick={save}>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" />
              <path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7" />
              <path d="M7 3v4a1 1 0 0 0 1 1h7" />
            </svg>
          </TooltipTrigger>
          <TooltipContent>
            Save
            <TooltipShortcut />
          </TooltipContent>
        </Tooltip>
        <Tooltip shortcut="mod+shift+e">
          <TooltipTrigger onClick={share}>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <circle cx="18" cy="5" r="3" />
              <circle cx="6" cy="12" r="3" />
              <circle cx="18" cy="19" r="3" />
              <line x1="8.59" x2="15.42" y1="13.51" y2="17.49" />
              <line x1="15.41" x2="8.59" y1="6.51" y2="10.49" />
            </svg>
            Share
          </TooltipTrigger>
          <TooltipContent>
            Share with your team
            <TooltipShortcut render={(props, state) => <kbd {...props}>{state.text}</kbd>} />
          </TooltipContent>
        </Tooltip>
      </div>
      <output data-slot="output">{status()}</output>
    </div>
  )
}

export { Example }
