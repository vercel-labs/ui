import { Toggle, ToggleGroup, ToggleIcon } from "@ui-sdk/react/toggle"
import { BoldIcon, ItalicIcon, UnderlineIcon } from "lucide-react"

const formatting = [
  { value: "bold", label: "Bold", icon: BoldIcon },
  { value: "italic", label: "Italic", icon: ItalicIcon },
  { value: "underline", label: "Underline", icon: UnderlineIcon },
]

function Example() {
  return (
    <div data-slot="stack">
      <ToggleGroup multiple disabled defaultValue={["bold"]} aria-label="Text formatting, disabled">
        {formatting.map((item) => (
          <Toggle key={item.value} value={item.value} aria-label={item.label}>
            <ToggleIcon>
              <item.icon />
            </ToggleIcon>
          </Toggle>
        ))}
      </ToggleGroup>
      <ToggleGroup multiple aria-label="Text formatting">
        {formatting.map((item) => (
          <Toggle
            key={item.value}
            value={item.value}
            disabled={item.value === "underline"}
            aria-label={item.label}
          >
            <ToggleIcon>
              <item.icon />
            </ToggleIcon>
          </Toggle>
        ))}
      </ToggleGroup>
    </div>
  )
}

export { Example }
