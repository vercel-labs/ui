import { Toggle, ToggleGroup, ToggleIcon } from "@ui-sdk/react/toggle"
import { BoldIcon, ItalicIcon, UnderlineIcon } from "lucide-react"

const formatting = [
  { value: "bold", label: "Bold", icon: BoldIcon },
  { value: "italic", label: "Italic", icon: ItalicIcon },
  { value: "underline", label: "Underline", icon: UnderlineIcon },
]

export function Example() {
  return (
    <div data-slot="stack">
      <ToggleGroup multiple aria-label="Text formatting, small">
        {formatting.map((item) => (
          <Toggle key={item.value} value={item.value} aria-label={item.label} data-size="sm">
            <ToggleIcon>
              <item.icon />
            </ToggleIcon>
          </Toggle>
        ))}
      </ToggleGroup>
      <ToggleGroup multiple aria-label="Text formatting">
        {formatting.map((item) => (
          <Toggle key={item.value} value={item.value} aria-label={item.label}>
            <ToggleIcon>
              <item.icon />
            </ToggleIcon>
          </Toggle>
        ))}
      </ToggleGroup>
      <ToggleGroup multiple aria-label="Text formatting, large">
        {formatting.map((item) => (
          <Toggle key={item.value} value={item.value} aria-label={item.label} data-size="lg">
            <ToggleIcon>
              <item.icon />
            </ToggleIcon>
          </Toggle>
        ))}
      </ToggleGroup>
    </div>
  )
}
