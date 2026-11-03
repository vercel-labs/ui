import { Tooltip, TooltipArrow, TooltipContent, TooltipTrigger } from "@ui-sdk/solid/tooltip"

function Example() {
  return (
    <div data-slot="row">
      <span data-slot="label">Storage</span>
      <span data-slot="hint">12.4 of 15 GB used</span>
      <Tooltip toggleable>
        <TooltipTrigger aria-label="About storage" data-size="sm">
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
        <TooltipContent sideOffset={8}>
          <TooltipArrow />
          Files in the trash count toward your storage until you empty it.
        </TooltipContent>
      </Tooltip>
    </div>
  )
}

export { Example }
