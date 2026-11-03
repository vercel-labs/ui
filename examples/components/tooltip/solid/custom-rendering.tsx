import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverTitle,
  PopoverTrigger,
} from "@ui-sdk/solid/popover"
import { Tooltip, TooltipContent, TooltipTrigger } from "@ui-sdk/solid/tooltip"

function Example() {
  return (
    <div data-slot="row">
      <Popover>
        <Tooltip>
          <TooltipTrigger render={(props) => <PopoverTrigger {...props} />}>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <path d="M10.268 21a2 2 0 0 0 3.464 0" />
              <path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326" />
            </svg>
          </TooltipTrigger>
          <TooltipContent>Notifications</TooltipContent>
        </Tooltip>
        <PopoverContent sideOffset={8}>
          <PopoverTitle>Notifications</PopoverTitle>
          <PopoverDescription>You're all caught up.</PopoverDescription>
        </PopoverContent>
      </Popover>
      <Tooltip>
        <TooltipTrigger
          data-variant="link"
          render={(props) => <a {...props} href="https://example.com/changelog" />}
        >
          Changelog
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="M15 3h6v6" />
            <path d="M10 14 21 3" />
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
          </svg>
        </TooltipTrigger>
        <TooltipContent>What's new in 2.0</TooltipContent>
      </Tooltip>
    </div>
  )
}

export { Example }
