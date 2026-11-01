import { Button } from "@ui-sdk/react/button"
import { Trash } from "lucide-react"

export function Example() {
  return (
    <Button data-variant="destructive">
      <Trash />
      Delete
    </Button>
  )
}
