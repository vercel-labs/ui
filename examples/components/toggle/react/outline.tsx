import { Toggle, ToggleIcon } from "@ui-sdk/react/toggle"
import { BoldIcon, ItalicIcon } from "lucide-react"

export function Example() {
  return (
    <div data-slot="row">
      <Toggle data-variant="outline">
        <ToggleIcon>
          <ItalicIcon />
        </ToggleIcon>
        Italic
      </Toggle>
      <Toggle data-variant="outline">
        <ToggleIcon>
          <BoldIcon />
        </ToggleIcon>
        Bold
      </Toggle>
    </div>
  )
}
