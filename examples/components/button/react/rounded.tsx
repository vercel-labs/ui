import { Button } from "@ui-sdk/react/button"
import { ArrowUpIcon } from "lucide-react"

export function Example() {
  return (
    <div data-slot="row">
      <Button data-shape="round">Subscribe</Button>
      <Button data-shape="round" aria-label="Scroll to top">
        <ArrowUpIcon />
      </Button>
    </div>
  )
}
