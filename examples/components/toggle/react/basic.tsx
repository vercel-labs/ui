import { Toggle, ToggleIcon } from "@ui-sdk/react/toggle"
import { BookmarkIcon } from "lucide-react"

function Example() {
  return (
    <Toggle aria-label="Bookmark">
      <ToggleIcon data-variant="fill">
        <BookmarkIcon />
      </ToggleIcon>
    </Toggle>
  )
}

export { Example }
