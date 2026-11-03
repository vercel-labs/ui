import { Toggle, ToggleIcon } from "@ui-sdk/react/toggle"
import { ItalicIcon } from "lucide-react"

function Example() {
  return (
    <Toggle>
      <ToggleIcon>
        <ItalicIcon />
      </ToggleIcon>
      Italic
    </Toggle>
  )
}

export { Example }
