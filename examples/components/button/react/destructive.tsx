import { Button } from "@ui-sdk/react/button"
import { TrashIcon } from "lucide-react"

export function Example() {
  return (
    <Button data-variant="destructive">
      <TrashIcon />
      Delete
    </Button>
  )
}
