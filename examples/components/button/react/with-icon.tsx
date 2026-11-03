import { Button } from "@ui-sdk/react/button"
import { ChevronRightIcon, PlusIcon } from "lucide-react"

export function Example() {
  return (
    <div data-slot="row">
      <Button>
        <PlusIcon />
        New project
      </Button>
      <Button>
        Continue
        <ChevronRightIcon />
      </Button>
    </div>
  )
}
