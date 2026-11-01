import { Button } from "@ui-sdk/react/button"
import { ArrowUp } from "lucide-react"

export function Example() {
  return (
    <div data-slot="row">
      <Button data-shape="round">Subscribe</Button>
      <Button data-shape="round" aria-label="Scroll to top">
        <ArrowUp />
      </Button>
    </div>
  )
}
