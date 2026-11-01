import { Button } from "@ui-sdk/react/button"
import { ChevronRight, Plus } from "lucide-react"

export function Example() {
  return (
    <div data-slot="row">
      <Button>
        <Plus />
        New project
      </Button>
      <Button>
        Continue
        <ChevronRight />
      </Button>
    </div>
  )
}
