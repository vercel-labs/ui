import { Tooltip, TooltipContent, TooltipTrigger } from "@ui-sdk/solid/tooltip"
import { createSignal, createUniqueId } from "solid-js"

function Example() {
  const id = createUniqueId()
  const [field, setField] = createSignal<HTMLDivElement | null>(null)

  return (
    <div data-slot="stack">
      <label data-slot="label" for={id}>
        Webhook URL
      </label>
      <div data-slot="row" ref={setField}>
        <input id={id} placeholder="https://" />
        <Tooltip>
          <TooltipTrigger aria-label="About webhooks">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4" />
              <path d="M12 8h.01" />
            </svg>
          </TooltipTrigger>
          <TooltipContent anchor={field()} align="start">
            We send a POST request to this URL for every new order.
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  )
}

export { Example }
