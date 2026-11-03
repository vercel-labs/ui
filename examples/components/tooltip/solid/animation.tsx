import { Tooltip, TooltipContent, TooltipTrigger } from "@ui-sdk/solid/tooltip"
import { createSignal, For } from "solid-js"

const items = ["Inbox", "Drafts", "Sent"]

function Example() {
  const [status, setStatus] = createSignal("Closed")

  return (
    <div data-slot="stack">
      <div data-slot="row">
        <For each={items}>
          {(item) => (
            <Tooltip
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
          )}
        </For>
      </div>
      <output data-slot="output">{status()}</output>
    </div>
  )
}

export { Example }
