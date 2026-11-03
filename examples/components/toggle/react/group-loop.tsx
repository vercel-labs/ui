import { Toggle, ToggleGroup, ToggleIcon } from "@ui-sdk/react/toggle"
import { BoldIcon, ItalicIcon, StrikethroughIcon, UnderlineIcon } from "lucide-react"

const formatting = [
  { value: "bold", label: "Bold", icon: BoldIcon },
  { value: "italic", label: "Italic", icon: ItalicIcon },
  { value: "underline", label: "Underline", icon: UnderlineIcon },
  { value: "strikethrough", label: "Strikethrough", icon: StrikethroughIcon },
]

function Example() {
  return (
    <ToggleGroup multiple loop={false} aria-label="Text formatting">
      {formatting.map((item) => (
        <Toggle key={item.value} value={item.value} aria-label={item.label}>
          <ToggleIcon>
            <item.icon />
          </ToggleIcon>
        </Toggle>
      ))}
    </ToggleGroup>
  )
}

export { Example }
