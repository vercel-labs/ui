import { Button } from "@ui-sdk/solid/button"

export function Example() {
  return (
    <div data-slot="row">
      <Button data-shape="round">Subscribe</Button>
      <Button data-shape="round" aria-label="Scroll to top">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path d="m5 12 7-7 7 7" />
          <path d="M12 19V5" />
        </svg>
      </Button>
    </div>
  )
}
