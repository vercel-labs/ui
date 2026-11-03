import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverTitle,
  PopoverTrigger,
} from "@ui-sdk/solid/popover"
import { createSignal } from "solid-js"

function Example() {
  const [anchor, setAnchor] = createSignal<HTMLInputElement>()

  return (
    <div data-slot="row">
      <input ref={setAnchor} placeholder="Search" aria-label="Search" />
      <Popover>
        <PopoverTrigger aria-label="Search filters">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        </PopoverTrigger>
        <PopoverContent anchor={anchor()} align="start" sideOffset={8}>
          <PopoverTitle>Filters</PopoverTitle>
          <PopoverDescription>The popover lines up with the search field.</PopoverDescription>
        </PopoverContent>
      </Popover>
    </div>
  )
}

export { Example }
